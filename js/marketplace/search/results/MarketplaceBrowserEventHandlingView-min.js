UPM.define("MarketplaceBrowserEventHandlingView",["jquery","BaseView"],function(B,A){return A.extend({events:{"click .upm-plugins-see-more":"_displayNextPage"},_displayNextPage:function(C){C.preventDefault();
this.model.loadNextPage()
}})
});