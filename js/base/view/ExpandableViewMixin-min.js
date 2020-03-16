UPM.define("ExpandableViewMixin",["jquery","underscore"],function(C,A){var B=500;
return{getDetailsContainer:function(){return this.$el.find("div.upm-details")
},isExpanded:function(){return this.$el.hasClass("expanded")
},removeOnNextCollapse:function(D){if(D||this.model.collection){this.listenToOnce(this,"collapsed",function(){this.$el.fadeOut(B,A.bind(function(){(D||this.model.collection).remove(this.model)
},this))
});
this.$el.addClass("to-remove")
}},_onRowClick:function(D){if(!D.isDefaultPrevented()){if(!C(D.target).closest("a, button").length){D.preventDefault();
this._toggleExpanded()
}}},_renderDetails:function(){var E=this.detailViewClass,D=new E({model:this.model}).render();
this.$el.removeClass("loading").addClass("expanded");
this.getDetailsContainer().empty().append(D.$el).addClass("loaded");
D.listenTo(this,"unbound",D.stopListening)
},_collapseDetails:function(){if(this.isExpanded()){this.$el.removeClass("expanded");
this.trigger("collapsed")
}},_expandDetails:function(){var E=this,D=C.Deferred();
if(this.isExpanded()||this.getDetailsContainer().hasClass("loaded")){if(!this.isExpanded()){this.$el.addClass("expanded");
E.trigger("expanded")
}D.resolve(true)
}else{if(!this.model.getHasDetails()){this.$el.addClass("loading")
}this.model.loadDetails().done(function(){E._renderDetails();
E.trigger("expanded");
E.$el.trigger("pluginLoaded");
D.resolve(true)
}).fail(function(F){E.$el.removeClass("loading").addClass("expanded");
E.getDetailsContainer().addClass("error loaded");
E.model.signalAjaxError(F);
D.resolve(true)
})
}return D.done(function(){UPM.trace("details-expanded")
}).promise()
},_toggleExpanded:function(D){if(this.isExpanded()){this._collapseDetails();
return C.Deferred().resolve(false).promise()
}else{return this._expandDetails()
}}}
});