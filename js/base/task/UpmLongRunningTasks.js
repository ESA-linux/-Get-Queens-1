UPM.define('UpmLongRunningTasks',
    [
        'jquery',
        'underscore',
        'PendingExternalTaskModel',
        'TaskProgressModel',
        'TaskProgressDialog',
        'UpmAjax',
        'UpmBrowserDetection',
        'UpmEnvironment',
        'UpmFormats',
        'UpmXsrfTokenState',
        'UpmDialog',
        'TaskConflictDialogTemplate',
        'TaskProgressDetailsTemplate'
    ],
    function($,
             _,
             pendingExternalTaskModel,
             TaskProgressModel,
             TaskProgressDialog,
             UpmAjax,
             UpmBrowserDetection,
             UpmEnvironment,
             UpmFormats,
             UpmXsrfTokenState,
             UpmDialog,
             TaskConflictDialogTemplate,
             TaskProgressDetailsTemplate) {

    var progressModel = new TaskProgressModel();
    var progressDialog = null;
    var progressDeferred = null;

    // Function that causes the dialog to close, possibly after a delay.
    var delayedStopFn;

    var isLatentThreshold = 100;   // don't display progress popup if request is shorter than this
    var minProgressDisplay = 1000; // if progress popup is displayed, keep it up for at least this long
    var skipLatentThreshold = UpmBrowserDetection.isIE && AJS.Confluence && AJS.Confluence.runBinderComponents;
    var pollPendingTasksTimeout;

    /**
     * Manages the front-end behavior for long-running tasks and the task progress dialog.
     */
    var UpmLongRunningTasks = {
        /**
         * Checks to see if an ansynchronous task is pending on page load.
         * @method checkForPendingTasks
         * @param {Boolean} forceSynchronous If true, forces the pending tasks request to be synchronous
         */
        checkForPendingTasks: function(forceSynchronous) {
            if (UpmEnvironment.getResourceUrl('pending-tasks') && !pollPendingTasksTimeout) {
                $.ajax({
                    url: UpmEnvironment.getResourceUrl('pending-tasks'),
                    type: 'get',
                    cache: false,
                    dataType: 'json',
                    async: !forceSynchronous,
                    success: function(response) {
                        if (response.tasks.length > 0) {
                            var task = response.tasks[0];
                            if (task.userKey === UpmEnvironment.getUserKey()) {
                                UpmLongRunningTasks.startProgress('pending');
                                UpmLongRunningTasks.pollForCompletion(task.links.self, task.pingAfter)
                                    .fail(UpmAjax.signalAjaxError)
                                    .always(UpmLongRunningTasks.stopProgress);
                            } else {
                                // task was not initiated by the current user
                                updatePendingTaskDetail(task);
                                pollPendingTasks();
                            }
                        }
                    },
                    error: function(request) {
                        UpmAjax.signalAjaxError(request);
                    }
                });
            }
        },

        /**
         * Returns a Promise that is resolved once the progress dialog has been hidden, or if
         * there was no progress dialog.
         * @method getProgressDialogPromise
         * @return {Promise}
         */
        getProgressDialogPromise: function() {
            if (progressDeferred) {
                return progressDeferred.promise();
            } else {
                return $.Deferred().resolve().promise();
            }
        },

        /**
         * Returns a Backbone model describing the current status of long-running tasks from other users.
         * @method getPendingExternalTaskModel
         * @return {Backbone.Model}
         */
        pendingExternalTaskModel: function() {
            return pendingExternalTaskModel;
        },

        /**
         * Shows the standard progress dialog.  Only one progress dialog can be visible at a time; if
         * another is on screen now, it will be reused.
         *
         * The taskType and subtaskType strings must correspond to values that are referenced in
         * TaskProgressDetailsTemplate.
         *
         * @method startProgress
         * @param {String} taskType  task type identifier ("disable", "update", etc.)
         * @param {Object} status  optional properties to show in the status message ("name", etc.)
         * @param {String} taskStage  optional subtask type identifier ("downloading", etc.)
         */
        startProgress: function(taskType, status, taskStage) {
            var props = {
                taskType: taskType,
                taskStage: taskStage,
                status: status || {}
            };
            progressDeferred = $.Deferred();
            progressModel.setStatusProperties(props);
            if (!progressDialog) {
                progressDialog = new TaskProgressDialog({
                    model: progressModel,
                    createHidden: true
                });
                delayedStopFn = execCallbacksWithThreshold(
                    showProgressDialog,
                    removeProgressDialog,
                    isLatentThreshold,
                    minProgressDisplay
                );
            }
        },

        /**
         * Hides the standard progress dialog if it is visible.  Unless you specify true for "immediately",
         * the hiding of the dialog is slightly delayed so that if we proceed to show another progress dialog
         * right after it, there will be no flickering.
         * @method stopProgress
         * @param {Boolean} immediately  true if the dialog should be hidden right now with no delay
         * @return {Promise}  a Promise which will be resolved once the dialog disappears
         */
        stopProgress: function(immediately) {
            if (immediately) {
                removeProgressDialog();
            } else {
                if (delayedStopFn) {
                    delayedStopFn();
                }
            }
            return UpmLongRunningTasks.getProgressDialogPromise();
        },

        /**
         * Queries the back end synchronously to see if anyone else is executing a long-running task;
         * if so, hides any progress dialog that we have displayed, shows an error dialog indicating that
         * you can't do any conflicting operations right now, and returns true.
         * @method abortIfHasPendingTask
         * @return {Boolean}  true if we must cancel the operation we were about to do (an error has
         *   already been displayed in this case); false if it is OK to proceed
         */
        abortIfHasPendingTask: function() {
            UpmLongRunningTasks.checkForPendingTasks(true);
            if (pendingExternalTaskModel.getOtherUserTaskUserKey()) {
                // There are pending tasks, so we don't want to run the requested action
                UpmLongRunningTasks.stopProgress();
                new UpmDialog({ template: TaskConflictDialogTemplate });
                return true;
            } else {
                return false;
            }
        },

        /**
         * Periodically polls an asynchronous task resource, updating the progress dialog in the meantime,
         * until the task has succeeded or failed.
         * @method pollForCompletion
         * @param {String} url  the resource URL
         * @param {Number} delay  time, in ms, to wait before next poll
         * @return {Promise}  on successful completion, the Promise is resolved and provides the final
         *   task response; on failure it is rejected and provides the request object
         */
        pollForCompletion: function(url, delay) {
            var deferred = $.Deferred();
            delay = delay || 100;
            pollAsynchronousResource(url, delay || 100, deferred);
            return deferred.promise();
        }
    };

    function showProgressDialog() {
        if (progressDialog) {
            progressDialog.show();
        }
    }

    function removeProgressDialog() {
        if (progressDialog) {
            progressDialog.close();
            progressDeferred.resolve();
            progressDialog = null;
        }
        delayedStopFn = null;
    }

    /**
     * For use when making UI changes before and after a synchronous requests.  Avoids "flickering" UI elements by:
     *  -- only running the the "startFn" if the request takes longer than a specified threshold
     *  -- if startFn is run, stopFn will not be run until a specified delay has passed
     * @method execCallbacksWithThreshold
     * @param {Function} startFn Function to run at the beginning of the request
     * @param {Function} stopFn Function to run once the request has been completed
     * @param {Number} latencyThreshold Amount of time to wait before calling startFn (in ms)
     * @param {Number} minShowTime Minimum amount of time between calling startFn and stopFn (in ms)
     * @return {Function} The function to run when request has completed (stopFn is ready to be executed)
     */
    function execCallbacksWithThreshold(startFn, stopFn, latencyThreshold, minShowTime) {
        latencyThreshold = latencyThreshold || 50;
        minShowTime = minShowTime || 1000;
        var shouldStart = true,
            didStart = false,
            canStop = false,
            shouldStop = false,
            didStop = false;
        var stop,
        // Run a callback after specified delay
            delay;

        if (skipLatentThreshold) {
            // in Confluence/IE just run the callback immediately to lessen UI lag
            delay = function (callback) {
                callback();
            };
        } else {
            delay = function (callback, l) {
                delay.t = setTimeout(function(){
                    clearTimeout(delay.t);
                    delay.t = undefined;
                    callback();
                }, l);
            };
        }

        delay(function() {
            if (shouldStart) {
                startFn();
                didStart = true;
                delay(function() {
                    canStop = true;
                    if (shouldStop && !didStop) {
                        stopFn();
                    }
                }, minShowTime);
            }
        }, latencyThreshold);

        return function() {
            if (!shouldStop) {
                shouldStart = false;
                shouldStop = true;
                if (!didStart || canStop) {
                    stopFn();
                    didStop = true;
                }
            }
        };
    }

    /**
     * Given a pending task response's content type, this function parses out the relevent task details and returns it in an object
     * @method parsePendingTaskContentType
     * @param {String} contentType Text to be inserted into progress element
     * @return {Object} Object containing 'type' and 'status' attributes
     */
    function parsePendingTaskContentType(contentType) {
        // content type for pending tasks will be of the form 'application/vnd.atl.plugins.{task}.{status}+json'
        var regex = /application\/vnd\.atl\.plugins\.(task\.)?(updateall|install|cancellable|embeddedlicense|disableall)\.(.*)\+json/,
            tmp,
            detail;
        if (contentType && regex.test(contentType)) {
            tmp = contentType.match(regex);
            detail = {type: tmp[2], status: tmp[3]};
        }
        return detail;
    }

    function pollAsynchronousResource(location, delay, deferredResult) {
        try {
            $.ajax({
                type: 'GET',
                cache: false,
                url: location,
                contentType: UpmEnvironment.getContentType('json')
            }).done(function(response, statusText, request) {
                processPollResponse(response, statusText, request, deferredResult, function() {
                    pollAsynchronousResource(location, response.pingAfter, deferredResult);
                });
            }).fail(function(request) {
                processPollFailure(request, deferredResult);
            });
        } catch (e) {
            // UPM-842: IE freaks out if you try to do a cross-domain request, which might happen if the base url is set
            // incorrectly, so catch the error and display a relevant error message
            AJS.log('Error doing ajax request: ' + e);
            UpmLongRunningTasks.stopProgress();
            deferredResult.reject(null, {'subCode' : 'upm.baseurl.connection.error'});
        }
    }

    function processPollFailure(request, deferredResult) {
        UpmAjax.signalAjaxError(request);
        if (request.status == '0') {
            // we're offline : something is probably wrong with baseUrl settings
            UpmLongRunningTasks.stopProgress();
            deferredResult.reject(null, {'subCode' : 'upm.baseurl.connection.error'});
        } else {
            // something went horribly/unexpectedly wrong
            UpmLongRunningTasks.stopProgress();
            deferredResult.reject(request);
        }
    }

    function processPollResponse(response, statusText, request, deferredResult, pollFn) {
        var contentType = request.getResponseHeader('Content-Type'),
            statusCode = request.status,
            taskDetail = parsePendingTaskContentType(contentType),
            status = response.status,
            statusProperties;

        function failed() {
            UpmLongRunningTasks.stopProgress();
            deferredResult.reject(request, response, response.status.plugin);
        }

        if (statusCode === 202) {
            response.statusCode = statusCode;
            deferredResult.resolve(response);
        } else {
            if (taskDetail && taskDetail.status == 'err') {
                //get a new XSRF token since the existing token may now be invalid
                UpmXsrfTokenState.refreshToken().done(failed);
            } else if (taskDetail && !status.done) {
                statusProperties = {
                    taskType: taskDetail.type,
                    taskStage: taskDetail.status,
                    status: status
                };
                progressModel.setStatusProperties(statusProperties);

                if (response.pingAfter) {
                    // if still working, content type is application/vnd.atl.plugins.pending-task+json
                    // and a pingAfter property was returned in the response
                    setTimeout(pollFn, response.pingAfter);
                    if (status.amountDownloaded && status.totalSize) {
                        progressModel.setProgressPercent(Math.floor((status.amountDownloaded / status.totalSize) * 100));
                        progressModel.setShowProgressBar(true);
                    } else {
                        progressModel.setShowProgressBar(false);
                    }
                } else {
                    // if there was an error during installation, response won't have a pingAfter property
                    failed();
                }
            } else {
                if (response.status && (response.status.subCode || response.status.errorMessage)) {
                    failed();
                } else {
                    progressModel.setProgressPercent(100);
                    progressModel.setStatusProperties(_.extend({}, progressModel.getStatusProperties(), { taskStage: 'complete' }));

                    // pause for 1 second at 100% completion to simulate the progress bar going to the end
                    setTimeout(function() {
                        if (status && status.links && status.links.redirect) {
                            //do a full page redirect instead of respecting the callback
                            window.location.href = status.links.redirect;
                            return;
                        }

                        // if simpler async tasks are completed, 303 will redirect to plugin details resource, but content type will be different
                        // if complex async tasks are completed, 'status' property will be set to 'SUCCEEDED'
                        deferredResult.resolve(response);
                    }, 1000);
                }
            }
        }
    }

    /**
     * Polls the pending tasks collection resource to determine if another user's task is running
     * @method pollPendingTasks
     */
    function pollPendingTasks() {
        clearTimeout(pollPendingTasksTimeout);
        $.ajax({
            url: UpmEnvironment.getResourceUrl('pending-tasks'),
            type: 'get',
            cache: false,
            dataType: 'json',
            success: function(response) {
                var task;
                if (response.tasks.length > 0) {
                    task = response.tasks[0];
                    updatePendingTaskDetail(task);
                    pollPendingTasksTimeout = setTimeout(pollPendingTasks, task.pingAfter);
                } else {
                    updatePendingTaskDetail(null);
                    pollPendingTasksTimeout = undefined;
                }
            },
            error: function(request) {
                UpmAjax.signalAjaxError(request);
            }
        });
    }

    /**
     * Updates (or creates) the pending task detail text
     * @method updatePendingTaskDetail
     * @param {Object} task Task detail object
     */
    function updatePendingTaskDetail(task) {
        var status = task && task.status,
            detail = parsePendingTaskContentType(status && status.contentType),
            text,
            statusProperties,
            $markup;
        if (detail && status) {
            statusProperties = {
                taskType: detail.type,
                taskStage: detail.status,
                status: status
            };
            $markup = $('<div></div>').html(TaskProgressDetailsTemplate(statusProperties));
            text = $markup.find('main').html().trim();
            pendingExternalTaskModel.set({
                otherUserTaskDesc: text,
                otherUserTaskUserKey: task.userKey,
                otherUserTaskStartTime: task.timestamp
            });
        } else {
            pendingExternalTaskModel.set({ otherUserTaskDesc: null });
        }
    }

    return UpmLongRunningTasks;
});
