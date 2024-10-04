const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image()
                    ],
                    h: [
                        this.get_image('', 'b_i', 'bg_c', 'b_r', 'b_p', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb_text_wrap'),
                        this.get_color_type(' .tb_text_wrap'),
                        this.get_font_size(),
                        this.get_line_height(),
                        this.get_letter_spacing(),
                        this.get_text_align(),
                        this.get_text_transform(),
                        this.get_font_style(' .tb_text_wrap'),
                        this.get_text_decoration(' .tb_text_wrap', 'text_decoration_regular'),
                        this.get_text_shadow(' .tb_text_wrap')
                    ],
                    h: [
                        this.get_font_family(':hover .tb_text_wrap', 'f_f_h'),
                        this.get_color_type(':hover .tb_text_wrap', '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size('', 'f_s', '', 'h'),
                        this.get_font_style(':hover .tb_text_wrap', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(' .tb_text_wrap', 't_d_r', 'h'),
                        this.get_text_shadow(':hover .tb_text_wrap', 't_sh', 'h')
                    ]
                })
            ]),
            // Paragraph
            this.get_expand('pa', [
                this.get_margin_top_bottom_opposity(' p', 'p_margin_top', 'p_margin_bottom')
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color(' a', 'link_color'),
                        this.get_text_decoration(' a')
                    ],
                    h: [
                        this.get_color(' a', 'link_color', null, null, 'hover'),
                        this.get_text_decoration(' a', 't_d', 'h')
                    ]
                })
            ]),
            // Multi-column
            this.get_expand('col', [
                this.get_multi_columns_count()
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
            // Height & Min Height
            this.get_expand('ht', [
                this.get_height()
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
            // Position
            this.get_expand('po', [this.get_css_position()]),
			//this.get_expand('disp', this.get_self_align()),
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
                dropcap = [
                    // Background
                    this.get_expand('bg', [
                        this.get_tab({
                            n: [
                                this.get_color('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'dropcap_background_color', 'bg_c', 'background-color')
                            ],
                            h: [
                                this.get_color('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'd_b_c', 'bg_c', 'background-color')
                            ]
                        })
                    ]),
                    // Font
                    this.get_expand('f', [
                        this.get_tab({
                            n: [
                                this.get_font_family('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'font_dropcap_family'),
                                this.get_color('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'dropcap_font_color'),
                                this.get_font_size('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'dropcap_font_size'),
                                this.get_line_height('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'dropcap_line_height'),
                                this.get_text_transform('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'dropcap_letter_transform'),
                                this.get_font_style('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'font_dropcap', 'font_dropcap_bold'),
                                this.get_text_decoration('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'dropcap_decoration_regular'),
                                this.get_text_shadow('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 't_sh_dr')
                            ],
                            h: [
                                this.get_font_family('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'f_d_f_h'),
                                this.get_color('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'd_f_c_h'),
                                this.get_font_size('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'd_f_s_h'),
                                this.get_font_style('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'f_d_h', 'f_d_b_h'),
                                this.get_text_decoration('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'd_d_r_h'),
                                this.get_text_shadow('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 't_sh_dr_h')
                            ]
                        })
                    ]),
                    // Padding
                    this.get_expand('p', [
                        this.get_tab({
                            n: [
                                this.get_padding('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'dropcap_padding')
                            ],
                            h: [
                                this.get_padding('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'd_p_h')
                            ]
                        })
                    ]),
                    // Margin
                    this.get_expand('m', [
                        this.get_tab({
                            n: [
                                this.get_margin('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'dropcap_margin')
                            ],
                            h: [
                                this.get_margin('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'd_m_h')
                            ]
                        })
                    ]),
                    // Border
                    this.get_expand('b', [
                        this.get_tab({
                            n: [
                                this.get_border('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'dropcap_border')
                            ],
                            h: [
                                this.get_border('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'd_b_h')
                            ]
                        })
                    ]),
                    // Rounded Corners
                    this.get_expand('r_c', [
                        this.get_tab({
                            n: [
                                this.get_border_radius('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'rc_dp')
                            ],
                            h: [
                                this.get_border_radius('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'rc_dp_h')
                            ]
                        })
                    ]),
                    // Shadow
                    this.get_expand('sh', [
                        this.get_tab({
                            n: [
                                this.get_box_shadow('.tb_text_dropcap > .tb_text_wrap:first-child:first-letter', 'sh_dp')
                            ],
                            h: [
                                this.get_box_shadow('.tb_text_dropcap > .tb_text_wrap:hover:first-child:first-letter', 'sh_dp_h')
                            ]
                        })
                    ])
                ];
        let heading = [];

        for (let i = 1; i <= 6; ++i) {
            let h = 'h' + i,
                    selector = h,
                    selH = '.module ' + h;
            heading = heading.concat([
                this.get_expand(h + '_f', [
                    this.get_tab({
                        n: [
                            this.get_font_family('.module .tb_text_wrap ' + selector, 'font_family_' + h),
                            this.get_color_type('.module .tb_text_wrap ' + selector, '', 'font_color_type_' + h, 'font_color_' + h, 'font_gradient_color_' + h),
                            this.get_font_size(selH, 'font_size_' + h),
                            this.get_line_height(selH, 'line_height_' + h),
                            this.get_letter_spacing(selH, 'letter_spacing_' + h),
                            this.get_text_transform(selH, 'text_transform_' + h),
                            this.get_font_style('.module .tb_text_wrap ' + selector, 'font_style_' + h, 'font_weight_' + h),
                            this.get_text_shadow('.module .tb_text_wrap ' + selector, 't_sh' + h),
                            // Heading  Margin
                            this.get_margin_top_bottom_opposity(selH, h + '_margin_top', h + '_margin_bottom')
                        ],
                        h: [
                            this.get_font_family('.module:hover .tb_text_wrap ' + selector, 'f_f_' + h + '_h'),
                            this.get_color_type('.module:hover .tb_text_wrap ' + selector, '', 'f_c_t_' + h + '_h', 'f_c_' + h + '_h', 'f_g_c_' + h + '_h'),
                            this.get_font_size(selH, 'f_s_' + h, '', 'h'),
                            this.get_font_style('.module:hover .tb_text_wrap ' + selector, 'f_st_' + h, 'f_w_' + h, 'h'),
                            this.get_text_shadow('.module:hover .tb_text_wrap ' + selector, 't_sh' + h, 'h'),
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
                g: general,
                m_t: this.module_title_custom_style(),
                head: heading,
                dropcap: dropcap
            }
        };
    }
}