UPM.define("FancySelectOptionCollectionView",["jquery","underscore","BaseCollectionView"],function(D,C,A){var B=C.template("<li data-value='<%= model.value %>'><%= model.text %></li>");
return A.extend({events:{"click li":"_selectOption"},_initEvents:function(){this.listenTo(this.collection,"reset add remove sync",this.render)
},_selectOption:function(E){this.collection.setSelection(D(E.target).data("value"));
E.preventDefault()
},template:function(E){return C.map(E.models,function(F){return B({model:F})
})
}})
});