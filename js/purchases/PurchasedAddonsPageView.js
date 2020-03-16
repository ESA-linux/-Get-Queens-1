UPM.define("PurchasedAddonsPageView", [
        "BaseView",
        "jquery",
        "underscore",
        "PurchasedErroneousAddonsTemplate",
        "UpmMessageDisplayingMixin",
        "UpmLongRunningTasks",
        "UpmEnvironment",
        "UpmFormats",
        "UpmStrings"
    ], function(BaseView,
                $,
                _,
                PurchasedErroneousAddonsTemplate,
                UpmMessageDisplayingMixin,
                UpmLongRunningTasks,
                UpmEnvironment,
                UpmFormats,
                UpmStrings) {

    return BaseView.extend({

        mixins: [UpmMessageDisplayingMixin],

        events: {
            "click #upm-check-available-licenses": "_onUpdateClick"
        },

        _initEvents: function() {
            this.listenTo(this.model, "sync", this.onSync, this);
        },

        /**
         * Handler for when the user clicks on the "Check for purchased Addons" button.
         * @param e
         * @private
         */
        _onUpdateClick: function(e) {
            e.preventDefault();
            this.updateLicensesJwt();
        },

        /**
         * Called whenever the model syncs to the server and sets the visual state.
         */
        onSync: function() {
            this.$el.find(".unknown-addons").remove();
            this.$el.find(".incompatible-addons").remove();
            // We don't just call this._clearMessages() because the page template might have
            // pre-populated some messages (e.g. the warning about a non-production license)

            this.$el.find("#upm-panel-install").addClass("loaded");
            var mpacAvailable = UpmEnvironment.isMpacAvailable(),
                hasWarningNotice = !!$('.upm-purchased-addons-warning-notice').length;

            $('#upm-purchased-addons-header-default').toggleClass('hidden', !mpacAvailable || hasWarningNotice);

            this._displayErroneousAddonList(this.model.getIncompatibleAddons(), true);
            this._displayErroneousAddonList(this.model.getUnknownAddons(), false);
        },

        /**
         * Displays a warning message for unknown or incompatible addons.
         * @param addons The list of erroneous addons
         * @param incompatible True if these are incompatible addons
         * @private
         */
        _displayErroneousAddonList: function(addons, incompatible) {
            if (addons.length) {
                this._displayMessageElement(PurchasedErroneousAddonsTemplate({
                    addons: addons,
                    incompatible: incompatible,
                    mpacAvailable: UpmEnvironment.isMpacAvailable()
                }));
            }
        },

        /**
         * Handles the submission of the Atlassian ID user login dialog.
         *
         * @param username
         * @param password
         * @return {Promise}  a Promise which will be resolved on success or rejected on failure
         */
        updateLicenses: function(username, password) {
            $('#upm-purchases-none, #upm-purchases-none-new').addClass('hidden');
            $('#upm-install-container-purchases').removeClass('loaded'); // just to ensure the UI tests sync up correctly
            return this.model.updateLicenses(username, password)
                .done(_.bind(this._onLicensesUpdated, this));
        },

        /**
         * Handles the submission of the Atlassian ID user login dialog.
         *
         * @param username
         * @param password
         * @param errorCallback
         */
        updateLicensesJwt: function() {
            $('#upm-purchases-none, #upm-purchases-none-new').addClass('hidden');
            $('#upm-install-container-purchases').removeClass('loaded'); // just to ensure the UI tests sync up correctly
            UpmLongRunningTasks.startProgress('purchases');
            this.model.updateLicensesJwt()
                .always(function() { UpmLongRunningTasks.stopProgress(true); })
                .done(_.bind(this._onLicensesUpdated, this));
        },

        /**
         * Triggered when the user has successfully entered their username and password to check their purchased addons.
         *
         * @param updatedPluginKeys The keys of the addons which have been updated.
         * @private
         */
        _onLicensesUpdated: function(updatedPluginKeys) {
            var currentCount = this.model.getPurchasedAddons().length;

            if (!updatedPluginKeys || !updatedPluginKeys.length) {
                $(currentCount ? '#upm-purchases-none-new' : '#upm-purchases-none').removeClass('hidden');
                $('#upm-install-purchases .upm-plugin').removeClass('new-license');
            }

            UPM.trace("purchased-addons-updated");
        }
    });
});
