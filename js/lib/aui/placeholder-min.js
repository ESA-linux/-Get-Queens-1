(function(){var A=document.createElement("input");
if("placeholder" in A){return 
}AJS.Binder.register("placeholder",{selector:"input[placeholder]",run:function(B){var D=AJS.$,E=D(B),C=function(){if(!D.trim(E.val()).length){E.val(E.attr("placeholder")).addClass("placeholder-shown").trigger("reset.placeholder")
}};
C();
E.blur(C).focus(function(){if(E.hasClass("placeholder-shown")){E.val("").removeClass("placeholder-shown")
}})
}})
})();