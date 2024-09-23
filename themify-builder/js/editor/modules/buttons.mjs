(api => {
    "use strict";
    api.ModuleButtons = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'content_button',
                    type: 'builder',
                    options: [
                        {
                            id: 'label',
                            type: 'text',
                            label: 'text',
                            control: {
                                selector: '[data-name="label"]'
                            }
                        },
                        {
                            id: 'link',
                            type: 'url',
                            label: 'l',
                            binding: {
                                empty: {
                                    hide: [
                                        'link_options',
                                        'button_color_bg',
                                        'title'
                                    ]
                                },
                                not_empty: {
                                    show: [
                                        'link_options',
                                        'button_color_bg',
                                        'title'
                                    ]
                                }
                            }
                        },
                        {
                            id: 'link_options',
                            type: 'radio',
                            label: 'o_l',
                            link_type: true,
                            option_js: true
                        },
                        {
                            type: 'multi',
                            label: 'lbdim',
                            options: [
                                {
                                    id: 'lightbox_width',
                                    type: 'range',
                                    label: 'w',
                                    control: false,
                                    units: {
                                        px: {
                                            max: 3000
                                        },
                                        '%': ''
                                    }
                                },
                                {
                                    id: 'lightbox_height',
                                    label: 'ht',
                                    control: false,
                                    type: 'range',
                                    units: {
                                        px: {
                                            max: 3000
                                        },
                                        '%': ''
                                    }
                                }
                            ],
                            wrap_class: 'tb_group_element_lightbox lightbox_size'
                        },
                        {
                            id: 'button_color_bg',
                            type: 'layout',
                            label: 'c',
                            class: 'tb_colors',
                            mode: 'sprite',
                            color: true,
                            transparent: true
                        },
                        {
                            type: 'radio',
                            id: 't',
                            label: 'icon',
                            options: [
                                {
                                    value: 'i',
                                    name: 'icon'
                                },
                                {
                                    value: 'l',
                                    name: 'lt'
                                }
                            ],
                            option_js: true
                        },
                        {
                            id: 'icon',
                            type: 'icon',
                            label: 'icon',
                            wrap_class: 'tb_group_element_i',
                            class: 'fullwidth',
                            binding: {
                                empty: {
                                    hide: 'icon_alignment'
                                },
                                not_empty: {
                                    show: 'icon_alignment'
                                }
                            }
                        },
                        {
                            type: 'lottie',
                            wrap_class: 'tb_group_element_l',
                            binding: {
                                empty: {
                                    hide: 'icon_alignment'
                                },
                                not_empty: {
                                    show: 'icon_alignment'
                                }
                            }
                        },
                        {
                            id: 'icon_alignment',
                            type: 'select',
                            label: 'ialign',
                            options: {
                                left: 'left',
                                right: 'right'
                            }
                        },
                        {
                            id: 'title',
                            type: 'text',
                            label: 'tat'
                        },
                        {
                            id: 'id',
                            type: 'text',
                            label: 'idat'
                        }
                    ]
                },
                {
                    type: 'group',
                    label: 'btnapp',
                    display: 'accordion',
                    options: [
                        {
                            id: 'buttons_size',
                            label: 'size',
                            type: 'layout',
                            mode: 'sprite',
                            options: [
                                {
                                    img: 'normall_button',
                                    value: 'normal',
                                    label: 'def'
                                },
                                {
                                    img: 'small_button',
                                    value: 'small',
                                    label: 'sml'
                                },
                                {
                                    img: 'large_button',
                                    value: 'large',
                                    label: 'lrg'
                                },
                                {
                                    img: 'xlarge_button',
                                    value: 'xlarge',
                                    label: 'xlrg'
                                }
                            ],
                            control: {
                                classSelector: ''
                            }
                        },
                        {
                            id: 'buttons_shape',
                            type: 'layout',
                            mode: 'sprite',
                            label: 'shape',
                            options: [
                                {
                                    img: 'normall_button',
                                    value: 'normal',
                                    label: 'def'
                                },
                                {
                                    img: 'squared_button',
                                    value: 'squared',
                                    label: 'squared'
                                },
                                {
                                    img: 'circle_button',
                                    value: 'circle',
                                    label: 'circle'
                                },
                                {
                                    img: 'rounded_button',
                                    value: 'rounded',
                                    label: 'rounded'
                                }
                            ],
                            control: {
                                classSelector: ''
                            }
                        },
                        {
                            id: 'buttons_style',
                            type: 'layout',
                            mode: 'sprite',
                            label: 'bg',
                            options: [
                                {
                                    img: 'solid_button',
                                    value: 'solid',
                                    label: 'solid'
                                },
                                {
                                    img: 'outline_button',
                                    value: 'outline',
                                    label: 'o'
                                },
                                {
                                    img: 'transparent_button',
                                    value: 'transparent',
                                    label: 'transparent'
                                }
                            ],
                            control: {
                                classSelector: ''
                            }
                        },
                        {
                            id: 'display',
                            type: 'layout',
                            mode: 'sprite',
                            label: 'disp',
                            options: [
                                {
                                    img: 'horizontal_button',
                                    value: 'buttons-horizontal',
                                    label: 'hrztal'
                                },
                                {
                                    img: 'vertical_button',
                                    value: 'buttons-vertical',
                                    label: 'vertical'
                                }
                            ],
                            control: {
                                classSelector: ''
                            }
                        },
                        {
                            id: 'fullwidth_button',
                            type: 'toggle_switch',
                            label: 'fw',
                            options: {
                                on: {
                                    name: 'buttons-fullwidth'
                                }
                            },
                            binding: {
                                checked: {
                                    hide: 'display'
                                },
                                not_checked: {
                                    show: 'display'
                                }
                            }
                        },
                        {
                            id: 'nofollow_link',
                            type: 'toggle_switch',
                            label: 'nfollow',
                            options: {
                                on: {
                                    name: 'yes'
                                }
                            },
                            help: 'nfollowh',
                            control: false
                        },
                        {
                            id: 'download_link',
                            type: 'toggle_switch',
                            label: 'dwnable',
                            options: {
                                on: {
                                    name: 'yes'
                                }
                            },
                            help: 'dwnablef',
                            control: false
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_button'
                }
            ];
        }
        static default(){
            return {
                    content_button: [{
                        label: i18n.btntext,
                        link: 'https://themify.me/'
                    }
                ]
            };
        }
        static builderSave(settings){
            const def={
                buttons_size:'normal',
                buttons_shape:'normal',
                buttons_style:'solid',
                display:'buttons-horizontal'
            },
            btns=settings.content_button,
            units=['f_s_bic','f_s_h_bic'];
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(settings.fullwidth_button){
                delete settings.display;
            }
            if(btns){
                const btnDef={
                    icon_alignment:'left',
                    lightbox_width_unit:'px',
                    lightbox_height_unit:'px',
                    button_color_bg:'default',
                    link_options:'regular',
                    t:'i'
                },
                lottieDel= [
                    'st',
                    'count',
                    'sp',
                    'dir',
                    'seg',
                    'fid',
                    'r',
                    'lp'
                ];
                for(let i=btns.length-1;i>-1;--i){
                    let btn=btns[i];
                    for( let key in btnDef){
                        if(btn[key]===btnDef[key]){
                            delete btn[key];
                        }
                    }
                    if(!btn.link){
                        delete btn.link_options;
                        delete btn.button_color_bg;
                    }
                    if(btn.link_options!=='lightbox'){
                        delete btn.lightbox_width;
                        delete btn.lightbox_height;
                    }
                    if(!btn.lightbox_width){
                        delete btn.lightbox_width_unit;
                    }
                    if(!btn.lightbox_height){
                        delete btn.lightbox_height_unit;
                    }
                    if(btn.t==='l'){
                        delete btn.icon;
                    }
                    else{
                        delete btn.path;
                    }
                    if(!btn.path){
                        for(let i=lottieDel.length-1;i>-1;--i){
                            if(btn[lottieDel[i]]!==undefined){
                                delete btn[lottieDel[i]];
                            }
                        }
                    }
                }
            }
            for(let bps=api.breakpointsReverse,i=bps.length-1;i>-1;--i){
                let bp=bps[i];
                //Image Gradient
                this.clearImageGradient('background_image','background_color','background_repeat','background_position',bp,settings);
                this.clearImageGradient('b_i_h','bg_c_h','b_r_h','b_p_h',bp,settings);
                this.clearImageGradient('b_i','button_background_color','b_r','b_p',bp,settings);
                this.clearImageGradient('bl_i','button_hover_background_color','bl_r','bl_p',bp,settings);
                this.clearImageGradient('bic_b_i','bic_b_c','bic_b_r','bic_b_p',bp,settings);
                this.clearImageGradient('bic_b_i_h','bic_h_b_c','bic_b_r_h','bic_b_p_h',bp,settings);
                //Font color
                this.clearFontColor('font_color_type','font_color','font_gradient_color',bp,settings);
                this.clearFontColor('f_c_t_h','f_c_h','f_g_c_h',bp,settings);
                //Text Shadow
                this.clearShadow('text-shadow',0,bp,settings);
                this.clearShadow('t_sh_h',0,bp,settings);
                //paddings
                this.clearPadding('padding',bp,settings);
                this.clearPadding('p_h',bp,settings);
                this.clearPadding('padding_link',bp,settings);
                this.clearPadding('p_l_h',bp,settings);
                this.clearPadding('p_i_bic',bp,settings);
                this.clearPadding('p_i_bic_h',bp,settings);
                //margin
                this.clearPadding('margin',bp,settings);
                this.clearPadding('m_h',bp,settings);
                this.clearPadding('link_margin',bp,settings);
                this.clearPadding('l_m_h',bp,settings);
                this.clearPadding('m_i_bic',bp,settings);
                this.clearPadding('m_i_bic_h',bp,settings);
                //border-radius
                this.clearPadding('b_ra',bp,settings);
                this.clearPadding('r_c_h',bp,settings);
                this.clearPadding('l_b_r_c',bp,settings);
                this.clearPadding('l_b_r_c_h',bp,settings);
                this.clearPadding('rc_i_bic',bp,settings);
                this.clearPadding('rc_i_bic_h',bp,settings);
                //border
                this.clearBorder('border',bp,settings);
                this.clearBorder('b_h',bp,settings);
                this.clearBorder('link_border',bp,settings);
                this.clearBorder('l_b_h',bp,settings);
                this.clearBorder('b_i_bic',bp,settings);
                this.clearBorder('b_i_bic_h',bp,settings);
                //filters
                this.clearFilter('bl_m','css_f',bp,settings);
                this.clearFilter('_h','css_f_h',bp,settings);
                //width,height
                this.clearWidth('w',bp,settings);
                this.clearWidth('ht',bp,settings,1);
                //Box Shadow
                this.clearShadow('b_sh',1,bp,settings);
                this.clearShadow('sh_h',1,bp,settings);
                this.clearShadow('l_b_sh',1,bp,settings);
                this.clearShadow('l_b_sh_h',1,bp,settings);
                this.clearShadow('sh_i_bic',1,bp,settings);
                this.clearShadow('sh_i_bic_h',1,bp,settings);
                //position
                this.clearPosition('po',bp,settings);
                //transform
                this.clearTransform('tr',bp,settings);
                this.clearTransform('tr-h',bp,settings);
                //units
                this.clearUnits(units,bp,settings);
            }
            super.builderSave(settings);
        }
        _getItem(item,data){
            let buttonWrap = createElement('','module-buttons-item tf_in_flx tf_rel tb_is_repeat'),
                icon = item.t !== 'l' ? (item.icon ? api.Helper.getIcon(item.icon) : '') : api.Helper.getLottie(item, 'parent'),
                align=item.icon_alignment || 'left',
                iconEl = icon ? createElement('em') : undefined,
                constructor=this.constructor;


            iconEl?.appendChild(icon);

            if (item.link) {
                let color = !item.button_color_bg || item.button_color_bg === 'default' ? 'tb_default_color' : item.button_color_bg,
                    link = constructor._setEditableContent(createElement('a',{href:item.link,class:'ui builder_button tf_in_flx ' + color}),'label',item.label,'','content_button');
                if (item.id) {
                    link.id = item.id;
                }
                if (item.title) {
                    link.title = item.title;
                }
                if (data.download_link === 'yes') {
                    link.setAttribute('download', 1);
                }
                if (iconEl) {
                    align === 'right' ? link.appendChild(iconEl):link.prepend(iconEl);
                }
                buttonWrap.appendChild(link);
            } 
            else {
                buttonWrap.appendChild(constructor._setEditableContent(createElement('span','tf_inline_b tf_vmiddle'),'label',item.label,'','content_button'));
                if (iconEl) {
                    align === 'right' ?  buttonWrap.appendChild(iconEl):buttonWrap.prepend(iconEl);
                }
            }
            buttonWrap.appendChild(createElement('',{role:'button',title:'Delete Button',class:'tb_del_btn tb_del_mbtn tf_close tb_disable_sorting'}));
            return buttonWrap;
        }
        preview(data) {
            const {content_button:arr=[],buttons_size,buttons_shape} = data,
                module =createElement(),
                classes = ['module', 'module-buttons'];

            if (data.css_button) {
                classes.push(data.css_button);
            }
            if (buttons_size && buttons_size!== 'normal') {
                classes.push(buttons_size);
            }
            if (buttons_shape && buttons_shape !== 'normal') {
                classes.push(buttons_shape);
            }
            if (data.buttons_style) {
                classes.push(data.buttons_style);
            }
            if (data.fullwidth_button) {
                classes.push(data.fullwidth_button);
            } 
            else if (data.display) {
                classes.push(data.display);
            }
            module.tfOn(_CLICK_,e=>{
                const target=e.target,
                    cl=target?.classList;
                if(cl.contains('tb_add_mbtn') || cl.contains('tb_del_mbtn')){
                    e.stopPropagation();
                    if(cl.contains('tb_add_mbtn')){
                        if(api.activeModel?.id===this.id){
                            Themify.triggerEvent(api.LightBox.el.tfClass('add_new')[0],e.type);
                        }
                        else{
                            api.undoManager.start('inlineAdd');
                            const settings=this.get('mod_settings'),
                            def=this.constructor.default().content_button?.[0] || {},
                            item=this._getItem(def,settings);
                            settings.content_button??=[];
                            settings.content_button.push(def);
                            target.parentNode.after(item);
                            item.appendChild(target);
                            this.set('mod_settings',settings);
                            api.undoManager.end('inlineAdd');
                        }
                    }
                    else{
                        const item=target.closest('.module-buttons-item'),
                            index=Themify.convert(item.parentNode.tfClass('module-buttons-item')).indexOf(item);
                        if(index!==-1){
                            if(api.activeModel?.id===this.id){
                                Themify.triggerEvent(api.LightBox.el.tfClass('tb_delete_row')[index],e.type);
                            }
                            else{
                                api.undoManager.start('inlineDelete');
                                const settings=this.get('mod_settings'),
                                    addBtn=item.tfClass('tb_add_mbtn')[0];
                                settings.content_button.splice(index, 1); 
                                this.set('mod_settings',settings);
                                if(addBtn){
                                    item.previousElementSibling?.appendChild(addBtn);
                                }
                                item.remove();
                                api.undoManager.end('inlineDelete');
                            }
                        }
                    }
                }
            },{passive:true})
            .className = classes.join(' ');
    
            for (let i = 0,len=arr.length; i < len; ++i) {
                let item=this._getItem(arr[i],data);
                if((len -1)===i){
                    item.appendChild(createElement('span',{role:'button',title:'Add Button',class:'tb_add_btn tb_add_mbtn tf_plus_icon tb_disable_sorting'}));
                }
                module.appendChild(item);
            }
            return module;
        }
    };
})(tb_app);