UPM.define('UpmDialog',
    [
        'jquery',
        'underscore',
        'BaseView'
    ],
    function($, _, BaseView) {

    /**
     * Base class for dialog views that are created from a template, providing the following behavior:
     *
     * - The template (which you must set as the view's template property) is treated as AUI Dialog2
     * markup; if Dialog2 is not available, the markup is transformed to use the old Dialog API.
     * - Any buttons/links in the button panel with the class "confirm" or "cancel" are treated as
     * OK/Cancel buttons which, by default, will close the dialog.
     * - The dialog creates a Promise for asynchronous handling of the user's action.
     *
     * @class UpmDialog
     */
    var UpmDialog = BaseView.extend({
        /**
         * True if the dialog should be rendered as an AUI modal dialog (not having a corner close box,
         * and not closeable by clicking outside the dialog) regardless of whether the template has the
         * "data-aui-modal=true" attribute.  It is true by default, since dialogs should only be
         * non-modal in unusual cases.
         */
        forceModal: true,

        _getData: function() {
            return (this.options && this.options.data) || (this.model && this.model.toJSON());
        },

        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);
            this.deferredResult = $.Deferred();
            this.render();
            this._postInitialize();
        },

        render: function() {
            var $source = $(this._getHtml().trim()),
                $buttonPanel;
            
            this.dialogWrapper = dialogWrapper(this, $source);
            this.$el = this.dialogWrapper.$el;

            this.getConfirmButton().on('click', _.bind(function(e) {
                    e.preventDefault();
                    this._onConfirm();
                }, this));
            this.getCancelButton().on('click', _.bind(function(e) {
                    e.preventDefault();
                    this._onCancel();
                }, this));

            this._postRender();

            if (!(this.options && this.options.createHidden)) {
                this.show();
            }
            
            return this;
        },

        /**
         * Hides the dialog and removes it from the DOM.
         */
        close: function() {
            this.dialogWrapper.remove();
            this.$el = null;
        },

        /**
         * Returns a Promise for asynchronous handling of the dialog action.
         * @method getResult
         * @return {Promise}  a Promise which will be resolved if the user chooses Confirm or
         *   rejected if the user chooses Cancel
         */
        getResult: function() {
            return this.deferredResult.promise();
        },

        /**
         * Makes the dialog visible.
         */
        show: function() {
            this.dialogWrapper.show();
            this._postShow();
        },

        /**
         * Makes the dialog visible, but does not remove it from the DOM.
         */
        hide: function() {
            this.dialogWrapper.hide();
        },
        
        /**
         * Returns the JQuery element for the footer area that contains the buttons.
         */
        getButtonPanel: function() {
            return this.dialogWrapper.$buttonPanel;
        },
        
        /**
         * Returns the JQuery element for the Cancel button/link, if any.
         */
        getCancelButton: function() {
            return this.getButtonPanel().find('.cancel');
        },
        
        /**
         * Returns the JQuery element for the default button, if any.
         */
        getConfirmButton: function() {
            return this.getButtonPanel().find('.confirm');
        },
        
        /**
         * Changes the header text.
         */
        setHeader: function(text) {
            this.dialogWrapper.setHeader(text);
        },

        /**
         * Override this method to provide custom behavior for the Cancel/Close button.
         */
        _onCancel: function() {
            this.close();
            this.deferredResult.reject();
        },

        /**
         * Override this method to provide custom behavior for the OK/Confirm button.
         */
        _onConfirm: function() {
            var result = this._getReturnValue();
            this.close();
            this.deferredResult.resolve(result);
        },

        /**
         * Override this method to return a custom result as the value of the dialog's Promise
         * when the dialog has been confirmed.  By default, if the dialog contains a form, it
         * returns an object containing the form values; otherwise null.
         */
        _getReturnValue: function() {
            var $form = this.$el.find('form');
            if ($form.length === 1) {
                var params = {};
                _.each($form.serializeArray(), function(param) {
                    params[param.name] = param.value;
                });
                return params;
            }
            return null;
        },

        /**
         * Hook for adding any functionality immediately after the dialog is made visible
         * such as changing the focused element
         */
        _postShow: function () {}
    });

    // glue code that allows us to use AJS.Dialog and AJS.Dialog2 more or less interchangeably 
    function dialogWrapper(me, $source) {
        var dw, dialog, $el;
        if (AJS.dialog2) {
            if (me.forceModal) {
                $source.attr('data-aui-modal', 'true');
            }
            dialog = AJS.dialog2($source);
            $el = dialog.$el;
            enableFormSubmissionWithEnterKey($el);
            dw = {
                dialog: dialog,
                $el: $el,
                $buttonPanel: $el.find('.aui-dialog2-footer-actions'),
                hide: function() {
                    dialog.hide();
                },
                remove: function() {
                    if (dialog.$el) {
                        dialog.remove();
                    }
                },
                setHeader: function(text) {
                    $el.find('.aui-dialog2-header h2').text(text);
                },
                show: function() {
                    dialog.show();
                }
            };
        } else {
            dialog = createDeprecatedAjsDialogFromTemplate(me, $source);
            $el = dialog.popup.element;
            dw = {
                dialog: dialog,
                $el: $el,
                $buttonPanel: $el.find('.dialog-button-panel'),
                hide: function() {
                    dialog.hide();
                },
                remove: function() {
                    if (dialog.popup.element) {
                        dialog.remove();
                    }
                },
                setHeader: function(text) {
                    dialog.addHeader(text);
                },
                show: function() {
                    dialog.show();
                    adjustDialogHeight(dialog);
                }
            };
        }
        return dw;
    }

    function createDeprecatedAjsDialogFromTemplate(me, $el) {
        var $header = $el.find('.aui-dialog2-header'),
            $content = $el.find('.aui-dialog2-content'),
            modal = me.forceModal || ($el.attr('data-aui-modal') === 'true'),
            width,
            options,
            dialog1,
            showFn;
        
        if ($el.hasClass('aui-dialog2-small')) {
            width = 400;
        } else if ($el.hasClass('aui-dialog2-large')) {
            width = 800;
        } else {
            width = 600;
        }
        options = {
            id: $el.attr('id'),
            closeOnOutsideClick: !modal,
            width: width,
            height: 400,
            keypressListener: function (e) {
                if (e.keyCode === 27) {
                    dialog1.popup.element.find('.dialog-button-panel .cancel').click();
                }
            }
        };
        
        dialog1 = new AJS.Dialog(options);

        showFn = dialog1.popup.show;
        dialog1.popup.show = function() {
            enableFormSubmissionWithEnterKey(dialog1.popup.element);

            showFn.apply(this, arguments);

            if (options.autoHeight) {
                dialog1.popup.element.find('.dialog-panel-body').css('height', '');
            }
        };

        dialog1.addHeader($header.find('h2').text(), $header.find('h2').attr('class'));
        
        $content.removeClass('aui-dialog2-content');  // avoid conflict with old AUI CSS
        dialog1.addPanel('main', $content);
        
        $el.find('.aui-dialog2-footer .aui-dialog2-footer-actions button').each(function() {

            // Appending new upm-dialog-footer-button class to all buttons. See below note.
            var $btn = $(this),
                classes = $btn.attr('class') + ' upm-dialog-footer-button';

            // In dialogs created using the AJS.Dialog API directly, Cancel buttons/links
            // normally get the class "button-panel-cancel-link", so we have lots of UI test code
            // that looks for that class.
            if ($btn.hasClass('cancel')) {
                classes += ' button-panel-cancel-link';
            }

            if ($btn.hasClass('aui-button-link')) {
                dialog1.addLink($btn.text(), null, classes);
            } else {
                dialog1.addButton($btn.text(), null, classes);
            }
        });

        return dialog1;
    }

    function adjustDialogHeight(dialog1) {
        if (dialog1) {
            var height = 0;
            for (var i=0; dialog1.getPanel(i); i++) {
                if (dialog1.getPanel(i).body.css({height: "auto", display: "block"}).outerHeight() > height) {
                    height = dialog1.getPanel(i).body.outerHeight();
                }
                if (i !== dialog1.page[dialog1.curpage].curtab) {
                    dialog1.getPanel(i).body.css({display:"none"});
                }
            }
            for (i=0; dialog1.getPanel(i); i++) {
                dialog1.getPanel(i).body.css({height: height || dialog1.height});
            }
            dialog1.getPanel(0).body.css({ height: height });
            dialog1.page[0].menu.height(height);
            dialog1.height = height + 106;
            dialog1.popup.changeSize(undefined, height + 106);
        }
    }

    function enableFormSubmissionWithEnterKey($container) {
        // The following hack makes the Enter key work as expected in a dialog that contains a form
        // with text fields.  The standard "Enter submits the form" behavior only works if there is a
        // single text field, or a Submit button in the form.  Since the dialog buttons are outside of
        // the dialog content area, they can't be part of the form, so we add a hidden button.
        $container.find('form').append('<input type="submit" class="hidden-submit-button" hidefocus="true" tabindex="-1">');
    }

    return UpmDialog;
});
