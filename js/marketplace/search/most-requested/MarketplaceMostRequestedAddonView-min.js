UPM.define("MarketplaceMostRequestedAddonView",["underscore","brace","MarketplaceAddonView","MarketplaceMostRequestedAddonDetailsView","CollectionItemRenderingStrategy","DismissRequestConfirmDialogTemplate","UpmEnvironment","UpmDialog","UpmStrings","AddonActions"],function(I,G,J,D,E,C,A,F,B,H){return J.extend({detailViewClass:D,renderingStrategy:E,_postRender:function(){J.prototype._postRender.apply(this);
this.listenTo(this.model,"change:installed",this._updateIfInstalled);
this.listenTo(this.model,"change:userInstalled",this._updateIfInstalled);
this.listenTo(this.model,"action",this._handleDismissRequestAction);
this.listenTo(this.model,"dismissedRequest",this._onDismissedRequest)
},_getData:function(){return I.extend(J.prototype._getData.apply(this),{showRequestCount:true})
},_handleDismissRequestAction:function(K){if(K===H.DISMISS_REQUEST){this._dismissRequest()
}},_dismissRequest:function(){var K=new F({template:C}),L=this;
K.getResult().done(function(){L.model.dismissRequest().fail(function(){L.model.triggerMessage({type:"error",message:B["upm.messages.request.dismiss.failure"]})
})
})
},_onDismissedRequest:function(){A.refreshNotifications();
this.removeOnNextCollapse();
this.model.triggerMessage({type:"success",message:B["upm.messages.request.dismiss.success"]})
},_updateIfInstalled:function(){if(this.model.isInstalled()){if(!this.isExpanded()){this._toggleExpanded()
}this.removeOnNextCollapse()
}}})
});