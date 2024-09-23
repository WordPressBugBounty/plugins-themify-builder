(api=> {
    "use strict";
    api.ModuleSignupForm = class extends api.Module {
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
                    id: 'e_user',
                    type: 'checkbox',
                    default:'1',
                    label: '',
                    options: [
                        {
                            name: '1',
                            value: 'sacinftus'
                        }
                    ]
                },
                {
                    id: 'e_admin',
                    type: 'checkbox',
                    default:'1',
                    label: '',
                    options: [
                        {
                            name: '1',
                            value: 'sacinftadm'
                        }
                    ]
                },
                {
                    type: 'separator',
                    label: ''
                },
                {
                    id: 'success_action',
                    type: 'select',
                    label: 'afsign',
                    options: {
                        c: 'rtourl',
                        m: 'shmsg'
                    },
                    binding: {
                        c: {
                            show: 'redirect_to',
                            hide: 'msg_success'
                        },
                        m: {
                            hide: 'redirect_to',
                            show: 'msg_success'
                        }
                    }
                },
                {
                    id: 'redirect_to',
                    type: 'url',
                    label: 'rurl',
                    help: 'rurlafsign'
                },
                {
                    id: 'msg_success',
                    type: 'textarea',
                    label: 'sucmsg',
                    help: 'smsgafsign'
                },
                {
                    id: 'optin',
                    type: 'toggle_switch',
                    label: 'nwsletopt',
                    default:'off',
                    options: {
                        on: {
                            name: 'yes',
                            value: 'en'
                        },
                        off: {
                            name: 'no',
                            value: 'dis'
                        }
                    },
                    binding: {
                        yes: {
                            show: [
                                'optin_label',
                                'provider'
                            ]
                        },
                        no: {
                            hide: [
                                'optin_label',
                                'provider'
                            ]
                        }
                    }
                },
                {
                    id: 'optin_label',
                    type: 'text',
                    label: 'sbscrbelb'
                },
                {
                    id: 'provider',
                    label: 'Provider',
                    type: 'optin_provider'
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
                    type : 'captcha'
                },
                {
                    id: 'welcome',
                    type: 'textarea',
                    label: 'welcmsg'
                },
                {
                    type: 'template_fields',
                    target: 'welcome',
                    fields: [
                        '%site_name%',
                        '%site_description%',
                        '%site_url%',
                        '%user_login%',
                        '%user_email%',
                        '%user_firstname%',
                        '%user_lastname%',
                        '%user_display_name%',
                        '%user_id%'
                    ],
                    title: 'avfields'
                },
                {
                    type: 'group',
                    label: 'labels',
                    display: 'accordion',
                    options: [
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'i_name',
                                    type: 'icon'
                                },
                                {
                                    id: 'l_name',
                                    type: 'text',
                                    label: 'name'
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'i_firstname',
                                    type: 'icon'
                                },
                                {
                                    id: 'l_firstname',
                                    type: 'text',
                                    label: 'fname'
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'i_lastname',
                                    type: 'icon'
                                },
                                {
                                    id: 'l_lastname',
                                    type: 'text',
                                    label: 'lname'
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'i_username',
                                    type: 'icon'
                                },
                                {
                                    id: 'l_username',
                                    type: 'text',
                                    label: 'uname'
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'i_email',
                                    type: 'icon'
                                },
                                {
                                    id: 'l_email',
                                    type: 'text',
                                    label: 'em'
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'i_password',
                                    type: 'icon'
                                },
                                {
                                    id: 'l_password',
                                    type: 'text',
                                    label: 'pswd'
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'i_bio',
                                    type: 'icon'
                                },
                                {
                                    id: 'l_bio',
                                    type: 'textarea',
                                    label: 'bio'
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'i_submit',
                                    type: 'icon'
                                },
                                {
                                    id: 'l_submit',
                                    type: 'text',
                                    label: 'submit'
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'i_desc',
                                    type: 'icon'
                                },
                                {
                                    id: 'desc',
                                    type: 'textarea',
                                    label: 'desc'
                                }
                            ]
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
                l_name: i18n.name,
                l_firstname: i18n.fname,
                l_lastname: i18n.lname,
                l_username: i18n.uname,
                l_email: i18n.em,
                l_password: i18n.pswd,
                l_bio: i18n.sbio,
                l_submit: i18n.submit,
                desc: i18n.shrltinf,
                u_role: i18n.subscriber,
                optin_label: i18n.sbscrbenws,
                gdpr_label: i18n.gdpr_opt_msg
            };
        }
        static builderSave(settings) {
            const def = {
                success_action: 'c',
                optin: 'no',
                u_role: 'subscriber',
                e_user:'1',
                e_admin:'1'
            };
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            if (settings.success_action && settings.success_action!=='c') {
                delete settings.redirect_to;
            }
            if (settings.success_action!=='m') {
                delete settings.msg_success;
            }
            if(!settings.gdpr){
                delete settings.gdpr_label;
            }
            if(settings.optin!=='yes'){
                delete settings.optin_label;
                delete settings.provider;
            }
            if(!settings.desc){
                delete settings.i_desc;
            }
            super.builderSave(settings);
        }
        preview(data) {
            const constructor=this.constructor,
                spanClass='tb_signup_label',
                module = createElement(),
                form = createElement('form',{class:'tb_signup_form',name:'tb_signup_form'}),
                divWarp=createElement(),
                lNameLabel=createElement('label'),
                lName=constructor._setEditableContent(createElement('span',spanClass),'l_name',data.l_name),
                spWrap=createElement('','tb_sp_name_wrapper'),
                submit = constructor._setEditableContent(createElement('button',{name:'tb_submit'}),'l_submit',data.l_submit),
                classes = ['module', 'module-signup-form'],
                getIcon=ic=>{
                    const em=createElement('em');
                    em.appendChild(api.Helper.getIcon(ic));
                    return em;
                };
            if (data.css) {
                classes.push(data.css);
            }
            module.className = classes.join(' ');
            
            
            if ( data.i_name ) {
                lName.prepend(getIcon(data.i_name));
            }
            lNameLabel.appendChild(lName);
            
            for(let fields=[{n:'first_n',k:'firstname'},{n:'last_n',k:'lastname'}],i=0;i<fields.length;++i){
                let key=fields[i].k,
                    d = createElement(),
                    label=createElement('label'),
                    span=constructor._setEditableContent(createElement('span'),'l_'+key,data['l_'+key]);
                if ( data['i_'+key] ) {
                    span.prepend(getIcon(data['i_'+key]));
                }
                label.append(createElement('input',{type:'text',name:fields[i].n}),span);
                d.appendChild(label);
                spWrap.appendChild(d);
            }
            
            divWarp.append(lNameLabel,spWrap);
            form.appendChild(divWarp);
            
            for(let fields=[{n:'usr',k:'username'},{n:'email',k:'email'},{n:'pwd',k:'password'},{n:'bio',k:'bio'}],i=0;i<fields.length;++i){
                let key=fields[i].k,
                    d = createElement(),
                    label=createElement('label'),
                    input =createElement(key==='bio'?'textarea':'input'),
                    span=createElement('span',spanClass);
                
                label.append(span,input);
                d.appendChild(label);
                if(key!=='bio'){
                    input.type=key==='password' || key==='email'?key:'text';
                    if(key==='password'){
                        input.autocomplete='current-password';
                    }
                    span.dataset.required='yes';
                }
                else if (data.desc ) {
                    let p=createElement('p','',data.desc);
                    if ( data.i_desc ) {
                        p.prepend(getIcon(data.i_desc));
                    }
                    d.appendChild(p);
                }
                input.name=fields[i].n;
                constructor._setEditableContent(span,'l_'+key,data['l_'+key]);
                if ( data['i_'+key] ) {
                    span.prepend(getIcon(data['i_'+key]));
                }
                form.appendChild(d);
            }
            if (  data.optin==='yes' ||  data.gdpr==='on') {
                const fields = [];
                if(data.optin==='yes'){
                    fields.push({n:'optin',k:'optin_label'});
                }
                if(data.gdpr==='on'){
                    fields.push({n:'gdpr',k:'gdpr_label'});
                }
                for(let i=0;i<fields.length;++i){
                    let key=fields[i].k,
                    d = createElement(),
                    label=createElement('label'),
                    input =createElement('input',{type:'checkbox',name:fields[i].n});
                    
                    if(key==='gdpr_label'){
                        input.required=1;
                    }
                    
                    label.append(input,constructor._setEditableContent(createElement('span','tb_signup_'+fields[i].n),key,data[key]));
                    d.appendChild(label);
                    form.appendChild(d); 
                }
            }
            
            
            if(data.i_submit){
                submit.prepend(getIcon(data.i_submit));
            }
            form.appendChild(submit); 
            if (data.mod_title) {
                module.appendChild(constructor.getModuleTitle(data.mod_title, 'mod_title'));
            }
            module.appendChild(form);
            return module;
        }
    };
})(tb_app);