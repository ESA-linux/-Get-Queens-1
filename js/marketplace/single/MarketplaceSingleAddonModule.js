/**
 * Initializes the Single Addon Page.
 */
UPM.define("MarketplaceSingleAddonModule",
    [
        "jquery",
        "backbone",
        "MarketplaceBaseModule",
        "MarketplaceAddonModel",
        "MarketplaceSingleAddonView",
        "UpmCommonUi",
        "UpmLoadingView"
    ],
    function($,
             Backbone,
             MarketplaceBaseModule,
             MarketplaceAddonModel,
             MarketplaceSingleAddonView,
             UpmCommonUi,
             UpmLoadingView) {

        return MarketplaceBaseModule.extend({

            initialize: function(marketplaceQueryModel) {

                var me = this;
                var addonModel = new MarketplaceAddonModel();
                var addonView;
                var $container = $('.single-addon');
                var $listContainer = $container.find('.upm-find-addons-container .upm-plugin-list');

                marketplaceQueryModel.onSingle(_onSingle);
                marketplaceQueryModel.onRefresh(_onRefresh);

                this._listenForAddonEvents(addonModel);
                
                new UpmLoadingView({ model: addonModel, el: UpmCommonUi.getPageContainer() });

                /**
                 * If the key property of `marketplaceQueryModel` has changed
                 * the Single Addon Model is reloaded from the server.
                 *
                 * @param keyPropertyChanged Whether the key property has changed as a result of the previous set
                 * operation.
                 * @private
                 */
                function _onSingle(keyPropertyChanged) {
                    if (keyPropertyChanged) {
                        _onRefresh();
                    }
                }

                function _onRefresh() {
                    addonModel.setKey(marketplaceQueryModel.getKey(), {
                        silent: true
                    });
                    $listContainer.empty();
                    $container.removeClass('hidden');
                    addonModel.fetch().done(function() {
                        addonView = new MarketplaceSingleAddonView({ model: addonModel });
                        $listContainer.append(addonView.render().$el);
                        me.trigger('loaded');
                    });
                }
            }
        });
    }
);
