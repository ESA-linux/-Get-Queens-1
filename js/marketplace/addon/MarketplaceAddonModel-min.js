UPM.define("MarketplaceAddonModel",["jquery","underscore","AddonModel","InstalledAddonModel","UpmEnvironment","AddonActions"],function(D,C,E,F,B,A){return E.extend({url:function(){return B.pathToAvailableAddonByKey(this.getKey())
},namedAttributes:C.keys(E.prototype.namedAttributes).concat(["categories","cloudFreeUsers","downloadCount","hamsProductKey","installable","installed","installationCount","license","marketplaceType","permissions","preinstalled","rating","ratingCount","remoteInstallable","requests","reviewCount","stable","summary","supportType","versionDetails"]),getActionState:function(J){var G=this.isInstallable(),I=this.isInstalled(),K=this.isPaidViaAtlassian(),H=this.get("cloudFreeUsers");
switch(J){case A.DOWNLOAD:return !G&&(this.hasLink("binary")||this.hasLink("external-binary"));
case A.INSTALL:if(I){return false
}return G&&this.hasLink("binary")&&!this.hasLink("try")&&!this.hasLink("new");
case A.MANAGE:return I&&this.hasLink("manage");
case A.TRY:return K&&(G||I)&&this.hasLink("try");
case A.BUY:return K&&(G||I)&&this.hasLink("new");
case A.UPGRADE:return I&&this.hasLink("upgrade")&&!this.hasLink("crossgrade");
case A.CROSSGRADE:return I&&this.hasLink("crossgrade")&&(this.hasLink("upgrade")||this.hasLink("renew")||this.hasLink("renew-requires-contact"));
case A.RENEW:return I&&this.hasLink("renew")&&!this.hasLink("crossgrade");
case A.RENEW_CONTACT:return I&&this.hasLink("renew-requires-contact")&&!this.hasLink("crossgrade");
case A.MAKE_REQUEST:return !I&&!G&&this.hasLink("request")
}return false
},isInstalled:function(){return this.getInstalled()
},isPaidViaVendor:function(){return this.get("marketplaceType")==="PAID_VIA_VENDOR"
},getCurrentUserRequest:function(){return C.find(this.getRequests(),function(G){return G.user&&G.user.userKey===B.getUserKey()
})
},getDefaultPurchaseAction:function(){return this.hasLink("upgrade")?A.UPGRADE:A.BUY
},getEulaUrl:function(){return this.getLinks().eula||(this.getVersionDetails()&&this.getVersionDetails().eulaUrl)
},isAtlassianConnect:function(){return this.getRemoteInstallable()
},isInstallable:function(){return(this.getInstallable()&&this.getLinks()&&!!this.getLinks().binary)||this.isAtlassianConnect()
},loadInstalledAddonModel:function(){return D.ajax({url:B.pathToInstalledAddonByKey(this.getKey()),cache:false,dataType:"json"}).then(function(H){var G=new F(H);
return G._refreshSummary().then(function(){return G
})
})
},toJSON:function(){return C.extend({},E.prototype.toJSON.apply(this),{currentUserRequest:this.getCurrentUserRequest(),installable:this.isInstallable(),paidViaVendor:this.isPaidViaVendor()})
},dismissRequest:function(){var G=this;
return D.ajax({url:this.getLinks()["dismiss-request"],type:"DELETE"}).then(function(){return G.fetch().done(function(){G.trigger("dismissedRequest")
})
}).promise()
},submitRequest:function(I){var H=this;
if(this.getCurrentUserRequest()){this.getCurrentUserRequest().message=I
}else{var G=this.getRequests()||[];
G.push({user:{userKey:B.getUserKey()},message:I});
this.set("requests",G)
}return D.ajax({type:"POST",url:B.getResourceUrl("create-requests"),dataType:"json",contentType:B.getContentType(),data:JSON.stringify({pluginKey:this.getKey(),pluginName:this.getName(),message:I,marketplaceType:this.getMarketplaceType()})}).promise().done(function(){H.trigger("request:done",H,true)
}).fail(function(){H.trigger("request:done",H,false)
})
},_requestDetails:function(){var G=this;
return this._requestDefaultDetails().then(function(H){return G.loadOnDemandBillingNotifications(H).then(function(I){return C.extend(H,I)
})
})
}})
});