UPM.define('PurchasedAddonModel',
    [
        'jquery',
        'MarketplaceAddonModel',
        'AddonActions'
    ],
    function($,
             MarketplaceAddonModel,
             AddonActions) {

    "use strict";

    /**
     * Subclass of AddonModel that adds properties and behaviors that are only relevant on the
     * Purchased Add-ons page.  This is currently derived from MarketplaceAddonModel because we
     * are using the same REST representation for both and it includes properties from Marketplace;
     * the difference is in what actions are allowed on this page.
     */
    return MarketplaceAddonModel.extend({

        getActionState: function(action) {
            var installed = this.isInstalled(),
                remote = this.getRemoteInstallable();

            switch (action) {
                case AddonActions.INSTALL:
                    // This is different from the logic in MarketplaceAddonModel because, on the Find New
                    // page, we wouldn't show an Install button for a paid-via-Atlassian add-on.
                    return !installed && this.isInstallable();
                case AddonActions.MANAGE:
                    return installed && this.hasLink('manage');
            }
            return false;
        }
    });
});
