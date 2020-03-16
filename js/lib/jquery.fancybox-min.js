/*
 * fancyBox - jQuery Plugin
 * version: 2.1.5 (Fri, 14 Jun 2013)
 * @requires jQuery v1.6 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
 *
 */
(function(O,R,L,G){var S=L("html"),E=L(O),A=L(R),T=L.fancybox=function(){T.open.apply(this,arguments)
},N=navigator.userAgent.match(/msie/i),C=null,I=R.createTouch!==G,M=function(D){return D&&D.hasOwnProperty&&D instanceof L
},B=function(D){return D&&L.type(D)==="string"
},P=function(D){return B(D)&&D.indexOf("%")>0
},K=function(D){return(D&&!(D.style.overflow&&D.style.overflow==="hidden")&&((D.clientWidth&&D.scrollWidth>D.clientWidth)||(D.clientHeight&&D.scrollHeight>D.clientHeight)))
},Q=function(H,F){var D=parseInt(H,10)||0;
if(F&&P(H)){D=T.getViewport()[F]/100*D
}return Math.ceil(D)
},J=function(D,F){return Q(D,F)+"px"
};
L.extend(T,{version:"2.1.5",defaults:{padding:15,margin:20,width:800,height:600,minWidth:100,minHeight:100,maxWidth:9999,maxHeight:9999,pixelRatio:1,autoSize:true,autoHeight:false,autoWidth:false,autoResize:true,autoCenter:!I,fitToView:true,aspectRatio:false,topRatio:0.5,leftRatio:0.5,scrolling:"auto",wrapCSS:"",arrows:true,closeBtn:true,closeClick:false,nextClick:false,mouseWheel:true,autoPlay:false,playSpeed:3000,preload:3,modal:false,loop:true,ajax:{dataType:"html",headers:{"X-fancyBox":true}},iframe:{scrolling:"auto",preload:true},swf:{wmode:"transparent",allowfullscreen:"true",allowscriptaccess:"always"},keys:{next:{13:"left",34:"up",39:"left",40:"up"},prev:{8:"right",33:"down",37:"right",38:"down"},close:[27],play:[32],toggle:[70]},direction:{next:"left",prev:"right"},scrollOutside:true,index:0,type:null,href:null,content:null,title:null,tpl:{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',image:'<img class="fancybox-image" src="{href}" alt="" />',iframe:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen'+(N?' allowtransparency="true"':"")+"></iframe>",error:'<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',closeBtn:'<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',next:'<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',prev:'<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'},openEffect:"fade",openSpeed:250,openEasing:"swing",openOpacity:true,openMethod:"zoomIn",closeEffect:"fade",closeSpeed:250,closeEasing:"swing",closeOpacity:true,closeMethod:"zoomOut",nextEffect:"elastic",nextSpeed:250,nextEasing:"swing",nextMethod:"changeIn",prevEffect:"elastic",prevSpeed:250,prevEasing:"swing",prevMethod:"changeOut",helpers:{overlay:true,title:true},onCancel:L.noop,beforeLoad:L.noop,afterLoad:L.noop,beforeShow:L.noop,afterShow:L.noop,beforeChange:L.noop,beforeClose:L.noop,afterClose:L.noop},group:{},opts:{},previous:null,coming:null,current:null,isActive:false,isOpen:false,isOpened:false,wrap:null,skin:null,outer:null,inner:null,player:{timer:null,isActive:false},ajaxLoad:null,imgPreload:null,transitions:{},helpers:{},open:function(F,D){if(!F){return 
}if(!L.isPlainObject(D)){D={}
}if(false===T.close(true)){return 
}if(!L.isArray(F)){F=M(F)?L(F).get():[F]
}L.each(F,function(X,Y){var W={},H,b,Z,a,V,c,U;
if(L.type(Y)==="object"){if(Y.nodeType){Y=L(Y)
}if(M(Y)){W={href:Y.data("fancybox-href")||Y.attr("href"),title:Y.data("fancybox-title")||Y.attr("title"),isDom:true,element:Y};
if(L.metadata){L.extend(true,W,Y.metadata())
}}else{W=Y
}}H=D.href||W.href||(B(Y)?Y:null);
b=D.title!==G?D.title:W.title||"";
Z=D.content||W.content;
a=Z?"html":(D.type||W.type);
if(!a&&W.isDom){a=Y.data("fancybox-type");
if(!a){V=Y.prop("class").match(/fancybox\.(\w+)/);
a=V?V[1]:null
}}if(B(H)){if(!a){if(T.isImage(H)){a="image"
}else{if(T.isSWF(H)){a="swf"
}else{if(H.charAt(0)==="#"){a="inline"
}else{if(B(Y)){a="html";
Z=Y
}}}}}if(a==="ajax"){c=H.split(/\s+/,2);
H=c.shift();
U=c.shift()
}}if(!Z){if(a==="inline"){if(H){Z=L(B(H)?H.replace(/.*(?=#[^\s]+$)/,""):H)
}else{if(W.isDom){Z=Y
}}}else{if(a==="html"){Z=H
}else{if(!a&&!H&&W.isDom){a="inline";
Z=Y
}}}}L.extend(W,{href:H,type:a,content:Z,title:b,selector:U});
F[X]=W
});
T.opts=L.extend(true,{},T.defaults,D);
if(D.keys!==G){T.opts.keys=D.keys?L.extend({},T.defaults.keys,D.keys):false
}T.group=F;
return T._start(T.opts.index)
},cancel:function(){var D=T.coming;
if(!D||false===T.trigger("onCancel")){return 
}T.hideLoading();
if(T.ajaxLoad){T.ajaxLoad.abort()
}T.ajaxLoad=null;
if(T.imgPreload){T.imgPreload.onload=T.imgPreload.onerror=null
}if(D.wrap){D.wrap.stop(true,true).trigger("onReset").remove()
}T.coming=null;
if(!T.current){T._afterZoomOut(D)
}},close:function(D){T.cancel();
if(false===T.trigger("beforeClose")){return 
}T.unbindEvents();
if(!T.isActive){return 
}if(!T.isOpen||D===true){L(".fancybox-wrap").stop(true).trigger("onReset").remove();
T._afterZoomOut()
}else{T.isOpen=T.isOpened=false;
T.isClosing=true;
L(".fancybox-item, .fancybox-nav").remove();
T.wrap.stop(true,true).removeClass("fancybox-opened");
T.transitions[T.current.closeMethod]()
}},play:function(H){var D=function(){clearTimeout(T.player.timer)
},V=function(){D();
if(T.current&&T.player.isActive){T.player.timer=setTimeout(T.next,T.current.playSpeed)
}},F=function(){D();
A.unbind(".player");
T.player.isActive=false;
T.trigger("onPlayEnd")
},U=function(){if(T.current&&(T.current.loop||T.current.index<T.group.length-1)){T.player.isActive=true;
A.bind({"onCancel.player beforeClose.player":F,"onUpdate.player":V,"beforeLoad.player":D});
V();
T.trigger("onPlayStart")
}};
if(H===true||(!T.player.isActive&&H!==false)){U()
}else{F()
}},next:function(F){var D=T.current;
if(D){if(!B(F)){F=D.direction.next
}T.jumpto(D.index+1,F,"next")
}},prev:function(F){var D=T.current;
if(D){if(!B(F)){F=D.direction.prev
}T.jumpto(D.index-1,F,"prev")
}},jumpto:function(F,U,D){var H=T.current;
if(!H){return 
}F=Q(F);
T.direction=U||H.direction[(F>=H.index?"next":"prev")];
T.router=D||"jumpto";
if(H.loop){if(F<0){F=H.group.length+(F%H.group.length)
}F=F%H.group.length
}if(H.group[F]!==G){T.cancel();
T._start(F)
}},reposition:function(U,D){var H=T.current,F=H?H.wrap:null,V;
if(F){V=T._getPosition(D);
if(U&&U.type==="scroll"){delete V.position;
F.stop(true,true).animate(V,200)
}else{F.css(V);
H.pos=L.extend({},H.dim,V)
}}},update:function(H){var D=(H&&H.type),F=!D||D==="orientationchange";
if(F){clearTimeout(C);
C=null
}if(!T.isOpen||C){return 
}C=setTimeout(function(){var U=T.current;
if(!U||T.isClosing){return 
}T.wrap.removeClass("fancybox-tmp");
if(F||D==="load"||(D==="resize"&&U.autoResize)){T._setDimension()
}if(!(D==="scroll"&&U.canShrink)){T.reposition(H)
}T.trigger("onUpdate");
C=null
},(F&&!I?0:300))
},toggle:function(D){if(T.isOpen){T.current.fitToView=L.type(D)==="boolean"?D:!T.current.fitToView;
if(I){T.wrap.removeAttr("style").addClass("fancybox-tmp");
T.trigger("onUpdate")
}T.update()
}},hideLoading:function(){A.unbind(".loading");
L("#fancybox-loading").remove()
},showLoading:function(){var F,D;
T.hideLoading();
F=L('<div id="fancybox-loading"><div></div></div>').click(T.cancel).appendTo("body");
A.bind("keydown.loading",function(H){if((H.which||H.keyCode)===27){H.preventDefault();
T.cancel()
}});
if(!T.defaults.fixed){D=T.getViewport();
F.css({position:"absolute",top:(D.h*0.5)+D.y,left:(D.w*0.5)+D.x})
}},getViewport:function(){var D=(T.current&&T.current.locked)||false,F={x:E.scrollLeft(),y:E.scrollTop()};
if(D){F.w=D[0].clientWidth;
F.h=D[0].clientHeight
}else{F.w=I&&O.innerWidth?O.innerWidth:E.width();
F.h=I&&O.innerHeight?O.innerHeight:E.height()
}return F
},unbindEvents:function(){if(T.wrap&&M(T.wrap)){T.wrap.unbind(".fb")
}A.unbind(".fb");
E.unbind(".fb")
},bindEvents:function(){var F=T.current,D;
if(!F){return 
}E.bind("orientationchange.fb"+(I?"":" resize.fb")+(F.autoCenter&&!F.locked?" scroll.fb":""),T.update);
D=F.keys;
if(D){A.bind("keydown.fb",function(V){var H=V.which||V.keyCode,U=V.target||V.srcElement;
if(H===27&&T.coming){return false
}if(!V.ctrlKey&&!V.altKey&&!V.shiftKey&&!V.metaKey&&!(U&&(U.type||L(U).is("[contenteditable]")))){L.each(D,function(W,X){if(F.group.length>1&&X[H]!==G){T[W](X[H]);
V.preventDefault();
return false
}if(L.inArray(H,X)>-1){T[W]();
V.preventDefault();
return false
}})
}})
}if(L.fn.mousewheel&&F.mouseWheel){T.wrap.bind("mousewheel.fb",function(Y,Z,U,H){var X=Y.target||null,V=L(X),W=false;
while(V.length){if(W||V.is(".fancybox-skin")||V.is(".fancybox-wrap")){break
}W=K(V[0]);
V=L(V).parent()
}if(Z!==0&&!W){if(T.group.length>1&&!F.canShrink){if(H>0||U>0){T.prev(H>0?"down":"left")
}else{if(H<0||U<0){T.next(H<0?"up":"right")
}}Y.preventDefault()
}}})
}},trigger:function(F,U){var D,H=U||T.coming||T.current;
if(!H){return 
}if(L.isFunction(H[F])){D=H[F].apply(H,Array.prototype.slice.call(arguments,1))
}if(D===false){return false
}if(H.helpers){L.each(H.helpers,function(W,V){if(V&&T.helpers[W]&&L.isFunction(T.helpers[W][F])){T.helpers[W][F](L.extend(true,{},T.helpers[W].defaults,V),H)
}})
}A.trigger(F)
},isImage:function(D){return B(D)&&D.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)
},isSWF:function(D){return B(D)&&D.match(/\.(swf)((\?|#).*)?$/i)
},_start:function(F){var H={},X,D,U,V,W;
F=Q(F);
X=T.group[F]||null;
if(!X){return false
}H=L.extend(true,{},T.opts,X);
V=H.margin;
W=H.padding;
if(L.type(V)==="number"){H.margin=[V,V,V,V]
}if(L.type(W)==="number"){H.padding=[W,W,W,W]
}if(H.modal){L.extend(true,H,{closeBtn:false,closeClick:false,nextClick:false,arrows:false,mouseWheel:false,keys:null,helpers:{overlay:{closeClick:false}}})
}if(H.autoSize){H.autoWidth=H.autoHeight=true
}if(H.width==="auto"){H.autoWidth=true
}if(H.height==="auto"){H.autoHeight=true
}H.group=T.group;
H.index=F;
T.coming=H;
if(false===T.trigger("beforeLoad")){T.coming=null;
return 
}U=H.type;
D=H.href;
if(!U){T.coming=null;
if(T.current&&T.router&&T.router!=="jumpto"){T.current.index=F;
return T[T.router](T.direction)
}return false
}T.isActive=true;
if(U==="image"||U==="swf"){H.autoHeight=H.autoWidth=false;
H.scrolling="visible"
}if(U==="image"){H.aspectRatio=true
}if(U==="iframe"&&I){H.scrolling="scroll"
}H.wrap=L(H.tpl.wrap).addClass("fancybox-"+(I?"mobile":"desktop")+" fancybox-type-"+U+" fancybox-tmp "+H.wrapCSS).appendTo(H.parent||"body");
L.extend(H,{skin:L(".fancybox-skin",H.wrap),outer:L(".fancybox-outer",H.wrap),inner:L(".fancybox-inner",H.wrap)});
L.each(["Top","Right","Bottom","Left"],function(Z,Y){H.skin.css("padding"+Y,J(H.padding[Z]))
});
T.trigger("onReady");
if(U==="inline"||U==="html"){if(!H.content||!H.content.length){return T._error("content")
}}else{if(!D){return T._error("href")
}}if(U==="image"){T._loadImage()
}else{if(U==="ajax"){T._loadAjax()
}else{if(U==="iframe"){T._loadIframe()
}else{T._afterLoad()
}}}},_error:function(D){L.extend(T.coming,{type:"html",autoWidth:true,autoHeight:true,minWidth:0,minHeight:0,scrolling:"no",hasError:D,content:T.coming.tpl.error});
T._afterLoad()
},_loadImage:function(){var D=T.imgPreload=new Image();
D.onload=function(){this.onload=this.onerror=null;
T.coming.width=this.width/T.opts.pixelRatio;
T.coming.height=this.height/T.opts.pixelRatio;
T._afterLoad()
};
D.onerror=function(){this.onload=this.onerror=null;
T._error("image")
};
D.src=T.coming.href;
if(D.complete!==true){T.showLoading()
}},_loadAjax:function(){var D=T.coming;
T.showLoading();
T.ajaxLoad=L.ajax(L.extend({},D.ajax,{url:D.href,error:function(F,H){if(T.coming&&H!=="abort"){T._error("ajax",F)
}else{T.hideLoading()
}},success:function(F,H){if(H==="success"){D.content=F;
T._afterLoad()
}}}))
},_loadIframe:function(){var D=T.coming,F=L(D.tpl.iframe.replace(/\{rnd\}/g,new Date().getTime())).attr("scrolling",I?"auto":D.iframe.scrolling).attr("src",D.href);
L(D.wrap).bind("onReset",function(){try{L(this).find("iframe").hide().attr("src","//about:blank").end().empty()
}catch(H){}});
if(D.iframe.preload){T.showLoading();
F.one("load",function(){L(this).data("ready",1);
if(!I){L(this).bind("load.fb",T.update)
}L(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
T._afterLoad()
})
}D.content=F.appendTo(D.inner);
if(!D.iframe.preload){T._afterLoad()
}},_preloadImages:function(){var W=T.group,V=T.current,D=W.length,H=V.preload?Math.min(V.preload,D-1):0,U,F;
for(F=1;
F<=H;
F+=1){U=W[(V.index+F)%D];
if(U.type==="image"&&U.href){new Image().src=U.href
}}},_afterLoad:function(){var F=T.coming,U=T.current,Z="fancybox-placeholder",W,X,Y,H,D,V;
T.hideLoading();
if(!F||T.isActive===false){return 
}if(false===T.trigger("afterLoad",F,U)){F.wrap.stop(true).trigger("onReset").remove();
T.coming=null;
return 
}if(U){T.trigger("beforeChange",U);
U.wrap.stop(true).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()
}T.unbindEvents();
W=F;
X=F.content;
Y=F.type;
H=F.scrolling;
L.extend(T,{wrap:W.wrap,skin:W.skin,outer:W.outer,inner:W.inner,current:W,previous:U});
D=W.href;
switch(Y){case"inline":case"ajax":case"html":if(W.selector){X=L("<div>").html(X).find(W.selector)
}else{if(M(X)){if(!X.data(Z)){X.data(Z,L('<div class="'+Z+'"></div>').insertAfter(X).hide())
}X=X.show().detach();
W.wrap.bind("onReset",function(){if(L(this).find(X).length){X.hide().replaceAll(X.data(Z)).data(Z,false)
}})
}}break;
case"image":X=W.tpl.image.replace("{href}",D);
break;
case"swf":X='<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="'+D+'"></param>';
V="";
L.each(W.swf,function(a,b){X+='<param name="'+a+'" value="'+b+'"></param>';
V+=" "+a+'="'+b+'"'
});
X+='<embed src="'+D+'" type="application/x-shockwave-flash" width="100%" height="100%"'+V+"></embed></object>";
break
}if(!(M(X)&&X.parent().is(W.inner))){W.inner.append(X)
}T.trigger("beforeShow");
W.inner.css("overflow",H==="yes"?"scroll":(H==="no"?"hidden":H));
T._setDimension();
T.reposition();
T.isOpen=false;
T.coming=null;
T.bindEvents();
if(!T.isOpened){L(".fancybox-wrap").not(W.wrap).stop(true).trigger("onReset").remove()
}else{if(U.prevMethod){T.transitions[U.prevMethod]()
}}T.transitions[T.isOpened?W.nextMethod:W.openMethod]();
T._preloadImages()
},_setDimension:function(){var v=T.getViewport(),r=0,x=false,z=false,c=T.wrap,p=T.skin,AA=T.inner,m=T.current,n=m.width,k=m.height,g=m.minWidth,Y=m.minHeight,t=m.maxWidth,l=m.maxHeight,f=m.scrolling,W=m.scrollOutside?m.scrollbarWidth:0,j=m.margin,X=Q(j[1]+j[3]),V=Q(j[0]+j[2]),H,F,q,s,i,h,o,a,Z,w,U,y,D,b,d;
c.add(p).add(AA).width("auto").height("auto").removeClass("fancybox-tmp");
H=Q(p.outerWidth(true)-p.width());
F=Q(p.outerHeight(true)-p.height());
q=X+H;
s=V+F;
i=P(n)?(v.w-q)*Q(n)/100:n;
h=P(k)?(v.h-s)*Q(k)/100:k;
if(m.type==="iframe"){b=m.content;
if(m.autoHeight&&b.data("ready")===1){try{if(b[0].contentWindow.document.location){AA.width(i).height(9999);
d=b.contents().find("body");
if(W){d.css("overflow-x","hidden")
}h=d.outerHeight(true)
}}catch(u){}}}else{if(m.autoWidth||m.autoHeight){AA.addClass("fancybox-tmp");
if(!m.autoWidth){AA.width(i)
}if(!m.autoHeight){AA.height(h)
}if(m.autoWidth){i=AA.width()
}if(m.autoHeight){h=AA.height()
}AA.removeClass("fancybox-tmp")
}}n=Q(i);
k=Q(h);
Z=i/h;
g=Q(P(g)?Q(g,"w")-q:g);
t=Q(P(t)?Q(t,"w")-q:t);
Y=Q(P(Y)?Q(Y,"h")-s:Y);
l=Q(P(l)?Q(l,"h")-s:l);
o=t;
a=l;
if(m.fitToView){t=Math.min(v.w-q,t);
l=Math.min(v.h-s,l)
}y=v.w-X;
D=v.h-V;
if(m.aspectRatio){if(n>t){n=t;
k=Q(n/Z)
}if(k>l){k=l;
n=Q(k*Z)
}if(n<g){n=g;
k=Q(n/Z)
}if(k<Y){k=Y;
n=Q(k*Z)
}}else{n=Math.max(g,Math.min(n,t));
if(m.autoHeight&&m.type!=="iframe"){AA.width(n);
k=AA.height()
}k=Math.max(Y,Math.min(k,l))
}if(m.fitToView){AA.width(n).height(k);
c.width(n+H);
w=c.width();
U=c.height();
if(m.aspectRatio){while((w>y||U>D)&&n>g&&k>Y){if(r++>19){break
}k=Math.max(Y,Math.min(l,k-10));
n=Q(k*Z);
if(n<g){n=g;
k=Q(n/Z)
}if(n>t){n=t;
k=Q(n/Z)
}AA.width(n).height(k);
c.width(n+H);
w=c.width();
U=c.height()
}}else{n=Math.max(g,Math.min(n,n-(w-y)));
k=Math.max(Y,Math.min(k,k-(U-D)))
}}if(W&&f==="auto"&&k<h&&(n+H+W)<y){n+=W
}AA.width(n).height(k);
c.width(n+H);
w=c.width();
U=c.height();
x=(w>y||U>D)&&n>g&&k>Y;
z=m.aspectRatio?(n<o&&k<a&&n<i&&k<h):((n<o||k<a)&&(n<i||k<h));
L.extend(m,{dim:{width:J(w),height:J(U)},origWidth:i,origHeight:h,canShrink:x,canExpand:z,wPadding:H,hPadding:F,wrapSpace:U-p.outerHeight(true),skinSpace:p.height()-k});
if(!b&&m.autoHeight&&k>Y&&k<l&&!z){AA.height("auto")
}},_getPosition:function(H){var X=T.current,F=T.getViewport(),V=X.margin,U=T.wrap.width()+V[1]+V[3],D=T.wrap.height()+V[0]+V[2],W={position:"absolute",top:V[0],left:V[3]};
if(X.autoCenter&&X.fixed&&!H&&D<=F.h&&U<=F.w){W.position="fixed"
}else{if(!X.locked){W.top+=F.y;
W.left+=F.x
}}W.top=J(Math.max(W.top,W.top+((F.h-D)*X.topRatio)));
W.left=J(Math.max(W.left,W.left+((F.w-U)*X.leftRatio)));
return W
},_afterZoomIn:function(){var D=T.current;
if(!D){return 
}T.isOpen=T.isOpened=true;
T.wrap.css("overflow","visible").addClass("fancybox-opened");
T.update();
if(D.closeClick||(D.nextClick&&T.group.length>1)){T.inner.css("cursor","pointer").bind("click.fb",function(F){if(!L(F.target).is("a")&&!L(F.target).parent().is("a")){F.preventDefault();
T[D.closeClick?"close":"next"]()
}})
}if(D.closeBtn){L(D.tpl.closeBtn).appendTo(T.skin).bind("click.fb",function(F){F.preventDefault();
T.close()
})
}if(D.arrows&&T.group.length>1){if(D.loop||D.index>0){L(D.tpl.prev).appendTo(T.outer).bind("click.fb",T.prev)
}if(D.loop||D.index<T.group.length-1){L(D.tpl.next).appendTo(T.outer).bind("click.fb",T.next)
}}T.trigger("afterShow");
if(!D.loop&&D.index===D.group.length-1){T.play(false)
}else{if(T.opts.autoPlay&&!T.player.isActive){T.opts.autoPlay=false;
T.play()
}}},_afterZoomOut:function(D){D=D||T.current;
L(".fancybox-wrap").trigger("onReset").remove();
L.extend(T,{group:{},opts:{},router:false,current:null,isActive:false,isOpened:false,isOpen:false,isClosing:false,wrap:null,skin:null,outer:null,inner:null});
T.trigger("afterClose",D)
},init:function(){}});
T.transitions={getOrigPosition:function(){var U=T.current,F=U.element,X=U.orig,W={},D=50,Y=50,V=U.hPadding,Z=U.wPadding,H=T.getViewport();
if(!X&&U.isDom&&F.is(":visible")){X=F.find("img:first");
if(!X.length){X=F
}}if(M(X)){W=X.offset();
if(X.is("img")){D=X.outerWidth();
Y=X.outerHeight()
}}else{W.top=H.y+(H.h-Y)*U.topRatio;
W.left=H.x+(H.w-D)*U.leftRatio
}if(T.wrap.css("position")==="fixed"||U.locked){W.top-=H.y;
W.left-=H.x
}W={top:J(W.top-V*U.topRatio),left:J(W.left-Z*U.leftRatio),width:J(D+Z),height:J(Y+V)};
return W
},step:function(F,H){var V,X,Y,D=H.prop,U=T.current,W=U.wrapSpace,Z=U.skinSpace;
if(D==="width"||D==="height"){V=H.end===H.start?1:(F-H.start)/(H.end-H.start);
if(T.isClosing){V=1-V
}X=D==="width"?U.wPadding:U.hPadding;
Y=F-X;
T.skin[D](Q(D==="width"?Y:Y-(W*V)));
T.inner[D](Q(D==="width"?Y:Y-(W*V)-(Z*V)))
}},zoomIn:function(){var V=T.current,F=V.pos,H=V.openEffect,U=H==="elastic",D=L.extend({opacity:1},F);
delete D.position;
if(U){F=this.getOrigPosition();
if(V.openOpacity){F.opacity=0.1
}}else{if(H==="fade"){F.opacity=0.1
}}T.wrap.css(F).animate(D,{duration:H==="none"?0:V.openSpeed,easing:V.openEasing,step:U?this.step:null,complete:T._afterZoomIn})
},zoomOut:function(){var U=T.current,F=U.closeEffect,H=F==="elastic",D={opacity:0.1};
if(H){D=this.getOrigPosition();
if(U.closeOpacity){D.opacity=0.1
}}T.wrap.animate(D,{duration:F==="none"?0:U.closeSpeed,easing:U.closeEasing,step:H?this.step:null,complete:T._afterZoomOut})
},changeIn:function(){var W=T.current,H=W.nextEffect,F=W.pos,D={opacity:1},V=T.direction,X=200,U;
F.opacity=0.1;
if(H==="elastic"){U=V==="down"||V==="up"?"top":"left";
if(V==="down"||V==="right"){F[U]=J(Q(F[U])-X);
D[U]="+="+X+"px"
}else{F[U]=J(Q(F[U])+X);
D[U]="-="+X+"px"
}}if(H==="none"){T._afterZoomIn()
}else{T.wrap.css(F).animate(D,{duration:W.nextSpeed,easing:W.nextEasing,complete:T._afterZoomIn})
}},changeOut:function(){var H=T.previous,F=H.prevEffect,D={opacity:0.1},U=T.direction,V=200;
if(F==="elastic"){D[U==="down"||U==="up"?"top":"left"]=(U==="up"||U==="left"?"-":"+")+"="+V+"px"
}H.wrap.animate(D,{duration:F==="none"?0:H.prevSpeed,easing:H.prevEasing,complete:function(){L(this).trigger("onReset").remove()
}})
}};
T.helpers.overlay={defaults:{closeClick:true,speedOut:200,showEarly:true,css:{},locked:!I,fixed:true},overlay:null,fixed:false,el:L("html"),create:function(D){D=L.extend({},this.defaults,D);
if(this.overlay){this.close()
}this.overlay=L('<div class="fancybox-overlay"></div>').appendTo(T.coming?T.coming.parent:D.parent);
this.fixed=false;
if(D.fixed&&T.defaults.fixed){this.overlay.addClass("fancybox-overlay-fixed");
this.fixed=true
}},open:function(F){var D=this;
F=L.extend({},this.defaults,F);
if(this.overlay){this.overlay.unbind(".overlay").width("auto").height("auto")
}else{this.create(F)
}if(!this.fixed){E.bind("resize.overlay",L.proxy(this.update,this));
this.update()
}if(F.closeClick){this.overlay.bind("click.overlay",function(H){if(L(H.target).hasClass("fancybox-overlay")){if(T.isActive){T.close()
}else{D.close()
}return false
}})
}this.overlay.css(F.css).show()
},close:function(){var D,F;
E.unbind("resize.overlay");
if(this.el.hasClass("fancybox-lock")){L(".fancybox-margin").removeClass("fancybox-margin");
D=E.scrollTop();
F=E.scrollLeft();
this.el.removeClass("fancybox-lock");
E.scrollTop(D).scrollLeft(F)
}L(".fancybox-overlay").remove().hide();
L.extend(this,{overlay:null,fixed:false})
},update:function(){var F="100%",D;
this.overlay.width(F).height("100%");
if(N){D=Math.max(R.documentElement.offsetWidth,R.body.offsetWidth);
if(A.width()>D){F=A.width()
}}else{if(A.width()>E.width()){F=A.width()
}}this.overlay.width(F).height(A.height())
},onReady:function(F,H){var D=this.overlay;
L(".fancybox-overlay").stop(true,true);
if(!D){this.create(F)
}if(F.locked&&this.fixed&&H.fixed){if(!D){this.margin=A.height()>E.height()?L("html").css("margin-right").replace("px",""):false
}H.locked=this.overlay.append(H.wrap);
H.fixed=false
}if(F.showEarly===true){this.beforeShow.apply(this,arguments)
}},beforeShow:function(H,U){var D,F;
if(U.locked){if(this.margin!==false){L("*").filter(function(){return(L(this).css("position")==="fixed"&&!L(this).hasClass("fancybox-overlay")&&!L(this).hasClass("fancybox-wrap"))
}).addClass("fancybox-margin");
this.el.addClass("fancybox-margin")
}D=E.scrollTop();
F=E.scrollLeft();
this.el.addClass("fancybox-lock");
E.scrollTop(D).scrollLeft(F)
}this.open(H)
},onUpdate:function(){if(!this.fixed){this.update()
}},afterClose:function(D){if(this.overlay&&!T.coming){this.overlay.fadeOut(D.speedOut,L.proxy(this.close,this))
}}};
T.helpers.title={defaults:{type:"float",position:"bottom"},beforeShow:function(F){var U=T.current,W=U.title,D=F.type,V,H;
if(L.isFunction(W)){W=W.call(U.element,U)
}if(!B(W)||L.trim(W)===""){return 
}V=L('<div class="fancybox-title fancybox-title-'+D+'-wrap">'+W+"</div>");
switch(D){case"inside":H=T.skin;
break;
case"outside":H=T.wrap;
break;
case"over":H=T.inner;
break;
default:H=T.skin;
V.appendTo("body");
if(N){V.width(V.width())
}V.wrapInner('<span class="child"></span>');
T.current.margin[2]+=Math.abs(Q(V.css("margin-bottom")));
break
}V[(F.position==="top"?"prependTo":"appendTo")](H)
}};
L.fn.fancybox=function(H){var F,U=L(this),D=this.selector||"",V=function(Z){var Y=L(this).blur(),W=F,X,a;
if(!(Z.ctrlKey||Z.altKey||Z.shiftKey||Z.metaKey)&&!Y.is(".fancybox-wrap")){X=H.groupAttr||"data-fancybox-group";
a=Y.attr(X);
if(!a){X="rel";
a=Y.get(0)[X]
}if(a&&a!==""&&a!=="nofollow"){Y=D.length?L(D):U;
Y=Y.filter("["+X+'="'+a+'"]');
W=Y.index(this)
}H.index=W;
if(T.open(Y,H)!==false){Z.preventDefault()
}}};
H=H||{};
F=H.index||0;
if(!D||H.live===false){U.unbind("click.fb-start").bind("click.fb-start",V)
}else{A.undelegate(D,"click.fb-start").delegate(D+":not('.fancybox-item, .fancybox-nav')","click.fb-start",V)
}this.filter("[data-fancybox-start=1]").trigger("click");
return this
};
A.ready(function(){var F,D;
if(L.scrollbarWidth===G){L.scrollbarWidth=function(){var U=L('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),V=U.children(),H=V.innerWidth()-V.height(99).innerWidth();
U.remove();
return H
}
}if(L.support.fixedPosition===G){L.support.fixedPosition=(function(){var U=L('<div style="position:fixed;top:20px;"></div>').appendTo("body"),H=(U[0].offsetTop===20||U[0].offsetTop===15);
U.remove();
return H
}())
}L.extend(T.defaults,{scrollbarWidth:L.scrollbarWidth(),fixed:L.support.fixedPosition,parent:L("body")});
F=L(O).width();
S.addClass("fancybox-lock-test");
D=L(O).width();
S.removeClass("fancybox-lock-test");
L("<style type='text/css'>.fancybox-margin{margin-right:"+(D-F)+"px;}</style>").appendTo("head")
})
}(window,document,jQuery));