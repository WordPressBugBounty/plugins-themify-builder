const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color('', 'background_color', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color('', 'bg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .slide-content'),
                        this.get_color_type([' .tb_text_wrap', ' .slide-content a']),
                        this.get_font_size(' .slide-content'),
                        this.get_line_height(' .slide-content'),
                        this.get_letter_spacing(' .slide-content'),
                        this.get_text_align(' .slide-content'),
                        this.get_text_transform(' .slide-content'),
                        this.get_font_style(' .slide-content'),
                        this.get_text_decoration(' .slide-content', 'text_decoration_regular'),
                        this.get_text_shadow([' .slide-content', '.module .slide-title', '.module .slide-title a'])
                    ],
                    h: [
                        this.get_font_family(' .slide-content', 'f_f', 'h'),
                        this.get_color_type([':hover .tb_text_wrap', ':hover .slide-content a'], '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size(' .slide-content', 'f_s', '', 'h'),
                        this.get_font_style(' .slide-content', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(' .slide-content', 't_d_r', 'h'),
                        this.get_text_shadow([' .slide-content', '.module .slide-title', '.module .slide-title a'], 't_sh', 'h')
                    ]
                })
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color('.module a', 'link_color'),
                        this.get_text_decoration(' a')
                    ],
                    h: [
                        this.get_color('.module a', 'link_color', null, null, 'hover'),
                        this.get_text_decoration(' a', 't_d', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding()
                    ],
                    h: [
                        this.get_padding('', 'p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin()
                    ],
                    h: [
                        this.get_margin('', 'm', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border()
                    ],
                    h: [
                        this.get_border('', 'b', 'h')
                    ]
                })
            ]),
            // Filter
            this.get_expand('f_l', [
                this.get_tab({
                    n: [
                        this.get_blend()
                    ],
                    h: [
                        this.get_blend('', '', 'h')
                    ]
                })
            ]),
            // Width
            this.get_expand('w', [
                this.get_width('', 'w')
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius()
                    ],
                    h: [
                        this.get_border_radius('', 'r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow()
                    ],
                    h: [
                        this.get_box_shadow('', 'sh', 'h')
                    ]
                })
            ]),
          //  this.get_expand('disp', this.get_self_align()),
            this.get_expand('zi', [
                    this.get_zindex('', 'custom_parallax_scroll_zindex')
                ]
            ),
            this.get_expand('tr', [
                this.get_tab({
                    n: [
                        this.get_transform()
                    ],
                    h: [
                        this.get_transform('', 'tr', 'h')
                    ]
                })
            ])
        ],
        container = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color([' .slide-inner-wrap', '.slider-caption-overlay .slide-content'], 'b_c_container', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color([' .slide-inner-wrap', '.slider-caption-overlay .slide-content'], 'b_c_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .slide-inner-wrap', 'p_container')
                    ],
                    h: [
                        this.get_padding(' .slide-inner-wrap', 'p_c', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .slide-inner-wrap', 'm_container')
                    ],
                    h: [
                        this.get_margin(' .slide-inner-wrap', 'm_c', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .slide-inner-wrap', 'b_container')
                    ],
                    h: [
                        this.get_border(' .slide-inner-wrap', 'b_c', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .slide-inner-wrap', 'r_c_sc')
                    ],
                    h: [
                        this.get_border_radius(' .slide-inner-wrap', 'r_c_sc', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .slide-inner-wrap', 'b_sh_sc')
                    ],
                    h: [
                        this.get_box_shadow(' .slide-inner-wrap', 'b_sh_sc', 'h')
                    ]
                })
            ])
        ],
        title = [
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(['.module .slide-title', '.module .slide-title a'], 'font_family_title'),
                        this.get_color(['.module .slide-content .slide-title', '.module .slide-content .slide-title a'], 'font_color_title'),
                        this.get_font_size('.module .slide-title', 'font_size_title'),
                        this.get_line_height('.module .slide-title', 'line_height_title'),
                        this.get_letter_spacing('.module .slide-title', 'letter_spacing_title'),
                        this.get_text_transform('.module .slide-title', 'text_transform_title'),
                        this.get_font_style(['.module .slide-title', '.module .slide-title a'], 'font_title', 'font_title_bold')
                    ],
                    h: [
                        this.get_font_family(['.module .slide-title', '.module .slide-title a'], 'f_f_t', 'h'),
                        this.get_color(['.module .slide-content .slide-title', '.module .slide-content .slide-title a'], 'f_c_t_t', null, null, 'h'),
                        this.get_font_size('.module .slide-title', 'f_s_t', '', 'h'),
                        this.get_font_style(['.module .slide-title', '.module .slide-title a'], 'f_t', 'f_t_b', 'h')
                    ]
                })
            ]),
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('.module .slide-title', 'm_title'),
                        this.get_text_shadow(['.module .slide-title', '.module .slide-title a'], 't_sh_t')
                    ],
                    h: [
                        this.get_margin('.module .slide-title', 'm_t', 'h'),
                        this.get_text_shadow(['.module .slide-content .slide-title', '.module .slide-content .slide-title a'], 't_sh_t', 'h')
                    ]
                })
            ])
        ],
        image = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .slide-image img', 'i_bg_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .slide-image img', 'i_bg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .slide-image img', 'i_p')
                    ],
                    h: [
                        this.get_padding(' .slide-image img', 'i_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .slide-image', 'i_m')
                    ],
                    h: [
                        this.get_margin(' .slide-image', 'i_m', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .slide-image img', 'i_b')
                    ],
                    h: [
                        this.get_border(' .slide-image img', 'i_b', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .slide-image img', 'i_r_c')
                    ],
                    h: [
                        this.get_border_radius(' .slide-image img', 'i_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .slide-image img', 'i_b_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .slide-image img', 'i_b_sh', 'h')
                    ]
                })
            ])
        ],
        content = [
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('.module .slide-content', 'font_family_content'),
                        this.get_color('.module .slide-content', 'font_color_content'),
                        this.get_font_size('.module .slide-content', 'font_size_content'),
                        this.get_font_style('.module .slide-content', 'f_fs_c', 'f_fw_c'),
                        this.get_line_height('.module .slide-content', 'line_height_content'),
                        this.get_text_shadow(['.module .slide-content', '.module .slide-title', '.module .slide-title a'], 't_sh_c')
                    ],
                    h: [
                        this.get_font_family('.module .slide-content', 'f_f_c', 'h'),
                        this.get_color('.module .slide-content', 'f_c_c', null, null, 'h'),
                        this.get_font_size('.module .slide-content', 'f_s_c', '', 'h'),
                        this.get_font_style('.module .slide-content', 'f_fs_c', 'f_fw_c', 'h'),
                        this.get_text_shadow(['.module .slide-content', '.module .slide-title', '.module .slide-title a'], 't_sh_c', 'h')
                    ]
                })
            ]),
            // Multi columns
            this.get_expand('col', [
                this.get_tab({
                    n: [
                        this.get_multi_columns_count(' .slide-content')
                    ],
                    h: [
                        this.get_multi_columns_count(' .slide-content', 'c', 'h')
                    ]
                })
            ]),
            // padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .slide-content', 'p_content')
                    ],
                    h: [
                        this.get_padding(' .slide-content', 'p_c', 'h')
                    ]
                })
            ])
        ],
        controls = [
            // Arrows
            this.get_expand('arr', [
                this.get_tab({
                    n: [
                        this.get_color([' .carousel-prev', ' .carousel-next'], 'b_c_arrows_controls', 'bg_c', 'background-color'),
                        this.get_color([' .carousel-prev', ' .carousel-next'], 'f_c_arrows_controls'),
                        this.get_width([' .carousel-prev', ' .carousel-next'], 'w_arr_ctrl'),
                        this.get_height([' .carousel-prev', ' .carousel-next'], 'h_arr_ctrl')
                    ],
                    h: [
                        this.get_color([' .carousel-prev:hover', ' .carousel-next:hover'], 'b_c_h_arrows_controls', 'bg_c', 'background-color'),
                        this.get_color([' .carousel-prev:hover', ' .carousel-next:hover'], 'f_c_ar_c_h')
                    ]
                })
            ]),
            // Pager
            this.get_expand('pager', [
                this.get_tab({
                    n: [
                        this.get_color('.module .carousel-pager a', 'f_c_pager_controls')
                    ],
                    h: [
                        this.get_color(['.module .carousel-pager a:hover', '.module .carousel-pager a.selected'], 'f_c_h_pager_controls')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                conter: container,
                title: title,
                image: image,
                content: content,
                ctrols: controls
            }
        };
    }
}