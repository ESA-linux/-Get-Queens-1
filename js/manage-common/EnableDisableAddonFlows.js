UPM.define('EnableDisableAddonFlows',
    [
        'jquery',
        'DisableConfirmDialogTemplate',
        'UpmDialog',
        'UpmLongRunningTasks'
    ],
    function($,
             DisableConfirmDialogTemplate,
             UpmDialog,
             UpmLongRunningTasks) {

    /**
     * Front-end logic for enabling and disabling add-ons; used by the Manage and Update Check pages.
     */
    var EnableDisableAddonFlows = {
        /**
         * Attempts to disable an add-on.
         *
         * @method disableAddon
         * @param {AddonModel} addonModel
         * @return {Promise}  a Promise that is resolved when the action is complete
         */
        disableAddon: function(addonModel) {
            return confirmDisableIfNecessary(addonModel)
                .then(function() {
                    return doEnableOrDisable(addonModel, false);
                });
        },

        /**
         * Attempts to enable an add-on.
         *
         * @method enableAddon
         * @param {AddonModel} addonModel
         * @return {Promise}  a Promise that is resolved when the action is complete
         */
        enableAddon: function(addonModel) {
            return doEnableOrDisable(addonModel, true);
        },
    };

    function confirmDisableIfNecessary(addonModel) {
        if (addonModel.getLicenseDetails() && addonModel.getLicenseDetails().autoRenewal) {
            return new UpmDialog({ model: addonModel, template: DisableConfirmDialogTemplate }).getResult();
        } else {
            return $.Deferred().resolve().promise();
        }
    }

    function doEnableOrDisable(addonModel, enable) {
        UpmLongRunningTasks.startProgress(enable ? 'enable' : 'disable', { name: addonModel.get('name') });
        if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
            return addonModel.enableOrDisable(enable)
                .always(function() {
                    UpmLongRunningTasks.stopProgress().done(function() {
                        UPM.trace(enable ? 'enable-complete' : 'disable-complete');
                    });
                });
        } else {
            return $.Deferred();
        }
    }

    return EnableDisableAddonFlows;
});
