UPM.define("ManageAddonsPageModel",["jquery","underscore","brace","ManageAddonModel","ManageAddonsFilterType","UpmAjax","UpmContextPathMixin","UpmEnvironment","UpmHostStatusMixin","UpmLongRunningTasks","UpmRequireRestart"],function(G,K,J,C,B,A,H,D,I,E,L){var F=J.Model.extend({namedAttributes:["busy","filter","focusedAddonKey","focusedAddonMessage","links","loaded","searchText","upmUpdateVersion"],mixins:[I,H],url:function(){return D.getResourceUrl("marketplace-installed")+"?updates=true"
},initialize:function(){this.allAddons=new J.Collection([],{model:C});
this._bindHostStatus()
},isBusy:function(){return !!this.get("busy")
},isLoaded:function(){return !!this.get("loaded")
},fetch:function(){var M=this;
this.set("busy",true);
this.trigger("request");
return G.ajax({url:this.url(),cache:false,dataType:"json"}).then(function(N){return G.ajax({url:N.links.alternate,cache:false,dataType:"json"}).done(function(O){return G.extend(true,O,N)
})
}).done(function(N){M.allAddons.reset(N.plugins);
M.set({links:N.links,upmUpdateVersion:N.upmUpdateVersion});
M.trigger("sync",M,N)
}).fail(A.signalAjaxError)
},focusAddonByKey:function(N){var M=this.getAddonModelByKey(N);
if(M){M.trigger("focus",M)
}},getAddonModelByKey:function(M){return this.allAddons.findWhere({key:M})
},getAllAddonsCollection:function(){return this.allAddons
},getFilteredAddons:function(M){var N=M||this.getFilter();
if(N){var O=this.getAllAddonsCollection().filter(N.predicate);
return N.ordering?O.sort(N.ordering):O
}else{return[]
}},getFocusedAddon:function(){return this.getFocusedAddonKey()&&this.getAddonModelByKey(this.getFocusedAddonKey())
},getBatchUpdatableAddons:function(){return this.getAllAddonsCollection().filter(function(M){return M.isUpdatable()&&!M.isUpm()&&!M.getUpdatableToPaid()
})
},getIncompatibleAddons:function(){return this.getAllAddonsCollection().filter(function(M){return M.getEnabled()&&M.getPrimaryAction()&&M.getPrimaryAction().incompatible
})
},getNonDataCenterApprovedApps:function(){return this.getAllAddonsCollection().filter(function(M){return M.getEnabled()&&M.getPrimaryAction()&&M.getPrimaryAction().nonDataCenterApproved
})
},isShowingAllAddons:function(){return this.getFilter()===B.ALL
},isTextSearchActive:function(){return this.getSearchText()&&(this.getSearchText().trim()!=="")
},isUpmUpdatable:function(){return this.getUpmUpdateVersion()&&this.getAllAddonsCollection().any(function(M){return M.isUpm()&&M.isUpdatable()
})
},setAddons:function(M){this.allAddons.reset(M)
}});
return new F()
});