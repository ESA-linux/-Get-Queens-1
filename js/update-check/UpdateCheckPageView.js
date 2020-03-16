UPM.define('UpdateCheckPageView', [
        'underscore',
        'BaseView',
        'UpdateCheckPageTemplate',
        'UpdateCheckResultsView',
        'UpmAjax',
        'UpmLoadingViewMixin'
    ], function(_,
                BaseView,
                pageTemplate,
                UpdateCheckResultsView,
                UpmAjax,
                UpmLoadingViewMixin) {

    return BaseView.extend({

        mixins: [ UpmLoadingViewMixin ],

        template: pageTemplate,

        events: {
            'change #upm-compatibility-version': '_onChangeVersion',
            'click .submit': '_onSubmit'
        },

        _getData: function() {
            return {
                availableVersions: this.options.availableVersions
            };
        },

        _postRender: function() {
            this._onChangeVersion();
        },

        _getResultsContainer: function() {
            return this.$el.find('#upm-compatibility-content');
        },

        _getSelectedVersionInfo: function() {
            var selectedUrl = this.$el.find('#upm-compatibility-version').val();
                selectedVer = selectedUrl && _.find(this.options.availableVersions,
                    function(v) { return v.links.self === selectedUrl; });
            return selectedVer && {
                url: selectedVer.links.self,
                version: selectedVer.version,
                recent: selectedVer.recent
            };
        },

        _onChangeVersion: function() {
            var $button = this.$el.find('.submit');
            if (this._getSelectedVersionInfo()) {
                $button.prop('disabled', false).removeClass('disabled');
            } else {
                $button.prop('disabled', true).addClass('disabled');
            }
        },

        _onSubmit: function(e) {
            var versionInfo = this._getSelectedVersionInfo();
            e.preventDefault();
            if (versionInfo) {
                var $button = this.$el.find('.submit');
                if ($button) {
                    $button.prop('disabled', true).addClass('disabled');
                }
                this._getResultsContainer().empty();
                this.model.fetchResults(versionInfo.url, versionInfo.version, versionInfo.recent)
                    .done(_.bind(function() {
                        var resultsView = new UpdateCheckResultsView({ model: this.model });
                        this._getResultsContainer().append(resultsView.render().$el);
                    }, this))
                    .fail(UpmAjax.signalAjaxError);
            }
        }
    });
});
