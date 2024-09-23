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
                        this.get_color_type(' form', '', 'f_c_t', 'f_c', 'f_g_c'),
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
                        this.get_color_type(' form', 'h'),
                        this.get_font_size('', 'f_s', '', 'h'),
                        this.get_font_style('', 'f_st', 'f_w', 'h'),
                        this.get_text_decoration('', 't_d_r', 'h'),
                        this.get_text_shadow('', 't_sh', 'h')
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
        labels = [
            // Font
            this.get_seperator('f'),
            this.get_tab({
                n: [
                    this.get_font_family(' label', 'f_f_l'),
                    this.get_color(' label', 'f_c_l'),
                    this.get_font_size(' label', 'f_s_l'),
                    this.get_font_style(' label', 'f_st_l', 'f_fw_l'),
                    this.get_text_shadow(' label', 't_sh_l')
                ],
                h: [
                    this.get_font_family(' label', 'f_f_l', 'h'),
                    this.get_color(' label', 'f_c_l', null, null, 'h'),
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
                        this.get_color([' input', ' textarea'], 'bg_c_i', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color([' input', ' textarea'], 'bg_c_i', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family([' input', ' textarea'], 'f_f_i'),
                        this.get_color([' input', ' textarea'], 'f_c_i'),
                        this.get_font_size([' input', ' textarea'], 'f_s_i'),
                        this.get_font_style([' input', ' textarea'], 'f_st_i', 'f_fw_i'),
                        this.get_text_shadow([' input', ' textarea'], 't_sh_i')
                    ],
                    h: [
                        this.get_font_family([' input', ' textarea'], 'f_f_i', 'h'),
                        this.get_color([' input', ' textarea'], 'f_c_i', null, null, 'h'),
                        this.get_font_size([' input', ' textarea'], 'f_s_i', '', 'h'),
                        this.get_font_style([' input', ' textarea'], 'f_st_i', 'f_fw_i', 'h'),
                        this.get_text_shadow([' input', ' textarea'], 't_sh_i', 'h')
                    ]
                })
            ]),
            // Placeholder
            this.get_expand('placeh', [
                this.get_tab({
                    n: [
                        this.get_font_family([' input::placeholder', ' textarea::placeholder'], 'f_f_in_ph'),
                        this.get_color([' input::placeholder', ' textarea::placeholder'], 'f_c_in_ph'),
                        this.get_font_size([' input::placeholder', ' textarea::placeholder'], 'f_s_in_ph'),
                        this.get_font_style([' input::placeholder', ' textarea::placeholder'], 'f_st_in_ph', 'f_fw_in_ph'),
                        this.get_text_shadow([' input::placeholder', ' textarea::placeholder'], 't_sh_in_ph')
                    ],
                    h: [
                        this.get_font_family([' input:hover::placeholder', ' textarea:hover::placeholder'], 'f_f_in_ph_h', ''),
                        this.get_color([' input:hover::placeholder', ' textarea:hover::placeholder'], 'f_c_in_ph_h', null, null, ''),
                        this.get_font_size([' input:hover::placeholder', ' textarea:hover::placeholder'], 'f_s_in_ph_h', '', ''),
                        this.get_font_style([' input:hover::placeholder', ' textarea:hover::placeholder'], 'f_st_in_ph', 'f_fw_in_ph', 'h'),
                        this.get_text_shadow([' input:hover::placeholder', ' textarea:hover::placeholder'], 't_sh_in_ph_h', '')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border([' input', ' textarea'], 'b_in')
                    ],
                    h: [
                        this.get_border([' input', ' textarea'], 'b_in', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding([' input', ' textarea'], 'in_p')
                    ],
                    h: [
                        this.get_padding([' input', ' textarea'], 'in_p', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius([' input', ' textarea'], 'in_r_c')
                    ],
                    h: [
                        this.get_border_radius([' input', ' textarea'], 'in_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow([' input', ' textarea'], 'in_b_sh')
                    ],
                    h: [
                        this.get_box_shadow([' input', ' textarea'], 'in_b_sh', 'h')
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
                        this.get_color(' button', 'bg_c_s_b', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' button:hover', 'bg_c_s_b_h', 'bg_c', 'background-color', '')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' button', 'f_f_b_s'),
                        this.get_color(' button', 'f_c_b'),
                        this.get_font_size(' button', 'f_s_b'),
                        this.get_font_style(' button', 'f_st_b', 'f_fw_b'),
                        this.get_text_shadow(' button', 't_sh_b')
                    ],
                    h: [
                        this.get_font_family(' button:hover', 'f_f_b_s_h', ''),
                        this.get_color(' button:hover', 'f_c_b_s_h', null, null, ''),
                        this.get_font_size(' button:hover', 'f_s_b_h', '', ''),
                        this.get_font_style(' button:hover', 'f_st_b', 'f_fw_b', 'h'),
                        this.get_text_shadow(' button:hover', 't_sh_b_h', '')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' button', 'b_b')
                    ],
                    h: [
                        this.get_border(' button:hover', 'b_b_s', '')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' button', 'bt_p')
                    ],
                    h: [
                        this.get_padding(' button:hover', 'bt_p', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' button', 'bt_r_c')
                    ],
                    h: [
                        this.get_border_radius(' button:hover', 'bt_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' button', 'bt_sh')
                    ],
                    h: [
                        this.get_box_shadow(' button:hover', 'bt_sh', 'h')
                    ]
                })
            ])
        ],
        signupError = [
            //background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_signup_errors', 'bg_c_e', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_signup_errors:hover', 'bg_c_e_h', 'bg_c', 'background-color', '')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb_signup_errors', 'f_f_e'),
                        this.get_color(' .tb_signup_errors', 'f_c_e'),
                        this.get_font_size(' .tb_signup_errors', 'f_s_e'),
                        this.get_font_style(' .tb_signup_errors', 'f_st_e', 'f_fw_e'),
                        this.get_text_shadow(' .tb_signup_errors', 't_sh_e')
                    ],
                    h: [
                        this.get_font_family(' tb_signup_errors:hover', 'f_f_e_h', ''),
                        this.get_color(' .tb_signup_errors:hover', 'f_c_e_h', null, null, ''),
                        this.get_font_size(' .tb_signup_errors:hover', 'f_s_e_h', '', ''),
                        this.get_font_style(' .tb_signup_errors', 'f_st_e', 'f_fw_e', 'h'),
                        this.get_text_shadow(' .tb_signup_errors:hover', 't_sh_e_h', '')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_signup_errors', 'b_e')
                    ],
                    h: [
                        this.get_border(' .tb_signup_errors:hover', 'b_e_s', '')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_signup_errors', 'e_p')
                    ],
                    h: [
                        this.get_padding(' .tb_signup_errors:hover', 'e_p_h', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .tb_signup_errors', 'e_r_c')
                    ],
                    h: [
                        this.get_border_radius(' .tb_signup_errors:hover', 'e_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_signup_errors', 'e_sh')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_signup_errors:hover', 'e_sh', 'h')
                    ]
                })
            ])
        ],
        signupSuccess = [
            //background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_signup_success', 'bg_c_s', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_signup_success:hover', 'bg_c_s_h', 'bg_c', 'background-color', '')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb_signup_success', 'f_f_s'),
                        this.get_color(' .tb_signup_success', 'f_c_s'),
                        this.get_font_size(' .tb_signup_success', 'f_s_s'),
                        this.get_font_style(' .tb_signup_success', 'f_st_s', 'f_fw_s'),
                        this.get_text_shadow(' .tb_signup_success', 't_sh_s')
                    ],
                    h: [
                        this.get_font_family(' tb_signup_success:hover', 'f_f_s_h', ''),
                        this.get_color(' .tb_signup_success:hover', 'f_c_s_h', null, null, ''),
                        this.get_font_size(' .tb_signup_success:hover', 'f_s_s_h', '', ''),
                        this.get_font_style(' .tb_signup_success', 'f_st_s', 'f_fw_s', 'h'),
                        this.get_text_shadow(' .tb_signup_success:hover', 't_sh_s_h', '')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_signup_success', 'b_s')
                    ],
                    h: [
                        this.get_border(' .tb_signup_success:hover', 'b_s_s', '')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_signup_success', 'e_p_s')
                    ],
                    h: [
                        this.get_padding(' .tb_signup_success:hover', 'e_p_s_h', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .tb_signup_success', 'e_r_c_s')
                    ],
                    h: [
                        this.get_border_radius(' .tb_signup_success:hover', 'e_r_c_s', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_signup_success', 'e_sh_s')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_signup_success:hover', 'e_sh_s', 'h')
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
                submitbtn: sendButton,
                errmsg: signupError,
                sucmsg: signupSuccess
            }
        };
    }
}