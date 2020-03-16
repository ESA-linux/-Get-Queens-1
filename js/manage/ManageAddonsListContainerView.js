/**
 * View that contains one or more instances of ManageAddonsSectionView, showing a list or lists of add-ons,
 * based on the current filter setting from the model (ManageAddonsPageModel).
 * Also monitors the "busy" state of the page model and displays a spinner when appropriate.
 */
UPM.define('ManageAddonsListContainerView',
    [
        'jquery',
        'underscore',
        'brace',
        'BaseCollectionView',
        'InstallOrLicenseResultDialog',
        'ManageAddonsFilterType',
        'ManageAddonsSectionView',
        'ManageAddonsRouter',
        'UpmEnvironment',
        'UpmFormats',
        'UpmStrings'
    ], function($,
                _,
                Brace,
                BaseCollectionView,
                InstallOrLicenseResultDialog,
                ManageAddonsFilterType,
                ManageAddonsSectionView,
                ManageAddonsRouter,
                UpmEnvironment,
                UpmFormats,
                UpmStrings) {

    return BaseCollectionView.extend({

        itemView: ManageAddonsSectionView,

        initialize: function() {
            this.collection = new Brace.Collection();
            BaseCollectionView.prototype.initialize.apply(this);
        },

        _initEvents: function() {
            BaseCollectionView.prototype._initEvents.apply(this);
            this.listenTo(this.model, 'change:busy', this._onChangeBusy);
            this.listenTo(this.model, 'sync', this._onListLoaded);
            this.listenTo(this.model, 'request', this._onRefreshStarted);
            this.listenTo(this.model, 'change:filter', this._showAddonsForSelectedFilter);
            this.listenTo(this.model, 'change:searchText', this._onSearchTextChanged);

            // ensure that we'll correctly handle "focus" events on any add-on even if its list isn't selected
            this.listenTo(this.model.getAllAddonsCollection(), 'focus', this._onFocusAddon);
        },

        _isAddonVisible: function(addon) {
            return this.model.isShowingAllAddons() || _.contains(this.model.getFilteredAddons(), addon);
        },

        _onChangeBusy: function() {
            this.$el.toggleClass('loading', this.model.isBusy());
        },

        _onFocusAddon: function(addon, message) {
            if (!this._isAddonVisible(addon)) {
                var bestFilterforAddon = ManageAddonsFilterType.bestFilterForAddon(addon);
                var bestFilterAddonKey = bestFilterforAddon ? bestFilterforAddon.key : "" ;
                ManageAddonsRouter.navigateTo(bestFilterAddonKey); // triggers a redisplay of the list
                if (this._isAddonVisible(addon)) {
                    // re-trigger the event now that there is a view for this add-on model
                    addon.focus(message);
                }
            }
        },

        _onListLoaded: function() {
            var model = this.model;

            model.set('busy', false);
            if (!model.isLoaded()) {
                // initial page load
                model.setLoaded(true);

                var focusedAddon = model.getFocusedAddon();

                // Can't determine what the default filter should be until we have the list of all add-ons.
                if (!model.getFilter()) {
                    if (focusedAddon) {
                        model.setFilter(ManageAddonsFilterType.bestFilterForAddon(focusedAddon));
                    } else {
                        model.setFilter(ManageAddonsFilterType.defaultFilter());
                    }
                }

                this._showAddonsForSelectedFilter();

                var finishedLoading = function() {
                    // for UI test syncing
                    UPM.trace('manage-addons-loaded');
                };

                if (focusedAddon) {
                    focusedAddon.focus().done(function() {
                        if (model.getFocusedAddonMessage()) {
                            var fields = model.getFocusedAddonMessage().split(':'),
                                messageType = fields[0],
                                errorCode = fields.length > 1 ? fields[1] : '';
                            if (messageType == 'licensed') {
                                if (errorCode) {
                                    new InstallOrLicenseResultDialog({
                                        model: focusedAddon,
                                        errorHtml: UpmFormats.format(UpmStrings[errorCode], UpmFormats.htmlEncode(focusedAddon.getName()))
                                    });
                                } else {
                                    new InstallOrLicenseResultDialog({
                                        model: focusedAddon,
                                        newLicense: focusedAddon.getLicenseDetails(),
                                        nextAction: focusedAddon.hasLink('post-install') ? 'get-started' : null
                                    });
                                }
                            } else if (messageType == 'trial_stopped') {
                                focusedAddon.triggerMessage({
                                    type: 'warning',
                                    message: UpmStrings['upm.messages.license.trial.unsubscribed']
                                });
                            }                            
                        }
                        finishedLoading();
                    });
                } else {
                    finishedLoading();
                }
            } else {
                // list has been refreshed
                this._showAddonsForSelectedFilter();
            }
        },

        _onRefreshStarted: function() {
            // Whenever the entire list of add-ons is being refreshed, we'll hide any currently displayed
            // list sections, so the user will just see the spinner instead.  When the list finishes loading,
            // our contents will be replaced by the new data.
            this.$el.children().addClass('hidden');
        },

        _onSearchTextChanged: function() {
            var text = this.model.getSearchText();
            this.collection.each(function(m) {
                m.trigger('filterBySearchText', text);
            });
            UPM.trace('manage-addons-filtered-by-name');
        },

        _showAddonsForSelectedFilter: function() {
            var models,
                me = this;
            
            if (!this.model.isLoaded()) {
                return;
            }

            this.model.setBusy(true);

            if (this.model.isShowingAllAddons()) {
                models = _.map(ManageAddonsFilterType.filtersForShowingAllAddons(), function(f) {
                        return { addons: me.model.getFilteredAddons(f), type: f };
                    });
            } else {
                models = [ { addons: this.model.getFilteredAddons(), type: this.model.getFilter() } ];
            }
            this.collection.reset(models);

            var showUpdateAll = UpmEnvironment.getResourceUrl('update-all') &&
                (this.model.getBatchUpdatableAddons().length > 0);
            $('#upm-update-all-container').toggleClass('hidden', !showUpdateAll);

            if (this.model.isTextSearchActive()) {
                this._onSearchTextChanged();
            }

            this.model.setBusy(false);

            UPM.trace('manage-addons-list-loaded');
        }

    });
});
