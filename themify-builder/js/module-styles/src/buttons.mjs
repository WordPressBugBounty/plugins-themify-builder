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
                        this.get_image('.module', 'gb_i', 'gbg_c', 'gb_r', 'gb_p', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .module-buttons-item a'),
                        this.get_color([' em',' .ui', ' span'],'font_color'),
                        this.get_font_size(' .module-buttons-item a'),
                        this.get_line_height(' .module-buttons-item a'),
                        this.get_letter_spacing(' .module-buttons-item a'),
                        this.get_text_align(),
                        this.get_text_transform(' .module-buttons-item a'),
                        this.get_font_style(' .module-buttons-item a'),
                        this.get_text_decoration([' em',' .ui', ' span'], 'text_decoration_regular'),
                        this.get_text_shadow(' .module-buttons-item a')
                    ],
                    h: [
                        this.get_font_family(' .module-buttons-item a', 'f_f', 'h'),
                        this.get_color([' .module-buttons-item:hover em', ' .module-buttons-item:hover a', ' .module-buttons-item:hover span'], 'f_c_h'),
                        this.get_font_size(' .module-buttons-item a', 'f_s', '', 'h'),
                        this.get_font_style(' .module-buttons-item a', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration([' em',' .ui', ' span'], 't_d_r', 'h'),
                        this.get_text_shadow(' .module-buttons-item a', 't_sh', 'h')
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
        buttonLink = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image(' .module-buttons-item a', 'b_i', 'button_background_color', 'b_r', 'b_p')
                    ],
                    h: [
                        this.get_image(' .module-buttons-item a:hover', 'b_i_h', 'button_hover_background_color', 'b_r_h', 'b_p_h')
                    ]
                })
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color([' .module-buttons-item a'], 'link_color'),
                        this.get_text_decoration([' .module-buttons-item a'])
                    ],
                    h: [
                        this.get_color([' .module-buttons-item a:hover'], 'link_color_hover'),
                        this.get_text_decoration([' .module-buttons-item a:hover'], 't_d_h', '')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .module-buttons-item a', 'padding_link')
                    ],
                    h: [
                        this.get_padding(' .module-buttons-item a', 'p_l', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .module-buttons-item a', 'link_margin')
                    ],
                    h: [
                        this.get_margin(' .module-buttons-item a', 'l_m', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('.module .module-buttons-item a', 'link_border')
                    ],
                    h: [
                        this.get_border('.module .module-buttons-item a', 'l_b', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .module-buttons-item a', 'l_b_r_c')
                    ],
                    h: [
                        this.get_border_radius(' .module-buttons-item a', 'l_b_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .module-buttons-item a', 'l_b_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .module-buttons-item a', 'l_b_sh', 'h')
                    ]
                })
            ])
        ],
        buttonIcon = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image(' .module-buttons-item em', 'bic_b_i', 'bic_b_c', 'bic_b_r', 'bic_b_p')
                    ],
                    h: [
                        this.get_image(' .module-buttons-item:hover em', 'bic_b_i_h', 'bic_h_b_c', 'bic_b_r_h', 'bic_b_p_h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_color(' .module-buttons-item em', 'b_c_bic'),
                        this.get_font_size(' .module-buttons-item em', 'f_s_bic')
                    ],
                    h: [
                        this.get_color(' .module-buttons-item:hover em', 'f_c_h_bic', null, null, ''),
                        this.get_font_size(' .module-buttons-item:hover em', 'f_s_h_bic', '', '')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .module-buttons-item em', 'p_i_bic')
                    ],
                    h: [
                        this.get_padding(' .module-buttons-item em', 'p_i_bic', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .module-buttons-item em', 'm_i_bic')
                    ],
                    h: [
                        this.get_margin(' .module-buttons-item em', 'm_i_bic', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .module-buttons-item em', 'b_i_bic')
                    ],
                    h: [
                        this.get_border(' .module-buttons-item em', 'b_i_bic', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .module-buttons-item em', 'rc_i_bic')
                    ],
                    h: [
                        this.get_border_radius(' .module-buttons-item em', 'rc_i_bic', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .module-buttons-item em', 'sh_i_bic')
                    ],
                    h: [
                        this.get_box_shadow(' .module-buttons-item em', 'sh_i_bic', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                btnlink: buttonLink,
                icon: buttonIcon
            }
        };
    }
}