((api,_CLICK_,ThemifyConstructor) => {
    "use strict";
    const gsTpl=doc.tfId('tb_global_styles_root').content;
    let searchCache={},
        xhr;
    class GS {
        constructor(el,input) {
            let _this=this,
                vals=input.value;
            _this.el=el;
            _this._selectedContainer=el.tfClass('selected_wrap')[0];
            _this._list = el.tfClass('list')[0];
            _this._field=input;
            if (vals) {
                el.classList.remove('empty');
                vals = vals.split(' ');
                let v = '';
                for (let i = vals.length - 1; i > -1; --i) {
                    if (api.GS.styles[vals[i]] !== undefined) {
                        v += ' ' + vals[i];
                        _this._createSelected(vals[i]);
                    }
                }
                input.value = v.trim();
            }
            _this._events();
        }
        _events(){
            const _this=this,
            el=_this.el;
            el.tfClass('actions')[0].tfOn(_CLICK_,e=>{
                e.stopPropagation();
                const action = e.target.dataset.action;
                if(action==='insert'){
                    _this._init();
                }
                else if(action==='save'){
                    _this._saveAs();
                }
            },{passive:true});

            _this._selectedContainer.tfOn(_CLICK_,e=>{
                const id=e.target.closest('.selected')?.dataset.id;
                if(id){
                    if(e.target.closest('.delete')){
                        _this._delete(id);
                    }
                    else if(e.target.closest('.edit')){
                        api.GS.gsEdit(id);
                    }
                }
            });

            _this._list.tfOn(_CLICK_,e=>{
                const item=e.target.closest('.item');
                if(item){
                    _this._insert(item.dataset.id);
                }
            });


            el.querySelector('#search').tfOn('input', e=> {
                const filter = e.target.value.toUpperCase().trim(),
                    items = e.target.closest('.form').tfClass('item'),
                    filterByValue = () => {
                        let found=items.length===0;
                        for (let i = items.length - 1; i > -1; --i) {
                            let title = items[i].tfClass('title')[0];
                            if (title) {
                                let display=filter==='' || title.innerHTML.toUpperCase().includes(filter)? '' : 'none';
                                if(found===false && display===''){
                                    found=true;
                                }
                                items[i].style.display =display;
                            }
                        }
                        _this._hideShowNoGsText(found);
                    };
                if (xhr) {
                    xhr.abort();
                    xhr = null;
                }
                if (filter!=='' && searchCache[filter]===undefined && !api.GS._allLoaded) {
                    setTimeout(() => {
                        _this._loadMore(filter)
                            .then(filterByValue)
                            .catch(e=>{});
                    }, 100);
                }
                else{
                    filterByValue();
                }
            },{passive: true });

            el.tfClass('clear_search')[0].tfOn(_CLICK_, e=> {
                e.stopPropagation();
                const search=el.querySelector('#search');
                search.value='';
                search.focus();
                Themify.triggerEvent(search,'input');
            },{passive: true});

            el.parentNode.querySelector('.overlay').tfOn(_CLICK_, function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.remove();
            },{once: true});
        }
        _addItem(items) {
            if(items.length>0){
                const f = createDocumentFragment(),
                    _this=this,
                    st = _this._field.value.split(' ');
                for (let i = 0; i < items.length; ++i) {
                    let item=items[i];
                    if(!_this._list.querySelector('[data-id="'+item+'"]')){
                        let post = api.GS.styles[item],
                            title=createElement('','title'),
                        container = createElement('',{'data-id':item,class:'item'+(st.includes(item)? ' selected' : '')});
                        title.innerHTML=post.title;
                        container.append(title,createElement('','type',post.type));
                        f.appendChild(container);
                    }
                }
                _this._list.appendChild(f);
                _this._checkReload();
            }
        }
        // Crete selected GS HTML
        _createSelected(id) {
            const _this=this,
                post = api.GS.styles[id],
                selectedItem = createElement('',{class:'selected','data-id':id}),
                edit = createElement('span','edit'),
                title=createElement('span','tf_overflow');
                title.innerHTML=post.title;
            edit.appendChild(api.Helper.getIcon('ti-pencil'));
            selectedItem.append(edit,title,createElement('span','delete tf_close'));
            _this._list.querySelector('[data-id="' + id + '"]')?.classList.add('selected');
            _this._selectedContainer.appendChild(selectedItem);
            _this._checkReload();
        }
        // Insert new global style
        async _insert(id) {
            const _this=this;
            if(!_this._selectedContainer.querySelector('[data-id="' + id + '"]')){
                // Add selected global style HTML and hide it in drop down
                _this._createSelected(id);
                // Add CSS class to global style field
                let st = _this._field.value + ' ' + id;
                _this._field.value = st = st.trim();
                _this._selectedContainer.closest('#container').classList.remove('empty');
                await api.GS.setGsStyle(st.split(' '));
            }
        }
        // Delete Global Style from module
        async _delete(id) {
            const _this=this;
            _this._list.querySelector('[data-id="' + id + '"]')?.classList.remove('selected');
            _this._selectedContainer.querySelector('[data-id="' + id + '"]')?.remove();
            // Add CSS class to global style field
            let st = _this._field.value.trim().split(' ');
            st.splice(st.indexOf(id), 1);
            st= st.join(' ');
            _this._field.value = st;
            if(st===''){
                _this._selectedContainer.closest('#container').classList.add('empty');
            }
            _this._checkReload();
            await api.GS.setGsStyle(st.split(' '), true);
        }
        _init() {
            const _this=this, 
                form=_this.el.querySelector('.form');
            if(!_this._done){
                _this._done=true;
                const items = Object.keys(api.GS.styles);
                _this._addItem(items);
                if (api.GS._allLoaded !== true) {
                    if (items.length < 10) {
                        _this._loadMore();
                    }
                    _this._reLoad=_this._list.tfOn('scroll',e=>{
                        _this._onScroll(e);
                    }, {passive: true})
                    .tfClass('reload')[0];
                    _this._reLoad.tfOn(_CLICK_,e=>{
                        e.stopPropagation();
                        e.preventDefault();
                        _this._loadMore();
                    });
                }
            }
            this._hideShowNoGsText();
            form.focus();
        }
        _loadMore(s='') {
            const cl=this.el.classList,
                loaded = [];
            if(cl.contains('loading')){
                return Promise.reject();
            }
            if(searchCache[s]!==undefined) {
                return Promise.resolve();
            }
            for (let i in api.GS.styles) {
                if (api.GS.styles[i].id !== undefined) {
                    loaded.push(api.GS.styles[i].id);
                }
            }
            cl.add('loading');
            const ajaxData={
                s: s,
                action: 'tb_get_gs_posts',
                loaded:loaded
            };
            xhr = new AbortController();
            return api.LocalFetch(ajaxData,'json',{signal: xhr.signal}).then(res=>{
                this._hideShowNoGsText(true);
                api.GS.extend(res);
                const keys = Object.keys(res);
                if (!s) {
                    api.GS._allLoaded= keys.length < 10;
                    if(api.GS._allLoaded){
                        this._reLoad.remove();
                        this._reLoad=null;
                    }
                }
                else{
                    searchCache[s]=true;
                }
                this._addItem(keys);
            })
                .catch(()=>{

                })
                .finally(()=>{
                    cl.remove('loading');
                });
        }
        // Save as global style event
        async _saveAs() {
            const data=await api.LiteLightBox.prompt('enterGlobalStyleName');
            if(data?.[0]==='yes'){
                const title=data[1];
                if (!title) {
                    TF_Notification.showHide('error','enterGlobalStyleName');
                    this._saveAs();
                }
                else {
                    ThemifyConstructor.setStylingValues(api.activeBreakPoint);
                    const styles = api.Helper.cloneObject(api.Base.builderSave(ThemifyConstructor.values,'empty'));
                    delete styles[api.GS.key];
                    const ajaxData={
                        action:'tb_save_as_new_global_style',
                        styles: styles,
                        title: title,
                        type: api.activeModel.get('mod_name')
                    };
                    api.Spinner.showLoader();
                    try{
                        let res=await api.LocalFetch(ajaxData);
                        api.Spinner.showLoader('hide');
                        if ('success' === res.status) {
                            const sucessMsg = res.msg;
                            res = res.post_data;
                            await api.Utils.saveCss(api.Base.builderSave(res.data,'empty'), '', res.id);
                            await TF_Notification.showHide('done', sucessMsg);

                            api.GS.styles[res.class] = res;
                            const answer = await api.LiteLightBox.confirm({
                                msg: 'addSavedGS'
                            });
                            if (answer) {
                                if ('yes' === answer) {
                                    await ThemifyConstructor.resetStyling(api.activeModel);
                                }
                                this._addItem([res.class]);
                                if ('yes' === answer) {
                                    this._insert(res.class);
                                }
                            }
                        }
                        else {
                            api.LiteLightBox.alert(res.msg);
                        }

                    }catch (e){
                        api.Spinner.showLoader('error');
                    }
                }
            }
        }
        _onScroll(e) {
            if (api.GS._allLoaded=== false) {
                const target = e.target,
                    distToBottom = Math.max(target.scrollHeight - (target.scrollTop + target.offsetHeight), 0);
                if (distToBottom > 0 && distToBottom <= 200) {
                    this._loadMore().catch(e=>{});
                }
            }
        }
        _hideShowNoGsText(check){
            check??=this._list.tfClass('item')[0]!==undefined;
            this._list.tfClass('no_gs')[0].classList.toggle('tf_hide',check);
        }
        _checkReload(){
            this._reLoad?.classList.toggle('tf_hide',this._list.scrollHeight > this._list.clientHeight);
        }
        _destroy(){
            xhr?.abort();
            for(let k in this){
                this[k]=null;
            }
            xhr=null;
        }
    }
    class GSShadow extends HTMLElement {
        disconnectedCallback(){
            this.el._destroy();
        }
        connectedCallback () {
            const tpl = gsTpl.cloneNode(true),
                input = ThemifyConstructor.hidden.render({
                    id: api.GS.key,
                    is_responsive: false,
                    value: ThemifyConstructor.values[api.GS.key],
                    control: false
                }, ThemifyConstructor);

            this.el=new GS(tpl.querySelector('#container'),input);
            this.attachShadow({ mode:'open'}).appendChild(tpl);
            this.before(input);
        }
    }
    customElements.define('tb-gs', GSShadow);
    api.GS =  {
        styles:{},
        el : null,
        activeGS : null,
        key : 'global_styles',
        previousId : null,
        _field : null,
        _liveInstance : null,
        _allLoaded : false,
        init() {
            Themify.on('tb_toolbar_loaded', () => {

                const fr=createDocumentFragment();

                fr.appendChild(api.ToolBar.getBaseCss());

                gsTpl.prepend(fr.cloneNode(true));

            }, true,api.ToolBar?.isLoaded===true);

            if (api.isGSPage === true) {
                Themify.on('themify_builder_ready',()=>{
                    const callback=()=>{
                        this.openStylingPanel();
                        api.Registry.off(api.Builder.get(),'tb_init',callback);
                    };
                    if(api.is_builder_ready){
                        callback();
                    }
                    else{
                         api.Registry.on(api.Builder.get(),'tb_init',callback);
                    }
                },true,api.is_builder_ready);
            }
            else if (themifyBuilder.globalStyles) {
                this.extend(themifyBuilder.globalStyles);
                themifyBuilder.globalStyles = null;
            }
        },
        // Merge two object
        extend(gs){
            for (let key in gs) {
                if (this.styles[key]===undefined && gs[key] !== undefined){
                    this.styles[key] = gs[key];
                }
            }
            return this.styles;
        },
        // Open Styling Panel in GS edit post
        openStylingPanel() {
            let type = themifyBuilder.globalStyleData.type,
                selector;
            switch (type) {
                case 'row':
                case 'column':
                    selector = 'module_' + type;
                    break;
                case 'subrow':
                    selector = 'active_subrow';
                    break;
                default:
                    selector = 'active_module';
                    break;
            }
            api.Registry.get(api.Builder.get().el.tfClass(selector)[0].dataset.cid).edit('styling');
            api.ToolBar.previewBuilder({item: api.ToolBar.el.tfClass('preview')[0]});
        },
        setCss(data, type, isGlobal) {
            if (api.isVisual) {
                api.liveStylingInstance.setCss(data, type, isGlobal);
            }
        },
        async createCss(data, type,bid, saving) {
            ThemifyStyles.GS = {};
            bid||=api.Builder.get().id;
            const css = await ThemifyStyles.createCss(bid, data, type, saving, this.styles, undefined, saving);
            if (saving === true && Object.keys(this.styles).length > 0 && css.gs) {
                css.gs.used = '';
                for (let i in this.styles) {
                    css.gs.used += '' === css.gs.used ? '' : ', ';
                    css.gs.used += this.styles[i].title;
                }
            }
            return css;
        },
        // Find used items in builder data
        findUsedItems(data) {
            data = JSON.stringify(data);
            let pattern = /"global_styles":"(.*?)"/mg,
                match,
                used = '';
            while ((match = pattern.exec(data)) !== null) {
                used += ' ' + match[1].trim();
            }
            match = null;
            used = used.trim();
            if (used !== '') {
                used = [...new Set(used.split(' '))];
                const usedItems = [];
                for (let i = used.length - 1; i > -1; --i) {
                    if (this.styles[used[i]] !== undefined) {
                        usedItems.push(used[i]);
                    }
                }
                return usedItems;
            }
            return false;
        },
        // Build require HTML for Global Style fields and controllers to add it in Styling Tab
        globalStylesHTML() {
            return api.isGSPage === true || this.activeGS !== null?false:createElement('tb-gs');
        },
        // Trigger required functions on add/delete a GS
        updated(css, res, values,model) {
            if (api.isGSPage === false && api.isVisual && model.type !== 'module') {
                this.extraStyle(css, res, values,model);
            }
        },
        async setImport(usedGS, data, ignore) {
            if (ignore !== true) {
                for (let i in usedGS) {
                    if (this.styles[i] !== undefined) {
                        delete usedGS[i];
                    }
                }
            }
            if (Object.keys(usedGS).length > 0) {
                const ajaxData={
                    action:'tb_import_gs_posts_ajax',
                    data: JSON.stringify(usedGS),
                    onlySave: ignore ? 1 : 0
                };
                return api.LocalFetch(ajaxData).then(res => {
                    if (res) {
                        for (let i in res) {
                            this.styles[i] = res[i];
                        }
                    }
                    return data;
                });
            }
            return data;
        },
        async setGsStyle(values, isRemove,model) {

            if (api.isGSPage === true || !api.isVisual) {
                return;
            }
            model??=api.activeModel;
            let elType = model.get('mod_name'),
                element_id = model.id,
                res = {
                    styling: ThemifyStyles.generateGSstyles(values, elType, this.styles),
                    element_id: element_id
                };
            ThemifyStyles.disableNestedSel = true;
            if (this._liveInstance === null) {
                this._liveInstance = api.createStyleInstance();
                this._liveInstance.init(true, true,model);
            }
            const css = await this.createCss([res], elType),
                live = this._liveInstance,
                fonts = [],
                oldBreakpoint = api.activeBreakPoint,
                prefix = live.prefix,
                re = new RegExp(prefix, 'g');

            ThemifyStyles.disableNestedSel = null;
            if (isRemove === true) {
                const points = ThemifyConstructor.breakpointsReverse;
                for (let i = points.length - 1; i > -1; --i) {
                    api.activeBreakPoint = points[i];
                    live.setMode(points[i], true);
                    let stylesheet = live.currentSheet,
                        rules = stylesheet.cssRules || stylesheet.rules;
                    for (let j = rules.length - 1; j > -1; --j) {
                        if (rules[j].selectorText.includes(prefix)) {
                            let sel = rules[j].selectorText.replace(/\,\s+/g, ',').replace(re, '').split(','),
                                st = rules[j].cssText.split('{')[1].split(';');
                            if (sel[0].includes('.tb_text_wrap')) {
                                for (let s = sel.length - 1; s > 0; --s) {
                                    if (sel[s].includes('.tb_text_wrap')) {
                                        sel.splice(s, 1);
                                    }
                                }
                            }
                            for (let k = st.length - 2; k > -1; --k) {
                                live.setLiveStyle(st[k].trim().split(': ')[0].trim(), '', sel);
                            }
                        }
                    }
                }
            }
            delete css.gs;

            for (let i in css) {
                if ('fonts' === i || 'cf_fonts' === i) {
                    for (let f in css[i]) {
                        let v = f;
                        if (css[i][f].length > 0) {
                            v += ':' + css[i][f].join(',');
                        }
                        fonts.push(v);
                    }
                } else {
                    api.activeBreakPoint = i;
                    live.setMode(i, true);

                    for (let j in css[i]) {
                        let sel = j.replace(/\,\s+/g, ',').replace(re, '').split(',');
                        for (let k = 0, len = css[i][j].length; k < len; ++k) {
                            let tmp = css[i][j][k].split(';');
                            for (let k2 = tmp.length - 2; k2 > -1; --k2) {
                                if (tmp[k2] !== '') {
                                    let prop = tmp[k2].split(':')[0],
                                        v = tmp[k2].replace(prop + ':', '').trim();
                                    if (prop === 'background-image' && tmp[k2].includes('svg') && tmp[k2].includes('data:')) {
                                        v += ';' + tmp[k2 + 1];
                                    }

                                    live.setLiveStyle(prop, v, sel);
                                }
                            }
                        }
                    }
                }
            }
            if (fonts.length > 0) {
                ThemifyConstructor.font_select.loadGoogleFonts(fonts.join('|'));
            }
            api.activeBreakPoint = oldBreakpoint;
            this.updated(css, res, values,model);
            this._liveInstance = null;
        },
        // Live edit GS
        async gsEdit(id) {
            let m;
            if (api.activeModel !== null) {
                this.previousId = api.activeModel.id;
            }
            const gsPost = this.styles[id],
                args = api.Helper.cloneObject(gsPost.data[0]),
                type = gsPost.type;
            this.activeGS = id;
            if (type === 'row') {
                delete args.cols;
                delete args.styling[this.key];
                m = new api.Row(args);
            }
            else {
                if (type === 'subrow') {
                    delete args.cols;
                    delete args.styling[this.key];
                    m = new api.SubRow(args);
                }
                else {
                    delete args.styling;
                    if (type === 'column') {
                        delete args.cols[0].modules;
                        delete args.cols[0].styling[this.key];
                        m = new api.Column(args.cols[0]);
                    }
                    else {
                        delete args.cols[0].styling;
                        delete args.cols[0].modules[0].mod_settings[this.key];
                        m = api.Module.initModule(args.cols[0].modules[0]);
                    }
                }
            }
            api.LightBox.el.className += ' gs_post';
            try{
                const lb=await m.edit('styling'),
                revertChange = () => {
                        Themify.off('themify_builder_lightbox_close', revertChange)
                            .off('themify_builder_save_component', saveComponent);
                        lb.classList.remove('gs_post');
                        if (!api.isVisual && this.previousId !== null && (type === 'row' || type === 'column' || type === 'subrow')) {
                            if (api.Registry.get(this.previousId)?.type === 'module') {
                                api.liveStylingInstance.removeBgSlider();
                                api.liveStylingInstance.removeBgVideo();
                                api.liveStylingInstance.removeFrames();
                                api.liveStylingInstance.getComponentBgOverlay()?.remove();
                                api.liveStylingInstance.el.classList.remove('builder-zoom-scrolling', 'builder-zooming');
                            }
                        }
                        m.destroy();
                        this.reopenPreviousPanel();
                        this.activeGS = this.previousId =null;
                    },
                    saveComponent=async settings=>{
                        const id = this.activeGS,
                            gsPost = this.styles[id];
                        delete ThemifyConstructor.values.cid;
                        const data = api.Helper.cloneObject(settings);
                        delete data[this.key];
                        if ('row' === type || type === 'subrow') {
                            gsPost.data[0].styling = data;
                            delete gsPost.data[0].cols;
                        } else {
                            delete gsPost.data[0].styling;
                            delete gsPost.data[0].cols[0].grid_class;
                            if ('column' === type) {
                                delete gsPost.data[0].cols[0].modules;
                                gsPost.data[0].cols[0].styling = data;
                            } else {
                                delete gsPost.data[0].cols[0].styling;
                                gsPost.data[0].cols[0].modules[0].mod_settings = data;

                            }
                        }
                        api.Spinner.showLoader();
                        try{
                            await api.Utils.saveCss(gsPost.data, '', gsPost.id);
                            this.styles[id].data = gsPost.data;
                            if (api.isVisual) {
                                const Registry= api.Registry,
                                    items =  Registry.items.keys();
                                for (let cid of items) {
                                    let args =  Registry.get(cid)?.get('styling');
                                    if (args?.[this.key]?.includes(id)) {
                                        await this.setGsStyle(args[this.key].split(' '));
                                    }
                                }
                                this._liveInstance = null;
                            }
                            await api.LocalFetch({
                                action:'tb_update_global_style',
                                bid: gsPost.id,
                                data: gsPost.data
                            });
                            api.Spinner.showLoader('done');
                            revertChange();
                        }
                        catch(e){
                            this.activeGS = this.previousId=null;
                            api.Spinner.showLoader('error');
                        }
                    };
                lb.tfClass('current')[0].tfClass('tb_tooltip')[0].innerHTML = i18n.g_s + ' - ' + gsPost.title;
                Themify.on('themify_builder_lightbox_close', revertChange,true)
                    .on('themify_builder_save_component', saveComponent,true);
            }
            catch(e){
                console.error(e);
            }
        },
        // Open prevous module panel
        reopenPreviousPanel(triggerData) {
            if (null !== this.previousId) {
                api.Registry.get(this.previousId)?.edit('styling');
                this.previousId = null;
            }
        },
        extraStyle(css, res, values,model) {
            let live = this._liveInstance || api.liveStylingInstance,
                prefix = live.prefix,
                start = prefix.length - 1,
                exist = live.getComponentBgOverlay(model.type)!==null,
                el = live.el,
                hasOverlay = exist,
                sides = {
                    top: false,
                    bottom: false,
                    left: false,
                    right: false
                },
                framesCount = 0,
                parallaxClass = 'builder-parallax-scrolling',
                zoomClass = 'builder-zoom-scrolling';
            loop:
                for (let i in css) {
                    if ('fonts' !== i && 'cf_fonts' !== i && 'gs' !== i) {
                        for (let j in css[i]) {
                            if (hasOverlay === false) {
                                hasOverlay = j.includes('builder_row_cover', start);
                            }
                            if (j.includes('tb_row_frame', start)) {
                                for (let f in sides) {
                                    if (sides[f] === false && j.includes('tb_row_frame_' + f, start)) {
                                        sides[f] = true;
                                        ++framesCount;
                                        break;
                                    }
                                }
                            }
                            if (hasOverlay === true && framesCount === 4) {
                                break loop;
                            }
                        }
                    }
                }
            css = null;
            if (exist === false && hasOverlay === true) {
                live.addOrRemoveComponentOverlay();
            }
            if (framesCount > 0) {
                let fr = createDocumentFragment(),
                    frame_wrap = el.querySelector(':scope>.tb_row_frame_wrap');
                if (!frame_wrap) {
                    frame_wrap = createElement('span','tb_row_frame_wrap tf_overflow tf_abs');
                    el.tfClass('tb_'+model.type+'_action')[0].after(frame_wrap);
                }
                for (let f in sides) {
                    if (sides[f] === true && !frame_wrap.tfClass('tb_row_frame_' + f)[0]) {
                        fr.appendChild(createElement('span','tf_abs tf_overflow tf_w tb_row_frame tb_row_frame_' + f));
                    }
                }
                frame_wrap.appendChild(fr);
            }
            let bgType = res.styling !== undefined ? (res.styling.background_type || 'image') : 'none';
            
            if (bgType === 'image' && res.styling.background_repeat === parallaxClass && res.styling.background_image) {
                el.classList.add(parallaxClass);
                Themify.reRun(el, true);
            } else {
                el.classList.remove(parallaxClass);
                el.style.backgroundPosition = '';
                if (bgType === 'image' && res.styling.background_repeat === zoomClass && res.styling.background_image) {
                    el.classList.add(zoomClass);
                    Themify.reRun(el, true);
                } else {
                    el.classList.remove(zoomClass);
                    el.style.backgroundSize = '';
                }
            }

        },
        reset(){
            this.styles={};
            searchCache={};
            this._allLoaded=false;
        }
    };
    api.GS.init();
})(tb_app,_CLICK_,ThemifyConstructor);