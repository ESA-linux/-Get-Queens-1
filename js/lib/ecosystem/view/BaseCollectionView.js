/**!
 * Atlassian Ecosystem Common Backbone Libraries. Version 1.1.0 
 *
 * Shared libraries used between marketplace.atlassian.com and the Universal Plugin Manager. 
 */

/**
 * Base Collection View.
 *
 * Renders a collection using a template or subview per collection entry.
 */
UPM.define("BaseCollectionView", ['BaseView'], function(BaseView) {

    "use strict";

    return BaseView.extend({

        _initEvents: function() {
            this.listenTo(this.collection, "reset", this.render);
            this.listenTo(this.collection, "remove", this._rerenderIfEmpty);
        },

        /**
         * Renders the view's template (if any) and returns the result.
         *
         * @returns {jQuery} The result of the template render or an empty string if there is no template specified.
         * @private
         */
        _getHtml: function() {
            var html = "";

            if (this.collection.length) {
                var subView = this._getCollectionItemView();
                if (subView) {
                    html = this._renderWithSubView();
                } else if (this._compiledTemplate) {
                    html = this._renderWithTemplate();
                }
            } else if (this._getEmptyView()) {
                html = this._renderWithEmptyTemplate();
            }

            return html;
        },

        /**
         * Renders the Collection using a collection item sub view.
         *
         * @returns {jQuery} The view element(s)
         * @private
         */
        _renderWithSubView: function() {
            var ItemView = this._getCollectionItemView(),
                me = this;
            return this.collection.map(function(model) {
                var iv = new ItemView({
                    model: model
                }).render();
                iv.listenTo(me, 'unbound', iv.stopListening);
                return iv.$el;
            });
        },

        /**
         * Renders the Collection with a template.
         *
         * @returns {jQuery} The view element(s)
         * @private
         */
        _renderWithTemplate: function() {
            return this._compiledTemplate({
                models: this._getData()
            });
        },

        /**
         * Renders the collection with a special template if it's
         * empty.
         *
         * @returns {*}
         * @private
         */
        _renderWithEmptyTemplate: function() {
            var EmptyView = this._getEmptyView();
            return new EmptyView({
                model: this
            }).render().$el;
        },

        /**
         * Refreshes the collection view if its last item has been removed.
         * @private
         */
        _rerenderIfEmpty: function() {
            if (this.collection.length === 0) {
                this.render();
            }
        },

        /**
         * Returns the Collection's data as JSON.
         *
         * @returns {Array} The collection's data.
         * @private
         */
        _getData: function() {
            return this.collection.toJSON();
        },

        /**
         * Returns the Item View (if any)
         *
         * Returns this.itemView (when defined internally in the View definition)
         * or
         * Returns this.options.itemView (when defined externally via options)
         *
         * @returns {*} The ItemView (if any)
         * @private
         */
        _getCollectionItemView: function() {
            return this.itemView || this.options.itemView;
        },

        /**
         * A view which renders the collection if it is empty.
         * @returns {*}
         * @private
         */
        _getEmptyView: function() {
            return this.emptyView || this.options.emptyView;
        }
    });
});
