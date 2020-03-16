UPM.define('UpdateAllResultDialog',
    [
        'jquery',
        'underscore',
        'AddonActions',
        'CommonInstallAndLicensingFlows',
        'ManageAddonsPageModel',
        'UpmDialog',
        'UpdateAllResultDialogTemplate'
    ],
    function($,
             _,
             AddonActions,
             CommonInstallAndLicensingFlows,
             ManageAddonsPageModel,
             UpmDialog,
             UpdateAllResultDialogTemplate) {

    // Dialog for showing Update All results and optionally executing follow-up actions.
    // The dialog does not use a Backbone model; set the "successes" and "failures" properties
    // from the task status representation objet.

    return UpmDialog.extend({
        template: UpdateAllResultDialogTemplate,

        events: {
            'click .extra-action .aui-button': '_onAddonActionClick'
        },

        constructor: function() {
            UpmDialog.prototype.constructor.apply(this, arguments);
        },

        _getData: function() {
            var successes = this.options.successes || [],
                failures = this.options.failures || [],
                actionItems = [],
                requiresRestartItems = [],
                licensingActions = [ AddonActions.BUY, AddonActions.TRY, AddonActions.UPGRADE, AddonActions.RENEW ];

            _.each(successes, function(item) {
                var actions = [];
                if (item.links) {
                    actions = _.filter(licensingActions, function(a) {
                            return !!item.links[a.legacyKey];
                        });
                    if (!actions.length && item.links['post-update']) {
                        actions.push(AddonActions.GET_STARTED);
                    }
                    if (item.links['change-requiring-restart']) {
                        requiresRestartItems.push({ key: item.key, name: item.name, version: item.version });
                    }
                }
                if (actions.length) {
                    actionItems.push({ key: item.key, name: item.name, version: item.version, actions: actions });
                }
            });

            this.actionItems = actionItems;

            return {
                successCount: successes.length,
                totalCount: successes.length + failures.length,
                actionItems: actionItems,
                requiresRestartItems: requiresRestartItems
            };
        },

        _onAddonActionClick: function(e) {
            var $button = $(e.target),
                $row = $button.closest('.extra-action'),
                key = $row.attr('data-key'),
                action = AddonActions[$button.attr('data-action')],
                addonModel = ManageAddonsPageModel.getAddonModelByKey(key);

            e.preventDefault();
            $row.find('.checkmark').addClass('checked');
            if (action && addonModel) {
                switch (action) {
                    case AddonActions.GET_STARTED:
                        addonModel.logAnalytics('postupdate', { dialog: true });
                        window.open(addonModel.getLinks()['post-update']);
                        break;

                    default:
                        CommonInstallAndLicensingFlows.submitMarketplaceActionToMAC(addonModel,
                            action, null, true);
                        break;
                }
            }
        }
    });
});
