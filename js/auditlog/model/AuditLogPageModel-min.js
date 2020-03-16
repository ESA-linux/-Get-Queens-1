UPM.define("AuditLogPageModel",["brace","jquery","underscore"],function(B,C,A){return B.Model.extend({namedEvents:["updated","errorOccured"],namedAttributes:["collection","startIndex","totalEntries","nextPageHref","previousPageHref","firstPageHref","lastPageHref","currentPageHref"],getEntries:function(D){this.trigger("ajaxStart");
var E=this.getCollection().getEntries(D);
E.done(A.bind(this._setProperties,this));
E.done(A.bind(function(){this.setCurrentPageHref(D)
},this));
E.fail(A.bind(this._handleError,this));
E.always(A.bind(function(){this.trigger("ajaxComplete")
},this))
},_loadEntriesForPage:function(D){if(D){this.getEntries(D)
}},gotoFirstPage:function(){this._loadEntriesForPage(this.getFirstPageHref())
},gotoLastPage:function(){this._loadEntriesForPage(this.getLastPageHref())
},gotoPreviousPage:function(){this._loadEntriesForPage(this.getPreviousPageHref())
},gotoNextPage:function(){this._loadEntriesForPage(this.getNextPageHref())
},refresh:function(){this.getEntries(this.getCurrentPageHref())
},_setProperties:function(D){var E=C(D);
this.setStartIndex(parseInt(E.find("startIndex").text(),10));
this.setTotalEntries(parseInt(E.find("totalEntries").text(),10));
this.setNextPageHref(E.find("link[rel='next']").attr("href"));
this.setPreviousPageHref(E.find("link[rel='previous']").attr("href"));
this.setFirstPageHref(E.find("link[rel='first']").attr("href"));
this.setLastPageHref(E.find("link[rel='last']").attr("href"));
this.triggerUpdated()
},_handleError:function(D){this.triggerErrorOccured(D)
}})
});