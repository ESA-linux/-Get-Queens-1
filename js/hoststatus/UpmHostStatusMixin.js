/**
 * This mixin can be used to parse a response object looking for the hostStatus property.
 *
 * The mixin will then update the properties of the singleton host status model maintained
 * by UpmEnvironment.
 */
UPM.define('UpmHostStatusMixin',
    [
        'UpmEnvironment',
        'UpmLongRunningTasks',
        'UpmRequireRestart'
    ], function(UpmEnvironment,
                UpmLongRunningTasks,
                UpmRequireRestart) {

    return {

        _bindHostStatus: function() {
            this.on("sync", this._syncHostStatus, this);
        },

        /**
         * When the host model or collection is synced with the server this funciton
         * will be triggered and will extract the hostStatus property and update the
         * UpmEnvironment singleton properties from it.
         *
         * @param model The model or collection being synced.
         * @param response The jqXHR response object.
         */
        _syncHostStatus: function(model, response) {
            // Merge any REST URLs returned in the response into the cached resource link map,
            // since anyone who is interested in the host status may also want to know about
            // resource-based capabilities like entering/exiting safe mode.
            if (response) {
                UpmEnvironment.setResourceUrls(response.links);
                UpmEnvironment.getHostStatusModel().set(response.hostStatus);
                if (response.links && response.links['pending-tasks']) {
                    UpmLongRunningTasks.checkForPendingTasks();
                }
                if (response.links && response.links['changes-requiring-restart']) {
                    UpmRequireRestart.checkForChangesRequiringRestart();
                }
            }
        }
    };
});
