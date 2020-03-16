UPM.define("UpdateCheckResultsModel",["brace"],function(A){return A.Model.extend({namedAttributes:["compatible","incompatible","recentVersion","resourceUrl","targetVersion","unknown","updateRequired","updateRequiredAfterProductUpdate"],url:function(){return this.getResourceUrl()
},fetchResults:function(C,B,D){this.setResourceUrl(C);
this.setTargetVersion(B);
this.setRecentVersion(D);
return this.fetch()
}})
});