UPM.define("UpmAjax",["jquery","underscore","backbone","UpmEnvironment"],function(F,J,I,B){var C=J.extend({},I.Events);
var A={};
A.ajax=function(M){var L=F.Deferred();
F.ajax(M).then(L.resolve).fail(G(L.reject));
return L.promise()
};
A.getJSON=function(L){return A.ajax({url:L,dataType:"json",contentType:"application/json"})
};
A.ajaxCorsOrJsonp=function(O){var N=J.omit(O,"success","error","useRawResponse"),M;
if(F.support.cors&&(O.url.indexOf("/fakemac/")<0&&O.url.indexOf("/fakempac/")<0)){return F.ajax(N)
}else{M={method:(N.type||"get").toUpperCase()};
if(N.data){M.body=H(N.data);
delete N.data
}for(var L in N.headers||{}){M["h-"+L]=N.headers[L]
}M["h-Content-Type"]=O.contentType||"application/json";
N=J.extend(N,{type:"get",dataType:"jsonp",data:M});
if(O.useRawResponse){return A.ajax(N)
}else{N.jsonp="jsonp";
return A.ajax(N).then(A.transformJsonpResponse)
}}};
A.ajaxCorsOrJsonpWithAtlId=function(L,M){return A.ajaxCorsOrJsonp(J.extend({},M,{headers:J.extend({},M.headers,{"ATL-XSRF-Token":L}),xhrFields:J.extend({},M.xhrFields,{withCredentials:true})}))
};
A.ajaxViaBillingProxy=function(M){var L=J.extend({},M,{url:B.getResourceUrl("billing-proxy"),type:"GET",cache:false,headers:{"destination-path":M.url}});
return F.ajax(L)
};
A.getEventTarget=function(){return C
};
A.parseErrorResponse=function(O){var R;
O=O||{};
R=O.getResponseHeader?O.getResponseHeader("Content-Type"):"application/json";
if(/json/.test(R)){try{var Q=JSON.parse(O.responseText);
return Q.status||Q
}catch(P){AJS.log("Failed to parse response text: "+P)
}}else{if(/xml/.test(R)){var M=F(F.parseXML(O.responseText)),L=M.find("status-code").text(),N=M.find("message").text();
if(L&&N){return{statusCode:L,errorMessage:N}
}}}return{subCode:(O.statusText==="timeout"&&"ajaxTimeout")||(O.statusText==="error"&&"ajaxCommsError")||"ajaxServerError"}
};
A.signalAjaxError=function(M,L){A.getEventTarget().trigger("ajaxError",A.parseErrorResponse(M),L)
};
A.getAjaxErrorMessage=function(N,L,M){return !N?E(M,L):E(A.parseErrorResponse(N),N.status)
};
A.transformJsonpResponse=function(N,L,O){var M=F.Deferred();
if(F.isArray(N)&&(N.length==2)){if(N[0].status==200){M.resolve(N[1],N[0].status,O)
}else{O.status=N[0].status;
O.statusText=N[0].message;
M.reject(O,N[0].status,N[0].message)
}}else{M.reject(O,503,"Invalid JSONP response")
}return M.promise()
};
A.pollTaskResource=function(L,N){var M=F.Deferred(),R=L.links.alternate,O=L.pollDelay||L.pingAfter;
var P=function(){A.getJSON(R).then(function(S){if(S.error){return G(M.reject)(null,S.error.code,S.error.message)
}else{if(!S.done){if(N&&J.isFunction(N)&&S.progress){N(S.progress)
}Q(S.pollDelay)
}else{if(S.links.result){A.getJSON(S.links.result).then(M.resolve).fail(M.reject)
}else{M.resolve(S)
}}}}).fail(M.reject)
};
var Q=function(S){setTimeout(function(){P()
},S)
};
if(O){Q(O)
}else{P()
}return M.promise()
};
function G(L){return function(P,M,O){var N=!P?E(O,M):E(A.parseErrorResponse(P),P.status);
L(P,N.status,N.message)
}
}function E(M,L){var O={message:"An unexpected error occurred. Refer to the logs for more information.",status:L};
if(J.isObject(M)){if(M.subCode){O.status=M.subCode
}else{if(M.errorMessage&&M.statusCode){O.message=M.errorMessage;
O.status=M.statusCode
}else{var N=function(Q){return !!Q
};
var P=J.first(J.filter(J.union(M.errorMessages,M.warningMessages,(M.validation&&(M.validation.errorMessages||M.validation.warningMessages))),N));
if(P){O.message=P
}}}}else{if(J.isString(M)){O.message=M
}}switch(O.status){case 401:case"401":case"upm.websudo.error":case"upm.applications.websudo.error":O.message="This resource requires additional authentication. Try refreshing to access the login page.";
O.status=401;
window.location.reload();
break
}return O
}function D(L){return unescape(encodeURIComponent(L))
}function K(L){return decodeURIComponent(escape(L))
}function H(Q){var P="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var R=D(F.isPlainObject(Q)?JSON.stringify(Q):Q)+"  ";
var L=[];
for(var O=0;
O+2<R.length;
O+=3){var S=0;
for(var N=0;
N<3;
++N){S=(S<<8)+R.charCodeAt(O+N)
}for(var N=3;
N>=0;
--N){var M=(S>>(6*N))&63;
L.push(P.charAt(M))
}}return L.join("")
}return A
});