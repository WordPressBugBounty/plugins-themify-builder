(api => {
    "use strict";
    api.ModuleCopyright = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'title',
                    type: 'title'
                },
                {
                    id: 'text',
                    type: 'textarea',
                    label: 'copytext'
                },
                {
                    type: 'template_fields',
                    target: 'text',
                    fields: [
                        '%site_name%',
                        '%site_description%',
                        '%site_url%',
                        '%year%'
                    ],
                    title: 'avfields'
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'add_css_text'
                }
            ];
        }
        static default(){
            return {
                text: '© <a href="%site_url%">%site_name%</a> %year%'
            };
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings'),
                tmp = createElement('','',setting.text || '');
            return tmp.innerHTML;
        }
        preview(data) {
            const module = createElement(''),
                    content = createElement('','tb_copyright'),
                    classes = ['module', 'module-copyright'],
                    copyData = themifyBuilder.modules.copyright.site_data;
            let text = data.text || '';

            if (data.add_css_text) {
                classes.push(data.add_css_text);
            }
            module.className = classes.join(' ');

            for (let [key,value] of Object.entries(copyData)) {
                text = text.replaceAll('%' + key + '%', value);
            }
            content.innerHTML = text;
            if (data.title) {
                module.appendChild(this.constructor.getModuleTitle(data.title,'title'));
            }

            module.appendChild(content);
            return module;
        }
    };
})(tb_app);