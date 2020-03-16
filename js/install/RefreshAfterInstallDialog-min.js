UPM.define("RefreshAfterInstallDialog",["jquery","UpmDialog","RefreshAfterInstallDialogTemplate"],function(C,A,B){return A.extend({template:B,events:{"click .refresh-message a":"_doRefresh"},_postRender:function(){this.$el.find(".refresh-message a").attr("href","#")
},_doRefresh:function(D){if(D){D.preventDefault()
}this.close();
window.location.href=window.location.pathname
},_onConfirm:function(){this._doRefresh()
}})
});