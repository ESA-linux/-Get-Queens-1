UPM.define("RoleBasedPricingDialog",["underscore","UpmDialog","UpmPricing","RoleBasedPricingDialogTemplate","AddonActions"],function(C,B,F,E,A){function G(H){if(H===100){return"101+"
}else{if(H===10000){return"10000+"
}else{return"Unlimited"
}}}function D(I,H){return C.extend({},H,{description:F.getPricingDescription(H,{truncated:true}),unitCount:H.unitCount===-1?G(I):H.unitCount})
}return B.extend({template:E,_getData:function(){var H=this.model.getLicenseDetails(),K=this.model.pricingModel,I=F.findAvailableRoleBasedTiers(K.getItems(),this.model),N=H&&H.maximumNumberOfUsers,L=(this.options.action&&N)?F.findTiersAboveUnitCount(I,N):I,J=Math.max.apply(this,C.map(I,function(O){return O.unitCount
})),M=K.getContactSalesForAdditionalPricing()&&J;
return{plugin:this.model.toJSON(),tiers:C.map(L,C.partial(D,J)),action:this.options.action.key,allowFreeTrial:this.model.hasLink("try")||this.model.hasLink("trial-subscribe"),morePricingOverUnitCount:M,roleNamePlural:(H&&H.typeI18nPlural)||K.getRole().pluralName.toLowerCase()}
},_postRender:function(){var H=this;
this.$el.find("a.role-free-trial").on("click",function(I){I.preventDefault();
H.close();
H.deferredResult.resolve({action:A.TRY})
})
},_getReturnValue:function(){return{action:this.options.action,users:this.$el.find('.rbp-pricing-list input[name="rbp-pricing-element"]:checked').val()}
}})
});