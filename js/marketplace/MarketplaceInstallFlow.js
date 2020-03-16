/**
 * Initializes the Single Addon Page.
 */
UPM.define('MarketplaceInstallFlow',
    [
        'jquery',
        'AddonActions',
        'CommonInstallAndLicensingFlows',
        'EvalRedirectConfirmDialogTemplate',
        'InstallOrLicenseResultDialog',
        'UpmDialog',
        'UpmEnvironment',
        'UpmLongRunningTasks',
        'UpmXsrfTokenState',
        'LicenseAfterInstallDialog'
    ],
    function($,
             AddonActions,
             CommonInstallAndLicensingFlows,
             EvalRedirectConfirmDialogTemplate,
             InstallOrLicenseResultDialog,
             UpmDialog,
             UpmEnvironment,
             UpmLongRunningTasks,
             UpmXsrfTokenState,
             LicenseAfterInstallDialog) {

        /**
         * Application logic for all of the installation and licensing action buttons on the Find New page.
         * Except for installation, most of this is really implemented in CommonInstallAndLicensingFlows,
         * but there is some logic here to decide which of the common methods to call.
         */
        var MarketplaceInstallFlow = {
            /**
             * Initiates installation and/or licensing.
             *
             * @method installOrLicense
             * @param {Model} addonModel
             * @param {String} action  one of the constants from AddonActions
             * @param {Int} users  optional user count if this was initiated from the role-based pricing dialog
             */
            installOrLicense: function(addonModel, action, users) {
                CommonInstallAndLicensingFlows.confirmInstallOrLicenseAction(addonModel, action).done(function() {
                    if (!addonModel.isInstalled()) {
                        _performInstall(addonModel, action, users);
                    } else {
                        // Plugin is already installed - Simply license the plugin
                        if (action === AddonActions.TRY) {
                            CommonInstallAndLicensingFlows.startEvaluation(addonModel);
                        } else {
                            addonModel.loadLicenseDetails().done(function() {
                                CommonInstallAndLicensingFlows.submitMarketplaceActionToMAC(addonModel, action, users);
                            });
                        }
                    }
                });
            }
        };

        // Functions below are used internally by this module

        function _performInstall(addonModel, action, users) {
            var plugin = addonModel.toJSON(),
                contentTypeId = 'install',
                resourceRel = 'install-uri',
                data;

            if (addonModel.isAtlassianConnect()) {
                data = { "pluginUri": plugin.links.descriptor, "pluginName": plugin.name, "pluginKey": plugin.key };
            } else {
                data = { "pluginUri": plugin.links.binary, "pluginName": plugin.name, "pluginVersion": plugin.version };
            }

            UpmLongRunningTasks.startProgress('install', { name: plugin.name });

            if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
                UpmXsrfTokenState.tryWithToken(function(token) {
                    return $.ajax({
                        type: 'POST',
                        url: UpmEnvironment.getResourceUrl(resourceRel) + '?token=' + token,
                        dataType: 'json',
                        contentType: UpmEnvironment.getContentType(contentTypeId),
                        data: JSON.stringify(data),
                    }).promise();
                }).done(
                    function(resp, status, request) {
                        // The POST returns a URI that we then poll, and when the plugin install is complete, it will return
                        // details about the installed plugin
                        var location = (resp && resp.links && resp.links.self) || request.getResponseHeader('Location');
                        UpmLongRunningTasks.pollForCompletion(location, resp.pingAfter)
                            .done(
                                function(resp) {
                                    _installCompletion(resp, addonModel, action, users);
                                }
                            ).fail(
                                function(request) {
                                    addonModel.signalAjaxError(request);
                                }
                            );
                    }
                ).fail(
                    function(request) {
                        UpmLongRunningTasks.stopProgress();
                        addonModel.signalAjaxError(request);
                    }
                );
            }
        }

        function _installCompletion(installedPluginRep, addonModel, action, users) {
            // Refresh and focus the available add-on, and also get the installed add-on properties
            addonModel.refresh().then(
                function() {
                    UpmLongRunningTasks.stopProgress();
                    UpmXsrfTokenState.refreshToken();  // UPM-977 even in success, we need to get a new token for next time
                    UpmEnvironment.refreshNotifications();

                    // focus and expand the available add-on row before we proceed - under some conditions
                    // (e.g. UPM-4975), we will want the user to see info/warning banners that are in the detail area
                    return addonModel.focus();
                }
            ).then(
                function() {
                    return addonModel.loadInstalledAddonModel();
                }
            ).then(
                function(installedAddonModel) {
                    //display the "redirect to MAC" dialog only if the plugin is capable of executing the specified license action
                    if (installedAddonModel.isLicenseUpdatable() && installedAddonModel.getLinks()[action.legacyKey]) {
                        if (action === AddonActions.BUY) {
                            (new LicenseAfterInstallDialog({ model: addonModel })).getResult()
                                .done(function() {
                                    CommonInstallAndLicensingFlows.submitMarketplaceActionToMAC(addonModel, action, users);
                                });
                        } else if (action === AddonActions.TRY && !addonModel.getLicenseDetails()) {
                            var evalRedirectDialog = new UpmDialog({template: EvalRedirectConfirmDialogTemplate});
                            UPM.trace("eval-redirect-dialog");
                            evalRedirectDialog.getResult()
                                .then(function () {
                                    CommonInstallAndLicensingFlows.startEvaluation(addonModel);
                                });
                        } else {
                            CommonInstallAndLicensingFlows.showInstallOrUpdateCompletion(addonModel, installedAddonModel, installedPluginRep, false);
                        }
                    } else {
                        CommonInstallAndLicensingFlows.showInstallOrUpdateCompletion(addonModel, installedAddonModel, installedPluginRep, false);
                    }
                }
            ).fail(function(request) {
                UpmLongRunningTasks.stopProgress();
                addonModel.signalAjaxError(request);
            });
        }

        return MarketplaceInstallFlow;
    }
);
