/**!
 * Atlassian Ecosystem Common Backbone Libraries. Version 1.1.0 
 *
 * Shared libraries used between marketplace.atlassian.com and the Universal Plugin Manager. 
 */

/**
 * Base Model View.
 *
 * Responsible for rendering a single model with a template compiled from the provided selector.
 */

UPM.define("BaseView", ['brace', 'jquery', 'underscore', 'SingleItemRenderingStrategy'], function(Brace, $, _, SingleItemRenderingStrategy) {

    "use strict";

    return Brace.View.extend({

        initialize: function(options) {
            this.options = options;
            this._compileTemplate();
            this._initEvents();
            this._postInitialize();
        },

        stopListening: function() {
            Brace.View.prototype.stopListening.apply(this);
            this._unbindEventsFromSubViews();
        },

        /**
         * Defines the default rendering Strategy to use.
         *
         * By default BaseView will render within this.$el.
         */
        renderingStrategy: SingleItemRenderingStrategy,

        /**
         * NoOp function used to initialise event bindings on the model.
         *
         * @private
         */
        _initEvents: function() {},

        /**
         * NoOp function used to perform post-initialise view operations.
         *
         * @private
         */
        _postInitialize: function() {},

        /**
         * Renders the view using the result of _getHtml.
         *
         * In the instance that the result of _getHtml is falsey or an empty string we do nothing.
         * This is due to some views not having a template, but rather using an existing element
         * rendered by the server.
         *
         * @returns {Object} The view instance.
         */
        render: function() {
            this._unbindEventsFromSubViews();
            var html = this._getHtml();
            if (html) {
                this.renderingStrategy(html);
            }

            this._postRender();
            return this;
        },

        /**
         * NoOp function used to perform post-render view operations.
         *
         * @private
         */
        _postRender: function() {},

        /**
         * Renders the view's template (if any) and returns the result.
         *
         * @returns {jQuery} The result of the template render or an empty string if there is no template specified.
         * @private
         */
        _getHtml: function() {
            if (this._compiledTemplate) {
                return this._compiledTemplate(this._getData());
            } else {
                return "";
            }
        },

        /**
         * Return the data from the model as JSON.
         *
         * @returns {Object} The view's model's data.
         */
        _getData: function() {
            return this.model.toJSON();
        },

        /**
         * Returns a template selector (if any).
         *
         * @private
         */
        _getTemplate: function() {
            return (this.options && this.options.template) || this.template;
        },

        /**
         * Compiles the template by the selector indicated in this.template.
         *
         * @private
         */
        _compileTemplate: function() {
            var template = this._getTemplate();
            if (template && typeof template === "string") {
                var compiledTemplate;
                this._compiledTemplate = function(params) {

                    if (!compiledTemplate) {
                        compiledTemplate = _.template($.trim($(template).html()));
                    }

                    return $.parseHTML(compiledTemplate(params));
                };
            } else if (typeof template === "function") {
                this._compiledTemplate = template;
            }
        },

        /**
         * Triggers an event to notify any interested subviews that they should unbind their events.
         * @private
         */
        _unbindEventsFromSubViews: function() {
            this.trigger('unbound');
        }
    });
});
