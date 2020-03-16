UPM.define('UpdateCheckResultsModel',
    [
        'brace'
    ], function(Brace) {

    return Brace.Model.extend({

        namedAttributes: [
            'compatible',
            'incompatible',
            'recentVersion',
            'resourceUrl',
            'targetVersion',
            'unknown',
            'updateRequired',
            'updateRequiredAfterProductUpdate'
        ],

        url: function() {
            return this.getResourceUrl();
        },

        fetchResults: function(resourceUrl, version, recent) {
            this.setResourceUrl(resourceUrl);
            this.setTargetVersion(version);
            this.setRecentVersion(recent);
            return this.fetch();
        }
    });
});
