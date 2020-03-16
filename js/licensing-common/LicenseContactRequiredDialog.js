UPM.define('LicenseContactRequiredDialog',
    [
        'UpmDialog',
        'LicenseContactRequiredDialogTemplate'
    ],
    function(UpmDialog,
             licenseContactRequiredDialogTemplate) {

    // Dialog that tells the user to contact the vendor to renew a license.  The model for the dialog is the add-on model.

    return UpmDialog.extend({
        template: licenseContactRequiredDialogTemplate,

        _getData: function() {
            return {
                plugin: this.model.toJSON(),
                license: this.model.getLicenseDetails()
            };
        }
    });
});
