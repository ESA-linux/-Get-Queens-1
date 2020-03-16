UPM.define("MarketplaceAddonView",["jquery","underscore","AddonView","MarketplaceAddonDetailsView","MarketplaceAddonTemplate","MarketplacePricingView","DownloadDialog","UpmEnvironment","CommonInstallAndLicensingFlows","LicenseContactRequiredDialog","MarketplaceInstallFlow","UpmPricing","AddonActions"],function(F,K,A,H,M,L,I,B,D,G,C,E,J){return A.extend({template:M,detailViewClass:H,_initEvents:function(){A.prototype._initEvents.apply(this);
this.listenTo(this.model,"action",this._onAddonAction)
},_getData:function(){return K.extend(A.prototype._getData.apply(this),{showRequestCount:false})
},_getActionsOrder:function(){return[J.TRY,J.BUY,J.CROSSGRADE,J.UPGRADE,J.RENEW,J.RENEW_CONTACT,J.TRIAL_SUBSCRIBE,J.TRIAL_RESUME,J.SUBSCRIBE,J.INSTALL,J.DOWNLOAD,J.MAKE_REQUEST,J.DISMISS_REQUEST,J.MANAGE]
},_canBePrimaryAction:function(O,N){return(O!==J.MANAGE)&&(N===0)
},_shouldShowActionAsLink:function(O,N){return(N>0)
},_postRender:function(){var P=this,N;
A.prototype._postRender.apply(this);
this.$el.find(".upm-plugin-categories a").hover(function(){F(this).find(".aui-lozenge").removeClass("aui-lozenge-subtle")
},function(){F(this).find(".aui-lozenge").addClass("aui-lozenge-subtle")
});
N=this.$el.find(".pricing");
if(N.length){var O=new L({model:this.model,el:N});
O.render()
}},_onAddonAction:function(Q){var P=this;
function O(){C.installOrLicense(P.model,Q)
}function N(){D.openRoleBasedPricingDialog(P.model,Q,P.$el.find(".pricing-tier-display")).done(function(R){C.installOrLicense(P.model,R.action,R.users)
})
}switch(Q){case J.BUY:case J.UPGRADE:this.model.loadPricingModel().done(function(){if(P.model.hasRoleBasedPricing()){N()
}else{O()
}});
break;
case J.CROSSGRADE:D.crossgradeAppLicense(this.model);
break;
case J.DOWNLOAD:new I({model:this.model});
break;
case J.INSTALL:case J.TRY:case J.RENEW:O();
break;
case J.RENEW_CONTACT:D.openRenewContactDialog(this.model);
break;
case J.MANAGE:window.location.href=this.model.getLinks().manage;
break
}}})
});