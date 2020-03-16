/**
 * Enum-ish values representing the available filtered subsets of the Manage Add-ons list.
 * Each has a "key" property that is used in URLs and in the filter dropdown, a "predicate"
 * method that is a predicate for whether to display a given ManageAddonModel, and an
 * optional "ordering" function for sorting the list.
 * @singleton
 */
UPM.define('ManageAddonsFilterType',
    [
        'underscore',
        'UpmEnvironment',
        'UpmStrings'
    ],
    function(_, UpmEnvironment, UpmStrings) {

    "use strict";
    
    function makeType(key, titleKey, predicate) {
        return {
            key: key,
            title: UpmStrings[titleKey],
            predicate: predicate,
            ordering: actionRequiredOrdering
        };
    }

    function actionRequiredFilter(addon) {
        return addon.isActionRequired() && !addon.isApplicationPlugin();
    }

    function actionRequiredOrdering(a, b) {
        function getPriority(addon) {
            return addon.getPrimaryAction() ? addon.getPrimaryAction().priority : 999;
        }
        var aPriority = getPriority(a),
            bPriority = getPriority(b);
        if (aPriority != bPriority) {
            return aPriority - bPriority;
        } else {
            return addonNameOrdering(a, b);
        }
    }

    function addonNameOrdering(a, b) {
        var aName = a.getName().toLowerCase(),
            bName = b.getName().toLowerCase();
        return (aName > bName) ? 1 : ((aName < bName) ? -1 : 0);
    }

    function applicationsFilter(addon) {
        return addon.isApplicationPlugin();
    }

    function paidViaAtlassianFilter(addon) {
        return addon.isPaidViaAtlassian() && !addon.isApplicationPlugin();
    }

    function userInstalledFilter(addon) {
        return (addon.getUserInstalled() || addon.isActionRequired()) && !addon.isApplicationPlugin();
    }

    function systemFilter(addon) {
        return !addon.getUserInstalled() && !addon.isActionRequired() && !addon.isApplicationPlugin();
    }

    var ManageAddonsFilterType = {
        ACTION_REQUIRED: makeType('action-required', 'upm.manage.action.required.dropdown',
            actionRequiredFilter),
        APPLICATIONS: makeType('applications', 'upm.manage.applications.dropdown',
            applicationsFilter),
        PAID_VIA_ATLASSIAN: makeType('paid-via-atlassian', 'upm.manage.paid.via.atlassian.dropdown',
            paidViaAtlassianFilter),
        USER_INSTALLED: makeType('user-installed', 'upm.manage.user.installed.dropdown',
            userInstalledFilter),
        SYSTEM: makeType('system', 'upm.manage.system.dropdown', systemFilter),
        ALL: makeType('all', 'upm.manage.all.dropdown', function() { return true; }),

        allFilters: function() {
            var all = [
                ManageAddonsFilterType.ACTION_REQUIRED,
                ManageAddonsFilterType.PAID_VIA_ATLASSIAN,
                ManageAddonsFilterType.USER_INSTALLED,
                ManageAddonsFilterType.APPLICATIONS,
                ManageAddonsFilterType.SYSTEM,
                ManageAddonsFilterType.ALL
            ];
            return UpmEnvironment.isApplicationApiSupported() ? all :
                _.without(all, ManageAddonsFilterType.APPLICATIONS);
        },

        bestFilterForAddon: function(addon) {
            if (addon.getApplicationKey() && UpmEnvironment.isApplicationApiSupported()) {
                return ManageAddonsFilterType.APPLICATIONS;
            } else if (addon.isActionRequired()) {
                return ManageAddonsFilterType.ACTION_REQUIRED;
            } else if (addon.isPaidViaAtlassian()) {
                return ManageAddonsFilterType.PAID_VIA_ATLASSIAN;
            } else if (!addon.getUserInstalled()) {
                return ManageAddonsFilterType.SYSTEM;
            } else {
                return ManageAddonsFilterType.USER_INSTALLED;
            }
        },
        
        defaultFilter: function() {
            return ManageAddonsFilterType.USER_INSTALLED;
        },
        
        filtersForShowingAllAddons: function() {
            if (UpmEnvironment.isApplicationApiSupported()) {
                return [ ManageAddonsFilterType.USER_INSTALLED, ManageAddonsFilterType.APPLICATIONS, ManageAddonsFilterType.SYSTEM ];
            } else {
                return [ ManageAddonsFilterType.USER_INSTALLED, ManageAddonsFilterType.SYSTEM ];
            }
        },

        fromKey: function(key) {
            return _.findWhere(ManageAddonsFilterType.allFilters(), { key: key });
        },
        
        ordering: actionRequiredOrdering 
    };

    return ManageAddonsFilterType;
});
