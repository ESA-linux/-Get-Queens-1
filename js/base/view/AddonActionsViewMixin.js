/**
 * Mixin for views that can have buttons corresponding to AddonActions.  The model should be
 * derived from AddonModel.
 */
UPM.define('AddonActionsViewMixin',
    [
        'jquery',
        'underscore',
        'AddonActionButtonTemplate',
        'UpmBrowserDetection'
    ],
    function($,
             _,
             addonActionButtonTemplate,
             UpmBrowserDetection) {

    return {

        _renderActionButtons: function($container) {
            var allowedActions,
                $buttons,
                plugin = this.model.toJSON(),
                me = this;

            function buttonHandler(a) {
                return function(e) {
                    if (me._checkButtonDisabledState(e)) {
                        e.preventDefault();
                        me.model.signalAction(a);
                    }
                };
            }

            if ($container.length) {
                allowedActions = _.compact(_.map(this._getActionsOrder(), function(action) {
                    var state = me.model.getActionState(action);
                    if (_.isObject(state)) {
                        return (state.enabled || (state.disabledReason && me._shouldShowDisabledActionsWithReasons())) ?
                            { action: action, disabledReason: !state.enabled && state.disabledReason } : null;
                    } else {
                        return state ? { action: action } : null;
                    }
                }));
                var havePrimaryAction = false;
                $buttons = _.map(allowedActions, function(a, index) {
                    var buttonParams, $button, isButton, isPrimary;
                    isButton = !me._shouldShowActionAsLink(a.action, index);
                    // once there's been a primary button, there can't be another
                    isPrimary = !havePrimaryAction && isButton && me._canBePrimaryAction(a.action, index);
                    havePrimaryAction = havePrimaryAction || isPrimary;
                    buttonParams = {
                        action: a.action,
                        plugin: plugin,
                        disabledReason: a.disabledReason,
                        isButton: isButton,
                        isPrimary: isPrimary
                    };
                    $button = $(addonActionButtonTemplate(buttonParams));
                    $button.find('a').on('click', buttonHandler(a.action));
                    return $button;
                });
                $container.prepend($buttons);
                // Note, we use prepend rather than append here because there may already be a request count
                // lozenge at the end of that container which should be after the buttons.  We could probably
                // avoid such issues by simplifying our markup a bit.

                if (UpmBrowserDetection.isIE) {
                    // Add a "first" class to first toolbar item for browsers that don't support the :first-of-type pseudo-class
                    $container.find('.upm-plugin-actions .aui-button:first').addClass('first');
                }
            }
        },

        // The view class must define the following methods:
        //
        // /**
        //  * Returns true if the specified action can be a primary button.
        //  * @param {AddonActions} action
        //  * @param {Number} index
        //  * @return {Boolean}
        //  */
        // _canBePrimaryAction: function(action, index) { },
        //
        // /**
        //  * Returns the desired ordering of action buttons, as an array of AddonActions (irrespective of
        //  * whether the actions are enabled).
        //  * @return {Array}
        //  */
        // _getActionsOrder: function() { },
        //
        // /**
        //  * Returns true if the action should be shown as a link rather than a button.
        //  * @param {AddonActions} action
        //  * @param {Number} index
        //  * @return {Boolean}
        //  */
        // _shouldShowActionAsLink: function(action, index) { },
        //
        // /**
        //  * Returns true if we should show disabled buttons for unavailable actions for which
        //  * the model provides a "disabledReason" property, rather than just omitting the buttons.
        //  * @return {Boolean}
        //  */
        // _shouldShowDisabledActionsWithReasons: function() { },

        /**
         * @method _checkButtonDisabledState
         * @private
         */
        _checkButtonDisabledState: function(e) {
            var el = $(e.target);
            if (el.hasClass('disabled') || el.prop('disabled') || el.attr('aria-disabled') === "true") {
                e.stopImmediatePropagation();
                return false;
            }
            return true;
        }
    };
});
