/**
 * @singleton
 */
UPM.define('ManageAddonsRouter',
    ['underscore',
     'backbone',
     'brace',
     'UpmContextPathMixin'],
    function(_,
             Backbone,
             Brace,
             UpmContextPathMixin) {

    "use strict";

    var ManageAddonsRouter = Brace.Router.extend({

        routes: {
            "": "setFilter",
            "settings": "settingsDialog",
            ":key": "setFilter"
        },

        start: function() {
            Backbone.history.start({
                root: UpmContextPathMixin.getContextPath() + "/plugins/servlet/upm/manage",
                pushState: window.history && window.history.pushState
            });
        },

        /**
         * @param filterType
         * @param options
         */
        navigateTo: function(filterType, options) {
            this.navigate(filterType, _.defaults(options || {}, {
                replace: false,
                trigger: true
            }));
        }
    });

    return new ManageAddonsRouter();
});
