UPM.define("InstalledAddonModel",["jquery","underscore","AddonActions","AddonModel","UpmEnvironment","UpmLicenseInfo"],function(E,C,B,F,A,D){return F.extend({namedAttributes:C.keys(F.prototype.namedAttributes).concat(["applicationKey","applicationPluginType","enabled","enabledByDefault","incompatible","licenseReadOnly","modules","optional","pacResponse","primaryAction","remotable","static","unloadable","unrecognisedModuleTypes","updatableToPaid","update","updateAvailable","userInstalled"]),url:function(){return A.pathToInstalledAddonByKey(this.getKey())
},canSendVendorFeedback:function(){return this.hasLink("vendor-feedback")
},getEulaUrl:function(){return this.getLinks().eula||(this.getVersionDetails()&&this.getVersionDetails().eulaUrl)
},getLinkOrPacResponseLink:function(G){return(this.getPacResponse()&&this.getPacResponse().links&&this.getPacResponse().links[G])||this.getLinks()[G]
},getPricing:function(){return this.getVersionDetails()&&this.getVersionDetails().pricing
},getVersionDetails:function(){return this.getPacResponse()&&this.getPacResponse().versionDetails
},getAvailableUpdate:function(){return(this.getPacResponse()&&this.getPacResponse().update)||this.getUpdate()
},hasRoleBasedPricing:function(){return D.isRoleBasedLicense(this.getLicenseDetails())||(this.pricingModel&&this.pricingModel.isRoleBased())
},isActionRequired:function(){return this.getPrimaryAction()&&this.getPrimaryAction().actionRequired
},isApplicationPlugin:function(){return !!this.getApplicationPluginType()
},isAtlassianConnect:function(){return this.getRemotable()
},isInstalled:function(){return true
},isUnsubscribed:function(){var G=this.getLicenseDetails();
return G&&G.subscription&&(G.valid||(!G.active&&!G.evaluation))&&!G.autoRenewal
},isUpdatable:function(){return this.hasLink("update-details")&&(this.hasLink("binary")||this.hasLink("update-descriptor"))
},retrieveLicense:function(){var G=this;
return E.ajax({type:"POST",url:this.getLinks()["check-license"],contentType:A.getContentType()}).then(function(H){A.refreshNotifications();
return G.refresh().then(function(){return H
})
}).promise()
},_refreshSummary:function(){var G=this;
return this._requestSummary().done(function(H){G.set(H)
})
},_requestDetails:function(){var G=this;
return this._requestSummary().then(function(H){if(H.links["pac-details"]){return E.ajax({type:"get",cache:false,url:H.links["pac-details"],dataType:"json"}).then(function(I){return C.extend(H,{pacResponse:I})
}).then(function(I){return G.loadOnDemandBillingNotifications(I).then(function(J){return C.extend(I,J)
})
})
}else{return H
}})
},_requestSummary:function(){var G=this;
return this._requestDefaultDetails().then(function(H){return E.ajax({type:"get",cache:false,url:A.pathToInstalledMarketplaceAddonByKey(G.getKey()),dataType:"json"}).then(function(I){return C.extend(H,I,{links:C.extend({},I.links,H.links)})
})
})
},toJSON:function(){return C.extend({},F.prototype.toJSON.apply(this),{roleBased:this.hasRoleBasedPricing(),unsubscribed:this.isUnsubscribed(),updatable:this.isUpdatable()})
}})
});