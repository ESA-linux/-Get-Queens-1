/**
 * A view which is capable of displaying a message.
 *
 * Assumes that this View contains an element with class "messages" which will house
 * the message elements.
 */
UPM.define('UpmMessageDisplayingMixin', ['brace', 'UpmMessageFactory'], function(Brace, UpmMessageFactory) {

    return {

        /**
         * Display an Error message.
         *
         * @param title The title to display next to the icon
         * @param message The Error message text
         * @param options Additional Options which are passed through to UpmMessageView
         * @private
         */
        _displayErrorMessage: function(title, message, options) {
            this._displayMessage(UpmMessageFactory.newErrorMessage(title, message, options));
        },

        /**
         * Displays a Warning message.
         *
         * @param title The title to display next to the icon
         * @param message The Success message text
         * @param options Additional Options which are passed through to UpmMessageView
         * @private
         */
        _displayWarningMessage: function(title, message, options) {
            this._displayMessage(UpmMessageFactory.newWarningMessage(title, message, options));
        },

        /**
         * Displays a Success message.
         *
         * @param title The title to display next to the icon
         * @param message The Success message text
         * @param options Additional Options which are passed through to UpmMessageView
         * @private
         */
        _displaySuccessMessage: function(title, message, options) {
            this._displayMessage(UpmMessageFactory.newSuccessMessage(title, message, options));
        },

        /**
         * Appends a rendered message into the message container element.
         *
         * @param messageView The UpmMessageView to render and append.
         * @private
         */
        _displayMessage: function(messageView) {
            this._displayMessageElement(messageView.render().$el);
        },

        _displayMessageElement: function($el) {
            this.$el.find(".messages").first().append($el);
        },
        
        /**
         * Removes all messages from the message element.
         *
         * @private
         */
        _clearMessages: function() {
            this.$el.find(".messages").first().find(".aui-message").remove();
        }

    };
});