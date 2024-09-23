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
                        this.get_font_family(),
                        this.get_color_type([' .tb_text_wrap', '.module .testimonial-title', ' .person-name', ' .person-position', ' .person-company', ' .person-company a']),
                        this.get_font_size([' .post', ' .testimonial-title', ' .testimonial-entry-content', ' .testimonial-author .person-name', ' .testimonial-author .person-position', ' .testimonial-author .person-company']),
                        this.get_line_height(' .post'),
                        this.get_letter_spacing(' .post'),
                        this.get_text_align(' .post'),
                        this.get_text_transform(' .post'),
                        this.get_font_style(),
                        this.get_text_decoration('', 'text_decoration_regular'),
                        this.get_text_shadow()
                    ],
                    h: [
                        this.get_font_family('', 'f_f', 'h'),
                        this.get_color_type([':hover .tb_text_wrap', '.module:hover .testimonial-title', ':hover .person-name', ':hover .person-position', ':hover .person-company', ':hover .person-company a'], '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size([' .post', ' .testimonial-title', ' .testimonial-entry-content', ' .testimonial-author .person-name', ' .testimonial-author .person-position', ' .testimonial-author .person-company'], 'f_s', 'h'),
                        this.get_font_style('', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration('', 't_d_r', 'h'),
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
        testimonialTitle = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family('.module .testimonial-title', 'font_family_title'),
                    this.get_color('.module .testimonial-title', 'font_color_title'),
                    this.get_font_size('.module .testimonial-title', 'font_size_title'),
                    this.get_line_height('.module .testimonial-title', 'line_height_title'),
                    this.get_letter_spacing('.module .testimonial-title', 'letter_spacing_title'),
                    this.get_text_transform('.module .testimonial-title', 'text_transform_title'),
                    this.get_font_style('.module .testimonial-title', 'font_style_title', 'font_title_bold'),
                    this.get_text_shadow('.module .testimonial-title', 't_sh_t')
                ],
                h: [
                    this.get_font_family('.module .testimonial-title', 'f_f_t', 'h'),
                    this.get_color('.module .testimonial-title', 'f_c_t', null, null, 'h'),
                    this.get_font_size('.module .testimonial-title', 'f_s_t', '', 'h'),
                    this.get_font_style('.module .testimonial-title', 'f_st_t', 'f_t_b', 'h'),
                    this.get_text_shadow('.module .testimonial-title', 't_sh_t', 'h')
                ]
            })
        ],
        image = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .testimonial-image img', 'i_bg_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .testimonial-image img', 'i_bg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .testimonial-image img', 'i_p')
                    ],
                    h: [
                        this.get_padding(' .testimonial-image img', 'i_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .testimonial-image img', 'i_m')
                    ],
                    h: [
                        this.get_margin(' .testimonial-image img', 'i_m', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .testimonial-image img', 'i_b')
                    ],
                    h: [
                        this.get_border(' .testimonial-image img', 'i_b', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .testimonial-image img', 'i_r_c')
                    ],
                    h: [
                        this.get_border_radius(' .testimonial-image img', 'i_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .testimonial-image img', 'i_b_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .testimonial-image img', 'i_b_sh', 'h')
                    ]
                })
            ])
        ],
        testimonialContent = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .testimonial-content', 'background_color_content', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .testimonial-content', 'b_c_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .testimonial-content', 'font_family_content'),
                        this.get_color(' .testimonial-content', 'font_color_content'),
                        this.get_font_size(' .testimonial-content', 'font_size_content'),
                        this.get_font_style(' .testimonial-content', 'f_fs_c', 'f_fw_c'),
                        this.get_line_height(' .testimonial-content', 'line_height_content'),
                        this.get_text_shadow(' .testimonial-content', 't_sh_c')
                    ],
                    h: [
                        this.get_font_family(' .testimonial-content', 'f_f_c', 'h'),
                        this.get_color(' .testimonial-content', 'f_c_c', null, null, 'h'),
                        this.get_font_size(' .testimonial-content', 'f_s_c', '', 'h'),
                        this.get_font_style(' .testimonial-content', 'f_fs_c', 'f_fw_c', 'h'),
                        this.get_text_shadow(' .testimonial-content', 't_sh_c', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .testimonial-content', 'content_padding')
                    ],
                    h: [
                        this.get_padding(' .testimonial-content', 'c_p', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .testimonial-content', 'content_border')
                    ],
                    h: [
                        this.get_border(' .testimonial-content', 'c_b', 'h')
                    ]
                })
            ])
        ],
        testimonialContainer = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .testimonial-item', 'b_c_container', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(':hover .testimonial-item', 'b_c_co', 'bg_c', 'background-color')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .testimonial-item', 'p_container')
                    ],
                    h: [
                        this.get_padding(' .testimonial-item', 'p_c', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .testimonial-item', 'b_container')
                    ],
                    h: [
                        this.get_border(' .testimonial-item', 'b_co', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .testimonial-item', 'r_c_cn')
                    ],
                    h: [
                        this.get_border_radius(' .testimonial-item', 'r_c_cn', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .testimonial-item', 'b_sh_cn')
                    ],
                    h: [
                        this.get_box_shadow(' .testimonial-item', 'b_sh_cn', 'h')
                    ]
                })
            ])
        ],
        personInfo = [
            // Font
            this.get_expand('name', [
                this.get_tab({
                    n: [
                        this.get_font_family('.module .person-name', 'font_family_person_name'),
                        this.get_color('.module .person-name', 'font_color_person_name'),
                        this.get_font_size('.module .person-name', 'font_size_person_name'),
                        this.get_line_height('.module .person-name', 'line_height_person_name'),
                        this.get_text_transform('.module .person-name', 'text_transform_person_name'),
                        this.get_font_style('.module .person-name', 'font_style_person_name', 'f_w_p_n'),
                        this.get_text_shadow('.module .person-name', 't_sh_i')
                    ],
                    h: [
                        this.get_font_family('.module .person-name', 'f_f_p_n', 'h'),
                        this.get_color('.module .person-name', 'f_c_p_n', null, null, 'h'),
                        this.get_font_size('.module .person-name', 'f_s_p_n', '', 'h'),
                        this.get_font_style('.module .person-name', 'f_st_p_n', 'f_w_p_n', 'h'),
                        this.get_text_shadow('.module .person-name', 't_sh_i', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('po', [
                this.get_tab({
                    n: [
                        this.get_font_family('.module .person-position', 'font_family_person_position'),
                        this.get_color('.module .person-position', 'font_color_person_position'),
                        this.get_font_size('.module .person-position', 'font_size_person_position'),
                        this.get_line_height('.module .person-position', 'line_height_person_position'),
                        this.get_text_transform('.module .person-position', 'text_transform_person_position'),
                        this.get_font_style('.module .person-position', 'font_style_person_position', 'f_w_p_p'),
                        this.get_text_shadow('.module .person-position', 't_sh_p_i')
                    ],
                    h: [
                        this.get_font_family('.module .person-position', 'f_f_p_p', 'h'),
                        this.get_color('.module .person-position', 'f_c_p_p', null, null, 'h'),
                        this.get_font_size('.module .person-position', 'f_s_p_p', '', 'h'),
                        this.get_font_style('.module .person-position', 'f_st_p_p', 'f_w_p_p', 'h'),
                        this.get_text_shadow('.module .person-position', 't_sh_p_i', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('company', [
                this.get_tab({
                    n: [
                        this.get_font_family('.module .person-company', 'font_family_company'),
                        this.get_color(['.module .person-company', '.module .person-company a'], 'font_color_company'),
                        this.get_font_size('.module .person-company', 'font_size_company'),
                        this.get_line_height('.module .person-company', 'line_height_company'),
                        this.get_text_transform('.module .person-company', 'text_transform_company'),
                        this.get_font_style('.module .person-company', 'font_style_company', 'f_w_c'),
                        this.get_text_shadow('.module .person-company', 't_sh_p_c')
                    ],
                    h: [
                        this.get_font_family('.module .person-company', 'f_f_c', 'h'),
                        this.get_color(['.module .person-company', '.module .person-company a'], 'f_c_c', null, null, 'h'),
                        this.get_font_size('.module .person-company', 'f_s_c', '', 'h'),
                        this.get_font_style('.module .person-company', 'f_st_c', 'f_w_c', 'h'),
                        this.get_text_shadow('.module .person-company', 't_sh_p_c', 'h')
                    ]
                })
            ])
        ],
        controls = [
            // Arrows
            this.get_expand('arr', [
                this.get_tab({
                    n: [
                        this.get_color([' .carousel-prev', ' .carousel-next'], 'background_color_arrows_controls', 'bg_c', 'background-color'),
                        this.get_color([' .carousel-prev::before', ' .carousel-next::before'], 'font_color_arrows_controls'),
                        this.get_width([' .carousel-prev', ' .carousel-next'], 'w_arr_ctrl'),
                        this.get_height([' .carousel-prev', ' .carousel-next'], 'h_arr_ctrl')
                    ],
                    h: [
                        this.get_color([' .carousel-prev:hover', ' .carousel-next:hover'], 'background_color_hover_arrows_controls', 'bg_c', 'background-color'),
                        this.get_color([' .carousel-prev:hover::before', ' .carousel-next:hover::before'], 'font_color_arrows_controls_hover')
                    ]
                })
            ]),
            // Pager
            this.get_expand('pager', [
                this.get_tab({
                    n: [
                        this.get_color(' .carousel-pager a', 'font_color_pager_controls')
                    ],
                    h: [
                        this.get_color([' .carousel-pager a:hover', ' .carousel-pager a.selected'], 'font_color_hover_pager_controls')
                    ]
                })
            ])
        ],
        ratingStar = [
            //Gaps
            this.get_expand('m', [
                this.get_margin(' .tb_rating_wrap .tf_fa ', 'r_m')
            ]),
            // Star Base Color
            this.get_expand('strbasec', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_rating_wrap', 'st_c')
                    ],
                    h: [
                        this.get_color(' .tb_rating_wrap', 'st_c', null, null, 'hover')
                    ]
                })
            ]),
            // Star Highlight Color
            this.get_expand('strhghlghtc', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_rating_fill', 'st_h_c')
                    ],
                    h: [
                        this.get_color(' .tb_rating_fill', 'st_h_c', null, null, 'hover')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                conter: testimonialContainer,
                title: testimonialTitle,
                image: image,
                content: testimonialContent,
                persinfo: personInfo,
                slctrols: controls,
                rstar: ratingStar
            }
        };
    }
}