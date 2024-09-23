(api => {
    "use strict";
    api.ModuleServiceMenu = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'style_service_menu',
                    type: 'layout',
                    label: 'menustyle',
                    mode: 'sprite',
                    default:'image-left',
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
                            label: 'imgoverlay'
                        },
                        {
                            img: 'image_horizontal',
                            value: 'image-horizontal',
                            label: 'imghriznt'
                        }
                    ],
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'title_service_menu',
                    type: 'text',
                    label: 'menut',
                    class: 'large',
                    control: {
                        selector: '.tb-menu-title'
                    }
                },
                {
                    id: 'title_tag',
                    type: 'select',
                    label: 'tht',
                    h_tags: true,
                    default: 'h4'
                },
                {
                    id: 'description_service_menu',
                    type: 'textarea',
                    label: 'desc',
                    control: {
                        selector: '.tb-menu-description'
                    }
                },
                {
                    id: 'price_service_menu',
                    type: 'text',
                    label: 'price',
                    class: 'small',
                    control: {
                        selector: '.tb-menu-price'
                    }
                },
                {
                    id: 'add_price_check',
                    type: 'checkbox',
                    label: '',
                    options: [
                        {
                            name: 'yes',
                            value: 'enpriceopt'
                        }
                    ],
                    binding: {
                        checked: {
                            show: '#price_fields_holder',
                            hide: 'price_service_menu'
                        },
                        not_checked: {
                            hide: '#price_fields_holder',
                            show: 'price_service_menu'
                        }
                    }
                },
                {
                    id: 'price_fields_holder',
                    type: 'builder',
                    label: 'price',
                    options: [
                        {
                            id: 'label',
                            type: 'text',
                            label: 'label',
                            control: {
                                selector: '.tb-price-title'
                            }
                        },
                        {
                            id: 'price',
                            type: 'text',
                            label: 'price',
                            control: {
                                selector: '.tb-price-value'
                            }
                        }
                    ]
                },
                {
                    id: 'image_service_menu',
                    type: 'image',
                    label: 'imgurl'
                },
                {
                    id: 'appearance_image_service_menu',
                    type: 'checkbox',
                    label: 'imgapp',
                    img_appearance: true
                },
                {
                    id: 'image_size_service_menu',
                    type: 'image_size'
                },
                {
                    id: 'width_service_menu',
                    type: 'number',
                    label: 'w',
                    after: 'px'
                },
                {
                    id: 'height_service_menu',
                    type: 'number',
                    label: 'ht',
                    after: 'px'
                },
                {
                    id: 'link_service_menu',
                    type: 'url',
                    label: 'imgl',
                    binding: {
                        empty: {
                            hide: [
                                'link_options',
                                'image_zoom_icon',
                                'lightbox_size'
                            ]
                        },
                        not_empty: {
                            show: [
                                'link_options',
                                'image_zoom_icon',
                                'lightbox_size'
                            ]
                        }
                    }
                },
                {
                    id: 'link_options',
                    type: 'radio',
                    label: 'o_l',
                    options: [
                        {
                            value: 'regular',
                            name: 'swin'
                        },
                        {
                            value: 'lightbox',
                            name: 'lg'
                        },
                        {
                            value: 'newtab',
                            name: 'ntab'
                        }
                    ],
                    option_js: true
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
                    type: 'multi',
                    label: 'lbdim',
                    options: [
                        {
                            id: 'lightbox_width',
                            type: 'number',
                            label: 'w',
                            control: false
                        },
                        {
                            id: 'lightbox_size_unit_width',
                            type: 'select',
                            label: 'units',
                            options: {
                                pixels: 'px',
                                percents: '%'
                            },
                            control: false
                        },
                        {
                            id: 'lightbox_height',
                            type: 'number',
                            label: 'ht',
                            control: false
                        },
                        {
                            id: 'lightbox_size_unit_height',
                            type: 'select',
                            label: 'units',
                            options: {
                                pixels: 'px',
                                percents: '%'
                            },
                            control: false
                        }
                    ],
                    wrap_class: 'tb_group_element_lightbox'
                },
                {
                    id: 'highlight_service_menu',
                    type: 'checkbox',
                    label: 'highlgt',
                    options: [
                        {
                            name: 'highlight',
                            value: 'highlgtitem'
                        }
                    ],
                    binding: {
                        checked: {
                            show: [
                                'highlight_text_service_menu',
                                'highlight_color_service_menu'
                            ]
                        },
                        not_checked: {
                            hide: [
                                'highlight_text_service_menu',
                                'highlight_color_service_menu'
                            ]
                        }
                    }
                },
                {
                    id: 'highlight_text_service_menu',
                    type: 'text',
                    label: '',
                    after: 'highlgtxt',
                    class: 'large',
                    control: {
                        selector: '.tb-highlight-text'
                    }
                },
                {
                    id: 'highlight_color_service_menu',
                    type: 'layout',
                    label: '',
                    mode: 'sprite',
                    class: 'tb_colors',
                    color: true,
                    transparent: true,
                    control: {
                        classSelector: ''
                    }
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_service_menu'
                }
            ];
        }
        static default() {
            return {
                title_service_menu: i18n.menut,
                description_service_menu: i18n.desc,
                price_service_menu: '$200',
                image_service_menu: 'https://themify.org/img/menu-pizza.png',
                width_service_menu: 100
            };
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString((setting.title_service_menu || setting.description_service_menu));
        }
        getImage(data) {
            const setting = data || this.get('mod_settings'),
                imgUrl=setting.image_service_menu,
                img=new Image(32,32);
            if(imgUrl){
                img.src=imgUrl;
                if(!api.activeModel){
                    img.loading='lazy';
                }
                img.alt=this.getName();
                return img;
            }
            return super.getImage(setting);
        }
        static builderSave(settings) {
            const def = {
                title_tag: 'h4',
                style_service_menu: 'image-left',
                lightbox_size_unit_width:'pixels',
                lightbox_size_unit_height: 'pixels',
                highlight_color_service_menu: 'default',
                link_options:'regular',
                add_price_check:false,
                appearance_image_service_menu:false,
                highlight_service_menu:false,
                image_zoom_icon:false
            };
            for (let key in def) {
                if (settings[key] === def[key] || ((key==='add_price_check' || key==='appearance_image_service_menu' || key==='highlight_service_menu' || key==='image_zoom_icon') && (settings[key]==='|' || settings[key]==='false'))) {
                    delete settings[key];
                }
            }
            if(!settings.highlight_service_menu){
                delete settings.highlight_text_service_menu;
                delete settings.highlight_color_service_menu;
            }
            if(!settings.image_service_menu){
                delete settings.width_service_menu;
                delete settings.height_service_menu;
            }
            if(!settings.link_service_menu){
                delete settings.link_options;
            }
            if(!settings.link_options){
                delete settings.image_zoom_icon;
            }
            if(settings.link_options!=='lightbox'){
                delete settings.lightbox_width;
                delete settings.lightbox_height;
            }
            if(!settings.lightbox_width){
                delete settings.lightbox_size_unit_width;
            }
            if(!settings.lightbox_height){
                delete settings.lightbox_size_unit_height;
            }
            if(!settings.add_price_check){
                delete settings.price_fields_holder;
            }else{
                if(settings.price_fields_holder?.length===0){
                    delete settings.price_fields_holder;
                }
                delete settings.price_service_menu;
            }
            super.builderSave(settings);
        }
        preview(data) {
            const module = createElement(),
                imageContent = createElement('','tb-image-content tf_overflow'),
                menuTitleWrap=createElement('', 'tb-menu-title-wrap'),
            classes = ['module', 'module-service-menu'],
            constructor=this.constructor;
            if(data.appearance_image_service_menu){
                classes.push(data.appearance_image_service_menu.split('|').join(' '));
            }
            if (data.style_service_menu) {
                classes.push(data.style_service_menu);
            }
            if (data.css_service_menu) {
                classes.push(data.css_service_menu);
            }
            if (data.highlight_service_menu) {
                const color=data.highlight_color_service_menu && data.highlight_color_service_menu!=='default'?data.highlight_color_service_menu:'tb_default_color';
                if (data.highlight_text_service_menu) {
                    const highlightText=constructor.getModuleTitle(data.title_service_menu,'highlight_text_service_menu');
                    highlightText.className='tb-highlight-text';
                    module.appendChild(highlightText);
                }
                classes.push('has-highlight',color);
            }
            else{
                classes.push('no-highlight');
            }
            module.className = classes.join(' ');
            
            if (data.image_service_menu){
                const imageWrap =createElement('','tb-image-wrap tf_left'),
                    img=constructor.setEditableImage(createElement('img',{class:'tb_menu_image',alt:data.title_service_menu || data.description_service_menu}),'image_service_menu','width_service_menu','height_service_menu',data);
                if (data.link_service_menu) {
                    const link = createElement('a',{href:data.link_service_menu}),
                    linkType=data.link_options;
                    if(linkType === 'lightbox'){
                        link.className='lightbox-builder themify_lightbox';
                        const lbWdith=data.lightbox_width,
                            lbHeight=data.lightbox_height,
                            lightbox_settings = [],
                            units = {pixels: 'px',percents: '%'};
                        if(lbWdith){
                            lightbox_settings.push(lbWdith + units[data.lightbox_size_unit_width]);
                        }
                        if(lbHeight){
                            lightbox_settings.push(lbHeight + units[data.lightbox_size_unit_height]);
                        }
                        if(lightbox_settings.length>0){
                            link.dataset.zoomConfig=lightbox_settings.join('|');
                        }
                    }
                    else if(linkType==='newtab'){
                        link.target='_blank';
                        link.rel='noopener';
                    }
                    if(data.image_zoom_icon === 'zoom' && linkType!== 'regular'){
                        const zoom = createElement('span','zoom');
                        zoom.appendChild(api.Helper.getIcon((linkType === 'newtab'?'fa-external-link':'fa-search')));
                        link.appendChild(zoom);
                    }
                    link.appendChild(img);
                    imageWrap.appendChild(link);
                }
                else{
                    imageWrap.appendChild(img);
                }
                module.appendChild(imageWrap);
            }
            if (data.title_service_menu) {
                menuTitleWrap.appendChild(constructor._setEditableContent(createElement(data.title_tag || 'h4','tb-menu-title'),'title_service_menu',data.title_service_menu));
            }
            
            if (data.description_service_menu) {
                menuTitleWrap.appendChild(constructor._setEditableContent(createElement('','tb-menu-description'),'description_service_menu',data.description_service_menu));
            }
            
            imageContent.appendChild(menuTitleWrap);
            
            if (data.price_service_menu !== ''  || data.add_price_check === 'yes' ) {
                const menuPrice=createElement('','tb-menu-price');
                if(data.add_price_check=== 'yes'){
                    const arr=data.price_fields_holder || [];
                    for(let i=0;i<arr.length;++i){
                        let priceItem=createElement('','tb-price-item');
                        
                        if(arr[i].label !== ''){
                            priceItem.appendChild(constructor._setEditableContent(createElement('','tb-price-title'),'label',arr[i].label,'','price_fields_holder',i));
                        }
                        
                        if(arr[i].price !== ''){
                            priceItem.appendChild(constructor._setEditableContent(createElement('','tb-price-value'),'price',arr[i].price,'','price_fields_holder',i));
                        }
                        
                        menuPrice.appendChild(priceItem);
                    }
                }
                else{
                    constructor._setEditableContent(menuPrice,'price_service_menu',data.price_service_menu);
                }
                imageContent.appendChild(menuPrice);
            }
            
            
            module.appendChild(imageContent);
            return module;
        }
    };
})(tb_app);