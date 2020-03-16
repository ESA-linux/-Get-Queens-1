UPM.define("MarketplaceMostRequestedAddonModel",["MarketplaceAddonModel","AddonActions"],function(B,A){return B.extend({getActionState:function(C){switch(C){case A.DISMISS_REQUEST:return !this.isInstalled()&&this.hasLink("dismiss-request")&&this.getRequests()&&this.getRequests().length
}return B.prototype.getActionState.apply(this,arguments)
}})
});