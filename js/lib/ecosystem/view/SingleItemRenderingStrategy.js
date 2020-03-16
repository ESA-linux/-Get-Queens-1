/**!
 * Atlassian Ecosystem Common Backbone Libraries. Version 1.1.0 
 *
 * Shared libraries used between marketplace.atlassian.com and the Universal Plugin Manager. 
 */

/**
 * Render Strategy for a Single View (not in a collection).
 *
 * Appends the result of the template to the element.
 */

UPM.define("SingleItemRenderingStrategy",


function() {

    return function(html) {
        this.$el.html(html);
    };

});