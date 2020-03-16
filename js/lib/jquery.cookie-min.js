/*
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function(E,F,B){var D=/\+/g;
function G(J){return J
}function H(J){return C(decodeURIComponent(J.replace(D," ")))
}function C(J){if(J.indexOf('"')===0){J=J.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")
}return J
}function I(J){return A.json?JSON.parse(J):J
}var A=E.cookie=function(Q,P,U){if(P!==B){U=E.extend({},A.defaults,U);
if(P===null){U.expires=-1
}if(typeof U.expires==="number"){var R=U.expires,T=U.expires=new Date();
T.setDate(T.getDate()+R)
}P=A.json?JSON.stringify(P):String(P);
return(F.cookie=[encodeURIComponent(Q),"=",A.raw?P:encodeURIComponent(P),U.expires?"; expires="+U.expires.toUTCString():"",U.path?"; path="+U.path:"",U.domain?"; domain="+U.domain:"",U.secure?"; secure":""].join(""))
}var J=A.raw?G:H;
var S=F.cookie.split("; ");
var V=Q?null:{};
for(var O=0,M=S.length;
O<M;
O++){var N=S[O].split("=");
var K=J(N.shift());
var L=J(N.join("="));
if(Q&&Q===K){V=I(L);
break
}if(!Q){V[K]=I(L)
}}return V
};
A.defaults={};
E.removeCookie=function(K,J){if(E.cookie(K)!==null){E.cookie(K,null,J);
return true
}return false
}
})(jQuery,document);