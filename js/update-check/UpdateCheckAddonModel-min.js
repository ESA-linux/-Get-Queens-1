UPM.define("UpdateCheckAddonModel",["jquery","underscore","InstalledAddonModel","EnableDisableAddonMixin"],function(C,A,D,B){return D.extend({mixins:[B],namedAttributes:A.keys(D.prototype.namedAttributes).concat(["installedVersion"]),url:function(){return this.getLinks().self
},getActionState:function(E){return this.isEnableOrDisableActionAllowed(E)
}})
});