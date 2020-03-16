UPM.require(
    [
        'jquery',
        'UpdateCheckPageView',
        'UpdateCheckAvailableVersionsModel',
        'UpdateCheckResultsModel',
        'UpmAjax',
        'UpmCommonUi',
        'UpmLoadingView',
        'AddonActions',
        'EnableDisableAddonFlows'
    ], function($,
                UpdateCheckPageView,
                UpdateCheckAvailableVersionsModel,
                UpdateCheckResultsModel,
                UpmAjax,
                UpmCommonUi,
                UpmLoadingView,
                addonActions,
                enableDisable) {

    function handleAddonAction(action, addonModel) {
        switch (action) {
            case addonActions.DISABLE:
                enableDisable.disableAddon(addonModel);
                break;
            case addonActions.ENABLE:
                enableDisable.enableAddon(addonModel);
                break;
        }
    }

    UpmCommonUi.getReadyState().done(function() {
        var versionsModel = new UpdateCheckAvailableVersionsModel(),
            resultsModel = new UpdateCheckResultsModel(),
            $container = $('#upm-panel-compatibility');

        new UpmLoadingView({
            model: versionsModel,
            el: $container
        });

        resultsModel.on('action', handleAddonAction);

        versionsModel.fetch()
            .done(function() {
                new UpdateCheckPageView({
                    el: $('#upm-update-check-content'),
                    model: resultsModel,
                    availableVersions: versionsModel.getVersions()
                }).render();
            })
            .fail(UpmAjax.signalAjaxError)
            .always(function() {
                $container.addClass('loaded');
            });
    });
});
