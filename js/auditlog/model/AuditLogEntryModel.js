/**
 * Represents an Audit log entry.
 */
UPM.define('AuditLogEntryModel', ['brace'], function(Brace) {

    return Brace.Model.extend({

        namedAttributes: [
            "title",
            "authorName",
            "authorUri",
            "dateUpdated"
        ]

    });
});
