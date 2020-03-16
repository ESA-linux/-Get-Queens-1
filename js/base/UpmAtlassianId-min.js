UPM.define("UpmAtlassianId",["jquery","underscore","brace","UpmAjax","UpmDialog","UpmEnvironment","UpmAnalytics","AtlassianIdLoginDialogTemplate"],function(E,I,G,A,F,B,D,C){var H={};
var J=F.extend({template:C,events:{"submit #upm-atlassian-id-form":"_submitCredentials","keydown #upm-atlassian-id-username":"_clearUsernameError","input #upm-atlassian-id-username":"_clearUsernameError","keydown #upm-atlassian-id-password":"_clearPasswordError","input #upm-atlassian-id-password":"_clearPasswordError"},_postRender:function(){this.$throbber=E('<div class="loading"></div>');
this.$username=this.$el.find(".username-group");
this.$password=this.$el.find(".password-group");
this.$usernameInput=this.$el.find("#upm-atlassian-id-username");
this.$passwordInput=this.$el.find("#upm-atlassian-id-password");
this.$submit=this.getConfirmButton();
this.$errorField=this.$el.find(".request-error");
this.DEFAULT_ERROR=this.$el.find(".default-error").html()
},_postShow:function(){if(this.options.data.applicationFormat){D.logEvent("manageapps-aid-show")
}},_clearUsernameError:function(){if(E.trim(this.$usernameInput.val()).length>0){this.$username.removeClass("empty");
this.$errorField.hide()
}},_clearPasswordError:function(){if(E.trim(this.$passwordInput.val()).length>0){this.$password.removeClass("empty");
this.$errorField.hide()
}},_isValidInput:function(L,K){if(!(L&&K)){this.$username.toggleClass("empty",!L);
this.$password.toggleClass("empty",!K);
return false
}this._clearUsernameError();
this._clearPasswordError();
return true
},_submitCredentials:function(L){L&&L.preventDefault&&L.preventDefault();
var M=E.trim(this.$usernameInput.val()),K=E.trim(this.$passwordInput.val());
if(!this._isValidInput(M,K)){return 
}this.$submit.prop("disabled",true);
this.getButtonPanel().prepend(this.$throbber);
A.ajaxCorsOrJsonp({url:B.getResourceUrl("atlassian-id-login"),type:"post",contentType:"application/json",data:JSON.stringify({username:M,password:K}),dataType:"json",timeout:10000,xhrFields:{withCredentials:true}}).then(I.bind(function(P,N){var O=P.xsrfToken;
H.setAtlassianIdToken(O);
this.close();
this.deferredResult.resolve({username:M,password:K,token:O});
if(this.options.data.applicationFormat){D.logEvent("manageapps-aid-success")
}},this),I.bind(function(N){H.clearAtlassianIdToken();
if(N.status==403){this.$throbber.remove();
this.$submit.removeAttr("disabled");
this.$errorField.html(this.DEFAULT_ERROR).show()
}else{this.close();
this.deferredResult.resolve({username:M,password:K})
}if(this.options.data.applicationFormat){D.logEvent("manageapps-aid-failure")
}},this))
},_onConfirm:function(){this._submitCredentials();
if(this.options.data.applicationFormat){D.logEvent("manageapps-aid-submit")
}},_onCancel:function(){this.close();
this.deferredResult.reject();
if(this.options.data.applicationFormat){D.logEvent("manageapps-aid-cancel")
}}});
H.getOrCreateAtlassianIdToken=function(L){var K=E.Deferred();
if(H.getAtlassianIdToken()){K.resolve(H.getAtlassianIdToken())
}else{H.openAtlassianIdLogin(L).then(function(){if(H.getAtlassianIdToken()){K.resolve(H.getAtlassianIdToken())
}else{K.reject("Failed to get Atlassian ID token")
}},K.reject)
}return K.promise()
};
H.getAtlassianIdToken=function(){if(H.newIdToken===undefined){var K=E.cookie("upm.atl.id");
if(K){var L=K.split("|",2);
if(B.getCurrentUserName()!=L[0]){H.clearAtlassianIdToken();
return null
}return L[1]
}}return H.newIdToken
};
H.clearAtlassianIdToken=function(){H.newIdToken=null;
E.removeCookie("upm.atl.id")
};
H.setAtlassianIdToken=function(K){E.cookie("upm.atl.id",B.getCurrentUserName()+"|"+K,{path:"/"});
H.newIdToken=K
};
H.openAtlassianIdLogin=function(K){var M=I.extend({applicationName:"",applicationFormat:false,accessTokenFormat:false,activateFormat:false,initialError:""},K),L=new J({data:M});
UPM.trace("atlassian-id-dialog");
return L.getResult()
};
H.tryWithAtlassianIdToken=function(N,L){var M=function(){return H.openAtlassianIdLogin(L).then(function(O){return K(O&&O.token)
})
};
var K=function(O){return N(O).then(function(P){if(P===undefined){H.clearAtlassianIdToken();
return M()
}else{return P
}})
};
if(H.getAtlassianIdToken()){return K(H.getAtlassianIdToken())
}else{return M()
}};
return H
});