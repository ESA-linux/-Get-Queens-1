UPM.define("AddonModel",["jquery","underscore","brace","AddonActions","AddonPricingModel","ExpandableModelMixin","UpmAjax","UpmAnalytics","UpmContextPathMixin","UpmEnvironment","UpmMessageModel","UpmPricing"],function(F,L,J,K,I,C,A,E,G,B,H,D){return J.Model.extend({mixins:[G,C],namedAttributes:["billingNotifications","dataCenterCompatible","statusDataCenterCompatible","description","hamsProductKey","installedVersion","hasDetails","key","licenseDetails","links","logo","name","restartState","usesLicensing","vendor","version"],focus:function(N){var M=F.Deferred();
this.once("focused",function(){M.resolve()
});
this.trigger("focus",this,N);
return M.promise()
},isActionAllowed:function(N){var M=this.getActionState(N);
return(L.isObject(M)&&M.enabled)||M
},isLicenseUpdatable:function(){var M=this.getLinks();
return M&&M["update-license"]
},getActionState:function(M){return false
},getDefaultPurchaseAction:function(){return this.hasLink("upgrade")?K.UPGRADE:K.BUY
},getEulaUrl:function(){return this.getLinks().eula
},getHighlights:function(){return this.getVersionDetails()&&this.getVersionDetails().highlights
},getLinkOrPacResponseLink:function(M){return this.getLinks()[M]
},getPricingUrl:function(){return this.getLinkOrPacResponseLink("pricing")
},getScreenshots:function(){return this.getVersionDetails()&&this.getVersionDetails().screenshots
},getVersionDetails:function(){return null
},hasLicense:function(){return !!this.getLicenseDetails()
},hasLink:function(M){return !!(this.getLinks()[M])
},hasRoleBasedPricing:function(){return this.pricingModel&&this.pricingModel.isRoleBased()
},isAtlassianConnect:function(){return false
},isAutoRenew:function(){return this.getLicenseDetails()&&this.getLicenseDetails().autoRenewal
},isInstalled:function(){return false
},isUpm:function(){return this.getKey()===B.getUpmPluginKey()
},isByAtlassian:function(){return this.getVendor()&&(this.getVendor().name==="Atlassian"||this.getVendor().name==="Atlassian Labs")
},isPaidViaAtlassian:function(){return !!this.getUsesLicensing()
},loadInstalledAddonModel:function(){return F.Deferred().resolve(this)
},loadLicenseDetails:function(){var M=this;
if(this.getLicenseDetails()||!this.getLinks().license){return F.Deferred().resolve(this.getLicenseDetails()).promise()
}else{return F.ajax({url:this.getLinks().license}).then(function(N){if(N&&(N.valid||N.error)){M.setLicenseDetails(N,{silent:true});
return M.loadOnDemandBillingNotifications().then(function(O){if(O){M.set(O,{silent:true})
}return N
})
}return N
}).fail(function(N){M.signalAjaxError(N)
}).promise()
}},loadOnDemandBillingNotifications:function(M){var P=this,O=M?P.clone().clear().set(M):P,N=O.getLinks()["billing-notifications"];
if(N&&B.isPlatformFreeTier()){return A.ajaxViaBillingProxy({url:N,timeout:5000}).then(function(Q){return(Q&&Q.notifications&&Q.notifications.length)?{billingNotifications:Q.notifications}:{}
}).promise()
}else{return F.Deferred().resolve({}).promise()
}},loadPricingModel:function(){if(this.pricingModel){return F.Deferred().resolve(this.pricingModel).promise()
}else{var N=this.getPricingUrl(),O=this;
if(N){var M=F.Deferred();
F.ajax({type:"get",url:N,dataType:"json",error:M.resolve}).then(function(Q){var P=new I(Q);
O.pricingModel=P;
return P
}).done(M.resolve);
return M.promise()
}else{return F.Deferred().resolve().promise()
}}},loadRecommendations:function(){var M=this.getLinks().recommendations;
if(M){return F.ajax({type:"get",cache:false,url:M,dataType:"json"}).then(function(N){return N.recommendations||[]
})
}else{return F.Deferred().resolve([]).promise()
}},logAnalytics:function(N,M){E.logAddonEvent(N,this.getKey(),M)
},refresh:function(){var P=this,O=this.get("hasDetails"),N=this.getKey(),M=this.getLinks();
this.clear({silent:true});
this.set({key:N,links:{self:M.self}},{silent:true});
if(O){return this.loadDetails(true).done(function(){P.trigger("change")
})
}else{return this._refreshSummary()
}},_refreshSummary:function(){return this.fetch()
},signalAction:function(M){this.trigger("action",M,this)
},signalAjaxError:function(M){this.trigger("ajaxError",A.parseErrorResponse(M))
},startOnDemandLicenseUpdate:function(M){return F.ajax({url:this.getLinks()[M.legacyKey],type:"POST",contentType:"application/json",headers:{"X-Atlassian-Token":"no-check"}}).promise()
},submitUpdateRequest:function(N,M){return F.ajax({url:this.getLinks()["request-update"],type:"post",contentType:B.getContentType(),dataType:"text",data:JSON.stringify({message:N,pluginKey:this.getKey(),shareDetails:M})}).fail(L.bind(this.signalAjaxError,this)).promise()
},toJSON:function(){return L.extend({},J.Model.prototype.toJSON.apply(this),{atlassianConnect:this.isAtlassianConnect(),installed:this.isInstalled(),paidViaAtlassian:this.isPaidViaAtlassian(),roleBased:this.hasRoleBasedPricing()})
},toPluginRep:function(){return J.Model.prototype.toJSON.apply(this)
},triggerEventAfterExpanding:function(){this.trigger("expandAndThen",arguments)
},triggerMessage:function(M){this.triggerEventAfterExpanding("message",new H(M))
},updateLicense:function(M){var P=L.extend({},this.getLicenseDetails(),{rawLicense:M}),Q=M&&(M.trim()!==""),O=this.toJSON(),N=this;
return F.ajax({type:Q?"PUT":"DELETE",url:this.getLinks()["update-license"],contentType:B.getContentType(),data:JSON.stringify(P)}).then(function(R){B.refreshNotifications();
return N.refresh().then(function(){N.triggerEventAfterExpanding("licenseUpdated",O);
return R
})
},L.bind(this.signalAjaxError,this)).promise()
}})
});