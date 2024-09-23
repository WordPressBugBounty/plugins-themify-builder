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
                        this.get_font_family(['', '.module .video-title', '.module .video-title a']),
                        this.get_color_type(['.module .video-title', '.module .video-title a', ' .tb_text_wrap']),
                        this.get_font_size(),
                        this.get_line_height(),
                        this.get_letter_spacing(),
                        this.get_text_align(),
                        this.get_text_transform(),
                        this.get_font_style(['', '.module .video-title', '.module .video-title a']),
                        this.get_text_decoration('', 'text_decoration_regular'),
                        this.get_text_shadow([' .video-caption', '.module .video-title', ' .video-title a'])
                    ],
                    h: [
                        this.get_font_family(['', '.module .video-title', '.module .video-title a'], 'f_f', 'h'),
                        this.get_color_type(['.module:hover .video-title', '.module:hover .video-title a', ':hover .tb_text_wrap'], 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size(':hover', 'f_s', '', 'h'),
                        this.get_font_style(['', '.module .video-title', '.module .video-title a'], 'f_st', 'f_w', 'h'),
                        this.get_text_decoration(':hover', 't_d_r', 'h'),
                        this.get_text_shadow([':hover .video-caption', '.module:hover .video-title', '.module:hover .video-title a'], 't_sh', 'h')
                    ]
                })
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color([' a', '.module .video-title a'], 'link_color'),
                        this.get_text_decoration(' a')
                    ],
                    h: [
                        this.get_color([' a', '.module .video-title a'], 'link_color', null, null, 'hover'),
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
        videoTitle = [
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family(['.module .video-title', '.module .video-title a'], 'font_family_title'),
                    this.get_color(['.module .video-title', '.module .video-title a'], 'font_color_title'),
                    this.get_font_size('.module .video-title', 'font_size_title'),
                    this.get_line_height('.module .video-title', 'line_height_title'),
                    this.get_letter_spacing('.module .video-title', 'letter_spacing_title'),
                    this.get_text_transform('.module .video-title', 'text_transform_title'),
                    this.get_font_style(['.module .video-title', '.module .video-title a'], 'font_title', 'font_title_bold'),
                    this.get_text_shadow(['.module .video-title', '.module .video-title a'], 't_sh_t')
                ],
                h: [
                    this.get_font_family(['.module .video-title', '.module .video-title a'], 'f_f_t', 'h'),
                    this.get_color(['.module .video-title', '.module .video-title a'], 'f_c_t', null, null, 'h'),
                    this.get_font_size('.module .video-title', 'f_s_t', '', 'h'),
                    this.get_font_style(['.module .video-title', '.module .video-title a'], 'f_t', 'f_t_b', 'h'),
                    this.get_text_shadow(['.module .video-title', '.module .video-title a'], 't_sh_t', 'h')
                ]
            })
        ],
        videoCaption = [
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .video-caption', 'font_family_caption'),
                        this.get_color('.module .tb_text_wrap', 'font_color_caption'),
                        this.get_font_size(' .video-caption', 'font_size_caption'),
                        this.get_font_style(' .video-caption', 'f_fs_c', 'f_fw_c'),
                        this.get_line_height(' .video-caption', 'line_height_caption'),
                        this.get_text_shadow('.module .video-caption', 't_sh_c')
                    ],
                    h: [
                        this.get_font_family(' .video-caption', 'f_f_c', 'h'),
                        this.get_color('.module .tb_text_wrap', 'f_c_c', null, null, 'h'),
                        this.get_font_size(' .video-caption', 'f_s_c', '', 'h'),
                        this.get_font_style(' .video-caption', 'f_fs_c', 'f_fw_c', 'h'),
                        this.get_text_shadow('.module .video-caption', 't_sh_c', 'h')
                    ]
                })
            ]),
            // Background
            this.get_expand('coverlay', [
                this.get_tab({
                    n: [
                        this.get_color('.video-overlay .video-content', 'background_color_video_caption', 'overlay', 'background-color'),
                        this.get_color(['.module.video-overlay .video-title', '.module.video-overlay .tb_text_wrap'], 'f_c_h_v', 'ovfc')
                    ],
                    h: [
                        this.get_color('.video-overlay:hover .video-content', 'b_c_v_c_h', 'overlay', 'background-color'),
                        this.get_color(['.module.video-overlay:hover .video-title', '.module.video-overlay:hover .tb_text_wrap'], 'f_c_h_v_caption', 'ovfc')
                    ]
                })
            ])
        ],
        overlayImage = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_video_overlay', 'b_c_i_o', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_video_overlay:hover', 'b_c_o_i_h', 'bg_c', 'background-color')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_video_overlay', 'b_o_i')
                    ],
                    h: [
                        this.get_border(' .tb_video_overlay', 'b_o_i', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_video_overlay', 'p_o_i')
                    ],
                    h: [
                        this.get_padding(' .tb_video_overlay', 'p_o_i', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_video_overlay', 'm_o_i')
                    ],
                    h: [
                        this.get_margin(' .tb_video_overlay', 'm_o_i', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .tb_video_overlay', 'r_c_o_i')
                    ],
                    h: [
                        this.get_border_radius(' .tb_video_overlay', 'r_c_o_i', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_video_overlay', 'b_sh_o_i')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_video_overlay', 'b_sh_o_i', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                vidt: videoTitle,
                vidcap: videoCaption,
                overimg: overlayImage
            }
        };
    }
}