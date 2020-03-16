UPM.define("FancySelectForm",["jquery","underscore","HiddenSelectCollection","FancySelectOptionCollectionView","FancySelectView"],function(E,C,A,B,D){E.fn.fancySelectForm=function(G){G=E.extend({onSelection:E.noop},G);
var J=this.find(".fancy-select");
var I={};
var F=this;
J.each(function(M,K){var L=E(K),N=L.find("select");
var O=new A([],{select:N,parse:G.parse});
new B({collection:O,el:L.find(".options")});
new D({collection:O,el:L});
O.on("update",function(){G.onSelection.apply(F,arguments);
F.trigger("update",arguments)
});
I[N.attr("name")]=O;
O.init()
});
function H(K){return !!I[K]
}this.selectOption=function(K,M,L){if(H(K)){I[K].setSelection(M,L)
}return this
};
this.disable=function(K){if(H(K)){I[K].disable()
}return this
};
this.disableAllBut=function(K,L){C.each(C.omit(I,K),function(M){M.disable(L)
});
return this
};
this.selectOptionAndDisable=function(K,M,L){this.selectOption(K,M,L);
this.disable(K);
return this
};
this.enable=function(K){if(H(K)){I[K].enable()
}return this
};
this.enableAll=function(){C.each(I,function(K){K.enable()
});
return this
};
this.getSelectedValue=function(K){if(H(K)){return I[K].getSelectedValue()
}};
this.addOption=function(K,L){if(H(K)){I[K].add(L)
}};
this.removeOption=function(K,L){if(H(K)){var M=I[K];
M.remove(M.findWhere({value:L}))
}};
return this
}
});