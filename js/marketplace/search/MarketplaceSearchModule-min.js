UPM.define("MarketplaceSearchModule",["jquery","underscore","MarketplaceBaseModule","MarketplaceAddonCollection","MarketplaceMostRequestedAddonCollection","MarketplaceSearchResultsView","MarketplaceMostRequestedResultsView","MarketplaceFilterFormView","MarketplaceBrowserEventHandlingView","UpmEnvironment"],function(F,I,G,A,B,J,C,H,E,D){return G.extend({initialize:function(N){var O=this;
var P=new A();
var K=new B();
new H({model:N,el:F("#upm-install-search-form")});
var Q=F(".find-addons .upm-find-addons-container");
new J({collection:P,el:Q});
new C({collection:K,el:Q});
new E({model:N,el:Q});
var T=F("#upm-panel-install");
N.onSearch(R);
N.onRefresh(L);
this._listenForAddonEvents(P);
this._listenForAddonEvents(K);
function S(){UPM.trace("marketplace-search-complete")
}function R(U,V){if(U||V){M(V)
}else{I.defer(S)
}}function L(){M(false)
}function M(W){var U=N.getFilter(),V;
T.removeClass("loaded");
if(U==="most-requested"&&D.getResourceUrl("most-requested")){V=K.search(N,W)
}else{V=P.search(N,W)
}V.done(function(X){T.addClass("loaded");
O.trigger("loaded",X)
});
V.always(S)
}}})
});