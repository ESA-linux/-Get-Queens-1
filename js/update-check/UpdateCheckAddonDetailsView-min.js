UPM.define("UpdateCheckAddonDetailsView",["BaseView","UpdateCheckAddonDetailsTemplate"],function(A,B){return A.extend({template:B,_getData:function(){return{plugin:this.model.toJSON()}
}})
});