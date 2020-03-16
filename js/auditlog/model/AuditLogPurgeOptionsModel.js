/**
 * Model representing the Audit Log Purge Options state.
 */
UPM.define('AuditLogPurgeOptionsModel', ['brace', 'UpmContextPathMixin', 'UpmEnvironment'], function(Brace, UpmContextPathMixin, UpmEnvironment) {

    return Brace.Model.extend({

        namedAttributes: [
            "purgeAfter"
        ],

        mixins: [UpmContextPathMixin],

        url: function() {
            return this.getContextPath() + "/rest/plugins/1.0/log/feed/purge-after"
        },

        updatePurgeOptions: function(value) {
            this.setPurgeAfter(value);
            this.save({}, {
                contentType: UpmEnvironment.getContentType('purge-after'),
                type: "PUT"
            });
        },

        validate: function(attributes) {
            var purgeAfter = parseInt(attributes.purgeAfter, 10);
            if (!purgeAfter || purgeAfter <= 0) {
                return "upm.auditLog.purge.error.greater.than.zero.message";
            }
        },

        canChangePurgeOptions: function() {
            return !!AJS.params.upmUriManagePurgeAfter;
        }

    });
});
