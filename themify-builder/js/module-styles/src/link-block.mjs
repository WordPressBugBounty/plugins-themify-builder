const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image(' .tb_link_block_container')
                    ],
                    h: [
                        this.get_image(' .tb_link_block_container', 'b_i', 'bg_c', 'b_r', 'b_p', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb_link_block_container'),
                        this.get_color(' .tb_link_block_container', 'f_c_g'),
                        this.get_font_size(' .tb_link_block_container'),
                        this.get_line_height(' .tb_link_block_container'),
                        this.get_letter_spacing(' .tb_link_block_container'),
                        this.get_text_align(' .tb_link_block_container'),
                        this.get_text_transform(' .tb_link_block_container'),
                        this.get_font_style(' .tb_link_block_container'),
                        this.get_text_decoration(' .tb_link_block_container', 't_d_r'),
                        this.get_text_shadow(' .tb_link_block_container')
                    ],
                    h: [
                        this.get_font_family(' .tb_link_block_container', 'f_f', 'h'),
                        this.get_color(' .tb_link_block_container:hover', 'f_c_g_h', null, null, ''),
                        this.get_font_size(' .tb_link_block_container', 'f_s', '', 'h'),
                        this.get_font_style(' .tb_link_block_container', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(' .tb_link_block_container', 't_d_r', 'h'),
                        this.get_text_shadow(' .tb_link_block_container', 't_sh', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_link_block_container ')
                    ],
                    h: [
                        this.get_padding(' .tb_link_block_container', 'p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_link_block_container')
                    ],
                    h: [
                        this.get_margin(' .tb_link_block_container', 'm', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_link_block_container')
                    ],
                    h: [
                        this.get_border(' .tb_link_block_container', 'b', 'h')
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
                        this.get_border_radius(' .tb_link_block_container')
                    ],
                    h: [
                        this.get_border_radius(' .tb_link_block_container', 'r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_link_block_container')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_link_block_container', 'sh', 'h')
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
        heading = [
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb_link_block_heading', 'f_f_l_h'),
                        this.get_color(' .tb_link_block_heading', 'f_c_l_h'),
                        this.get_font_size(' .tb_link_block_heading', 'f_s_l_h'),
                        this.get_line_height(' .tb_link_block_heading', 'l_h_l_h'),
                        this.get_letter_spacing(' .tb_link_block_heading', 'l_s_l_h'),
                        this.get_text_transform(' .tb_link_block_heading', 't_t_l_h'),
                        this.get_font_style(' .tb_link_block_heading', 'f_st_l_h', 'f_b_l_h'),
                        this.get_text_shadow(' .tb_link_block_heading', 't_sh_l_h')
                    ],
                    h: [
                        this.get_font_family(' .tb_link_block_heading', 'f_f_l_h', 'h'),
                        this.get_color('.module .tb_link_block_heading', 'f_c_l_h', null, null, 'hover'),
                        this.get_font_size(' .tb_link_block_heading', 'f_s_l_h', '', 'h'),
                        this.get_font_style(' .tb_link_block_heading', 'f_st_l_h', 'f_b_l_h', 'h'),
                        this.get_text_shadow(' .tb_link_block_heading', 't_sh_l_h', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_link_block_heading', 'm_l_h')
                    ],
                    h: [
                        this.get_margin(' .tb_link_block_heading', 'm_l_h', 'h')
                    ]
                })
            ])
        ],
        icon = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_link_block_icon', 'b_c_i', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_link_block_icon', 'b_c_i', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Color
            this.get_expand('c', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_link_block_icon', 'f_c_i')
                    ],
                    h: [
                        this.get_color(' .tb_link_block_icon', 'f_c_i', null, null, 'hover')
                    ]
                })
            ]),
            // Font Size
            this.get_expand('size', [
                this.get_tab({
                    n: [
                        this.get_font_size(' .tb_link_block_icon', 'f_s_i')
                    ],
                    h: [
                        this.get_font_size(' .tb_link_block_icon', 'f_s_i', '', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_link_block_icon', 'p_i')
                    ],
                    h: [
                        this.get_padding(' .tb_link_block_icon', 'p_i', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_link_block_icon', 'm_i')
                    ],
                    h: [
                        this.get_margin(' .tb_link_block_icon', 'm_i', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_link_block_icon', 'b_i')
                    ],
                    h: [
                        this.get_border(' .tb_link_block_icon', 'b_i', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .tb_link_block_icon', 'r_c_i')
                    ],
                    h: [
                        this.get_border_radius(' .tb_link_block_icon', 'r_c_i', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_link_block_icon', 'sh_i')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_link_block_icon', 'sh_i', 'h')
                    ]
                })
            ])
        ],
        linkImage = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_link_block_img', 'b_c_li', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_link_block_img', 'b_c_li', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_link_block_img', 'p_li')
                    ],
                    h: [
                        this.get_padding(' .tb_link_block_img', 'p_li', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_link_block_img', 'm_li')
                    ],
                    h: [
                        this.get_margin(' .tb_link_block_img', 'm_li', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_link_block_img', 'b_li')
                    ],
                    h: [
                        this.get_border(' .tb_link_block_img', 'b_li', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .tb_link_block_img', 'r_c_li')
                    ],
                    h: [
                        this.get_border_radius(' .tb_link_block_img', 'r_c_li', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_link_block_img', 'sh_li')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_link_block_img', 'sh_li', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                head: heading,
                icon: icon,
                image: linkImage
            }
        };
    }
}