UPM.define("AddonActions",["underscore"],function(B){var C=["BUY","CHECK_LICENSE","CONFIGURE","CROSSGRADE","DISABLE","DISMISS_REQUEST","DOWNLOAD","ENABLE","GET_STARTED","INSTALL","MAKE_REQUEST","MANAGE","RENEW","RENEW_CONTACT","REQUEST_UPDATE","SUBSCRIBE","TRIAL_RESUME","TRIAL_SUBSCRIBE","TRIAL_UNSUBSCRIBE","TRY","UNINSTALL","UNSUBSCRIBE","UPDATE","UPGRADE"];
var D={BUY:"new",DISMISS_REQUEST:"dismiss-request",MAKE_REQUEST:"request",RENEW:"renew",RENEW_CONTACT:"renew-contact",SUBSCRIBE:"subscribe",TRIAL_RESUME:"trial-resume",TRIAL_SUBSCRIBE:"trial-subscribe",TRIAL_UNSUBSCRIBE:"trial-unsubscribe",TRY:"try",UNSUBSCRIBE:"unsubscribe",UPGRADE:"upgrade"};
function E(F){return{key:F,legacyKey:D[F]}
}var A=B.extend({all:function(){return B.map(C,function(F){return A[F]
})
},fromLegacyKey:function(F){return B.findWhere(A.all(),{legacyKey:F})
}},B.object(C,B.map(C,E)));
return A
});