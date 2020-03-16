/**!
 * Atlassian Ecosystem Common Backbone Libraries. Version 1.2.0 
 *
 * Shared libraries used between marketplace.atlassian.com and the Universal Plugin Manager. 
 */

/**
 * Hidden Select Collection
 */

UPM.define("HiddenSelectCollection", ['jquery', 'underscore', 'brace'], function($, _, Brace) {

    var optionTemplate = _.template("<option value='<%= model.value %>'><%= model.text %></option>");

    return Brace.Collection.extend({

        initialize: function(models, options) {
            options = options || {};
            this.$select = $(options.select || "<select></select>");
            this.options = options;
            this.on("add remove", this._updateOptions);
            this.on("sync", this._updateFromAjax);
        },

        init: function() {
            if (this.$select.has("option").length) {
                this._resetFromSelect();
            } else if (this.$select.data("url")) {
                this.url = this.$select.data("url");
                this.fetch();
            }
        },

        parse: function(models) {
            var defaultValue = this.$select.data("default");

            if (this.options.parse) {
                models = this.options.parse(models);
            }

            if (defaultValue) {
                models.unshift({
                    text: defaultValue,
                    value: defaultValue
                });
            }
            return models;
        },

        getSelectedOptionText: function() {
            var selected = this.$select.find("option:selected");
            if (!selected.length) {
                selected = this.$select.find("option:first");
            }
            return selected.text();
        },

        getSelectedValue: function() {
            return this.$select.val();
        },

        /**
         * Sets the selection of the hidden select.
         *
         * If the select is driven by a URL and it has not been initialized yet
         * then the initial-value data attribute is set. This value is read
         * when the ajax response returns and if the value exists in the response
         * it is immediately selected.
         *
         * @param value The value of the option to select.
         * @param silent Whether to select silently.
         */
        setSelection: function(value, silent) {

            if (this.$select.data("url") && !this.$select.data("initialized")) {
                this.$select.data("initial-value", value);

                return;
            }

            this.$select.val(value).trigger("change");
            this.trigger("change");

            if (!silent) {
                this.trigger("update", this.$select.attr("name"));
            }
        },

        disable: function(options) {
            options = options || {};

            if (options.reset) {
                this.setSelection("", options.silent);
            }

            this.$select.attr("disabled", "disabled");
            this.trigger("disable");
        },

        enable: function() {
            this.$select.removeAttr("disabled");
            this.trigger("enable");
        },

        _updateOptions: function() {
            this.$select.html(this.map(function(option) {
                return optionTemplate({
                    model: option.toJSON()
                });
            }));
        },

        /**
         * Called when the initial data is loaded via ajax.
         *
         * Set the "initialized" data attribute and if an initial-value
         * data value is defined then attempt to silently select that value.
         *
         * @private
         */
        _updateFromAjax: function() {
            this._updateOptions();
            this.$select.data("initialized", true);

            if (this.$select.data("initial-value")) {
                var value = this.$select.data("initial-value");
                this.$select.removeData("initial-value");
                this.setSelection(value, true);
            }
        },

        _resetFromSelect: function() {
            var options = _.map(this.$select.find("option"), function(option) {
                var $option = $(option);
                return {
                    text: $option.text(),
                    value: $option.val()
                };
            });
            this.reset(options);
        }
    });
});