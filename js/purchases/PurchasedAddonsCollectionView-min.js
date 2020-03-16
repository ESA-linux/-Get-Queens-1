UPM.define("PurchasedAddonsCollectionView",["jquery","BaseCollectionView","PurchasedAddonView"],function(C,A,B){return A.extend({itemView:B,_initEvents:function(){this.listenTo(this.collection,"sync",this.render)
},_postRender:function(){this.$el.addClass("expandable")
}})
});