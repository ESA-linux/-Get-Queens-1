UPM.require(["jquery","backbone","AuditLogPageModel","AuditLogEntryCollection","AuditLogPaginationView","AuditLogTableHeadView","BaseCollectionView","AuditLogEntryView","AuditLogDescriptionView","AuditLogPurgeOptionsView","AuditLogPurgeOptionsModel","UpmCommonUi","UpmLoadingView"],function(D,K,F,A,M,B,I,G,C,L,E,J,H){J.getReadyState().done(function(){var P=D("table.upm-audit-log-table");
var Q=new A();
var O=new F({collection:Q});
new M({model:O,el:D("#upm-audit-log-pagination")});
new B({model:O,el:P.find("thead")});
new I({collection:Q,itemView:G,el:P.find("tbody")});
new H({model:O,el:D("#upm-container")});
O.getEntries();
var N=new E();
new C({model:N,el:D(".upm-log-policy")});
new L({model:N,el:D(".upm-purge-options")});
N.fetch()
})
});