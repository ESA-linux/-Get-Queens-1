UPM.define("AuditLogEntryView",["moment","BaseCollectionItemView"],function(B,A){return A.extend({template:"#upm-log-table-template",_getData:function(){var C=this.model.toJSON();
C.dateUpdated=B(C.dateUpdated).format("MMM D YYYY h:mm:ss A");
return C
}})
});