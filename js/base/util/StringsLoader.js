/**
 * Reads a template that contains any number of <tt>&lt;div id="key"&gt;string&lt;/div&gt;
 * entries and converts it to a map.  Any string that contains markup should be HTML-escaped,
 * which happens automaticaly if you use <tt>$i18n.getText()</tt>.
 * @singleton
 */
UPM.define('StringsLoader',
    [
        'jquery'
    ],
    function($) {

    return function(templateString) {
        var $stringsContainer = $('<div></div>').html(templateString);
        var ret = {};
        $stringsContainer.find('div').each(function() {
            var $s = $(this);
            ret[$s.attr('id')] = $s.text();
        });
        return ret;
    };
});
