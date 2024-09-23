(api => {
    "use strict";
    api.Builder=class {
        static items=[];
        #lastRow;
        emptyModules=new Set;
        constructor(el, rows,customCss) {
            const cl=el.classList,
            _this=this,
            fr = createDocumentFragment();
            cl.remove('not_editable_builder');
            cl.add('tb_active_builder','tf_rel');
            _this.id=el.dataset.postid;
            el.id='themify_builder_content-' + _this.id;
            _this.el = el;
            _this.isSaved=false;
            _this.customCss=customCss || '';
            _this.constructor.items.push(_this);
            for (let i = 0; i < rows.length; ++i) {
                fr.appendChild((new api.Row(rows[i])).el);
            }
            if(api.isVisual){
                let css_id='tb_custom_css_'+_this.id,
                    builderCss=doc.tfId(css_id);
                if(builderCss===null){
                    builderCss = createElement('style',{id:css_id});
                    doc.head.appendChild(builderCss);
                }
                builderCss.innerHTML = _this.customCss;
            }
            _this.el.appendChild(fr);
            api.Registry.on(_this, 'tb_init', _this.init);
        }
        init() {
            if (api.isVisual) {
                setTimeout(() => {
                    api.Utils.onResize(true);
                }, 3000);
            }
            this._lastRowBlock();
            setTimeout(() => {
                api.Utils.setColumnsCount(this.el.tfClass('module_column'));
                if (!api.isVisual) {
                    api.GS.init();
                }
                this.newRowAvailable();
                this.insertLayoutButton();
                api.ModulePageBreak.countModules();
                if(this.emptyModules.size>0){
                    TF_Notification.showHide('warning',i18n.empty_modules.replace('%s',Array.from(this.emptyModules).join(', ')),10000);
                }
                this.emptyModules.clear();
            }, 1000);
        }
        static get(index){
            index??= this.items.length-1;
            return this.items[index];
        }
        static backendModeHolder(id){
            return createElement('',{
                class:'themify_builder themify_builder_content-'+id,
                'data-postid':id
            });
        }
        destroy(){
            const _this=this, 
                el=_this.el, 
                cl=el.classList,
                items = el.querySelectorAll('[data-cid]'),
                builderItems=_this.constructor.items,
                builderCss=doc.tfId('tb_custom_css_'+_this.id);
            api.Registry.off(_this);
            _this.emptyModules.clear();
            for (let i = items.length-1; i>-1; --i) {
                api.Registry.get(items[i].dataset.cid)?.destroy(true);
            }
            for(let i=builderItems.length-1;i>-1;--i){
                if(builderItems[i]===_this){
                    builderItems[i]=null;
                    builderItems.splice(i,1);
                    break;
                }
            }
            el.replaceChildren();
            el.removeAttribute('id');
            cl.remove('tb_active_builder','tf_rel');
            cl.add('not_editable_builder');
            builderCss?.remove();
        }
        toJSON(saving) {
            const option_data = [],
                rows = this.el.children,
                checkNotEmpty=cols=>{
                    return cols.length>1 || cols[0].modules?.length>0 || (cols[0].styling && Object.keys(cols[0].styling).length>0);
                };
            for (let i = 0; i < rows.length; ++i) {
                if (rows[i].classList.contains('module_row')) {
                    let data = api.Utils.getRowSettings(rows[i], 'row', saving);
                    if (!saving || (data.styling && Object.keys(data.styling).length>0) || (data.cols && checkNotEmpty(data.cols))) {
                        option_data.push(data);
                    }
                }
            }
            return option_data;
        }
        removeLayoutButton() {
            for (let importBtn = this.el.tfClass('tb_import_layout_button'),i = importBtn.length - 1; i > -1; --i) {
                importBtn[i].remove();
            }
        }
        insertLayoutButton() {
            if (api.isGSPage !== true && this.#lastRow) {
                this.removeLayoutButton();
                const row = this.el.tfClass('module_row');
                if (row.length < 2 && !row[0]?.tfClass('active_module')[0]) {
                    const importBtn = createElement('a','tb_import_layout_button',i18n.text_import_layout_button);
                    importBtn.tfOn(_CLICK_, e => {
                        e.stopPropagation();
                        Themify.triggerEvent(api.ToolBar.el.tfClass('load_layout')[0],e.type);
                    },{passive:true}).href='javascript:;';
                    this.#lastRow.getRootNode().host.before(importBtn);
                }  
            } 
        }
        newRowAvailable(ignore) {
            if (api.isGSPage !== true) {
                const child = this.el.children,
                    len = ignore===true?0:child.length;
                let row;
                if (len !== 0) {
                    for (let i = len - 1; i > -1; --i) {
                        if (child[i].tfClass('active_module')[0]===undefined && child[i].classList.contains('module_row')) {
                            row=api.Registry.get(child[i].dataset.cid);
                            break;
                        }
                    }
                }
                if (!row) {
                    row = new api.Row(api.Utils.grid(1)[0]);
                    api.Utils.setColumnsCount(row.el.tfClass('module_column'));
                    if(this.#lastRow){
                        this.#lastRow.getRootNode().host.before(row.el);
                    }else{
                        this.el.appendChild(row.el);
                    }
                }
                return row;
            }
        }
        _lastRowBlock(){
            if(api.isGSPage !== true && (!this.#lastRow || !this.el.contains(this.#lastRow.getRootNode().host))){
                const root = createElement('',{class:'tb_disable_sorting tf_w tf_hidden',id:'tb_last_row_add_btn'}),
                    tpl=doc.tfId('tmpl-last_row_add_btn');
                    root.attachShadow({
                        mode:'open'
                    }).appendChild(tpl.content.cloneNode(true));
                    this.el.appendChild(root);
                    this.#lastRow = root.shadowRoot.tfId('container');
                    
                Themify.on('tb_toolbar_loaded', ()=>{
                   setTimeout(()=>{
                       
                        const fragment=createDocumentFragment();
                            fragment.append(api.ToolBar.getBaseCss(),api.MainPanel.el.getRootNode().querySelector('#module_drag_grids_style').cloneNode(true));
                            root.shadowRoot.prepend(fragment);
                            root.classList.remove('tf_hidden');
                            setTimeout(()=>{
                                this.#lastRow.appendChild(doc.tfId('tmpl-last_row_expand').content.cloneNode(true));
                            },700);
                            this.#lastRow.tfOn(_CLICK_, function(e) {
                                e.stopPropagation();
                                const target = e.target,
                                    grid = target.closest('.tb_grid'),
                                    cl=this.classList; 
                                if (grid !== null) {
                                    cl.add('hide');
                                    api.MainPanel.newGrid(grid.dataset.slug,false);
                                } 
                                else if (target.closest('.block')) {
                                    const host=this.getRootNode().host;
                                    host.classList.remove('clicked');
                                    cl.add('hide');
                                    api.SmallPanel.show(host);
                                } 
                                else if (target.classList.contains('add_btn')) {
                                    cl.remove('hide');
                                }
                            },{passive:true});
                            
                    },500);

                },true,api.ToolBar?.isLoaded===true);
            }
        }
        async reLoad(json,merge,reset=true) {
            if(merge===true){
                await api.LightBox.save();
            }
            else{
                api.LightBox.close();
            }
            const builder=this.el;
            let data = json.builder_data || json,
                customCss=json.custom_css || '',
                isMainBuilder=!api.isVisual || builder.parentNode.closest('.themify_builder')===null;//is main builder
                data=api.Helper.correctBuilderData(data);
            if(merge===true){
                data= this.toJSON().concat(data);
                customCss=this.customCss+customCss;
            }
            else if(isMainBuilder===true && reset===true){
                api.GS.reset();
            }


            if (json.used_gs !== undefined) {
                //gs data in old versions save as nested array
                for(let i in json.used_gs){
                    let gs=json.used_gs[i];
                    if(gs.data?.[0]){
                        let type=gs.type,
                            st=api.Helper.cloneObject(gs.data),
                            uniqId=api.Helper.generateUniqueID();
                            gs.data=[{
                                element_id:'row'+uniqId
                            }];
                        if(type!=='row' && type!=='subrow'){
                            gs.data[0].cols=[{
                                element_id: 'col'+uniqId
                            }];
                            if(type==='column'){
                                gs.data[0].cols[0].styling=st;
                            }
                            else{
                               gs.data[0].cols[0].modules=[{
                                   mod_name:type,
                                   mod_settings:st
                               }];
                            }
                        }
                        else{
                            gs.data[0].styling=st;
                        }
                    }
                    else{
                        delete json.used_gs[i];
                    }
                }
                api.GS.styles = {...api.GS.styles,...json.used_gs};
            }

            this.destroy();
            const newBuilder = new api.Builder(builder,data,customCss);
            if(reset===true){
                api.undoManager.reset();
            }
            let settings;
            if (isMainBuilder===false) {
                settings = [];
                for (let items = newBuilder.el.querySelectorAll('[data-cid]'),i = items.length-1; i>-1; --i) {
                    settings.push(items[i].dataset.cid);
                }
            }
            else if (api.isVisual) {
                api.liveStylingInstance.reset();
            }
            if (api.isVisual) {
                await api.bootstrap(settings, json.used_gs,false);
                await api.setCss(newBuilder.toJSON());
                await api.correctColumnPaddings();
            }
            api.Registry.trigger(newBuilder,'tb_init');
            api.Utils.runJs(newBuilder.el, null, true);
            api.Spinner.showLoader('done');
        }
        async save() {
			const saveBtnCl=api.ToolBar.el.tfClass('save_wrap')[0].classList;
            try{
                if(saveBtnCl.contains('disabled')){
                    throw 'isWorking';
                }
                saveBtnCl.add('disabled');
                await api.LightBox.save();

                api.Spinner.showLoader();
				const allImages=api.Utils.getAllImages();
                try{//if there is an error don't break builder saving
                    await api.Utils.importThemifyImages(allImages.get('themify'));//upload images and change urls in the settings
                }
                catch(e){
                    
                }
                const id = this.id,
                    data = this.toJSON(true),
                    customCss=this.customCss || '';
                let res,
                    localImages=allImages.get('local');
                    localImages=localImages.size>0?JSON.stringify(Array.from(localImages)):'';
                    await api.GS.setImport(api.GS.styles, null, true);
                let builder=JSON.stringify(data),
                    success=false,
                    ajaxData={
                        sourceEditor: api.isVisual ? 'frontend' : 'backend',
                        action:'tb_save_data',
                        mode:'gzip',
                        custom_css:customCss
                    };
                try{
                    const prms=[api.Helper.gzip(builder)];
                    if(localImages){
                        prms.push(api.Helper.gzip(localImages));
                    }
                    const gzip=await Promise.all(prms);
                    ajaxData.data=gzip[0];
                    if(gzip[1]){
                        ajaxData.images=gzip[1];
                    }
                    res=await api.LocalFetch(ajaxData);
                    if (!res.success) {
                        throw '';
                    }
                    success=true;
                }
                catch(e){
                    
                }
                if(success===false){
                    try{
                        delete ajaxData.mode;
                        ajaxData.data=builder;
                        if(localImages){
                            ajaxData.images=localImages;
                        }
                        builder=null;
                        res=await api.LocalFetch(ajaxData);
                        if (!res.success) {
                            throw res;
                        }
                        success=true;
                    }
                    catch(e){
                        
                    }
                    if(success===false){
                        try{
                            /* new attempt: send the Builder data as binary file to server */
                            ajaxData.data=new Blob( [ ajaxData.data ], { type: 'application/json' });
                            res=await api.LocalFetch(ajaxData);
                            if (!res.success) {
                                throw res;
                            }
                        }
                        finally{
                        }
                    }
                }
                res=res.data;
                const savedCss=await api.Utils.saveCss(data, customCss, id);
                res.css_file=savedCss.css_file;
                api.Spinner.showLoader('done');
                Themify.trigger('themify_builder_save_data', res);
                this.isSaved=true;
                return res;
            }
            catch(e){
                await Promise.all([api.Spinner.showLoader('error'),TF_Notification.showHide('error',e.status===403?i18n.errorSave403:i18n.errorSaveBuilder,5000)]);
                throw e;
            }
			finally{
                saveBtnCl.remove('disabled');
			}
        }
    };

})(tb_app);