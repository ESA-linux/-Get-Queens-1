UPM.define('UpmSafeMode',
    [
        'jquery',
        'brace',
        'UpmAjax',
        'UpmCommonUi',
        'UpmDialog',
        'UpmEnvironment',
        'UpmLongRunningTasks',
        'UpmStrings',
        'EnterSafeModeConfirmDialogTemplate',
        'ExitSafeModeConfirmDialogTemplate',
        'SafeModeStatusTemplate'
    ],
    function($,
             Brace,
             UpmAjax,
             UpmCommonUi,
             UpmDialog,
             UpmEnvironment,
             UpmLongRunningTasks,
             UpmStrings,
             EnterSafeModeConfirmDialogTemplate,
             ExitSafeModeConfirmDialogTemplate,
             SafeModeStatusTemplate) {

    var eventListener = new Brace.Evented();

    /**
     * UI and Ajax logic to manage the Safe Mode state.
     */
    var UpmSafeMode = {
        /**
         * Registers an event listener that will be fired whenever the safe mode state changes.
         * @method onSafeModeChanged
         * @param {Function} callback
         */
        onSafeModeChanged: function(callback) {
            UpmEnvironment.getHostStatusModel().on('change:safeMode', function(model) {
                if (model._previousAttributes.safeMode !== undefined) {
                    callback();
                }
            });
        },

        /**
         * Gets the current safe mode state from the back end.  If it has changed, any event listeners
         * on the host status model will be notified.
         * @method refreshSafeModeState
         */
        refreshSafeModeState: function() {
            $.ajax({
                type: 'GET',
                cache: false,
                url: UpmEnvironment.getResourceUrl('safe-mode'),
                dataType: 'json',
                contentType: UpmEnvironment.getContentType('safe-mode'),
                success: function(response) {
                    UpmEnvironment.setResourceUrls(response.links);
                    UpmEnvironment.getHostStatusModel().set({ safeMode: response.enabled });
                },
                error: function(request) {
                    UpmAjax.signalAjaxError(request);
                }
            });
        },

        /**
         * Shows a dialog allowing the user to enter safe mode.
         * @method showEnterSafeModeDialog
         */
        showEnterSafeModeDialog: function() {
            new UpmDialog({ template: EnterSafeModeConfirmDialogTemplate }).getResult().done(enterSafeMode);
        },

        /**
         * Shows a dialog allowing the user to exit safe mode and restore the previous configuration.
         * @method showEnterSafeModeDialog
         */
        showExitSafeModeRestoreStateDialog: function() {
            showExitSafeModeConfirmDialog(false);
        },

        /**
         * Shows a dialog allowing the user to exit safe mode and keep the current configuration.
         * @method showEnterSafeModeDialog
         */
        showExitSafeModeKeepStateDialog: function() {
            showExitSafeModeConfirmDialog(true);
        }
    };

    function showExitSafeModeConfirmDialog(keepState) {
        new UpmDialog({ template: ExitSafeModeConfirmDialogTemplate, data: { keepState: keepState }})
            .getResult().done(function() {
                exitSafeMode(keepState);
            });
    }

    function changeSafeModeState(enabled, taskType, linkKey, successMessageCallback) {
        UpmLongRunningTasks.startProgress(taskType);
        if (!UpmLongRunningTasks.abortIfHasPendingTask()) {
            $.ajax({
                type: 'PUT',
                url: UpmEnvironment.getResourceUrl(linkKey),
                dataType: 'json',
                contentType: UpmEnvironment.getContentType('safe-mode'),
                data: JSON.stringify({ enabled: enabled, links : {} }),
                success: function(response) {
                    UpmEnvironment.setResourceUrls(response.links);
                    successMessageCallback();
                    UpmEnvironment.getHostStatusModel().set({ safeMode: enabled });
                    UpmLongRunningTasks.stopProgress().done(function() {
                        UPM.trace('safe-mode-changed');  // for UI test synchronization
                    });
                },
                error: function(request) {
                    UpmLongRunningTasks.stopProgress().done(function() {
                        if (request.status == '409') {
                            // if 409 is returned, we were already in the safe mode state we wanted
                            UpmSafeMode.refreshSafeModeState();
                        }
                        UpmAjax.signalAjaxError(request);
                        UPM.trace('safe-mode-changed');  // for UI test synchronization
                    });
                }
            });
        }
    }

    function enterSafeMode() {
        changeSafeModeState(true, 'safeMode.enable', 'enter-safe-mode', function() {
            UpmCommonUi.clearMessages();
        });
    }

    function exitSafeMode(keepState) {
        var taskType = keepState ? 'safeMode.keepState' : 'safeMode.restore',
            linkKey = keepState ? 'exit-safe-mode-keep' : 'exit-safe-mode-restore',
            successMessage = UpmStrings[keepState ? 'upm.messages.safeMode.keepState.success' :
                'upm.messages.safeMode.restore.success'];

        changeSafeModeState(false, taskType, linkKey, function() {
            UpmCommonUi.showMessage({ type: 'success', message: successMessage, className: 'safeMode' });
        });
    }

    function updateUiForSafeModeState() {
        var safeMode = UpmEnvironment.isSafeMode(),
            canEnterSafeMode = !safeMode && UpmEnvironment.getResourceUrl('enter-safe-mode');
            canExitSafeMode = safeMode &&
                (UpmEnvironment.getResourceUrl('exit-safe-mode-restore') || UpmEnvironment.getResourceUrl('exit-safe-mode-keep'));
        if (safeMode) {
            $('#upm-safe-mode-off').replaceWith(SafeModeStatusTemplate({ canExitSafeMode: canExitSafeMode }));
        }
        $('#upm-container').toggleClass('upm-safe-mode', safeMode);
        $('#link-bar-safe-mode').toggleClass('hidden', !canEnterSafeMode);
    }

    eventListener.listenTo(UpmEnvironment.getHostStatusModel(), 'change:safeMode', updateUiForSafeModeState);

    $(function() {
        // enable safe mode link
        $(document).on('click', '#upm-safe-mode-enable', function(e) {
            e.preventDefault();
            UpmSafeMode.showEnterSafeModeDialog();
        });

        // exit safe mode and restore link
        $(document).on('click', '#upm-safe-mode-restore', function(e) {
            e.preventDefault();
            UpmSafeMode.showExitSafeModeRestoreStateDialog();
        });

        // exit safe mode link
        $(document).on('click', '#upm-safe-mode-keep-state', function(e) {
            e.preventDefault();
            UpmSafeMode.showExitSafeModeKeepStateDialog();
        });
    });

    UpmEnvironment.getReadyState().done(updateUiForSafeModeState);

    return UpmSafeMode;
});
