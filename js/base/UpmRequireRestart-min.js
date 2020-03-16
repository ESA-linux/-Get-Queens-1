UPM.define("UpmRequireRestart",["jquery","brace","UpmAjax","UpmCommonUi","UpmEnvironment","UpmLongRunningTasks","ChangesRequiringRestartTemplate"],function(F,I,A,J,B,C,H){var D=new I.Collection();
var L={addChangeRequiringRestart:function(N){var M;
M=D.findWhere({key:N.key});
if(M){M.set(N)
}else{D.add(N)
}},checkForChangesRequiringRestart:function(){F.ajax({url:B.getResourceUrl("changes-requiring-restart"),type:"get",cache:false,dataType:"json",success:function(M){D.reset(M.changes)
},error:function(M){A.signalAjaxError(M)
}})
}};
function K(){var O=F(H({changes:D.toJSON()})),N=O.find("#upm-requires-restart-list"),M=O.find("#upm-requires-restart-show");
O.on("click","a.upm-requires-restart-cancel",function(S){var P=F(S.target).closest("li"),R=F(S.target).closest("li").attr("data-key"),Q=D.findWhere({key:R});
S.preventDefault();
S.target.blur();
if(Q){G(Q,P.attr("data-cancel-message"))
}});
M.click(function(P){P.preventDefault();
P.target.blur();
N.toggleClass("hidden");
M.text(N.hasClass("hidden")?M.attr("data-show-label"):M.attr("data-hide-label"))
});
return O
}function G(M,N){if(!C.abortIfHasPendingTask()){F.ajax({type:"DELETE",url:M.get("links").self,contentType:B.getContentType("requires-restart"),success:function(O){J.showMessage({type:"info",message:N});
D.remove(M)
},error:function(O){L.checkForChangesRequiringRestart();
A.signalAjaxError(O)
}})
}}function E(){var M=F("#upm-messages .changes-requiring-restart");
if(D.length){F("#upm-container").addClass("requires-restart");
if(M.length){M.replaceWith(K())
}else{F("#upm-messages").append(K())
}}else{F("#upm-container").removeClass("requires-restart");
M.remove()
}}D.on("add change remove reset",E);
return L
});