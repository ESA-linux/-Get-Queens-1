/**
 * Map of i18n string values obtained from UpmStringsTemplate.
 * @singleton
 */
UPM.define('UpmStrings',
    [
        'StringsLoader',
        'UpmStringsTemplate'
    ],
    function(StringsLoader, upmStringsTemplate) {

    return StringsLoader(upmStringsTemplate());
});
