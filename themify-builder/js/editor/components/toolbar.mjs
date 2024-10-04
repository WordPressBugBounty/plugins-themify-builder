((api,_CLICK_,body,topBody,bodyCl,topThemify,topWindowDoc) => {
    "use strict";
    const {isFrontend,Registry}=api;
    api.ToolBar =  {
        isLoaded:false,
        el:null,
        rootEl:null,
        init() {
            if(isFrontend){
                const topSvg=topWindowDoc.tfId('tf_svg');
                if(topSvg){
                    const defs=topSvg.firstChild,
                    st=defs.querySelector('#tf_fonts_style'),
                    f=createDocumentFragment();
                    if(st){
                        doc.tfId('tf_fonts_style').textContent+=st.textContent;
                        st.remove();
                    }
                    for(let ch=defs.children,i=ch.length-1;i>-1;--i){
                        f.appendChild(ch[i]);
                    }
                    doc.tfId('tf_svg').firstChild.appendChild(f);
                    topSvg.remove();
                }
            }
            const root = doc.tfId('tb_main_toolbar_root'),
                fr = root.firstElementChild,
                bpSt=createElement('style'),
                fragment=createDocumentFragment(),
                svg=doc.tfId('tf_svg').cloneNode(true);
            this.rootEl = root;

            let cssText='';
            for(let bp=api.breakpointsReverse,i=bp.length-1;i>-1;--i){
                if(bp[i]!=='desktop'){
                    cssText+='--tb_bp_'+bp[i]+':'+api.Utils.getBPWidth(bp[i])+'px;';
                }
            }
            bpSt.textContent=':root{'+cssText+'}';
            body.appendChild(bpSt.cloneNode(true));
            topBody.appendChild(svg.cloneNode(true));

            fragment.append(doc.tfId('tf_lazy_common').cloneNode(true),svg.cloneNode(true)); 
            if (fr) { // shadowrootmode="open" isn't support
                root.attachShadow({
                    mode: fr.getAttribute('shadowrootmode')
                }).appendChild(fr.content);
                fr.remove();
            }
            root.shadowRoot.prepend(fragment);
            if (isFrontend) {
                topBody.appendChild(root);
            }
            this.el = root.shadowRoot.tfId('toolbar');
            const combineCss=this.el.getRootNode().querySelector('#module_combine_style');
            if(isFrontend){
                topWindowDoc.head.prepend(bpSt,combineCss.cloneNode(true));
            }
            doc.tfId('themify-builder-admin-ui-css').before(combineCss.cloneNode(true));
            Themify.on('themify_builder_ready',()=>{
                    if(!isFrontend){
                        (doc.tfId('tb_canvas_block') || doc.tfClass('tb_active_builder')[0]).before(root);
                    }
                    this.isLoaded = true;
                    Themify.trigger('tb_toolbar_loaded');
                    this._setModes();
                    // Compact toolbar
                    requestAnimationFrame(()=>{
                        requestAnimationFrame(()=>{
                            root.style.display='';  
                            this._oberserveSize();
                        });
                    });
                    setTimeout(() => {
                        body.prepend(api.MainPanel.el.getRootNode().querySelector('#module_drag_grids_style').cloneNode(true));
                        topThemify.loadCss(Themify.url + 'themify-metabox/css/themify.minicolors');
                        topThemify.loadCss(Themify.builder_url + 'css/editor/themify-combobox');

                        const events = {
                            [_CLICK_]: {
                                '.revision_btn': 'initRevision',
                                '.layout': 'initLayout',
                                '.import': 'initImport',
                                '.export':'initExport',
                                '.duplicate': 'duplicate',
                                '.save_btn': 'save',
                                '.switch':'switchTo',
                                '.tf_close': 'panelClose',
                                '.breakpoint_switch': 'breakpointSwitcher',
                                '.devices': 'deviceSwitcher',
                                '.custom_css': 'addCustomCSS',
                                '.zoom': 'zoom',
                                '.preview': 'previewBuilder',
                                '.tree':'initTree',
                                '.backend_mode':'backendMode',
                                '.help': 'initHelp',
                                '.plus': 'showPanel'
                            },
                            change: {
                                '.mode input': 'modChange'
                            }
                        };

                        for (let ev in events) {
                            this.el.tfOn(ev, e => {
                                const sel = Object.keys(events[e.type]),
                                    item = e.target.closest(sel);
                                if (item) {
                                    for (let i = 0; i < sel.length; ++i) {
                                        if (item.matches(sel[i])) {
                                            const f = events[e.type][sel[i]];
                                            e.stopPropagation();
                                            e.item = item;
                                            this[f](e);
                                            break;
                                        }
                                    }
                                }
                                e = null;
                            },{passive:true});
                        }
                        api.Drag(api.Builder.get().el);
                        api.Utils.updateDocumentSize();
                        setTimeout(() => {
                            this._unload();
                            localStorage.removeItem('tb_mode');//deprecated
                            if(isFrontend){
                                topThemify.on('tfsmartresize',e=>{
                                    Themify.trigger('tfsmartresize',e);
                                });
                                this._setPopularDevices();
                            }
                        }, 2000); 
                    }, 800);

                }, true,api.is_builder_ready)
                .trigger('tb_toolbar_style_ready');
        },
        _oberserveSize(){
            let req;
            (new ResizeObserver(entries =>{
                cancelAnimationFrame(req);
                const el=entries[0].target;
                    req = requestAnimationFrame(() => {
                        el.classList.toggle('compact_menu',el.getBoundingClientRect().width<=800);
                    });
            })).observe(this.el);
        },
        getBaseCss(){
            const fr=createDocumentFragment(),
            toolbarRoot = this.el.getRootNode(),
            commonCss = toolbarRoot.querySelector('#tf_lazy_common'),
            svgCss = toolbarRoot.querySelector('#tf_svg'),
            baseCss = toolbarRoot.querySelector('#tf_base');
            fr.append(commonCss.cloneNode(true),svgCss.cloneNode(true),baseCss.cloneNode(true));
            return fr;
        },
        _setModes() {
            const isDarkSet=localStorage.getItem('tb_dark_mode');
            if (isDarkSet==='1' || (isDarkSet!=='-1' && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
                this.el.tfClass('dark_mode')[0].checked = true;
                this._changeDarkMode(true);
            }
            if(isFrontend){
                if (localStorage.getItem('tb_inline_editor')) {
                    api.inlineEditor = false;
                    this.el.tfClass('inline_editor_mode')[0].checked = false;
                }

                if (localStorage.getItem('tb_right_click')) {
                    this.el.tfClass('right_click_mode')[0].checked = false;
                }
            }
        },
        showPanel() {
            api.MainPanel.openFloat();
        },
        _unload() {
            if (isFrontend) {
                doc.head.insertAdjacentHTML('afterbegin', '<base target="_parent">');
            }
            topWindow.tfOn('beforeunload',e => {
                if(this.preventBeforeMsg!==true && api.Builder.get().isSaved===false && api.undoManager.hasUndo()){
                    e.preventDefault();
                    return e.returnValue='Are you sure';
                }
            });
        },
        panelClose() {
            return new Promise(resolve=>{
                const pr= api.Builder.get().isSaved===false && api.undoManager.hasUndo()?
                api.LiteLightBox.confirm({
                    msg: 'builderClose',
                    buttons:{
                        no:'save_no',
                        yes:'saveClose'
                    }
                }):Promise.resolve('no');
                pr.then(answer=>{
                    if(answer==='yes'){
                        this.save().then(()=>{
                            resolve(answer);
                            this.panelClose();
                        });
                    }
                    else if (answer === 'no') {
                       this.preventBeforeMsg=true;
                       topWindow.location.reload();
                    }
                });
            });
        },
        async initRevision(e) {
            const target = e.target;
            if (target.classList.contains('load_revision')) {
                api.Spinner.showLoader();
            }
            await Promise.all([Themify.loadJs(api.componentsURL +'revisions',window.TB_Revisions), topThemify.loadCss(Themify.builder_url + 'css/editor/components/revisions')]);
            await TB_Revisions.init(target);
            if (target.classList.contains('load_revision')) {
                const ul=target.closest('ul');
                    ul.style.display='none';
                setTimeout(()=>{
                    ul.style.display='';
                },50);
            }
        },
        async initLayout(e) {
            const target = e.target;
            if (target.classList.contains('load_layout')) {
                api.Spinner.showLoader();
            }
            await Promise.all([Themify.loadJs(api.componentsURL + 'layouts',!!window.TB_Layouts), topThemify.loadCss(Themify.builder_url + 'css/editor/components/layouts')]);
            await TB_Layouts.init(target);
        },
        async initImport(e) {
            const target = e.target;
            if (target.hasAttribute('data-type')) {
                api.Spinner.showLoader();
            }
            await Themify.loadJs(api.componentsURL + 'import',!!window.TB_Import);
            await TB_Import.init(target);
        },
        async initExport(e){
            api.Spinner.showLoader();
            await Promise.all([Themify.loadJs(api.componentsURL + 'export',!!window.TB_Export),api.Helper.loadJsZip()]);
            await TB_Export.init();
        },
        async initHelp() {
            api.Spinner.showLoader();
            await Themify.loadJs(api.componentsURL + 'help',!!window.TB_Help);
            await TB_Help.init();
        },
        async backendMode(e){
            await api.LightBox.save();
            const cl=this.el.tfClass('backend_mode')[0].classList;
            if(!cl.contains('working')){
                cl.add('working');
                api.Spinner.showLoader();
                api.SmallPanel.hide();
                await window.TB_BuilderContentLightbox?.saveAll();
                const builder=api.Builder.get(),
                    data=builder.toJSON(),
                    id='tb_backend_mode',
                    backendUi = doc.tfId(id),
                    adminui = doc.tfId( 'themify-builder-admin-ui-css'),
                    paddingMode=this.el.tfClass('padding_dragging_mode')[0],
                    inlineMode=this.el.tfClass('inline_editor_mode')[0],
                    docs=[body,topBody],
                    prms=[],
                    isVisual=!api.isVisual;
                api.isVisual=isVisual;
                if(!backendUi){
                    prms.push(Themify.loadCss(Themify.builder_url + 'css/editor/backend-mode',id,null,adminui.nextSibling));
                }else{
                    backendUi.disabled=api.isVisual;
                }
                if(!isVisual){
                    paddingMode.checked=inlineMode.checked=api.inlineEditor=false;
                    paddingMode.disabled=inlineMode.disabled=true;
                    api.liveStylingInstance.reset();
                }else{
                    api.inlineEditor = inlineMode.checked=!localStorage.getItem('tb_inline_editor');
                    paddingMode.checked=!localStorage.getItem('tb_disable_padding_dragging');
                    paddingMode.disabled=inlineMode.disabled=false;
                }
                cl.toggle('active',!isVisual);
                bodyCl.toggle('themify_builder_active',isVisual);
                for(let i=docs.length-1;i>-1;--i){
                    docs[i].classList.toggle('tb_backend_mode',!isVisual);
                }
                paddingMode.closest('.switch-wrapper').classList.toggle('disabled',!isVisual);
                inlineMode.closest('.switch-wrapper').classList.toggle('disabled',!isVisual);
                api.EdgeDrag.init();
                Themify.trigger('tb_inline_editor_changed');
                prms.push(builder.reLoad({builder_data:data,custom_css:builder.customCss},false,false));
                await Promise.all(prms);
                cl.remove('working');
                api.Module.loadBackendLightbox('preload');
            }
        },
        /*
        initTree(e){
            e.target.closest('.tree').classList.contains('active')?api.Tree.close():api.Tree.open();
        },
         * 
         */
        async duplicate() {
            const answer=await api.LiteLightBox.confirm({msg:'confirm_on_duplicate_page'});
            if(answer){
                if(answer==='yes'){
                    await api.Builder.get().save();
                    try{
                        api.Spinner.showLoader('show');
                        const resp=await api.LocalFetch({
                            action: 'tb_duplicate_page',
                            tb_is_admin: !api.isVisual?1:0
                        });
                        let url=resp.data;
                        if(!resp.success){
                            throw url;
                        }
                        if(isFrontend){
                            url+='#builder_active';
                        }
                        await api.Spinner.showLoader('done');
                        topWindow.location.href=url.replaceAll('&amp;', '&');
                    }
                    catch(e){
                        api.Spinner.showLoader('error');
                        TF_Notification.showHide('error',e,4000);
                    }
                }
            }
        },
        modChange(e) {
            const cl = e.item.classList,
                checked = e.item.checked === true;
            if (cl.contains('right_click_mode')) {
                checked ? localStorage.removeItem('tb_right_click') : localStorage.setItem('tb_right_click', 1);
                api.RightClick?.bind();
            } 
            else if (cl.contains('padding_dragging_mode')) {
                checked ? localStorage.removeItem('tb_disable_padding_dragging') : localStorage.setItem('tb_disable_padding_dragging', 1);
                api.EdgeDrag.init();
            } 
            else if (cl.contains('dark_mode')) {
                localStorage.setItem('tb_dark_mode', checked?1:-1);
                this._changeDarkMode(checked);
                const areas=topBody.querySelectorAll('.tf_cdm textarea');
                for(let i=areas.length-1;i>-1;--i){
                    areas[i].tf_mirror?.setDarkMode(checked);
                }
            } 
            else if (cl.contains('inline_editor_mode')) {
                if (checked) {
                    localStorage.removeItem('tb_inline_editor');
                } else {
                    localStorage.setItem('tb_inline_editor', 1);
                }
                api.inlineEditor = checked;
                Themify.trigger('tb_inline_editor_changed');
            }
        },
        _changeDarkMode(enabled){
            const file = doc.tfId('tb_dark_mode_style'),
                topFile = isFrontend ? topWindowDoc.getElementById('tb_dark_mode_style') : null;
            if(enabled){
                const adminui = doc.tfId( 'themify-builder-admin-ui-css');
                Themify.loadCss(Themify.builder_url + 'css/editor/darkmode-ui','tb_dark_mode_style',null,adminui.nextSibling);
                if (isFrontend) {
                    topThemify.loadCss(Themify.builder_url + 'css/editor/darkmode-ui','tb_dark_mode_style',null,topWindowDoc.querySelector('link[href*="/components/lightbox."]').nextSibling);
                }
            }
            if(file){
                file.disabled = !enabled;
            }
            if (topFile) {
                topFile.disabled = !enabled;
            }
            api.isDarked=enabled;
        },
        switchTo(e){
            const link = e.item.getAttribute('href');
            if (!isFrontend) {
                Themify.trigger('tb_switch_frontend',[link]);
                return;
            }

            this.save().then(()=>{
                topWindow.location.href = link;
            });
        },
        async save() {
            if(!api.isOld){
                if(api.GS.activeGS){
                    await api.LightBox.save();
                }
                await window.TB_BuilderContentLightbox?.saveAll();
                if(api.LayoutPart?.item){
                    await api.LayoutPart.item.save();
                    await api.LayoutPart.item.close();
                }
                await api.Builder.get().save();
            }
        },
        zoom(e) {
            return new Promise(resolve=>{
                if (isFrontend && 'desktop' === api.activeBreakPoint) {
                    const item = e.item;
                    let zoom_size = item.dataset.zoom.toString() || '100',
                        height = '',
                        canvas = topBody.tfClass('tb_iframe')[0],
                        parent= item.closest('.zoom_menu'),
                        zoomItems = parent.querySelectorAll('.submenu .zoom'),
                        zoomToggle = parent.tfClass('zoom_toggle')[0].parentNode;

                    if (item.classList.contains('zoom_toggle')) {
                        zoom_size = api.zoomMeta || zoom_size !== '100' ? '100' : '50';
                    }
                    if (api.zoomMeta === zoom_size || (zoom_size === '100' && !api.zoomMeta)) {
                        resolve();
                        return;
                    }

                    for (let i = zoomItems.length - 1; i > -1; --i) {
                        zoomItems[i].parentNode.classList.toggle('selected_zoom',zoom_size!=='100' && zoomItems[i].dataset.zoom === zoom_size);
                    }

                    canvas.tfOn('transitionend', () => {
                        api.Utils.onResize(true);
                        resolve();
                    }, {
                        passive: true,
                        once: true
                    });

                    api.zoomMeta = false;
                    if (zoom_size !== '100') {
                        const scale = '50' === zoom_size ? 2 : 1.25;
                        canvas.parentNode.classList.add('tb_zoom_bg');
                        height = Math.max(topWindow.innerHeight * scale, 600) + 'px';
                        api.zoomMeta = zoom_size;
                    }
                    zoomToggle.classList.toggle('selected_zoom', api.zoomMeta);
                    bodyCl.toggle('tb_zoom_only', api.zoomMeta);
                    canvas.parentNode.style.height = height;

                    canvas.classList.remove('tb_zooming_50', 'tb_zooming_75');
                    if (zoom_size !== '100') {
                        canvas.classList.add('tb_zooming_' + zoom_size);
                    }
                }
                else{
                    resolve();
                }
            });
        },
        async addCustomCSS(e) {
            try{
                await api.LightBox.save();
                const options = {
                        contructor: true,
                        loadMethod: 'html',
                        save: {},
                        data: {
                            css: {
                                options: [{
                                        id: 'custom_css',
                                        type: 'textarea',
                                        rows: 17,
                                        class: 'fullwidth'
                                    },
                                    {
                                        id: 'custom_css_m',
                                        type: 'message',
                                        label: '',
                                        comment: 'cus_css_m'
                                    },
                                    {
                                        id: 'postid',
                                        type: 'hidden',
                                        value: api.Builder.get().id
                                    }
                                ]
                            }
                        }
                    },
                    target=e.target.closest('.custom_css'),
                    box = target.getBoundingClientRect();
                target.classList.add('active');
                api.LightBox.el.classList.add('tb_custom_css_lightbox');

                let lb=await api.LightBox.setStandAlone(box.left, box.top).open(options),
                    input = lb.querySelector('#custom_css'),
                    saveBtn=lb.tfClass('builder_save_button')[0],
                    builder=api.Builder.get(),
                    css_id = 'tb_custom_css_'+builder.id,
                    obj,
                    save=async e=>{
                        if(e){
                            e.stopImmediatePropagation();
                            e.preventDefault();
                        }
                        obj.save();
                        const v = input.value.trim() || '',
                            style = doc.tfId(css_id),
                            err = topWindow.CodeMirror.lint.css(v, {
                                errors: 1
                            });
                        if (err?.length > 0) {
                            const answer = await api.LiteLightBox.confirm({
                                msg: themifyBuilder.i18n.broken_code.replace('%s','CSS')
                            });
                            if ( answer === 'no' ) {
                                return;
                            }
                        }
                        if (style) {
                            style.innerHTML = v;
                        }
                        builder.customCss=v;

                        api.LightBox.close();
                    };
                    input.value = builder.customCss || '';
                    obj=await api.Helper.codeMirror(input,'css',{autofocus:true} );
                    obj.editor.on('change', cm=> {
                        const v = cm.getValue().trim();
                        if (api.isVisual) {
                            let el = doc.tfId(css_id);
                            if (el === null) {
                                el = createElement('style',{id:css_id});
                                doc.head.appendChild(el);
                            }
                            el.innerHTML = v;
                        }
                    });


                    saveBtn.tfOn(_CLICK_,save);
                    Themify.on('tb_save_lb',save)
                    .on('themify_builder_lightbox_close', () => {
                        lb.classList.remove('tb_custom_css_lightbox');
                        saveBtn.tfOff(_CLICK_,save,{once:true});
                        Themify.off('tb_save_lb',save);
                        if(api.Builder.get(1)===undefined){
                            this.el.tfClass('custom_css')[0].classList.toggle('active',!!builder.customCss);
                        }
                        else{
                            target.classList.remove('active');
                        }
                        obj.destroy();
                        input=saveBtn=obj=builder=null;
                    },true);
            }
            catch(e){

            }
        },
        async previewBuilder(e) {
            const item = e.item,
                builder=api.Builder.get().el;
            item.classList.toggle('active');
            api.isPreview = !api.isPreview;
            if(api.isPreview){
                if(!api.isVisual && isFrontend){
                    await this.backendMode(e);
                }
            }
            else{
                topWindowDoc.tfId('tb_iframe').style.height = '';
            }
            bodyCl.toggle('tb_preview_only');
            bodyCl.toggle('themify_builder_active');
            topBodyCl.toggle('tb_preview_only');
            api.ToolBar.el.classList.toggle('tb_preview_only');
            api.MainPanel.el.classList.toggle('tb_preview_only');
            if (api.isPreview) {
                for (let row_inner = builder.tfClass('row_inner'),i = row_inner.length - 1; i > -1; --i) {
                    if (row_inner[i].childElementCount === 1 && row_inner[i].tfClass('active_module')[0] === undefined) {
                        let column = row_inner[i].tfClass('module_column')[0];
                        if (column !== undefined) {
                            let mcolumn = Registry.get(column.dataset.cid);
                            if (mcolumn && Object.keys(mcolumn.get('styling')).length === 0) {
                                let row = row_inner[i].closest('.module_row'),
                                    mrow = Registry.get(row.dataset.cid);
                                if (mrow && Object.keys(mrow.get('styling')).length === 0) {
                                    row.classList.add('tf_hide');
                                }
                            }
                        }

                    }
                }
            } 
            else {
                for (let rows = builder.querySelectorAll('.tf_hide.module_row'),i = rows.length - 1; i > -1; --i) {
                    rows[i].classList.remove('tf_hide');
                }
            }

            for(let items = builder.querySelectorAll('[data-cid]'),i=items.length-1;i>-1;--i){
                let item=items[i];
                if(isFrontend){
                    Registry.get(items[i].dataset.cid)?.previewVisibility();
                }
                item.draggable=!api.isPreview;
            }

        },
        _setPopularDevices(){
            const bpPoints = themify_vars.breakpoints,
                mobile={
                    ip7pl: [414, 736],
                    ipxr: [414, 896],
                    ipxs: [375, 812],
                    ip8: [375, 667],
                    glxs9pl: [412, 846],
                    glxs8pl: [360, 740],
                    glxs7: [360, 640],
                    huawp20: [360, 748],
                    huawp10: [360, 640]
                },
                tablet={
                    nexus9: [768, 1024],
                    ipadm : [768, 1024],
                    glxyt10: [800, 1280],
                    ip_air : [820, 1180],
                    ippro : [1024, 1366]
                },
                wrap=this.el.tfClass('breakpoint_switcher')[0];
            for (let bp in bpPoints) {
                if(bp!=='desktop'){
                    let ul=createElement('ul',{class:'submenu devices tf_hide tf_abs_t',tabindex:-1}),
                        first=createElement('li','','Breakpoint Settings'),
                        val=bpPoints[bp],
                        devices = 'mobile' === bp ? mobile : tablet;
                    first.dataset.width='mobile' === bp ? val :val[1];
                    if(bp!=='mobile'){
                        first.dataset.height='tablet' === bp?bpPoints.tablet_landscape[1]:val[0];
                    }
                    ul.appendChild(first);
                    for(let d in devices){
                        let size = 'tablet_landscape' === bp ? [devices[d][1],devices[d][0]] : devices[d];
                            ul.appendChild(createElement('li',{'data-width':size[0],'data-height':size[1]},i18n[d]+' ('+size[0]+'X'+size[1]+')'));
                    }
                    wrap.tfClass(bp)[0].appendChild(ul);
                }
            }
        },
        deviceSwitcher(e) {
            const item = e.target,
            {width:w,height:h}=item.dataset;
            if (w) {
                this.el.tfClass('selected_device')[0]?.classList.remove('selected_device');
                item.classList.add('selected_device');
                return this.switchToBreakpoint(1 * w, 1 * h);
            }
            return Promise.reject();
        },
        breakpointSwitcher(e) {
            let breakpoint = 'desktop',
                w;
            if(typeof e==='string'){
                breakpoint=e;
            }
            else{
                const item = e.item;
                if (item.classList.contains('breakpoint-tablet')) {
                    breakpoint = 'tablet';
                } else if (item.classList.contains('breakpoint-tablet_landscape')) {
                    breakpoint = 'tablet_landscape';
                } else if (item.classList.contains('breakpoint-mobile')) {
                    breakpoint = 'mobile';
                }
            }
            if (api.activeBreakPoint === breakpoint) {
                // Already in this breakpoint, so return
                return;
            }

            w = breakpoint !== 'desktop' ? api.Utils.getBPWidth(breakpoint) - 1 : '';

            return this.switchToBreakpoint(w, '');

        },
        _iframeScroll() {
            if (this.scrollY !== window.scrollY) {
                window.scroll(0, this.scrollY);
            }
            if (this.scrollY !== topWindow.scrollY) {
                topWindow.scroll(0, this.scrollY);
            }
        },
        switchToBreakpoint(w, h) {
            return new Promise(resolve => {
                if(topBodyCl.contains('tb_start_change_mode')){
                    resolve();
                    return;
                }
                let breakpoint = 'desktop',
                    prevBreakPoint = api.activeBreakPoint,
                    iframe=topWindowDoc.tfId('tb_iframe');
                    
                if (w) {
                    w *= 1;
                    const bpPoints = themify_vars.breakpoints;
                    for (let i in bpPoints) {
                        if (Array.isArray(bpPoints[i])) {
                            if (bpPoints[i][0] <= w && w <= bpPoints[i][1]) {
                                breakpoint = i;
                                break;
                            }
                        } else if (w <= bpPoints[i]) {
                            breakpoint = i;
                            break;
                        }
                    }
                    if (api.isDocked !== false && 'tablet_landscape' === breakpoint) {
                        const wspace = topBody.tfClass('tb_workspace_container').offsetWidth;
                        if (wspace < w) {
                            w = wspace; // make preview fit the screen when dock mode active
                        }
                    }
                    w += 'px';
                }
                else{
                    w='';
                }
                if (h>0) {
                    h += 'px';
                }
                else{
                    h='';
                }
                if (iframe!==null && w === iframe.style.width && h === iframe.style.height) {
                    resolve();
                    return;
                }
                api.SmallPanel.hide();
                api.ActionBar.disable=true;
                if (iframe!==null) {
                    let willChange = w !== '' ? 'width' : '';
                    if (h !== '') {
                        willChange += h !== '' ? (willChange !== '' ? ',height' : '') : '';
                    }
                    iframe.style.willChange = willChange;
                    api.ActionBar.clear();
                }
                let classses = [bodyCl, topBodyCl, this.el.classList,api.MainPanel.el.classList, api.SmallPanel.el.classList],
                    items = [],
                    viewportElement,//need to keep scroll position,to avoid scroll jumping 
                    is_resizing = iframe?.classList.contains('tb_resizing_start'),
                    callback = () => {
                            if (isFrontend) {
                                for (let i = items.length - 1; i > -1; --i) {
                                    items[i].style.display = '';
                                }
                                bodyCl.toggle('tf_scrollbar', breakpoint !== 'desktop');
                            }
                            //this.el.tfClass('compact_switcher')[0].tfTag('svg')[0].className = item.tfTag('svg')[0].className;
                            for (let i = classses.length - 1; i > -1; --i) {
                                let cls=classses[i];
                                cls.remove('builder-breakpoint-' + prevBreakPoint);
                                cls.toggle('tb_responsive_mode', breakpoint !== 'desktop');
                                cls.add('builder-breakpoint-' + breakpoint);
                            }
                            const _finish=()=>{
                                Themify.trigger('themify_builder_change_mode', [prevBreakPoint, breakpoint]);
                                api.scrollTo=api.ActionBar.disable = classses = viewportElement= iframe=items = is_resizing=prevBreakPoint = breakpoint = null;
                            };
                            if (isFrontend) {
                                iframe.style.willChange = '';
                                if (breakpoint === 'desktop') {
                                    topBody.style.height = '';
                                }
                                topWindow.tfOff('scroll', this._iframeScroll, {
                                    passive: true
                                });
                                window.tfOff('scroll', this._iframeScroll, {
                                    passive: true
                                });
                                if (breakpoint !== 'desktop') {
                                    topWindow.tfOn('scroll', this._iframeScroll, {
                                        passive: true
                                    });
                                    window.tfOn('scroll', this._iframeScroll, {
                                        passive: true
                                    });
                                }
                                if(!api.scrollTo && viewportElement){
                                    api.scrollTo=viewportElement;
                                }
                                api.Utils.scrollTo(api.scrollTo);

                                for (let i = classses.length - 1; i > -1; --i) {
                                    classses[i].remove('tb_start_animate');
                                }
                                if(iframe!==null){
                                    iframe.style.transition='';
                                }
                                setTimeout(() => {
                                    api.Utils.onResize(true).then(() => {
                                        api.Utils.setColumnsCount(doc.tfClass('module_column'));
                                        if(breakpoint==='desktop'){
                                            this.el.tfClass('selected_device')[0]?.classList.remove('selected_device');
                                        }
                                        api.Utils.scrollTo(api.scrollTo);//maybe js change position
                                        topWindow.scroll(0,window.scrollY);

                                        for (let i = classses.length - 1; i > -1; --i) {
                                            classses[i].remove('tb_start_change_mode');
                                        }
                                        _finish();
                                        resolve();
                                    });
                                }, 150);
                            }
                            else{
                                _finish();
                                resolve();
                            }

                    },
                    zoom=api.zoomMeta && ~~api.zoomMeta!==100?this.zoom({item:this.el.tfClass('zoom_toggle')[0]}):Promise.resolve();
                // disable zoom if active
                zoom.then(()=>{
                    api.activeBreakPoint = breakpoint;
                    if (isFrontend) {
                        viewportElement=api.liveStylingInstance.el?api.liveStylingInstance.el:doc.elementFromPoint((Themify.w/2)-20, this.el.offsetHeight);
                        //hide the hidden  rows for fast resizing
                        const childs = api.Builder.get().el.children,
                            fillHidden = el => {
                                if (el !== null && el !== undefined) {
                                    const off = el.getBoundingClientRect();
                                    if ((off.bottom < 0 && off.top < 0) || off.top > Themify.h) {
                                        el.style.display = 'none';
                                        items.push(el);
                                    }
                                }
                            };
                        for (let i = childs.length - 1; i > -1; --i) {
                            fillHidden(childs[i]);
                        }
                        fillHidden(doc.tfId('headerwrap'));
                        fillHidden(doc.tfId('footerwrap'));

                        for (let i = classses.length - 1; i > -1; --i) {
                            classses[i].add('tb_start_animate', 'tb_start_change_mode'); //disable all transitions
                        }
                        setTimeout(()=>{
                                if (!is_resizing) {
                                    iframe.tfOn('transitionend', callback,{passive:true,once:true})
                                    .style.height = h;
                                    iframe.style.width = w;
                                } 
                                else {
                                    callback();
                                }
                        },50);
                    } 
                    else {
                        callback();
                    }
                });
            });
        }
    };
    if (doc.readyState === 'interactive' || doc.readyState === 'complete') {
        api.ToolBar.init();
    } 
    else {
        doc.tfOn('DOMContentLoaded', ()=>{
            api.ToolBar.init();
        }, {once: true, passive: true});
    }


})(tb_app,_CLICK_,body,topBody,bodyCl,topThemify,topWindowDoc);