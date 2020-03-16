UPM.define('UploadDialog',
    [
        'InstallParams',
        'UpmDialog',
        'UploadDialogTemplate'
    ],
    function(InstallParams,
             UpmDialog,
             UploadDialogTemplate) {

    // Dialog for uploading an add-on or application.  Depending on system permissions, the user may select either
    // a local file to upload or a URL.

    // Due to limitations on how HTML file chooser controls and form posts work, in order for a file upload to be
    // retryable (e.g. in case the XSRF token has expired) we have to keep the original form around in the DOM even
    // after the dialog has been closed.  To do this, we pass a hidden JQuery element in the "formContainer" option
    // of the dialog, and UploadDialog moves its own form element into that container before closing itself.  You
    // shouldn't need to worry about the details of this if you do everything through the UpmInstaller module.

    return UpmDialog.extend({
        template: UploadDialogTemplate,

        events: {
            'input #upm-upload-file,#upm-upload-url': '_validateRequiredFields',
            'change #upm-upload-file,#upm-upload-url': '_validateRequiredFields',
            'keyup #upm-upload-file,#upm-upload-url': '_validateRequiredFields'
        },

        _postInitialize: function() {
            if (this.options.formContainer) {
                this.options.formContainer.empty();
            }
        },

        _getReturnValue: function() {
            return {
                file: this._getSelectedFile(),
                url: this._getSelectedUrl()
            };
        },

        _getSelectedFile: function() {
            var v = this.$el.find('#upm-upload-file').val();
            return (v && v.trim()) || null;
        },

        _getSelectedUrl: function() {
            var v = this.$el.find('#upm-upload-url').val();
            return (v && v.trim()) || null;
        },
        
        _isSubmittable: function() {
            return this._getSelectedFile() || this._getSelectedUrl();
        },

        _onConfirm: function() {
            if (this._isSubmittable) {
                var result;
                if (this._getSelectedFile()) {
                    result = new InstallParams({ filePath: this._getSelectedFile() });
                    if (this.options.formContainer) {
                        var $form = this.$el.find('form');
                        this.hide();
                        $form.remove();
                        this.options.formContainer.append($form);
                    }
                } else {
                    result = new InstallParams({ url: this._getSelectedUrl() });
                }
                this.close();
                this.deferredResult.resolve(result);
            }
        },

        _postRender: function() {
            this._validateRequiredFields();
        },

        _validateRequiredFields: function() {
            var disable = !this._isSubmittable(),
                $button = this.$el.find('.confirm'),
                $filename = this.$el.find('.selected-file');

            if (this._getSelectedFile()) {
                $filename.html(new InstallParams({ filePath: this._getSelectedFile() }).getFileName());
            } else {
                $filename.html('');
            }

            $button.prop('disabled', disable).attr('aria-disabled', disable).toggleClass('disabled', disable);
        }
    });
});
