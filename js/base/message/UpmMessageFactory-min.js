UPM.define("UpmMessageFactory",["UpmMessageModel","UpmMessageView"],function(C,A){function B(H,F,E,D){D=D||{};
D.title=H;
D.message=F;
D.type=E;
var G=new C(D);
return new A({model:G})
}return{newMessage:function(E,G,F,D){return B(G,F,E,D)
},newSuccessMessage:function(F,E,D){return B(F,E,"success",D)
},newWarningMessage:function(F,E,D){return B(F,E,"warning",D)
},newInfoMessage:function(F,E,D){return B(F,E,"info",D)
},newErrorMessage:function(F,E,D){return B(F,E,"error",D)
}}
});