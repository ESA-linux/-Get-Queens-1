UPM.define("StringsLoader",["jquery"],function(A){return function(D){var C=A("<div></div>").html(D);
var B={};
C.find("div").each(function(){var E=A(this);
B[E.attr("id")]=E.text()
});
return B
}
});