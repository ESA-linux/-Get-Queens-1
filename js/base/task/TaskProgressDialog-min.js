UPM.define("TaskProgressDialog",["jquery","underscore","UpmDialog","TaskProgressDialogTemplate","TaskProgressDetailsTemplate"],function(E,C,B,D,A){return B.extend({template:D,_getData:function(){return C.extend({},B.prototype._getData.apply(this),this._formatTitleAndContent())
},_initEvents:function(){this.listenTo(this.model,"change:statusProperties",this._onChangeStatusProperties);
this.listenTo(this.model,"change:progressPercent",this._onChangeProgressPercent);
this.listenTo(this.model,"change:showProgressBar",this._onChangeShowProgressBar)
},_postRender:function(){this._onChangeShowProgressBar();
this._onChangeProgressPercent()
},_formatTitleAndContent:function(){var F=E("<div></div>").html(A(this.model.getStatusProperties()));
return{title:F.find("header").text(),contentHtml:F.find("main").html(),progressHtml:F.find("footer").html()}
},_onChangeStatusProperties:function(){if(this.$el){var F=this._formatTitleAndContent();
this.setHeader(F.title);
this.$el.find(".upm-progress-text").html(F.contentHtml);
this.$el.find(".upm-progress-bar-text").html(F.progressHtml)
}},_onChangeProgressPercent:function(){if(this.$el){this.$el.find("div.upm-progress-amount").width(this.model.getProgressPercent()+"%")
}},_onChangeShowProgressBar:function(){if(this.$el){this.$el.toggleClass("upm-progress-download-install",!!this.model.getShowProgressBar())
}},_onConfirm:function(){},_onCancel:function(){}})
});