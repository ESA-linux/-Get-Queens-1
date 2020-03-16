UPM.define("LicenseContactRequiredDialog",["UpmDialog","LicenseContactRequiredDialogTemplate"],function(B,A){return B.extend({template:A,_getData:function(){return{plugin:this.model.toJSON(),license:this.model.getLicenseDetails()}
}})
});