UPM.define("PurchasedAddonsPageView",["BaseView","jquery","underscore","PurchasedErroneousAddonsTemplate","UpmMessageDisplayingMixin","UpmLongRunningTasks","UpmEnvironment","UpmFormats","UpmStrings"],function(F,E,H,G,I,C,B,A,D){return F.extend({mixins:[I],events:{"click #upm-check-available-licenses":"_onUpdateClick"},_initEvents:function(){this.listenTo(this.model,"sync",this.onSync,this)
},_onUpdateClick:function(J){J.preventDefault();
this.updateLicensesJwt()
},onSync:function(){this.$el.find(".unknown-addons").remove();
this.$el.find(".incompatible-addons").remove();
this.$el.find("#upm-panel-install").addClass("loaded");
var J=B.isMpacAvailable(),K=!!E(".upm-purchased-addons-warning-notice").length;
E("#upm-purchased-addons-header-default").toggleClass("hidden",!J||K);
this._displayErroneousAddonList(this.model.getIncompatibleAddons(),true);
this._displayErroneousAddonList(this.model.getUnknownAddons(),false)
},_displayErroneousAddonList:function(K,J){if(K.length){this._displayMessageElement(G({addons:K,incompatible:J,mpacAvailable:B.isMpacAvailable()}))
}},updateLicenses:function(K,J){E("#upm-purchases-none, #upm-purchases-none-new").addClass("hidden");
E("#upm-install-container-purchases").removeClass("loaded");
return this.model.updateLicenses(K,J).done(H.bind(this._onLicensesUpdated,this))
},updateLicensesJwt:function(){E("#upm-purchases-none, #upm-purchases-none-new").addClass("hidden");
E("#upm-install-container-purchases").removeClass("loaded");
C.startProgress("purchases");
this.model.updateLicensesJwt().always(function(){C.stopProgress(true)
}).done(H.bind(this._onLicensesUpdated,this))
},_onLicensesUpdated:function(J){var K=this.model.getPurchasedAddons().length;
if(!J||!J.length){E(K?"#upm-purchases-none-new":"#upm-purchases-none").removeClass("hidden");
E("#upm-install-purchases .upm-plugin").removeClass("new-license")
}UPM.trace("purchased-addons-updated")
}})
});