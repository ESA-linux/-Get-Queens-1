UPM.define("ManageAddonsListContainerView",["jquery","underscore","brace","BaseCollectionView","InstallOrLicenseResultDialog","ManageAddonsFilterType","ManageAddonsSectionView","ManageAddonsRouter","UpmEnvironment","UpmFormats","UpmStrings"],function(E,K,H,J,G,A,I,F,C,B,D){return J.extend({itemView:I,initialize:function(){this.collection=new H.Collection();
J.prototype.initialize.apply(this)
},_initEvents:function(){J.prototype._initEvents.apply(this);
this.listenTo(this.model,"change:busy",this._onChangeBusy);
this.listenTo(this.model,"sync",this._onListLoaded);
this.listenTo(this.model,"request",this._onRefreshStarted);
this.listenTo(this.model,"change:filter",this._showAddonsForSelectedFilter);
this.listenTo(this.model,"change:searchText",this._onSearchTextChanged);
this.listenTo(this.model.getAllAddonsCollection(),"focus",this._onFocusAddon)
},_isAddonVisible:function(L){return this.model.isShowingAllAddons()||K.contains(this.model.getFilteredAddons(),L)
},_onChangeBusy:function(){this.$el.toggleClass("loading",this.model.isBusy())
},_onFocusAddon:function(M,O){if(!this._isAddonVisible(M)){var L=A.bestFilterForAddon(M);
var N=L?L.key:"";
F.navigateTo(N);
if(this._isAddonVisible(M)){M.focus(O)
}}},_onListLoaded:function(){var M=this.model;
M.set("busy",false);
if(!M.isLoaded()){M.setLoaded(true);
var N=M.getFocusedAddon();
if(!M.getFilter()){if(N){M.setFilter(A.bestFilterForAddon(N))
}else{M.setFilter(A.defaultFilter())
}}this._showAddonsForSelectedFilter();
var L=function(){UPM.trace("manage-addons-loaded")
};
if(N){N.focus().done(function(){if(M.getFocusedAddonMessage()){var O=M.getFocusedAddonMessage().split(":"),P=O[0],Q=O.length>1?O[1]:"";
if(P=="licensed"){if(Q){new G({model:N,errorHtml:B.format(D[Q],B.htmlEncode(N.getName()))})
}else{new G({model:N,newLicense:N.getLicenseDetails(),nextAction:N.hasLink("post-install")?"get-started":null})
}}else{if(P=="trial_stopped"){N.triggerMessage({type:"warning",message:D["upm.messages.license.trial.unsubscribed"]})
}}}L()
})
}else{L()
}}else{this._showAddonsForSelectedFilter()
}},_onRefreshStarted:function(){this.$el.children().addClass("hidden")
},_onSearchTextChanged:function(){var L=this.model.getSearchText();
this.collection.each(function(M){M.trigger("filterBySearchText",L)
});
UPM.trace("manage-addons-filtered-by-name")
},_showAddonsForSelectedFilter:function(){var N,M=this;
if(!this.model.isLoaded()){return 
}this.model.setBusy(true);
if(this.model.isShowingAllAddons()){N=K.map(A.filtersForShowingAllAddons(),function(O){return{addons:M.model.getFilteredAddons(O),type:O}
})
}else{N=[{addons:this.model.getFilteredAddons(),type:this.model.getFilter()}]
}this.collection.reset(N);
var L=C.getResourceUrl("update-all")&&(this.model.getBatchUpdatableAddons().length>0);
E("#upm-update-all-container").toggleClass("hidden",!L);
if(this.model.isTextSearchActive()){this._onSearchTextChanged()
}this.model.setBusy(false);
UPM.trace("manage-addons-list-loaded")
}})
});