UPM.define("AuditLogPurgeOptionsView",["jquery","BaseView","UpmFormats","UpmMessageDisplayingMixin","UpmStrings"],function(E,D,C,A,B){return D.extend({events:{"submit form":"_onFormSubmit"},mixins:[A],_initEvents:function(){this.listenTo(this.model,"sync",this._updatePurgeValue);
this.listenTo(this.model,"error",this._displayPurgeOptionsFailureMessage);
this.listenTo(this.model,"invalid",this._displayPurgeValidationErrorMessage)
},_postInitialize:function(){if(this.model.canChangePurgeOptions()){this.$el.removeClass("hidden")
}},_displayPurgeUpdatedMessage:function(){this._clearMessages();
var G=this.model.getPurgeAfter();
var F=(G>1)?"upm.log.purgeDurationUpdated.plural":"upm.log.purgeDurationUpdated";
this._displaySuccessMessage(B["upm.messages.update.success.heading"],C.format(B[F],G))
},_displayPurgeOptionsFailureMessage:function(){this._clearMessages();
this._displayErrorMessage(B["upm.auditLog.purge.error.title"],B["upm.auditLog.purge.error.message"])
},_displayPurgeValidationErrorMessage:function(F,G){this._clearMessages();
this._displayErrorMessage(B[G])
},_updatePurgeValue:function(){this.$el.find("input.upm-log-configuration-days").val(this.model.getPurgeAfter())
},_onFormSubmit:function(F){F.preventDefault();
this.listenToOnce(this.model,"sync",this._displayPurgeUpdatedMessage,this);
this.model.updatePurgeOptions(this.$el.find(".upm-log-configuration-days").val())
}})
});