UPM.define("UpmMessageDisplayingMixin",["brace","UpmMessageFactory"],function(A,B){return{_displayErrorMessage:function(E,D,C){this._displayMessage(B.newErrorMessage(E,D,C))
},_displayWarningMessage:function(E,D,C){this._displayMessage(B.newWarningMessage(E,D,C))
},_displaySuccessMessage:function(E,D,C){this._displayMessage(B.newSuccessMessage(E,D,C))
},_displayMessage:function(C){this._displayMessageElement(C.render().$el)
},_displayMessageElement:function(C){this.$el.find(".messages").first().append(C)
},_clearMessages:function(){this.$el.find(".messages").first().find(".aui-message").remove()
}}
});