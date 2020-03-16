UPM.define('UpdateRequestDialog',
    [
        'UpmDialog',
        'UpdateRequestDialogTemplate'
    ],
    function(UpmDialog,
             updateRequestDialogTemplate) {

    // Dialog for requesting an add-on update from a vendor.  The model for the dialog is the add-on model;
    // you must also set the dialog option "dataCenterIncompatible" (boolean).  The dialog's result value
    // on submission is an object with the properties "message" (the custom request message, if any) and
    // "shareDetails" (true if we can send the user's email address to the vendor).

    return UpmDialog.extend({
        template: updateRequestDialogTemplate,

        _getData: function() {
            return {
                pluginName: this.model.getName(),
                dataCenterIncompatible: this.options.dataCenterIncompatible
            };
        },

        _getReturnValue: function() {
            return {
                message: this.$el.find('#text-message').val(),
                shareDetails: this.$el.find('#upm-contact-details-share').is(':checked')
            };
        }
    });
});
