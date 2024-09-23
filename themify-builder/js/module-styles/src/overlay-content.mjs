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
                        this.get_font_family(' .tb_ov_co_icon_wrapper', 'g_f_f'),
                        this.get_color(' .tb_ov_co_icon_wrapper', 'g_c'),
                        this.get_font_size(' .tb_ov_co_icon_wrapper', 'g_f_s'),
                        this.get_line_height(' .tb_ov_co_icon_wrapper', 'g_l_h'),
                        this.get_letter_spacing(' .tb_ov_co_icon_wrapper', 'g_l_s'),
                        this.get_text_align('', 'g_t_a'),
                        this.get_text_transform(' .tb_ov_co_icon_wrapper', 'g_t_t'),
                        this.get_font_style(' .tb_ov_co_icon_wrapper', 'g_f_st', 'g_f_w'),
                        this.get_text_shadow(' .tb_ov_co_icon_title', 'g_t_sh')
                    ],
                    h: [
                        this.get_font_family(' .tb_ov_co_icon_wrapper:hover', 'g_f_f', 'h'),
                        this.get_color(' .tb_ov_co_icon_wrapper:hover', 'g_c_h', null, null, ''),
                        this.get_font_size(' .tb_ov_co_icon_wrapper:hover', '_g_f_s_h', '', ''),
                        this.get_font_style(' .tb_ov_co_icon_wrapper:hover', 'g_f_st_h', 'g_f_w_h'),
                        this.get_text_shadow(' .tb_ov_co_icon_title:hover', 'g_t_sh_h')
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
                this.get_width('', 'g_w')
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
            this.get_expand('po', [
                this.get_css_position()
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
        overlay = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_oc_overlay_layer', 'o_b_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_oc_overlay_layer', 'o_b_c_h', 'bg_c', 'background-color', 'hover')
                    ]
                })
            ])
        ],
        container = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image([' .tb_oc_overlay', ' .tb_overlay_content_lp'], 'ctr_b_i', 'o_bg_c', '', 'o_b_p')
                    ],
                    h: [
                        this.get_image(' .tb_oc_overlay, .tb_overlay_content_lp', 'ctr_b_i_h', 'o_bg_c_h', '', 'o_b_p_h', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_oc_overlay', 'ctr_p')
                    ],
                    h: [
                        this.get_padding(' .tb_oc_overlay', 'ctr_p_h', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_oc_overlay', 'ctr_m')
                    ],
                    h: [
                        this.get_margin(' .tb_oc_overlay', 'ctr_m', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_oc_overlay', 'ctr_b')
                    ],
                    h: [
                        this.get_border(' .tb_oc_overlay', 'ctr_b', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_oc_overlay', 'ctr_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_oc_overlay', 'ctr_sh', 'h')
                    ]
                })
            ])
        ],
        burgerIcon = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_ov_co_icon_outer', 'bi_b_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_ov_co_icon_outer', 'bi_b_c_h', 'bg_c', 'background-color', 'hover')
                    ]
                })
            ]),
            // Color
            this.get_expand('c', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_ov_co_icon_outer', 'bi_c')
                    ],
                    h: [
                        this.get_color(' .tb_ov_co_icon_outer:hover', 'bi_c_h', null, null, 'h')
                    ]
                })
            ]),
            // Size
            this.get_expand('size', [
                this.get_width(' .tb_ov_co_icon', 'bi_w'),
                this.get_height(' .tb_ov_co_icon', 'bi_h')
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_ov_co_icon_outer', 'bi_b')
                    ],
                    h: [
                        this.get_border(' .tb_ov_co_icon', 'bi_b', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_ov_co_icon_outer', 'bi_p')
                    ],
                    h: [
                        this.get_padding(' .tb_ov_co_icon_outer', 'bi_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_ov_co_icon_outer', 'bi_m')
                    ],
                    h: [
                        this.get_margin(' .tb_ov_co_icon_outer', 'bi_m', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .tb_ov_co_icon_outer', 'bi_r_c')
                    ],
                    h: [
                        this.get_border_radius(' .tb_ov_co_icon_outer', 'bi_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_ov_co_icon_outer', 'bi_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_ov_co_icon_outer', 'bi_sh', 'h')
                    ]
                })
            ])
        ],
        closeIcon = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_ov_close', 'c_i_b_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_ov_close', 'c_i_b_c_h', 'bg_c', 'background-color', 'hover')
                    ]
                })
            ]),
            // Color
            this.get_expand('c', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_ov_close', 'c_i_c')
                    ],
                    h: [
                        this.get_color(' .tb_ov_close:hover', 'c_i_c_h', null, null, 'h')
                    ]
                })
            ]),
            // Size
            this.get_expand('size', [
                this.get_width(' .tb_ov_close_inner', 'c_i_w'),
                this.get_height(' .tb_ov_close_inner', 'c_i_h')
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_ov_close', 'c_i_p')
                    ],
                    h: [
                        this.get_padding(' .tb_ov_close', 'c_i_p', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .tb_ov_close', 'c_i_r_c')
                    ],
                    h: [
                        this.get_border_radius(' .tb_ov_close', 'c_i_r_c', 'h')
                    ]
                })
            ]),
            // Position
            this.get_expand('po', [
                this.get_css_position(' .tb_ov_close', 'c_i_css_p')
            ])
        ];
        return {
            type: 'tabs',
            options: {
                g: general,
                overlay: overlay,
                conter: container,
                bicon: burgerIcon,
                ovclsbtn: closeIcon
            }
        };
    }
}