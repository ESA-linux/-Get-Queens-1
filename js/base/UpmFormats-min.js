UPM.define("UpmFormats",["jquery","underscore","UpmHtmlSanitizer"],function(D,A,C){var B={format:function(F,G){if(A.isArray(F)){return B.formatSingularOrPlural(F[0],F[1],G)
}else{return AJS.format.apply(AJS,arguments)
}},formatSingularOrPlural:function(F,G,H){return B.format((H===1)?F:G,H)
},formatNumberWithCommas:function(F){if(F){return(F+"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,")
}else{return 0
}},htmlEncode:function(F){if(F!==undefined&&F!==null){return D("<div/>").text(F).html()
}},limitElementCount:function(H,F){if(H){var G=D.parseHTML(H);
if(G.length>F){return D("<div></div>").append(G.slice(0,F)).append("<div class='ellipsis'>&hellip;</div>").html()
}else{return H
}}},prettyDate:function(G){var F,H=/([0-9])T([0-9])/;
if(typeof G=="string"){if((G).match(H)){G=G.replace(/Z$/," -00:00").replace(H,"$1 $2")
}G=G.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/g,"$1/$2/$3").replace(/\s?([-\+][0-9]{2}):([0-9]{2})/," $1$2")
}F=new Date(G||"");
return F.toLocaleString()
},sanitizeHtml:function(F){return C.html_sanitize(F,E)
},sanitizeHtmlAndRemoveLinks:function(G){var F=D("<span></span>").append(D.parseHTML(B.sanitizeHtml(G)));
F.find("a").each(function(){var H=D(this);
H.replaceWith(H.html())
});
return F.html()
},sanitizeHtmlAndSetLinksToNewWindow:function(G){var F=D("<span></span>").append(D.parseHTML(B.sanitizeHtml(G)));
F.find("a").each(function(){D(this).attr("target","_blank")
});
return F.html()
},unescapeHtmlEntities:function(F){return D("<div></div>").html(F).text()
}};
function E(F){if(/^https?:\/\//.test(F)){return F
}return null
}return B
});