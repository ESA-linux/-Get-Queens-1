UPM.define('UpdateCheckAvailableVersionsModel',
    [
        'brace',
        'UpmEnvironment'
    ], function(Brace,
                environment) {

    return Brace.Model.extend({

        namedAttributes: [ 'versions' ],

        url: function() {
            return environment.getResourceUrl('product-updates');
        }
    });
});
