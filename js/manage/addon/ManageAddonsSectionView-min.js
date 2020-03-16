UPM.define("ManageAddonsSectionView",["jquery","brace","BaseCollectionItemView","BaseCollectionView","ManageAddonView","ManageAddonsSectionTemplate"],function(E,D,F,B,A,C){return F.extend({template:C,_getData:function(){return{type:this.model.get("type").key}
},_postRender:function(){var K=this,J=new D.Collection(this.model.get("addons")),H,I=this.$el.find(".upm-manage-plugin-list");
H=new B({collection:J,itemView:A,el:this._getMainListContainer().find(".upm-plugin-list")}).render();
H.listenTo(this,"unbound",H.stopListening);
function G(){K._getMainListContainer().toggleClass("hidden",J.isEmpty());
K.$el.find(".empty-list-message").toggleClass("hidden",!J.isEmpty())
}G();
this.listenTo(J,"remove",G);
this.listenTo(this.model,"filterBySearchText",function(L){K._filterBySearchText(J,L)
})
},_filterBySearchText:function(H,I){function G(K){if(I===undefined||I===""){return true
}return K.getName().toLowerCase().indexOf(I.toLowerCase())>=0
}if(!H.isEmpty()){var J=false;
H.each(function(K){var L=G(K);
J=J||L;
K.trigger("filtered",L)
});
this._getMainListContainer().toggleClass("hidden",!J);
this.$el.find(".empty-filtered-list-message").toggleClass("hidden",J)
}},_getMainListContainer:function(){return this.$el.find(".upm-manage-plugin-list")
}})
});