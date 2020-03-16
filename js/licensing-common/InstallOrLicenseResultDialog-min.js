UPM.define("InstallOrLicenseResultDialog",["UpmDialog","AddonActions","InstallOrLicenseResultDialogTemplate"],function(B,A,C){return B.extend({template:C,_getData:function(){return{plugin:this.model.toJSON(),errorHtml:this.options.errorHtml||null,newLicense:this.options.newLicense||null,isInstall:this.options.isInstall||false,isUpdate:this.options.isUpdate||false,nextAction:this.options.nextAction,usesLicensing:this.model.isLicenseUpdatable(),updateForDisabledPlugin:this.options.updateForDisabledPlugin||false}
},_getPostInstallUrl:function(){return this.model.getLinks()[this.options.isUpdate?"post-update":"post-install"]
},_onConfirm:function(){if(this.options.nextAction==="get-started"){var D=this._getPostInstallUrl();
if(D){if(this.options.isUpdate){this.model.logAnalytics("postupdate")
}else{this.model.logAnalytics("postinstall",{dialog:true})
}window.location.href=D
}}B.prototype._onConfirm.apply(this)
},_postRender:function(){var D=this;
this.$el.find(".request-data-center-compatible-link").on("click",function(E){E.preventDefault();
D.close();
D.model.signalAction(A.REQUEST_UPDATE)
})
}})
});