UPM.define("ExpandableModelMixin",["jquery","underscore"],function(B,A){return{loadDetails:function(E){var D=this;
if(this.getHasDetails()&&!E){return B.Deferred().resolve().promise()
}else{var C=this._requestDetails?this._requestDetails():this._requestDefaultDetails();
return C.done(function(F){D.mergeAttributes(F,true);
D.set({hasDetails:true},{silent:true})
}).promise()
}},_requestDefaultDetails:function(){return B.ajax({type:"get",cache:false,url:this.url(),dataType:"json"})
},mergeAttributes:function(E,D){var C;
if(this.has("links")){C=A.extend(A.omit(E,"links"),E.links?{links:A.extend({},this.get("links"),A.omit(E.links,"self"))}:{})
}else{C=E
}this.set(C,{silent:D})
}}
});