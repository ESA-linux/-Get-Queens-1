UPM.define("OsgiBundleDetailsView",["jquery","underscore","BaseView","OsgiBundleDetailsTemplate","OsgiBundleLinkTemplate","OsgiServicesTemplate"],function(F,I,G,A,D,B){function H(K){return I.map(K||{},function(L,M){return{name:M,clauses:I.map(L,J(M))}
})
}function J(K){return function(P){var O,Q,N,L,M;
Q=I.map(P.parameters,function(S,R){return R+": "+((S.length>64)?"[...]":S)
});
if(K==="Import-Package"||K==="DynamicImport-Package"){L="import";
if(P.referencedPackage){M="resolved";
N=C(P.referencedPackage.exportingBundle)
}else{M=P.parameters.resolution=="optional"?"optional":"unresolved"
}}else{if(K==="Export-Package"){L="export";
if(P.referencedPackage){N=I.map(P.referencedPackage.importingBundles,C).join(", ");
M=P.referencedPackage.importingBundles.length?"resolved":"optional"
}else{M="unresolved"
}}}return{path:P.path,paramsSummary:Q.join(", "),referencesHtml:N,referenceType:L,status:M}
}
}function E(K,L){if(!K||!K.length){return""
}else{var M=I.map(K,function(O){var P;
if(L==="registered"){P=I.map(O.usingBundles,C).join(", ")
}else{P=C(O.bundle)
}return{id:O.id,objectClasses:O.objectClasses,referencesHtml:P}
});
var N={services:M,type:L};
return B(N)
}}function C(K){return D({bundle:K})
}return G.extend({_initEvents:function(){this.listenTo(this.model,"change",this.render,this)
},template:A,_getData:function(){return{bundle:this.model.toJSON(),parsedHeaders:H(this.model.getParsedHeaders()),servicesRegisteredHtml:E(this.model.getRegisteredServices(),"registered"),servicesInUseHtml:E(this.model.getServicesInUse(),"in-use")}
}})
});