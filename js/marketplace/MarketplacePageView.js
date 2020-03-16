/**
 * This view is responsible for switching between Search and Single modes.
 */
UPM.define("MarketplacePageView", ["jquery", "underscore", "BaseView", "marketplaceRouter"], function($, _, BaseView, marketplaceRouter) {

    return BaseView.extend({

        events: {
            "click a.return": "_onReturn",
            "click .category-link": "_onCategoryLinkClick"
        },

        _initEvents: function() {
            this.listenTo(this.model, "single", this._onSingle);
            this.listenTo(this.model, "search", this._onSearch);
            this.listenTo(this.model, "single", this._resetScrollTop);
        },

        _onSingle: function() {
            this.$el.find(".single-addon").removeClass("hidden");
            this.$el.find(".find-addons").addClass("hidden");
        },

        _onSearch: function() {
            this.$el.find(".single-addon").addClass("hidden");
            this.$el.find(".find-addons").removeClass("hidden");
        },

        /**
         * Loads a category when a category lozenge is clicked.
         *
         * If the user clicks a category lozenge when searching by keyword the filter is reset to "featured".
         *
         * @param e The click event
         * @private
         */
        _onCategoryLinkClick: function(e) {
            e.preventDefault();
            var anchor = $(e.target).closest("a");
            var searchParameters = _.clone(this.model.getParameters());
            var filter = this.model.getFilter();
            searchParameters.category = anchor.data("category");

            if (filter === "search") {
                filter = "featured";
            }

            var parameters = {
                filter: filter,
                query: "",
                parameters: searchParameters
            };

            this._resetScrollTop();

            marketplaceRouter.navigateTo(parameters);
        },

        /**
         * Sets the scroll top of the document element when displaying
         * the single page view.
         *
         * @private
         */
        _resetScrollTop: function() {
            $(document).scrollTop(0);
        },

        /**
         * When the "Return to search" link is clicked on the single addon view
         * we return to the search page using the existing state stored in the
         * marketplaceQueryModel (`this.model`).
         *
         * @param e The click event
         * @private
         */
        _onReturn: function(e) {
            e.preventDefault();

            var parameters = {
                filter: this.model.getFilter(),
                query: this.model.getQuery(),
                parameters: this.model.getParameters()
            };

            marketplaceRouter.navigateTo(parameters);
        }
    });
});