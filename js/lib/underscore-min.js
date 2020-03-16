(function(){var W=this;
var K=W._;
var d={};
var c=Array.prototype,F=Object.prototype,R=Function.prototype;
var g=c.push,O=c.slice,Y=c.concat,D=F.toString,J=F.hasOwnProperty;
var k=c.forEach,Q=c.map,e=c.reduce,C=c.reduceRight,B=c.filter,b=c.every,P=c.some,N=c.indexOf,L=c.lastIndexOf,U=Array.isArray,E=Object.keys,f=R.bind;
var l=function(m){if(m instanceof l){return m
}if(!(this instanceof l)){return new l(m)
}this._wrapped=m
};
if(typeof exports!=="undefined"){if(typeof module!=="undefined"&&module.exports){exports=module.exports=l
}exports._=l
}else{W._=l
}l.VERSION="1.4.4";
var h=l.each=l.forEach=function(r,q,p){if(r==null){return 
}if(k&&r.forEach===k){r.forEach(q,p)
}else{if(r.length===+r.length){for(var o=0,m=r.length;
o<m;
o++){if(q.call(p,r[o],o,r)===d){return 
}}}else{for(var n in r){if(l.has(r,n)){if(q.call(p,r[n],n,r)===d){return 
}}}}}};
l.map=l.collect=function(p,o,n){var m=[];
if(p==null){return m
}if(Q&&p.map===Q){return p.map(o,n)
}h(p,function(s,q,r){m[m.length]=o.call(n,s,q,r)
});
return m
};
var G="Reduce of empty array with no initial value";
l.reduce=l.foldl=l.inject=function(q,p,m,o){var n=arguments.length>2;
if(q==null){q=[]
}if(e&&q.reduce===e){if(o){p=l.bind(p,o)
}return n?q.reduce(p,m):q.reduce(p)
}h(q,function(t,r,s){if(!n){m=t;
n=true
}else{m=p.call(o,m,t,r,s)
}});
if(!n){throw new TypeError(G)
}return m
};
l.reduceRight=l.foldr=function(s,p,m,o){var n=arguments.length>2;
if(s==null){s=[]
}if(C&&s.reduceRight===C){if(o){p=l.bind(p,o)
}return n?s.reduceRight(p,m):s.reduceRight(p)
}var r=s.length;
if(r!==+r){var q=l.keys(s);
r=q.length
}h(s,function(v,t,u){t=q?q[--r]:--r;
if(!n){m=s[t];
n=true
}else{m=p.call(o,m,s[t],t,u)
}});
if(!n){throw new TypeError(G)
}return m
};
l.find=l.detect=function(p,o,n){var m;
a(p,function(s,q,r){if(o.call(n,s,q,r)){m=s;
return true
}});
return m
};
l.filter=l.select=function(p,o,n){var m=[];
if(p==null){return m
}if(B&&p.filter===B){return p.filter(o,n)
}h(p,function(s,q,r){if(o.call(n,s,q,r)){m[m.length]=s
}});
return m
};
l.reject=function(o,n,m){return l.filter(o,function(r,p,q){return !n.call(m,r,p,q)
},m)
};
l.every=l.all=function(p,o,n){o||(o=l.identity);
var m=true;
if(p==null){return m
}if(b&&p.every===b){return p.every(o,n)
}h(p,function(s,q,r){if(!(m=m&&o.call(n,s,q,r))){return d
}});
return !!m
};
var a=l.some=l.any=function(p,o,n){o||(o=l.identity);
var m=false;
if(p==null){return m
}if(P&&p.some===P){return p.some(o,n)
}h(p,function(s,q,r){if(m||(m=o.call(n,s,q,r))){return d
}});
return !!m
};
l.contains=l.include=function(n,m){if(n==null){return false
}if(N&&n.indexOf===N){return n.indexOf(m)!=-1
}return a(n,function(o){return o===m
})
};
l.invoke=function(o,p){var m=O.call(arguments,2);
var n=l.isFunction(p);
return l.map(o,function(q){return(n?p:q[p]).apply(q,m)
})
};
l.pluck=function(n,m){return l.map(n,function(o){return o[m]
})
};
l.where=function(n,m,o){if(l.isEmpty(m)){return o?null:[]
}return l[o?"find":"filter"](n,function(q){for(var p in m){if(m[p]!==q[p]){return false
}}return true
})
};
l.findWhere=function(n,m){return l.where(n,m,true)
};
l.max=function(p,o,n){if(!o&&l.isArray(p)&&p[0]===+p[0]&&p.length<65535){return Math.max.apply(Math,p)
}if(!o&&l.isEmpty(p)){return -Infinity
}var m={computed:-Infinity,value:-Infinity};
h(p,function(t,q,s){var r=o?o.call(n,t,q,s):t;
r>=m.computed&&(m={value:t,computed:r})
});
return m.value
};
l.min=function(p,o,n){if(!o&&l.isArray(p)&&p[0]===+p[0]&&p.length<65535){return Math.min.apply(Math,p)
}if(!o&&l.isEmpty(p)){return Infinity
}var m={computed:Infinity,value:Infinity};
h(p,function(t,q,s){var r=o?o.call(n,t,q,s):t;
r<m.computed&&(m={value:t,computed:r})
});
return m.value
};
l.shuffle=function(p){var o;
var n=0;
var m=[];
h(p,function(q){o=l.random(n++);
m[n-1]=m[o];
m[o]=q
});
return m
};
var A=function(m){return l.isFunction(m)?m:function(n){return n[m]
}
};
l.sortBy=function(p,o,m){var n=A(o);
return l.pluck(l.map(p,function(s,q,r){return{value:s,index:q,criteria:n.call(m,s,q,r)}
}).sort(function(t,s){var r=t.criteria;
var q=s.criteria;
if(r!==q){if(r>q||r===void 0){return 1
}if(r<q||q===void 0){return -1
}}return t.index<s.index?-1:1
}),"value")
};
var T=function(r,q,n,p){var m={};
var o=A(q||l.identity);
h(r,function(u,s){var t=o.call(n,u,s,r);
p(m,t,u)
});
return m
};
l.groupBy=function(o,n,m){return T(o,n,m,function(p,q,r){(l.has(p,q)?p[q]:(p[q]=[])).push(r)
})
};
l.countBy=function(o,n,m){return T(o,n,m,function(p,q){if(!l.has(p,q)){p[q]=0
}p[q]++
})
};
l.sortedIndex=function(t,s,p,o){p=p==null?l.identity:A(p);
var r=p.call(o,s);
var m=0,q=t.length;
while(m<q){var n=(m+q)>>>1;
p.call(o,t[n])<r?m=n+1:q=n
}return m
};
l.toArray=function(m){if(!m){return[]
}if(l.isArray(m)){return O.call(m)
}if(m.length===+m.length){return l.map(m,l.identity)
}return l.values(m)
};
l.size=function(m){if(m==null){return 0
}return(m.length===+m.length)?m.length:l.keys(m).length
};
l.first=l.head=l.take=function(p,o,m){if(p==null){return void 0
}return(o!=null)&&!m?O.call(p,0,o):p[0]
};
l.initial=function(p,o,m){return O.call(p,0,p.length-((o==null)||m?1:o))
};
l.last=function(p,o,m){if(p==null){return void 0
}if((o!=null)&&!m){return O.call(p,Math.max(p.length-o,0))
}else{return p[p.length-1]
}};
l.rest=l.tail=l.drop=function(p,o,m){return O.call(p,(o==null)||m?1:o)
};
l.compact=function(m){return l.filter(m,l.identity)
};
var X=function(n,o,m){h(n,function(p){if(l.isArray(p)){o?g.apply(m,p):X(p,o,m)
}else{m.push(p)
}});
return m
};
l.flatten=function(n,m){return X(n,m,[])
};
l.without=function(m){return l.difference(m,O.call(arguments,1))
};
l.uniq=l.unique=function(s,r,q,p){if(l.isFunction(r)){p=q;
q=r;
r=false
}var n=q?l.map(s,q,p):s;
var o=[];
var m=[];
h(n,function(u,t){if(r?(!t||m[m.length-1]!==u):!l.contains(m,u)){m.push(u);
o.push(s[t])
}});
return o
};
l.union=function(){return l.uniq(Y.apply(c,arguments))
};
l.intersection=function(n){var m=O.call(arguments,1);
return l.filter(l.uniq(n),function(o){return l.every(m,function(p){return l.indexOf(p,o)>=0
})
})
};
l.difference=function(n){var m=Y.apply(c,O.call(arguments,1));
return l.filter(n,function(o){return !l.contains(m,o)
})
};
l.zip=function(){var m=O.call(arguments);
var p=l.max(l.pluck(m,"length"));
var o=new Array(p);
for(var n=0;
n<p;
n++){o[n]=l.pluck(m,""+n)
}return o
};
l.object=function(q,o){if(q==null){return{}
}var m={};
for(var p=0,n=q.length;
p<n;
p++){if(o){m[q[p]]=o[p]
}else{m[q[p][0]]=q[p][1]
}}return m
};
l.indexOf=function(q,o,p){if(q==null){return -1
}var n=0,m=q.length;
if(p){if(typeof p=="number"){n=(p<0?Math.max(0,m+p):p)
}else{n=l.sortedIndex(q,o);
return q[n]===o?n:-1
}}if(N&&q.indexOf===N){return q.indexOf(o,p)
}for(;
n<m;
n++){if(q[n]===o){return n
}}return -1
};
l.lastIndexOf=function(q,o,p){if(q==null){return -1
}var m=p!=null;
if(L&&q.lastIndexOf===L){return m?q.lastIndexOf(o,p):q.lastIndexOf(o)
}var n=(m?p:q.length);
while(n--){if(q[n]===o){return n
}}return -1
};
l.range=function(r,p,q){if(arguments.length<=1){p=r||0;
r=0
}q=arguments[2]||1;
var n=Math.max(Math.ceil((p-r)/q),0);
var m=0;
var o=new Array(n);
while(m<n){o[m++]=r;
r+=q
}return o
};
l.bind=function(o,n){if(o.bind===f&&f){return f.apply(o,O.call(arguments,1))
}var m=O.call(arguments,2);
return function(){return o.apply(n,m.concat(O.call(arguments)))
}
};
l.partial=function(n){var m=O.call(arguments,1);
return function(){return n.apply(this,m.concat(O.call(arguments)))
}
};
l.bindAll=function(n){var m=O.call(arguments,1);
if(m.length===0){m=l.functions(n)
}h(m,function(o){n[o]=l.bind(n[o],n)
});
return n
};
l.memoize=function(o,n){var m={};
n||(n=l.identity);
return function(){var p=n.apply(this,arguments);
return l.has(m,p)?m[p]:(m[p]=o.apply(this,arguments))
}
};
l.delay=function(n,o){var m=O.call(arguments,2);
return setTimeout(function(){return n.apply(null,m)
},o)
};
l.defer=function(m){return l.delay.apply(l,[m,1].concat(O.call(arguments,1)))
};
l.throttle=function(r,t){var p,o,s,m;
var q=0;
var n=function(){q=new Date;
s=null;
m=r.apply(p,o)
};
return function(){var u=new Date;
var v=t-(u-q);
p=this;
o=arguments;
if(v<=0){clearTimeout(s);
s=null;
q=u;
m=r.apply(p,o)
}else{if(!s){s=setTimeout(n,v)
}}return m
}
};
l.debounce=function(o,q,n){var p,m;
return function(){var u=this,t=arguments;
var s=function(){p=null;
if(!n){m=o.apply(u,t)
}};
var r=n&&!p;
clearTimeout(p);
p=setTimeout(s,q);
if(r){m=o.apply(u,t)
}return m
}
};
l.once=function(o){var m=false,n;
return function(){if(m){return n
}m=true;
n=o.apply(this,arguments);
o=null;
return n
}
};
l.wrap=function(m,n){return function(){var o=[m];
g.apply(o,arguments);
return n.apply(this,o)
}
};
l.compose=function(){var m=arguments;
return function(){var n=arguments;
for(var o=m.length-1;
o>=0;
o--){n=[m[o].apply(this,n)]
}return n[0]
}
};
l.after=function(n,m){if(n<=0){return m()
}return function(){if(--n<1){return m.apply(this,arguments)
}}
};
l.keys=E||function(o){if(o!==Object(o)){throw new TypeError("Invalid object")
}var n=[];
for(var m in o){if(l.has(o,m)){n[n.length]=m
}}return n
};
l.values=function(o){var m=[];
for(var n in o){if(l.has(o,n)){m.push(o[n])
}}return m
};
l.pairs=function(o){var n=[];
for(var m in o){if(l.has(o,m)){n.push([m,o[m]])
}}return n
};
l.invert=function(o){var m={};
for(var n in o){if(l.has(o,n)){m[o[n]]=n
}}return m
};
l.functions=l.methods=function(o){var n=[];
for(var m in o){if(l.isFunction(o[m])){n.push(m)
}}return n.sort()
};
l.extend=function(m){h(O.call(arguments,1),function(n){if(n){for(var o in n){m[o]=n[o]
}}});
return m
};
l.pick=function(n){var o={};
var m=Y.apply(c,O.call(arguments,1));
h(m,function(p){if(p in n){o[p]=n[p]
}});
return o
};
l.omit=function(o){var p={};
var n=Y.apply(c,O.call(arguments,1));
for(var m in o){if(!l.contains(n,m)){p[m]=o[m]
}}return p
};
l.defaults=function(m){h(O.call(arguments,1),function(n){if(n){for(var o in n){if(m[o]==null){m[o]=n[o]
}}}});
return m
};
l.clone=function(m){if(!l.isObject(m)){return m
}return l.isArray(m)?m.slice():l.extend({},m)
};
l.tap=function(n,m){m(n);
return n
};
var i=function(t,s,n,o){if(t===s){return t!==0||1/t==1/s
}if(t==null||s==null){return t===s
}if(t instanceof l){t=t._wrapped
}if(s instanceof l){s=s._wrapped
}var q=D.call(t);
if(q!=D.call(s)){return false
}switch(q){case"[object String]":return t==String(s);
case"[object Number]":return t!=+t?s!=+s:(t==0?1/t==1/s:t==+s);
case"[object Date]":case"[object Boolean]":return +t==+s;
case"[object RegExp]":return t.source==s.source&&t.global==s.global&&t.multiline==s.multiline&&t.ignoreCase==s.ignoreCase
}if(typeof t!="object"||typeof s!="object"){return false
}var m=n.length;
while(m--){if(n[m]==t){return o[m]==s
}}n.push(t);
o.push(s);
var v=0,w=true;
if(q=="[object Array]"){v=t.length;
w=v==s.length;
if(w){while(v--){if(!(w=i(t[v],s[v],n,o))){break
}}}}else{var r=t.constructor,p=s.constructor;
if(r!==p&&!(l.isFunction(r)&&(r instanceof r)&&l.isFunction(p)&&(p instanceof p))){return false
}for(var u in t){if(l.has(t,u)){v++;
if(!(w=l.has(s,u)&&i(t[u],s[u],n,o))){break
}}}if(w){for(u in s){if(l.has(s,u)&&!(v--)){break
}}w=!v
}}n.pop();
o.pop();
return w
};
l.isEqual=function(n,m){return i(n,m,[],[])
};
l.isEmpty=function(n){if(n==null){return true
}if(l.isArray(n)||l.isString(n)){return n.length===0
}for(var m in n){if(l.has(n,m)){return false
}}return true
};
l.isElement=function(m){return !!(m&&m.nodeType===1)
};
l.isArray=U||function(m){return D.call(m)=="[object Array]"
};
l.isObject=function(m){return m===Object(m)
};
h(["Arguments","Function","String","Number","Date","RegExp"],function(m){l["is"+m]=function(n){return D.call(n)=="[object "+m+"]"
}
});
if(!l.isArguments(arguments)){l.isArguments=function(m){return !!(m&&l.has(m,"callee"))
}
}if(typeof (/./)!=="function"){l.isFunction=function(m){return typeof m==="function"
}
}l.isFinite=function(m){return isFinite(m)&&!isNaN(parseFloat(m))
};
l.isNaN=function(m){return l.isNumber(m)&&m!=+m
};
l.isBoolean=function(m){return m===true||m===false||D.call(m)=="[object Boolean]"
};
l.isNull=function(m){return m===null
};
l.isUndefined=function(m){return m===void 0
};
l.has=function(n,m){return J.call(n,m)
};
l.noConflict=function(){W._=K;
return this
};
l.identity=function(m){return m
};
l.times=function(r,q,p){var m=Array(r);
for(var o=0;
o<r;
o++){m[o]=q.call(p,o)
}return m
};
l.random=function(n,m){if(m==null){m=n;
n=0
}return n+Math.floor(Math.random()*(m-n+1))
};
var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};
M.unescape=l.invert(M.escape);
var j={escape:new RegExp("["+l.keys(M.escape).join("")+"]","g"),unescape:new RegExp("("+l.keys(M.unescape).join("|")+")","g")};
l.each(["escape","unescape"],function(m){l[m]=function(n){if(n==null){return""
}return(""+n).replace(j[m],function(o){return M[m][o]
})
}
});
l.result=function(m,o){if(m==null){return null
}var n=m[o];
return l.isFunction(n)?n.call(m):n
};
l.mixin=function(m){h(l.functions(m),function(n){var o=l[n]=m[n];
l.prototype[n]=function(){var p=[this._wrapped];
g.apply(p,arguments);
return S.call(this,o.apply(l,p))
}
})
};
var Z=0;
l.uniqueId=function(m){var n=++Z+"";
return m?m+n:n
};
l.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};
var V=/(.)^/;
var H={"'":"'","\\":"\\","\r":"r","\n":"n","\t":"t","\u2028":"u2028","\u2029":"u2029"};
var I=/\\|'|\r|\n|\t|\u2028|\u2029/g;
l.template=function(u,p,o){var n;
o=l.defaults({},o,l.templateSettings);
var q=new RegExp([(o.escape||V).source,(o.interpolate||V).source,(o.evaluate||V).source].join("|")+"|$","g");
var r=0;
var m="__p+='";
u.replace(q,function(w,x,v,z,y){m+=u.slice(r,y).replace(I,function(AA){return"\\"+H[AA]
});
if(x){m+="'+\n((__t=("+x+"))==null?'':_.escape(__t))+\n'"
}if(v){m+="'+\n((__t=("+v+"))==null?'':__t)+\n'"
}if(z){m+="';\n"+z+"\n__p+='"
}r=y+w.length;
return w
});
m+="';\n";
if(!o.variable){m="with(obj||{}){\n"+m+"}\n"
}m="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+m+"return __p;\n";
try{n=new Function(o.variable||"obj","_",m)
}catch(s){s.source=m;
throw s
}if(p){return n(p,l)
}var t=function(v){return n.call(this,v,l)
};
t.source="function("+(o.variable||"obj")+"){\n"+m+"}";
return t
};
l.chain=function(m){return l(m).chain()
};
var S=function(m){return this._chain?l(m).chain():m
};
l.mixin(l);
h(["pop","push","reverse","shift","sort","splice","unshift"],function(m){var n=c[m];
l.prototype[m]=function(){var o=this._wrapped;
n.apply(o,arguments);
if((m=="shift"||m=="splice")&&o.length===0){delete o[0]
}return S.call(this,o)
}
});
h(["concat","join","slice"],function(m){var n=c[m];
l.prototype[m]=function(){return S.call(this,n.apply(this._wrapped,arguments))
}
});
l.extend(l.prototype,{chain:function(){this._chain=true;
return this
},value:function(){return this._wrapped
}})
}).call(this);