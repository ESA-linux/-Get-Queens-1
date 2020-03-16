/**
 * This View drives the Fancy Select Form adding custom functionality.
 *
 * Its responsibilities include disabling the category and cost options when a search query is entered.
 */
UPM.define("MarketplaceFilterFormView",
    [
        "jquery",
        "underscore",
        "BaseView",
        "marketplaceRouter",
        "UpmStrings",
        "FancySelectForm"
    ], function($, _, BaseView, marketplaceRouter, UpmStrings) {

    "use strict";

    return BaseView.extend({

        events: {
            "submit": "_onFormSubmit"
        },

        _initEvents: function() {
            this.listenTo(this.model, "change", this._updateFormToReflectModel);
        },

        _postInitialize: function() {
            this.fancySelect = this.$el.fancySelectForm({
                onSelection: this._checkFancySelectStatus,
                parse: this._parseCategoryNames
            });
            this.fancySelect.on("update", _.bind(this._onFormSubmit, this));
        },

        /**
         * Accepts a list of category names and transforms them into
         * a list of simple objects with the same text as their value.
         *
         * @param models
         * @returns {*}
         * @private
         */
        _parseCategoryNames: function(models) {
            return _.map(models, function(model) {
                return {
                    text: model,
                    value: model
                };
            });
        },

        /**
         * Applies custom state logic to the Fancy Selects.
         *
         * This function will ensure that if the filter selected is "most-requested" then all other
         * filters are reset and disabled or if the filter is "top-grossing" the cost fancy-select is set to
         * marketplace and disabled.
         *
         * @param changedSelectName The name of the fancy select which changed.
         * @private
         */
        _checkFancySelectStatus: function(changedSelectName) {

            if (changedSelectName === "filter") {
                this.enableAll();

                switch(this.getSelectedValue("filter")) {

                    case "most-requested":
                        this.disableAllBut("filter", {
                            reset: true,
                            silent: true
                        });
                        break;

                    case "top-grossing":
                        this.selectOptionAndDisable("cost", "marketplace", true);
                        break;
                }
            }
        },

        /**
         * Updates the URL with the state stored in the Fancy Select Form.
         *
         * This function is called when a fancy select or the query is changed by the user.
         * If there is a query present and the Filter fancySelect has been changed we reset
         * the query. When the query parameter is set on the MarketplaceQueryModel (via the URL)
         * _updateFormToReflectModel is called and the input form is cleared.
         *
         * @private
         */
        _onFormSubmit: function(e, changedSelectName) {
            e.preventDefault();

            var params = {
                query: this.$el.find("input").val(),
                filter: this.$el.find("select[name='filter']").val(),
                parameters: this.model.getParametersAsObject(this.$el.find("select[name!='filter']").serializeArray())
            };

            this._checkStateAndNavigate(params, changedSelectName);
        },

        /**
         * Checks the state being set from the Filter Form before navigating to the requested page.
         *
         * If there is a text query and the filter select has been changed (which is identified by the value
         * sent from the FancySelect in the param `changedSelectName`) then we reset the query as the only
         * way this can occur is if the user selects a new filter.
         *
         * @param params The params to check and navigate to.
         * @param changedSelectName The name of the fancy select field that changed (if any)
         * @private
         */
        _checkStateAndNavigate: function(params, changedSelectName) {
            if (params.query && changedSelectName === "filter") {
                params.query = "";
            }

            marketplaceRouter.navigateTo(params);
        },

        /**
         * Updates the form to reflect the state of the model.
         *
         * This function is called when the state of the model changes. This occurs whenever the
         * URL changes.
         *
         * When a query is present the "Search results" filter option is added and all other
         * Fancy Selects are disabled.
         *
         * Alternatively if there isn't a query on the model then we clear out the search query input
         * field and set the Fancy Selects state to reflect the model.
         *
         * @private
         */
        _updateFormToReflectModel: function() {
            var query = this.model.getQuery(),
                searchInput = this.$el.find("input.upm-searchbox");

            this.fancySelect.removeOption("filter", "search");
            if (query) {
                searchInput.val(query);
                this.fancySelect.addOption("filter", {
                    value: "search",
                    text: UpmStrings["upm.install.search.dropdown"]
                });
                this.fancySelect.selectOption("filter", "search", true);
                this.fancySelect.disableAllBut("filter", {
                    reset: true
                });
            } else {
                searchInput.val("");
                this.fancySelect.selectOption("filter", this.model.getFilter(), true);

                _.each(this.model.getParameters(), function(value, key) {
                    this.fancySelect.selectOption(key, value, true);
                }, this);

                this._checkFancySelectStatus.call(this.fancySelect, "filter");
            }
        }
    });
});