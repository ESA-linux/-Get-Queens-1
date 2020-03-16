UPM.define('MarketplaceAddonModel',
    [
        'jquery',
        'underscore',
        'AddonModel',
        'InstalledAddonModel',
        'UpmEnvironment',
        'AddonActions'
    ],
    function($,
             _,
             AddonModel,
             InstalledAddonModel,
             UpmEnvironment,
             AddonActions) {

    "use strict";

    /**
     * Subclass of AddonModel that adds properties and behaviors that are only relevant on the
     * Find New Add-ons page and not on the Manage page.
     */
    return AddonModel.extend({

        url: function() {
            return UpmEnvironment.pathToAvailableAddonByKey(this.getKey());
        },
        
        namedAttributes: _.keys(AddonModel.prototype.namedAttributes).concat([
            "categories",
            "cloudFreeUsers",
            "downloadCount",
            "hamsProductKey",
            "installable",
            "installed",
            "installationCount",
            "license",
            "marketplaceType",
            "permissions",
            "preinstalled",
            "rating",
            "ratingCount",
            "remoteInstallable",
            "requests",
            "reviewCount",
            "stable",
            "summary",
            "supportType",
            "versionDetails"
        ]),

        getActionState: function(action) {
            var installable = this.isInstallable(),
                installed = this.isInstalled(),
                pva = this.isPaidViaAtlassian(),
                cloudFreeUsers = this.get('cloudFreeUsers');

            switch (action) {
                case AddonActions.DOWNLOAD:
                    return !installable && (this.hasLink('binary') || this.hasLink('external-binary'));
                case AddonActions.INSTALL:
                    if (installed) {
                        return false;
                    }

                    return installable && this.hasLink('binary') && !this.hasLink('try') && !this.hasLink('new');
                case AddonActions.MANAGE:
                    return installed && this.hasLink('manage');
                case AddonActions.TRY:
                    return pva && (installable || installed) && this.hasLink('try');
                case AddonActions.BUY:
                    return pva && (installable || installed) && this.hasLink('new');
                case AddonActions.UPGRADE:
                    return installed && this.hasLink('upgrade') && !this.hasLink('crossgrade');
                case AddonActions.CROSSGRADE:
                    // We only show the crossgrade button if it's also time to renew and/or upgrade the license.
                    return installed && this.hasLink('crossgrade') &&
                           (this.hasLink('upgrade') || this.hasLink('renew') || this.hasLink('renew-requires-contact'));
                case AddonActions.RENEW:
                    return installed && this.hasLink('renew') && !this.hasLink('crossgrade');
                case AddonActions.RENEW_CONTACT:
                    return installed && this.hasLink('renew-requires-contact') && !this.hasLink('crossgrade');
                case AddonActions.MAKE_REQUEST:
                    return !installed && !installable && this.hasLink('request');
            }
            return false;
        },

        isInstalled: function() {
            return this.getInstalled();
        },

        isPaidViaVendor: function() {
            return this.get('marketplaceType') === "PAID_VIA_VENDOR";
        },

        getCurrentUserRequest: function() {
            return _.find(this.getRequests(), function(r) {
                return r.user && r.user.userKey === UpmEnvironment.getUserKey();
            });
        },

        getDefaultPurchaseAction: function() {
            return this.hasLink('upgrade') ? AddonActions.UPGRADE : AddonActions.BUY;
        },

        getEulaUrl: function() {
            return this.getLinks().eula || (this.getVersionDetails() && this.getVersionDetails().eulaUrl);
        },

        isAtlassianConnect: function() {
            return this.getRemoteInstallable();
        },

        isInstallable: function() {
            return (this.getInstallable() && this.getLinks() && !!this.getLinks().binary) || this.isAtlassianConnect();
        },

        loadInstalledAddonModel: function() {
            return $.ajax({
                url: UpmEnvironment.pathToInstalledAddonByKey(this.getKey()),
                cache: false,
                dataType: 'json'
            }).then(function(resp) {
                var model = new InstalledAddonModel(resp);
                return model._refreshSummary().then(function() {
                    return model;
                });
            });
        },

        toJSON: function() {
            return _.extend({}, AddonModel.prototype.toJSON.apply(this), {
                currentUserRequest: this.getCurrentUserRequest(),
                installable: this.isInstallable(),
                paidViaVendor: this.isPaidViaVendor()
            });
        },

        /**
         * Cancels any existing "I would like this add-on" request for this add-on.
         * @method dismissRequest
         * @return {Promise}  a Promise which is resolved on success or rejected on failure
         */
        dismissRequest: function() {
            var me = this;
            return $.ajax({
                url: this.getLinks()['dismiss-request'],
                type: 'DELETE'
            }).then(function() {
                return me.fetch()
                    .done(function() {
                        me.trigger('dismissedRequest');
                    });
            }).promise();
        },

        /**
         * Submits an "I would like this add-on" request.
         * @method submitRequest
         * @param {String} message  optional message text
         * @return {Promise}  a Promise which is resolved on success or rejected on failure
         */
        submitRequest: function(message) {
            var me = this;
            if (this.getCurrentUserRequest()) {
                this.getCurrentUserRequest().message = message;
            } else {
                var r = this.getRequests() || [];
                r.push({
                    user: {
                        userKey: UpmEnvironment.getUserKey()
                    },
                    message: message
                });
                this.set('requests', r);
            }
            return $.ajax({
                type: 'POST',
                url: UpmEnvironment.getResourceUrl('create-requests'),
                dataType: 'json',
                contentType: UpmEnvironment.getContentType(),
                data: JSON.stringify({ pluginKey: this.getKey(),
                                       pluginName: this.getName(),
                                       message: message,
                                       marketplaceType: this.getMarketplaceType() })
            }).promise()
                .done(function() {
                    me.trigger('request:done', me, true);
                })
                .fail(function() {
                    me.trigger('request:done', me, false);
                });
        },

        /**
         * This overrides the default behavior in ExpandableModelMixin, to add the optional extra query for
         * billing notifications.
         */
        _requestDetails: function() {
            var me = this;
            return this._requestDefaultDetails().then(function(resp) {
                return me.loadOnDemandBillingNotifications(resp).then(function(resp2) {
                    return _.extend(resp, resp2);
                });
            });
        }
    });
});
