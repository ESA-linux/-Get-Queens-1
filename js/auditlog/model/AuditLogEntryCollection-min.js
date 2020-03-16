UPM.define("AuditLogEntryCollection",["brace","jquery","underscore","AuditLogEntryModel","UpmContextPathMixin"],function(D,E,C,B,A){return D.Collection.extend({mixins:[A],model:B,getEntries:function(F){if(!F||F===""){F=this.getContextPath()+"/rest/plugins/1.0/log/feed"
}var G=E.ajax({url:F,type:"get",cache:false,dataType:"xml"});
G.done(C.bind(this._parseEntries,this));
return G
},_parseEntries:function(F){this.reset(C.map(E(F).find("entry"),this._parseEntry));
UPM.trace("upm.auditlog.reset")
},_parseEntry:function(G){var F=E(G);
return{title:C.escape(F.find("title").text()),authorName:C.escape(F.find("author name").text()),authorUri:F.find("author uri").text(),dateUpdated:F.find("updated").text()}
}})
});