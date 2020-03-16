UPM.define("LicenseDetailsView",["jquery","BaseView","LicenseDetailsTemplate","ManageAddonFlows","UpmEnvironment","UpmFormats","UpmLicenseInfo","UpmStrings","UpmDialog","UpdatePluginLicenseConfirmDialogTemplate"],function(F,G,H,E,C,B,J,D,I,A){return G.extend({events:{"click input.submit":"_onSubmitLicense","click a.upm-plugin-license-edit":"_toggleLicenseEdit","click a.upm-license-cancel":"_toggleLicenseEdit","click .upm-plugin-license-truncated":"_toggleFullLicenseKey","click textarea.edit-license-key":"_onLicenseEditClick"},_getHtml:function(){var M,L=this.model.toJSON(),K=L.licenseDetails;
if(this.model.isLicenseUpdatable()||this.model.getLicenseDetails()){M=H({plugin:L,license:K,readOnly:L.licenseReadOnly,description:J.getLicenseDescription(K),status:K&&J.getLicenseStatusDescription(L,K),unlicensed:!K||J.isUnlicensed(K)})
}return F("<div></div>").append(M)
},_initEvents:function(){this.listenTo(this.model,"change:licenseDetails",this.render);
this.listenTo(this.model,"uninstalled",this._onUninstalled)
},_postRender:function(){var K=(this.model.getLicenseDetails()&&this.model.getLicenseDetails().rawLicense)||"",L=this.$el.find("input.submit"),M=this.$el.find("textarea");
M.bind("keyup input change propertychange",function(){L.prop("disabled",(M.val().replace(/\r\n/g,"\n")===K.replace(/\r\n/g,"\n")))
})
},_clearBusyState:function(N){var K=N.$el.find(".edit-license-key"),M=N.$el.find(".submit-license"),L=N.$el.find(".upm-license-form .loading");
K.prop("disabled",false);
M.prop("disabled",false);
L.addClass("hidden")
},_updateLicenseKey:function(L,K){this.model.updateLicense(K).fail(function(M){L._clearBusyState(L)
}).always(function(){UPM.trace("license-updated")
})
},_confirmAndUpdate:function(M,L){var N=this;
var K=new I({template:A,data:{messages:M}});
return K.getResult().done(function(){N._updateLicenseKey(N,L)
}).fail(function(){N._clearBusyState(N)
})
},_verifyLicenseAndUpdate:function(L){var O=this,K=this.model.getLinks()["validate-downgrade"],N=!L||(L.trim()==="");
if(!K||N){return O._updateLicenseKey(O,L)
}var M={licenseKey:L};
return F.ajax({url:K,dataType:"json",contentType:C.getContentType(),data:JSON.stringify(M),type:"POST"}).done(function(P){if(P.type=="success"){return O._updateLicenseKey(O,L)
}return O._confirmAndUpdate(P.messages,L)
}).fail(function(R,P,Q){O._clearBusyState(O);
O.model.signalAjaxError(R)
})
},_onSubmitLicense:function(O){var K=this.$el.find(".edit-license-key"),N=this.$el.find(".submit-license"),M=this.$el.find(".upm-license-form .loading"),L=K.val().trim();
O.preventDefault();
K.prop("disabled",true);
N.prop("disabled",true);
M.removeClass("hidden");
this._verifyLicenseAndUpdate(L)
},_onUninstalled:function(){this.$el.addClass("disabled");
this.$el.find('input[type="submit"]').attr("disabled","disabled");
this.$el.find("textarea").attr("disabled","disabled")
},_toggleFullLicenseKey:function(K){K.preventDefault();
this.$el.find(".upm-plugin-license-truncated").toggleClass("hidden");
this.$el.find(".upm-plugin-license-raw").toggleClass("hidden")
},_toggleLicenseEdit:function(K){var L=this.$el.find("div.upm-license-details");
K.preventDefault();
if(L.hasClass("edit-license")){L.removeClass("edit-license")
}else{L.addClass("edit-license");
L.find(".upm-license-form textarea").focus().select()
}},_onLicenseEditClick:function(K){var L=this.$el.find("div.upm-license-details");
K.preventDefault();
L.find(".upm-license-form textarea").focus().select()
},_setBusy:function(L,M){var K=this.$el.find(M?".upm-plugin-license-token-state-container .loading":".upm-plugin-license-token .loading");
this.$el.find(".generate-token").prop("disabled",L);
this.$el.find(".token-state").prop("disabled",L);
K.toggleClass("hidden",!L)
}})
});