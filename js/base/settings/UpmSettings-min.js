UPM.define("UpmSettings",["jquery","underscore","brace","UpmDialog","UpmEnvironment","SettingsDialog","SettingsErrorDialogTemplate"],function(E,N,M,J,B,D,L){var A=new M.Evented();
var O={openDefaultSettingsDialog:function(){var P=!!B.getResourceUrl("upm-settings");
I(P)
},openGlobalSettingsDialog:function(){I(true)
},openUserSettingsDialog:function(){I(false)
}};
function I(P){E.ajax({url:H(P),dataType:"json",cache:false,contentType:B.getContentType()}).done(function(Q){var S=F(Q,P),R=new M.Model({isGlobal:P,settings:N.map(S,N.clone)});
new D({model:R}).getResult().done(function(){K(R.get("settings"),S,P)
})
}).fail(function(Q){G()
})
}function G(){new J({template:L})
}function H(P){return B.getResourceUrl(P?"upm-settings":"user-settings")
}function F(P,Q){if(Q){return P.settings
}else{return[{key:"emailDisabled",value:P.emailDisabled,defaultCheckedValue:true}]
}}function C(Q,P){if(P){return{settings:Q}
}else{return N.object(N.map(Q,function(R){return[R.key,R.value]
}))
}}function K(P,Q,R){var U=N.filter(P,function(W){var V=N.find(Q,function(X){return(X.key===W.key)
});
return V&&(W.value!==V.value)
}),S=N.some(U,function(V){return(V.key==="pacDisabled")
}),T=N.some(U,function(V){return V.requiresRefresh
});
if(U.length){E.ajax({type:"PUT",url:H(R),data:JSON.stringify(C(U,R)),contentType:B.getContentType()}).done(function(){if(S){window.location.href=B.getResourceUrl("manage")
}else{if(T){window.location.href=window.location.pathname
}}}).fail(function(V){G()
})
}}B.getReadyState().done(function(){if(B.getResourceUrl("upm-settings")){E("#link-bar-settings").removeClass("hidden")
}if(B.getResourceUrl("user-settings")){E("#link-bar-user-settings").removeClass("hidden")
}E(document).on("click",".settings-panel-link, .upm-pac-enable",function(){O.openGlobalSettingsDialog()
});
E(document).on("click",".user-settings-panel-link",function(){O.openUserSettingsDialog()
})
});
return O
});