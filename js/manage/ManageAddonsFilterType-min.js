UPM.define("ManageAddonsFilterType",["underscore","UpmEnvironment","UpmStrings"],function(L,C,E){function F(O,N,M){return{key:O,title:E[N],predicate:M,ordering:I}
}function D(M){return M.isActionRequired()&&!M.isApplicationPlugin()
}function I(N,M){function Q(R){return R.getPrimaryAction()?R.getPrimaryAction().priority:999
}var O=Q(N),P=Q(M);
if(O!=P){return O-P
}else{return A(N,M)
}}function A(N,M){var P=N.getName().toLowerCase(),O=M.getName().toLowerCase();
return(P>O)?1:((P<O)?-1:0)
}function H(M){return M.isApplicationPlugin()
}function G(M){return M.isPaidViaAtlassian()&&!M.isApplicationPlugin()
}function K(M){return(M.getUserInstalled()||M.isActionRequired())&&!M.isApplicationPlugin()
}function J(M){return !M.getUserInstalled()&&!M.isActionRequired()&&!M.isApplicationPlugin()
}var B={ACTION_REQUIRED:F("action-required","upm.manage.action.required.dropdown",D),APPLICATIONS:F("applications","upm.manage.applications.dropdown",H),PAID_VIA_ATLASSIAN:F("paid-via-atlassian","upm.manage.paid.via.atlassian.dropdown",G),USER_INSTALLED:F("user-installed","upm.manage.user.installed.dropdown",K),SYSTEM:F("system","upm.manage.system.dropdown",J),ALL:F("all","upm.manage.all.dropdown",function(){return true
}),allFilters:function(){var M=[B.ACTION_REQUIRED,B.PAID_VIA_ATLASSIAN,B.USER_INSTALLED,B.APPLICATIONS,B.SYSTEM,B.ALL];
return C.isApplicationApiSupported()?M:L.without(M,B.APPLICATIONS)
},bestFilterForAddon:function(M){if(M.getApplicationKey()&&C.isApplicationApiSupported()){return B.APPLICATIONS
}else{if(M.isActionRequired()){return B.ACTION_REQUIRED
}else{if(M.isPaidViaAtlassian()){return B.PAID_VIA_ATLASSIAN
}else{if(!M.getUserInstalled()){return B.SYSTEM
}else{return B.USER_INSTALLED
}}}}},defaultFilter:function(){return B.USER_INSTALLED
},filtersForShowingAllAddons:function(){if(C.isApplicationApiSupported()){return[B.USER_INSTALLED,B.APPLICATIONS,B.SYSTEM]
}else{return[B.USER_INSTALLED,B.SYSTEM]
}},fromKey:function(M){return L.findWhere(B.allFilters(),{key:M})
},ordering:I};
return B
});