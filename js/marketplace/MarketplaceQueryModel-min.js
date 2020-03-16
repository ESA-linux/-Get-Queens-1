UPM.define("MarketplaceQueryModel",["underscore","brace","UpmStrings"],function(A,C,B){var D=10;
return C.Model.extend({namedEvents:["refresh","single","search"],namedAttributes:["filter","key","parameters","query"],defaults:{filter:"featured",parameters:{"start-index":0,cost:"",category:""}},resetPaginationAndSetSearchParams:function(E,F){if(!F){F={}
}else{if(A.isArray(F)){F=this.getParametersAsObject(F)
}}this._setSearchParams(E,A.extend({},this.defaults.parameters,F))
},_setSearchParams:function(E,G,H){var F={filter:E,parameters:A.omit(G,"q"),query:G.q};
this.set(this._getAttributesToChange(F));
this.triggerSearch(this.changedAttributes(),H)
},setKeyParameter:function(E){this.setKey(E);
this.triggerSingle(this.changedAttributes())
},getAsQueryParamsObject:function(){var F=this.getParameters(),E=B["upm.install.all.categories.dropdown"];
return A.extend({},(F.category!==undefined)&&(F.category!=="")&&(F.category!==E)?{category:F.category}:{},(F.cost!==undefined)&&(F.cost!=="")?{cost:F.cost}:{},(F["start-index"]>0)?{"start-index":F["start-index"],offset:F["start-index"]}:{},(this.getQuery()!==undefined)&&(this.getQuery()!=="")?{q:this.getQuery()}:{})
},getPaginationRequestParameters:function(){return A.pick(this.getAsQueryParamsObject(),"start-index","max-results","offset")
},loadNextPage:function(){var F=this.getParameters()["start-index"]+D,E=A.extend({},this.getParameters(),{"start-index":F},this.getQuery()?{q:this.getQuery()}:{});
this._setSearchParams(this.getFilter(),E,{update:true})
},_getAttributesToChange:function(F){var E=this.changedAttributes(F);
if(E.query){F.filter="search"
}else{if(F.filter&&F.filter!=="search"){F.query=""
}}if(F.filter==="search"){F.parameters=A.pick(F.parameters,"start-index");
if(F.query===""){F.filter="featured"
}}return F
},getParametersAsObject:function(E){return A.object(A.pluck(E,"name"),A.pluck(E,"value"))
}})
});