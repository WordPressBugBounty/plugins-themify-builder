(api => {
    "use strict";
    api.ModuleFancyHeading = class extends api.Module {
        constructor(fields) {
            const settings=fields.mod_settings || {};
            for(let sides=['top','left','right','bottom'],i=sides.length-1;i>-1;--i){
                let side=sides[i];
                for(let bps=api.breakpointsReverse,j=bps.length-1;j>-1;--j){
                    let vals=bps[j]==='desktop'?settings:settings['breakpoint_'+bps[j]];
                    if(vals?.['_margin_'+side+'_divider']!==undefined){
                        vals['md_'+side]=vals['_margin_'+side+'_divider'];
                        delete vals['_margin_'+side+'_divider'];
                        if(vals['_margin_'+side+'_divider_unit']){
                            vals['md_'+side+'_unit']=vals['_margin_'+side+'_divider_unit'];
                            delete vals['_margin_'+side+'_divider_unit'];
                        }
                    }
                }
            }
            super(fields);
        }
        static getOptions() {
            const aligment = [
                {value: 'themify-text-left', name: 'left', icon: api.Helper.getIcon('ti-align-left').outerHTML},
                {value: 'themify-text-center', name: 'center', icon: api.Helper.getIcon('ti-align-center').outerHTML},
                {value: 'themify-text-right', name: 'right', icon: api.Helper.getIcon('ti-align-right').outerHTML}
            ];
            return [
                {
                    id: 'heading',
                    type: 'text',
                    label: 'head',
                    control: {
                        selector: '.main-head'
                    }
                },
                {
                    id: 'heading_link',
                    type: 'url',
                    label: 'hlink'
                },
                {
                    id: 'sub_heading',
                    type: 'text',
                    label: 'shead',
                    control: {
                        selector: '.sub-head'
                    }
                },
                {
                    id: 'sub_heading_link',
                    type: 'url',
                    label: 'sheadl'
                },
                {
                    id: 'icon_type',
                    type: 'radio',
                    label: 'divicon',
                    options: [
                        {
                            value: 'icon',
                            name: 'icon'
                        },
                        {
                            value: 'image_icon',
                            name: 'image'
                        },
                        {
                            value: 'l',
                            name: 'lt'
                        }
                    ],
                    option_js: true
                },
                {
                    id: 'image',
                    type: 'image',
                    label: 'imgurl',
                    wrap_class: 'tb_group_element_image_icon'
                },
                {
                    type: 'multi',
                    label: '',
                    wrap_class: 'tb_group_element_icon',
                    options: [
                        {
                            id: 'icon',
                            type: 'icon',
                            label: 'icon'
                        },
                        {
                            id: 'icon_c',
                            type: 'color',
                            label: 'c',
                            class: 'medium'
                        }
                    ]
                },
                {
                    wrap_class: 'tb_group_element_l',
                    type: 'lottie'
                },
                {
                    id: 'heading_tag',
                    label: 'htt',
                    type: 'select',
                    options: {
                        h1: 'h1',
                        h2: 'h2',
                        h3: 'h3'
                    }
                },
                {
                    id: 'text_alignment',
                    label: 'talign',
                    type: 'icon_radio',
                    options: aligment
                },
                {
                    id: 'inline_text',
                    type: 'checkbox',
                    label: 'inltxt',
                    options: [
                        {
                            name: '1',
                            value: 'dismsh1ln'
                        }
                    ]
                },
                {
                    id: 'divider',
                    label: 'div',
                    type: 'toggle_switch',
                    default: 'on',
                    options: {
                        on: {
                            name: 'yes'
                        },
                        off: {
                            name: 'no'
                        }
                    }
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_class'
                }
            ];
        }
        static default() {
            return {
                heading: i18n.head,
                sub_heading: i18n.shead
            };
        }
        static builderSave(settings){
            const def={
                heading_tag:'h1',
                divider: 'yes',
                inline_text:false,
                icon_type:'icon',
                text_alignment:'left'
            },
            iconType=settings.icon_type,
            units=['main_margin_top','main_margin_bottom','m_h_margin_top','m_h_margin_bottom','font_size_subheading','line_height_subheading','letter_spacing_subheading','sub_margin_top','sub_margin_bottom','f_s_s_h','s_h_margin_top','s_h_margin_bottom','fh_d_s','fh_d_s_h'];
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(settings.text_alignment==='undefined'){
                delete settings.text_alignment;
            }
                
            if(settings.inline_text==='|' || settings.inline_text==='false'){
                delete settings.inline_text;
            }
            if(iconType==='image_icon' || iconType==='l'){
                delete settings.icon;
            }
            if(iconType!=='image_icon'){
                delete settings.image;
            }
            if(iconType!=='l'){
                delete settings.path;
            }
            if(!settings.icon){
                delete settings.icon_c;
            }
            if(!settings.path){
                const lottieDel= [
                    'st',
                    'count',
                    'sp',
                    'dir',
                    'seg',
                    'fid',
                    'r',
                    'lp'
                ];
                for(let i=lottieDel.length-1;i>-1;--i){
                    if(settings[lottieDel[i]]!==undefined){
                        delete settings[lottieDel[i]];
                    }
                }
            }
            for(let bps=api.breakpointsReverse,i=bps.length-1;i>-1;--i){
                let bp=bps[i];
                 //Image Gradient
                this.clearImageGradient('background_image','background_color','background_repeat','background_position',bp,settings);
                this.clearImageGradient('b_i_h','bg_c_h','b_r_h','b_p_h',bp,settings);
                //Font color
                this.clearFontColor('font_color_type','font_color','font_gradient_color',bp,settings);
                this.clearFontColor('f_c_t_h','f_c_h','f_g_c_h',bp,settings);
                this.clearFontColor('font_color_type_subheading','font_color_subheading','font_gradient_color_subheading',bp,settings);
                this.clearFontColor('f_c_t_s_h','f_c_s_h','f_g_c_s_h',bp,settings);
                //Text Shadow
                this.clearShadow('t_sh_h',0,bp,settings);
                this.clearShadow('t_sh_h_h',0,bp,settings);
                this.clearShadow('t_sh_s_h',0,bp,settings);
                this.clearShadow('t_sh_s_h_h',0,bp,settings);
                //paddings
                this.clearPadding('padding',bp,settings);
                this.clearPadding('p_h',bp,settings);
                this.clearPadding('fh_d_i_p',bp,settings);
                this.clearPadding('fh_d_i_p_h',bp,settings);
                //margin
                this.clearPadding('margin',bp,settings);
                this.clearPadding('m_h',bp,settings);
                this.clearPadding('md',bp,settings);
                this.clearPadding('fh_d_i_m',bp,settings);
                this.clearPadding('fh_d_i_m_h',bp,settings);
                this.clearPadding('fh_d_b_m',bp,settings);
                this.clearPadding('fh_d_b_m_h',bp,settings);
                //border-radius
                this.clearPadding('b_ra',bp,settings);
                this.clearPadding('r_c_h',bp,settings);
                this.clearPadding('fh_d_i_rc',bp,settings);
                this.clearPadding('fh_d_i_rc_h',bp,settings);
                //border
                this.clearBorder('border',bp,settings);
                this.clearBorder('b_h',bp,settings);
                this.clearBorder('d_border',bp,settings);
                this.clearBorder('fh_d_i_b',bp,settings);
                this.clearBorder('fh_d_i_b_h',bp,settings);
                this.clearBorder('fh_d_b_b',bp,settings);
                this.clearBorder('fh_d_b_b_h',bp,settings);
                //filters
                this.clearFilter('bl_m','css_f',bp,settings);
                this.clearFilter('_h','css_f_h',bp,settings);
                //width,height
                this.clearWidth('w',bp,settings);
                this.clearWidth('d_width',bp,settings);
                this.clearWidth('fh_d_b_w',bp,settings);
                this.clearWidth('ht',bp,settings,1);
                //Box Shadow
                this.clearShadow('b_sh',1,bp,settings);
                this.clearShadow('sh_h',1,bp,settings);
                //position
                this.clearPosition('po',bp,settings);
                //transform
                this.clearTransform('tr',bp,settings);
                this.clearTransform('tr-h',bp,settings);
                //margin
                this.clearMarginOpposity('main_margin_top',bp,settings);
                this.clearMarginOpposity('m_h_margin_top',bp,settings);
                this.clearMarginOpposity('sub_margin_top',bp,settings);
                this.clearMarginOpposity('s_h_margin_top',bp,settings);
                //units
                this.clearUnits(units,bp,settings);
            }
            super.builderSave(settings);
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString(setting.heading);
        }
        preview(data) {
            const  inline = data.inline_text?.toString() === '1',
                inlineBlock = !inline ? 'tf_block' : 'tf_inline_b',
                module = createElement(),
                heading = createElement(data.heading_tag || 'h1','fancy-heading'),
                mainHead = createElement('span','main-head ' + inlineBlock),
                subHead = createElement('span','sub-head tf_rel ' + inlineBlock),
                classes = ['module', 'module-fancy-heading'],
                divider = 'no' === data.divider,
                iconType = data.icon_type || 'icon',
                icon = iconType !== 'image_icon' ? (iconType !== 'l' ? (data.icon ? api.Helper.getIcon(data.icon) : '') : api.Helper.getLottie(data, 'parent')) : data.image,
                constructor=this.constructor;
            if (inline) {
                classes.push('inline-fancy-heading');
            }
            if (divider) {
                classes.push('tb_hide_divider');
            }
            if (data.css_class) {
                classes.push(data.css_class);
            }
            module.className = classes.join(' ');

            if (data.text_alignment) {
                heading.className += ' tf_text' + (data.text_alignment.replace('themify-text-', ''))[0];
            }


            if (data.heading_link) {
                mainHead.appendChild(constructor._setEditableContent(createElement('a'),{class:'heading',href:data.heading_link},data.heading));
            } else {
                constructor._setEditableContent(mainHead,'heading',data.heading);
            }

            heading.appendChild(mainHead);

            if (icon) {
                let iconWrap = createElement('span','tb_fancy_heading_icon_wrap ' + inlineBlock),
                        iconHead = createElement('span','tb_fancy_heading_icon'),
                        iconItem;

                if (iconType !== 'image_icon') {
                    iconItem = createElement('em');
                    if (iconType === 'icon' && data.icon_c) {
                        iconItem.style.color = api.Helper.toRGBA(data.icon_c);
                    }
                    iconItem.appendChild(icon);
                } else {
                    iconItem = constructor.setEditableImage(createElement('img'),'image');
                    iconItem.src = icon;
                }
                iconHead.appendChild(iconItem);
                iconWrap.appendChild(iconHead);

                if (!divider) {
                    let border = createElement('span', 'tb_fancy_heading_border tf_rel');
                    iconWrap.appendChild(border.cloneNode());
                    iconWrap.prepend(border);
                }
                heading.appendChild(iconWrap);
            }

            if (data.sub_heading_link) {
                subHead.appendChild(constructor._setEditableContent(createElement('a'),{class:'sub_heading',href:data.sub_heading_link},data.sub_heading));
            } else {
                constructor._setEditableContent(subHead,'sub_heading',data.sub_heading);
            }

            heading.appendChild(subHead);

            module.appendChild(heading);
            return module;
        }
    };
})(tb_app);