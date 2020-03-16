UPM.define("UpmInstaller",["jquery","underscore","UploadDialog","UpmAjax","UpmEnvironment","UpmXsrfTokenState","UpmAnalytics"],function(L,O,A,B,C,D,K){var F="upm-upload-form-hidden-container",N="upm-upload-target";
var H={installFromFile:function(Q,U,S){var P=E();
Q.attr("method","post").attr("target",N).attr("enctype","multipart/form-data");
function T(V){return{responseText:V,getResponseHeader:function(W){if(W==="Content-Type"){return"application/json"
}return""
}}
}function R(X){var V=L.Deferred(),W=C.getResourceUrl("install-file")+"?token="+X;
Q.attr("action",W);
P.unbind("load.upload").bind("load.upload",function(){try{var Z=P.contents().text(),Y=JSON.parse(Z);
if(Y.links&&Y.links.self){V.resolve(Y)
}else{V.reject(T(Z))
}}catch(a){V.reject(T(a.message))
}});
Q.submit();
return V
}return M(R,U,S,"upload")
},installFromUrl:function(Q,S){var T,P;
T=C.getContentType("install");
P=C.getResourceUrl("install-uri");
function R(U){return L.ajax({type:"POST",url:P+"?token="+U,dataType:"json",contentType:T,data:JSON.stringify({pluginUri:Q})})
}return M(R,Q,S,"install").then(function(U){return L.Deferred().resolve(U).promise()
})
},openInstallDialog:function(U,S){var T=L.Deferred(),R,P=O.extend({uploadApplication:false},S);
I();
var Q=new A({formContainer:G(),data:P});
Q.getResult().done(function(V){if(V.getUrl()){J();
R=H.installFromUrl(V.getUrl(),U);
if(P.uploadApplication){K.logEvent("manageapps-upload-dialog-confirm",{method:"url"})
}}else{R=H.installFromFile(G().find("form"),V.getFileName(),U);
if(P.uploadApplication){K.logEvent("manageapps-upload-dialog-confirm",{method:"file"})
}}R.then(function(W){T.resolve(W,V)
}).fail(O.bind(T.reject,T))
}).fail(function(){if(P.uploadApplication){K.logEvent("manageapps-upload-dialog-cancel")
}J()
});
return T.promise()
}};
function I(){J();
L("body").append(L("<div></div>").attr("id",F).css("display","none")).append(L("<iframe>").attr("src","javascript:false").attr("name",N).attr("id",N).css("display","none"))
}function G(){return L("#"+F)
}function E(){return L("#"+N)
}function J(){G().remove();
E().remove()
}function M(R,Q,S,P){if(S&&S(Q,P)){return L.Deferred()
}else{return D.tryWithToken(R).fail(function(T){return L.Deferred().reject(T).promise()
})
}}return H
});