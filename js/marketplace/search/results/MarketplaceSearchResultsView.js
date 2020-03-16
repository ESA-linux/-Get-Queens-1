UPM.define('MarketplaceSearchResultsView', [
        'jquery',
        'BaseCollectionView',
        'MarketplaceAddonCollectionItemView',
        'UpmLoadingViewMixin',
        "MarketplaceEmptySearchResultsView",
        "SearchResultsRenderingStrategy",
        "UpmCommonUi",
    ],
    function($,
             BaseCollectionView,
             MarketplaceAddonCollectionItemView,
             UpmLoadingViewMixin,
             MarketplaceEmptySearchResultsView,
             SearchResultsRenderingStrategy,
             UpmCommonUi) {

        "use strict";

        return BaseCollectionView.extend({

            mixins: [ UpmLoadingViewMixin ],

            itemView: MarketplaceAddonCollectionItemView,

            emptyView: MarketplaceEmptySearchResultsView,

            renderingStrategy: SearchResultsRenderingStrategy,

            _initEvents: function() {
                BaseCollectionView.prototype._initEvents.apply(this);

                this.loadingContainer = UpmCommonUi.getPageContainer();
                this.listenForAjaxEvents();

                this.listenTo(this.collection, "sync", this.render);
                this.listenTo(this.collection, "sync", this._toggleShowMore);
            },

            /**
             * Shows or hides the "Show More" link.
             *
             * If the "next" link is present we show the "Show More" link.
             *
             * @param model
             * @param response
             * @private
             */
            _toggleShowMore: function(model, response) {
                var hasMore = !!response.links.next;
                this.$el.toggleClass("has-more", hasMore);
            }
        }
    );
});
