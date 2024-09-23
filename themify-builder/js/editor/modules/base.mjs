(api=> {
    "use strict";
    const Clipboard={
       _key: 'tb_clipboard',
       async _set(type, content) {
            const data = JSON.stringify({
               [type]:content
            });
            try{
                await navigator.clipboard.writeText(data);
            }
            catch(e){
            }
            localStorage.setItem(this._key, data);//always save for local site,because we don't know on what site user will paste,otherwise on paste will ask the permission even if the site is the same
       },
       async _get(type) {
            let res;
            try{
                res=await navigator.clipboard.readText();
			}
			catch(e){
			   res=localStorage.getItem(this._key);
			}
            if(res){
                res=JSON.parse(res);
            }
            return res?.[type] || false;
       }
    };
    api.Base=class  {
        constructor(fields) {
            if(fields?.locked===true){
                this.locked=true;
            }
            this.fields = {...this.defaults(), ...fields};
        }
        initialize(){
            const _this=this;
            _this.fields.element_id??=api.Helper.generateUniqueID();
            _this.id = _this.fields.element_id;
            _this.el = createElement();
            if (_this.type !== 'module') {
                _this.el.appendChild(doc.tfId('tmpl-builder_' + _this.type + '_item').content.cloneNode(true));
            }
            _this.setHtmlAttributes();
            api.Registry.add(_this);
        }
        static getOptions(slug) {
            return [
                {
                    id: 'custom_css_'+slug,
                    type: 'custom_css'
                },
                {
                    type: 'clickable'
                }
            ];
        }
        async setData(data,dymmy) {
            api.Helper.clearElementId([data],true);
            const model=this.type==='module'?api.Module.initModule(data):new (api.Module.getModuleClassName(this.get('mod_name')))(data,this.isSubCol);
            dymmy.replaceWith(model.el);
            if (api.isVisual) {
                return model.reCreate();
            } 
            api.Utils.runJs(model.el);
        }
        get(id) {
            const _this=this, 
                {type,fields}=_this,
                mainId=type === 'module' ? 'mod_settings' : 'styling';
            if (id === 'element_id') {
                return _this.id;
            } 
            if (id === 'mod_name') {
                return type === 'module' ? fields[id] : type;
            } 
            if (id === 'sizes' || id === 'cols' || id === 'modules' || id === 'mod_settings' || id === 'styling') {
                return id === 'sizes' || id === 'cols'|| id === 'modules'?fields[id]:fields[mainId];
            } 
            if(_this.defaults()[id]!==undefined){
                return fields[id];
            }
            if(type==='row' || type==='subrow' || (type==='column' && (id==='grid_class' || id==='grid_width'))){//backward
                if(id==='grid_class' || id==='grid_width' || id === 'gutter' || id === 'column_alignment' || id === 'column_h' || id === 'desktop_dir' || id === 'tablet_landscape_dir' || id==='tablet_dir' || id==='mobile_dir'   || id==='col_tablet_landscape' || id==='col_tablet' || id==='col_mobile'){
                    return fields[id];
                }
            }
            return fields[mainId][id];
        }
        set(id, value) {
            const _this=this,
                mainId=_this.type === 'module' ? 'mod_settings' : 'styling',
                fields=_this.fields;
            if(id === 'cols' || id === 'modules' || id==='sizes' || id === 'mod_settings' || id === 'styling' || id === 'element_id'){
                if(id!=='sizes' && id !== 'cols' && id !== 'modules'){
                    if(id === 'element_id'){
                        _this.id = value;
                    }
                    else{
                        id=mainId;
                    }
                }
                fields[id] = value;
            }
            else if(_this.defaults()[id]!==undefined){
                fields[id] = value;
            }
            else{
                fields[mainId][id] = value;
            }
            return _this;
        }
        unset(id) {
            if (id === 'mod_settings' || id === 'styling') {
                id = this.type === 'module' ? 'mod_settings' : 'styling';
            }
            delete this.fields[id];
            return this;
        }
        destroy(){
            api.Registry.remove(this.id);
        }
        setHtmlAttributes() {
            const attr = this.attributes();
            attr['data-cid'] = this.id;
            attr.draggable = true;
            for (let i in attr) {
                this.el.setAttribute(i, attr[i]);
            }
        }
        getData() {
            let data={},
                type=this.type;
            //module can be tab or acc which they contains others modules, that is why we can't just copy the module settings,we need to call _getRowSettings
            if(type==='column' || type==='module'){
                const selectedRow = this.el.closest('.active_subrow,.module_row' ),
                    rowData = api.Utils.getRowSettings(selectedRow, (selectedRow.classList.contains('active_subrow') ? 'subrow' : 'row'));
                main:for(let cols=rowData.cols,i=cols.length-1;i>-1;--i){
                    let col=cols[i];
                    if(type==='module'){
                        if(col.modules){
                            for(let j=col.modules.length-1;j>-1;--j){
                                if(col.modules[j].element_id===this.id){
                                    data = col.modules[j];
                                    break main;
                                }
                            }
                        }
                    }
                    else if(col.element_id===this.id){
                        data = col;
                        break;
                    }
                }
            }
            else{
                data = api.Utils.getRowSettings(this.el, type);
            }
            return data;
        }
        fixSafariSrcSet(){
            if (api.isSafari === true && api.isVisual) {
                const img = this.el.querySelectorAll('img[srcset]');
                for(let i=img.length-1;i>-1;--i){// Fix Srcset in safari browser
                     img[i].outerHTML = img[i].outerHTML;
                }
            }  
        }
        visibilityLabel() {
            if(this.type!=='column'){
                const _this=this,
                    styling = _this.id === api.activeModel?.id && ThemifyConstructor.clicked === 'visibility' ? api.Forms.serialize('tb_options_visibility') : _this.get('mod_settings');
                if (styling) {
                    const el=_this.type==='subrow'?_this.el.tfClass('module_subrow')[0]:_this.el, 
                        label = el.querySelector(':scope>.tb_visibility_hint'),
                        visiblityVars = {
                            visibility_desktop: i18n.de,
                            visibility_mobile: i18n.mo,
                            visibility_tablet: i18n.ta,
                            visibility_tablet_landscape: i18n.table_landscape,
                            sticky_visibility: i18n.s_v
                        };
                    if (label !== null) {
                        let txt = '';
                        if ('hide_all' === styling.visibility_all) {
                            txt = i18n.h_a;
                        } 
                        else {
                            let prefix;
                            for (let i in visiblityVars) {
                                prefix = '' === txt ? '' : ', ';
                                txt += 'hide' === styling[i] ? prefix + visiblityVars[i] : '';
                            }
                        }
                        if (txt !== '') {
                            if(label.tfTag('svg')[0]===undefined){
                                label.appendChild(api.Helper.getIcon('ti-eye'));
                            }
                            let t = label.tfTag('span')[0];
                            if (t === undefined) {
                                label.appendChild(createElement('span','',txt));
                            }else{
                                t.textContent = txt;
                            }
                            label.classList.add('tb_has_visiblity');
                        } else {
                            label.classList.remove('tb_has_visiblity');
                        }
                    }
                }
            }
        }
        setBreadCrumbs(el) {
            if(api.isGSPage!==true){
                el=el.tfClass('tb_action_breadcrumb')[0];
                if(el!==undefined){
                    el.replaceChildren();
                    if(this.el.isConnected && this.type!=='row'){
                        if(api.LightBox.el.contains(el)){
                            el.tfOn(_CLICK_,e=>{
                                const id=e.target.dataset.id;
                                if(id){
                                    e.preventDefault();
                                    e.stopPropagation();
                                    api.Registry.get(id)?.edit();
                                }
                            });
                        }
                        el.appendChild(this.getBreadCrumbs());
                    }
                }
            }
        }
        getBreadCrumbs() {
            const path=[this.id],
                builder=api.Builder.get().el,
                f = createDocumentFragment();
            if(api.isGSPage!==true){
                let parent=this.el;
                while(true){
                    parent = parent.parentNode.closest('[data-cid]');
                    if(!parent || !builder.contains(parent)){
                        break;
                    }
                    path.push(parent.dataset.cid);
                }
                for(let i=path.length-1;i>-1;--i){
                    let model = api.Registry.get(path[i]);
                    if(model.locked!==true){
                        let type = model.get('mod_name'),
                            item = createElement('span','tb_bread tb_bread_' + type+' tf_inline_b tf_box tf_rel',model.isSubCol===true?'Sub-Column': type);
                            if (this.id === path[i]) {
                                item.className += ' tb_active_bc';
                            }
                            item.dataset.id=path[i];
                            f.appendChild(item);
                    }
                }
            }
            return f;
        }
        async duplicate(isMultiple) {
            if(api.activeModel && this.el.contains(api.activeModel.el)){
                await api.LightBox.save();
            }
            if(isMultiple!==true){
                api.undoManager.start('duplicate',this.id);
            }
            const data=this.getData(),
                dummy=createElement();

            this.el.after(dummy);
            await this.setData(data,dummy);
            api.ModulePageBreak.countModules();
            if(isMultiple!==true){
                api.undoManager.end('duplicate');
            }
        }
        async delete(isMultiple) {
            const activeModel=api.activeModel,
                isSame=activeModel===this;
            if (!isSame && activeModel && this.el.contains(activeModel.el)) {
                await api.LightBox.save();
            }
            if(isMultiple!==true && !activeModel?.is_new){
                api.undoManager.start('delete',this.id);
            }
            if (this.type === 'column') {
                await api.Drop.column(this.el);
            }
            else if(this.type==='subrow'){
                const parent=this.el.parentNode, 
                    parentCl=parent.classList;
                if(parent.childElementCount===1 && (parentCl.contains('tab-content') || parentCl.contains('accordion-content') || parentCl.contains('tb_toggle_1') || parentCl.contains('tb_toggle_2') )){
                    const dummy=createElement();
                    parent.prepend(dummy);
                    api.Drop.row(dummy,'grid',1,false);
                }
            }
            this.destroy();
            api.ModulePageBreak.countModules();
            if(isMultiple!==true&& !activeModel?.is_new){
               api.undoManager.end('delete');
            }
            if(isSame){
                api.LightBox.close();
            }
        }
        async copy() {
            if (api.activeModel && this.el.contains(api.activeModel.el)) {
                await api.LightBox.save();
            }
            const data = this.getData();
            // Attach used GS to data
            if (Object.keys(api.GS.styles).length) {
                const usedGS = api.GS.findUsedItems(data);
                if (usedGS?.length) {
                    data.attached_gs = usedGS;
                }
            }
            api.Helper.clearElementId([data]);
            Clipboard._set(this.type, data);
            api.ActionBar.clear();
        }
        paste(is_style,isMultiple) {
            return new Promise(async(resolve,reject)=>{
                await api.LightBox.save();
                let component = this.get('mod_name'),
                    data = await Clipboard._get(this.type);
                if (data === false || (is_style && this.type==='module' && component!==data.mod_name)) {
                    TF_Notification.showHide('error',i18n.text_alert_wrong_paste);
                    reject();
                    return;
                }
                if (is_style === true) {
                    const stOptions = ThemifyStyles.getStyleOptions(component),
                        k =  this.type === 'module' ? 'mod_settings' : 'styling',
                        res = this.getData(),
                        checkIsStyle = i=> {
                            let key = i.includes('_color') ? 'color' : (i.includes('_style') ? 'style' : false),
                                type=stOptions[key]?.type;
                            if (type === 'radio' || i.includes('breakpoint_')  || i.includes('_apply_all') ) {
                                return true;
                            }
                            if (key !== false) {
                                key = i.replace('_' + key, '_width');
                                if (type=== 'border') {
                                    return true;
                                }
                            } 
                            else if (i.includes('_unit')) { //unit
                                key = i.replace(/_unit$/ig, '', '');
                                if (stOptions[key] !== undefined) {
                                    return true;
                                }
                            } 
                            else if (i.includes('_w') ) { //weight
                                key = i.replace(/_w$/ig, '', '');
                                if (type === 'font_select') {
                                    return true;
                                }
                            }
                            return false;
                        };
                    res[k]??= {};
                    for (let i in data[k]) {
                        if (stOptions[i] === undefined && !checkIsStyle(i)) {
                            delete data[k][i];
                        } else {
                            res[k][i] = data[k][i];
                            if (stOptions[i] !== undefined) {
                                if (stOptions[i].isFontColor === true && data[k][stOptions[i].g + '-gradient'] !== undefined) {
                                    res[k][stOptions[i].g + '-gradient'] = data[k][stOptions[i].g + '-gradient'];
                                } else {
                                    if (stOptions[i].posId !== undefined && data[k][stOptions[i].posId] !== undefined) {
                                        res[k][stOptions[i].posId] = data[k][stOptions[i].posId];
                                    }
                                    if (stOptions[i].repeatId !== undefined && data[k][stOptions[i].repeatId] !== undefined) {
                                        res[k][stOptions[i].repeatId] = data[k][stOptions[i].repeatId];
                                    }
                                }
                            }
                        }
                    }
                    if (data.used_gs !== undefined) {
                        res.used_gs = data.used_gs;
                    }
                    data = res;
                    delete data.element_id;
                }
                if(isMultiple!==true){
                    api.undoManager.start('paste',this.id);
                }
                this.setData(data,this.el);
                api.ModulePageBreak.countModules();
                resolve();
                if(isMultiple!==true){
                    api.undoManager.end('paste');
                }
            });
        }
        async save(box) {
            await api.LightBox.save();
                box??= this.el.querySelector('.tb_' + this.type + '_action').getBoundingClientRect();
            api.LightBox.el.classList.add('tb_save_module_lightbox');
            const options = {
                contructor: true,
                loadMethod: 'html',
                save: {
                    done: 'save'
                },
                data: {
                    ['s' + this.type]: {
                        options: [{
                                id: 'item_title_field',
                                type: 'text',
                                label: 'title'
                            }, {
                                id: 'item_layout_save',
                                type: 'checkbox',
                                label: '',
                                options: [{
                                        name: 'layout_part',
                                        value: 'slayout_part'
                                    }],
                                after: '',
                                help: 'Any changes made to a Layout Part are saved and reflected everywhere else they are being used (<a href="https://themify.me/docs/builder#layout-parts" target="_blank">learn more</a>)'
                            }]
                    }
                }
            },
            lb = await api.LightBox.setStandAlone(box.left, box.top).open(options),
            saveAsLibraryItem = async e => {
                e.stopPropagation();
                if ('keydown' !== e.type) {
                    e.preventDefault();
                } 
                else if (e.code !== 'Enter') {
                    return;
                }

                api.Spinner.showLoader('show');
                let settings,
                type=this.type;
                if(type==='row'){
                    settings = api.Utils.getRowSettings(this.el, this.type,true);
                    api.Helper.clearElementId([settings], true);
                }
                else if(type==='module'){
                    const data=api.Helper.cloneObject(this.get('mod_settings'));
                    this.constructor.builderSave(data);
                    settings = {
                        mod_name: this.get('mod_name'),
                        element_id: api.Helper.generateUniqueID(),
                        mod_settings: data
                    };
                }
                const form = api.Forms.serialize(lb),
                        used_gs = api.GS.findUsedItems(settings),
                        is_layout = form.item_layout_save,
                        ajaxData = {
                            action: 'tb_save_custom_item',
                            item_title_field: form.item_title_field,
                            item: JSON.stringify(settings),
                            type: type
                        };
                if (is_layout) {
                    ajaxData.item_layout_save = 1;
                }
                if (used_gs !== false) {
                    ajaxData.usedGS = used_gs;
                }
                try {
                    const data = await api.LocalFetch(ajaxData);
                    if (data.status === 'success') {
                        if (is_layout) {
                            await api.Utils.saveCss([settings], '', data.id);
                        }
                        delete data.status;
                        api.MainPanel.el.tfClass('panel_search')[0].value = '';
                        if (is_layout) {
                            const args = {
                                mod_name: 'layout-part',
                                mod_settings: {
                                    selected_layout_part: data.post_name
                                }
                            };
                            
                            if (ThemifyConstructor.layoutPart.data.length > 0) {
                                ThemifyConstructor.layoutPart.data.push(data);
                            }

                            let model,
                                el;
                            if (type=== 'row') {
                                const row = new api.Row({
                                    cols: [{
                                            grid_class: 'col-full',
                                            element_id: api.Helper.generateUniqueID(),
                                            modules: [args]
                                        }]
                                });
                                el = row.el;
                                model = api.Registry.get(el.tfClass('active_module')[0].dataset.cid);
                            } else {
                                model = api.Module.initModule(args);
                                el = model.el;
                            }

                            this.el.replaceWith(el);
                            if (api.isVisual) {
                                model.previewReload( model.get('mod_settings'));
                            }
                        }
                        if (api.Library) {
                            let libraryItems = [api.MainPanel.el, api.SmallPanel.el],
                                    fr = api.Library.create([data]);
                            for (let i = libraryItems.length - 1; i > -1; --i) {
                                let libItem = libraryItems[i].tfClass('library_container')[0];
                                if (libItem) {
                                    let selectedTab = libItem.closest('.panel_tab').querySelector('.library_tab .current');
                                    libItem.appendChild(fr.cloneNode(true));
                                    if (selectedTab) {
                                        Themify.triggerEvent(selectedTab, _CLICK_);
                                    }
                                }
                            }
                        }
                        api.Spinner.showLoader('done');
                        api.LightBox.close();
                    } 
                    else {
                        api.LiteLightBox.alert(data.msg);
                    }
                } 
                catch (e) {
                    api.Spinner.showLoader('error');
                }
            },
            saveBtn = lb.tfClass('builder_save_button')[0],
            titleInput = lb.tfTag('input')[0];
            saveBtn.tfOn(_CLICK_, saveAsLibraryItem);
            titleInput.tfOn('keydown', saveAsLibraryItem, {passive: true});

            Themify.on('themify_builder_lightbox_close', () => {
                lb.classList.remove('tb_save_module_lightbox');
                saveBtn.tfOff(_CLICK_, saveAsLibraryItem);
                titleInput.tfOff('keydown', saveAsLibraryItem, {passive: true});
            }, true);
        }
        import() {
            return new Promise(async(resolve,reject)=>{
                await api.LightBox.save();
                const box=this.el.querySelector('.tb_'+this.type+'_action').getBoundingClientRect(),
                    component = this.isSubCol===true?'SubColumn':this.get('mod_name'),
                    name = component.charAt(0).toUpperCase() + component.slice(1),
                    label = this.type === 'subrow' ? 'Sub-Row' : (this.isSubCol===true? 'Sub-Column' : name),
                    options = {
                        contructor: true,
                        loadMethod: 'html',
                        data: {
                            component_form: {
                                name: i18n.import_tab.replace('%s', name),
                                options: [{
                                    id: 'tb_data_field',
                                    type: 'textarea',
                                    label: i18n.import_label.replace('%s', label),
                                    help: i18n.import_data.replace('%s', name),
                                    class: 'fullwidth',
                                    rows: 13
                                }]
                            }
                        }
                    };

                api.LightBox.el.classList.add('tb_import_export_lightbox');
                const lb=await api.LightBox.setStandAlone(box.left, box.top).open(options),
                    click=async e=> {
                        e.preventDefault();
                        e.stopPropagation();
                        const val = lb.querySelector('#tb_data_field').value;
                        if (val === '') {
                            resolve();
                            api.LightBox.close();
                            return;
                        }
                        let res = JSON.parse(val);
                        if (res.component_name !== this.type) {
                            TF_Notification.showHide('error',i18n.text_alert_wrong_paste);
                            reject();
                            return;
                        }
                        api.undoManager.start('import',this.id);
                        if (res.used_gs !== undefined) {
                            res=await api.GS.setImport(res.used_gs, res);
                        } 
                        delete res.component_name;
                        await this.setData(api.Base.builderSave(res,'empty'),this.el);
                        api.ModulePageBreak.countModules();
                        api.LightBox.close();
                        api.undoManager.end('import');
                    },
                    savBtn=lb.tfClass('builder_save_button')[0];
                    savBtn.tfOn(_CLICK_,click);

                    Themify.on('themify_builder_lightbox_close', lb => {
                        lb.classList.remove('tb_import_export_lightbox');
                        savBtn.tfOff(_CLICK_,click);
                        resolve();
                    }, true);
            });
        }
        async export(){
            await api.LightBox.save();
            const box=this.el.querySelector('.tb_'+this.type+'_action').getBoundingClientRect(),
                component = this.isSubCol===true?'SubColumn':this.get('mod_name'),
                name = component.charAt(0).toUpperCase() + component.slice(1),
                label = this.type === 'subrow' ? 'Sub-Row' : (this.isSubCol===true? 'Sub-Column' : name),
                options = {
                    contructor: true,
                    loadMethod: 'html',
                    save:false,
                    data: {
                        component_form: {
                            name: i18n.export_tab.replace('%s', name),
                            options: [{
                                id: 'tb_data_field',
                                type: 'textarea',
                                label: i18n.import_label.replace('%s', label),
                                help: i18n.export_data.replace('%s', name),
                                class: 'fullwidth',
                                rows: 13,
                                readonly:true
                            }]
                        }
                    }
                };
            api.LightBox.el.classList.add('tb_import_export_lightbox');
            const lb=await api.LightBox.setStandAlone(box.left, box.top).open(options),
                    data = this.getData(),
                    used_gs = api.GS.findUsedItems(data),
                    input = lb.querySelector('#tb_data_field'),
                    selectText=function(e) {
                        e.stopImmediatePropagation();
                        this.select();
                    };
                    data.component_name = this.type;
                if (used_gs !== false) {
                    const gsData = {};
                    for (let i = used_gs.length - 1; i > -1; --i) {
                        let gsPost = api.GS.styles[used_gs[i]],
                            styles = api.Helper.cloneObject(gsPost.data[0]);
                        if ('row' === gsPost.type || 'subrow' === gsPost.type) {
                            styles = styles.styling;
                        } else if (styles.cols !== undefined) {
                            styles = styles.cols[0];
                            if (styles) {
                                if ('column' === gsPost.type) {
                                    styles = styles.styling;
                                } else {
                                    styles = styles.modules?.[0].mod_settings || undefined;
                                }
                            }
                        } 
                        else {
                            styles = undefined;
                        }
                        if (styles !== undefined && Object.keys(styles).length > 0) {
                            gsData[used_gs[i]] = {
                                title: gsPost.title,
                                type: gsPost.type,
                                data: api.Base.builderSave(styles,'empty')
                            };
                        }
                    }
                    if (Object.keys(gsData).length) {
                        data.used_gs = gsData;
                    }
                }

                input.tfOn(_CLICK_, selectText,{passive:true})
                .value=JSON.stringify(data);

                Themify.on('themify_builder_lightbox_close', lb => {
                    lb.classList.remove('tb_import_export_lightbox');
                    input.tfOff(_CLICK_, selectText,{passive:true});
                }, true);
        }
        async edit(type) {
            if (api.isPreview || this.isEmpty===true) {
                throw '';
            }
            const _this=this,
                slug = _this.get('mod_name'),
                isBuilderEdit=type==='editBuilder' && api.isVisual,
                lb=api.LightBox,
                lbEl=lb.el;
            _this.tab=type==='edit' || type==='swap' || !type?'setting':type;
            if (api.activeModel !== null) {
                if (isBuilderEdit===false && api.activeModel.id === _this.id) {
                    if(type){
                        const clicked = lbEl.querySelector('a[data-id="tb_options_'+_this.tab+'"]');
                        if(clicked){
                            Themify.triggerEvent(clicked,_CLICK_);
                        }
                        delete _this.tab;
                        lbEl.focus();
                    }
                    return lbEl;
                } 
                else {
                    await lb.save();
                }
                api.ActionBar.clearClicked();
            }
            if(isBuilderEdit===true){
                _this.editLayoutPart();
            }
            else{
                _this.setBreadCrumbs(lbEl);
                const  el=_this.el,
                data={//keep order 
                    setting:{
                        options:_this.constructor.getOptions(slug),
                        name:_this.constructor.getSettingsName(slug)
                    },
                    styling:{
                        options:api.styleData[slug]
                    },
                    visibility:_this.constructor.getVisibility?.()?? true,
                    animation:_this.constructor.getAnimation?.()??true
                };
                if ( this.constructor.enableTooltip?.() !== false ) {
                    data.setting.options.push({
                        type:'tooltip'
                    });
                }
				Themify.trigger( 'tb_edit_component', {
					data : data,
					slug : slug
				} );
                await lb.open(data,_this);
                lbEl.focus();
                el.classList.add('tb_current_module');
                setTimeout(()=>{
                    if(el){
                        el.classList.add('tb_outline_anim');
                        setTimeout(()=>{
                            el?.classList.remove('tb_current_module','tb_outline_anim'); 
                        },310);
                    }
                },2700);
            }
            delete _this.tab;
            return lbEl;
        }
        async restore(){
            const _this=this,
                {el,type}=_this,
                attr=el.attributes;
            while (attr.length > 0) {
                el.removeAttribute(attr[0].name);
            }
            _this.setHtmlAttributes();
            if(api.isVisual){
                const oldState=api.undoManager.getState('saveLightbox');
                if(oldState){
                    const diff = api.undoManager.getDiff('saveLightbox',oldState,api.undoManager.getCurrentState('saveLightbox'));
                    api.undoManager.clear('saveLightbox');
                    api.ActionBar.clear();
                    if(diff.styles){
                        api.undoManager.styleChanges(diff.styles,'old',!diff.html);
                    }
                    if(type==='module'){
                        await _this.visualPreview(api.restoreVals);
                    }else{
                        await api.bootstrap([_this.id],undefined,false);
                        if(api.isVisual){
                            api.Utils.runJs(el, type);
                        }
                    }
                    
                }
            }else if(type==='module'){
                _this.backendLivePreview(api.restoreVals);
            }
        }
        options(input,type) {
            let handler,
              interval,
              focusOut;
            const event = input.tagName === 'INPUT' && 'hide_anchor' !== type ? 'keyup' : 'change',
              onChange=(input,value,ev)=>{
                  const id=input.closest('.tb_lb_option').id;
                  if(api.activeModel?.id===this.id){
                      if(!api.LightBox.el.contains(input)){
                          const lightboxInput=api.LightBox.el.querySelector('#'+id);
                          if(lightboxInput){
                              const type=lightboxInput.closest('[data-type]').dataset.type;
                              if(type==='layout'){
                                for(let items=lightboxInput.children,i=items.length-1;i>-1;--i){
                                    items[i].classList.toggle('selected',items[i].id===value);
                                }
                                if(!value){
                                    lightboxInput.children[0].classList.add('selected');
                                }
                              }
                              else if (type === 'checkbox'){
                                lightboxInput.tfClass('tb_checkbox')[0].checked=!!value;
                              }
                              else{
                                lightboxInput.value=value;
                              }
                          }
                      }
                  }
                  else if(this.type==='row' && ev==='change' && !input.parentNode.tfClass('tb_field_error_msg')[0] && api.undoManager.has('rowOptions')){

                      this.set(id,value);
                      api.undoManager.end('rowOptions');

                  }
              };
            if(type==='custom_css_id'){
                handler = e=> {
                    const _this=e.currentTarget,
                      id=_this.id,
                      lightboxInput=api.activeModel?.id===this.id?api.LightBox.el.querySelector('#'+id):null,
                      error2=lightboxInput?.parentNode.tfClass('tb_field_error_msg')[0],
                      error1=_this.parentNode.tfClass('tb_field_error_msg')[0],
                      idText=this.el.tfClass('tb_row_id')[0],
                      validate=api.Forms.getValidator('custom_css_id')(_this,this.el),
                      v=_this.value;
                    if(lightboxInput){
                        lightboxInput.value=v;
                    }
                    if(validate===true){
                        error1?.remove();
                        error2?.remove();
                        lightboxInput?.classList.remove('tb_field_error');
                        if(this.type==='row' && api.activeModel?.id!==this.id && !api.undoManager.has('rowOptions')){
                            api.undoManager.start('rowOptions',this);
                        }
                        this.el.id=v;
                        idText.textContent=v;
                        return v;
                    }
                    this.el.removeAttribute('id');
                    idText.textContent=this.get(id);
                    const errorText=validate===false?i18n.errorId:validate;
                    if (!error1) {
                        const er = createElement('span','tb_field_error_msg',errorText);
                        _this.after(er);
                        if(lightboxInput && !error2 && !api.LightBox.el.contains(_this)){
                            lightboxInput.classList.add('tb_field_error');
                            lightboxInput.after(er.cloneNode(true));
                        }
                    }
                    else{
                        error1.textContent=errorText;
                        if(error2){
                            error2.textContent=errorText;
                        }
                    }
                    return false;

                };
            }
            else if(type==='custom_css'){
                let prev=input.value;
                handler =  e=> {
                    api.Forms.getValidator('custom_css')(e.currentTarget);
                    const v=e.currentTarget.value.trim();
                    if(this.type==='row' && api.activeModel?.id!==this.id && !api.undoManager.has('rowOptions')){
                        api.undoManager.start('rowOptions',this);
                    }
                    if (v && api.isVisual) {
                        const el =this.type==='module'?this.el.tfClass('module')[0]:(this.type==='subrow'?this.el.tfClass('module_subrow')[0]:this.el),
                            cl=el.classList,
                          vCl=v.split(' ');
                        if(prev){
                            const prevCl=prev.split(' ');
                            for(let i=prevCl.length-1;i>-1;--i){
                                prevCl[i]=prevCl[i].trim();
                                if(prevCl[i]){
                                    cl.remove(prevCl[i]);
                                }
                            }
                        }
                        for(let i=0;i<vCl.length;++i){
                            vCl[i]=vCl[i].trim();
                            if(vCl[i]){
                                cl.add(vCl[i]);
                            }
                        }
                        prev=v;
                    }
                    return v;
                };
            }
            else if(type==='layout'){
                handler = e=> {
                    if(this.type==='row' && api.activeModel?.id!==this.id){
                        api.undoManager.start('rowOptions',this);
                    }
                    const layout=e.currentTarget.closest('.tb_lb_option'),
                      v=layout.tfClass('selected')[0].id,
                      id=layout.id;
                    if (api.isVisual) {
                        api.liveStylingInstance.bindRowWidthHeight(id, v, this.el);
                    }
                    else{
                        const cl=this.el.classList;
                        if (id === 'row_height') {
                            cl.toggle('fullheight',v === 'fullheight');
                        }
                        else {
                            cl.remove('fullwidth','fullwidth_row_container');
                            if (v === 'fullwidth') {
                                cl.add('fullwidth_row_container');
                            }
                            else if (v === 'fullwidth-content') {
                                cl.add('fullwidth');
                            }
                        }
                    }
                    return v;
                };
            }
            else if(type==='row_anchor'){
                handler = e=> {
                    if(this.type==='row' && api.activeModel?.id!==this.id && !api.undoManager.has('rowOptions')){
                        api.undoManager.start('rowOptions',this);
                    }
                    api.Forms.getValidator('row_anchor')(e.currentTarget);
                    const v=e.currentTarget.value,
                    el=this.el;
                    if (api.isVisual) {
                        const cl=el.classList,
                          prev=el.dataset.anchor;
                        if(prev){
                            cl.remove('tb_section-'+prev,'tb_has_section');
                        }
                        if (v !== '') {
                            cl.add('tb_section-'+v,'tb_has_section');
                            el.dataset.anchor=v;
                        }
                        else{
                            el.removeAttribute('data-anchor');
                        }
                    }
                    el.tfClass('tb_row_anchor')[0].textContent=v;
                    return v;
                };
            }
            else if(type==='hide_anchor'){
                handler = e=> {
                    if(this.type==='row' && api.activeModel?.id!==this.id){
                        api.undoManager.start('rowOptions',this);
                    }
                    const target=e.currentTarget,
                      v=target.checked?target.value:null;
                    if (api.isVisual) {
                        this.el.toggleAttribute('data-hide-anchor', v==='1');
                    }
                    return v;
                };
            }
            input.tfOn(event,e=>{
                const v=handler(e);
                if(v!==false){
                    let target=e.currentTarget;
                    onChange(target,v,e.type);
                    if(e.type==='keyup'){
                        if(!focusOut){
                            focusOut=()=>{
                                if(target) {
                                    target.tfOff('focusout',focusOut,{passive:true,once:true});
                                    clearInterval(interval);
                                    onChange(target, target.value, 'change');
                                    api.undoManager.clear('rowOptions');
                                    interval=target =focusOut=null;
                                }
                            };
                            target.tfOn('focusout',focusOut,{passive:true,once:true});
                        }
                        interval=setInterval(()=>{//workaround for firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=559561
                            if(target && !target.isConnected){
                                clearInterval(interval);
                                interval=null;
                                focusOut?.();
                            }
                        },1000);
                    }
                }
            },{passive:true});
            if(!api.isVisual && event==='keyup'){
                input.tfOn('keydown focusin focusout copy paste',e=>{//disable guttenberg events
                    e.stopPropagation();
                },{passive:true});
            }
        }
        static getStylingValue(id,bp,settings){
            let v;
            if (bp === 'desktop') {
                if(settings[id] !== undefined && settings[id] !== ''){
                    v=settings[id];
                }
            }
            else if (settings['breakpoint_' + bp]?.[id] !== undefined && settings['breakpoint_' + bp][id] !== '') {
                v =settings['breakpoint_' + bp][id];
            }
            else{
                const points = api.breakpointsReverse;
                for (let i = points.indexOf(bp) + 1; i < points.length; ++i) {
                    if (points[i] !== 'desktop') {
                        if (settings['breakpoint_' + points[i]]?.[id] !== undefined && settings['breakpoint_' + points[i]][id] !== '') {
                            v=settings['breakpoint_' + points[i]][id];
                            break;
                        }
                    }
                    else if (settings[id] !== undefined && settings[id] !== '') {
                        v=settings[id];
                        break;
                    }
                }
            }
            return v;
        }
        static clearDuplicatStyles(settings){
            const bps = api.breakpointsReverse,
                knownUnits=['font_size','line_height','letter_spacing','f_s_h','font_size_module_title','line_height_module_title','f_s_m_t_h','font_size_title','line_height_title','letter_spacing_title','f_s_t_h'];
            for(let i=0,len=bps.length;i<len-1;++i){
                let bpVals=settings['breakpoint_'+bps[i]];
                if(bpVals){
                    let parents=[];
                    for(let j=i+1;j<len;++j){
                        let v=bps[j]==='desktop'?settings:settings['breakpoint_'+bps[j]];
                        if(v){
                            parents.push(v);
                        }
                    }
                    if(parents.length>0){
                        for(let k in bpVals){
                            let v=bpVals[k];
                            if( v==='' || v==='false' || v===undefined || v===null){
                                delete bpVals[k];
                            }
                            else{
                                let isNumber=typeof v==='string'?!isNaN(v):typeof v==='number',
                                    found=false;
                                if(isNumber){
                                    let v2=parseFloat(v);
                                    if(v2!==null && !isNaN(v2) && isFinite(v2)){
                                        bpVals[k]=v=v2;
                                    }else{
                                        isNumber=false;
                                    }
                                }
                                for(let j=0;j<parents.length;++j){
                                    if(parents[j][k]!==undefined){
                                        if(parents[j][k]===v || (isNumber && v===parseFloat(parents[j][k]))){
                                            delete bpVals[k];
                                        }
                                        found=true;
                                        break;
                                    }
                                }
                                if(found===false && parents.length===1 && (v===false || (v===180 && k.includes('-gradient-angle')) || (v==='linear' && k.includes('-gradient-type')))){
                                    delete bpVals[k];
                                }
                            }
                        } 
                    }
                    this.clearUnits(knownUnits,bps[i],settings);
                    if(Object.keys(bpVals).length===0){
                        delete settings['breakpoint_'+bps[i]];
                    }
                }
            }
        }
        static clearUnits(keys,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined){
                for(let i=keys.length-1;i>-1;--i){
                    let unitKey=keys[i]+'_unit';
                    if(stVals(keys[i],bp,settings)===undefined){
                        delete current[keys[i]];
                        delete current[unitKey];
                    }
                    else if(bp==='desktop' && stVals(unitKey,bp,settings)==='px'){
                        delete current[unitKey];
                    }
                }
            }
        }
        static clearFontWeights(keys,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined){
                for(let i=keys.length-1;i>-1;--i){
                    if(stVals(keys[i],bp,settings)===undefined){
                        delete current[keys[i]];
                        delete current[keys[i]+'_w'];
                    }
                }
            }
        }
        static clearImageGradient(id,colorId,repeatId,posId,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined){
                const type=stVals(id+'-type',bp,settings) || 'image',
                    gid=id+'-gradient';
                if(type==='image'){
                    delete current[gid];
                    this.clearGradient(id,bp,settings);
                    if(stVals(id,bp,settings)===undefined){
                        delete current[repeatId];
                        delete current[posId];
                    }
                }
                else{
                    delete current[id];
                    delete current[colorId];
                    delete current[repeatId];
                    delete current[posId];
                }
                if(stVals(id,bp,settings)===undefined && stVals(gid,bp,settings)===undefined){
                    delete current[id+'-type'];
                }
            }
        }
        static clearFontColor(id,solidId,gradientId,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined){
                const type=stVals(id,bp,settings) || (solidId+'_solid'),
                    gid=gradientId+'-gradient';
                if(type===(solidId+'_solid')){
                    delete current[gid];
                    this.clearGradient(gradientId,bp,settings);
                }
                else{
                    delete current[solidId];
                }
                if(stVals(solidId,bp,settings)===undefined && stVals(gid,bp,settings)===undefined){
                    delete current[id];
                }
            }
        }
        static clearShadow(key,isBox,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined){
                let subSets=isBox ? ['hOffset', 'vOffset', 'blur', 'spread'] : ['hShadow', 'vShadow', 'blur'],
                    isEmpty = true;
                for(let i=subSets.length-1;i>-1;--i){
                    let k = key + '_' + subSets[i];
                    if(stVals(k,bp,settings)===undefined){
                        delete current[k+'_unit'];
                    }else{
                        isEmpty=false;
                        if(bp==='desktop' && stVals(k+'_unit',bp,settings)==='px'){
                            delete current[k+'_unit'];
                        }
                    }
                }
                if(isEmpty===true){
                    delete current[key+'_color'];
                    if(isBox){
                        delete current[key+'_inset'];
                    }
                }
            }
        }
        static clearMarginOpposity(key,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp];
            if(current!==undefined){
                delete current[key+'_opp_top'];
            }
        }
        static clearWidth(key,bp,settings,isHeight,minId,maxId){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined){
                const prop=(isHeight?'height':'width'),
                    autoId=key + '_auto_'+prop,
                    autoW=stVals(autoId,bp,settings);
                if(autoW && autoW!=='|' && autoW!=='false'){
                    delete current[key];
                }
                else if(bp==='desktop'){
                    delete current[autoId];
                }
                if(!minId){
                    minId=isHeight?'mi_h':'min_' + key;
                }
                if(!maxId){
                    maxId=isHeight?'mx_h':'max_' + key;
                }
                if(!stVals(key,bp,settings) || stVals(key+'_unit',bp,settings)==='px'){
                    delete current[key+'_unit'];
                }
                if(!stVals(minId,bp,settings) || stVals(minId+'_unit',bp,settings)==='px'){
                    delete current[minId+'_unit'];
                }
                if(!stVals(maxId,bp,settings) || stVals(maxId+'_unit',bp,settings)==='px'){
                    delete current[maxId+'_unit'];
                }
            }
        }
        static clearFilter(key,filterId,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined && stVals(key,bp,settings)===''){
                let isEmpty=true;
                for(let filters = ['hue','saturation','brightness','contrast','invert','sepia','opacity','blur'],i=filters.length-1;i>-1;--i){
                    if(stVals(filterId+'_'+filters[i],bp,settings)!==undefined){
                        isEmpty=false;
                        break;
                    }
                }
                if(isEmpty===true){
                    delete current[key];
                }
            }
        }
        static clearTransform(key,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined){
                let isEmpty=true;
                for(let transforms = ['skew', 'rotate', 'translate', 'scale'],i=transforms.length-1;i>-1;--i){
                    let k=key+'_'+transforms[i]+'_',
                        isSame=stVals(k+'opp_bottom',bp,settings),
                        topValue=stVals(k+'top',bp,settings);

                    if(topValue===undefined || stVals(k+'top_unit',bp,settings)==='px'){
                        delete current[k+'top_unit'];
                    }
                    if(stVals(k+'bottom',bp,settings)===undefined || stVals(k+'bottom_unit',bp,settings)==='px'){
                        delete current[k+'bottom_unit'];
                    }

                    if(!isSame || isSame==='false' || isSame==='|' || topValue===undefined){
                        delete current[k+'opp_bottom'];
                    }else {
                        delete current[k+'bottom'];
                    }
                    if(topValue!==undefined || stVals(k+'bottom',bp,settings)!==undefined){
                        isEmpty=false;
                    }
                }
                if(isEmpty===true){
                    delete current[key+'position'];
                }
            }
        }
        static clearGradient(key,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
            stVals=this.getStylingValue;
            if(current!==undefined){
                let type=stVals(key+'-gradient-type',bp,settings) || 'linear';
                if(!stVals(key+'-gradient',bp,settings)){
                    delete current[key+'-gradient-type'];
                    type=null;
                }
                else if(bp==='desktop' && type==='linear'){
                    delete current[key+'-gradient-type'];
                }
                if(type!=='linear' || (bp==='desktop' && settings[key+'-gradient-angle']?.toString()==='180')){
                    delete current[key+'-gradient-angle'];
                }
                if(type!=='radial' || (bp==='desktop' && (!settings[key+'-circle-radial'] || settings[key+'-circle-radial']==='|' || settings[key+'-circle-radial']==='false'))){
                    delete current[key+'-circle-radial'];
                }
            }
        }
        static clearPosition(key,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp];
            if(current!==undefined){
                const pos=this.getStylingValue(key,bp,settings),
                    stVals=this.getStylingValue;
                for(let sides=['top','left','right','bottom'],i=sides.length-1;i>-1;--i){
                    let k=key+'_'+sides[i];
                    if(!pos || pos==='static' || stVals(k+'_auto',bp,settings)){
                        delete current[k];
                        if(!pos || pos==='static'){
                            delete current[k+'_auto'];
                        }
                    }
                    if(stVals(k,bp,settings)===undefined || stVals(k+'_unit',bp,settings)==='px'){
                        delete current[k+'_unit'];
                    }
                }
            }
        }
        static clearBorder(key,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined){
                let isAll=stVals(key+'-type',bp,settings)==='all',
                    count=0;
                for(let sides=['top','left','right','bottom'],i=sides.length-1;i>-1;--i){
                    let k=key+'_'+sides[i]+'_',
                        isNone=stVals(k+'style',bp,settings)==='none';
                    if((isAll && sides[i]!=='top') || isNone || stVals(k+'width',bp,settings)===undefined || stVals(k+'color',bp,settings)===undefined){
                        delete current[k+'width'];
                        delete current[k+'color'];
                        if(!isNone || (isAll && sides[i]!=='top')){
                            delete current[k+'style'];
                            ++count;
                        }
                    }
                }
                if(!isAll || count===4){
                    delete current[key+'-type'];
                }
            }
        }
        static clearPadding(key,bp,settings){
            const current=bp==='desktop'?settings:settings['breakpoint_'+bp],
                stVals=this.getStylingValue;
            if(current!==undefined){
                const applyAll=stVals('checkbox_'+key+'_apply_all',bp,settings);
                if(applyAll==='false' || applyAll==='|' || applyAll===null){
                    if(current['checkbox_'+key+'_apply_all']!==undefined){
                        current['checkbox_'+key+'_apply_all']=false;
                    }
                }
                else if(applyAll){
                    delete current[key+'_bottom'];
                    delete current[key+'_left'];
                    delete current[key+'_right'];
                    delete current[key+'_opp_top'];
                    delete current[key+'_opp_bottom'];
                }
                for(let sides=['top','left','right','bottom'],i=sides.length-1;i>-1;--i){
                    let k=key+'_'+sides[i];
                    if(stVals(k,bp,settings)===undefined){
                        delete current[k+'_unit'];
                        if(sides[i]==='top'){
                            delete current['checkbox_'+key+'_apply_all'];
                        }
                    }
                    else if(bp==='desktop' && stVals(k+'_unit',bp,settings)==='px'){
                        delete current[k+'_unit'];
                    }
                }
                const oppLeft=stVals(key+'_opp_left',bp,settings),
                    oppBottom=stVals(key+'_opp_bottom',bp,settings),
                    oppTop=stVals(key+'_opp_top',bp,settings);
                if(!oppLeft || oppLeft==='false' || oppLeft==='|' || stVals(key+'_left',bp,settings)===undefined){
                    delete current[key+'_opp_left'];
                }   
                if(!oppBottom || oppBottom==='false' || oppBottom==='|' || stVals(key+'_top',bp,settings)===undefined){
                    delete current[key+'_opp_bottom'];
                }  
                if(!oppTop || oppTop==='false' || oppTop==='|' || stVals(key+'_top',bp,settings)===undefined){
                    delete current[key+'_opp_top'];
                }  
            }
        }
        static builderSave(settings,type){
            if(!settings._tooltip){
                delete settings._tooltip_bg;
                delete settings._tooltip_c;
                delete settings._tooltip_w;
            }
            if(!settings._tooltip_w || settings._tooltip_w_unit==='px'){
                delete settings._tooltip_w_unit;
            }
            delete settings.cid;
            delete settings.custom_parallax_scroll_reverse_reverse;
            if(typeof settings.builder_content==='string'){
                settings.builder_content=JSON.parse(settings.builder_content);
            }
            const isEmpty=item=>{
                if(item==='' || item===undefined || item==='false' || item==='undefined' || item===null){
                    return true;
                }
                else if (typeof item === 'object') {
                    return clearEmpty(item,Array.isArray(item));
                }
                return false;
            },
            dcName = window.tbpDynamic?.field_name || null,
            clearEmpty=(items, is_array)=>{
                if(is_array===true){
                    for (let i=items.length-1;i>-1;--i) {
                        if(isEmpty(items[i])){
                            items.splice(i,1);
                        }
                    }
                }
                else{
                    for (let i in items) {
                        if(i === 'null' || i === null || i === '' || i === false || !items.hasOwnProperty(i) || isEmpty(items[i])){
                            delete items[i];
                        }
                        else if (i === dcName) {
                            if (items[i] === '{}') {
                                delete items[i];
                            } 
                            else {
                                let tmp = items[i];
                                if (typeof tmp === 'string') {
                                    tmp = JSON.parse(tmp);
                                }
                                if(Object.keys(tmp).length>0){
                                    for (let k in tmp) {
                                        if (tmp[k].repeatable === undefined && tmp[k].item === undefined) {
                                           delete tmp[k];
                                        }
                                    }
                                    items[i] =  tmp;
                                }
                                else {
                                    delete items[i];
                                }
                            }
                        }
                    }
                }
            };
            clearEmpty(settings);
            if(type==='empty'){
                return settings;
            }
            if(type!=='column'){
                if(settings.visibility_all){
                    delete settings.visibility_desktop;
                    delete settings.visibility_tablet_landscape;
                    delete settings.visibility_tablet;
                    delete settings.visibility_mobile;
                }
                if(!settings.animation_effect){
                    delete settings.animation_effect_delay;
                    delete settings.animation_effect_repeat;
                }
                if(settings.custom_parallax_scroll_reverse===false || settings.custom_parallax_scroll_reverse==='|' || settings.custom_parallax_scroll_reverse==='false'){
                    delete settings.custom_parallax_scroll_reverse;
                }
                if(settings.custom_parallax_scroll_fade===false || settings.custom_parallax_scroll_fade==='|' || settings.custom_parallax_scroll_fade==='false'){
                    delete settings.custom_parallax_scroll_fade;
                }
                if(settings.animation_effect_tab!=='s_e_s'){
                    delete settings.animation_effect_tab;
                }
                let isStickyEmpty=true;
                for(let bps=api.breakpointsReverse,i=bps.length-1;i>-1;--i){
                    let suffix=bps[i]==='desktop'?'':(bps[i]==='tablet_landscape'?'_tl':('_'+bps[i][0])),
                        sticky=settings['stick_at_check'+suffix];
                    if(sticky!==undefined && sticky!=='' && sticky!=='0' && sticky!==0){
                        if(settings['stick_at_position'+suffix]==='top'){
                            delete settings['stick_at_position'+suffix];
                        }
                        isStickyEmpty=false;
                    }
                    else{
                        delete settings['stick_at_position'+suffix];
                        delete settings['stick_at_pos_val'+suffix];
                        delete settings['unstick_when_check'+suffix];
                    }
                    if( settings['stick_at_pos_val'+suffix]===undefined || settings['stick_at_pos_val'+suffix]==='' || settings['stick_at_pos_val'+suffix+'_unit']==='px'){
                        delete settings['stick_at_pos_val'+suffix+'_unit'];
                    }
                    if(!settings['unstick_when_check'+suffix] || settings['unstick_when_element'+suffix]==='builder_end'){
                        delete settings['unstick_when_element'+suffix];
                    }
                    if(settings['unstick_when_element'+suffix]!=='row'){
                        delete settings['unstick_when_el_row_id'+suffix];
                    }
                    if(settings['unstick_when_element'+suffix]!=='module'){
                        delete settings['unstick_when_el_mod_id'+suffix];
                    }
                    if(!settings['unstick_when_el_row_id'+suffix] && !settings['unstick_when_el_mod_id'+suffix]){
                        delete settings['unstick_when_condition'+suffix];
                        delete settings['unstick_when_pos'+suffix];
                    }
                    else if(settings['unstick_when_condition'+suffix]==='hits'){
                        delete settings['unstick_when_condition'+suffix];
                    }
                    if(settings['unstick_when_pos'+suffix]!=='top' && settings['unstick_when_pos'+suffix]!=='bottom'){
                        if(settings['unstick_when_pos'+suffix]==='this'){
                            delete settings['unstick_when_pos'+suffix];
                        }
                        delete settings['unstick_when_pos_val'+suffix];
                    }
                    if(settings['unstick_when_pos_val'+suffix]===undefined || settings['unstick_when_pos_val'+suffix]==='' || settings['unstick_when_pos_val'+suffix+'_unit']==='px'){
                        delete settings['unstick_when_pos_val'+suffix+'_unit'];
                    }
                }
                if(isStickyEmpty===false){
                    delete settings.motion_effects;
                }
                else if(settings.motion_effects){
                    const effects=settings.motion_effects;
                    for(let k in effects){
                        let eff=effects[k]?.val;
                        if(eff?.[k+'_dir']){
                            if(eff[k+'_vp']==='0,100'){
                                delete eff[k+'_vp'];
                            }
                            if(eff[k+'_speed']!==undefined && ((k==='v' && ~~eff.v_speed===1) || (k==='h' && ~~eff.h_speed===9))){
                                delete eff[k+'_speed'];
                            }
                            else if(k==='b' && ~~eff.b_level===5){
                                delete eff.b_level;
                            }
                            else if(k==='s' && ~~eff.s_ratio===3){
                                delete eff.s_ratio;
                            }
                            else if(k==='r' && ~~eff.r_num===1){
                                delete eff.r_num;
                            }
                        }
                        else{
                            delete effects[k];
                        }
                    }
                }
            }
            for (let i in settings) {
                let item=settings[i];
                if(item === '|single' || item=== '|multiple' || (item === 'show' && i.indexOf('visibility_') === 0) || (i === api.GS.key && item.trim() === '')){
                    delete settings[i];
                    continue;
                }
                else if(i === 'custom_parallax_scroll_speed' && !item){
                    delete settings.custom_parallax_scroll_reverse;
                    delete settings.custom_parallax_scroll_fade;
                    delete settings[i];
                    continue;
                }
                else if((i === 'custom_parallax_scroll_reverse' || i === 'custom_parallax_scroll_fade' || i === 'visibility_all' || i === 'sticky_visibility') && !item){
                    delete settings[i];
                    continue;
                }
                else if (i === 'breakpoint_mobile' || i === 'breakpoint_tablet' || i === 'breakpoint_tablet_landscape') {
                    for (let j in item) {
                        let responsiveItem=item[j];
                        if (responsiveItem === undefined || responsiveItem === ''|| responsiveItem === null ) {
                            delete item[j];
                        } 
                        else if (j.includes('_unit', 2)) {
                            let id = j.replace('_unit', '');
                            if (item[id] === undefined || item[id] === '' || item[id] === null) {
                                delete item[j];
                                if (item[id] === '') {
                                    delete item[id];
                                }
                            }
                        }
                    }
                }
                if (typeof item === 'object' && item && Object.keys(item).length=== 0){
                    delete settings[i];
                }
            }
            
            //leave only parents values
            this.clearDuplicatStyles(settings);
            for (let i in settings) {
                let item=settings[i];
                if(i.includes('gradient', 3)){
                    if(item.toString()=== '180' || item === 'linear' || item === jQuery.ThemifyGradient.default || (item === false && i.includes('-circle-radial', 3) )){
                        delete settings[i];
                    }
                }
                else if((item === 'px' || item === '%') && i!=='w_map_unit' && i.includes('_unit', 2)){
                    let isFrame=i.includes('frame_');
                    if((!isFrame && item === 'px') || (isFrame && item === '%')){
                        delete settings[i];
                    }
                }
                else if(item === 'solid' || (item === 'none' && i.includes('frame_layout'))){
                    delete settings[i];
                }
                else if(item===false && (i === 'background_image-type_image' || i === 'resp_no_bg' || i==='background_image-css' || i === 'background_gradient-css' || i === 'cover_gradient-css' || i === 'cover_gradient_hover-css' ||  i === 'background_zoom' || i === 'b_sh_inset' || i === 'background_image-circle-radial' || i === 'margin-top_opp_top' || i === 'm_t_h_opp_top' || i.includes('padding_opp_')|| i.includes('margin_opp_') || i.includes('_user_role', 3))){
                    delete settings[i];
                }
                else if(i.indexOf('checkbox_') === 0 && i.includes('_apply_all', 6)){
                   if(!item){
                       delete settings[i];
                   } 
                   let id = i.replace('_apply_all', '').replace('checkbox_', ''),
                        side = ['top', 'left', 'right', 'bottom'];
                    for (let j = 3; j > -1; --j) {
                        let inpId=id + '_' + side[j],
                            unit = inpId + '_unit';
                        if(settings[inpId]==='' || settings[inpId]===null){
                            delete settings[inpId];
                        }
                        if (settings[unit] === 'px' || settings[inpId]===undefined) {
                            delete settings[unit];
                        } 
                    }
                }
            }
            
            if(type==='column'){
                if(settings.gdr==='row'){
                    delete settings.gdr;
                }
                if(settings.g?.toString()==='0'){
                    delete settings.g;
                }
                if(!settings.g || settings.g_unit==='px'){
                    delete settings.g_unit;
                }
                if(settings.js==='auto'){
                    delete settings.js;
                }
                if(settings.as==='auto'){
                    delete settings.as;
                }
                for(let aligments=['jc','ji','ai','ac'],i=aligments.length-1;i>-1;--i){
                    if(settings[aligments[i]]==='inherit'){
                        delete settings[aligments[i]];
                    }
                }
            }
            return settings;
        }
    };
})(tb_app);