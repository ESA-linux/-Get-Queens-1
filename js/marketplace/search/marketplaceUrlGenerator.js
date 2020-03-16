/**
 * This object generates URIs to route to depending on the state of the MarketplaceQueryModel.
 */
UPM.define('marketplaceUrlGenerator', ['underscore', 'UpmStrings'], function(_, UpmStrings) {

    "use strict";

    var excludedParameters = [
        "start-index",
        "max-results",
        "offset"
    ];

    return {

        /**
         * Validates a request parameter.
         *
         * Returns false if the key has no value or if the value is 'All Categories' which is
         * a special case for categories which doesn't have an empty value.
         *
         * @param parameter The parameter to check.
         * @returns {boolean}
         * @private
         */
        _validateParameter: function(parameter) {
            var allCategoriesValue = UpmStrings["upm.install.all.categories.dropdown"];
            if (parameter && parameter.key && (parameter.value || parameter.value === 0)) {
                if (decodeURIComponent(parameter.value) !== allCategoriesValue && _.indexOf(excludedParameters, decodeURIComponent(parameter.key)) === -1) {
                    return true;
                }
            }

            return false;
        },

        _filterInvalidParameters: function(parameters) {
            var validParameters = {};
            _.each(parameters, function(value, key) {
                var param = {
                    key: key,
                    value: value
                };
                if (this._validateParameter(param)) {
                    validParameters[key] = value;
                }
            }, this);

            return validParameters;
        },

        /**
         * Calculates and returns a marketplace URL given a filter and search parameters.
         */
        getMarketplaceUrl: function(options) {

            var url,
                filter = options.filter,
                query = options.query,
                queryParameters = options.parameters;

            if (!filter || !query && filter === "search") {
                filter = "featured";
            }

            if (query && filter !== "search") {
                filter = "search";
            }

            url = filter;

            var parameters = [];

            if (query) {
                parameters.push("q=" + encodeURIComponent(query));
                queryParameters = {};
            }

            if (queryParameters) {
                parameters.push.apply(parameters, _.map(this._filterInvalidParameters(queryParameters), function(value, key) {
                    return encodeURIComponent(key) + "=" + encodeURIComponent(value);
                }));
            }

            if (parameters.length) {
                url += "?" + parameters.join("&")
            }

            return url;
        }
    }

});