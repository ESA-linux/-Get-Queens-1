UPM.define('UpmInstaller',
    [
        'jquery',
        'underscore',
        'UploadDialog',
        'UpmAjax',
        'UpmEnvironment',
        'UpmXsrfTokenState',
        'UpmAnalytics'
    ], function($,
                _,
                UploadDialog,
                UpmAjax,
                UpmEnvironment,
                UpmXsrfTokenState,
                UpmAnalytics) {

    "use strict";

    var formContainerId = 'upm-upload-form-hidden-container',
        targetFrameId = 'upm-upload-target';

    /**
     * Abstraction of the UI for selecting an add-on or application to install, and making the appropriate
     * request to the back-end UPM resource for doing so.  Both UPM and Manage Applications can simply call
     * openInstallDialog (passing a callback to handle the little bit of UI logic that is currently not shared
     * between them) and then implement their own polling for the final result.
     * @singleton
     */
    var UpmInstaller = {
        
        /**
         * Submits an install request with a file upload.  There must already be a DOM form element
         * containing a file chooser field; the form URL and target will be adjusted as necessary.
         * @method installFromFile
         * @param {JQuery} $form
         * @param {String} fileName  the short filename for display purposes (not used for the actual upload)
         * @param {Function} startProgressCallback  optional function which will be called immediately
         *  prior to making the request, receiving the filename as an argument; if it returns true, the request
         *  will be aborted
         * @return {Promise} a Promise which will be resolved with the response from the install resource if
         *  successful (the caller must then poll to get the progress of installation) or rejected if the resource
         *  returns an error
         */
        installFromFile: function($form, fileName, startProgressCallback) {
            var $targetFrame = getHiddenTargetFrame();

            $form.attr('method', 'post')
                 .attr('target', targetFrameId)
                 .attr('enctype', 'multipart/form-data');

            function fakeJSONErrorResponse (text) {
                return {
                    responseText: text,
                    getResponseHeader: function (header) {
                        if (header === 'Content-Type') {
                            return 'application/json';
                        }
                        return '';
                    }
                };
            }

            function fakeAjaxRequestUsingFormPostToIframe(token) {
                var deferred = $.Deferred(),
                    uploadUrl = UpmEnvironment.getResourceUrl('install-file') + '?token=' + token;
                $form.attr('action', uploadUrl);
                $targetFrame.unbind('load.upload').bind('load.upload', function() {
                    try {
                        var responseText = $targetFrame.contents().text(),
                            response = JSON.parse(responseText);

                        if (response.links && response.links.self) {
                            deferred.resolve(response);
                        } else {
                            // note that tryWithToken expects to see an HTTP request as an error parameter, but we're not
                            // actually doing Ajax so we don't have one; we'll provide something that looks close enough
                            deferred.reject(fakeJSONErrorResponse(responseText));
                        }
                    } catch (e) {
                        deferred.reject(fakeJSONErrorResponse(e.message));
                    }
                });
                $form.submit();
                return deferred;
            }

            // The 'install' param here is passed through into the callback after the install succeeds
            // It is used by upm.js to send the proper messaging into the LongRunningTask dialog
            return executeInstall(fakeAjaxRequestUsingFormPostToIframe, fileName, startProgressCallback, 'upload');
        },

        /**
         * Submits an install request with an artifact URL.
         * @method installFromUrl
         * @param {String} url
         * @param {Function} startProgressCallback  optional function which will be called immediately
         *  prior to making the request, receiving the URL as an argument; if it returns true, the request
         *  will be aborted
         * @return {Promise} a Promise which will be resolved with the response from the install resource if
         *  successful (the caller must then poll to get the progress of installation) or rejected if the resource
         *  returns an error
         */
        installFromUrl: function(url, startProgressCallback) {
            var contentType,
                resourceUrl;

            contentType = UpmEnvironment.getContentType('install');
            resourceUrl = UpmEnvironment.getResourceUrl('install-uri');

            function sendRequest(token) {
                return $.ajax({
                    type: 'POST',
                    url: resourceUrl + '?token=' + token,
                    dataType: 'json',
                    contentType: contentType,
                    data: JSON.stringify({ "pluginUri": url })
                });
            }

            // The 'install' param here is passed through into the callback after the install succeeds
            // It is used by upm.js to send the proper messaging into the LongRunningTask dialog
            return executeInstall(sendRequest, url, startProgressCallback, 'install').then(function (response) {
                return $.Deferred().resolve(response).promise();
            });
        },

        /**
         * Opens the dialog for choosing a file or URL to install from.  If the user submits the form, it
         * initiates installation by calling either installFromFile or installFromUrl.
         * @method openInstallDialog
         * @param {Function} startProgressCallback  optional function which will be called immediately
         *  prior to making the request, receiving the filename or URL as an argument; if it returns true, the
         *  request will be aborted
         *  @param {Object} dialogOptions  object containing params for the dialog, such as headerHtml and
         *  uploadInstructionsHtml which will control the text on the upload dialog
         * @return {Promise} a Promise which will be resolved if successful, with the response from the install
         *  resource as the first parameter and the InstallParams as the second parameter (the caller must then
         *  poll to get the progress of installation); rejected if the resource returns an error; or simply
         *  discarded if the user cancels the dialog
         */
        openInstallDialog: function(startProgressCallback, dialogOptions) {
            var deferredResult = $.Deferred(),
                deferredSource,
                options = _.extend({ uploadApplication: false }, dialogOptions);

            createHiddenElements();

            var dialog = new UploadDialog({
                formContainer: getHiddenFormContainer(),
                data: options
            });
            dialog.getResult()
                .done(function(params) {
                    if (params.getUrl()) {
                        removeHiddenElements();
                        deferredSource = UpmInstaller.installFromUrl(params.getUrl(), startProgressCallback);
                        if (options.uploadApplication) {
                            UpmAnalytics.logEvent('manageapps-upload-dialog-confirm', { method: 'url' });
                        }
                    } else {
                        deferredSource = UpmInstaller.installFromFile(getHiddenFormContainer().find('form'),
                            params.getFileName(), startProgressCallback);
                        if (options.uploadApplication) {
                            UpmAnalytics.logEvent('manageapps-upload-dialog-confirm', { method: 'file' });
                        }
                    }
                    deferredSource.then(function(response) {
                        deferredResult.resolve(response, params);
                    }).fail(
                        _.bind(deferredResult.reject, deferredResult)
                    );
                })
                .fail(function () {
                    if (options.uploadApplication) {
                        UpmAnalytics.logEvent('manageapps-upload-dialog-cancel');
                    }
                    removeHiddenElements();
                });

            return deferredResult.promise();
        }
    };

    function createHiddenElements() {
        removeHiddenElements();
        $('body').append(
            $('<div></div>').attr('id', formContainerId).css('display', 'none')
        ).append(
            $('<iframe>').attr('src', 'javascript:false').attr('name', targetFrameId).attr('id', targetFrameId).css('display', 'none')
        );
    }

    function getHiddenFormContainer() {
        return $('#' + formContainerId);
    }

    function getHiddenTargetFrame() {
        return $('#' + targetFrameId);
    }

    function removeHiddenElements() {
        getHiddenFormContainer().remove();
        getHiddenTargetFrame().remove();
    }

    function executeInstall(requestCallback, displayName, startProgressCallback, installType) {
        if (startProgressCallback && startProgressCallback(displayName, installType)) {
            return $.Deferred();  // this will be neither resolved nor rejected since no request was made
        } else {
            return UpmXsrfTokenState.tryWithToken(requestCallback)
                .fail(function(request) {
                    return $.Deferred().reject(request).promise();
                });
        }
    }

    return UpmInstaller;
});
