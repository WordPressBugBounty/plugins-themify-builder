(api => {
    "use strict";
    api.ModuleImage = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_image',
                    type: 'title'
                },
                {
                    id: 'style_image',
                    type: 'layout',
                    label: 'imgst',
                    mode: 'sprite',
                    options: [
                        {
                            img: 'image_top',
                            value: 'image-top',
                            label: 'imgtop'
                        },
                        {
                            img: 'image_left',
                            value: 'image-left',
                            label: 'imgleft'
                        },
                        {
                            img: 'image_center',
                            value: 'image-center',
                            label: 'imgcenter'
                        },
                        {
                            img: 'image_right',
                            value: 'image-right',
                            label: 'imgright'
                        },
                        {
                            img: 'image_overlay',
                            value: 'image-overlay',
                            label: 'pover'
                        },
                        {
                            img: 'image_card_layout',
                            value: 'image-card-layout',
                            label: 'clay'
                        },
                        {
                            img: 'image_centered_overlay',
                            value: 'image-full-overlay',
                            label: 'fover'
                        }
                    ],
                    binding: {
                        not_empty: {
                            hide: 'caption_on_overlay'
                        },
                        'image-overlay': {
                            show: 'caption_on_overlay'
                        },
                        'image-full-overlay': {
                            show: 'caption_on_overlay'
                        }
                    },
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'caption_on_overlay',
                    type: 'checkbox',
                    label: '',
                    options: [
                        {
                            name: 'yes',
                            value: 'sover_h'
                        }
                    ]
                },
                {
                    id: 'url_image',
                    type: 'image',
                    label: 'imgurl',
                    required: {
                        message: 'imgerr'
                    }
                },
                {
                    id: 'appearance_image',
                    type: 'checkbox',
                    label: 'app',
                    img_appearance: true
                },
                {
                    id: 'image_size_image',
                    type: 'image_size'
                },
                {
                    id: 'width_image',
                    label: 'w',
                    type: 'number',
                    after: 'px'
                },
                {
                    id: 'auto_fullwidth',
                    type: 'checkbox',
                    label: '',
                    options: [
                        {
                            name: '1',
                            value: 'afullwimg'
                        }
                    ],
                    wrap_class: 'auto_fullwidth'
                },
                {
                    id: 'height_image',
                    type: 'number',
                    label: 'ht',
                    after: 'px'
                },
                {
                    id: 'title_image',
                    type: 'text',
                    label: 'imgt',
                    control: {
                        selector: "[data-name='title_image']"
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
                    id: 'link_image',
                    type: 'url',
                    label: 'imgl',
                    binding: {
                        empty: {
                            hide: [
                                'param_image',
                                'image_zoom_icon',
                                'lightbox_size'
                            ]
                        },
                        not_empty: {
                            show: [
                                'param_image',
                                'image_zoom_icon',
                                'lightbox_size'
                            ]
                        }
                    }
                },
                {
                    id: 'param_image',
                    type: 'radio',
                    label: 'o_l',
                    link_type: true,
                    option_js: true,
                    wrap_class: 'link_options tb_compact_radios',
                    binding: {
                        regular: {
                            hide: 'lightbox_size'
                        },
                        newtab: {
                            hide: 'lightbox_size'
                        },
                        lightbox: {
                            show: 'lightbox_size'
                        }
                    }
                },
                {
                    type: 'multi',
                    label: 'lbdim',
                    id: 'multi_lightbox',
                    options: [
                        {
                            id: 'lightbox_width',
                            type: 'range',
                            label: 'w',
                            control: false,
                            units: {
                                px: {
                                    max: 3500
                                },
                                '%': ''
                            }
                        },
                        {
                            id: 'lightbox_height',
                            type: 'range',
                            label: 'ht',
                            control: false,
                            units: {
                                px: {
                                    max: 3500
                                },
                                '%': ''
                            }
                        }
                    ],
                    wrap_class: 'tb_group_element_lightbox'
                },
                {
                    id: 'image_zoom_icon',
                    type: 'checkbox',
                    label: '',
                    options: [
                        {
                            name: 'zoom',
                            value: 'szoomic'
                        }
                    ],
                    wrap_class: 'tb_group_element_lightbox tb_group_element_newtab'
                },
                {
                    id: 'caption_image',
                    type: 'textarea',
                    label: 'imgc',
                    control: {
                        selector: '.image-caption'
                    }
                },
                {
                    id: 'alt_image',
                    type: 'text',
                    label: 'alt',
                    help: 'alth',
                    control: false
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_image'
                }
            ];
        }
        static builderSave(settings) {
            const def = {
                style_image: 'image-top',
                param_image: 'regular',
                lightbox_width_unit: 'px',
                lightbox_height_unit: 'px',
                title_tag: 'h3',
                auto_fullwidth: false,
                appearance_image: false,
                caption_on_overlay:false
            },
            units = ['font_size_caption', 'line_height_caption', 'f_s_c_h'];
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            if (settings.style_image !== 'image-overlay' && settings.style_image !== 'image-full-overlay') {
                delete settings.caption_on_overlay;
            }
            if (!settings.link_image) {
                delete settings.param_image;
            }
            if (!settings.param_image) {
                delete settings.image_zoom_icon;
            }
            if (settings.auto_fullwidth==='|' || settings.auto_fullwidth==='false') {
                delete settings.auto_fullwidth;
            }
            if (settings.appearance_image==='|' || settings.appearance_image==='false') {
                delete settings.appearance_image;
            }
            if (settings.param_image !== 'lightbox') {
                delete settings.lightbox_width;
                delete settings.lightbox_height;
            }
            if (!settings.lightbox_width) {
                delete settings.lightbox_width_unit;
            }
            if (!settings.lightbox_height) {
                delete settings.lightbox_height_unit;
            }
            for (let bps = api.breakpointsReverse, i = bps.length - 1; i > -1; --i) {
                let bp = bps[i];
                //Image Gradient
                this.clearImageGradient('background_image', 'background_color', 'background_repeat', 'background_position', bp, settings);
                this.clearImageGradient('b_i_h', 'bg_c_h', 'b_r_h', 'b_p_h', bp, settings);
                //Font color
                this.clearFontColor('font_color_type', 'font_color', 'font_gradient_color', bp, settings);
                this.clearFontColor('f_c_t_h', 'f_c_h', 'f_g_c_h', bp, settings);
                //Text Shadow
                this.clearShadow('text-shadow', 0, bp, settings);
                this.clearShadow('t_sh_h', 0, bp, settings);
                this.clearShadow('t_sh_m_t', 0, bp, settings);
                this.clearShadow('t_sh_m_t_h', 0, bp, settings);
                //paddings
                this.clearPadding('padding', bp, settings);
                this.clearPadding('p_h', bp, settings);
                this.clearPadding('i_t_p', bp, settings);
                this.clearPadding('i_t_p_h', bp, settings);
                this.clearPadding('c_p', bp, settings);
                this.clearPadding('c_p_h', bp, settings);
                //margin
                this.clearPadding('margin', bp, settings);
                this.clearPadding('m_h', bp, settings);
                this.clearPadding('title_margin', bp, settings);
                this.clearPadding('t_m_h', bp, settings);
                this.clearPadding('i_t_m', bp, settings);
                this.clearPadding('i_t_m_h', bp, settings);
                this.clearPadding('c_m', bp, settings);
                this.clearPadding('c_m_h', bp, settings);
                //border-radius
                this.clearPadding('b_ra', bp, settings);
                this.clearPadding('r_c_h', bp, settings);
                this.clearPadding('i_t_r_c', bp, settings);
                this.clearPadding('i_t_r_c_h', bp, settings);
                this.clearPadding('c_r_c', bp, settings);
                this.clearPadding('c_r_c_h', bp, settings);
                //border
                this.clearBorder('border', bp, settings);
                this.clearBorder('b_h', bp, settings);
                this.clearBorder('i_t_b', bp, settings);
                this.clearBorder('i_t_b_h', bp, settings);
                //filters
                this.clearFilter('bl_m', 'css_f', bp, settings);
                this.clearFilter('_h', 'css_f_h', bp, settings);
                //width,height
                this.clearWidth('w', bp, settings);
                this.clearWidth('ht', bp, settings, 1);
                //Box Shadow
                this.clearShadow('b_sh', 1, bp, settings);
                this.clearShadow('sh_h', 1, bp, settings);
                this.clearShadow('i_t_sh', 1, bp, settings);
                this.clearShadow('i_t_sh_h', 1, bp, settings);
                this.clearShadow('c_sh', 1, bp, settings);
                this.clearShadow('c_sh_h', 1, bp, settings);
                //position
                this.clearPosition('po', bp, settings);
                //transform
                this.clearTransform('tr', bp, settings);
                this.clearTransform('tr-h', bp, settings);
                //units
                this.clearUnits(units, bp, settings);
            }
            super.builderSave(settings);
        }
        async edit(type){
            await super.edit(type);
            if((!type || type==='setting') && !this.get('mod_settings').url_image){
                ThemifyConstructor.afterRun.push(() => {
                    Themify.triggerEvent(ThemifyConstructor.getEl('url_image').parentNode.tfClass('tb_upload_btn')[0], _CLICK_);
                });
            }
        }
        getImage(data) {
            const setting = data || this.get('mod_settings'),
                    imgUrl = setting.url_image,
                    img = new Image(32, 32);
            if (imgUrl) {
                img.src = imgUrl;
                if (!api.activeModel) {
                    img.loading = 'lazy';
                }
                img.alt = this.getName();
                return img;
            }
            return super.getImage(setting);
        }
        preview(data) {
            let module = createElement(),
                    wrap = createElement('','image-wrap tf_rel tf_mw'),
                    {style_image:imageStyle='image-top',url_image:url} = data,
                    classes = ['module', 'module-image', imageStyle, 'tf_mw'],
                    img,
                    linkParams = {},
                    constructor=this.constructor;
            if (data.auto_fullwidth) {
                classes.push('auto_fullwidth');
            }
            if (data.caption_on_overlay === 'yes' && ('image-overlay' === imageStyle || 'image-full-overlay' === imageStyle)) {
                classes.push('active-caption-hover');
            }
            if (data.css_image) {
                classes.push(data.css_image);
            }
            if (data.appearance_image) {
                classes.push(data.appearance_image.split('|').join(' '));
            }
            module.className = classes.join(' ');
            if (url) {
                img = constructor.setEditableImage(createElement('img'),'url_image','width_image','height_image',data);
                if (data.alt_image) {
                    img.alt = data.alt_image;
                }
            }
            if (data.link_image) {
                const linkType = data.param_image;
                if (linkType === 'lightbox') {
                    const lbParams = [];
                    if (data.lightbox_width) {
                        lbParams.push(data.lightbox_width + (data.lightbox_width_unit || 'px'));
                    }
                    if (data.lightbox_height) {
                        lbParams.push(data.lightbox_height + (data.lightbox_height_unit || 'px'));
                    }
                    if (lbParams.length > 0) {
                        linkParams['data-zoom-config']=lbParams.join('|');
                    }
                    linkParams.class='lightbox-builder themify_lightbox';
                } 
                else if (linkType === 'newtab') {
                    linkParams.rel= 'noopener';
                    linkParams.target='_blank';
                }
                linkParams.href=data.link_image;
                const link =createElement('a',linkParams);
                if (linkType && linkType !== 'regular' && data.image_zoom_icon === 'zoom' && imageStyle !== 'image-full-overlay') {
                    const zoom = createElement('span','zoom');
                    zoom.appendChild(api.Helper.getIcon((linkType === 'lightbox' ? 'ti-search' : 'ti-new-window')));
                    link.appendChild(zoom);
                }
                if (img) {
                    link.appendChild(img);
                }
                wrap.appendChild(link);
            } 
            else if (img) {
                wrap.appendChild(img);
            }

            if (data.mod_title_image) {
                module.appendChild(constructor.getModuleTitle(data.mod_title_image, 'mod_title_image'));
            }
            module.appendChild(wrap);
            if (data.title_image || data.caption_image) {
                const content = createElement('','image-content'+(imageStyle === 'image-full-overlay'?' tf_overflow':''));
                if (data.title_image) {
                    let titleTag =createElement(data.title_tag || 'h3','image-title'),
                        editTag = titleTag;
                    if (data.link_image) {
                        const link =createElement('a',linkParams);
                        titleTag.appendChild(link);
                        editTag = link;
                    }
                    constructor._setEditableContent(editTag,'title_image',data.title_image);
                    content.appendChild(titleTag);
                }
                if (data.caption_image) {
                    content.appendChild(constructor._setEditableContent(createElement('','image-caption tb_text_wrap'),'caption_image',data.caption_image));
                }
                if (imageStyle === 'image-overlay') {
                    wrap.appendChild(content);
                } else {
                    module.appendChild(content);
                }
            }
            return module;
        }
    };
})(tb_app);