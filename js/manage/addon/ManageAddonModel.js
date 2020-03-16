UPM.define('ManageAddonModel',
    [
        'jquery',
        'underscore',
        'AddonActions',
        'EnableDisableAddonMixin',
        'InstalledAddonModel',
        'UpmEnvironment',
        'UpmRequireRestart',
        'UpmStrings',
        'UpmXsrfTokenState'
    ],
    function($,
             _,
             AddonActions,
             EnableDisableAddonMixin,
             InstalledAddonModel,
             UpmEnvironment,
             UpmRequireRestart,
             UpmStrings,
             UpmXsrfTokenState) {

    "use strict";

    /**
     * Subclass of AddonModel that adds properties and behaviors that are only relevant on the
     * Manage page.
     */
    return InstalledAddonModel.extend({

        mixins: [ EnableDisableAddonMixin ],
        
        sendVendorFeedback: function(action, reason, textReason, userEmail, userFullName) {
            var url = this.getLinks()['vendor-feedback'],
                data = {
                    reasonCode: reason,
                    message: textReason,
                    type: action.key.toLowerCase(),
                    pluginVersion: this.getVersion(),
                    email: userEmail,
                    fullName: userFullName
                };
            if (url) {
                return $.ajax({
                    type: 'POST',
                    url: url,
                    dataType: 'json',
                    contentType: UpmEnvironment.getContentType(),
                    data: JSON.stringify(data)
                });
            }
        },

        startUpdate: function() {
            var binaryUri = this.getLinks().binary,
                resourceUrl,
                contentType,
                data;

            contentType = UpmEnvironment.getContentType('install');
            data = { "pluginUri": binaryUri, "pluginName": this.getName(), "pluginVersion":
                this.getPacResponse().update && this.getPacResponse().update.version };
            resourceUrl = UpmEnvironment.getResourceUrl('install-uri');

            if (binaryUri) {
                return UpmXsrfTokenState.tryWithToken(function(token) {
                    return $.ajax({
                        type: 'POST',
                        url: resourceUrl + '?token=' + token,
                        dataType: 'json',
                        contentType: contentType,
                        data: JSON.stringify(data)
                    }).promise();
                });
            } else {
                this.triggerMessage({
                    type: 'error',
                    message: UpmStrings['upm.messages.update.error'],
                    className: 'update'
                });
            }
        },

        uninstall: function() {
            var me = this;
            return $.ajax({
                type: 'DELETE',
                url: this.getLinks()['delete'],
                dataType: 'json',
                contentType: UpmEnvironment.getContentType('json'),
            }).done(function(response) {
                var restartState = response && response.restartState;
                if (restartState) {
                    UpmRequireRestart.addChangeRequiringRestart({
                        action: restartState,
                        name: me.getName(),
                        key: me.getKey(),
                        links: { self: response.links['change-requiring-restart'] }
                    });
                    me.setRestartState(restartState);  // causes the view to refresh
                } else {
                    me.trigger('uninstalled');
                }
            }).promise();
        },

        _getActionsOrder: function() {
            // Ultimately it's ManageAddonView and ManageAddonDetailsView that are responsible for the ordering of
            // the action buttons, but they call this helper method to get the defaults.

            // If eval plugin is nearly expired, show Buy Now before doing update check.
            var showBuyNowBeforeUpdateCheck =
                (this.getLicenseDetails() && this.getLicenseDetails().nearlyExpiring);

            return [
                AddonActions.UPGRADE,
                AddonActions.CROSSGRADE,
                AddonActions.TRY,
                AddonActions.RENEW,
                AddonActions.RENEW_CONTACT,
                showBuyNowBeforeUpdateCheck ? AddonActions.BUY : AddonActions.UPDATE,
                showBuyNowBeforeUpdateCheck ? AddonActions.UPDATE : AddonActions.BUY,
                AddonActions.CHECK_LICENSE,
                AddonActions.GET_STARTED,
                AddonActions.REQUEST_UPDATE,
                AddonActions.DOWNLOAD,
                AddonActions.CONFIGURE,
                AddonActions.UNINSTALL,
                AddonActions.ENABLE,
                AddonActions.DISABLE
            ];
        },

        getActionState: function(action) {
            switch (action) {
                case AddonActions.BUY:
                    return this.hasLink('new');
                case AddonActions.CHECK_LICENSE:
                    return this.hasLink('check-license');
                case AddonActions.CONFIGURE:
                    if (this.hasLink('configure') && this.getEnabled() && !this.isApplicationPlugin()) {
                        if (this.hasLicense() && !this.getLicenseDetails().valid) {
                            return {
                                enabled: this.hasLicense() && this.getLicenseDetails().valid,
                                disabledReason: 'bad-license-cannot-configure'
                            };
                        } else {
                            return true;
                        }
                    }
                    return false;
                case AddonActions.CROSSGRADE:
                    // Crossgrade link text is always shown. But we only show the button if it's also time to
                    //    renew and/or upgrade the license.
                    return this.hasLink('crossgrade') && (this.hasLink('upgrade') || this.hasLink('renew') || this.hasLink('renew-requires-contact'));
                case AddonActions.DISABLE:
                case AddonActions.ENABLE:
                    return this.isEnableOrDisableActionAllowed(action) && !this.isApplicationPlugin();
                case AddonActions.DOWNLOAD:
                    return !this.isUpdatable() && this.hasLink('binary');
                case AddonActions.GET_STARTED:
                    return this.hasLink('post-install') && this.getEnabled();
                case AddonActions.RENEW:
                    // If we can crossgrade, only offer the crossgrade button
                    return this.hasLink('renew') && !this.hasLink('crossgrade');
                case AddonActions.RENEW_CONTACT:
                    // If we can crossgrade, only offer the crossgrade button
                    return this.hasLink('renew-requires-contact') && !this.hasLink('crossgrade');
                case AddonActions.REQUEST_UPDATE:
                    return this.hasLink('request-update');
                case AddonActions.TRY:
                    return this.hasLink('try');
                case AddonActions.UNINSTALL:
                    if (this.hasLink('delete') && !this.isApplicationPlugin()) {
                        return true;
                    } else if (this.isAtlassianConnect() && this.getLicenseDetails() && this.getLicenseDetails().autoRenewal) {
                        return { enabled: false, disabledReason: 'subscribed-cannot-uninstall' };
                    } else {
                        return false;
                    }
                    break;
                case AddonActions.UPDATE:
                    if (this.isUpdatable()) {
                        if (UpmEnvironment.isSafeMode()) {
                            return {
                                enabled: false,
                                disabledReason: 'safe-mode'
                            };
                        } else if (this.getAvailableUpdate() && !this.getAvailableUpdate().licenseCompatible) {
                            return {
                                enabled: false,
                                disabledReason: 'license-incompatible'
                            };
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }
                    break;
                case AddonActions.UPGRADE:
                    // If we can crossgrade, only offer the crossgrade button
                    return this.hasLink('upgrade') && !this.hasLink('crossgrade');
            }
            return false;
        },

        // Ensure that pricing (if any) is always loaded when we expand the details.
        loadDetails: function() {
            var me = this;
            return InstalledAddonModel.prototype.loadDetails.apply(this).then(function() {
                return me.loadPricingModel();
            });
        }
    });
});
