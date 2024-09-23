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
                        this.get_font_family([' .tb_text_wrap', ' .module-feature-title']),
                        this.get_color_type([' .tb_text_wrap', ' .module-feature-title']),
                        this.get_font_size(),
                        this.get_line_height(),
                        this.get_letter_spacing(),
                        this.get_text_align(['', ' .module-feature-content']),
                        this.get_text_transform(),
                        this.get_font_style([' .tb_text_wrap', ' .module-feature-title']),
                        this.get_text_decoration('', 'text_decoration_regular'),
                        this.get_text_shadow([' .tb_text_wrap', ' .module-feature-title'])
                    ],
                    h: [
                        this.get_font_family([':hover .tb_text_wrap', ':hover .module-feature-title'], 'f_f_h'),
                        this.get_color_type([':hover .tb_text_wrap', ':hover .module-feature-title'], '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size('', 'f_s', '', 'h'),
                        this.get_font_style([':hover .tb_text_wrap', ':hover .module-feature-title'], 'f_st', 'f_w', 'h'),
                        this.get_text_decoration('', 't_d_r', 'h'),
                        this.get_text_shadow([' .tb_text_wrap', ' .module-feature-title'], 't_sh', 'h')
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
                        this.get_color('.module a:hover', 'link_color_hover'),
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
        featureTitle = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family(['.module .module-feature-title', '.module .module-feature-title a'], 'font_family_title'),
                    this.get_color(['.module .module-feature-title', '.module .module-feature-title a'], 'font_color_title'),
                    this.get_font_size('.module .module-feature-title', 'font_size_title'),
                    this.get_line_height('.module .module-feature-title', 'line_height_title'),
                    this.get_letter_spacing('.module .module-feature-title', 'l_s_t'),
                    this.get_text_transform('.module .module-feature-title', 't_t_t'),
                    this.get_font_style(['.module .module-feature-title', '.module .module-feature-title a'], 'f_s_t', 'f_t_b'),
                    this.get_text_shadow('.module .module-feature-title', 't_sh_t')
                ],
                h: [
                    this.get_font_family(['.module .module-feature-title', '.module .module-feature-title a'], 'f_f_t', 'h'),
                    this.get_color(['.module .module-feature-title', '.module .module-feature-title a'], 'font_color_title', null, null, 'hover'),
                    this.get_font_size('.module .module-feature-title', 'f_s_t', '', 'h'),
                    this.get_font_style(['.module .module-feature-title', '.module .module-feature-title a'], 'f_st_t', 'f_t_b', 'h'),
                    this.get_text_shadow('.module .module-feature-title', 't_sh_t', 'h')
                ]
            })
        ],
        featureContent = [
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(['.module .tb_text_wrap', ' .module-feature-content'], 'font_family_content'),
                        this.get_color(['.module .tb_text_wrap', '.module .module-feature-content', '.module .module-feature-title'], 'f_c_c'),
                        this.get_font_size(['.module .tb_text_wrap', ' .module-feature-content'], 'f_s_c'),
                        this.get_font_style(['.module .tb_text_wrap', ' .module-feature-content'], 'f_st_c', 'f_fw_c'),
                        this.get_line_height(['.module .tb_text_wrap', ' .module-feature-content'], 'l_h_c'),
                        this.get_letter_spacing(['.module .tb_text_wrap', ' .module-feature-content'], 'l_s_c'),
                        this.get_text_shadow(['.module .tb_text_wrap', ' .module-feature-content'], 't_sh_c')
                    ],
                    h: [
                        this.get_font_family(['.module .tb_text_wrap', ' .module-feature-content'], 'f_f_c', 'h'),
                        this.get_color(['.module .tb_text_wrap', '.module .module-feature-content', '.module .module-feature-title'], 'f_c_c', null, null, 'h'),
                        this.get_font_size(['.module .tb_text_wrap', ' .module-feature-content'], 'f_s_c', '', 'h'),
                        this.get_font_style(['.module .tb_text_wrap', ' .module-feature-content'], 'f_st_c', 'f_fw_c', 'h'),
                        this.get_text_shadow(['.module .tb_text_wrap', ' .module-feature-content'], 't_sh_c', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .module-feature-content', 'c_p')
                    ],
                    h: [
                        this.get_padding(' .module-feature-content', 'c_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .module-feature-content', 'c_m')
                    ],
                    h: [
                        this.get_margin(' .module-feature-content', 'c_m', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .module-feature-content', 'c_b')
                    ],
                    h: [
                        this.get_border(' .module-feature-content', 'c_b', 'h')
                    ]
                })
            ])
        ],
        featuredIcon = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_size(' .module-feature-icon', 'f_s_i')
                ],
                h: [
                    this.get_font_size(' .module-feature-icon', 'f_s_i', '', 'h')
                ]
            })
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                ftitle: featureTitle,
                ficon: featuredIcon,
                fcont: featureContent
            }
        };
    }
}