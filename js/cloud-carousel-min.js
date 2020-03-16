UPM.define("jqueryCloudCarousel",["jquery",],function(A){A.fn.cloudCarousel=function(E){E=E||{};
if(this.isCarousel){console&&console.warn("Attempted to initialize carousel, but element is already a carousel.");
return 
}var R=this,U=E.selector||".carousel-item-wrap",S=this.find(U),D=S.length,M=D===1,G={carousel:{width:E.width||745,height:E.height||288},center:{top:0,width:E.centerWidth||560,height:E.centerHeight||274},scaled:{width:E.scaledWidth||478,height:E.scaledHeight||234}},N=E.animateTime||500,V=E.animated||true,L=E.autorotate||false,W=E.autorotateTime||4000,O=E.containerPadding||14,F=E.sideOpacity||0.2,I=0,H=-1,P=Math.floor(N/2),T=[],Q=false;
G.ratio=G.center.width/G.center.height;
G.scaled.left=G.carousel.width-(G.scaled.width+O);
G.scaled.top=Math.round((G.carousel.height-(G.scaled.height+O))/2);
G.center.left=Math.round((G.carousel.width-(G.center.width+O))/2);
G.back={width:G.scaled.width,height:G.scaled.height,top:Math.round((G.carousel.height-(G.scaled.height+O))/2),left:Math.round((G.carousel.width-(G.scaled.width+O))/2)};
this.isCarousel=true;
this.rotateRight=function(){this.rotate(1,!V);
return this
};
this.rotateLeft=function(){this.rotate(-1,!V);
return this
};
this.rotate=function(Z,X,a){var Y=1;
if(!a){Y=Z
}H=J(H+Z);
if(T.length>3){T[J(H-(Y*2))].go("back",Z,X)
}T[H].go("center",Y,X);
T[J(H+1)].go("right",Y,X);
T[J(H-1)].go("left",Y,X);
this.index=H
};
this.update=function(){var Y,X,Z=E.startIndex||0;
if(!D){return this
}if(Z>=D||Z<0){Z=0
}this.css({height:G.carousel.height,width:G.carousel.width});
if(D===2){X=S.eq(0);
Y=X.parent();
X.clone(true).appendTo(Y);
S.eq(1).clone(true).appendTo(Y);
this.refreshData()
}S.each(function(a){var b=R.makeSlider(a,A(this));
if(M){b.go("center",0,true)
}else{if(a!=Z&&a!=J(Z+1)&&a!=J(Z-1)){b.go("back",0,true)
}}T.push(b)
});
this.resume();
if(!M){this.rotate(1+Z,true,true)
}if(L){R.hover(function(){Q=true
},function(){Q=false
});
setInterval(function(){if(L&&!Q){R.rotateRight();
E.click&&E.click.call(this,window.event,R.getSlider("right"))
}},W)
}return this
};
this.insertAfter=function(X,Z){var Y=R.makeSlider(D,Z);
Y.go("back",0,true);
if(X===D-1){T.push(Y)
}else{T.splice(X+1,0,Y)
}C(X,Z);
this.refreshData()
};
this.refreshData=function(){S=R.find(U);
D=S.length;
for(var X=0,Y=T.length;
X<Y;
X++){if(T[X].position==="center"){H=X
}}};
this.makeSlider=function(X,b){var Z=b.find("img").css("opacity",0),Y=Z.get(0);
function a(){setTimeout(function(){B(Z,X)
},1)
}if(Y.complete||Y.readyState===4){a()
}else{Z.load(a);
Z.attr("src",Z.attr("src"))
}return{$container:b,$img:Z,index:X,go:function(f,i,e){var h=f=="right"||f=="left"?"scaled":f,j=this.$container,c=this.$img.data("loaded"),k={},d={height:G[h].height,width:G[h].width,left:(f=="left"?0:G[h].left),top:G[h].top},g=this;
j.show().css({"z-index":{center:5,left:3+i,right:3-i,back:0}[f]}).data("position",f).removeClass("center left right back").addClass(f);
this.position=f;
if(e){j.css(d)
}else{j.animate(d,{duration:N,queue:false})
}if(!e&&f==="center"){setTimeout(function(){j.hide().show()
},N+10)
}if(c){if(f!=="back"){k.left=c[f].left;
k.top=c[f].top
}k.opacity=(f=="center")?1:F;
if(e){this.$img.css(k);
f=="back"&&j.hide()
}else{this.$img.animate(k,{duration:N,queue:false,complete:function(){if(g.position==="center"){R.trigger("rotated")
}else{if(g.position==="back"){j.hide()
}}}})
}}}}
};
this.pause=function(){R.css("opacity",F).undelegate(U,"click",K);
return R
};
this.resume=function(){R.css("opacity",1).delegate(U,"click",K);
return R
};
this.getSlider=function(X){var Y=0,Z;
if(typeof X==="number"){return T[X]
}for(;
Z=T[Y++];
){if(Z.position===X){return Z
}}return false
};
var C=function(X,Y){if(X===0){R.prepend(Y)
}else{if(X===D-1){R.append(Y)
}else{A("li:nth-child("+(X+1)+")",R).after(Y)
}}};
var K=function(Z){var Y=A(this),X=Y.data("position");
if(X!=="center"){Z.preventDefault();
if(X=="left"){R.rotateLeft()
}else{R.rotateRight()
}}L=false;
E.click&&E.click.call(this,Z,R.getSlider(X))
};
var J=function(X){if(X<0){return D+X
}return X%D
};
var B=function(b,a){var Z=b.closest(U),Y=b.get(0).clientHeight,e=b.get(0).clientWidth,d=e/Y,c={center:{left:Math.round((G.center.width-(G.center.height*d))/2),top:0},right:{left:G.scaled.width-Math.round(G.scaled.height*d),top:0},left:{left:0,top:0}},X;
if(d>G.ratio){b.css({width:"100%",height:"auto"});
c.center.left=0;
c.center.top=Math.round((G.center.height-(G.center.width/d))/2);
c.right.left=0;
c.left.top=c.right.top=Math.round((G.scaled.height-(G.scaled.width/d))/2)
}b.data("loaded",c);
X=T[a].position;
if(X!=="back"){b.css("left",c[X].left);
b.css("top",c[X].top)
}if(X&&X!=="back"){b.animate({opacity:X=="center"?1:F})
}if(++I==T.length){R.trigger("loaded")
}};
this.update();
return this
}
});