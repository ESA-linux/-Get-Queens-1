UPM.define('UpdateCheckAddonView',
    [
        'jquery',
        'AddonView',
        'UpdateCheckAddonDetailsView',
        'UpdateCheckAddonTemplate',
        'AddonActions',
        'CollectionItemRenderingStrategy'
    ], function($,
                AddonView,
                UpdateCheckAddonDetailsView,
                addonTemplate,
                addonActions,
                CollectionItemRenderingStrategy) {

    "use strict";

    /**
     * Subclass of AddonView that provides the desired behavior for the Update Check page.
     */
    return AddonView.extend({

        template: addonTemplate,

        detailViewClass: UpdateCheckAddonDetailsView,

        renderingStrategy: CollectionItemRenderingStrategy,

        _getData: function() {
            return {
                plugin: this.model.toJSON(),
            };
        },

        _getActionsOrder: function() {
            return [
                addonActions.DISABLE,
                addonActions.ENABLE
            ];
        },

        _canBePrimaryAction: function(action) {
            return false;
        }
    });
});
