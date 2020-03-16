/**
 * Initializes the Single Addon Page.
 */
UPM.define("MarketplaceBaseModule",
    [
        'jquery',
        'underscore',
        'brace',
        'MarketplaceAddonModel',
        'AddonRequestDialog',
        'AddonRequestedDialog',
        'AddonActions',
        'CommonInstallAndLicensingFlows',
        'UpmAjax',
        'UpmEnvironment'
    ],
    function($,
             _,
             Brace,
             MarketplaceAddonModel,
             AddonRequestDialog,
             AddonRequestedDialog,
             AddonActions,
             CommonInstallAndLicensingFlows,
             UpmAjax,
             UpmEnvironment) {

        return Brace.Evented.extend({

            _listenForAddonEvents: function(source) {
                source.on('action', _.bind(this._onAddonAction, this));
                source.on('request:done', _.bind(this._onRequestDone, this));
            },

            _onAddonAction: function(action, addonModel) {
                switch (action) {
                    case AddonActions.MAKE_REQUEST:
                        new AddonRequestDialog({ model: addonModel });
                        break;
                    case AddonActions.REQUEST_UPDATE:
                        CommonInstallAndLicensingFlows.openUpdateRequestDialog(addonModel);
                        break;
                }
            },

            _onRequestDone: function(addonModel, success) {
                var me = this;
                $.ajax({
                    url: UpmEnvironment.getResourceUrl('most-requested'),
                    type: 'get',
                    cache: false,
                    dataType: 'json',
                    data: { 'start-index': 0, 'max-results': 3, 'exclude-user-requests': true }, //only show a max of 3 most requested plugins, always starting at 0
                    success: function(response) {
                        me._showRequestMoreDialog(success, response);
                    },
                    error: function(request) {
                        UpmAjax.signalAjaxError(request);
                    }
                });
            },

            _showRequestMoreDialog: function(success, response) {
                var addons, dialog;

                addons = new Brace.Collection(response.plugins, { model: MarketplaceAddonModel });
                this._listenForAddonEvents(addons);
                dialog = new AddonRequestedDialog({ collection: addons, success: success });
                addons.on('action', function(action) {
                    if (action === AddonActions.MAKE_REQUEST) {
                        dialog.close();
                    }
                });
            }
        });
    }
);
