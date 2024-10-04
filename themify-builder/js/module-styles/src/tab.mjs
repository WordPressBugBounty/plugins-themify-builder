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
                        this.get_color_type([' .tab-content', ' .tab-nav a']),
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
                        this.get_font_family('', 'f_f', 'h'),
                        this.get_color_type([':hover .tab-content', ':hover .tab-nav a'], '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
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
                        this.get_color(['.ui a', '.ui .tab-nav a'], 'link_color'),
                        this.get_text_decoration('.ui a')
                    ],
                    h: [
                        this.get_color(['.ui a', '.ui .tab-nav a'], 'link_color', null, null, 'hover'),
                        this.get_text_decoration('.ui a', 't_d', 'h')
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
          //  this.get_expand('disp', this.get_self_align()),
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
        title = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_image('>.tab-nav li', 'bg_i', 'background_color_title', 'bg_r', 'bg_p')
                    ],
                    h: [
                        this.get_image('>.tab-nav li', 'bg_i', 'b_c_t', 'bg_r', 'bg_p', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('.ui.ui>.tab-nav a', 'font_family_title'),
                        this.get_color('.ui>.tab-nav a', 'font_color_title', 'f_c'),
                        this.get_font_size('.ui>.tab-nav a', 'font_size_title'),
                        this.get_line_height('.ui>.tab-nav a', 'line_height_title'),
                        this.get_letter_spacing('.ui>.tab-nav a', 'letter_spacing_title'),
                        this.get_text_align(['>.tab-nav', '>.tab-nav li'], 'title_text_align'),
                        this.get_text_transform('.ui>.tab-nav a', 't_t_t'),
                        this.get_font_style('.ui>.tab-nav a', 'f_sy_t', 'f_t_b'),
                        this.get_text_shadow('.ui>.tab-nav a', 't_sh_t')
                    ],
                    h: [
                        this.get_font_family('.ui>.tab-nav a', 'f_f_t', 'h'),
                        this.get_color('>.tab-nav li:hover a', 'f_c_t_h'),
                        this.get_font_size('.ui>.tab-nav a', 'f_s_t', '', 'h'),
                        this.get_font_style('.ui>.tab-nav a', 'f_sy_t', 'f_t_b', 'h'),
                        this.get_text_shadow('.ui>.tab-nav a', 't_sh_t', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding('.ui>.tab-nav a', 't_p')
                    ],
                    h: [
                        this.get_padding('.ui>.tab-nav a', 't_p', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin('>.tab-nav li', 't_m')
                    ],
                    h: [
                        this.get_margin('>.tab-nav li', 't_m', 'h')
                    ]
                })
            ]),
            // Active Tab
            this.get_expand('acttab', [
                this.get_tab({
                    n: [
                        this.get_color('.ui>.tab-nav .current a', 'active_font_color_title', 'colact'),
                        this.get_image('.ui>.tab-nav .current', 'bg_i', 'active_background_color_title', 'bg_r', 'bg_p'),
                        this.get_border('.ui>.tab-nav .current', 'active_tab_border')
                    ],
                    h: [
                        this.get_color('.ui>.tab-nav .current a:hover', 'active_hover_font_color_title', 'colact'),
                        this.get_image('.ui>.tab-nav .current:hover', 'bg_i_h', 'active_hover_background_color_title', 'bg_r_h', 'bg_i_h'),
                        this.get_border('.ui>.tab-nav .current', 't_b','h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('>.tab-nav li', 'title_border')
                    ],
                    h: [
                        this.get_border('>.tab-nav li', 't_b', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius('>.tab-nav li', 't_r_c')
                    ],
                    h: [
                        this.get_border_radius('>.tab-nav li', 't_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow('>.tab-nav li', 't_b_sh')
                    ],
                    h: [
                        this.get_box_shadow('>.tab-nav li', 't_b_sh', 'h')
                    ]
                })
            ])
        ],
        icon = [
            this.get_expand('c', [
                this.get_tab({
                    n: [
                        this.get_color('>.tab-nav em', 'icon_color'),
                        this.get_font_size('.ui .tab-nav li em', 'icon_size')
                    ],
                    h: [
                        this.get_color('>.tab-nav em', 'i_c', null, null, 'h'),
                        this.get_font_size('>.tab-nav em', 'i_s', '', 'h')
                    ]
                })
            ]),
            // Active Tab
            this.get_expand('acttab', [
                this.get_tab({
                    n: [
                        this.get_color('.ui>.tab-nav .current em', 'active_tab_icon_color')
                    ],
                    h: [
                        this.get_color('.ui>.tab-nav .current em', 'a_t_i_c', null, null, 'h')
                    ]
                })
            ])
        ],
        content = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color('>.tab-content', 'background_color_content', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color('>.tab-content', 'b_c_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('>.tab-content', 'font_family_content'),
                        this.get_color('>.tab-content', 'font_color_content'),
                        this.get_font_size('>.tab-content', 'font_size_content'),
                        this.get_font_style('>.tab-content', 'f_fs_c', 'f_fw_c'),
                        this.get_line_height('>.tab-content', 'line_height_content'),
                        this.get_text_shadow('>.tab-content', 't_sh_c')
                    ],
                    h: [
                        this.get_font_family('>.tab-content', 'f_f_c', 'h'),
                        this.get_color('>.tab-content', 'f_c_c',null,null,'h'),
                        this.get_font_size('>.tab-content', 'f_s_c', '', 'h'),
                        this.get_font_style('>.tab-content', 'f_fs_c', 'f_fw_c', 'h'),
                        this.get_text_shadow('>.tab-content', 't_sh_c', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding('>.tab-content', 'p_c')
                    ],
                    h: [
                        this.get_padding('>.tab-content', 'p_c', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('>.tab-content', 'b_c')
                    ],
                    h: [
                        this.get_border('>.tab-content', 'b_c', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius('>.tab-content', 't_c_r_c')
                    ],
                    h: [
                        this.get_border_radius('>.tab-content', 't_c_r_c', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow('>.tab-content', 't_c_b_sh')
                    ],
                    h: [
                        this.get_box_shadow('>.tab-content', 't_c_b_sh', 'h')
                    ]
                })
            ])
        ],
        mobileTab = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color('>.tab-nav-current-active', 'b_c_m_t', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color('>.tab-nav-current-active', 'b_c_m_t', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family('>.tab-nav-current-active', 'f_f_m_t'),
                        this.get_color('>.tab-nav-current-active', 'f_c_m_t'),
                        this.get_font_size('>.tab-nav-current-active', 'f_s_m_t'),
                        this.get_font_style('>.tab-nav-current-active', 'f_fs_m_t', 'f_fw_m_t'),
                        this.get_line_height('>.tab-nav-current-active', 'l_h_m_t'),
                        this.get_text_shadow('>.tab-nav-current-active', 't_sh_m_t')
                    ],
                    h: [
                        this.get_font_family('>.tab-nav-current-active', 'f_f_m_t', 'h'),
                        this.get_color('>.tab-nav-current-active:hover', 'f_c_m_t_h'),
                        this.get_font_size('>.tab-nav-current-active', 'f_s_m_t', '', 'h'),
                        this.get_font_style('>.tab-nav-current-active', 'f_fs_m_t', 'f_fw_m_t', 'h'),
                        this.get_text_shadow('>.tab-nav-current-active', 't_sh_m_t', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding('>.tab-nav-current-active', 'p_m_t')
                    ],
                    h: [
                        this.get_padding('>.tab-nav-current-active', 'p_m_t', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border('>.tab-nav-current-active', 'b_m_t')
                    ],
                    h: [
                        this.get_border('>.tab-nav-current-active', 'b_m_t', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius('>.tab-nav-current-active', 'r_c_m_t')
                    ],
                    h: [
                        this.get_border_radius('>.tab-nav-current-active', 'r_c_m_t', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow('>.tab-nav-current-active', 'b_sh_m_t')
                    ],
                    h: [
                        this.get_box_shadow('>.tab-nav-current-active', 'b_sh_m_t', 'h')
                    ]
                })
            ])
        ],
        tabtbar = [
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .tb_tab_timerbar', 'timerbg', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .tb_tab_timerbar', 'timerbg', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            this.get_expand('ht', [
                this.get_height( ' .tb_tab_timerbar', 'timerh' )
            ]),
        ],
        desc = [
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .tb_tab_desc', 'ti_ff'),
                        this.get_color_type(' .tb_tab_desc', '', 'ti_c', 'ti_cs', 'ti_cg'),
                        this.get_font_size(' .tb_tab_desc', 'ti_fs'),
                        this.get_line_height(' .tb_tab_desc', 'ti_lh'),
                        this.get_letter_spacing(' .tb_tab_desc', 'ti_ls'),
                        this.get_text_align(' .tb_tab_desc', 'ti_ta'),
                        this.get_text_transform(' .tb_tab_desc', 'ti_tt'),
                        this.get_font_style(' .tb_tab_desc', 'ti_fst', 'ti_fw'),
                        this.get_text_decoration(' .tb_tab_desc', 'ti_td'),
                        this.get_text_shadow(' .tb_tab_desc', 'ti_ts')
                    ],
                    h: [
                        this.get_font_family(' .tb_tab_desc', 'ti_ff', 'h'),
                        this.get_color_type(' .tb_tab_desc', 'h', 'ti_c', 'ti_cs', 'ti_cg'),
                        this.get_font_size(' .tb_tab_desc', 'ti_fs', '', 'h'),
                        this.get_font_style(' .tb_tab_desc', 'ti_fst', 'ti_fw', 'h'),
                        this.get_text_decoration(' .tb_tab_desc', 'ti_td', 'h'),
                        this.get_text_shadow(' .tb_tab_desc', 'ti_ts', 'h')
                    ]
                })
            ]),
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .tb_tab_desc', 'ti_p')
                    ],
                    h: [
                        this.get_padding(' .tb_tab_desc', 'ti_p', 'h')
                    ]
                })
            ]),
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .tb_tab_desc', 'ti_b')
                    ],
                    h: [
                        this.get_border(' .tb_tab_desc', 'ti_b', 'h')
                    ]
                })
            ]),
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                title: title,
                icon: icon,
                content: content,
                tabmob: mobileTab,
                tabtbar : tabtbar,
                desc : desc
            }
        };
    }
}