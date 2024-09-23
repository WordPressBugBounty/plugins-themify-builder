const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        return [
            this.get_expand('asp', [
                this.get_tab({
                    n: [
                        this.get_aspect_ratio(' tf-lottie')
                    ],
                    h: [
                        this.get_aspect_ratio(' tf-lottie', '', 'h')
                    ]
                })
            ]),
            // Width
            this.get_expand('w', [
                this.get_tab({
                    n: [
                        this.get_width('', 'w')
                    ],
                    h: [
                        this.get_width('', 'w', 'h')
                    ]
                })
            ]),
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
                        this.get_font_family(['', ' .module-title']),
                        this.get_color(['', ' .module-title'], 'st_g'),
                        this.get_font_size(['', ' .module-title']),
                        this.get_line_height(['', ' .module-title']),
                        this.get_letter_spacing(['', ' .module-title']),
                        this.get_text_align(['', ' .module-title']),
                        this.get_text_transform(['', ' .module-title']),
                        this.get_font_style(['', ' .module-title']),
                        this.get_text_shadow(['', ' .module-title'])
                    ],
                    h: [
                        this.get_font_family(['', ' .module-title'], 'f_f_h'),
                        this.get_color(['', ' .module-title'], 'f_c_h', null, null, 'h'),
                        this.get_font_size(['', ' .module-title'], 'f_s', '', 'h'),
                        this.get_line_height(['', ' .module-title'], 'l_h', 'h'),
                        this.get_letter_spacing(['', ' .module-title'], 'l_s', 'h'),
                        this.get_text_align(['', ' .module-title'], 't_a', 'h'),
                        this.get_text_transform(['', ' .module-title'], 't_t', 'h'),
                        this.get_font_style(['', ' .module-title'], 'f_st', 'f_w', 'h'),
                        this.get_text_shadow(['', ' .module-title'], 't_sh', 'h')
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
            ]
                    ),
            // Position
            this.get_expand('po', [this.get_css_position()]),
        //    this.get_expand('disp', this.get_self_align()),
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
    }
}