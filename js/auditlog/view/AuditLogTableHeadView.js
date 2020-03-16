UPM.define('AuditLogTableHeadView', ['BaseView', 'UpmEnvironment'], function(BaseView, UpmEnvironment) {

    return BaseView.extend({

        events: {
            "click .upm-audit-log-refresh": "_refreshTable",
            "click .upm-audit-log-feed": "_setAuditLogFeedUrl"
        },

        /**
         * Sets the URL of the audit log feed button when a user clicks on it.
         *
         * This event listener purposely does not prevent default on the click event.
         *
         * @private
         */
        _setAuditLogFeedUrl: function() {
            this.$el.find('.upm-audit-log-feed').attr('href', UpmEnvironment.getResourceUrl('audit-log'));
        },

        /**
         * Refreshes the current page of audit log results.
         *
         * @param e The click event
         * @private
         */
        _refreshTable: function(e) {
            e.preventDefault();
            this.model.refresh();
        }
    });
});
