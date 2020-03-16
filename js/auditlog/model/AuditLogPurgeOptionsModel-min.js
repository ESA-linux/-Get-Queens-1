UPM.define("AuditLogPurgeOptionsModel",["brace","UpmContextPathMixin","UpmEnvironment"],function(C,B,A){return C.Model.extend({namedAttributes:["purgeAfter"],mixins:[B],url:function(){return this.getContextPath()+"/rest/plugins/1.0/log/feed/purge-after"
},updatePurgeOptions:function(D){this.setPurgeAfter(D);
this.save({},{contentType:A.getContentType("purge-after"),type:"PUT"})
},validate:function(D){var E=parseInt(D.purgeAfter,10);
if(!E||E<=0){return"upm.auditLog.purge.error.greater.than.zero.message"
}},canChangePurgeOptions:function(){return !!AJS.params.upmUriManagePurgeAfter
}})
});