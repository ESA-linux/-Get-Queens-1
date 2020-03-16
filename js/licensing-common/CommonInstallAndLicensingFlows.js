UPM.define('CommonInstallAndLicensingFlows',
    [
        'jquery',
        'underscore',
        'AddonActions',
        'DownloadDialog',
        'EvalRedirectConfirmDialogTemplate',
        'InstallConsentDialogTemplate',
        'InstallOrLicenseResultDialog',
        'LicenseContactRequiredDialog',
        'NonDataCenterInstallConfirmDialog',
        'RefreshAfterInstallDialog',
        'RoleBasedPricingDialog',
        'UpdateRequestDialog',
        'UpmAjax',
        'UpmDialog',
        'UpmEnvironment',
        'UpmFormats',
        'UpmHamlet',
        'UpmLongRunningTasks',
        'UpmStrings'
    ],
    function($,
             _,
             AddonActions,
             DownloadDialog,
             EvalRedirectConfirmDialogTemplate,
             InstallConsentDialogTemplate,
             InstallOrLicenseResultDialog,
             LicenseContactRequiredDialog,
             NonDataCenterInstallConfirmDialog,
             RefreshAfterInstallDialog,
             RoleBasedPricingDialog,
             UpdateRequestDialog,
             UpmAjax,
             UpmDialog,
             UpmEnvironment,
             UpmFormats,
             UpmHamlet,
             UpmLongRunningTasks,
             UpmStrings) {

    /**
     * Front-end logic that is shared between the Manage and Find New pages, for actions that involve
     * installation and/or licensing of add-ons.
     */
    var CommonInstallAndLicensingFlows = {

        /**
         * Displays any confirmation dialogs that are necessary prior to executing the specified
         * install/licensing action for the add-on.  This may include an InstallConsentDialog if the user needs
         * to accept a EULA and/or the vendor privacy policy.
         *
         * @method confirmInstallOrLicenseAction
         * @param {AddonModel} addonModel
         * @param {AddonActions} action  optional, if omitted is assumed to be TRY
         * @return {Promise}  a Promise which will be resolved if the user accepts the dialog(s), or if no
         *   action is necessary (in which case no dialog will appear)
         */
        confirmInstallOrLicenseAction: function(addonModel, action) {
            // Note that we need to make sure we've loaded the detail properties, because some things like
            // Connect scopes aren't included in the summary representation
            return addonModel.loadDetails().then(function() {
                if (!addonModel.isInstalled()) {
                    return _doAllNecessaryConfirmationsBeforeInstalling(addonModel, action);
                } else {
                    return _doAllNecessaryConfirmationsBeforeLicensing(addonModel, action);
                }
            });
        },

        /**
         * Opens the dialog for downloading a non-deployable add-on artifact.
         *
         * @method openDownloadDialog
         * @param {AddonModel} addonModel
         */
        openDownloadDialog: function(addonModel) {
            new DownloadDialog({ model: addonModel });
        },

        /**
         * Opens the dialog that tells the user how to contact the vendor to renew a license.
         *
         * @method openRenewContactDialog
         * @param {AddonModel} addonModel
         */
        openRenewContactDialog: function(addonModel) {
            addonModel.loadLicenseDetails().done(function() {
                new LicenseContactRequiredDialog({ model: addonModel });
            });
        },

        /**
         * Opens the role-based pricing dialog, allowing the user to select a pricing tier and
         * then proceed with an action.
         *
         * @method openRoleBasedPricingDialog
         * @param {AddonModel} addonModel
         * @param {String} action  one of the constants from AddonActions
         * @param {JQuery} $loadingEl  container whose "loading" element should be shown while preparing the dialog
         * @return {Promise}  a Promise which will be resolved if the user confirms the action; see
         *   RoleBasedPricingDialog
         */
        openRoleBasedPricingDialog: function(addonModel, action, $loadingEl) {
            var $spinner = $loadingEl && $loadingEl.find('.loading');
            if ($spinner) {
                $spinner.removeClass('invisible');
            }
            return addonModel.loadDetails().
                // need to make sure we also have the license details, if any, so upgrades will work correctly
                then(function() { return addonModel.loadLicenseDetails(); }).
                then(function() {
                    return new RoleBasedPricingDialog({ model: addonModel, action: action })
                        .getResult();
                }).
                always(function() {
                    if ($spinner) {
                        $spinner.addClass('invisible');
                    }
                });
        },

        /**
         * Opens the "request update from vendor" dialog.  If the user submits it, we send the request to
         * MPAC via UPM, and then refresh the add-on state to show that an update was already requested.
         *
         * @method openUpdateRequestDialog
         * @param {AddonModel} addonModel
         */
        openUpdateRequestDialog: function(addonModel) {
            var dataCenterIncompatible = UpmEnvironment.isDataCenter() && (!addonModel.getStatusDataCenterCompatible() || !addonModel.getDataCenterCompatible());
            new UpdateRequestDialog({ model: addonModel, dataCenterIncompatible: dataCenterIncompatible })
                .getResult().done(function(result) {
                    _submitUpdateRequest(addonModel, result.message, result.shareDetails);
                });
        },

        /**
         * Shows the appropriate status dialog or other UI elements after an add-on has been installed/updated.
         *
         * @method showInstallOrUpdateCompletion
         * @param {AddonModel} addonModel  the model that the user has interacted with
         * @param {InstalledAddonModel} installedAddonModel  the model representing the *installed* add-on properties;
         *   this may not be the same as addonModel if we are not on the Manage page
         * @param {Object} installResponse  the final task status response from the install/update task
         * @param {boolean} isUpdate  True if this is an update, false for a new install
         * @param {Object} previousAddonProperties  optional - properties of the add-on prior to the update
         */
        showInstallOrUpdateCompletion: function(addonModel, installedAddonModel, installResponse, isUpdate, previousAddonProperties) {
            var updateForDisabledPlugin = isUpdate && previousAddonProperties && !previousAddonProperties.enabled &&
                    !installedAddonModel.getEnabled();

            if (installResponse && installResponse.status && installResponse.status.requiresRefresh) {
                new RefreshAfterInstallDialog();
                UPM.trace('requires-refresh-after-install');
                return;
            }

            // Note, the first two if blocks below are for conditions that we display as errors even though
            // the API has returned a success result.  Currently we're still using inline banners for these.
            if (installedAddonModel.getEnabledByDefault() && !installedAddonModel.getEnabled() && (!isUpdate || !updateForDisabledPlugin)) {
                addonModel.triggerMessage({
                    type: 'error',
                    message: UpmStrings['upm.messages.install.cannot.enable'],
                    className: isUpdate ? 'update' : 'install'
                });
            } else if (installedAddonModel.getUnloadable()) {
                addonModel.triggerMessage({
                    type: 'error',
                    message: UpmStrings['upm.messages.install.unloadable'],
                    className: isUpdate ? 'update' : 'install'
                });
            } else {
                addonModel.focus().done(function() {
                    _showInstallSuccessDialog(addonModel, installedAddonModel, null, isUpdate, previousAddonProperties);
                });
            }
        },

        /**
         * Redirects to MAC to start an add-on evaluation.
         * This is only for Server instances, not Cloud licensing.
         *
         * @method startEvaluation
         * @param {AddonModel} addonModel
         */
        startEvaluation: function (addonModel) {
            CommonInstallAndLicensingFlows.submitMarketplaceActionToMAC(addonModel, AddonActions.TRY);
            return $.Deferred().promise();  // will not be resolved
        },

        crossgradeAppLicense: function (addonModel) {
            var _links = addonModel.getLinks(),
                appLicense = addonModel.getLicenseDetails(),
                hostLicense = UpmEnvironment.getHostLicense();

            if (_links['crossgrade'] && appLicense && hostLicense && UpmEnvironment.isDataCenter()) {
                $.ajax({
                    url: addonModel.getLinks()['crossgrade'],
                    type: 'post',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response) {
                        if (response && response.hamletCrossgradeUri) {
                            window.location.href = response.hamletCrossgradeUri;
                        }
                    },
                    error: function(request) {
                        UpmAjax.signalAjaxError(request);
                    }
                });
            }
        },

        /**
         * Starts a MAC purchase/licensing flow via an invisible form submission.  This is only for Server
         * instances, not Cloud licensing.
         *
         * @method submitMarketplaceActionToMAC
         * @param {AddonModel} addonModel
         * @param {String} action  one of the constants from AddonActions
         * @param {Number} users  optional user count
         * @param {Boolean} openInNewWindow
         */
        submitMarketplaceActionToMAC: function(addonModel, action, users, openInNewWindow) {
            // build this hidden element using the JQuery API, rather than a template, because nothing in it
            // is presentation-related - it is all basically just programmatic construction of an HTTP request
            var $form = $('<form method="post" class="hidden"></form>'),
                licenseDetails = addonModel.getLicenseDetails(),
                hostLicense = UpmEnvironment.getHostLicense(),
                orgName = (licenseDetails && licenseDetails.organizationName) ? licenseDetails.organizationName :
                    (hostLicense && hostLicense.organizationName),
                realUsers = (users && users !== 0) ? users :
                    ((hostLicense && hostLicense.maximumNumberOfUsers) ? hostLicense.maximumNumberOfUsers : -1),
                values;

            $form.attr('action', addonModel.getLinks()[action.legacyKey]);
            if (openInNewWindow) {
                $form.attr('target', '_blank');
            }

            values = _.extend(
                {
                    callback: addonModel.getLinks()['license-callback'],
                    licensefieldname: 'license',
                    users: realUsers
                },
                (licenseDetails && licenseDetails.supportEntitlementNumber) ?
                    { addon_sen: licenseDetails.supportEntitlementNumber } : {},
                orgName ? { organisation_name: orgName } : {},
                (licenseDetails && licenseDetails.contactEmail) ? { owner: licenseDetails.contactEmail } : {},
                hostLicense.supportEntitlementNumber ? { parent_sen: hostLicense.supportEntitlementNumber } : {}
            );

            $form.append(_.map(values, function(value, key) {
                return $('<input type="hidden">').attr('name', key).val(value);
            }));
            
            // TODO: send analytics event??

            $form.appendTo(document.body);
            $form.submit();
            $form.remove();
        }
    };

    // Functions below are used internally by this module

    function _confirmEvalRedirectIfNecessary(addonModel, action) {
        if ((action && action === AddonActions.TRY) && !addonModel.isByAtlassian() && addonModel.isInstalled()) {
            var evalRedirectDialog = new UpmDialog({template: EvalRedirectConfirmDialogTemplate});
            UPM.trace("eval-redirect-dialog");
            return evalRedirectDialog.getResult();
        } else {
            return $.Deferred().resolve();
        }
    }

    function _confirmInstallationConsent(addonModel) {
        if (!addonModel.isByAtlassian()) {
            var installConsentDialog = new UpmDialog({ template: InstallConsentDialogTemplate, data: { plugin: addonModel.toJSON() }});
            UPM.trace("install-consent-dialog");
            return installConsentDialog.getResult();
        } else {
            return $.Deferred().resolve();
        }
    }

    function _doAllNecessaryConfirmationsBeforeInstalling(addonModel, action) {
        function confirmNonDataCenter() {
            if (!addonModel.getStatusDataCenterCompatible() && UpmEnvironment.isDataCenter()) {
                return (new NonDataCenterInstallConfirmDialog({ model: addonModel })).getResult();
            } else {
                return $.Deferred().resolve();
            }
        }

        // chain together all these Promises, returning one which will pass only if they all pass
        return confirmNonDataCenter().then(function() {
            return _confirmInstallationConsent(addonModel);
        });
    }

    function _doAllNecessaryConfirmationsBeforeLicensing(addonModel, action) {
        return _confirmEvalRedirectIfNecessary(addonModel, action);
    }

    function _parseHamletErrorInfo(request) {
        try {
            response = JSON.parse(request.responseText);
            if (response) {
                var m = (response.errorKey && UpmStrings[response.errorKey]) || response.error;
                if (m) {
                    return { errorMessage: m };
                }
            }
        } catch (e) {
            AJS.log('Failed to parse hamlet response text: ' + e);
        }
        return { subCode: 'ajaxServerError' };
    }

    function _showInstallSuccessDialog(displayedModel, installedAddonModel, newLicense, isUpdate, previousAddonProperties) {
        var dialog,
            nextAction,
            wasEnabled = previousAddonProperties && previousAddonProperties.enabled,
            updateForDisabledPlugin = isUpdate && !wasEnabled && !installedAddonModel.getEnabled(),
            postInstallUrl = installedAddonModel.getLinks()[isUpdate ? 'post-update' : 'post-install'];

        if (!installedAddonModel.getIncompatible() && installedAddonModel.getEnabledByDefault() && !updateForDisabledPlugin) {
            if (installedAddonModel.isLicenseUpdatable() && !installedAddonModel.getLicenseDetails && !newLicense) {
                nextAction = (previousAddonProperties && previousAddonProperties.updatableToPaid) ?
                    'new-license' : 'manage-license';
            } else if (postInstallUrl) {
                nextAction = 'get-started';
            }
        }

        dialog = new InstallOrLicenseResultDialog({
            model: installedAddonModel,
            newLicense: newLicense,
            isInstall: !isUpdate && !newLicense,
            isUpdate: isUpdate,
            nextAction: nextAction,
            updateForDisabledPlugin: updateForDisabledPlugin
        });

        UPM.trace('install-result-dialog');

        dialog.getResult().done(function() {
            switch (nextAction) {
                // "get started" action is handled by InstallOrLicenseResultDialog itself, since it just opens a link

                case 'new-license':
                    CommonInstallAndLicensingFlows.submitMarketplaceActionToMAC(displayedModel, AddonActions.TRY);
                    break;

                case 'manage-license':
                    if (installedAddonModel.getLinks()['plugin-details']) {
                        window.location.href = installedAddonModel.getLinks()['plugin-details'];
                    } else {
                        displayedModel.focus();
                    }
                    break;
            }
        });
    }

    function _submitUpdateRequest(addonModel, message, shareDetails) {
        addonModel.submitUpdateRequest(message, shareDetails)
            .done(function() {
                UpmEnvironment.refreshNotifications();
                addonModel.refresh().done(function() {
                    addonModel.triggerMessage({
                        type: 'info',
                        message: UpmStrings['upm.messages.plugin.update.request.success']
                    });
                    UPM.trace('update-request-complete');
                });
            })
            .fail(UpmAjax.signalAjaxError);
    }

    return CommonInstallAndLicensingFlows;
});
