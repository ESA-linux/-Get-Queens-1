/**!
 * Atlassian Ecosystem Common Backbone Libraries. Version 1.2.0 
 *
 * Shared libraries used between marketplace.atlassian.com and the Universal Plugin Manager. 
 */

/**
 * Fancy Select Option Collection View.
 */


UPM.define("FancySelectOptionCollectionView", ['jquery', 'underscore', 'BaseCollectionView'], function($, _, BaseCollectionView) {

    var liTemplate = _.template("<li data-value='<%= model.value %>'><%= model.text %></li>");

    return BaseCollectionView.extend({

        events: {
            "click li": "_selectOption"
        },

        _initEvents: function() {
            this.listenTo(this.collection, "reset add remove sync", this.render);
        },

        _selectOption: function(e) {
            this.collection.setSelection($(e.target).data("value"));
            e.preventDefault();
        },

        template: function(data) {
            return _.map(data.models, function(model) {
                return liTemplate({
                    model: model
                });
            });
        }

    });
});