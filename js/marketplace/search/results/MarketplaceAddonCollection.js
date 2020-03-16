UPM.define('MarketplaceAddonCollection', ['brace', 'underscore', 'UpmHostStatusMixin', 'UpmContextPathMixin', 'MarketplaceAddonModel'], function(Brace, _, UpmHostStatusMixin, UpmContextPathMixin, MarketplaceAddonModel) {

    "use strict";

    return Brace.Collection.extend({

        mixins: [UpmHostStatusMixin, UpmContextPathMixin],

        model: MarketplaceAddonModel,

        url: function() {
            return this.getContextPath() + "/rest/plugins/1.0/available" + (this.filter ? ('/' + this.filter) : '');
        },

        initialize: function() {
            this._bindHostStatus();
        },
        
        /**
         * Perform a search by filter and params.
         *
         * @param marketplaceQueryModel The model representing the query.
         * @param update Whether the request is an update or not.
         */
        search: function(marketplaceQueryModel, update) {
            this.filter = !marketplaceQueryModel.getQuery() && marketplaceQueryModel.getFilter();
            return this.fetch({
                data: marketplaceQueryModel.getAsQueryParamsObject(),
                remove: !update
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
