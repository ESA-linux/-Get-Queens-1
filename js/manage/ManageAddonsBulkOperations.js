/**
 * Application logic for the Update All and Disable All Incompatible actions.
 * @singleton
 */
UPM.define('ManageAddonsBulkOperations',
    [
        'jquery',
        'underscore',
        'CommonInstallAndLicensingFlows',
        'DisableIncompatibleConfirmDialogTemplate',
        'DisableIncompatibleResultDialogTemplate',
        'ManageAddonsFilterType',
        'ManageAddonsPageModel',
        'UpdateAllResultDialog',
        'UpmAjax',
        'UpmDialog',
        'UpmEnvironment',
        'UpmFormats',
        'UpmLongRunningTasks',
        'UpmRequireRestart',
        'UpmXsrfTokenState',
        'UpmStrings'
    ], function($,
                _,
                CommonInstallAndLicensingFlows,
                DisableIncompatibleConfirmDialogTemplate,
                DisableIncompatibleResultDialogTemplate,
                ManageAddonsFilterType,
                ManageAddonsPageModel,
                UpdateAllResultDialog,
                UpmAjax,
                UpmDialog,
                UpmEnvironment,
                UpmFormats,
                UpmLongRunningTasks,
                UpmRequireRestart,
                UpmXsrfTokenState,
                UpmStrings) {

    "use strict";

    var ManageAddonsBulkOperations = {

        /**
         * Executes the Disable All Incompatible operation.
         */
        disableIncompatibleAddons: function() {
            var incompatibleCount = ManageAddonsPageModel.getIncompatibleAddons().length,
                dialog = new UpmDialog({ template: DisableIncompatibleConfirmDialogTemplate, data: { count: incompatibleCount }});

            dialog.getResult().done(function() {
                UpmLongRunningTasks.startProgress('disableall', { totalItems: incompatibleCount });
                if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
                    disableIncompatibleBegin()
                        .then(function(resp) {
                            return UpmLongRunningTasks.pollForCompletion(resp.links.self, resp.pingAfter);
                        })
                        .always(UpmLongRunningTasks.stopProgress)
                        .done(disableIncompatibleComplete)
                        .fail(function(request) {
                            UpmAjax.signalAjaxError(request);
                        });
                }
            });
        },

        /**
         * Displays the results of an Update All operation.  This method is public for testing purposes only.
         * @method showUpdateAllResults
         * @param {Array} successes  success item representations from the update task
         * @param {Array} failures  failure item representations from the update task
         */
        showUpdateAllResults: function(successes, failures) {
            var numSuccesses = successes ? successes.length : 0,
                numFailures = failures ? failures.length : 0;
            
            if ((numSuccesses + numFailures) === 1) {
                if (numSuccesses) {
                    var item = successes[0],
                        addonModel = ManageAddonsPageModel.getAddonModelByKey(item.key);
                    addonModel.loadDetails(true).done(function() {
                        CommonInstallAndLicensingFlows.showInstallOrUpdateCompletion(addonModel, addonModel,
                            item, true);
                    });
                } else {
                    showFailureItem(failures[0], true);
                }
            } else {
                var dialog = new UpdateAllResultDialog({ successes: successes, failures: failures });
                UPM.trace('update-all-result-dialog');
                dialog.getResult().always(function() {
                    showSuccessesAndFailures(successes, failures, true)
                        .done(function() {
                            UPM.trace('update-all-complete');
                        });
                });
            }
        },

        /**
         * Executes the Update All operation.
         */
        updateAllAddons: function() {
            var updateCount = ManageAddonsPageModel.getBatchUpdatableAddons().length;

            UpmLongRunningTasks.startProgress('updateall', { totalItems: updateCount }, 'updating');
            if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
                UpmXsrfTokenState.tryWithToken(updateAllBegin)
                    .then(function(resp) {
                        return UpmLongRunningTasks.pollForCompletion(resp.links.self, resp.pingAfter);
                    })
                    .always(UpmLongRunningTasks.stopProgress)
                    .done(updateAllComplete)
                    .fail(function(request) {
                        UpmAjax.signalAjaxError(request);
                    });
            }
        }
    };

    // Functions below are used internally by this module

    function disableIncompatibleBegin() {
        return $.ajax({
            type: 'POST',
            url: UpmEnvironment.getResourceUrl('disable-all'),
            dataType: 'json',
            contentType: UpmEnvironment.getContentType('disable-all')
        });
    }

    function disableIncompatibleComplete(response) {
        ManageAddonsPageModel.setFilter(ManageAddonsFilterType.USER_INSTALLED);
        showSuccessesAndFailures(response.status.successes, response.status.failures, false)
            .done(function() {
                new UpmDialog({
                    template: DisableIncompatibleResultDialogTemplate,
                    data: {
                        successCount: response.status.successes.length,
                        totalCount: response.status.successes.length + response.status.failures.length
                    }
                });
                UPM.trace('disable-all-complete');
            });
    }

    function showFailureItem(failure, isUpdate) {
        var addonModel = ManageAddonsPageModel.getAddonModelByKey(failure.key),
            prefix = isUpdate ? 'upm.pluginInstall.error.' : 'upm.disableall.error.';

        if (addonModel) {
            if (failure.subCode) {
                failure.subCode = prefix + failure.subCode;
            }
            addonModel.triggerMessage({
                type: 'error',
                message: UpmFormats.format(UpmStrings[failure.subCode || 'upm.plugin.error.unexpected.error'], failure.name)
            });
        }
    }

    function showSuccessesAndFailures(successes, failures, isUpdate) {
        return $.when(_.map(successes, function(item) {
            var addonModel = ManageAddonsPageModel.getAddonModelByKey(item.key);
            if (addonModel) {
                return addonModel.refresh();
            } else {
                return $.Deferred();
            }
        })).done(function() {
            _.each(failures, function(item) {
                showFailureItem(item, isUpdate);
            });
        });
    }

    function updateAllBegin(token) {
        return $.ajax({
            type: 'POST',
            url: UpmEnvironment.getResourceUrl('update-all') + '?token=' + token,
            dataType: 'json',
            contentType: UpmEnvironment.getContentType('update-all'),
        });
    }

    function updateAllComplete(finalResp) {
        // response may contain a new "changes-requiring-restart" link if updated plugins require restart (UPM-884)
        if (finalResp.links['changes-requiring-restart']) {
            UpmEnvironment.setResourceUrls(finalResp.links);
            UpmRequireRestart.checkForChangesRequiringRestart();
        }
        UpmEnvironment.refreshNotifications();

        ManageAddonsBulkOperations.showUpdateAllResults(finalResp.status.successes, finalResp.status.failures);
    }

    return ManageAddonsBulkOperations;
});
