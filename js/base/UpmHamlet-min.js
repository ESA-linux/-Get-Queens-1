UPM.define("UpmHamlet",["UpmAjax","UpmEnvironment"],function(B,A){return{createEvaluationLicenseDirectly:function(D,F){var C=A.getResourceUrl("create-eval-license"),E={productKey:D};
if(!C){return 
}if(A.getServerId()){E.serverId=A.getServerId()
}return B.ajaxCorsOrJsonp({url:C,type:"post",contentType:"application/json",data:JSON.stringify(E),dataType:"json",headers:{"ATL-XSRF-Token":F},timeout:15000,xhrFields:{withCredentials:true}})
}}
});