UPM.define("ManageAddonsRouter",["underscore","backbone","brace","UpmContextPathMixin"],function(B,E,C,A){var D=C.Router.extend({routes:{"":"setFilter",settings:"settingsDialog",":key":"setFilter"},start:function(){E.history.start({root:A.getContextPath()+"/plugins/servlet/upm/manage",pushState:window.history&&window.history.pushState})
},navigateTo:function(G,F){this.navigate(G,B.defaults(F||{},{replace:false,trigger:true}))
}});
return new D()
});