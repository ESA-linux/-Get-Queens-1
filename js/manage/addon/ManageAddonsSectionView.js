/**
 * Shows a subset of add-ons on the Manage Add-ons page, under a heading such as "User-installed add-ons".
 * Most of the time, only one of these views appears on the page, but if the user selects "All add-ons"
 * then we show two (user-installed and system); the logic for that is in ManageAddonsListContainerView.
 */
UPM.define('ManageAddonsSectionView',
    [
        'jquery',
        'brace',
        'BaseCollectionItemView',
        'BaseCollectionView',
        'ManageAddonView',
        'ManageAddonsSectionTemplate'
    ],
    function($, Brace, BaseCollectionItemView, BaseCollectionView, ManageAddonView, ManageAddonsSectionTemplate) {

    "use strict";

    return BaseCollectionItemView.extend({

        template: ManageAddonsSectionTemplate,

        _getData: function() {
            return {
                type: this.model.get('type').key
            };
        },

        _postRender: function() {
            var me = this,
                coll = new Brace.Collection(this.model.get('addons')),
                collView,
                $listContainer = this.$el.find('.upm-manage-plugin-list');

            collView = new BaseCollectionView({
                    collection: coll,
                    itemView: ManageAddonView,
                    el: this._getMainListContainer().find('.upm-plugin-list')
                }).render();
            collView.listenTo(this, 'unbound', collView.stopListening);

            function updateEmptyListState() {
                me._getMainListContainer().toggleClass('hidden', coll.isEmpty());
                me.$el.find('.empty-list-message').toggleClass('hidden', !coll.isEmpty());
            }
            updateEmptyListState();
            this.listenTo(coll, 'remove', updateEmptyListState);

            this.listenTo(this.model, 'filterBySearchText', function(searchText) {
                me._filterBySearchText(coll, searchText);
            });
        },

        _filterBySearchText: function(coll, searchText) {
            function matchesFilter(addon) {
                if (searchText === undefined || searchText === '') {
                    return true;
                }
                return addon.getName().toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
            }

            if (!coll.isEmpty()) {
                var anyVisible = false;

                coll.each(function(addon) {
                    var visible = matchesFilter(addon);
                    anyVisible = anyVisible || visible;
                    addon.trigger('filtered', visible);
                });

                this._getMainListContainer().toggleClass('hidden', !anyVisible);
                this.$el.find('.empty-filtered-list-message').toggleClass('hidden', anyVisible);
            }
        },

        _getMainListContainer: function() {
            return this.$el.find('.upm-manage-plugin-list');
        }
    });
});
