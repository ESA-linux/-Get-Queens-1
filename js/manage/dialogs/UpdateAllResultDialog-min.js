UPM.define("UpdateAllResultDialog",["jquery","underscore","AddonActions","CommonInstallAndLicensingFlows","ManageAddonsPageModel","UpmDialog","UpdateAllResultDialogTemplate"],function(G,D,A,C,F,B,E){return B.extend({template:E,events:{"click .extra-action .aui-button":"_onAddonActionClick"},constructor:function(){B.prototype.constructor.apply(this,arguments)
},_getData:function(){var H=this.options.successes||[],J=this.options.failures||[],I=[],L=[],K=[A.BUY,A.TRY,A.UPGRADE,A.RENEW];
D.each(H,function(M){var N=[];
if(M.links){N=D.filter(K,function(O){return !!M.links[O.legacyKey]
});
if(!N.length&&M.links["post-update"]){N.push(A.GET_STARTED)
}if(M.links["change-requiring-restart"]){L.push({key:M.key,name:M.name,version:M.version})
}}if(N.length){I.push({key:M.key,name:M.name,version:M.version,actions:N})
}});
this.actionItems=I;
return{successCount:H.length,totalCount:H.length+J.length,actionItems:I,requiresRestartItems:L}
},_onAddonActionClick:function(M){var L=G(M.target),H=L.closest(".extra-action"),J=H.attr("data-key"),K=A[L.attr("data-action")],I=F.getAddonModelByKey(J);
M.preventDefault();
H.find(".checkmark").addClass("checked");
if(K&&I){switch(K){case A.GET_STARTED:I.logAnalytics("postupdate",{dialog:true});
window.open(I.getLinks()["post-update"]);
break;
default:C.submitMarketplaceActionToMAC(I,K,null,true);
break
}}}})
});