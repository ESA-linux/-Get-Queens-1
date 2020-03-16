/**!
 * Atlassian Ecosystem Common Backbone Libraries. Version 1.1.0 
 *
 * Shared libraries used between marketplace.atlassian.com and the Universal Plugin Manager. 
 */

/**
 * Base Collection Item View.
 *
 * Responsible for rendering individual items in a collection.
 */
UPM.define("BaseCollectionItemView", ["BaseView", "CollectionItemRenderingStrategy"], function(BaseView, CollectionItemRenderingStrategy) {

    "use strict";

    return BaseView.extend({

        /**
         * By default Collection Items' this.$el is replaced using the response from the template.
         */
        renderingStrategy: CollectionItemRenderingStrategy

    });
});