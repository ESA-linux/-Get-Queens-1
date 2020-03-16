/**
 * This module listens to the MarketplaceRouter and sets the appropriate state in the MarketplaceQueryModel.
 * The Search and Single modules in turn listen to the Single and Searach events emitted from the MarketplaceQueryModel.
 *
 * Subsequent state changes are propagated to the URL via `marketplaceRouter` which in-turn results in
 * route events which set the new state in the `marketplaceQueryModel`. This approach sees a single
 * direction flow of state from the URL down.
 *
 * The only exception to this is `nextPage` requests for search results who's state is not stored in the URL.
 */

UPM.require([
        'backbone',
        'jquery',
        'marketplaceRouter',
        'MarketplacePageView',
        'MarketplaceQueryModel',
        'MarketplaceSearchModule',
        'MarketplaceSingleAddonModule',
        'UpmContextPathMixin',
        'MarketplaceCarouselModule',
        'UpmCommonUi',
        'UpmEnvironment',
        'UpmSafeMode',
        'UpmSettings'
    ],
    function(Backbone,
             $,
             marketplaceRouter,
             MarketplacePageView,
             MarketplaceQueryModel,
             MarketplaceSearchModule,
             MarketplaceSingleAddonModule,
             UpmContextPathMixin,
             carousel,
             UpmCommonUi,
             UpmEnvironment,
             UpmSafeMode,
             UpmSettings) {

        "use strict";

        UpmCommonUi.getReadyState().done(function() {
            
            // UPM-3653 Display a banner if we want to requests add-ons but add-on requests have been disabled.
            if (!UpmEnvironment.getResourceUrl('create-requests') && !UpmEnvironment.getResourceUrl('install-uri')) {
                $('#upm-requests-disabled').removeClass('hidden');
            }

            var marketplaceQueryModel = new MarketplaceQueryModel();

            var isUserFacing = ($('.upm-requests').length !== 0);  // only true when on page where requests are submitted

            new MarketplacePageView({
                el: $("#upm-panel-install"),
                model: marketplaceQueryModel
            });

            var searchModule = new MarketplaceSearchModule(marketplaceQueryModel);
            var singleModule = new MarketplaceSingleAddonModule(marketplaceQueryModel);

            searchModule.on('loaded', function(response) {
                carousel.load();

                if (UpmEnvironment.isUnknownProductVersion() && !UpmEnvironment.isDevelopmentProductVersion()) {
                    $('#upm-install-search-form').addClass('hidden');
                }

                // will only be true if this is the "view requests" page
                if (response.hasRequests) {
                    // ideally the existence of this button would be controlled by what exists in
                    // the plugin representation. however, due to some circular injection dependencies,
                    // this isn't very easy nor efficient. as a result, we'll unhide these buttons
                    // as such because we have requests to display.
                    if (!isUserFacing) {
                        $('a.upm-dismiss-request').closest('div').removeClass('hidden');
                    }
                }

                UPM.trace("marketplace-page-loaded");  // for UI test sync
            });

            singleModule.on('loaded', function() {
                UPM.trace("marketplace-page-loaded");  // for UI test sync
            });
            
            $('#upm-link-bar li:visible').eq(0).addClass('first');

            // reload add-on views whenever the safe mode state changes (since available actions may change)
            UpmSafeMode.onSafeModeChanged(function() {
                marketplaceQueryModel.triggerRefresh();
            });

            // Bind events on the MarketplaceRouter

            marketplaceRouter.on("route:search", function(filter, parameters) {
                marketplaceQueryModel.resetPaginationAndSetSearchParams(filter, parameters);
            });

            marketplaceRouter.on("route:single", function(key) {
                marketplaceQueryModel.setKeyParameter(key);
            });

            marketplaceRouter.on("route:settingsDialog", function(parameters) {
                UpmSettings.openDefaultSettingsDialog();
                marketplaceRouter.navigateToFeatured(parameters);
            });

            Backbone.history.start({
                root: UpmContextPathMixin.getContextPath() + "/plugins/servlet/upm/marketplace",
                pushState: marketplaceRouter.usePushState()
            });
        });
    }
);