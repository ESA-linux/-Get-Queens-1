UPM.define("UpdateCheckResultsView",["underscore","brace","BaseView","UpdateCheckAddonModel","UpdateCheckAddonListView","UpdateCheckResultsTemplate",],function(C,E,D,A,F,B){return D.extend({template:B,_postRender:function(){this._renderAddons(this.model.getCompatible(),"#upm-compatible-plugins");
this._renderAddons(this.model.getIncompatible(),"#upm-incompatible-plugins");
this._renderAddons(this.model.getUnknown(),"#upm-unknown-plugins");
this._renderAddons(this.model.getUpdateRequired(),"#upm-need-update-plugins");
this._renderAddons(this.model.getUpdateRequiredAfterProductUpdate(),"#upm-need-product-update-plugins")
},_renderAddons:function(H,G){var K=this.$el.find(G),J=new E.Collection(H,{model:A}),I;
this.listenTo(J,"action",C.bind(function(M,L){this.model.trigger("action",M,L)
},this));
K.append('<div class="upm-plugin-list expandable"></div>');
I=new F({collection:J,el:K});
I.render()
}})
});