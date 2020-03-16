/**!
 * Atlassian Ecosystem Common Backbone Libraries. Version 1.2.0 
 *
 * Shared libraries used between marketplace.atlassian.com and the Universal Plugin Manager. 
 */

/**
 * Fancy Select Module.
 *
 * Given the fancy-select element, creates a hidden collection and instantiates the required
 * views to create a fancy select.
 */


UPM.define("FancySelectForm",


    [
        "jquery",
        "underscore",
        "HiddenSelectCollection",
        "FancySelectOptionCollectionView",
        "FancySelectView"
    ],

    function($, _, HiddenSelectCollection, FancySelectOptionCollectionView, FancySelectView) {

        $.fn.fancySelectForm = function(options) {

            options = $.extend({
                onSelection: $.noop
            }, options);

            var fancySelect = this.find(".fancy-select");
            var collections = {};
            var fancySelectForm = this;

            fancySelect.each(function(i, select) {
                var $select = $(select),
                    hiddenSelect = $select.find("select");

                var filterCollection = new HiddenSelectCollection([], {
                    select: hiddenSelect,
                    parse: options.parse
                });

                new FancySelectOptionCollectionView({
                    collection: filterCollection,
                    el: $select.find(".options")
                });

                new FancySelectView({
                    collection: filterCollection,
                    el: $select
                });

                filterCollection.on("update", function() {
                    options.onSelection.apply(fancySelectForm, arguments);
                    fancySelectForm.trigger("update", arguments);
                });

                collections[hiddenSelect.attr("name")] = filterCollection;

                filterCollection.init();
            });

            function hasSelect(selectName) {
                return !!collections[selectName];
            }

            this.selectOption = function(selectName, value, silent) {
                if (hasSelect(selectName)) {
                    collections[selectName].setSelection(value, silent);
                }

                return this;
            };

            this.disable = function(selectName) {
                if (hasSelect(selectName)) {
                    collections[selectName].disable();
                }

                return this;
            };

            this.disableAllBut = function(selectName, options) {
                _.each(_.omit(collections, selectName), function(collection) {
                    collection.disable(options);
                });

                return this;
            };

            this.selectOptionAndDisable = function(selectName, value, silent) {
                this.selectOption(selectName, value, silent);
                this.disable(selectName);

                return this;
            };

            this.enable = function(selectName) {
                if (hasSelect(selectName)) {
                    collections[selectName].enable();
                }

                return this;
            };

            this.enableAll = function() {
                _.each(collections, function(collection) {
                    collection.enable();
                });

                return this;
            };

            this.getSelectedValue = function(selectName) {
                if (hasSelect(selectName)) {
                    return collections[selectName].getSelectedValue();
                }
            };

            this.addOption = function(selectName, value) {
                if (hasSelect(selectName)) {
                    collections[selectName].add(value);
                }
            };

            this.removeOption = function(selectName, value) {
                if (hasSelect(selectName)) {
                    var collection = collections[selectName];
                    collection.remove(collection.findWhere({
                        value: value
                    }));
                }
            };

            return this;
        };
    }
);