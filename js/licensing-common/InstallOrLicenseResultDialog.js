/**
 * Dialog that appears after an add-on has been installed, updated, licensed, or unlicensed.
 * The model for the dialog is the add-on model.  It also takes the following optional properties:
 * <ul>
 * <li> errorHtml:  error message if any
 * <li> newLicense:  new license details if these are not in the add-on model
 * <li> isInstall:  true if this is an installation
 * <li> isUpdate:  true if this is an update
 * <li> nextAction:  'get-started', 'new-license', 'manage-license', or nothing
 * <li> updateForDisabledPlugin:  true if this was an update for a disabled plugin
 * </ul>
 */
UPM.define('InstallOrLicenseResultDialog',
    [
        'UpmDialog',
        'AddonActions',
        'InstallOrLicenseResultDialogTemplate'
    ],
    function(UpmDialog,
             AddonActions,
             InstallOrLicenseResultDialogTemplate) {

    return UpmDialog.extend({
        template: InstallOrLicenseResultDialogTemplate,

        _getData: function() {
            return {
                plugin: this.model.toJSON(),
                errorHtml: this.options.errorHtml || null,
                newLicense: this.options.newLicense || null,
                isInstall: this.options.isInstall || false,
                isUpdate: this.options.isUpdate || false,
                nextAction: this.options.nextAction,
                usesLicensing: this.model.isLicenseUpdatable(),
                updateForDisabledPlugin: this.options.updateForDisabledPlugin || false
            };
        },

        _getPostInstallUrl: function() {
            return this.model.getLinks()[this.options.isUpdate ? 'post-update' : 'post-install'];
        },

        _onConfirm: function() {
            if (this.options.nextAction === 'get-started') {
                var url = this._getPostInstallUrl();
                if (url) {
                    if (this.options.isUpdate) {
                        this.model.logAnalytics('postupdate');
                    } else {
                        this.model.logAnalytics('postinstall', { dialog: true });
                    }
                    window.location.href = url;
                }
            }
            UpmDialog.prototype._onConfirm.apply(this);
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
