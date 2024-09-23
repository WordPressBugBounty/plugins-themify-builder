(api=> {
    "use strict";
    api.ModuleCallout = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_callout',
                    type: 'title'
                },
                {
                    id: 'layout_callout',
                    type: 'layout',
                    mode: 'sprite',
                    label: 'calstyle',
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
                    id: 'heading_callout',
                    type: 'text',
                    label: 'calhead',
                    control: {
                        selector: '.callout-heading'
                    }
                },
                {
                    id: 'title_tag',
                    type: 'select',
                    label: 'caltattag',
                    h_tags: true,
                    default: 'h3'
                },
                {
                    id: 'text_callout',
                    type: 'textarea',
                    label: 'caltext',
                    control: {
                        selector: '.tb_text_wrap'
                    }
                },
                {
                    id: 'color_callout',
                    type: 'layout',
                    mode: 'sprite',
                    class: 'tb_colors',
                    label: 'c',
                    color: true,
                    transparent: true,
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'appearance_callout',
                    type: 'checkbox',
                    label: 'app',
                    appearance: true
                },
                {
                    type: 'group',
                    label: 'actbtn',
                    display: 'accordion',
                    options: [
                        {
                            id: 'action_btn_text_callout',
                            type: 'text',
                            label: 'actbtn',
                            class: 'medium',
                            control: {
                                selector: '.tb_callout_text'
                            },
                            binding: {
                                empty:{
                                    hide:'callout_link_opt'
                                },
                                not_empty:{
                                    show:'callout_link_opt'
                                }
                            }
                        },
                        {
                            type:'group',
                            wrap_class:'callout_link_opt',
                            options:[
                                {
                                    id: 'action_btn_link_callout',
                                    type: 'url',
                                    label: 'actlink'
                                },
                                {
                                    id: 'open_link_new_tab_callout',
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
                                        }
                                    ]
                                },
                                {
                                    id: 'action_btn_color_callout',
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
                                    id: 'action_btn_appearance_callout',
                                    type: 'checkbox',
                                    label: 'app',
                                    appearance: true
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_callout'
                }
            ];
        }
        static default(){
            return {
                heading_callout: i18n.calhead,
                text_callout: i18n.caltext,
                action_btn_text_callout: i18n.actbtn,
                action_btn_link_callout: 'https://themify.me/',
                action_btn_color_callout: 'blue'
            };
        }
        static builderSave(settings){
            const def={
                layout_callout:'button-right',
                title_tag:'h3',
                action_btn_color_callout:'default',
                color_callout:'default',
                action_btn_link_callout:'#',
                open_link_new_tab_callout:'no',
                appearance_callout:false,
                action_btn_appearance_callout:false
            };
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(settings.appearance_callout==='|' || settings.appearance_callout==='false'){
                delete settings.appearance_callout;
            }
            if(settings.action_btn_appearance_callout==='|' || settings.action_btn_appearance_callout==='false'){
                delete settings.action_btn_appearance_callout;
            }
            if(!settings.action_btn_text_callout){
                const del=[
                    'action_btn_appearance_callout',
                    'action_btn_color_callout',
                    'action_btn_link_callout',
                    'open_link_new_tab_callout'
                ];
                for(let i=del.length-1;i>-1;--i){
                    if(settings[del[i]]!==undefined){
                        delete settings[del[i]];
                    }
                }
            }
            super.builderSave(settings);
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString(setting.text_callout);
        }
        preview(data) {
            const module = createElement(),
                    inner =createElement('','callout-inner'),
                    content = createElement('', 'callout-content tf_left'),
                    color = data.color_callout && data.color_callout !== 'default' ? data.color_callout : 'tb_default_color',
                    classes = ['module', 'ui', color],
                    constructor=this.constructor;

            if (data.layout_callout) {
                classes.push(data.layout_callout);
            }
            if (data.css_callout) {
                classes.push(data.css_callout);
            }
            if (data.appearance_callout) {
                classes.push(data.appearance_callout.split('|').join(' '));
            }

            module.className = classes.join(' ');
            content.append(
                constructor._setEditableContent(createElement((data.title_tag || 'h3'), 'callout-heading'),'heading_callout',data.heading_callout), 
                constructor._setEditableContent(createElement('','tb_text_wrap'),'text_callout',data.text_callout));
            inner.appendChild(content);

            if (data.action_btn_text_callout) {
                const btn_color_callout = data.action_btn_color_callout,
                    btnColor = btn_color_callout && 'default' !== btn_color_callout ? btn_color_callout : 'tb_default_color',
                    btn = createElement('','callout-button tf_right tf_textr'),
                    link = createElement('a',{href:data.action_btn_link_callout || '#',class: 'ui builder_button ' + btnColor});

                if (data.action_btn_appearance_callout) {
                    link.className += ' ' + data.action_btn_appearance_callout.split('|').join(' ');
                }
                link.appendChild(constructor._setEditableContent(createElement('span', 'tb_callout_text'),'action_btn_text_callout',data.action_btn_text_callout));
                btn.appendChild(link);
                inner.appendChild(btn);
            }

            if (data.mod_title_callout) {
                module.appendChild(constructor.getModuleTitle(data.mod_title_callout,'mod_title_callout'));
            }

            module.appendChild(inner);
            return module;
        }
    };
})(tb_app);