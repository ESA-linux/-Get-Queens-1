UPM.require(['jquery', 'UpmEnvironment', 'OsgiPageModule'], function($, UpmEnvironment, OsgiPageModule) {
    UpmEnvironment.getReadyState().done(function() {
        new OsgiPageModule();
    });
});