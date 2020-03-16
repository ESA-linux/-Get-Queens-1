UPM.define('RefreshAfterInstallDialog',
    [
        'jquery',
        'UpmDialog',
        'RefreshAfterInstallDialogTemplate'
    ],
    function($,
             UpmDialog,
             RefreshAfterInstallDialogTemplate) {

    // Dialog for uploading an add-on or application.  Depending on system permissions, the user may select either
    // a local file to upload or a URL.

    return UpmDialog.extend({
        template: RefreshAfterInstallDialogTemplate,

        events: {
            'click .refresh-message a': '_doRefresh'
        },

        _postRender: function() {
            this.$el.find('.refresh-message a').attr('href', '#');
        },

        _doRefresh: function(e) {
            if (e) {
                e.preventDefault();
            }
            this.close();
            window.location.href = window.location.pathname;
        },

        _onConfirm: function() {
            this._doRefresh();
        }
    });
});
