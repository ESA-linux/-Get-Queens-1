UPM.define('LicenseDetailsView',
    [
        'jquery',
        'BaseView',
        'LicenseDetailsTemplate',
        'ManageAddonFlows',
        'UpmEnvironment',
        'UpmFormats',
        'UpmLicenseInfo',
        'UpmStrings',
        'UpmDialog',
        'UpdatePluginLicenseConfirmDialogTemplate'
    ], function($,
                BaseView,
                licenseDetailsTemplate,
                ManageAddonFlows,
                UpmEnvironment,
                UpmFormats,
                UpmLicenseInfo,
                UpmStrings,
                UpmDialog,
                UpdatePluginLicenseConfirmDialogTemplate
    ) {

    "use strict";

    /**
     * Renders the license detail area within the add-on details. The model for this view is the add-on model.
     */
    return BaseView.extend({
        events: {
            'click input.submit': '_onSubmitLicense',
            'click a.upm-plugin-license-edit': '_toggleLicenseEdit',
            'click a.upm-license-cancel': '_toggleLicenseEdit',
            'click .upm-plugin-license-truncated': '_toggleFullLicenseKey',
            'click textarea.edit-license-key': '_onLicenseEditClick'
        },

        _getHtml: function() {
            var licenseDetailsHtml,
                plugin = this.model.toJSON(),
                license = plugin.licenseDetails;

            if (this.model.isLicenseUpdatable() || this.model.getLicenseDetails()) {
                licenseDetailsHtml = licenseDetailsTemplate({
                    plugin: plugin,
                    license: license,
                    readOnly: plugin.licenseReadOnly,
                    description: UpmLicenseInfo.getLicenseDescription(license),
                    status: license && UpmLicenseInfo.getLicenseStatusDescription(plugin, license),
                    unlicensed: !license || UpmLicenseInfo.isUnlicensed(license)
                });
            }

            return $('<div></div>').append(licenseDetailsHtml);
        },

        _initEvents: function() {
            this.listenTo(this.model, 'change:licenseDetails', this.render);
            this.listenTo(this.model, 'uninstalled', this._onUninstalled);
        },

        _postRender: function() {
            var initialLicenseValue = (this.model.getLicenseDetails() && this.model.getLicenseDetails().rawLicense) || '',
                $formButton = this.$el.find('input.submit'),
                $textarea = this.$el.find('textarea');

            // Disable the update button unless the value of the textarea changes
            $textarea.bind('keyup input change propertychange', function() {
                // Level the playing field for line breaks. Replace all double line breaks (windows) with single (unix)
                $formButton.prop('disabled',
                    ($textarea.val().replace(/\r\n/g, '\n') === initialLicenseValue.replace(/\r\n/g, '\n')));
            });
        },

        _clearBusyState: function(_this) {
            var $licenseField = _this.$el.find('.edit-license-key'),
                $button = _this.$el.find('.submit-license'),
                $spinner = _this.$el.find('.upm-license-form .loading');

            // clear the busy state only if there's an error, since if we succeeded,
            // we would have refreshed the whole view state
            $licenseField.prop('disabled', false);
            $button.prop('disabled', false);
            $spinner.addClass('hidden');
        },

        _updateLicenseKey: function(_this, licenseKey) {
            this.model.updateLicense(licenseKey)
                .fail(function (xhr) {
                    _this._clearBusyState(_this);
                })
                .always(function () {
                    UPM.trace('license-updated');
                });
        },

        _confirmAndUpdate: function(messages, licenseKey) {
            var _this = this;

            var dialog = new UpmDialog({
                template: UpdatePluginLicenseConfirmDialogTemplate,
                data: {
                    messages: messages
                }
            });
            return dialog.getResult()
                .done(function() {
                    _this._updateLicenseKey(_this, licenseKey);
                })
                .fail(function() {
                    _this._clearBusyState(_this);
                });
        },

        _verifyLicenseAndUpdate: function (licenseKey) {
            var _this = this,
                url = this.model.getLinks()['validate-downgrade'],
                licenseKeyEmpty = !licenseKey || (licenseKey.trim() === '');
            if (!url || licenseKeyEmpty) {
                return _this._updateLicenseKey(_this, licenseKey);
            }
            var data = { licenseKey: licenseKey };
            return $.ajax({
                url: url,
                dataType: 'json',
                contentType: UpmEnvironment.getContentType(),
                data: JSON.stringify(data),
                type: "POST"
                })
                .done(function(response) {
                    // Check the returned com.atlassian.upm.rest.representations.ValidatePluginLicenseResultRepresentation
                    if (response.type == 'success') {
                        return _this._updateLicenseKey(_this, licenseKey);
                    }
                    return _this._confirmAndUpdate(response.messages, licenseKey);
                })
                .fail(function (xhr, status, message) {
                    _this._clearBusyState(_this);
                    // com.atlassian.upm.license.internal.PluginLicenseError in serialzied to JSON by
                    // com.atlassian.upm.rest.representations.PluginLicenseErrorResultRepresentation that
                    // can be processed by UpmAjax.parseErrorResponse()
                    _this.model.signalAjaxError(xhr);
                });
        },

        _onSubmitLicense: function(e) {
            var $licenseField = this.$el.find('.edit-license-key'),
                $button = this.$el.find('.submit-license'),
                $spinner = this.$el.find('.upm-license-form .loading'),
                licenseKey = $licenseField.val().trim();

            e.preventDefault();

            $licenseField.prop('disabled', true);
            $button.prop('disabled', true);
            $spinner.removeClass('hidden');
            this._verifyLicenseAndUpdate(licenseKey);
        },

        _onUninstalled: function() {
            this.$el.addClass('disabled');
            this.$el.find('input[type="submit"]').attr('disabled', 'disabled');
            this.$el.find('textarea').attr('disabled', 'disabled');
        },

        _toggleFullLicenseKey: function(e) {
            e.preventDefault();
            this.$el.find('.upm-plugin-license-truncated').toggleClass('hidden');
            this.$el.find('.upm-plugin-license-raw').toggleClass('hidden');
        },

        _toggleLicenseEdit: function(e) {
            var $container = this.$el.find('div.upm-license-details');
            e.preventDefault();
            if ($container.hasClass('edit-license')) {
                $container.removeClass('edit-license');
            } else {
                $container.addClass('edit-license');
                $container.find('.upm-license-form textarea').focus().select();
            }            
        },

       _onLicenseEditClick: function(e) {
           var $container = this.$el.find('div.upm-license-details');
           e.preventDefault();
           $container.find('.upm-license-form textarea').focus().select();
       },

        _setBusy: function(busy, spinnerOnStateField) {
            var $spinner = this.$el.find(spinnerOnStateField ?
                '.upm-plugin-license-token-state-container .loading' :
                '.upm-plugin-license-token .loading');
            this.$el.find('.generate-token').prop('disabled', busy);
            this.$el.find('.token-state').prop('disabled', busy);
            $spinner.toggleClass('hidden', !busy);
        }
    });
});
