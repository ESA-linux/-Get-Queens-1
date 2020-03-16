UPM.define("MarketplaceAddonDetailsView",["jquery","underscore","AddonScreenshotsView","BaseView","LightboxViewMixin","MarketplaceAddonInstallDetailsTemplate","RecommendationItemTemplate","UpmMessageView"],function(H,E,G,F,B,D,C,A){return F.extend({mixins:[B],events:{"click div.upm-plugin-video a":"_openYoutubeLightbox"},_initEvents:function(){this.listenTo(this.model,"change",this.render);
this.listenTo(this.model,"message",this.showMessage)
},enableRecommendations:true,template:D,_getData:function(){return{plugin:this.model.toJSON(),requestsHtml:null}
},showMessage:function(I){if(I){this._getMessageContainer().append((new A({model:I})).render().$el);
UPM.trace("addon-inline-message")
}},_getMessageContainer:function(){return this.$el.find(".upm-message-container")
},_getRecommendationsContainer:function(){return this.$el.find(".upm-plugin-recommendations-container")
},_openYoutubeLightbox:function(J){var I="https://www.youtube.com/embed/"+this.model.getVersionDetails().youtubeId+"?autoplay=1&wmode=opaque";
J.preventDefault();
this._openLightbox({height:480,href:I,type:"iframe",width:800})
},_renderRecommendations:function(I){var K=this._getRecommendationsContainer(),J=K.find(".upm-plugin-recommendations");
if(I.length){K.removeClass("hidden");
J.append(E.map(I,function(L){return H(C({plugin:L}))
}))
}K.addClass("loaded")
},_postRender:function(){if((this.model.getScreenshots()&&this.model.getScreenshots().length)||(this.model.getHighlights()&&this.model.getHighlights().length)){this.$el.find(".screenshots-container").replaceWith(new G({model:this.model}).render().$el)
}if(this.model.getLinks().recommendations&&this.enableRecommendations){this.model.loadRecommendations().done(E.bind(this._renderRecommendations,this)).fail(E.bind(function(){this._renderRecommendations([])
},this))
}else{this._getRecommendationsContainer().addClass("loaded")
}}})
});