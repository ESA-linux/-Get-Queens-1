UPM.require(["jquery","ManageAddonFlows","ManageAddonsBulkOperations","ManageAddonsFilterType","ManageAddonsListContainerView","ManageAddonsPageHeaderView","ManageAddonsPageModel","ManageAddonsRouter","UpmCommonUi","UpmEnvironment","UpmSafeMode","UpmSettings","UpmUpdateAvailabilityView"],function(H,F,M,A,E,K,G,J,N,C,P,Q,O){var D,I,B;
N.getReadyState().done(function(){var R=N.getLocationHash();
if(L(R)){return 
}D=G;
D.on("disableAllIncompatible",M.disableIncompatibleAddons);
D.on("updateAll",M.updateAllAddons);
D.on("updateUpm",F.updateUpm);
D.on("upload",F.openInstallDialog);
new K({model:D,el:H("#upm-container.upm-manage")});
new O({model:D});
B=D.getAllAddonsCollection();
B.on("action",F.addonAction);
new E({model:D,el:H("#upm-manage-container")});
if(R.key){D.setFocusedAddonKey(R.key);
D.setFocusedAddonMessage(R.message)
}if(C.getResourceUrl("install-file")||C.getResourceUrl("install-uri")){H("#upm-upload").removeClass("hidden")
}P.onSafeModeChanged(function(){D.fetch()
});
J.on("route:setFilter",function(S){filter=A.fromKey(S)||A.defaultFilter();
D.setFilter(filter)
});
J.on("route:settingsDialog",function(S){Q.openGlobalSettingsDialog()
});
J.start();
D.fetch()
});
function L(U){var T,R,S;
if(U&&U.tab){if(U.tab==="compatibility"){T="check"
}else{if(U.tab==="install"){T="marketplace"
}else{if(U.tab==="osgi"){T="osgi"
}else{return false
}}}S=document.location.search||"";
R=U.key?"#"+U.tab+"/"+U.key:"";
document.location.href=document.location.pathname+"/"+T+S+R;
return true
}return false
}});