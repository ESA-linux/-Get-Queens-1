/**
 * Model representing the Audit Log Page state.
 */
UPM.define('AuditLogPageModel', ['brace', 'jquery', 'underscore'], function(Brace, $, _) {

    return Brace.Model.extend({

        namedEvents: [
            "updated",
            "errorOccured"
        ],

        namedAttributes: [
            "collection",
            "startIndex",
            "totalEntries",
            "nextPageHref",
            "previousPageHref",
            "firstPageHref",
            "lastPageHref",
            "currentPageHref"
        ],

        /**
         * Gets a list of Audit log entries by page URL.
         *
         * If no URL is provided the default URL will be used.
         *
         * @param url Optional url of the page to load.
         */
        getEntries: function(url) {
            this.trigger('ajaxStart');

            var promise = this.getCollection().getEntries(url);

            promise.done(_.bind(this._setProperties, this));
            promise.done(_.bind(function() {
                this.setCurrentPageHref(url);
            }, this));
            promise.fail(_.bind(this._handleError, this));
            promise.always(_.bind(function() { this.trigger('ajaxComplete') }, this));
        },

        /**
         * Loads a page of entries by URL.
         * @param url
         * @private
         */
        _loadEntriesForPage: function(url) {
            if (url) {
                this.getEntries(url);
            }
        },

        gotoFirstPage: function() {
            this._loadEntriesForPage(this.getFirstPageHref());
        },

        gotoLastPage: function() {
            this._loadEntriesForPage(this.getLastPageHref());
        },

        gotoPreviousPage: function() {
            this._loadEntriesForPage(this.getPreviousPageHref());
        },

        gotoNextPage: function() {
            this._loadEntriesForPage(this.getNextPageHref());
        },

        refresh: function() {
            this.getEntries(this.getCurrentPageHref());
        },

        _setProperties: function(response) {
            var $feed = $(response);

            this.setStartIndex(parseInt($feed.find("startIndex").text(), 10));
            this.setTotalEntries(parseInt($feed.find("totalEntries").text(), 10));
            this.setNextPageHref($feed.find("link[rel='next']").attr('href'));
            this.setPreviousPageHref($feed.find("link[rel='previous']").attr('href'));
            this.setFirstPageHref($feed.find("link[rel='first']").attr('href'));
            this.setLastPageHref($feed.find("link[rel='last']").attr('href'));

            this.triggerUpdated();
        },

        _handleError: function(request) {
            this.triggerErrorOccured(request);
        }
    });
});
