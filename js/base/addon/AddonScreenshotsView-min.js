UPM.define("AddonScreenshotsView",["jquery","underscore","AddonScreenshotsTemplate","BaseView","LightboxViewMixin","UpmFormats"],function(F,B,E,D,A,C){return D.extend({mixins:[A],template:E,events:{"click a":"_openScreenshotsLightbox"},_getData:function(){var G=this.model.isApplicationPlugin&&this.model.isApplicationPlugin();
return{highlights:(!G)&&this.model.getHighlights(),screenshots:(!G)&&this.model.getScreenshots()}
},_openScreenshotsLightbox:function(G){G.preventDefault();
var H=B.flatten([B.map(this.model.getHighlights(),function(I){return{href:I.fullImageUri,title:C.htmlEncode(I.imageTitle)}
}),B.map(this.model.getScreenshots(),function(I){return{href:I.link,title:C.htmlEncode(I.name)}
})]);
this._openLightbox(H)
}})
});