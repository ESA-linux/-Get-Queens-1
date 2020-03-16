/**
 * The marketplaceRouter.
 *
 * Responsible for reading state from the marketplace page URL and emitting events depending on that state.
 * The marketplaceRouter is also responsible for navigating to new URLs. The URLs are created by
 * delegating to `marketplaceUrlGenerator` which accepts the application state and returns a URL.
 *
 * @singleton
 */
UPM.define('marketplaceRouter',
    ['brace',
     'underscore',
     'marketplaceUrlGenerator',
     'UpmEnvironment'],
    function(Brace,
             _,
             marketplaceUrlGenerator,
             environment) {

    "use strict";

    var MarketplaceRouter = Brace.Router.extend({

        routes: {
            "": "navigateToFeatured",
            "plugins/:key": "single",
            "settings": "settingsDialog",
            ":filter": "search"
        },

        /**
         * Returns true for browsers which support pushState.
         */
        usePushState: function() {
            return window.history && window.history.pushState;
        },

        /**
         * Redirects from the home URL to the featured filter.
         *
         * When the marketplace page is loaded without a filter specified we default to the
         * "featured" filter. The featured filter is set by using replaceState instead of
         * pushState to prevent orphaned pages in the browser history.
         *
         * @param parameters
         */
        navigateToFeatured: function(parameters) {
            this.navigateTo({
                filter: "featured",
                parameters: parameters
            }, {
                replace: true
            });
        },

        /**
         * Navigates to a URL generated from a parameters object.
         *
         * The parameters object contains:
         *  - filter: i.e. "featured", "top-grossing"
         *  - query: The text search query.
         *  - parameters: An object of addition search parameters.
         *
         * @param parameters
         * @param options
         */
        navigateTo: function(parameters, options) {
            this.navigate(marketplaceUrlGenerator.getMarketplaceUrl(parameters), _.defaults(options || {}, {
                replace: false,
                trigger: true
            }));
        }
    });

    return new MarketplaceRouter();
});
