(api => {
    "use strict";
    api.ModulePageBreak = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        preview(data) {
            const module = createElement('','module module-page-break');
            module.append(doc.createTextNode(i18n.pbreak),createElement('span','page-break-order'));
            return module;
        }
        static countModules() {
            const builder=api.Builder.get().el,
                cl=api.isVisual?'module-page-break':'tb-page-break';
            for (let modules=builder.tfClass(cl),i = modules.length - 1; i > -1; --i) {
                if (api.isVisual) {
                    modules[i].tfClass('page-break-order')[0].textContent = (i + 1);
                } else {
                    let pagebreak=modules[i].tfClass('page-break-overlay')[0],
                    text=i18n.pbreak + (i + 1);
                    if(pagebreak){
                        pagebreak.textContent = text;
                    }else{
                        modules[i].prepend(createElement('','page-break-overlay',text));
                    }
                }
            }
        }
        static cols() {
            return [{
                cols: [{
                    grid_class: 'col-full',
                    modules: [{
                        mod_name: 'page-break'
                    }]
                }],
                styling: {
                    custom_css_row: 'tb-page-break'
                }
            }];
        }
    };
})(tb_app);