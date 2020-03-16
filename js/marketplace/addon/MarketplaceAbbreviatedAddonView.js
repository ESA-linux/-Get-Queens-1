UPM.define('MarketplaceAbbreviatedAddonView',
    [
        'MarketplaceAddonView',
        'MarketplaceAbbreviatedAddonTemplate'
    ], function(MarketplaceAddonView,
                abbreviatedAddonTemplate) {

    "use strict";

    return MarketplaceAddonView.extend({

        template: abbreviatedAddonTemplate
    });
});
