/**
 * This View handles clicking on Categories and displaying the next page of the list of addons.
 */
UPM.define('MarketplaceBrowserEventHandlingView', ["jquery", "BaseView"], function($, BaseView) {

    return BaseView.extend({

        events: {
            "click .upm-plugins-see-more": "_displayNextPage"
        },

        /**
         * Displays the next page of results when the 'Show More' link is clicked.
         *
         * @param e The event
         * @private
         */
        _displayNextPage: function(e) {
            e.preventDefault();
            this.model.loadNextPage();
        }
    });
});