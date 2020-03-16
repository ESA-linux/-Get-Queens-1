UPM.define("VendorFeedbackDialog",["UpmDialog","VendorFeedbackDialogTemplate"],function(A,B){return A.extend({template:B,_getData:function(){return{plugin:this.model.toJSON(),action:this.options.action.key}
},_getReturnValue:function(){return{shareUserInfo:this.$el.find("#upm-feedback-share").is(":checked"),reason:this.$el.find("#option-reason").val(),textReason:this.$el.find("#text-reason").val()}
},_onConfirm:function(){if(this.$el.find("#option-reason").val()==="upm.feedback.select.reason"){this.$el.find("#reason-error").removeClass("hidden")
}else{A.prototype._onConfirm.apply(this)
}}})
});