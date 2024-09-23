(api => {
    "use strict";
    api.ModuleTestimonialSlider = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_testimonial',
                    type: 'title'
                },
                {
                    id: 'tab_content_testimonial',
                    type: 'builder',
                    options: [
                        {
                            id: 'title_testimonial',
                            type: 'text',
                            label: 'testimtit',
                            control: {
                                selector: '.testimonial-title'
                            }
                        },
                        {
                            id: 'content_testimonial',
                            type: 'wp_editor',
                            control: {
                                selector: '.testimonial-entry-content'
                            }
                        },
                        {
                            id: 'person_picture_testimonial',
                            type: 'image',
                            label: 'perspic'
                        },
                        {
                            id: 'person_name_testimonial',
                            type: 'text',
                            label: 'persname',
                            control: {
                                selector: '.person-name'
                            }
                        },
                        {
                            id: 'person_position_testimonial',
                            type: 'text',
                            label: 'perspos',
                            control: {
                                selector: '.person-position'
                            }
                        },
                        {
                            id: 'company_testimonial',
                            type: 'text',
                            label: 'company',
                            control: {
                                selector: '.person-company'
                            }
                        },
                        {
                            id: 'company_website_testimonial',
                            type: 'text',
                            label: 'compweb'
                        },
                        {
                            type: 'multi',
                            label: 'rstar',
                            options: [
                                {
                                    type: 'icon',
                                    label: 'icon',
                                    id: 'ic',
                                    binding: {
                                        empty: {
                                            hide: 'tb_rate_wrap'
                                        },
                                        not_empty: {
                                            show: 'tb_rate_wrap'
                                        }
                                    }
                                },
                                {
                                    id: 'count',
                                    type: 'range',
                                    wrap_class: 'tb_rate_wrap',
                                    label: 'strc',
                                    default:5,
                                    min: 1,
                                    max: 20
                                },
                                {
                                    id: 'rating',
                                    type: 'slider_range',
                                    wrap_class: 'tb_rate_wrap',
                                    label: 'rating',
                                    default:5,
                                    options: {
                                        max: 20,
                                        step: 0.1,
                                        unit: '',
                                        inputRange: true,
                                        range: false
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'type_testimonial',
                    type: 'radio',
                    label: 'type',
                    options: [
                        {
                            value: 'slider',
                            name: 'slider'
                        },
                        {
                            value: 'grid',
                            name: 'grid'
                        }
                    ],
                    option_js: true,
                    binding : {
                        slider : { hide : 'items_per_slide' }
                    }
                },
                {
                    id: 'grid_layout_testimonial',
                    type: 'layout',
                    label: 'gridl',
                    mode: 'sprite',
                    post_grid: true,
                    default:'list-post',
                    binding: {
                        grid4: {
                            show: 'masonry'
                        },
                        grid3: {
                            show: 'masonry'
                        },
                        grid2: {
                            show: 'masonry'
                        },
                        'list-post': {
                            hide: 'masonry'
                        }
                    },
                    control: {
                        classSelector: '.themify_builder_testimonial'
                    },
                    wrap_class: 'tb_group_element_grid'
                },
                {
                    id: 'masonry',
                    type: 'toggle_switch',
                    label: 'masnry',
                    options: {
                        on: {
                            name: 'enable',
                            value: 'en'
                        },
                        off: {
                            name: 'disable',
                            value: 'dis'
                        }
                    },
                    wrap_class: 'tb_group_element_grid'
                },
                {
                    id: 'layout_testimonial',
                    type: 'layout',
                    label: 'lay',
                    mode: 'sprite',
                    default:'image-top',
                    options: [
                        {
                            img: 'testimonials_image_top',
                            value: 'image-top',
                            label: 'imgtop'
                        },
                        {
                            img: 'testimonials_image_bottom',
                            value: 'image-bottom',
                            label: 'imgbtm'
                        },
                        {
                            img: 'testimonials_image_bubble',
                            value: 'image-bubble',
                            label: 'imgbubl'
                        }
                    ],
                    control: {
                        classSelector: '.themify_builder_slider_wrap'
                    }
                },
                {
                    id: 'img_w_slider',
                    type: 'number',
                    label: 'imgw',
                    after: 'px'
                },
                {
                    id: 'img_h_slider',
                    type: 'number',
                    label: 'imgh',
                    after: 'px'
                },
                {
                    id: 'slider_option_testimonial',
                    type: 'slider',
                    wrap_class: 'tb_group_element_slider'
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_testimonial'
                }
            ];
        }
        static default() {
            return {
                img_h_slider: 100,
                img_w_slider: 100,
                tab_content_testimonial: [
                    {
                        title_testimonial: 'Optional Title',
                        content_testimonial: i18n.testimcont,
                        person_name_testimonial: 'John Smith',
                        person_position_testimonial: 'CEO',
                        company_testimonial: 'X-corporation',
                        ic: 'fas fullstar'
                    }
                ]
            };
        }
        static builderSave(settings) {
            const def = {
                type_testimonial:'slider',
                layout_testimonial: 'image-top',
                grid_layout_testimonial:'list-post'
            },
            testominals=settings.tab_content_testimonial;
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            delete settings.items_per_slide;
            if(!settings.grid_layout_testimonial){
                delete settings.masonry;
            }
            this.clearSliderOptions(settings,!!settings.type_testimonial);
            if(testominals){
                for(let i=testominals.length-1;i>-1;--i){
                    let testominal=testominals[i];
                    if(!testominal.ic || ~~testominal.count===5){
                        delete testominal.count;
                    }
                    if(!testominal.ic || ~~testominal.rating===5){
                        delete testominal.rating;
                    }
                    if(!testominal.person_name_testimonial){
                        delete testominal.person_position_testimonial;
                        delete testominal.company_testimonial;
                    }
                    if(!testominal.company_testimonial){
                        delete testominal.company_website_testimonial;
                    }
                }
            }
            super.builderSave(settings);
        }
        _getItem(item, data,index,isSlider) {
            const post = createElement('','post tb_is_repeat'),
                testimonial = createElement('','testimonial-item tf_rel'),
                content = createElement('','testimonial-content'),
                repeatId='tab_content_testimonial',
                constructor=this.constructor;
                
            if (item.title_testimonial){
                content.appendChild(constructor._setEditableContent(createElement('h3','testimonial-title'),'title_testimonial',item.title_testimonial,'',repeatId,index));
            }
            if(item.ic){
                const ratingWrap=createElement('','tb_rating_wrap'),
                    count =~~item.count || 5,
                    rating = parseFloat(parseFloat(item.rating || count).toFixed(2));
                for(let j=0;j<count;++j){
                    let icon=api.Helper.getIcon(item.ic),
                            cl=icon.classList;
                        if((rating-j)>=1){
                            cl.add('tb_rating_fill');
                        }
                        else if(rating>j){
                            let gid='tb_'+data.cid+index,
                                decimal =(rating-~~rating).toFixed(2),
                                svg = createElementNS('',{width:0,height:0,'aria-hidden':true,style:'visibility:hidden;position:absolute'}),
                                defs= createElementNS('defs'),
                                linearGradient= createElementNS('linearGradient',{id:gid});
                                
                            cl.add('tb_rating_half');
                            cl.remove('tb_rating_fill');
                            icon.style.setProperty('--tb_rating_half','url(#'+gid+')');
                            
                            
                            linearGradient.append(createElementNS('stop',{class:'tb_rating_fill',offset:(decimal*100)+'%'}),createElementNS('stop',{offset:(decimal*100)+'%','stop-color':'currentColor'}));
                            defs.appendChild(linearGradient);
                            svg.appendChild(defs);
                            
                            ratingWrap.appendChild(svg);
                        }
                        ratingWrap.appendChild(icon);
                }
                content.appendChild(ratingWrap);
            }
            if (item.content_testimonial){
                const contentTestimonial=constructor._setEditableContent(createElement('','testimonial-entry-content'),'content_testimonial','',1,repeatId,index);
                if(item.content_testimonial){
                    contentTestimonial.innerHTML=this.shortcodeToHTML(item.content_testimonial).content;
                }
                content.appendChild(contentTestimonial);
            }
            
            if (item.person_picture_testimonial) {
                const img=constructor.setEditableImage(createElement('img',{title:item.title_testimonial || ''}),'person_picture_testimonial','img_w_slider','img_h_slider',data,repeatId,index),
                    figure=createElement('figure','testimonial-image tf_rel');
                img.src=item.person_picture_testimonial;
                figure.appendChild(img);
                content.appendChild(figure);
            }
            
            if (item.person_name_testimonial){
                const author=createElement('','testimonial-author');
                author.appendChild(constructor._setEditableContent(createElement('','person-name'),'person_name_testimonial',item.person_name_testimonial,'',repeatId,index));
                
                if (item.person_position_testimonial){
                    author.appendChild(constructor._setEditableContent(createElement('','person-position'),'person_position_testimonial',item.person_position_testimonial,'',repeatId,index));
                }
                if (item.company_testimonial){
                    let company=createElement('','person-company'),
                        editItem=company;
                    
                    if(item.company_website_testimonial){
                        editItem=createElement('a',{href:item.company_website_testimonial});
                        company.appendChild(editItem);
                    }
                    constructor._setEditableContent(editItem,'company_testimonial',item.company_testimonial,'',repeatId,index);
                    
                    author.appendChild(company);
                }
                content.appendChild(author);
            }
            
            if(isSlider){
                post.className+=' tf_swiper-slide';
                if (data.left_margin_slider>0) {
                    testimonial.style.marginLeft=data.left_margin_slider+'px';
                }
                if (data.right_margin_slider>0) {
                    testimonial.style.marginRight=data.right_margin_slider+'px';
                }
            }

            testimonial.append(content,createElement('',{role:'button',class:'tb_del_btn tb_del_tstimbtn tf_close tb_disable_sorting',title:'Delete Testimonial'}));
            post.appendChild(testimonial);

            return post;
        }
        preview(data) {
            let arr=data.tab_content_testimonial || [],
                isSlider=!data.type_testimonial || data.type_testimonial==='slider',
                module = createElement(),
                wrap= createElement('',isSlider?'themify_builder_slider tf_carousel tf_swiper-container tf_rel tf_overflow':'themify_builder_testimonial loops-wrapper builder-posts-wrap tf_rel tf_clear'),
                classes = ['module', 'module-testimonial-slider','tf_clearfix',data.layout_testimonial || 'image-top'],
                itemsWrap=wrap,
                dataset=wrap.dataset;
            if(isSlider){
                classes.push('themify_builder_slider_wrap');
                if(data.img_fullwidth_slider==='fullwidth'){
                    classes.push('slide-image-fullwidth');
                }
                if(data.show_arrow_buttons_vertical==='vertical' && (!data.show_arrow_slider || data.show_arrow_slider==='yes')){
                    classes.push('slide-image-themify_builder_slider_vertical');
                    dataset.nav_out=1;
                }
            }
            if (data.css_slider) {
                classes.push(data.css_slider);
            }
            
            module.className = classes.join(' ');
            if(!isSlider){
                if(data.grid_layout_testimonial){
                    wrap.className+=' '+data.grid_layout_testimonial;
                }
                if(data.masonry==='enable'){
                    wrap.className+=' masonry';
                }
            }
            else{
                const opt={...{
					open_link_new_tab_slider:'no',
					pause_on_hover_slider:'resume',
					unlink_feat_img_slider:'no',
					unlink_post_title_slider:'no',
                    auto_scroll_opt_slider:'off',
                    scroll_opt_slider:1,
                    speed_opt_slider:1
				},...data},
                cssUrl=ThemifyBuilderModuleJs.cssUrl+'sliders/',
                isHorizontal=opt.horizontal=== 'yes';
                dataset.visible=isHorizontal ? 4 : (opt.visible_opt_slider || '');
                dataset.scroll=opt.scroll_opt_slider;
                if(opt.tab_visible_opt_slider){
                    dataset.tabVisible=opt.tab_visible_opt_slider;
                }
                if(opt.mob_visible_opt_slider){
                    dataset.mobVisible=opt.mob_visible_opt_slider;
                }
                if(opt.auto_scroll_opt_slider!=='off'){
                    dataset.auto=opt.auto_scroll_opt_slider*1000;
                    dataset.controller=opt.play_pause_control=== 'yes'?1:0;
                    dataset.pause_hover=opt.pause_on_hover_slider=== 'resume'?1:0;
                }
                dataset.speed=opt.speed_opt_slider === 'slow' ? 4 : (opt.speed_opt_slider === 'fast' ? .5 : opt.speed_opt_slider);
                dataset.wrapvar=opt.wrap_slider!== 'no'?1:0;
                dataset.slider_nav=opt.show_arrow_slider!== 'no'?1:0;
                dataset.pager=opt.show_nav_slider!== 'no'?1:0;
                dataset.effect=opt.effect_slider || 'scroll';
                dataset.height=isHorizontal || !opt.height_slider? 'variable' : opt.height_slider;
                dataset.horizontal=isHorizontal?1:0;
                dataset.css_url=cssUrl+'carousel,'+cssUrl+'slider';
                if(opt.touch_swipe){
                    dataset.touch_swipe=opt.touch_swipe;
                }
                
                itemsWrap=createElement('','tf_swiper-wrapper tf_lazy tf_rel tf_w tf_h tf_textc');
                wrap.appendChild(itemsWrap);
            }
            for (let i = 0; i < arr.length; ++i) {
                itemsWrap.appendChild(this._getItem(arr[i], data,i,isSlider));
            }
            module.tfOn(_CLICK_, e => {
                const target=e.target,
                    cl=target?.classList;
                if(cl.contains('tb_add_tstimbtn') || cl.contains('tb_del_tstimbtn')){
                    e.stopPropagation();
                    if(cl.contains('tb_add_tstimbtn')){
                        if (api.activeModel?.id === this.id) {
                            Themify.triggerEvent(api.LightBox.el.tfClass('add_new')[0], e.type);
                        } else {
                            api.undoManager.start('inlineAdd');
                            const settings = this.get('mod_settings'),
                                def = this.constructor.default().tab_content_testimonial?.[0] || {};
                            settings.tab_content_testimonial??= [];
                            settings.tab_content_testimonial.push(def);
                            this.set('mod_settings', settings);
                            if(!settings.type_testimonial || settings.type_testimonial==='slider'){
                                this.previewLive(settings);
                            }
                            else{
                               target.parentNode.tfClass('builder-posts-wrap')[0].appendChild(this._getItem(def, settings));
                            }
                            api.undoManager.end('inlineAdd');
                        }
                    }
                    else{
                        let item = target.closest('.post'),
                        index = item.dataset.swiperSlideIndex??Themify.convert(item.parentNode.tfClass('post')).indexOf(item);
                        if (index !== -1) {
                            index=~~index;
                            if (api.activeModel?.id === this.id) {
                                Themify.triggerEvent(api.LightBox.el.tfClass('tb_delete_row')[index], e.type);
                            } 
                            else {
                                api.undoManager.start('inlineDelete');
                                const settings = this.get('mod_settings');
                                settings.tab_content_testimonial.splice(index, 1);
                                this.set('mod_settings', settings);
                                if(!settings.type_testimonial || settings.type_testimonial==='slider'){
                                    this.previewLive(settings);
                                }else{
                                    item.remove();
                                }
                                api.undoManager.end('inlineDelete');
                            }
                        }
                    }
                }

            }, {passive: true});
            
            if (data.mod_title_testimonial) {
                module.appendChild(this.constructor.getModuleTitle(data.mod_title_testimonial,'mod_title_testimonial'));
            }
            module.append(wrap,createElement('',{role:'button',class:'tb_add_btn tb_add_tstimbtn tf_plus_icon tb_disable_sorting',title:'Add Testimonial'}));
            return module;
        }
    };
})(tb_app);