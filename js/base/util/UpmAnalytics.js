UPM.define('UpmAnalytics',
    [
        'jquery',
        'UpmEnvironment'
    ],
    function($,
             UpmEnvironment) {

    var UpmAnalytics = {
        logAddonEvent: function(type, addonKey, logData) {
            if (UpmEnvironment.getResourceUrl('analytics')) {
                logData = logData || {};
                logData.type = type;
                if (addonKey) {
                    logData.pk = addonKey;
                }

                // Don't bother handling any success or error responses since we wouldn't display them in the UI.
                return $.ajax({
                    type: 'POST',
                    url: UpmEnvironment.getResourceUrl('analytics'),
                    dataType: 'json',
                    contentType: UpmEnvironment.getContentType(),
                    data: JSON.stringify({ data: logData })
                });
            }
        },

        logEvent: function(type, logData) {
            return UpmAnalytics.logAddonEvent(type, null, logData);
        }
    };

    return UpmAnalytics;
});
