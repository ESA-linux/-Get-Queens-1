UPM.define("CommonInstallAndLicensingFlows",["jquery","underscore","AddonActions","DownloadDialog","EvalRedirectConfirmDialogTemplate","InstallConsentDialogTemplate","InstallOrLicenseResultDialog","LicenseContactRequiredDialog","NonDataCenterInstallConfirmDialog","RefreshAfterInstallDialog","RoleBasedPricingDialog","UpdateRequestDialog","UpmAjax","UpmDialog","UpmEnvironment","UpmFormats","UpmHamlet","UpmLongRunningTasks","UpmStrings"],function(C,Y,I,A,S,D,U,F,T,E,O,V,X,a,W,K,Q,Z,J){var P={confirmInstallOrLicenseAction:function(b,c){return b.loadDetails().then(function(){if(!b.isInstalled()){return H(b,c)
}else{return G(b,c)
}})
},openDownloadDialog:function(b){new A({model:b})
},openRenewContactDialog:function(b){b.loadLicenseDetails().done(function(){new F({model:b})
})
},openRoleBasedPricingDialog:function(b,e,d){var c=d&&d.find(".loading");
if(c){c.removeClass("invisible")
}return b.loadDetails().then(function(){return b.loadLicenseDetails()
}).then(function(){return new O({model:b,action:e}).getResult()
}).always(function(){if(c){c.addClass("invisible")
}})
},openUpdateRequestDialog:function(b){var c=W.isDataCenter()&&(!b.getStatusDataCenterCompatible()||!b.getDataCenterCompatible());
new V({model:b,dataCenterIncompatible:c}).getResult().done(function(d){N(b,d.message,d.shareDetails)
})
},showInstallOrUpdateCompletion:function(c,d,f,e,g){var b=e&&g&&!g.enabled&&!d.getEnabled();
if(f&&f.status&&f.status.requiresRefresh){new E();
UPM.trace("requires-refresh-after-install");
return 
}if(d.getEnabledByDefault()&&!d.getEnabled()&&(!e||!b)){c.triggerMessage({type:"error",message:J["upm.messages.install.cannot.enable"],className:e?"update":"install"})
}else{if(d.getUnloadable()){c.triggerMessage({type:"error",message:J["upm.messages.install.unloadable"],className:e?"update":"install"})
}else{c.focus().done(function(){L(c,d,null,e,g)
})
}}},startEvaluation:function(b){P.submitMarketplaceActionToMAC(b,I.TRY);
return C.Deferred().promise()
},crossgradeAppLicense:function(b){var d=b.getLinks(),c=b.getLicenseDetails(),e=W.getHostLicense();
if(d.crossgrade&&c&&e&&W.isDataCenter()){C.ajax({url:b.getLinks()["crossgrade"],type:"post",contentType:"application/json",dataType:"json",success:function(f){if(f&&f.hamletCrossgradeUri){window.location.href=f.hamletCrossgradeUri
}},error:function(f){X.signalAjaxError(f)
}})
}},submitMarketplaceActionToMAC:function(e,d,b,g){var k=C('<form method="post" class="hidden"></form>'),c=e.getLicenseDetails(),f=W.getHostLicense(),h=(c&&c.organizationName)?c.organizationName:(f&&f.organizationName),i=(b&&b!==0)?b:((f&&f.maximumNumberOfUsers)?f.maximumNumberOfUsers:-1),j;
k.attr("action",e.getLinks()[d.legacyKey]);
if(g){k.attr("target","_blank")
}j=Y.extend({callback:e.getLinks()["license-callback"],licensefieldname:"license",users:i},(c&&c.supportEntitlementNumber)?{addon_sen:c.supportEntitlementNumber}:{},h?{organisation_name:h}:{},(c&&c.contactEmail)?{owner:c.contactEmail}:{},f.supportEntitlementNumber?{parent_sen:f.supportEntitlementNumber}:{});
k.append(Y.map(j,function(m,l){return C('<input type="hidden">').attr("name",l).val(m)
}));
k.appendTo(document.body);
k.submit();
k.remove()
}};
function M(b,d){if((d&&d===I.TRY)&&!b.isByAtlassian()&&b.isInstalled()){var c=new a({template:S});
UPM.trace("eval-redirect-dialog");
return c.getResult()
}else{return C.Deferred().resolve()
}}function B(b){if(!b.isByAtlassian()){var c=new a({template:D,data:{plugin:b.toJSON()}});
UPM.trace("install-consent-dialog");
return c.getResult()
}else{return C.Deferred().resolve()
}}function H(b,d){function c(){if(!b.getStatusDataCenterCompatible()&&W.isDataCenter()){return(new T({model:b})).getResult()
}else{return C.Deferred().resolve()
}}return c().then(function(){return B(b)
})
}function G(b,c){return M(b,c)
}function R(c){try{response=JSON.parse(c.responseText);
if(response){var b=(response.errorKey&&J[response.errorKey])||response.error;
if(b){return{errorMessage:b}
}}}catch(d){AJS.log("Failed to parse hamlet response text: "+d)
}return{subCode:"ajaxServerError"}
}function L(f,c,h,k,g){var i,j,d=g&&g.enabled,b=k&&!d&&!c.getEnabled(),e=c.getLinks()[k?"post-update":"post-install"];
if(!c.getIncompatible()&&c.getEnabledByDefault()&&!b){if(c.isLicenseUpdatable()&&!c.getLicenseDetails&&!h){j=(g&&g.updatableToPaid)?"new-license":"manage-license"
}else{if(e){j="get-started"
}}}i=new U({model:c,newLicense:h,isInstall:!k&&!h,isUpdate:k,nextAction:j,updateForDisabledPlugin:b});
UPM.trace("install-result-dialog");
i.getResult().done(function(){switch(j){case"new-license":P.submitMarketplaceActionToMAC(f,I.TRY);
break;
case"manage-license":if(c.getLinks()["plugin-details"]){window.location.href=c.getLinks()["plugin-details"]
}else{f.focus()
}break
}})
}function N(b,d,c){b.submitUpdateRequest(d,c).done(function(){W.refreshNotifications();
b.refresh().done(function(){b.triggerMessage({type:"info",message:J["upm.messages.plugin.update.request.success"]});
UPM.trace("update-request-complete")
})
}).fail(X.signalAjaxError)
}return P
});