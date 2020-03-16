UPM.define("BaseView",["brace","jquery","underscore","SingleItemRenderingStrategy"],function(B,C,A,D){return B.View.extend({initialize:function(E){this.options=E;
this._compileTemplate();
this._initEvents();
this._postInitialize()
},stopListening:function(){B.View.prototype.stopListening.apply(this);
this._unbindEventsFromSubViews()
},renderingStrategy:D,_initEvents:function(){},_postInitialize:function(){},render:function(){this._unbindEventsFromSubViews();
var E=this._getHtml();
if(E){this.renderingStrategy(E)
}this._postRender();
return this
},_postRender:function(){},_getHtml:function(){if(this._compiledTemplate){return this._compiledTemplate(this._getData())
}else{return""
}},_getData:function(){return this.model.toJSON()
},_getTemplate:function(){return(this.options&&this.options.template)||this.template
},_compileTemplate:function(){var F=this._getTemplate();
if(F&&typeof F==="string"){var E;
this._compiledTemplate=function(G){if(!E){E=A.template(C.trim(C(F).html()))
}return C.parseHTML(E(G))
}
}else{if(typeof F==="function"){this._compiledTemplate=F
}}},_unbindEventsFromSubViews:function(){this.trigger("unbound")
}})
});