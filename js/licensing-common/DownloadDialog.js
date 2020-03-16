UPM.define('DownloadDialog',
    [
        'UpmDialog',
        'DownloadDialogTemplate'
    ],
    function(UpmDialog,
             downloadDialogTemplate) {

    // Dialog for downloading a non-deployable add-on.  The model for the dialog is the add-on model.

    return UpmDialog.extend({
        template: downloadDialogTemplate,

        _getData: function() {
            return {
                pluginName: this.model.getName(),
                binaryUrl: this.model.getLinks().binary || this.model.getLinks()['external-binary'],
                homepageUrl: this.model.getLinks().details
            };
        }
    });
});
