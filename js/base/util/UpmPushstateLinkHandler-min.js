UPM.require(["jquery","backbone"],function(A,B){A(document).on("click","a.push-state",function(F){if(F.isDefaultPrevented()){return 
}F.preventDefault();
var D=A(F.target).closest("a.push-state").attr("href");
var C=B.history.options.root;
var E=D.substr(D.indexOf(C)+C.length);
B.history.navigate(E,{trigger:true,replace:false})
})
});