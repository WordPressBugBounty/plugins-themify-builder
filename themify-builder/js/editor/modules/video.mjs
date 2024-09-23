(api => {
    "use strict";
    api.ModuleVideo = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_video',
                    type: 'title'
                },
                {
                    id: 'style_video',
                    type: 'layout',
                    label: 'vidlay',
                    mode: 'sprite',
                    options: [
                        {
                            img: 'video_top',
                            value: 'video-top',
                            label: 'vidtop'
                        },
                        {
                            img: 'video_left',
                            value: 'video-left',
                            label: 'vidleft'
                        },
                        {
                            img: 'video_right',
                            value: 'video-right',
                            label: 'vidright'
                        },
                        {
                            img: 'video_overlay',
                            value: 'video-overlay',
                            label: 'vidoverlay'
                        }
                    ],
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'url_video',
                    type: 'video',
                    label: 'vidurl',
                    help: 'vidurlh',
                    binding: {
                        external: {
                            hide: 'tb_video_local_wrap',
                            show: ['tb_video_container', 'tb_video_external_wrap']
                        },
                        local: {
                            hide: 'tb_video_external_wrap',
                            show: ['tb_video_container', 'tb_video_local_wrap']
                        },
                        empty: {
                            hide: [
                                'tb_video_container'
                            ]
                        }
                    },
                    required: {
                        message: 'viderr'
                    }
                },
                {
                    type: 'group',
                    wrap_class: 'tb_video_container',
                    options: [
                        {
                            type: 'group',
                            wrap_class: 'tb_video_external_wrap',
                            options: [
                                {
                                    id: 'ext_start',
                                    type: 'number',
                                    label: 'starttime',
                                    help: 'starttimeh'
                                },
                                {
                                    id: 'ext_end',
                                    type: 'number',
                                    label: 'endtime',
                                    help: 'endtimeh'
                                }
                            ]
                        },
                        {
                            id: 'ext_hide_ctrls',
                            type: 'toggle_switch',
                            label: 'playctrls',
                            binding: {
                                checked: {
                                    show: 'dl_btn'
                                },
                                not_checked: {
                                    hide: 'dl_btn'
                                }
                            }
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_video_external_wrap',
                            options: [
                                {
                                    id: 'ext_privacy',
                                    type: 'toggle_switch',
                                    options: {
                                        on: {
                                            name: '1',
                                            value: 'en'
                                        },
                                        off: {
                                            name: '',
                                            value: 'dis'
                                        }
                                    },
                                    label: 'privmod'
                                }
                            ]
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_video_local_wrap',
                            options: [
                                {
                                    id: 'dl_btn',
                                    type: 'toggle_switch',
                                    options: {
                                        on: {
                                            name: '1',
                                            value: 'en'
                                        },
                                        off: {
                                            name: '',
                                            value: 'dis'
                                        }
                                    },
                                    label: 'dwldbtn'
                                },
                                {
                                    id: 'hover_play',
                                    type: 'toggle_switch',
                                    label: 'plyhover',
                                    options: 'simple',
                                    default:'off',
                                    binding: {
                                        checked: {
                                            hide: 'tb_v_autoplay'
                                        },
                                        not_checked: {
                                            show: 'tb_v_autoplay'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_v_autoplay',
                            options: [
                                {
                                    id: 'autoplay_video',
                                    type: 'toggle_switch',
                                    label: 'autoplay',
                                    options: 'simple',
                                    default:'off',
                                    binding: {
                                        checked: {
                                            show: 'autoplay_text'
                                        },
                                        not_checked: {
                                            hide: 'autoplay_text'
                                        }
                                    }
                                },
                                {
                                    id: 'autoplay_text',
                                    type: 'message',
                                    label: '',
                                    comment: 'vidmuth'
                                }
                            ]
                        },
                        {
                            id: 'mute_video',
                            type: 'toggle_switch',
                            label: 'mute',
                            options: 'simple',
                            default:'off'
                        },
                        {
                            id: 'loop',
                            type: 'toggle_switch',
                            label: 'loop',
                            options: 'simple',
                            default:'off'
                        },
                        {
                            id: 'o_i_c',
                            label: 'overimg',
                            type: 'toggle_switch',
                            options: {
                                on: {
                                    name: '1',
                                    value: 'en'
                                },
                                off: {
                                    name: '',
                                    value: 'dis'
                                }
                            },
                            binding: {
                                checked: {
                                    show: [
                                        'o_i',
                                        'o_m'
                                    ]
                                },
                                not_checked: {
                                    hide: [
                                        'o_i',
                                        'o_m'
                                    ]
                                }
                            }
                        },
                        {
                            id: 'o_i',
                            type: 'image',
                            label: ''
                        },
                        {
                            id: 'o_m',
                            type: 'multi',
                            label: '',
                            options: [
                                {
                                    id: 'o_w',
                                    label: 'w',
                                    type: 'number'
                                },
                                {
                                    id: 'o_h',
                                    label: 'ht',
                                    type: 'number'
                                }
                            ]
                        },
                        {
                            id: 'width_video',
                            type: 'number',
                            label: 'vidw',
                            help: 'vidwh',
                            break: true,
                            unit: {
                                id: 'unit_video',
                                options: {
                                    px: 'px',
                                    '%': '%'
                                }
                            }
                        },
                        {
                            id: 'title_video',
                            type: 'text',
                            label: 'vidt',
                            control: {
                                selector: '.video-title'
                            }
                        },
                        {
                            id: 'title_tag',
                            type: 'select',
                            label: 'vidtag',
                            h_tags: true,
                            default: 'h3'
                        },
                        {
                            id: 'title_link_video',
                            type: 'url',
                            label: 'vidtl'
                        },
                        {
                            id: 'caption_video',
                            type: 'textarea',
                            label: 'vidcap',
                            control: {
                                selector: '.video-caption'
                            }
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_video'
                }
            ];
        }
        static default() {
            return {
                url_video: 'https://www.youtube.com/watch?v=FPPce2D8pYI'
            };
        }
        getImage(data) {
            const setting = data || this.get('mod_settings'),
                videoUrl=setting.url_video,
                img=new Image(32,32);
            if(videoUrl){
                let provider=Themify.parseVideo(videoUrl),
                    type=provider.type,
                    imgUrl;
                if(type==='youtube'){
                    imgUrl='https://img.youtube.com/vi/'+provider.id+'/default.jpg';
                }
                else if(type==='vimeo'){
                    imgUrl='https://vumbnail.com/'+provider.id+'.jpg';
                }else if(setting.o_i){
                    imgUrl=setting.o_i;
                }
                if(imgUrl){
                    img.src=imgUrl;
                    if(!api.activeModel){
                        img.loading='lazy';
                    }
                    img.alt=this.getName();
                    return img;
                }
            }
            return super.getImage(setting);
        }
        getExcerpt(data) {
            const setting = data || this.get('mod_settings');
            return api.Helper.limitString(setting.title_video);
        }
        static builderSave(settings) {
            const def = {
                style_video: 'video-top',
                ext_hide_ctrls: 'no',
                mute_video: 'no',
                hover_play:'no',
                autoplay_video:'no',
                ext_branding:'no',
                loop: 'no',
                unit_video: 'px',
                title_tag: 'h3'
            },
            units=['font_size_caption','line_height_caption','f_s_c_h'];

            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            if (settings.width_video <= 0) {
                delete settings.unit_video;
            }
            if (settings.ext_hide_ctrls) {
                delete settings.dl_btn;
            }
            if (!settings.o_i_c) {
                delete settings.o_i;
            }
            if (!settings.o_i) {
                delete settings.o_w;
                delete settings.o_h;
            }
            if(settings.hover_play){
                delete settings.autoplay_video;
            }
            for(let bps=api.breakpointsReverse,i=bps.length-1;i>-1;--i){
                let bp=bps[i];
                //Font color
                this.clearFontColor('font_color_type','font_color','font_gradient_color',bp,settings);
                this.clearFontColor('f_c_h_f_c_t_h','f_g_c_h_f_c_t_h','f_g_c_f_c_t_h',bp,settings);
                //Text Shadow
                this.clearShadow('text-shadow',0,bp,settings);
                this.clearShadow('t_sh_h',0,bp,settings);
                this.clearShadow('t_sh_m_t',0,bp,settings);
                this.clearShadow('t_sh_m_t_h',0,bp,settings);
                this.clearShadow('t_sh_t',0,bp,settings);
                this.clearShadow('t_sh_t_h',0,bp,settings);
                this.clearShadow('t_sh_c',0,bp,settings);
                this.clearShadow('t_sh_c_h',0,bp,settings);
                //paddings
                this.clearPadding('padding',bp,settings);
                this.clearPadding('p_h',bp,settings);
                this.clearPadding('p_o_i',bp,settings);
                this.clearPadding('p_o_i_h',bp,settings);
                //margin
                this.clearPadding('margin',bp,settings);
                this.clearPadding('m_h',bp,settings);
                this.clearPadding('m_o_i',bp,settings);
                this.clearPadding('m_o_i_h',bp,settings);
                //border-radius
                this.clearPadding('b_ra',bp,settings);
                this.clearPadding('r_c_h',bp,settings);
                this.clearPadding('r_c_o_i',bp,settings);
                this.clearPadding('r_c_o_i_h',bp,settings);
                //border
                this.clearBorder('border',bp,settings);
                this.clearBorder('b_h',bp,settings);
                this.clearBorder('b_o_i',bp,settings);
                this.clearBorder('b_o_i_h',bp,settings);
                //filters
                this.clearFilter('bl_m','css_f',bp,settings);
                this.clearFilter('_h','css_f_h',bp,settings);
                //width,height
                this.clearWidth('w',bp,settings);
                this.clearWidth('ht',bp,settings,1);
                //Box Shadow
                this.clearShadow('b_sh',1,bp,settings);
                this.clearShadow('sh_h',1,bp,settings);
                this.clearShadow('b_sh_o_i',1,bp,settings);
                this.clearShadow('b_sh_o_i_h',1,bp,settings);
                //transform
                this.clearTransform('tr',bp,settings);
                this.clearTransform('tr-h',bp,settings);
                //units
                this.clearUnits(units,bp,settings);
            }
            super.builderSave(settings);
        }
        preview(data){
            const module=createElement(),
            outer=createElement('','video-wrap-outer'),
            wrap=createElement('','video-wrap tf_rel tf_overflow'),
            classes=['module','module-video', data.style_video || 'video-top'],
            url =  data.url_video,
            constructor=this.constructor;
            if(url){
                const provider = Themify.parseVideo(url),
                    type=provider.type,
                    isLocal=type!== 'youtube' && type !== 'vimeo',
                    isOverlay=data.o_i && ~~data.o_i_c===1;
                
                if(data.css_video){
                    classes.push(data.css_video);
                }
                if(data.autoplay_video==='yes'){
                    classes.push('video-autoplay');
                }
                if(data.width_video){
                    outer.style.maxWidth= data.width_video+(data.unit_video || 'px'); 
                }
                if(isLocal){
                    const video=createElement('video',{src:url,preload:'none','webkit-playsinline':1,playsinline:1}),
                    dataset=video.dataset;
                    if(video.loop === 'yes'){
                        video.loop=1;
                    }
                    if(isOverlay){
                        dataset.noScript=1;
                    }
                    if(data.mute_video === 'yes'){
                        video.muted=1;
                    }
                    
                    if(data.hover_play === 'yes'){
                        dataset.hoverPlay=1;
                        classes.push('tb_hover_play');
                    }
                    else if(data.autoplay_video === 'yes'){
                        dataset.autoplay=1;
                    }
                    if(data.dl_btn){
                        dataset.download=1;
                    }
                    if(data.ext_hide_ctrls === 'yes'){
                        dataset.hideControls=1;
                    }
                    if(isOverlay){
                        const lazy=createElement('','tf_vd_lazy tf_w tf_box tf_rel');
                        lazy.appendChild(video);
                        wrap.appendChild(lazy);
                    }else{
                        wrap.appendChild(video);
                    }
                    
                    wrap.className+=' tf_local_video';
                }
                else{
                    let queryArgs = {},
                        allow = 'fullscreen',
                        src,
                        params = new URL(url),
                        noscript=createElement('noscript');
                    if (provider.h) {//h query argument should be first in vimeo
                        queryArgs.h = provider.h;
                    }
                    queryArgs.pip=queryArgs.playsinline=1;
                    if (params.search) {
                        for(let [key,val] of params.searchParams.entries()){
                            if(key!=='v'){
                                queryArgs[key]=val;
                            }
                        }
                    }
                    if (type === 'youtube') {
                        
                        allow = 'accelerometer;encrypted-media;gyroscope;picture-in-picture';
                        src = 'https://www.youtube';
                        
                        if (data.ext_privacy) {
                            src+= '-nocookie';
                        }
                        if (data.ext_start) {
                            queryArgs.start = parseFloat(data.ext_start);
                        }
                        else if (params.hash && params.hash!=='#') {
                           queryArgs.start = parseFloat(params.hash.replace('#',''));
                           if(isNaN(queryArgs.start)){
                               queryArgs.start=0;
                           }
                        }
                        if (data.ext_end) {
                            queryArgs.end = parseFloat(data.ext_end);
                        }
                        src += '.com/embed/' + provider.id;
                    } 
                    else {
                        src = 'https://player.vimeo.com/video/' +provider.id;
                        
                        if (data.ext_start) {
                            src += '#t=' + data.ext_start;
                        } 
                        else if (params.hash && params.hash!=='#') {
                           src += params.hash;
                        }
                        if (data.ext_privacy) {
                            queryArgs.dnt = 1;
                        }
                        queryArgs.byline= queryArgs.title = queryArgs.portrait = 0;
                    }
                    for(let arr=['controls','loop','autoplay','mute','muted'],i=arr.length-1;i>-1;--i){
                        delete queryArgs[arr[i]];
                    }
                    if (data.ext_hide_ctrls==='yes') {
                        queryArgs.controls = 0;
                    }

                    if (data.loop==='yes') {
                        queryArgs.loop = 1;
                        queryArgs.playlist = provider.id;
                    }
                    if (data.autoplay_video==='yes' || queryArgs.autoplay==='1') {
                        allow += ';autoplay';
                        queryArgs.autoplay = 1;
                    }
                    if (data.mute_video==='yes' || (Themify.isTouch && queryArgs.autoplay===1)) {
                        if (type === 'youtube') {
                            queryArgs.mute = 1;
                        } else {
                            queryArgs.muted = 1;
                        }
                    }
                    noscript.appendChild(createElement('iframe',{src:src+'?'+(new URLSearchParams(queryArgs)).toString(),class:'tf_abs tf_w tf_h',allow:allow,'data-no-script':1}));
                    wrap.appendChild(noscript);
                }
                
                if(isOverlay){
                    wrap.className+=' tb_voverlay';
                    const img=constructor.setEditableImage(createElement('img',{alt:data.title_video || '',style:'width:100%;object-fit:cover'}),'o_i','o_w','o_h',data);
                    if(data.hover_play==='yes'){
                        if(isLocal){
                            img.className='tb_video_poster tf_abs_t';
                        }
                        wrap.appendChild(img);
                    }
                    else{
                        const overlay=createElement('','tb_video_overlay tf_abs_t tf_w tf_h');
                        overlay.append(createElement('','tb_video_play tf_abs_c'),img);
                        wrap.appendChild(overlay);
                    }
                }

                if (data.mod_title_video) {
                    module.appendChild(constructor.getModuleTitle(data.mod_title_video,'mod_title_video'));
                }
                outer.appendChild(wrap);
                module.appendChild(outer);
                
                if(data.title_video || data.caption_video){
                    const content=createElement('','video-content');
                    if(data.title_video){
                        let title=createElement(data.title_tag || 'h3','video-title'),
                            editItem=title;
                        if(data.title_link_video){
                            const link=createElement('a',{href:data.title_link_video});
                            title.appendChild(link);
                            editItem=link;
                        }
                        constructor._setEditableContent(editItem,'title_video',data.title_video);
                        content.appendChild(title);
                    }
                    if(data.caption_video){
                        content.appendChild(constructor._setEditableContent(createElement('','video-caption tb_text_wrap'),'caption_video',data.caption_video));
                    }
                    module.appendChild(content);
                }
            }
            module.className=classes.join(' ');
            return module;
        }
    };
})(tb_app);