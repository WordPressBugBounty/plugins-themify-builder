(api => {
    "use strict";
    api.ModuleLinkBlock = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'shape',
                    type: 'layout',
                    mode: 'sprite',
                    label: 'shape',
                    options: [
                        {
                            img: 'normall_button',
                            value: 'normal',
                            label: 'def'
                        },
                        {
                            img: 'squared_button',
                            value: 'squared',
                            label: 'squared'
                        },
                        {
                            img: 'circle_button',
                            value: 'circle',
                            label: 'circle'
                        },
                        {
                            img: 'rounded_button',
                            value: 'rounded',
                            label: 'rounded'
                        }
                    ],
                    control: {
                        classSelector: ' .ui'
                    }
                },
                {
                    id: 'lb_layout',
                    type: 'layout',
                    mode: 'sprite',
                    label: 'lay',
                    options: [
                        {
                            img: 'lb_icon_center',
                            value: 'icon-center',
                            label: 'lcenter'
                        },
                        {
                            img: 'lb_icon_left',
                            value: 'icon-left',
                            label: 'ileft'
                        },
                        {
                            img: 'lb_icon_right',
                            value: 'icon-right',
                            label: 'iright'
                        }
                    ],
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'style',
                    type: 'layout',
                    mode: 'sprite',
                    label: 'bg',
                    options: [
                        {
                            img: 'solid_button',
                            value: 'solid',
                            label: 'solid'
                        },
                        {
                            img: 'transparent_button',
                            value: 'transparent',
                            label: 'transparent'
                        }
                    ],
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'heading',
                    type: 'text',
                    label: 'head',
                    control: {
                        selector: '.tf_link_heading'
                    }
                },
                {
                    id: 'blurb',
                    type: 'textarea',
                    label: 'blurb',
                    control: {
                        selector: '.tf_link_blurb'
                    }
                },
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
                        }
                    ],
                    option_js: true
                },
                {
                    id: 'image',
                    type: 'image',
                    label: 'imgurl',
                    wrap_class: 'tb_group_element_image',
                    binding : {
                        empty : { hide : 'i_dim' },
                        not_empty : { show : 'i_dim' }
                    }
                },
                {
                    type: 'multi',
                    id : 'i_dim',
                    label: '',
                    options: [
                        {
                            id: 'i_w',
                            type: 'number',
                            label: 'w'
                        },
                        {
                            id: 'i_h',
                            type: 'number',
                            label: 'ht'
                        }
                    ],
                    wrap_class: 'tb_group_element_image'
                },
                {
                    id: 'icon',
                    type: 'icon',
                    label: 'icon',
                    binding: {
                        empty: {
                            hide: 'icon_alignment'
                        },
                        not_empty: {
                            show: 'icon_alignment'
                        }
                    },
                    wrap_class: 'tb_group_element_icon'
                },
                {
                    id: 'disp_icon_btm',
                    type: 'checkbox',
                    label: '',
                    options: [
                        {
                            name: 'icon_disp_btm',
                            value: 'idispb'
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
                                'button_color_bg',
                                'title',
                                'nofollow_link'
                            ]
                        },
                        not_empty: {
                            show: [
                                'link_options',
                                'button_color_bg',
                                'title',
                                'nofollow_link'
                            ]
                        }
                    }
                },
                {
                    id: 'link_options',
                    type: 'radio',
                    label: 'o_l',
                    link_type: true,
                    option_js: true
                },
                {
                    id: 'nofollow_link',
                    type: 'toggle_switch',
                    label: 'nfollow',
                    options: {
                        on: {
                            name: 'yes'
                        }
                    },
                    help: 'nfollowh',
                    control: false,
                    wrap_class: 'tb_group_element_regular tb_group_element_newtab'
                },
                {
                    type: 'multi',
                    label: 'lbdim',
                    options: [
                        {
                            id: 'lightbox_width',
                            type: 'range',
                            label: 'w',
                            control: false,
                            units: {
                                px: {
                                    min: 0,
                                    max: 3000
                                },
                                '%': {
                                    min: 0,
                                    max: 100
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
                                    min: 0,
                                    max: 3000
                                },
                                '%': {
                                    min: 0,
                                    max: 100
                                }
                            }
                        }
                    ],
                    wrap_class: 'tb_group_element_lightbox lightbox_size'
                },
                {
                    id: 'color',
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
                    id: 'title',
                    type: 'text',
                    label: 'tat',
                    control: false,
                    help: 'tath'
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
                blurb: i18n.blurbtext,
                link: 'https://themify.me/',
                lb_layout: 'icon-center'
            };
        }
        static builderSave(settings){
            const def={
                shape:'normal',
                lb_layout:'icon-center',
                style:'solid',
                icon_type: 'icon',
                lightbox_width_unit:'px',
                lightbox_height_unit:'px',
                color:'default',
                link_options:'regular',
                disp_icon_btm:false
            };
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            
            if(!settings.link){
                delete settings.link_options;
                delete settings.nofollow_link;
            }
            if(settings.link_options!=='lightbox'){
                delete settings.lightbox_width;
                delete settings.lightbox_height;
            }else{
                delete settings.nofollow_link;
            }
            if(!settings.lightbox_width){
                delete settings.lightbox_width_unit;
            }
            if(!settings.lightbox_height){
                delete settings.lightbox_height_unit;
            }
            if(settings.icon_type==='image'){
                delete settings.icon;
            }else{
                delete settings.image;
                delete settings.i_w;
                delete settings.i_h;
            }
            if((!settings.icon && !settings.image) || settings.disp_icon_btm==='|' || settings.disp_icon_btm==='false'){
                delete settings.disp_icon_btm;
            }
            super.builderSave(settings);
        }
        preview(data) {
            const module =createElement(),
            container = createElement((data.link?'a':'span')),
            content = createElement('','tf-lb-content'),
            color = data.color && data.color !== 'default' ? data.color : 'tb_default_color',
            iconType=data.icon_type || 'icon',
            classes = ['module', 'module-link'],
            containerCss=['tb_link_block_container','ui',color],
            constructor=this.constructor;
            
            classes.push((data.style || 'solid'),(data.lb_layout || 'icon-center'));
            if (data.disp_icon_btm) {
                classes.push(data.disp_icon_btm);
            }
            module.className = classes.join(' ');
            
            if (data.shape && data.shape!=='normal') {
                containerCss.push(data.shape);
            }
            container.className = containerCss.join(' ');
            
            if(data.link){
                container.href=data.link;
            }
            if((iconType!=='image' && data.icon) || (iconType==='image' && data.image)){
                let iconContainer;
                if(iconType!=='image'){
                    const em=createElement('em','tb_link_block_icon tf_inline_b');
                    iconContainer=createElement('','tf-lb-icon');
                    em.appendChild(api.Helper.getIcon(data.icon));
                    iconContainer.appendChild(em);
                }
                else{
                    iconContainer=constructor.setEditableImage(createElement('img','tf_vmiddle tf_box tb_link_block_img'),'image','i_w','i_h',data);
                }
                container.appendChild(iconContainer);
            }
            
            if (data.heading ) {
                content.appendChild(constructor._setEditableContent(createElement('','tb_link_block_heading'),'heading',data.heading));
            }
            if (data.blurb ) {
                content.appendChild(constructor._setEditableContent(createElement('','tb_link_block_blurb'),'blurb',data.blurb));
            }
            container.appendChild(content);
            module.appendChild(container);
            return module;
        }
    };
})(tb_app);