UPM.define('UpmCommonUi',
    [
        'jquery',
        'underscore',
        'backbone',
        'BackBreadcrumbTemplate',
        'UpmAjax',
        'UpmAnalytics',
        'UpmBrowserDetection',
        'UpmEnvironment',
        'UpmFormats',
        'UpmMessageFactory',
        'UpmMessageModel',
        'UpmMessageView',
        'UpmXsrfTokenState',
        'UpmStrings',
        'OtherUserPendingTaskTemplate',
        'PendingExternalTaskModel'
    ],
    function($,
             _,
             Backbone,
             backBreadcrumbTemplate,
             UpmAjax,
             UpmAnalytics,
             UpmBrowserDetection,
             UpmEnvironment,
             UpmFormats,
             UpmMessageFactory,
             UpmMessageModel,
             UpmMessageView,
             UpmXsrfTokenState,
             UpmStrings,
             OtherUserPendingTaskTemplate,
             pendingExternalTaskModel) {

    var eventListener = _.extend({}, Backbone.Events);
    var $upmContainer;
    var $messageContainer;
    var readyState = $.Deferred();

    var reloadingCookieName = 'upm.pageReloadPerformed';

    // Set upm.isUpm so the notifications code knows that we are actually on a UPM page.
    window.upm = window.upm || {};
    window.upm.isUpm = true;
    
    /**
     * Manages common UI elements and behaviors that appear on most UPM pages, such as the standard error/info
     * elements that appear near the top of the page, the "another user is performing a task" message, safe
     * mode status, etc.
     */
    var UpmCommonUi = {
        /**
         * Clears any message boxes that are currently in the top-level message area.
         * @method clearMessages
         */
        clearMessages: function() {
            if ($messageContainer) {
                $messageContainer.empty();
            }
        },

        getLocationHash: function() {
            var hash = document.location.hash || '',
                    arr = hash.split('/'),
                    tab = arr[0],
                    key = arr.length > 1 ? arr[1] : '',
                    message = arr.length > 2 ? arr[2] : '';
            if (tab.charAt(0) == '#') {
                tab = tab.substring(1, tab.length);
            }
            return {'tab': tab, 'key': key, 'message': message};
        },

        getPageContainer: function() {
            return $upmContainer;
        },
        
        /**
         * Returns a Promise which is resolved only after all of the user interface state managed by
         * UpmCommonUi has been initialized.
         * @method getReadyState
         * @return {Promise}
         */
        getReadyState: function() {
            return readyState.promise();
        },

        showMessage: function(messageParams) {
            if ($messageContainer) {
                var view = new UpmMessageView({ model: new UpmMessageModel(messageParams) });
                $messageContainer.append(view.render().$el);
                UPM.trace('top-level-message');
            }
        },

        showMessageElement: function($message) {
            if ($messageContainer && !$.contains($messageContainer, $message)) {
                $messageContainer.append($message);
                UPM.trace('top-level-message');
            }
        }
    };

    /**
     * Returns an MPAC URL for the same search as the current page.
     * UPM-2580 move this url construction elsewhere (while still being accessible in offline mode)
     */
    function buildMpacUrl() {
        var amktUrl = $('#upm-mpac-website-url').val(),
            productKey = UpmEnvironment.getApplicationKey(),
            pathname = window.location.pathname,
            primaryFilter = pathname.substr(pathname.lastIndexOf('/')),
            queryParams = window.location.search;

        // Link to AMKT search term page
        if (pathname.match(/search$/)) {
            if (queryParams !== '') {
                amktUrl += '/search' + queryParams + '&application=' + productKey;
            } else {
                //something went wrong, send them to a default search for their product
                amktUrl += '/plugins/app/' + productKey;
            }
        // Link to AMKT filters page
        } else {
            //if the url does not contain a primary filter, use Featured
            if (primaryFilter === '/upm' || primaryFilter === '/marketplace' || primaryFilter === '/requests' || primaryFilter === '/view' || primaryFilter === "/purchases") {
                primaryFilter = '/featured';
            }
            amktUrl += '/plugins/app/' + productKey + primaryFilter + queryParams;
        }

        return amktUrl;
    }

    function checkMpacAvailability() {
        var $checkingMessage = $('#upm-pac-checking-availability'),
            showCheckingMessageTimeout = setTimeout(function() {
                    $checkingMessage.hide().removeClass("hidden").fadeIn(0);
                }, 10000);

        UpmEnvironment.refreshMpacAvailability()
            .done(function() {
                updateForMpacAvailability();
            }).fail(function(request) {
                $("#upm-pac-unavailable").removeClass("hidden");
                UpmAjax.signalAjaxError(request);
            }).always(function() {
                clearTimeout(showCheckingMessageTimeout);
                $checkingMessage.remove();
            });
    }

    function checkProductVersionInfo() {
        UpmEnvironment.refreshProductVersionInfo().
            done(function(versionInfo) {
                if (versionInfo.unknown) {
                    if ($upmContainer) {
                        if (versionInfo.development) {
                            $upmContainer.addClass('plugin-warning-development-version');
                        } else {
                            $upmContainer.addClass('plugin-warning-unknown-version');
                            $('#upm-marketplace-disabled-link').attr('href', buildMpacUrl());
                        }
                    }
                    updateUpdateCheckAvailability();
                }
            });
    }

    function fixHashFragment() {
        var hash = UpmCommonUi.getLocationHash();
        //don't "clean" the hash if we are in the middle of reloading the page for an IE bug workaround
        if (!$.cookie(reloadingCookieName) && (hash.tab || hash.key) && hash.message) {
            var fixedHash = hash.key ? (hash.tab + '/' + hash.key) : hash.tab;
            if (document.location.hash.indexOf('#') != -1) {
                fixedHash = '#' + fixedHash;
            }
            // Don't set location.hash until the page has loaded, or in Firefox the default favicon is displayed instead of UPM's.
            // See UPM-798, UPM-1153, and Mozilla bug 408415.
            // Note that if there was a message code in the hash, we always want to recompute the hash to make it go away.
            document.location.hash = fixedHash;
        }
    }

    function formatErrorMessage(errorInfo, messageParam) {
        var msg, code;

        msg = errorInfo.errorMessage || errorInfo.message || (errorInfo.status && errorInfo.status.errorMessage);
        code = errorInfo.subCode || (errorInfo.status && errorInfo.status.subCode) || (errorInfo.details && errorInfo.details.error.subCode);
        if (code && UpmStrings[code]) {
            return UpmFormats.format(UpmStrings[code], messageParam && UpmFormats.htmlEncode(messageParam));
        } else if (!msg || msg.match(/^[0-9][0-9][0-9]$/)) {
            // if there is no msg or the msg is just an error code, return an "unexpected" error
            return UpmStrings['upm.plugin.error.unexpected.error'];
        } else {
            return msg;
        }
    }

    /**
     * Logs the page source for analytics purposes. This source can be set as a request parameter and represents
     * from where the user was directed to UPM.
     */
    function logPageSource() {
        var source = UpmEnvironment.getUrlParam('source') || 'unknown',
            sourceType = UpmEnvironment.getUrlParam('source-type'),
            url = window.location.pathname,
            urlIndex = url.indexOf('/plugins/servlet/');

        // strip the context path out of the URL such that we can more easily aggregate the source.
        // (and also because we don't need that bit of personal information).
        if (urlIndex > 0) {
            url = url.substr(urlIndex);
        }
        UpmAnalytics.logEvent('page-source', { source: source, url: url, sourceType: sourceType });
    }

    function onAjaxError(errorInfo, messageParam) {
        UpmCommonUi.showMessage({ type: 'error', message: formatErrorMessage(errorInfo, messageParam) });
    }

    function overrideDirtyFormCheck() {
        // UPM-951: JIRA 4.2 runs isDirty() on all forms on page unload, and displays a confirm dialog if the form has changed;
        // override this behavior for elements we designate.  This behavior is already implemented in more recent versions of
        // AUI; here we're just making sure it also works in older versions, using the same CSS class as a marker.  Note that
        // we have to do this on AJS.$, not our own $.
        originalIsDirtyFn = AJS.$.fn.isDirty;
        if (originalIsDirtyFn) {
            AJS.$.fn.isDirty = function() {
                if (AJS.$(this).hasClass('ajs-dirty-warning-exempt')) {
                    return false;
                }
                return originalIsDirtyFn.apply(this, arguments);
            };
        }
    }

    function reloadIfNecessaryForIEBug() {
        var hash = UpmCommonUi.getLocationHash();
        if (UpmBrowserDetection.isIE && hash.message) {
            // Workaround for an IE bug where setting the location hash after a redirect causes an extra page refresh.
            // Solution can be found here: http://stackoverflow.com/a/3286412
            if ($.cookie(reloadingCookieName)) {
                $.removeCookie(reloadingCookieName);
            } else {
                $.cookie(reloadingCookieName, 'true');
                document.location.href = window.location.href;
            }
        }
    }

    function setBreadcrumbLink() {
        var location = UpmEnvironment.getUrlParam('source'),
            $backBreadcrumb = $('.back-breadcrumb');
        if ($backBreadcrumb.length) {
            $backBreadcrumb.append(backBreadcrumbTemplate({ location: location }));
        }
    }

    function updateForBaseUrlInvalid() {
        $('#upm-base-url-invalid').toggleClass('hidden', !UpmEnvironment.isBaseUrlInvalid());
    }

    function updateForMpacAvailability() {
        var mpacDisabled = UpmEnvironment.isMpacDisabled(),
            mpacUnavailable = UpmEnvironment.isMpacUnavailable();

        $('.upm-description').toggleClass('hidden', mpacDisabled || mpacUnavailable);
        $('#upm-pac-disabled').toggleClass('hidden', !mpacDisabled);
        $('#upm-pac-unavailable').toggleClass('hidden', !mpacUnavailable || mpacDisabled);
        if (mpacDisabled) {
            $('#upm-marketplace-disabled-link').attr('href', buildMpacUrl());
            // the markup containing upm-marketplace-disabled-link is in i18n.properties
        }
        updateUpdateCheckAvailability();
    }

    function updateUpdateCheckAvailability() {
        var mpacDisabled = UpmEnvironment.isMpacDisabled(),
            mpacUnavailable = UpmEnvironment.isMpacUnavailable();
        $('#link-bar-update-check').toggleClass('hidden',
            mpacDisabled || mpacUnavailable || !UpmEnvironment.getResourceUrl('product-updates') ||
            (UpmEnvironment.isUnknownProductVersion() && !UpmEnvironment.isDevelopmentProductVersion()));
    }

    /**
     * Based on the model maintained by UpmLongRunningTasks, set or clear the "another user has initiated
     * a pending task" banner, and the corresponding CSS class on the UPM container element which causes
     * other elements to be shown or hidden.
     */
    function updateForOtherUserTaskStatus() {
        var text,
            $message;

        if (pendingExternalTaskModel.getOtherUserTaskDesc()) {
            text = OtherUserPendingTaskTemplate({
                taskDesc: pendingExternalTaskModel.getOtherUserTaskDesc(),
                taskUserKey: pendingExternalTaskModel.getOtherUserTaskUserKey(),
                taskStartTime: pendingExternalTaskModel.getOtherUserTaskStartTime()
            });
            if ($upmContainer) {
                $upmContainer.addClass('upm-pending-tasks');
            }
            $('#upm-pending-tasks').html(
                UpmMessageFactory.newInfoMessage(null, text).render().$el
            );
        } else {
            if ($upmContainer) {
                $upmContainer.removeClass('upm-pending-tasks');
            }
        }
    }

    eventListener.listenTo(UpmAjax.getEventTarget(), 'ajaxError', onAjaxError);
    eventListener.listenTo(UpmEnvironment.getHostStatusModel(), 'change:baseUrlInvalid', updateForBaseUrlInvalid);
    eventListener.listenTo(UpmEnvironment.getHostStatusModel(), 'change:pacDisabled', updateForMpacAvailability);
    eventListener.listenTo(UpmEnvironment.getHostStatusModel(), 'change:pacUnavailable', updateForMpacAvailability);
    eventListener.listenTo(pendingExternalTaskModel, 'change:otherUserTaskDesc', updateForOtherUserTaskStatus);

    UpmEnvironment.getReadyState().then(function() {
        reloadIfNecessaryForIEBug();
        return UpmXsrfTokenState.refreshToken();
    }).done(function() {
        $upmContainer = $('#upm-container');
        $messageContainer = $('#upm-messages');

        setBreadcrumbLink();
        updateForBaseUrlInvalid();
        updateForOtherUserTaskStatus();
        checkMpacAvailability();
        checkProductVersionInfo();
        logPageSource();
        overrideDirtyFormCheck();

        // the "upmready" event is now used only to communicate with admin-notifications.js,
        // therefore it must be triggered on AJS.$ rather than $
        AJS.$(window).trigger('upmready');

        readyState.resolve();

        // only clean up the hash fragment *after* we have resolved readyState, so that any handlers that
        // were listening on it have had an opportunity to look at the hash first.
        fixHashFragment();
    });

    return UpmCommonUi;
});
