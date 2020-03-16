UPM.define("PurchasedAddonModel",["jquery","MarketplaceAddonModel","AddonActions"],function(C,B,A){return B.extend({getActionState:function(F){var D=this.isInstalled(),E=this.getRemoteInstallable();
switch(F){case A.INSTALL:return !D&&this.isInstallable();
case A.MANAGE:return D&&this.hasLink("manage")
}return false
}})
});