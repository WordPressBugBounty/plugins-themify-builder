const {BaseStyles} =await import ('../../editor/base-styles.mjs');
export class Module extends BaseStyles{
    static get_styles(){
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
						this.get_color_type([' .tb_title_accordion', ' .accordion-content']),
						this.get_font_size(),
						this.get_line_height(),
						this.get_letter_spacing(),
						this.get_text_align(),
						this.get_text_transform(),
						this.get_font_style(),
						this.get_text_decoration('', 't_d_r'),
						this.get_text_shadow()
                    ],
					h: [
						this.get_font_family('', 'f_f', 'h'),
						this.get_color_type([':hover .tb_title_accordion', ':hover .accordion-content'], '', 'f_c_t_h', 'f_c_h', 'f_g_c_h'),
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
						this.get_color([' .tb_title_accordion', ' a'], 'link_color'),
						this.get_text_decoration(' a')
                    ],
					h: [
						this.get_color([' .tb_title_accordion', ' a'], 'link_color', null, null, 'hover'),
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
						this.get_border('', 'border_accordion')
                    ],
					h: [
						this.get_border('', 'b_a', 'h')
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
				]
			),
			// Width
			this.get_expand('w', [
				this.get_width('', 'w')
            ]),
			// Height & Min Height
			this.get_expand('ht', [
                    this.get_height()
				]
			),
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
        accordionTitle = [
			// Background
			this.get_expand('bg', [
				this.get_tab({
					n: [
						this.get_image(['>.ui>li>.accordion-title'], 'bg_i', 'background_color_title', 'bg_r', 'bg_p')
					],
					h: [
						this.get_image(['>.ui>li>.accordion-title'], 'bg_i', 'b_c_t', 'bg_r', 'bg_p', 'h')
					]
                })
			]),
			// Font
			this.get_expand('f', [
				this.get_tab({
					n: [
							this.get_font_family('>.ui>li>.accordion-title', 'font_family_title'),
							this.get_color('>.ui>li>.accordion-title a', 'font_color_title'),
							this.get_font_size('>.ui>li>.accordion-title', 'font_size_title'),
							this.get_line_height('>.ui>li>.accordion-title', 'line_height_title'),
							this.get_letter_spacing('>.ui>li>.accordion-title', 'l_s_t'),
                            this.get_text_align('>.ui>li>.accordion-title', 'a_t_ta'),
							this.get_text_transform('>.ui>li>.accordion-title', 't_t_t'),
							this.get_font_style('>.ui>li>.accordion-title', 'f_s_t', 'f_t_b'),
							this.get_text_decoration('>.ui>li>.accordion-title', 't_d_t'),
							this.get_text_shadow('>.ui>li>.accordion-title', 't_sh_t')
					],
					h: [
							this.get_font_family('>.ui>li>.accordion-title', 'f_f_t', 'h'),
							this.get_color('>.ui>li>.accordion-title:hover a', 'f_c_t', null, null, ''),
							this.get_font_size(' >.ui>li>.accordion-title', 'f_s_t', '', 'h'),
							this.get_font_style('>.ui>li>.accordion-title', 'f_st_t', 'f_t_b', 'h'),
							this.get_text_decoration('>.ui>li>.accordion-title', 't_d_t', 'h'),
							this.get_text_shadow('>.ui>li>.accordion-title', 't_sh_t', 'h')
					]
                })
			]),
			// Border
			this.get_expand('b', [
				this.get_tab({
					n: [
						this.get_border('>.ui>li>.accordion-title', 'b_a_t')
					],
					h: [
						this.get_border('>.ui>li>.accordion-title', 'b_a_t', 'h')
					]
                })
			]),
			// Padding
			this.get_expand('p', [
				this.get_tab({
					n: [
						this.get_padding('>.ui>li>.accordion-title a', 'p_a_t')
					],
					h: [
						this.get_padding('>.ui>li>.accordion-title a', 'p_a_t', 'h')
					]
                })
			]),
			// Rounded Corners
			this.get_expand('r_c', [
				this.get_tab({
					n: [
						this.get_border_radius('>.ui>li>.accordion-title', 'r_c_t')
					],
					h: [
						this.get_border_radius('>.ui>li>.accordion-title', 'r_c_t', 'h')
					]
                })
			]),
			// Shadow
			this.get_expand('sh', [
				this.get_tab({
					n: [
						this.get_box_shadow(['>.ui>li>.accordion-title', '>.ui>li'], 'sh_t')
					],
					h: [
						this.get_box_shadow(['>.ui>li>.accordion-title', '>.ui>li'], 'sh_t', 'h')
					]
                })
			])
		],
		accordionIcon = [
			// Background
			this.get_expand('bg', [
				this.get_tab({
					n: [
						this.get_color('>.ui>li>.accordion-title .accordion-active-icon', 'b_c_i', 'obg_c', 'background-color'),
						this.get_color('>.ui>li>.accordion-title .accordion-icon', 'b_c_i_cd','cbg_c', 'background-color')
					],
					h: [
						this.get_color('>.ui>li>.accordion-title:hover .accordion-active-icon', 'b_c_i_h','obg_c', 'background-color'),
						this.get_color('>.ui>li>.accordion-title:hover .accordion-icon', 'b_c_i_cd_h', 'cbg_c', 'background-color')
					]
                })
			]),
			this.get_expand('f', [
				this.get_tab({
					n: [
						this.get_color('>.ui>li>.accordion-title .accordion-active-icon', 'icon_color','oiconc'),
						this.get_color('>.ui>li>.accordion-title .accordion-icon', 'icon_active_color', 'ciconc'),
						this.get_font_size('>.ui>li>.accordion-title i', 'icon_size', 'icons')
                    ],
					h: [
						this.get_color('>.ui>li>.accordion-title:hover .accordion-active-icon', 'i_c_h', 'oiconc'),
						this.get_color('>.ui>li>.accordion-title:hover .accordion-icon', 'i_a_c_h', 'ciconc'),
						this.get_font_size('>.ui>li>.accordion-title:hover i', 'i_s_h', 'icons')
                    ]
                })
            ]),
			// Padding
			this.get_expand('p', [
				this.get_tab({
					n: [
						this.get_padding('>.ui>li>.accordion-title i', 'p_a_i')
					],
					h: [
						this.get_padding('>.ui>li>.accordion-title:hover i', 'p_a_i_h', '')
					]
                })
			]),
			// Margin
			this.get_expand('m', [
				this.get_tab({
					n: [
						this.get_margin('>.ui>li>.accordion-title i', 'm_a_i')
					],
					h: [
						this.get_margin('>.ui>li>.accordion-title:hover i', 'm_a_i_h', '')
					]
                })
			]),
			// Border
			this.get_expand('b', [
				this.get_tab({
					n: [
						this.get_border('>.ui>li>.accordion-title i', 'b_a_i')
					],
					h: [
						this.get_border('>.ui>li>.accordion-title:hover i', 'b_a_i_h', '')
					]
                })
			]),
			// Rounded Corners
			this.get_expand('r_c', [
				this.get_tab({
					n: [
						this.get_border_radius('>.ui>li>.accordion-title i', 'r_c_a_in')
					],
					h: [
						this.get_border_radius('>.ui>li>.accordion-title:hover i', 'r_c_a_ic_h', '')
					]
                })
			]),
			// Shadow
			this.get_expand('sh', [
				this.get_tab({
					n: [
						this.get_box_shadow('>.ui>li>.accordion-title i', 'sh_a_in')
					],
					h: [
						this.get_box_shadow('>.ui>li>.accordion-title:hover i', 'sh_a_ic_h', '')
					]
                })
			])
		],
        accordionContent = [
			// Background
			this.get_expand('bg', [
				this.get_tab({
					n: [
						this.get_color('>.ui>li>.accordion-content', 'background_color_content', 'bg_c', 'background-color')
					],
					h: [
						this.get_color('>.ui>li>.accordion-content', 'b_c_c', 'bg_c', 'background-color', 'h')
					]
                })
			]),
			// Font
			this.get_expand('f', [
				this.get_tab({
					n: [
						this.get_font_family('>.ui>li>.accordion-content', 'font_family_content'),
						this.get_color('>.ui>li>.accordion-content', 'font_color_content'),
						this.get_font_size('>.ui>li>.accordion-content', 'font_size_content'),
						this.get_font_style('>.ui>li>.accordion-content', 'f_fs_c', 'f_fw_c'),
						this.get_line_height('>.ui>li>.accordion-content', 'line_height_content'),
						this.get_text_shadow('>.ui>li>.accordion-content', 't_sh_c')
					],
					h: [
						this.get_font_family('>.ui>li>.accordion-content', 'f_f_c', 'h'),
						this.get_color('>.ui>li>.accordion-content', 'f_c_c_h'),
						this.get_font_size('>.ui>li>.accordion-content', 'f_s_c', '', 'h'),
						this.get_font_style('>.ui>li>.accordion-content', 'f_fs_c', 'f_fw_c', 'h'),
						this.get_text_shadow('>.ui>li>.accordion-content', 't_sh_c', 'h')
					]
                })
			]),
			// Multi columns
			this.get_expand('col', [
				this.get_multi_columns_count('>.ui>li>.accordion-content')
			]),
			// Border
			this.get_expand('b', [
				this.get_tab({
					n: [
						this.get_border('>.ui>li>.accordion-content', 'b_a_c')
					],
					h: [
						this.get_border('>.ui>li>.accordion-content', 'b_a_c', 'h')
					]
                })
			]),
			// Padding
			this.get_expand('p', [
				this.get_tab({
					n: [
						this.get_padding('>.ui>li>.accordion-content', 'p_a_c')
					],
					h: [
						this.get_padding('>.ui>li>.accordion-content', 'p_a_c', 'h')
					]
                })
			]),
			// Rounded Corners
			this.get_expand('r_c', [
				this.get_tab({
					n: [
						this.get_border_radius('>.ui>li>.accordion-content', 'r_c_c')
                    ],
					h: [
						this.get_border_radius('>.ui>li>.accordion-content', 'r_c_c', 'h')
                    ]
                })
            ]),
			// Shadow
			this.get_expand('sh', [
				this.get_tab({
					n: [
						this.get_box_shadow('>.ui>li>.accordion-content', 'sh_c')
					],
					h: [
						this.get_box_shadow('>.ui>li>.accordion-content', 'sh_c', 'h')
					]
                })
            ])
		],
        accordionContainer = [
			// Background
			this.get_expand('bg', [
				this.get_tab({
					n: [
						this.get_color('>.ui>li', 'b_c_ct', 'bg_c', 'background-color')
					],
					h: [
						this.get_color('>.ui>li', 'b_c_ct', 'bg_c', 'background-color', 'h')
					]
                })
            ]),
			// Padding
			this.get_expand('p', [
				this.get_tab({
					n: [
						this.get_padding('>.ui>li', 'p_ct')
					],
					h: [
                        this.get_padding('>.ui>li', 'p_ct', 'h')
					]
                })
			]),
			// Margin
			this.get_expand('m', [
				this.get_tab({
					n: [
						this.get_margin('>.ui>li', 'm_ct')
                    ],
					h: [
						this.get_margin('>.ui>li', 'm_ct', 'h')
                    ]
                })
            ]),
			// Border
			this.get_expand('b', [
				this.get_tab({
					n: [
						this.get_border('>.ui>li', 'b_ct')
                    ],
					h: [
						this.get_border('>.ui>li', 'b_ct', 'h')
                    ]
                })
            ]),
			// Rounded Corners
			this.get_expand('r_c', [
				this.get_tab({
					n : [
						this.get_border_radius('>.ui>li', 'r_c_ct')
                    ],
					h :[
						this.get_border_radius('>.ui>li', 'r_c_ct', 'h')
                    ]
                })
			]),
			// Shadow
			this.get_expand('sh', [
				this.get_tab({
					n : [
						this.get_box_shadow('>.ui>li', 'sh_ct')
                    ],
					h : [
						this.get_box_shadow('>.ui>li', 'sh_ct', 'h')
                    ]
                })
            ])
		];

		return {
			type : 'tabs',
			options : {
				g : general,
				m_t : this.module_title_custom_style(),
				conter :  accordionContainer,
				title :accordionTitle,
				icon : accordionIcon,
				content : accordionContent
            }
        };
    }
}
