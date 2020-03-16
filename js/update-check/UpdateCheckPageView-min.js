UPM.define("UpdateCheckPageView",["underscore","BaseView","UpdateCheckPageTemplate","UpdateCheckResultsView","UpmAjax","UpmLoadingViewMixin"],function(D,E,C,A,F,B){return E.extend({mixins:[B],template:C,events:{"change #upm-compatibility-version":"_onChangeVersion","click .submit":"_onSubmit"},_getData:function(){return{availableVersions:this.options.availableVersions}
},_postRender:function(){this._onChangeVersion()
},_getResultsContainer:function(){return this.$el.find("#upm-compatibility-content")
},_getSelectedVersionInfo:function(){var G=this.$el.find("#upm-compatibility-version").val();
selectedVer=G&&D.find(this.options.availableVersions,function(H){return H.links.self===G
});
return selectedVer&&{url:selectedVer.links.self,version:selectedVer.version,recent:selectedVer.recent}
},_onChangeVersion:function(){var G=this.$el.find(".submit");
if(this._getSelectedVersionInfo()){G.prop("disabled",false).removeClass("disabled")
}else{G.prop("disabled",true).addClass("disabled")
}},_onSubmit:function(I){var H=this._getSelectedVersionInfo();
I.preventDefault();
if(H){var G=this.$el.find(".submit");
if(G){G.prop("disabled",true).addClass("disabled")
}this._getResultsContainer().empty();
this.model.fetchResults(H.url,H.version,H.recent).done(D.bind(function(){var J=new A({model:this.model});
this._getResultsContainer().append(J.render().$el)
},this)).fail(F.signalAjaxError)
}}})
});