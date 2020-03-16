/**
 * This rendering strategy allows us to append the search results elements
 * into the plugin list child element of the element assigned to the CollectionView.
 */
UPM.define("SearchResultsRenderingStrategy", function() {

    /**
     * Writes the HTML for the addons in the plugin list element.
     */
    return function(html) {
        this.$el.find(".upm-plugin-list").html(html);
    };

});