UPM.define("MarketplaceCarouselModule",["jquery","UpmEnvironment","jqueryCloudCarousel"],function(G,C){var E=false;
var H={};
var F={load:function(){if(!E){E=true;
if(G("#carousel").length){var I=C.getResourceUrl("banners");
if(I){G.ajax({url:I,dataType:"json",success:function(J){if(J&&J.count&&J.count>3){B(J)
}UPM.trace("marketplace-carousel-ready")
}})
}}}}};
function B(M){var N=G('<ul class="cloud-carousel"></ul>'),L=G("#carousel"),J,O,I=M.banners.length;
H={head:0,tail:0,prev:M.links.prev,next:M.links.next,total:M.count};
for(var K=0;
J=M.banners[K++];
){if(J.image&&J.image.links.binary){N.append(D(J))
}}H.tail=G(".carousel-item-wrap",N).size()-1;
L.html(N);
O=N.cloudCarousel({startIndex:Math.floor(Math.min(Math.max(2,Math.random()*I),I-2)),autorotate:true,click:function(R,Q){var P=Q.position;
if(P==="left"||P==="right"){if(G(".carousel-item-wrap",N).size()<H.total){if(G(".carousel-item-wrap:eq("+H.head+")").hasClass("left")){A(true,N)
}else{if(G(".carousel-item-wrap:eq("+H.tail+")").hasClass("right")){A(false,N)
}}}}}}).bind("loaded",function(){O.removeClass("loading")
}).getSlider(0).$container.find("a").addClass("loading")
}function D(I){var K=G('<li class="carousel-item-wrap"></li>').attr("data-expand",I.pluginKey).attr("data-rest-uri",I.links.self),J=G('<a href="" class="carousel-item"></a>'),L=G("<img>").attr("src",I.image.links.binary).attr("alt",I.image.altText);
J.addClass("push-state").attr("href",I.links.singlePluginViewLink);
return K.append(J.append(L))
}function A(L,M){var J=H.tail,K=H.next,I;
if(L){K=H.prev
}G.ajax({url:K,type:"get",dataType:"json",success:function(N){for(var O=0;
I=N.banners[O++];
){if(I.image&&I.image.links.binary){M.insertAfter(J+O-1,G(D(I)));
if(L){H.head=H.tail+1
}else{H.tail=H.tail+1
}}}if(L){H.prev=N.links.prev
}else{H.next=N.links.next
}}})
}return F
});