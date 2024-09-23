(api => {
    "use strict";
    api.Column=class extends api.Base {
        constructor(fields,isSubCol) {
            super(fields);
            this.type='column';
            if(isSubCol===true){
                this.isSubCol=true;
            }
            this.initialize();
            this.render();
        }
        static getSettingsName(){
            return i18n.colopt;
        }
        static getAnimation(){
            return false;
        }
        static getVisibility(){
            return false;
        }
        defaults(){
            return {
                modules: [],
                styling: {}
            };
        }
        attributes() {
            const cl = this.get('grid_class'),
                attr = {
                    class: 'module_column tb_' + this.id
                };
            attr.class += true === this.isSubCol ? ' sub_column' : ' tb-column';
            if (cl) {
                attr.class += ' ' + cl;
            }
            if(this.oldPadding===true){
                attr.class += ' tb_old_padding';
            }
            return attr;
        }
        render() {
            let modules = this.get('modules');
            // check if it has module
            if (modules) {
                if(!Array.isArray(modules)){//very very old saved data can be object, not array.
                    modules=Object.values(modules);
                }
                const holder = this.el.tfClass('tb_holder')[0],
                    fr = createDocumentFragment();
                for (let i=0;i<modules.length;++i) {
                    if (modules[i] !== undefined && modules[i] !== null) {
                        let module = modules[i].mod_name !== undefined ? api.Module.initModule(modules[i]) : (new api.Subrow(modules[i]));
                        fr.appendChild(module.el);
                    }
                    else{
                        modules.splice(i,1);
                    }
                }
                holder.appendChild(fr);
            }
            return this;
        }
        static builderSave(settings){
            api.Row.builderSave(settings,'column');
        }
    };
})(tb_app);