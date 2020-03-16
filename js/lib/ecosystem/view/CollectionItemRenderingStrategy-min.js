UPM.define("CollectionItemRenderingStrategy",["jquery","underscore"],function(B,A){return function(D){var C=this.$el;
this.setElement(A.isString(D)?B(B.parseHTML(D)):D);
if(C){C.replaceWith(this.$el)
}}
});