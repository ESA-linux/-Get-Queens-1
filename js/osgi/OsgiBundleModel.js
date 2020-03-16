UPM.define("OsgiBundleModel",
    [
        'brace',
        'ExpandableModelMixin'
    ], function(Brace,
                ExpandableModelMixin) {

    return Brace.Model.extend({

        mixins: [ ExpandableModelMixin ],

        namedAttributes: [
            "name",
            "links",
            "location",
            "parsedHeaders",
            "registeredServices",
            "servicesInUse",
            "state",
            "symbolicName",
            "unparsedHeaders",
            "version",
            "hasDetails"
        ],

        url: function() {
            return this.getLinks().self;
        },

        getDisplayName: function() {
            return this.getId() + " - " + this.getName();
        }
    });
});