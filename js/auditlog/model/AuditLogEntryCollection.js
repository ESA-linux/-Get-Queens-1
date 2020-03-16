UPM.define('AuditLogEntryCollection', ['brace', 'jquery', 'underscore', 'AuditLogEntryModel', 'UpmContextPathMixin'], function(Brace, $, _, AuditLogEntryModel, UpmContextPathMixin) {

    return Brace.Collection.extend({

        mixins: [UpmContextPathMixin],

        model: AuditLogEntryModel,

        /**
         * Retrieves the Audit log entries.
         *
         * @param url An optional URL to retrieve the entries from
         * @returns {Promise} A promise which will resolve when the entries are received.
         */
        getEntries: function(url) {

            if (!url || url === "") {
                url = this.getContextPath() + "/rest/plugins/1.0/log/feed";
            }

            var promise = $.ajax({
                url: url,
                type: 'get',
                cache: false,
                dataType: 'xml'
            });

            promise.done(_.bind(this._parseEntries, this));

            return promise;
        },

        /**
         * Parses the response from the audit log feed.
         *
         * @param feed The feed of audit log entries and page state.
         * @private
         */
        _parseEntries: function(feed) {
            this.reset(_.map($(feed).find("entry"), this._parseEntry));
            UPM.trace("upm.auditlog.reset");
        },

        /**
         * Parses an individual audit log entry.
         *
         * @param entry The entry to parse
         * @returns {Object}
         * @private
         */
        _parseEntry: function(entry) {
            var $entry = $(entry);
            return {
                title: _.escape($entry.find("title").text()),
                authorName: _.escape($entry.find("author name").text()),
                authorUri: $entry.find("author uri").text(),
                dateUpdated: $entry.find("updated").text()
            }
        }
    })
});
