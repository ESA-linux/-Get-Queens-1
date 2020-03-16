UPM.define('MarketplacePricingView',
    [
        'jquery',
        'underscore',
        'BaseView',
        'MarketplacePricingTemplate'
    ], function($,
                _,
                BaseView,
                MarketplacePricingTemplate) {

    "use strict";

    /**
     * Displays the pricing summary part of a Marketplace add-on listing.  The model for this view
     * is the MarketplaceAddonModel; pricing details, if any, are in a separate model
     * (MarketplacePricingDetailsModel) which  
     */
    return BaseView.extend({

        template: MarketplacePricingTemplate,

        events: {
            'click a.pricing-tier-display': '_onClickPricingTierAction'
        },
        
        _initEvents: function() {
            var me = this;
            if (this.model.getPricingUrl()) {
                this.loading = true;
                this.model.loadPricingModel()
                    .done(function(pm) {
                        me.loading = false;
                        me.render();
                    })
                    .fail(function() {
                        me.loading = false;
                        me.unavailable = true;
                        me.render();
                    });
            }
        },
        
        _getData: function() {
            return {
                loading: this.loading || false,
                unavailable: this.unavailable || false,
                plugin: this.model.toJSON(),
                pricingDescHtml: this.model.pricingModel && this.model.pricingModel.getPricingDescription(this.model),
                roleBased: this.model.pricingModel && this.model.pricingModel.isRoleBased()
            };
        },
        
        _onClickPricingTierAction: function(e) {
            e.preventDefault();
            this.model.signalAction(this.model.getDefaultPurchaseAction());
        }
    });
});
