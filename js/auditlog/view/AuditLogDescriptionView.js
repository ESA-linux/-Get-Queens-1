/**
 * View for the Audit Log Purge Options form.
 */
UPM.define('AuditLogDescriptionView', ['BaseView', 'UpmFormats', 'UpmStrings'], function(BaseView, UpmFormats, UpmStrings) {

    return BaseView.extend({

        _initEvents: function() {
            this.listenTo(this.model, "sync", this._updatePurgeHeader);
        },

        /**
         * Update the Heading above the list of audit log entries.
         *
         * @private
         */
        _updatePurgeHeader: function() {
            var days = this.model.getPurgeAfter();
            var text = (days === 1) ? UpmStrings['upm.log.description.singular'] : UpmFormats.format(UpmStrings['upm.log.description'], days);
            this.$el.text(text);
        }
    });
});