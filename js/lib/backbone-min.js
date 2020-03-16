(function(){var U=this;
var b=U.Backbone;
var G=[];
var d=G.push;
var N=G.slice;
var T=G.splice;
var Z;
if(typeof exports!=="undefined"){Z=exports
}else{Z=U.Backbone={}
}Z.VERSION="1.0.0";
var l=U._;
if(!l&&(typeof require!=="undefined")){l=require("underscore")
}Z.$=U.jQuery||U.Zepto||U.ender||U.$;
Z.noConflict=function(){U.Backbone=b;
return this
};
Z.emulateHTTP=false;
Z.emulateJSON=false;
var j=Z.Events={on:function(m,p,o){if(!X(this,"on",m,[p,o])||!p){return this
}this._events||(this._events={});
var n=this._events[m]||(this._events[m]=[]);
n.push({callback:p,context:o,ctx:o||this});
return this
},once:function(n,q,o){if(!X(this,"once",n,[q,o])||!q){return this
}var m=this;
var p=l.once(function(){m.off(n,p);
q.apply(this,arguments)
});
p._callback=q;
return this.on(n,p,o)
},off:function(m,v,n){var t,u,w,s,r,o,q,p;
if(!this._events||!X(this,"off",m,[v,n])){return this
}if(!m&&!v&&!n){this._events={};
return this
}s=m?[m]:l.keys(this._events);
for(r=0,o=s.length;
r<o;
r++){m=s[r];
if(w=this._events[m]){this._events[m]=t=[];
if(v||n){for(q=0,p=w.length;
q<p;
q++){u=w[q];
if((v&&v!==u.callback&&v!==u.callback._callback)||(n&&n!==u.context)){t.push(u)
}}}if(!t.length){delete this._events[m]
}}}return this
},trigger:function(o){if(!this._events){return this
}var n=N.call(arguments,1);
if(!X(this,"trigger",o,n)){return this
}var p=this._events[o];
var m=this._events.all;
if(p){B(p,n)
}if(m){B(m,arguments)
}return this
},stopListening:function(p,m,r){var n=this._listeners;
if(!n){return this
}var o=!m&&!r;
if(typeof m==="object"){r=this
}if(p){(n={})[p._listenerId]=p
}for(var q in n){n[q].off(m,r,this);
if(o){delete this._listeners[q]
}}return this
}};
var W=/\s+/;
var X=function(t,r,n,q){if(!n){return true
}if(typeof n==="object"){for(var p in n){t[r].apply(t,[p,n[p]].concat(q))
}return false
}if(W.test(n)){var s=n.split(W);
for(var o=0,m=s.length;
o<m;
o++){t[r].apply(t,[s[o]].concat(q))
}return false
}return true
};
var B=function(r,p){var s,q=-1,o=r.length,n=p[0],m=p[1],t=p[2];
switch(p.length){case 0:while(++q<o){(s=r[q]).callback.call(s.ctx)
}return ;
case 1:while(++q<o){(s=r[q]).callback.call(s.ctx,n)
}return ;
case 2:while(++q<o){(s=r[q]).callback.call(s.ctx,n,m)
}return ;
case 3:while(++q<o){(s=r[q]).callback.call(s.ctx,n,m,t)
}return ;
default:while(++q<o){(s=r[q]).callback.apply(s.ctx,p)
}}};
var c={listenTo:"on",listenToOnce:"once"};
l.each(c,function(m,n){j[n]=function(q,o,s){var p=this._listeners||(this._listeners={});
var r=q._listenerId||(q._listenerId=l.uniqueId("l"));
p[r]=q;
if(typeof o==="object"){s=this
}q[m](o,s,this);
return this
}
});
j.bind=j.on;
j.unbind=j.off;
l.extend(Z,j);
var e=Z.Model=function(m,o){var p;
var n=m||{};
o||(o={});
this.cid=l.uniqueId("c");
this.attributes={};
l.extend(this,l.pick(o,f));
if(o.parse){n=this.parse(n,o)||{}
}if(p=l.result(this,"defaults")){n=l.defaults({},n,p)
}this.set(n,o);
this.changed={};
this.initialize.apply(this,arguments)
};
var f=["url","urlRoot","collection"];
l.extend(e.prototype,j,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(m){return l.clone(this.attributes)
},sync:function(){return Z.sync.apply(this,arguments)
},get:function(m){return this.attributes[m]
},escape:function(m){return l.escape(this.get(m))
},has:function(m){return this.get(m)!=null
},set:function(u,m,y){var s,v,w,t,r,x,o,q;
if(u==null){return this
}if(typeof u==="object"){v=u;
y=m
}else{(v={})[u]=m
}y||(y={});
if(!this._validate(v,y)){return false
}w=y.unset;
r=y.silent;
t=[];
x=this._changing;
this._changing=true;
if(!x){this._previousAttributes=l.clone(this.attributes);
this.changed={}
}q=this.attributes,o=this._previousAttributes;
if(this.idAttribute in v){this.id=v[this.idAttribute]
}for(s in v){m=v[s];
if(!l.isEqual(q[s],m)){t.push(s)
}if(!l.isEqual(o[s],m)){this.changed[s]=m
}else{delete this.changed[s]
}w?delete q[s]:q[s]=m
}if(!r){if(t.length){this._pending=true
}for(var p=0,n=t.length;
p<n;
p++){this.trigger("change:"+t[p],this,q[t[p]],y)
}}if(x){return this
}if(!r){while(this._pending){this._pending=false;
this.trigger("change",this,y)
}}this._pending=false;
this._changing=false;
return this
},unset:function(m,n){return this.set(m,void 0,l.extend({},n,{unset:true}))
},clear:function(n){var m={};
for(var o in this.attributes){m[o]=void 0
}return this.set(m,l.extend({},n,{unset:true}))
},hasChanged:function(m){if(m==null){return !l.isEmpty(this.changed)
}return l.has(this.changed,m)
},changedAttributes:function(o){if(!o){return this.hasChanged()?l.clone(this.changed):false
}var q,p=false;
var n=this._changing?this._previousAttributes:this.attributes;
for(var m in o){if(l.isEqual(n[m],(q=o[m]))){continue
}(p||(p={}))[m]=q
}return p
},previous:function(m){if(m==null||!this._previousAttributes){return null
}return this._previousAttributes[m]
},previousAttributes:function(){return l.clone(this._previousAttributes)
},fetch:function(n){n=n?l.clone(n):{};
if(n.parse===void 0){n.parse=true
}var m=this;
var o=n.success;
n.success=function(p){if(!m.set(m.parse(p,n),n)){return false
}if(o){o(m,p,n)
}m.trigger("sync",m,p,n)
};
h(this,n);
return this.sync("read",this,n)
},save:function(q,n,u){var r,m,t,o=this.attributes;
if(q==null||typeof q==="object"){r=q;
u=n
}else{(r={})[q]=n
}if(r&&(!u||!u.wait)&&!this.set(r,u)){return false
}u=l.extend({validate:true},u);
if(!this._validate(r,u)){return false
}if(r&&u.wait){this.attributes=l.extend({},o,r)
}if(u.parse===void 0){u.parse=true
}var p=this;
var s=u.success;
u.success=function(w){p.attributes=o;
var v=p.parse(w,u);
if(u.wait){v=l.extend(r||{},v)
}if(l.isObject(v)&&!p.set(v,u)){return false
}if(s){s(p,w,u)
}p.trigger("sync",p,w,u)
};
h(this,u);
m=this.isNew()?"create":(u.patch?"patch":"update");
if(m==="patch"){u.attrs=r
}t=this.sync(m,this,u);
if(r&&u.wait){this.attributes=o
}return t
},destroy:function(n){n=n?l.clone(n):{};
var m=this;
var q=n.success;
var o=function(){m.trigger("destroy",m,m.collection,n)
};
n.success=function(r){if(n.wait||m.isNew()){o()
}if(q){q(m,r,n)
}if(!m.isNew()){m.trigger("sync",m,r,n)
}};
if(this.isNew()){n.success();
return false
}h(this,n);
var p=this.sync("delete",this,n);
if(!n.wait){o()
}return p
},url:function(){var m=l.result(this,"urlRoot")||l.result(this.collection,"url")||R();
if(this.isNew()){return m
}return m+(m.charAt(m.length-1)==="/"?"":"/")+encodeURIComponent(this.id)
},parse:function(n,m){return n
},clone:function(){return new this.constructor(this.attributes)
},isNew:function(){return this.id==null
},isValid:function(m){return this._validate({},l.extend(m||{},{validate:true}))
},_validate:function(o,n){if(!n.validate||!this.validate){return true
}o=l.extend({},this.attributes,o);
var m=this.validationError=this.validate(o,n)||null;
if(!m){return true
}this.trigger("invalid",this,m,l.extend(n||{},{validationError:m}));
return false
}});
var A=["keys","values","pairs","invert","pick","omit"];
l.each(A,function(m){e.prototype[m]=function(){var n=N.call(arguments);
n.unshift(this.attributes);
return l[m].apply(l,n)
}
});
var C=Z.Collection=function(n,m){m||(m={});
if(m.url){this.url=m.url
}if(m.model){this.model=m.model
}if(m.comparator!==void 0){this.comparator=m.comparator
}this._reset();
this.initialize.apply(this,arguments);
if(n){this.reset(n,l.extend({silent:true},m))
}};
var O={add:true,remove:true,merge:true};
var k={add:true,merge:false,remove:false};
l.extend(C.prototype,j,{model:e,initialize:function(){},toJSON:function(m){return this.map(function(n){return n.toJSON(m)
})
},sync:function(){return Z.sync.apply(this,arguments)
},add:function(n,m){return this.set(n,l.defaults(m||{},k))
},remove:function(r,p){r=l.isArray(r)?r.slice():[r];
p||(p={});
var q,m,o,n;
for(q=0,m=r.length;
q<m;
q++){n=this.get(r[q]);
if(!n){continue
}delete this._byId[n.id];
delete this._byId[n.cid];
o=this.indexOf(n);
this.models.splice(o,1);
this.length--;
if(!p.silent){p.index=o;
n.trigger("remove",n,this,p)
}this._removeReference(n)
}return this
},set:function(n,z){z=l.defaults(z||{},O);
if(z.parse){n=this.parse(n,z)
}if(!l.isArray(n)){n=n?[n]:[]
}var u,q,w,x,o,v;
var p=z.at;
var t=this.comparator&&(p==null)&&z.sort!==false;
var r=l.isString(this.comparator)?this.comparator:null;
var y=[],m=[],s={};
for(u=0,q=n.length;
u<q;
u++){if(!(w=this._prepareModel(n[u],z))){continue
}if(o=this.get(w)){if(z.remove){s[o.cid]=true
}if(z.merge){o.set(w.attributes,z);
if(t&&!v&&o.hasChanged(r)){v=true
}}}else{if(z.add){y.push(w);
w.on("all",this._onModelEvent,this);
this._byId[w.cid]=w;
if(w.id!=null){this._byId[w.id]=w
}}}}if(z.remove){for(u=0,q=this.length;
u<q;
++u){if(!s[(w=this.models[u]).cid]){m.push(w)
}}if(m.length){this.remove(m,z)
}}if(y.length){if(t){v=true
}this.length+=y.length;
if(p!=null){T.apply(this.models,[p,0].concat(y))
}else{d.apply(this.models,y)
}}if(v){this.sort({silent:true})
}if(z.silent){return this
}for(u=0,q=y.length;
u<q;
u++){(w=y[u]).trigger("add",w,this,z)
}if(v){this.trigger("sort",this,z)
}return this
},reset:function(p,n){n||(n={});
for(var o=0,m=this.models.length;
o<m;
o++){this._removeReference(this.models[o])
}n.previousModels=this.models;
this._reset();
this.add(p,l.extend({silent:true},n));
if(!n.silent){this.trigger("reset",this,n)
}return this
},push:function(n,m){n=this._prepareModel(n,m);
this.add(n,l.extend({at:this.length},m));
return n
},pop:function(n){var m=this.at(this.length-1);
this.remove(m,n);
return m
},unshift:function(n,m){n=this._prepareModel(n,m);
this.add(n,l.extend({at:0},m));
return n
},shift:function(n){var m=this.at(0);
this.remove(m,n);
return m
},slice:function(n,m){return this.models.slice(n,m)
},get:function(m){if(m==null){return void 0
}return this._byId[m.id!=null?m.id:m.cid||m]
},at:function(m){return this.models[m]
},where:function(m,n){if(l.isEmpty(m)){return n?void 0:[]
}return this[n?"find":"filter"](function(o){for(var p in m){if(m[p]!==o.get(p)){return false
}}return true
})
},findWhere:function(m){return this.where(m,true)
},sort:function(m){if(!this.comparator){throw new Error("Cannot sort a set without a comparator")
}m||(m={});
if(l.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)
}else{this.models.sort(l.bind(this.comparator,this))
}if(!m.silent){this.trigger("sort",this,m)
}return this
},sortedIndex:function(m,p,n){p||(p=this.comparator);
var o=l.isFunction(p)?p:function(q){return q.get(p)
};
return l.sortedIndex(this.models,m,o,n)
},pluck:function(m){return l.invoke(this.models,"get",m)
},fetch:function(m){m=m?l.clone(m):{};
if(m.parse===void 0){m.parse=true
}var o=m.success;
var n=this;
m.success=function(p){var q=m.reset?"reset":"set";
n[q](p,m);
if(o){o(n,p,m)
}n.trigger("sync",n,p,m)
};
h(this,m);
return this.sync("read",this,m)
},create:function(n,m){m=m?l.clone(m):{};
if(!(n=this._prepareModel(n,m))){return false
}if(!m.wait){this.add(n,m)
}var p=this;
var o=m.success;
m.success=function(q){if(m.wait){p.add(n,m)
}if(o){o(n,q,m)
}};
n.save(null,m);
return n
},parse:function(n,m){return n
},clone:function(){return new this.constructor(this.models)
},_reset:function(){this.length=0;
this.models=[];
this._byId={}
},_prepareModel:function(o,n){if(o instanceof e){if(!o.collection){o.collection=this
}return o
}n||(n={});
n.collection=this;
var m=new this.model(o,n);
if(!m._validate(o,n)){this.trigger("invalid",this,o,n);
return false
}return m
},_removeReference:function(m){if(this===m.collection){delete m.collection
}m.off("all",this._onModelEvent,this)
},_onModelEvent:function(o,n,p,m){if((o==="add"||o==="remove")&&p!==this){return 
}if(o==="destroy"){this.remove(n,m)
}if(n&&o==="change:"+n.idAttribute){delete this._byId[n.previous(n.idAttribute)];
if(n.id!=null){this._byId[n.id]=n
}}this.trigger.apply(this,arguments)
}});
var Y=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","indexOf","shuffle","lastIndexOf","isEmpty","chain"];
l.each(Y,function(m){C.prototype[m]=function(){var n=N.call(arguments);
n.unshift(this.models);
return l[m].apply(l,n)
}
});
var K=["groupBy","countBy","sortBy"];
l.each(K,function(m){C.prototype[m]=function(p,n){var o=l.isFunction(p)?p:function(q){return q.get(p)
};
return l[m](this.models,o,n)
}
});
var g=Z.View=function(m){this.cid=l.uniqueId("view");
this._configure(m||{});
this._ensureElement();
this.initialize.apply(this,arguments);
this.delegateEvents()
};
var V=/^(\S+)\s*(.*)$/;
var E=["model","collection","el","id","attributes","className","tagName","events"];
l.extend(g.prototype,j,{tagName:"div",$:function(m){return this.$el.find(m)
},initialize:function(){},render:function(){return this
},remove:function(){this.$el.remove();
this.stopListening();
return this
},setElement:function(m,n){if(this.$el){this.undelegateEvents()
}this.$el=m instanceof Z.$?m:Z.$(m);
this.el=this.$el[0];
if(n!==false){this.delegateEvents()
}return this
},delegateEvents:function(q){if(!(q||(q=l.result(this,"events")))){return this
}this.undelegateEvents();
for(var p in q){var r=q[p];
if(!l.isFunction(r)){r=this[q[p]]
}if(!r){continue
}var o=p.match(V);
var n=o[1],m=o[2];
r=l.bind(r,this);
n+=".delegateEvents"+this.cid;
if(m===""){this.$el.on(n,r)
}else{this.$el.on(n,m,r)
}}return this
},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid);
return this
},_configure:function(m){if(this.options){m=l.extend({},l.result(this,"options"),m)
}l.extend(this,l.pick(m,E));
this.options=m
},_ensureElement:function(){if(!this.el){var m=l.extend({},l.result(this,"attributes"));
if(this.id){m.id=l.result(this,"id")
}if(this.className){m["class"]=l.result(this,"className")
}var n=Z.$("<"+l.result(this,"tagName")+">").attr(m);
this.setElement(n,false)
}else{this.setElement(l.result(this,"el"),false)
}}});
Z.sync=function(s,n,m){var p=J[s];
l.defaults(m||(m={}),{emulateHTTP:Z.emulateHTTP,emulateJSON:Z.emulateJSON});
var r={type:p,dataType:"json"};
if(!m.url){r.url=l.result(n,"url")||R()
}if(m.data==null&&n&&(s==="create"||s==="update"||s==="patch")){r.contentType="application/json";
r.data=JSON.stringify(m.attrs||n.toJSON(m))
}if(m.emulateJSON){r.contentType="application/x-www-form-urlencoded";
r.data=r.data?{model:r.data}:{}
}if(m.emulateHTTP&&(p==="PUT"||p==="DELETE"||p==="PATCH")){r.type="POST";
if(m.emulateJSON){r.data._method=p
}var o=m.beforeSend;
m.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",p);
if(o){return o.apply(this,arguments)
}}
}if(r.type!=="GET"&&!m.emulateJSON){r.processData=false
}if(r.type==="PATCH"&&window.ActiveXObject&&!(window.external&&window.external.msActiveXFilteringEnabled)){r.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")
}
}var q=m.xhr=Z.ajax(l.extend(r,m));
n.trigger("request",n,q,m);
return q
};
var J={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};
Z.ajax=function(){return Z.$.ajax.apply(Z.$,arguments)
};
var P=Z.Router=function(m){m||(m={});
if(m.routes){this.routes=m.routes
}this._bindRoutes();
this.initialize.apply(this,arguments)
};
var Q=/\((.*?)\)/g;
var S=/(\(\?)?:\w+/g;
var D=/\*\w+/g;
var H=/[\-{}\[\]+?.,\\\^$|#\s]/g;
l.extend(P.prototype,j,{initialize:function(){},route:function(n,o,p){if(!l.isRegExp(n)){n=this._routeToRegExp(n)
}if(l.isFunction(o)){p=o;
o=""
}if(!p){p=this[o]
}var m=this;
Z.history.route(n,function(r){var q=m._extractParameters(n,r);
p&&p.apply(m,q);
m.trigger.apply(m,["route:"+o].concat(q));
m.trigger("route",o,q);
Z.history.trigger("route",m,o,q)
});
return this
},navigate:function(n,m){Z.history.navigate(n,m);
return this
},_bindRoutes:function(){if(!this.routes){return 
}this.routes=l.result(this,"routes");
var n,m=l.keys(this.routes);
while((n=m.pop())!=null){this.route(n,this.routes[n])
}},_routeToRegExp:function(m){m=m.replace(H,"\\$&").replace(Q,"(?:$1)?").replace(S,function(o,n){return n?o:"([^/]+)"
}).replace(D,"(.*?)");
return new RegExp("^"+m+"$")
},_extractParameters:function(m,n){var o=m.exec(n).slice(1);
return l.map(o,function(p){return p?decodeURIComponent(p):null
})
}});
var I=Z.History=function(){this.handlers=[];
l.bindAll(this,"checkUrl");
if(typeof window!=="undefined"){this.location=window.location;
this.history=window.history
}};
var a=/^[#\/]|\s+$/g;
var F=/^\/+|\/+$/g;
var i=/msie [\w.]+/;
var M=/\/$/;
I.started=false;
l.extend(I.prototype,j,{interval:50,getHash:function(n){var m=(n||this).location.href.match(/#(.*)$/);
return m?m[1]:""
},getFragment:function(o,n){if(o==null){if(this._hasPushState||!this._wantsHashChange||n){o=this.location.pathname;
var m=this.root.replace(M,"");
if(!o.indexOf(m)){o=o.substr(m.length)
}}else{o=this.getHash()
}}return o.replace(a,"")
},start:function(o){if(I.started){throw new Error("Backbone.history has already been started")
}I.started=true;
this.options=l.extend({},{root:"/"},this.options,o);
this.root=this.options.root;
this._wantsHashChange=this.options.hashChange!==false;
this._wantsPushState=!!this.options.pushState;
this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);
var n=this.getFragment();
var m=document.documentMode;
var q=(i.exec(navigator.userAgent.toLowerCase())&&(!m||m<=7));
this.root=("/"+this.root+"/").replace(F,"/");
if(q&&this._wantsHashChange){this.iframe=Z.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;
this.navigate(n)
}if(this._hasPushState){Z.$(window).on("popstate",this.checkUrl)
}else{if(this._wantsHashChange&&("onhashchange" in window)&&!q){Z.$(window).on("hashchange",this.checkUrl)
}else{if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)
}}}this.fragment=n;
var r=this.location;
var p=r.pathname.replace(/[^\/]$/,"$&/")===this.root;
if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!p){this.fragment=this.getFragment(null,true);
this.location.replace(this.root+this.location.search+"#"+this.fragment);
return true
}else{if(this._wantsPushState&&this._hasPushState&&p&&r.hash){this.fragment=this.getHash().replace(a,"");
this.history.replaceState({},document.title,this.root+this.fragment+r.search)
}}if(!this.options.silent){return this.loadUrl()
}},stop:function(){Z.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);
clearInterval(this._checkUrlInterval);
I.started=false
},route:function(m,n){this.handlers.unshift({route:m,callback:n})
},checkUrl:function(n){var m=this.getFragment();
if(m===this.fragment&&this.iframe){m=this.getFragment(this.getHash(this.iframe))
}if(m===this.fragment){return false
}if(this.iframe){this.navigate(m)
}this.loadUrl()||this.loadUrl(this.getHash())
},loadUrl:function(o){var n=this.fragment=this.getFragment(o);
var m=l.any(this.handlers,function(p){if(p.route.test(n)){p.callback(n);
return true
}});
return m
},navigate:function(o,n){if(!I.started){return false
}if(!n||n===true){n={trigger:n}
}o=this.getFragment(o||"");
if(this.fragment===o){return 
}this.fragment=o;
var m=this.root+o;
if(this._hasPushState){this.history[n.replace?"replaceState":"pushState"]({},document.title,m)
}else{if(this._wantsHashChange){this._updateHash(this.location,o,n.replace);
if(this.iframe&&(o!==this.getFragment(this.getHash(this.iframe)))){if(!n.replace){this.iframe.document.open().close()
}this._updateHash(this.iframe.location,o,n.replace)
}}else{return this.location.assign(m)
}}if(n.trigger){this.loadUrl(o)
}},_updateHash:function(m,o,p){if(p){var n=m.href.replace(/(javascript:|#).*$/,"");
m.replace(n+"#"+o)
}else{m.hash="#"+o
}}});
Z.history=new I;
var L=function(m,o){var n=this;
var q;
if(m&&l.has(m,"constructor")){q=m.constructor
}else{q=function(){return n.apply(this,arguments)
}
}l.extend(q,n,o);
var p=function(){this.constructor=q
};
p.prototype=n.prototype;
q.prototype=new p;
if(m){l.extend(q.prototype,m)
}q.__super__=n.prototype;
return q
};
e.extend=C.extend=P.extend=g.extend=I.extend=L;
var R=function(){throw new Error('A "url" property or function must be specified')
};
var h=function(o,n){var m=n.error;
n.error=function(p){if(m){m(o,p,n)
}o.trigger("error",o,p,n)
}
}
}).call(this);