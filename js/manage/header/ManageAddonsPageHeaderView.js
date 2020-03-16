UPM.define('ManageAddonsPageHeaderView',
    [
        'jquery',
        'underscore',
        'brace',
        'BaseView',
        'FancySelectForm',
        'ManageAddonsFilterType',
        'ManageAddonsRouter',
        'UpmEnvironment',
        'UpmFormats',
        'UpmMessageFactory',
        'UpmStrings'
    ],
    function($,
             _,
             Brace,
             BaseView,
             FancySelect,
             ManageAddonsFilterType,
             ManageAddonsRouter,
             UpmEnvironment,
             UpmFormats,
             UpmMessageFactory,
             UpmStrings) {

    "use strict";

    var filterTypeDelayMs = 200,  // How long after the user stops tying to trigger the filter search
        lastKnownSearchText;

    return BaseView.extend({

        events: {
            'click #upm-disable-all': '_onDisableAllClick',
            'click #upm-update-all': '_onUpdateAllClick',
            'click #upm-upload': '_onUploadClick'
        },

        initialize: function() {
            var $filterDiv,
                fancySelect,
                searchInput,
                searchInputDefault,
                me = this;

            function updateFilterFromDropdown() {
                ManageAddonsRouter.navigateTo(fancySelect.getSelectedValue('filter'));
            }

            $filterDiv = $('#upm-manage-type-wrap');
            _.each(ManageAddonsFilterType.allFilters(), function(f) {
                    var $opt = $('<option></option').attr('value', f.key).text(f.title);
                    if (f === ManageAddonsFilterType.defaultFilter()) {
                        $opt.attr('selected', 'selected');
                    }
                    $filterDiv.find('select').append($opt);
                });
            $filterDiv.find('.selected-value p').text(ManageAddonsFilterType.defaultFilter().title);

            fancySelect = $filterDiv.fancySelectForm({ onSelection: updateFilterFromDropdown });
            updateFilterFromDropdown();

            this.listenTo(this.model, 'change:filter', function() {
                fancySelect.selectOption("filter", me.model.getFilter() && me.model.getFilter().key, true);
            });

            this.listenTo(this.model, 'change:loaded', this._updateStateAfterLoading);

            searchInput = this._getSearchTextField();
            searchInputDefault = this._getSearchTextDefaultValue();
            searchInput.on('focus', function() {
                if (searchInput.val() === searchInputDefault) {
                    searchInput.val('');
                    searchInput.addClass('upm-textbox-active');
                }
            });
            searchInput.on('blur', function() {
                if (searchInput.val() === '') {
                    searchInput.val(searchInputDefault);
                    searchInput.removeClass('upm-textbox-active');
                }
            });

            // oninput catches mouse-based pasting in non-IE browsers, onpropertychange in IE
            searchInput.on('keyup input change propertychange', _.bind(this._onSearchTextChange, this));
            
            // If there was a search during load time, trigger it now that we can actually filter
            if (searchInput.val() != searchInput.attr('data-default-value')) {
                this._applySearchText();
            }
        },

        _applySearchText: function(e) {
            this.model.setSearchText(this._getSearchTextField().val());
        },

        _getSearchTextDefaultValue: function() {
            return this._getSearchTextField().attr('data-default-value');
        },

        _getSearchTextField: function() {
            return $('#upm-manage-filter-box');
        },

        _onDisableAllClick: function(e) {
            e.preventDefault();
            this.model.trigger('disableAllIncompatible');
        },
        
        _onSearchTextChange: function(e) {
            var field = this._getSearchTextField(),
                val = field.val(),
                me = this;

            if (e.type == 'propertychange' && val === this._getSearchTextDefaultValue()) {
                // don't do anything if onpropertychange (IE only) was triggered and the text is the default text
                return;
            }

            // Multiple events can fire this method. Save the search text, and if it's different than
            // the last save, we know this event is unique. If it's the same, another event got it first
            if (lastKnownSearchText !== val) {
                lastKnownSearchText = val;

                // Wait a short time after the user finishes typing so we don't perform a search
                // on every keystroke
                setTimeout(function() {
                    // Finally, only do the search if the user has stopped typing, eg the search text after the
                    // timeout hasn't changed again
                    if (field.val() === val) {
                        me._applySearchText();
                    }
                }, filterTypeDelayMs);
            }
        },

        _onUpdateAllClick: function(e) {
            e.preventDefault();
            this.model.trigger('updateAll');
        },

        _onUploadClick: function(e) {
            e.preventDefault();
            this.model.trigger('upload');
        },

        _showIncompatiblePluginsWarningIfAppropriate: function(count) {
            var $incompatibleWarning = $('#upm-incompatible-plugins-msg');

            function dismissWarning() {
                var defaultDaysToDismiss = 7;
                $.cookie('upm.incompatiblePlugins.dismiss', 'true', { expires: defaultDaysToDismiss, path: '/' });
                $incompatibleWarning.addClass('hidden');
            }

            // Don't show if UPM self-update banner is showing, or if we're in safe mode,
            // or if there's an existing dismiss cookie
            if (count > 0 &&
                    !UpmEnvironment.isSafeMode() &&
                    $('#upm-self-update-msg').length === 0 &&
                    !$.cookie('upm.incompatiblePlugins.dismiss')) {
                if ($incompatibleWarning.hasClass('hidden')) {
                    var message = UpmFormats.format(
                            (count === 1) ? UpmStrings['upm.incompatible.plugins.singular'] :
                                UpmStrings['upm.incompatible.plugins.plural'],
                            UpmFormats.htmlEncode(UpmEnvironment.getApplicationName())),
                        messageView = UpmMessageFactory.newWarningMessage(null, message, { closeable: true });
                    messageView.on('closed', dismissWarning);
                    $incompatibleWarning.html(messageView.render().$el);
                    $incompatibleWarning.removeClass('hidden');
                }
            } else {
                $incompatibleWarning.addClass('hidden');
            }
        },

        _showNonApprovedDataCenterAppsWarningIfAppropriate: function(count) {
            var $nonDcApprovedWarning = $('#upm-non-dc-approved-apps-msg');

            function dismissWarning() {
                var defaultDaysToDismiss = 7;
                $.cookie('upm.nonDcApproved.dismiss', 'true', { expires: defaultDaysToDismiss, path: '/' });
                $nonDcApprovedWarning.addClass('hidden');
            }

            if (count > 0 &&
                    !UpmEnvironment.isSafeMode() &&
                    $('#upm-self-update-msg').length === 0 &&
                    !$.cookie('upm.nonDcApproved.dismiss')) {
                if ($nonDcApprovedWarning.hasClass('hidden')) {
                    var message = UpmFormats.format(
                            (count === 1) ? UpmStrings['upm.non_data_center_approved_apps.singular'] :
                                UpmStrings['upm.non_data_center_approved_apps.plural'],
                            UpmFormats.htmlEncode(UpmEnvironment.getApplicationName())),
                        messageView = UpmMessageFactory.newWarningMessage(null, message, { closeable: true });
                    messageView.on('closed', dismissWarning);
                    $nonDcApprovedWarning.html(messageView.render().$el);
                    $nonDcApprovedWarning.removeClass('hidden');
                }
            } else {
                $nonDcApprovedWarning.addClass('hidden');
            }
        },

        _updateStateAfterLoading: function() {
            if (this.model.isLoaded()) {
                this._showIncompatiblePluginsWarningIfAppropriate(this.model.getIncompatibleAddons().length);
                this._showNonApprovedDataCenterAppsWarningIfAppropriate(this.model.getNonDataCenterApprovedApps().length);
            }
        }
    });
});
