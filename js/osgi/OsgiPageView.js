UPM.define('OsgiPageView',
    [
        'jquery',
        'underscore',
        'brace',
        'OsgiBundleView'
    ], function($,
                _,
                Brace,
                OsgiBundleView) {

    function compareBundleName(b1, b2) {
        var n1 = (b1.getName() || b1.getSymbolicName()).toLowerCase(),
            n2 = (b2.getName() || b2.getSymbolicName()).toLowerCase();
        return (n1 > n2) ? 1 : ((n1 < n2) ? -1 : 0);
    }

    return Brace.View.extend({

        events: {
            "submit #upm-osgi-search-form": "_filterBundlesByModule",
            "click a.upm-osgi-bundle-xref": "_focusOsgiBundle",
            "keyup #upm-osgi-filter-box": "_filterBundles"
        },

        initialize: function() {
            this.listenTo(this.model, "reset", this.render);
        },

        render: function() {
            this._renderBundles(this.model.models);
            AJS.Binder.runBinders(this.$el);
            return this.$el;
        },

        /**
         * Renders OSGI add ons by delegating to existing code.
         *
         * @param {Array} bundles The list of bundle models to render
         * @private
         */
        _renderBundles: function(bundles) {
            var sortedBundles = bundles.sort(compareBundleName);
            this.$el.find("#upm-osgi-bundles .upm-plugin-list").html(_.map(sortedBundles, function(b) {
                return new OsgiBundleView({ model: b }).render().$el;
            }));
            this.$el.find('#upm-osgi-bundles').removeClass('hidden');
            this.$el.find("#upm-panel-osgi").addClass("loaded");
        },

        /**
         * Filters plugins by keyword.
         *
         * @param e The submit event
         * @private
         */
        _filterBundlesByModule: function(e) {
            e.preventDefault();
            var keyword = $("#upm-osgi-search-box").val();
            this.model.getBundles(keyword);
        },

        /**
         *
         * @param e
         * @private
         */
        _filterBundles: function(e) {
            e.preventDefault();
            var keyword = $(e.target).val();
            var bundles = this.model.filterBundlesByName(keyword);
            this._renderBundles(bundles);
        },

        /**
         * Expands an OSGI bundle from a click from within another OSGI bundle.
         *
         * @param e The click event
         * @private
         */
        _focusOsgiBundle: function(e) {
            var bundle = this.model.findBySymbolicName($(e.target).attr('data-key'));
            e.preventDefault();
            e.target.blur();
            if (bundle) {
                bundle.trigger('focus');
            }
        }
    });
});