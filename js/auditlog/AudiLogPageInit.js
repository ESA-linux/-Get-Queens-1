UPM.require(["jquery",
    "backbone",
    "AuditLogPageModel",
    "AuditLogEntryCollection",
    "AuditLogPaginationView",
    "AuditLogTableHeadView",
    "BaseCollectionView",
    "AuditLogEntryView",
    "AuditLogDescriptionView",
    "AuditLogPurgeOptionsView",
    "AuditLogPurgeOptionsModel",
    "UpmCommonUi",
    "UpmLoadingView"],
    function($, Backbone,
                AuditLogPageModel,
                AuditLogEntryCollection,
                AuditLogPaginationView,
                AuditLogTableHeadView,
                BaseCollectionView,
                AuditLogEntryView,
                AuditLogDescriptionView,
                AuditLogPurgeOptionsView,
                AuditLogPurgeOptionsModel,
                UpmCommonUi,
                UpmLoadingView) {

    UpmCommonUi.getReadyState().done(function() {

        var table = $("table.upm-audit-log-table");
        var entryCollection = new AuditLogEntryCollection();
        var auditLogPageModel = new AuditLogPageModel({
            collection: entryCollection
        });

        new AuditLogPaginationView({
            model: auditLogPageModel,
            el: $("#upm-audit-log-pagination")
        });

        new AuditLogTableHeadView({
            model: auditLogPageModel,
            el: table.find("thead")
        });

        new BaseCollectionView({
            collection: entryCollection,
            itemView: AuditLogEntryView,
            el: table.find("tbody")
        });

        new UpmLoadingView({
            model: auditLogPageModel,
            el: $('#upm-container')
        });

        auditLogPageModel.getEntries();

        var auditLogPurgeOptionsModel = new AuditLogPurgeOptionsModel();

        new AuditLogDescriptionView({
            model: auditLogPurgeOptionsModel,
            el: $(".upm-log-policy")
        });

        new AuditLogPurgeOptionsView({
            model: auditLogPurgeOptionsModel,
            el: $(".upm-purge-options")
        });

        auditLogPurgeOptionsModel.fetch();
    });
});
