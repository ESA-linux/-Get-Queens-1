UPM.define('UpmAtlassianId', [
    'jquery',
    'underscore',
    'brace',
    'UpmAjax',
    'UpmDialog',
    'UpmEnvironment',
    'UpmAnalytics',
    'AtlassianIdLoginDialogTemplate'
], function ($,
             _,
             Brace,
             UpmAjax,
             UpmDialog,
             UpmEnvironment,
             UpmAnalytics,
             AtlassianIdLoginDialogTemplate) {


    'use strict';


    /*
     * Dependencies:
     * AJS.params.upmCurrentUsername
     */

    var UpmAtlassianId = {};

    var LoginDialog = UpmDialog.extend({

        template: AtlassianIdLoginDialogTemplate,

        events: {
            'submit #upm-atlassian-id-form': '_submitCredentials',
            'keydown #upm-atlassian-id-username': '_clearUsernameError',
            'input #upm-atlassian-id-username': '_clearUsernameError',
            'keydown #upm-atlassian-id-password': '_clearPasswordError',
            'input #upm-atlassian-id-password': '_clearPasswordError'
        },

        _postRender: function () {
            this.$throbber = $('<div class="loading"></div>');
            this.$username = this.$el.find('.username-group');
            this.$password = this.$el.find('.password-group');
            this.$usernameInput = this.$el.find('#upm-atlassian-id-username');
            this.$passwordInput = this.$el.find('#upm-atlassian-id-password');
            this.$submit = this.getConfirmButton();
            this.$errorField = this.$el.find('.request-error');
            this.DEFAULT_ERROR = this.$el.find('.default-error').html();
        },

        _postShow: function () {
            if (this.options.data.applicationFormat) {
                UpmAnalytics.logEvent('manageapps-aid-show');
            }
        },

        _clearUsernameError: function () {
            if ($.trim(this.$usernameInput.val()).length > 0) {
                this.$username.removeClass('empty');
                this.$errorField.hide();
            }
        },

        _clearPasswordError: function () {
            if ($.trim(this.$passwordInput.val()).length > 0) {
                this.$password.removeClass('empty');
                this.$errorField.hide();
            }
        },

        _isValidInput: function (username, password) {
            if (!(username && password)) {
                this.$username.toggleClass('empty', !username);
                this.$password.toggleClass('empty', !password);
                return false;
            }
            this._clearUsernameError();
            this._clearPasswordError();
            return true;
        },

        _submitCredentials: function (e) {
            e && e.preventDefault && e.preventDefault();

            var username = $.trim(this.$usernameInput.val()),
                password = $.trim(this.$passwordInput.val());

            if (!this._isValidInput(username, password)) {
                return;
            }

            this.$submit.prop('disabled', true);
            this.getButtonPanel().prepend(this.$throbber);

            UpmAjax.ajaxCorsOrJsonp({
                url: UpmEnvironment.getResourceUrl('atlassian-id-login'),
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: username,
                    password: password
                }),
                dataType: 'json',
                timeout: 10000,
                xhrFields: {
                    withCredentials: true
                }
            }).then(
                _.bind(function (data, status) {
                    var newToken = data.xsrfToken;
                    UpmAtlassianId.setAtlassianIdToken(newToken);
                    this.close();
                    this.deferredResult.resolve({username: username, password: password, token: newToken});
                    if (this.options.data.applicationFormat) {
                        UpmAnalytics.logEvent('manageapps-aid-success');
                    }
                }, this),
                _.bind(function (xhr) {
                    UpmAtlassianId.clearAtlassianIdToken();
                    if (xhr.status == 403) {
                        this.$throbber.remove();
                        this.$submit.removeAttr('disabled');
                        this.$errorField.html(this.DEFAULT_ERROR).show();
                    } else {
                        this.close();
                        this.deferredResult.resolve({username: username, password: password});
                    }
                    if (this.options.data.applicationFormat) {
                        UpmAnalytics.logEvent('manageapps-aid-failure');
                    }
                }, this)
            );
        },

        _onConfirm: function () {
            this._submitCredentials();
            if (this.options.data.applicationFormat) {
                UpmAnalytics.logEvent('manageapps-aid-submit');
            }
        },

        _onCancel: function () {
            this.close();
            this.deferredResult.reject();
            if (this.options.data.applicationFormat) {
                UpmAnalytics.logEvent('manageapps-aid-cancel');
            }
        }
    });

    /**
     * Function that returns a promise that resolves to Atlassian ID token.
     * Opens a dialog to prompt the user to login if one does not exist already
     */
    UpmAtlassianId.getOrCreateAtlassianIdToken = function (options) {
        var deferred = $.Deferred();
        if (UpmAtlassianId.getAtlassianIdToken()) {
            deferred.resolve(UpmAtlassianId.getAtlassianIdToken());
        } else {
            UpmAtlassianId.openAtlassianIdLogin(options).then(
                function () {
                    if (UpmAtlassianId.getAtlassianIdToken()) {
                        deferred.resolve(UpmAtlassianId.getAtlassianIdToken());
                    } else {
                        deferred.reject('Failed to get Atlassian ID token');
                    }
                },
                deferred.reject
            );
        }

        return deferred.promise();
    };

    /**
     * Returns the current Atlassian ID token, if any.
     */
    UpmAtlassianId.getAtlassianIdToken = function () {
        // if clearAtlassianIdToken has been called very recently, then the removal of the cookie may not
        // yet have taken effect, so we need to support overriding the cookie with newIdToken = null
        if (UpmAtlassianId.newIdToken === undefined) {
            var cookie = $.cookie('upm.atl.id');
            if (cookie) {
                // make sure a different user hasn't logged in since the cookie was acquired
                var parts = cookie.split('|', 2);
                if (UpmEnvironment.getCurrentUserName() != parts[0]) {
                    UpmAtlassianId.clearAtlassianIdToken();
                    return null;
                }
                return parts[1];
            }
        }
        return UpmAtlassianId.newIdToken;
    };

    /**
     * Clears the current Atlassian ID token, if any.
     * @method clearAtlassianIdToken
     */
    UpmAtlassianId.clearAtlassianIdToken = function () {
        UpmAtlassianId.newIdToken = null;
        $.removeCookie('upm.atl.id');
    };

    /**
     * Stores an Atlassian ID token as a cookie.  Also remembers the current username, so that we won't
     * try to use this cookie if a different user has logged in.
     * Note that the cookie is always a session cookie; although there is a "Remember Me" option for
     * setting a persistent cookie in the regular Atlassian ID flow where the user is redirected to a
     * login page, we can't implement such an option here because when we log in via a REST request,
     * the corresponding cookie on the Atlassian ID domain is always going to be a session cookie, so
     * even if UPM's cookie were persistent it would stop working when the other one expired (UPM-4940).
     * @method setAtlassianIdToken
     * @param {String} token  The XSRF token returned by Lasso
     */
    UpmAtlassianId.setAtlassianIdToken = function (token) {
        $.cookie('upm.atl.id', UpmEnvironment.getCurrentUserName() + '|' + token, {path: '/'});
        UpmAtlassianId.newIdToken = token;  // in case we need to check the token again before the cookie has become available
    };

    /**
     * Shows an Atlassian ID login dialog and attempts to validate the login with a CORS request to the
     * Atlassian ID API.  If the API returns a normal validation error, we keep the dialog open, display
     * an error message, and continue to prompt the user.  If the API returns a successful validation, we
     * close the dialog and resolve the returned Promise with an object whose properties are "username",
     * "password", and "token" (the token is also cached in the cookie "upm.atl.id" and will be returned
     * by subsequent calls to UpmAtlassianId.getAtlassianIdToken).  If the API is unavailable/broken, we
     * close the dialog and resolve the Promise with only "username" and "password" properties.  If the
     * user clicks Cancel, we reject the returned Promise.
     * @method showAtlassianIdDialog
     * @param {Object} options  May contain the following properties:<ul>
     *   <li> 'applicationFormat': Uses an alternate version of the AID dialog that shows a product name (used in manageapps)
     *   <li> 'applicationName': The product name if productFormat is true
     *   <li> 'accessTokenFormat': Uses an alternate version of the AID dialog prompting for creds to get an access token
     *   <li> 'activateFormat': Uses an alternate version of the AID dialog prompting for credentials to activate a purchase
     *   <li> 'initialError': (optional) Pre-existing error message to display when the dialog appears.
     * </ul>
     * @return {Promise}  a Promise that is resolved or rejected on completion, as described above
     */
    UpmAtlassianId.openAtlassianIdLogin = function (options) {
        var data = _.extend({
                applicationName: '',
                applicationFormat: false,
                accessTokenFormat: false,
                activateFormat: false,
                initialError: ''
            }, options),
            dialog = new LoginDialog({data: data});
        UPM.trace("atlassian-id-dialog");
        return dialog.getResult();
    };

    /**
     * Executes some asynchronous operation via a callback, after obtaining an Atlassian ID login state (i.e.
     * using the current login cookie if we have one, or else opening the login dialog and waiting until we have
     * valid credentials).  The callback may signal that the previous token was invalid, in which case it will
     * attempt login again, etc.
     * @method tryWithAtlassianIdToken
     * @param {Function} callback  a function that takes an Atlassian ID token and returns a Promise.  If the
     *   token parameter is null/undefined, it means the Atlassian ID API was unavailable.  The returned Promise
     *   may be resolved with some value if successful, or rejected with an error; either of these results will
     *   be returned to the original caller.  You can instead resolve the Promise wihout any value, which means
     *   that the Atlassian ID token turned out to be invalid or stale; in that case, tryWithAtlassianIdToken
     *   will solicit a new login and start over.  Or, if none of the above are appropriate (e.g. you are going
     *   to redirect to another page), return $.Deferred.promise() so it will neither be resolved nor rejected.
     * @return {Promise}  see above
     */
    UpmAtlassianId.tryWithAtlassianIdToken = function (callback, options) {
        var startFromLogin = function () {
            return UpmAtlassianId.openAtlassianIdLogin(options)
                .then(function (result) {
                        return tryWithToken(result && result.token);
                    }
                );
        };
        var tryWithToken = function (token) {
            return callback(token)
                .then(function (result) {
                    if (result === undefined) {
                        UpmAtlassianId.clearAtlassianIdToken();
                        return startFromLogin();
                    } else {
                        return result;
                    }
                });
        };
        if (UpmAtlassianId.getAtlassianIdToken()) {
            return tryWithToken(UpmAtlassianId.getAtlassianIdToken());
        } else {
            return startFromLogin();
        }
    };

    return UpmAtlassianId;
});
