/**
 * View for the Audit Log Purge Options form.
 */
UPM.define('AuditLogPurgeOptionsView',
    [
        'jquery',
        'BaseView',
        'UpmFormats',
        'UpmMessageDisplayingMixin',
        'UpmStrings'
    ], function($,
                BaseView,
                UpmFormats,
                UpmMessageDisplayingMixin,
                UpmStrings) {

    return BaseView.extend({

        events: {
            "submit form": "_onFormSubmit"
        },

        mixins: [UpmMessageDisplayingMixin],

        _initEvents: function() {
            this.listenTo(this.model, "sync", this._updatePurgeValue);
            this.listenTo(this.model, "error", this._displayPurgeOptionsFailureMessage);
            this.listenTo(this.model, "invalid", this._displayPurgeValidationErrorMessage);
        },

        _postInitialize: function() {
            if (this.model.canChangePurgeOptions()) {
                this.$el.removeClass("hidden");
            }
        },

        _displayPurgeUpdatedMessage: function() {
            this._clearMessages();
            var days = this.model.getPurgeAfter();
            var key = (days > 1) ? "upm.log.purgeDurationUpdated.plural" : "upm.log.purgeDurationUpdated";
            this._displaySuccessMessage(UpmStrings['upm.messages.update.success.heading'], UpmFormats.format(UpmStrings[key], days));
        },

        /**
         * Displays an error message when updating the Purge duration fails.
         *
         * @private
         */
        _displayPurgeOptionsFailureMessage: function() {
            this._clearMessages();
            this._displayErrorMessage(UpmStrings['upm.auditLog.purge.error.title'], UpmStrings["upm.auditLog.purge.error.message"]);
        },

        /**
         * Displays a message when validation of the Purge Duration fails.
         *
         * @param model The Purge Options Model.
         * @param message The message key to display.
         * @private
         */
        _displayPurgeValidationErrorMessage: function(model, message) {
            this._clearMessages();
            this._displayErrorMessage(UpmStrings[message]);
        },

        /**
         * Updates the value of the purge form when the model is initially retrieved from the server.
         *
         * @private
         */
        _updatePurgeValue: function () {
            this.$el.find("input.upm-log-configuration-days").val(this.model.getPurgeAfter());
        },

        /**
         * Handles the submission of the Audit Log Purge Duration form.
         *
         * @param e The form's submit event.
         * @private
         */
        _onFormSubmit: function(e) {
            e.preventDefault();
            this.listenToOnce(this.model, "sync", this._displayPurgeUpdatedMessage, this);
            this.model.updatePurgeOptions(this.$el.find(".upm-log-configuration-days").val());
        }
    });
});
