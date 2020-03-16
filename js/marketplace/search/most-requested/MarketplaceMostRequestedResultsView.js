UPM.define('MarketplaceMostRequestedResultsView',
    [
        'underscore',
        'MarketplaceSearchResultsView',
        'MarketplaceMostRequestedAddonView',
        'MarketplaceEmptyMostRequestedResultsView',
        'SearchResultsRenderingStrategy'
    ],
    function(_,
             MarketplaceSearchResultsView,
             MarketplaceMostRequestedAddonView,
             MarketplaceEmptyMostRequestedResultsView) {

        "use strict";

        return MarketplaceSearchResultsView.extend({

            itemView: MarketplaceMostRequestedAddonView,

            emptyView: MarketplaceEmptyMostRequestedResultsView

        }
    );
});
