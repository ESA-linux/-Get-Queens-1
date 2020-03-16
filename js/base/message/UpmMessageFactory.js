UPM.define('UpmMessageFactory', ['UpmMessageModel', 'UpmMessageView'], function(UpmMessageModel, UpmMessageView) {

    function createMessage(title, message, type, options) {

        options = options || {};

        options.title = title;
        options.message = message;
        options.type = type;

        var messageModel = new UpmMessageModel(options);

        return new UpmMessageView({
            model: messageModel
        });
    }

    return {
        newMessage: function(type, title, message, options) {
            return createMessage(title, message, type, options);
        },
        
        newSuccessMessage: function(title, message, options) {
            return createMessage(title, message, "success", options);
        },

        newWarningMessage: function(title, message, options) {
            return createMessage(title, message, "warning", options);
        },

        newInfoMessage: function(title, message, options) {
            return createMessage(title, message, "info", options);
        },

        newErrorMessage: function(title, message, options) {
            return createMessage(title, message, "error", options);
        }
    };
});