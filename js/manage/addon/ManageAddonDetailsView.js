UPM.define('ManageAddonDetailsView',
    [
        'jquery',
        'brace',
        'AddonActions',
        'AddonActionsViewMixin',
        'AddonModuleModel',
        'AddonModuleView',
        'AddonScreenshotsView',
        'BaseCollectionView',
        'BaseView',
        'CommonInstallAndLicensingFlows',
        'InstallOrLicenseResultDialog',
        'LicenseDetailsView',
        'LicenseUpdatedMessageTemplate',
        'ManageAddonDetailsTemplate',
        'UnsubscribedMessageTemplate',
        'UpmFormats',
        'UpmMessageView',
        'UpmPricing',
        'UpmStrings'
    ], function($,
                Brace,
                AddonActions,
                AddonActionsViewMixin,
                AddonModuleModel,
                AddonModuleView,
                AddonScreenshotsView,
                BaseCollectionView,
                BaseView,
                CommonInstallAndLicensingFlows,
                InstallOrLicenseResultDialog,
                LicenseDetailsView,
                licenseUpdatedMessageTemplate,
                detailsTemplate,
                unsubscribedMessageTemplate,
                UpmFormats,
                UpmMessageView,
                UpmPricing,
                UpmStrings) {

    "use strict";
    /**
     * Manages the detail view content for add-on rows in the Manage views.
     */

    return BaseView.extend({

        mixins: [ AddonActionsViewMixin ],

        template: detailsTemplate,

        events: {
            'click .role-full-pricing-link': '_onPricingLinkClicked',
            'click .upm-module-toggle': '_onModulesToggleClicked',
            'click .app-crossgrade-link': '_onAppCrossgradeClicked'
        },

        _initEvents: function() {
            this.listenTo(this.model, 'change', this.render, this);
            this.listenTo(this.model, 'error', this.showError);
            this.listenTo(this.model, 'message', this.showMessage);
            this.listenTo(this.model, 'licenseUpdated', this._onLicenseUpdated);
            this.listenTo(this.model, 'uninstalled', this._onUninstalled);
        },

        _getData: function() {
            var pricingDescriptionHtml,
                pricingSummaryHtml;

            if (this.model.pricingModel) {
                if (this.model.pricingModel.isRoleBased()) {
                    pricingDescriptionHtml = this.model.pricingModel.getRoleBasedPricingDescription(this.model, true);
                } else {
                    pricingSummaryHtml = this.model.pricingModel.getPricingDescription(this.model);
                }
            }

            return {
                plugin: this.model.toJSON(),
                primaryMessageType: this._getPrimaryMessageType(),
                pricingDescriptionHtml: pricingDescriptionHtml,
                pricingSummaryHtml: pricingSummaryHtml
            };
        },

        showMessage: function(messageModel) {
            if (messageModel) {
                this._getMessageContainer().append((new UpmMessageView({ model: messageModel })).render().$el);
                UPM.trace('addon-inline-message');
            }
        },

        /**
         * Adds an appropriate message after you have stopped a subscription.
         * @method showUnsubscribedMessage
         * @param {Boolean} active  true if the billing cycle has not yet ended
         * @param {Boolean} trial  true if this was a trial that has ended
         */
        showUnsubscribedMessage: function(active, trial) {
            var message = unsubscribedMessageTemplate({
                    plugin: this.model.toJSON(),
                    active: active,
                    trial: trial
                });
            this.model.triggerMessage({ type: 'warning', message: message });
        },

        _canBePrimaryAction: function(action, index) {
            switch (action) {
                case AddonActions.CONFIGURE:
                case AddonActions.DISABLE:
                case AddonActions.ENABLE:
                case AddonActions.TRIAL_UNSUBSCRIBE:
                case AddonActions.UNINSTALL:
                case AddonActions.UNSUBSCRIBE:
                    return false;
                default:
                    return true;
            }
        },

        _getMessageContainer: function() {
            return this.$el.find('.upm-message-container');
        },

        _getModulesContainer: function() {
            return this.$el.find('div.upm-plugin-modules');
        },

        /**
         * Determine what kind of condition or action we are most interested in telling the user about.
         * We'll pass this to ManageAddonDetailsTemplate, and then the template will pick an appropriate
         * message string based on that along with various other conditions like OnDemand status.
         */
        _getPrimaryMessageType: function() {

            // TODO:  Move ALL of this logic onto the back end.  We are already setting a primaryAction
            // property in the representation - all of the decisions below could be made at that time.
            // We just have to take into account that the primary action lozenge does not always match
            // the message.
            
            var licenseDetails = this.model.getLicenseDetails();

            // The option to start or resume a subscription always takes priority
            if (licenseDetails && licenseDetails.subscription) {
                if (licenseDetails.subscription && licenseDetails.subscriptionTrialResumable) {
                    return 'resume_trial';
                } else if (licenseDetails.subscription && licenseDetails.subscribable) {
                    return 'subscribe';
                }
            }

            // Otherwise, first priority is whatever the back end told us about the primary action, if any
            if (this.model.getPrimaryAction()) {
                return this.model.getPrimaryAction().name;
            }

            // Otherwise, check for various license conditions
            if (licenseDetails) {
                if (licenseDetails.error === 'EXPIRED') {
                    // all expired (recently and long ago) eval add-ons have the same message
                    return 'eval_recently_expired';
                } else if (licenseDetails.error === 'VERSION_MISMATCH') {
                    // a message will be shown for all maintenance expired add-ons
                    return 'maintenance_recently_expired';
                } else if (licenseDetails.evaluation) {
                    // all non-expired eval add-ons have the same message
                    return 'eval_nearly_expired';
                }
            }

            if (this.model.hasLink('trial-subscribe') || this.model.hasLink('try')) {
                return 'unlicensed_marketplace';
            }

            if (this.model.isUpdatable()) {
                return 'updatable';
            }

            // if none of the above are true, possibly show a message about a post-install link
            if (this.model.hasLink('post-install')) {
                return 'get_started';
            }

            // I guess there's nothing to say about the add-on
            return null;
        },

        _getActionsOrder: function() {
            return this.model._getActionsOrder();
        },

        _shouldShowActionAsLink: function(action, index) {
            return false;
        },

        _shouldShowDisabledActionsWithReasons: function() {
            // In the detail view, unlike the summary view, we do show disabled buttons for some actions
            // as long as the model provided a "disabledReason" property.
            return true;
        },

        _onLicenseUpdated: function(propertiesBeforeLicenseUpdate, wasRetrievedFromMac) {
            var license = this.model.getLicenseDetails(),
                wasEnabled = propertiesBeforeLicenseUpdate ? propertiesBeforeLicenseUpdate.enabled : true,
                isEnabled = this.model.getEnabled(),
                isNewlyCreatedLicense = !wasRetrievedFromMac && this.model.hasLicense() &&
                    (!propertiesBeforeLicenseUpdate || !propertiesBeforeLicenseUpdate.licenseDetails),
                msgBody,
                msgType;

            msgBody = licenseUpdatedMessageTemplate({
                    plugin: this.model.toJSON(),
                    propertiesBeforeLicenseUpdate: propertiesBeforeLicenseUpdate,
                    isNewlyCreatedLicense: isNewlyCreatedLicense
                }).trim();

            if (msgBody) {
                msgType = 'success';
                if ((wasEnabled && !isEnabled) ||
                    (!isEnabled && license && license.valid) ||
                    (license && !license.valid)) {
                    msgType = 'warning';
                }
                this.model.triggerMessage({
                    type: msgType,
                    message: msgBody,
                    closeAfter: 5
                });
            }

            if (isNewlyCreatedLicense && license && license.valid && isEnabled) {
                if (this.model.getLinks()['post-install']) {
                    // The plugin has a "Get Started" link.  Even though the license was just entered manually
                    // rather than coming from MAC, let's show the same alert as we would in the regular install
                    // flow, since the plugin probably wasn't usable until now.
                    new InstallOrLicenseResultDialog({
                        model: this.model,
                        isUpdate: false,
                        nextAction: 'get-started',
                        updateForDisabledPlugin: false
                    });
                }
            }
        },

        _onModulesToggleClicked: function(e) {
            var shouldShow = !this._getModulesContainer().hasClass('expanded');
            e.preventDefault();
            $(e.target).blur();
            if (shouldShow && !this._getModulesContainer().hasClass('loaded')) {
                this._renderModules();
            }
            this.$el.find('.upm-plugin-modules, li.upm-module-present').toggleClass('expanded', shouldShow);
        },

        _onPricingLinkClicked: function(e) {
            e.preventDefault();
            CommonInstallAndLicensingFlows.openRoleBasedPricingDialog(this.model,
                this.model.getDefaultPurchaseAction());
        },

        _onAppCrossgradeClicked: function(e) {
            e.preventDefault();
            this.model.signalAction(AddonActions.CROSSGRADE);
        },

        _onUninstalled: function() {
            // Rather than re-rendering the detail view - which would require us to have an "is this really
            // installed" property in a representation that is only supposed to be for installed plugins, and
            // to have all kinds of stuff in our template depend on that property - we'll just do some DOM
            // manipulation to disable/hide various things that are no longer applicable.  The subviews for
            // license details, reviews, etc. will also update themselves due to the same event.
            this.$el.find('.aui-button').addClass('disabled').prop('disabled', true).attr('aria-disabled', true);
            this.$el.find('div.upm-plugin-modules').remove();
            this.$el.find('a.upm-module-toggle').replaceWith(this.$el.find('a.upm-module-toggle span.upm-count-enabled'));
            this.$el.find('.upm-plugin-pac-links a').parent('li').remove();
        },

        _postRender: function() {
            var me = this;

            if (this.model.isLicenseUpdatable() || this.model.getLicenseDetails()) {
                var licenseView = new LicenseDetailsView({ model: this.model }).render();
                this.$el.find('.upm-plugin-license-container').append(licenseView.$el);
            }

            this._renderActionButtons(this.$el.find('.upm-plugin-actions'));

            if (!this.model.isAtlassianConnect() && this.model.getModules() && this.model.getModules().length) {
                this._setupModules();
            }

            // Temporary:  the legacy upm.js code does not load *all* the details when expanding this view;
            // it omits the part that comes from Marketplace.  So we'll hit the server again to get it all.
            // This will cause some extra REST traffic for each expand, but only till we finish refactoring.
            if (this.model.getPacResponse()) {
                this._renderMarketplaceInfo();
            } else {
                this.model.loadDetails().done(function() {
                    me._renderMarketplaceInfo();
                });
            }
        },

        _renderMarketplaceInfo: function() {
            if ((this.model.getScreenshots() && this.model.getScreenshots().length) ||
                (this.model.getHighlights() && this.model.getHighlights().length)) {
                this.$el.find('.screenshots-container').empty()
                    .append(new AddonScreenshotsView({ model: this.model }).render().$el);
            }
        },

        _renderModules: function() {
            var view = new BaseCollectionView({
                    el: this._getModulesContainer().find('.upm-module-container'),
                    collection: this.modulesCollection,
                    itemView: AddonModuleView
                });
            view.render();
            this.listenTo(this.modulesCollection, 'change:enabled', this._updateModuleEnabledState);
            this.listenTo(this.modulesCollection, 'message', function(params) {
                this.model.triggerMessage(params);
            });
            this._getModulesContainer().addClass('loaded');
        },

        _setupModules: function() {
            this.modulesCollection = new Brace.Collection(this.model.getModules(), { model: AddonModuleModel });
            this._showModulesEnabledCount();
            this._showModulesBrokenCount();
        },

        _showModulesEnabledCount: function() {
            this.$el.find('.upm-count-enabled').html(UpmFormats.format(
                    UpmStrings['upm.plugin.modules.count.enabled'],
                    this.modulesCollection.filter(function(m) { return m.getEnabled(); }).length,
                    this.modulesCollection.size()
                ));
        },

        _showModulesBrokenCount: function () {
            var hasBroken = 0 != this.modulesCollection.where({broken: true}).length,
                target = AJS.$(this.$el).find('.upm-modules-broken');
            if (hasBroken && $.isFunction(target.tooltip)) {
                target.tooltip({gravity: 's'});
            }
            target.toggleClass('upm-has-modules-broken', hasBroken);
        },

        _updateModuleEnabledState: function(module) {
            var message = UpmFormats.format(
                    UpmStrings[module.getEnabled() ? 'upm.messages.module.enable.success' :
                        'upm.messages.module.disable.success'],
                    UpmFormats.htmlEncode(module.getName()));

            this.model.triggerMessage({
                type: module.getEnabled() ? 'success' : 'info',
                message: message,
                closeAfter: 5
            });
            this._showModulesEnabledCount();
            this._showModulesBrokenCount();
        }
    });
});
