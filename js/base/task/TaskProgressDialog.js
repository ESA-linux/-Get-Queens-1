UPM.define('TaskProgressDialog',
    [
        'jquery',
        'underscore',
        'UpmDialog',
        'TaskProgressDialogTemplate',
        'TaskProgressDetailsTemplate'
    ],
    function($,
             _,
             UpmDialog,
             TaskProgressDialogTemplate,
             TaskProgressDetailsTemplate) {

    // Progress dialog used by UpmLongRunningTasks.

    return UpmDialog.extend({
        template: TaskProgressDialogTemplate,

        _getData: function() {
            return _.extend({}, UpmDialog.prototype._getData.apply(this), this._formatTitleAndContent());
        },

        _initEvents: function() {
            this.listenTo(this.model, 'change:statusProperties', this._onChangeStatusProperties);
            this.listenTo(this.model, 'change:progressPercent', this._onChangeProgressPercent);
            this.listenTo(this.model, 'change:showProgressBar', this._onChangeShowProgressBar);
        },

        _postRender: function() {
            this._onChangeShowProgressBar();
            this._onChangeProgressPercent();
        },

        _formatTitleAndContent: function() {
            var $markup = $('<div></div>').html(TaskProgressDetailsTemplate(this.model.getStatusProperties()));
            return {
                title: $markup.find('header').text(),
                contentHtml: $markup.find('main').html(),
                progressHtml: $markup.find('footer').html()
            };
        },

        _onChangeStatusProperties: function() {
            if (this.$el) {
                var titleAndContent = this._formatTitleAndContent();
                this.setHeader(titleAndContent.title);
                this.$el.find('.upm-progress-text').html(titleAndContent.contentHtml);
                this.$el.find('.upm-progress-bar-text').html(titleAndContent.progressHtml);
            }
        },

        _onChangeProgressPercent: function() {
            if (this.$el) {
                this.$el.find('div.upm-progress-amount').width(this.model.getProgressPercent() + '%');
            }
        },

        _onChangeShowProgressBar: function() {
            if (this.$el) {
                this.$el.toggleClass('upm-progress-download-install', !!this.model.getShowProgressBar());
            }
        },

        // This dialog has no confirm or cancel buttons, but stub these methods just in case someone calls them
        _onConfirm: function() { },
        _onCancel: function() { }
    });
});
