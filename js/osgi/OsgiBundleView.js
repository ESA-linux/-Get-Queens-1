UPM.define('OsgiBundleView',
    [
        'jquery',
        'underscore',
        'BaseView',
        'OsgiBundleTemplate',
        'ExpandableViewMixin',
        'OsgiBundleDetailsView',
        'CollectionItemRenderingStrategy'
    ], function($,
                _,
                BaseView,
                bundleTemplate,
                ExpandableViewMixin,
                OsgiBundleDetailsView,
                CollectionItemRenderingStrategy) {

    "use strict";

    return BaseView.extend({

        mixins: [ ExpandableViewMixin ],

        template: bundleTemplate,

        renderingStrategy: CollectionItemRenderingStrategy,

        detailViewClass: OsgiBundleDetailsView,

        events: {
            "click a.upm-module-toggle": "_toggleModule",
        },

        _getData: function() {
            return {
                bundle: this.model.toJSON(),
            };
        },

        _initEvents: function() {
            this.listenTo(this.model, 'focus', this._onFocus);
        },

        _postRender: function() {
            this.$el.find('div.upm-plugin-row').on('click', _.bind(this._onRowClick, this));
        },

        _onFocus: function() {
            $(window).scrollTop(this.$el.offset().top - 10);
            this._expandDetails();
        },

        _toggleModule: function(e) {
            e.preventDefault();
            var target = $(e.target).blur();
            target.closest('div.upm-plugin-modules').toggleClass('expanded');
        }
    });
});
