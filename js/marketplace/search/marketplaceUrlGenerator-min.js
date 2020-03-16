UPM.define("marketplaceUrlGenerator",["underscore","UpmStrings"],function(A,B){var C=["start-index","max-results","offset"];
return{_validateParameter:function(E){var D=B["upm.install.all.categories.dropdown"];
if(E&&E.key&&(E.value||E.value===0)){if(decodeURIComponent(E.value)!==D&&A.indexOf(C,decodeURIComponent(E.key))===-1){return true
}}return false
},_filterInvalidParameters:function(E){var D={};
A.each(E,function(G,F){var H={key:F,value:G};
if(this._validateParameter(H)){D[F]=G
}},this);
return D
},getMarketplaceUrl:function(F){var E,G=F.filter,I=F.query,D=F.parameters;
if(!G||!I&&G==="search"){G="featured"
}if(I&&G!=="search"){G="search"
}E=G;
var H=[];
if(I){H.push("q="+encodeURIComponent(I));
D={}
}if(D){H.push.apply(H,A.map(this._filterInvalidParameters(D),function(K,J){return encodeURIComponent(J)+"="+encodeURIComponent(K)
}))
}if(H.length){E+="?"+H.join("&")
}return E
}}
});