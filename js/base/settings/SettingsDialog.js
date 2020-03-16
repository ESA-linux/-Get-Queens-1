UPM.define('SettingsDialog',
    [
        'underscore',
        'UpmDialog',
        'SettingsDialogTemplate'
    ],
    function(_,
             UpmDialog,
             SettingsDialogTemplate) {

    return UpmDialog.extend({
        template: SettingsDialogTemplate,

        _onConfirm: function() {
            var me = this,
                newSettings = _.map(this.model.get('settings'), function(setting) {
                    return _.extend({}, setting, {
                        value: (me.$el.find('#upm-checkbox-' + setting.key).is(':checked') !== setting.defaultCheckedValue)
                        // Note that defaultCheckedValue does not mean what it sounds like; if it's true, it means that
                        // the property's value is the opposite of the checkbox (e.g. if the "Connect to the Atlassian
                        // Marketplace" checkbox is checked, then the pacDisabled setting is false).
                    });
                });
            this.model.set('settings', newSettings);
            UpmDialog.prototype._onConfirm.apply(this);
        }
    });
});
