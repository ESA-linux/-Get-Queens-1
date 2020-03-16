(function(M,L){if(typeof require!=="undefined"){M=M||require("underscore");
L=L||require("backbone")
}var J=/^\?(.*)/,B=/\((.*?)\)/g,O=/(\(\?)?:\w+/g,I=/\*\w+/g,H=/[\-{}\[\]+?.,\\\^$|#\s]/g,K=/(\?.*)$/,A=/^([^\?]*)/,D=/(\?)[\w-]+=/i,C=/[\:\*]([^\:\?\/]+)/g,G=/^[#\/]|\s+$/g,F=/\/$/;
L.Router.arrayValueSplit="|";
var N=function(R,Q){if(R==null){if(this._hasPushState||!this._wantsHashChange||Q){R=this.location.pathname;
var P=this.root.replace(F,"");
var S=this.location.search;
if(!R.indexOf(P)){R=R.substr(P.length)
}if(S){R+=S
}}else{R=this.getHash()
}}return R.replace(G,"")
};
M.extend(L.History.prototype,{getFragment:function(Q,P){var S=(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState);
var R=N.apply(this,arguments);
if(Q==null&&!D.test(R)){R+=this.location.search
}else{if(S){R=R.replace(K,"")
}}return R
},getQueryParameters:function(R,P){R=N.apply(this,arguments);
var T=R.replace(A,"");
var Q=T.match(J);
if(Q){T=Q[1];
var S={};
E(T,function(U,V){V=decodeURIComponent(V);
if(!S[U]){S[U]=V
}else{if(M.isString(S[U])){S[U]=[S[U],V]
}else{S[U].push(V)
}}});
return S
}else{return{}
}}});
M.extend(L.Router.prototype,{initialize:function(P){this.encodedSplatParts=P&&P.encodedSplatParts
},getFragment:function(Q,P,R){Q=N.apply(this,arguments);
if(R){Q=Q.replace(K,"")
}return Q
},_routeToRegExp:function(Q){var R=(I.exec(Q)||{index:-1}),P=(O.exec(Q)||{index:-1}),T=Q.match(C)||[];
Q=Q.replace(H,"\\$&").replace(B,"(?:$1)?").replace(O,function(V,U){return U?V:"([^\\/\\?]+)"
}).replace(I,"([^?]*?)");
Q+="([?]{1}.*)?";
var S=new RegExp("^"+Q+"$");
if(R.index>=0){if(P>=0){S.splatMatch=R.index-P.index
}else{S.splatMatch=-1
}}S.paramNames=M.map(T,function(U){return U.substring(1)
});
S.namedParameters=this.namedParameters;
return S
},_extractParameters:function(X,V){var R=X.exec(V).slice(1),W={};
if(R.length>0&&M.isUndefined(R[R.length-1])){R.splice(R.length-1,1)
}var U=R.length&&R[R.length-1]&&R[R.length-1].match(J);
if(U){var P=U[1];
var T={};
if(P){var Y=this;
E(P,function(Z,a){Y._setParamValue(Z,a,T)
})
}R[R.length-1]=T;
M.extend(W,T)
}var Q=R.length;
if(X.splatMatch&&this.encodedSplatParts){if(X.splatMatch<0){return R
}else{Q=Q-1
}}for(var S=0;
S<Q;
S++){if(M.isString(R[S])){R[S]=decodeURIComponent(R[S]);
if(X.paramNames&&X.paramNames.length>=S-1){W[X.paramNames[S]]=R[S]
}}}return(L.Router.namedParameters||X.namedParameters)?[W]:R
},_setParamValue:function(R,U,T){var V=R.split(".");
var S=T;
for(var Q=0;
Q<V.length;
Q++){var P=V[Q];
if(Q===V.length-1){S[P]=this._decodeParamValue(U,S[P])
}else{S=S[P]=S[P]||{}
}}},_decodeParamValue:function(S,R){var T=L.Router.arrayValueSplit;
if(T&&S.indexOf(T)>=0){var P=S.split(T);
for(var Q=P.length-1;
Q>=0;
Q--){if(!P[Q]){P.splice(Q,1)
}else{P[Q]=decodeURIComponent(P[Q]).replace(/\+/g," ")
}}return P
}S=decodeURIComponent(S).replace(/\+/g," ");
if(!R){return S
}else{if(M.isArray(R)){R.push(S);
return R
}else{return[R,S]
}}},toFragment:function(Q,P){if(P){if(!M.isString(P)){P=this._toQueryString(P)
}if(P){Q+="?"+P
}}return Q
},_toQueryString:function(R,P){var Y=L.Router.arrayValueSplit;
function T(a){return String(a).replace(Y,encodeURIComponent(Y))
}if(!R){return""
}P=P||"";
var W="";
for(var Q in R){var V=R[Q];
if(M.isString(V)||M.isNumber(V)||M.isBoolean(V)||M.isDate(V)){V=this._toQueryParam(V);
if(M.isBoolean(V)||M.isNumber(V)||V){W+=(W?"&":"")+this._toQueryParamName(Q,P)+"="+T(encodeURIComponent(V))
}}else{if(M.isArray(V)){var X="";
for(var U=0;
U<V.length;
U++){var S=this._toQueryParam(V[U]);
if(M.isBoolean(S)||S){X+=Y+T(S)
}}if(X){W+=(W?"&":"")+this._toQueryParamName(Q,P)+"="+X
}}else{var Z=this._toQueryString(V,this._toQueryParamName(Q,P,true));
if(Z){W+=(W?"&":"")+Z
}}}}return W
},_toQueryParamName:function(P,R,Q){return(R+P+(Q?".":""))
},_toQueryParam:function(P){if(M.isNull(P)||M.isUndefined(P)){return null
}return P
}});
function E(R,Q){var P=R.split("&");
M.each(P,function(T){var S=T.split("=");
if(S.length>1){Q(S[0],S[1])
}})
}})(typeof _==="undefined"?null:_,typeof Backbone==="undefined"?null:Backbone);