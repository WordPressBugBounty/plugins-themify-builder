(api => {
    "use strict";
    api.ModuleSocialShare = class extends api.Module {
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
                    id: 'networks',
                    type: 'checkbox',
                    label: 'nw',
                    options: [
                        {
                            name: 'fb',
                            value: 'fb'
                        },
                        {
                            name: 'tw',
                            value: 'tw'
                        },
                        {
                            name: 'lk',
                            value: 'lk'
                        },
                        {
                            name: 'pi',
                            value: 'pi'
                        },
                        {
                            name: 'em',
                            value: 'em'
                        }
                    ]
                },
                {
                    id: 'size',
                    label: 'size',
                    type: 'layout',
                    mode: 'sprite',
                    default:'normal',
                    options: [
                        {
                            img: 'normall_button',
                            value: 'normal',
                            label: 'n'
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
                        prefix:'tb_ss_size_',
                        classSelector: ''
                    }
                },
                {
                    id: 'shape',
                    label: 'ishape',
                    type: 'layout',
                    mode: 'sprite',
                    default:'none',
                    options: [
                        {
                            img: 'circle_button',
                            value: 'circle',
                            label: 'circle'
                        },
                        {
                            img: 'rounded_button',
                            value: 'rounded',
                            label: 'rounded'
                        },
                        {
                            img: 'squared_button',
                            value: 'squared',
                            label: 'squared'
                        },
                        {
                            img: 'none',
                            value: 'none',
                            label: 'none'
                        }
                    ],
                    control: {
                        prefix:'tb_ss_shape_',
                        classSelector: ''
                    }
                },
                {
                    id: 'arrangement',
                    label: 'arrang',
                    type: 'layout',
                    mode: 'sprite',
                    default:'h',
                    options: [
                        {
                            img: 'horizontal_button',
                            value: 'h',
                            label: 'hrztal'
                        },
                        {
                            img: 'vertical_button',
                            value: 'v',
                            label: 'vertical'
                        }
                    ]
                },
                {
                    id: 'title',
                    type: 'toggle_switch',
                    label: 'title',
                    default:'off'
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css'
                }
            ];
        }
        static default() {
            return {
                networks: 'fb|tw|pi|em'
            };
        }
        static builderSave(settings) {
            const def = {
                size: 'normal',
                shape: 'none',
                arrangement: 'h',
                title: 'yes'
            };
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            super.builderSave(settings);
        }
        preview(data) {
            const module = createElement(),
                wrapper = createElement('', 'module-social-share-wrapper'),
                nets = data.networks?.split('|') || [],
                info=nets.length===0?{}:{
                    fb:{icon:'ti-facebook',type:'facebook'},
                    tw:{icon:'fab x-twitter',type:'twitter'},
                    lk:{icon:'ti-linkedin',type:'linkedin'},
                    pi:{icon:'ti-pinterest',type:'pinterest'},
                    em:{icon:'ti-email',type:'email'}
                },
                classes = ['module', 'module-social-share'];
            if (data.css_social_share) {
                classes.push(data.css_social_share);
            }
            data.shape = data.shape || 'none';
            classes.push('tb_ss_shape_'+data.shape);
            if(data.size){
                classes.push('tb_ss_size_'+data.size);
            }
            module.className = classes.join(' ');
            for(let i=0;i<nets.length;++i){
                let item=createElement('','ss_anchor_wrap'),
                    link=createElement('a',{href:'#','data-type':info[nets[i]].type}),
                    icon=createElement('em','tb_social_share_icon');
                    
                if(data.arrangement!=='v'){
                    item.className+=' tf_inline_b';
                }
                
                icon.appendChild(api.Helper.getIcon(info[nets[i]].icon));
                link.appendChild(icon);
                
                if(data.title==='no'){ 
                    link.appendChild(createElement('span','tb_social_share_title',i18n[nets[i]]));
                }
                item.appendChild(link);
                wrapper.appendChild(item);
            }
            if (data.mod_title) {
                module.appendChild(this.constructor.getModuleTitle(data.mod_title,'mod_title'));
            }
            module.appendChild(wrapper);
            return module;
        }
    };
})(tb_app);