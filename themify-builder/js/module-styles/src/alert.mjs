const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [

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

            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .alert-content'),
                        this.get_color_type([' .tb_text_wrap', ' .alert-heading']),
                        this.get_font_size(' .alert-content'),
                        this.get_line_height(' .alert-content'),
                        this.get_letter_spacing(' .alert-content'),
                        this.get_text_align(' .alert-content'),
                        this.get_text_transform(' .alert-content'),
                        this.get_font_style(' .alert-content'),
                        this.get_text_decoration([' .alert-content', ' a'], 'text_decoration_regular'),
                        this.get_text_shadow(' .alert-content')
                    ],
                    h: [
                        this.get_font_family(' .alert-content:hover', 'f_f', null, ''),
                        this.get_color_type([':hover .tb_text_wrap', ':hover .alert-heading'], 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
                        this.get_font_size(' .alert-content', 'f_s', '', 'h'),
                        this.get_font_style(' .alert-content:hover', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration([' .alert-content', ' a'], 't_d_r', 'h'),
                        this.get_text_shadow(' .alert-content', 't_sh', 'h')
                    ]
                })
            ]),

            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_color(['.module .tb_text_wrap a', '.module .tb_alert_text'], 'link_color'),
                        this.get_text_decoration(['.module .alert-content', ' a'])
                    ],
                    h: [
                        this.get_color(['.module .tb_text_wrap a', '.module .tb_alert_text'], 'link_color', null, null, 'hover'),
                        this.get_text_decoration(['.module .alert-content', ' a'], 't_d', 'h')
                    ]
                })
            ]),

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

            this.get_expand('w', [
                this.get_width('', 'w')
            ]),

            this.get_expand('ht', [
                this.get_height()
            ]),

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
        alertTitle = [

            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('.module .alert-heading', 'f_f_a_t'),
                        this.get_color('.module .alert-heading', 'f_c_a_t'),
                        this.get_font_size('.module .alert-heading', 'f_s_a_t'),
                        this.get_line_height('.module .alert-heading', 'l_h_a_t'),
                        this.get_letter_spacing('.module .alert-heading', 'l_s_a_t'),
                        this.get_text_transform('.module .alert-heading', 't_t_a_t'),
                        this.get_font_style('.module .alert-heading', 'f_st_a_t', 'f_s_a_b'),
                        this.get_text_shadow('.module .alert-heading', 't_sh_a_t')
                    ],
                    h: [
                        this.get_font_family('.module .alert-heading', 'f_f_a_t', 'h'),
                        this.get_color('.module .alert-heading', 'f_c_a_t', null, null, 'h'),
                        this.get_font_size('.module .alert-heading', 'f_s_a_t', '', 'h'),
                        this.get_font_style('.module .alert-heading', 'f_st_a_t', 'f_s_a_b', 'h'),
                        this.get_text_shadow('.module .alert-heading', 't_sh_a_t', 'h')
                    ]
                })
            ]),

            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('.module .alert-heading', 'm_a_t')
                    ],
                    h: [
                        this.get_margin('.module .alert-heading', 'm_a_t', 'h')
                    ]
                })
            ])
        ],
        alertButton = [

            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .alert-button a', 'background_color_button', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .alert-button a', 'background_color_button', 'bg_c', 'background-color', 'hover')
                    ]
                })
            ]),

            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .alert-button a', 'font_family_button'),
                        this.get_color('.module .alert-button a span', 'font_color_button'),
                        this.get_font_size(' .alert-button a', 'font_size_button'),
                        this.get_font_style(' .alert-button a', 'f_fs_a', 'f_fw_a'),
                        this.get_line_height(' .alert-button a', 'line_height_button'),
                        this.get_text_shadow(' .alert-button a', 't_sh_a_b')
                    ],
                    h: [
                        this.get_font_family(':hover .alert-button a', 'f_f_b_h', ''),
                        this.get_color('.module .alert-button a span', 'font_color_button', null, null, 'hover'),
                        this.get_font_size(':hover .alert-button a', 'f_s_b_h', '', ''),
                        this.get_font_style(':hover .alert-button a', 'f_fs_a', 'f_fw_a', 'h'),
                        this.get_text_shadow(':hover .alert-button a', 't_sh_a_b_h', '')
                    ]
                })
            ]),

            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .alert-button a', 'p_a_b')
                    ],
                    h: [
                        this.get_padding(' .alert-button a', 'p_a_b', 'h')
                    ]
                })
            ]),

            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .alert-button a', 'm_a_b')
                    ],
                    h: [
                        this.get_margin(' .alert-button a', 'm_a_b', 'h')
                    ]
                })
            ]),

            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .alert-button a', 'b_a_b')
                    ],
                    h: [
                        this.get_border(' .alert-button a', 'b_a_b', 'h')
                    ]
                })
            ]),

            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .alert-button a', 'a_b_r_c')
                    ],
                    h: [
                        this.get_border_radius(' .alert-button a', 'a_b_r_c', 'h')
                    ]
                })
            ]),

            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .alert-button a', 'a_b_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .alert-button a', 'a_b_sh', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                atextitle: alertTitle,
                actbtn: alertButton
            }
        };
    }
}