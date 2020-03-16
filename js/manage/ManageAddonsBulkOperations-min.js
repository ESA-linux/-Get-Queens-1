UPM.define("ManageAddonsBulkOperations",["jquery","underscore","CommonInstallAndLicensingFlows","DisableIncompatibleConfirmDialogTemplate","DisableIncompatibleResultDialogTemplate","ManageAddonsFilterType","ManageAddonsPageModel","UpdateAllResultDialog","UpmAjax","UpmDialog","UpmEnvironment","UpmFormats","UpmLongRunningTasks","UpmRequireRestart","UpmXsrfTokenState","UpmStrings"],function(E,U,N,H,C,A,S,M,R,V,Q,K,W,D,P,I){var G={disableIncompatibleAddons:function(){var X=S.getIncompatibleAddons().length,Y=new V({template:H,data:{count:X}});
Y.getResult().done(function(){W.startProgress("disableall",{totalItems:X});
if(!W.abortIfHasPendingTask()){L().then(function(Z){return W.pollForCompletion(Z.links.self,Z.pingAfter)
}).always(W.stopProgress).done(O).fail(function(Z){R.signalAjaxError(Z)
})
}})
},showUpdateAllResults:function(Y,a){var d=Y?Y.length:0,c=a?a.length:0;
if((d+c)===1){if(d){var b=Y[0],X=S.getAddonModelByKey(b.key);
X.loadDetails(true).done(function(){N.showInstallOrUpdateCompletion(X,X,b,true)
})
}else{F(a[0],true)
}}else{var Z=new M({successes:Y,failures:a});
UPM.trace("update-all-result-dialog");
Z.getResult().always(function(){T(Y,a,true).done(function(){UPM.trace("update-all-complete")
})
})
}},updateAllAddons:function(){var X=S.getBatchUpdatableAddons().length;
W.startProgress("updateall",{totalItems:X},"updating");
if(!W.abortIfHasPendingTask()){P.tryWithToken(J).then(function(Y){return W.pollForCompletion(Y.links.self,Y.pingAfter)
}).always(W.stopProgress).done(B).fail(function(Y){R.signalAjaxError(Y)
})
}}};
function L(){return E.ajax({type:"POST",url:Q.getResourceUrl("disable-all"),dataType:"json",contentType:Q.getContentType("disable-all")})
}function O(X){S.setFilter(A.USER_INSTALLED);
T(X.status.successes,X.status.failures,false).done(function(){new V({template:C,data:{successCount:X.status.successes.length,totalCount:X.status.successes.length+X.status.failures.length}});
UPM.trace("disable-all-complete")
})
}function F(Y,a){var X=S.getAddonModelByKey(Y.key),Z=a?"upm.pluginInstall.error.":"upm.disableall.error.";
if(X){if(Y.subCode){Y.subCode=Z+Y.subCode
}X.triggerMessage({type:"error",message:K.format(I[Y.subCode||"upm.plugin.error.unexpected.error"],Y.name)})
}}function T(X,Y,Z){return E.when(U.map(X,function(b){var a=S.getAddonModelByKey(b.key);
if(a){return a.refresh()
}else{return E.Deferred()
}})).done(function(){U.each(Y,function(a){F(a,Z)
})
})
}function J(X){return E.ajax({type:"POST",url:Q.getResourceUrl("update-all")+"?token="+X,dataType:"json",contentType:Q.getContentType("update-all"),})
}function B(X){if(X.links["changes-requiring-restart"]){Q.setResourceUrls(X.links);
D.checkForChangesRequiringRestart()
}Q.refreshNotifications();
G.showUpdateAllResults(X.status.successes,X.status.failures)
}return G
});