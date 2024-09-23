(api => {
    "use strict";
    api.Subrow =class extends api.Row {
        constructor(fields) {
            super(fields);
            this.type='subrow';
            super.initialize();
            super.render();
        }
        static getOptions(){
            const options=api.Base.getOptions('subrow');
            options.unshift({
                  type:'grid'  
            });
            return options;
        }
        static getSettingsName(slug){
            return i18n.subropt;
        }
        attributes() {
            return {
                class: 'active_module active_subrow tf_w'
            };
        }
        static builderSave(settings){
            if(settings.subrow_user_role===false || settings.subrow_user_role==='|' || settings.subrow_user_role==='false'){
                delete settings.subrow_user_role;
            }
            super.builderSave(settings,'subrow');
        }
    };

})(tb_app);