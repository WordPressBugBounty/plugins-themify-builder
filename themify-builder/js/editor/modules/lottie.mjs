(api=> {
    "use strict";
    api.ModuleLottie = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'm_t',
                    type: 'title'
                },
                {
                    id: 'loop',
                    label: 'loopall',
                    type: 'toggle_switch',
                    default:'on',
                    options: {
                        on: {
                            name: '1',
                            value: 'y'
                        },
                        off: {
                            name:'0',
                            value: 'n'
                        }
                    }
                },
                {
                    type: 'builder',
                    id: 'actions',
                    options: [
                        {
                            type: 'lottie',
                            multi: 1
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css'
                }
            ];
        }
        static builderSave(settings){
            const actions=settings.actions;
            if(~~settings.loop===1){
                delete settings.loop;
            }
            if(actions){
                for(let i=actions.length-1;i>-1;--i){
                    let act=actions[i];
                    if(!act.path){
                        actions.splice(i, 1); 
                    }else{
                        if(act.delay<=0){
                            delete act.delay;
                        }
                        if(act.sp!==undefined && ~~act.sp===1){
                            delete act.sp;
                        }
                    }
                }
            }
            super.builderSave(settings);
        }
        preview(data) {
            const module = createElement(),
                    lottie = createElement('tf-lottie'),
                    template=createElement('template'),
                    classes = ['module', 'module-lottie'],
                    json={actions:(data.actions || [])};
            if (data.css) {
                classes.push(data.css);
            }
            if(~~data.loop===1 || data.loop===undefined){
                json.loop=1;
            }
            module.className = classes.join(' ');
            if(data.m_t){
                module.appendChild(this.constructor.getModuleTitle(data.m_t,'m_t'));
            }
            template.innerHTML=JSON.stringify(json);
            lottie.appendChild(template);
            module.appendChild(lottie);
            return module;
        }
    };
})(tb_app);