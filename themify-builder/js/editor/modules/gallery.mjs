(api => {
    "use strict";
    api.ModuleGallery = class extends api.Module {
        static cache=new Map;
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            const tcols = {'': '', '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9},
                    cols = {...tcols};
            delete cols[''];
            const imgPhp = !!themifyBuilder.imgphp,
                    opts = [
                        {
                            id: 'mod_title_gallery',
                            type: 'title'
                        },
                        {
                            id: 'layout_gallery',
                            type: 'radio',
                            label: 'glayout',
                            options: [
                                {
                                    value: 'grid',
                                    name: 'grid'
                                },
                                {
                                    value: 'showcase',
                                    name: 'shcase'
                                },
                                {
                                    value: 'lightboxed',
                                    name: 'lbxed'
                                },
                                {
                                    value: 'slider',
                                    name: 'slider'
                                }
                            ],
                            wrap_class: 'tb_compact_radios',
                            option_js: true,
							binding : {
								slider : { hide : 'items_per_slide' }
							}
                        },
                        {
                            id: 'layout_masonry',
                            type: 'toggle_switch',
                            label: 'masnry',
                            options: {
                                on: {
                                    name: 'masonry',
                                    value: 'en'
                                },
                                off: {
                                    name: '',
                                    value: 'dis'
                                }
                            },
                            wrap_class: 'tb_group_element_grid'
                        },
                        {
                            id: 'thumbnail_gallery',
                            type: 'image',
                            label: 'thmb',
                            class: 'large',
                            wrap_class: 'tb_group_element_lightboxed'
                        },
                        {
                            id: 'shortcode_gallery',
                            type: 'gallery',
                            label: 'galsh',
                            required: {
                                message: 'galerr'
                            }
                        },
                        {
                            id: 'gallery_pagination',
                            label: 'pagin',
                            type: 'toggle_switch',
                            options: {
                                on: {
                                    name: 'pagination',
                                    value: 'en'
                                },
                                off: {
                                    name: '',
                                    value: 'dis'
                                }
                            },
                            binding: {
                                checked: {
                                    show: 'gallery_per_page'
                                },
                                not_checked: {
                                    hide: 'gallery_per_page'
                                }
                            },
                            wrap_class: 'tb_group_element_grid'
                        },
                        {
                            id: 'gallery_per_page',
                            type: 'number',
                            label: 'imgprpg',
                            wrap_class: 'tb_group_element_grid tb_checkbox_element_pagination'
                        },
                        {
                            id: 'slider_thumbs',
                            type: 'toggle_switch',
                            label: 'slthmb',
                            default: 'on',
                            options: {
                                on: {
                                    name: '',
                                    value: 's'
                                },
                                off: {
                                    name: 'yes',
                                    value: 'hi'
                                }
                            },
                            wrap_class: 'tb_group_element_slider'
                        },
                        {
                            id: 'gallery_image_title',
                            label: 'imgt',
                            type: 'toggle_switch',
                            options: {
                                on: {
                                    name: 'yes',
                                    value: 's'
                                },
                                off: {
                                    name: '',
                                    value: 'hi'
                                }
                            }
                        },
                        {
                            id: 'gallery_exclude_caption',
                            label: 'imgc',
                            type: 'toggle_switch',
                            default: 'on',
                            options: {
                                on: {
                                    name: '',
                                    value: 's'
                                },
                                off: {
                                    name: 'yes',
                                    value: 'hi'
                                }
                            }
                        },
                        {
                            id: 's_image_w_gallery',
                            type: 'number',
                            label: 'imgw',
                            min:1,
                            hide: imgPhp,
                            after: 'px',
                            wrap_class: 'tb_group_element_showcase tb_group_element_slider'
                        },
                        {
                            id: 's_image_h_gallery',
                            type: 'number',
                            label: 'imgh',
                            hide: imgPhp,
                            after: 'px',
                            wrap_class: 'tb_group_element_showcase tb_group_element_slider'
                        },
                        {
                            id: 's_image_size_gallery',
                            label: 'mimgs',
                            type: 'image_size'
                        },
                        {
                            id: 'thumb_w_gallery',
                            type: 'number',
                            label: 'thmbw',
                            min:1,
                            hide: imgPhp,
                            after: 'px'
                        },
                        {
                            id: 'thumb_h_gallery',
                            type: 'number',
                            label: 'thmbh',
                            hide: imgPhp,
                            after: 'px'
                        },
                        {
                            id: 'image_size_gallery',
                            type: 'image_size'
                        },
                        {
                            id: 'gallery_columns',
                            type: 'select',
                            label: 'clmns',
                            options: cols,
                            default: '3',
                            wrap_class: 'tb_group_element_grid'
                        },
                        {
                            id: 't_columns',
                            type: 'select',
                            label: '',
                            after: 'tclmns',
                            options: tcols,
                            wrap_class: 'tb_group_element_grid',
                            default: ''
                        },
                        {
                            id: 'm_columns',
                            type: 'select',
                            label: '',
                            after: 'mclmns',
                            options: tcols,
                            wrap_class: 'tb_group_element_grid',
                            default: ''
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_group_element_grid tb_group_element_slider',
                            options: [
                                {
                                    id: 'link_opt',
                                    type: 'select',
                                    label: 'lto',
                                    default:'file',
                                    options: {
                                        post: 'attpage',
                                        file: 'medf',
                                        none: 'none'
                                    },
                                    binding: {
                                        file: {
                                            show: [
                                                'lightbox',
                                                'link_image_size',
                                                'lightbox_title'
                                            ]
                                        },
                                        post: {
                                            hide: [
                                                'lightbox',
                                                'link_image_size',
                                                'lightbox_title'
                                            ]
                                        },
                                        none: {
                                            hide: [
                                                'lightbox',
                                                'link_image_size',
                                                'lightbox_title'
                                            ]
                                        }
                                    }
                                },
                                {
                                    id: 'lightbox',
                                    type: 'select',
                                    label: 'enlihbx',
                                    options: {
                                        '': 'def',
                                        y: 'y',
                                        n: 'no'
                                    }
                                },
                                {
                                    id: 'link_image_size',
                                    type: 'select',
                                    label: 'limgs',
                                    default:'full',
                                    image_size: true
                                },
                                {
                                    id: 'lightbox_title',
                                    label: 'lbimgt',
                                    type: 'toggle_switch',
                                    default: 'on',
                                    options: {
                                        on: {
                                            name: '',
                                            value: 's'
                                        },
                                        off: {
                                            name: 'no',
                                            value: 'hi'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            id: 'appearance_gallery',
                            type: 'checkbox',
                            label: 'imgapp',
                            img_appearance: true
                        },
                        {
                            type: 'slider',
                            wrap_class: 'tb_group_element_slider'
                        },
                        {
                            type: 'custom_css_id',
                            custom_css: 'css_gallery'
                        }
                    ];
            for (let i = opts.length - 1; i > -1; --i) {
                if (opts[i].hide === true) {
                    opts.splice(i, 1);
                }
            }
            return opts;
        }
        static default() {
            return {
                auto_scroll_opt_slider: '4',
                gallery_columns: '4',
                visible_opt_slider: '4',
                link_image_size: 'full',
                link_opt: 'file',
                thumb_w_gallery: 300,
                thumb_h_gallery: 200
            };
        }
        async edit(type){
            await super.edit(type);
            if((!type || type==='setting') && !this.get('mod_settings').shortcode_gallery){
                ThemifyConstructor.afterRun.push(() => {
                    Themify.triggerEvent(ThemifyConstructor.getEl('shortcode_gallery').parentNode.tfClass('builder_button')[0], _CLICK_);
                });
            }
        }
        static builderSave(settings) {
            const def = {
                layout_gallery: 'grid',
                image_size_gallery: 'thumbnail',
                s_image_size_gallery: 'full',
                gallery_columns: '3',
                link_image_size: 'full',
                appearance_gallery:false
            },
            layout = settings.layout_gallery|| def.layout_gallery;
			delete settings.items_per_slide;
            
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }

            if (layout !== 'grid') {
                delete settings.gallery_pagination;
                delete settings.layout_masonry;
                delete settings.gallery_columns;
                delete settings.t_columns;
                delete settings.m_columns;
                if (layout !== 'slider') {
                    delete settings.link_opt;
                }
            }
            else{
                
                if(settings.m_columns && settings.t_columns && ~~settings.m_columns===~~settings.t_columns){
                    delete settings.m_columns;
                }

                if(settings.gallery_columns && settings.t_columns && ~~settings.gallery_columns===~~settings.t_columns){
                    delete settings.t_columns;
                }
            }
            
            
            if(layout !== 'slider' && layout !== 'showcase'){
                delete settings.s_image_w_gallery;
                delete settings.s_image_h_gallery;
                delete settings.s_image_size_gallery;
            }
            
            if(layout !== 'lightboxed'){
                delete settings.thumbnail_gallery;
            }
            
            if (!settings.gallery_pagination) {
                delete settings.gallery_per_page;
            }
            else if(!settings.gallery_per_page){
                delete settings.gallery_pagination;
            }
            
            if (settings.link_opt !== 'file') {
                delete settings.lightbox;
                delete settings.link_image_size;
                delete settings.lightbox_title;
            }
            
            if(settings.appearance_gallery==='|' || settings.appearance_gallery==='false'){
                delete settings.appearance_gallery;
            }
            
            this.clearSliderOptions(settings,layout !== 'slider');
            for(let bps=api.breakpointsReverse,i=bps.length-1;i>-1;--i){
                let bp=bps[i];
                 //Image Gradient
                this.clearImageGradient('background_image','background_color','background_repeat','background_position',bp,settings);
                this.clearImageGradient('b_i_h','bg_c_h','b_r_h','b_p_h',bp,settings);
                //Font color
                this.clearFontColor('font_color_type','font_color','font_gradient_color',bp,settings);
                this.clearFontColor('f_c_t_h','f_c_h','f_g_c_h',bp,settings);
                //Text Shadow
                this.clearShadow('text-shadow',0,bp,settings);
                this.clearShadow('t_sh_h',0,bp,settings);
                this.clearShadow('t_sh_m_t',0,bp,settings);
                this.clearShadow('t_sh_m_t_h',0,bp,settings);
                //paddings
                this.clearPadding('padding',bp,settings);
                this.clearPadding('p_h',bp,settings);
                this.clearPadding('g_i_p',bp,settings);
                this.clearPadding('g_i_p_h',bp,settings);
                //margin
                this.clearPadding('margin',bp,settings);
                this.clearPadding('m_h',bp,settings);
                this.clearPadding('g_i_m',bp,settings);
                this.clearPadding('g_i_m_h',bp,settings);
                //border-radius
                this.clearPadding('b_ra',bp,settings);
                this.clearPadding('r_c_h',bp,settings);
                this.clearPadding('g_i_r_c',bp,settings);
                this.clearPadding('g_i_r_c_h',bp,settings);
                //border
                this.clearBorder('border',bp,settings);
                this.clearBorder('b_h',bp,settings);
                this.clearBorder('g_i_b',bp,settings);
                this.clearBorder('g_i_b_h',bp,settings);
                //filters
                this.clearFilter('bl_m','css_f',bp,settings);
                this.clearFilter('_h','css_f_h',bp,settings);
                //width,height
                this.clearWidth('w',bp,settings);
                this.clearWidth('ht',bp,settings,1);
                this.clearWidth('w_ctrl',bp,settings);
                this.clearWidth('h_ctrl',bp,settings,1,'mi_h_ctrl','mx_h_ctrl');
                //Box Shadow
                this.clearShadow('b_sh',1,bp,settings);
                this.clearShadow('sh_h',1,bp,settings);
                this.clearShadow('g_i_b_sh',1,bp,settings);
                this.clearShadow('g_i_b_sh_h',1,bp,settings);
                //transform
                this.clearTransform('tr',bp,settings);
                this.clearTransform('tr-h',bp,settings);
            }
            super.builderSave(settings);
        }
        async imageEditEnd(activeEl,imgObj,w,h){
            if(this.el.tfClass('gallery-masonry')[0]){
                return api.Utils.runJs(this.el,'module');
            }
            else if(activeEl.dataset.w==='s_image_w_gallery'){
                const thumbs=this.el.querySelectorAll('.layout-showcase [data-image]'),
                    prms=[];
                for(let i=thumbs.length-1;i>-1;--i){
                    let p=ThemifyImageResize.toBlob(thumbs[i], w, h);
                    p.then(url=>{
                        if(url){
                            thumbs[i].dataset.image = url;
                        }
                    })     
                    .catch(()=>{

                    });
                    prms.push(p);
                }
                return Promise.all(prms);
            }
        }
        inlineUpdateModule(){
            return false;
        }
        preview(data) {
            const module = createElement(),
                layout=data.layout_gallery|| 'grid',
                classes=['module','gallery','module-gallery','layout-'+layout],
                shortcode=data.shortcode_gallery;
            if (data.appearance_gallery) {
                classes.push(data.appearance_gallery.split('|').join(' '));
            }
            if(data.css_gallery){
                classes.push(data.css_gallery);
            }
            if (data.mod_title_gallery) {
                module.appendChild(this.constructor.getModuleTitle(data.mod_title_gallery,'mod_title_gallery'));
            }
            module.className=classes.join(' ');
            if(shortcode){
                ThemifyConstructor.gallery.getImages(shortcode).then(async images=>{
                    if(images?.length>0){
                        const el=await this[layout].call(this,images,data);
                        module.appendChild(el);
                        if(layout!=='lightboxed'){
                            this.bindEvents(module,data);
                        }
                        api.Utils.runJs(this.el,'module');
                    }
                });
            }
            return module;
        }
        getShortcodeValue(){
            let value=this.get('mod_settings').shortcode_gallery;
            if(api.activeModel?.id===this.id){
               const textarea=ThemifyConstructor.getEl('shortcode_gallery');
                if(textarea){
                   value=textarea.value;
                }
            }
            return value;
        }
        setShortcodeValue(shortcode,trigger=true){
            if(api.activeModel?.id===this.id){
                ThemifyConstructor.settings.shortcode_gallery=shortcode;
                const textarea=ThemifyConstructor.getEl('shortcode_gallery');
                if(textarea){
                   textarea.value=shortcode;
                    if(trigger){
                        Themify.triggerEvent(textarea,'change');
                        return true;
                    }
                }
            }
            else{
                api.undoManager.start('inline');
                this.get('mod_settings').shortcode_gallery=shortcode;
                api.undoManager.end('inline');
            }
        }
        bindEvents(el,data){
            el.tfOn(_CLICK_,async e=>{
                const target=e.target?.closest('.tb_add_gal_btn,.tb_del_gal');
                if(target){
                    e.stopPropagation();
                    if(target.classList.contains('tb_del_gal')){
                        e.preventDefault();
                        const itemId=target.dataset.id,
                            galleryField=ThemifyConstructor.gallery, 
                            oldVal=this.getShortcodeValue(),
                            shortcode = galleryField.parseIds(oldVal),
                        index = shortcode?.indexOf(itemId) ?? -1;
                        if(index!==-1){
                            shortcode.splice(index,1);
                            const layout=data.layout_gallery|| 'grid',
                                trigger=layout==='slider' || (layout==='showcase' && index===0),
                                val=shortcode.length > 0 ? galleryField.replaceShortcode(oldVal, shortcode.join(',')) : '';
                            if(api.activeModel?.id===this.id){
                                api.LightBox.el.querySelector('.tf_close[data-id="'+itemId+'"]')?.closest('.tb_gal_item')?.remove();
                            }
                            if(!this.setShortcodeValue(val,trigger)){
                                if(!trigger){
                                    const galItem=target.closest('.gallery-item') || target.closest('.gallery-icon');
                                    galItem.remove();
                                    if(layout==='grid' && data.layout_masonry){
                                        api.Utils.runJs(this.el,'module');
                                    }
                                }
                                else {
                                    this.previewLive(this.get('mod_settings'));
                                }
                            }
                        }
                    }
                    else{
                        const btn=createElement(),
                            input=createElement('input');
                        input.tfOn('change',async e=>{
                            const inp=e.currentTarget;
                            if(!this.setShortcodeValue(inp.value)){
                                const layout=data.layout_gallery|| 'grid';
                                await this[layout].call(this,e.detail.images,data,true);
                                api.Utils.runJs(this.el,'module');
                            }
                            inp.remove();
                            btn.remove();
                        },{passive:true,once:true})
                        .value=this.getShortcodeValue() || '';
                        ThemifyConstructor.gallery.init(btn,input);
                    }
                }
            });
        }
        grid(images,data,addImages){
            const fr=createDocumentFragment(), 
                frImages=createDocumentFragment(),
                grid=createElement(),
                gridSt=grid.style,
                showTitle=data.gallery_image_title==='yes',
                showCaption=data.gallery_exclude_caption!=='yes',
                pagination=data.gallery_pagination && data.gallery_per_page>0,
                {gallery_columns:desktopCols=3,t_columns:tabletCols,m_columns:mobileCols}=data,
                classes=['module-gallery-grid'],
                items=pagination?images.slice(0,data.gallery_per_page):images;
            
            
            for(let i=0;i<items.length;++i){
                let item=items[i],
                dl=createElement('dl','gallery-item'),
                dt=createElement('dt','gallery-icon tf_rel'),
                img=this.constructor.setEditableImage(createElement('img'),'','thumb_w_gallery','thumb_h_gallery',data),
                src=item.large?.[0] || item.full?.[0] || item.thumbnail,
                title=item.title || '',
                caption=item.caption || '';
                img.src=ThemifyImageResize.getCache(src,data.thumb_w_gallery,data.thumb_h_gallery,.8) || src;
                img.dataset.orig = src;  
                if( data.link_opt!=='none'){
                    let link=createElement('a',{href:'#',title:caption,'data-title':title,rel:item.id || ''});
                    if(data.lightbox){
                        link.className='themify_lightbox';
                    }
                    link.appendChild(img);
                    dt.appendChild(link);
                }
                else{
                    dl.className+=' tf_rel';
                    dt.appendChild(img);
                }
                dt.appendChild(createElement('span',{class:'tb_del_btn tb_del_gal tf_close tb_disable_sorting',role:'button','data-id':item.id || '',title:'Delete Image'}));
                if((title!=='' && showTitle===true) || (caption!=='' && showCaption===true)){
                    let dd=createElement('dd','wp-caption-text gallery-caption');
                    if(title!=='' && showTitle===true){
                        dd.appendChild(createElement('strong','themify_image_title tf_block',title));
                    }
                    if(caption!=='' && showCaption===true){
                        dd.appendChild(createElement('span','themify_image_caption',caption));
                    }
                    dt.appendChild(dd);
                }
                dl.appendChild(dt);
                frImages.appendChild(dl);
            }
            if(addImages===true){
                this.el.tfClass('module-gallery-grid')[0].replaceChildren(frImages);
                return;
            }
            gridSt.setProperty('--gald',desktopCols);
            gridSt.setProperty('--galt',tabletCols || desktopCols);
            gridSt.setProperty('--galm',mobileCols || tabletCols || desktopCols);
            if(data.layout_masonry){
                classes.push('gallery-masonry');
            }
            grid.className=classes.join(' ');
            grid.appendChild(frImages);
            fr.append(grid,createElement('span',{class:'tb_add_gal_btn tb_add_btn tf_plus_icon',role:'button',title:'Add Images'}));
            if(pagination){
                
            }
            return fr;
        }
        showcase(images,data,addImages){
            const constructor=this.constructor,
                fr=createDocumentFragment(), 
                frImages=createDocumentFragment(),
                showCaseWrap=createElement('','gallery-showcase-image'),
                imageWrap=createElement('','image-wrapper gallery-icon tf_rel'),
                thumbsWrap=createElement('','gallery-images tf_hidden'),
                mainItem=images[0] || {},
                src=mainItem.large?.[0] || mainItem.full?.[0] || mainItem.thumbnail,
                mainImg=constructor.setEditableImage(createElement('img'),'','s_image_w_gallery','s_image_h_gallery',data);
                
            if(src){
                ;
                mainImg.src=ThemifyImageResize.getCache(src,data.s_image_w_gallery,data.s_image_h_gallery,.8) || src;
                mainImg.dataset.orig = src;
                imageWrap.appendChild(mainImg);
                if((mainItem.title && data.gallery_image_title==='yes') || (mainItem.caption && data.gallery_exclude_caption!=='yes')){
                    const showCaseTitle=createElement('','gallery-showcase-title tf_hidden tf_abs tf_textl');
                    if(mainItem.title && data.gallery_image_title==='yes' ){
                            showCaseTitle.appendChild(createElement('strong','gallery-showcase-title-text',mainItem.title));
                    }
                    if(mainItem.caption && data.gallery_exclude_caption!=='yes'){
                        showCaseTitle.appendChild(createElement('span','gallery-showcase-caption',mainItem.caption));
                    }
                    imageWrap.appendChild(showCaseTitle);
                }
                showCaseWrap.appendChild(imageWrap);
                for(let i=0;i<images.length;++i){
                    let item=images[i],
                        galItem=createElement('','gallery-icon tf_rel'),
                        linkImage=createElement('a',{href:'#',title:item.title || ''}),
                        dataset=linkImage.dataset,
                        thumb=constructor.setEditableImage(createElement('img'),'','thumb_w_gallery','thumb_h_gallery',data),
                        src=item.large?.[0] || item.full?.[0] || item.thumbnail;

                    thumb.src=ThemifyImageResize.getCache(src,data.thumb_w_gallery,data.thumb_h_gallery,.8) || src;
                    thumb.dataset.orig = src;
                    dataset.caption=item.caption || '';
                    dataset.orig=dataset.image=src;
                    ThemifyImageResize.toBlob(linkImage, data.s_image_w_gallery, data.s_image_h_gallery).then(url=>{
                        if(url){
                            dataset.image = url;
                        }
                    })
                    .catch(()=>{

                    });
                    linkImage.appendChild(thumb);
                    galItem.append(linkImage,createElement('span',{role:'button',class:'tb_del_btn tb_del_gal tf_close tb_disable_sorting',title:'Delete Image','data-id':item.id}));
                    frImages.appendChild(galItem);
                }
            }
            if(addImages===true){
                const el=this.el;
                el.tfClass('gallery-images')[0].replaceChildren(frImages);
                el.tfClass('gallery-showcase-image')[0].replaceWith(showCaseWrap);
                return;
            }
            thumbsWrap.append(frImages,createElement('span',{role:'button',class:'tb_add_gal_btn tf_plus_icon tf_opacity tf_rel',title:'Add Images'}));
            fr.append(showCaseWrap,thumbsWrap);
            return fr;
        }
        slider(images,data,addImages){
            const fr=createDocumentFragment(),
                slides=['slider'],
                cssUrl=ThemifyBuilderModuleJs.cssUrl+'sliders/',
                id='tb_'+this.id+'_thumbs',
                args={...{
                        show_arrow_slider:'yes',
                        show_nav_slider:'yes',
                        effect_slider:'scroll',
                        pause_on_hover_slider:'resume',
                        play_pause_control:'no',
                        auto_scroll_opt_slider: 'off',
                        scroll_opt_slider:1,
                        speed_opt_slider:1,
                        wrap_slider:1,
                        height_slider: 'variable'
                    },
                    ...data
                },
                showTitle=args.gallery_image_title==='yes',
                showCaption=args.gallery_exclude_caption!=='yes',
                showThumbs=args.slider_thumbs!=='yes';
                if(showThumbs===true){
                    slides.push('thumbs');
                }
            
            for(let i=0;i<slides.length;++i){
                let isSlider=slides[i]==='slider',
                    hasNav= (slides[i]===( (isSlider === true && showThumbs===false) || data.show_arrow_buttons_vertical ? 'slider' : 'thumbs' )) ? (args.show_arrow_slider === 'yes' ? 1 : 0):0,
                    swiperContainer=createElement('','tf_swiper-container tf_carousel themify_builder_slider tf_rel tf_overflow'),
                    swiperWrapper=createElement('','tf_swiper-wrapper tf_lazy tf_rel tf_w tf_h tf_textc'),
                    dataset=swiperContainer.dataset,
                    imgWKey= 's_image_w_gallery',
                    imgHKey= 's_image_h_gallery';
                    if(isSlider===false){
                        imgWKey='thumb_w_gallery';
                        imgHKey='thumb_h_gallery';
                        swiperContainer.className+=' '+id;
                        dataset.thumbsId=id;
                    }
                    else{
                        if (args.auto_scroll_opt_slider !== 'off'){
                            dataset.auto=args.auto_scroll_opt_slider;
                            dataset.pause_hover=args.pause_on_hover_slider === 'resume' ? 1 : 0;
                            if (args.play_pause_control === 'yes'){
                                dataset.controller=1;
                            }
                        }
                        dataset.thumbs=id;
                        dataset.effect=args.effect_slider;
                        dataset.css_url=cssUrl+'carousel,'+cssUrl+'gallery';
                        if ( args.effect_slider === 'continuously' && args.continuous_dir ) {
                            dataset.autoReverse = true;
                        }
                    }
                    dataset.pager=(isSlider === false || showThumbs===false) && args.show_nav_slider === 'yes'?1:0;
                    dataset.speed=args.speed_opt_slider;
                    dataset.wrapvar=args.wrap_slider === 'yes' ? 1 : 0;
                    dataset.slider_nav=hasNav;
                    dataset.height=args.horizontal === 'yes' ? 'variable' : args.height_slider;
                    if(args.touch_swipe){
                        dataset.touch_swipe=args.touch_swipe;
                    }
                    if(isSlider === false || showThumbs===false){
                        dataset.visible=args.visible_opt_slider || '';
                        dataset.tabVisible=args.tab_visible_opt_slider || '';
                        dataset.mobVisible=args.mob_visible_opt_slider || '';
                        dataset.scroll=args.scroll_opt_slider;
                    }
                    for(let j=0;j<images.length;++j){
                        let item=images[j],
                            slideItem=createElement('','tf_swiper-slide'),
                            slideInner=createElement('','slide-inner-wrap'),
                            slideImage=createElement('','tf_lazy slide-image gallery-icon'),
                            img=this.constructor.setEditableImage(createElement('img'),'',imgWKey,imgHKey,args),
                            src=item.full?.[0] || item.large?.[0] || item.thumbnail,
                            {title='',caption=''}=item;
                        if(args.left_margin_slider!==undefined){
                            slideInner.style.marginLeft=args.left_margin_slider+'px';
                        }
                        if(args.right_margin_slider!==undefined){
                            slideInner.style.marginRight=args.right_margin_slider+'px';
                        }
                        
                        img.src=ThemifyImageResize.getCache(src,args[imgWKey],args[imgHKey],.8) || src;
                        img.dataset.orig = src;
                        if(isSlider===true && data.link_opt!=='none'){
                            let link=createElement('a');
                            link.href='#';
                            if(data.lightbox){
                                link.className+=' themify_lightbox';
                            }
                            link.appendChild(img);
                            slideImage.appendChild(link);
                        }else{
                            slideImage.appendChild(img);
                        }
                        if((showThumbs===false || isSlider===false) && images.length>1){
                            slideImage.appendChild(createElement('',{role:'button',class:'tb_del_btn tb_del_gal tf_close tb_disable_sorting','data-id':item.id,title:'Delete Slide'}));
                        }
                        slideInner.appendChild(slideImage);
                        if(isSlider===true && ((title!=='' && showTitle===true) || (caption!=='' && showCaption===true))){
                            let content=createElement('','content tf_opacity tf_texl tf_abs');
                            if(title!=='' && showTitle===true){
                                content.appendChild(createElement('h3','slide-title',title));
                            }
                            if(caption!=='' && showCaption===true){
                                content.appendChild(createElement('p','',caption));
                            }
                            slideInner.appendChild(content);
                        }
                        slideItem.appendChild(slideInner);
                        swiperWrapper.appendChild(slideItem);
                    }
                    swiperContainer.appendChild(swiperWrapper);
                    if(isSlider===true){
                        swiperContainer.appendChild(createElement('span',{role:'button',class:'tb_add_gal_btn tb_add_btn tf_plus_icon',title:'Add Slides'}));
                    }
                    if(hasNav===1){
                        let sliderVertical=createElement('','themify_builder_slider_vertical tf_rel');
                        sliderVertical.appendChild(swiperContainer);
                        fr.appendChild(sliderVertical);
                    }
                    else{
                        fr.appendChild(swiperContainer);
                    }
            }
            if(addImages===true){
                for(let swipers=this.el.tfClass('tf_swiper-container'),i=swipers.length-1;i>-1;--i){
                    let parent=swipers[i].parentNode;
                    if(parent.classList.contains('themify_builder_slider_vertical')){
                        parent.remove();
                    }else{
                        swipers[i].remove();
                    }
                }
                this.el.tfClass('tb_data_mod_name')[0].after(fr);
            }
            else{
                return fr;
            }
        }
        async lightboxed(images,data){
            const fr=createDocumentFragment(), 
                showTitle=data.gallery_image_title==='yes',
                showCaption=data.gallery_exclude_caption!=='yes',
                thumbnailGallery=data.thumbnail_gallery || null,
                items=[];//in live preview this always show 1 element, but maybe in the "preview" we will change this?
            if(thumbnailGallery){
                const field={full:[thumbnailGallery]};
                if(showTitle===true || showCaption===true){
                    let cache=this.constructor.cache,
                        res=cache.get(thumbnailGallery);
                    if(!res){
                        try{
                            res=await api.LocalFetch({action:'tb_gallery_lightbox_data',url:thumbnailGallery});
                            if(!res?.success){
                                throw '';
                            }
                            res=res.data;
                            cache.set(thumbnailGallery,res);
                        }
                        catch(e){

                        }
                    }
                    field.title=res?.title ?? images[0].title;
                    field.caption=res?.caption ?? images[0].caption;
                }
                
                items.push(field);
            }
            else{
                items.push(images[0]);
            }
            for(let i=0;i<items.length;++i){
                let dl=createElement('dl','gallery-item'),
                img=this.constructor.setEditableImage(createElement('img'),(thumbnailGallery?'thumbnail_gallery':''),'thumb_w_gallery','thumb_h_gallery',data),
                item=items[i],
                src=item.full?.[0] || item.large?.[0] || item.thumbnail,
                {title='',caption=''}=item;
                
                if(i===0){
                    dl.className+=' tf_hidden';
                }else{
                    dl.style.display='none';
                }
                img.src=ThemifyImageResize.getCache(src,data.thumb_w_gallery,data.thumb_h_gallery,.8) || src;
                img.dataset.orig = src;
                if(item.link){
                    let dt=createElement('dt','gallery-icon'),
                        link=createElement('a',{class:'themify_lightbox',href:item.link,title:title,'data-title':data.lightbox_title || '',rel:this.id});
                    link.appendChild(img);
                    dt.appendChild(link);
                    dl.appendChild(dt);
                }
                else{
                    dl.appendChild(img);
                }
                if((title!=='' && showTitle===true) || (caption!=='' && showCaption===true)){
                    let dd=createElement('dd','wp-caption-text gallery-caption');
                    if(title!=='' && showTitle===true){
                        dd.appendChild(createElement('strong','themify_image_title tf_block',title));
                    }
                    if(caption!=='' && showCaption===true){
                        dd.appendChild(createElement('span','themify_image_caption',caption));
                    }
                    dl.appendChild(dd);
                }
                fr.appendChild(dl);
            }
            return fr;
        }
        
    };
    if(api.isFrontend){
        Themify.on('tb_options_expand',  container=> {
            if ( api.isVisual && container&& api.activeModel?.get('mod_name')==='gallery') {
                for(let sliderRanges=container.querySelectorAll('#gr_ga_c,#gr_ga_r'),i=sliderRanges.length-1;i>-1;--i){
                    let isVertical=sliderRanges[i].id==='gr_ga_r';
                    sliderRanges[i].closest('.tb_slider_container').querySelector('input[type="range"]')?.tfOn('input',()=>{
                        const gallery=api.activeModel.el.tfClass('gallery-masonry')[0];
                        if(gallery){
                            if(isVertical){
                                window.Isotope?.data(gallery)?.layout();
                            }
                            else{
                                Themify.trigger('builder_load_module_partial',[gallery.parentNode,true]);
                            }
                        }
                    },{passive:true});
                }
            }
        });
    }
})(tb_app);