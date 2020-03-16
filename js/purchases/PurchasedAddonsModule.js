UPM.require([
        "brace",
        "jquery",
        "PurchasedAddonsPageView",
        "PurchasedAddonsModel",
        "PurchasedAddonsCollectionView",
        "UpmCommonUi"
    ], function(Brace,
                $,
                PurchasedAddonsPageView,
                PurchasedAddonsModel,
                PurchasedAddonsCollectionView,
                UpmCommonUi) {

    UpmCommonUi.getReadyState().done(function() {
        var model = new PurchasedAddonsModel();

        var list = $("#upm-install-purchases .upm-plugin-list");

        new PurchasedAddonsPageView({
            el: $("#upm-container"),
            model: model
        });

        model.on("sync", function() {
            var purchasedAddonsCollectionView = new PurchasedAddonsCollectionView({
                collection: model.getPurchasedAddons(),
                el: list
            });

            purchasedAddonsCollectionView.render();
        });

        model.fetch();
    });
});
