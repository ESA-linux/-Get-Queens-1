UPM.define('UpmXsrfTokenState',
    [
        'jquery',
        'UpmAjax',
        'UpmEnvironment'
    ],
    function($,
             UpmAjax,
             environment) {

    var currentToken,
        forceTokensToFail;

    /**
     * Manages the state of the XSRF install token.
     */
    var UpmXsrfTokenState = {
        /**
         * Returns the last XSRF token we received from the back end.
         */
        getCurrentToken: function() {
            if (forceTokensToFail) {
                return "badtoken-" + Math.random();
            }
            return currentToken;
        },

        /**
         * Gets a new anti-xsrf token from the server and stores it for use in uploading plugins.
         * @method refreshToken
         * @return {Promise}  a Promise which will be resolved once the token has been retrieved
         */
        refreshToken: function() {
            var deferred = $.Deferred();
            $.ajax({
                url: environment.getResourceUrl('token'),
                type: 'head',
                cache: false,
                success: function(data, status, request) {
                    var token = request.getResponseHeader('upm-token');
                    currentToken = token;
                    deferred.resolve(token);
                },
                error: function(request) {
                    if (request.status === 403) {
                        // the user isn't an admin, so they can't have a token
                        deferred.resolve();
                    } else {
                        UpmAjax.signalAjaxError(request);
                        deferred.reject();
                    }
                }
            });
            return deferred.promise();
        },

        /**
         * Sets or clears a testing mode in which getCurrentToken will always return invalid tokens.
         * @method setForceTokensToFail
         * @param {Boolean} flag  true if tokens should always be invalid, false for normal operation
         */
        setForceTokensToFail: function(flag) {
            forceTokensToFail = flag;
        },

        /**
         * Forces getCurrentToken to return a specific value until the next token refresh, for testing.
         * @method setToken
         * @param {String} token  the new token string
         */
        setToken: function(token) {
            currentToken = token;
        },

        /**
         * Passes the current XSRF token function to the given callback, which should return a Promise
         * for an Ajax request.  If the Promise fails, and if the error indicates that it was due to an
         * expired token, it will obtain a new token and retry the request exactly once.  If the Promise
         * succeeds, it will also get a new token before returning.
         *
         * @method tryWithToken
         * @param {Function} ajaxCallback  a function that takes the current token as a parameter and
         *   returns a Promise
         * @return {Promise}  a Promise that will copy the final success or failure state of hte
         *   underlying request
         */
        tryWithToken: function(ajaxCallback) {
            var deferred = $.Deferred();
            ajaxCallback(UpmXsrfTokenState.getCurrentToken())
                .done(function(resp, status, request) {
                    UpmXsrfTokenState.refreshToken();
                    deferred.resolve(resp, status, request);
                })
                .fail(
                    function(request, status, err) {
                        if (requestFailedDueToExpiredToken(request)) {
                            UpmXsrfTokenState.refreshToken().
                                done(
                                    function() {    // retry request with new token
                                        ajaxCallback(UpmXsrfTokenState.getCurrentToken()).done(deferred.resolve).fail(deferred.reject);
                                    }
                                ).
                                fail(deferred.reject);  // couldn't get new token
                        } else {
                            deferred.reject(request, status, err);
                        }
                    }
                );
            return deferred.promise();
        }
    };

    function requestFailedDueToExpiredToken(request) {
        try {
            var resp = JSON.parse(request.responseText);
            return resp && resp.subCode == 'upm.error.invalid.token';
        } catch(e) {
            return false;
        }
    }

    return UpmXsrfTokenState;
});
