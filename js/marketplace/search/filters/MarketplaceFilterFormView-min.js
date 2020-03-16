UPM.define("MarketplaceFilterFormView",["jquery","underscore","BaseView","marketplaceRouter","UpmStrings","FancySelectForm"],function(E,A,C,D,B){return C.extend({events:{submit:"_onFormSubmit"},_initEvents:function(){this.listenTo(this.model,"change",this._updateFormToReflectModel)
},_postInitialize:function(){this.fancySelect=this.$el.fancySelectForm({onSelection:this._checkFancySelectStatus,parse:this._parseCategoryNames});
this.fancySelect.on("update",A.bind(this._onFormSubmit,this))
},_parseCategoryNames:function(F){return A.map(F,function(G){return{text:G,value:G}
})
},_checkFancySelectStatus:function(F){if(F==="filter"){this.enableAll();
switch(this.getSelectedValue("filter")){case"most-requested":this.disableAllBut("filter",{reset:true,silent:true});
break;
case"top-grossing":this.selectOptionAndDisable("cost","marketplace",true);
break
}}},_onFormSubmit:function(G,F){G.preventDefault();
var H={query:this.$el.find("input").val(),filter:this.$el.find("select[name='filter']").val(),parameters:this.model.getParametersAsObject(this.$el.find("select[name!='filter']").serializeArray())};
this._checkStateAndNavigate(H,F)
},_checkStateAndNavigate:function(G,F){if(G.query&&F==="filter"){G.query=""
}D.navigateTo(G)
},_updateFormToReflectModel:function(){var G=this.model.getQuery(),F=this.$el.find("input.upm-searchbox");
this.fancySelect.removeOption("filter","search");
if(G){F.val(G);
this.fancySelect.addOption("filter",{value:"search",text:B["upm.install.search.dropdown"]});
this.fancySelect.selectOption("filter","search",true);
this.fancySelect.disableAllBut("filter",{reset:true})
}else{F.val("");
this.fancySelect.selectOption("filter",this.model.getFilter(),true);
A.each(this.model.getParameters(),function(I,H){this.fancySelect.selectOption(H,I,true)
},this);
this._checkFancySelectStatus.call(this.fancySelect,"filter")
}}})
});