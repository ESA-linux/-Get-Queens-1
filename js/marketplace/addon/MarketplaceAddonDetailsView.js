UPM.define('MarketplaceAddonDetailsView',
    [
        'jquery',
        'underscore',
        'AddonScreenshotsView',
        'BaseView',
        'LightboxViewMixin',
        'MarketplaceAddonInstallDetailsTemplate',
        'RecommendationItemTemplate',
        'UpmMessageView'
    ], function($,
                _,
                AddonScreenshotsView,
                BaseView,
                LightboxViewMixin,
                MarketplaceAddonInstallDetailsTemplate,
                recommendationItemTemplate,
                UpmMessageView) {

    "use strict";
    
    /**
     * Manages the detail view content for add-on rows in the Marketplace/Purchased views.
     */

    return BaseView.extend({

        mixins: [ LightboxViewMixin ],

        events: {
            'click div.upm-plugin-video a': '_openYoutubeLightbox'
        },

        _initEvents: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'message', this.showMessage);
        },

        /**
         * Determines whether recommendations should be included in the details.
         */
        enableRecommendations: true,

        template: MarketplaceAddonInstallDetailsTemplate,

        _getData: function() {
            return {
                plugin: this.model.toJSON(),
                requestsHtml: null      // will be overridden by subclass if necessary
            };
        },

        showMessage: function(messageModel) {
            if (messageModel) {
                this._getMessageContainer().append((new UpmMessageView({ model: messageModel })).render().$el);
                UPM.trace('addon-inline-message');
            }
        },

        _getMessageContainer: function() {
            return this.$el.find('.upm-message-container');
        },

        _getRecommendationsContainer: function() {
            return this.$el.find('.upm-plugin-recommendations-container');
        },

        _openYoutubeLightbox: function(e) {
            var url = 'https://www.youtube.com/embed/' + this.model.getVersionDetails().youtubeId + '?autoplay=1&wmode=opaque';
            e.preventDefault();
            this._openLightbox({
                    height: 480,
                    href: url,
                    type: 'iframe',
                    width: 800
                });
        },

        _renderRecommendations: function(recommendations) {
            var $recContainer = this._getRecommendationsContainer(),
                $recDiv = $recContainer.find('.upm-plugin-recommendations');

            if (recommendations.length) {
                $recContainer.removeClass('hidden');
                $recDiv.append(_.map(recommendations, function(rec) {
                    return $(recommendationItemTemplate({ plugin: rec }));
                }));
            }

            $recContainer.addClass('loaded');
        },

        _postRender: function() {
            if ((this.model.getScreenshots() && this.model.getScreenshots().length) ||
                (this.model.getHighlights() && this.model.getHighlights().length)) {
                this.$el.find('.screenshots-container').replaceWith(new AddonScreenshotsView({ model: this.model }).render().$el);
            }
            
            if (this.model.getLinks().recommendations && this.enableRecommendations) {
                this.model.loadRecommendations().
                    done(_.bind(this._renderRecommendations, this)).
                    fail(_.bind(function() { this._renderRecommendations([]); }, this));
            } else {
                this._getRecommendationsContainer().addClass('loaded');  // required for the sake of the UI tests
            }
        }
    });
});
