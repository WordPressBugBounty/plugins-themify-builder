(api => {
    "use strict";
    api.ModuleOverlayContent = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'selected_layout_part',
                    type: 'layoutPart',
                    label: 'layoutPart',
                    required: {
                        message: 'lpartmsg'
                    },
                    add_url: themifyBuilder.admin_url + '/post-new.php?post_type=tbuilder_layout_part',
                    edit_url: themifyBuilder.admin_url + '/edit.php?post_type=tbuilder_layout_part'
                },
                {
                    type: 'multi',
                    label: 'ovdim',
                    options: [
                        {
                            id: 'overlay_width',
                            default:100,
                            label: 'w',
                            type: 'range',
                            units: {
                                '%': '',
                                vw: '',
                                px: {
                                    max: 5000
                                }
                            }
                        },
                        {
                            id: 'overlay_height',
                            default:100,
                            label: 'ht',
                            type: 'range',
                            units: {
                                '%': '',
                                vh: '',
                                px: {
                                    max: 5000
                                }
                            }
                        }
                    ]
                },
                {
                    id: 'overlay_type',
                    type: 'radio',
                    label: 'ovst',
                    options: [
                        {
                            value: 'overlay',
                            name: 'overlay'
                        },
                        {
                            value: 'expandable',
                            name: 'expandable'
                        }
                    ],
                    option_js: true,
                    wrap_class: 'tb_group_element_overlay tb_group_element_expandable'
                },
                {
                    id: 'style',
                    label: '',
                    type: 'select',
                    options: {
                        overlay: 'fadein',
                        slide_down: 'sldwn',
                        slide_left: 'sllft',
                        slide_right: 'slrgt',
                        slide_up: 'slup'
                    },
                    wrap_class: 'tb_group_element_overlay'
                },
                {
                    id: 'expand_mode',
                    label: 'openas',
                    type: 'select',
                    options: {
                        overlap: 'overlap',
                        below: 'below'
                    },
                    wrap_class: 'tb_group_element_expandable'
                },
                {
                    id: 'icon',
                    type: 'icon',
                    label: 'icon',
                    class: 'large'
                },
                {
                    id: 'icon_title',
                    type: 'text',
                    class: 'large',
                    label: 'itext',
                    control: {
                        selector: '.tb_ov_co_icon_title'
                    }
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'add_css_layout_part'
                }
            ];
        }
        static getAnimation() {
            return false;
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString('[themify_layout_part slug="'+(setting.selected_layout_part || '')+'"]');
        }
        static builderSave(settings) {
            const def = {
                style:'overlay',
                overlay_type: 'overlay',
                expand_mode: 'overlap',
                overlay_width: '100',
                overlay_height: '100',
                overlay_width_unit: 'px',
                overlay_height_unit: 'px'
            };
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            if (settings.overlay_width?.toString()===def.overlay_width) {
                delete settings.overlay_width;
            }
            if (settings.overlay_height?.toString()===def.overlay_height) {
                delete settings.overlay_height;
            }
            if (settings.overlay_type !== 'expandable') {
                delete settings.expand_mode;
            }else{
                delete settings.style;
            }
            super.builderSave(settings);
        }
    };
})(tb_app);