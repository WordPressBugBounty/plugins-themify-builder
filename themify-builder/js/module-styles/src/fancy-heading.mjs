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
        heading = [
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('.module .main-head'),
                        this.get_color_type(['.module .main-head', '.module .main-head a']),
                        this.get_font_size('.module .main-head'),
                        this.get_line_height('.module .main-head'),
                        this.get_letter_spacing('.module .main-head'),
                        this.get_text_transform('.module .main-head', 'text_transform_maintitle'),
                        this.get_font_style('.module .main-head', 'font_style_maintitle'),
                        this.get_text_shadow('.module .main-head', 't_sh_h'),
                        // Main Heading Margin
                        this.get_margin_top_bottom_opposity('.module .main-head', 'main_margin_top', 'main_margin_bottom')
                    ],
                    h: [
                        this.get_font_family('.module:hover .main-head', 'f_f_h'),
                        this.get_color_type(['.module:hover .main-head', '.module:hover .main-head a'], '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size('.module:hover .main-head', 'f_s_h'),
                        this.get_font_style('.module:hover .main-head', 'f_st_m_h', 'f_w_h'),
                        this.get_text_shadow('.module:hover .main-head', 't_sh_h_h'),
                        // Main Heading Margin
                        this.get_margin_top_bottom_opposity(':hover .main-head', 'm_h_margin_top', 'm_h_margin_bottom')
                    ]
                })
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color(['.module .main-head a'], 'l_c_mh'),
                        this.get_text_decoration('.module .main-head a', 't_d_mh')
                    ],
                    h: [
                        this.get_color(['.module .main-head a:hover'], 'l_c_mh_h', null, null, ''),
                        this.get_text_decoration('.module .main-head a:hover', 't_d_mh_h', 'h')
                    ]
                })
            ])
        ],
        subheading = [
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('.module .sub-head', 'font_family_subheading'),
                        this.get_color_type(['.module .sub-head', '.module .sub-head a'], '', 'font_color_type_subheading', 'font_color_subheading', 'font_gradient_color_subheading'),
                        this.get_font_size('.module .sub-head', 'font_size_subheading'),
                        this.get_line_height('.module .sub-head', 'line_height_subheading'),
                        this.get_letter_spacing('.module .sub-head', 'letter_spacing_subheading'),
                        this.get_text_transform('.module .sub-head', 'text_transform_subtitle'),
                        this.get_font_style('.module .sub-head', 'font_style_subtitle'),
                        this.get_text_shadow('.module .sub-head', 't_sh_s_h'),
                        // Sub Heading Margin
                        this.get_margin_top_bottom_opposity(' .sub-head', 'sub_margin_top', 'sub_margin_bottom')
                    ],
                    h: [
                        this.get_font_family('.module:hover .sub-head', 'f_f_s_h'),
                        this.get_color_type(['.module:hover .sub-head', '.module:hover .sub-head a'], '', 'f_c_t_s_h', 'f_c_s_h', 'f_g_c_s_h'),
                        this.get_font_size('.module:hover .sub-head', 'f_s_s_h'),
                        this.get_font_style('.module:hover .sub-head', 'f_st_s_h'),
                        this.get_text_shadow('.module:hover .sub-head', 't_sh_s_h_h'),
                        // Sub Heading Margin
                        this.get_margin_top_bottom_opposity(':hover .sub-head', 's_h_margin_top', 's_h_margin_bottom')
                    ]
                })
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color(['.module .sub-head a'], 'l_c_sh'),
                        this.get_text_decoration('.module .sub-head a', 't_d_sh')
                    ],
                    h: [
                        this.get_color(['.module .sub-head a:hover'], 'l_c_sh_h', null, null, ''),
                        this.get_text_decoration('.module .sub-head a:hover', 't_d_sh_h', 'h')
                    ]
                })
            ])
        ],
        fhDivider = [
            // Divider Top/Bottom Margin
            this.get_expand('m', [
                this.get_margin(['.module .sub-head::before', '.module .sub-head::after'], 'md')
            ]),
            // Divider Border
            this.get_expand('b', [
                this.get_border(['.module .sub-head::before', '.module .sub-head::after'], 'd_border')
            ]),
            // Divider Width
            this.get_expand('w', [
                this.get_width(['.module .sub-head::before', '.module .sub-head::after'], 'd_width')
            ])
        ],
        fhDvdrIcon = [
            // Divider Icon Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(['.module .tb_fancy_heading_icon em', '.module .tb_fancy_heading_icon img'], 'fh_d_i_bg', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(['.module:hover .tb_fancy_heading_icon em', '.module:hover .tb_fancy_heading_icon img'], 'fh_d_i_bg', 'bg_c', 'background-color', 'hover')
                    ]
                })
            ]),
            // Divider Icon Color
            this.get_expand('c', [
                this.get_tab({
                    n: [
                        this.get_color(['.module .tb_fancy_heading_icon em', '.module .tb_fancy_heading_icon img'], 'fh_d_i_c')
                    ],
                    h: [
                        this.get_color(['.module:hover .tb_fancy_heading_icon em', '.module:hover .tb_fancy_heading_icon img'], 'fh_d_i_c', null, null, 'hover')
                    ]
                })
            ]),
            // Divider Icon Font Size
            this.get_expand('size', [
                this.get_tab({
                    n: [
                        this.get_font_size(['.module .tb_fancy_heading_icon em', '.module .tb_fancy_heading_icon img'], 'fh_d_s')
                    ],
                    h: [
                        this.get_font_size(['.module:hover .tb_fancy_heading_icon em', '.module:hover .tb_fancy_heading_icon img'], 'fh_d_s', '', 'h')
                    ]
                })
            ]),
            // Divider Icon Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(['.module .tb_fancy_heading_icon em', '.module .tb_fancy_heading_icon img'], 'fh_d_i_p')
                    ],
                    h: [
                        this.get_padding(['.module:hover .tb_fancy_heading_icon em', '.module:hover .tb_fancy_heading_icon img'], 'fh_d_i_p_h')
                    ]
                })
            ]),
            // Divider Icon Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(['.module .tb_fancy_heading_icon', '.module .tb_fancy_heading_icon img'], 'fh_d_i_m')
                    ],
                    h: [
                        this.get_margin(['.module:hover .tb_fancy_heading_icon', '.module:hover .tb_fancy_heading_icon img'], 'fh_d_i_m_h')
                    ]
                })
            ]),
            // Divider Icon Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(['.module .tb_fancy_heading_icon em', '.module .tb_fancy_heading_icon img'], 'fh_d_i_b')
                    ],
                    h: [
                        this.get_border(['.module:hover .tb_fancy_heading_icon em', '.module:hover .tb_fancy_heading_icon img'], 'fh_d_i_b_h')
                    ]
                })
            ]),
            // Divider Icon Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(['.module .tb_fancy_heading_icon em', '.module .tb_fancy_heading_icon img'], 'fh_d_i_rc')
                    ],
                    h: [
                        this.get_border_radius(['.module:hover .tb_fancy_heading_icon em', '.module:hover .tb_fancy_heading_icon img'], 'fh_d_i_rc_h')
                    ]
                })
            ])
        ],
        fhDvdrBorder = [
            // Divider Border Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('.module-fancy-heading .tb_fancy_heading_border:before', 'fh_d_b_m')
                    ],
                    h: [
                        this.get_margin('.module:hover .tb_fancy_heading_border:before', 'fh_d_b_m_h')
                    ]
                })
            ]),
            // Divider Border Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('.module-fancy-heading .tb_fancy_heading_border:before', 'fh_d_b_b')
                    ],
                    h: [
                        this.get_border('.module:hover .tb_fancy_heading_border:before', 'fh_d_b_b_h')
                    ]
                })
            ]),
            // Divider Border Width
            this.get_expand('w', [
                this.get_width('.module-fancy-heading .tb_fancy_heading_border', 'fh_d_b_w')
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                head: heading,
                shead: subheading,
                div: fhDivider,
                divicon: fhDvdrIcon,
                diviconb: fhDvdrBorder
            }
        };
    }
}