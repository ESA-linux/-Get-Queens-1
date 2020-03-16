UPM.define('PurchasedAddonsCollection', [
        'jquery',
        'brace',
        'PurchasedAddonModel',
        'UpmContextPathMixin'
    ],
    function($, Brace, PurchasedAddonModel, UpmContextPathMixin) {

        "use strict";

        return Brace.Collection.extend({

            mixins: [UpmContextPathMixin],

            model: PurchasedAddonModel,

            url: function() {
                return this.getContextPath() + "/rest/plugins/1.0/purchased/available";
            }

        }
    );
});
