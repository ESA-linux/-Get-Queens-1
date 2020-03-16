UPM.define('AddonModuleModel',
    [
        'jquery',
        'underscore',
        'brace',
        'UpmAjax',
        'UpmEnvironment'
    ],
    function($,
             _,
             Brace,
             UpmAjax,
             UpmEnvironment) {

    "use strict";

    return Brace.Model.extend({
        namedAttributes: [
            'completeKey',
            'description',
            'enabled',
            'key',
            'links',
            'name',
            'optional',
            'recognisableType',
            'broken'
        ],

        disable: function() {
            return this._enableOrDisable(false);
        },

        enable: function() {
            return this._enableOrDisable(true);
        },

        _enableOrDisable: function(enabling) {
            var data = _.extend({}, this.toJSON(), { enabled: enabling }),
                me = this;
            return $.ajax({
                type: 'PUT',
                url: this.getLinks().self,
                dataType: 'json',
                contentType: UpmEnvironment.getContentType('module'),
                data: JSON.stringify(data),
            }).done(function(response) {
                me.set(response);
                me.trigger(enabling ? 'moduleEnabled' : 'moduleDisabled', me);
            }).fail(function(request) {
                me.trigger('ajaxError', UpmAjax.parseErrorResponse(request), me);
            });
        }
    });
});
