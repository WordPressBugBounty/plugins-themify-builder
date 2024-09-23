(api => {
    "use strict";
    api.ModulePlainText = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'plain_text',
                    type: 'textarea',
                    codeeditor: 'htmlmixed',
                    control: {
                        selector: '.tb_text_wrap'
                    }
                },
                {
                    id: 'formatting',
                    type: 'toggle_switch',
                    label: 'contfrmt',
                    default: 'on',
                    options: {
                        on: {
                            name: '',
                            value: 'en'
                        },
                        off: {
                            name: '1',
                            value: 'dis'
                        }
                    },
                    help: 'contfrmth'
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'add_css_text'
                }
            ];
        }
        static builderSave(settings){
            for(let bps=api.breakpointsReverse,i=bps.length-1;i>-1;--i){
                let bp=bps[i];
                 //Image Gradient
                this.clearImageGradient('background_image','background_color','background_repeat','background_position',bp,settings);
                this.clearImageGradient('b_i_h','bg_c_h','b_r_h','b_p_h',bp,settings);
                //Font color
                this.clearFontColor('font_color_type','font_color','font_gradient_color',bp,settings);
                this.clearFontColor('f_c_t_h','f_c_h','f_g_c_h',bp,settings);
                //Text Shadow
                this.clearShadow('t_sh_h',0,bp,settings);
                this.clearShadow('t_sh_h_h',0,bp,settings);
                //paddings
                this.clearPadding('padding',bp,settings);
                this.clearPadding('p_h',bp,settings);
                //margin
                this.clearPadding('margin',bp,settings);
                this.clearPadding('m_h',bp,settings);
                //border-radius
                this.clearPadding('b_ra',bp,settings);
                this.clearPadding('r_c_h',bp,settings);
                //border
                this.clearBorder('border',bp,settings);
                this.clearBorder('b_h',bp,settings);
                //filters
                this.clearFilter('bl_m','css_f',bp,settings);
                this.clearFilter('_h','css_f_h',bp,settings);
                //width,height
                this.clearWidth('w',bp,settings);
                this.clearWidth('ht',bp,settings,1);
                //Box Shadow
                this.clearShadow('b_sh',1,bp,settings);
                this.clearShadow('sh_h',1,bp,settings);
                //position
                this.clearPosition('po',bp,settings);
                //transform
                this.clearTransform('tr',bp,settings);
                this.clearTransform('tr-h',bp,settings);
            }
            super.builderSave(settings);
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString(setting.plain_text);
        }
        preview(data) {
            const module = createElement(),
                    content = this.constructor._setEditableContent(createElement('','tb_text_wrap'),'plain_text','',1),
                    classes = ['module', 'module-plain-text'],
                    html = data.plain_text;
            if (data.add_css_text) {
                classes.push(data.add_css_text);
            }
            module.className = classes.join(' ');
            if(html){
                content.innerHTML = this.shortcodeToHTML(html).content;
            }
            module.appendChild(content);
            return module;
        }
    };
})(tb_app);