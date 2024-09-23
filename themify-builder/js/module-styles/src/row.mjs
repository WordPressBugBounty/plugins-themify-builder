const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Row extends BaseStyles {
    static get_base_styles(type) {
        let margin_fields = {
            margin: this.get_margin()
        },
        margin_hover_fields = {
            margin: this.get_margin('', 'm', 'h')
        },
        overlay = 'subov',
        inner_selector,
        inner_selector_hover;

        if (type === 'row' || type === 'column') {
            margin_fields.margin_top = this.get_margin_top_bottom_opposity('', 'margin-top', 'margin-bottom');
            margin_hover_fields.margin_top = this.get_margin_top_bottom_opposity('', 'm_t', 'm_b', 'h');

            if (type === 'row') {
                overlay = 'rov';
                inner_selector = '>div.row_inner';
                inner_selector_hover ='>div.row_inner:hover';

            } else {
                overlay = 'cov';
            }
            delete margin_fields.margin;
            delete margin_hover_fields.margin;
        }

        const options = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        {
                            id: 'background_type',
                            label: 'bgt',
                            type: 'radio',
                            options: [
                                {value: 'image', name: 'image'},
                                {value: 'gradient', name: 'gradient'},
                                {value: 'video', name: 'vid', class: 'tb_responsive_disable'},
                                {value: 'slider', name: 'slider', class: 'tb_responsive_disable'}
                            ],
                            is_background: true,
                            wrap_class: 'tb_compact_radios',
                            option_js: true
                        },
                        // Background Color
                        {
                            id: 'background_color',
                            type: 'color',
                            label: 'bg_c',
                            wrap_class: 'tb_group_element_image tb_group_element_slider tb_group_element_video',
                            prop: 'background-color',
                            selector: ''
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_group_element_slider',
                            options: [
                                // Background Slider
                                {
                                    id: 'background_slider',
                                    type: 'gallery',
                                    label: 'bgs',
                                    is_responsive: false
                                },
                                // Background Slider Image Size
                                {
                                    id: 'background_slider_size',
                                    label: '',
                                    after: 'imgs',
                                    type: 'select',
                                    image_size: true,
                                    default: 'large',
                                    is_responsive: false
                                },
                                // Background Slider Mode
                                {
                                    id: 'background_slider_mode',
                                    label: '',
                                    after: 'bgsm',
                                    type: 'select',
                                    options: {
                                        fullcover: 'fcover',
                                        'best-fit': 'bfit',
                                        'kenburns-effect': 'kbeffect'
                                    },
                                    is_responsive: false
                                },
                                {
                                    id: 'background_slider_speed',
                                    label: '',
                                    after: 'slspeed',
                                    type: 'select',
                                    default: '2000',
                                    options: {
                                        3500: 'slow',
                                        2000: 'n',
                                        500: 'fast'
                                    },
                                    is_responsive: false
                                }
                            ]
                        },
                        // Video Background
                        {
                            id: 'background_video',
                            type: 'video',
                            label: 'bgv',
                            help: 'bgvh',
                            is_responsive: false,
                            wrap_class: 'tb_group_element_video'
                        },
                        {
                            id: 'background_video_options',
                            type: 'checkbox',
                            label: '',
                            options: [
                                {name: 'unloop', value: 'dloop'},
                                {name: 'mute', value: 'daudio', help: 'daudioh'},
                                {name: 'playonmobile', value: 'msupp', help: 'msupph'}
                            ],
                            default: 'mute',
                            is_responsive: false,
                            wrap_class: 'tb_group_element_video'
                        },
                        // Background Image
                        {
                            id: 'background_image',
                            type: 'image',
                            label: 'b_i',
                            wrap_class: 'tb_group_element_image tb_group_element_video',
                            prop: 'background-image',
                            selector: '',
                            binding: {
                                empty: {
                                    hide: ['tb_image_options', 'resp_no_bg']
                                },
                                not_empty: {
                                    show: ['tb_image_options', 'resp_no_bg']
                                }
                            }
                        },
                        {
                            id: 'background_gradient',
                            type: 'gradient',
                            label: '',
                            wrap_class: 'tb_group_element_gradient',
                            prop: 'background-image',
                            selector: ''
                        },
                        // No Background Image
                        {
                            id: 'resp_no_bg',
                            label: '',
                            origId: 'background_image',
                            type: 'checkbox',
                            prop: 'background-image',
                            options: [
                                {value: 'nbg', name: 'none'}
                            ],
                            binding: {
                                checked: {hide: ['tb_image_options', 'background_image']},
                                not_checked: {show: ['tb_image_options', 'background_image']}
                            },
                            wrap_class: 'tb_group_element_image tf_hide'
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_group_element_image tb_image_options',
                            options: [
                                // Background repeat
                                {
                                    id: 'background_repeat',
                                    label: '',
                                    type: 'select',
                                    after: 'bg_m',
                                    prop: 'background-mode',
                                    origId: 'background_image',
                                    selector: '',
                                    options: {
                                        repeat: 'r_all',
                                        'repeat-x': 'r_h',
                                        'repeat-y': 'r_v',
                                        'repeat-none': 'r_no',
                                        fullcover: 'fcover',
                                        'best-fit-image': 'bfit',
                                        'builder-parallax-scrolling': 'prlaxscrl',
                                        'builder-zoom-scrolling': 'zoomscrl',
                                        'builder-zooming': 'zooming'
                                    },
                                    binding: {
                                        'repeat-none': {
                                            show: ['background_zoom', 'background_position']
                                        },
                                        'builder-parallax-scrolling': {
                                            hide: ['background_attachment', 'background_zoom']
                                        },
                                        'builder-zoom-scrolling': {
                                            hide: ['background_attachment', 'background_zoom'],
                                            show: 'background_position'
                                        },
                                        'builder-zooming': {
                                            hide: ['background_attachment', 'background_zoom'],
                                            show: 'background_position'
                                        },
                                        select: {
                                            value: 'repeat-none',
                                            hide: 'background_zoom',
                                            show: ['background_attachment', 'background_position']
                                        }
                                    }
                                },
                                // Background attachment
                                {
                                    id: 'background_attachment',
                                    label: '',
                                    type: 'select',
                                    origId: 'background_image',
                                    after: 'b_a',
                                    options: {
                                        scroll: 'scroll',
                                        fixed: 'fi'
                                    },
                                    prop: 'background-attachment',
                                    selector: ''
                                },
                                // Background Zoom
                                {
                                    id: 'background_zoom',
                                    label: '',
                                    origId: 'background_image',
                                    type: 'checkbox',
                                    options: [
                                        {value: 'zoom_h', name: 'zoom'}
                                    ],
                                    is_responsive: false
                                },
                                // Background position
                                {
                                    id: 'background_position',
                                    label: '',
                                    origId: 'background_image',
                                    type: 'position_box',
                                    position: true,
                                    prop: 'background-position',
                                    selector: ''
                                }
                            ]
                        }
                    ],
                    h: [
                        {
                            id: 'b_t_h',
                            label: 'bgt',
                            type: 'radio',
                            options: [
                                {value: 'image', name: 'image'},
                                {value: 'gradient', name: 'gradient'}
                            ],
                            is_background: true,
                            wrap_class: 'tb_compact_radios',
                            option_js: true
                        },
                        // Background Image
                        {
                            id: 'bg_i_h',
                            type: 'image',
                            label: 'b_i',
                            wrap_class: 'tb_group_element_image',
                            prop: 'background-image',
                            selector: ':hover',
                            binding: {
                                empty: {
                                    hide: 'tb_image_options'
                                },
                                not_empty: {
                                    show: 'tb_image_options'
                                }
                            }
                        },
                        {
                            id: 'b_g_h',
                            type: 'gradient',
                            label: '',
                            wrap_class: 'tb_group_element_gradient',
                            prop: 'background-image',
                            selector: ':hover'
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_group_element_image tb_image_options',
                            options: [
                                // Background repeat
                                {
                                    id: 'b_r_h',
                                    label: '',
                                    type: 'select',
                                    origId: 'bg_i_h',
                                    after: 'bg_m',
                                    prop: 'background-mode',
                                    selector: ':hover',
                                    options: {
                                        repeat: 'r_all',
                                        'repeat-x': 'r_h',
                                        'repeat-y': 'r_v',
                                        'repeat-none': 'r_no',
                                        fullcover: 'fcover',
                                        'best-fit-image': 'bfit'
                                    }
                                },
                                // Background attachment
                                {
                                    id: 'b_a_h',
                                    label: '',
                                    origId: 'bg_i_h',
                                    type: 'select',
                                    after: 'b_a',
                                    options: {
                                        scroll: 'scroll',
                                        fixed: 'fi'
                                    },
                                    prop: 'background-attachment',
                                    selector: ':hover'
                                },
                                // Background position
                                {
                                    id: 'b_p_h',
                                    label: '',
                                    origId: 'bg_i_h',
                                    type: 'position_box',
                                    position: true,
                                    prop: 'background-position',
                                    selector: ':hover'
                                }
                            ]
                        },
                        // Background Color
                        {
                            id: 'b_c_h',
                            type: 'color',
                            label: 'bg_c',
                            wrap_class: 'tb_group_element_image',
                            prop: 'background-color',
                            selector: ':hover'
                        }
                    ]
                })
            ]),
            // Overlay Color
            this.get_expand(overlay, [
                this.get_tab({
                    n: [
                        {
                            id: 'cover_color-type',
                            label: 'overlay',
                            type: 'radio',
                            options: [
                                {value: 'color', name: 'c'},
                                {value: 'cover_gradient', name: 'gradient'}
                            ],
                            option_js: true,
                            is_overlay: true
                        },
                        {
                            id: 'cover_color',
                            type: 'color',
                            label: '',
                            wrap_class: 'tb_group_element_color',
                            is_overlay: true,
                            prop: 'background-color',
                            selector: '>.builder_row_cover::before'
                        },
                        {
                            id: 'cover_gradient',
                            type: 'gradient',
                            label: '',
                            wrap_class: 'tb_group_element_cover_gradient',
                            is_overlay: true,
                            prop: 'background-image',
                            selector: '>.builder_row_cover::before'
                        }
                    ],
                    h: [
                        {
                            id: 'cover_color_hover-type',
                            label: 'overlay',
                            type: 'radio',
                            'options': [
                                {value: 'hover_color', name: 'c'},
                                {value: 'hover_gradient', name: 'gradient'}
                            ],
                            option_js: true,
                            is_overlay: true
                        },
                        {
                            id: 'cover_color_hover',
                            type: 'color',
                            label: '',
                            wrap_class: 'tb_group_element_hover_color',
                            is_overlay: true,
                            prop: 'background-color',
                            selector: ':hover>.builder_row_cover::before'
                        },
                        {
                            id: 'cover_gradient_hover',
                            type: 'gradient',
                            label: '',
                            wrap_class: 'tb_group_element_hover_gradient',
                            is_overlay: true,
                            prop: 'background-image',
                            selector: '>.builder_row_cover::after'
                        }
                    ]
                })
            ])
        ];
        if (inner_selector) {
            // Inner Container
            options.push(this.get_expand('innercont', [
                this.get_tab({
                    n: [
                        // Background Image
                        {
                            id: 'background_image_inner',
                            type: 'image',
                            label: 'b_i',
                            prop: 'background-image',
                            selector: inner_selector,
                            binding: {
                                empty: {
                                    hide: 'tb_image_inner_options'
                                },
                                not_empty: {
                                    show: 'tb_image_inner_options'
                                }
                            }
                        },
                        // Background repeat
                        {
                            id: 'background_repeat_inner',
                            label: '',
                            type: 'select',
                            origId: 'background_image_inner',
                            after: 'bg_m',
                            prop: 'background-mode',
                            selector: inner_selector,
                            options: {
                                repeat: 'r_all',
                                'repeat-x': 'r_h',
                                'repeat-y': 'r_v',
                                'repeat-none': 'r_no',
                                fullcover: 'fcover',
                                'best-fit-image': 'bfit'
                            },
                            wrap_class: 'tb_group_element_image tb_image_inner_options'
                        },
                        // Background attachment
                        {
                            id: 'background_attachment_inner',
                            label: '',
                            type: 'select',
                            origId: 'background_image_inner',
                            after: 'b_a',
                            options: {
                                scroll: 'scroll',
                                fixed: 'fi'
                            },
                            wrap_class: 'tb_group_element_image tb_image_inner_options',
                            prop: 'background-attachment',
                            selector: inner_selector
                        },
                        // Background position
                        {
                            id: 'background_position_inner',
                            label: '',
                            type: 'position_box',
                            origId: 'background_image_inner',
                            position: true,
                            wrap_class: 'tb_group_element_image tb_image_inner_options',
                            prop: 'background-position',
                            selector: inner_selector
                        },
                        // Background Color
                        {
                            id: 'background_color_inner',
                            type: 'color',
                            label: 'bg_c',
                            wrap_class: 'tb_group_element_image',
                            prop: 'background-color',
                            selector: inner_selector
                        },
                        this.get_padding(inner_selector, 'padding_inner'),
                        this.get_border(inner_selector, 'border_inner')
                    ],
                    h: [
                        // Background Image
                        {
                            id: 'b_i_i_h',
                            type: 'image',
                            label: 'b_i',
                            prop: 'background-image',
                            selector: inner_selector_hover,
                            binding: {
                                empty: {
                                    hide: 'tb_image_inner_options'
                                },
                                not_empty: {
                                    show: 'tb_image_inner_options'
                                }
                            }
                        },
                        // Background repeat
                        {
                            id: 'b_r_i_h',
                            label: '',
                            origId: 'b_i_i_h',
                            type: 'select',
                            after: 'bg_m',
                            prop: 'background-mode',
                            selector: inner_selector_hover,
                            options: {
                                repeat: 'r_all',
                                'repeat-x': 'r_h',
                                'repeat-y': 'r_v',
                                'repeat-none': 'r_no',
                                fullcover: 'fcover',
                                'best-fit-image': 'bfit'
                            },
                            wrap_class: 'tb_group_element_image tb_image_inner_options'
                        },
                        // Background attachment
                        {
                            id: 'b_a_i_h',
                            label: '',
                            origId: 'b_i_i_h',
                            type: 'select',
                            after: 'b_a',
                            options: {
                                scroll: 'scroll',
                                fixed: 'fi'
                            },
                            wrap_class: 'tb_group_element_image tb_image_inner_options',
                            prop: 'background-attachment',
                            selector: inner_selector_hover
                        },
                        // Background position
                        {
                            id: 'b_p_i_h',
                            label: '',
                            origId: 'b_i_i_h',
                            type: 'position_box',
                            position: true,
                            wrap_class: 'tb_group_element_image tb_image_inner_options',
                            prop: 'background-position',
                            selector: inner_selector_hover
                        },
                        // Background Color
                        {
                            id: 'b_c_i_h',
                            type: 'color',
                            label: 'bg_c',
                            wrap_class: 'tb_group_element_image',
                            prop: 'background-color',
                            selector: inner_selector_hover
                        },
                        this.get_padding(inner_selector, 'p_i', 'h'),
                        this.get_border(inner_selector, 'b_i', 'h')
                    ]
                })
            ]));
        }
        
        if(type==='column'){
            options.push(this.get_expand('align', [
                this.get_grid_flow(),
                this.get_justify_items(),
                this.get_justify_content(),
                this.get_align_content(),
                this.get_align_items(),
                this.get_gap('','g',undefined,undefined,'','gap'),
                this.get_seperator('acol'),
                this.get_align_self(),
                this.get_justify_self()
                /*
                {
                    type: 'group',
                    wrap_class: 'tb_group_element_row',
                    options:[
                        this.get_row_gap()
                    ]
                },
                {
                    type: 'group',
                    wrap_class: 'tb_group_element_column',
                    options:[
                        this.get_column_gap()
                    ]
                }
                 * 
                 */
            ]));
        }
        //frame
        options.push(this.get_expand('frame', [
            this.get_frame_tabs()
        ]));
        // Font
        options.push(this.get_expand('f', [
            this.get_tab({
                n: [
                    this.get_font_family(['', ' p', ' h1', ' h2', ' h3', ' h4', ' h5', ' h6']),
                    this.get_color(['', ' p', ' h1', ' h2', ' h3', ' h4', ' h5', ' h6'], 'font_color'),
                    this.get_font_size(),
                    this.get_line_height(),
                    this.get_letter_spacing(),
                    this.get_text_align(),
                    this.get_text_transform(),
                    this.get_font_style(),
                    this.get_text_decoration('', 'text_decoration_regular'),
                    this.get_text_shadow(['', ' p', ' h1', ' h2', ' h3', ' h4', ' h5', ' h6'])
                ],
                h: [
                    this.get_font_family([':hover', ':hover p', ':hover h1', ':hover h2', ':hover h3', ':hover h4', ':hover h5', ':hover h6'], 'f_f_h'),
                    this.get_color([':hover', ':hover p', ':hover h1', ':hover h2', ':hover h3', ':hover h4', ':hover h5', ':hover h6'], 'f_c_h'),
                    this.get_font_size('', 'f_s', '', 'h'),
                    this.get_line_height('', 'l_h', 'h'),
                    this.get_letter_spacing('', 'l_s', 'h'),
                    this.get_text_align('', 't_a', 'h'),
                    this.get_text_transform('', 't_t', 'h'),
                    this.get_font_style('', 'f_st', 'f_w', 'h'),
                    this.get_text_decoration('', 't_d_r', 'h'),
                    this.get_text_shadow([':hover', ':hover p', ':hover h1', ':hover h2', ':hover h3', ':hover h4', ':hover h5', ':hover h6'], 't_sh', 'h')
                ]
            })
        ]));
        // Link
        options.push(this.get_expand('l', [
            this.get_tab({
                n: [
                    this.get_color(' a', 'link_color'),
                    this.get_text_decoration(' a')
                ],
                h: [
                    this.get_color(' a', 'l_c', null, null, 'h'),
                    this.get_text_decoration(' a', 't_d', 'h')
                ]
            })
        ]));
        // Padding
        options.push(this.get_expand('p', [
            this.get_tab({
                n: [
                    this.get_padding()
                ],
                h: [
                    this.get_padding('', 'p', 'h')
                ]
            })
        ]));
        // Margin
        options.push(this.get_expand('m', [
            this.get_tab({
                n: margin_fields,
                h: margin_hover_fields
            })
        ]));
        // Border
        options.push(this.get_expand('b', [
            this.get_tab({
                n: [
                    this.get_border()
                ],
                h: [
                    this.get_border('', 'b', 'h')
                ]
            })
        ]));
        // Filter
        options.push(this.get_expand('f_l', [
            this.get_tab({
                n: [
                    this.get_blend()
                ],
                h: [
                    this.get_blend('', '', 'h')
                ]
            })
        ]));

        // Height & Min Height
        options.push(this.get_expand('ht', [
            this.get_height()
        ]));
        // Rounded Corners
        options.push(this.get_expand('r_c', [
            this.get_tab({
                n: [
                    this.get_border_radius()
                ],
                h: [
                    this.get_border_radius(':hover', 'r_c')
                ]
            })
        ]));

        // Shadow
        options.push(this.get_expand('sh', [
            this.get_tab({
                n: [
                    this.get_box_shadow()
                ],
                h: [
                    this.get_box_shadow('', 'sh', 'h')
                ]
            })
        ]));

        // Position
        if (type === 'row' || type === 'subrow') {
            options.push(this.get_expand('po', [
                this.get_css_position()
            ]));
        }

        // Add z-index filed to Rows and Columns
        options.push(this.get_expand('zi', [
            this.get_zindex()
        ]));
        // Add Transform filed to Rows and Columns
        options.push(this.get_expand('tr', [
            this.get_tab({
                n: [
                    this.get_transform()
                ],
                h: [
                    this.get_transform('', 'tr', 'h')
                ]
            })
        ]));
        if (type === 'row' || type === 'subrow') {
            const sel = type === 'row' ? '>.' + type + '_inner' : '';
            options.push({
                hide: true,
                id: 'grid', //reserved id
                type: 'grid',
                selector: sel
            });
            options.push({
                hide: true,
                id: 'gutter', //reserved id
                prop: '--colg',
                type: 'grid',
                selector: sel
            });
            options.push({
                hide: true,
                id: 'rgutter', //reserved id
                prop: '--rowg',
                type: 'grid',
                selector: sel
            });
        }
        return options;
    }
    static get_styles() {
        let heading = [];
        for (let i = 1; i <= 6; ++i) {
            let h = 'h' + i,
                selH = ' div ' + h,
                selector = selH;
            heading = heading.concat([
                this.get_expand(h + '_f', [
                    this.get_tab({
                        n: [
                            this.get_font_family(selector, 'font_family_' + h),
                            this.get_color_type(selector, '', 'font_color_type_' + h, 'font_color_' + h, 'font_gradient_color_' + h),
                            this.get_font_size(selH, 'font_size_' + h),
                            this.get_line_height(selH, 'line_height_' + h),
                            this.get_letter_spacing(selH, 'letter_spacing_' + h),
                            this.get_text_transform(selH, 'text_transform_' + h),
                            this.get_font_style(selH, 'font_style_' + h, 'font_weight_' + h),
                            this.get_text_shadow(selector, 't_sh' + h),
                            // Heading  Margin
                            this.get_margin_top_bottom_opposity(selH, h + '_margin_top', h + '_margin_bottom')
                        ],
                        h: [
                            this.get_font_family(selector, 'f_f_' + h + '_h'),
                            this.get_color_type(selector, '', 'f_c_t_' + h + '_h', 'f_c_' + h + '_h', 'f_g_c_' + h + '_h'),
                            this.get_font_size(selH, 'f_s_' + h, '', 'h'),
                            this.get_line_height(selH, 'l_h_' + h, 'h'),
                            this.get_letter_spacing(selH, 'l_s_' + h, 'h'),
                            this.get_text_transform(selH, 't_t_' + h, 'h'),
                            this.get_font_style(selH, 'f_st_' + h, 'f_w_' + h, 'h'),
                            this.get_text_shadow(selector, 't_sh' + h, 'h'),
                            // Heading  Margin
                            this.get_margin_top_bottom_opposity(selH, h + '_margin_top', h + '_margin_bottom', 'h')
                        ]
                    })
                ])
            ]);
        }
        return {
            type: 'tabs',
            options: {
                g: this.get_base_styles('row'),
                head: heading
            }
        };
    }
}