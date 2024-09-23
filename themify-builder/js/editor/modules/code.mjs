(api => {
    "use strict";
    api.ModuleCode = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'm_t',
                    type: 'title'
                },
                {
                    type: 'code',
                    options: {
                        lng: 'lng',
                        theme: 'colschm'
                    },
                    control: false
                },
                {
                    id: 'numbers',
                    default: 'on',
                    label: 'linen',
                    type: 'toggle_switch',
                    options: 'simple'
                },
                {
                    id: 'copy',
                    default: 'on',
                    label: 'copybtn',
                    type: 'toggle_switch',
                    options: 'simple'
                },
                {
                    id: 'highlight',
                    label: 'highlgtlnes',
                    type: 'text',
                    description: 'highlgtlnesh',
                    control: {
                        event: 'change'
                    }
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css'
                }
            ];
        }
        static default() {
            return {
                lng: 'javascript',
                code: "function summ(a,b){\n\
                        return a+b;\n\
                }"
            };
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString(setting.code);
        }
        static builderSave(settings){
            const def={
                numbers:'yes',
                copy:'yes'
            };
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            super.builderSave(settings);
        }
        preview(data) {
            const module = createElement(),
                    pre =createElement('pre','tf_rel tf_scrollbar tf_textl'),
                    code = createElement('code', 'language-' + data.lng),
                    classes = ['module', 'module-code', 'tf_scrollbar'];
            if (data.css) {
                classes.push(data.css);
            }
            if (data.theme) {
                classes.push('tb_prism_' + data.theme);
                module.dataset.theme = data.theme;
            }
            module.className = classes.join(' ');

            if (data.highlight) {
                pre.dataset.line = data.highlight;
            }
            if (data.numbers !== 'no') {
                code.className += ' line-numbers';
            }
            code.appendChild(document.createTextNode(data.code || ''));

            pre.appendChild(code);

            if (data.copy !== 'no') {
                const icon = createElement('em','tb_code_copy tf_opacity');
                icon.appendChild(api.Helper.getIcon('ti-clipboard'));
                pre.appendChild(icon);
            }

            if (data.m_t) {
                module.appendChild(this.constructor.getModuleTitle(data.m_t,'m_t'));
            }

            module.appendChild(pre);
            return module;
        }
    };
})(tb_app);