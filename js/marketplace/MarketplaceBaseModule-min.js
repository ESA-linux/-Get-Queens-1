UPM.define("MarketplaceBaseModule",["jquery","underscore","brace","MarketplaceAddonModel","AddonRequestDialog","AddonRequestedDialog","AddonActions","CommonInstallAndLicensingFlows","UpmAjax","UpmEnvironment"],function(G,J,H,E,F,B,I,C,A,D){return H.Evented.extend({_listenForAddonEvents:function(K){K.on("action",J.bind(this._onAddonAction,this));
K.on("request:done",J.bind(this._onRequestDone,this))
},_onAddonAction:function(L,K){switch(L){case I.MAKE_REQUEST:new F({model:K});
break;
case I.REQUEST_UPDATE:C.openUpdateRequestDialog(K);
break
}},_onRequestDone:function(K,M){var L=this;
G.ajax({url:D.getResourceUrl("most-requested"),type:"get",cache:false,dataType:"json",data:{"start-index":0,"max-results":3,"exclude-user-requests":true},success:function(N){L._showRequestMoreDialog(M,N)
},error:function(N){A.signalAjaxError(N)
}})
},_showRequestMoreDialog:function(N,K){var M,L;
M=new H.Collection(K.plugins,{model:E});
this._listenForAddonEvents(M);
L=new B({collection:M,success:N});
M.on("action",function(O){if(O===I.MAKE_REQUEST){L.close()
}})
}})
});