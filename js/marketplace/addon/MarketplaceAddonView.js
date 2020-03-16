UPM.define('MarketplaceAddonView',
    [
        'jquery',
        'underscore',
        'AddonView',
        'MarketplaceAddonDetailsView',
        'MarketplaceAddonTemplate',
        'MarketplacePricingView',
        'DownloadDialog',
        'UpmEnvironment',
        'CommonInstallAndLicensingFlows',
        'LicenseContactRequiredDialog',
        'MarketplaceInstallFlow',
        'UpmPricing',
        'AddonActions'
    ], function($,
                _,
                AddonView,
                MarketplaceAddonDetailsView,
                addonTemplate,
                MarketplacePricingView,
                DownloadDialog,
                UpmEnvironment,
                commonInstallAndLicensingFlows,
                LicenseContactRequiredDialog,
                installFlow,
                UpmPricing,
                AddonActions) {

    "use strict";

    /**
     * Subclass of AddonView that provides the default view behavior for add-ons everywhere
     * except the Manage page.
     */
    return AddonView.extend({

        template: addonTemplate,

        detailViewClass: MarketplaceAddonDetailsView,

        _initEvents: function() {
            AddonView.prototype._initEvents.apply(this);

            this.listenTo(this.model, 'action', this._onAddonAction);
        },

        _getData: function() {
            return _.extend(
                AddonView.prototype._getData.apply(this),
                {
                    showRequestCount: false  // is overridden in MarketplaceMostRequestedAddonView
                }
            );
        },

        _getActionsOrder: function() {
            return [
                AddonActions.TRY,
                AddonActions.BUY,
                AddonActions.CROSSGRADE,
                AddonActions.UPGRADE,
                AddonActions.RENEW,
                AddonActions.RENEW_CONTACT,
                AddonActions.TRIAL_SUBSCRIBE,
                AddonActions.TRIAL_RESUME,
                AddonActions.SUBSCRIBE,
                AddonActions.INSTALL,
                AddonActions.DOWNLOAD,
                AddonActions.MAKE_REQUEST,
                AddonActions.DISMISS_REQUEST,
                AddonActions.MANAGE
            ];
        },

        _canBePrimaryAction: function(action, index) {
            return (action !== AddonActions.MANAGE) && (index === 0);
        },

        _shouldShowActionAsLink: function(action, index) {
            return (index > 0);
        },
        
        _postRender: function() {
            var me = this,
                $pricingEl;

            AddonView.prototype._postRender.apply(this);

            this.$el.find('.upm-plugin-categories a').hover(function() {
                   $(this).find('.aui-lozenge').removeClass('aui-lozenge-subtle');
               }, function() {
                   $(this).find('.aui-lozenge').addClass('aui-lozenge-subtle');
               });
            
            $pricingEl = this.$el.find('.pricing');
            if ($pricingEl.length) {
                var pricingView = new MarketplacePricingView({ model: this.model, el: $pricingEl });
                pricingView.render();
            }
        },

        _onAddonAction: function(action) {
            var me = this;

            // For most of these actions, the only reason that this view (rather than the model or the
            // page module) is the listener is that some of the legacy code still needs to have a reference
            // to the view.  Once that's no longer the case, and MarketplaceInstallFlow doesn't need the
            // view as a parameter any more, we can move this logic somewhere better.

            function startDefaultInstallFlow() {
                installFlow.installOrLicense(me.model, action);
            }
            
            function startRoleBasedFlow() {
                commonInstallAndLicensingFlows.openRoleBasedPricingDialog(me.model, action, me.$el.find('.pricing-tier-display'))
                    .done(function(result) {
                        installFlow.installOrLicense(me.model, result.action, result.users);
                    });
            }

            switch (action) {
                case AddonActions.BUY:
                case AddonActions.UPGRADE:
                    this.model.loadPricingModel().done(function() {
                        if (me.model.hasRoleBasedPricing()) {
                            startRoleBasedFlow();
                        } else {
                            startDefaultInstallFlow();
                        }
                    });
                    break;

                case AddonActions.CROSSGRADE:
                    commonInstallAndLicensingFlows.crossgradeAppLicense(this.model);
                    break;

                case AddonActions.DOWNLOAD:
                    new DownloadDialog({ model: this.model });
                    break;
                    
                case AddonActions.INSTALL:
                case AddonActions.TRY:
                case AddonActions.RENEW:
                    startDefaultInstallFlow();
                    break;

                case AddonActions.RENEW_CONTACT:
                    commonInstallAndLicensingFlows.openRenewContactDialog(this.model);
                    break;

                case AddonActions.MANAGE:
                    window.location.href = this.model.getLinks().manage;
                    break;
            }
        }
    });
});
