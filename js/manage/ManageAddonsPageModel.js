/**
 * Maintains page state for the Manage Add-ons page.  This includes the list of all add-ons and
 * the state of the controls in the header (filter dropdown, search text).
 * @singleton
 */
UPM.define('ManageAddonsPageModel',
    [
        'jquery',
        'underscore',
        'brace',
        'ManageAddonModel',
        'ManageAddonsFilterType',
        'UpmAjax',
        'UpmContextPathMixin',
        'UpmEnvironment',
        'UpmHostStatusMixin',
        'UpmLongRunningTasks',
        'UpmRequireRestart'
    ],
    function($,
             _,
             Brace,
             ManageAddonModel,
             ManageAddonsFilterType,
             UpmAjax,
             UpmContextPathMixin,
             UpmEnvironment,
             UpmHostStatusMixin,
             UpmLongRunningTasks,
             UpmRequireRestart) {

    "use strict";
   
    var ManageAddonsPageModel = Brace.Model.extend({

        namedAttributes: [
            'busy',
            'filter',
            'focusedAddonKey',
            'focusedAddonMessage',
            'links',
            'loaded',
            'searchText',
            'upmUpdateVersion'
        ],

        mixins: [UpmHostStatusMixin, UpmContextPathMixin],

        url: function() {
            return UpmEnvironment.getResourceUrl('marketplace-installed') + '?updates=true';
        },

        initialize: function() {
            this.allAddons = new Brace.Collection([], { model: ManageAddonModel });
            this._bindHostStatus();
        },

        isBusy: function() {
            return !!this.get('busy');
        },

        isLoaded: function() {
            return !!this.get('loaded');
        },

        fetch: function() {
            var me = this;
            this.set('busy', true);
            this.trigger('request');
            return $.ajax({
                url: this.url(),
                cache: false,
                dataType: 'json'
            }).then(function(marketplaceInstalledCollection) {
                return $.ajax({
                    url: marketplaceInstalledCollection.links.alternate,
                    cache: false,
                    dataType: 'json'
                }).done(function(additionalResponse) {
                    return $.extend(true, additionalResponse, marketplaceInstalledCollection);
                });
            }).done(function(response) {
                me.allAddons.reset(response.plugins);
                me.set({
                    links: response.links,
                    upmUpdateVersion: response.upmUpdateVersion
                });
                me.trigger('sync', me, response);
            }).fail(UpmAjax.signalAjaxError);
        },

        focusAddonByKey: function(key) {
            var model = this.getAddonModelByKey(key);
            if (model) {
                model.trigger('focus', model);
            }
        },
        
        getAddonModelByKey: function(key) {
            return this.allAddons.findWhere({ key: key });
        },

        getAllAddonsCollection: function() {
            return this.allAddons;
        },

        getFilteredAddons: function(filter) {
            var f = filter || this.getFilter();
            if (f) {
                var addons = this.getAllAddonsCollection().filter(f.predicate);
                return f.ordering ? addons.sort(f.ordering) : addons;
            } else {
                return [];
            }
        },

        getFocusedAddon: function() {
            return this.getFocusedAddonKey() && this.getAddonModelByKey(this.getFocusedAddonKey());
        },

        getBatchUpdatableAddons: function() {
            return this.getAllAddonsCollection().filter(function(addon) {
                return addon.isUpdatable() &&
                    !addon.isUpm() &&
                    !addon.getUpdatableToPaid();
            });
        },

        getIncompatibleAddons: function() {
            return this.getAllAddonsCollection().filter(function(addon) {
                return addon.getEnabled() && addon.getPrimaryAction() && addon.getPrimaryAction().incompatible;
            });
        },

        getNonDataCenterApprovedApps: function() {
            return this.getAllAddonsCollection().filter(function(addon) {
                return addon.getEnabled() && addon.getPrimaryAction() && addon.getPrimaryAction().nonDataCenterApproved;
            });
        },

        isShowingAllAddons: function() {
            return this.getFilter() === ManageAddonsFilterType.ALL;
        },
        
        isTextSearchActive: function() {
            return this.getSearchText() && (this.getSearchText().trim() !== '');
        },

        isUpmUpdatable: function() {
            return this.getUpmUpdateVersion() &&
                this.getAllAddonsCollection().any(function(addon) {
                    return addon.isUpm() && addon.isUpdatable();
                });
        },

        // used only for testing
        setAddons: function(addons) {
            this.allAddons.reset(addons);
        }
    });

    return new ManageAddonsPageModel();
});
