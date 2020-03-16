/**
 * Simple view that mixes in UpmLoadingViewMixin, when you want to get the loading
 * state behavior without attaching it to an existing view.
 */
UPM.define('UpmLoadingView',
    ['BaseView',
     'UpmLoadingViewMixin'],
    function(BaseView,
             UpmLoadingViewMixin) {

    return BaseView.extend({
    	mixins: [ UpmLoadingViewMixin ],

    	_postInitialize: function() {
    		this.listenForAjaxEvents();
    	}
    });
});
