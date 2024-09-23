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
                        this.get_color(' .post', 'bg_c', 'bg_c', 'background-color', null, 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(['.module .post-title', '.module .post-title a']),
                        this.get_color([' .post', '.module h1', '.module h2', '.module h3', '.module h4', '.module h5', '.module h6', '.module .post-title', '.module .post-title a'], 'font_color'),
                        this.get_font_size(' .post'),
                        this.get_line_height(' .post'),
                        this.get_letter_spacing(' .post'),
                        this.get_text_align(' .post'),
                        this.get_text_transform(' .post'),
                        this.get_font_style(' .post'),
                        this.get_text_decoration(' .post', 'text_decoration_regular'),
                        this.get_text_shadow(['.module .post-title', '.module .post-title a'])
                    ],
                    h: [
                        this.get_font_family(['.module .post-title', '.module .post-title a'], 'f_f', 'h'),
                        this.get_color([':hover .post', '.module:hover h1', '.module:hover h2', '.module:hover h3', '.module:hover h4', '.module:hover h5', '.module:hover h6', '.module:hover .post-title', '.module:hover .post-title a'], 'f_c_h'),
                        this.get_font_size(' .post', 'f_s', '', 'h'),
                        this.get_font_style(' .post', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(' .post', 't_d_r', 'h'),
                        this.get_text_shadow(['.module .post-title', '.module .post-title a'], 't_sh', 'h')
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
                        this.get_margin('')
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
            this.get_expand('zi', [
                    this.get_zindex('', 'custom_parallax_scroll_zindex')
                ]
            ),
           // this.get_expand('disp', this.get_self_align()),
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
        portfolioContainer = [
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
                        this.get_margin_top_bottom_opposity(' .post', 'article_margin_top', 'article_margin_bottom')
                    ],
                    h: [
                        this.get_margin_top_bottom_opposity(' .post:hover', 'a_h_margin_top', 'a_h_margin_bottom')
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
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .post', 'r_c_cn')
                    ],
                    h: [
                        this.get_border_radius(' .post', 'r_c_cn', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .post', 'sh_cn')
                    ],
                    h: [
                        this.get_box_shadow(' .post', 'sh_cn', 'h')
                    ]
                })
            ])
        ],
        portfolioTitle = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family(['.module .post-title', '.module .post-title a'], 'font_family_title'),
                    this.get_color(['.module .post-title', '.module .post-title a'], 'font_color_title'),
                    this.get_font_size('.module .post-title', 'font_size_title'),
                    this.get_line_height('.module .post-title', 'line_height_title'),
                    this.get_letter_spacing('.module .post-title', 'letter_spacing_title'),
                    this.get_text_transform('.module .post-title', 't_t_title'),
                    this.get_font_style('.module .post-title', 'f_sy_t', 'f_b_t'),
                    this.get_text_shadow(['.module .post-title', '.module .post-title a'], 't_sh_t')
                ],
                h: [
                    this.get_font_family(['.module .post-title', '.module .post-title a'], 'f_f_t', 'h'),
                    this.get_color(['.module .post-title', '.module .post-title a'], 'font_color_title', null, null, 'hover'),
                    this.get_font_size('.module .post-title', 'f_s_t', '', 'h'),
                    this.get_font_style('.module .post-title', 'f_sy_t', 'f_b_t', 'f_w_t', 'h'),
                    this.get_text_shadow(['.module .post-title', '.module .post-title a'], 't_sh_t', 'h')
                ]
            }),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding('.module .post-title', 'p_t')
                    ],
                    h: [
                        this.get_padding('.module .post-title', 'p_t', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('.module .post-title', 'm_t')
                    ],
                    h: [
                        this.get_margin('.module .post-title', 'm_t', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('.module .post-title', 'b_t')
                    ],
                    h: [
                        this.get_border('.module .post-title', 'b_t', 'h')
                    ]
                })
            ])
        ],
        portfolioMeta = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family([' .post-content .post-meta', ' .post-content .post-meta a'], 'font_family_meta'),
                    this.get_color([' .post-content .post-meta', ' .post-content .post-meta a'], 'font_color_meta'),
                    this.get_font_size(' .post-content .post-meta', 'font_size_meta'),
                    this.get_line_height(' .post-content .post-meta', 'line_height_meta'),
                    this.get_text_shadow([' .post-content .post-meta', ' .post-content .post-meta a'], 't_sh_m')
                ],
                h: [
                    this.get_font_family([' .post-content .post-meta', ' .post-content .post-meta a'], 'f_f_m', 'h'),
                    this.get_color([' .post-content .post-meta', ' .post-content .post-meta a'], 'f_c_m', null, null, 'h'),
                    this.get_font_size(' .post-content .post-meta', 'f_s_m', '', 'h'),
                    this.get_text_shadow([' .post-content .post-meta', ' .post-content .post-meta a'], 't_sh_m', 'h')
                ]
            })
        ],
        portfolioDate = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family([' .post .post-date', ' .post .post-date a'], 'font_family_date'),
                    this.get_color([' .post .post-date', ' .post .post-date a'], 'font_color_date'),
                    this.get_font_size(' .post .post-date', 'font_size_date'),
                    this.get_line_height(' .post .post-date', 'line_height_date'),
                    this.get_text_shadow([' .post .post-date', ' .post .post-date a'], 't_sh_d')
                ],
                h: [
                    this.get_font_family([' .post .post-date', ' .post .post-date a'], 'f_f_d', 'h'),
                    this.get_color([' .post .post-date', ' .post .post-date a'], 'font_color_date', null, null, 'hover'),
                    this.get_font_size(' .post .post-date', 'f_s_d', '', 'h'),
                    this.get_text_shadow([' .post .post-date', ' .post .post-date a'], 't_sh_d', 'h')
                ]
            }),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .post .post-date', 'p_d')
                    ],
                    h: [
                        this.get_padding(' .post .post-date', 'p_d', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .post .post-date', 'm_d')
                    ],
                    h: [
                        this.get_margin(' .post .post-date', 'm_d', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .post .post-date', 'b_d')
                    ],
                    h: [
                        this.get_border(' .post .post-date', 'b_d', 'h')
                    ]
                })
            ])
        ],
        portfolioContent = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family(' .post-content .entry-content', 'font_family_content'),
                    this.get_color(' .post-content .entry-content', 'font_color_content'),
                    this.get_font_size(' .post-content .entry-content', 'font_size_content'),
                    this.get_line_height(' .post-content .entry-content', 'line_height_content'),
                    this.get_text_align(' .post-content .entry-content', 't_a_c'),
                    this.get_text_shadow(' .post-content .entry-content', 't_sh_c')
                ],
                h: [
                    this.get_font_family(' .post-content .entry-content', 'f_f_c', 'f_f', 'h'),
                    this.get_color(' .post-content .entry-content', 'f_c_c', null, null, 'h'),
                    this.get_font_size(' .post-content .entry-content', 'f_s_c', '', 'h'),
                    this.get_text_shadow(' .post-content .entry-content', 't_sh_c', 'h')
                ]
            })
        ],
        featuredImage = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .post-image', 'b_c_f_i', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .post-image', 'b_c_f_i', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .post-image', 'p_f_i')
                    ],
                    h: [
                        this.get_padding(' .post-image', 'p_f_i', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .post-image', 'm_f_i')
                    ],
                    h: [
                        this.get_margin(' .post-image', 'm_f_i', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .post-image', 'b_f_i')
                    ],
                    h: [
                        this.get_border(' .post-image', 'b_f_i', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius([' .post-image', ' .post-image img'], 'f_i_r_c')
                    ],
                    h: [
                        this.get_border_radius([' .post-image', ' .post-image img'], 'f_i_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .post-image', 'f_i_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .post-image', 'f_i_sh', 'h')
                    ]
                })
            ])
        ],
        readMore = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .more-link', 'b_c_r_m', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .more-link', 'b_c_r_m', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .more-link', 'f_f_g'),
                        this.get_color('.module .more-link', 'f_c_r_m'),
                        this.get_font_size(' .more-link', 'f_s_r_m'),
                        this.get_line_height(' .more-link', 'l_h_r_m'),
                        this.get_letter_spacing(' .more-link', 'l_s_r_m'),
                        this.get_text_align(' .more-link', 't_a_r_m'),
                        this.get_text_transform(' .more-link', 't_t_r_m'),
                        this.get_font_style(' .more-link', 'f_st_r_m', 'f_b_r_m'),
                        this.get_text_shadow(' .more-link', 't_sh_r_m')
                    ],
                    h: [
                        this.get_font_family(' .more-link', 'f_f_g', 'h'),
                        this.get_color('.module .more-link:hover', 'f_c_r_m_h', 'h'),
                        this.get_font_size(' .more-link', 'f_s_r_m', '', 'h'),
                        this.get_font_style(' .more-link', 'f_st_r_m', 'f_b_r_m', 'h'),
                        this.get_text_shadow(' .more-link', 't_sh_r_m', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .more-link', 'r_m_p')
                    ],
                    h: [
                        this.get_padding(' .more-link', 'r_m_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .more-link', 'r_m_m')
                    ],
                    h: [
                        this.get_margin(' .more-link', 'r_m_m', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .more-link', 'r_m_b')
                    ],
                    h: [
                        this.get_border(' .more-link', 'r_m_b', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .more-link', 'r_c_r_m')
                    ],
                    h: [
                        this.get_border_radius(' .more-link', 'r_c_r_m', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .more-link', 'sh_r_m')
                    ],
                    h: [
                        this.get_box_shadow(' .more-link', 'sh_r_m', 'h')
                    ]
                })
            ])
        ],
        pgContainer = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .pagenav', 'b_c_pg_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .pagenav', 'b_c_pg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .pagenav', 'f_f_pg_c'),
                        this.get_color(' .pagenav', 'f_c_pg_c'),
                        this.get_font_size(' .pagenav', 'f_s_pg_c'),
                        this.get_line_height(' .pagenav', 'l_h_pg_c'),
                        this.get_letter_spacing(' .pagenav', 'l_s_pg_c'),
                        this.get_text_align(' .pagenav', 't_a_pg_c'),
                        this.get_font_style(' .pagenav', 'f_st_pg_c', 'f_b_pg_c')
                    ],
                    h: [
                        this.get_font_family(' .pagenav', 'f_f_pg_c', 'h'),
                        this.get_color(' .pagenav', 'f_c_pg_c', 'h'),
                        this.get_font_size(' .pagenav', 'f_s_pg_c', '', 'h'),
                        this.get_font_style(' .pagenav', 'f_st_pg_c', 'f_b_pg_c', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .pagenav', 'p_pg_c')
                    ],
                    h: [
                        this.get_padding(' .pagenav', 'p_pg_c', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .pagenav', 'm_pg_c')
                    ],
                    h: [
                        this.get_margin(' .pagenav', 'm_pg_c', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .pagenav', 'b_pg_c')
                    ],
                    h: [
                        this.get_border(' .pagenav', 'b_pg_c', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .pagenav', 'r_c_pg_c')
                    ],
                    h: [
                        this.get_border_radius(' .pagenav', 'r_c_pg_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .pagenav', 'sh_pg_c')
                    ],
                    h: [
                        this.get_box_shadow(' .pagenav', 'sh_pg_c', 'h')
                    ]
                })
            ])
        ],
        pgNumbers = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .pagenav a', 'b_c_pg_n', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .pagenav a', 'b_c_pg_n', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .pagenav a', 'f_f_pg_n'),
                        this.get_color(' .pagenav a', 'f_c_pg_n'),
                        this.get_font_size(' .pagenav a', 'f_s_pg_n'),
                        this.get_line_height(' .pagenav a', 'l_h_pg_n'),
                        this.get_letter_spacing(' .pagenav a', 'l_s_pg_n'),
                        this.get_font_style(' .pagenav a', 'f_st_pg_n', 'f_b_pg_n')
                    ],
                    h: [
                        this.get_font_family(' .pagenav a', 'f_f_pg_n', 'h'),
                        this.get_color(' .pagenav a:hover', 'f_c_pg_n_h', null, null, ''),
                        this.get_font_size(' .pagenav a', 'f_s_pg_n', '', 'h'),
                        this.get_font_style(' .pagenav a', 'f_st_pg_n', 'f_b_pg_n', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .pagenav a', 'p_pg_n')
                    ],
                    h: [
                        this.get_padding(' .pagenav a', 'p_pg_n', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .pagenav a', 'm_pg_n')
                    ],
                    h: [
                        this.get_margin(' .pagenav a', 'm_pg_n', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .pagenav a', 'b_pg_n')
                    ],
                    h: [
                        this.get_border(' .pagenav a', 'b_pg_n', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .pagenav a', 'r_c_pg_n')
                    ],
                    h: [
                        this.get_border_radius(' .pagenav a', 'r_c_pg_n', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .pagenav a', 'sh_pg_n')
                    ],
                    h: [
                        this.get_box_shadow(' .pagenav a', 'sh_pg_n', 'h')
                    ]
                })
            ])
        ],
        pgActiveNumbers = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .pagenav .current', 'b_c_pg_a_n', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .pagenav .current', 'b_c_pg_a_n', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .pagenav .current', 'f_f_pg_a_n'),
                        this.get_color(' .pagenav .current', 'f_c_pg_a_n'),
                        this.get_font_size(' .pagenav .current', 'f_s_pg_a_n'),
                        this.get_line_height(' .pagenav .current', 'l_h_pg_a_n'),
                        this.get_letter_spacing(' .pagenav .current', 'l_s_pg_a_n'),
                        this.get_font_style(' .pagenav .current', 'f_st_pg_a_n', 'f_b_pg_a_n')
                    ],
                    h: [
                        this.get_font_family(' .pagenav .current', 'f_f_pg_a_n', 'h'),
                        this.get_color(' .pagenav .current', 'f_c_pg_a_n', 'h'),
                        this.get_font_size(' .pagenav .current', 'f_s_pg_a_n', '', 'h'),
                        this.get_font_style(' .pagenav .current', 'f_st_pg_a_n', 'f_b_pg_a_n', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .pagenav .current', 'p_pg_a_n')
                    ],
                    h: [
                        this.get_padding(' .pagenav .current', 'p_pg_a_n', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .pagenav .current', 'm_pg_a_n')
                    ],
                    h: [
                        this.get_margin(' .pagenav .current', 'm_pg_a_n', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .pagenav .current', 'b_pg_a_n')
                    ],
                    h: [
                        this.get_border(' .pagenav .current', 'b_pg_a_n', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .pagenav .current', 'r_c_pg_a_n')
                    ],
                    h: [
                        this.get_border_radius(' .pagenav .current', 'r_c_pg_a_n', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .pagenav .current', 'sh_pg_a_n')
                    ],
                    h: [
                        this.get_box_shadow(' .pagenav .current', 'sh_pg_a_n', 'h')
                    ]
                })
            ])
        ],
        ptFilter = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .post-filter li a', 'b_c_pt_f', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .post-filter li a', 'b_c_pt_f', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .post-filter li a', 'f_f_pt_f'),
                        this.get_color(' .post-filter li a', 'f_c_pt_f'),
                        this.get_font_size(' .post-filter li a', 'f_s_pt_f'),
                        this.get_line_height(' .post-filter li a', 'l_h_pt_f'),
                        this.get_letter_spacing(' .post-filter li a', 'l_s_pt_f'),
                        this.get_font_style(' .post-filter li a', 'f_st_pt_f', 'f_b_pt_f'),
                        this.get_text_align(' .post-filter', 't_a_pt_f'),
                        this.get_text_shadow(' .post-filter li a', 't_sh_pt_f')
                    ],
                    h: [
                        this.get_font_family(' .post-filter li a', 'f_f_pt_f', 'h'),
                        this.get_color(' .post-filter li a:hover', 'f_c_pt_f_h', null, null, 'h'),
                        this.get_font_size(' .post-filter li a', 'f_s_pt_f', '', 'h'),
                        this.get_font_style(' .post-filter li a', 'f_st_pt_f', 'f_b_pt_f', 'h'),
                        this.get_text_shadow(' .post-filter li a', 't_sh_pt_f', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .post-filter li a', 'p_pt_f')
                    ],
                    h: [
                        this.get_padding(' .post-filter li a', 'p_pt_f', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .post-filter li a', 'm_pt_f')
                    ],
                    h: [
                        this.get_margin(' .post-filter li a', 'm_pt_f', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .post-filter li a', 'b_pt_f')
                    ],
                    h: [
                        this.get_border(' .post-filter li a', 'b_pt_f', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .post-filter li a', 'r_c_pt_f')
                    ],
                    h: [
                        this.get_border_radius(' .post-filter li a', 'r_c_pt_f', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .post-filter li a', 'sh_pt_f')
                    ],
                    h: [
                        this.get_box_shadow(' .post-filter li a', 'sh_pt_f', 'h')
                    ]
                })
            ])
        ],
        ptaFilter = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .post-filter li.active a', 'b_c_pta_f', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .post-filter li.active a', 'b_c_pta_f', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .post-filter li.active a', 'f_f_pta_f'),
                        this.get_color(' .post-filter li.active a', 'f_c_pta_f'),
                        this.get_font_size(' .post-filter li.active a', 'f_s_pta_f'),
                        this.get_line_height(' .post-filter li.active a', 'l_h_pta_f'),
                        this.get_letter_spacing(' .post-filter li.active a', 'l_s_pta_f'),
                        this.get_font_style(' .post-filter li.active a', 'f_st_pta_f', 'f_b_pta_f'),
                        this.get_text_shadow(' .post-filter li.active a', 't_sh_pta_f')
                    ],
                    h: [
                        this.get_font_family(' .post-filter li.active a', 'f_f_pta_f', 'h'),
                        this.get_color(' .post-filter li.active a:hover', 'f_c_pta_f_h', null, null, 'h'),
                        this.get_font_size(' .post-filter li.active a', 'f_s_pta_f', '', 'h'),
                        this.get_font_style(' .post-filter li.active a', 'f_st_pta_f', 'f_b_pta_f', 'h'),
                        this.get_text_shadow(' .post-filter li.active a', 't_sh_pta_f', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                conter: portfolioContainer,
                title: portfolioTitle,
                fimg: featuredImage,
                meta: portfolioMeta,
                date: portfolioDate,
                content: portfolioContent,
                rmore: readMore,
                pagincont: pgContainer,
                paginnum: pgNumbers,
                paginactiv: pgActiveNumbers,
                postf: ptFilter,
                postfact: ptaFilter
            }
        };
    }
}