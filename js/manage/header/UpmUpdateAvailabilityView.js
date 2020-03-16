UPM.define('UpmUpdateAvailabilityView',
    [
        'jquery',
        'underscore',
        'BaseView',
        'CollectionItemRenderingStrategy',
        'ManageAddonsPageModel',
        'SkipUpmUpdateConfirmDialogTemplate',
        'UpmCommonUi',
        'UpmDialog',
        'UpmEnvironment',
        'UpmMessageFactory',
        'UpmUpdateAvailableTemplate'
    ],
    function($,
             _,
             BaseView,
             CollectionItemRenderingStrategy,
             ManageAddonsPageModel,
             skipUpmUpdateConfirmDialogTemplate,
             UpmCommonUi,
             UpmDialog,
             UpmEnvironment,
             UpmMessageFactory,
             upmUpdateAvailableTemplate) {

    "use strict";

    var defaultDaysToDismiss = 3,
        dismissWarningCookieName = 'upm.selfUpdate.dismiss',
        skipWarningForThisVersionCookieName = 'upm.selfUpdate.skip',
        fadeoutDelay = 500;

    /**
     * Renders the "newer version of UPM is available" message when appropriate.  The model for this view
     * is the ManageAddonsPageModel.  The view takes care of rendering itself into the appropriate UI area
     * only when necessary based on the model state and environment.
     */
    return BaseView.extend({

        events: {
            'click #upm-banner-update': '_onUpdateNowClick',
            'click #upm-release-notes': '_onReleaseNotesClick',
            'click #upm-remind-later': '_onRemindLaterClick',
            'click #upm-skip-version': '_onSkipVersionClick'
        },

        renderingStrategy: CollectionItemRenderingStrategy,

        _fadeOutAndRemoveMessage: function() {
            var $el = this.$el;
            $el.fadeOut(fadeoutDelay, _.bind($el.remove, $el));
        },

        _getHtml: function() {
            return UpmMessageFactory.newInfoMessage('',
                upmUpdateAvailableTemplate({ }),
                {
                    closeable: false
                }).render().$el;
        },

        _initEvents: function() {
            this.listenTo(this.model, 'change:upmUpdateVersion', this._updateState);
            this.listenTo(UpmEnvironment.getHostStatusModel(), 'change:safeMode', this._updateState);
        },

        /**
         * Open the details for the available UPM update.
         */
        _onReleaseNotesClick: function(e) {
            e.preventDefault();
            ManageAddonsPageModel.focusAddonByKey(UpmEnvironment.getUpmPluginKey());
        },

        /**
         * Hide the self-update message and set a cookie so it won't be shown for several days.
         */
        _onRemindLaterClick: function(e) {
            e.preventDefault();
            $.cookie(dismissWarningCookieName, 'true', { expires: defaultDaysToDismiss });
            this._fadeOutAndRemoveMessage();
        },

        /**
         * Hide the self-update message and set a cookie so it won't be shown until the next UPM version.
         */
        _onSkipVersionClick: function(e) {
            var me = this;
            e.preventDefault();
            new UpmDialog({ template: skipUpmUpdateConfirmDialogTemplate, data: { version: this.model.getUpmUpdateVersion() }})
                .getResult().done(function() {
                    $.cookie(skipWarningForThisVersionCookieName, me.model.getUpmUpdateVersion());
                    me._fadeOutAndRemoveMessage();
                });
        },

        _onUpdateNowClick: function(e) {
            e.preventDefault();
            this.model.trigger('updateUpm');
        },

        _postInitialize: function() {
            this._updateState();
        },

        _updateState: function() {
            var shouldShow = this.model.getUpmUpdateVersion() &&
                    !UpmEnvironment.isSafeMode() &&
                    !$.cookie(dismissWarningCookieName) &&
                    $.cookie(skipWarningForThisVersionCookieName) !== this.model.getUpmUpdateVersion();

            this.render();
            if (shouldShow) {
                UpmCommonUi.showMessageElement(this.$el);
            } else {
                this.$el.remove();
            }
        }
    });
});
