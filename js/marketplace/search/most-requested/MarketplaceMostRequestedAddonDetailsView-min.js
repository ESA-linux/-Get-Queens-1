UPM.define("MarketplaceMostRequestedAddonDetailsView",["jquery","underscore","MarketplaceAddonDetailsView","AddonRequestMessageTemplate"],function(C,B,A,D){return A.extend({_getData:function(){var G=this.model.getRequests()||[],F="";
for(var E=0;
E<G.length;
E++){F+=D({request:G[E]})
}return B.extend(A.prototype._getData.apply(this),{requestsHtml:F})
}})
});