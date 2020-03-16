UPM.define("SettingsDialog",["underscore","UpmDialog","SettingsDialogTemplate"],function(B,A,C){return A.extend({template:C,_onConfirm:function(){var E=this,D=B.map(this.model.get("settings"),function(F){return B.extend({},F,{value:(E.$el.find("#upm-checkbox-"+F.key).is(":checked")!==F.defaultCheckedValue)})
});
this.model.set("settings",D);
A.prototype._onConfirm.apply(this)
}})
});