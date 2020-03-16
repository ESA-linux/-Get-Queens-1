UPM.define("PurchasedAddonsModel",["jquery","underscore","brace","UpmEnvironment","UpmHostStatusMixin","UpmContextPathMixin","PurchasedAddonsCollection"],function(F,D,E,C,G,B,A){return E.Model.extend({namedAttributes:["purchasedAddons","incompatibleAddons","unknownAddons"],mixins:[G,B],url:function(){return this.getContextPath()+"/rest/plugins/1.0/purchased/available"
},initialize:function(){this._bindHostStatus();
this.on("sync",this._onSync)
},parse:function(H){return{purchasedAddons:new A(H.plugins),incompatibleAddons:new A(H.incompatiblePlugins),unknownAddons:new A(H.unknownPlugins)}
},reloadPlugins:function(){this.fetch()
},_onSync:function(){UPM.trace("purchased-addons-loaded")
},updateLicenses:function(I,H){return this._handleLicenseUpdateResult(F.ajax({url:C.getResourceUrl("update-licenses"),type:"post",contentType:C.getContentType(),dataType:"json",data:JSON.stringify({username:I,password:H})}))
},updateLicensesJwt:function(){return this._handleLicenseUpdateResult(F.ajax({url:C.getResourceUrl("update-licenses-signed"),type:"get",contentType:C.getContentType(),dataType:"json"}))
},_handleLicenseUpdateResult:function(H){var I=F.Deferred(),J=this;
H.done(function(K){if(K.error){I.reject()
}else{J.fetch().done(function(){J.getPurchasedAddons().each(function(L){if(D.contains(K.updatedLicensePluginKeys,L.getKey())){L.trigger("newly-licensed")
}});
I.resolve(K.updatedLicensePluginKeys)
})
}}).fail(function(K){I.reject()
});
return I.promise()
}})
});