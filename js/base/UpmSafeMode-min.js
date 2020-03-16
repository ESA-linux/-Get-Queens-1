UPM.define("UpmSafeMode",["jquery","brace","UpmAjax","UpmCommonUi","UpmDialog","UpmEnvironment","UpmLongRunningTasks","UpmStrings","EnterSafeModeConfirmDialogTemplate","ExitSafeModeConfirmDialogTemplate","SafeModeStatusTemplate"],function(E,P,M,J,Q,L,R,I,D,G,C){var B=new P.Evented();
var A={onSafeModeChanged:function(S){L.getHostStatusModel().on("change:safeMode",function(T){if(T._previousAttributes.safeMode!==undefined){S()
}})
},refreshSafeModeState:function(){E.ajax({type:"GET",cache:false,url:L.getResourceUrl("safe-mode"),dataType:"json",contentType:L.getContentType("safe-mode"),success:function(S){L.setResourceUrls(S.links);
L.getHostStatusModel().set({safeMode:S.enabled})
},error:function(S){M.signalAjaxError(S)
}})
},showEnterSafeModeDialog:function(){new Q({template:D}).getResult().done(O)
},showExitSafeModeRestoreStateDialog:function(){F(false)
},showExitSafeModeKeepStateDialog:function(){F(true)
}};
function F(S){new Q({template:G,data:{keepState:S}}).getResult().done(function(){K(S)
})
}function N(U,S,T,V){R.startProgress(S);
if(!R.abortIfHasPendingTask()){E.ajax({type:"PUT",url:L.getResourceUrl(T),dataType:"json",contentType:L.getContentType("safe-mode"),data:JSON.stringify({enabled:U,links:{}}),success:function(W){L.setResourceUrls(W.links);
V();
L.getHostStatusModel().set({safeMode:U});
R.stopProgress().done(function(){UPM.trace("safe-mode-changed")
})
},error:function(W){R.stopProgress().done(function(){if(W.status=="409"){A.refreshSafeModeState()
}M.signalAjaxError(W);
UPM.trace("safe-mode-changed")
})
}})
}}function O(){N(true,"safeMode.enable","enter-safe-mode",function(){J.clearMessages()
})
}function K(S){var T=S?"safeMode.keepState":"safeMode.restore",U=S?"exit-safe-mode-keep":"exit-safe-mode-restore",V=I[S?"upm.messages.safeMode.keepState.success":"upm.messages.safeMode.restore.success"];
N(false,T,U,function(){J.showMessage({type:"success",message:V,className:"safeMode"})
})
}function H(){var S=L.isSafeMode(),T=!S&&L.getResourceUrl("enter-safe-mode");
canExitSafeMode=S&&(L.getResourceUrl("exit-safe-mode-restore")||L.getResourceUrl("exit-safe-mode-keep"));
if(S){E("#upm-safe-mode-off").replaceWith(C({canExitSafeMode:canExitSafeMode}))
}E("#upm-container").toggleClass("upm-safe-mode",S);
E("#link-bar-safe-mode").toggleClass("hidden",!T)
}B.listenTo(L.getHostStatusModel(),"change:safeMode",H);
E(function(){E(document).on("click","#upm-safe-mode-enable",function(S){S.preventDefault();
A.showEnterSafeModeDialog()
});
E(document).on("click","#upm-safe-mode-restore",function(S){S.preventDefault();
A.showExitSafeModeRestoreStateDialog()
});
E(document).on("click","#upm-safe-mode-keep-state",function(S){S.preventDefault();
A.showExitSafeModeKeepStateDialog()
})
});
L.getReadyState().done(H);
return A
});