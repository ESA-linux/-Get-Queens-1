UPM.define('AddonModel',
    [
        'jquery',
        'underscore',
        'brace',
        'AddonActions',
        'AddonPricingModel',
        'ExpandableModelMixin',
        'UpmAjax',
        'UpmAnalytics',
        'UpmContextPathMixin',
        'UpmEnvironment',
        'UpmMessageModel',
        'UpmPricing'
    ],
    function($,
             _,
             Brace,
             AddonActions,
             AddonPricingModel,
             ExpandableModelMixin,
             UpmAjax,
             UpmAnalytics,
             UpmContextPathMixin,
             UpmEnvironment,
             UpmMessageModel,
             UpmPricing) {

    "use strict";

    /**
     * Base model class for an add-on on any of the UPM pages.  Which properties are present will depend
     * on which page we're on and whether it is a summary representation or a full representation, so the
     * named property accessors are defined by the subclasses.  This base class provides a few helper
     * methods that are applicable to all.
     *
     * For summary representations, this model provides the ability to load the detail representation as
     * needed; see loadDetails.
     */
    return Brace.Model.extend({

        mixins: [ UpmContextPathMixin, ExpandableModelMixin ],

        // The following should only include the properties that are common to *all* add-on
        // representations.  Properties that are specific to installed add-on representations should
        // be in InstalledAddonModel; properties for available add-on representations should be in
        // MarketplaceAddonModel.
        namedAttributes: [
            "billingNotifications",
            "dataCenterCompatible",
            "statusDataCenterCompatible",
            "description",
            "hamsProductKey",
            "installedVersion",
            "hasDetails",
            "key",
            "licenseDetails",
            "links",
            "logo",
            "name",
            "restartState",
            "usesLicensing",
            "vendor",
            "version"
        ],

        /**
         * Triggers an event telling the enclosing view to scroll to this add-on and expand its details if necessary.
         * @method focus
         * @param {String|Object} message  optional parameter that will be passed along with the event
         * @return {Promise}  a Promise that will be resolved once both the browser scroll position and the
         *   view state have been updated
         */
        focus: function(message) {
            var deferred = $.Deferred();
            this.once('focused', function() {
                deferred.resolve();
            });
            this.trigger('focus', this, message);
            return deferred.promise();
        },

        /**
         * Checks whether a given action type is applicable to this add-on.
         *
         * @param {AddonActions} action  one of the constants defined in AddonActions
         * @return {Boolean}
         */
        isActionAllowed: function(action) {
            var state = this.getActionState(action);
            return (_.isObject(state) && state.enabled) || state;
        },

        /**
         * Returns true if the add-on's license can be updated by UPM, false if not.
         * @method isLicenseUpdatable
         * @return {Boolean}
         */
        isLicenseUpdatable: function() {
            var links = this.getLinks();
            return links && links['update-license'];
        },

        /**
         * Checks whether a given action type is applicable to this add-on.  May return either an
         * object with the properties "enabled" (boolean, true if the action can be performed) and
         * "disabledReason" (optional string, used by AddonActionButtonTemplate to select a tooltip if
         * we decide to show a disabled button for the action, ignored if "enabled" is true); or a
         * non-object value which is treated as the "enabled" property.
         *
         * Note that an action will still not be shown unless the view class includes it in the
         * list returned by _getActionsOrder.
         *
         * @param {AddonActions} action  one of the constants defined in AddonActions
         * @return {Boolean|Object}
         */
        getActionState: function(action) {
            return false;
        },

        getDefaultPurchaseAction: function() {
            return this.hasLink('upgrade') ? AddonActions.UPGRADE : AddonActions.BUY;
        },

        getEulaUrl: function() {
            return this.getLinks().eula;
        },

        getHighlights: function() {
            return this.getVersionDetails() && this.getVersionDetails().highlights;
        },

        getLinkOrPacResponseLink: function(rel) {
            return this.getLinks()[rel];
        },

        getPricingUrl: function() {
            return this.getLinkOrPacResponseLink('pricing');
        },

        getScreenshots: function() {
            return this.getVersionDetails() && this.getVersionDetails().screenshots;
        },

        // Overridden in subclasses to return the PacVersionDetails representation
        getVersionDetails: function() {
            return null;
        },

        hasLicense: function() {
            return !!this.getLicenseDetails();
        },

        hasLink: function(rel) {
            return !!(this.getLinks()[rel]);
        },

        hasRoleBasedPricing: function() {
            return this.pricingModel && this.pricingModel.isRoleBased();
        },

        /**
         * Returns true if this is an Atlassian Connect add-on (a.k.a. remotable).  Unfortunately, we
         * use two different names for this property in the back-end representations, so the default
         * implementation is a stub.
         * @method isAtlassianConnect
         * @return {Boolean}
         */
        isAtlassianConnect: function() {
            return false;
        },

        isAutoRenew: function() {
            return this.getLicenseDetails() && this.getLicenseDetails().autoRenewal;
        },

        /**
         * Returns true if the add-on is currently installed.  Unfortunately, we use two different names
         * for this property in the back-end representations, so the default implementation is a stub.
         * @method isInstalled
         * @return {Boolean}
         */
        isInstalled: function() {
            return false;
        },

        /**
         * Checks whether this add-on is UPM.
         * @method isUpm
         * @return {Boolean}
         */
        isUpm: function() {
            return this.getKey() === UpmEnvironment.getUpmPluginKey();
        },

        /**
         * Checks whether this add-on is made by Atlassian
         * @method isByAtlassian
         * @returns {Boolean}
         */
        isByAtlassian: function () {
            return this.getVendor() && (this.getVendor().name === 'Atlassian' || this.getVendor().name === 'Atlassian Labs');
        },

        isPaidViaAtlassian: function() {
            return !!this.getUsesLicensing();
        },

        /**
         * Returns or loads the model for the *installed* add-on representation.  If this was already such a
         * model, you'll just get the same model; if it was instead a MarketplaceAddonModel, then it requests
         * the installed add-on properties from the back end.
         * @method loadInstalledModel
         * @return {Promise}  a Promise which will be resolved with the requested model
         */
        loadInstalledAddonModel: function() {
            return $.Deferred().resolve(this);  // overridden by MarketplaceAddonModel
        },

        /**
         * Attempts to load the plugin's license details if we don't already have them in this representation,
         * and if there is a license link.
         *
         * @method loadLicenseDetails
         * @return {Promise}  a Promise which will be resolved once the license details are available - or if
         *   we have determined that they don't need to be loaded
         */
        loadLicenseDetails: function() {
            var me = this;
            if (this.getLicenseDetails() || !this.getLinks().license) {
                return $.Deferred().resolve(this.getLicenseDetails()).promise();
            } else {
                return $.ajax({
                    url: this.getLinks().license
                }).then(function(resp) {
                    if (resp && (resp.valid || resp.error)) {
                        me.setLicenseDetails(resp, { silent: true });
                        return me.loadOnDemandBillingNotifications().then(function(ns) {
                            if (ns) {
                                me.set(ns, { silent: true });
                            }
                            return resp;
                        });
                    }
                    return resp;
                }).fail(function(request) {
                    me.signalAjaxError(request);
                }).promise();
            }
        },

        /**
         * Attempts to load this add-on's billing notifications, if any.  This is called by ManageAddonModel
         * and MarketplaceAddonModel as part of requestDetails, but is not automatically done by the base
         * class because other model subclasses don't need it.
         * @param {Object} newProperties  optional, properties which have been refreshed for this add-on but
         *   are not yet in the model
         * @return {Promise}  a Promise which will be resolved when the request completes, providing
         *   an object that may or may not have a billingNotifications property.
         */
        loadOnDemandBillingNotifications: function(newProperties) {
            var me = this,
                latestModel = newProperties ? me.clone().clear().set(newProperties) : me,
                url = latestModel.getLinks()['billing-notifications'];

            // UPM-4975: The billing-notifications URL is only provided by the back end if we are in an
            // OnDemand environment, and the add-on is PvA, and the subscription is set to auto-renew.
            // There will only be notifications if the host application is within the free user tier,
            // and the add-on has opted out of the free tier; we only check those two conditions on the
            // front end, because the free tier information may not be available when the original
            // add-on representation is generated.
            if (url && UpmEnvironment.isPlatformFreeTier()) {
                return UpmAjax.ajaxViaBillingProxy({
                    url: url,
                    timeout: 5000
                }).then(function(resp) {
                    return (resp && resp.notifications && resp.notifications.length) ?
                        { billingNotifications: resp.notifications } : {};
                }).promise();
            } else {
                return $.Deferred().resolve({}).promise();
            }
        },

        /**
         * Requests the add-on's pricing, if any, from the Marketplace server.  The
         * pricing model will be stored within this model so subsequent requests will get
         * the same object.
         * @return {Promise}  a Promise which will be resolved with an AddonPricingModel
         *   (or with null if the add-on has no pricing)
         */
        loadPricingModel: function() {
            if (this.pricingModel) {
                return $.Deferred().resolve(this.pricingModel).promise();
            }
            else {
                var url = this.getPricingUrl(),
                    me = this;
                if (url) {
                    var deferred = $.Deferred();
                    $.ajax({
                        type: 'get',
                        url: url,
                        dataType: 'json',
                        error: deferred.resolve
                    }).then(function(resp) {
                        var pm = new AddonPricingModel(resp);
                        me.pricingModel = pm;
                        return pm;
                    }).done(deferred.resolve);
                    return deferred.promise();
                } else {
                    return $.Deferred().resolve().promise();
                }
            }
        },

        /**
         * Attempts to load the recommended add-ons for this add-on.
         *
         * @method loadRecommendations
         * @return {Promise}  a Promise which will be resolved when the request completes, providing
         *   an array of recommended plugin representations
         */
        loadRecommendations: function() {
            var url = this.getLinks().recommendations;
            if (url) {
                return $.ajax({
                    type: 'get',
                    cache: false,
                    url: url,
                    dataType: 'json'
                }).then(function(resp) {
                    return resp.recommendations || [];
                });
            } else {
                return $.Deferred().resolve([]).promise();
            }
        },

        /**
         * Sends an analytics event to the back end for this add-on.
         *
         * @method logAnalytics
         * @param type {String} the type of event
         * @param {Object} logData optional additional data to include in the analytics (plugin key will be added automatically)
         */
        logAnalytics: function(type, logData) {
            UpmAnalytics.logAddonEvent(type, this.getKey(), logData);
        },

        /**
         * Refreshes all of the model's properties from the server.  This will trigger a Backbone change event.
         * @method refresh
         * @return {Promise}  a promise which will be resolved once the refresh is complete
         */
        refresh: function() {
            var me = this,
                hadDetails = this.get('hasDetails'),
                key = this.getKey(),
                links = this.getLinks();

            // We must first remove all current properties, since if the server leaves a property empty,
            // Backbone will not remove the previously set model property.  Except we can't remove the
            // "key" property or "links.self" properties because our URL may depend on them.
            this.clear({ silent: true });
            this.set({ key: key, links: { self: links.self } }, { silent: true });

            if (hadDetails) {
                return this.loadDetails(true).done(function() {
                    me.trigger('change');
                });
            } else {
                return this._refreshSummary();
            }
        },

        /**
         * Refreshes only the base properties of the model.  Normally this would just be the same as
         * fetch(), but on the Manage page we need to load two resources.
         */
        _refreshSummary: function() {
            return this.fetch();
        },

        /**
         * Raises an "action" event on this model.  The event has two parameters:  the action type, and
         * the model itself (in case the event is forwarded through something else, like a collection).
         * @method signalAction
         * @param {String} action  one of the constants from AddonActions
         */
        signalAction: function(action) {
            this.trigger('action', action, this);
        },

        /**
         * Triggers an "ajaxError" event on this model based on the request properties.  The event's
         * parameter is an object with the properties "subCode" and optionally "message".
         * @method signalAjaxError
         * @param {XMLHttpRequest} request
         */
        signalAjaxError: function(request) {
            this.trigger('ajaxError', UpmAjax.parseErrorResponse(request));
        },

        /**
         * Sends an Ajax request to the back end to initiate an OnDemand license change.
         * @param {AddonActions} action  AddonActions.SUBSCRIBE, etc.
         * @return {Promise}
         */
        startOnDemandLicenseUpdate: function(action) {
            return $.ajax({
                url: this.getLinks()[action.legacyKey],
                type: 'POST',
                contentType: 'application/json',
                headers: {
                    'X-Atlassian-Token': 'no-check'
                }
            }).promise();
        },

        /**
         * Sends a "please release a compatible version" request to the vendor.
         * @method submitUpdateRequest
         * @param {String} message  optional message text
         * @param {Boolean} shareDetails  true if we can send the user's email adddress to the vendor
         * @return {Promise}  a Promise which will be resolved on success
         */
        submitUpdateRequest: function(message, shareDetails) {
            return $.ajax({
                url: this.getLinks()['request-update'],
                type: 'post',
                contentType: UpmEnvironment.getContentType(),
                dataType: 'text',
                data: JSON.stringify({ message: message, pluginKey: this.getKey(), shareDetails: shareDetails })
            }).fail(_.bind(this.signalAjaxError, this))
              .promise();
        },

        /**
         * Overridden so that synthetic properties are available to templates.
         */
        toJSON: function() {
            return _.extend({}, Brace.Model.prototype.toJSON.apply(this), {
                atlassianConnect: this.isAtlassianConnect(),
                installed: this.isInstalled(),
                paidViaAtlassian: this.isPaidViaAtlassian(),
                roleBased: this.hasRoleBasedPricing()
            });
        },

        /**
         * Serializes the model to JSON without adding any synthetic properties that are not in the plugin
         * representation.  This is used only when we have to call back to legacy code.
         */
        toPluginRep: function() {
            return Brace.Model.prototype.toJSON.apply(this);
        },

        /**
         * Triggers an arbitrary event on this model that is wrapped inside another event; AddonView will
         * handle this by first expanding the add-on details if they weren't already expanded, and then
         * triggering the actual (unwrapped) event.  Use this for events that are handled by the detail view
         * and that should always cause it to appear.
         * @param {String} eventName  the event name; you can also include any number of event arguments
         */
        triggerEventAfterExpanding: function() {
            this.trigger("expandAndThen", arguments);
        },

        /**
         * Triggers an event on this model that will cause the AddonView to first expand the add-on details
         * if necessary, and then display a message at the top of the details.
         * @param {Object} messageOptions  properties to pass to the UpmMessageModel constructor
         */
        triggerMessage: function(messageOptions) {
            this.triggerEventAfterExpanding('message', new UpmMessageModel(messageOptions));
        },

        /**
         * Tells the back end to modify the add-on's license.  If successful, this triggers events to update
         * the add-on's visible state.
         * @method updateLicense
         * @param {String} licenseString  the new license key; null or empty to remove the license
         */
        updateLicense: function(licenseString) {
            var data = _.extend({}, this.getLicenseDetails(), { rawLicense: licenseString }),
                licenseNotEmpty = licenseString && (licenseString.trim() !== ''),
                oldProperties = this.toJSON(),
                me = this;

            return $.ajax({
                type: licenseNotEmpty ? 'PUT' : 'DELETE',
                url: this.getLinks()['update-license'],
                contentType: UpmEnvironment.getContentType(),
                data: JSON.stringify(data)
            }).then(
                function(response) {
                    UpmEnvironment.refreshNotifications();
                    // we refresh the whole model in case the license change caused other plugin state changes
                    return me.refresh().then(function() {
                        me.triggerEventAfterExpanding('licenseUpdated', oldProperties);
                        return response;
                    });
                },
                _.bind(this.signalAjaxError, this)
            ).promise();
        }
    });
});
