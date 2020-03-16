UPM.define("UpmLongRunningTasks",["jquery","underscore","PendingExternalTaskModel","TaskProgressModel","TaskProgressDialog","UpmAjax","UpmBrowserDetection","UpmEnvironment","UpmFormats","UpmXsrfTokenState","UpmDialog","TaskConflictDialogTemplate","TaskProgressDetailsTemplate"],function(I,c,Z,H,F,W,L,V,Q,S,e,G,P){var J=new H();
var U=null;
var M=null;
var Y;
var O=100;
var K=1000;
var b=L.isIE&&AJS.Confluence&&AJS.Confluence.runBinderComponents;
var N;
var d={checkForPendingTasks:function(f){if(V.getResourceUrl("pending-tasks")&&!N){I.ajax({url:V.getResourceUrl("pending-tasks"),type:"get",cache:false,dataType:"json",async:!f,success:function(h){if(h.tasks.length>0){var g=h.tasks[0];
if(g.userKey===V.getUserKey()){d.startProgress("pending");
d.pollForCompletion(g.links.self,g.pingAfter).fail(W.signalAjaxError).always(d.stopProgress)
}else{T(g);
X()
}}},error:function(g){W.signalAjaxError(g)
}})
}},getProgressDialogPromise:function(){if(M){return M.promise()
}else{return I.Deferred().resolve().promise()
}},pendingExternalTaskModel:function(){return Z
},startProgress:function(g,f,h){var i={taskType:g,taskStage:h,status:f||{}};
M=I.Deferred();
J.setStatusProperties(i);
if(!U){U=new F({model:J,createHidden:true});
Y=B(E,D,O,K)
}},stopProgress:function(f){if(f){D()
}else{if(Y){Y()
}}return d.getProgressDialogPromise()
},abortIfHasPendingTask:function(){d.checkForPendingTasks(true);
if(Z.getOtherUserTaskUserKey()){d.stopProgress();
new e({template:G});
return true
}else{return false
}},pollForCompletion:function(h,g){var f=I.Deferred();
g=g||100;
a(h,g||100,f);
return f.promise()
}};
function E(){if(U){U.show()
}}function D(){if(U){U.close();
M.resolve();
U=null
}Y=null
}function B(p,k,h,g){h=h||50;
g=g||1000;
var n=true,l=false,f=false,i=false,o=false;
var m,j;
if(b){j=function(q){q()
}
}else{j=function(r,q){j.t=setTimeout(function(){clearTimeout(j.t);
j.t=undefined;
r()
},q)
}
}j(function(){if(n){p();
l=true;
j(function(){f=true;
if(i&&!o){k()
}},g)
}},h);
return function(){if(!i){n=false;
i=true;
if(!l||f){k();
o=true
}}}
}function A(i){var h=/application\/vnd\.atl\.plugins\.(task\.)?(updateall|install|cancellable|embeddedlicense|disableall)\.(.*)\+json/,f,g;
if(i&&h.test(i)){f=i.match(h);
g={type:f[2],status:f[3]}
}return g
}function a(f,g,i){try{I.ajax({type:"GET",cache:false,url:f,contentType:V.getContentType("json")}).done(function(j,l,k){R(j,l,k,i,function(){a(f,j.pingAfter,i)
})
}).fail(function(j){C(j,i)
})
}catch(h){AJS.log("Error doing ajax request: "+h);
d.stopProgress();
i.reject(null,{subCode:"upm.baseurl.connection.error"})
}}function C(f,g){W.signalAjaxError(f);
if(f.status=="0"){d.stopProgress();
g.reject(null,{subCode:"upm.baseurl.connection.error"})
}else{d.stopProgress();
g.reject(f)
}}function R(h,g,j,f,p){var o=j.getResponseHeader("Content-Type"),k=j.status,n=A(o),i=h.status,m;
function l(){d.stopProgress();
f.reject(j,h,h.status.plugin)
}if(k===202){h.statusCode=k;
f.resolve(h)
}else{if(n&&n.status=="err"){S.refreshToken().done(l)
}else{if(n&&!i.done){m={taskType:n.type,taskStage:n.status,status:i};
J.setStatusProperties(m);
if(h.pingAfter){setTimeout(p,h.pingAfter);
if(i.amountDownloaded&&i.totalSize){J.setProgressPercent(Math.floor((i.amountDownloaded/i.totalSize)*100));
J.setShowProgressBar(true)
}else{J.setShowProgressBar(false)
}}else{l()
}}else{if(h.status&&(h.status.subCode||h.status.errorMessage)){l()
}else{J.setProgressPercent(100);
J.setStatusProperties(c.extend({},J.getStatusProperties(),{taskStage:"complete"}));
setTimeout(function(){if(i&&i.links&&i.links.redirect){window.location.href=i.links.redirect;
return 
}f.resolve(h)
},1000)
}}}}}function X(){clearTimeout(N);
I.ajax({url:V.getResourceUrl("pending-tasks"),type:"get",cache:false,dataType:"json",success:function(g){var f;
if(g.tasks.length>0){f=g.tasks[0];
T(f);
N=setTimeout(X,f.pingAfter)
}else{T(null);
N=undefined
}},error:function(f){W.signalAjaxError(f)
}})
}function T(h){var g=h&&h.status,j=A(g&&g.contentType),k,f,i;
if(j&&g){f={taskType:j.type,taskStage:j.status,status:g};
i=I("<div></div>").html(P(f));
k=i.find("main").html().trim();
Z.set({otherUserTaskDesc:k,otherUserTaskUserKey:h.userKey,otherUserTaskStartTime:h.timestamp})
}else{Z.set({otherUserTaskDesc:null})
}}return d
});