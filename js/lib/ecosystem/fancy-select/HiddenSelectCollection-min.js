UPM.define("HiddenSelectCollection",["jquery","underscore","brace"],function(C,A,B){var D=A.template("<option value='<%= model.value %>'><%= model.text %></option>");
return B.Collection.extend({initialize:function(F,E){E=E||{};
this.$select=C(E.select||"<select></select>");
this.options=E;
this.on("add remove",this._updateOptions);
this.on("sync",this._updateFromAjax)
},init:function(){if(this.$select.has("option").length){this._resetFromSelect()
}else{if(this.$select.data("url")){this.url=this.$select.data("url");
this.fetch()
}}},parse:function(F){var E=this.$select.data("default");
if(this.options.parse){F=this.options.parse(F)
}if(E){F.unshift({text:E,value:E})
}return F
},getSelectedOptionText:function(){var E=this.$select.find("option:selected");
if(!E.length){E=this.$select.find("option:first")
}return E.text()
},getSelectedValue:function(){return this.$select.val()
},setSelection:function(F,E){if(this.$select.data("url")&&!this.$select.data("initialized")){this.$select.data("initial-value",F);
return 
}this.$select.val(F).trigger("change");
this.trigger("change");
if(!E){this.trigger("update",this.$select.attr("name"))
}},disable:function(E){E=E||{};
if(E.reset){this.setSelection("",E.silent)
}this.$select.attr("disabled","disabled");
this.trigger("disable")
},enable:function(){this.$select.removeAttr("disabled");
this.trigger("enable")
},_updateOptions:function(){this.$select.html(this.map(function(E){return D({model:E.toJSON()})
}))
},_updateFromAjax:function(){this._updateOptions();
this.$select.data("initialized",true);
if(this.$select.data("initial-value")){var E=this.$select.data("initial-value");
this.$select.removeData("initial-value");
this.setSelection(E,true)
}},_resetFromSelect:function(){var E=A.map(this.$select.find("option"),function(F){var G=C(F);
return{text:G.text(),value:G.val()}
});
this.reset(E)
}})
});