(api => {
    "use strict";
    api.ModuleMenu = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_menu',
                    type: 'title'
                },
                {
                    id: 'layout_menu',
                    type: 'layout',
                    label: 'menul',
                    mode: 'sprite',
                    options: [
                        {
                            img: 'menu_bar',
                            value: 'menu-bar',
                            label: 'menubar'
                        },
                        {
                            img: 'menu_fullbar',
                            value: 'fullwidth',
                            label: 'menufbar'
                        },
                        {
                            img: 'menu_vertical',
                            value: 'vertical',
                            label: 'menuv'
                        }
                    ],
                    binding: {
                        not_empty: {
                            hide: 'accordion',
                            show:'mega'
                        },
                        vertical: {
                            show: 'accordion',
                            hide : 'mega'
                        }
                    },
                    control: {
                        classSelector: '.ui'
                    }
                },
                {
                    id: 'accordion',
                    label: 'accst',
                    type: 'toggle_switch',
                    options: {
                        on: {
                            name: 'allow_menu',
                            value: 'en'
                        },
                        off: {
                            name: '',
                            value: 'dis'
                        }
                    }
                },
                {
                    id: 'custom_menu',
                    type: 'select',
                    dataset: 'menu',
                    description: i18n.addmore+' <a href="'+themifyBuilder.admin_url+'/nav-menus.php" target="_blank">'+i18n.lmenu+'</a>',
                    label: 'menuc',
                    options: []
                },
                {
                    id: 'allow_menu_fallback',
                    label: '',
                    type: 'checkbox',
                    options: [
                        {
                            name: 'allow_fallback',
                            value: 'listallfail'
                        }
                    ]
                },
                {
                    id : 'mega',
                    label : 'megam',
                    type : 'toggle_switch',
                    options: {
                        on: {
                            name: 'y',
                            value: 'en'
                        },
                        off: {
                            name: '',
                            value: 'dis'
                        }
                    },
                    help : 'megamh'
                },
                {
                    id: 'allow_menu_breakpoint',
                    label: 'mobmenu',
                    type: 'toggle_switch',
                    options: {
                        on: {
                            name: 'allow_menu',
                            value: 'en'
                        },
                        off: {
                            name: '',
                            value: 'dis'
                        }
                    },
                    binding: {
                        checked: {
                            show: [
                                'menu_breakpoint',
                                'menu_slide_direction',
                                'mobile_menu_style'
                            ]
                        },
                        not_checked: {
                            hide: [
                                'menu_breakpoint',
                                'menu_slide_direction',
                                'mobile_menu_style'
                            ]
                        }
                    }
                },
                {
                    id: 'menu_breakpoint',
                    label: '',
                    type: 'number',
                    after: 'bppx',
                    binding: {
                        empty: {
                            hide: 'menu_slide_direction'
                        },
                        not_empty: {
                            show: 'menu_slide_direction'
                        }
                    },
                    wrap_class: 'tb_checkbox_element_allow_menu'
                },
                {
                    id: 'mobile_menu_style',
                    label: '',
                    type: 'select',
                    after: 'stl',
                    options: {
                        slide: 'slide',
                        overlay: 'overlay',
                        dropdown: 'drpdwn'
                    },
                    binding: {
                        slide: {
                            show: 'menu_slide_direction'
                        },
                        overlay: {
                            show: 'menu_slide_direction'
                        },
                        dropdown: {
                            hide: 'menu_slide_direction'
                        }
                    },
                    wrap_class: 'tb_checkbox_element_allow_menu'
                },
                {
                    id: 'menu_slide_direction',
                    label: '',
                    type: 'select',
                    after: 'sldir',
                    options: {
                        right: 'right',
                        left: 'left'
                    },
                    wrap_class: 'tb_checkbox_element_allow_menu'
                },
                {
                    id: 'tooltips',
                    type: 'toggle_switch',
                    label: 'menutlt',
                    default: 'off',
                    options: 'simple'
                },
                {
                    id: 'color_menu',
                    type: 'layout',
                    label: 'c',
                    class: 'tb_colors',
                    mode: 'sprite',
                    color: true,
                    transparent: true,
                    control: {
                        classSelector: '.ui'
                    }
                },
                {
                    id: 'according_style_menu',
                    type: 'checkbox',
                    label: 'app',
                    appearance: true
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_menu'
                }
            ];
        }
        static getGroup(){
            return ['general', 'site'];
        }
        static default() {
            return {
                allow_menu_fallback: 'allow_fallback'
            };
        }
        getExcerpt(data) {
            let setting = data || this.get('mod_settings'),
            menu=setting.custom_menu;
            if(menu){
                const allMenus=ThemifyConstructor.select.cache.get('menu');
                if(allMenus?.[menu]){
                    menu=allMenus[menu];
                }
            }
            return api.Helper.limitString(menu);
        }
        static builderSave(settings){
            const def={
                layout_menu:'menu-bar',
                color_menu:'default',
                menu_slide_direction:'right',
                mobile_menu_style:'slide',
                tooltips:'no',
                according_style_menu:false,
                allow_menu_fallback:false
            },
            units=['font_size_menu_dropdown_links','l_h_m_d_l','l_s_m_d_l','f_s_m_d_l_h','f_s_m_m','l_h_m_m','l_s_m_m','f_s_m_m_h'];

            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(!settings.according_style_menu || settings.according_style_menu==='|'){
                delete settings.according_style_menu;
            }
            if(!settings.allow_menu_fallback || settings.allow_menu_fallback==='|'){
                delete settings.allow_menu_fallback;
            }
            if(settings.layout_menu!=='vertical'){
                delete settings.accordion;
            } else {
                delete settings.mega;
            }
            if(!settings.allow_menu_breakpoint){
                delete settings.menu_breakpoint;
                delete settings.mobile_menu_style;
                delete settings.menu_slide_direction;
            }
            else if(settings.mobile_menu_style==='dropdown'){
                delete settings.menu_slide_direction;
            }
            for(let bps=api.breakpointsReverse,i=bps.length-1;i>-1;--i){
                let bp=bps[i];
                //Text Shadow
                this.clearShadow('text-shadow',0,bp,settings);
                this.clearShadow('t_sh_h',0,bp,settings);
                this.clearShadow('t_sh_m_t',0,bp,settings);
                this.clearShadow('t_sh_m_t_h',0,bp,settings);
                this.clearShadow('t_sh_l',0,bp,settings);
                this.clearShadow('t_sh_l_h',0,bp,settings);
                this.clearShadow('t_sh_m',0,bp,settings);
                this.clearShadow('t_sh_m_h',0,bp,settings);
                //paddings
                this.clearPadding('padding',bp,settings);
                this.clearPadding('p_h',bp,settings);
                this.clearPadding('p_m_l',bp,settings);
                this.clearPadding('p_m_l_h',bp,settings);
                this.clearPadding('d_l_p',bp,settings);
                this.clearPadding('d_l_p_h_h',bp,settings);
                this.clearPadding('p_m_m_ct',bp,settings);
                this.clearPadding('p_m_m_ct_h',bp,settings);
                this.clearPadding('p_m_m',bp,settings);
                this.clearPadding('p_m_m_h',bp,settings);
                this.clearPadding('p_m_m_i',bp,settings);
                this.clearPadding('p_m_m_i_h',bp,settings);
                this.clearPadding('p_m_m_cb',bp,settings);
                this.clearPadding('p_m_m_cb_h',bp,settings);
                //margin
                this.clearPadding('margin',bp,settings);
                this.clearPadding('m_h',bp,settings);
                this.clearPadding('m_m_l',bp,settings);
                this.clearPadding('m_m_l_h',bp,settings);
                this.clearPadding('d_l_m',bp,settings);
                this.clearPadding('d_l_m_h_h',bp,settings);
                this.clearPadding('m_m_m',bp,settings);
                this.clearPadding('m_m_m_h',bp,settings);
                this.clearPadding('m_m_m_i',bp,settings);
                this.clearPadding('m_m_m_i_h',bp,settings);
                this.clearPadding('m_m_m_cb',bp,settings);
                this.clearPadding('m_m_m_cb_h',bp,settings);
                //border-radius
                this.clearPadding('b_ra',bp,settings);
                this.clearPadding('r_c_h',bp,settings);
                this.clearPadding('r_c_m_l',bp,settings);
                this.clearPadding('r_c_m_l_h',bp,settings);
                this.clearPadding('r_c_m_m_cb',bp,settings);
                this.clearPadding('r_c_m_m_cb_h',bp,settings);
                //border
                this.clearBorder('border',bp,settings);
                this.clearBorder('b_h',bp,settings);
                this.clearBorder('b_m_l',bp,settings);
                this.clearBorder('b_m_l_h',bp,settings);
                this.clearBorder('b_m_c_l',bp,settings);
                this.clearBorder('b_m_c_l_h',bp,settings);
                this.clearBorder('d_l_b',bp,settings);
                this.clearBorder('d_l_b_h_h',bp,settings);
                this.clearBorder('b_m_m_ct',bp,settings);
                this.clearBorder('b_m_m_ct_h',bp,settings);
                this.clearBorder('b_m_m',bp,settings);
                this.clearBorder('b_m_m_h',bp,settings);
                this.clearBorder('mm_c_l_b',bp,settings);
                this.clearBorder('mm_c_l_b_h_h',bp,settings);
                this.clearBorder('b_m_m_i',bp,settings);
                this.clearBorder('b_m_m_i_h',bp,settings);
                this.clearBorder('b_m_m_cb',bp,settings);
                this.clearBorder('b_m_m_cb_h',bp,settings);
                //filters
                this.clearFilter('bl_m','css_f',bp,settings);
                this.clearFilter('_h','css_f_h',bp,settings);
                //width,height
                this.clearWidth('w',bp,settings);
                this.clearWidth('wh_m_m_ct',bp,settings);
                this.clearWidth('w_m_m_i',bp,settings);
                this.clearWidth('w_m_m_cb',bp,settings);
                this.clearWidth('ht',bp,settings,1);
                this.clearWidth('h_m_m_i',bp,settings,1,'mi_m_i','mx_m_i');
                this.clearWidth('h_m_m_cb',bp,settings,1,'mi_m_cb','mx_m_cb');
                //Box Shadow
                this.clearShadow('b_sh',1,bp,settings);
                this.clearShadow('sh_h',1,bp,settings);
                this.clearShadow('sh_m_l',1,bp,settings);
                this.clearShadow('sh_m_l_h',1,bp,settings);
                this.clearShadow('sh_m_c_l',1,bp,settings);
                this.clearShadow('sh_m_c_l_h',1,bp,settings);
                this.clearShadow('sh_m_m_ct',1,bp,settings);
                this.clearShadow('sh_m_m_ct_h',1,bp,settings);
                this.clearShadow('sh_m_m_cb',1,bp,settings);
                this.clearShadow('sh_m_m_cb_h',1,bp,settings);
                //position
                this.clearPosition('po',bp,settings);
                //transform
                this.clearTransform('tr',bp,settings);
                this.clearTransform('tr-h',bp,settings);
                //units
                this.clearUnits(units,bp,settings);
            }
            super.builderSave(settings);
        }
    };
})(tb_app);