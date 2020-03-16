UPM.define("AddonRequestDialog",["UpmDialog","AddonRequestDialogTemplate"],function(A,B){return A.extend({template:B,_getData:function(){var C=this.model.getCurrentUserRequest()&&this.model.getCurrentUserRequest().message;
return{plugin:this.model.toJSON(),existingMessage:C,isUpdate:(C!==undefined)&&(C!=="")}
},_onConfirm:function(){var C=this.$el.find("#pluginRequestMessage").val();
this.close();
this.model.submitRequest(C)
}})
});