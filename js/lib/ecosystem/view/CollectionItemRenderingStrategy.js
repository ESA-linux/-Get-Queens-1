/**!
 * Atlassian Ecosystem Common Backbone Libraries. Version 1.1.0 
 *
 * Shared libraries used between marketplace.atlassian.com and the Universal Plugin Manager. 
 */

/**
 * Rendering Strategy for a Collection Item View.
 *
 * Replaces this.$el with the result of the template.
 */

UPM.define("CollectionItemRenderingStrategy",
    [ 'jquery', 'underscore' ],

function($, _) {

    return function(html) {
        var $oldEl = this.$el;
        this.setElement(_.isString(html) ? $($.parseHTML(html)) : html);
        if ($oldEl) {
            $oldEl.replaceWith(this.$el);
        }
    };

});