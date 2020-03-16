UPM.define("UpmContextPathMixin", function() {
    return {
        /**
         * Returns the context path based on the current window's path.
         *
         * Delegates to existing contextPath functions or variables if present.
         * Alternatively generates a context path from the current window's path.
         *
         * @returns {String} The context path.
         */
        getContextPath: function() {
            if (AJS && typeof AJS.contextPath === "function") {
                return AJS.contextPath();
            }

            if (window.contextPath) {
                return window.contextPath;
            }

            return this._processContextPath(window.location.pathname);
        },

        /**
         * Returns the context path based on a UPM path.
         *
         * @param path The path to inspect.
         * @returns {String} The context path
         * @private
         */
        _processContextPath: function(path) {
            return path.split("/plugins/servlet/upm")[0];
        }
    }
});