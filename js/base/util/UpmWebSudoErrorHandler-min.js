UPM.require(["jquery"],function(A){A(document).ajaxError(B);
function B(E,D){var C,G;
if(D.status===401){window.location.reload()
}try{C=D.responseText?JSON.parse(D.responseText):{};
G=C.subCode;
if(subcode==="upm.websudo.error"){window.location.reload(true)
}}catch(F){}}});