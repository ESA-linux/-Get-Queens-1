UPM.define("MarketplacePricingView",["jquery","underscore","BaseView","MarketplacePricingTemplate"],function(D,B,C,A){return C.extend({template:A,events:{"click a.pricing-tier-display":"_onClickPricingTierAction"},_initEvents:function(){var E=this;
if(this.model.getPricingUrl()){this.loading=true;
this.model.loadPricingModel().done(function(F){E.loading=false;
E.render()
}).fail(function(){E.loading=false;
E.unavailable=true;
E.render()
})
}},_getData:function(){return{loading:this.loading||false,unavailable:this.unavailable||false,plugin:this.model.toJSON(),pricingDescHtml:this.model.pricingModel&&this.model.pricingModel.getPricingDescription(this.model),roleBased:this.model.pricingModel&&this.model.pricingModel.isRoleBased()}
},_onClickPricingTierAction:function(E){E.preventDefault();
this.model.signalAction(this.model.getDefaultPurchaseAction())
}})
});