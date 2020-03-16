UPM.define("UpmDialog",["jquery","underscore","BaseView"],function(H,D,E){var A=E.extend({forceModal:true,_getData:function(){return(this.options&&this.options.data)||(this.model&&this.model.toJSON())
},initialize:function(){E.prototype.initialize.apply(this,arguments);
this.deferredResult=H.Deferred();
this.render();
this._postInitialize()
},render:function(){var J=H(this._getHtml().trim()),I;
this.dialogWrapper=B(this,J);
this.$el=this.dialogWrapper.$el;
this.getConfirmButton().on("click",D.bind(function(K){K.preventDefault();
this._onConfirm()
},this));
this.getCancelButton().on("click",D.bind(function(K){K.preventDefault();
this._onCancel()
},this));
this._postRender();
if(!(this.options&&this.options.createHidden)){this.show()
}return this
},close:function(){this.dialogWrapper.remove();
this.$el=null
},getResult:function(){return this.deferredResult.promise()
},show:function(){this.dialogWrapper.show();
this._postShow()
},hide:function(){this.dialogWrapper.hide()
},getButtonPanel:function(){return this.dialogWrapper.$buttonPanel
},getCancelButton:function(){return this.getButtonPanel().find(".cancel")
},getConfirmButton:function(){return this.getButtonPanel().find(".confirm")
},setHeader:function(I){this.dialogWrapper.setHeader(I)
},_onCancel:function(){this.close();
this.deferredResult.reject()
},_onConfirm:function(){var I=this._getReturnValue();
this.close();
this.deferredResult.resolve(I)
},_getReturnValue:function(){var I=this.$el.find("form");
if(I.length===1){var J={};
D.each(I.serializeArray(),function(K){J[K.name]=K.value
});
return J
}return null
},_postShow:function(){}});
function B(L,M){var I,K,J;
if(AJS.dialog2){if(L.forceModal){M.attr("data-aui-modal","true")
}K=AJS.dialog2(M);
J=K.$el;
G(J);
I={dialog:K,$el:J,$buttonPanel:J.find(".aui-dialog2-footer-actions"),hide:function(){K.hide()
},remove:function(){if(K.$el){K.remove()
}},setHeader:function(N){J.find(".aui-dialog2-header h2").text(N)
},show:function(){K.show()
}}
}else{K=C(L,M);
J=K.popup.element;
I={dialog:K,$el:J,$buttonPanel:J.find(".dialog-button-panel"),hide:function(){K.hide()
},remove:function(){if(K.popup.element){K.remove()
}},setHeader:function(N){K.addHeader(N)
},show:function(){K.show();
F(K)
}}
}return I
}function C(L,P){var I=P.find(".aui-dialog2-header"),J=P.find(".aui-dialog2-content"),M=L.forceModal||(P.attr("data-aui-modal")==="true"),K,Q,N,O;
if(P.hasClass("aui-dialog2-small")){K=400
}else{if(P.hasClass("aui-dialog2-large")){K=800
}else{K=600
}}Q={id:P.attr("id"),closeOnOutsideClick:!M,width:K,height:400,keypressListener:function(R){if(R.keyCode===27){N.popup.element.find(".dialog-button-panel .cancel").click()
}}};
N=new AJS.Dialog(Q);
O=N.popup.show;
N.popup.show=function(){G(N.popup.element);
O.apply(this,arguments);
if(Q.autoHeight){N.popup.element.find(".dialog-panel-body").css("height","")
}};
N.addHeader(I.find("h2").text(),I.find("h2").attr("class"));
J.removeClass("aui-dialog2-content");
N.addPanel("main",J);
P.find(".aui-dialog2-footer .aui-dialog2-footer-actions button").each(function(){var S=H(this),R=S.attr("class")+" upm-dialog-footer-button";
if(S.hasClass("cancel")){R+=" button-panel-cancel-link"
}if(S.hasClass("aui-button-link")){N.addLink(S.text(),null,R)
}else{N.addButton(S.text(),null,R)
}});
return N
}function F(K){if(K){var I=0;
for(var J=0;
K.getPanel(J);
J++){if(K.getPanel(J).body.css({height:"auto",display:"block"}).outerHeight()>I){I=K.getPanel(J).body.outerHeight()
}if(J!==K.page[K.curpage].curtab){K.getPanel(J).body.css({display:"none"})
}}for(J=0;
K.getPanel(J);
J++){K.getPanel(J).body.css({height:I||K.height})
}K.getPanel(0).body.css({height:I});
K.page[0].menu.height(I);
K.height=I+106;
K.popup.changeSize(undefined,I+106)
}}function G(I){I.find("form").append('<input type="submit" class="hidden-submit-button" hidefocus="true" tabindex="-1">')
}return A
});