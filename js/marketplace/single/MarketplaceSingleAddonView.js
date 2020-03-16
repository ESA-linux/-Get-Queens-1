UPM.define("MarketplaceSingleAddonView", ["jquery", "MarketplaceAddonView"], function($, MarketplaceAddonView) {

    return MarketplaceAddonView.extend({

        _postRender: function() {
        	MarketplaceAddonView.prototype._postRender.apply(this);
            this.$el.removeClass("expandable");
        	this._renderDetails();
            UPM.trace("single-addon-rendered");
        }
    });
});
