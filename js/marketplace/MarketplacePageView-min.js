UPM.define("MarketplacePageView",["jquery","underscore","BaseView","marketplaceRouter"],function(D,A,B,C){return B.extend({events:{"click a.return":"_onReturn","click .category-link":"_onCategoryLinkClick"},_initEvents:function(){this.listenTo(this.model,"single",this._onSingle);
this.listenTo(this.model,"search",this._onSearch);
this.listenTo(this.model,"single",this._resetScrollTop)
},_onSingle:function(){this.$el.find(".single-addon").removeClass("hidden");
this.$el.find(".find-addons").addClass("hidden")
},_onSearch:function(){this.$el.find(".single-addon").addClass("hidden");
this.$el.find(".find-addons").removeClass("hidden")
},_onCategoryLinkClick:function(H){H.preventDefault();
var E=D(H.target).closest("a");
var I=A.clone(this.model.getParameters());
var F=this.model.getFilter();
I.category=E.data("category");
if(F==="search"){F="featured"
}var G={filter:F,query:"",parameters:I};
this._resetScrollTop();
C.navigateTo(G)
},_resetScrollTop:function(){D(document).scrollTop(0)
},_onReturn:function(F){F.preventDefault();
var E={filter:this.model.getFilter(),query:this.model.getQuery(),parameters:this.model.getParameters()};
C.navigateTo(E)
}})
});