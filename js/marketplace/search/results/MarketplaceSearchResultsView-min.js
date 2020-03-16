UPM.define("MarketplaceSearchResultsView",["jquery","BaseCollectionView","MarketplaceAddonCollectionItemView","UpmLoadingViewMixin","MarketplaceEmptySearchResultsView","SearchResultsRenderingStrategy","UpmCommonUi",],function(F,A,C,D,E,B,G){return A.extend({mixins:[D],itemView:C,emptyView:E,renderingStrategy:B,_initEvents:function(){A.prototype._initEvents.apply(this);
this.loadingContainer=G.getPageContainer();
this.listenForAjaxEvents();
this.listenTo(this.collection,"sync",this.render);
this.listenTo(this.collection,"sync",this._toggleShowMore)
},_toggleShowMore:function(I,H){var J=!!H.links.next;
this.$el.toggleClass("has-more",J)
}})
});