/*
 * Support for Hamlet public API
 */
UPM.define('UpmHamlet', [
    'UpmAjax',
    'UpmEnvironment'
], function (UpmAjax, UpmEnvironment) {

    'use strict';

    return {

        /**
         * Attempts to create an evaluation license by a direct CORS request to the Hamlet API.
         * @method createEvaluationLicenseDirectly
         * @param {String} pluginKey  The plugin key
         * @param {String} idToken  Atlassian ID token
         */
        createEvaluationLicenseDirectly: function (pluginKey, idToken) {

            var url = UpmEnvironment.getResourceUrl('create-eval-license'),
                data = { productKey: pluginKey };

            if (!url) {
                // if you don't have permission to use the API, you shouldn't have been able to get here
                return;
            }

            if (UpmEnvironment.getServerId()) {
                data.serverId = UpmEnvironment.getServerId();
            }

            return UpmAjax.ajaxCorsOrJsonp({
                url: url,
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                headers: {
                    'ATL-XSRF-Token': idToken
                },
                timeout: 15000,
                xhrFields: {
                    withCredentials: true
                }
            });
        }
    };
});
