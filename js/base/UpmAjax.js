/*
 * Ajax helper functions, including support for JSONP wrapping of Atlassian REST requests
 */
UPM.define('UpmAjax', [
    'jquery',
    'underscore',
    'backbone',
    'UpmEnvironment'
], function ($, _, Backbone, UpmEnvironment) {

    'use strict';

    var ajaxEventTarget = _.extend({}, Backbone.Events);

    var UpmAjax = {};

    /**
     * Wrapper for jquery ajax requests. Passes through successful responses.
     * Catches errors and signals ajax errors on the event target, attempting
     * to normalize error messages
     * @method ajax
     * @param {Object} request  The parameters you'd normally pass to $.ajax
     */
    UpmAjax.ajax = function (request) {
        var deferred = $.Deferred();
        $.ajax(request)
            .then(deferred.resolve)
            .fail(onError(deferred.reject));
        return deferred.promise();
    };

    /**
     * Convenient shorthand ala $.getJSON
     */
    UpmAjax.getJSON = function (url) {
        return UpmAjax.ajax({
            url: url,
            dataType: 'json',
            contentType: 'application/json'
        });
    };

    /**
     * Performs a CORS request if the browser supports CORS; otherwise performs a JSONP request
     * using an Atlassian-specific request/response wrapping format.
     * @method ajaxCorsOrJsonp
     * @param {Object} ajaxParams  The parameters you would normally pass to $.ajax if it were a CORS request.
     */
    UpmAjax.ajaxCorsOrJsonp = function (ajaxParams) {

        var params = _.omit(ajaxParams, 'success', 'error', 'useRawResponse'),
            data;

        if ($.support.cors && (ajaxParams.url.indexOf('/fakemac/') < 0 && ajaxParams.url.indexOf('/fakempac/') < 0)) {
            return $.ajax(params);

        } else {
            data = {
                method: (params.type || 'get').toUpperCase()
            };
            if (params.data) {
                data.body = encodeRequestBody(params.data);
                delete params.data;
            }
            for (var key in params.headers || {}) {
                data['h-' + key] = params.headers[key];
            }
            data['h-Content-Type'] = ajaxParams.contentType || 'application/json';
            params = _.extend(params, {
                type: 'get',
                dataType: 'jsonp',
                data: data
            });
            if (ajaxParams.useRawResponse) {
                return UpmAjax.ajax(params);
            } else {
                params.jsonp = 'jsonp';
                return UpmAjax.ajax(params).then(UpmAjax.transformJsonpResponse);
            }

        }
    };

    UpmAjax.ajaxCorsOrJsonpWithAtlId = function (atlIdToken, ajaxParams) {
        return UpmAjax.ajaxCorsOrJsonp(_.extend({}, ajaxParams,
            {
                headers: _.extend({}, ajaxParams.headers, { 'ATL-XSRF-Token': atlIdToken }),
                xhrFields: _.extend({}, ajaxParams.xhrFields, { withCredentials: true })
            }));
    };

    /**
     * Attempts to make a request through the billing proxy resource, which only exists in OnDemand instances.
     * @method ajaxViaBillingProxy
     * @param {Object} ajaxParams  Same as usual $.ajax parameters
     * @return {Deferred}
     */
    UpmAjax.ajaxViaBillingProxy = function(ajaxParams) {
        var params = _.extend({}, ajaxParams,
                {
                    url: UpmEnvironment.getResourceUrl('billing-proxy'),
                    type: 'GET',
                    cache: false,
                    headers: {
                        'destination-path': ajaxParams.url
                    }
                });
        return $.ajax(params);
    };

    /**
     * Returns the Backbone dispatcher object on which top-level Ajax events occur.
     *
     * @method getEventTarget
     * @return {Backbone.Events}
     */
    UpmAjax.getEventTarget = function() {
        return ajaxEventTarget;
    };

    /**
     * Parses error information from an Ajax response.
     *
     * @method parseErrorResponse
     * @param {XmlHttpRequest} request
     * @return {Object}
     */
    UpmAjax.parseErrorResponse = function(request) {
        var contentType;
        request = request || {};
        contentType = request.getResponseHeader ? request.getResponseHeader('Content-Type') : 'application/json';

        if (/json/.test(contentType)) {
            try {
                var resp = JSON.parse(request.responseText);
                return resp.status || resp;
            } catch (e) {
                AJS.log('Failed to parse response text: ' + e);
            }
        } else if (/xml/.test(contentType)) {
            var xml = $($.parseXML(request.responseText)),
                status = xml.find('status-code').text(),
                message = xml.find('message').text();
            if (status && message) {
                return {
                   statusCode: status,
                   errorMessage: message
                };
            }
        }
        return {
            subCode: (request.statusText === 'timeout' && 'ajaxTimeout') ||
                     (request.statusText === 'error' && 'ajaxCommsError') ||
                     'ajaxServerError'
        };
    };

    /**
     * Triggers an "ajaxError" event on the top-level dispatcher that is available from
     * UpmAjax.getEventTarget().  This is for errors that we want to report in a global
     * context, i.e. at the top of the page (implemented in UpmCommonUi, which listens for these
     * events).  Errors that are associated with some more specific context should be sent
     * elsewhere, such as to AddonModel.signalAjaxError().
     *
     * The event parameters are an error info object as returned by UpmAjax.parseErrorResponse,
     * and the optional messageParam parameter.
     *
     * @method signalAjaxError
     * @param {XmlHttpRequest} request
     * @param {String} messageParam  optional second parameter to pass with the event
     */
    UpmAjax.signalAjaxError = function(request, messageParam) {
        UpmAjax.getEventTarget().trigger('ajaxError', UpmAjax.parseErrorResponse(request), messageParam);
    };

    /**
     * Normalize the mess that is the various ajax error responses, and return a consistent error
     * format
     *
     * @method getAjaxErrorMessage
     * @param xhr. The jquery xhr (optional. if present, will look for error message in the responseText)
     * @param status. The status code (passed through. can be null)
     * @param message. The error message you want to pass to listeners if not including the xhr param
     * @returns object. { message, status }
     */
    UpmAjax.getAjaxErrorMessage = function (xhr, status, message) {
        return !xhr ?
            formatError(message, status) :
            formatError(UpmAjax.parseErrorResponse(xhr), xhr.status);
    };

    /**
     * Receives jquery JSONP response, transforms it, then returns a response that resolves
     * to standard jQuery ajax promise conventions
     *
     * @param data - raw data from jQuery ajax request
     * @param status - status code from the request
     * @param xhr - the XHR object
     * @returns {Promise}
     */
    UpmAjax.transformJsonpResponse = function (data, status, xhr) {
        // expected format of the wrapped JSONP response:
        // [ {status: 200, message: "..."}, { ...the actual response... } ]
        var deferred = $.Deferred();
        if ($.isArray(data) && (data.length == 2)) {
            if (data[0].status == 200) {
                deferred.resolve(data[1], data[0].status, xhr);
            } else {
                xhr.status = data[0].status;
                xhr.statusText = data[0].message;
                deferred.reject(xhr, data[0].status, data[0].message);
            }
        } else {
            deferred.reject(xhr, 503, 'Invalid JSONP response');
        }
        return deferred.promise();
    };

    /**
     * Polls the state of a long-running task until it says it's done.
     * @param {Object} taskResponse  The initial response describing the asynchronous task
     * @param {Function} progressUpdateCallback  A callback to fire with each updated progress value
     * @returns {Promise} that resolves to the 'done' JSON response
     */
    UpmAjax.pollTaskResource = function (taskResponse, progressUpdateCallback) {
        var deferred = $.Deferred(),
            taskUrl = taskResponse.links.alternate,
            delay = taskResponse.pollDelay || taskResponse.pingAfter;

        var makeRequest = function () {
            UpmAjax.getJSON(taskUrl).then(
                function (data) {
                    if (data.error) {
                        return onError(deferred.reject)(null, data.error.code, data.error.message);
                    } else if (!data.done) {
                        if (progressUpdateCallback && _.isFunction(progressUpdateCallback) && data.progress) {
                            progressUpdateCallback(data.progress);
                        }
                        tryAgain(data.pollDelay);

                    } else {
                        if (data.links.result) {
                            UpmAjax.getJSON(data.links.result)
                                .then(deferred.resolve)
                                .fail(deferred.reject);
                        } else {
                            deferred.resolve(data);
                        }
                    }
                }
            ).fail(
                deferred.reject
            );
        };

        var tryAgain = function (timeout) {
            setTimeout(function () {
                makeRequest();
            }, timeout);
        };

        if (delay) {
            tryAgain(delay);
        } else {
            makeRequest();
        }

        return deferred.promise();
    };

    /**
     * Promise rejection callback wrapper. Returns a function that formats
     * error messages as best it can, and signals ajax errors on the eventTarget
     * before firing the passed in promise rejection callback
     * @param reject. The promise rejection callback
     * @returns {Function}
     */
    function onError (reject) {
        return function (xhr, status, message) {
            var error = !xhr ?
                formatError(message, status) :
                formatError(UpmAjax.parseErrorResponse(xhr), xhr.status);
            reject(xhr, error.status, error.message);
        };
    }

    /**
     * Attempt to abstract out the different error response shapes into a consistent format
     */
    function formatError(error, status) {
        var errorResponse = {
            message: 'An unexpected error occurred. Refer to the logs for more information.',
            status: status
        };

        // Check for known UpmAjax formatted responses
        if (_.isObject(error)) {

            if (error.subCode) {
                errorResponse.status = error.subCode;

            } else if (error.errorMessage && error.statusCode) {
                errorResponse.message = error.errorMessage;
                errorResponse.status = error.statusCode;

            } else {
                var filterUndefined = function(msg) { return !!msg; };
                var firstResponse = _.first(_.filter(_.union(
                                                error.errorMessages,
                                                error.warningMessages,
                                                (error.validation && (error.validation.errorMessages || error.validation.warningMessages))), filterUndefined));
                if (firstResponse) {
                    errorResponse.message = firstResponse;
                }
            }

        // If error is a string, pass it through
        } else if (_.isString(error)) {
            errorResponse.message = error;
        }

        // double check status code for websudo errors that may not have been caught,
        // and reload the page if that is the case
        switch (errorResponse.status) {
            case 401:
            case '401':
            case 'upm.websudo.error':
            case 'upm.applications.websudo.error':
                errorResponse.message = 'This resource requires additional authentication. Try refreshing to access the login page.';
                errorResponse.status = 401;
                window.location.reload();
                break;
        }

        return errorResponse;
    }

    function encode_utf8(s) {
        return unescape(encodeURIComponent(s));
    }

    function decode_utf8(s) {
        return decodeURIComponent(escape(s));
    }

    function encodeRequestBody(obj) {
        var charmap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        var str = encode_utf8($.isPlainObject(obj) ? JSON.stringify(obj) : obj) + "  ";
        var result = [];
        for (var i = 0; i+2 < str.length; i += 3) {
            var threech = 0;
            for (var j = 0; j < 3; ++j) {
                threech = (threech << 8) + str.charCodeAt(i+j);
            }

            // threech is 24bits long, encode this as 4 chars, each with 6 bits
            for (var j = 3; j >= 0; --j) {
                var chpart = (threech >> (6*j)) & 0x3f;
                result.push(charmap.charAt(chpart));
            }
        }
        return result.join('');
    }

    return UpmAjax;
});