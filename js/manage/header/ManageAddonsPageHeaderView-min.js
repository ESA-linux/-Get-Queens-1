UPM.define("ManageAddonsPageHeaderView",["jquery","underscore","brace","BaseView","FancySelectForm","ManageAddonsFilterType","ManageAddonsRouter","UpmEnvironment","UpmFormats","UpmMessageFactory","UpmStrings"],function(G,L,K,H,M,C,I,E,D,B,F){var A=200,J;
return H.extend({events:{"click #upm-disable-all":"_onDisableAllClick","click #upm-update-all":"_onUpdateAllClick","click #upm-upload":"_onUploadClick"},initialize:function(){var S,R,P,N,Q=this;
function O(){I.navigateTo(R.getSelectedValue("filter"))
}S=G("#upm-manage-type-wrap");
L.each(C.allFilters(),function(U){var T=G("<option></option").attr("value",U.key).text(U.title);
if(U===C.defaultFilter()){T.attr("selected","selected")
}S.find("select").append(T)
});
S.find(".selected-value p").text(C.defaultFilter().title);
R=S.fancySelectForm({onSelection:O});
O();
this.listenTo(this.model,"change:filter",function(){R.selectOption("filter",Q.model.getFilter()&&Q.model.getFilter().key,true)
});
this.listenTo(this.model,"change:loaded",this._updateStateAfterLoading);
P=this._getSearchTextField();
N=this._getSearchTextDefaultValue();
P.on("focus",function(){if(P.val()===N){P.val("");
P.addClass("upm-textbox-active")
}});
P.on("blur",function(){if(P.val()===""){P.val(N);
P.removeClass("upm-textbox-active")
}});
P.on("keyup input change propertychange",L.bind(this._onSearchTextChange,this));
if(P.val()!=P.attr("data-default-value")){this._applySearchText()
}},_applySearchText:function(N){this.model.setSearchText(this._getSearchTextField().val())
},_getSearchTextDefaultValue:function(){return this._getSearchTextField().attr("data-default-value")
},_getSearchTextField:function(){return G("#upm-manage-filter-box")
},_onDisableAllClick:function(N){N.preventDefault();
this.model.trigger("disableAllIncompatible")
},_onSearchTextChange:function(P){var O=this._getSearchTextField(),Q=O.val(),N=this;
if(P.type=="propertychange"&&Q===this._getSearchTextDefaultValue()){return 
}if(J!==Q){J=Q;
setTimeout(function(){if(O.val()===Q){N._applySearchText()
}},A)
}},_onUpdateAllClick:function(N){N.preventDefault();
this.model.trigger("updateAll")
},_onUploadClick:function(N){N.preventDefault();
this.model.trigger("upload")
},_showIncompatiblePluginsWarningIfAppropriate:function(R){var P=G("#upm-incompatible-plugins-msg");
function O(){var S=7;
G.cookie("upm.incompatiblePlugins.dismiss","true",{expires:S,path:"/"});
P.addClass("hidden")
}if(R>0&&!E.isSafeMode()&&G("#upm-self-update-msg").length===0&&!G.cookie("upm.incompatiblePlugins.dismiss")){if(P.hasClass("hidden")){var Q=D.format((R===1)?F["upm.incompatible.plugins.singular"]:F["upm.incompatible.plugins.plural"],D.htmlEncode(E.getApplicationName())),N=B.newWarningMessage(null,Q,{closeable:true});
N.on("closed",O);
P.html(N.render().$el);
P.removeClass("hidden")
}}else{P.addClass("hidden")
}},_showNonApprovedDataCenterAppsWarningIfAppropriate:function(R){var Q=G("#upm-non-dc-approved-apps-msg");
function O(){var S=7;
G.cookie("upm.nonDcApproved.dismiss","true",{expires:S,path:"/"});
Q.addClass("hidden")
}if(R>0&&!E.isSafeMode()&&G("#upm-self-update-msg").length===0&&!G.cookie("upm.nonDcApproved.dismiss")){if(Q.hasClass("hidden")){var P=D.format((R===1)?F["upm.non_data_center_approved_apps.singular"]:F["upm.non_data_center_approved_apps.plural"],D.htmlEncode(E.getApplicationName())),N=B.newWarningMessage(null,P,{closeable:true});
N.on("closed",O);
Q.html(N.render().$el);
Q.removeClass("hidden")
}}else{Q.addClass("hidden")
}},_updateStateAfterLoading:function(){if(this.model.isLoaded()){this._showIncompatiblePluginsWarningIfAppropriate(this.model.getIncompatibleAddons().length);
this._showNonApprovedDataCenterAppsWarningIfAppropriate(this.model.getNonDataCenterApprovedApps().length)
}}})
});