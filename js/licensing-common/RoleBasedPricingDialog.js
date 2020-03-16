UPM.define('RoleBasedPricingDialog',
    [
        'underscore',
        'UpmDialog',
        'UpmPricing',
        'RoleBasedPricingDialogTemplate',
        'AddonActions'
    ],
    function(_,
             UpmDialog,
             UpmPricing,
             RoleBasedPricingDialogTemplate,
             AddonActions) {

    // Dialog that shows role-based pricing tiers.  The dialog model is the add-on model,
    // and you must pass an AddonActions constant in the "action" option.
    // The promise returned by getResult() contains an object with the properties "action"
    // (the same action, or AddonActions.TRY if the user clicked the free trial link) and
    // "users" (the selected user count if any).

    function formatUnlimitedTier(maximumLimitedTier) {
        // This logic matches pluginPricing.soy in AMKT.
        if (maximumLimitedTier === 100) {
            return "101+";
        } else if (maximumLimitedTier === 10000) {
            return "10000+";
        } else {
            return "Unlimited";
        }
    }

    function formatPricingTierForTemplate(maximumLimitedTier, pricing) {
        return _.extend({}, pricing, {
            description: UpmPricing.getPricingDescription(pricing, { truncated: true }),
            unitCount: pricing.unitCount === -1 ? formatUnlimitedTier(maximumLimitedTier) : pricing.unitCount
        });
    }

    return UpmDialog.extend({
        template: RoleBasedPricingDialogTemplate,

        _getData: function() {
            var licenseDetails = this.model.getLicenseDetails(),
                pricingModel = this.model.pricingModel,
                tiers = UpmPricing.findAvailableRoleBasedTiers(pricingModel.getItems(), this.model),
                currentTier = licenseDetails && licenseDetails.maximumNumberOfUsers,
                filteredTiers = (this.options.action && currentTier) ?
                    UpmPricing.findTiersAboveUnitCount(tiers, currentTier) : tiers,
                maximumLimitedTier = Math.max.apply(this, _.map(tiers, function(tier) { return tier.unitCount; })),
                morePricingOverUnitCount = pricingModel.getContactSalesForAdditionalPricing() && maximumLimitedTier;
            return {
                plugin: this.model.toJSON(),
                tiers: _.map(filteredTiers, _.partial(formatPricingTierForTemplate, maximumLimitedTier)),
                action: this.options.action.key,
                allowFreeTrial: this.model.hasLink('try') || this.model.hasLink('trial-subscribe'),
                morePricingOverUnitCount: morePricingOverUnitCount,
                roleNamePlural: (licenseDetails && licenseDetails.typeI18nPlural) ||
                    pricingModel.getRole().pluralName.toLowerCase()
            };
        },

        _postRender: function() {
            var me = this;
            this.$el.find('a.role-free-trial').on('click', function(e) {
                e.preventDefault();
                me.close();
                me.deferredResult.resolve({ action: AddonActions.TRY });
            });
        },

        _getReturnValue: function() {
            return {
                action: this.options.action,
                users: this.$el.find('.rbp-pricing-list input[name="rbp-pricing-element"]:checked').val()
            };
        }
    });
});
