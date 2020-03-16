UPM.define('AuditLogPaginationView',
    [
        'BaseView',
        'UpmAjax',
        'UpmFormats',
        'UpmStrings'
    ], function(BaseView,
                UpmAjax,
                UpmFormats,
                UpmStrings) {

    return BaseView.extend({

        events: {
            "click .first-log-page": "_goToFirstPage",
            "click .last-log-page": "_goToLastPage",
            "click .previous-log-page": "_goToPreviousPage",
            "click .next-log-page": "_goToNextPage"
        },

        _initEvents: function() {
            this.listenTo(this.model, "updated", this._updatePaginationButtons);
            this.listenTo(this.model, "updated", this._updatePaginationText);
            this.listenTo(this.model, "errorOccured", UpmAjax.signalAjaxError);
        },

        _updatePaginationButtons: function() {
            var model = this.model;

            this.$el.find(".first-log-page").toggleClass("disabled", !model.getFirstPageHref());
            this.$el.find(".last-log-page").toggleClass("disabled", !model.getLastPageHref());
            this.$el.find(".previous-log-page").toggleClass("disabled", !model.getPreviousPageHref());
            this.$el.find(".next-log-page").toggleClass("disabled", !model.getNextPageHref());
        },

        _updatePaginationText: function() {
            var model = this.model,
                startIndex = model.getStartIndex(),
                totalEntries = model.getTotalEntries(),
                resultsCount = model.getCollection().length;

            this.$el.find(".upm-audit-log-count").text(UpmFormats.format(UpmStrings['upm.auditLog.count'], startIndex + 1, startIndex + resultsCount, totalEntries) );
        },

        _goToFirstPage: function(e) {
            e.preventDefault();
            this.model.gotoFirstPage();
        },

        _goToLastPage: function(e) {
            e.preventDefault();
            this.model.gotoLastPage();
        },

        _goToPreviousPage: function(e) {
            e.preventDefault();
            this.model.gotoPreviousPage();
        },

        _goToNextPage: function(e) {
            e.preventDefault();
            this.model.gotoNextPage();
        }
    });
});
