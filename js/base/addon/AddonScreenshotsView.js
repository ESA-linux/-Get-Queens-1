UPM.define('AddonScreenshotsView',
    [
        'jquery',
        'underscore',
        'AddonScreenshotsTemplate',
        'BaseView',
        'LightboxViewMixin',
        'UpmFormats'
    ], function($,
                _,
                addonScreenshotsTemplate,
                BaseView,
                LightboxViewMixin,
                UpmFormats) {

    "use strict";

    /**
     * Renders a preview of the add-on's first screenshot, which opens a lightbox of all of them if clicked.
     * If there are no screenshots, renders a message to that effect instead.  The model for this view is
     * the add-on model.
     */
    return BaseView.extend({

        mixins: [ LightboxViewMixin ],
        
        template: addonScreenshotsTemplate,

        events: {
            'click a': '_openScreenshotsLightbox'
        },

        _getData: function() {
            var isApplication = this.model.isApplicationPlugin && this.model.isApplicationPlugin();
            return {
                highlights: (!isApplication) && this.model.getHighlights(),
                screenshots: (!isApplication) && this.model.getScreenshots()
            };
        },

        _openScreenshotsLightbox: function(e) {
            e.preventDefault();

            var params = _.flatten([
                _.map(this.model.getHighlights(), function(h) {
                    return {
                        'href': h.fullImageUri,
                        title: UpmFormats.htmlEncode(h.imageTitle)
                    };
                }),
                _.map(this.model.getScreenshots(), function(s) {
                    return {
                        'href': s.link,
                        title: UpmFormats.htmlEncode(s.name)
                    };
                })
            ]);

            this._openLightbox(params);
        }
    });
});
