/**
 * Mixin for views that have an expandable detail element.  The model should use
 * ExpandableModelMixin.
 *
 * The view must define a property "detailViewClass" which is the view class for the details.
 */
UPM.define('ExpandableViewMixin',
    [
        'jquery',
        'underscore'
    ],
    function($,
             _) {

    var fadeoutDelay = 500;

    return {

        getDetailsContainer: function() {
            return this.$el.find('div.upm-details');
        },

        isExpanded: function() {
            return this.$el.hasClass('expanded');
        },

        /**
         * Causes the whole row to disappear the next time the user collapses the details.
         * @method removeOnNextCollapse
         * @param {Backbone.Collection} collection  optional - pass this if the model might exist in more than one
         *   collection, to specify which one to remove it from
         */
        removeOnNextCollapse: function(collection) {
            if (collection || this.model.collection) {
                this.listenToOnce(this, 'collapsed', function() {
                    this.$el.fadeOut(fadeoutDelay, _.bind(function() {
                            (collection || this.model.collection).remove(this.model);
                        }, this));
                });
                this.$el.addClass('to-remove');  // this is only for the benefit of UI tests
            }
        },

        /**
         * Standard click handler for toggling row expansion.  The view must bind this to $el.
         */
        _onRowClick: function(e) {
            if (!e.isDefaultPrevented()) {
                // if we're clicking on a button or a link, don't toggle the details
                if (!$(e.target).closest('a, button').length) {
                    e.preventDefault();
                    this._toggleExpanded();
                }
            }
        },

        /**
         * Immediately creates the detail view.
         * @method _renderDetails
         * @protected
         */
        _renderDetails: function() {
            var DetailsViewClass = this.detailViewClass,
                detailsView = new DetailsViewClass({ model: this.model }).render();
            this.$el.removeClass('loading').addClass('expanded');
            this.getDetailsContainer().empty().append(detailsView.$el).addClass('loaded');
            detailsView.listenTo(this, 'unbound', detailsView.stopListening);
        },

        /**
         * Collapses the detail view.
         *
         * @method _collapseDetails
         * @protected
         */
        _collapseDetails: function() {
            if (this.isExpanded()) {
                this.$el.removeClass('expanded');
                this.trigger('collapsed');
            }
        },

        /**
         * Expands the detail view, loading details from the back end if necessary.
         *
         * @method _expandDetails
         * @protected
         * @return {Promise}  a Promise that is resolved once the details have been loaded/expanded
         */
        _expandDetails: function() {
            var me = this,
                deferred = $.Deferred();

            if (this.isExpanded() || this.getDetailsContainer().hasClass('loaded')) {
                if (!this.isExpanded()) {
                    this.$el.addClass('expanded');
                    me.trigger('expanded');
                }
                deferred.resolve(true);
            } else {
                if (!this.model.getHasDetails()) {
                    this.$el.addClass('loading');
                }
                this.model.loadDetails()
                    .done(function() {
                        me._renderDetails();
                        me.trigger('expanded');
                        me.$el.trigger('pluginLoaded');  // required only for compatibility with legacy upm.js code
                        deferred.resolve(true);
                    }).fail(function(request) {
                        // expand the detail area even though there's no content for it, so we can display an error there
                        me.$el.removeClass('loading').addClass('expanded');
                        me.getDetailsContainer().addClass('error loaded');  // necessary for UI tests
                        me.model.signalAjaxError(request);
                        deferred.resolve(true);
                    });
            }
            return deferred
                .done(function() {
                    UPM.trace("details-expanded");  // for UI test sync
                }).promise();
        },

        /**
         * Expands the detail view (loading details from the back end if necessary), or hides it
         * if it is already expanded.
         * @method _toggleExpanded
         * @protected
         * @return {Promise}  a Promise that is resolved once the expand/collapse is done
         */
        _toggleExpanded: function(e) {
            if (this.isExpanded()) {
                this._collapseDetails();
                return $.Deferred().resolve(false).promise();
            } else {
                return this._expandDetails();
            }
        }
    };
});
