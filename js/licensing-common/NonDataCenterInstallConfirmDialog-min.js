UPM.define("NonDataCenterInstallConfirmDialog",["UpmDialog","AddonActions","NonDataCenterInstallConfirmDialogTemplate"],function(B,A,C){return B.extend({template:C,_getData:function(){return{plugin:this.model.toJSON()}
},_postRender:function(){var D=this;
this.$el.find(".request-data-center-compatible-link").on("click",function(E){E.preventDefault();
D.close();
D.model.signalAction(A.REQUEST_UPDATE)
})
}})
});