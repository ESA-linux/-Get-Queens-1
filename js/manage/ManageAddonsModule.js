/**
 * Top-level module for the Manage Add-ons page.  It sets up the ManageAddonsPageModel, which maintains
 * the list of add-ons and all other state for this page; all the related views; and the router that has
 * our URL mappings.  Application logic for all actions on this page are in ManageAddonFlows and
 * ManageAddonsBulkOperations.
 */
UPM.require(
    [
        'jquery',
        'ManageAddonFlows',
        'ManageAddonsBulkOperations',
        'ManageAddonsFilterType',
        'ManageAddonsListContainerView',
        'ManageAddonsPageHeaderView',
        'ManageAddonsPageModel',
        'ManageAddonsRouter',
        'UpmCommonUi',
        'UpmEnvironment',
        'UpmSafeMode',
        'UpmSettings',
        'UpmUpdateAvailabilityView'
    ], function($,
                ManageAddonFlows,
                ManageAddonsBulkOperations,
                ManageAddonsFilterType,
                ManageAddonsListContainerView,
                ManageAddonsPageHeaderView,
                ManageAddonsPageModel,
                ManageAddonsRouter,
                UpmCommonUi,
                UpmEnvironment,
                UpmSafeMode,
                UpmSettings,
                UpmUpdateAvailabilityView) {

    var pageModel,
        hasLoaded,
        allAddons;

    UpmCommonUi.getReadyState().done(function() {
        var hash = UpmCommonUi.getLocationHash();

        if (redirectLegacyHashes(hash)) {
            return;
        }

        pageModel = ManageAddonsPageModel;
        pageModel.on('disableAllIncompatible', ManageAddonsBulkOperations.disableIncompatibleAddons);
        pageModel.on('updateAll', ManageAddonsBulkOperations.updateAllAddons);
        pageModel.on('updateUpm', ManageAddonFlows.updateUpm);
        pageModel.on('upload', ManageAddonFlows.openInstallDialog);

        new ManageAddonsPageHeaderView({ model: pageModel, el: $('#upm-container.upm-manage') });
        new UpmUpdateAvailabilityView({ model: pageModel });

        allAddons = pageModel.getAllAddonsCollection();
        allAddons.on('action', ManageAddonFlows.addonAction);

        new ManageAddonsListContainerView({
            model: pageModel,
            el: $('#upm-manage-container')
        });

        if (hash.key) {
            pageModel.setFocusedAddonKey(hash.key);
            pageModel.setFocusedAddonMessage(hash.message);
        }

        if (UpmEnvironment.getResourceUrl('install-file') ||
            UpmEnvironment.getResourceUrl('install-uri')) {
            $('#upm-upload').removeClass('hidden');
        }

        UpmSafeMode.onSafeModeChanged(function() {
            pageModel.fetch();  // refresh list after entering or exiting safe mode
        });

        ManageAddonsRouter.on("route:setFilter", function(filterKey) {
            filter = ManageAddonsFilterType.fromKey(filterKey) || ManageAddonsFilterType.defaultFilter();
            pageModel.setFilter(filter);
        });

        ManageAddonsRouter.on("route:settingsDialog", function(parameters) {
            UpmSettings.openGlobalSettingsDialog();
        });

        ManageAddonsRouter.start();

        pageModel.fetch();
    });

    function redirectLegacyHashes(hash) {
        var page,
            fragment,
            query;
        if (hash && hash.tab) {
            if (hash.tab === 'compatibility') {
                page = 'check';
            } else if (hash.tab === 'install') {
                page = 'marketplace';
            } else if (hash.tab === 'osgi') {
                page = 'osgi';
            } else {
                // Also handles #update (merged with Manage Plugins)
                return false;
            }
            query = document.location.search || '';
            fragment = hash.key ? '#' + hash.tab + '/' + hash.key : '';
            document.location.href = document.location.pathname + '/' + page + query + fragment;
            return true;
        }
        return false;
    }
});
