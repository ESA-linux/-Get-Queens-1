(function(F){var R=this;
var Z=R.requirejs,G=R.require,J=R.define,P,M,E;
var K,A,O,Q,D={},C={},X={},U={},N=Object.prototype.hasOwnProperty,L=[].slice;
function Y(a,b){return N.call(a,b)
}function S(d,b){var n,h,f,k,e,p,q,m,l,g,o=b&&b.split("/"),c=X.map,a=(c&&c["*"])||{};
if(d&&d.charAt(0)==="."){if(b){o=o.slice(0,o.length-1);
d=o.concat(d.split("/"));
for(m=0;
m<d.length;
m+=1){g=d[m];
if(g==="."){d.splice(m,1);
m-=1
}else{if(g===".."){if(m===1&&(d[2]===".."||d[0]==="..")){break
}else{if(m>0){d.splice(m-1,2);
m-=2
}}}}}d=d.join("/")
}else{if(d.indexOf("./")===0){d=d.substring(2)
}}}if((o||a)&&c){n=d.split("/");
for(m=n.length;
m>0;
m-=1){h=n.slice(0,m).join("/");
if(o){for(l=o.length;
l>0;
l-=1){f=c[o.slice(0,l).join("/")];
if(f){f=f[h];
if(f){k=f;
e=m;
break
}}}}if(k){break
}if(!p&&a&&a[h]){p=a[h];
q=m
}}if(!k&&p){k=p;
e=q
}if(k){n.splice(0,e,k);
d=n.join("/")
}}return d
}function W(a,b){return function(){return A.apply(F,L.call(arguments,0).concat([a,b]))
}
}function T(a){return function(b){return S(b,a)
}
}function H(a){return function(b){D[a]=b
}
}function I(b){if(Y(C,b)){var a=C[b];
delete C[b];
U[b]=true;
K.apply(F,a)
}if(!Y(D,b)&&!Y(U,b)){throw new Error("No "+b)
}return D[b]
}function V(b){var c,a=b?b.indexOf("!"):-1;
if(a>-1){c=b.substring(0,a);
b=b.substring(a+1,b.length)
}return[c,b]
}O=function(b,a){var c,e=V(b),d=e[0];
b=e[1];
if(d){d=S(d,a);
c=I(d)
}if(d){if(c&&c.normalize){b=c.normalize(b,T(a))
}else{b=S(b,a)
}}else{b=S(b,a);
e=V(b);
d=e[0];
b=e[1];
if(d){c=I(d)
}}return{f:d?d+"!"+b:b,n:b,pr:d,p:c}
};
function B(a){return function(){return(X&&X.config&&X.config[a])||{}
}
}Q={require:function(a){return W(a)
},exports:function(a){var b=D[a];
if(typeof b!=="undefined"){return b
}else{return(D[a]={})
}},module:function(a){return{id:a,uri:"",exports:D[a],config:B(a)}
}};
K=function(b,l,k,j){var d,h,e,a,c,f=[],g;
j=j||b;
if(typeof k==="function"){l=!l.length&&k.length?["require","exports","module"]:l;
for(c=0;
c<l.length;
c+=1){a=O(l[c],j);
h=a.f;
if(h==="require"){f[c]=Q.require(b)
}else{if(h==="exports"){f[c]=Q.exports(b);
g=true
}else{if(h==="module"){d=f[c]=Q.module(b)
}else{if(Y(D,h)||Y(C,h)||Y(U,h)){f[c]=I(h)
}else{if(a.p){a.p.load(a.n,W(j,true),H(h),{});
f[c]=D[h]
}else{throw new Error(b+" missing "+h)
}}}}}}e=k.apply(D[b],f);
if(b){if(d&&d.exports!==F&&d.exports!==D[b]){D[b]=d.exports
}else{if(e!==F||!g){D[b]=e
}}}}else{if(b){D[b]=k
}}};
P=M=A=function(d,e,a,b,c){if(typeof d==="string"){if(Q[d]){return Q[d](e)
}return I(O(d,e).f)
}else{if(!d.splice){X=d;
if(e.splice){d=e;
e=a;
a=null
}else{d=F
}}}e=e||function(){};
if(typeof a==="function"){a=b;
b=c
}if(b){K(F,d,e,a)
}else{setTimeout(function(){K(F,d,e,a)
},4)
}return A
};
A.config=function(a){X=a;
if(X.deps){A(X.deps,X.callback)
}return A
};
E=function(a,b,c){if(!b.splice){c=b;
b=[]
}if(!Y(D,a)&&!Y(C,a)){C[a]=[a,b,c]
}};
P.noConflict=function(){R.requirejs=Z;
R.require=G;
return{require:this,requirejs:this,define:E.noConflict()}
};
E.noConflict=function(){R.define=J;
return this
};
E.amd={jQuery:true};
R.define=E;
R.require=M;
R.requirejs=P
}());