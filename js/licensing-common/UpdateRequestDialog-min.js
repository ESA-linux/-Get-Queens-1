UPM.define("UpdateRequestDialog",["UpmDialog","UpdateRequestDialogTemplate"],function(B,A){return B.extend({template:A,_getData:function(){return{pluginName:this.model.getName(),dataCenterIncompatible:this.options.dataCenterIncompatible}
},_getReturnValue:function(){return{message:this.$el.find("#text-message").val(),shareDetails:this.$el.find("#upm-contact-details-share").is(":checked")}
}})
});