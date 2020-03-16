UPM.define("UpmHostStatusMixin",["UpmEnvironment","UpmLongRunningTasks","UpmRequireRestart"],function(B,C,A){return{_bindHostStatus:function(){this.on("sync",this._syncHostStatus,this)
},_syncHostStatus:function(E,D){if(D){B.setResourceUrls(D.links);
B.getHostStatusModel().set(D.hostStatus);
if(D.links&&D.links["pending-tasks"]){C.checkForPendingTasks()
}if(D.links&&D.links["changes-requiring-restart"]){A.checkForChangesRequiringRestart()
}}}}
});