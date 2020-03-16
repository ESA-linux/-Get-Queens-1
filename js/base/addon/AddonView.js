UPM.define('AddonView',
    [
        'jquery',
        'underscore',
        'brace',
        'AddonActions',
        'AddonActionsViewMixin',
        'AddonActionButtonTemplate',
        'BaseView',
        'ExpandableViewMixin',
        'UpmEnvironment',
        'UpmFormats',
        'UpmStrings'
    ], function($,
                _,
                Brace,
                AddonActions,
                AddonActionsViewMixin,
                actionButtonTemplate,
                BaseView,
                ExpandableViewMixin,
                UpmEnvironment,
                UpmFormats,
                UpmStrings) {

    "use strict";

    /**
     * Base view class for an add-on on any of the UPM pages.  The model should be one of the
     * subclasses of AddonModel.  The add-on view may be in an unexpanded or expanded state; when
     * expanded for the first time, it asks the model to load the details and, if successful,
     * creates a subview for the details.
     */
    return BaseView.extend({

        mixins: [ AddonActionsViewMixin, ExpandableViewMixin ],

        _initEvents: function() {
            this.listenTo(this.model, 'change', this._rerenderOnChange);
            this.listenTo(this.model, 'ajaxError', this._onAjaxError);
            this.listenTo(this.model, 'expandAndThen', this._onExpandAndThen);
            this.listenTo(this.model, 'focus', this._onFocus);
            if (this.model.collection) {
                this.listenTo(this.model.collection, 'remove', this._onCollectionItemRemoved);
            }
            this.listenTo(this, 'expanded', this._onExpanded);
            this.listenTo(this, 'collapsed', this._onCollapsed);
        },

        _rerenderOnChange: function() {
            var wasExpanded = this.isExpanded();
            this.render();
            if (wasExpanded) {
                this._expandDetails();
            }
        },

        /**
         * Override this method to return an array of action constants (from AddonActions) for the kinds
         * of actions that may (depending on the model properties) be performable in this view, in the
         * desired order.
         * @method _getActionsOrder
         * @protected
         * @return {Array}
         */
        _getActionsOrder: function() {
            return [];
        },

        /**
         * Override this method to specify the maximum number of actions that can be displayed in the
         * main view.
         * @method _getMaxTopLevelActions
         * @return {Number}
         */
        _getMaxTopLevelActions: function() {
            return null;
        },

        /**
         * See AddonActionsViewMixin.
         * Override this method to specify whether particular actions can use the primary button style.
         * @method _canBePrimaryAction
         * @param {AddonActions} action
         * @return {Boolean}
         */
        _canBePrimaryAction: function(action) {
            return true;
        },

        /**
         * See AddonActionsViewMixin.
         * @method _shouldShowActionAsLink
         * @param {AddonActions} action
         * @param {Number} index
         * @return {Boolean}
         */
        _shouldShowActionAsLink: function(action, index) {
            return false;
        },
        
        /**
         * See AddonActionsViewMixin.
         * @method _shouldShowDisabledActionsWithReasons
         * @return {Boolean}
         */
        _shouldShowDisabledActionsWithReasons: function() {
            return false;
        },

        _getData: function() {
            return {
                plugin: this.model.toJSON()
            };
        },

        _postRender: function() {
            this.$el.find('div.upm-plugin-row').on('click', _.bind(this._onRowClick, this));

            this.$el.find('.upm-plugin-vendor a, .upm-plugin-support a').click(function(e) {
                e.stopPropagation();
            });

            this._renderActionButtons(this.$el.find('.upm-plugin-actions'));
        },

        _onAjaxError: function(errorInfo) {
            var me = this;

            var msg, subcode, plugin,
                pluginName = this.model.getName(),
                formatErrorMessage = function(message, errorInfo, pluginName) {
                    return UpmFormats.format(message, UpmFormats.htmlEncode(pluginName ||
                                                          errorInfo.pluginName ||
                                                          (errorInfo.status && errorInfo.status.source) ||
                                                          UpmStrings['upm.plugin.unknown'],
                                               UpmFormats.htmlEncode(errorInfo.moduleName || UpmStrings['upm.plugin.module.unknown'])));
                };

            if (errorInfo) {
                if (typeof errorInfo == "string") {
                    try {
                        errorInfo = JSON.parse(errorInfo);
                    } catch (e) {
                        AJS.log('Failed to parse response text: ' + e);
                    }
                }
                msg = errorInfo.errorMessage || errorInfo.message || (errorInfo.status && errorInfo.status.errorMessage);
                subcode = errorInfo.subCode || (errorInfo.status && errorInfo.status.subCode) || (errorInfo.details && errorInfo.details.error.subCode);
                // Special case for descriptive error messages on enabling plugin licenses
                if (subcode && UpmStrings[subcode] && (subcode != 'ajaxServerError')) {
                    // note, ajaxServerError is what we call a generic Ajax error with no error code; JIRA defines an
                    // AJS.params string for this, but we don't want to use it because UPM has its own generic message
                    msg = formatErrorMessage(UpmStrings[subcode], errorInfo, pluginName);
                } else if (!msg || msg.match(/^[0-9][0-9][0-9]$/)) {
                    // if there is no msg or the msg is just an error code, return an "unexpected" error
                    msg = UpmStrings['upm.plugin.error.unexpected.error'];
                } else {
                    msg = formatErrorMessage(msg, errorInfo, pluginName);
                }
            } else {
                msg = UpmStrings['upm.plugin.error.unexpected.error'];
            }

            // This is a simplified version of the logic that's currently in upm.displayErrorMessage.
            // That function also handles some special cases that we don't need to deal with here yet
            // because we aren't yet using this view for Manage Add-ons.  Eventually those will need
            // to be implemented in a different way.
            this.model.triggerMessage({
                type: 'error',
                message: msg
            });
        },

        _onCollectionItemRemoved: function(model) {
            if (model === this.model) {
                this.$el.remove();
            }
        },

        _onCollapsed: function() {
            this.$el.find(".upm-plugin-notice .aui-lozenge").removeClass("aui-lozenge-subtle");
            // remove any messages when plugin is collapsed
            this._removeMessage();
        },

        _onExpanded: function() {
            this.$el.find(".upm-plugin-notice .aui-lozenge").addClass("aui-lozenge-subtle");
        },

        _onExpandAndThen: function(eventArgs) {
            var me = this;
            var resend = function() {
                me.model.trigger.apply(me.model, eventArgs);
            };
            if (eventArgs) {
                if (this.isExpanded()) {
                    resend();
                } else {
                    this._expandDetails().done(resend);
                }
            }
        },

        _onFocus: function(messageParams) {
            var me = this;
            $(window).scrollTop(this.$el.offset().top - 10);
            this._expandDetails().done(function() {
                me.model.trigger('focused');
            });
        },

        /**
         * Removes any message banner that is currently being displayed in the plugin element.
         * @method _removeMessage
         * @protected
         */
        _removeMessage: function() {
            var message = this.$el.closest('div.aui-message.closeable');
            if (message.length === 0) {
                message = this.$el.closest('div.upm-plugin').find('div.aui-message.closeable');
            }
            message.trigger('close').remove();
        }
    });
});
