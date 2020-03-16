UPM.define("OsgiPageView",["jquery","underscore","brace","OsgiBundleView"],function(E,B,C,A){function D(G,F){var I=(G.getName()||G.getSymbolicName()).toLowerCase(),H=(F.getName()||F.getSymbolicName()).toLowerCase();
return(I>H)?1:((I<H)?-1:0)
}return C.View.extend({events:{"submit #upm-osgi-search-form":"_filterBundlesByModule","click a.upm-osgi-bundle-xref":"_focusOsgiBundle","keyup #upm-osgi-filter-box":"_filterBundles"},initialize:function(){this.listenTo(this.model,"reset",this.render)
},render:function(){this._renderBundles(this.model.models);
AJS.Binder.runBinders(this.$el);
return this.$el
},_renderBundles:function(G){var F=G.sort(D);
this.$el.find("#upm-osgi-bundles .upm-plugin-list").html(B.map(F,function(H){return new A({model:H}).render().$el
}));
this.$el.find("#upm-osgi-bundles").removeClass("hidden");
this.$el.find("#upm-panel-osgi").addClass("loaded")
},_filterBundlesByModule:function(G){G.preventDefault();
var F=E("#upm-osgi-search-box").val();
this.model.getBundles(F)
},_filterBundles:function(H){H.preventDefault();
var G=E(H.target).val();
var F=this.model.filterBundlesByName(G);
this._renderBundles(F)
},_focusOsgiBundle:function(G){var F=this.model.findBySymbolicName(E(G.target).attr("data-key"));
G.preventDefault();
G.target.blur();
if(F){F.trigger("focus")
}}})
});