UPM.define('VendorFeedbackDialog',
    [
        'UpmDialog',
        'VendorFeedbackDialogTemplate'
    ],
    function(UpmDialog,
             VendorFeedbackDialogTemplate) {

    // Dialog for submitting vendor feedback.  The model for the dialog is the add-on model.
    // You must also set the option "action" to AddonActions.DISABLE or AddonActions.UNINSTALL.

    return UpmDialog.extend({
        template: VendorFeedbackDialogTemplate,

        _getData: function() {
            return {
                plugin: this.model.toJSON(),
                action: this.options.action.key
            };
        },

        _getReturnValue: function() {
            return {
                shareUserInfo: this.$el.find('#upm-feedback-share').is(':checked'),
                reason: this.$el.find('#option-reason').val(),
                textReason: this.$el.find('#text-reason').val()
            };
        },

        _onConfirm: function() {
            if (this.$el.find('#option-reason').val() === 'upm.feedback.select.reason') {
                this.$el.find('#reason-error').removeClass('hidden');
            } else {
                UpmDialog.prototype._onConfirm.apply(this);
            }
        }
    });
});
