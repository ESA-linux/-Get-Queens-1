UPM.define('UpdateCheckAddonModel',
    [
        'jquery',
        'underscore',
        'InstalledAddonModel',
        'EnableDisableAddonMixin'
    ],
    function($,
             _,
             InstalledAddonModel,
             EnableDisableAddonMixin) {

    "use strict";

    /**
     * Subclass of InstalledAddonModel that adds properties and behaviors that are only relevant on the
     * Update Check page.
     */
    return InstalledAddonModel.extend({

        mixins: [ EnableDisableAddonMixin ],

        namedAttributes: _.keys(InstalledAddonModel.prototype.namedAttributes).concat([
            "installedVersion"
        ]),

        url: function() {
            return this.getLinks().self;
        },

        getActionState: function(action) {
            return this.isEnableOrDisableActionAllowed(action);
        }
    });
});
