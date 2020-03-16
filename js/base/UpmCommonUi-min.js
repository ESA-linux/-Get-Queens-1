UPM.define("UpmCommonUi",["jquery","underscore","backbone","BackBreadcrumbTemplate","UpmAjax","UpmAnalytics","UpmBrowserDetection","UpmEnvironment","UpmFormats","UpmMessageFactory","UpmMessageModel","UpmMessageView","UpmXsrfTokenState","UpmStrings","OtherUserPendingTaskTemplate","PendingExternalTaskModel"],function(Q,j,S,K,U,J,O,A,P,c,G,L,h,F,Z,f){var D=j.extend({},S.Events);
var e;
var R;
var X=Q.Deferred();
var b="upm.pageReloadPerformed";
window.upm=window.upm||{};
window.upm.isUpm=true;
var W={clearMessages:function(){if(R){R.empty()
}},getLocationHash:function(){var o=document.location.hash||"",k=o.split("/"),m=k[0],l=k.length>1?k[1]:"",n=k.length>2?k[2]:"";
if(m.charAt(0)=="#"){m=m.substring(1,m.length)
}return{tab:m,key:l,message:n}
},getPageContainer:function(){return e
},getReadyState:function(){return X.promise()
},showMessage:function(l){if(R){var k=new L({model:new G(l)});
R.append(k.render().$el);
UPM.trace("top-level-message")
}},showMessageElement:function(k){if(R&&!Q.contains(R,k)){R.append(k);
UPM.trace("top-level-message")
}}};
function I(){var o=Q("#upm-mpac-website-url").val(),k=A.getApplicationKey(),n=window.location.pathname,m=n.substr(n.lastIndexOf("/")),l=window.location.search;
if(n.match(/search$/)){if(l!==""){o+="/search"+l+"&application="+k
}else{o+="/plugins/app/"+k
}}else{if(m==="/upm"||m==="/marketplace"||m==="/requests"||m==="/view"||m==="/purchases"){m="/featured"
}o+="/plugins/app/"+k+m+l
}return o
}function N(){var k=Q("#upm-pac-checking-availability"),l=setTimeout(function(){k.hide().removeClass("hidden").fadeIn(0)
},10000);
A.refreshMpacAvailability().done(function(){Y()
}).fail(function(m){Q("#upm-pac-unavailable").removeClass("hidden");
U.signalAjaxError(m)
}).always(function(){clearTimeout(l);
k.remove()
})
}function E(){A.refreshProductVersionInfo().done(function(k){if(k.unknown){if(e){if(k.development){e.addClass("plugin-warning-development-version")
}else{e.addClass("plugin-warning-unknown-version");
Q("#upm-marketplace-disabled-link").attr("href",I())
}}B()
}})
}function i(){var k=W.getLocationHash();
if(!Q.cookie(b)&&(k.tab||k.key)&&k.message){var l=k.key?(k.tab+"/"+k.key):k.tab;
if(document.location.hash.indexOf("#")!=-1){l="#"+l
}document.location.hash=l
}}function H(n,k){var m,l;
m=n.errorMessage||n.message||(n.status&&n.status.errorMessage);
l=n.subCode||(n.status&&n.status.subCode)||(n.details&&n.details.error.subCode);
if(l&&F[l]){return P.format(F[l],k&&P.htmlEncode(k))
}else{if(!m||m.match(/^[0-9][0-9][0-9]$/)){return F["upm.plugin.error.unexpected.error"]
}else{return m
}}}function T(){var n=A.getUrlParam("source")||"unknown",l=A.getUrlParam("source-type"),k=window.location.pathname,m=k.indexOf("/plugins/servlet/");
if(m>0){k=k.substr(m)
}J.logEvent("page-source",{source:n,url:k,sourceType:l})
}function d(l,k){W.showMessage({type:"error",message:H(l,k)})
}function g(){originalIsDirtyFn=AJS.$.fn.isDirty;
if(originalIsDirtyFn){AJS.$.fn.isDirty=function(){if(AJS.$(this).hasClass("ajs-dirty-warning-exempt")){return false
}return originalIsDirtyFn.apply(this,arguments)
}
}}function M(){var k=W.getLocationHash();
if(O.isIE&&k.message){if(Q.cookie(b)){Q.removeCookie(b)
}else{Q.cookie(b,"true");
document.location.href=window.location.href
}}}function C(){var k=A.getUrlParam("source"),l=Q(".back-breadcrumb");
if(l.length){l.append(K({location:k}))
}}function V(){Q("#upm-base-url-invalid").toggleClass("hidden",!A.isBaseUrlInvalid())
}function Y(){var k=A.isMpacDisabled(),l=A.isMpacUnavailable();
Q(".upm-description").toggleClass("hidden",k||l);
Q("#upm-pac-disabled").toggleClass("hidden",!k);
Q("#upm-pac-unavailable").toggleClass("hidden",!l||k);
if(k){Q("#upm-marketplace-disabled-link").attr("href",I())
}B()
}function B(){var k=A.isMpacDisabled(),l=A.isMpacUnavailable();
Q("#link-bar-update-check").toggleClass("hidden",k||l||!A.getResourceUrl("product-updates")||(A.isUnknownProductVersion()&&!A.isDevelopmentProductVersion()))
}function a(){var l,k;
if(f.getOtherUserTaskDesc()){l=Z({taskDesc:f.getOtherUserTaskDesc(),taskUserKey:f.getOtherUserTaskUserKey(),taskStartTime:f.getOtherUserTaskStartTime()});
if(e){e.addClass("upm-pending-tasks")
}Q("#upm-pending-tasks").html(c.newInfoMessage(null,l).render().$el)
}else{if(e){e.removeClass("upm-pending-tasks")
}}}D.listenTo(U.getEventTarget(),"ajaxError",d);
D.listenTo(A.getHostStatusModel(),"change:baseUrlInvalid",V);
D.listenTo(A.getHostStatusModel(),"change:pacDisabled",Y);
D.listenTo(A.getHostStatusModel(),"change:pacUnavailable",Y);
D.listenTo(f,"change:otherUserTaskDesc",a);
A.getReadyState().then(function(){M();
return h.refreshToken()
}).done(function(){e=Q("#upm-container");
R=Q("#upm-messages");
C();
V();
a();
N();
E();
T();
g();
AJS.$(window).trigger("upmready");
X.resolve();
i()
});
return W
});