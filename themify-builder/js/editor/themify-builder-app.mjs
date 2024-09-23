((body,topBody,bodyCl,topWindow) => {
    "use strict";
    let _jsModulePrms=null,
        _stylePrms=null;
    if(!Themify.builder_url){
        const baseUrl = new URL( doc.currentScript.src );
        baseUrl.search = '';
        baseUrl.pathname = baseUrl.pathname.replace('components.min.js', '');
        Themify.builder_url=baseUrl.toString().replace('js/editor/build/','');
    }
    window.tb_app = {
        breakpointsReverse: Object.keys(themify_vars.breakpoints).reverse(),
        isGSPage : bodyCl.contains('gs_post'),
        isVisual:topWindow !== window,//can be changed, in the frontend can be toggle backend mode
        isFrontend:false,//can't be changed init once, in backend false, in the frontend true
        activeBreakPoint: 'desktop',
        activeModel: null,
        isDocked: false,
        zoomMeta: false,
        isPreview: false,
        scrollTo: false,
        is_builder_ready:null,
        isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        styleData:{},
        jsModuleLoaded(){
            if(_jsModulePrms===null){
                this.inlineEditor=this.isFrontend=this.isVisual;
                const url = Themify.builder_url+'js/editor/',
                    allPromisses = [Themify.loadJs(Themify.url+'js/admin/notification',!!window.TF_Notification)],
                    addons=themifyBuilder.addons,
                    componentUrl=url + 'lazy-components/';
                this.componentsURL = componentUrl;
                if(addons){
                    for(let addonUrl in addons){
                        allPromisses.push(Themify.loadJs(addonUrl,null,addons[addonUrl]));
                    }
                }
                if(this.isFrontend){
                    allPromisses.push(
                        Themify.loadJs(url+'frontend/themify-builder-inline-editing'),
                        Themify.loadJs('image-resize',!!window.ThemifyImageResize),
                        Themify.loadJs(componentUrl+'correct-col-paddings')
                    );
                  //allPromisses.push(Themify.loadJs(moduleUrl+'tree'));
                }
                if(!Themify.isTouch){
                    setTimeout(()=>{
                        Themify.loadJs(componentUrl + 'right-click');
                     //   Themify.loadJs(componentUrl + 'drop-files');
                    },1000);
                }
                allPromisses[0].then(()=>{
                    TF_Notification.init().then(root=>{
                        if (this.isFrontend) {
                            topBody.appendChild(root);
                        }
                    });
                });
                _jsModulePrms= Promise.all(allPromisses).then(()=>{
                    ThemifyConstructor.init();
                    setTimeout(()=>{
                        Themify.loadJs(componentUrl+'offline');
                        localStorage.removeItem('tb_visual_templates');
                        localStorage.removeItem('tb_form_templates_');
                        setInterval(()=>{Registry.observer();},15000);
                    },10000);
                });
            }
            return _jsModulePrms;
        },
        loadJson(){
            if(_stylePrms===null){
                const fetchArgs={
                    method: 'GET'
                },
                prms=[];
                for(let files=themifyBuilder.style_json,i=files.length-1;i>-1;--i){
                    prms.push(new Promise(async (resolve,reject)=>{
                        try{
                            const f=new URL(files[i]),
                                origin=window.location.origin;
                            if(f.origin!==origin){
                                f.origin=origin;
                            }
                            const res=await Themify.fetch('', null, fetchArgs,f.toString() );
                            Object.assign(this.styleData,res);
                            resolve();
                        }
                        catch(e){
                            reject(e);
                        }
                    }));
                }
                _stylePrms=Promise.all(prms);
            }
            return _stylePrms;
        },
        LocalFetch(data,type,params){
            data.nonce=themifyBuilder.nonce;
            if(!data.bid){
                let builder=this.Builder?.get(),
                    bid=builder?.post_id || builder?.id || themifyBuilder.post_ID || '';
                if(bid==='' || isNaN(bid)){
                    builder=this.Builder?.get(0);
                    bid=builder?.post_id || builder?.id|| '';
                }
                data.bid=bid;
            }
            if(!this.isFrontend){
                data.admin=1;
            }
            Themify.trigger('tb_filter_fetch',data);
            return Themify.fetch(data,type,params);
        },
        getColClass(){//backward compatibility
            return { //deprecated,don't use it need for backward compatibility
                1: ['col-full'],
                2: ['col4-2', 'col4-2'],
                3: ['col3-1', 'col3-1', 'col3-1'],
                4: ['col4-1', 'col4-1', 'col4-1', 'col4-1'],
                5: ['col5-1', 'col5-1', 'col5-1', 'col5-1', 'col5-1'],
                6: ['col6-1', 'col6-1', 'col6-1', 'col6-1', 'col6-1', 'col6-1'],
                1_2: ['col3-1', 'col3-2'],
                2_1: ['col3-2', 'col3-1'],
                1_3: ['col4-1', 'col4-3'],
                3_1: ['col4-3', 'col4-1'],
                1_1_2: ['col4-1', 'col4-1', 'col4-2'],
                1_2_1: ['col4-1', 'col4-2', 'col4-1'],
                2_1_1: ['col4-2', 'col4-1', 'col4-1']
            };
        },
        getColClassValues(){//backward compatibility
            return Array.from(new Set([].concat.apply([], Object.values(this.getColClass()))));
        }
    };
    const api = tb_app;

    api.breakpointsReverse.push('desktop');
    Themify.upload_url=themifyBuilder.upload_url;
    api.jsModuleLoaded();
    api.loadJson();

    api.Helper={
        correctBuilderData(rows){
            if(!rows || !Array.isArray(rows)){
                rows=rows?Object.values(rows):[];
            }
            for(let i=rows.length-1;i>-1;--i){
                let r=rows[i];
                if(r){
                    let {styling:rowSt,cols}=r;
                    if(rowSt!==undefined && (!rowSt || Array.isArray(rowSt))){
                        r.styling={};
                    }
                    if(cols){
                        if(!Array.isArray(cols)){
                            cols=r.cols=Object.values(cols);
                        }
                        for(let j=cols.length-1;j>-1;--j){
                            let col=cols[j];
                            if(col){
                                let {styling,modules}=col;
                                if(styling!==undefined && (!styling || Array.isArray(styling))){
                                    col.styling={};
                                }
                                if(modules){
                                    modules=this.correctBuilderData(modules);
                                }
                            }
                            else{
                                cols.splice(j, 1);
                            }
                        }
                    }
                }
                else{
                    rows.splice(i, 1);
                }
            }
            return rows;
        },
        cloneDom(el,remove) {
            if (el === null) {
                return el;
            }
            if (el[0] !== undefined) {
                el = el[0];
            }
            if(el.nodeType===Node.TEXT_NODE){
                return el.cloneNode(true);
            }
            const node = remove===true?el:el.cloneNode(true);
            if (api.isVisual) {
                //after cloning dom the video is playing in bg
                const v = node.tfTag('video');
                if (v.length > 0) {
                    for (let i = v.length - 1; i > -1; --i) {
                        v[i].pause();
                    }
                }
                for (let items = node.tfClass('tb_dragger'), i = items.length - 1; i > -1; --i) {
                    items[i].remove();
                }
                for (let items = Themify.selectWithParent('[contenteditable]', node), i = items.length - 1; i > -1; --i) {
                    items[i].contentEditable=false;
                    items[i].closest('.tb_editor_on')?.classList.remove('tb_editor_on', 'tb_editor_clicked');
                }
                for (let items = Themify.selectWithParent('[draggable]', node), i = items.length - 1; i > -1; --i) {
                    items[i].setAttribute('draggable', 'true');
                }
            }
            for (let items = node.tfClass('tb_action_wrap'), i = items.length - 1; i > -1; --i) {
                let item=items[i];
                item.replaceChildren();
                item.removeAttribute('id');
                item.removeAttribute('style');
            }
            for (let items = node.querySelectorAll('.tb_del_btn,.tb_add_btn'), i = items.length - 1; i > -1; --i) {
                items[i].replaceChildren();
            }
            const uiItems=node.querySelectorAll('.tb_editor_on,.tb_element_clicked,.tb_selected_img,.tb_editor_clicked,.tb_hide_drag_col_right,.tb_hide_drag_left,.tb_hide_drag_right,.tb_drag_one_column,.tb_drag_side_column,.tb_draggable_item,.tb_column_drag_inner,.tb_active_action_bar,.compact-mode,.tf_dragger_negative');
            for (let i = uiItems.length - 1; i > -1; --i) {
                uiItems[i].classList.remove( 'tb_element_clicked','tb_editor_on','tb_selected_img','tb_editor_clicked', 'tb_hide_drag_col_right','tb_hide_drag_left','tb_hide_drag_right', 'tb_drag_one_column', 'tb_drag_side_column', 'tb_draggable_item', 'tb_column_drag_inner','tb_active_action_bar','compact-mode','tf_dragger_negative');
            }
            for (let items = node.querySelectorAll('[data-drag-w],[data-pos]'), i = items.length - 1; i > -1; --i) {
                items[i].removeAttribute('data-drag-w');
                items[i].removeAttribute('data-pos');
            }
            node.classList.remove('tb_selected_img', 'tb_element_clicked','tb_editor_on','tb_editor_clicked', 'tb_hide_drag_col_right','tb_hide_drag_left','tb_hide_drag_right', 'tb_drag_one_column', 'tb_drag_side_column', 'tb_draggable_item', 'tb_column_drag_inner','tb_active_action_bar','compact-mode','tf_dragger_negative');
            node.removeAttribute('data-drag-w');
            node.removeAttribute('data-pos');
            return node;
        },
        cloneObject(obj){
            return obj?JSON.parse(JSON.stringify(obj)):{};
        },
        compareObject(oldSettings,newSetting){
            if(oldSettings && newSetting){
                const size1=oldSettings.hasOwnProperty('length')?oldSettings.length:Object.keys(oldSettings).length,
                    size2=newSetting.hasOwnProperty('length')?newSetting.length:Object.keys(newSetting).length;
                    if(size1===size2){
                        if(size1>0){
                            for(let i in oldSettings){
                                if(newSetting[i]===undefined){
                                    return true;
                                }
                                if(oldSettings[i]!==null && typeof oldSettings[i] === 'object'){
                                    if(typeof newSetting[i]!=='object' || this.compareObject(oldSettings[i],newSetting[i])){
                                        return true;
                                    }
                                }
                                else if(newSetting[i]!=oldSettings[i] || (typeof newSetting[i]==='object' && typeof oldSettings[i]!=='object')){
                                    return true;
                                }
                            }
                        }
                    }
                    else{
                        return true;
                    }
            }
            else{
                return true;
            }
            return false;
        },
        isImageUrl(link) {
            if (!link) {
                return false;
            }
            const parts = link.split('?')[0].split('.');
            return ['jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp', 'svg', 'svgz','webp','apng'].includes(parts[parts.length - 1]);
        },
        limitString(str, limit=120) {
            let new_str = '';
            if (str !== '' && str !== undefined) {
                const tmp = createElement();
                tmp.innerHTML = str;
                str = tmp.textContent; // strip html tags
                new_str = str.length > limit ? (str.substr(0, limit)+'...') : str;
            }
            return new_str;
        },
        loadJsZip(){
          return Themify.loadJs('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',!!window.JSZip,false);
        },
        toRGBA(v){
            return ThemifyStyles.toRGBA(v);
        },
        getIcon(icon, cl) {
            const fontello_prefix=themifyBuilder.fontello_prefix;
            if (typeof fontello_prefix!== 'undefined') {
                const fontello_regex = new RegExp(themifyBuilder.fontello_use_suffix ? fontello_prefix + '$' : '^' + fontello_prefix);
                if (fontello_regex.test(icon)) {
                    return createElement('i',icon);
                }
            }
            icon = 'tf-' + icon.trim().replace(' ', '-');
            let classes = 'tf_fa ' + icon;
            if (cl) {
                classes += ' ' + cl;
            }
            const svg = createElementNS('',classes);
            svg.appendChild(createElementNS('use',{href:'#' + icon}));
            return svg;
        },
        getLottie(arr,sel){
            if(arr.path && arr.seg){
                let json={
                    path:arr.path,
                    seg:arr.seg
                },
                lottie=createElement('tf-lottie'),
                tmpl=createElement('template');
                if(arr.st){
                    json.st=arr.st;
                }
                if(arr.sp && arr.sp!=1){
                    json.sp=arr.sp;
                }
                if(arr.dir){
                    json.dir=arr.dir;
                }
                if(arr.fid){
                    json.fid=arr.fid;
                }
                if(arr.r && arr.r!=='svg'){
                    json.r=arr.r;
                }
                if(arr.count>1){
                    json.count=arr.count;
                }
                if(sel){
                    json.sel=sel;
                }
                if(!arr.lp){
                    json={actions:json,loop:1};
                }
                tmpl.innerHTML=JSON.stringify(json);
                lottie.appendChild(tmpl);
                return lottie;
            }
            return tb_createDocumentFragment();
        },
        getColor(el) {
            let v = el.value;
            if (v !== '') {
                if (el.getAttribute('data-tfminicolors-initialized') !== null) {
                    v = jQuery(el).tfminicolors('rgbaString');
                } else {
                    const opacity = el.dataset.opacity;
                    if (opacity !== '' && opacity !== null) {
                        v = ThemifyStyles.toRGBA(v + '_' + opacity);
                    }
                }
            }
            return v;
        },
        getBreakpointName(bp){
            return api.ToolBar.el.querySelector('.breakpoint-'+bp+' span').textContent;
        },
        generateUniqueID() {
            const uid=(Math.random().toString(36).substr(2, 4) + (new Date().getUTCMilliseconds()).toString()).substr(0, 7);
            return Registry.get(uid)?this.generateUniqueID():uid;
        },
        clearElementId(data, _new) {
            for (let i=data.length-1;i>-1;--i) {
                let item=data[i],
                    opt = item.styling || item.mod_settings;
                if (_new === true) {
                    item.element_id = this.generateUniqueID();
                } else {
                    delete item.element_id;
                }
                if (opt !== undefined) {
                    const customCss=opt.custom_css_id;
                    if (customCss !== undefined && customCss !== '') {
                        let j = 1;
                        while (true) {
                            let id = j!==1?(customCss+'-'+j):customCss;
                            if (!doc.tfId(id)?.closest('.module_row')) {
                                opt.custom_css_id = id;
                                break;
                            }
                            ++j;
                        }
                    }

                    let nested=opt.content_accordion || opt.tab_content_tab,
                        bulder=opt.builder_content;
                    if (bulder !== undefined) {
                        if(typeof bulder === 'string'){
                            bulder=JSON.parse(bulder);
                        }
                        this.clearElementId(bulder, true);
                        opt.builder_content = bulder;
                    }
                    if(nested){
                        for (let j=nested.length-1;j>-1;--j) {
                            let bulder=nested[j].builder_content;
                            if(bulder){
                                if(typeof bulder === 'string'){
                                    bulder=JSON.parse(bulder);
                                }
                                this.clearElementId(bulder, true);
                                nested[j].builder_content = bulder;
                            }
                        }
                    }
                }
                if (item.cols !== undefined) {
                    this.clearElementId(item.cols, _new);
                } else if (item.modules !== undefined) {
                    this.clearElementId(item.modules, _new);
                }
            }
        },
        async codeMirror(el,mode,conf={}){
            try{
                conf.isDarkMode=api.isDarked;
                await topWindow.Themify.loadJs(Themify.url+'js/admin/modules/codemirror/codemirror',!!topWindow.ThemifyCodeMiror);
                const obj=new topWindow.ThemifyCodeMiror(el,mode,conf);
                await obj.run();
                return obj;
            }
            catch(e){
               return null;
            }
        },
        async gzip(data){
            if(!window.CompressionStream || themifyBuilder.gzip_disabled){
                throw 'err';
            }
            const byteArray = new TextEncoder().encode(data),
                cs = new CompressionStream('gzip'),
                writer = cs.writable.getWriter();
                writer.write(byteArray);
                writer.close();
            const res=await (new Response(cs.readable)).arrayBuffer();
            return btoa(String.fromCharCode(...new Uint8Array(res)));
        }
    };


    api.Registry={
        items : new Map,
        _events : new Map,
        observer(){
            for(let [id,model] of this.items){
                if(!model.el.isConnected){
                    this.remove(id);
                }
            }
        },
        add(item) {
            this.items.set(item.id, item);
            return this;
        },
        get(id) {
            return this.items.get(id) || null;
        },
        remove(id,db=true) {
            const model = this.get(id);
            if (model) {
                model.el.remove();
                if(db===true){
                    this.items.delete(id);
                    this._events.delete(id);
                }
            }
            return this;
        },
        destroy() {
            for(let v of this.items){
                this.get(v[0])?.el.remove();
            }
            this.items.clear();
            this._events.clear();
            return this;
        },
        on(id, ev, f) {
            if(f!==undefined){
                const events=this._events.get(id) || {};
                events[ev]??=[];
                events[ev].push(f);
                this._events.set(id, events);
            }
            return this;
        },
        off(id, ev,f) {
            const events=this._events.get(id);
            if(events!==undefined){
                if(!ev){
                    this._events.delete(id);
                }
                else if(events[ev]!==undefined){
                    if(f){
                        for(let i=events[ev].length-1;i>-1;--i){
                            if(events[ev][i]===f){
                                events[ev].splice(i, 1);
                            }
                        }
                        if(events[ev].length===0){
                            delete events[ev];
                        }
                    }
                    else{
                        delete events[ev];
                    }
                    this._events.set(id,events);
                }
            }
            return this;
        },
        trigger(id, ev, ...args) {
            const events = this._events.get(id),
                proms=[];
            if (events?.[ev]!==undefined) {
                let _this = typeof id === 'string' ? this.get(id) : id;

                if(!_this){
                    _this=id;
                }
                for (let i =  events[ev].length-1; i>-1;--i) {
                    let pr=events[ev][i].apply(_this, args);
                    if(pr instanceof Promise){
                        proms.push(pr);
                    }
                }
            }
            return Promise.all(proms).catch(()=>{});
        }
    };



    const isFrontend=api.isFrontend,
        Registry=api.Registry;

    api.Utils = {
        _onResizeEvents:new Set,
        async onResize(trigger) {
            if(api.isFrontend){
                const events = $._data(window, 'events')?.resize;
                if (events) {
                    for (let i = 0; i < events.length; ++i) {
                        if (events[i].handler !== undefined) {
                            this._onResizeEvents.add(events[i].handler);
                        }
                    }
                }
                $(window).off('resize');
                if (trigger) {
                    const e = $.Event('resize', {
                        type: 'resize',
                        isTrigger: false
                    });
                    for (let handler of this._onResizeEvents) {
                        try {
                            handler.apply(window, [e, $]);

                        }catch (e) {

                        }
                    }
                    Themify.triggerEvent(window,'resize')
                    .trigger('tfsmartresize', {w: Themify.w, h: Themify.h});
                }
            }
        },
        updateDocumentSize() {
            if (api.isVisual) {
                let req,
                    timeout;
                (new ResizeObserver(entries => {
                    Themify.trigger('documentsize');
                    if (api.activeBreakPoint !== 'desktop') {
                        clearTimeout(timeout);
                        timeout=setTimeout(() => {
                            const _body=entries[0].target;
                                cancelAnimationFrame(req);
                                req = requestAnimationFrame(() => {
                                        topBody.style.height = _body.scrollHeight + 'px';
                                    setTimeout(() => {
                                        this.onResize(true);
                                        topBody.style.height = _body.scrollHeight + 'px';
                                        timeout=req=null;
                                    }, 220);
                                });
                        }, 60);
                    }
                })).observe(body);
            }
        },
        findCssRule(rules, selector) {
            selector = selector.replace(/\s*>\s*/g, '>').replace(/\,\s/g, ',').trim();
            const isCondition=selector[0]==='@';
            for (let i = rules.length - 1; i > -1; --i) {
                if ((isCondition===true && rules[i].conditionText && rules[i].cssText.replace(/\s*>\s*/g, '>').replace(/\,\s/g, ',').trim().includes(selector)) || (isCondition===false && !rules[i].conditionText && selector === rules[i].selectorText.replace(/\s*>\s*/g, '>').replace(/\,\s/g, ',').trim())) {
                    return i;
                } 
            }
            return false;
        },
        _filterClass(cl) {
            const _COL_CLASSES_VALUES=api.getColClassValues();
            for (let i = cl.length - 1; i > -1; --i) {
                if (_COL_CLASSES_VALUES.includes(cl[i])) {
                    return cl[i];
                }
            }
            return '';
        },
        getRowSettings(base, type, saving) {
            type = type || 'row';
            saving = !!saving;
            let option_data = {},
                styling,
                model_r = Registry.get(base.dataset.cid);
            if (model_r) {
                const sel=type==='subrow'?'module_subrow':type + '_inner',
                    inner = base.tfClass(sel)[0],
                    columns=api.Utils.getColumns(inner),
                    count = columns.length,
                    points = api.breakpointsReverse,
                    bpLength = points.length,
                    cols = [],
                    colPaddingsIds=['padding_top','padding_bottom','padding_left','padding_right','margin-bottom','margin-top'],
                    paddingLen=colPaddingsIds.length;

                // cols
                for (let i = 0; i < count; ++i) {
                    let model_c = Registry.get(columns[i].dataset.cid);
                    if (model_c) {
                        let modules = columns[i].tfClass('tb_holder')[0],
                            cl = this._filterClass(columns[i].classList),
                            index = cols.push({
                                element_id: model_c.id
                            });
                        --index;

                        if (cl !== '') { //backward compatibility
                            cols[index].grid_class = cl;
                        }
                        styling = api.Helper.cloneObject(model_c.get('styling'));
                        if (styling && Object.keys(styling).length > 0) {
                            if(saving===true){
                                if(isFrontend){//in admin part we can't use iframe to convert paddings that is why skipping
                                    //we need always save padding/margin units as 2 "value1,value2"(when the unit is %) to detect the data is converted
                                    for(let j=paddingLen-1;j>-1;--j){
                                        let prop=colPaddingsIds[j];
                                        if(styling[prop+'_unit']==='%' && styling[prop]!=='' && styling[prop]!==undefined && !styling[prop].toString().includes(',')){
                                            styling[prop]=','+styling[prop];
                                        }
                                        for (let k = bpLength - 2; k>-1; --k) {
                                            if(styling['breakpoint_'+points[k]]!==undefined){
                                                let p=styling['breakpoint_'+points[k]][prop];
                                                if(p!=='' && p!==undefined && !p.toString().includes(',') && ThemifyStyles.getStyleVal(prop+'_unit',styling,points[k])==='%'){
                                                    styling['breakpoint_'+points[k]][prop]=','+p;
                                                }
                                            }
                                        }
                                    }
                                }
                                model_c.constructor.builderSave(styling);
                            }
                            if(styling && Object.keys(styling).length>0){
                                cols[index].styling = styling;
                            }   
                        }
                        if (modules !== undefined) {
                            modules = modules.children;
                            let items = [];
                            for (let j = 0; j < modules.length; ++j) {
                                let m = Registry.get(modules[j].dataset.cid),
                                    mname=m?.get('mod_name');
                                if (mname) {
                                    styling = api.Helper.cloneObject(m.get('mod_settings'));
                                    if(styling){
                                        if(m.type==='module'){
                                            m.parseHtml(styling,saving);
                                        }
                                        if(saving===true){
                                            m.constructor.builderSave(styling);
                                            Themify.trigger( 'tb_save_component', {
                                                data : styling,
                                                slug : mname
                                            } );
                                        }
                                    }
                                    let k = items.push({
                                        mod_name:mname,
                                        element_id: m.id
                                    });
                                    --k;
                                    if (styling && Object.keys(styling).length > 0) {
                                        delete styling.cid;
                                        items[k].mod_settings = styling;
                                    }
                                    // Sub Rows
                                    if (m.type==='subrow') {
                                        items[k] = this.getRowSettings(modules[j], 'subrow', saving);
                                    }
                                }
                            }
                            if (items.length > 0) {
                                cols[index].modules = items;
                            }
                        }
                    }
                }
                option_data = {
                    element_id: model_r.id,
                    cols: cols
                };

                let sizes = {...model_r.get('sizes')};
                if (count>1) {
                    for (let i = bpLength-1;i>-1;--i) {//make equal
                        let bp = points[i],
                            size = sizes[bp + '_size'],
                            area = sizes[bp + '_area'],
                            colh = sizes[bp + '_auto_h'];

                        if (size) {
                            size=ThemifyStyles.getColSize(size,false);
                            if (size.includes(' ')) {
                                size = size.replace(/\s\s+/g, ' ').split(' ');
                                for (let j = size.length - 1; j > -1; --j) {
                                    let fr = parseFloat(size[j].trim());
                                    if (fr !== 1) {
                                        size[j] = size[j].replace(fr.toString(), parseFloat(fr.toFixed(5)).toString());
                                    }
                                }
                                size = size.join(' ').replaceAll('0.', '.').trim();
                            }
                            sizes[bp + '_size']=size;
                        }
                        if (area) {
                            if(bp==='desktop'){
                                delete sizes[bp + '_area'];
                            }
                            else{
                                if(area.includes(' ')){
                                    area=area.replaceAll('col', '').replace(/\s\s+/g, ' ').trim();
                                    sizes[bp + '_area']= area;
                                    if(size && !size.includes(' ')){
                                        let checkArea=model_r.getGridCss({size:size},bp);
                                        if(checkArea['--area'] && checkArea['--area'].replaceAll('col', '').replace(/\s\s+/g, ' ').trim()===area){
                                           delete sizes[bp + '_area'];
                                        }
                                    }
                                }
                                else if(!ThemifyStyles.getAreaValue(area)){
                                    delete sizes[bp + '_area'];
                                }
                            }
                        }
                        if (colh) {
                            sizes[bp + '_auto_h'] = parseInt(colh);
                        }
                        if (saving === true && sizes[bp + '_dir']!==undefined) {//backward
                            delete sizes[bp + '_dir'];
                        } 
                    }
                    for (let i = 0; i < bpLength - 1; ++i) { //clean again duplicates
                        let bp = points[i],
                            gutter = sizes[bp + '_gutter'],
                            colh = sizes[bp + '_auto_h'],
                            size = sizes[bp + '_size'],
                            align = sizes[bp + '_align'];

                        if (gutter || align || colh || size) {
                            for (let j = i + 1; j < bpLength; ++j) {
                                let bp2 = points[j];
                                if (gutter && sizes[bp2 + '_gutter']) {
                                    if (sizes[bp2 + '_gutter'] === gutter) {
                                        delete sizes[bp + '_gutter'];
                                    }
                                    gutter = null;
                                }
                                if (align && sizes[bp2 + '_align']) {
                                    if (sizes[bp2 + '_align'] === align) {
                                        delete sizes[bp + '_align'];
                                    }
                                    align = null;
                                }
                                if (colh && sizes[bp2 + '_auto_h']) {
                                    if (sizes[bp2 + '_auto_h'] === colh) {
                                        delete sizes[bp + '_auto_h'];
                                    }
                                    colh = null;
                                }
                                if (size && sizes[bp2 + '_size']) {
                                    if (saving === true && sizes[bp2 + '_size'] === size) {
                                        delete sizes[bp + '_size'];
                                    }
                                    size = null;
                                }
                                if (!gutter && !align &&  !colh && !size) {
                                    break;
                                }
                            }
                        }
                    }

                    if (sizes.desktop_area) {
                        const area = [];
                        for (let i = 0; i < count; ++i) {
                            area.push(i + 1);
                        }
                        if (area.join(' ') === sizes.desktop_area) {
                            delete sizes.desktop_area;
                        }
                    }
                    //backward
                    if ((sizes.mobile_dir !== undefined && (!sizes.desktop_dir || sizes.desktop_dir === sizes.tablet_landscape_dir) && sizes.tablet_dir === sizes.mobile_dir && sizes.tablet_landscape_dir === sizes.mobile_dir)) {
                        delete sizes.desktop_dir;
                        delete sizes.tablet_landscape_dir;
                        delete sizes.tablet_dir;
                        delete sizes.mobile_dir;
                    }
                    else if (sizes.desktop_dir === 'ltr') {
                        delete sizes.desktop_dir;
                    }
                    if (sizes.desktop_auto_h === -1) {
                        delete sizes.desktop_auto_h;
                    }
                    if (sizes.desktop_align === 'start' && api.isFullSection===false) {
                        delete sizes.desktop_align;
                    }
                    if (sizes.desktop_gutter === 'gutter') {
                        delete sizes.desktop_gutter;
                    }
                    for (let i in sizes) {
                        if (sizes[i] === undefined || sizes[i] === '') {
                            delete sizes[i];
                        }
                    }
                }
                else{
                    sizes={};
                } 
                option_data.sizes = sizes;
                styling = api.Helper.cloneObject(model_r.get('styling'));
                if (styling) {
                    delete styling.cid;
                    if(Object.keys(styling).length > 0){
                        if(saving===true){
                            model_r.constructor.builderSave(styling);
                        }
                        option_data.styling = styling;
                    }
                }
            }
            return option_data;
        },
        getAllImages(type){
            const images=new Map,
            localImages=new Set,
            externalImages=new Set,
            themifyImages=new Set,
            addImage=url=>{
                if(api.Helper.isImageUrl(url) || url.includes('.mp4') || url.includes('.mpeg') || url.includes('.mp3')){
                    if(url.includes('themify.me')|| url.includes('themify.org')){
                        if(!url.includes(themifyBuilder.site_url)){
                            themifyImages.add(url);
                        }
                    }
                    else if(url.includes(Themify.urlHost)){
                        localImages.add(url);
                    }
                    else{
                        externalImages.add(url);
                    }
                }
            },
            getImages=fields=>{
                for(let i in fields){
                    if(fields[i]){
                        if(Array.isArray(fields[i]) || typeof fields[i]==='object'){
                            getImages(fields[i]);
                        }
                        else{
                            let v=fields[i].toString().trim();
                            if(v){
                                if(v.includes('<img ') || v.includes('<video ') || v.includes('<audio ')){
                                    let tmp=createElement('template');
                                    tmp.innerHTML=v;
                                    for(let allImages= tmp.content.querySelectorAll('img,video,audio'),j=allImages.length-1;j>-1;--j){
                                        let {src,srcset}=allImages[j];
                                        srcset=srcset?.split(' ') || [];
                                        if(src){
                                            srcset.push(src);
                                        }
                                        for(let k=srcset.length-1;k>-1;--k){
                                            if(srcset[k]){
                                                addImage(srcset[k].trim());
                                            }
                                        }
                                    }
                                }
                                else if(v[0]==='[' && v.includes('path=')){
                                    let m=v.match(/path.*?=.*?['"](.+?)['"]/igm);
                                    if(m?.[0]){
                                        m=m[0].split('path=')[1].replaceAll('"','').replace("'",'').split(',');
                                        for(let j=m.length-1;j>-1;--j){
                                            if(m[j]){
                                                addImage(m[j].trim());
                                            }
                                        }
                                    }
                                }
                                else{
                                    addImage(v);
                                }
                            }
                        }
                    }
                }
            };
            for(let cid of Registry.items.keys()){
                let v=Registry.get(cid);
                if(v?.el.isConnected){
                    getImages(v.get('styling'));
                }
            }
            const domImages=api.Builder.get().el.tfTag('img');
            for(let i=domImages.length-1;i>-1;--i){
                let src=domImages[i].src,
                        srcset=domImages[i].srcset;
                    srcset=srcset?.split(' ') ||[];
                    if(src){
                        srcset.push(src);
                    }
                    for(let j=srcset.length-1;j>-1;--j){
                        if(srcset[j]){
                            addImage(srcset[j].trim());
                        }
                    }
            }
            images.set('themify',themifyImages);
            images.set('local',localImages);
            images.set('external',externalImages);
            return type?images.get(type):images;
        },
        async importThemifyImages(images){
            if(Themify.urlHost.includes('themify.me')){
                return;
            }
            images??=this.getAllImages('themify');
            if(images.size>0){
                return new Promise(async (resolve,reject)=>{
                    try{
                        await Themify.loadJs(Themify.url+'js/admin/import/import-images',!!window.TF_ImportImages);
                        const memory=~~themifyBuilder.memory || 64,
                        chunkSize=memory>=255?4:(memory>=120?3:(memory>60?2:1)),
                        res=await TF_ImportImages.init(images,themifyBuilder.nonce,i18n.uploading,chunkSize),
                        breakpoints=api.breakpointsReverse,
                        setImages=fields=>{
                            for(let i in fields){
                                if(fields[i]===undefined){
                                    delete fields[i];
                                }
                                else if(fields[i]){
                                    if(Array.isArray(fields[i]) || typeof fields[i]==='object'){
                                        setImages(fields[i]);
                                    }
                                    else{
                                        let v=fields[i].toString().trim();
                                        if(v && isNaN(v)){
                                            if(v.includes('<img ') || v.includes('<video ') || v.includes('<audio ')){
                                                let tmp=createElement('template');
                                                tmp.innerHTML='<div>'+v+'</div>';
                                                let content=tmp.content.firstChild,
                                                    allImages= content.tfTag('img,video,audio');
                                                for(let j=allImages.length-1;j>-1;--j){
                                                    let src=allImages[j].src;
                                                    if(src){
                                                        for(let [k,img] of res){
                                                            if(img!==false && src.includes(k)){
                                                                allImages[j].outerHTML=img.html;
                                                            }
                                                        }
                                                    }
                                                }
                                                fields[i]=content.innerHTML;
                                            }
                                            else if( v[0]==='[' || !v.includes(' ')){
                                                if(v[0]==='[' && v.includes('path=')){
                                                    v=v.replace('path=','ids=');
                                                    for(let [k,img] of res){
                                                        if(img!==false){
                                                            v=v.replaceAll(k,img.id);
                                                        }
                                                    }
                                                }
                                                else{
                                                    for(let [k,img] of res){
                                                        if(img!==false){
                                                            v=v.replaceAll(k,img.src);
                                                        }
                                                    }
                                                }
                                                fields[i]=v;
                                            }
                                        }
                                    }
                                }
                            }
                        };
                        for(let [k,v] of res){
                            if(v!==false){
                                let domMedia=doc.querySelectorAll('[src="'+k+'"]');
                                for(let i=domMedia.length-1;i>-1;--i){
                                    let tagName=domMedia[i].tagName;
                                    if(tagName==='IMG' || tagName==='VIDEO' || tagName==='AUDIO'){
                                        domMedia[i].src=v.src;
                                        if(tagName==='IMG'){
                                            domMedia[i].classList.add('wp-image-'+v.id);
                                        }
                                        else if(tagName==='VIDEO' ){
                                            domMedia[i].load();
                                        }
                                    }
                                }
                                domMedia=doc.querySelectorAll('img[data-orig="'+k+'"]');
                                for(let i=domMedia.length-1;i>-1;--i){
                                    domMedia[i].dataset.orig=v.src;
                                    domMedia[i].classList.add('wp-image-'+v.id);
                                }
                                if(isFrontend){
                                    for(let i=breakpoints.length-1;i>-1;--i){
                                        let bp=breakpoints[i],
                                            rules=ThemifyStyles.getSheet(bp).cssRules,
                                            gsRules=ThemifyStyles.getSheet(bp,true).cssRules;
                                        for(let j=rules.length-1;j>-1;--j){ 
                                            rules[j].style.cssText=rules[j].style.cssText.replaceAll(k,v.src);
                                        }
                                        for(let j=gsRules.length-1;j>-1;--j){
                                            rules[j].style.cssText=rules[j].style.cssText.replaceAll(k,v.src);
                                        }
                                    }
                                }
                            }
                        }
                        for(let cid of Registry.items.keys()){
                            let v=Registry.get(cid);
                            if(v){
                                setImages(v.get('styling'));
                            }
                        }
                        TF_Notification.showHide('done','',100);
                        resolve(res);
                    }
                    catch(e){
                        reject(e);
                    }
                });
            }
        },
        grid(slug) {
            const cols = [],
            oldGrids=api.getColClass()[slug.toString()];
            let len=oldGrids?.length || ~~slug;
            for (let i = 0; i < len; ++i) {
                let _c = oldGrids===undefined ? {} : {
                    grid_class:oldGrids[i]
                };
                cols.push(_c);
            }
            return [{
                cols: cols
            }];
        },
        setColumnsCount(col) {
            const len = col.length;
            if (len > 0) {
                const parentNode=col[0].parentNode,
                    cl = parentNode.classList;
                for (let i = cl.length - 1; i > -1; --i) {
                    if (cl[i].indexOf('tb_col_count_') === 0) {
                        cl.remove(cl[i]);
                        break;
                    }
                }
                cl.add('tb_col_count_' +this.getColumns(parentNode).length);
            }
        },
        getColumns(row) {
            const arr=[];
            for(let ch=row.children,i=0;i<ch.length;++i){
                if(ch[i].classList.contains('module_column')){
                    arr.push(ch[i]);
                }
            }
            return arr;
        },
        async saveCss(data, customCss, bid,images) {
            let css,
                cssRes=data?await api.GS.createCss(data, data[0]?.mod_name || null,bid, true):'',
                cssData=cssRes?JSON.stringify(cssRes):'',
                ajaxData={
                    action:'tb_save_css',
                    custom_css:customCss?customCss:'',
                    bid:bid,
                    images:images || '',
                    mode:'gzip'
                };
            try{
                if(!cssData){
                    throw '';
                }
                ajaxData.css=await api.Helper.gzip(cssData);
                css=await api.LocalFetch(ajaxData);
                if (!css.write) {
                    throw '';
                }
            }
            catch(e){
                try{
                    ajaxData.css=cssData;
                    delete ajaxData.mode;
                    cssData=null;
                    css=await api.LocalFetch(ajaxData);
                    if (!css.write) {
                        throw '';
                    }
                }
                catch(e){
                    try{
                        /* new attemp: compile CSS code into binary data and send that to server */
                        ajaxData.css=new Blob( [ ajaxData.css ], { type: 'application/json' });
                        css=await api.LocalFetch(ajaxData); 
                    }
                    catch(e){
                        throw e;
                    }
                }
            }
            return css;
        },
        async runJs(el, type, isAjax) {
            const promises = [];
            if (api.isVisual) {
                if (!type) {
                    if (api.activeModel !== null) {
                        type = api.activeModel.type;
                    } 
                    else if (el) {
                        type= Registry.get(el.dataset.cid)?.type;
                    }
                }
                if (type === 'module' && api.is_builder_ready === true) {
                    Themify.fonts(el);
                }
                if (isAjax !== true) {
                    const images = (el || doc).querySelectorAll('img[data-w]:not(.tf_large_img)'),
                        len=images.length,
                        max=Themify.isTouch?4:8,
                        waitMls=Themify.isTouch?20:5;
                    for (let i = len - 1; i > -1; --i) {
                        let img=images[i],
                            naturalWidth=img.naturalWidth,
                            naturalHeight=img.naturalHeight;
                        if (naturalWidth > 2560 || naturalHeight > 2560) {
                            img.className += ' tf_large_img';
                            Themify.largeImages(img);
                        }
                        else {
                            let w = img.getAttribute('width'),
                                h = img.getAttribute('height');
                            if ((w || h) && (Math.abs(naturalWidth-w)>4 || Math.abs(naturalHeight-h)>4)) {
                                if(len>max){
                                    promises.push(new Promise((resolve,reject)=>{
                                        setTimeout(()=>{
                                            ThemifyImageResize.toBlob(img, w, h).then(resolve).catch(reject);
                                        },i*waitMls);
                                    }));
                                }
                                else{
                                    promises.push(ThemifyImageResize.toBlob(img, w, h));
                                }
                            }
                        }
                    }
                }
            }
            try{
                await Promise.all(promises);
            }
            catch(e){

            }
            if (el && window.Isotope) {
                for (let masonry = Themify.selectWithParent('masonry-done', el),i = masonry.length - 1; i > -1; --i) {
                    Isotope.data(masonry[i])?.destroy();
                    masonry[i].classList.remove('masonry-done');
                }
            }
            return Themify.reRun(el); // load module js ajax
        },
        // get breakpoint width
        getBPWidth(device) {
            const bps=themify_vars.breakpoints,
                breakpoints = Array.isArray(bps[device]) ? bps[device] : bps[device].toString().split('-');
            return breakpoints[breakpoints.length - 1];
        },
        scrollTo(el,offset,opt={}) {
            if (el) {
                if(!offset){
                    el.scrollIntoView(opt);
                }
                else{
                    opt.top=el.getBoundingClientRect().top-topBody.getBoundingClientRect().top-offset;
                    window.scrollTo(opt);
                }
            }
        },
        addViewPortClass(el) {
            el.style.transition = 'none';
            this.removeViewPortClass(el);
            for (let cl = this._isInViewport(el), i = cl.length - 1; i > -1; --i) {
                el.classList.add(cl[i]);
                el.part.add(cl[i]);
            }
            el.style.transition = '';
        },
        removeViewPortClass(el) {
            for (let removeCl = ['top', 'left', 'bottom', 'right'],i = 4; i > -1; --i) {
                let cl='tb_touch_' + removeCl[i];
                el.classList.remove(cl);
                el.part.remove(cl);
            }
        },
        _isInViewport(el) {
            const offset = el.getBoundingClientRect(),
                cl = [],
                docEl=doc.documentElement;
            if (offset.left < 0) {
                cl.push('tb_touch_left');
            } else if (offset.right - 1 >= docEl.clientWidth) {
                cl.push('tb_touch_right');
            }
            if (offset.top < 0) {
                cl.push('tb_touch_top');
            }
            else if(((offset.bottom+ 1) >= docEl.clientHeight) || ((window.innerHeight + window.scrollY) >= body.offsetHeight && (offset.bottom + 20) >= docEl.clientHeight)) {
                cl.push('tb_touch_bottom');
            }
            return cl;
        }
    };
})(body,topBody,bodyCl,topWindow);