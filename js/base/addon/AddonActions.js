UPM.define('AddonActions',
    [
        'underscore'
    ],
    function(_) {

    "use strict";

    var allActionKeys = [
        'BUY',
        'CHECK_LICENSE',
        'CONFIGURE',
        'CROSSGRADE',
        'DISABLE',
        'DISMISS_REQUEST',
        'DOWNLOAD',
        'ENABLE',
        'GET_STARTED',
        'INSTALL',
        'MAKE_REQUEST',
        'MANAGE',
        'RENEW',
        'RENEW_CONTACT',
        'REQUEST_UPDATE',
        'SUBSCRIBE',
        'TRIAL_RESUME',
        'TRIAL_SUBSCRIBE',
        'TRIAL_UNSUBSCRIBE',
        'TRY',
        'UNINSTALL',
        'UNSUBSCRIBE',
        'UPDATE',
        'UPGRADE'
    ];

    // can eliminate this once we're no longer calling into upm.js
    var legacyKeys = {
        BUY: 'new',
        DISMISS_REQUEST: 'dismiss-request',
        MAKE_REQUEST: 'request',
        RENEW: 'renew',
        RENEW_CONTACT: 'renew-contact',
        SUBSCRIBE: 'subscribe',
        TRIAL_RESUME: 'trial-resume',
        TRIAL_SUBSCRIBE: 'trial-subscribe',
        TRIAL_UNSUBSCRIBE: 'trial-unsubscribe',
        TRY: 'try',
        UNSUBSCRIBE: 'unsubscribe',
        UPGRADE: 'upgrade'
    };

    function makeAction(key) {
        return {
            key: key,
            legacyKey: legacyKeys[key]
        };
    }

    /**
     * Defines all the actions that can be applied to add-ons on any UPM page.  Refer to
     * these as AddonActions.BUY, AddonActions.TRY, etc. - always use the original objects,
     * not constructed or cloned objects, so Javascript's === operator will work.  The "key"
     * property of each action object is always identical to its key within AddonActions,
     * i.e. AddonActions.BUY.key == 'BUY'.
     */
    var AddonActions = _.extend(
        {
            all: function() {
                return _.map(allActionKeys, function(key) { return AddonActions[key]; });
            },
            fromLegacyKey: function(legacyKey) {
                return _.findWhere(AddonActions.all(), { legacyKey: legacyKey });
            }
        },
        _.object(
            allActionKeys,
            _.map(allActionKeys, makeAction)
        )
    );

    return AddonActions;
});
