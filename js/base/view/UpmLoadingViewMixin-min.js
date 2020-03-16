UPM.define("UpmLoadingViewMixin",["jquery","underscore"],function(C,A){var B=1000;
return{listenForAjaxEvents:function(D){D=D||this.model||this.collection;
this.listenTo(D,"request",this._onAjaxStart);
this.listenTo(D,"ajaxStart",this._onAjaxStart);
this.listenTo(D,"sync",this._onAjaxComplete);
this.listenTo(D,"ajaxComplete",this._onAjaxComplete)
},_getLoadingContainer:function(){return this.loadingContainer||this.$el
},_onAjaxStart:function(){this.ajaxRequests=(this.ajaxRequest||0)+1;
if(this.ajaxTimeout){clearTimeout(this.ajaxTimeout)
}this.ajaxTimeout=setTimeout(A.bind(this._slowRequest,this),B);
this._getLoadingContainer().addClass("loading")
},_onAjaxComplete:function(){if(this.ajaxTimeout){clearTimeout(this.ajaxTimeout);
delete this.ajaxTimeout
}if(--this.ajaxRequests===0){this._getLoadingContainer().removeClass("slow loading")
}},_slowRequest:function(){this._getLoadingContainer().addClass("slow")
}}
});