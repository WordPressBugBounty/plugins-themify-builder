(api => {
    "use strict";
    api.ModuleOptin = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title',
                    type: 'title'
                },
                {
                    id: 'layout',
                    type: 'layout',
                    label: 'lay',
                    mode: 'sprite',
                    options: [
                        {
                            img: 'optin_inline_block',
                            value: 'tb_optin_inline_block',
                            label: 'inlblock'
                        },
                        {
                            img: 'optin_horizontal',
                            value: 'tb_optin_horizontal',
                            label: 'hrztal'
                        },
                        {
                            img: 'optin_block',
                            value: 'tb_optin_block',
                            label: 'block'
                        }
                    ],
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'provider',
                    label: 'optprd',
                    type: 'optin_provider'
                },
                {
                    type : 'captcha',
                    recaptcha : 'on' /* option key for reCaptcha */
                },
                {
                    type: 'group',
                    label: 'labels',
                    display: 'accordion',
                    options: [
                        {
                            type: 'multi',
                            label: 'fname',
                            options: [
                                {
                                    id: 'label_firstname',
                                    type: 'text',
                                    help: 'fnameh',
                                    control: {
                                        selector: '.tb_optin_fname_text'
                                    }
                                },
                                {
                                    id: 'fname_hide',
                                    type: 'checkbox',
                                    options: [
                                        {
                                            name: '1',
                                            value: 'hi'
                                        }
                                    ],
                                    binding: {
                                        checked: {
                                            show: 'default_fname'
                                        },
                                        not_checked: {
                                            hide: 'default_fname'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            id: 'fn_placeholder',
                            type: 'text',
                            label: 'placeh'
                        },
                        {
                            id: 'default_fname',
                            type: 'text',
                            label: 'dfname',
                            help: 'dfnameh'
                        },
                        {
                            type: 'multi',
                            label: 'lname',
                            options: [
                                {
                                    id: 'label_lastname',
                                    type: 'text',
                                    help: 'lnameh',
                                    control: {
                                        selector: '.tb_option_lastname_text'
                                    }
                                },
                                {
                                    id: 'lname_hide',
                                    type: 'checkbox',
                                    options: [
                                        {
                                            name: '1',
                                            value: 'hi'
                                        }
                                    ],
                                    binding: {
                                        checked: {
                                            show: 'default_lname'
                                        },
                                        not_checked: {
                                            hide: 'default_lname'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            id: 'ln_placeholder',
                            type: 'text',
                            label: 'placeh'
                        },
                        {
                            id: 'default_lname',
                            type: 'text',
                            label: 'dlname'
                        },
                        {
                            id: 'label_email',
                            type: 'text',
                            label: 'em',
                            control: {
                                selector: '.tb_option_email_text'
                            }
                        },
                        {
                            id: 'email_placeholder',
                            type: 'text',
                            label: 'placeh'
                        },
                        {
                            id: 'label_submit',
                            type: 'text',
                            label: 'submit',
                            control: {
                                selector: '.tb_option_submit button'
                            }
                        },
                        {
                            id: 'button_icon',
                            type: 'icon',
                            label: 'btnic'
                        },
                        {
                            id: 'gdpr',
                            label: 'gdpr',
                            type: 'toggle_switch',
                            options: {
                                on: {
                                    name: 'on',
                                    value: 'en'
                                },
                                off: {
                                    name: '',
                                    value: 'dis'
                                }
                            },
                            binding: {
                                checked: {
                                    show: 'gdpr_label'
                                },
                                not_checked: {
                                    hide: 'gdpr_label'
                                }
                            }
                        },
                        {
                            id: 'gdpr_label',
                            type: 'textarea',
                            label: 'gdpr_msg'
                        },
                        {
                            type : 'textarea',
                            label : 'errmsg',
                            id : 'errmsg'
                        }
                    ]
                },
                {
                    type: 'group',
                    label: 'sucact',
                    display: 'accordion',
                    options: [
                        {
                            id: 'success_action',
                            type: 'radio',
                            label: 'sucact',
                            options: [
                                {
                                    value: 's2',
                                    name: 'showmsg'
                                },
                                {
                                    value: 's1',
                                    name: 'rtourl'
                                }
                            ],
                            option_js: true
                        },
                        {
                            id: 'redirect_to',
                            type: 'url',
                            label: 'rurl',
                            wrap_class: 'tb_group_element_s1'
                        },
                        {
                            id: 'message',
                            type: 'wp_editor',
                            wrap_class: 'tb_group_element_s2'
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css'
                }
            ];
        }
        static default() {
            return {
                label_firstname: i18n.fname,
                default_fname: 'John',
                label_lastname: i18n.lname,
                default_lname: 'Doe',
                label_email: i18n.em,
                label_submit: i18n.sbscrbe,
                message: i18n.suc,
                layout: 'tb_optin_inline_block',
                gdpr_label: i18n.gdpr_opt_msg
            };
        }
        static builderSave(settings) {
            const def = {
                provider: 'mailchimp',
                layout: 'tb_optin_inline_block',
                success_action: 's2'
            };
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            if (settings.fname_hide && settings.fname_hide!=='|' && settings.fname_hide!=='false') {
                delete settings.label_firstname;
                delete settings.fn_placeholder;
            }else{
                delete settings.fname_hide;
                delete settings.default_fname;
            }
            if (settings.lname_hide && settings.lname_hide!=='|' && settings.lname_hide!=='false') {
                delete settings.label_lastname;
                delete settings.ln_placeholder;
            }else{
                delete settings.lname_hide;
                delete settings.default_lname;
            }
            if (!settings.gdpr) {
                delete settings.gdpr_label;
            }
            
            if(settings.success_action){
                delete settings.message;
            }
            if(settings.success_action!=='s1'){
                delete settings.redirect_to;
            }
            super.builderSave(settings);
        }
        preview(data) {
            const module = createElement(),
                    form = createElement('form','tb_optin_form'),
                    submitWrap = createElement('','tb_optin_submit'),
                    submit = createElement('button'),
                    classes = ['module', 'module-optin'],
                    inputs = new Map,
                    constructor=this.constructor;
            if (data.layout) {
                classes.push(data.layout);
            }
            if (data.css) {
                classes.push(data.css);
            }

            module.className = classes.join(' ');
            if (!data.fname_hide) {
                inputs.set('fname', {k: 'label_firstname', pl: 'fn_placeholder'});
            }
            if (!data.lname_hide) {
                inputs.set('lname', {k: 'label_lastname', pl: 'ln_placeholder'});
            }
            inputs.set('email', {k: 'label_email', pl: 'email_placeholder'});
            if (data.gdpr === 'on') {
                inputs.set('gdpr', {k: 'gdpr_label'});
            }
            for (let [k, inp] of inputs) {
                let opt = createElement('','tb_optin_' + k),
                        label = constructor._setEditableContent(createElement('label','tb_optin_' + k + '_text'),inp.k,data[inp.k] ),
                        input = createElement('input',{type:k === 'email' ? k : (k === 'gdpr' ? 'checkbox' : 'text'),name:'tb_optin_' + k,required:1});
                if (inp.pl && data[inp.pl]) {
                    input.placeholder = data[inp.pl];
                }
                if (k === 'gdpr') {
                    label.prepend(input);
                } else {
                    input.className = 'tb_optin_input';
                    label.appendChild(input);
                }
                opt.appendChild(label);
                form.appendChild(opt);
            }
            if (data.button_icon) {
                const em = createElement('em');
                em.appendChild(api.Helper.getIcon(data.button_icon));
                submit.appendChild(em);
            }
            ;
            submit.appendChild(constructor._setEditableContent(createElement('span'),'label_submit',data.label_submit));

            submitWrap.appendChild(submit);
            form.appendChild(submitWrap);
            if (data.mod_title) {
                module.appendChild(constructor.getModuleTitle(data.mod_title, 'mod_title'));
            }
            module.appendChild(form);
            return module;
        }
    };
})(tb_app);