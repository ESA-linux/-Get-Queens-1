/**
 * Adds the class 'loading' to the view's container when a JQuery Ajax request starts
 * and removes it when it ends.
 *
 * Don't rely on this class for when UPM has finished loading in WebDriver as it will
 * be removed before other callbacks are called.
 *
 * Whenever a request is dispatched we add the loading class to the container element.
 * If the request takes more than a second we also add the slow class to the container.
 * The combination of these two classes allows us to dim the search results, and in
 * the instance of a slow request, show the spinner.
 */
UPM.define('UpmLoadingViewMixin',
    ['jquery',
     'underscore'],
    function($, _) {

    var slowRequestThresholdMs = 1000;

    return {
        listenForAjaxEvents: function(source) {
            source = source || this.model || this.collection;
            this.listenTo(source, 'request', this._onAjaxStart);
            this.listenTo(source, 'ajaxStart', this._onAjaxStart);
            this.listenTo(source, 'sync', this._onAjaxComplete);
            this.listenTo(source, 'ajaxComplete', this._onAjaxComplete);
        },

        _getLoadingContainer: function() {
            return this.loadingContainer || this.$el;
        },

        _onAjaxStart: function() {
            this.ajaxRequests = (this.ajaxRequest || 0) + 1;
            if (this.ajaxTimeout) {
                clearTimeout(this.ajaxTimeout);
            }
            this.ajaxTimeout = setTimeout(_.bind(this._slowRequest, this), slowRequestThresholdMs);
            this._getLoadingContainer().addClass('loading');
        },

        _onAjaxComplete: function() {
            if (this.ajaxTimeout) {
                clearTimeout(this.ajaxTimeout);
                delete this.ajaxTimeout;
            }
            if (--this.ajaxRequests === 0) {
                this._getLoadingContainer().removeClass('slow loading');
            }
        },

        _slowRequest: function() {
            this._getLoadingContainer().addClass('slow');
        }
    };
});
