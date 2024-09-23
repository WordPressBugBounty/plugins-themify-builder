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
                        this.get_color_type(' a'),
                        this.get_font_size(),
                        this.get_line_height(),
                        this.get_letter_spacing(),
                        this.get_text_align(),
                        this.get_text_transform(),
                        this.get_font_style(),
                        this.get_text_decoration(),
                        this.get_text_shadow()
                    ],
                    h: [
                        this.get_font_family('', 'f_f', 'h'),
                        this.get_color_type(':hover a', 'h'),
                        this.get_font_size('', 'f_s_h', '', 'h'),
                        this.get_font_style('', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration('', 't_d_r', 'h'),
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
        icon = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image(' a', 'b_i', 'in_b_c', 'b_r', 'b_p')
                    ],
                    h: [
                        this.get_image(' a:hover', 'b_i_h', 'in_h_b_c', 'b_r_h', 'b_p_h')
                    ]
                })
            ]),
            // Color
            this.get_expand('c', [
                this.get_tab({
                    n: [
                        this.get_color(' a', 'f_c_i')
                    ],
                    h: [
                        this.get_color(' a', 'f_c_i', null, null, 'h')
                    ]
                })
            ]),
            // Font Size
            this.get_expand('size', [
                this.get_tab({
                    n: [
                        this.get_font_size(' a', 'f_s_i')
                    ],
                    h: [
                        this.get_font_size(' a', 'f_s_i', '', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' a', 'br_i')
                    ],
                    h: [
                        this.get_border(' a', 'br_i', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' a', 'p_i')
                    ],
                    h: [
                        this.get_padding(' a', 'p_i', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' a', 'm_i')
                    ],
                    h: [
                        this.get_margin(' a', 'm_i', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' a', 'r_c_i')
                    ],
                    h: [
                        this.get_border_radius(' a', 'r_c_i', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' a', 'b_sh_i')
                    ],
                    h: [
                        this.get_box_shadow(' a', 'b_sh_i', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                icon: icon
            }
        };
    }
}