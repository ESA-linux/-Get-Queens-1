UPM.define("AuditLogTableHeadView",["BaseView","UpmEnvironment"],function(B,A){return B.extend({events:{"click .upm-audit-log-refresh":"_refreshTable","click .upm-audit-log-feed":"_setAuditLogFeedUrl"},_setAuditLogFeedUrl:function(){this.$el.find(".upm-audit-log-feed").attr("href",A.getResourceUrl("audit-log"))
},_refreshTable:function(C){C.preventDefault();
this.model.refresh()
}})
});