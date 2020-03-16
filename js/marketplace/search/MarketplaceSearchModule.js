/**
 * This module initialises the Search portion of the Marketplace page.
 *
 * It switches between the Most Requested and Search Results collection views depending on the filter selected.
 */
UPM.define('MarketplaceSearchModule',
    [
        'jquery',
        'underscore',
        'MarketplaceBaseModule',
        'MarketplaceAddonCollection',
        'MarketplaceMostRequestedAddonCollection',
        'MarketplaceSearchResultsView',
        'MarketplaceMostRequestedResultsView',
        'MarketplaceFilterFormView',
        'MarketplaceBrowserEventHandlingView',
        'UpmEnvironment'
    ],
    function($,
             _,
             MarketplaceBaseModule,
             MarketplaceAddonCollection,
             MarketplaceMostRequestedAddonCollection,
             MarketplaceSearchResultsView,
             MarketplaceMostRequestedResultsView,
             MarketplaceFilterFormView,
             MarketplaceBrowserEventHandlingView,
             environment) {

        "use strict";

        return MarketplaceBaseModule.extend({

            initialize: function(marketplaceQueryModel) {

                var me = this;

                var marketplaceAddonCollection = new MarketplaceAddonCollection();
                var marketplaceMostRequestedAddonCollection = new MarketplaceMostRequestedAddonCollection();

                new MarketplaceFilterFormView({
                    model: marketplaceQueryModel,
                    el: $("#upm-install-search-form")
                });

                var pluginListContainer = $(".find-addons .upm-find-addons-container");
                new MarketplaceSearchResultsView({
                    collection: marketplaceAddonCollection,
                    el: pluginListContainer
                });

                new MarketplaceMostRequestedResultsView({
                    collection: marketplaceMostRequestedAddonCollection,
                    el: pluginListContainer
                });

                new MarketplaceBrowserEventHandlingView({
                    model: marketplaceQueryModel,
                    el: pluginListContainer
                });

                var $panel = $("#upm-panel-install");

                marketplaceQueryModel.onSearch(_onSearch);
                marketplaceQueryModel.onRefresh(_onRefresh);

                this._listenForAddonEvents(marketplaceAddonCollection);
                this._listenForAddonEvents(marketplaceMostRequestedAddonCollection);
                
                /**
                 * Sends a trace to Webdriver (if applicable) to signify that the search has completed.
                 */
                function reportMarketplaceSearchComplete() {
                    UPM.trace("marketplace-search-complete");
                }

                /**
                 * Reloads the Search Results if the Search Query has changed.
                 *
                 * If a property on the `marketplaceQueryModel` has changed or
                 * if the next page of results is required, the search is loaded
                 * using the state stored in the `marketplaceQueryModel`.
                 *
                 * @param modelChanged Whether any property on the search query model has changed as a result of the
                 * last set operation.
                 * @param isNextPage Whether the request is for the next page of results.
                 * @private
                 */
                function _onSearch(modelChanged, isNextPage) {
                    if (modelChanged || isNextPage) {
                        _doRefresh(isNextPage);
                    } else {
                        // Defer the reporting to ensure that the UI has updated via MarketplacePageView.
                        _.defer(reportMarketplaceSearchComplete);
                    }
                }

                function _onRefresh() {
                    _doRefresh(false);
                }

                function _doRefresh(isNextPage) {
                    var filter = marketplaceQueryModel.getFilter(),
                        request;

                    $panel.removeClass("loaded");

                    if (filter === "most-requested" && environment.getResourceUrl('most-requested')) {
                        request = marketplaceMostRequestedAddonCollection.search(marketplaceQueryModel, isNextPage);
                    } else {
                        request = marketplaceAddonCollection.search(marketplaceQueryModel, isNextPage);
                    }

                    request.done(function(response) {
                        $panel.addClass("loaded");
                        me.trigger('loaded', response);
                    });

                    request.always(reportMarketplaceSearchComplete);
                }
            }
        });
    }
);
