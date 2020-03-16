UPM.define("PurchasedAddonsCollection",["jquery","brace","PurchasedAddonModel","UpmContextPathMixin"],function(D,B,C,A){return B.Collection.extend({mixins:[A],model:C,url:function(){return this.getContextPath()+"/rest/plugins/1.0/purchased/available"
}})
});