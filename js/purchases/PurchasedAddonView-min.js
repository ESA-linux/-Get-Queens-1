UPM.define("PurchasedAddonView",["underscore","MarketplaceAddonView","PurchasedAddonTemplate","PurchasedAddonDetailsView","CollectionItemRenderingStrategy","UpmLicenseInfo"],function(E,C,A,D,F,B){return C.extend({detailViewClass:D,renderingStrategy:F,_initEvents:function(){C.prototype._initEvents.apply(this);
this.listenTo(this.model,"newly-licensed",E.bind(function(){this.$el.addClass("new-license")
},this))
}})
});