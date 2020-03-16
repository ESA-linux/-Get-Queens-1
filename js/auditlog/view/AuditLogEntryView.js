UPM.define("AuditLogEntryView", ["moment", "BaseCollectionItemView"], function(moment, BaseCollectionItemView) {

    return BaseCollectionItemView.extend({

        template: "#upm-log-table-template",

        /**
         * Formats the Audit Log Entry model's data for display.
         *
         * Formats the dateUpdated property.
         *
         * @returns {Object} The formatted data.
         * @private
         */
        _getData: function() {
            var model = this.model.toJSON();

            model.dateUpdated = moment(model.dateUpdated).format("MMM D YYYY h:mm:ss A");

            return model;
        }

    });
});