UPM.define('OsgiPageModule', ["brace", "jquery", "OsgiPageView", "OsgiBundleCollection"], function(Brace, $, OsgiPageView, OsgiBundleCollection) {

    return Brace.Model.extend({

        initialize: function() {
            var osgiBundleCollection = new OsgiBundleCollection();

            new OsgiPageView({
                model: osgiBundleCollection,
                el: $("#upm-container")
            });

            osgiBundleCollection.getBundles();
        }
    });
});