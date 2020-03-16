UPM.require(["brace","jquery","PurchasedAddonsPageView","PurchasedAddonsModel","PurchasedAddonsCollectionView","UpmCommonUi"],function(A,D,F,B,C,E){E.getReadyState().done(function(){var G=new B();
var H=D("#upm-install-purchases .upm-plugin-list");
new F({el:D("#upm-container"),model:G});
G.on("sync",function(){var I=new C({collection:G.getPurchasedAddons(),el:H});
I.render()
});
G.fetch()
})
});