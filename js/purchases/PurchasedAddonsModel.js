UPM.define('PurchasedAddonsModel', [
    'jquery',
    'underscore',
    'brace',
    'UpmEnvironment',
    'UpmHostStatusMixin',
    'UpmContextPathMixin',
    'PurchasedAddonsCollection'
],
    function($,
             _,
             Brace,
             UpmEnvironment,
             UpmHostStatusMixin,
             UpmContextPathMixin,
             PurchasedAddonsCollection) {

        "use strict";
       
        return Brace.Model.extend({

            namedAttributes: ["purchasedAddons", "incompatibleAddons", "unknownAddons"],

            mixins: [UpmHostStatusMixin, UpmContextPathMixin],

            url: function() {
                return this.getContextPath() + "/rest/plugins/1.0/purchased/available";
            },

            initialize: function() {
                this._bindHostStatus();
                this.on("sync", this._onSync);
            },

            parse: function(response) {
                return {
                    purchasedAddons: new PurchasedAddonsCollection(response.plugins),
                    incompatibleAddons: new PurchasedAddonsCollection(response.incompatiblePlugins),
                    unknownAddons: new PurchasedAddonsCollection(response.unknownPlugins)
                };
            },

            reloadPlugins: function() {
                this.fetch();
            },

            _onSync: function() {
                UPM.trace("purchased-addons-loaded");
            },

            /**
             * Performs a request with the provided username and password to obtain a list of purchased addons.
             *
             * @param username
             * @param password
             * @return {Promise}  a Promise which will be resolved on success (with the list of newly licensed
             *   add-on keys; the parent model will have already been refreshed) or rejected on failure (with
             *   the error message)
             */
            updateLicenses: function(username, password) {
                return this._handleLicenseUpdateResult(
                    $.ajax({
                        url: UpmEnvironment.getResourceUrl('update-licenses'),
                        type: 'post',
                        contentType: UpmEnvironment.getContentType(),
                        dataType: 'json',
                        data: JSON.stringify({
                            username: username,
                            password: password
                        })
                    })
                );
            },

            /**
             * Performs a request which will use a JWT token to authenticate with Hamlet (proxied through MPAC).
             *
             * @return {Promise}  a Promise which will be resolved on success (with the list of newly licensed
             *   add-on keys; the parent model will have already been refreshed) or rejected on failure (with
             *   the error message)
             */
            updateLicensesJwt: function() {
                return this._handleLicenseUpdateResult(
                    $.ajax({
                        url: UpmEnvironment.getResourceUrl('update-licenses-signed'),
                        type: 'get',
                        contentType: UpmEnvironment.getContentType(),
                        dataType: 'json'
                    })
                );
            },

            /**
             * Updates the model after receiving the result of an update request.
             * @method _handleLicenseUpdateResult
             * @private
             */
            _handleLicenseUpdateResult: function(ajaxResult) {
                var deferred = $.Deferred(),
                    me = this;
                ajaxResult.done(function(response) {
                    if (response.error) {
                        deferred.reject();
                    } else {
                        me.fetch().done(function() {
                            me.getPurchasedAddons().each(function(addon) {
                                if (_.contains(response.updatedLicensePluginKeys, addon.getKey())) {
                                    addon.trigger('newly-licensed');
                                }
                            });
                            deferred.resolve(response.updatedLicensePluginKeys);
                        });
                    }
                }).fail(function(response) {
                    deferred.reject();
                });
                return deferred.promise();
            }
        });
    });
