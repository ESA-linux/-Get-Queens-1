UPM.define("UpmXsrfTokenState",["jquery","UpmAjax","UpmEnvironment"],function(F,E,B){var C,D;
var A={getCurrentToken:function(){if(D){return"badtoken-"+Math.random()
}return C
},refreshToken:function(){var H=F.Deferred();
F.ajax({url:B.getResourceUrl("token"),type:"head",cache:false,success:function(L,I,K){var J=K.getResponseHeader("upm-token");
C=J;
H.resolve(J)
},error:function(I){if(I.status===403){H.resolve()
}else{E.signalAjaxError(I);
H.reject()
}}});
return H.promise()
},setForceTokensToFail:function(H){D=H
},setToken:function(H){C=H
},tryWithToken:function(I){var H=F.Deferred();
I(A.getCurrentToken()).done(function(L,J,K){A.refreshToken();
H.resolve(L,J,K)
}).fail(function(L,J,K){if(G(L)){A.refreshToken().done(function(){I(A.getCurrentToken()).done(H.resolve).fail(H.reject)
}).fail(H.reject)
}else{H.reject(L,J,K)
}});
return H.promise()
}};
function G(H){try{var J=JSON.parse(H.responseText);
return J&&J.subCode=="upm.error.invalid.token"
}catch(I){return false
}}return A
});