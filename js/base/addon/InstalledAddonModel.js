UPM.define('InstalledAddonModel',
    [
        'jquery',
        'underscore',
        'AddonActions',
        'AddonModel',
        'UpmEnvironment',
        'UpmLicenseInfo'
    ],
    function($,
             _,
             AddonActions,
             AddonModel,
             UpmEnvironment,
             UpmLicenseInfo) {

    "use strict";

    /**
     * Subclass of AddonModel that adds properties and accessors for the installed add-on
     * representation.  This is further extended by ManageAddonModel to add behaviors that are
     * relevant only on the Manage page; however, this class can also be used on the Marketplace
     * page to get properties of an add-on that has just been installed.
     */
    return AddonModel.extend({

        namedAttributes: _.keys(AddonModel.prototype.namedAttributes).concat([
            'applicationKey',
            'applicationPluginType',
            'enabled',
            'enabledByDefault',
            'incompatible',
            'licenseReadOnly',
            'modules',
            'optional',
            'pacResponse',
            'primaryAction',
            'remotable',
            'static',
            'unloadable',
            'unrecognisedModuleTypes',
            'updatableToPaid',
            'update',
            'updateAvailable',
            'userInstalled'
        ]),

        url: function() {
            return UpmEnvironment.pathToInstalledAddonByKey(this.getKey());
        },

        canSendVendorFeedback: function() {
            return this.hasLink('vendor-feedback');
        },

        getEulaUrl: function() {
            return this.getLinks().eula ||
                (this.getVersionDetails() && this.getVersionDetails().eulaUrl);
        },

        getLinkOrPacResponseLink: function(rel) {
            return (this.getPacResponse() && this.getPacResponse().links && this.getPacResponse().links[rel]) ||
                this.getLinks()[rel];
        },

        getPricing: function() {
            return this.getVersionDetails() && this.getVersionDetails().pricing;
        },

        getVersionDetails: function() {
            return this.getPacResponse() && this.getPacResponse().versionDetails;
        },

        getAvailableUpdate: function() {
            return (this.getPacResponse() && this.getPacResponse().update) || this.getUpdate();
        },

        hasRoleBasedPricing: function() {
            return UpmLicenseInfo.isRoleBasedLicense(this.getLicenseDetails()) ||
                (this.pricingModel && this.pricingModel.isRoleBased());
        },

        isActionRequired: function() {
            return this.getPrimaryAction() && this.getPrimaryAction().actionRequired;
        },

        isApplicationPlugin: function() {
            return !!this.getApplicationPluginType();
        },
        
        isAtlassianConnect: function() {
            return this.getRemotable();
        },

        isInstalled: function() {
            return true;
        },

        isUnsubscribed: function() {
            var license = this.getLicenseDetails();
            return license && license.subscription &&
                (license.valid || (!license.active && !license.evaluation)) &&
                !license.autoRenewal;
        },

        isUpdatable: function() {
            return this.hasLink('update-details') && (this.hasLink('binary') || this.hasLink('update-descriptor'));
        },

        retrieveLicense: function() {
            var me = this;
            return $.ajax({
                    type: 'POST',
                    url: this.getLinks()['check-license'],
                    contentType: UpmEnvironment.getContentType()
                })
                .then(function(response) {
                    UpmEnvironment.refreshNotifications();
                    // refresh the add-on's state since the license has changed, but return the original response
                    return me.refresh().then(function() {
                        return response;
                    });
                }).promise();
        },

        _refreshSummary: function() {
            var me = this;
            return this._requestSummary().done(function(data) {
                me.set(data);
            });
        },

        /**
         * This overrides the default behavior in ExpandableModelMixin, to do two additional queries because
         * the installed plugin details actually come from THREE places:  1. the installed plugin resource
         * (whose self URL we already have, so _requestDefaultDetails gets this); 2. the installed plugin
         * Marketplace resource, which provides licensing-related information; 3. if available, the Marketplace
         * ("PAC") details resource which provides information from Marketplace itself.  The only reason #1 and
         * #2 are separate is that at one point we were planning to implement them in two different plugins.
         * Fortunately, using Promises makes it pretty easy to chain these into one big async operation.
         * (There is also an optional 4th request, for billing notifications)
         */
        _requestDetails: function() {
            var me = this;
            return this._requestSummary().then(function(merged) {
                if (merged.links['pac-details']) {
                    return $.ajax({
                        type: 'get',
                        cache: false,
                        url: merged.links['pac-details'],
                        dataType: 'json'
                    }).then(function(pacDetailsData) {
                        return _.extend(merged, { pacResponse: pacDetailsData });
                    }).then(function(resp) {
                        return me.loadOnDemandBillingNotifications(resp).then(function(resp2) {
                            return _.extend(resp, resp2);
                        });
                    });
                } else {
                    return merged;
                }
            });
        },

        _requestSummary: function() {
            var me = this;
            return this._requestDefaultDetails().then(function(installedPluginData) {
                return $.ajax({
                    type: 'get',
                    cache: false,
                    url: UpmEnvironment.pathToInstalledMarketplaceAddonByKey(me.getKey()),
                    dataType: 'json'
                }).then(function(installedMpacPluginData) {
                    return _.extend(installedPluginData, installedMpacPluginData,
                        { links: _.extend({}, installedMpacPluginData.links, installedPluginData.links) });
                });
            });
        },

        toJSON: function() {
            return _.extend({}, AddonModel.prototype.toJSON.apply(this), {
                roleBased: this.hasRoleBasedPricing(),
                unsubscribed: this.isUnsubscribed(),
                updatable: this.isUpdatable()
            });
        }
    });
});
