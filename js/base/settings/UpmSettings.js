UPM.define('UpmSettings',
    [
        'jquery',
        'underscore',
        'brace',
        'UpmDialog',
        'UpmEnvironment',
        'SettingsDialog',
        'SettingsErrorDialogTemplate'
    ],
    function($,
             _,
             Brace,
             UpmDialog,
             UpmEnvironment,
             SettingsDialog,
             SettingsErrorDialogTemplate) {

    // Non-Almond dependencies:
    // UPM.trace
    
    var eventListener = new Brace.Evented();

    /**
     * UI and Ajax logic to manage UPM settings.
     */
    var UpmSettings = {
        openDefaultSettingsDialog: function() {
            var isGlobal = !!UpmEnvironment.getResourceUrl('upm-settings');
            loadAndShowSettings(isGlobal);
        },

        openGlobalSettingsDialog: function() {
            loadAndShowSettings(true);
        },

        openUserSettingsDialog: function() {
            loadAndShowSettings(false);
        }
    };

    function loadAndShowSettings(isGlobal) {
        $.ajax({
            url: getSettingsResourceUrl(isGlobal),
            dataType: 'json',
            cache: false,
            contentType: UpmEnvironment.getContentType()
        }).done(function(response) {
            var oldSettings = getSettingsFromResponse(response, isGlobal),
                model = new Brace.Model({ isGlobal: isGlobal, settings: _.map(oldSettings, _.clone) });

            new SettingsDialog({ model: model })
                .getResult().done(function() {
                    updateSettings(model.get('settings'), oldSettings, isGlobal);
                });
        }).fail(function(request) {
            showSettingsErrorDialog();
        });
    }

    function showSettingsErrorDialog() {
        new UpmDialog({ template: SettingsErrorDialogTemplate });
    }

    function getSettingsResourceUrl(isGlobal) {
        return UpmEnvironment.getResourceUrl(isGlobal ? 'upm-settings' : 'user-settings');
    }

    function getSettingsFromResponse(response, isGlobal) {
        // This and the subsequent function are necessary because UpmSettingsRepresentation and UserSettingsRepresentation
        // do not have the same shape.
        if (isGlobal) {
            return response.settings;
        } else {
            return [
                {
                    key: 'emailDisabled',
                    value: response.emailDisabled,
                    defaultCheckedValue: true   // despite the name, this actually means "if the value is true, then the checkbox should be unchecked"
                }
            ];
        }
    }

    function buildUpdateRep(settings, isGlobal) {
        if (isGlobal) {
            return { settings: settings };
        } else {
            return _.object(_.map(settings, function(setting) { return [ setting.key, setting.value ]; }));
        }
    }

    function updateSettings(newSettings, originalSettings, isGlobal) {
        var changed = _.filter(newSettings, function(setting) {
                var old = _.find(originalSettings, function(os) { return (os.key === setting.key); });
                return old && (setting.value !== old.value);
            }),
            mpacConnectionChanged = _.some(changed, function(s) { return (s.key === 'pacDisabled'); }),
            hasChangesRequiringRefresh = _.some(changed, function(s) { return s.requiresRefresh; });

        if (changed.length) {
            $.ajax({
                type: 'PUT',
                url: getSettingsResourceUrl(isGlobal),
                data: JSON.stringify(buildUpdateRep(changed, isGlobal)),
                contentType: UpmEnvironment.getContentType()
            }).done(function() {
                if (mpacConnectionChanged) {
                    window.location.href = UpmEnvironment.getResourceUrl('manage');
                } else if (hasChangesRequiringRefresh) {
                    window.location.href = window.location.pathname;
                }
            }).fail(function(request) {
                showSettingsErrorDialog();
            });
        }
    }

    UpmEnvironment.getReadyState().done(function() {
        if (UpmEnvironment.getResourceUrl('upm-settings')) {
            $('#link-bar-settings').removeClass('hidden');
        }

        if (UpmEnvironment.getResourceUrl('user-settings')) {
            $('#link-bar-user-settings').removeClass('hidden');
        }

        $(document).on('click', '.settings-panel-link, .upm-pac-enable', function() {
            UpmSettings.openGlobalSettingsDialog();
        });

        $(document).on('click', '.user-settings-panel-link', function() {
            UpmSettings.openUserSettingsDialog();
        });
    });

    return UpmSettings;
});
