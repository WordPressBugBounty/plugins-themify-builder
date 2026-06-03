const { BaseStyles } = await import('../../editor/base-styles.mjs');

export class Module extends BaseStyles {
    static get_styles() {
        // ---- General: applies to the module wrapper ----
        const general = [
            this.get_expand('bg', [
                this.get_tab({
                    n: [this.get_image('')],
                    h: [this.get_image('', 'b_i_h', 'bg_c_h', 'b_r_h', 'b_p_h', 'h')]
                })
            ]),
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(''),
                        this.get_color('', 'font_color'),
                        this.get_font_size(''),
                        this.get_line_height(''),
                        this.get_letter_spacing(''),
                        this.get_text_align(''),
                        this.get_text_transform(''),
                        this.get_font_style(''),
                        this.get_text_decoration(''),
                        this.get_text_shadow('')
                    ],
                    h: [
                        this.get_font_family('', 'font_family', 'h'),
                        this.get_color('', 'font_color', null, 'color', 'h'),
                        this.get_font_size('', 'font_size', '', 'h')
                    ]
                })
            ]),
            this.get_expand('p', [
                this.get_tab({
                    n: [this.get_padding()],
                    h: [this.get_padding('', 'p', 'h')]
                })
            ]),
            this.get_expand('m', [
                this.get_tab({
                    n: [this.get_margin()],
                    h: [this.get_margin('', 'm', 'h')]
                })
            ]),
            this.get_expand('b', [
                this.get_tab({
                    n: [this.get_border()],
                    h: [this.get_border('', 'b', 'h')]
                })
            ]),
            this.get_expand('f_l', [
                this.get_tab({
                    n: [this.get_blend()],
                    h: [this.get_blend('', 'bl_m', 'h')]
                })
            ]),
            this.get_expand('w', [this.get_width('', 'w')]),
            this.get_expand('r_c', [
                this.get_tab({
                    n: [this.get_border_radius()],
                    h: [this.get_border_radius('', 'b_ra', 'h')]
                })
            ]),
            this.get_expand('sh', [
                this.get_tab({
                    n: [this.get_box_shadow()],
                    h: [this.get_box_shadow('', 'b_sh', 'h')]
                })
            ]),
            this.get_expand('zi', [this.get_zindex()]),
            this.get_expand('tr', [
                this.get_tab({
                    n: [this.get_transform()],
                    h: [this.get_transform('', 'tr', 'h')]
                })
            ])
        ];

        // ---- Table: applies to <table.tb_table> ----
        const tblSel = ' .tb_table';
        const tableStyle = [
            this.get_expand('bg', [
                this.get_tab({
                    n: [this.get_color(tblSel, 'tbl_bg_c', 'bg_c', 'background-color')],
                    h: [this.get_color(tblSel, 'tbl_bg_c', 'bg_c', 'background-color', 'h')]
                })
            ]),
            this.get_expand('b', [
                this.get_tab({
                    n: [this.get_border(tblSel, 'tbl_border')],
                    h: [this.get_border(tblSel, 'tbl_border', 'h')]
                })
            ]),
            this.get_expand('r_c', [
                this.get_tab({
                    n: [this.get_border_radius(tblSel, 'tbl_b_ra')],
                    h: [this.get_border_radius(tblSel, 'tbl_b_ra', 'h')]
                })
            ])
        ];

        // ---- Table Head: thead th ----
        const thSel = ' .tb_table thead th';
        const theadStyle = [
            this.get_expand('bg', [
                this.get_tab({
                    n: [this.get_color(thSel, 'th_bg_c', 'bg_c', 'background-color')],
                    h: [this.get_color(thSel, 'th_bg_c', 'bg_c', 'background-color', 'h')]
                })
            ]),
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(thSel, 'th_font_family'),
                        this.get_color(thSel, 'th_f_c'),
                        this.get_font_size(thSel, 'th_font_size'),
                        this.get_line_height(thSel, 'th_line_height'),
                        this.get_letter_spacing(thSel, 'th_letter_spacing'),
                        this.get_text_align(thSel, 'th_text_align'),
                        this.get_text_transform(thSel, 'th_text_transform'),
                        this.get_font_style(thSel, 'th_font_style', 'th_font_weight'),
                        this.get_text_decoration(thSel, 'th_text_decoration'),
                        this.get_text_shadow(thSel, 'th_text_shadow')
                    ],
                    h: [
                        this.get_color(thSel, 'th_f_c', null, 'color', 'h'),
                        this.get_font_size(thSel, 'th_font_size', '', 'h')
                    ]
                })
            ]),
            this.get_expand('valign', [this.get_vertical_align(thSel, 'th_va')]),
            this.get_expand('p', [
                this.get_tab({
                    n: [this.get_padding(thSel, 'th_padding')],
                    h: [this.get_padding(thSel, 'th_padding', 'h')]
                })
            ]),
            this.get_expand('b', [
                this.get_tab({
                    n: [this.get_border(thSel, 'th_border')],
                    h: [this.get_border(thSel, 'th_border', 'h')]
                })
            ]),
            this.get_expand('r_c', [
                this.get_tab({
                    n: [this.get_border_radius(thSel, 'th_b_ra')],
                    h: [this.get_border_radius(thSel, 'th_b_ra', 'h')]
                })
            ])
        ];

        // ---- Freeze Head: styles apply only while header is stuck ----
        const fhSel = '.tb_freeze_head_active .tb_table thead th';
        const freezeHeadStyle = [
            this.get_expand('bg', [
                this.get_tab({
                    n: [this.get_color(fhSel, 'fh_bg_c', 'bg_c', 'background-color')],
                    h: [this.get_color(fhSel, 'fh_bg_c', 'bg_c', 'background-color', 'h')]
                })
            ]),
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(fhSel, 'fh_font_family'),
                        this.get_color(fhSel, 'fh_f_c'),
                        this.get_font_size(fhSel, 'fh_font_size'),
                        this.get_line_height(fhSel, 'fh_line_height'),
                        this.get_letter_spacing(fhSel, 'fh_letter_spacing'),
                        this.get_text_align(fhSel, 'fh_text_align'),
                        this.get_text_transform(fhSel, 'fh_text_transform'),
                        this.get_font_style(fhSel, 'fh_font_style', 'fh_font_weight'),
                        this.get_text_decoration(fhSel, 'fh_text_decoration'),
                        this.get_text_shadow(fhSel, 'fh_text_shadow')
                    ],
                    h: [
                        this.get_color(fhSel, 'fh_f_c', null, 'color', 'h'),
                        this.get_font_size(fhSel, 'fh_font_size', '', 'h')
                    ]
                })
            ]),
            this.get_expand('p', [
                this.get_tab({
                    n: [this.get_padding(fhSel, 'fh_padding')],
                    h: [this.get_padding(fhSel, 'fh_padding', 'h')]
                })
            ]),
            this.get_expand('b', [
                this.get_tab({
                    n: [this.get_border(fhSel, 'fh_border')],
                    h: [this.get_border(fhSel, 'fh_border', 'h')]
                })
            ]),
            this.get_expand('sh', [
                this.get_tab({
                    n: [this.get_box_shadow(fhSel, 'fh_b_sh')],
                    h: [this.get_box_shadow(fhSel, 'fh_b_sh', 'h')]
                })
            ])
        ];

        // ---- Freeze Column: styles apply only while first column is stuck ----
        const fcSel = '.tb_freeze_col_active .tb_table tr > :first-child';
        const freezeColStyle = [
            this.get_expand('bg', [
                this.get_tab({
                    n: [this.get_color(fcSel, 'fc_bg_c', 'bg_c', 'background-color')],
                    h: [this.get_color(fcSel, 'fc_bg_c', 'bg_c', 'background-color', 'h')]
                })
            ]),
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(fcSel, 'fc_font_family'),
                        this.get_color(fcSel, 'fc_f_c'),
                        this.get_font_size(fcSel, 'fc_font_size'),
                        this.get_line_height(fcSel, 'fc_line_height'),
                        this.get_letter_spacing(fcSel, 'fc_letter_spacing'),
                        this.get_text_align(fcSel, 'fc_text_align'),
                        this.get_text_transform(fcSel, 'fc_text_transform'),
                        this.get_font_style(fcSel, 'fc_font_style', 'fc_font_weight'),
                        this.get_text_decoration(fcSel, 'fc_text_decoration'),
                        this.get_text_shadow(fcSel, 'fc_text_shadow')
                    ],
                    h: [
                        this.get_color(fcSel, 'fc_f_c', null, 'color', 'h'),
                        this.get_font_size(fcSel, 'fc_font_size', '', 'h')
                    ]
                })
            ]),
            this.get_expand('p', [
                this.get_tab({
                    n: [this.get_padding(fcSel, 'fc_padding')],
                    h: [this.get_padding(fcSel, 'fc_padding', 'h')]
                })
            ]),
            this.get_expand('b', [
                this.get_tab({
                    n: [this.get_border(fcSel, 'fc_border')],
                    h: [this.get_border(fcSel, 'fc_border', 'h')]
                })
            ]),
            this.get_expand('sh', [
                this.get_tab({
                    n: [this.get_box_shadow(fcSel, 'fc_b_sh')],
                    h: [this.get_box_shadow(fcSel, 'fc_b_sh', 'h')]
                })
            ])
        ];

        // ---- Table Cell: tbody td ----
        const tdSel = ' .tb_table tbody td';
        const tdHoverSel = ' .tb_table tbody tr:hover td';
        const cellStyle = [
            this.get_expand('bg', [
                this.get_tab({
                    n: [this.get_color(tdSel, 'td_bg_c', 'bg_c', 'background-color')],
                    h: [this.get_color(tdHoverSel, 'td_bg_c_h', 'bg_c', 'background-color')]
                })
            ]),
            this.get_expand('f', [
                this.get_tab({
                    n: [
                        this.get_font_family(tdSel, 'td_font_family'),
                        this.get_color(tdSel, 'td_f_c'),
                        this.get_font_size(tdSel, 'td_font_size'),
                        this.get_line_height(tdSel, 'td_line_height'),
                        this.get_letter_spacing(tdSel, 'td_letter_spacing'),
                        this.get_text_align(tdSel, 'td_text_align'),
                        this.get_text_transform(tdSel, 'td_text_transform'),
                        this.get_font_style(tdSel, 'td_font_style', 'td_font_weight'),
                        this.get_text_decoration(tdSel, 'td_text_decoration'),
                        this.get_text_shadow(tdSel, 'td_text_shadow')
                    ],
                    h: [
                        this.get_color(tdHoverSel, 'td_f_c_h'),
                        this.get_font_size(tdSel, 'td_font_size', '', 'h')
                    ]
                })
            ]),
            this.get_expand('valign', [this.get_vertical_align(tdSel, 'td_va')]),
            this.get_expand('p', [
                this.get_tab({
                    n: [this.get_padding(tdSel, 'td_padding')],
                    h: [this.get_padding(tdSel, 'td_padding', 'h')]
                })
            ]),
            this.get_expand('b', [
                this.get_tab({
                    n: [this.get_border(tdSel, 'td_border')],
                    h: [this.get_border(tdHoverSel, 'td_border_h')]
                })
            ]),
            this.get_expand('r_c', [
                this.get_tab({
                    n: [this.get_border_radius(tdSel, 'td_b_ra')],
                    h: [this.get_border_radius(tdSel, 'td_b_ra', 'h')]
                })
            ])
        ];

        return {
            type: 'tabs',
            options: {
                g: general,
                tbl: tableStyle,
                tbl_h: theadStyle,
                tbl_c: cellStyle,
                tbl_fh: freezeHeadStyle,
                tbl_fc: freezeColStyle
            }
        };
    }
}
