const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image('', 'b_i', 'bg_c', 'b_r', 'b_p')
                    ],
                    h: [
                        this.get_image('', 'b_i', 'bg_c', 'b_r', 'b_p', 'h')
                    ]
                })
            ]),
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('', 'f_f'),
                        this.get_color_type([' label', ' .tb_text_wrap'], '', 'f_c_t', 'f_c', 'f_g_c'),
                        this.get_font_size('', 'f_s'),
                        this.get_line_height('', 'l_h'),
                        this.get_letter_spacing('', 'l_s'),
                        this.get_text_align('', 't_a'),
                        this.get_text_transform('', 't_t'),
                        this.get_font_style('', 'f_st', 'f_w'),
                        this.get_text_decoration('', 't_d_r'),
                        this.get_text_shadow()
                    ],
                    h: [
                        this.get_font_family('', 'f_f', 'h'),
                        this.get_color_type([' label', ' .tb_text_wrap'], 'h'),
                        this.get_font_size('', 'f_s', '', 'h'),
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
                        this.get_padding('', 'p')
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
                        this.get_margin('', 'm')
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
                        this.get_border('', 'b')
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
        labels = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family(' label', 'f_f_l'),
                    this.get_color('.module label', 'f_c_l'),
                    this.get_font_size(' label', 'f_s_l'),
                    this.get_font_style(' label', 'f_st_l', 'f_fw_l'),
                    this.get_text_shadow(' label', 't_sh_l')
                ],
                h: [
                    this.get_font_family(' label', 'f_f_l', 'h'),
                    this.get_color('.module label', 'f_c_l', null, null, 'h'),
                    this.get_font_size(' label', 'f_s_l', '', 'h'),
                    this.get_font_style(' label', 'f_st_l', 'f_fw_l', 'h'),
                    this.get_text_shadow(' label', 't_sh_l', 'h')
                ]
            })
        ],
        inputs = [
            //background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' input', 'bg_c_i', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' input', 'bg_c_i', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' input', 'f_f_i'),
                        this.get_color(' input', 'f_c_i'),
                        this.get_font_size(' input', 'f_s_i'),
                        this.get_font_style(' input', 'f_st_i', 'f_fw_i'),
                        this.get_text_shadow(' input', 't_sh_i')
                    ],
                    h: [
                        this.get_font_family(' input', 'f_f_i', 'h'),
                        this.get_color(' input', 'f_c_i', null, null, 'h'),
                        this.get_font_size(' input', 'f_s_i', '', 'h'),
                        this.get_font_style(' input', 'f_st_i', 'f_fw_i', 'h'),
                        this.get_text_shadow(' input', 't_sh_i', 'h')
                    ]
                })
            ]),
            // Placeholder
            this.get_expand('placeh', [
                this.get_tab({
                    n: [
                        this.get_font_family(' input::placeholder', 'f_f_in_ph'),
                        this.get_color(' input::placeholder', 'f_c_in_ph'),
                        this.get_font_size(' input::placeholder', 'f_s_in_ph'),
                        this.get_font_style(' input::placeholder', 'f_st_in_ph', 'f_fw_in_ph'),
                        this.get_text_shadow(' input::placeholder', 't_sh_in_ph')
                    ],
                    h: [
                        this.get_font_family(' input:hover::placeholder', 'f_f_in_ph_h', ''),
                        this.get_color(' input:hover::placeholder', 'f_c_in_ph_h', null, null, ''),
                        this.get_font_size(' input:hover::placeholder', 'f_s_in_ph_h', '', ''),
                        this.get_font_style(' input::placeholder', 'f_st_in_ph', 'f_fw_in_ph', 'h'),
                        this.get_text_shadow(' input:hover::placeholder', 't_sh_in_ph_h', '')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' input', 'b_in')
                    ],
                    h: [
                        this.get_border(' input', 'b_in', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' input', 'p_in')
                    ],
                    h: [
                        this.get_padding(' input', 'p_in', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' input', 'm_in')
                    ],
                    h: [
                        this.get_margin(' input', 'm_in', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' input', 'r_c_in')
                    ],
                    h: [
                        this.get_border_radius(' input', 'r_c_in', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' input', 'b_sh_in')
                    ],
                    h: [
                        this.get_box_shadow(' input', 'b_sh_in', 'h')
                    ]
                })
            ])
        ],
        checkbox = [
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' input[type="checkbox"]', 'b_c_cb', 'bg_c', 'background-color'),
                        this.get_color(' input[type="checkbox"]', 'f_c_cb')
                    ],
                    h: [
                        this.get_color(' input[type="checkbox"]', 'b_c_cb', 'bg_c', 'background-color', 'h'),
                        this.get_color(' input[type="submit"]', 'f_c_cb', null, null, 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' input[type="checkbox"]', 'b_cb')
                    ],
                    h: [
                        this.get_border(' input[type="checkbox"]', 'b_cb', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' input[type="checkbox"]', 'p_cb')
                    ],
                    h: [
                        this.get_padding(' input[type="checkbox"]', 'p_cb', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' #commentform input[type="checkbox"]', 'm_cb')
                    ],
                    h: [
                        this.get_margin(' #commentform input[type="checkbox"]', 'm_cb', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' input[type="checkbox"]', 'r_c_cb')
                    ],
                    h: [
                        this.get_border_radius(' input[type="checkbox"]', 'r_c_cb', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' input[type="checkbox"]', 's_cb')
                    ],
                    h: [
                        this.get_box_shadow(' input[type="checkbox"]', 's_cb', 'h')
                    ]
                })
            ])
        ],
        sendButton = [
            //background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_optin_submit button', 'bg_c_s', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_optin_submit button', 'bg_c_s', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb_optin_submit button', 'f_f_s'),
                        this.get_color(' .tb_optin_submit button', 'f_c_s'),
                        this.get_font_size(' .tb_optin_submit button', 'f_s_s'),
                        this.get_font_style(' .tb_optin_submit button', 'f_s_st', 'f_s_w'),
                        this.get_text_shadow(' .tb_optin_submit button', 't_sh_s_b')
                    ],
                    h: [
                        this.get_font_family(' .tb_optin_submit button', 'f_f_s', 'h'),
                        this.get_color(' .tb_optin_submit button', 'f_c_s', null, null, 'h'),
                        this.get_font_size(' .tb_optin_submit button', 'f_s_s', '', 'h'),
                        this.get_font_style(' .tb_optin_submit button', 'f_s_st', 'f_s_w', 'h'),
                        this.get_text_shadow(' .tb_optin_submit button', 't_sh_s_b', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_optin_submit button', 'b_s')
                    ],
                    h: [
                        this.get_border(' .tb_optin_submit button', 'b_s', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_optin_submit button', 'p_sb')
                    ],
                    h: [
                        this.get_padding(' .tb_optin_submit button', 'p_sb', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_optin_submit button', 'm_sb')
                    ],
                    h: [
                        this.get_margin(' .tb_optin_submit button', 'm_sb', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .tb_optin_submit button', 'r_c_sb')
                    ],
                    h: [
                        this.get_border_radius(' .tb_optin_submit button', 'r_c_sb', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_optin_submit button', 'b_sh_sb')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_optin_submit button', 'b_sh_sb', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                labels: labels,
                inpf: inputs,
                chkbox: checkbox,
                sbscrbebtn: sendButton
            }
        };
    }
}