UPM.define('InstallParams',
    [
        'brace',
        'UpmEnvironment'
    ], function(Brace,
                UpmEnvironment) {

    "use strict";

    /**
     * Model for the parameters that can be returned by UploadDialog.
     */
    return Brace.Model.extend({
        namedAttributes: [
            'filePath',
            'url'
        ],

        /**
         * Returns the short name of the selected file, if any.
         */
        getFileName: function() {
            if (this.getFilePath()) {
                var fileNameParts = this.getFilePath().split('\\');
                return fileNameParts[fileNameParts.length - 1];
            } else {
                return null;
            }
        }
    });
});
