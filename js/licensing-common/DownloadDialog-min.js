UPM.define("DownloadDialog",["UpmDialog","DownloadDialogTemplate"],function(A,B){return A.extend({template:B,_getData:function(){return{pluginName:this.model.getName(),binaryUrl:this.model.getLinks().binary||this.model.getLinks()["external-binary"],homepageUrl:this.model.getLinks().details}
}})
});