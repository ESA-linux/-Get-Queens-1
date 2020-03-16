UPM.define('AddonRequestedDialog',
    [
        'UpmDialog',
        'MostRequestedAddonDialogTemplate',
        'MarketplaceAddonModel',
        'MarketplaceAbbreviatedAddonView'
    ],
    function(UpmDialog,
             mostRequestedAddonDialogTemplate,
             MarketplaceAddonModel,
             MarketplaceAbbreviatedAddonView) {

    // Dialog that is displayed after the user has submitted an add-on request, showing the result
    // of the request and possibly a list of more add-ons the user might want to request.
    // Required options:
    // - collection:  the list of add-on models
    // - success:  true if the last request was successful

    return UpmDialog.extend({
        template: mostRequestedAddonDialogTemplate,

        _getData: function() {
            return {
                success: this.options.success,
                hasAddons: !this.collection.isEmpty()
            };
        },

        _postRender: function() {
            var me = this,
                $list = this.$el.find('.upm-plugin-list');
            this.collection.each(function(model) {
                var addonView = new MarketplaceAbbreviatedAddonView({ model: model }).render();
                $list.append(addonView.$el);
            });
            this.$el.find('.upm-plugin-name, .category-link').on('click', function() {
                me.close();
            });
        }
    });
});
