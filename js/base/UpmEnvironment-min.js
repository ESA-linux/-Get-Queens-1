UPM.define("UpmEnvironment",["jquery","underscore","backbone","UpmContextPathMixin"],function(F,N,L,I){var G=F.Deferred();
var D;
var M=new L.Model();
var J={bundle:"application/vnd.atl.plugins.osgi.bundle+json",install:"application/vnd.atl.plugins.install.uri+json",json:"application/json",module:"application/vnd.atl.plugins.plugin.module+json","pac-disabled":"application/vnd.atl.plugins.pac.disabled+json",plugin:"application/vnd.atl.plugins.plugin+json","purge-after":"application/vnd.atl.plugins.audit.log.purge.after+json","requires-restart":"application/vnd.atl.plugins.changes.requiring.restart+json","safe-mode":"application/vnd.atl.plugins.safe.mode.flag+json","update-all":"application/vnd.atl.plugins.updateall+json","disable-all":"application/vnd.atl.plugins.disableall+json","embedded-license-task":"application/vnd.atl.plugins.embeddedlicense.installing+json",upm:"application/vnd.atl.plugins+json"};
var E={};
var B={};
var H={};
var A=N.extend({},I,{applicationName:null,applicationVersion:null,checkMarketplaceEulaAccepted:function(){return F.ajax({url:A.getResourceUrl("user-accepted-mpac-eula")}).promise()
},getApplicationKey:function(){return A.getApplicationName().toLowerCase()
},getApplicationName:function(){return A.applicationName||AJS.params["upm-product-application-name"]||F("#upm-product-application-name").val()||""
},getApplicationVersion:function(){return A.applicationVersion||F("#upm-product-application-version").val()||""
},getContentType:function(O){return J[O||"upm"]
},getCurrentUserEmail:function(){return AJS.params.upmCurrentUserEmail
},getCurrentUserFullName:function(){return AJS.params.upmCurrentUserFullName
},getCurrentUserName:function(){return AJS.params.upmCurrentUsername
},getHostLicense:function(){return M.get("hostLicense")
},getHostStatusModel:function(){return M
},getLicensedHostUsers:function(){return parseInt(AJS.params.upmLicensedHostUsers,10)||(A.getHostLicense()&&A.getHostLicense().maximumNumberOfUsers)
},getMarketplaceAddonsApiUrl:function(){return AJS.params.upmMpacAddonsUrl
},getMarketplaceBaseUrl:function(){var O=AJS.params.mpacBaseUrl;
return/\/$/.test(O)?O.substring(0,O.length-1):O
},getReadyState:function(){return G.promise()
},getResourceUrl:function(O,P){return P?K(H[O],P):B[O]
},getServerId:function(){return F("#upm-product-server-id").val()||""
},getUpmPluginKey:function(){return"com.atlassian.upm.atlassian-universal-plugin-manager-plugin"
},getUrlParam:function(P,O){O=O?((O.indexOf("?")>=0)?O.substring(O.indexOf("?")):""):window.location.search;
if(O&&O.length>0){return C(O.substring(1),P)
}return""
},getUserKey:function(){return D
},hasPermissionFor:function(O){switch(O){case"manage":return !!A.getResourceUrl("marketplace-installed");
case"install":return !!A.getResourceUrl("featured");
case"log":return !!A.getResourceUrl("audit-log");
case"compatibility":return !!A.getResourceUrl("product-updates");
case"osgi":return !!A.getResourceUrl("osgi-bundles");
case"settings":return !!A.getResourceUrl("upm-settings");
case"install-file":return !!A.getResourceUrl("install-file")
}return false
},isApplicationApiSupported:function(){return !!AJS.params.isApplicationApiSupported
},isBaseUrlInvalid:function(){return !!M.get("baseUrlInvalid")
},isDataCenter:function(){var O=A.getHostLicense();
return O&&O.dataCenter
},isDevelopmentProductVersion:function(){return E.development
},isLoggedInUser:function(){return !!A.getCurrentUserFullName()
},isMpacAvailable:function(){return !(A.isMpacDisabled()||A.isMpacUnavailable())
},isMpacDisabled:function(){return M.get("pacDisabled")
},isMpacUnavailable:function(){return M.get("pacUnavailable")
},isOnDemand:function(){return AJS.params.isOnDemand
},isPlatformFreeTier:function(){return !!AJS.params.isPlatformFreeTier
},isSafeMode:function(){return !!M.get("safeMode")
},isUnknownProductVersion:function(){return E.unknown
},pathToAvailableAddonByKey:function(O){return A.getContextPath()+"/rest/plugins/1.0/available/"+O+"-key"
},pathToInstalledAddonByKey:function(O){return A.getContextPath()+"/rest/plugins/1.0/"+O+"-key"
},pathToInstalledMarketplaceAddonByKey:function(O){return A.getContextPath()+"/rest/plugins/1.0/"+O+"/marketplace"
},pathToManageApplicationsPage:function(){return AJS.params.upmUriManageApplications
},pathToRequestAddonByKey:function(O){return A.getResourceUrl("plugin-requests",{pluginKey:O})
},refreshNotifications:function(){AJS.$("#upm-notifications").trigger("refreshNotifications")
},refreshMpacAvailability:function(){return F.ajax({url:A.getResourceUrl("pac-status"),type:"get",cache:false,dataType:"json",data:null}).done(function(O){A.getHostStatusModel().set({pacDisabled:O.disabled,pacUnavailable:!O.reached})
})
},refreshProductVersionInfo:function(){var O=A.getResourceUrl("product-version");
return F.ajax({url:O,cache:false,contentType:A.getContentType(),dataType:"json"}).then(function(P){E={development:P.development,unknown:P.unknown};
return N.clone(E)
})
},setMarketplaceEulaAccepted:function(){return F.ajax({url:A.getResourceUrl("user-accepted-mpac-eula"),type:"PUT",contentType:A.getContentType(),data:"true"}).promise()
},setResourceUrls:function(P,O){B=N.extend(B,P);
H=N.extend(H,O)
}});
function C(Q,S){if(Q){var P=Q.split("&");
for(var O=0;
O<P.length;
O++){var R=P[O].split("=");
if(R[0]==S){return decodeURIComponent(R[1]).replace(/\+/g," ")
}}}return""
}function K(P,O){if(P){for(var Q in O){if(O.hasOwnProperty(Q)){P=P.replace("{"+Q+"}",encodeURIComponent(O[Q]))
}}return P
}}F(function(){D=AJS.params.upmCurrentUserKey;
B=N.extend(B,{token:AJS.params.upmUriToken,"marketplace-installed":AJS.params.upmUriInstalled,"pac-status":AJS.params.upmUriPacStatus,"pac-enable-communication":AJS.params.upmUriEnablePacCommunication,"pac-disable-communication":AJS.params.upmUriDisablePacCommunication,"enable-plugin-requests":AJS.params.upmUriEnablePluginRequests,"disable-plugin-requests":AJS.params.upmUriDisablePluginRequests,"product-updates":AJS.params.upmUriProductUpdates,"audit-log":AJS.params.upmUriAuditLog,featured:AJS.params.upmUriFeatured,popular:AJS.params.upmUriPopular,"top-grossing":AJS.params.upmUriTopGrossing,"highest-rated":AJS.params.upmUriHighestRated,trending:AJS.params.upmUriTrending,atlassian:AJS.params.upmUriByAtlassian,"top-vendor":AJS.params.upmUriTopVendor,recent:AJS.params.upmUriAvailable,marketplace:AJS.params.upmUriMarketplace,"plugin-requests":AJS.params.upmUriPluginRequestsPage,categories:AJS.params.upmUriCategories,banners:AJS.params.upmUriBanners,"install-file":AJS.params.upmUriInstallFile,"install-uri":AJS.params.upmUriInstallUri,"safe-mode":AJS.params.upmUriSafeMode,"enter-safe-mode":AJS.params.upmUriEnterSafeMode,"audit-log-purge-after":AJS.params.upmUriPurgeAfter,"audit-log-purge-after-manage":AJS.params.upmUriManagePurgeAfter,"osgi-bundles":AJS.params.upmUriOsgiBundles,"osgi-services":AJS.params.upmUriOsgiServices,"osgi-packages":AJS.params.upmUriOsgiPackages,"pending-tasks":AJS.params.upmUriPendingTasks,"product-version":AJS.params.upmUriProductVersion,"create-requests":AJS.params.upmUriCreateRequests,"most-requested":AJS.params.upmUriViewRequests,"audit-log-servlet":AJS.params.upmUriAuditLogServlet,available:AJS.params.upmUriAvailable,purchases:AJS.params.upmUriPurchases,"update-licenses":AJS.params.upmUriUpdateLicenses,"update-licenses-signed":AJS.params.upmUriUpdateLicensesSigned,analytics:AJS.params.upmUriAnalytics,manage:AJS.params.upmUriManage,"upm-settings":AJS.params.upmUriSettings,"user-settings":AJS.params.upmUriUserSettings,"user-accepted-mpac-eula":AJS.params.upmUriAcceptedMpacEula,"create-eval-license":AJS.params.upmUriCreateEvalLicense,"applications-rest":AJS.params.applicationsRest,"available-apps":AJS.params.availableApps,"atlassian-id-login":AJS.params.upmUriAtlassianIdLogin,"billing-proxy":AJS.params.upmUriBillingProxy,"mpac-base-url":AJS.params.mpacBaseUrl});
if(AJS.params.pacDisabled){M.set("pacDisabled",AJS.params.pacDisabled)
}if(AJS.params.pacUnavailable){M.set("pacUnavailable",AJS.params.pacUnavailable)
}G.resolve()
});
return A
});