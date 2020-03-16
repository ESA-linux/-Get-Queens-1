UPM.define('LicenseAfterInstallDialog',
    [
        'UpmDialog',
        'LicenseAfterInstallDialogTemplate'
    ],
    function(UpmDialog,
             licenseAfterInstallDialogTemplate) {

    // Dialog for confirming that the user wants to get a license after installing an add-on.  The model for the dialog is the add-on model.

    return UpmDialog.extend({
        template: licenseAfterInstallDialogTemplate,

        _getData: function() {
            return {
                plugin: this.model.toJSON()
            };
        }
    });
});
