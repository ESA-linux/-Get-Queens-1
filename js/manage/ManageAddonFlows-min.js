UPM.define("ManageAddonFlows",["jquery","AddonActions","CommonInstallAndLicensingFlows","EnableDisableAddonFlows","InstallOrLicenseResultDialog","ManageAddonsFilterType","ManageAddonsPageModel","RefreshAfterInstallDialog","ServerToDataCenterUpdateConfirmDialogTemplate","UninstallConfirmDialogTemplate","UpdateScopeConfirmDialogTemplate","UpmAjax","UpmDialog","UpmEnvironment","UpmInstaller","UpmLongRunningTasks","UpmStrings","VendorFeedbackDialog"],function(D,G,L,C,N,B,R,E,U,F,A,Q,V,P,O,W,I,J){var S={addonAction:function(Y,X){switch(Y){case G.BUY:K(X,Y);
break;
case G.CHECK_LICENSE:S.retrieveAddonLicense(X);
break;
case G.CONFIGURE:window.location.href=X.getLinks().configure;
break;
case G.CROSSGRADE:L.crossgradeAppLicense(X);
break;
case G.DISABLE:C.disableAddon(X).then(W.getProgressDialogPromise).done(function(){S.openVendorFeedbackDialog(X,Y)
});
break;
case G.DOWNLOAD:L.openDownloadDialog(X);
break;
case G.ENABLE:C.enableAddon(X);
break;
case G.GET_STARTED:if(X.hasLink("post-install")){X.logAnalytics("postinstall",{dialog:false});
window.location.href=X.getLinks()["post-install"]
}break;
case G.RENEW:L.submitMarketplaceActionToMAC(X,Y);
break;
case G.RENEW_CONTACT:L.openRenewContactDialog(X);
break;
case G.REQUEST_UPDATE:L.openUpdateRequestDialog(X);
break;
case G.TRY:L.confirmInstallOrLicenseAction(X,Y).done(function(){X.logAnalytics("try");
L.startEvaluation(X)
});
break;
case G.UNINSTALL:S.uninstallAddon(X);
break;
case G.UPDATE:S.updateAddon(X);
break;
case G.UPGRADE:K(X,Y);
break
}},disableAddonModule:function(X){W.startProgress("disable",{name:X.getName()});
if(!W.abortIfHasPendingTask()){X.disable().always(W.stopProgress)
}},enableAddonModule:function(X){W.startProgress("enable",{name:X.getName()});
if(!W.abortIfHasPendingTask()){X.enable().always(W.stopProgress)
}},openInstallDialog:function(){function X(Y){W.startProgress("install",{name:Y});
return W.abortIfHasPendingTask()
}O.openInstallDialog(X).done(function(Y,Z){return W.pollForCompletion(Y.links.self,Y.pingAfter).always(W.stopProgress).done(function(a){H(a,Z)
}).fail(function(a){Q.signalAjaxError(a,Z.getFileName()||Z.getUrl())
})
}).fail(function(Y){Q.signalAjaxError(Y)
})
},openVendorFeedbackDialog:function(X,Z){if(X.canSendVendorFeedback()&&(Z===G.DISABLE||Z===G.UNINSTALL)){var Y=new J({model:X,action:Z});
Y.getResult().done(function(a){X.sendVendorFeedback(Z,a.reason,a.textReason,a.shareUserInfo?P.getCurrentUserEmail():null,a.shareUserInfo?P.getCurrentUserFullName():null)
}).fail(function(){X.logAnalytics("vendor-feedback-cancel",{pv:X.getVersion(),feedbackType:Z.key.toLowerCase()})
})
}},retrieveAddonLicense:function(X){var Y=X.toJSON();
X.logAnalytics("retrieve-license");
W.startProgress("checkLicense");
X.retrieveLicense().always(W.stopProgress).then(function(Z){if(Z.message){X.triggerMessage({type:Z.type,message:I[Z.message]})
}else{X.triggerEventAfterExpanding("licenseUpdated",Y,true)
}})
},uninstallAddon:function(X){new V({template:F,data:{plugin:X.toJSON()}}).getResult().done(function(){W.startProgress("uninstall",{name:X.getName()});
if(!W.abortIfHasPendingTask()){X.uninstall().done(function(){P.refreshNotifications();
W.getProgressDialogPromise().done(function(){S.openVendorFeedbackDialog(X,G.UNINSTALL);
UPM.trace("uninstall-complete")
})
}).always(W.stopProgress)
}})
},updateAddon:function(X){var Y=X.toJSON();
X.loadDetails().then(function(){return M(X)
}).done(function(){W.startProgress("update",{name:X.getName()});
if(!W.abortIfHasPendingTask()){X.startUpdate().then(function(Z){return W.pollForCompletion(Z.links.self,Z.pingAfter)
}).done(function(Z){if(Z.statusCode===202){T(X,Z.status.nextTaskPostUri)
}else{W.stopProgress();
X.refresh().done(function(){L.showInstallOrUpdateCompletion(X,X,Z,true,Y);
P.refreshNotifications()
})
}}).fail(function(Z){W.stopProgress();
X.signalAjaxError(Z)
})
}})
},updateUpm:function(){var X=R.getAddonModelByKey(P.getUpmPluginKey());
R.set("upmUpdateVersion",null);
S.updateAddon(X)
}};
function T(X,Y){D.ajax({type:"POST",url:Y,dataType:"json",contentType:P.getContentType("json")}).then(function(Z){return W.pollForCompletion(Z.links.self,Z.pingAfter)
}).done(function(Z){return D.ajax({type:"DELETE",url:Z.status.cleanupDeleteUri,dataType:"json"}).done(function(){W.stopProgress();
if(Z.status.requiresRefresh){new E();
UPM.trace("requires-refresh-after-install")
}})
}).fail(function(){X.triggerMessage({type:"error",message:I["upm.update.self.update.error"]})
}).always(W.stopProgress)
}function M(X){if(P.isDataCenter()&&!X.getStatusDataCenterCompatible()&&X.getAvailableUpdate()&&X.getAvailableUpdate().statusDataCenterCompatible&&X.getLicenseDetails()&&!X.getLicenseDetails().dataCenter){var Y=new V({template:U,data:{plugin:X.toJSON(),expiryDateString:X.getAvailableUpdate()&&X.getAvailableUpdate().dataCenterCutoffDateString}});
return Y.getResult()
}else{return D.Deferred().resolve()
}}function H(X){R.setFilter(X.applicationKey?B.APPLICATIONS:B.USER_INSTALLED);
return R.fetch().done(function(){var Y=R.getAddonModelByKey(X.key);
if(X.statusCode=="202"){T(Y,X.status.nextTaskPostUri)
}else{L.showInstallOrUpdateCompletion(Y,Y,X);
P.refreshNotifications()
}})
}function K(X,Y){var Z=function(b){var a=(b&&b.action)||Y;
L.confirmInstallOrLicenseAction(X,a).done(function(){X.logAnalytics(a.key.toLowerCase());
if(a===G.TRY){L.startEvaluation(X)
}else{L.submitMarketplaceActionToMAC(X,a,b&&b.users)
}})
};
X.loadPricingModel().done(function(){if(X.hasRoleBasedPricing()){L.openRoleBasedPricingDialog(X,Y).done(Z)
}else{Z()
}})
}return S
});