UPM.require(["backbone","jquery","marketplaceRouter","MarketplacePageView","MarketplaceQueryModel","MarketplaceSearchModule","MarketplaceSingleAddonModule","UpmContextPathMixin","MarketplaceCarouselModule","UpmCommonUi","UpmEnvironment","UpmSafeMode","UpmSettings"],function(J,E,B,D,H,C,G,F,L,I,A,K,M){I.getReadyState().done(function(){if(!A.getResourceUrl("create-requests")&&!A.getResourceUrl("install-uri")){E("#upm-requests-disabled").removeClass("hidden")
}var Q=new H();
var O=(E(".upm-requests").length!==0);
new D({el:E("#upm-panel-install"),model:Q});
var P=new C(Q);
var N=new G(Q);
P.on("loaded",function(R){L.load();
if(A.isUnknownProductVersion()&&!A.isDevelopmentProductVersion()){E("#upm-install-search-form").addClass("hidden")
}if(R.hasRequests){if(!O){E("a.upm-dismiss-request").closest("div").removeClass("hidden")
}}UPM.trace("marketplace-page-loaded")
});
N.on("loaded",function(){UPM.trace("marketplace-page-loaded")
});
E("#upm-link-bar li:visible").eq(0).addClass("first");
K.onSafeModeChanged(function(){Q.triggerRefresh()
});
B.on("route:search",function(R,S){Q.resetPaginationAndSetSearchParams(R,S)
});
B.on("route:single",function(R){Q.setKeyParameter(R)
});
B.on("route:settingsDialog",function(R){M.openDefaultSettingsDialog();
B.navigateToFeatured(R)
});
J.history.start({root:F.getContextPath()+"/plugins/servlet/upm/marketplace",pushState:B.usePushState()})
})
});