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
                        this.get_font_family(),
                        this.get_color('', 'st_g'),
                        this.get_font_size(),
                        this.get_line_height(),
                        this.get_letter_spacing(),
                        this.get_text_align(),
                        this.get_text_transform(),
                        this.get_font_style(),
                        this.get_text_shadow()
                    ],
                    h: [
                        this.get_font_family('', 'f_f_h'),
                        this.get_color('', 'f_c_h', null, null, 'h'),
                        this.get_font_size('', 'f_s', '', 'h'),
                        this.get_font_style('', 'f_st', 'f_w', 'h'),
                        this.get_text_shadow('', 't_sh', 'h')
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
            // Position
            this.get_expand('po', [this.get_css_position()]),
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
        star = [
            //Gaps
            this.get_expand('gap', [
                this.get_row_gap(' .tb_star_wrap'),
                this.get_column_gap(' .tb_star_item')
            ]),
            // Star Base Color
            this.get_expand('strbasec', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_star_container', 'st_c')
                    ],
                    h: [
                        this.get_color(' .tb_star_container', 'st_c', null, null, 'hover')
                    ]
                })
            ]),
            // Star Highlight Color
            this.get_expand('strhghlghtc', [
                this.get_color([' .tb_star_fill',' .tb_star_half'], 'st_h_c')
            ])
        ],
        textBefore = [
            // Text Before Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb_star_text_b', 'f_f_t_b'),
                        this.get_color(' .tb_star_text_b', 'c_t_b'),
                        this.get_font_size(' .tb_star_text_b', 'f_s_t_b'),
                        this.get_line_height(' .tb_star_text_b', 'l_h_t_b'),
                        this.get_letter_spacing(' .tb_star_text_b', 'l_s_t_b'),
                        this.get_text_transform(' .tb_star_text_b', 't_t_t_b'),
                        this.get_font_style(' .tb_star_text_b', 'f_sy_t_b', 'f_w_t_b'),
                        this.get_text_shadow(' .tb_star_text_b', 't_sh_t_b')
                    ],
                    h: [
                        this.get_font_family(' .tb_star_text_b', 'f_f_t_b', 'h'),
                        this.get_color(' .tb_star_text_b', 'c_t_b', null, null, 'h'),
                        this.get_font_size(' .tb_star_text_b', 'f_s_t_b', '', 'h'),
                        this.get_font_style(' .tb_star_text_b', 'f_sy_t_b', 'f_w_t_b', 'h'),
                        this.get_text_shadow(' .tb_star_text_b', 't_sh_t_b', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_star_text_b', 'm_t_b')
                    ],
                    h: [
                        this.get_margin(' .tb_star_text_b', 'm_t_b', 'h')
                    ]
                })
            ]),
            // Width
            this.get_expand('w', [
                this.get_width(' .tb_star_text_b', 'w_t_b')
            ])
        ],
        textAfter = [
            // Text After Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb_star_text_a', 'f_f_t_a'),
                        this.get_color(' .tb_star_text_a', 'c_t_a'),
                        this.get_font_size(' .tb_star_text_a', 'f_s_t_a'),
                        this.get_line_height(' .tb_star_text_a', 'l_h_t_a'),
                        this.get_letter_spacing(' .tb_star_text_a', 'l_s_t_a'),
                        this.get_text_transform(' .tb_star_text_a', 't_t_t_a'),
                        this.get_font_style(' .tb_star_text_a', 'f_sy_t_a', 'f_w_t_a'),
                        this.get_text_shadow(' .tb_star_text_a', 't_sh_t_a')
                    ],
                    h: [
                        this.get_font_family(' .tb_star_text_a', 'f_f_t_a', 'h'),
                        this.get_color(' .tb_star_text_a', 'c_t_a', null, null, 'h'),
                        this.get_font_size(' .tb_star_text_a', 'f_s_t_a', '', 'h'),
                        this.get_font_style(' .tb_star_text_a', 'f_sy_t_a', 'f_w_t_a', 'h'),
                        this.get_text_shadow(' .tb_star_text_a', 't_sh_t_a', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_star_text_a', 'm_t_a')
                    ],
                    h: [
                        this.get_margin(' .tb_star_text_a', 'm_t_a', 'h')
                    ]
                })
            ]),
            // Width
            this.get_expand('w', [
                this.get_width(' .tb_star_text_a', 'w_t_a')
            ])
                ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                star: star,
                tbefore: textBefore,
                tafter: textAfter
            }
        };
    }
}