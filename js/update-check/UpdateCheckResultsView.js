UPM.define('UpdateCheckResultsView',
    [
        'underscore',
        'brace',
        'BaseView',
        'UpdateCheckAddonModel',
        'UpdateCheckAddonListView',
        'UpdateCheckResultsTemplate',
    ], function(_,
                Brace,
                BaseView,
                UpdateCheckAddonModel,
                UpdateCheckAddonListView,
                resultsTemplate) {

    return BaseView.extend({

        template: resultsTemplate,

        _postRender: function() {
            this._renderAddons(this.model.getCompatible(), '#upm-compatible-plugins');
            this._renderAddons(this.model.getIncompatible(), '#upm-incompatible-plugins');
            this._renderAddons(this.model.getUnknown(), '#upm-unknown-plugins');
            this._renderAddons(this.model.getUpdateRequired(), '#upm-need-update-plugins');
            this._renderAddons(this.model.getUpdateRequiredAfterProductUpdate(), '#upm-need-product-update-plugins');
        },

        _renderAddons: function(addonsJson, selector) {
            var $container = this.$el.find(selector),
                collection = new Brace.Collection(addonsJson, { model: UpdateCheckAddonModel }),
                $view;

            // forward action events from all addons to the results model so UpdateCheckModule will see them
            this.listenTo(collection, 'action', _.bind(function(action, addonModel) {
                this.model.trigger('action', action, addonModel);
            }, this));

            $container.append('<div class="upm-plugin-list expandable"></div>');
            $view = new UpdateCheckAddonListView({ collection: collection, el: $container });
            $view.render();
        }
    });
});
