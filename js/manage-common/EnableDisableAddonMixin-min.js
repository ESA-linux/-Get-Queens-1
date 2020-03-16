UPM.define("EnableDisableAddonMixin",["jquery","underscore","backbone","AddonActions","UpmEnvironment"],function(D,C,E,B,A){return{enableOrDisable:function(F){var G=this;
return this.loadDetails().then(function(){var H=C.clone(G.attributes);
H.enabled=F;
return D.ajax({type:"PUT",url:G.url(),dataType:"json",contentType:A.getContentType("plugin"),data:JSON.stringify(H)}).then(function(){return G.refresh()
})
}).fail(function(H){G.signalAjaxError(H)
}).promise()
},isEnableOrDisableActionAllowed:function(F){if(F===B.DISABLE||F===B.ENABLE){if(!this.getUnloadable()&&this.getLinks().modify&&(this.getOptional()!==false||!this.getEnabled())&&!this.isUpm()){return this.getEnabled()===(F===B.DISABLE)
}}return false
}}
});