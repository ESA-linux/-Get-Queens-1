UPM.define("OsgiBundleView",["jquery","underscore","BaseView","OsgiBundleTemplate","ExpandableViewMixin","OsgiBundleDetailsView","CollectionItemRenderingStrategy"],function(F,C,E,B,D,A,G){return E.extend({mixins:[D],template:B,renderingStrategy:G,detailViewClass:A,events:{"click a.upm-module-toggle":"_toggleModule",},_getData:function(){return{bundle:this.model.toJSON(),}
},_initEvents:function(){this.listenTo(this.model,"focus",this._onFocus)
},_postRender:function(){this.$el.find("div.upm-plugin-row").on("click",C.bind(this._onRowClick,this))
},_onFocus:function(){F(window).scrollTop(this.$el.offset().top-10);
this._expandDetails()
},_toggleModule:function(I){I.preventDefault();
var H=F(I.target).blur();
H.closest("div.upm-plugin-modules").toggleClass("expanded")
}})
});