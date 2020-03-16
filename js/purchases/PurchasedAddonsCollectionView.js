UPM.define('PurchasedAddonsCollectionView',
    [
        'jquery',
        'BaseCollectionView',
        'PurchasedAddonView'
    ],
    function($, BaseCollectionView, PurchasedAddonView) {

        "use strict";

        return BaseCollectionView.extend({

                itemView: PurchasedAddonView,

                _initEvents: function() {
                    this.listenTo(this.collection, "sync", this.render);
                },

                _postRender: function() {
                    this.$el.addClass("expandable");
                }
            }
        );
    });
