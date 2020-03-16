UPM.define('MarketplaceMostRequestedAddonView',
    [
        'underscore',
        'brace',
        'MarketplaceAddonView',
        'MarketplaceMostRequestedAddonDetailsView',
        'CollectionItemRenderingStrategy',
        'DismissRequestConfirmDialogTemplate',
        'UpmEnvironment',
        'UpmDialog',
        'UpmStrings',
        'AddonActions'
    ], function(_,
                Brace,
                MarketplaceAddonView,
                MarketplaceMostRequestedAddonDetailView,
                CollectionItemRenderingStrategy,
                dismissRequestConfirmDialogTemplate,
                UpmEnvironment,
                UpmDialog,
                UpmStrings,
                AddonActions) {

    "use strict";

    return MarketplaceAddonView.extend({

        detailViewClass: MarketplaceMostRequestedAddonDetailView,

        renderingStrategy: CollectionItemRenderingStrategy,

        _postRender: function() {
            MarketplaceAddonView.prototype._postRender.apply(this);

            this.listenTo(this.model, 'change:installed', this._updateIfInstalled);
            this.listenTo(this.model, 'change:userInstalled', this._updateIfInstalled);
            this.listenTo(this.model, 'action', this._handleDismissRequestAction);
            this.listenTo(this.model, 'dismissedRequest', this._onDismissedRequest);
        },

        _getData: function() {
            return _.extend(
                MarketplaceAddonView.prototype._getData.apply(this),
                { showRequestCount: true }
            );
        },

        _handleDismissRequestAction: function(action) {
            if (action === AddonActions.DISMISS_REQUEST) {
                this._dismissRequest();
            }
        },

        _dismissRequest: function() {
            var dialog = new UpmDialog({ template: dismissRequestConfirmDialogTemplate }),
                me = this;
            dialog.getResult().done(function() {
                me.model.dismissRequest()
                    .fail(function() {
                        me.model.triggerMessage({
                            type: 'error',
                            message: UpmStrings['upm.messages.request.dismiss.failure']
                        });
                    });
            });
        },

        _onDismissedRequest: function() {
            UpmEnvironment.refreshNotifications();
            this.removeOnNextCollapse();
            this.model.triggerMessage({
                type: 'success',
                message: UpmStrings['upm.messages.request.dismiss.success']
            });
        },

        _updateIfInstalled: function() {
            if (this.model.isInstalled()) {
                if (!this.isExpanded()) {
                    this._toggleExpanded();
                }
                this.removeOnNextCollapse();
            }
        }
    });
});
