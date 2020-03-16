(function(){var E=require.noConflict();
UPM.require=E.require;
UPM.define=E.define;
var C=Brace.noConflict(),A=Backbone.noConflict(),D=_.noConflict(),B=$.noConflict(true);
UPM.define("jquery",function(){return B
});
UPM.define("aui/flag",function(){return require("aui/flag")
});
UPM.define("underscore",function(){return D
});
UPM.define("backbone",["jquery"],function(){return A
});
UPM.define("brace",["backbone"],function(){return C
});
if(!UPM.trace){UPM.trace=function(){}
}})();