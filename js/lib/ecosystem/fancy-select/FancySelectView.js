/**!
 * Atlassian Ecosystem Common Backbone Libraries. Version 1.2.0 
 *
 * Shared libraries used between marketplace.atlassian.com and the Universal Plugin Manager. 
 */

/**
 * Fancy Select View.
 */
UPM.define("FancySelectView", ['jquery', 'underscore', 'BaseView'], function($, _, BaseView) {

    return BaseView.extend({

        events: {
            "click .selected-value": "_toggle"
        },

        _initEvents: function() {
            this.listenTo(this.collection, "reset change sync", this._setSelectedItemText);
            this.listenTo(this.collection, "change", this._close);
            this.listenTo(this.collection, "disable", this._disable);
            this.listenTo(this.collection, "enable", this._enable);
            $(document).on("click", _.bind(this._closeIfClickedOutside, this));
        },

        _toggle: function(e) {
            if (!this.$el.hasClass("disabled")) {
                this.$el.toggleClass("active");
            }
            e.preventDefault();
        },

        _close: function() {
            this.$el.removeClass("active");
        },

        _closeIfClickedOutside: function(e) {
            var target = $(e.target);
            if (!this.$el.find(target).length) {
                this._close();
            }
        },

        _setSelectedItemText: function() {
            this.$el.find(".selected-value p").text(this.collection.getSelectedOptionText());
        },

        _disable: function() {
            this._close();
            this.$el.addClass("disabled");
        },

        _enable: function() {
            this.$el.removeClass("disabled");
        }
    });
});