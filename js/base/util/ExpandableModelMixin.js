/**
 * Mixin for a model that is initially loaded with a subset of properties, and can then
 * be expanded to load a full representation of itself.  The model must provide a boolean
 * property, "hasDetails", which is initially false.
 */
 UPM.define('ExpandableModelMixin',
    [
        'jquery',
        'underscore'
    ],
    function($, _) {

    "use strict";

    return {
        /**
         * Attempts to load a fuller representation of this model.  If successful, the detail attributes are
         * merged into the model and the "hasDetails" property is set.
         *
         * @method loadDetails
         * @param {Boolean} forceRefresh  true if the details should be reloaded even if we already have some
         * @return {Promise}  a Promise which will be resolved when the details are available
         */
        loadDetails: function(forceRefresh) {
            var me = this;
            if (this.getHasDetails() && !forceRefresh) {
                return $.Deferred().resolve().promise();
            } else {
                var request = this._requestDetails ? this._requestDetails() : this._requestDefaultDetails();
                return request.done(
                    function(resp) {
                        me.mergeAttributes(resp, true);
                        me.set({ hasDetails: true }, { silent: true });
                        // "silent: true" suppresses change events - any views that were already bound to this
                        // model should not be re-rendered just because it acquired some more properties
                    }
                ).promise();
            }
        },

        /**
         * Implement this function if the REST request for loadDetails needs to do anything other than
         * just querying this.url().
         *
         * @method requestDetails
         * @return {Promise}  should be resolved with an object containing all the detail properties
         */
        // _requestDetails: function() { },

        _requestDefaultDetails: function() {
            return  $.ajax({
                type: 'get',
                cache: false,
                url: this.url(),
                dataType: 'json'
            });
        },

        /**
         * Sets attributes on the model that were received from the back end, but does not overwrite
         * every existing attribute-- specifically, the links map will be selectively merged.  This
         * allows us to enrich the model with a representation from resource B, without losing links
         * that were already provided by resource A.
         *
         * @method mergeAttributes
         * @param {Object} attributes  map of attributes to set
         * @param {Boolean} silent  true if change events should be suppressed
         */
        mergeAttributes: function(attributes, silent) {
            var attrsToMerge;
            if (this.has('links')) {
                attrsToMerge = _.extend(_.omit(attributes, 'links'),
                    attributes.links ? { links: _.extend({}, this.get('links'), _.omit(attributes.links, 'self')) } : {});
            } else {
                attrsToMerge = attributes;
            }
            this.set(attrsToMerge, { silent: silent });
        }
    };
});
