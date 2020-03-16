UPM.define('AddonRequestDialog',
    [
        'UpmDialog',
        'AddonRequestDialogTemplate'
    ],
    function(UpmDialog,
             requestDialogTemplate) {

    // Dialog for submitting an add-on request message.  The model for the dialog is the add-on model.

    return UpmDialog.extend({
        template: requestDialogTemplate,

        _getData: function() {
            var existingMessage = this.model.getCurrentUserRequest() && this.model.getCurrentUserRequest().message;
            return {
                plugin: this.model.toJSON(),
                existingMessage: existingMessage,
                isUpdate: (existingMessage !== undefined) && (existingMessage !== '')
            };
        },

        _onConfirm: function() {
            var message = this.$el.find('#pluginRequestMessage').val();
            this.close();
            this.model.submitRequest(message);
        }
    });
});
