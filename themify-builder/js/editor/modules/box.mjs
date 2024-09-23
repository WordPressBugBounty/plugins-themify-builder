 (api => { 
    "use strict";
    api.ModuleBox=class extends api.Module{
        constructor(fields) {
            super(fields);
        }
        static getOptions(){
            return [
                {
                    id:'mod_title_box',
                    type: 'title'
                },
                {
                    id: 'content_box',
                    type: 'wp_editor',
                    control: {
                        selector:'.tb_text_wrap'
                    }
                },
                {
                    id: 'color_box',
                    type: 'layout',
                    mode: 'sprite',
                    class: 'tb_colors',
                    label: 'c',
                    color: true,
                    control: {
                        classSelector: '.ui'
                    }
                },
                {
                    id: 'appearance_box',
                    type: 'checkbox',
                    label: 'app',
                    appearance: true
                },
                {
                    type: 'custom_css_id', 
                    custom_css: 'add_css_box'
                }
            ];
        }
        static default() {
            return {
                content_box:'<p>'+i18n.bcont+'</p>'
            };
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString(setting.content_box);
        }
        static builderSave(settings){
            if(!settings.appearance_box || settings.appearance_box==='|' || settings.appearance_box==='false'){
                delete settings.appearance_box;
            }
        }
        preview(data){
            const module=createElement('','module module-box'),
                content=createElement(),
                text=createElement('','tb_text_wrap'),
                color=data.color_box && data.color_box!=='default'?data.color_box:'tb_default_color',
                classes=['ui','module-box-content',color],
                html = data.content_box,
                constructor=this.constructor;
                if(data.add_css_box){
                    classes.push(data.add_css_box);
                }
                if(data.appearance_box){
                    classes.push(data.appearance_box.split('|').join(' ') );
                }
                content.className=classes.join(' ');
                constructor._setEditableContent(text,'content_box','',1);
                if(html){
                    text.innerHTML=this.shortcodeToHTML(html).content;
                }
                content.appendChild(text);
                if(data.mod_title_box){
                    module.appendChild(constructor.getModuleTitle(data.mod_title_box,'mod_title_box'));
                }
                module.appendChild(content);
                return module;
        }
    };
})(tb_app);