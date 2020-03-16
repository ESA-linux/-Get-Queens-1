UPM.define("MarketplaceAddonCollection",["brace","underscore","UpmHostStatusMixin","UpmContextPathMixin","MarketplaceAddonModel"],function(D,C,E,A,B){return D.Collection.extend({mixins:[E,A],model:B,url:function(){return this.getContextPath()+"/rest/plugins/1.0/available"+(this.filter?("/"+this.filter):"")
},initialize:function(){this._bindHostStatus()
},search:function(F,G){this.filter=!F.getQuery()&&F.getFilter();
return this.fetch({data:F.getAsQueryParamsObject(),remove:!G})
},parse:function(F){return F.plugins
}})
});