UPM.define("UpmMessageView",["underscore","BaseView","UpmMessageTemplate"],function(B,C,A){return C.extend({template:A,events:{"click .icon-close":"_onCloseClicked"},_postRender:function(){var D=this.model.getCloseAfter();
if(D>0){B.delay(B.bind(this._close,this),D*1000)
}if(this.model.getClassName()){this.$el.addClass(this.model.getClassName())
}},_onCloseClicked:function(D){D.preventDefault();
this._close()
},_close:function(){this.$el.fadeOut(500,B.bind(function(){this.$el.remove()
},this))
}})
});