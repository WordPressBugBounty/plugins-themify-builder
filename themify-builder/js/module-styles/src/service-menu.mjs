const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color('', 'background_color', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color('', 'bg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb-image-content'),
                        this.get_color_type([' .tb-menu-title', ' .tb-menu-price', ' .tb-menu-description']),
                        this.get_font_size(' .tb-image-content'),
                        this.get_line_height(' .tb-image-content'),
                        this.get_letter_spacing(' .tb-image-content'),
                        this.get_text_align(' .tb-image-content'),
                        this.get_text_transform([' .tb-image-content', ' .tb-price-item .tb-price-title']),
                        this.get_font_style(' .tb-image-content'),
                        this.get_text_decoration(' .tb-image-content', 'text_decoration_regular'),
                        this.get_text_shadow(' .tb-image-content')
                    ],
                    h: [
                        this.get_font_family(' .tb-image-content', 'f_f', 'h'),
                        this.get_color_type([' .tb-menu-title', ' .tb-menu-price', ' .tb-menu-description'], 'h'),
                        this.get_font_size(' .tb-image-content', 'f_s', '', 'h'),
                        this.get_font_style(' .tb-image-content', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(' .tb-image-content', 't_d_r', 'h'),
                        this.get_text_shadow(' .tb-image-content', 't_sh', 'h')
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
        menuTitle = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family('.module .tb-menu-title', 'font_family_title'),
                    this.get_color('.module .tb-menu-title', 'font_color_title'),
                    this.get_font_size('.module .tb-menu-title', 'font_size_title'),
                    this.get_line_height('.module .tb-menu-title', 'line_height_title'),
                    this.get_letter_spacing('.module .tb-menu-title', 'letter_spacing_title'),
                    this.get_text_transform('.module .tb-menu-title', 'text_transform_title'),
                    this.get_font_style('.module .tb-menu-title', 'font_style_title'),
                    this.get_text_shadow('.module .tb-menu-title', 't_sh_t')
                ],
                h: [
                    this.get_font_family('.module .tb-menu-title', 'f_f_t', 'h'),
                    this.get_color('.module .tb-menu-title', 'f_c_t', null, null, 'h'),
                    this.get_font_size('.module .tb-menu-title', 'f_s_t', '', 'h'),
                    this.get_font_style('.module .tb-menu-title', 'f_st_t', '', 'h'),
                    this.get_text_shadow('.module .tb-menu-title', 't_sh_t', 'h')
                ]
            })
        ],
        image = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color('.module-service-menu .tb-image-wrap img', 'i_bg_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color('.module-service-menu .tb-image-wrap img', 'i_bg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding('.module-service-menu .tb-image-wrap img', 'i_p')
                    ],
                    h: [
                        this.get_padding('.module-service-menu .tb-image-wrap img', 'i_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('.module-service-menu .tb-image-wrap img', 'i_m')
                    ],
                    h: [
                        this.get_margin('.module-service-menu .tb-image-wrap img', 'i_m', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('.module-service-menu .tb-image-wrap img', 'i_b')
                    ],
                    h: [
                        this.get_border('.module-service-menu .tb-image-wrap img', 'i_b', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius('.module-service-menu .tb-image-wrap img', 'i_r_c')
                    ],
                    h: [
                        this.get_border_radius('.module-service-menu .tb-image-wrap img', 'i_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow('.module-service-menu .tb-image-wrap img', 'i_b_sh')
                    ],
                    h: [
                        this.get_box_shadow('.module-service-menu .tb-image-wrap img', 'i_b_sh', 'h')
                    ]
                })
            ])
        ],
        menuDescription = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family(' .tb-menu-description', 'font_family_description'),
                    this.get_color('.module .tb-menu-description', 'font_color_description'),
                    this.get_font_size(' .tb-menu-description', 'font_size_description'),
                    this.get_font_style(' .tb-menu-description', 'f_fs_m', 'f_fw_m'),
                    this.get_line_height(' .tb-menu-description', 'line_height_description'),
                    this.get_text_shadow(' .tb-menu-description', 't_sh_d')
                ],
                h: [
                    this.get_font_family(' .tb-menu-description', 'f_f_d', 'h'),
                    this.get_color('.module .tb-menu-description', 'f_c_d', null, null, 'h'),
                    this.get_font_size(' .tb-menu-description', 'f_s_d', '', 'h'),
                    this.get_font_style(' .tb-menu-description', 'f_fs_m', 'f_fw_m', 'h'),
                    this.get_text_shadow(' .tb-menu-description', 't_sh_d', 'h')
                ]
            })
        ],
        price = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family(' .tb-menu-price', 'font_family_price'),
                    this.get_color('.module .tb-menu-price', 'font_color_price'),
                    this.get_font_size(' .tb-menu-price', 'font_size_price'),
                    this.get_font_style(' .tb-menu-price', 'f_fs_p', 'f_fw_p'),
                    this.get_line_height(' .tb-menu-price', 'line_height_price'),
                    this.get_text_shadow(' .tb-menu-price', 't_sh_p'),
                    this.get_margin_top_bottom_opposity(' .tb-menu-price', '_margin_top_t_price', '_margin_bottom_b_price')
                ],
                h: [
                    this.get_font_family(' .tb-menu-price', 'f_f_p', 'h'),
                    this.get_color('.module .tb-menu-price', 'f_c_p', null, null, 'h'),
                    this.get_font_size(' .tb-menu-price', 'f_s_p', '', 'h'),
                    this.get_font_style(' .tb-menu-price', 'f_fs_p', 'f_fw_p', 'h'),
                    this.get_text_shadow(' .tb-menu-price', 't_sh_p', 'h'),
                    this.get_margin_top_bottom_opposity(' .tb-menu-price:hover', 'h_margin_top_t_p', 'h_margin_bottom_b_p')
                ]
            })
        ],
        highlightText = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb-highlight-text', 'background_color_highlight_text', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb-highlight-text', 'b_c_h_t', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb-highlight-text', 'font_family_highlight_text'),
                        this.get_color(' .tb-highlight-text', 'font_color_highlight_text'),
                        this.get_font_size(' .tb-highlight-text', 'font_size_highlight_text'),
                        this.get_font_style(' .tb-highlight-text', 'f_fs_h', 'f_fw_h'),
                        this.get_line_height(' .tb-highlight-text', 'line_height_highlight_text'),
                        this.get_text_shadow(' .tb-highlight-text', 't_sh_h_t')
                    ],
                    h: [
                        this.get_font_family(' .tb-highlight-text', 'f_f_h_t', 'h'),
                        this.get_color(' .tb-highlight-text', 'f_c_h_t', null, null, 'h'),
                        this.get_font_size(' .tb-highlight-text', 'f_s_h_t', '', 'h'),
                        this.get_font_style(' .tb-highlight-text', 'f_fs_h', 'f_fw_h', 'h'),
                        this.get_text_shadow(' .tb-highlight-text', 't_sh_h_t', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb-highlight-text', 'h_t_p')
                    ],
                    h: [
                        this.get_padding(' .tb-highlight-text', 'h_t_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb-highlight-text', 'h_t_m')
                    ],
                    h: [
                        this.get_margin(' .tb-highlight-text', 'h_t_m', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                menut: menuTitle,
                image: image,
                desc: menuDescription,
                price: price,
                highlgtxt: highlightText
            }
        };
    }
}