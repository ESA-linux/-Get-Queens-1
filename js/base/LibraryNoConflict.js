/**
 * Define libraries on the UPM namespaced require.
 *
 * Each define calls noConflict which returns the UPM version and at
 * the same time resets the version which was previously included.
 *
 * This allows us to define our own dependencies without overwriting
 * the product's provided version.
 */
(function() {

    var UpmRequire = require.noConflict();
    UPM.require = UpmRequire.require;
    UPM.define = UpmRequire.define;

    /**
     * Revert to the previously loaded versions of Brace, Backbone, Underscore and jQuery
     * and store the newly loaded version in a local variable.
     *
     * The local versions of the libraries are accessed from the UPM namespaced requirejs instance
     * via the define functions below.
     */
    var UpmBrace = Brace.noConflict(),
        UpmBackbone = Backbone.noConflict(),
        UpmUnderscore = _.noConflict(),
        UPMJQuery = $.noConflict(true);

    UPM.define("jquery", function() {
        return UPMJQuery;
    });

    UPM.define("aui/flag", function () {
        return require('aui/flag');
    });

    UPM.define("underscore", function() {
        return UpmUnderscore;
    });

    UPM.define("backbone", ["jquery"], function() {
        return UpmBackbone;
    });

    UPM.define("brace", ["backbone"], function() {
        return UpmBrace;
    });

    /**
     * UPM.trace is used in UI tests to signal to WebDriver when a specific
     * event has occured. In Production it's a NoOp.
     */
    if (!UPM.trace) {
        UPM.trace = function() {};
    }

})();
