UPM.define("AddonModuleModel",["jquery","underscore","brace","UpmAjax","UpmEnvironment"],function(E,B,C,D,A){return C.Model.extend({namedAttributes:["completeKey","description","enabled","key","links","name","optional","recognisableType","broken"],disable:function(){return this._enableOrDisable(false)
},enable:function(){return this._enableOrDisable(true)
},_enableOrDisable:function(F){var H=B.extend({},this.toJSON(),{enabled:F}),G=this;
return E.ajax({type:"PUT",url:this.getLinks().self,dataType:"json",contentType:A.getContentType("module"),data:JSON.stringify(H),}).done(function(I){G.set(I);
G.trigger(F?"moduleEnabled":"moduleDisabled",G)
}).fail(function(I){G.trigger("ajaxError",D.parseErrorResponse(I),G)
})
}})
});