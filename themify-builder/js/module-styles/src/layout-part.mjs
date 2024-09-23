const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image('', 'b_i', 'bg_c', 'b_r', 'b_p', '')
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
                        this.get_font_family('', 'f_f_g'),
                        this.get_color_type('', '', 'f_c_t_g', 'f_c_g', 'f_g_c_g'),
                        this.get_font_size('', 'f_s_g', '', ''),
                        this.get_line_height('', 'l_h_g'),
                        this.get_letter_spacing('', 'l_s_s'),
                        this.get_text_align('', 't_a_g'),
                        this.get_text_transform('', 't_t_g'),
                        this.get_font_style('', 'f_st_g', 'f_w_g'),
                        this.get_text_decoration('', 't_d_g'),
                        this.get_text_shadow('', 't_sh_g')
                    ],
                    h: [
                        this.get_font_family('', 'f_f_g', 'h'),
                        this.get_color_type('', '', 'f_c_t_g_h', 'f_c_g_h', 'f_g_c_g_h'),
                        this.get_font_size('', 'f_s_g_h', '', 'h'),
                        this.get_font_style('', 'f_st_g', 'f_w_g', 'h'),
                        this.get_text_decoration('', 't_d_g', 'h'),
                        this.get_text_shadow('', 't_sh_g', 'h')
                    ]
                })
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color(' a', 'l_c_l'),
                        this.get_text_decoration(' a', 't_d_g_l')
                    ],
                    h: [
                        this.get_color(' a', 'l_c_l', null, null, 'hover'),
                        this.get_text_decoration(' a', 't_d_g_l', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding('', 'p_g', '', true)
                    ],
                    h: [
                        this.get_padding('', 'p_g', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('', 'm_g', '', true)
                    ],
                    h: [
                        this.get_margin('', 'm_g', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('', 'b_g')
                    ],
                    h: [
                        this.get_border('', 'b_g', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius('', 'r_c_g')
                    ],
                    h: [
                        this.get_border_radius('', 'r_c_g', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow('', 'sh_g')
                    ],
                    h: [
                        this.get_box_shadow('', 'sh_g', 'h')
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
        ];
        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style()
            }
        };
    }
}