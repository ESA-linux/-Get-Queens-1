UPM.define('OsgiBundleDetailsView',
    [
        'jquery',
        'underscore',
        'BaseView',
        'OsgiBundleDetailsTemplate',
        'OsgiBundleLinkTemplate',
        'OsgiServicesTemplate'
    ], function($,
                _,
                BaseView,
                OsgiBundleDetailsTemplate,
                bundleLinkTemplate,
                servicesTemplate) {

    "use strict";

    function formatParsedHeaders(parsedHeaders) {
        return _.map(parsedHeaders || {}, function(clauses, headerName) {
            return {
                name: headerName,
                clauses: _.map(clauses, formatHeaderClause(headerName))
            }
        });
    }

    function formatHeaderClause(headerName) {
        return function(clause) {
            var description,
                paramDescs,
                referencesHtml,
                referenceType,
                status;
            paramDescs = _.map(clause.parameters, function(value, key) {
                return key + ': ' + ((value.length > 64) ? '[...]' : value);
            });
            if (headerName === 'Import-Package' || headerName === 'DynamicImport-Package') {
                referenceType = 'import';
                if (clause.referencedPackage) {
                    status = 'resolved';
                    referencesHtml = formatBundleLink(clause.referencedPackage.exportingBundle);
                } else {
                    status = clause.parameters['resolution'] == 'optional' ? 'optional' : 'unresolved';
                }
            } else if (headerName === 'Export-Package') {
                referenceType = 'export';
                if (clause.referencedPackage) {
                    referencesHtml = _.map(clause.referencedPackage.importingBundles, formatBundleLink).join(', ');
                    status = clause.referencedPackage.importingBundles.length ? 'resolved' : 'optional'
                } else {
                    status = 'unresolved';
                }
            }
            return {
                path: clause.path,
                paramsSummary: paramDescs.join(', '),
                referencesHtml: referencesHtml,
                referenceType: referenceType,
                status: status
            };
        }
    }

    function formatServicesHtml(services, type) {
        if (!services || !services.length) {
            return '';
        } else {
            var transformedServices = _.map(services, function(service) {
                var referencesHtml;
                if (type === 'registered') {
                    referencesHtml = _.map(service.usingBundles, formatBundleLink).join(', ');
                } else {
                    referencesHtml = formatBundleLink(service.bundle);
                }
                return {
                    id: service.id,
                    objectClasses: service.objectClasses,
                    referencesHtml: referencesHtml
                }
            });
            var params = {
                    services: transformedServices,
                    type: type
                };
            return servicesTemplate(params);
        }
    }

    function formatBundleLink(bundle) {
        return bundleLinkTemplate({ bundle: bundle });
    }

    return BaseView.extend({

        _initEvents: function() {
            this.listenTo(this.model, 'change', this.render, this);
        },

        template: OsgiBundleDetailsTemplate,

        _getData: function() {
            return {
                bundle: this.model.toJSON(),
                parsedHeaders: formatParsedHeaders(this.model.getParsedHeaders()),
                servicesRegisteredHtml: formatServicesHtml(this.model.getRegisteredServices(), 'registered'),
                servicesInUseHtml: formatServicesHtml(this.model.getServicesInUse(), 'in-use')
            };
        }
    });
});
