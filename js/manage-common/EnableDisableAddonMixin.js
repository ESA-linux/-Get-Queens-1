/**
 * Mixin for an add-on model that supports the Enable and Disable actions.
 */
 UPM.define('EnableDisableAddonMixin',
    [
        'jquery',
        'underscore',
        'backbone',
        'AddonActions',
        'UpmEnvironment'
    ],
    function($,
             _,
             Backbone,
             addonActions,
             environment) {

    "use strict";

    return {
        enableOrDisable: function(enable) {
            var me = this;
            return this.loadDetails().then(function() {
                var data = _.clone(me.attributes);  // don't use toJSON because it might include calculated properties
                data.enabled = enable;
                return $.ajax({
                    type: 'PUT',
                    url: me.url(),
                    dataType: 'json',
                    contentType: environment.getContentType('plugin'),
                    data: JSON.stringify(data)
                }).then(function() {
                    // refresh the entire model, including details, since any part of the state may have changed
                    return me.refresh();
                });
            }).fail(function(request) {
                me.signalAjaxError(request);
            }).promise();
        },

        isEnableOrDisableActionAllowed: function(action) {
            if (action === addonActions.DISABLE || action === addonActions.ENABLE) {
                // Note that we check for "this.getOptional() !== false" because the "optional" property
                // may be omitted entirely in some representations.
                if (!this.getUnloadable() && this.getLinks().modify &&
                    (this.getOptional() !== false || !this.getEnabled()) &&  // UPM-4802: disabled required plugin can have an Enable button
                    !this.isUpm()) {
                    return this.getEnabled() === (action === addonActions.DISABLE);
                }
            }
            return false;
        }
    };
});
