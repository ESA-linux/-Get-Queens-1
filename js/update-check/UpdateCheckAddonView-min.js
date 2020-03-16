UPM.define("UpdateCheckAddonView",["jquery","AddonView","UpdateCheckAddonDetailsView","UpdateCheckAddonTemplate","AddonActions","CollectionItemRenderingStrategy"],function(C,B,F,E,A,D){return B.extend({template:E,detailViewClass:F,renderingStrategy:D,_getData:function(){return{plugin:this.model.toJSON(),}
},_getActionsOrder:function(){return[A.DISABLE,A.ENABLE]
},_canBePrimaryAction:function(G){return false
}})
});