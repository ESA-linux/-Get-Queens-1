UPM.define('UpdateCheckAddonDetailsView',
    [
        'BaseView',
        'UpdateCheckAddonDetailsTemplate'
    ], function(BaseView,
                detailsTemplate) {

    "use strict";

    return BaseView.extend({

        template: detailsTemplate,

        _getData: function() {
            return {
                plugin: this.model.toJSON()
            };
        }
    });
});
