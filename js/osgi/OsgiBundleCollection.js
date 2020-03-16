UPM.define('OsgiBundleCollection',
    [
        'brace',
        'jquery',
        'underscore',
        'OsgiBundleModel',
        'UpmAjax',
        'UpmEnvironment'
    ], function(Brace, 
                $,
                _,
                OsgiBundleModel,
                UpmAjax,
                environment) {

    return Brace.Collection.extend({

        model: OsgiBundleModel,

        findBySymbolicName: function(name) {
            return this.find(function(m) { return (m.getSymbolicName() === name); });
        },

        /**
         * Retrieves a list of OSGI bundles.
         *
         * @param keyword An optional keyword to filter OSGI bundles by keyword
         * against their modules.
         */
        getBundles: function(keyword) {

            var url = environment.getResourceUrl('osgi-bundles');

            if (keyword) {
                url += "?q=" + keyword;
            }

            var promise = $.ajax({
                url: url,
                type: 'get',
                dataType: 'json'
            });

            promise.done(_.bind(function(result) {
                this.reset(result.entries);
            }, this));

            promise.fail(_.bind(function(request) {
                UpmAjax.signalAjaxError(request);
            }, this));
        },

        /**
         * Returns a filtered list of bundles by their display name.
         *
         * @param keyword The keyword to filter by.
         * @returns {Array} A list of OsgiBundleModels.
         */
        filterBundlesByName: function(keyword) {
            return this.filter(function(bundle) {
                return bundle.getDisplayName().toLowerCase().indexOf(keyword.toLowerCase()) > -1;
            });
        }
    });
});