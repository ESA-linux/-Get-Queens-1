UPM.define('UpmMessageModel', ['brace'], function(Brace) {

    return Brace.Model.extend({

        namedAttributes: [
            "title",
            "message",
            "type",
            "closeable",
            "closeAfter",
            "className"
        ],

        defaults: {
            "closeable": true,
            "closeAfter": -1,
            "title": null,
            "message": null,
            "className": null
        }

    });
});