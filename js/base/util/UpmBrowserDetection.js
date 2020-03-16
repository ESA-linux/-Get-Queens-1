UPM.define('UpmBrowserDetection',
    [
        'jquery'
    ],
    function($) {

    /**
     * An abstraction to avoid using more general browser detection APIs - only the user agent
     * variations that UPM really needs to know about are detected here.  This is adapted
     * from older versions of JQuery's $.browser which newer versions do not support.
     */

    var userAgent = navigator.userAgent.toLowerCase(),
        isIE = /msie/.test( userAgent ) && !/opera/.test( userAgent ),
        version = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
        versionNum = parseInt(version, 10);

    return {
        isIE: isIE,
        isIE8AndLower: isIE && versionNum < 9,
        isIE9AndLower: isIE && versionNum < 10,
        version: version
    };
});
