UPM.define("UpmBrowserDetection",["jquery"],function(E){var D=navigator.userAgent.toLowerCase(),C=/msie/.test(D)&&!/opera/.test(D),A=(D.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[0,"0"])[1],B=parseInt(A,10);
return{isIE:C,isIE8AndLower:C&&B<9,isIE9AndLower:C&&B<10,version:A}
});