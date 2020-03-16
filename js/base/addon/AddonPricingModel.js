UPM.define('AddonPricingModel',
    [
        'jquery',
        'underscore',
        'brace',
        'UpmEnvironment',
        'UpmPricing'
    ],
    function($,
             _,
             Brace,
             UpmEnvironment,
             UpmPricing) {

    "use strict";

    /**
     * Holds pricing details for a paid-via-Atlassian add-on.  These are separate from the add-on model
     * because they are loaded in a separate asynchronous query.
     * 
     * The properties of this model come directly from the Marketplace REST API; there is no
     * corresponding representation in the UPM REST API.
     */
    return Brace.Model.extend({

        namedAttributes: [
            "_links",
            "items",
            "freePricingItem",
            "expertDiscountOptOut",
            "contactSalesForAdditionalPricing",
            "parent",
            "lastModified",
            "status",
            "default",
            "hasPublishedPrices",
            "canChangePrices",
            "role"
        ],

        getPricingDescription: function(addonModel) {
            if (this.isRoleBased()) {
                return this.getRoleBasedPricingDescription(addonModel, false);
            } else if (this.getItems() && this.getItems().length) {
                var isRenewal = addonModel.getLicenseDetails() && addonModel.getLicenseDetails().renewable,
                    tier = UpmPricing.findActiveNonRoleBasedTier(this.getItems());
                return tier ?
                       UpmPricing.getPricingDescription(tier, {
                           renewal: isRenewal,
                           dataCenter: this.isDataCenter(addonModel)
                       }) :
                       null;
            } else {
                return null;
            }
        },
        
        getRoleBasedPricingDescription: function(addonModel, withActionText) {
            if (this.isRoleBased()) {
                var tiers = UpmPricing.findAvailableRoleBasedTiers(this.getItems(), addonModel);
                return UpmPricing.getRoleBasedPricingDescription(tiers, this.getRole(), withActionText);
            }
        },

        isRoleBased: function() {
            return !!this.getRole();
        },

        isDataCenter: function(addonModel) {
            return UpmEnvironment.isDataCenter() && !!addonModel.getStatusDataCenterCompatible();
        }
    });
});
