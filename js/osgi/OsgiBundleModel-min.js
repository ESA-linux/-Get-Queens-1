UPM.define("OsgiBundleModel",["brace","ExpandableModelMixin"],function(B,A){return B.Model.extend({mixins:[A],namedAttributes:["name","links","location","parsedHeaders","registeredServices","servicesInUse","state","symbolicName","unparsedHeaders","version","hasDetails"],url:function(){return this.getLinks().self
},getDisplayName:function(){return this.getId()+" - "+this.getName()
}})
});