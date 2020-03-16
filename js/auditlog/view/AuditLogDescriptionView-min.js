UPM.define("AuditLogDescriptionView",["BaseView","UpmFormats","UpmStrings"],function(C,B,A){return C.extend({_initEvents:function(){this.listenTo(this.model,"sync",this._updatePurgeHeader)
},_updatePurgeHeader:function(){var E=this.model.getPurgeAfter();
var D=(E===1)?A["upm.log.description.singular"]:B.format(A["upm.log.description"],E);
this.$el.text(D)
}})
});