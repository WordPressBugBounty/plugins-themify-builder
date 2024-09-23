(api => {
    "use strict";
    api.ModuleLayoutPart = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            const adminUrl=themifyBuilder.admin_url;
            return [
                {
                    id: 'mod_title_layout_part',
                    type: 'title'
                },
                {
                    id: 'selected_layout_part',
                    type: 'layoutPart',
                    label: 'layoutp',
                    required: {
                        message: 'lpartmsg'
                    },
                    add_url: adminUrl+'/post-new.php?post_type=tbuilder_layout_part',
                    edit_url: adminUrl+'/edit.php?post_type=tbuilder_layout_part'
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'add_css_layout_part'
                }
            ];
        }
        static getAnimation(){
            return false;
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString('[themify_layout_part slug="'+(setting.selected_layout_part || '')+'"]');
        }
    };
})(tb_app);