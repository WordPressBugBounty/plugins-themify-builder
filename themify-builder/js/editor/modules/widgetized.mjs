(api => {
    "use strict";
    api.ModuleWidgetized = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_widgetized',
                    type: 'title'
                },
                {
                    id: 'sidebar_widgetized',
                    type: 'select',
                    label: 'warea',
                    sidebars: true
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'custom_css_widgetized'
                }
            ];
        }
    };
})(tb_app);