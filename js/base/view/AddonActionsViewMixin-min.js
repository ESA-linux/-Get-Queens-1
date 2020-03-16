UPM.define("AddonActionsViewMixin",["jquery","underscore","AddonActionButtonTemplate","UpmBrowserDetection"],function(B,A,D,C){return{_renderActionButtons:function(J){var H,E,G=this.model.toJSON(),F=this;
function K(L){return function(M){if(F._checkButtonDisabledState(M)){M.preventDefault();
F.model.signalAction(L)
}}
}if(J.length){H=A.compact(A.map(this._getActionsOrder(),function(M){var L=F.model.getActionState(M);
if(A.isObject(L)){return(L.enabled||(L.disabledReason&&F._shouldShowDisabledActionsWithReasons()))?{action:M,disabledReason:!L.enabled&&L.disabledReason}:null
}else{return L?{action:M}:null
}}));
var I=false;
E=A.map(H,function(M,N){var P,O,L,Q;
L=!F._shouldShowActionAsLink(M.action,N);
Q=!I&&L&&F._canBePrimaryAction(M.action,N);
I=I||Q;
P={action:M.action,plugin:G,disabledReason:M.disabledReason,isButton:L,isPrimary:Q};
O=B(D(P));
O.find("a").on("click",K(M.action));
return O
});
J.prepend(E);
if(C.isIE){J.find(".upm-plugin-actions .aui-button:first").addClass("first")
}}},_checkButtonDisabledState:function(F){var E=B(F.target);
if(E.hasClass("disabled")||E.prop("disabled")||E.attr("aria-disabled")==="true"){F.stopImmediatePropagation();
return false
}return true
}}
});