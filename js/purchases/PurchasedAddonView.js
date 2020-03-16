UPM.define('PurchasedAddonView',
    [
        'underscore',
        'MarketplaceAddonView',
        'PurchasedAddonTemplate',
        'PurchasedAddonDetailsView',
        'CollectionItemRenderingStrategy',
        'UpmLicenseInfo'
    ], function(_,
                MarketplaceAddonView,
                PurchasedAddonTemplate,
                PurchasedAddonDetailsView,
                CollectionItemRenderingStrategy,
                upmLicenseInfo) {

    return MarketplaceAddonView.extend({

        // UPM-4691:  even though we have a specialized template for add-ons in the Purchased view,
        // we're not actually using it - currently we just use the same layout as for Find New.
        // template: PurchasedAddonTemplate,

        detailViewClass: PurchasedAddonDetailsView,

        renderingStrategy: CollectionItemRenderingStrategy,

        // UPM-4691:  see above
        // _getData: function() {
        //  var plugin = this.model.toJSON(),
        //      license = plugin.licenseDetails,
        //      data = {
        //          licenseDescriptionHtml: license && upmLicenseInfo.getLicenseDescription(license),
        //          licenseCreationDate: license && license.creationDateString,
        //          licenseError: license && license.error && upmLicenseInfo.getLicenseStatusDescription(plugin, license)
        //      };
        //  return _.extend(data, MarketplaceAddonView.prototype._getData.apply(this));
        // },

        _initEvents: function() {
            MarketplaceAddonView.prototype._initEvents.apply(this);
            this.listenTo(this.model, 'newly-licensed', _.bind(function() {
                    this.$el.addClass('new-license');
                }, this));
        }
    });
});