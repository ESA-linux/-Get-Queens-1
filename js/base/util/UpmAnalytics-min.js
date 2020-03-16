UPM.define("UpmAnalytics",["jquery","UpmEnvironment"],function(B,A){var C={logAddonEvent:function(F,D,E){if(A.getResourceUrl("analytics")){E=E||{};
E.type=F;
if(D){E.pk=D
}return B.ajax({type:"POST",url:A.getResourceUrl("analytics"),dataType:"json",contentType:A.getContentType(),data:JSON.stringify({data:E})})
}},logEvent:function(E,D){return C.logAddonEvent(E,null,D)
}};
return C
});