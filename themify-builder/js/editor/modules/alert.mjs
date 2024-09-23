(api => {
    "use strict";
    api.ModuleAlert = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_alert',
                    type: 'title'
                },
                {
                    id: 'layout_alert',
                    type: 'layout',
                    mode: 'sprite',
                    label: 'astyle',
                    options: [
                        {
                            img: 'callout_button_right',
                            value: 'button-right',
                            label: 'bright'
                        },
                        {
                            img: 'callout_button_left',
                            value: 'button-left',
                            label: 'bleft'
                        },
                        {
                            img: 'callout_button_bottom',
                            value: 'button-bottom',
                            label: 'bbottom'
                        },
                        {
                            img: 'callout_button_bottom_center',
                            value: 'button-bottom-center',
                            label: 'bbottomc'
                        }
                    ],
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'heading_alert',
                    type: 'text',
                    label: 'ahead',
                    control: {
                        selector: '.alert-heading'
                    }
                },
                {
                    id: 'title_tag',
                    type: 'select',
                    label: 'atitlet',
                    h_tags: true,
                    default: 'h3'
                },
                {
                    id: 'text_alert',
                    type: 'textarea',
                    label: 'atext',
                    control: {
                        selector: '.alert-content .tb_text_wrap'
                    }
                },
                {
                    id: 'color_alert',
                    type: 'layout',
                    mode: 'sprite',
                    class: 'tb_colors',
                    label: 'acolor',
                    color: true,
                    transparent: true,
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'appearance_alert',
                    type: 'checkbox',
                    label: 'app',
                    appearance: true
                },
                {
                    type: 'group',
                    display: 'accordion',
                    label: 'actbtn',
                    options: [
                        {
                            id: 'action_btn_text_alert',
                            type: 'text',
                            label: 'actbtn',
                            class: 'medium',
                            control: {
                                selector: '.tb_alert_text'
                            }
                        },
                        {
                            id: 'alert_button_action',
                            type: 'select',
                            label: 'clickact',
                            options: {
                                close: 'closeatbox',
                                message: 'dismsg',
                                url: 'goturl'
                            },
                            binding: {
                                close: {
                                    hide: [
                                        'alert_message_text',
                                        'action_btn_link_alert',
                                        'open_link_new_tab_alert',
                                        'lb_size_alert'
                                    ]
                                },
                                message: {
                                    show: 'alert_message_text',
                                    hide: [
                                        'action_btn_link_alert',
                                        'open_link_new_tab_alert',
                                        'lb_size_alert'
                                    ]
                                },
                                url: {
                                    show: [
                                        'action_btn_link_alert',
                                        'open_link_new_tab_alert',
                                        'lb_size_alert'
                                    ],
                                    hide: 'alert_message_text'
                                }
                            }
                        },
                        {
                            id: 'alert_message_text',
                            type: 'textarea',
                            label: 'msgt'
                        },
                        {
                            id: 'action_btn_link_alert',
                            type: 'url',
                            label: 'actlink'
                        },
                        {
                            id: 'open_link_new_tab_alert',
                            type: 'radio',
                            label: 'o_l',
                            options: [
                                {
                                    value: 'no',
                                    name: 'swin'
                                },
                                {
                                    value: 'yes',
                                    name: 'nwin'
                                },
                                {
                                    value: 'lightbox',
                                    name: 'lg'
                                }
                            ],
                            option_js: true
                        },
                        {
                            type: 'multi',
                            id: 'lb_size_alert',
                            label: 'lbdim',
                            options: [
                                {
                                    id: 'lightbox_width',
                                    label: 'w',
                                    type: 'range',
                                    control: false,
                                    units: {
                                        px: {
                                            max: 3500
                                        },
                                        em: {
                                            min: -50,
                                            max: 50
                                        },
                                        '%': ''
                                    }
                                },
                                {
                                    id: 'lightbox_height',
                                    label: 'ht',
                                    type: 'range',
                                    control: false,
                                    units: {
                                        px: {
                                            max: 3500
                                        },
                                        em: {
                                            min: -50,
                                            max: 50
                                        },
                                        '%': ''
                                    }
                                }
                            ],
                            wrap_class: 'tb_group_element_lightbox lightbox_size'
                        },
                        {
                            id: 'action_btn_color_alert',
                            type: 'layout',
                            class: 'tb_colors',
                            mode: 'sprite',
                            label: 'btncolor',
                            color: true,
                            transparent: true,
                            control: {
                                classSelector: '.ui.builder_button'
                            }
                        },
                        {
                            id: 'action_btn_appearance_alert',
                            type: 'checkbox',
                            label: 'app',
                            appearance: true
                        }
                    ]
                },
                {
                    type: 'group',
                    label: 'aopt',
                    display: 'accordion',
                    options: [
                        {
                            id: 'alert_no_date_limit',
                            type: 'toggle_switch',
                            label: 'aschl',
                            options: {
                                on: {
                                    name: 'alert_schedule',
                                    value: 'en'
                                },
                                off: {
                                    name: '',
                                    value: 'dis'
                                }
                            },
                            binding: {
                                checked: {
                                    show: [
                                        'alert_start_at',
                                        'alert_end_at'
                                    ]
                                },
                                not_checked: {
                                    hide: [
                                        'alert_start_at',
                                        'alert_end_at'
                                    ]
                                }
                            }
                        },
                        {
                            id: 'alert_start_at',
                            type: 'date',
                            label: 'startat'
                        },
                        {
                            id: 'alert_end_at',
                            type: 'date',
                            label: 'endat'
                        },
                        {
                            id: 'alert_show_to',
                            type: 'select',
                            label: 'guest',
                            options: {
                                '': 'toall',
                                guest: 'showgst',
                                user: 'showlged'
                            }
                        },
                        {
                            id: 'alert_limit_count',
                            type: 'number',
                            label: 'limitdis',
                            help: 'alimdish'
                        },
                        {
                            id: 'alert_auto_close',
                            label: 'autoclose',
                            type: 'toggle_switch',
                            options: {
                                on: {
                                    name: 'alert_close_auto',
                                    value: 'en'
                                },
                                off: {
                                    name: '',
                                    value: 'dis'
                                }
                            },
                            binding: {
                                checked: {
                                    show: 'alert_auto_close_delay'
                                },
                                not_checked: {
                                    hide: 'alert_auto_close_delay'
                                }
                            }
                        },
                        {
                            id: 'alert_auto_close_delay',
                            type: 'number',
                            label: 'acloseaft',
                            after: 'sec'
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_alert'
                }
            ];
        }
        static default(){
            return {
                heading_alert: i18n.ahead,
                text_alert: i18n.atext,
                action_btn_text_alert: i18n.actbtn,
                action_btn_link_alert: 'https://themify.me/',
                alert_auto_close_delay: 5,
                action_btn_color_alert: 'blue'
            };
        }
        static builderSave(settings){
            const def={
                layout_alert:'button-right',
                color_alert:'default',
                action_btn_color_alert:'default',
                title_tag:'h3',
                alert_button_action:'close',
                lightbox_width_unit:'px',
                lightbox_height_unit:'px',
                action_btn_link_alert:'#',
                open_link_new_tab_alert:'no',
                appearance_alert:false,
                action_btn_appearance_alert:false
            },
            actButton=settings.alert_button_action;
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(settings.appearance_alert==='|' || settings.appearance_alert==='false'){
                delete settings.appearance_alert;
            }
            if(settings.action_btn_appearance_alert==='|' || settings.action_btn_appearance_alert==='false'){
                delete settings.action_btn_appearance_alert;
            }
            if(actButton!=='message'){
                delete settings.alert_message_text;
            }
            if(actButton!=='url'){
                delete settings.action_btn_link_alert;
            }
            if(!settings.action_btn_link_alert){
                delete settings.open_link_new_tab_alert;
            }
            if(settings.open_link_new_tab_alert!=='lightbox'){
                delete settings.lightbox_width;
                delete settings.lightbox_height;
            }
            if(!settings.lightbox_width){
                delete settings.lightbox_width_unit;
            }
            if(!settings.lightbox_height){
                delete settings.lightbox_height_unit;
            }
            if(!settings.alert_no_date_limit){
                delete settings.alert_start_at;
                delete settings.alert_end_at;
            }
            if(!settings.alert_auto_close ){
                delete settings.alert_auto_close_delay;
            }
            super.builderSave(settings);
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString(setting.text_alert);
        }
        preview(data) {
            const module = createElement(),
                inner = createElement('','alert-inner'),
                content = createElement('','alert-content'),
                color = data.color_alert && data.color_alert !== 'default' ? data.color_alert : 'tb_default_color',
                classes = ['module', 'module-alert', 'ui', color, (data.layout_alert || 'button-right')],
                constructor=this.constructor;
            if (data.css_alert) {
                classes.push(data.css_alert);
            }
            if (data.appearance_alert) {
                classes.push(data.appearance_alert.split('|').join(' '));
            }

            module.className = classes.join(' ');
            content.append(
            constructor._setEditableContent(createElement((data.title_tag || 'h3'),'alert-heading'),'heading_alert',data.heading_alert), 
            constructor._setEditableContent(createElement('', 'tb_text_wrap'),'text_alert',data.text_alert)
            );
            inner.appendChild(content);

            if (data.action_btn_text_alert) {
                const btnColor = data.action_btn_color_alert && data.action_btn_color_alert !== 'default' ? data.action_btn_color_alert : 'tb_default_color',
                    button = createElement('', 'alert-button'),
                    link = createElement('a',{class:'ui builder_button ' + btnColor,href:data.action_btn_link_alert || '#'});

                if (data.action_btn_appearance_alert) {
                    link.className += ' ' + data.action_btn_appearance_alert.split('|').join(' ');
                }
                link.appendChild(constructor._setEditableContent(createElement('span','tb_alert_text'),'action_btn_text_alert',data.action_btn_text_alert));
                button.appendChild(link);
                inner.appendChild(button);
            }

            if (data.mod_title_alert) {
                module.appendChild(constructor.getModuleTitle(data.mod_title_alert,'mod_title_alert'));
            }
            module.appendChild(inner);
            return module;
        }
    };
})(tb_app);