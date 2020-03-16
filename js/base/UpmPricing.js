UPM.define('UpmPricing',
    [
        'jquery',
        'underscore',
        'PricingDescriptionTemplate',
        'UpmEnvironment'
    ],
    function($,
             _,
             PricingDescriptionTemplate,
             UpmEnvironment) {

    var UpmPricing = {
        getRoleBasedPricingDescription: function(pricingTiers, roleInfo, actionText) {
            var sortedTiers;
            if (!pricingTiers || !pricingTiers.length) {
                return null;
            }
            sortedTiers = _.sortBy(pricingTiers, unitCountPricingItemOrdering);

            // Unfortunately there are multiple permutations of RBP with different pricing displays...
            if (sortedTiers[0].monthsValid === 1) {
                // For OnDemand monthly subscriptions, we show all the available pricing tiers (one per
                // line) because monthly subscribers can shift automatically from one tier to another
                // every month based on their current usage, so we want to make them aware of all the
                // potential prices.  That's not as much of an issue for annual subscribers, so we only
                // show a single currently applicable tier for annual.
                return _.map(pricingTiers, function(tier) {
                    return '<div>' + UpmPricing.getPricingDescription(tier, { roleInfo: roleInfo }) + '</div>';
                }).join("");
                // TODO:  Currently the MPAC API doesn't support a "$x per user (n+ users)" tier
                // (AMKT-14734), although we had logic for this in the template (controlled by
                // rolePerUser flag).
            } else {
                // OnDemand annual and BTF: only show the lowest tier. Note that the actual text will differ
                // depending on whether this is OnDemand annual or BTF, but that is handled in getPricingDisplay().
                return UpmPricing.getPricingDescription(pricingTiers[0],
                    { actionText: actionText, roleInfo: roleInfo });
            }
        },

        getPricingDescription: function(pricingItem, options) {
            return PricingDescriptionTemplate({
                pricing: pricingItem,
                renewal: options && options.renewal,
                roleInfo: options && options.roleInfo,
                rolePerUser: options && options.rolePerUser,
                truncated: options && options.truncated,
                actionText: options && options.actionText,
                dataCenter: options && options.dataCenter
            }).trim();
        },

        findActiveNonRoleBasedTier: function(pricingItems) {
            // Don't show any prices if you have only an evaluation app
            if (UpmEnvironment.getHostLicense() && !UpmEnvironment.getHostLicense().evaluation) {
                var applicablePrices = _.filter(pricingItems, filterNonRoleBasedTiers());
                return applicablePrices.length ?
                    _.min(applicablePrices, unitCountPricingItemOrdering) :
                    null;
            }
            return null;
        },

        findAvailableRoleBasedTiers: function(pricingItems, addonModel) {
            // Don't show any prices if you have only an evaluation app
            if (UpmEnvironment.getHostLicense() && !UpmEnvironment.getHostLicense().evaluation) {
                var upgradable = addonModel.getLicenseDetails() && addonModel.getLicenseDetails().upgradable,
                    applicablePrices = _.filter(pricingItems, filterRoleBasedTiers(upgradable));
                return _.sortBy(applicablePrices, unitCountPricingItemOrdering);
            }
            return [ ];
        },

        findTiersAboveUnitCount: function(pricingItems, unitCount) {
            return _.filter(pricingItems, function(p) {
                return (sortableUnitCount(p.unitCount) > unitCount);
            });
        },

        findHighestTierForLicenseType: function(pricingItems) {
            var applicablePrices = _.filter(pricingItems, filterTierByHostLicenseProperties());
            return applicablePrices.length ?
                _.max(applicablePrices, unitCountPricingItemOrdering) :
                null;
        }
    };

    function filterNonRoleBasedTiers() {
        var licenseUsers = UpmEnvironment.getLicensedHostUsers(),
            licenseFilter = filterTierByHostLicenseProperties();
        return function(p) {
            return licenseFilter(p) &&
                (sortableUnitCount(licenseUsers) <= sortableUnitCount(p.unitCount));
        };
    }

    function filterRoleBasedTiers(upgradable) {
        var licenseUsers = UpmEnvironment.getLicensedHostUsers(),
            licenseFilter = filterTierByHostLicenseProperties();
        // For RBP plugins:
        //  - if the current license is upgradable, return all tiers (including those greater than or equal to the host app user count limit)
        //  - otherwise, return all tiers less than or equal to the host app user count limit
        return function(p) {
            return licenseFilter(p) &&
                (upgradable ||
                 (sortableUnitCount(p.unitCount) <= sortableUnitCount(licenseUsers)));
        };
    }

    function filterTierByHostLicenseProperties() {
        var licenseType = getHostLicenseTypeForPricing(),
            hostLicense = UpmEnvironment.getHostLicense(),
            monthsValid = 12; // We're in Server, so it's always annual
        return function(p) {
            return matchLicenseType(p.licenseType, licenseType) &&
                (p.monthsValid === monthsValid);
        }
    }

    function getHostLicenseTypeForPricing() {
        var hlt = UpmEnvironment.getHostLicense() && UpmEnvironment.getHostLicense().licenseType;
        // A Developer product license is compatible with any plugin license, so there's no single pricing for that,
        // but we'll display Commercial pricing in this case so developers can see what most users would see
        return (hlt === 'DEVELOPER') ? 'COMMERCIAL' : hlt;
    }

    function matchLicenseType(priceLicenseType, hostLicenseType) {
        var plt = priceLicenseType && priceLicenseType.toLowerCase(),
            hlt = hostLicenseType && hostLicenseType.toLowerCase();
        // Starter and Commercial types are considered equivalent as long as the user/edition count matches.
        return (plt === hlt) ||
               (plt === 'starter' && hlt === 'commercial') ||
               (plt === 'commercial' && hlt === 'starter');
    }

    function sortableUnitCount(count) {
        return (count >= 0) ? count : Number.MAX_VALUE;
    }

    function unitCountPricingItemOrdering(pricingItem) {
        return sortableUnitCount(pricingItem.unitCount);
    }

    return UpmPricing;
});
