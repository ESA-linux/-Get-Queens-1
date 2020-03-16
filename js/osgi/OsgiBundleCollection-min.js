UPM.define("OsgiBundleCollection",["brace","jquery","underscore","OsgiBundleModel","UpmAjax","UpmEnvironment"],function(C,F,B,D,E,A){return C.Collection.extend({model:D,findBySymbolicName:function(G){return this.find(function(H){return(H.getSymbolicName()===G)
})
},getBundles:function(G){var H=A.getResourceUrl("osgi-bundles");
if(G){H+="?q="+G
}var I=F.ajax({url:H,type:"get",dataType:"json"});
I.done(B.bind(function(J){this.reset(J.entries)
},this));
I.fail(B.bind(function(J){E.signalAjaxError(J)
},this))
},filterBundlesByName:function(G){return this.filter(function(H){return H.getDisplayName().toLowerCase().indexOf(G.toLowerCase())>-1
})
}})
});