UPM.define("BaseCollectionView",["BaseView"],function(A){return A.extend({_initEvents:function(){this.listenTo(this.collection,"reset",this.render);
this.listenTo(this.collection,"remove",this._rerenderIfEmpty)
},_getHtml:function(){var B="";
if(this.collection.length){var C=this._getCollectionItemView();
if(C){B=this._renderWithSubView()
}else{if(this._compiledTemplate){B=this._renderWithTemplate()
}}}else{if(this._getEmptyView()){B=this._renderWithEmptyTemplate()
}}return B
},_renderWithSubView:function(){var C=this._getCollectionItemView(),B=this;
return this.collection.map(function(E){var D=new C({model:E}).render();
D.listenTo(B,"unbound",D.stopListening);
return D.$el
})
},_renderWithTemplate:function(){return this._compiledTemplate({models:this._getData()})
},_renderWithEmptyTemplate:function(){var B=this._getEmptyView();
return new B({model:this}).render().$el
},_rerenderIfEmpty:function(){if(this.collection.length===0){this.render()
}},_getData:function(){return this.collection.toJSON()
},_getCollectionItemView:function(){return this.itemView||this.options.itemView
},_getEmptyView:function(){return this.emptyView||this.options.emptyView
}})
});