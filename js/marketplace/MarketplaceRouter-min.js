UPM.define("marketplaceRouter",["brace","underscore","marketplaceUrlGenerator","UpmEnvironment"],function(D,C,B,A){var E=D.Router.extend({routes:{"":"navigateToFeatured","plugins/:key":"single",settings:"settingsDialog",":filter":"search"},usePushState:function(){return window.history&&window.history.pushState
},navigateToFeatured:function(F){this.navigateTo({filter:"featured",parameters:F},{replace:true})
},navigateTo:function(G,F){this.navigate(B.getMarketplaceUrl(G),C.defaults(F||{},{replace:false,trigger:true}))
}});
return new E()
});