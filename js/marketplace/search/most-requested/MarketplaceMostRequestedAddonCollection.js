UPM.define('MarketplaceMostRequestedAddonCollection',
    [
        'underscore',
        'brace',
        'UpmHostStatusMixin',
        'MarketplaceMostRequestedAddonModel',
        'UpmContextPathMixin'
    ],
    function(_,
             Brace,
             UpmHostStatusMixin,
             MarketplaceMostRequestedAddonModel,
             UpmContextPathMixin) {

    "use strict";

    return Brace.Collection.extend({

        mixins: [UpmHostStatusMixin, UpmContextPathMixin],

        model: MarketplaceMostRequestedAddonModel,

        url: function() {
            return this.getContextPath() + "/rest/plugins/1.0/requests";
        },

        initialize: function() {
            this._bindHostStatus();
        },

        /**
        * Perform a search by filter and params.
        *
        * @param marketplaceQueryModel The model representing the search query.
        */
        search: function(marketplaceQueryModel) {
            return this.fetch({
               data: marketplaceQueryModel.getPaginationRequestParameters()
            });
        },

        /**
         * Extracts the addon list from the response.
         *
         * @param response The server response.
         * @returns {Array} The list of addons.
         */
        parse: function(response) {
            return response.plugins;
        }
    });
});