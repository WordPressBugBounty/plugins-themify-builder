const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .post', 'background_color', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .post', 'bg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family([' .post-title', ' .post-title a']),
                        this.get_color([' .post', ' h1', ' h2', ' h3', ' h4', ' h5', ' h6', ' .post-title', ' .post-title a'], 'font_color'),
                        this.get_font_size(' .post'),
                        this.get_line_height(' .post'),
                        this.get_letter_spacing(' .post'),
                        this.get_text_align(' .post'),
                        this.get_text_transform(' .post'),
                        this.get_font_style(' .post'),
                        this.get_text_decoration(' .post', 'text_decoration_regular'),
                        this.get_text_shadow([' .post-title', ' .post-title a'])
                    ],
                    h: [
                        this.get_font_family([' .post-title', ' .post-title a'], 'f_f', 'h'),
                        this.get_color([':hover .post', ':hover h1', ':hover h2', ':hover h3', ':hover h4', ':hover h5', ':hover h6', ':hover .post-title', ':hover .post-title a'], 'f_c_h'),
                        this.get_font_size(' .post', 'f_s', '', 'h'),
                        this.get_font_style(' .post', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(' .post', 't_d_r', 'h'),
                        this.get_text_shadow([' .post-title', ' .post-title a'], 't_sh', 'h')
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
                        this.get_padding(' .post')
                    ],
                    h: [
                        this.get_padding(' .post', 'p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .post')
                    ],
                    h: [
                        this.get_margin(' .post', 'm', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .post')
                    ],
                    h: [
                        this.get_border(' .post', 'b', 'h')
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
                this.get_height('.post')
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
      //      this.get_expand('disp', this.get_self_align()),
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
        testimonialТitle = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family([' .post-title', ' .post-title a'], 'font_family_title'),
                    this.get_font_size(' .post-title', 'font_size_title'),
                    this.get_line_height(' .post-title', 'line_height_title'),
                    this.get_letter_spacing(' .post-title', 'letter_spacing_title'),
                    this.get_text_transform(' .post-title', 't_t_t'),
                    this.get_font_style(' .post-title', 'f_sy_t', 'f_b_t'),
                    this.get_text_shadow([' .post-title', ' .post-title a'], 't_sh_t')
                ],
                h: [
                    this.get_font_family([' .post-title', ' .post-title a'], 'f_f_t', 'h'),
                    this.get_color([' .post-title', ' .post-title a'], 'f_c_t', null, null, 'h'),
                    this.get_font_size(' .post-title', 'f_s_t', '', 'h'),
                    this.get_font_style(' .post-title', 'f_sy_t', 'f_b_t', 'h'),
                    this.get_text_shadow([' .post-title', ' .post-title a'], 't_sh_t', 'h')
                ]
            })
        ],
        testimonialContent = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family(' .testimonial-post .post-content', 'font_family_content'),
                    this.get_color(' .testimonial-post .post-content', 'font_color_content'),
                    this.get_font_size(' .testimonial-post .post-content', 'font_size_content'),
                    this.get_line_height(' .testimonial-post .post-content', 'line_height_content'),
                    this.get_text_shadow(' .testimonial-post .post-content', 't_sh_c')
                ],
                h: [
                    this.get_font_family(' .testimonial-post .post-content', 'f_f_c', 'f_f', 'h'),
                    this.get_color(' .testimonial-post .post-content', 'f_c_c', null, null, 'h'),
                    this.get_font_size(' .testimonial-post .post-content', 'f_s_c', '', 'h'),
                    this.get_text_shadow(' .testimonial-post .post-content', 't_sh_c', 'h')
                ]
            })
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                testimtit: testimonialТitle,
                testimcont: testimonialContent
            }
        };
    }
}