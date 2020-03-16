UPM.define("MarketplaceInstallFlow",["jquery","AddonActions","CommonInstallAndLicensingFlows","EvalRedirectConfirmDialogTemplate","InstallOrLicenseResultDialog","UpmDialog","UpmEnvironment","UpmLongRunningTasks","UpmXsrfTokenState","LicenseAfterInstallDialog"],function(F,L,A,K,I,J,B,E,C,H){var D={installOrLicense:function(N,O,P){A.confirmInstallOrLicenseAction(N,O).done(function(){if(!N.isInstalled()){M(N,O,P)
}else{if(O===L.TRY){A.startEvaluation(N)
}else{N.loadLicenseDetails().done(function(){A.submitMarketplaceActionToMAC(N,O,P)
})
}}})
}};
function M(P,S,T){var Q=P.toJSON(),O="install",N="install-uri",R;
if(P.isAtlassianConnect()){R={pluginUri:Q.links.descriptor,pluginName:Q.name,pluginKey:Q.key}
}else{R={pluginUri:Q.links.binary,pluginName:Q.name,pluginVersion:Q.version}
}E.startProgress("install",{name:Q.name});
if(!E.abortIfHasPendingTask()){C.tryWithToken(function(U){return F.ajax({type:"POST",url:B.getResourceUrl(N)+"?token="+U,dataType:"json",contentType:B.getContentType(O),data:JSON.stringify(R),}).promise()
}).done(function(X,V,W){var U=(X&&X.links&&X.links.self)||W.getResponseHeader("Location");
E.pollForCompletion(U,X.pingAfter).done(function(Y){G(Y,P,S,T)
}).fail(function(Y){P.signalAjaxError(Y)
})
}).fail(function(U){E.stopProgress();
P.signalAjaxError(U)
})
}}function G(O,N,P,Q){N.refresh().then(function(){E.stopProgress();
C.refreshToken();
B.refreshNotifications();
return N.focus()
}).then(function(){return N.loadInstalledAddonModel()
}).then(function(S){if(S.isLicenseUpdatable()&&S.getLinks()[P.legacyKey]){if(P===L.BUY){(new H({model:N})).getResult().done(function(){A.submitMarketplaceActionToMAC(N,P,Q)
})
}else{if(P===L.TRY&&!N.getLicenseDetails()){var R=new J({template:K});
UPM.trace("eval-redirect-dialog");
R.getResult().then(function(){A.startEvaluation(N)
})
}else{A.showInstallOrUpdateCompletion(N,S,O,false)
}}}else{A.showInstallOrUpdateCompletion(N,S,O,false)
}}).fail(function(R){E.stopProgress();
N.signalAjaxError(R)
})
}return D
});