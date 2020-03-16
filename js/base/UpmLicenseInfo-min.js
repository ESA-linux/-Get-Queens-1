UPM.define("UpmLicenseInfo",["jquery","UpmEnvironment","LicenseDescriptionTemplate","LicenseStatusTemplate"],function(D,A,E,C){var B={getLicenseDescription:function(G){var M=A.getApplicationKey(),L=B.isRoleBasedLicense(G),F=G&&(G.maintenanceExpiryDateString||G.subscriptionEndDateString),K,H,I,J;
if(G){if(G.maximumNumberOfUsers===undefined){K="unlimited"
}else{if(G.maximumNumberOfUsers===1){K="single"
}else{if(G.maximumNumberOfUsers===0&&M==="bamboo"){K="local"
}else{K="limited"
}}}}H={license:G,isActive:!B.isUnlicensed(G),isRemoteAgents:M==="bamboo",isRoleBased:L,canBeEnterprise:!L&&("jira"===M||"confluence"===M||"stash"===M||"bitbucket"===M),countType:K,expiryDate:F};
I=D("<span></span>");
I.html(E(H).trim());
J=I.find(".upm-license-expiry");
if(F){J.replaceWith(J.text())
}else{J.remove()
}return I.html()
},getLicenseStatusDescription:function(I,G){var L=A.getApplicationKey(),K=B.isRoleBasedLicense(G),F,J,H;
if(K){if(G.maximumNumberOfUsers===undefined){F=G.currentRoleCount
}else{F=G.maximumNumberOfUsers
}J=F!=1?G.typeI18nPlural:G.typeI18nSingular
}H={enabled:I.enabled,license:G,isRemoteAgents:L==="bamboo",isRoleBased:K,roleLabel:J};
return C(H).trim()
},isUnlicensed:function(F){return !F||(F.subscription&&!F.active)
},isRoleBasedLicense:function(F){return F&&(typeof F.currentRoleCount!=="undefined")&&D.isNumeric(F.currentRoleCount)
}};
return B
});