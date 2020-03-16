UPM.define("AddonModuleView",["jquery","BaseView","CollectionItemRenderingStrategy","AddonModuleTemplate","ManageAddonFlows"],function(D,C,E,B,A){return C.extend({template:B,renderingStrategy:E,events:{"click .upm-module-disable":"_onDisable","click .upm-module-enable":"_onEnable"},_initEvents:function(){this.listenTo(this.model,"change",this.render)
},_getData:function(){return{module:this.model.toJSON()}
},_onDisable:function(F){F.preventDefault();
A.disableAddonModule(this.model)
},_onEnable:function(F){F.preventDefault();
A.enableAddonModule(this.model)
}})
});