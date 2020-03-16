UPM.define("ManageAddonDetailsView",["jquery","brace","AddonActions","AddonActionsViewMixin","AddonModuleModel","AddonModuleView","AddonScreenshotsView","BaseCollectionView","BaseView","CommonInstallAndLicensingFlows","InstallOrLicenseResultDialog","LicenseDetailsView","LicenseUpdatedMessageTemplate","ManageAddonDetailsTemplate","UnsubscribedMessageTemplate","UpmFormats","UpmMessageView","UpmPricing","UpmStrings"],function(C,Q,F,A,J,R,E,K,P,L,M,I,B,S,N,H,O,D,G){return P.extend({mixins:[A],template:S,events:{"click .role-full-pricing-link":"_onPricingLinkClicked","click .upm-module-toggle":"_onModulesToggleClicked","click .app-crossgrade-link":"_onAppCrossgradeClicked"},_initEvents:function(){this.listenTo(this.model,"change",this.render,this);
this.listenTo(this.model,"error",this.showError);
this.listenTo(this.model,"message",this.showMessage);
this.listenTo(this.model,"licenseUpdated",this._onLicenseUpdated);
this.listenTo(this.model,"uninstalled",this._onUninstalled)
},_getData:function(){var U,T;
if(this.model.pricingModel){if(this.model.pricingModel.isRoleBased()){U=this.model.pricingModel.getRoleBasedPricingDescription(this.model,true)
}else{T=this.model.pricingModel.getPricingDescription(this.model)
}}return{plugin:this.model.toJSON(),primaryMessageType:this._getPrimaryMessageType(),pricingDescriptionHtml:U,pricingSummaryHtml:T}
},showMessage:function(T){if(T){this._getMessageContainer().append((new O({model:T})).render().$el);
UPM.trace("addon-inline-message")
}},showUnsubscribedMessage:function(V,U){var T=N({plugin:this.model.toJSON(),active:V,trial:U});
this.model.triggerMessage({type:"warning",message:T})
},_canBePrimaryAction:function(U,T){switch(U){case F.CONFIGURE:case F.DISABLE:case F.ENABLE:case F.TRIAL_UNSUBSCRIBE:case F.UNINSTALL:case F.UNSUBSCRIBE:return false;
default:return true
}},_getMessageContainer:function(){return this.$el.find(".upm-message-container")
},_getModulesContainer:function(){return this.$el.find("div.upm-plugin-modules")
},_getPrimaryMessageType:function(){var T=this.model.getLicenseDetails();
if(T&&T.subscription){if(T.subscription&&T.subscriptionTrialResumable){return"resume_trial"
}else{if(T.subscription&&T.subscribable){return"subscribe"
}}}if(this.model.getPrimaryAction()){return this.model.getPrimaryAction().name
}if(T){if(T.error==="EXPIRED"){return"eval_recently_expired"
}else{if(T.error==="VERSION_MISMATCH"){return"maintenance_recently_expired"
}else{if(T.evaluation){return"eval_nearly_expired"
}}}}if(this.model.hasLink("trial-subscribe")||this.model.hasLink("try")){return"unlicensed_marketplace"
}if(this.model.isUpdatable()){return"updatable"
}if(this.model.hasLink("post-install")){return"get_started"
}return null
},_getActionsOrder:function(){return this.model._getActionsOrder()
},_shouldShowActionAsLink:function(U,T){return false
},_shouldShowDisabledActionsWithReasons:function(){return true
},_onLicenseUpdated:function(U,V){var X=this.model.getLicenseDetails(),a=U?U.enabled:true,W=this.model.getEnabled(),Z=!V&&this.model.hasLicense()&&(!U||!U.licenseDetails),Y,T;
Y=B({plugin:this.model.toJSON(),propertiesBeforeLicenseUpdate:U,isNewlyCreatedLicense:Z}).trim();
if(Y){T="success";
if((a&&!W)||(!W&&X&&X.valid)||(X&&!X.valid)){T="warning"
}this.model.triggerMessage({type:T,message:Y,closeAfter:5})
}if(Z&&X&&X.valid&&W){if(this.model.getLinks()["post-install"]){new M({model:this.model,isUpdate:false,nextAction:"get-started",updateForDisabledPlugin:false})
}}},_onModulesToggleClicked:function(U){var T=!this._getModulesContainer().hasClass("expanded");
U.preventDefault();
C(U.target).blur();
if(T&&!this._getModulesContainer().hasClass("loaded")){this._renderModules()
}this.$el.find(".upm-plugin-modules, li.upm-module-present").toggleClass("expanded",T)
},_onPricingLinkClicked:function(T){T.preventDefault();
L.openRoleBasedPricingDialog(this.model,this.model.getDefaultPurchaseAction())
},_onAppCrossgradeClicked:function(T){T.preventDefault();
this.model.signalAction(F.CROSSGRADE)
},_onUninstalled:function(){this.$el.find(".aui-button").addClass("disabled").prop("disabled",true).attr("aria-disabled",true);
this.$el.find("div.upm-plugin-modules").remove();
this.$el.find("a.upm-module-toggle").replaceWith(this.$el.find("a.upm-module-toggle span.upm-count-enabled"));
this.$el.find(".upm-plugin-pac-links a").parent("li").remove()
},_postRender:function(){var T=this;
if(this.model.isLicenseUpdatable()||this.model.getLicenseDetails()){var U=new I({model:this.model}).render();
this.$el.find(".upm-plugin-license-container").append(U.$el)
}this._renderActionButtons(this.$el.find(".upm-plugin-actions"));
if(!this.model.isAtlassianConnect()&&this.model.getModules()&&this.model.getModules().length){this._setupModules()
}if(this.model.getPacResponse()){this._renderMarketplaceInfo()
}else{this.model.loadDetails().done(function(){T._renderMarketplaceInfo()
})
}},_renderMarketplaceInfo:function(){if((this.model.getScreenshots()&&this.model.getScreenshots().length)||(this.model.getHighlights()&&this.model.getHighlights().length)){this.$el.find(".screenshots-container").empty().append(new E({model:this.model}).render().$el)
}},_renderModules:function(){var T=new K({el:this._getModulesContainer().find(".upm-module-container"),collection:this.modulesCollection,itemView:R});
T.render();
this.listenTo(this.modulesCollection,"change:enabled",this._updateModuleEnabledState);
this.listenTo(this.modulesCollection,"message",function(U){this.model.triggerMessage(U)
});
this._getModulesContainer().addClass("loaded")
},_setupModules:function(){this.modulesCollection=new Q.Collection(this.model.getModules(),{model:J});
this._showModulesEnabledCount();
this._showModulesBrokenCount()
},_showModulesEnabledCount:function(){this.$el.find(".upm-count-enabled").html(H.format(G["upm.plugin.modules.count.enabled"],this.modulesCollection.filter(function(T){return T.getEnabled()
}).length,this.modulesCollection.size()))
},_showModulesBrokenCount:function(){var T=0!=this.modulesCollection.where({broken:true}).length,U=AJS.$(this.$el).find(".upm-modules-broken");
if(T&&C.isFunction(U.tooltip)){U.tooltip({gravity:"s"})
}U.toggleClass("upm-has-modules-broken",T)
},_updateModuleEnabledState:function(T){var U=H.format(G[T.getEnabled()?"upm.messages.module.enable.success":"upm.messages.module.disable.success"],H.htmlEncode(T.getName()));
this.model.triggerMessage({type:T.getEnabled()?"success":"info",message:U,closeAfter:5});
this._showModulesEnabledCount();
this._showModulesBrokenCount()
}})
});