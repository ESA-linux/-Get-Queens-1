UPM.define("AddonPricingModel",["jquery","underscore","brace","UpmEnvironment","UpmPricing"],function(D,B,C,A,E){return C.Model.extend({namedAttributes:["_links","items","freePricingItem","expertDiscountOptOut","contactSalesForAdditionalPricing","parent","lastModified","status","default","hasPublishedPrices","canChangePrices","role"],getPricingDescription:function(G){if(this.isRoleBased()){return this.getRoleBasedPricingDescription(G,false)
}else{if(this.getItems()&&this.getItems().length){var H=G.getLicenseDetails()&&G.getLicenseDetails().renewable,F=E.findActiveNonRoleBasedTier(this.getItems());
return F?E.getPricingDescription(F,{renewal:H,dataCenter:this.isDataCenter(G)}):null
}else{return null
}}},getRoleBasedPricingDescription:function(G,H){if(this.isRoleBased()){var F=E.findAvailableRoleBasedTiers(this.getItems(),G);
return E.getRoleBasedPricingDescription(F,this.getRole(),H)
}},isRoleBased:function(){return !!this.getRole()
},isDataCenter:function(F){return A.isDataCenter()&&!!F.getStatusDataCenterCompatible()
}})
});