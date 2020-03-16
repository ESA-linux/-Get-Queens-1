UPM.define('MarketplaceMostRequestedAddonModel',
    [
        'MarketplaceAddonModel',
        'AddonActions'
    ],
    function(MarketplaceAddonModel,
             AddonActions) {

    "use strict";

    return MarketplaceAddonModel.extend({

        getActionState: function(action) {
            switch (action) {
                case AddonActions.DISMISS_REQUEST:
                    return !this.isInstalled() && this.hasLink('dismiss-request') &&
                           this.getRequests() && this.getRequests().length;
            }
            return MarketplaceAddonModel.prototype.getActionState.apply(this, arguments);
        }
    });
});
