UPM.define('AddonModuleView',
    [
        'jquery',
        'BaseView',
        'CollectionItemRenderingStrategy',
        'AddonModuleTemplate',
        'ManageAddonFlows'
    ], function($,
                BaseView,
                CollectionItemRenderingStrategy,
                AddonModuleTemplate,
                ManageAddonFlows) {

    "use strict";

    /**
     * Manages the UI elements for a single add-on module.
     */
    return BaseView.extend({

        template: AddonModuleTemplate,

        renderingStrategy: CollectionItemRenderingStrategy,

        events: {
            'click .upm-module-disable': '_onDisable',
            'click .upm-module-enable': '_onEnable'
        },

        _initEvents: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        _getData: function() {
            return {
                module: this.model.toJSON()
            };
        },

        _onDisable: function(e) {
            e.preventDefault();
            ManageAddonFlows.disableAddonModule(this.model);
        },

        _onEnable: function(e) {
            e.preventDefault();
            ManageAddonFlows.enableAddonModule(this.model);
        }
    });
});
