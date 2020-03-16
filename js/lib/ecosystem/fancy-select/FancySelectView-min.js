UPM.define("FancySelectView",["jquery","underscore","BaseView"],function(C,A,B){return B.extend({events:{"click .selected-value":"_toggle"},_initEvents:function(){this.listenTo(this.collection,"reset change sync",this._setSelectedItemText);
this.listenTo(this.collection,"change",this._close);
this.listenTo(this.collection,"disable",this._disable);
this.listenTo(this.collection,"enable",this._enable);
C(document).on("click",A.bind(this._closeIfClickedOutside,this))
},_toggle:function(D){if(!this.$el.hasClass("disabled")){this.$el.toggleClass("active")
}D.preventDefault()
},_close:function(){this.$el.removeClass("active")
},_closeIfClickedOutside:function(E){var D=C(E.target);
if(!this.$el.find(D).length){this._close()
}},_setSelectedItemText:function(){this.$el.find(".selected-value p").text(this.collection.getSelectedOptionText())
},_disable:function(){this._close();
this.$el.addClass("disabled")
},_enable:function(){this.$el.removeClass("disabled")
}})
});