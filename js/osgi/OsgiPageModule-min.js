UPM.define("OsgiPageModule",["brace","jquery","OsgiPageView","OsgiBundleCollection"],function(B,D,C,A){return B.Model.extend({initialize:function(){var E=new A();
new C({model:E,el:D("#upm-container")});
E.getBundles()
}})
});