UPM.define("EnableDisableAddonFlows",["jquery","DisableConfirmDialogTemplate","UpmDialog","UpmLongRunningTasks"],function(E,G,A,D){var B={disableAddon:function(H){return F(H).then(function(){return C(H,false)
})
},enableAddon:function(H){return C(H,true)
},};
function F(H){if(H.getLicenseDetails()&&H.getLicenseDetails().autoRenewal){return new A({model:H,template:G}).getResult()
}else{return E.Deferred().resolve().promise()
}}function C(H,I){D.startProgress(I?"enable":"disable",{name:H.get("name")});
if(!D.abortIfHasPendingTask()){return H.enableOrDisable(I).always(function(){D.stopProgress().done(function(){UPM.trace(I?"enable-complete":"disable-complete")
})
})
}else{return E.Deferred()
}}return B
});