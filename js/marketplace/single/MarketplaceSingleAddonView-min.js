UPM.define("MarketplaceSingleAddonView",["jquery","MarketplaceAddonView"],function(B,A){return A.extend({_postRender:function(){A.prototype._postRender.apply(this);
this.$el.removeClass("expandable");
this._renderDetails();
UPM.trace("single-addon-rendered")
}})
});