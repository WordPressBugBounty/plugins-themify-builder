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
                        this.get_font_family(['', ' a']),
                        this.get_color(['', ' a'], 'font_color'),
                        this.get_font_size(['', ' a']),
                        this.get_line_height(['', ' a']),
                        this.get_letter_spacing(),
                        this.get_text_align(),
                        this.get_text_transform(),
                        this.get_font_style(['', ' a']),
                        this.get_text_decoration('', 'text_decoration_regular'),
                        this.get_text_shadow(['', ' a'])
                    ],
                    h: [
                        this.get_font_family(['', ' a'], 'f_f', 'h'),
                        this.get_color(['', ' a'], 'f_c', null, null, 'h'),
                        this.get_font_size(['', ' a'], 'f_s', '', 'h'),
                        this.get_font_style(['', ' a'], 'f_st', 'f_w', 'h'),
                        this.get_text_decoration('', 't_d_r', 'h'),
                        this.get_text_shadow(['', ' a'], 't_sh', 'h')
                    ]
                })
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
           // this.get_expand('disp', this.get_self_align()),
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
        widgetTitle = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image('.module .widgettitle', 'b_i_w_t', 'bg_c_w_t', 'b_r_w_t', 'b_p_w_t')
                    ],
                    h: [
                        this.get_image('.module .widgettitle', 'b_i_w_t', 'bg_c_w_t', 'b_r_w_t', 'b_p_w_t', 'h')
                    ]
                })
            ]), // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('.module .widgettitle', 'f_f_w_t'),
                        this.get_color('.module .widgettitle', 'f_c_w_t'),
                        this.get_font_size('.module .widgettitle', 'f_s_w_t'),
                        this.get_line_height('.module .widgettitle', 'l_h_w_t'),
                        this.get_letter_spacing('.module .widgettitle', 'l_s_w_t'),
                        this.get_text_align('.module .widgettitle', 't_a_w_t'),
                        this.get_text_transform('.module .widgettitle', 't_t_w_t'),
                        this.get_font_style('.module .widgettitle', 'f_sy_w_t', 'f_b_w_t'),
                        this.get_text_decoration('.module .widgettitle', 't_d_w_t'),
                        this.get_text_shadow('.module .widgettitle', 't_sh_t')
                    ],
                    h: [
                        this.get_font_family('.module .widgettitle', 'f_f_w_t', 'h'),
                        this.get_color('.module .widgettitle', 'f_c_w_t', null, null, 'h'),
                        this.get_font_size('.module .widgettitle', 'f_s_w_t', '', 'h'),
                        this.get_font_style('.module .widgettitle', 'f_sy_w_t', 'f_b_w_t', 'h'),
                        this.get_text_decoration('.module .widgettitle', 't_d_w_t', 'h'),
                        this.get_text_shadow('.module .widgettitle', 't_sh_t', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding('.module .widgettitle', 'p_w_t')
                    ],
                    h: [
                        this.get_padding('.module .widgettitle', 'p_w_t', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('.module .widgettitle', 'm_w_t')
                    ],
                    h: [
                        this.get_margin('.module .widgettitle', 'm_w_t', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('.module .widgettitle', 'b_w_t')
                    ],
                    h: [
                        this.get_border('.module .widgettitle', 'b_w_t', 'h')
                    ]
                })
            ]),
            // display
            this.get_expand( 'disp', this.get_display( '.module .widgettitle' ) )
        ];
        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                widgett: widgetTitle
            }
        };
    }
}