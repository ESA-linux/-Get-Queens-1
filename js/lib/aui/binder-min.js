AJS.Binder=function(A){var B={};
return{runBinders:function(C){if(A.isEmptyObject(B)){AJS.log("No binders to run");
return 
}C=C||document.body;
A("*:not(link, script)",C).each(function(F,E){var D=A(E);
A.each(B,function(H,G){if(!D.data(H)&&D.is(G.selector)){AJS.log("Running binder component: "+H+" on element "+E);
D.data(H,true);
G.run(E)
}})
})
},register:function(D,C){B[D]=C
},unregister:function(C){B[C]=null
}}
}(AJS.$);