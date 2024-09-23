(api => {
    "use strict";
    api.ModuleIcon = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'content_icon',
                    type: 'builder',
                    options: [
                        {
                            id: 'icon_type',
                            type: 'radio',
                            label: 'icont',
                            options: [
                                {
                                    value: 'icon',
                                    name: 'icon'
                                },
                                {
                                    value: 'image',
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
                            type: 'group',
                            wrap_class: 'tb_group_element_image',
                            options: [
                                {
                                    id: 'image',
                                    type: 'image',
                                    label: 'imgurl'
                                },
                                {
                                    type: 'multi',
                                    label: '',
                                    options: [
                                        {
                                            id: 'w_i',
                                            label: 'w',
                                            type: 'number',
                                            after: 'px'
                                        },
                                        {
                                            id: 'h_i',
                                            type: 'number',
                                            label: 'ht',
                                            after: 'px'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: 'icon',
                            wrap_class: 'tb_group_element_icon',
                            options: [
                                {
                                    id: 'icon',
                                    type: 'icon',
                                    label: 'icon'
                                },
                                {
                                    id: 'c',
                                    type: 'color',
                                    label: 'c'
                                }
                            ]
                        },
                        {
                            wrap_class: 'tb_group_element_l',
                            type: 'lottie'
                        },
                        {
                            id: 'bg',
                            type: 'color',
                            label: 'bg'
                        },
                        {
                            id: 'label',
                            type: 'text',
                            label: 'label',
                            control: {
                                selector: '.module-icon-item>span'
                            }
                        },
                        {
                            id: 'hide_label',
                            type: 'checkbox',
                            label: '',
                            options: [
                                {
                                    name: 'hide',
                                    value: 'hlabel'
                                }
                            ]
                        },
                        {
                            id: 'link',
                            type: 'url',
                            label: 'l',
                            binding: {
                                empty: {
                                    hide: [
                                        'link_options',
                                        'lightbox_size'
                                    ]
                                },
                                not_empty: {
                                    show: [
                                        'link_options',
                                        'lightbox_size'
                                    ]
                                }
                            }
                        },
                        {
                            id: 'link_options',
                            type: 'radio',
                            label: 'o_l',
                            link_type: true,
                            option_js: true,
                            wrap_class: ' tb_compact_radios'
                        },
                        {
                            type: 'multi',
                            label: 'lbdim',
                            options: [
                                {
                                    id: 'lightbox_width',
                                    label: 'w',
                                    control: false,
                                    type: 'range',
                                    units: {
                                        px: {
                                            max: 3500
                                        },
                                        '%': '',
                                        em: {
                                            min: -50,
                                            max: 50
                                        }
                                    }
                                },
                                {
                                    id: 'lightbox_height',
                                    label: 'ht',
                                    control: false,
                                    type: 'range',
                                    units: {
                                        px: {
                                            max: 3500
                                        },
                                        '%': '',
                                        em: {
                                            min: -50,
                                            max: 50
                                        }
                                    }
                                }
                            ],
                            wrap_class: 'tb_group_element_lightbox'
                        }
                    ]
                },
                {
                    type: 'group',
                    label: 'ilay',
                    display: 'accordion',
                    options: [
                        {
                            id: 'icon_size',
                            label: 'size',
                            type: 'layout',
                            mode: 'sprite',
                            options: [
                                {
                                    img: 'normall_button',
                                    value: 'normal',
                                    label: 'n'
                                },
                                {
                                    img: 'small_button',
                                    value: 'small',
                                    label: 'sml'
                                },
                                {
                                    img: 'large_button',
                                    value: 'large',
                                    label: 'lrg'
                                },
                                {
                                    img: 'xlarge_button',
                                    value: 'xlarge',
                                    label: 'xlrg'
                                }
                            ],
                            control: {
                                classSelector: ''
                            }
                        },
                        {
                            id: 'icon_style',
                            label: 'ishape',
                            type: 'layout',
                            mode: 'sprite',
                            options: [
                                {
                                    img: 'circle_button',
                                    value: 'circle',
                                    label: 'circle'
                                },
                                {
                                    img: 'rounded_button',
                                    value: 'rounded',
                                    label: 'rounded'
                                },
                                {
                                    img: 'squared_button',
                                    value: 'squared',
                                    label: 'squared'
                                },
                                {
                                    img: 'none',
                                    value: 'none',
                                    label: 'none'
                                }
                            ],
                            control: {
                                classSelector: ''
                            }
                        },
                        {
                            id: 'icon_arrangement',
                            label: 'arrang',
                            type: 'layout',
                            mode: 'sprite',
                            default:'icon_horizontal',
                            options: [
                                {
                                    img: 'horizontal_button',
                                    value: 'icon_horizontal',
                                    label: 'hrztal'
                                },
                                {
                                    img: 'vertical_button',
                                    value: 'icon_vertical',
                                    label: 'vertical'
                                }
                            ],
                            control: {
                                classSelector: ''
                            }
                        },
                        {
                            id: 'icon_position',
                            type: 'icon_radio',
                            label: 'iconp',
                            aligment2: true
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_icon'
                }
            ];
        }
        static default() {
            return {
                content_icon: [
                    {
                        icon: 'fa-home',
                        label: i18n.ilabel,
                        bg: '#4d7de1',
                        c: '#edf3ff'
                    }
                ]
            };
        }
        static builderSave(settings) {
            const def = {
                icon_size: 'normal',
                icon_style: 'circle',
                icon_arrangement: 'icon_horizontal',
                icon_position:'left'
            },
            icons = settings.content_icon,
            units=['f_s_i','f_s_i_h'];
            if(settings.icon_position === 'undefined'){
                delete settings.icon_position;
            }
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            if (icons) {
                const iconDef = {
                    icon_type: 'icon',
                    lightbox_width_unit: 'px',
                    lightbox_height_unit: 'px',
                    link_options: 'regular'
                },
                lottieDel = [
                    'st',
                    'count',
                    'sp',
                    'dir',
                    'seg',
                    'fid',
                    'r',
                    'lp'
                ];
                for (let i = icons.length - 1; i > -1; --i) {
                    let icon = icons[i],
                            iconType = icon.icon_type;
                    for (let key in iconDef) {
                        if (icon[key] === iconDef[key]) {
                            delete icon[key];
                        }
                    }
                    if (iconType === 'image' || iconType === 'l') {
                        delete icon.icon;
                    }
                    if (!icon.icon) {
                        delete icon.c;
                    }
                    if (iconType === 'image') {
                        delete icon.icon_color_bg;
                        delete icon.bg;
                    } else {
                        delete icon.image;
                    }

                    if (!icon.image) {
                        delete icon.w_i;
                        delete icon.h_i;
                    }

                    if (iconType !== 'l') {
                        delete icon.path;
                    }
                    if (!icon.path) {
                        for (let i = lottieDel.length - 1; i > -1; --i) {
                            if (icon[lottieDel[i]] !== undefined) {
                                delete icon[lottieDel[i]];
                            }
                        }
                    }

                    if (!icon.link) {
                        delete icon.link_options;
                    }
                    if (icon.link_options !== 'lightbox') {
                        delete icon.lightbox_width;
                        delete icon.lightbox_height;
                    }
                    if (!icon.lightbox_width) {
                        delete icon.lightbox_width_unit;
                    }
                    if (!icon.lightbox_height) {
                        delete icon.lightbox_height_unit;
                    }
                    if (!icon.hide_label || !icon.label || icon.hide_label==='|' || icon.hide_label==='false') {
                        delete icon.hide_label;
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
                this.clearFontColor('f_c_t_f_c_h','f_c_f_c_h','f_g_c_f_c_h',bp,settings);
                //Text Shadow
                this.clearShadow('text-shadow',0,bp,settings);
                this.clearShadow('t_sh_h',0,bp,settings);
                //paddings
                this.clearPadding('padding',bp,settings);
                this.clearPadding('p_h',bp,settings);
                this.clearPadding('p_ctn',bp,settings);
                this.clearPadding('p_ctn_h',bp,settings);
                this.clearPadding('p_i',bp,settings);
                this.clearPadding('p_i_h',bp,settings);
                //margin
                this.clearPadding('margin',bp,settings);
                this.clearPadding('m_h',bp,settings);
                this.clearPadding('m_ctn',bp,settings);
                this.clearPadding('m_ctn_h',bp,settings);
                this.clearPadding('m_i',bp,settings);
                this.clearPadding('m_i_h',bp,settings);
                //border-radius
                this.clearPadding('b_ra',bp,settings);
                this.clearPadding('r_c_h',bp,settings);
                this.clearPadding('r_c_ctn',bp,settings);
                this.clearPadding('r_c_ctn_h',bp,settings);
                this.clearPadding('r_c_i',bp,settings);
                this.clearPadding('r_c_i_h',bp,settings);
                //border
                this.clearBorder('border',bp,settings);
                this.clearBorder('b_h',bp,settings);
                this.clearBorder('b_ctn',bp,settings);
                this.clearBorder('b_ctn_h',bp,settings);
                //filters
                this.clearFilter('bl_m','css_f',bp,settings);
                this.clearFilter('_h','css_f_h',bp,settings);
                //width,height
                this.clearWidth('w',bp,settings);
                this.clearWidth('ht',bp,settings,1);
                //Box Shadow
                this.clearShadow('b_sh',1,bp,settings);
                this.clearShadow('sh_h',1,bp,settings);
                this.clearShadow('b_sh_ctn',1,bp,settings);
                this.clearShadow('b_sh_ctn_h',1,bp,settings);
                this.clearShadow('b_sh_i',1,bp,settings);
                this.clearShadow('b_sh_i_h',1,bp,settings);
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
        _getItem(item, data) {
            let iconType = item.icon_type || 'icon',
                link,
                iconItem,
                icon = iconType !== 'image' ? (iconType !== 'l' ? (item.icon ? api.Helper.getIcon(item.icon) : '') : api.Helper.getLottie(item, 'parent')) : item.image,
                label = item.label && item.hide_label !== 'hide' ? createElement('span') : null,
                wrap = createElement('', 'module-icon-item tf_rel tb_is_repeat'),
                constructor=this.constructor;
                
            if (icon) {
                if (iconType === 'image') {
                    iconItem = constructor.setEditableImage(createElement('img',{class:'tf_box','data-globalsize':0}),'image','w_i','h_i',item,'content_icon');
                }
                else {
                    let st = [],
                    color_bg = item.icon_color_bg && item.icon_color_bg !== 'default' ?' '+item.icon_color_bg : '';
                    iconItem = createElement('em','tf_box' + color_bg);
                    if (item.bg) {
                        st.push('background:' + api.Helper.toRGBA(item.bg));
                    }
                    if (item.c) {
                        st.push('color:' + api.Helper.toRGBA(item.c));
                    }
                    if (st.length > 0) {
                        iconItem.style = st.join(';');
                    }
                    iconItem.appendChild(icon);
                }
            }
            if (label) {
                label.dataset.noUpdate = 1;
                constructor._setEditableContent(label,'label',item.label,'','content_icon');
            }

            if (item.link) {
                let linkOptions = item.link_options;
                link = createElement('a');
                link.href = item.link;
                if (linkOptions === 'newtab') {
                    link.target = '_blank';
                    link.rel = 'noopener';
                } 
                else if (linkOptions === 'lightbox') {
                    link.className = 'lightbox-builder themify_lightbox';
                    if (item.lightbox_width || item.lightbox_height) {
                        link.dataset.zoomConfig = item.lightbox_width + item.lightbox_width_unit + '|' + item.lightbox_height + item.lightbox_height_unit;
                    }
                }
                if (iconItem) {
                    link.appendChild(iconItem);
                }
                if (label) {
                    link.appendChild(label);
                }
                wrap.appendChild(link);
            } else {
                if (iconItem) {
                    wrap.appendChild(iconItem);
                }
                if (label) {
                    wrap.appendChild(label);
                }
            }
            wrap.appendChild(createElement('span',{role:'button',class:'tb_del_btn tb_del_micon tf_close tb_disable_sorting',title:'Delete Button'}));
            return wrap;
        }
        preview(data) {
            const module = createElement(),
                {content_icon:arr=[],icon_position,icon_arrangement,icon_style,icon_size,css_icon} = data,
                classes = ['module', 'module-icon'];

            if (icon_size) {
                classes.push(icon_size);
            }

            if (icon_style) {
                classes.push(icon_style);
            }

            if (icon_arrangement) {
                classes.push(icon_arrangement);
            }

            if (icon_position && icon_position !== 'undefined') {
                classes.push('tf_text' + icon_position.replace('icon_position_', '')[0]);
            }

            if (css_icon) {
                classes.push(css_icon);
            }
            
            module.tfOn(_CLICK_,e=>{
                const target=e.target,
                    cl=target?.classList;
                if(cl.contains('tb_add_micon') || cl.contains('tb_del_micon')){
                    e.stopPropagation();
                    if(cl.contains('tb_add_micon')){
                        if(api.activeModel?.id===this.id){
                            Themify.triggerEvent(api.LightBox.el.tfClass('add_new')[0],e.type);
                        }
                        else{
                            api.undoManager.start('inlineAdd');
                            const settings=this.get('mod_settings'),
                            def=this.constructor.default().content_icon?.[0] || {},
                            item=this._getItem(def,settings);
                            settings.content_icon??=[];
                            settings.content_icon.push(def);
                            target.parentNode.after(item);
                            item.appendChild(target);
                            this.set('mod_settings',settings);
                            api.undoManager.end('inlineAdd');
                        }
                    }
                    else{
                        const item=target.closest('.module-icon-item'),
                            index=Themify.convert(item.parentNode.tfClass('module-icon-item')).indexOf(item);
                        if(index!==-1){
                            if(api.activeModel?.id===this.id){
                                Themify.triggerEvent(api.LightBox.el.tfClass('tb_delete_row')[index],e.type);
                            }
                            else{
                                api.undoManager.start('inlineDelete');
                                const settings=this.get('mod_settings'),
                                    addBtn=item.tfClass('tb_add_micon')[0];
                                settings.content_icon.splice(index, 1); 
                                this.set('mod_settings',settings);
                                if(addBtn){
                                    item.previousElementSibling?.appendChild(addBtn);
                                }
                                item.remove();
                                api.undoManager.end('inlineDelete');
                            }
                        }
                    }
                }
                
            },{passive:true})
            .className = classes.join(' ');
            
            for (let i = 0,len=arr.length; i < len; ++i) {
                let item=this._getItem(arr[i],data);
                if((len -1)===i){
                    item.appendChild(createElement('span',{role:'button',class:'tb_add_btn tb_add_micon tf_plus_icon tb_disable_sorting',title:'Add Button'}));
                }
                module.appendChild(item);
            }
            return module;
        }
    };
})(tb_app);