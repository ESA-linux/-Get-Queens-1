UPM.define("ManageAddonView",["jquery","underscore","AddonActions","AddonView","CollectionItemRenderingStrategy","ManageAddonTemplate","ManageAddonDetailsView","UpmEnvironment","UpmStrings"],function(E,I,H,A,G,F,B,C,D){return A.extend({template:F,detailViewClass:B,renderingStrategy:G,_initEvents:function(){A.prototype._initEvents.apply(this);
this.$el.on("mouseenter",I.bind(this._updateLozengeStyles,this,true));
this.$el.on("mouseleave",I.bind(this._updateLozengeStyles,this,false));
this.listenTo(this.model,"canRemoveFromCollection",this.removeOnNextCollapse);
this.listenTo(this.model,"change",this._rerenderWithoutCollapsing);
this.listenTo(this.model,"filtered",this._onFiltered);
this.listenTo(this.model,"uninstalled",this._onUninstalled)
},_getData:function(){var J,L,K=this.model.getPrimaryAction();
if(K&&K.name){J=K.name;
L=this._getLozengeClass(J)
}return I.extend(A.prototype._getData.apply(this),{isUpdatable:this.model.isUpdatable(),lozengeType:J,lozengeClass:L})
},_getActionsOrder:function(){var K=this.model.getPrimaryAction()&&this.model.getPrimaryAction().name,M,L;
if(K!==undefined){if(K==="incompatible_with_update"||K==="incompatible_with_paid_update"){return[H.UPDATE]
}else{if(K==="incompatible_without_update"||K==="incompatible_data_center_without_update"||K==="incompatible_legacy_data_center_compatible"){return[H.REQUEST_UPDATE]
}else{if((K==="eval_nearly_expired"||K==="eval_recently_expired")&&C.getHostLicense()&&(C.getHostLicense().licenseType==="COMMUNITY")){return[H.BUY]
}else{if(K===""||K==="updatable_nondeployable"){return[H.DOWNLOAD]
}else{if(K==="license_nearly_expiring"||K==="license_recently_expired"){return[H.CROSSGRADE,H.RENEW_CONTACT,H.RENEW]
}else{M=H.fromLegacyKey(K);
if(M){return[M]
}}}}}}}L=this.model._getActionsOrder();
for(var J=0;
J<L.length;
J++){M=L[J];
if(this.model.getActionState(M)===true){if(!(M===H.BUY&&this.model.getLicenseDetails()&&this.model.getLicenseDetails().error==="EXPIRED"&&!K)){return this._canBePrimaryAction(M)?[M]:[]
}}}return[]
},_getMaxTopLevelActions:function(){return 1
},_canBePrimaryAction:function(J){switch(J){case H.BUY:case H.TRY:case H.UPDATE:case H.RENEW:case H.RENEW_CONTACT:case H.UPGRADE:case H.SUBSCRIBE:case H.TRIAL_RESUME:case H.TRIAL_SUBSCRIBE:case H.REQUEST_UPDATE:case H.DOWNLOAD:case H.CROSSGRADE:return true;
default:return false
}},_getLozengeClass:function(J){if(J==="maintenance_nearly_expiring"||J==="license_nearly_expiring"||J==="renew-contact"||J==="eval_nearly_expired"||J==="upgrade_nearly_required"||J==="incompatible_data_center_without_update"||J==="incompatible_data_center_requested_update"||J==="incompatible_data_center_with_update"||J==="incompatible_legacy_data_center_compatible"){return"aui-lozenge-current"
}if(J==="update-details-binary"||J==="updatable"||J==="updatable_to_paid"||J==="updatable_nondeployable"){return"aui-lozenge-complete"
}return"aui-lozenge-error"
},_onChangeLicense:function(){this._expandDetails()
},_onFiltered:function(J){this.$el.toggleClass("hidden",!J)
},_onUninstalled:function(){this.removeOnNextCollapse();
this.model.triggerMessage({type:"info",message:D["upm.messages.uninstall.success"]})
},_rerenderWithoutCollapsing:function(){var J=this.isExpanded();
this.render();
if(J){this._expandDetails()
}},_updateLozengeStyles:function(J){if(!this.isExpanded()){this.$el.find(".upm-plugin-notice .aui-lozenge").toggleClass("aui-lozenge-subtle",!J)
}}})
});