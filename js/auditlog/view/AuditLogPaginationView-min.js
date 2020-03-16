UPM.define("AuditLogPaginationView",["BaseView","UpmAjax","UpmFormats","UpmStrings"],function(C,D,B,A){return C.extend({events:{"click .first-log-page":"_goToFirstPage","click .last-log-page":"_goToLastPage","click .previous-log-page":"_goToPreviousPage","click .next-log-page":"_goToNextPage"},_initEvents:function(){this.listenTo(this.model,"updated",this._updatePaginationButtons);
this.listenTo(this.model,"updated",this._updatePaginationText);
this.listenTo(this.model,"errorOccured",D.signalAjaxError)
},_updatePaginationButtons:function(){var E=this.model;
this.$el.find(".first-log-page").toggleClass("disabled",!E.getFirstPageHref());
this.$el.find(".last-log-page").toggleClass("disabled",!E.getLastPageHref());
this.$el.find(".previous-log-page").toggleClass("disabled",!E.getPreviousPageHref());
this.$el.find(".next-log-page").toggleClass("disabled",!E.getNextPageHref())
},_updatePaginationText:function(){var E=this.model,H=E.getStartIndex(),G=E.getTotalEntries(),F=E.getCollection().length;
this.$el.find(".upm-audit-log-count").text(B.format(A["upm.auditLog.count"],H+1,H+F,G))
},_goToFirstPage:function(E){E.preventDefault();
this.model.gotoFirstPage()
},_goToLastPage:function(E){E.preventDefault();
this.model.gotoLastPage()
},_goToPreviousPage:function(E){E.preventDefault();
this.model.gotoPreviousPage()
},_goToNextPage:function(E){E.preventDefault();
this.model.gotoNextPage()
}})
});