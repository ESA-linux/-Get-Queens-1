UPM.define('NonDataCenterInstallConfirmDialog',
    [
        'UpmDialog',
        'AddonActions',
        'NonDataCenterInstallConfirmDialogTemplate'
    ],
    function(UpmDialog,
             AddonActions,
             nonDataCenterInstallConfirmDialogTemplate) {

    // Dialog for confirming installation of a Data Center add-on in a non-DC instance.  The model for the dialog is the add-on model.

    return UpmDialog.extend({
        template: nonDataCenterInstallConfirmDialogTemplate,

        _getData: function() {
            return {
                plugin: this.model.toJSON()
            };
        },

        _postRender: function() {
            var me = this;
            // bind a handler for the "request a Data Center version" link in the dialog body
            this.$el.find('.request-data-center-compatible-link').on('click', function(e) {
                e.preventDefault();
                me.close();
                me.model.signalAction(AddonActions.REQUEST_UPDATE);
            });
        }
    });
});
