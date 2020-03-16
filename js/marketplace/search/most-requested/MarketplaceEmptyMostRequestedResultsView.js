UPM.define("MarketplaceEmptyMostRequestedResultsView", ['BaseView', 'UpmStrings'], function(BaseView, UpmStrings) {

    "use strict";

    return BaseView.extend({

        className: "upm-no-matching-plugins",

        _getHtml: function() {
            return UpmStrings['upm.messages.request.none'];
        }

    });
});