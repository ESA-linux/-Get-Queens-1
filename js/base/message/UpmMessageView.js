UPM.define('UpmMessageView', ['underscore', 'BaseView', 'UpmMessageTemplate'], function(_, BaseView, upmMessageTemplate) {

    return BaseView.extend({

        template: upmMessageTemplate,

        events: {
            "click .icon-close": "_onCloseClicked"
        },

        _postRender: function() {
            var closeAfter = this.model.getCloseAfter();
            if (closeAfter > 0) {
                _.delay(_.bind(this._close, this), closeAfter * 1000);
            }

            if (this.model.getClassName()) {
                this.$el.addClass(this.model.getClassName());
            }
        },

        _onCloseClicked: function(e) {
            e.preventDefault();
            this._close();
        },

        _close: function() {
            this.$el.fadeOut(500, _.bind(function() {
                this.$el.remove();
            }, this));
        }

    });
});