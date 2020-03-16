/**
 * Application logic for all Manage Add-ons actions that operate on a single add-on.
 * Logic that is shared with the Find New page (licensing, etc.) is in CommonInstallAndLicensingFlows.
 * For the Update/Disable All actions, see ManageAddonsBulkOperations.
 * @singleton
 */
UPM.define('ManageAddonFlows',
    [
        'jquery',
        'AddonActions',
        'CommonInstallAndLicensingFlows',
        'EnableDisableAddonFlows',
        'InstallOrLicenseResultDialog',
        'ManageAddonsFilterType',
        'ManageAddonsPageModel',
        'RefreshAfterInstallDialog',
        'ServerToDataCenterUpdateConfirmDialogTemplate',
        'UninstallConfirmDialogTemplate',
        'UpdateScopeConfirmDialogTemplate',
        'UpmAjax',
        'UpmDialog',
        'UpmEnvironment',
        'UpmInstaller',
        'UpmLongRunningTasks',
        'UpmStrings',
        'VendorFeedbackDialog'
    ], function($,
                AddonActions,
                CommonInstallAndLicensingFlows,
                EnableDisableAddonFlows,
                InstallOrLicenseResultDialog,
                ManageAddonsFilterType,
                ManageAddonsPageModel,
                RefreshAfterInstallDialog,
                ServerToDataCenterUpdateConfirmDialogTemplate,
                UninstallConfirmDialogTemplate,
                UpdateScopeConfirmDialogTemplate,
                UpmAjax,
                UpmDialog,
                UpmEnvironment,
                UpmInstaller,
                UpmLongRunningTasks,
                UpmStrings,
                VendorFeedbackDialog) {

    "use strict";

    var ManageAddonFlows = {
        /**
         * Performs one of the standard actions on an add-on, usually in response to an action button click.
         * @param {AddonActions} action
         * @param {ManageAddonModel} addonModel
         */
        addonAction: function(action, addonModel) {
            switch (action) {
                case AddonActions.BUY:
                    _startPossiblyRoleBasedFlow(addonModel, action);
                    break;

                case AddonActions.CHECK_LICENSE:
                    ManageAddonFlows.retrieveAddonLicense(addonModel);
                    break;

                case AddonActions.CONFIGURE:
                    window.location.href = addonModel.getLinks().configure;
                    break;

                case AddonActions.CROSSGRADE:
                    CommonInstallAndLicensingFlows.crossgradeAppLicense(addonModel);
                    break;

                case AddonActions.DISABLE:
                    EnableDisableAddonFlows.disableAddon(addonModel)
                        .then(UpmLongRunningTasks.getProgressDialogPromise)
                        .done(function() {
                            ManageAddonFlows.openVendorFeedbackDialog(addonModel, action);
                        });
                    break;

                case AddonActions.DOWNLOAD:
                    CommonInstallAndLicensingFlows.openDownloadDialog(addonModel);
                    break;

                case AddonActions.ENABLE:
                    EnableDisableAddonFlows.enableAddon(addonModel);
                    break;

                case AddonActions.GET_STARTED:
                    if (addonModel.hasLink('post-install')) {
                        addonModel.logAnalytics('postinstall', { dialog: false });
                        window.location.href = addonModel.getLinks()['post-install'];
                    }
                    break;

                case AddonActions.RENEW:
                    CommonInstallAndLicensingFlows.submitMarketplaceActionToMAC(addonModel, action);
                    break;

                case AddonActions.RENEW_CONTACT:
                    CommonInstallAndLicensingFlows.openRenewContactDialog(addonModel);
                    break;

                case AddonActions.REQUEST_UPDATE:
                    CommonInstallAndLicensingFlows.openUpdateRequestDialog(addonModel);
                    break;

                case AddonActions.TRY:
                    CommonInstallAndLicensingFlows.confirmInstallOrLicenseAction(addonModel, action)
                        .done(function() {
                            addonModel.logAnalytics('try');
                            CommonInstallAndLicensingFlows.startEvaluation(addonModel);
                        });
                    break;

                case AddonActions.UNINSTALL:
                    ManageAddonFlows.uninstallAddon(addonModel);
                    break;

                case AddonActions.UPDATE:
                    ManageAddonFlows.updateAddon(addonModel);
                    break;

                case AddonActions.UPGRADE:
                    _startPossiblyRoleBasedFlow(addonModel, action);
                    break;
            }
        },

        disableAddonModule: function(moduleModel) {
            UpmLongRunningTasks.startProgress('disable', { name: moduleModel.getName() });
            if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
                moduleModel.disable()
                    .always(UpmLongRunningTasks.stopProgress);
            }
        },

        enableAddonModule: function(moduleModel) {
            UpmLongRunningTasks.startProgress('enable', { name: moduleModel.getName() });
            if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
                moduleModel.enable()
                    .always(UpmLongRunningTasks.stopProgress);
            }
        },

        /**
         * Opens the dialog that lets the user upload an add-on or install one from a download URI.
         */
        openInstallDialog: function() {
            // This callback takes care of showing the initial progress dialog - UpmInstaller doesn't do that
            // because it is not the same in Manage Apps
            function startProgress(displayName) {
                UpmLongRunningTasks.startProgress('install', { name: displayName });
                return UpmLongRunningTasks.abortIfHasPendingTask();
            }

            UpmInstaller.openInstallDialog(startProgress)
                .done(function(response, params) {
                    return UpmLongRunningTasks.pollForCompletion(response.links.self, response.pingAfter)
                        .always(UpmLongRunningTasks.stopProgress)
                        .done(function(finalResponse) {
                            _installCompleted(finalResponse, params);
                        })
                        .fail(function(request) {
                            UpmAjax.signalAjaxError(request, params.getFileName() || params.getUrl());
                        });
                }).fail(function(request) {
                    UpmAjax.signalAjaxError(request);
                });
        },

        /**
         * Opens the dialog for sending user feedback after an add-on has been disabled or uninstalled,
         * and sends the feedback if the user confirms.
         * @method openVendorFeedbackDialog
         * @param {ManageAddonModel} addonModel
         * @param {AddonActions} action  should be AddonActions.DISABLE or AddonActions.UNINSTALL
         */
        openVendorFeedbackDialog: function(addonModel, action) {
            if (addonModel.canSendVendorFeedback() && (action === AddonActions.DISABLE || action === AddonActions.UNINSTALL)) {
                var dialog = new VendorFeedbackDialog({
                    model: addonModel,
                    action: action
                });
                dialog.getResult().done(function(values) {
                    addonModel.sendVendorFeedback(action, values.reason, values.textReason,
                        values.shareUserInfo ? UpmEnvironment.getCurrentUserEmail() : null,
                        values.shareUserInfo ? UpmEnvironment.getCurrentUserFullName() : null);
                }).fail(function() {
                    addonModel.logAnalytics("vendor-feedback-cancel",
                        { pv: addonModel.getVersion(), feedbackType: action.key.toLowerCase() });
                });
            }
        },

        /**
         * Attempts to retrieve a license directly from HAMS and apply it to the add-on.
         * @method retrieveAddonLicense
         * @param {ManageAddonModel} addonModel
         */
        retrieveAddonLicense: function(addonModel) {
            var oldProperties = addonModel.toJSON();
            addonModel.logAnalytics('retrieve-license');
            UpmLongRunningTasks.startProgress('checkLicense');
            addonModel.retrieveLicense()
                .always(UpmLongRunningTasks.stopProgress)
                .then(function(response) {
                    if (response.message) {
                        addonModel.triggerMessage({
                            type: response.type,
                            message: UpmStrings[response.message]
                        });
                    } else {
                        addonModel.triggerEventAfterExpanding('licenseUpdated', oldProperties, true);
                    }
                });
        },

        /**
         * Attempts to uninstall the addon, after confirming.
         * @method uninstallAddon
         * @param {ManageAddonModel} addonModel
         */
        uninstallAddon: function(addonModel) {
            new UpmDialog({ template: UninstallConfirmDialogTemplate, data: { plugin: addonModel.toJSON() }})
                .getResult().done(function() {
                    UpmLongRunningTasks.startProgress('uninstall', { name: addonModel.getName() });
                    if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
                        addonModel.uninstall()
                            .done(function() {
                                UpmEnvironment.refreshNotifications();
                                UpmLongRunningTasks.getProgressDialogPromise().done(function() {
                                    ManageAddonFlows.openVendorFeedbackDialog(addonModel, AddonActions.UNINSTALL);
                                    UPM.trace('uninstall-complete');
                                });
                            })
                            .always(UpmLongRunningTasks.stopProgress);
                    }
                });
        },

        /**
         * Attempts to install an available update for the addon.
         * @method updateAddon
         * @param {ManageAddonModel} addonModel
         */
        updateAddon: function(addonModel) {
            var oldProperties = addonModel.toJSON();
            addonModel.loadDetails()
                .then(function() {
                    return _confirmUpdateIfNecessary(addonModel);
                })
                .done(function() {
                    UpmLongRunningTasks.startProgress('update', { name: addonModel.getName() });
                    if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
                        addonModel.startUpdate()
                            .then(function(resp) {
                                return UpmLongRunningTasks.pollForCompletion(resp.links.self, resp.pingAfter);
                            })
                            .done(function(finalResp) {
                                if (finalResp.statusCode === 202) {
                                    _completeUpmUpdate(addonModel, finalResp.status.nextTaskPostUri);
                                } else {
                                    UpmLongRunningTasks.stopProgress();
                                    addonModel.refresh()  // pick up any state changes to the model
                                        .done(function() {
                                            CommonInstallAndLicensingFlows.showInstallOrUpdateCompletion(addonModel, addonModel,
                                                finalResp, true, oldProperties);
                                            UpmEnvironment.refreshNotifications();
                                        });
                                }
                            })
                            .fail(function(req) {
                                UpmLongRunningTasks.stopProgress();
                                addonModel.signalAjaxError(req);
                            });
                    }
                });
        },

        /**
         * Attempts to install an available update for UPM.
         * @method updateUpm
         */
        updateUpm: function() {
            var upm = ManageAddonsPageModel.getAddonModelByKey(UpmEnvironment.getUpmPluginKey());

            // clear the available update version from the page state model - this will make the update message disappear
            ManageAddonsPageModel.set('upmUpdateVersion', null);

            ManageAddonFlows.updateAddon(upm);
        }
    };

    // Functions below are used internally by this module

    /**
     * Performs the final step of a UPM self-update, after the initial update call (which installs the
     * self-update plugin) has completed.
     */
    function _completeUpmUpdate(addonModel, url) {
        // POST to stub plugin uri which starts update of UPM, and returns URI for long running task
        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            contentType: UpmEnvironment.getContentType('json')
        }).then(function(resp) {
            return UpmLongRunningTasks.pollForCompletion(resp.links.self, resp.pingAfter);
        }).done(function(finalResp) {
            return $.ajax({
                type: 'DELETE',
                url: finalResp.status.cleanupDeleteUri,
                dataType: 'json'
            }).done(function() {
                UpmLongRunningTasks.stopProgress();
                if (finalResp.status.requiresRefresh) {
                    new RefreshAfterInstallDialog();
                    UPM.trace('requires-refresh-after-install');
                }
            });
        }).fail(function() {
            addonModel.triggerMessage({
                type: 'error',
                message: UpmStrings['upm.update.self.update.error']
            });
        }).always(UpmLongRunningTasks.stopProgress);
    }

    /**
     * Displays a confirmation dialog for an update, only if this is necessary in Data Center host products
     *   when updating a server app to a data center version
     * @return {Promise}  a promise which will be resolved when the confirmation dialog is accepted -
     *   or, if no dialog is necessary, the promise is already pre-resolved
     */
    function _confirmUpdateIfNecessary(addonModel) {
        // Only show the Server to Data Center update confirmation dialog if:
        //   - we're on a DC-licensed host product
        //   - current app installed is not DC-compatible
        //   - available update is DC-compatible
        //   - and we don't have a DC app license
        if (UpmEnvironment.isDataCenter() &&
            !addonModel.getStatusDataCenterCompatible() &&
            addonModel.getAvailableUpdate() && addonModel.getAvailableUpdate().statusDataCenterCompatible &&
            addonModel.getLicenseDetails() && !addonModel.getLicenseDetails().dataCenter
        ) {

            var dialog = new UpmDialog({
                template: ServerToDataCenterUpdateConfirmDialogTemplate,
                data: {
                    plugin: addonModel.toJSON(),
                    expiryDateString: addonModel.getAvailableUpdate() &&
                                      addonModel.getAvailableUpdate().dataCenterCutoffDateString
                }
            });
            return dialog.getResult();
        } else {
            return $.Deferred().resolve();
        }
    }

    /**
     * Performs the final steps of an install/update after the installation task has completed.
     * @param {Object} finalResponse  last response representation returned by the task resource
     */
    function _installCompleted(finalResponse) {
        ManageAddonsPageModel.setFilter(finalResponse.applicationKey ? ManageAddonsFilterType.APPLICATIONS :
            ManageAddonsFilterType.USER_INSTALLED);
        return ManageAddonsPageModel.fetch().done(function() {
            var addonModel = ManageAddonsPageModel.getAddonModelByKey(finalResponse.key);
            if (finalResponse.statusCode == '202') {
                _completeUpmUpdate(addonModel, finalResponse.status.nextTaskPostUri);
            } else {
                CommonInstallAndLicensingFlows.showInstallOrUpdateCompletion(addonModel, addonModel, finalResponse);
                UpmEnvironment.refreshNotifications();
            }
        });
    }

    /**
     * Executes an action (Buy/Upgrade) immediately if the add-on is not role-based; if it is role-based,
     * opens the role-based pricing tier dialog and then executes the action once the user selects a tier.
     */
    function _startPossiblyRoleBasedFlow(addonModel, action) {
        var startFlow = function(params) {
            var newAction = (params && params.action) || action;
            CommonInstallAndLicensingFlows.confirmInstallOrLicenseAction(addonModel, newAction).done(function() {
                addonModel.logAnalytics(newAction.key.toLowerCase());
                if (newAction === AddonActions.TRY) {
                    CommonInstallAndLicensingFlows.startEvaluation(addonModel);
                } else {
                    CommonInstallAndLicensingFlows.submitMarketplaceActionToMAC(addonModel,
                        newAction, params && params.users);
                }
            });
        };
        addonModel.loadPricingModel().done(function() {
            if (addonModel.hasRoleBasedPricing()) {
                CommonInstallAndLicensingFlows.openRoleBasedPricingDialog(addonModel, action)
                    .done(startFlow);
            } else {
                startFlow();
            }
        });
    }

    return ManageAddonFlows;
});
