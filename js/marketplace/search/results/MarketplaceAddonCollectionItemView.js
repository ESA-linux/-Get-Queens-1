UPM.define("MarketplaceAddonCollectionItemView", ["MarketplaceAddonView", "CollectionItemRenderingStrategy"], function(MarketplaceAddonView, CollectionItemRenderingStrategy) {

    return MarketplaceAddonView.extend({

	  	// We define the renderingStrategy here, rather than in MarketplaceAddonView, because
	  	// MarketplaceAddonView can also be used in the single-addon context where it is not
	  	// a collection item.
        renderingStrategy: CollectionItemRenderingStrategy

    });
});