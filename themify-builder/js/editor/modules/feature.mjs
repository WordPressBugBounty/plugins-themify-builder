(api => {
    "use strict";
    api.ModuleFeature = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_feature',
                    type: 'title'
                },
                {
                    id: 'title_feature',
                    type: 'text',
                    label: 'ftitle',
                    class: 'large',
                    control: {
                        selector: '.module-feature-title a'
                    }
                },
                {
                    id: 'title_tag',
                    type: 'select',
                    label: 'tht',
                    h_tags: true,
                    default: 'h3'
                },
                {
                    id: 'content_feature',
                    type: 'wp_editor',
                    control: {
                        selector: '.tb_text_wrap'
                    }
                },
                {
                    id: 'link_feature',
                    type: 'url',
                    label: 'l',
                    binding: {
                        empty: {
                            hide: ['link_options', 'lightbox_size', 'feature_download_link']
                        },
                        not_empty: {
                            show: ['link_options', 'lightbox_size', 'feature_download_link']
                        }
                    }
                },
                {
                    id: 'feature_download_link',
                    type: 'checkbox',
                    label: 'dwnablink',
                    options: [
                        {name: 'yes', value: 'dwnablef'}
                    ]
                },
                {
                    id: 'link_options',
                    type: 'radio',
                    label: 'o_l',
                    link_type: true,
                    wrap_class: 'tb_compact_radios',
                    option_js: true
                },
                {
                    type: 'multi',
                    label: 'lbdim',
                    options: [
                        {
                            id: 'lightbox_width',
                            label: 'w',
                            type: 'range',
                            control: false,
                            units: {
                                px: {
                                    'max': 3500
                                },
                                em: {
                                    'min': -50,
                                    'max': 50
                                },
                                '%': ''
                            }
                        },
                        {
                            id: 'lightbox_height',
                            label: 'ht',
                            type: 'range',
                            control: false,
                            units: {
                                px: {
                                    'max': 3500
                                },
                                em: {
                                    'min': -50,
                                    'max': 50
                                },
                                '%': ''
                            }
                        }
                    ],
                    wrap_class: 'tb_group_element_lightbox lightbox_size'
                },
                {
                    id: 'overlap_image_feature',
                    type: 'image',
                    label: 'ovimg',
                    binding: {
                        empty: {hide: ['overlap_image_width', 'overlap_image_height']},
                        not_empty: {show: ['overlap_image_width', 'overlap_image_height']}
                    }
                },
                {
                    type: 'multi',
                    label: '',
                    options: [
                        {
                            id: 'overlap_image_width',
                            type: 'number',
                            label: 'w'
                        },
                        {
                            id: 'overlap_image_height',
                            type: 'number',
                            label: 'ht'
                        }
                    ]
                },
                {
                    type: 'group',
                    label: 'flayout',
                    display: 'accordion',
                    options: [
                        {
                            id: 'layout_feature',
                            type: 'layout',
                            label: 'lay',
                            mode: 'sprite',
                            options: [
                                {img: 'icon_top', value: 'icon-top', label: 'itop'},
                                {img: 'icon_left', value: 'icon-left', label: 'ileft'},
                                {img: 'icon_right', value: 'icon-right', label: 'iright'}
                            ],
                            control: {
                                prefix:'layout-',
                                classSelector: ''
                            }
                        },
                        {
                            id: 'layout_mobile',
                            type: 'layout',
                            label: 'mlay',
                            mode: 'sprite',
                            options: [
                                {img: 'icon_top', value: 'icon-top', label: 'itop'},
                                {img: 'icon_left', value: 'icon-left', label: 'ileft'},
                                {img: 'icon_right', value: 'icon-right', label: 'iright'}
                            ]
                        },
                        {
                            type: 'multi',
                            label: 'circle',
                            wrap_class: 'multi_circle_feature',
                            options: [
                                {
                                    id: 'circle_percentage_feature',
                                    type: 'range',
                                    label: 'percent',
                                    class: 'xsmall',
                                    units: {
                                        '%': ''
                                    }
                                },
                                {
                                    id: 'circle_stroke_feature',
                                    type: 'range',
                                    label: 'stroke',
                                    class: 'xsmall',
                                    default:0,
                                    units: {
                                        px: ''
                                    }
                                },
                                {
                                    id: 'circle_color_feature',
                                    type: 'color',
                                    label: 'c'
                                },
                                {
                                    id: 'circle_size_feature',
                                    type: 'select',
                                    label: 'size',
                                    default:'medium',
                                    options: {
                                        small: 'sml',
                                        medium: 'mdm',
                                        large: 'lrg',
                                        custom: 'cus'
                                    },
                                    binding: {
                                        small: {hide: 'custom_circle_size_feature'},
                                        medium: {hide: 'custom_circle_size_feature'},
                                        large: {hide: 'custom_circle_size_feature'},
                                        custom: {show: 'custom_circle_size_feature'}
                                    }
                                },
                                {
                                    id: 'custom_circle_size_feature',
                                    default:120,
                                    type: 'number',
                                    after: 'csizepx'
                                }
                            ]
                        },
                        {
                            id: 'icon_type_feature',
                            type: 'radio',
                            label: 'icont',
                            options: [
                                {value: 'icon', name: 'icon'},
                                {value: 'image_icon', name: 'image'},
                                {value: 'both', name: 'both'}
                            ],
                            option_js: true
                        },
                        {
                            id: 'image_feature',
                            type: 'image',
                            label: 'imgurl',
                            wrap_class: 'tb_group_element_image_icon tb_group_element_both'
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_group_element_icon tb_group_element_both',
                            options: [
                                {
                                    id: 'stype',
                                    label: '',
                                    type: 'radio',
                                    options: [
                                        {value: 'i', name: 'icon'},
                                        {value: 'l', name: 'lt'}
                                    ],
                                    option_js: true
                                },
                                {
                                    type: 'multi',
                                    label: '',
                                    options: [
                                        {
                                            id: 'icon_feature',
                                            wrap_class: 'tb_group_element_i',
                                            type: 'icon',
                                            label: 'icon'
                                        },
                                        {
                                            id: 'icon_color_feature',
                                            wrap_class: 'tb_group_element_i',
                                            type: 'color',
                                            label: 'c',
                                            class: 'medium'
                                        }
                                    ]
                                },
                                {
                                    id: 'icon_bg_feature',
                                    type: 'color',
                                    label: 'bg',
                                    class: 'medium'
                                },
                                {
                                    wrap_class: 'tb_group_element_l',
                                    type: 'lottie'
                                }
                            ]
                        },
                        {
                            id: 'icon_position',
                            type: 'angle',
                            deg: true,
                            label: 'iconp',
                            wrap_class: 'tb_group_element_both'
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_feature'
                }
            ];
        }
        static default() {
            return {
                title_feature: i18n.ftitle,
                content_feature: i18n.fcont,
                circle_percentage_feature: 100,
                circle_stroke_feature: 3,
                icon_feature: 'fa-home',
                layout_feature: 'icon-top',
                circle_size_feature: 'small',
                circle_color_feature: '#de5d5d'
            };
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString((setting.content_feature || setting.title_feature));
        }
        getImage(data) {
            const setting = data || this.get('mod_settings'),
                imgUrl=setting.overlap_image_feature || (setting.icon_type_feature==='image_icon'&& setting.image_feature?setting.image_feature:null),
                img=new Image(32,32);
            if(imgUrl){
                img.src=imgUrl;
                if(!api.activeModel){
                    img.loading='lazy';
                }
                img.alt=this.getName();
                return img;
            }
            return super.getImage(data);
        }
        static builderSave(settings){
            const def={
                layout_feature:'icon-top',
                title_tag:'h3',
                lightbox_width_unit:'px',
                lightbox_height_unit:'px',
                stype:'i',
                layout_mobile:'icon-top',
                circle_size_feature:'medium',
                link_options:'regular',
                icon_type_feature: 'icon',
                custom_circle_size_feature:120,
                feature_download_link:false,
                circle_stroke_feature:0
            },
            customSize=settings.circle_size_feature==='custom'?settings.custom_circle_size_feature:def.custom_circle_size_feature,
            strokeWidth=settings.circle_stroke_feature,
            iconType=settings.icon_type_feature,
            units=['l_s_t','f_s_i','f_s_i_h','f_s_c','l_h_c','l_s_c','f_s_c_h'];

            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(customSize && ~~customSize===def.custom_circle_size_feature){
                delete settings.custom_circle_size_feature;
            }
            if(strokeWidth!==undefined && ~~strokeWidth===def.circle_stroke_feature){
                delete settings.circle_stroke_feature;
            }
            
            if(!settings.link_feature){
                delete settings.feature_download_link;
                delete settings.link_options;
            }
            else if(settings.feature_download_link==='|' || settings.feature_download_link==='false'){
                delete settings.feature_download_link;
            }
            if(settings.link_options!=='lightbox'){
                delete settings.lightbox_width;
                delete settings.lightbox_height;
            }
            if(!settings.lightbox_width){
                delete settings.lightbox_width_unit;
            }
            if(!settings.lightbox_height){
                delete settings.lightbox_height_unit;
            }
            if(iconType==='image_icon'){
                delete settings.stype;
                delete settings.icon_bg_feature;
                delete settings.icon_feature;
            }
            else if(iconType!=='both'){
                delete settings.image_feature;
            }
            
            if(settings.stype!=='l'){
                delete settings.path;
            }
            else{
                delete settings.icon_feature;
            }
            
            if(!settings.icon_feature){
                delete settings.icon_color_feature;
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
            if(iconType!=='both'){
                delete settings.icon_position;
            }
            
            if(!settings.overlap_image_feature){
                delete settings.overlap_image_width;
                delete settings.overlap_image_height;
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
                this.clearShadow('t_sh_t',0,bp,settings);
                this.clearShadow('t_sh_t_h',0,bp,settings);
                this.clearShadow('t_sh_c',0,bp,settings);
                this.clearShadow('t_sh_c_h',0,bp,settings);
                //paddings
                this.clearPadding('padding',bp,settings);
                this.clearPadding('p_h',bp,settings);
                this.clearPadding('c_p',bp,settings);
                this.clearPadding('c_p_h',bp,settings);
                //margin
                this.clearPadding('margin',bp,settings);
                this.clearPadding('m_h',bp,settings);
                this.clearPadding('c_m',bp,settings);
                this.clearPadding('c_m_h',bp,settings);
                //border-radius
                this.clearPadding('b_ra',bp,settings);
                this.clearPadding('r_c_h',bp,settings);
                //border
                this.clearBorder('border',bp,settings);
                this.clearBorder('b_h',bp,settings);
                this.clearBorder('c_b',bp,settings);
                this.clearBorder('c_b_h',bp,settings);
                //filters
                this.clearFilter('bl_m','css_f',bp,settings);
                this.clearFilter('_h','css_f_h',bp,settings);
                //width,height
                this.clearWidth('w',bp,settings);
                this.clearWidth('ht',bp,settings,1);
                //Box Shadow
                this.clearShadow('b_sh',1,bp,settings);
                this.clearShadow('sh_h',1,bp,settings);
                //transform
                this.clearTransform('tr',bp,settings);
                this.clearTransform('tr-h',bp,settings);
                //units
                this.clearUnits(units,bp,settings);
            }
            super.builderSave(settings);
        }
        preview(data) {
            const args={...{
                layout_feature:'icon-top',
                layout_mobile:'icon-top',
                title_tag:'h3',
                stype:'i',
                circle_size_feature:'medium',
                link_options:'regular',
                icon_type_feature: 'icon',
                custom_circle_size_feature:120,
                circle_stroke_feature:0
            },...data};
            let module = createElement(),
                    featureImage = createElement('','module-feature-image tf_textc tf_rel'),
                    content = createElement('','module-feature-content tf_textc'),
                    chart = createElement('span','module-feature-chart-html5 tf_box tf_rel tf_inline_b'),
                    chartCircle = createElement('span','chart-html5-circle tf_w tf_h'),
                    text = createElement('','tb_text_wrap'),
                    {layout_feature:layoutFeature,circle_stroke_feature:w,icon_type_feature:type,stype:subtype,custom_circle_size_feature:customSize,content_feature:html} = args,
                    percent = args.circle_percentage_feature || '',
                    isEmpty = percent <= 0 || w <= 0,
                    icon = type !== 'image_icon' ? (subtype !== 'l' ? (args.icon_feature ? api.Helper.getIcon(args.icon_feature) : '') : api.Helper.getLottie(args, 'parent')) : '',
                    color = args.icon_color_feature !== '' && type !== 'image' && subtype === 'i' ? api.Helper.toRGBA(args.icon_color_feature) : '',
                    insetColor = args.icon_bg_feature !== '' && type !== 'image_icon' ? api.Helper.toRGBA(args.icon_bg_feature) : '',
                    classes = ['module', 'module-feature', 'layout-' + layoutFeature],
                    constructor=this.constructor;

            if (isEmpty) {
                classes.push('no-chart');
                if (insetColor !== '') {
                    chart.style.backgroundColor = insetColor;
                }
            } else {
                if (percent > 100) {
                    percent = 100;
                }
                classes.push('with-chart');
            }
            if (w == 1) {
                w = 2;
            }
            if (args.overlap_image_feature) {
                const img = constructor.setEditableImage(createElement('img'),'overlap_image_feature','overlap_image_width','overlap_image_height',args);
                if (!isEmpty) {
                    classes.push('with-overlay-image');
                }
                featureImage.appendChild(img);
            }
            if (args.circle_size_feature === 'custom' && customSize) {
                chart.style.width = chart.style.height = customSize + 'px';
            }

            if (!isEmpty) {
                const  r = 'calc(50% - ' + w / 2 + 'px)',
                    svg = createElementNS('', 'tf_abs tf_w tf_h');
                    
                svg.append(createElementNS('circle',{class:'tb_feature_fill',r:r,cx:'50%',cy:'50%','stroke-width':w}), createElementNS('circle',{class:'tb_feature_stroke',r:r,cx:'50%',cy:'50%','stroke-width':w,'stroke-dasharray':'0,10000',stroke:api.Helper.toRGBA(args.circle_color_feature),'data-progress':percent}));
                if (insetColor !== '' && type !== 'image_icon') {
                    const r2 = w > 1 ? (w - 1) : 0;
                    svg.appendChild(createElementNS('circle',{class:'tb_feature_bg','stroke-width':w,cx:'50%',cy:'50%',fill:insetColor,r: 'calc(50% - ' + r2 + 'px)'}));
                }
                chart.appendChild(svg);
            }

            if (icon || args.image_feature) {
                let iconItem;
                if (type === 'icon' && icon) {
                    iconItem = createElement('em','module-feature-icon tf_rel');
                    if (color !== '') {
                        iconItem.style.color = color;
                    }
                    iconItem.appendChild(icon);
                } else if (type !== 'icon' && args.image_feature) {
                    iconItem = new Image();
                    iconItem.src = args.image_feature;
                    iconItem.style.width = iconItem.style.height = 'calc(100% - ' + (w * 2) + 'px)';
                }
                if (iconItem) {
                    chartCircle.appendChild(iconItem);
                }
            }

            chart.appendChild(chartCircle);

            if (type === 'both' && icon) {
                const iconWrap = createElement('span', 'module-feature-icon-wrap tf_abs'),
                        featureIcon = createElement('span','module-feature-icon tf_inline_b'),
                        pos = args.icon_position?? '';
                if (pos !== '') {
                    iconWrap.style.transform = 'rotate(' + pos + 'deg)';
                    featureIcon.style.transform = 'translateY(-50%) rotate(-' + pos + 'deg)';
                }
                if (color !== '') {
                    featureIcon.style.color = color;
                }
                if (insetColor !== '') {
                    featureIcon.style.backgroundColor = insetColor;
                }
                featureIcon.appendChild(icon);
                iconWrap.appendChild(featureIcon);
                chart.appendChild(iconWrap);
            }

            if (args.link_feature) {
                const link = createElement('a');
                link.href = args.link_feature;
                link.appendChild(chart);
                featureImage.appendChild(link);
            } else {
                featureImage.appendChild(chart);
            }

            if (args.title_feature) {
                const title = createElement(args.title_tag,'module-feature-title');
                if (args.link_feature) {
                    title.appendChild(constructor._setEditableContent(createElement('a'),{class:'title_feature',href:args.link_feature},args.title_feature));
                } else {
                    constructor._setEditableContent(title,'title_feature',args.title_feature);
                }
                content.appendChild(title);
            }

            constructor._setEditableContent(text,'content_feature','',1);
            if(html){
                text.innerHTML=this.shortcodeToHTML(html).content;
            }
            content.appendChild(text);

            if (args.circle_size_feature) {
                classes.push('size-' + args.circle_size_feature);
            }
            if (args.css_feature) {
                classes.push(args.css_feature);
            }
            module.className = classes.join(' ');
            module.dataset.layoutMobile = args.layout_mobile;
            module.dataset.layoutDesktop = layoutFeature;
            if (args.mod_title_feature) {
                module.appendChild(constructor.getModuleTitle(args.mod_title_feature,'mod_title_feature'));
            }
            module.append(featureImage, content);
            return module;
        }
    };
})(tb_app);