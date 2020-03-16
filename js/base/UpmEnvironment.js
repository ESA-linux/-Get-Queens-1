UPM.define('UpmEnvironment',
    [
        'jquery',
        'underscore',
        'backbone',
        'UpmContextPathMixin'
    ],
    function($,
             _,
             Backbone,
             UpmContextPathMixin) {

    // non-Almond dependencies:  a whole lot of things loaded from AJS.params at DOM-ready time

    var readyState = $.Deferred();

    var currentUserKey;

    // Singleton instance of the host status model
    var hostStatusModel = new Backbone.Model();

    // Values for UpmEnvironment.getContentType/
    var contentTypes = {
        'bundle': 'application/vnd.atl.plugins.osgi.bundle+json',
        'install': 'application/vnd.atl.plugins.install.uri+json',
        'json': 'application/json',
        'module': 'application/vnd.atl.plugins.plugin.module+json',
        'pac-disabled': 'application/vnd.atl.plugins.pac.disabled+json',
        'plugin': 'application/vnd.atl.plugins.plugin+json',
        'purge-after': 'application/vnd.atl.plugins.audit.log.purge.after+json',
        'requires-restart': 'application/vnd.atl.plugins.changes.requiring.restart+json',
        'safe-mode': 'application/vnd.atl.plugins.safe.mode.flag+json',
        'update-all': 'application/vnd.atl.plugins.updateall+json',
        'disable-all': 'application/vnd.atl.plugins.disableall+json',
        'embedded-license-task': 'application/vnd.atl.plugins.embeddedlicense.installing+json',
        'upm': 'application/vnd.atl.plugins+json'
    };

    // Cachedesult of the last call to refreshProductVersionInfo.
    var productVersionInfo = {};

    // Resource URLs used by UpmEnvironment.getResourceUrl().  Empty and mutable because currently
    // many of these URLs are populated as a side effect of an Ajax call to the back end; others
    // come from hidden fields on the page.
    var resourceUrls = { };
    var resourceUrlTemplates = { };

    /**
     * Properties of the UPM environment, including host application properties, static UPM configuration,
     * and UPM user settings.
     *
     * This object is automatically passed as a parameter called "environment" to all Underscore templates
     * that are loaded from .vm files.
     */
    var UpmEnvironment = _.extend({}, UpmContextPathMixin, {
        applicationName: null,
        applicationVersion: null,
        
        /**
         * Queries the back end to see if anyone has ever accepted the Marketplace EULA.
         * @method checkMarketplaceEulaAccepted
         * @return {Promise}  a Promise which will be resolved (with a boolean value) when the query is
         *   complete, or rejected if the request fails
         */
        checkMarketplaceEulaAccepted: function() {
            return $.ajax({
                url: UpmEnvironment.getResourceUrl('user-accepted-mpac-eula')
            }).promise();
        },

        /**
         * Returns the application identifier ("jira", "confluence").
         * @method getApplicationKey
         * @return {String}
         */
        getApplicationKey: function() {
            return UpmEnvironment.getApplicationName().toLowerCase();
        },

        /**
         * Returns the displayable application name ("JIRA", "Confluence").
         * @method getApplicationName
         * @return {String}
         */
        getApplicationName: function() {
            return UpmEnvironment.applicationName || AJS.params['upm-product-application-name'] || $('#upm-product-application-name').val() || '';
        },

        /**
         * Returns the displayable application version string ("1.0").
         * @method getApplicationVersion
         * @return {String}
         */
        getApplicationVersion: function() {
            return UpmEnvironment.applicationVersion || $('#upm-product-application-version').val() || '';
        },

        /**
         * Returns one of UPM's custom content types.
         * @method getContentType
         * @param {String} id  logical type ID, e.g. "install"; if omitted, returns the default "upm" type
         * @return {String}  the content type or null if unknown
         */
        getContentType: function(id) {
            return contentTypes[id || 'upm'];
        },

        /**
         * Returns the current user's email address (stored in a hidden field).
         * @method getCurrentUserEmail
         * @return {String}
         */
        getCurrentUserEmail: function() {
            return AJS.params.upmCurrentUserEmail;
        },

        /**
         * Returns the current user's full name (stored in a hidden field).
         * @method getCurrentUserFullName
         * @return {String}
         */
        getCurrentUserFullName: function() {
            return AJS.params.upmCurrentUserFullName;
        },

        /**
         * Returns the current username (stored in a hidden field).
         * @method getCurrentUserName
         * @return {String}
         */
        getCurrentUserName: function() {
            return AJS.params.upmCurrentUsername;
        },

        /**
         * Returns the last known host application license properties.
         * @method getHostLicense
         * @return {Object}
         */
        getHostLicense: function() {
            return hostStatusModel.get('hostLicense');
        },

        /**
         * Returns the singleton model that tracks host properties such as safeMode, to allow
         * listening for changes on these properties.
         */
        getHostStatusModel: function() {
            return hostStatusModel;
        },

        /**
         * Returns the user count to use for price tier matching.  In Server, this is the edition
         * count from the host license.  In Cloud, it's the active user count.
         * @return {int}
         */
        getLicensedHostUsers: function() {
            return parseInt(AJS.params.upmLicensedHostUsers, 10) ||
                (UpmEnvironment.getHostLicense() && UpmEnvironment.getHostLicense().maximumNumberOfUsers);
        },

        /**
         * Returns the root URL of the Marketplace addons API, if available.
         * @return {String}
         */
        getMarketplaceAddonsApiUrl: function() {
            return AJS.params.upmMpacAddonsUrl;
        },

        /**
         * Returns the root URL of the Marketplace REST API, if available.  Trailing slashes if any
         * are removed.
         * @return {String}
         */
        getMarketplaceBaseUrl: function() {
            var url = AJS.params.mpacBaseUrl;
            return /\/$/.test(url) ? url.substring(0, url.length - 1) : url;
        },

        /**
         * Returns a Promise which is resolved only after all of the state managed by UpmEnvironment
         * (which includes some values that are loaded from the DOM) has been initialized.
         * @method getReadyState
         * @return {Promise}
         */
        getReadyState: function() {
            return readyState.promise();
        },

        /**
         * Returns one of the top-level resource links provided by the back end.  NOTE: It is
         * not safe to call this method from any code that runs prior to DOM-readiness, because
         * many of the resource links come from hidden fields on the page.
         * @method getResourceUrl
         * @param {String} rel  the link rel
         * @param {Object} properties  named template parameters if the link is a template
         * @return {String}  the URL
         */
        getResourceUrl: function(rel, properties) {
            return properties ? 
                processLinkTemplate(resourceUrlTemplates[rel], properties) :
                resourceUrls[rel];
        },

        /**
         * Returns the instance's server id.
         * @method getServerId
         * @return {String}  the instance's server id
         */
        getServerId: function() {
            return $('#upm-product-server-id').val() || '';
        },

        /**
         * Returns the plugin key of UPM.
         * @method getUpmPluginKey
         * @return {String}
         */
        getUpmPluginKey: function() {
            return 'com.atlassian.upm.atlassian-universal-plugin-manager-plugin';
        },

        /**
         * Extracts a query parameter value from the current URL, or from a specified URL.
         * @method urlParam
         * @param {String} name  the query parameter key
         * @param {String} url  optional URL; if omitted, will use the current browser URL
         * @return {String}  the query parameter value
         */
        getUrlParam: function(name, url) {
            url = url ? ((url.indexOf('?') >= 0) ? url.substring(url.indexOf('?')) : '')
                      : window.location.search;
            if (url && url.length > 0) {
                return urlParamFromQueryString(url.substring(1), name);
            }
            return '';
        },

        /**
         * Returns the current user key.
         * @method getUserKey
         * @return {String}
         */
        getUserKey: function() {
            return currentUserKey;
        },

        /**
         * Returns true if the user is allowed to view the specified UPM page.
         * @method hasPermissionFor
         * @param {String} pageKey  "manage", "install", "log", "compatibility", or "osgi"
         * @return {Boolean}
         */
        hasPermissionFor: function(pageKey) {
            switch (pageKey) {
                case 'manage': return !!UpmEnvironment.getResourceUrl('marketplace-installed');
                case 'install': return !!UpmEnvironment.getResourceUrl('featured');
                case 'log': return !!UpmEnvironment.getResourceUrl('audit-log');
                case 'compatibility': return !!UpmEnvironment.getResourceUrl('product-updates');
                case 'osgi': return !!UpmEnvironment.getResourceUrl('osgi-bundles');
                case 'settings': return !!UpmEnvironment.getResourceUrl('upm-settings');
                case 'install-file': return !!UpmEnvironment.getResourceUrl('install-file');
            }
            return false;
        },

        /**
         * Returns true if we are in a host product that supports add-on applications (e.g. JIRA 7+).
         * This flag is set by the back end.
         * @method isApplicationApiSupported
         * @return {Boolean}
         */
        isApplicationApiSupported: function() {
            return !!AJS.params.isApplicationApiSupported;
        },

        /**
         * Returns true if the host application's base URL may be wrong.
         * @method isBaseUrlInvalid
         * @return {Boolean}
         */
        isBaseUrlInvalid: function() {
            return !!hostStatusModel.get('baseUrlInvalid');
        },

        /**
         * Returns true if the host application is a Data Center instance.
         * @method isDataCenter
         * @return {Boolean}
         */
        isDataCenter: function() {
            var license = UpmEnvironment.getHostLicense();
            return license && license.dataCenter;
        },

        /**
         * Returns true if the host application is a development version.  This is the same as
         * the "development" property of the last result obtained from getProductVersionState(),
         * and is undefined if that method has never been called.
         * @method isDevelopmentProductVersion
         * @return {Boolean}
         */
        isDevelopmentProductVersion: function() {
            return productVersionInfo.development;
        },

        /**
         * Returns true if the application is in the context of a currently logged in user. This should almost always
         * return true as UPM's pages require authentication. The one known exception is FeCru's special administration
         * password which allows unauthenticated administration access to the application.
         * @method isLoggedInUser
         * @return {Boolean}
         */
        isLoggedInUser: function() {
            return !!UpmEnvironment.getCurrentUserFullName();
        },

        /**
         * Returns true if we think Marketplace is currently available and not disabled.
         * @method isMpacAvailable
         * @return {Boolean}
         */
        isMpacAvailable: function() {
            return !(UpmEnvironment.isMpacDisabled() || UpmEnvironment.isMpacUnavailable());
        },

        /**
         * Returns true if Marketplace integration has been disabled.
         * @method isPacDisabled
         * @return {Boolean}
         */
        isMpacDisabled: function() {
            return hostStatusModel.get('pacDisabled');
        },

        /**
         * Returns true if we think Marketplace is currently unavailable.
         * @method isPacUnavailable
         * @return {Boolean}
         */
        isMpacUnavailable: function() {
            return hostStatusModel.get('pacUnavailable');
        },

        /**
         * Returns true if we are in OnDemand mode.
         * @method isOnDemand
         * @return {Boolean}
         */
        isOnDemand: function() {
            return AJS.params.isOnDemand;
        },

        /**
         * Returns true if the host application has a free user tier *and* the current user count
         * is within that tier.
         */
        isPlatformFreeTier: function() {
            return !!AJS.params.isPlatformFreeTier;
        },

        /**
         * Returns true if we are currently in safe mode.
         * @method isSafeMode
         * @return {Boolean}
         */
        isSafeMode: function() {
            return !!hostStatusModel.get('safeMode');
        },

        /**
         * Returns true if the host application is an unknown version.  This is the same as
         * the "unknown" property of the last result obtained from getProductVersionState(),
         * and is undefined if that method has never been called.
         * @method isUnknownProductVersion
         * @return {Boolean}
         */
        isUnknownProductVersion: function() {
            return productVersionInfo.unknown;
        },

        /**
         * Returns the REST URL for an available add-on (the Find New page representation).
         * @method pathToAvailableAddonByKey
         * @param {String} addonKey
         * @return {String}
         */
        pathToAvailableAddonByKey: function(addonKey) {
            // TODO:  It would be good to use getResourceUrl() for this, but a link template is not always available from the back end
            return UpmEnvironment.getContextPath() + "/rest/plugins/1.0/available/" + addonKey + "-key";
        },

        /**
         * Returns the REST URL for an installed add-on (the Manage page representation).
         * @method pathToInstalledAddonByKey
         * @param {String} addonKey
         * @return {String}
         */
        pathToInstalledAddonByKey: function(addonKey) {
            // TODO:  It would be good to use getResourceUrl() for this, but a link template is not always available from the back end
            return UpmEnvironment.getContextPath() + "/rest/plugins/1.0/" + addonKey + "-key";
        },

        /**
         * Returns the REST URL for the "installed Marketplace" representation of an add-on (used on the
         * Find New page, but contains licensing details).
         * @method pathToInstalledMarketplaceAddonByKey
         * @param {String} addonKey
         * @return {String}
         */
        pathToInstalledMarketplaceAddonByKey: function(addonKey) {
            // TODO:  It would be good to use getResourceUrl() for this, but a link template is not always available from the back end
            return UpmEnvironment.getContextPath() + "/rest/plugins/1.0/" + addonKey + "/marketplace";
        },

        pathToManageApplicationsPage: function() {
            return AJS.params.upmUriManageApplications;
        },

        /**
         * Returns the web URL for opening a new add-on request.
         * @method pathToRequestAddonByKey
         * @param {String} addonKey
         * @return {String}
         */
        pathToRequestAddonByKey: function(addonKey) {
            return UpmEnvironment.getResourceUrl('plugin-requests', { pluginKey: addonKey });
        },

        /**
         * Signals that the notifications dropdown should be refreshed.
         * @method refreshNotifications
         */
        refreshNotifications: function() {
            // Note that we have to use AJS.$ here instead of $, because the event handler was installed with AJS.$ -
            // we should eventually replace this with some other event mechanism
            AJS.$('#upm-notifications').trigger('refreshNotifications');
        },

        /**
         * Queries the server to update the cached values of isMpacDisabled() and isMpacUnavailable().
         * @method refreshMpacAvailability
         * @return {Promise}  a Promise which will be resolved once the values are available,
         *   or rejected if the request fails
         */
        refreshMpacAvailability: function() {
            return $.ajax({
                url: UpmEnvironment.getResourceUrl('pac-status'),
                type: 'get',
                cache: false,
                dataType: 'json',
                data: null
            }).done(function(response) {
                UpmEnvironment.getHostStatusModel().set({
                    pacDisabled: response.disabled,
                    pacUnavailable: !response.reached
                });
            });
        },

        /**
         * Queries the server to determine the status of the current production version.  If
         * successful, provides an object with the boolean properties "development" and "unknown".
         * @method refreshProductVersionInfo
         * @return {Promise}  a Promise which will be resolved once the return value is available,
         *   or rejected if the request fails
         */
        refreshProductVersionInfo: function() {
            var url = UpmEnvironment.getResourceUrl('product-version');
            return $.ajax({
                url: url,
                cache: false,
                contentType: UpmEnvironment.getContentType(),
                dataType: 'json'
            }).then(function(response) {
                productVersionInfo = {
                    development: response.development,
                    unknown: response.unknown
                };
                return _.clone(productVersionInfo);
            });
        },

        /**
         * Informs the back end that the Marketplace EULA has been accepted.
         * @method setMarketplaceEulaAccepted
         * @return {Promise}  a Promise which will be resolved when the request is complete
         */
        setMarketplaceEulaAccepted: function() {
            return $.ajax({
                url: UpmEnvironment.getResourceUrl('user-accepted-mpac-eula'),
                type: 'PUT',
                contentType: UpmEnvironment.getContentType(),
                data: 'true'
            }).promise();
        },

        /**
         * Stores the link maps that we receive from the back end, which will be used by
         * UpmEnvironment.getResourceUrl().
         * @method setResourceUrls
         * @param {Object} linkMap  map of link rels to URLs
         * @param {Object} linkTemplateMap  map of link rels to URL templates
         */
        setResourceUrls: function(linkMap, linkTemplateMap) {
            resourceUrls = _.extend(resourceUrls, linkMap);
            resourceUrlTemplates = _.extend(resourceUrlTemplates, linkTemplateMap);
        }
    });

    /**
     * Extracts a query parameter value from the given query string
     * @method getParamFromUrl
     * @param {String} query the query string to extract the query parameter from
     * @param {String} param the query parameter key
     * @return {String} the query parameter value
     */
    function urlParamFromQueryString(query, param) {
        if (query) {
            var queryParams = query.split('&');

            for (var i = 0; i < queryParams.length; i++) {
                var p = queryParams[i].split('=');
                if (p[0] == param) {
                    return decodeURIComponent(p[1]).replace(/\+/g, ' ');
                }
            }
        }
        return '';
    }

    function processLinkTemplate(template, properties) {
        // If the resource template exists, process the template by replacing
        // all of the specified property names with the associated values.
        if (template) {
            for (var p in properties) {
                if (properties.hasOwnProperty(p)) {
                    template = template.replace('{' + p + '}', encodeURIComponent(properties[p]));
                }
            }
            return template;
        }
    }

    // Set the base resource URLs from AJS.params variables which are scraped from the DOM.
    // TODO: possibly reimplement this so we can just put a JSON map into the DOM instead of
    // all these individual hidden fields.
    $(function() {
        currentUserKey = AJS.params.upmCurrentUserKey;
        resourceUrls = _.extend(resourceUrls, {
            'token': AJS.params.upmUriToken,
            'marketplace-installed': AJS.params.upmUriInstalled,
            'pac-status': AJS.params.upmUriPacStatus,
            'pac-enable-communication': AJS.params.upmUriEnablePacCommunication,
            'pac-disable-communication': AJS.params.upmUriDisablePacCommunication,
            'enable-plugin-requests': AJS.params.upmUriEnablePluginRequests,
            'disable-plugin-requests': AJS.params.upmUriDisablePluginRequests,
            'product-updates': AJS.params.upmUriProductUpdates,
            'audit-log': AJS.params.upmUriAuditLog,
            'featured': AJS.params.upmUriFeatured,
            'popular': AJS.params.upmUriPopular,
            'top-grossing': AJS.params.upmUriTopGrossing,
            'highest-rated': AJS.params.upmUriHighestRated,
            'trending': AJS.params.upmUriTrending,
            'atlassian': AJS.params.upmUriByAtlassian,
            'top-vendor': AJS.params.upmUriTopVendor,
            'recent': AJS.params.upmUriAvailable,
            'marketplace': AJS.params.upmUriMarketplace,
            'plugin-requests': AJS.params.upmUriPluginRequestsPage,
            'categories': AJS.params.upmUriCategories,
            'banners': AJS.params.upmUriBanners,
            'install-file': AJS.params.upmUriInstallFile,
            'install-uri': AJS.params.upmUriInstallUri,
            'safe-mode': AJS.params.upmUriSafeMode,
            'enter-safe-mode': AJS.params.upmUriEnterSafeMode,
            'audit-log-purge-after': AJS.params.upmUriPurgeAfter,
            'audit-log-purge-after-manage': AJS.params.upmUriManagePurgeAfter,
            'osgi-bundles' : AJS.params.upmUriOsgiBundles,
            'osgi-services' : AJS.params.upmUriOsgiServices,
            'osgi-packages' : AJS.params.upmUriOsgiPackages,
            'pending-tasks': AJS.params.upmUriPendingTasks,
            'product-version': AJS.params.upmUriProductVersion,
            'create-requests': AJS.params.upmUriCreateRequests,
            'most-requested': AJS.params.upmUriViewRequests,
            'audit-log-servlet': AJS.params.upmUriAuditLogServlet,
            'available': AJS.params.upmUriAvailable,
            'purchases': AJS.params.upmUriPurchases,
            'update-licenses': AJS.params.upmUriUpdateLicenses,
            'update-licenses-signed': AJS.params.upmUriUpdateLicensesSigned,
            'analytics': AJS.params.upmUriAnalytics,
            'manage' : AJS.params.upmUriManage,
            'upm-settings' : AJS.params.upmUriSettings,
            'user-settings' : AJS.params.upmUriUserSettings,
            'user-accepted-mpac-eula' : AJS.params.upmUriAcceptedMpacEula,
            'create-eval-license' : AJS.params.upmUriCreateEvalLicense,
            'applications-rest': AJS.params.applicationsRest,
            'available-apps': AJS.params.availableApps,
            'atlassian-id-login' : AJS.params.upmUriAtlassianIdLogin,
            'billing-proxy': AJS.params.upmUriBillingProxy,
            'mpac-base-url': AJS.params.mpacBaseUrl
        });

        if (AJS.params.pacDisabled) {
            hostStatusModel.set('pacDisabled', AJS.params.pacDisabled);
        }

        if (AJS.params.pacUnavailable) {
            hostStatusModel.set('pacUnavailable', AJS.params.pacUnavailable);
        }

        readyState.resolve();
    });

    return UpmEnvironment;
});
