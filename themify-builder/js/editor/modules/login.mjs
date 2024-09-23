(api => {
    "use strict";
    api.ModuleLogin = class extends api.Module {
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
                    id: 'content_text',
                    type: 'textarea',
                    label: 'lginmsg',
                    help: 'lginmsgh',
                },
				{
					type: 'template_fields',
					title: 'avfields',
					target: 'content_text',
					fields: [
						'%username%',
						'%display_name%',
						'%first_name%',
						'%last_name%',
						'%email%',
					]
				},
                {
                    id: 'logout_link',
                    type: 'toggle_switch',
                    label: 'lgoutlnk',
                    options: {
                        on: {
                            name: 'show',
                            value: 's'
                        },
                        off: {
                            name: 'hide',
                            value: 'hi'
                        }
                    },
                    binding: {
                        hide: {
                            hide: 'logout_redirect'
                        },
                        show: {
                            show: 'logout_redirect'
                        }
                    }
                },
                {
                    id: 'logout_redirect',
                    type: 'url',
                    label: 'lgoutred',
                    control: false
                },
                {
                    id: 'alignment',
                    type: 'icon_radio',
                    label: 'falign',
                    aligment2: true
                },
                {
                    type: 'group',
                    label: 'lgform',
                    display: 'accordion',
                    options: [
                        {
                            id: 'redirect_to',
                            type: 'url',
                            label: 'rurl',
                            help: 'lgrurl',
                            control: false
                        },
                        {
                            id: 'fail_action',
                            type: 'select',
                            label: 'lgfail',
                            options: {
                                r: 'rwp',
                                c: 'rcust',
                                m: 'shmsg'
                            },
                            binding: {
                                r: {
                                    hide: [
                                        'redirect_fail',
                                        'msg_fail'
                                    ]
                                },
                                c: {
                                    show: 'redirect_fail',
                                    hide: 'msg_fail'
                                },
                                m: {
                                    hide: 'redirect_fail',
                                    show: 'msg_fail'
                                }
                            }
                        },
                        {
                            id: 'redirect_fail',
                            type: 'url',
                            label: 'rurlerr',
                            help: 'lgrurlaft',
                            control: false
                        },
                        {
                            id: 'msg_fail',
                            type: 'textarea',
                            label: 'failmsg',
                            after: 'lgfailmsg',
                            control: {
                                selector: '.tb_login_error'
                            }
                        },
                        {
                            type: 'multi',
                            label: 'labels',
                            options: [
                                {
                                    id: 'icon_username',
                                    type: 'icon'
                                },
                                {
                                    id: 'label_username',
                                    type: 'text',
                                    after: 'uname',
                                    control: {
                                        selector: '.tb_login_username_text'
                                    }
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'icon_password',
                                    type: 'icon'
                                },
                                {
                                    id: 'label_password',
                                    type: 'text',
                                    after: 'pswd',
                                    control: {
                                        selector: '.tb_login_password_text'
                                    }
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'icon_remember',
                                    type: 'icon'
                                },
                                {
                                    id: 'label_remember',
                                    type: 'text',
                                    after: 'rme',
                                    control: {
                                        selector: '.tb_login_remember_text'
                                    }
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'icon_log_in',
                                    type: 'icon'
                                },
                                {
                                    id: 'label_log_in',
                                    type: 'text',
                                    after: 'lgin',
                                    control: {
                                        selector: '.tb_login_submit button'
                                    }
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'icon_forgotten_password',
                                    type: 'icon'
                                },
                                {
                                    id: 'label_forgotten_password',
                                    type: 'text',
                                    after: 'fpswdlnk',
                                    control: {
                                        selector: '.tb_login_form .tb_login_links a'
                                    }
                                }
                            ]
                        },
                        {
                            id: 'remember_me_display',
                            type: 'toggle_switch',
                            label: 'rme',
                            default:'on',
                            options: {
                                on: {
                                    name: 'show',
                                    value: 's'
                                },
                                off: {
                                    name: 'hide',
                                    value: 'hi'
                                }
                            }
                        }
                    ]
                },
                {
                    type: 'group',
                    label: 'resetf',
                    display: 'accordion',
                    options: [
                        {
                            id: 'lostpasswordform_redirect_to',
                            type: 'url',
                            label: 'rurl',
                            help: 'rurlrstf',
                            control: false
                        },
                        {
                            type: 'multi',
                            label: 'labels',
                            options: [
                                {
                                    id: 'lostpasswordform_icon_username',
                                    type: 'icon'
                                },
                                {
                                    id: 'lostpasswordform_label_username',
                                    type: 'text',
                                    after: 'uname',
                                    control: {
                                        selector: '.tb_lostpassword_username_text'
                                    }
                                }
                            ]
                        },
                        {
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'lostpasswordform_icon_reset',
                                    type: 'icon'
                                },
                                {
                                    id: 'lostpasswordform_label_reset',
                                    type: 'text',
                                    after: 'rpswdbtn',
                                    control: {
                                        selector: '.tb_lostpassword_submit button'
                                    }
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
                label_username: i18n.unameemail,
                label_password: i18n.pswd,
                label_remember: i18n.rme,
                label_log_in: i18n.lgin,
                label_forgotten_password: i18n.fpswd,
                lostpasswordform_label_username: i18n.unameemail,
                lostpasswordform_label_reset: i18n.rpswd,
                msg_fail: i18n.msgfail
            };
        }
        static builderSave(settings){
            const def={
                remember_me_display:'show',
                fail_action:'r',
                logout_link:'hide',
                alignment:'left'
            },
            failAction=settings.fail_action;
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(settings.alignment==='undefined'){
                delete settings.alignment;
            }
            if(failAction!=='c'){
                delete settings.redirect_fail;
            }
            if(failAction!=='m'){
                delete settings.msg_fail;
            }
            super.builderSave(settings);
        }
        preview(data) {
            const constructor=this.constructor,
                module = createElement(),
                wrap = createElement('','tb_login_wrap'),
                loginForm=createElement('form',{class:'tb_login_form',name:'loginform'}),
                resetForm=createElement('form',{class:'tb_lostpassword_form',name:'lostpasswordform'}),
                loginLinks=createElement('','tb_login_links'),
                forgotPswd=createElement('a',{href:'#'}),
                loginSubmit=createElement('p','tb_login_submit tf_right'),
                loginBtn=constructor._setEditableContent(createElement('button'),'label_log_in',data.label_log_in),
                lostPswdSubmit=createElement('p','tb_lostpassword_submit tf_right'),
                lostPswdSubmitBtn=constructor._setEditableContent(createElement('button'),'lostpasswordform_label_reset',data.lostpasswordform_label_reset),
                lostLoginLinksWrap=createElement('','tb_login_links'),
                lostLoginLinks=createElement('a',{href:'#'}),
                classes = ['module', 'module-login'],
                alignment = !data.alignment || data.alignment==='undefined' ||'left' === data.alignment ? '' : ('center' === data.alignment?' tb_login_c':' tf_right'),
                getIcon=icon=>{
                    const em=createElement('em');
                    em.appendChild(api.Helper.getIcon(icon));
                    return em;
                };
            if (data.css) {
                classes.push(data.css);
            }

            module.className = classes.join(' ');
            wrap.className = 'tb_login_wrap';
            if(alignment!==''){
                wrap.className+=' '+alignment;
            }
            
            
            
            if ( data.fail_action === 'm' ) {
                loginForm.appendChild(constructor._setEditableContent(createElement('','tb_login_error'),'msg_fail',data.msg_fail));
            }
            
            for(let i=0,items=['username','password','lostpassword_username'];i<items.length;++i){
                let k=items[i],
                    isLostpswd=k==='lostpassword_username',
                    p=createElement('p'),
                    label=createElement('label',isLostpswd?'tb_lostpassword_username':'tb_login_'+k);
                
                if(isLostpswd){
                    if(data.lostpasswordform_icon_username){
                        label.appendChild(getIcon(data.lostpasswordform_icon_username));
                    }
                }
                else if ( data['icon_'+k] ) {
                    label.appendChild(getIcon(data['icon_'+k]));
                }
                
                label.append(
                    constructor._setEditableContent(createElement('span',isLostpswd?'tb_lostpassword_username_text':'tb_login_'+k+'_text'),(isLostpswd?'lostpasswordform_label_username':'label_'+k),(isLostpswd?(data.lostpasswordform_label_username || ''):(data[ 'label_'+k] || ''))),
                    createElement('input',{class:'input',type:k==='password'?k:'text',name:k==='password'?'pwd':(isLostpswd?'user_login':'log')})
                );
                p.appendChild(label);
                if(isLostpswd){
                    resetForm.appendChild(p);
                    
                }else{
                    loginForm.appendChild(p);
                }
            }
            
            if ( data.icon_forgotten_password ) {
                loginLinks.appendChild(getIcon(data.icon_forgotten_password));
            }
            loginLinks.appendChild(constructor._setEditableContent(forgotPswd,'label_forgotten_password',data.label_forgotten_password));
            
            loginForm.appendChild(loginLinks);
            
            if ( data.remember_me_display === 'show' ) {
                const p=createElement('p','tb_login_remember tf_left tf_box tf_clear'),
                    label=createElement('label');
                    
                label.appendChild(createElement('input',{name:'rememberme',type:'checkbox',value:1}));
                
                if ( data.icon_remember ) {
                    label.appendChild(getIcon(data.icon_remember));
                }
                label.appendChild(constructor._setEditableContent(createElement('span','tb_login_remember_text'),'label_remember',data.label_remember));
                
                p.appendChild(label);
                
                loginForm.appendChild(p);
            }
            
            if ( data.icon_log_in ) {
                loginBtn.prepend(getIcon(data.icon_log_in));
            }
            loginSubmit.appendChild(loginBtn);
            loginForm.appendChild(loginSubmit);
            
            //reset form
            if ( data.lostpasswordform_icon_reset ) {
                lostPswdSubmitBtn.prepend(getIcon(data.lostpasswordform_icon_reset));
            }
            lostPswdSubmit.appendChild(lostPswdSubmitBtn);
            
            lostLoginLinksWrap.appendChild(constructor._setEditableContent(lostLoginLinks,'label_log_in',data.label_log_in));
            
            resetForm.append(lostPswdSubmit,lostLoginLinksWrap);
            if (data.mod_title) {
                module.appendChild(constructor.getModuleTitle(data.mod_title,'mod_title'));
            }
            
            resetForm.style.display='none';
            wrap.append(loginForm,resetForm);
            module.appendChild(wrap);
            return module;
        }
    };
})(tb_app);