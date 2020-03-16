UPM.define("MarketplaceMostRequestedAddonCollection",["underscore","brace","UpmHostStatusMixin","MarketplaceMostRequestedAddonModel","UpmContextPathMixin"],function(B,C,D,E,A){return C.Collection.extend({mixins:[D,A],model:E,url:function(){return this.getContextPath()+"/rest/plugins/1.0/requests"
},initialize:function(){this._bindHostStatus()
},search:function(F){return this.fetch({data:F.getPaginationRequestParameters()})
},parse:function(F){return F.plugins
}})
});