UPM.define("MarketplaceSingleAddonModule",["jquery","backbone","MarketplaceBaseModule","MarketplaceAddonModel","MarketplaceSingleAddonView","UpmCommonUi","UpmLoadingView"],function(E,G,D,A,C,F,B){return D.extend({initialize:function(J){var M=this;
var H=new A();
var I;
var O=E(".single-addon");
var L=O.find(".upm-find-addons-container .upm-plugin-list");
J.onSingle(K);
J.onRefresh(N);
this._listenForAddonEvents(H);
new B({model:H,el:F.getPageContainer()});
function K(P){if(P){N()
}}function N(){H.setKey(J.getKey(),{silent:true});
L.empty();
O.removeClass("hidden");
H.fetch().done(function(){I=new C({model:H});
L.append(I.render().$el);
M.trigger("loaded")
})
}}})
});