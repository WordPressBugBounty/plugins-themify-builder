const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image('.module')
                    ],
                    h: [
                        this.get_image('.module', 'b_i', 'bg_c', 'b_r', 'b_p', 'h')
                    ]
                })
            ]),
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .callout-content'),
                        this.get_color_type([' .tb_text_wrap', ' .callout-heading']),
                        this.get_font_size(' .callout-content'),
                        this.get_line_height(' .callout-content'),
                        this.get_letter_spacing([' .callout-content', ' .callout-heading']),
                        this.get_text_align([' .callout-content', ' .callout-heading']),
                        this.get_text_transform([' .callout-content', ' .callout-heading']),
                        this.get_font_style([' .callout-content', ' .callout-heading']),
                        this.get_text_decoration([' .callout-content'], 'text_decoration_regular'),
                        this.get_text_shadow(' .callout-content')
                    ],
                    h: [
                        this.get_font_family(' .callout-content', 'f_f', 'h'),
                        this.get_color_type([':hover .tb_text_wrap', ':hover .callout-heading'], '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size(' .callout-content', 'f_s', '', 'h'),
                        this.get_font_style([' .callout-content', ' .callout-heading'], 'f_st', 'f_w', 'h'),
                        this.get_text_decoration([' .callout-content'], 't_d_r', 'h'),
                        this.get_text_shadow(' .callout-content', 't_sh', 'h')
                    ]
                })
            ]),
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color(['.module .tb_text_wrap a', '.module .tb_callout_text'], 'link_color'),
                        this.get_text_decoration(['.module a', '.module .callout-content'])
                    ],
                    h: [
                        this.get_color(['.module .tb_text_wrap a', '.module .tb_callout_text'], 'link_color', null, null, 'hover'),
                        this.get_text_decoration(['.module a', '.module .callout-content'], 't_d', 'h')
                    ]
                })
            ]),
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
            this.get_expand('w', [
                this.get_width('', 'w')
            ]),
            // Height & Min Height
            this.get_expand('ht', [
                this.get_height()
            ]),
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
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow('.module')
                    ],
                    h: [
                        this.get_box_shadow('.module', 'sh', 'h')
                    ]
                })
            ]),
         //   this.get_expand('disp', this.get_self_align()),
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
        calloutTitle = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family('.module .callout-heading', 'font_family_alert_title'),
                    this.get_color('.module .callout-heading', 'font_color_alert_title'),
                    this.get_font_size('.module .callout-heading', 'font_size_alert_title'),
                    this.get_line_height('.module .callout-heading', 'line_height_alert_title'),
                    this.get_letter_spacing('.module .callout-heading', 'letter_spacing_alert_title'),
                    this.get_text_transform('.module .callout-heading', 'text_transform_title'),
                    this.get_font_style('.module .callout-heading', 'font_style_title', 'font_title_bold'),
                    this.get_text_shadow('.module .callout-heading', 't_sh_c_t')
                ],
                h: [
                    this.get_font_family('.module .callout-heading', 'f_f_a_t', 'h'),
                    this.get_color('.module .callout-heading', 'font_color_alert_title', null, null, 'h'),
                    this.get_font_size('.module .callout-heading', 'f_s_a_t', '', 'h'),
                    this.get_font_style('.module .callout-heading', 'f_s_t', 'f_t_b', 'h'),
                    this.get_text_shadow('.module .callout-heading', 't_sh_c_t', 'h')
                ]
            })
        ],
        calloutButton = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .callout-button a', 'background_color_button', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .callout-button a', 'background_color_button', 'bg_c', 'background-color', 'hover')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .callout-button a', 'font_family_button'),
                        this.get_color('.module .callout-button a', 'font_color_button'),
                        this.get_font_size(' .callout-button a', 'font_size_button'),
                        this.get_font_style(' .callout-button a', 'f_fs_c', 'f_fw_c'),
                        this.get_line_height(' .callout-button a', 'line_height_button'),
                        this.get_text_shadow(' .callout-button a', 't_sh_c_b')
                    ],
                    h: [
                        this.get_font_family(' .callout-button a', 'f_f_b', 'h'),
                        this.get_color('.module .callout-button a', 'font_color_button', null, null, 'hover'),
                        this.get_font_size(' .callout-button a', 'f_s_b', '', 'h'),
                        this.get_font_style(' .callout-button a', 'f_fs_c', 'f_fw_c', 'h'),
                        this.get_text_shadow(' .callout-button a', 't_sh_c_b', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .callout-button a', 'c_b_r_c')
                    ],
                    h: [
                        this.get_border_radius(' .callout-button a', 'c_b_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .callout-button a', 'c_b_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .callout-button a', 'c_b_sh', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                calhead: calloutTitle,
                calbtn: calloutButton
            }
        };
    }
}