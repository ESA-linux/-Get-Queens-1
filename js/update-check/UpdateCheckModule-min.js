UPM.require(["jquery","UpdateCheckPageView","UpdateCheckAvailableVersionsModel","UpdateCheckResultsModel","UpmAjax","UpmCommonUi","UpmLoadingView","AddonActions","EnableDisableAddonFlows"],function(E,F,G,B,A,J,I,C,H){function D(L,K){switch(L){case C.DISABLE:H.disableAddon(K);
break;
case C.ENABLE:H.enableAddon(K);
break
}}J.getReadyState().done(function(){var L=new G(),K=new B(),M=E("#upm-panel-compatibility");
new I({model:L,el:M});
K.on("action",D);
L.fetch().done(function(){new F({el:E("#upm-update-check-content"),model:K,availableVersions:L.getVersions()}).render()
}).fail(A.signalAjaxError).always(function(){M.addClass("loaded")
})
})
});