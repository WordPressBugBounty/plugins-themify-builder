const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' pre', 'background_color', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' pre', 'bg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_size(),
                        this.get_letter_spacing(),
                        this.get_text_transform(),
                        this.get_text_decoration('', 'text_decoration_regular')
                    ],
                    h: [
                        this.get_font_size('', 'f_s', '', 'h'),
                        this.get_text_decoration('', 't_d_r', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .line-numbers')
                    ],
                    h: [
                        this.get_padding(' .line-numbers', 'p', 'h')
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
        highlightCode = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .line-highlight', 'h_c_b_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .line-highlight', 'h_c_b_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]), // Background
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .line-highlight', 'h_c_b_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .line-highlight', 'h_c_b_sh', 'h')
                    ]
                })
            ]),
            // Filter
            this.get_expand('f_l', [
                this.get_tab({
                    n: [
                        this.get_blend(' .line-highlight', 'h_c_fl')
                    ],
                    h: [
                        this.get_blend(' .line-highlight', 'h_c_fl', 'h')
                    ]
                })
            ])
        ];
        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                highlgtcode: highlightCode
            }
        };
    }
}