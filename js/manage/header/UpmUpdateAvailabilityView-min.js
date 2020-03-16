UPM.define("UpmUpdateAvailabilityView",["jquery","underscore","BaseView","CollectionItemRenderingStrategy","ManageAddonsPageModel","SkipUpmUpdateConfirmDialogTemplate","UpmCommonUi","UpmDialog","UpmEnvironment","UpmMessageFactory","UpmUpdateAvailableTemplate"],function(F,M,G,I,E,O,L,J,B,A,D){var H=3,K="upm.selfUpdate.dismiss",C="upm.selfUpdate.skip",N=500;
return G.extend({events:{"click #upm-banner-update":"_onUpdateNowClick","click #upm-release-notes":"_onReleaseNotesClick","click #upm-remind-later":"_onRemindLaterClick","click #upm-skip-version":"_onSkipVersionClick"},renderingStrategy:I,_fadeOutAndRemoveMessage:function(){var P=this.$el;
P.fadeOut(N,M.bind(P.remove,P))
},_getHtml:function(){return A.newInfoMessage("",D({}),{closeable:false}).render().$el
},_initEvents:function(){this.listenTo(this.model,"change:upmUpdateVersion",this._updateState);
this.listenTo(B.getHostStatusModel(),"change:safeMode",this._updateState)
},_onReleaseNotesClick:function(P){P.preventDefault();
E.focusAddonByKey(B.getUpmPluginKey())
},_onRemindLaterClick:function(P){P.preventDefault();
F.cookie(K,"true",{expires:H});
this._fadeOutAndRemoveMessage()
},_onSkipVersionClick:function(Q){var P=this;
Q.preventDefault();
new J({template:O,data:{version:this.model.getUpmUpdateVersion()}}).getResult().done(function(){F.cookie(C,P.model.getUpmUpdateVersion());
P._fadeOutAndRemoveMessage()
})
},_onUpdateNowClick:function(P){P.preventDefault();
this.model.trigger("updateUpm")
},_postInitialize:function(){this._updateState()
},_updateState:function(){var P=this.model.getUpmUpdateVersion()&&!B.isSafeMode()&&!F.cookie(K)&&F.cookie(C)!==this.model.getUpmUpdateVersion();
this.render();
if(P){L.showMessageElement(this.$el)
}else{this.$el.remove()
}}})
});