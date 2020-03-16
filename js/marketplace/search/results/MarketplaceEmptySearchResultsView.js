UPM.define("MarketplaceEmptySearchResultsView",
	[
		'BaseView',
		'MarketplaceEmptySearchResultsTemplate'
	], function(BaseView,
				MarketplaceEmptySearchResultsTemplate) {

    "use strict";

    return BaseView.extend({

    	template: MarketplaceEmptySearchResultsTemplate,

    	_getData: function() {
    		return {};
    	}

    });
});