/**
 * Mixin for views that would like to display standardized lightboxes.
 */
UPM.define('LightboxViewMixin',
    [
        'jquery'
    ],
    function($) {

    return {

        /**
         * Opens a Fancybox lightbox with our standard parameters.
         * @method _openLightbox
         * @param {Object} params  array of Fancybox parameters
         */
        _openLightbox: function(params) {
            $.fancybox(
                params,
                {
                    helpers: {
                        overlay: {
                            css: {
                                'background' : 'rgba(0,0,0.0.8)'
                            },
                            speedOut: 0
                        }
                    },
                    openEffect: 'none',
                    closeEffect: 'none',
                    nextEffect: 'none',
                    prevEffect: 'none'
                });
        }
    };
});