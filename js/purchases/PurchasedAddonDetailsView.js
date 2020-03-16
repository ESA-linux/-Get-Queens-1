UPM.define('PurchasedAddonDetailsView',
    [
        'jquery',
        'MarketplaceAddonDetailsView'
    ], function($,
                MarketplaceAddonDetailsView) {

    "use strict";

    return MarketplaceAddonDetailsView.extend({

        enableRecommendations: false
    });
});
