var upm=upm||{};
(function(){var Y,H="application/vnd.atl.plugins+json",E,a=1000,A=false,R=false,C=false,N=false;
upm.productId;
upm.pluginNotificationsTitle;
upm.noNotificationsText;
upm.rootNotificationsUrl;
upm.notificationsUrl;
upm.analyticsUrl;
upm.onDemand;
upm.isJira=(upm.productId=="jira");
upm.isBamboo=(upm.productId=="bamboo");
upm.isConfluence=(upm.productId=="confluence");
upm.isFecru=(upm.productId=="fisheye"||upm.productId=="crucible");
upm.isStash=(upm.productId=="stash");
upm.isBitbucket=(upm.productId=="bitbucket");
function T(){var g,f;
if(E.hasClass("new-notifications")){g=AJS.$("div.upm-notification","#upm-notifications");
for(var e=0,d=g.length;
e<d;
e++){f=AJS.$(g[e]);
if(!f.data("dismissOnClick")||(f.data("group")&&!f.data("group").dismissOnClick)){b(f,false)
}}AJS.$("#upm-notifications-trigger").bind("click",P)
}}function b(g,d){var e,f;
if(g.hasClass("upm-notification-new")){e=g.data("notification")||g.data("group");
e.dismissed=true;
f=e.links["post-notifications"];
if(f){AJS.$.ajax({type:"POST",url:f,dataType:"json",data:JSON.stringify(e),contentType:H,success:function(){if(d){G(g);
V()
}}})
}}}function P(){var g,f;
if(E.hasClass("new-notifications")){g=AJS.$("div.upm-notification","#upm-notifications");
for(var e=0,d=g.length;
e<d;
e++){f=AJS.$(g[e]);
if((!f.data("dismissed")||(f.data("group")&&!f.data("group").dismissed))&&!f.data("dismissOnClick")){G(f)
}}V()
}AJS.$("#upm-notifications-trigger").unbind("click",P)
}function G(d){d.removeClass("upm-notification-new")
}function V(){var d=AJS.$(".upm-notification-new",E).length;
if(!d){E.removeClass("new-notifications")
}else{AJS.$("#upm-notifications-count",E).text(d)
}}function O(){var f,e=AJS.$("#upm-notifications-container");
if(e.length){f=e.removeAttr("href")
}else{if(upm.isJira){if((f=AJS.$("#proj-config-return-link")).length){R=true
}else{if((f=AJS.$("#project-config-header ul.operation-menu")).length){A=true
}else{if((f=AJS.$("#project-config-header")).length){N=true
}else{if((f=AJS.$("#admin-page-heading").parent()).length){C=true
}else{f=AJS.$("#upm-container").find("h2:first")
}}}}}else{if(upm.isConfluence){if(window.location.href.indexOf("console.action")!=-1||window.location.href.indexOf("editconsolemessages.action")!=-1||upm.isUpm){var d=AJS.$("#admin-content");
if(!d.length){d=AJS.$("td.pagebody")
}f=AJS.$("<div></div>").prependTo(d)
}}else{if(upm.isBamboo){if(upm.isUpm){f=AJS.$("#upm-title")
}}else{if(upm.isFecru){f=AJS.$("#header-admin")
}else{if(upm.isStash||upm.isBitbucket){f=AJS.$("#content > .aui-tabs > .tabs-menu")
}}}}}}return f
}function Q(f,g){var e=AJS.$('<span class="upm-notification-text"></span>'),d;
if(!g){e.text(f)
}else{e.html(f);
e.find("a").attr("href",g)
}return e
}function L(e){var d=AJS.$('<a id="upm-notifications-trigger" class="aui-dd-trigger" href="#"><span id="upm-notifications-icon"></span></a>').attr("title",upm.pluginNotificationsTitle);
d.bind("click",T);
d.bind("click",U);
d.bind("focusout",P);
e=parseInt(e,10);
if(e===NaN){e=0
}AJS.$('<span id="upm-notifications-count"></span>').text(e).appendTo(d);
return d
}function B(e){var f=[];
if(e.notifications.length===1){f.push(X(e,e.notifications[0]))
}else{if(e.displayIndividually){for(var d=0;
d<e.notifications.length;
d++){f.push(X(e,e.notifications[d]))
}}else{f.push(I(e))
}}return f
}function X(g,f){var e=f.plugin,d;
if(e.links&&e.links["plugin-icon"]){d=AJS.$('<img src="" alt="">').attr("src",e.links["plugin-icon"]).attr("title",e.name)
}return S(f,g.dismissOnClick,d).data("notification",f)
}function I(e){var d=AJS.$('<img src="" alt="">').attr("src",e.links["default-icon"]);
return S(e,e.dismissOnClick,d).data("group",e)
}function S(e,f,d){var h=AJS.$('<div class="upm-notification"></div>').attr("id","upm-notification-type-"+e.notificationType),g=AJS.$('<span class="upm-notification-icon"></span>');
if(d){g.append(d)
}else{g.addClass("empty")
}h.append(g).append(Q(e.message,e.links&&e.links.target));
if(!e.dismissed){h.addClass("upm-notification-new")
}if(f){h.data("dismissOnClick",true);
h.bind("click",function(){b(AJS.$(this),true)
})
}return h
}function K(){return AJS.$("<h3></h3>").text(upm.pluginNotificationsTitle)
}function J(){return AJS.$('<p id="upm-no-notifications"></p>').text(upm.noNotificationsText)
}function Z(){E=AJS.$('<div id="upm-notifications" class="aui-dd-parent"></div>').bind("refreshNotifications",c).toggleClass("upm-admin-headers",C).toggleClass("upm-project-config",N).toggleClass("upm-operations-headers",A).toggleClass("upm-action-buttons",R).toggleClass("upm-h1",upm.productId=="bamboo");
return E
}function c(){AJS.$.ajax({url:upm.notificationsUrl,type:"get",cache:false,dataType:"json",contentType:H,success:function(e){Y=e;
var d=Y&&Y.notificationGroups;
D(d);
E.removeClass("hidden").addClass("loaded")
},error:function(d){E.addClass("loaded")
}})
}function F(){if(AJS&&AJS.contextPath){return AJS.contextPath()
}if(window.contextPath){return window.contextPath
}var d=window.location.pathname.split("/plugins/servlet/upm");
if(d.length){return d[0]
}return""
}function U(){var e=window.location.pathname,d=F();
if(d){e=e.substr(d.length)
}M("notification-badge-click",{url:e})
}function M(e,d){if(upm.analyticsUrl){d=d||{};
d.type=e;
AJS.$.ajax({type:"POST",url:upm.analyticsUrl,dataType:"json",contentType:H,data:JSON.stringify({data:d})})
}}function D(k){var g=AJS.$("#upm-notifications-dropdown"),d=0;
if(k){d=k.length
}g.find("div.upm-notification").remove();
g.find("#upm-no-notifications").remove();
if(d){for(var f=0;
f<d;
f++){var h=B(k[f]);
for(var e=0;
e<h.length;
e++){g.append(h[e])
}}if(g.find(".upm-notification-new").length){E.addClass("new-notifications");
V()
}}else{J().appendTo(g)
}g.appendTo(E);
return E
}function W(){AJS.$(window).unbind("upmready",W);
var e=O(),g=new Date().getTime(),f=AJS.$('<div id="upm-notifications-dropdown" class="upm-notifications-dropdown aui-dropdown"></div>'),d;
if(!e||!e.length){return 
}d=Z();
if(N){e.before(d)
}else{if(upm.productId=="jira"&&!C){e.after(d)
}else{e.append(d)
}}E.addClass("hidden upm-notifications-"+upm.productId);
L(0).appendTo(E);
K().appendTo(f);
f.appendTo(E);
if(new Date().getTime()-g>a){E.fadeIn()
}E.dropDown("Standard");
if(!upm.onDemand){AJS.$.ajax({url:upm.rootNotificationsUrl,type:"get",dataType:"json",contentType:H,success:function(h){if(h.links){upm.notificationsUrl=h.links["my-notifications"]
}else{upm.notificationsUrl=upm.rootNotificationsUrl
}c()
},error:function(h){E.addClass("loaded")
}})
}}AJS.$(window).bind("upmready",W);
AJS.toInit(function(){if(!upm.isUpm){W()
}})
})();