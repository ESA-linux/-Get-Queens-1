UPM.define("UpmContextPathMixin",function(){return{getContextPath:function(){if(AJS&&typeof AJS.contextPath==="function"){return AJS.contextPath()
}if(window.contextPath){return window.contextPath
}return this._processContextPath(window.location.pathname)
},_processContextPath:function(A){return A.split("/plugins/servlet/upm")[0]
}}
});