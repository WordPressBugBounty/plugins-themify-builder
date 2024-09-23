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
                        this.get_color_type([' .themify_image_title', ' .themify_image_caption', ' .gallery-showcase-title-text']),
                        this.get_font_size(),
                        this.get_line_height(' .gallery-caption'),
                        this.get_letter_spacing(),
                        this.get_text_align(' .gallery-caption'),
                        this.get_text_transform(),
                        this.get_font_style(),
                        this.get_text_decoration(' .gallery-caption', 'text_decoration_regular'),
                        this.get_text_shadow()
                    ],
                    h: [
                        this.get_font_family('', 'f_f', 'h'),
                        this.get_color_type([':hover .themify_image_title', ':hover .themify_image_caption', ':hover .gallery-showcase-title-text'], '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size('', 'f_s', '', 'h'),
                        this.get_font_style('', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(' .gallery-caption', 't_d_r', 'h'),
                        this.get_text_shadow('', 't_sh', 'h')
                    ]
                })
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color(' a', 'link_color'),
                        this.get_text_decoration(' a')
                    ],
                    h: [
                        this.get_color(' a', 'link_color', null, null, 'hover'),
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
        image = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color('.module-gallery .gallery-icon img', 'g_i_bg_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color('.module-gallery .gallery-icon img', 'g_i_bg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Gutter
            this.get_expand('i_g', [
                this.get_gap(' .module-gallery-grid', 'gr_ga_c','--galg', '', {'%':'',px:{max: 1000}}, 'hgap', 15),
                this.get_gap(' .module-gallery-grid', 'gr_ga_r','--galh', '', {em:{max: 50},px:{max: 1000}}, 'vgap', 15)
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding('.module-gallery .gallery-icon img', 'g_i_p')
                    ],
                    h: [
                        this.get_padding('.module-gallery .gallery-icon img', 'g_i_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('.module-gallery .gallery-icon img', 'g_i_m')
                    ],
                    h: [
                        this.get_margin('.module-gallery .gallery-icon img', 'g_i_m', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('.module-gallery .gallery-icon img', 'g_i_b')
                    ],
                    h: [
                        this.get_border('.module-gallery .gallery-icon img', 'g_i_b', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius('.module-gallery .gallery-icon img', 'g_i_r_c')
                    ],
                    h: [
                        this.get_border_radius('.module-gallery .gallery-icon img', 'g_i_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow('.module-gallery .gallery-icon img', 'g_i_b_sh')
                    ],
                    h: [
                        this.get_box_shadow('.module-gallery .gallery-icon img', 'g_i_b_sh', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                glimg: image
            }
        };
    }
}