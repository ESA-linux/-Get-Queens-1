UPM.define("InstallParams",["brace","UpmEnvironment"],function(B,A){return B.Model.extend({namedAttributes:["filePath","url"],getFileName:function(){if(this.getFilePath()){var C=this.getFilePath().split("\\");
return C[C.length-1]
}else{return null
}}})
});