UPM.define('MarketplaceMostRequestedAddonDetailsView',
    [
        'jquery',
        'underscore',
        'MarketplaceAddonDetailsView',
        'AddonRequestMessageTemplate'
    ], function($,
                _,
                MarketplaceAddonDetailsView,
                requestTemplate) {

    "use strict";

    return MarketplaceAddonDetailsView.extend({

        _getData: function() {
            var requests = this.model.getRequests() || [],
                requestsHtml = '';
            
            for (var i = 0; i < requests.length; i++) {
                requestsHtml += requestTemplate({ request: requests[i] });
            }
            return _.extend(
                MarketplaceAddonDetailsView.prototype._getData.apply(this),
                { requestsHtml: requestsHtml }
            );
        }
    });
});
