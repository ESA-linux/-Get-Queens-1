/*
 *  Backbone Brace - 2013-04-30
 *  Copyright 2013 Atlassian Software Systems Pty Ltd
 *  Licensed under the Apache License, Version 2.0
 */
(function(){var L=this;
var I=L.Brace;
var P;
if(typeof exports!=="undefined"){P=exports
}else{P=L.Brace={}
}P.noConflict=function(){L.Brace=I;
return this
};
var Q=L._;
if(!Q&&(typeof require!=="undefined")){Q=require("underscore")
}var B=L.Backbone;
if(!B&&(typeof require!=="undefined")){B=require("backbone")
}function G(T){if(Q.isArray(T)){return Q.reduce(T,function(U,V){U[V]=null;
return U
},{})
}return T
}function E(T,U){if(!T||U==null){return U
}if(T===String&&Q.isString(U)){return U
}if(T===Number&&Q.isNumber(U)){return U
}if(T===Boolean&&Q.isBoolean(U)){return U
}if(typeof T==="string"||T instanceof String){if(typeof U!==""+T){throw"The typeof "+U+" is "+typeof U+" but expected it to be "+T
}return U
}if(Q.isArray(T)||T===Array){if(!C(U)){throw"Array type expected, but nonnull, non-Array value provided."
}return T===Array||!T[0]?U:Q.map(U,Q.bind(E,null,T[0]))
}if(typeof T!=="function"){throw"Invalid expected type "+T+". Should be falsy, String, Array, Backbone.Collection constructor, or function."
}if(U instanceof T){return U
}if(F(T)){return new T(E([T.model],U))
}return new T(U)
}function F(U,T){return U&&(U.__super__ instanceof (T||B.Collection)||U.__super__===(T||B.Collection).prototype||U===(T||B.Collection))
}function C(T){return Q.has(T,"length")&&!(T instanceof String||Q.has({string:1,"function":1},typeof T)||T instanceof B.Collection)
}function O(V,U){var T={};
Q.each(V,function(X,W){if(!U[W]||H(X,U[W])){T[W]=X
}else{if(!X||H(U[W],X)){return 
}else{throw W+" has conflicted type descriptors."
}}});
return T
}function H(U,T){if(!T||T===U){return true
}if(!U||typeof U==="string"){return false
}if(U instanceof Array){return T===Array||(T instanceof Array&&H(U[0],T[0]))
}if(typeof T!=="function"){return false
}if(F(T)){return F(U,T)
}return U.prototype instanceof T
}function S(T){if(Q.isObject(T)){return Q.reduce(T,function(U,W,V){if(W&&Q.isFunction(W.toJSON)){U[V]=W.toJSON()
}else{if(Q.isArray(W)){U[V]=Q.map(W,function(X){if(X&&Q.isFunction(X.toJSON)){return X.toJSON()
}else{return X
}})
}}return U
},T)
}else{return T
}}function J(U){return function T(){var V=U.call(this);
return S(V)
}
}P.Mixins={createMethodName:function(T,U){return T+U.charAt(0).toUpperCase()+U.substr(1)
},applyMixin:function(U,T){Q.forEach(Q.keys(T),function(c){var Z=U.prototype;
if("initialize"===c){var b=Z.initialize;
Z.initialize=function(){if(b){b.apply(this,arguments)
}T.initialize.apply(this,arguments)
};
return 
}if("validate"===c){var V=Z.validate;
Z.validate=function(){if(V){var e=V.apply(this,arguments);
if(e){return e
}}return T.validate.apply(this,arguments)
};
return 
}if("defaults"===c){var Y=Z.defaults||(Z.defaults={});
var a=T[c];
for(var X in a){if(Y.hasOwnProperty(X)){throw"Mixin error: class already has default '"+X+"' defined"
}Y[X]=a[X]
}return 
}if("namedAttributes"===c){var W=G(Z.namedAttributes)||{};
var d=G(T[c]);
Z.namedAttributes=Q.extend(W,O(d,W));
return 
}if("namedEvents"===c){if(!Q.isArray(T[c])){throw"Expects events member on mixin to be an array"
}if(!Z.namedEvents){Z.namedEvents=[]
}Z.namedEvents=Q.uniq(Z.namedEvents.concat(T[c]));
return 
}if(Z.hasOwnProperty(c)){throw"Mixin error: class already has property '"+c+"' defined"
}Z[c]=T[c]
},this)
}};
P.AttributesMixinCreator={create:function(U){var T={};
if(!U){U={}
}if(!Q.has(U,"id")){U.id=null
}Q.each(U,function(X,W){var Y=P.Mixins.createMethodName("set",W);
T[Y]=function(a,Z){return this.set(W,a,Z)
};
var V=P.Mixins.createMethodName("get",W);
T[V]=function(){return this.get(W)
}
});
return T
},ensureType:E};
P.EventsMixinCreator={create:function(U){var T={};
var V=function(X){var W=P.Mixins.createMethodName("on",X);
T[W]=function(){return this.on.apply(this,[X].concat(Q.toArray(arguments)))
};
var Y=P.Mixins.createMethodName("trigger",X);
T[Y]=function(){return this.trigger.apply(this,[X].concat(Q.toArray(arguments)))
}
};
Q.each(U,Q.bind(V,this));
return T
}};
function N(U){return function T(X,Y){var Z;
var W=Q.extend({},X);
var V;
if(X&&X.mixins){V=X.mixins;
delete W.mixins
}Z=U.call(this,W,Y);
if(this.prototype.namedEvents){P.Mixins.applyMixin(Z,{namedEvents:this.prototype.namedEvents})
}if(this.prototype.namedAttributes){P.Mixins.applyMixin(Z,{namedAttributes:this.prototype.namedAttributes})
}if(V){Q.each(X.mixins,function(a){P.Mixins.applyMixin(Z,a)
})
}if(Z.prototype.namedEvents){P.Mixins.applyMixin(Z,P.EventsMixinCreator.create(Z.prototype.namedEvents))
}if(Z.prototype.namedAttributes){Z.prototype.namedAttributes=G(Z.prototype.namedAttributes);
P.Mixins.applyMixin(Z,P.AttributesMixinCreator.create(Z.prototype.namedAttributes))
}if(Z.prototype.toJSON){Z.prototype.toJSON=J(Z.prototype.toJSON)
}Z.extend=T;
return Z
}
}function D(X,V){var W=X.prototype;
var T=V.prototype;
var U=W.set;
T.set=function(d,e,c){var b,a=this.namedAttributes;
if(!a||d==null){return U.apply(this,arguments)
}if(Q.isObject(d)){b=Q.clone(d);
c=e
}else{b={};
b[d]=e
}for(var Z in b){if(!Q.has(b,Z)){continue
}if(!Q.has(a,Z)){throw"Attribute '"+Z+"' does not exist"
}b[Z]=E(a[Z],b[Z])
}return U.call(this,b,c)
};
var Y=W.get;
T.get=function(Z){if(this.namedAttributes&&!Q.has(this.namedAttributes,Z)){throw"Attribute '"+Z+"' does not exist"
}return Y.apply(this,arguments)
}
}function A(X,U){var W=X.prototype;
var T=U.prototype;
var V=W.parse;
T.parse=function(Y,Z){return Q.pick(V(Y,Z),Q.keys(this.namedAttributes))
}
}function M(T){var V=T.extend();
var U=T.extend;
V.extend=N(U);
return V
}function R(T){var U=M(T);
D(T,U);
A(T,U);
return U
}P.Model=R(B.Model);
P.Collection=M(B.Collection);
P.View=M(B.View);
P.Router=M(B.Router);
var K=function(){this.initialize.apply(this,arguments)
};
Q.extend(K.prototype,B.Events,{initialize:function(){}});
K.extend=B.Model.extend;
P.Evented=M(K)
}());