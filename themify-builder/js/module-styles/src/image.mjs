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
                        this.get_font_family([' ', ' .image-title']),
                        this.get_color_type([' .tb_text_wrap', ' .image-title']),
                        this.get_font_size(' '),
                        this.get_line_height(' '),
                        this.get_letter_spacing([' ', ' .image-title']),
                        this.get_text_align(' '),
                        this.get_text_transform(' '),
                        this.get_font_style([' ', ' .image-title']),
                        this.get_text_decoration(' ', 'text_decoration_regular'),
                        this.get_text_shadow([' ', ' .image-title'])
                    ],
                    h: [
                        this.get_font_family([' ', ' .image-title'], 'f_f', 'h'),
                        this.get_color_type([':hover .tb_text_wrap', ':hover .image-title'], '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size(' ', 'f_s', '', 'h'),
                        this.get_font_style([' ', ' .image-title'], 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(' ', 't_d_r', 'h'),
                        this.get_text_shadow([' ', ' .image-title'], 't_sh', 'h')
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
                        this.get_padding('', '', '', true)
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
                        this.get_margin('', '', '', true)
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
            // Position
            this.get_expand('po', [this.get_css_position()]),
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
        imageTitle = [
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(['.module .image-title', '.module .image-title a'], 'font_family_title'),
                        this.get_color(['.module .image-title', '.module .image-title a'], 'font_color_title'),
                        this.get_font_size('.module .image-title', 'font_size_title'),
                        this.get_line_height('.module .image-title', 'line_height_title'),
                        this.get_letter_spacing('.module .image-title', 'letter_spacing_title'),
                        this.get_text_transform('.module .image-title', 'text_transform_title'),
                        this.get_font_style(['.module .image-title', '.module .image-title a'], 'font_style_title'),
                        this.get_text_shadow('.module .image-title', 't_sh_t')
                    ],
                    h: [
                        this.get_font_family(['.module .image-title', '.module .image-title a'], 'f_f_t', 'h'),
                        this.get_color(['.module .image-title', '.module .image-title a'], 'f_c_t', null, null, 'h'),
                        this.get_font_size('.module .image-title', 'f_s_t', '', 'h'),
                        this.get_font_style(['.module .image-title', '.module .image-title a'], 'f_st_t', 'f_w_t', 'h'),
                        this.get_text_shadow('.module .image-title', 't_sh_t', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('.module .image-title', 'title_margin')
                    ],
                    h: [
                        this.get_margin('.module .image-title', 't_m', 'h')
                    ]
                })
            ])
        ],
        imageTab = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .image-wrap img', 'i_t_b_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .image-wrap img', 'i_t_b_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .image-wrap img', 'i_t_p')
                    ],
                    h: [
                        this.get_padding(' .image-wrap img', 'i_t_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .image-wrap img', 'i_t_m', '', true)
                    ],
                    h: [
                        this.get_margin(' .image-wrap img', 'i_t_m', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .image-wrap img', 'i_t_b')
                    ],
                    h: [
                        this.get_border(' .image-wrap img', 'i_t_b', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius([' .image-wrap img', '.image-full-overlay .image-content'], 'i_t_r_c')
                    ],
                    h: [
                        this.get_border_radius([' .image-wrap img', '.image-full-overlay .image-content'], 'i_t_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .image-wrap img', 'i_t_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .image-wrap img', 'i_t_sh', 'h')
                    ]
                })
            ])
        ],
        imageCaption = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .image-content', 'c_b_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .image-content', 'c_b_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]), // Background
            this.get_expand('coverlay', [
                this.get_tab({
                    n: [
                        this.get_color(['.image-overlay .image-content', '.image-full-overlay .image-content::before', '.image-card-layout .image-content'], 'b_c_c', 'overlay', 'background-color')

                    ],
                    h: [
                        this.get_color(['.image-overlay:hover .image-content', '.image-full-overlay:hover .image-content::before', '.image-card-layout:hover .image-content'], 'b_c_c_h', 'overlay', 'background-color'),
                        this.get_color(['.image-overlay:hover .image-title', '.image-overlay:hover .image-caption', '.image-full-overlay:hover .image-title', '.image-full-overlay:hover .image-caption', '.image-card-layout:hover .image-content', '.image-card-layout:hover .image-title'], 'f_c_c_h', 'ovfc')

                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('.module .image-caption', 'font_family_caption'),
                        this.get_color('.module .image-caption', 'font_color_caption'),
                        this.get_font_size('.module .image-caption', 'font_size_caption'),
                        this.get_font_style('.module .image-caption', 'f_fs_c', 'f_fw_c'),
                        this.get_line_height('.module  .image-caption', 'line_height_caption'),
                        this.get_text_shadow('.module .image-caption', 't_sh_c')
                    ],
                    h: [
                        this.get_font_family('.module .image-caption', 'f_f_c', 'h'),
                        this.get_color(['.module:hover .image-caption', '.module:hover .image-title'], 'f_c_c_h', null, null, ''),
                        this.get_font_size('.module .image-caption', 'f_s_c', '', 'h'),
                        this.get_font_style('.module .image-caption', 'f_fs_c', 'f_fw_c', 'h'),
                        this.get_text_shadow('.module .image-caption', 't_sh_c', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .image-content', 'c_p')
                    ],
                    h: [
                        this.get_padding(' .image-content', 'c_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .image-content', 'c_m')
                    ],
                    h: [
                        this.get_margin(' .image-content', 'c_m', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius([' .image-content', '.module.image-full-overlay .image-content'], 'c_r_c')
                    ],
                    h: [
                        this.get_border_radius([' .image-content', '.module.image-full-overlay .image-content'], 'c_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .image-content', 'c_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .image-content', 'c_sh', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                imgt: imageTitle,
                image: imageTab,
                imgc: imageCaption
            }
        };
    }
}