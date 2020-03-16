UPM.define("UploadDialog",["InstallParams","UpmDialog","UploadDialogTemplate"],function(C,A,B){return A.extend({template:B,events:{"input #upm-upload-file,#upm-upload-url":"_validateRequiredFields","change #upm-upload-file,#upm-upload-url":"_validateRequiredFields","keyup #upm-upload-file,#upm-upload-url":"_validateRequiredFields"},_postInitialize:function(){if(this.options.formContainer){this.options.formContainer.empty()
}},_getReturnValue:function(){return{file:this._getSelectedFile(),url:this._getSelectedUrl()}
},_getSelectedFile:function(){var D=this.$el.find("#upm-upload-file").val();
return(D&&D.trim())||null
},_getSelectedUrl:function(){var D=this.$el.find("#upm-upload-url").val();
return(D&&D.trim())||null
},_isSubmittable:function(){return this._getSelectedFile()||this._getSelectedUrl()
},_onConfirm:function(){if(this._isSubmittable){var D;
if(this._getSelectedFile()){D=new C({filePath:this._getSelectedFile()});
if(this.options.formContainer){var E=this.$el.find("form");
this.hide();
E.remove();
this.options.formContainer.append(E)
}}else{D=new C({url:this._getSelectedUrl()})
}this.close();
this.deferredResult.resolve(D)
}},_postRender:function(){this._validateRequiredFields()
},_validateRequiredFields:function(){var E=!this._isSubmittable(),F=this.$el.find(".confirm"),D=this.$el.find(".selected-file");
if(this._getSelectedFile()){D.html(new C({filePath:this._getSelectedFile()}).getFileName())
}else{D.html("")
}F.prop("disabled",E).attr("aria-disabled",E).toggleClass("disabled",E)
}})
});