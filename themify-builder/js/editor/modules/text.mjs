(api => {
    "use strict";
    api.ModuleText = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_text',
                    type: 'title'
                },
                {
                    id: 'content_text',
                    type: 'wp_editor',
                    control: {
                        selector: '.tb_text_wrap'
                    }
                },
                {
                    id: 'text_drop_cap',
                    label: 'dropcap',
                    type: 'toggle_switch',
                    options: {
                        on: {
                            name: 'dropcap',
                            value: 'en'
                        },
                        off: {
                            name: '',
                            value: 'dis'
                        }
                    }
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'add_css_text'
                }
            ];
        }
        static default() {
            return {
                content_text:('<p>'+i18n.txtcont+'</p>')
            };
        }
        static builderSave(settings) {
            const units=['p_margin_top','p_margin_bottom','dropcap_font_size','dropcap_line_height','d_f_s_h'];
            for (let i = 6; i>0;--i) {
                units.push('font_size_h'+i,'f_s_h'+i+'_h','line_height_h'+i,'letter_spacing_h'+i,'h'+i+'_margin_top','h'+i+'_margin_bottom','h'+i+'_margin_top_h','h'+i+'_margin_bottom_h');
            }
            for(let bps=api.breakpointsReverse,i=bps.length-1;i>-1;--i){
                let bp=bps[i];
                //Image Gradient
                this.clearImageGradient('background_image','background_color','background_repeat','background_position',bp,settings);
                this.clearImageGradient('b_i_h','bg_c_h','b_r_h','b_p_h',bp,settings);
                //Font color
                this.clearFontColor('font_color_type','font_color','font_gradient_color',bp,settings);
                this.clearFontColor('f_c_t_h','f_c_h','f_g_c_h',bp,settings);
                //Text Shadow
                this.clearShadow('text-shadow',0,bp,settings);
                this.clearShadow('t_sh_h',0,bp,settings);
                this.clearShadow('t_sh_m_t',0,bp,settings);
                this.clearShadow('t_sh_m_t_h',0,bp,settings);
                this.clearShadow('t_sh_dr',0,bp,settings);
                this.clearShadow('t_sh_dr_h',0,bp,settings);
                //paddings
                this.clearPadding('padding',bp,settings);
                this.clearPadding('p_h',bp,settings);
                this.clearPadding('dropcap_padding',bp,settings);
                this.clearPadding('d_p_h',bp,settings);
                //margin
                this.clearPadding('margin',bp,settings);
                this.clearPadding('m_h',bp,settings);
                this.clearPadding('dropcap_margin',bp,settings);
                this.clearPadding('d_m_h',bp,settings);
                //border-radius
                this.clearPadding('b_ra',bp,settings);
                this.clearPadding('r_c_h',bp,settings);
                this.clearPadding('rc_dp',bp,settings);
                this.clearPadding('rc_dp_h',bp,settings);
                //border
                this.clearBorder('border',bp,settings);
                this.clearBorder('b_h',bp,settings);
                this.clearBorder('dropcap_border',bp,settings);
                this.clearBorder('d_b_h',bp,settings);
                //filters
                this.clearFilter('bl_m','css_f',bp,settings);
                this.clearFilter('_h','css_f_h',bp,settings);
                //width,height
                this.clearWidth('w',bp,settings);
                this.clearWidth('ht',bp,settings,1);
                //Box Shadow
                this.clearShadow('b_sh',1,bp,settings);
                this.clearShadow('sh_h',1,bp,settings);
                this.clearShadow('sh_dp',1,bp,settings);
                this.clearShadow('sh_dp_h',1,bp,settings);
                //position
                this.clearPosition('po',bp,settings);
                //transform
                this.clearTransform('tr',bp,settings);
                this.clearTransform('tr-h',bp,settings);
                for(let j=6;j>0;--j){
                    this.clearFontColor('font_color_type_h'+j,'font_color_h'+j,'font_gradient_color_h'+j,bp,settings);
                    this.clearFontColor('f_c_t_h'+j+'_h','f_c_h'+j+'_h','f_g_c_h'+j+'_h',bp,settings);
                            
                    this.clearShadow('t_shh'+j,0,bp,settings);
                    this.clearShadow('t_shh'+j+'_h',0,bp,settings);
                    
                    //margin
                    this.clearMarginOpposity('h'+j+'_margin_top',bp,settings);
                    this.clearMarginOpposity('h'+j+'_margin_top_h',bp,settings);
                }
                
                this.clearUnits(units,bp,settings);
            }
            super.builderSave(settings);
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString(setting.content_text);
        }
        preview(data) {
            let module = createElement(),
                    classes = ['module', 'module-text'],
                    html = data.content_text,
                    constructor=this.constructor,
                    content = constructor._setEditableContent(createElement('','tb_text_wrap'),'content_text','',1);
            if (data.add_css_text) {
                classes.push(data.add_css_text);
            }
            if (data.text_drop_cap === 'dropcap') {
                classes.push('tb_text_dropcap');
            }
            module.className = classes.join(' ');
            if (html) {
                content.innerHTML = this.shortcodeToHTML(html).content.replace(/(<|&lt;)!--more(.*?)?--(>|&gt;)/, '<span class="tb-text-more-link-indicator"><span>');;
            }
            if (data.mod_title_text) {
                module.appendChild(constructor.getModuleTitle(data.mod_title_text,'mod_title_text'));
            }
            module.appendChild(content);
            return module;
        }
    };
})(tb_app);