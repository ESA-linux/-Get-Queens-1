UPM.define("ManageAddonModel",["jquery","underscore","AddonActions","EnableDisableAddonMixin","InstalledAddonModel","UpmEnvironment","UpmRequireRestart","UpmStrings","UpmXsrfTokenState"],function(D,G,F,H,E,A,I,C,B){return E.extend({mixins:[H],sendVendorFeedback:function(O,P,M,L,J){var K=this.getLinks()["vendor-feedback"],N={reasonCode:P,message:M,type:O.key.toLowerCase(),pluginVersion:this.getVersion(),email:L,fullName:J};
if(K){return D.ajax({type:"POST",url:K,dataType:"json",contentType:A.getContentType(),data:JSON.stringify(N)})
}},startUpdate:function(){var K=this.getLinks().binary,J,M,L;
M=A.getContentType("install");
L={pluginUri:K,pluginName:this.getName(),pluginVersion:this.getPacResponse().update&&this.getPacResponse().update.version};
J=A.getResourceUrl("install-uri");
if(K){return B.tryWithToken(function(N){return D.ajax({type:"POST",url:J+"?token="+N,dataType:"json",contentType:M,data:JSON.stringify(L)}).promise()
})
}else{this.triggerMessage({type:"error",message:C["upm.messages.update.error"],className:"update"})
}},uninstall:function(){var J=this;
return D.ajax({type:"DELETE",url:this.getLinks()["delete"],dataType:"json",contentType:A.getContentType("json"),}).done(function(K){var L=K&&K.restartState;
if(L){I.addChangeRequiringRestart({action:L,name:J.getName(),key:J.getKey(),links:{self:K.links["change-requiring-restart"]}});
J.setRestartState(L)
}else{J.trigger("uninstalled")
}}).promise()
},_getActionsOrder:function(){var J=(this.getLicenseDetails()&&this.getLicenseDetails().nearlyExpiring);
return[F.UPGRADE,F.CROSSGRADE,F.TRY,F.RENEW,F.RENEW_CONTACT,J?F.BUY:F.UPDATE,J?F.UPDATE:F.BUY,F.CHECK_LICENSE,F.GET_STARTED,F.REQUEST_UPDATE,F.DOWNLOAD,F.CONFIGURE,F.UNINSTALL,F.ENABLE,F.DISABLE]
},getActionState:function(J){switch(J){case F.BUY:return this.hasLink("new");
case F.CHECK_LICENSE:return this.hasLink("check-license");
case F.CONFIGURE:if(this.hasLink("configure")&&this.getEnabled()&&!this.isApplicationPlugin()){if(this.hasLicense()&&!this.getLicenseDetails().valid){return{enabled:this.hasLicense()&&this.getLicenseDetails().valid,disabledReason:"bad-license-cannot-configure"}
}else{return true
}}return false;
case F.CROSSGRADE:return this.hasLink("crossgrade")&&(this.hasLink("upgrade")||this.hasLink("renew")||this.hasLink("renew-requires-contact"));
case F.DISABLE:case F.ENABLE:return this.isEnableOrDisableActionAllowed(J)&&!this.isApplicationPlugin();
case F.DOWNLOAD:return !this.isUpdatable()&&this.hasLink("binary");
case F.GET_STARTED:return this.hasLink("post-install")&&this.getEnabled();
case F.RENEW:return this.hasLink("renew")&&!this.hasLink("crossgrade");
case F.RENEW_CONTACT:return this.hasLink("renew-requires-contact")&&!this.hasLink("crossgrade");
case F.REQUEST_UPDATE:return this.hasLink("request-update");
case F.TRY:return this.hasLink("try");
case F.UNINSTALL:if(this.hasLink("delete")&&!this.isApplicationPlugin()){return true
}else{if(this.isAtlassianConnect()&&this.getLicenseDetails()&&this.getLicenseDetails().autoRenewal){return{enabled:false,disabledReason:"subscribed-cannot-uninstall"}
}else{return false
}}break;
case F.UPDATE:if(this.isUpdatable()){if(A.isSafeMode()){return{enabled:false,disabledReason:"safe-mode"}
}else{if(this.getAvailableUpdate()&&!this.getAvailableUpdate().licenseCompatible){return{enabled:false,disabledReason:"license-incompatible"}
}else{return true
}}}else{return false
}break;
case F.UPGRADE:return this.hasLink("upgrade")&&!this.hasLink("crossgrade")
}return false
},loadDetails:function(){var J=this;
return E.prototype.loadDetails.apply(this).then(function(){return J.loadPricingModel()
})
}})
});