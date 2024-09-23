(api=> {
    "use strict";
    api.ModuleStar = class extends api.Module {
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
                    id: 'rates',
                    type: 'builder',
                    options: [
                        {
                            type: 'text',
                            label: 'tbefore',
                            id: 'text_b',
                            control: {
                                selector: '.tb_star_text_b'
                            }
                        },
                        {
                            type: 'text',
                            label: 'tafter',
                            id: 'text_a',
                            control: {
                                selector: '.tb_star_text_a'
                            }
                        },
                        {
                            type: 'icon',
                            label: 'icon',
                            default:'fas fullstar',
                            id: 'ic'
                        },
                        {
                            id: 'count',
                            type: 'range',
                            label: 'strc',
                            default:5,
                            min: 1,
                            max: 20
                        },
                        {
                            id: 'rating',
                            type: 'slider_range',
                            label: 'rating',
                            default:5,
                            options: {
                                max: 20,
                                step: .1,
                                unit: '',
                                inputRange: true,
                                range: false
                            }
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
                    rates: [{}]
            };
        }
        static builderSave(settings) {
            const rates=settings.rates;
                
            if(rates){
                for(let i=rates.length-1;i>-1;--i){
                    let rate=rates[i];
                    if(~~rate.count===5){
                        delete rate.count;
                    }
                    if(~~rate.rating===5){
                        delete rate.rating;
                    }
                    if(rate.ic==='fas fullstar'){
                        delete rate.ic;
                    }
                }
            }
            super.builderSave(settings);
        }
        preview(data) {
            const module = createElement(),
                starWrap = createElement('','tb_star_wrap'),
                    rates=data.rates || [],
                    classes = ['module', 'module-star'],
                    constructor=this.constructor;

            if (data.css) {
                classes.push(data.css);
            }

            module.className = classes.join(' ');
            for(let i=0;i<rates.length;++i){
                let item=rates[i],
                    count =~~item.count || 5,
                    rating = parseFloat(parseFloat(item.rating || count).toFixed(2)),
                    starItem=createElement('','tb_star_item tb_star_animate tb_is_repeat'),
                    starContainer=createElement('','tb_star_container');
                    
                    if(item.text_b){
                        starItem.appendChild(constructor._setEditableContent(createElement('span','tb_star_text_b'),'text_b',item.text_b,'','rates',i));
                    }
                    for(let j=0;j<count;++j){
                        let icon=api.Helper.getIcon((item.ic || 'fas fullstar')),
                            cl=icon.classList;
                        if((rating-j)>=1){
                            cl.add('tb_star_fill');
                        }
                        else if(rating>j){
                            let gid='tb_'+data.cid+i,
                                decimal =(rating-~~rating).toFixed(2),
                                svg = createElementNS('',{width:0,height:0,'aria-hidden':true,style:'visibility:hidden;position:absolute'}),
                                defs= createElementNS('defs'),
                                linearGradient= createElementNS('linearGradient',{id:gid});
                                
                            cl.add('tb_star_half');
                            cl.remove('tb_star_fill');
                            icon.style.setProperty('--tb_star_half','url(#'+gid+')');
                            
                            linearGradient.append(createElementNS('stop',{class:'tb_star_fill',offset:(decimal*100)+'%'}),createElementNS('stop',{offset:(decimal*100)+'%','stop-color':'currentColor'}));
                            defs.appendChild(linearGradient);
                            svg.appendChild(defs);
                            
                            starContainer.appendChild(svg);
                        }
                        starContainer.appendChild(icon);
                    }
                    
                    starItem.appendChild(starContainer);
                    
                    if(item.text_a){
                        starItem.appendChild(constructor._setEditableContent(createElement('span','tb_star_text_a'),'text_a',item.text_a,'','rates',i));
                    }
                    starWrap.appendChild(starItem);
                    
            }
            if (data.m_t) {
                module.appendChild(constructor.getModuleTitle(data.m_t,'m_t'));
            }
            module.appendChild(starWrap);
            return module;
        }
    };
})(tb_app);