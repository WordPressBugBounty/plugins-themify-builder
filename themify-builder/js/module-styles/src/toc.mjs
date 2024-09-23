const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            //bacground
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
                        this.get_color(' a', 'c'),
                        this.get_font_size(),
                        this.get_line_height(),
                        this.get_letter_spacing(),
                        this.get_text_align(),
                        this.get_text_transform(),
                        this.get_font_style(),
                        this.get_text_decoration('', 'text_decoration_regular'),
                        this.get_text_shadow()
                    ],
                    h: [
                        this.get_font_family(':hover', 'f_f_h'),
                        this.get_color(' a', 'c_h', null, null, 'hover'),
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
         //   this.get_expand('disp', this.get_self_align()),
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
        listContainer = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' > ul', 'b_c_toc_li_cn', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(':hover > ul', 'b_c_toc_li_cn_h', 'bg_c', 'background-color')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' > ul', 'f_f_toc_li_cn'),
                        this.get_color(' ul a', 'f_c_toc_li_cn'),
                        this.get_font_size(' > ul', 'f_sz_toc_li_cn'),
                        this.get_font_style(' > ul', 'f_sy_toc_li_cn', 'f_w_toc_li_cn'),
                        this.get_line_height(' > ul', 'lh_toc_li_cn'),
                        this.get_letter_spacing(' > ul', 'l_s_toc_li_cn'),
                        this.get_text_align(' > ul', 't_a_toc_li_cn'),
                        this.get_text_transform(' > ul', 't_t_toc_li_cn'),
                        this.get_text_decoration(' > ul', 't_d_toc_li_cn'),
                        this.get_text_shadow(' > ul', 't_sh_toc_li_cn')
                    ],
                    h: [
                        this.get_font_family(' > ul', 'f_f_toc_li_cn', 'h'),
                        this.get_color(' ul a', 'f_c_toc_li_cn', null, null, 'h'),
                        this.get_font_size(' > ul', 'f_sz_toc_li_cn', '', 'h'),
                        this.get_font_style(' > ul', 'f_sy_toc_li_cn', 'f_sy_toc_li_cn', 'h'),
                        this.get_text_decoration(' > ul', 't_d_toc_li_cn', 'h'),
                        this.get_text_shadow(' > ul', 't_sh_toc_li_cn', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' > ul', 'p_toc_li_cn')
                    ],
                    h: [
                        this.get_padding(' > ul', 'p_toc_li_cn', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' > ul', 'm_toc_li_cn')
                    ],
                    h: [
                        this.get_margin(' > ul', 'm_toc_li_cn', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' > ul', 'b_toc_li_cn')
                    ],
                    h: [
                        this.get_border(' > ul', 'b_toc_li_cn', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' > ul', 'rc_toc_li_cn')
                    ],
                    h: [
                        this.get_border_radius(' > ul', 'rc_toc_li_cn', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' > ul', 'sh_toc_li_cn')
                    ],
                    h: [
                        this.get_box_shadow(' > ul', 'sh_toc_li_cn', 'h')
                    ]
                })
            ])
        ],
        listItems = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' li', 'b_c_toc_li', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(':hover li', 'b_c_toc_li_h', 'bg_c', 'background-color')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_text_transform(' li', 't_t_toc_li'),
                        this.get_text_decoration(' li', 't_d_toc_li'),
                        this.get_text_shadow(' li', 't_sh_toc_li')
                    ],
                    h: [
                        this.get_text_decoration(' li', 't_d_toc_li', 'h'),
                        this.get_text_shadow(' li', 't_sh_toc_li', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' li', 'p_toc_li')
                    ],
                    h: [
                        this.get_padding(' li', 'p_toc_li', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_row_gap(' ul')
                    ],
                    h: [
                        this.get_row_gap(' ul', 'm_toc_li', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' ul li', 'b_toc_li')
                    ],
                    h: [
                        this.get_border(' ul li', 'b_toc_li', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' li', 'rc_toc_li')
                    ],
                    h: [
                        this.get_border_radius(' li', 'rc_toc_li', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' li', 'sh_toc_li')
                    ],
                    h: [
                        this.get_box_shadow(' li', 'sh_toc_li', 'h')
                    ]
                })
            ])
        ],
        childListContainer = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' ul ul', 'b_c_toc_cli_cntr', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(':hover ul ul', 'b_c_toc_cli_cntr_h', 'bg_c', 'background-color')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_text_transform(' ul ul', 't_t_toc_cli_cntr'),
                        this.get_text_decoration(' ul ul', 't_d_toc_cli_cntr'),
                        this.get_text_shadow(' ul ul', 't_sh_toc_cli_cntr')
                    ],
                    h: [
                        this.get_text_decoration(' ul ul', 't_d_toc_cli_cntr', 'h'),
                        this.get_text_shadow(' ul ul', 't_sh_toc_cli_cntr', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' ul ul', 'p_toc_cli_cntr')
                    ],
                    h: [
                        this.get_padding(' ul ul', 'p_toc_cli_cntr', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' ul ul', 'm_toc_cli_cntr')
                    ],
                    h: [
                        this.get_margin(' ul ul', 'm_toc_cli_cntr', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' ul ul', 'b_toc_cli_cntr')
                    ],
                    h: [
                        this.get_border(' ul ul', 'b_toc_cli_cntr', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' ul ul', 'rc_toc_cli_cntr')
                    ],
                    h: [
                        this.get_border_radius(' ul ul', 'rc_toc_cli_cntr', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' ul ul', 'sh_toc_cli_cntr')
                    ],
                    h: [
                        this.get_box_shadow(' ul ul', 'sh_toc_cli_cntr', 'h')
                    ]
                })
            ])
        ],
        childListItems = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' ul ul li', 'b_c_toc_cli', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(':hover ul ul li', 'b_c_toc_cli_h', 'bg_c', 'background-color')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_text_transform(' ul ul li', 't_t_toc_cli'),
                        this.get_text_decoration(' ul ul li', 't_d_toc_cli'),
                        this.get_text_shadow(' ul ul li', 't_sh_toc_cli')
                    ],
                    h: [
                        this.get_text_decoration(' ul ul li', 't_d_toc_cli', 'h'),
                        this.get_text_shadow(' ul ul li', 't_sh_toc_cli', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' ul ul li', 'p_toc_cli')
                    ],
                    h: [
                        this.get_padding(' ul ul li', 'p_toc_cli', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_row_gap(' ul ul', 'm_toc_cli')
                    ],
                    h: [
                        this.get_row_gap(' ul ul', 'm_toc_cli', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' ul ul li', 'b_toc_cli')
                    ],
                    h: [
                        this.get_border(' ul ul li', 'b_toc_cli', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' ul ul li', 'rc_toc_cli')
                    ],
                    h: [
                        this.get_border_radius(' ul ul li', 'rc_toc_cli', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' ul ul li', 'sh_toc_cli')
                    ],
                    h: [
                        this.get_box_shadow(' ul ul li', 'sh_toc_cli', 'h')
                    ]
                })
            ])
        ],
        minIcon = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_toc_head svg', 'b_c_toc_mni', 'bg_c', 'background-color'),
                        this.get_color(' .tb_toc_head svg', 'f_c_toc_mni')
                    ],
                    h: [
                        this.get_color(' .tb_toc_head svg', 'b_c_toc_mni_h', 'bg_c', 'background-color', 'h'),
                        this.get_color(' .tb_toc_head svg', 'f_c_toc_mni_h', null, null, 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_toc_head svg', 'p_toc_mni')
                    ],
                    h: [
                        this.get_padding(' .tb_toc_head svg', 'p_toc_mni', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .tb_toc_head svg', 'm_toc_mni')
                    ],
                    h: [
                        this.get_margin(' .tb_toc_head svg', 'm_toc_mni', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_toc_head svg', 'b_toc_mni')
                    ],
                    h: [
                        this.get_border(' .tb_toc_head svg', 'b_toc_mni', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .tb_toc_head svg', 'rc_toc_mni')
                    ],
                    h: [
                        this.get_border_radius(' .tb_toc_head svg', 'rc_toc_mni', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .tb_toc_head svg', 'sh_toc_mni')
                    ],
                    h: [
                        this.get_box_shadow(' .tb_toc_head svg', 'sh_toc_mni', 'h')
                    ]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                lcont: listContainer,
                litem: listItems,
                clcont: childListContainer,
                clitem: childListItems,
                minizeic: minIcon
            }
        };
    }
}