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
                        this.get_color_type(' span'),
                        this.get_font_size([' em', ' a', ' span']),
                        this.get_line_height([' em', ' a', ' span']),
                        this.get_letter_spacing(),
                        this.get_text_align(),
                        this.get_text_transform(),
                        this.get_font_style(),
                        this.get_text_decoration(' span', 'text_decoration_regular'),
                        this.get_text_shadow()
                    ],
                    h: [
                        this.get_font_family('', 'f_f', 'h'),
                        this.get_color_type(':hover span', 'f_c_h', ''),
                        this.get_font_size([':hover em', ':hover a', ':hover span'], 'f_s_h', '', ''),
                        this.get_font_style('', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(':hover span', 't_d_r_h', ''),
                        this.get_text_shadow('', 't_sh', 'h')
                    ]
                })
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color(' span', 'link_color'),
                        this.get_text_decoration(' a')
                    ],
                    h: [
                        this.get_color(' span:hover', 'link_color_hover'),
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
            // Position
            this.get_expand('po', [this.get_css_position()]),
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
        icon = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .module-icon-item em', 'background_color_icon', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .module-icon-item em', 'background_color_icon', 'bg_c', 'background-color', 'hover')
                    ]
                })
            ]),
            // Color
            this.get_expand('c', [
                this.get_tab({
                    n: [
                        this.get_color(' .module-icon-item em', 'font_color_icon')
                    ],
                    h: [
                        this.get_color(' .module-icon-item em', 'font_color_icon', null, null, 'hover')
                    ]
                })
            ]),
            // Font Size
            this.get_expand('size', [
                this.get_tab({
                    n: [
                        this.get_font_size(' .module-icon-item em', 'f_s_i')
                    ],
                    h: [
                        this.get_font_size(' .module-icon-item em', 'f_s_i', '', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .module-icon-item em', 'p_i')
                    ],
                    h: [
                        this.get_padding(' .module-icon-item em', 'p_i', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .module-icon-item em', 'm_i')
                    ],
                    h: [
                        this.get_margin(' .module-icon-item em', 'm_i', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .module-icon-item em', 'r_c_i')
                    ],
                    h: [
                        this.get_border_radius(' .module-icon-item em', 'r_c_i', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .module-icon-item em', 'b_sh_i')
                    ],
                    h: [
                        this.get_box_shadow(' .module-icon-item em', 'b_sh_i', 'h')
                    ]
                })
            ])
        ],
        iconContainer = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .module-icon-item', 'bg_c_ctn', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .module-icon-item', 'bg_c_ctn', 'bg_c', 'background-color', 'hover')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .module-icon-item', 'p_ctn')
                    ],
                    h: [
                        this.get_padding(' .module-icon-item', 'p_ctn', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .module-icon-item', 'm_ctn')
                    ],
                    h: [
                        this.get_margin(' .module-icon-item', 'm_ctn', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .module-icon-item', 'b_ctn')
                    ],
                    h: [
                        this.get_border(' .module-icon-item', 'b_ctn', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .module-icon-item', 'r_c_ctn')
                    ],
                    h: [
                        this.get_border_radius(' .module-icon-item', 'r_c_ctn', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .module-icon-item', 'b_sh_ctn')
                    ],
                    h: [
                        this.get_box_shadow(' .module-icon-item', 'b_sh_ctn', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                conter: iconContainer,
                icon: icon
            }
        };
    }
}