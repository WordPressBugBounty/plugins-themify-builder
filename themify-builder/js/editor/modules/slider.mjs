(api => {
    "use strict";
    api.ModuleSlider = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            const display=[
                    {
                        value: 'blog',
                        name: 'posts'
                    },
                    {
                        value: 'image',
                        name: 'imags'
                    },
                    {
                        value: 'video',
                        name: 'videos'
                    },
                    {
                        value: 'text',
                        name: 'text'
                    }
            ],
            addUrl=themifyBuilder.admin_url+'/post-new.php',
            {slider_active,portfolio_active,testimonial_active}=themifyBuilder;
            if(slider_active){
                display.push({
                    value: 'slider', 
                    name:'sposts'
                });
            }
            if(portfolio_active){
                display.push({
                    value: 'portfolio', 
                    name:'portfolio'
                });
            }
            if(testimonial_active){
                display.push({
                    value: 'testimonial', 
                    name:'testimt'
                });
            }
            const opt=[
                {
                    id: 'mod_title_slider',
                    type: 'title'
                },
                {
                    id: 'layout_display_slider',
                    type: 'radio',
                    label: 'disp',
                    options: display,
                    option_js: true,
                    wrap_class: 'tb_compact_radios'
                },
                ...(themifyBuilder.tbp_dynamic_query || []),
                {
                    type: 'query_posts',
                    id: 'post_type',
                    tax_id: 'taxonomy',
                    term_id: 'blog_category_slider',
                    description: i18n.addmore+' <a href="'+addUrl+'" target="_blank">'+i18n.posts+'</a>',
                    wrap_class: 'tb_group_element_blog',
                    query_filter: true
                }
            ];
            if(slider_active){
                opt.push({
                    type: 'query_posts',
                    term_id: 'slider_category_slider',
                    taxonomy: 'slider-category',
                    description: i18n.addmore+' <a href="'+addUrl+'?post_type=slider" target="_blank">'+i18n.sposts+'</a>',
                    wrap_class: 'tb_group_element_slider'
                });
            }
            if(portfolio_active){
                opt.push({
                    type: 'query_posts',
                    term_id: 'portfolio_category_slider',
                    taxonomy: 'portfolio-category',
                    description: i18n.addmore+' <a href="'+addUrl+'?post_type=portfolio" target="_blank">'+i18n.portfolio+'</a>',
                    wrap_class: 'tb_group_element_portfolio'
                });
            }
            if(testimonial_active){
                opt.push({
                    type: 'query_posts',
                    term_id: 'testimonial_category_slider',
                    taxonomy: 'testimonial-category',
                    description: i18n.addmore+' <a href="'+addUrl+'?post_type=testimonial" target="_blank">'+i18n.testimonial+'</a>',
                    wrap_class: 'tb_group_element_testimonial'
                });
            }
            return [...opt,...[
                {
                    type: 'group',
                    wrap_class: 'tb_group_element_blog tb_group_element_slider tb_group_element_portfolio tb_group_element_testimonial',
                    options: [
                        {
                            id: 'posts_per_page_slider',
                            type: 'number',
                            label: 'npost',
                            help: 'nposth'
                        },
                        {
                            id: 'offset_slider',
                            type: 'number',
                            label: 'ofs',
                            help: 'ofsh'
                        },
                        {
                            id: 'order_slider',
                            type: 'select',
                            label: 'order',
                            help: 'shelp',
                            order: true
                        },
                        {
                            id: 'orderby_slider',
                            type: 'orderby_post',
                            binding: {
                                select: {
                                    hide: 'meta_order'
                                },
                                meta_value: {
                                    show: 'meta_order'
                                }
                            }
                        },
                        {
                            id: 'meta_order',
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'meta_key_slider',
                                    type: 'text',
                                    label: 'cfieldk',
                                    wrap_class: 'tb_disable_dc'
                                },
                                {
                                    id: 'meta_key_type',
                                    type: 'select',
                                    label: 'type',
                                    meta_order : true
                                }]
                        },
                        {
                            id: 'display_slider',
                            type: 'select',
                            label: 'disp',
                            options: {
                                content: 'content',
                                excerpt: 'excerpt',
                                none: 'none'
                            },
                            binding: {
                                excerpt: {
                                    show: 'excerpt_length'
                                },
                                content: {
                                    hide: 'excerpt_length'
                                },
                                none: {
                                    hide: 'excerpt_length'
                                }
                            }
                        },
                        {
                            id: 'excerpt_length',
                            type: 'number',
                            label: 'exclen',
                            help: 'exch'
                        },
                        {
                            id: 'hide_post_title_slider',
                            type: 'toggle_switch',
                            label: 'ptitle',
                            binding:{
                                checked:{show: 'unlink_post_title_slider'},
                                not_checked:{hide: 'unlink_post_title_slider'}
                            }
                        },
                        {
                            id: 'unlink_post_title_slider',
                            type: 'toggle_switch',
                            label: 'uptitle',
                            options: 'simple'
                        },
                        {
                            id: 'hide_feat_img_slider',
                            type: 'toggle_switch',
                            label: 'fimg',
                            binding:{
                                checked:{show: 'unlink_feat_img_slider'},
                                not_checked:{hide: 'unlink_feat_img_slider'}
                            }
                        },
                        {
                            id: 'unlink_feat_img_slider',
                            type: 'toggle_switch',
                            label: 'unlfimg',
                            options: 'simple'
                        },
                        {
                            id: 'open_link_new_tab_slider',
                            type: 'toggle_switch',
                            label: 'olnknt',
                            options: 'simple'
                        },
                        {
                            id: 'hide_post_date',
                            type: 'toggle_switch',
                            label: 'pdate'
                        }
                    ]
                },
                {
                    id: 'img_content_slider',
                    type: 'builder',
                    options: [
                        {
                            id: 'img_url_slider',
                            type: 'image',
                            label: 'imgurl'
                        },
                        {
                            id: 'img_title_slider',
                            type: 'text',
                            label: 'imgt'
                        },
                        {
                            id: 'img_title_tag',
                            type: 'select',
                            label: 'tht',
                            h_tags: true,
                            default: 'h3'
                        },
                        {
                            id: 'img_link_slider',
                            type: 'url',
                            label: 'imgl'
                        },
                        {
                            id: 'img_link_params',
                            type: 'select',
                            label: '',
                            options: {
                                '': '',
                                lightbox: 'olnknlb',
                                newtab: 'olnknt'
                            }
                        },
                        {
                            id: 'img_caption_slider',
                            type: 'textarea',
                            label: 'imgc'
                        }
                    ],
                    wrap_class: 'tb_group_element_image'
                },
                {
                    id: 'video_content_slider',
                    type: 'builder',
                    wrap_class: 'tb_group_element_video',
                    options: [
                        {
                            id: 'video_url_slider',
                            type: 'video',
                            label: 'vidurl',
                            help: 'vidurlh'
                        },
                        {
                            id: 'video_title_slider',
                            type: 'text',
                            label: 'vidt'
                        },
                        {
                            id: 'video_title_tag',
                            type: 'select',
                            label: 'tht',
                            h_tags: true,
                            default: 'h3'
                        },
                        {
                            id: 'video_title_link_slider',
                            type: 'url',
                            label: 'vidtl'
                        },
                        {
                            id: 'video_caption_slider',
                            type: 'textarea',
                            label: 'vidcap'
                        },
                        {
                            id: 'video_width_slider',
                            type: 'number',
                            label: 'vidw'
                        }
                    ]
                },
                {
                    id: 'text_content_slider',
                    type: 'builder',
                    options: [
                        {
                            id: 'text_caption_slider',
                            type: 'wp_editor',
                            class: 'builder-field'
                        }
                    ],
                    wrap_class: 'tb_group_element_text'
                },
                {
                    id: 'layout_slider',
                    type: 'layout',
                    label: 'sllay',
                    separated: 'top',
                    mode: 'sprite',
                    options: [
                        {
                            img: 'slider_default',
                            value: 'slider-default',
                            label: 'sldef'
                        },
                        {
                            img: 'slider_image_top',
                            value: 'slider-overlay',
                            label: 'sloverl'
                        },
                        {
                            img: 'slider_caption_overlay',
                            value: 'slider-caption-overlay',
                            label: 'slcapoverl'
                        },
                        {
                            img: 'slider_agency',
                            value: 'slider-agency',
                            label: 'agency'
                        }
                    ],
                    control: {
                        classSelector: '.module-slider'
                    }
                },
                {
                    type: 'group',
                    wrap_class: 'tb_group_element_blog tb_group_element_slider tb_group_element_portfolio tb_group_element_image tb_slider_images_opt',
                    options: [
                        {
                            id: 'image_size_slider',
                            type: 'image_size'
                        },
                        {
                            id: 'img_w_slider',
                            type: 'number',
                            label: 'imgw',
                            after: 'px'
                        },
                        {
                            id: 'img_fullwidth_slider',
                            type: 'checkbox',
                            label: '',
                            options: [
                                {
                                    name: 'fullwidth',
                                    value: 'afullwimg'
                                }
                            ],
                            wrap_class: 'auto_fullwidth'
                        },
                        {
                            id: 'img_h_slider',
                            type: 'number',
                            label: 'imgh',
                            after: 'px'
                        }
                    ]
                },
                {
                    id: 'slider_opt',
                    type: 'slider'
                },
                {
                    type: 'hook_content',
                    options: {
                        themify_before_post_image_module: 'before_post_image',
                        themify_after_post_image_module: 'after_post_image',
                        themify_before_post_title_module: 'before_post_title',
                        themify_after_post_title_module: 'after_post_title',
                        themify_before_post_content_module: 'before_post_content',
                        themify_after_post_content_module: 'after_post_content'
                    },
                    wrap_class: 'tb_group_element_blog tb_group_element_testimonial'
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_slider'
                }
            ]];
        }
        static default() {
            return {
                posts_per_page_slider: 4,
                display_slider: 'none',
                img_w_slider: 360,
                img_h_slider: 200,
                visible_opt_slider: 3,
                pause_on_hover_slider: 'resume',
                play_pause_control: 'no',
                show_arrow_slider: 'yes',
                show_nav_slider: 'yes',
                wrap_slider: 'yes',
                auto_scroll_opt_slider: 'off',
                post_type: 'post',
                hide_post_date: 'yes'
            };
        }
    };
})(tb_app);