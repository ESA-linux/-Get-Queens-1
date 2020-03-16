UPM.define('UpdateCheckAddonListView', [
        'jquery',
        'BaseCollectionView',
        'UpdateCheckAddonView',
        "SearchResultsRenderingStrategy"
    ],
    function($,
             BaseCollectionView,
             UpdateCheckAddonView,
             SearchResultsRenderingStrategy) {

        "use strict";

        return BaseCollectionView.extend({

            itemView: UpdateCheckAddonView,

            renderingStrategy: SearchResultsRenderingStrategy
        }
    );
});
