UPM.define('ManageAddonView',
    [
        'jquery',
        'underscore',
        'AddonActions',
        'AddonView',
        'CollectionItemRenderingStrategy',
        'ManageAddonTemplate',
        'ManageAddonDetailsView',
        'UpmEnvironment',
        'UpmStrings'
    ], function($,
                _,
                AddonActions,
                AddonView,
                CollectionItemRenderingStrategy,
                ManageAddonTemplate,
                ManageAddonDetailsView,
                UpmEnvironment,
                UpmStrings) {

    "use strict";

    /**
     * Subclass of AddonView that provides the default view behavior for add-ons on the Manage page.
     */
    return AddonView.extend({

        template: ManageAddonTemplate,

        detailViewClass: ManageAddonDetailsView,

        renderingStrategy: CollectionItemRenderingStrategy,

        _initEvents: function() {
            AddonView.prototype._initEvents.apply(this);

            this.$el.on('mouseenter', _.bind(this._updateLozengeStyles, this, true));
            this.$el.on('mouseleave', _.bind(this._updateLozengeStyles, this, false));

            this.listenTo(this.model, 'canRemoveFromCollection', this.removeOnNextCollapse);
            this.listenTo(this.model, 'change', this._rerenderWithoutCollapsing);
            this.listenTo(this.model, 'filtered', this._onFiltered);
            this.listenTo(this.model, 'uninstalled', this._onUninstalled);
        },

        _getData: function() {
            var lozengeType,
                lozengeClass,
                primaryAction = this.model.getPrimaryAction();

            if (primaryAction && primaryAction.name) {
                lozengeType = primaryAction.name;
                lozengeClass = this._getLozengeClass(lozengeType);
            }

            return _.extend(
                AddonView.prototype._getData.apply(this),
                {
                    isUpdatable: this.model.isUpdatable(),
                    lozengeType: lozengeType,
                    lozengeClass: lozengeClass
                }
            );
        },

        // The availability of specific actions is defined in ManageAddonModel.getActionState (which also
        // applies to the detail view), but our _getActionsOrder method picks which one will be first (and
        // therefore, in this view, the only one).
        _getActionsOrder: function() {
            var primaryActionName = this.model.getPrimaryAction() && this.model.getPrimaryAction().name,
                action,
                allActions;

            // primaryActionName is what the back end tells us it thinks the primary button should be
            if (primaryActionName !== undefined) {
                if (primaryActionName === 'incompatible_with_update' ||
                    primaryActionName === 'incompatible_with_paid_update') {
                    return [ AddonActions.UPDATE ];
                } else if (primaryActionName === 'incompatible_without_update' ||
                           primaryActionName === 'incompatible_data_center_without_update' ||
                           primaryActionName === 'incompatible_legacy_data_center_compatible') {
                    return [ AddonActions.REQUEST_UPDATE ];
                } else if ((primaryActionName === 'eval_nearly_expired' || primaryActionName === 'eval_recently_expired') &&
                           UpmEnvironment.getHostLicense() && (UpmEnvironment.getHostLicense().licenseType === 'COMMUNITY')) {
                    return [ AddonActions.BUY ];
                } else if (primaryActionName === '' || primaryActionName === 'updatable_nondeployable') {
                    return [ AddonActions.DOWNLOAD ];
                } else if (primaryActionName === 'license_nearly_expiring' || primaryActionName ==='license_recently_expired') {
                    // can be one of the following action buttons for a different way to renew.
                    return [ AddonActions.CROSSGRADE, AddonActions.RENEW_CONTACT, AddonActions.RENEW ];
                } else {
                    action = AddonActions.fromLegacyKey(primaryActionName);
                    if (action) {
                        return [ action ];
                    }
                }
            }

            allActions = this.model._getActionsOrder();
            for (var i = 0; i < allActions.length; i++) {
                action = allActions[i];
                if (this.model.getActionState(action) === true) {
                    // UPM-3517: special case, we don't want a top-level "Buy now" button for a long-ago-expired add-on;
                    // we can tell it was "long ago" because otherwise there would be a '*_recently_expired' primary action
                    if (!(action === AddonActions.BUY && this.model.getLicenseDetails() &&
                          this.model.getLicenseDetails().error === 'EXPIRED' && !primaryActionName)) {
                        return this._canBePrimaryAction(action) ? [ action ] : [ ];
                    }
                }
            }

            return [ ];
        },

        _getMaxTopLevelActions: function() {
            return 1;
        },

        _canBePrimaryAction: function(action) {
            // This is defined differently than in ManageAddonDetailsView.  In the details, except for a few
            // actions that can never have the primary style, whichever action comes first is primary.  In the
            // summary row, only the following specific actions can be primary.
            switch (action) {
                case AddonActions.BUY:
                case AddonActions.TRY:
                case AddonActions.UPDATE:
                case AddonActions.RENEW:
                case AddonActions.RENEW_CONTACT:
                case AddonActions.UPGRADE:
                case AddonActions.SUBSCRIBE:
                case AddonActions.TRIAL_RESUME:
                case AddonActions.TRIAL_SUBSCRIBE:
                case AddonActions.REQUEST_UPDATE:
                case AddonActions.DOWNLOAD:
                case AddonActions.CROSSGRADE:
                    return true;
                default:
                    return false;
            }
        },

        _getLozengeClass: function(lozengeType) {
            if (lozengeType === 'maintenance_nearly_expiring' ||
                lozengeType === 'license_nearly_expiring' ||
                lozengeType === 'renew-contact' ||
                lozengeType === 'eval_nearly_expired' ||
                lozengeType === 'upgrade_nearly_required' ||
                lozengeType === 'incompatible_data_center_without_update' ||
                lozengeType === 'incompatible_data_center_requested_update' ||
                lozengeType === 'incompatible_data_center_with_update' ||
                lozengeType === 'incompatible_legacy_data_center_compatible') {
                return 'aui-lozenge-current';
            }
            if (lozengeType === 'update-details-binary' ||
                lozengeType === 'updatable' ||
                lozengeType === 'updatable_to_paid' ||
                lozengeType === 'updatable_nondeployable') {
                return 'aui-lozenge-complete';
            }
            return 'aui-lozenge-error';
        },

        _onChangeLicense: function() {
            this._expandDetails();
        },

        _onFiltered: function(visible) {
            this.$el.toggleClass('hidden', !visible);
        },

        _onUninstalled: function() {
            this.removeOnNextCollapse();
            this.model.triggerMessage({
                type: 'info',
                message: UpmStrings['upm.messages.uninstall.success']
            });
        },

        _rerenderWithoutCollapsing: function() {
            var wasExpanded = this.isExpanded();
            this.render();
            if (wasExpanded) {
                this._expandDetails();
            }
        },

        _updateLozengeStyles: function(hovering) {
            if (!this.isExpanded()) {
                this.$el.find('.upm-plugin-notice .aui-lozenge').toggleClass('aui-lozenge-subtle', !hovering);
            }
        }
    });
});
