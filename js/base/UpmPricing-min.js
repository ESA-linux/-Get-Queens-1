UPM.define("UpmPricing",["jquery","underscore","PricingDescriptionTemplate","UpmEnvironment"],function(F,J,A,B){var E={getRoleBasedPricingDescription:function(M,N,P){var O;
if(!M||!M.length){return null
}O=J.sortBy(M,G);
if(O[0].monthsValid===1){return J.map(M,function(Q){return"<div>"+E.getPricingDescription(Q,{roleInfo:N})+"</div>"
}).join("")
}else{return E.getPricingDescription(M[0],{actionText:P,roleInfo:N})
}},getPricingDescription:function(M,N){return A({pricing:M,renewal:N&&N.renewal,roleInfo:N&&N.roleInfo,rolePerUser:N&&N.rolePerUser,truncated:N&&N.truncated,actionText:N&&N.actionText,dataCenter:N&&N.dataCenter}).trim()
},findActiveNonRoleBasedTier:function(M){if(B.getHostLicense()&&!B.getHostLicense().evaluation){var N=J.filter(M,D());
return N.length?J.min(N,G):null
}return null
},findAvailableRoleBasedTiers:function(N,M){if(B.getHostLicense()&&!B.getHostLicense().evaluation){var P=M.getLicenseDetails()&&M.getLicenseDetails().upgradable,O=J.filter(N,H(P));
return J.sortBy(O,G)
}return[]
},findTiersAboveUnitCount:function(M,N){return J.filter(M,function(O){return(I(O.unitCount)>N)
})
},findHighestTierForLicenseType:function(M){var N=J.filter(M,C());
return N.length?J.max(N,G):null
}};
function D(){var N=B.getLicensedHostUsers(),M=C();
return function(O){return M(O)&&(I(N)<=I(O.unitCount))
}
}function H(O){var N=B.getLicensedHostUsers(),M=C();
return function(P){return M(P)&&(O||(I(P.unitCount)<=I(N)))
}
}function C(){var M=L(),O=B.getHostLicense(),N=12;
return function(P){return K(P.licenseType,M)&&(P.monthsValid===N)
}
}function L(){var M=B.getHostLicense()&&B.getHostLicense().licenseType;
return(M==="DEVELOPER")?"COMMERCIAL":M
}function K(M,P){var O=M&&M.toLowerCase(),N=P&&P.toLowerCase();
return(O===N)||(O==="starter"&&N==="commercial")||(O==="commercial"&&N==="starter")
}function I(M){return(M>=0)?M:Number.MAX_VALUE
}function G(M){return I(M.unitCount)
}return E
});