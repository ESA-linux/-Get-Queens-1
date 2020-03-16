UPM.define('UpmFormats',
    [
        'jquery',
        'underscore',
        'UpmHtmlSanitizer'
    ],
    function($, _, UpmHtmlSanitizer) {
    
    // Non-Almond dependencies:
    // AJS.format (provided by all applications)

    /**
     * Helper functions for string formatting.
     *
     * This object is automatically passed as a parameter called "formats" to all Underscore templates that
     * are loaded from .vm files.
     */
    var UpmFormats = {
        /**
         * Renders a string with optional Java MessageFormat placeholders.  This is just an alias for AJS.format
         * to minimize explicit references to the AJS namespace, except it also adds the following behavior: if
         * the formatString parameter is an array, it is treated as singular and plural format strings and passed
         * to formatSingularOrPlural.
         *
         * Typically the format string will come from an i18n property string.  If you are using this within an
         * Underscore template, you will first need to expand the i18n string using a Velocity directive (since
         * .vm files are rendered by Velocity prior to being parsed by Underscore).  See templates/README.
         *
         * @method format
         * @param {String|Array} formatString
         * @return {String}
         */
        format: function(formatString, params) {
            if (_.isArray(formatString)) {
                return UpmFormats.formatSingularOrPlural(formatString[0], formatString[1], params);
            } else {
                return AJS.format.apply(AJS, arguments);
            }
        },

        /**
         * Renders a MessageFormat-style string with a single numeric parameter, using one format string if
         * the parameter is 1, and another if it's any other numbner.
         *
         * @method formatSingularOrPlural
         * @param {String} singularFormat  format string to use if count is 1
         * @param {String} pluralFormat  format string to use if count is not 1
         * @param {Number} count
         * @return {String}
         */
        formatSingularOrPlural: function(singularFormat, pluralFormat, count) {
            return UpmFormats.format((count === 1) ? singularFormat : pluralFormat, count);
        },
        
        /**
         * Returns a numeric string with commas between every 3 digits.
         * @method formatNumberWithCommas
         * @param {Number} number
         * @return {String}
         */
        formatNumberWithCommas: function(number) {
            if (number) {
                return (number + '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            } else {
                return 0;
            }
        },

        /**
         * Encodes text, converting invalid HTML characters to escaped values.
         * @method htmlEncode
         * @param {String} text Text to be encoded
         * @return {String} encoded text
         */
        htmlEncode: function(text) {
            // UPM-4655 do not attempt to html encode undefined values as it is unnecessary and causes JS errors
            if (text !== undefined && text !== null) {
                return $('<div/>').text(text).html();
            }
        },
        
        /**
         * Takes a string of HTML elements and limits the number of top-level elements returned.
         *
         * If more elements are found than allowable, an ellipsis is appended to the returned list of elements.
         *
         * @param {String} elementString The string of HTML.
         * @param {Number} max The maximum number of elements.
         * @return {String} A limited list of elements.
         */
        limitElementCount: function(elementString, max) {
            if (elementString) {
                var els = $.parseHTML(elementString);
                if (els.length > max) {
                    return $('<div></div>').append(els.slice(0, max)).append("<div class='ellipsis'>&hellip;</div>").html();
                } else {
                    return elementString;
                }
            }
        },

        /*
         * Takes a timestamp and returns localized string representation
         * @method prettyDate
         * @param {String|Number} time A timestamp
         * @return {String} A localized representation of the timestamp
         */
        prettyDate: function(time) {
            var date,
                exp = /([0-9])T([0-9])/;
            if (typeof time == 'string') {
                if ((time).match(exp)) {
                    // ISO time.  We need to do some formatting to be able to parse it into a date object
                    time = time
                        // for the Date ctor to use UTC time
                        .replace(/Z$/, " -00:00")
                        // remove 'T' separator
                        .replace(exp,"$1 $2");
                }
                // more formatting to make it parseable
                time = time
                    // replace dash-separated dates with forward-slash separated
                    .replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/g,"$1/$2/$3")
                    // get rid of semicolon and add space in front of timezone offset (for Safari, Chrome, IE6)
                    .replace(/\s?([-\+][0-9]{2}):([0-9]{2})/, ' $1$2');
            }
            date = new Date(time || "");
            return date.toLocaleString();
        },

        /**
         * Sanitizes an HTML string using the default sanitizer policy.
         * @param {String} s
         * @return {String} the sanitized string
         */
        sanitizeHtml: function(s) {
            return UpmHtmlSanitizer.html_sanitize(s, htmlSanitizerUrlPolicy);
        },

        /**
         * Sanitizes an HTML string and then strips all <a> tags, retaining the link text as ordinary text.
         * @param {String} s
         * @return {String} the sanitized string
         */
        sanitizeHtmlAndRemoveLinks: function(s) {
            var $html = $('<span></span>').append($.parseHTML(UpmFormats.sanitizeHtml(s)));
            $html.find('a').each(function() {
                var el = $(this);
                el.replaceWith(el.html());
            });
            return $html.html();
        },

        /**
         * Sanitizes an HTML string and also modifies all <a> tags to add target="_blank".
         * @param {String} s
         * @return {String} the sanitized string
         */
        sanitizeHtmlAndSetLinksToNewWindow: function(s) {
            var $html = $('<span></span>').append($.parseHTML(UpmFormats.sanitizeHtml(s)));
            $html.find('a').each(function() {
                $(this).attr('target', '_blank');
            });
            return $html.html();
        },

        /**
         * Safely turn html entities in text into regular characters
         * @method unescapeHtmlEntities
         * @param {String} text The text with html entities
         * @return {String} The text with html entities converted to their unicode equivalents, eg "&amp;" > " "
         */
        unescapeHtmlEntities: function(text) {
            return $('<div></div>').html(text).text();
        }
    };

    /**
     * A transform to apply to url attribute values.
     * @method htmlSanitizerUrlPolicy
     * @param url {String} URL to validate
     * @return {String} the url, if it passed the policy check, null otherwise
     */
    function htmlSanitizerUrlPolicy(url) {
        if (/^https?:\/\//.test(url)) {
            return url;
        }
        return null;
    }

    return UpmFormats;
});
