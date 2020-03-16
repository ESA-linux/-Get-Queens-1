UPM.define("AddonRequestedDialog",["UpmDialog","MostRequestedAddonDialogTemplate","MarketplaceAddonModel","MarketplaceAbbreviatedAddonView"],function(A,B,C,D){return A.extend({template:B,_getData:function(){return{success:this.options.success,hasAddons:!this.collection.isEmpty()}
},_postRender:function(){var F=this,E=this.$el.find(".upm-plugin-list");
this.collection.each(function(H){var G=new D({model:H}).render();
E.append(G.$el)
});
this.$el.find(".upm-plugin-name, .category-link").on("click",function(){F.close()
})
}})
});