UPM.define("AddonView",["jquery","underscore","brace","AddonActions","AddonActionsViewMixin","AddonActionButtonTemplate","BaseView","ExpandableViewMixin","UpmEnvironment","UpmFormats","UpmStrings"],function(E,K,I,J,C,G,F,H,B,A,D){return F.extend({mixins:[C,H],_initEvents:function(){this.listenTo(this.model,"change",this._rerenderOnChange);
this.listenTo(this.model,"ajaxError",this._onAjaxError);
this.listenTo(this.model,"expandAndThen",this._onExpandAndThen);
this.listenTo(this.model,"focus",this._onFocus);
if(this.model.collection){this.listenTo(this.model.collection,"remove",this._onCollectionItemRemoved)
}this.listenTo(this,"expanded",this._onExpanded);
this.listenTo(this,"collapsed",this._onCollapsed)
},_rerenderOnChange:function(){var L=this.isExpanded();
this.render();
if(L){this._expandDetails()
}},_getActionsOrder:function(){return[]
},_getMaxTopLevelActions:function(){return null
},_canBePrimaryAction:function(L){return true
},_shouldShowActionAsLink:function(M,L){return false
},_shouldShowDisabledActionsWithReasons:function(){return false
},_getData:function(){return{plugin:this.model.toJSON()}
},_postRender:function(){this.$el.find("div.upm-plugin-row").on("click",K.bind(this._onRowClick,this));
this.$el.find(".upm-plugin-vendor a, .upm-plugin-support a").click(function(L){L.stopPropagation()
});
this._renderActionButtons(this.$el.find(".upm-plugin-actions"))
},_onAjaxError:function(S){var O=this;
var R,L,N,P=this.model.getName(),M=function(T,V,U){return A.format(T,A.htmlEncode(U||V.pluginName||(V.status&&V.status.source)||D["upm.plugin.unknown"],A.htmlEncode(V.moduleName||D["upm.plugin.module.unknown"])))
};
if(S){if(typeof S=="string"){try{S=JSON.parse(S)
}catch(Q){AJS.log("Failed to parse response text: "+Q)
}}R=S.errorMessage||S.message||(S.status&&S.status.errorMessage);
L=S.subCode||(S.status&&S.status.subCode)||(S.details&&S.details.error.subCode);
if(L&&D[L]&&(L!="ajaxServerError")){R=M(D[L],S,P)
}else{if(!R||R.match(/^[0-9][0-9][0-9]$/)){R=D["upm.plugin.error.unexpected.error"]
}else{R=M(R,S,P)
}}}else{R=D["upm.plugin.error.unexpected.error"]
}this.model.triggerMessage({type:"error",message:R})
},_onCollectionItemRemoved:function(L){if(L===this.model){this.$el.remove()
}},_onCollapsed:function(){this.$el.find(".upm-plugin-notice .aui-lozenge").removeClass("aui-lozenge-subtle");
this._removeMessage()
},_onExpanded:function(){this.$el.find(".upm-plugin-notice .aui-lozenge").addClass("aui-lozenge-subtle")
},_onExpandAndThen:function(L){var M=this;
var N=function(){M.model.trigger.apply(M.model,L)
};
if(L){if(this.isExpanded()){N()
}else{this._expandDetails().done(N)
}}},_onFocus:function(M){var L=this;
E(window).scrollTop(this.$el.offset().top-10);
this._expandDetails().done(function(){L.model.trigger("focused")
})
},_removeMessage:function(){var L=this.$el.closest("div.aui-message.closeable");
if(L.length===0){L=this.$el.closest("div.upm-plugin").find("div.aui-message.closeable")
}L.trigger("close").remove()
}})
});