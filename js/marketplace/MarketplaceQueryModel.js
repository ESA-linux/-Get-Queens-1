/**
 * The MarketplaceQueryModel represents the state of the Marketplace Page.
 *
 * This is tested in MarketplaceQueryModel-test.js
 */
UPM.define("MarketplaceQueryModel", ["underscore", "brace", "UpmStrings"], function(_, Brace, UpmStrings) {

    "use strict";

    /**
     * The number of new Addons to retrieve when requesting a new page.
     * @type {number}
     */
    var pageAddonCountIncrement = 10;

    return Brace.Model.extend({

        namedEvents: [
            "refresh",
            "single",
            "search"
        ],

        namedAttributes: [
            "filter",
            "key",
            "parameters",
            "query"
        ],

        defaults: {

            "filter": "featured",

            "parameters": {
                "start-index": 0,
                "cost": "",
                "category": ""
            }
        },

        /**
         * Resets the search parameters to default whilst maintaining other
         * parameters and performs a search.
         *
         * @param filter {String} The filter name
         * @param parameters {Array} An array of parameter objects
         */
        resetPaginationAndSetSearchParams: function(filter, parameters) {
            if (!parameters) {
                parameters = {};
            } else if (_.isArray(parameters)) {
                parameters = this.getParametersAsObject(parameters);
            }

            this._setSearchParams(filter, _.extend({}, this.defaults.parameters, parameters));
        },

        /**
         * Sets the filter and parameters of the Query Model and triggers the Search event.
         *
         * The Search event is used instead of the change event as sometimes we'll return
         * to the same search results page as was previously loaded. In this case there would
         * be no change event.
         *
         * The attributes which changed (if any) are sent along with the event so
         * the consumer can determine whether or not it needs to reload the search
         * results from the server.
         *
         * @param filter {String} The filter name
         * @param parameters {Array} An array of parameter objects
         * @param isNextPage {Boolean} Whether the search is a request for the next page.
         */
        _setSearchParams: function(filter, parameters, isNextPage) {
            var toSet = {
                filter: filter,
                parameters: _.omit(parameters, 'q'),
                query: parameters.q
            };

            this.set(this._getAttributesToChange(toSet));
            this.triggerSearch(this.changedAttributes(), isNextPage);
        },

        /**
         * Sets the key parameter and triggers the Single event.
         *
         * The Single event is used instead of the change event as sometimes we'll return
         * to the same single page as was previously loaded. In this case there would
         * be no change event.
         *
         * The attributes which changed (if any) are sent along with the event so
         * the consumer can determine whether or not it needs to reload the addon model from
         * the server.
         *
         * @param key
         */
        setKeyParameter: function(key) {
            this.setKey(key);
            this.triggerSingle(this.changedAttributes());
        },

        /**
         * Creates an object representing the query model which can be used
         * as the data property in a jQuery ajax request.
         *
         * This function will not include a parameter which:
         *  - has no value
         *  - is the 'category=All Categories' parameter
         *
         * @returns {Object} An object representing the query parameters.
         */
        getAsQueryParamsObject: function() {
            var params = this.getParameters(),
                allCategoriesValue = UpmStrings["upm.install.all.categories.dropdown"];
            return _.extend({},
                (params.category !== undefined) && (params.category !== '') && (params.category !== allCategoriesValue) ? { category: params.category } : {},
                (params.cost !== undefined) && (params.cost !== '') ? { cost: params.cost } : {},
                (params['start-index'] > 0) ? { 'start-index': params['start-index'], offset: params['start-index'] } : {},
                  // some of our resources use "offset", others use "start-index"
                (this.getQuery() !== undefined) && (this.getQuery() !== '') ? { q: this.getQuery() } : {}
            );
        },

        /**
         * Returns the pagination parameters only.
         *
         * @returns {Object} The pagination parameters.
         */
        getPaginationRequestParameters: function() {
            return _.pick(this.getAsQueryParamsObject(), 'start-index', 'max-results', 'offset');
        },

        /**
         * Increments the current 'start-index' parameter by the value of `pageAddonCountIncrement`
         */
        loadNextPage: function() {
            var offset = this.getParameters()['start-index'] + pageAddonCountIncrement,
                parameters = _.extend({},
                    this.getParameters(),
                    { 'start-index': offset },
                    this.getQuery() ? { q: this.getQuery() } : {}
                );

            this._setSearchParams(this.getFilter(), parameters, {
                update: true
            });
        },

        /**
         * Calculates the attributes of the search model to change.
         *
         * Rules:
         *  - If a text query is to be set, filter is always 'search'.
         *  - If a filter is to be set, the text query is removed. This eventuates when a user first performs or loads
         *    a text query and then changes the 'filter' drop down to something other than 'Search results'.
         *  - If the filter is 'search', but there's no text query we set the filter to the default of 'featured'.
         *  - If a text query is present we remove the parameters (prevents search?q=query&category=category)
         *  - When a search query is present the pagination parameters are reset to default (first page)
         *
         * @param toSet {Object} An object of models which are being changed.
         * @returns {Object} The values to actually change on the model.
         * @private
         */
        _getAttributesToChange: function(toSet) {
            var toChange = this.changedAttributes(toSet);

            if (toChange.query) {
                toSet.filter = "search";
            } else if (toSet.filter && toSet.filter !== "search") {
                toSet.query = "";
            }

            if (toSet.filter === "search") {
                toSet.parameters = _.pick(toSet.parameters, 'start-index');

                if (toSet.query === "") {
                    toSet.filter = "featured";
                }
            }

            return toSet;
        },

        /**
         * Converts an array of objects with value and key parameters into an object.
         *
         * @returns {Object} An object with key value pairs reflecting the query search
         * parameters.
         */
        getParametersAsObject: function(parameters) {
            return _.object(_.pluck(parameters, 'name'), _.pluck(parameters, 'value'));
        }
    });
});