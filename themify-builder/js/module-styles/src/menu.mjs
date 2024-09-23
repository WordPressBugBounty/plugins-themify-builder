const {BaseStyles} = await import('../../editor/base-styles.mjs');
export class Module extends BaseStyles {
    static get_styles() {
        const general = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .nav', 'background_color', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .nav', 'bg_c', 'bg_c', 'background-color', 'h')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .nav li'),
                        this.get_color(' .nav li a', 'font_color'),
                        this.get_font_size(' .nav li'),
                        this.get_line_height(' .nav li'),
                        this.get_letter_spacing(' .nav li'),
                        this.get_text_align('.module'),
                        this.get_text_transform(' .nav li'),
                        this.get_font_style(' .nav li'),
                        this.get_text_shadow(' .nav li')
                    ],
                    h: [
                        this.get_font_family(' .nav li', 'f_f', 'h'),
                        this.get_color(' .nav li a', 'f_c', null, null, 'h'),
                        this.get_font_size(' .nav li', 'f_s', '', 'h'),
                        this.get_font_style(' .nav li:hover', 'f_st_h', 'f_w_h', 'h'),
                        this.get_text_shadow(' .nav li', 't_sh', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding('.module')
                    ],
                    h: [
                        this.get_padding('.module', 'p', 'h')
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
                        this.get_border('')
                    ],
                    h: [
                        this.get_border('', 'b', 'h')
                    ]
                })
            ]),
            // Filter
            this.get_expand('f_l',[
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
                this.get_width(['', ' .vertical'], 'w')
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
            // Position
            this.get_expand('po', [this.get_css_position()]),
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
        menuLinks = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' .nav > li > a', 'link_background_color', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .nav > li > a', 'link_background_color', 'bg_c', 'background-color', 'hover')
                    ]
                })
            ]),
            // Link
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_color('.module .nav > li > a', 'link_color'),
                        this.get_text_decoration('.module .nav > li > a')
                    ],
                    h: [
                        this.get_color('.module .nav > li > a', 'link_color', null, null, 'hover'),
                        this.get_text_decoration('.module .nav > li > a', 't_d', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' .nav > li > a', 'p_m_l')
                    ],
                    h: [
                        this.get_padding(' .nav > li > a', 'p_m_l', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' .nav > li > a', 'm_m_l')
                    ],
                    h: [
                        this.get_margin(' .nav > li > a', 'm_m_l', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' .nav > li > a', 'b_m_l')
                    ],
                    h: [
                        this.get_border(' .nav > li > a', 'b_m_l', 'h')
                    ]
                })
            ]),
            // Rounded Corners
            this.get_expand('r_c', [
                this.get_tab({
                    n: [
                        this.get_border_radius(' .nav > li > a', 'r_c_m_l')
                    ],
                    h: [
                        this.get_border_radius(' .nav > li > a', 'r_c_m_l', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(' .nav > li > a', 'sh_m_l')
                    ],
                    h: [
                        this.get_box_shadow(' .nav > li > a', 'sh_m_l', 'h')
                    ]
                })
            ])
        ],
        currentMenuLinks = [
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(['.module .nav li.current_page_item > a', '.module .nav li.current-menu-item > a'], 'current-links_background_color', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(['.module .nav li.current_page_item > a:hover', '.module .nav li.current-menu-item > a:hover'], 'current-links_hover_background_color', 'bg_c', 'background-color')

                    ]
                })
            ]),
            // Link
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_color(['.module .nav li.current_page_item > a', '.module .nav li.current-menu-item > a'], 'current-links_color'),
                        this.get_text_decoration(['.module .nav li.current_page_item > a', '.module .nav li.current-menu-item > a'], 'current-links_text_decoration')
                    ],
                    h: [
                        this.get_color(['.module li.current_page_item > a:hover', '.module li.current-menu-item > a:hover'], 'current-links_color_hover'),
                        this.get_text_decoration(['.module li.current_page_item > a', '.module li.current-menu-item > a'], 'c-l_t_d', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(['.module .nav li.current_page_item > a', '.module .nav li.current-menu-item > a'], 'b_m_c_l')
                    ],
                    h: [
                        this.get_border(['.module .nav li.current_page_item > a', '.module .nav li.current-menu-item > a'], 'b_m_c_l', 'h')
                    ]
                })
            ]),
            // Shadow
            this.get_expand('sh', [
                this.get_tab({
                    n: [
                        this.get_box_shadow(['.module .nav li.current_page_item > a', '.module .nav li.current-menu-item > a'], 'sh_m_c_l')
                    ],
                    h: [
                        this.get_box_shadow(['.module .nav li.current_page_item > a', '.module .nav li.current-menu-item > a'], 'sh_m_c_l', 'h')
                    ]
                })
            ])
        ],
        menuDropdownLinks = [
            // Container Background
            this.get_expand('conter', [
                this.get_tab({
                    n: [
                        this.get_color(' li > .sub-menu', 'd_l_ctn_b_c', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' li > .sub-menu:hover', 'd_l_ctn_b_c_h', 'bg_h', 'background-color')
                    ]
                })
            ]),
            // Background
            this.get_expand('bg', [
                this.get_tab({
                    n: [
                        this.get_color(' li > .sub-menu a', 'dropdown_links_background_color', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' li > .sub-menu a:hover', 'dropdown_links_hover_background_color', 'bg_h', 'background-color')
                    ]
                })
            ]),
            // Font
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(' .nav li > .sub-menu a', 'font_family_menu_dropdown_links'),
                        this.get_color(' .nav li > .sub-menu a', 'dropdown_links_color'),
                        this.get_font_size(' .nav li > .sub-menu a', 'font_size_menu_dropdown_links'),
                        this.get_line_height(' .nav li > .sub-menu a', 'l_h_m_d_l'),
                        this.get_letter_spacing(' .nav li > .sub-menu a', 'l_s_m_d_l'),
                        this.get_text_align(' .nav li > .sub-menu a', 't_a_m_d_l'),
                        this.get_text_transform(' .nav li > .sub-menu a', 't_t_m_d_l'),
                        this.get_font_style(' .nav li > .sub-menu a', 'f_d_l', 'f_d_b'),
                        this.get_text_decoration(' .nav li > .sub-menu a', 't_d_m_d_l'),
                        this.get_text_shadow(' .nav li > .sub-menu a', 't_sh_l')
                    ],
                    h: [
                        this.get_font_family(' .nav li > .sub-menu a', 'f_f_m_d_l', 'h'),
                        this.get_color(' .nav li > .sub-menu a:hover', 'dropdown_links_hover_color', 'c_h'),
                        this.get_font_size(' .nav li > .sub-menu a', 'f_s_m_d_l', '', 'h'),
                        this.get_font_style(' .nav li > .sub-menu a', 'f_d_l', 'f_d_b', 'h'),
                        this.get_text_decoration(' .nav li > .sub-menu a', 't_d_m_d_l', 'h'),
                        this.get_text_shadow(' .nav li > .sub-menu a', 't_sh_l', 'h')
                    ]
                })
            ]),
            // Padding
            this.get_expand('p', [
                this.get_tab({
                    n: [
                        this.get_padding(' li > .sub-menu a', 'd_l_p')
                    ],
                    h: [
                        this.get_padding(' li > .sub-menu a', 'd_l_p_h', 'h')
                    ]
                })
            ]),
            // Margin
            this.get_expand('m', [
                this.get_tab({
                    n: [
                        this.get_margin(' li > .sub-menu a', 'd_l_m')
                    ],
                    h: [
                        this.get_margin(' li > .sub-menu a', 'd_l_m_h', 'h')
                    ]
                })
            ]),
            // Border
            this.get_expand('b', [
                this.get_tab({
                    n: [
                        this.get_border(' li > .sub-menu a', 'd_l_b')
                    ],
                    h: [
                        this.get_border(' li > .sub-menu a', 'd_l_b_h', 'h')
                    ]
                })
            ])
        ],
        menuMobile = [
            // Background
            this.get_expand('panel', [
                this.get_tab({
                    n: [
                        this.get_color(['.mobile-menu-module', '.mobile-menu-dropdown.module-menu-mobile-active .nav'], 'mobile_menu_background_color', 'bg_c', 'background-color'),
                        this.get_padding(['.mobile-menu-module', '.mobile-menu-dropdown.module-menu-mobile-active .nav'], 'p_m_m_ct'),
                        this.get_border(['.mobile-menu-module', '.mobile-menu-dropdown.module-menu-mobile-active .nav'], 'b_m_m_ct'),
                        this.get_box_shadow(['.mobile-menu-module', '.mobile-menu-dropdown.module-menu-mobile-active .nav'], 'sh_m_m_ct'),
                        this.get_width(['.mobile-menu-module', '.mobile-menu-dropdown.module-menu-mobile-active .nav'], 'wh_m_m_ct')
                    ],
                    h: [
                        this.get_color(['.mobile-menu-module', '.mobile-menu-dropdown.module-menu-mobile-active .nav'], 'm_m_b_c', 'bg_c', 'background-color', null, 'h'),
                        this.get_padding(['.mobile-menu-module', '.mobile-menu-dropdown.module-menu-mobile-active .nav'], 'p_m_m_ct', 'h'),
                        this.get_border(['.mobile-menu-module', '.mobile-menu-dropdown.module-menu-mobile-active .nav'], 'b_m_m_ct', 'h'),
                        this.get_box_shadow(['.mobile-menu-module', '.mobile-menu-dropdown.module-menu-mobile-active .nav'], 'sh_m_m_ct', 'h')
                    ]
                })
            ]),
            // Link
            this.get_expand('l', [
                this.get_tab({
                    n: [
                        this.get_font_family(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'f_f_m_m'),
                        this.get_color(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'm_c_m_m'),
                        this.get_font_size(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'f_s_m_m'),
                        this.get_line_height(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'l_h_m_m'),
                        this.get_letter_spacing(['.mobile-menu-module li a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'l_s_m_m'),
                        this.get_text_align(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 't_a_m_m'),
                        this.get_text_transform(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 't_t_m_m'),
                        this.get_font_style(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'f_sy_m_m', 'f_b_m_m'),
                        this.get_text_decoration(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 't_d_m_m'),
                        this.get_text_shadow(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 't_sh_m'),
                        this.get_color(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'bg_c', 'bg_c','background-color'),
                        this.get_padding(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'p_m_m'),
                        this.get_margin(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'm_m_m'),
                        this.get_border(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'b_m_m')
                    ],
                    h: [
                        this.get_font_family(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'f_f_m_m', 'h'),
                        this.get_color(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'm_c_h_m_m', null, null, 'h'),
                        this.get_font_size(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'f_s_m_m', '', 'h'),
                        this.get_font_style(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'f_sy_m_m', 'f_b_m_m', 'h'),
                        this.get_text_decoration(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 't_d_m_m', 'h'),
                        this.get_text_shadow(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 't_sh_m', 'h'),
                        this.get_color(['.mobile-menu-module .nav a:hover', '.mobile-menu-dropdown.module-menu-mobile-active li a:hover'], 'b_c_m_m_h', 'bg_c', 'background-color', null, 'h'),
                        this.get_padding(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'p_m_m', 'h'),
                        this.get_margin(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'm_m_m', 'h'),
                        this.get_border(['.mobile-menu-module .nav a', '.mobile-menu-dropdown.module-menu-mobile-active li a'], 'b_m_m', 'h')
                    ]
                })
            ]),
            // current Menu Link
            this.get_expand('curlinks', [
                this.get_tab({
                    n: [
                        this.get_color(['.mobile-menu-module li.current_page_item > a', '.mobile-menu-module li.current-menu-item > a'], 'mm_c_l_bg_c', 'bg_c', 'background-color'),
                        this.get_color(['.mobile-menu-module li.current_page_item > a', '.mobile-menu-module li.current-menu-item > a'], 'mm_c_l_c'),
                        this.get_border(['.mobile-menu-module li.current_page_item > a', '.mobile-menu-module li.current-menu-item > a'], 'mm_c_l_b')
                    ],
                    h: [
                        this.get_color(['.mobile-menu-module li.current_page_item > a:hover', '.mobile-menu-module li.current-menu-item > a:hover'], 'mm_c_l_bg_c_h', 'bg_c', 'background-color'),
                        this.get_color(['.mobile-menu-module li.current_page_item > a:hover', '.mobile-menu-module li.current-menu-item > a:hover'], 'mm_c_l_c_h', null, null, 'h'),
                        this.get_border(['.mobile-menu-module li.current_page_item > a:hover', '.mobile-menu-module li.current-menu-item > a:hover'], 'mm_c_l_b_h', 'h')
                    ]
                })
            ]),
            // Overlay
            this.get_expand('overlay', [
                this.get_tab({
                    n: [
                        this.get_color(' .body-overlay', 'b_c_m_m_o', 'bg_c', 'background-color')
                    ],
                    h: [
                        this.get_color(' .body-overlay:hover', 'b_c_m_m_o', 'bg_c', 'background-color', null, 'h')
                    ]
                })
            ]),
            // Burger Icon
            this.get_expand('bicon', [
                this.get_tab({
                    n: [
                        this.get_color(' .menu-module-burger', 'b_c_m_m_i', 'bg_c', 'background-color'),
                        this.get_color(' .menu-module-burger', 'c_m_m_i'),
                        this.get_padding(' .menu-module-burger', 'p_m_m_i'),
                        this.get_margin(' .menu-module-burger', 'm_m_m_i'),
                        this.get_border(' .menu-module-burger', 'b_m_m_i'),
                        this.get_width([' .menu-module-burger', ' .menu-module-burger-inner'], 'w_m_m_i'),
                        this.get_height(' .menu-module-burger-inner', 'h_m_m_i', '', 'mi_m_i', 'mx_m_i')
                    ],
                    h: [
                        this.get_color(' .menu-module-burger:hover', 'b_c_m_m_i_h', 'bg_c', 'background-color', null, 'h'),
                        this.get_color(' .menu-module-burger', 'c_m_m_i_h', null, null, 'h'),
                        this.get_padding(' .menu-module-burger', 'p_m_m_i', 'h'),
                        this.get_margin(' .menu-module-burger', 'm_m_m_i', 'h'),
                        this.get_border(' .menu-module-burger', 'b_m_m_i', 'h')
                    ]
                })
            ]),
            // Close Button
            this.get_expand('clsbtn', [
                this.get_tab({
                    n: [
                        this.get_color('.mobile-menu-module .menu-close', 'b_c_m_m_cb', 'bg_c', 'background-color'),
                        this.get_color('.mobile-menu-module .menu-close', 'c_m_m_cb'),
                        this.get_padding('.mobile-menu-module .menu-close', 'p_m_m_cb'),
                        this.get_margin('.mobile-menu-module .menu-close', 'm_m_m_cb'),
                        this.get_border('.mobile-menu-module .menu-close', 'b_m_m_cb'),
                        this.get_width(['.mobile-menu-module .menu-close'], 'w_m_m_cb'),
                        this.get_height('.mobile-menu-module .menu-close', 'h_m_m_cb', '', 'mi_m_cb', 'mx_m_cb'),
                        this.get_border_radius('.mobile-menu-module .menu-close', 'r_c_m_m_cb'),
                        this.get_box_shadow('.mobile-menu-module .menu-close', 'sh_m_m_cb')
                    ],
                    h: [
                        this.get_color('.mobile-menu-module .menu-close:hover', 'b_c_m_m_cb_h', 'bg_c', 'background-color', null, 'h'),
                        this.get_color('.mobile-menu-module .menu-close', 'c_m_m_cb_h', null, null, 'h'),
                        this.get_padding('.mobile-menu-module .menu-close', 'p_m_m_cb', 'h'),
                        this.get_margin('.mobile-menu-module .menu-close', 'm_m_m_cb', 'h'),
                        this.get_border('.mobile-menu-module .menu-close', 'b_m_m_cb', 'h'),
                        this.get_border_radius('.mobile-menu-module .menu-close', 'r_c_m_m_cb', 'h'),
                        this.get_box_shadow('.mobile-menu-module .menu-close', 'sh_m_m_cb', 'h')
                    ]
                })
            ])
        ];
        return {
            type: 'tabs', 
            options: {
                g: general,
                m_t: this.module_title_custom_style(),
                menulnk: menuLinks,
                curlinks: currentMenuLinks,
                drpdwnl: menuDropdownLinks,
                mobmenu: menuMobile
            }
        };
    }
}