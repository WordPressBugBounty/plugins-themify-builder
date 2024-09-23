(api => {
    "use strict";
    api.ModuleWidget = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        getExcerpt(data) {
            let setting = data || this.get('mod_settings'),
            widget=setting.class_widget;
            if(widget && ThemifyConstructor.widget_select._data){
                widget=ThemifyConstructor.widget_select._data[widget]?.n || widget;
            }
            return api.Helper.limitString(widget);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_widget',
                    type: 'title'
                },
                {
                    id: 'class_widget',
                    type: 'widget_select',
                    label: 'swidget'
                },
                {
                    id: 'instance_widget',
                    type: 'widget_form'
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'custom_css_widget'
                }
            ];
        }
    };
})(tb_app);