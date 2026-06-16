((api,topWindowDoc,_CLICK_)=>{
    "use strict";
    api.undoManager = class {
        static #items=[];
        isWorking= false;
        isDisabled=false;
        stack=[];
        state=new Map;
        index=-1;
        btnUndo;
        btnRedo;
        compactBtn;
        #cid;
        #type;
        constructor(btnUndo,btnRedo,compactBtn){
            const toolbarEl=api.ToolBar.el,
            isEmpty=this.constructor.get(0)===undefined;
            this.btnUndo = btnUndo;
            this.btnRedo = btnRedo;
            this.compactBtn = compactBtn;
            if(isEmpty && toolbarEl.contains(btnUndo)){
                this.constructor.main=this;
                toolbarEl.tfClass('menu_undo')[0].tfOn(_CLICK_,e=>{
                    if(e.target!==this.compactBtn){
                        e.preventDefault();
                        e.stopPropagation();
                        if (this.constructor.isInlineEditing()) {
                            return;
                        }
                        const target=e.target.closest('.undo_redo');
                        if(target!==null && !target.classList.contains('disabled')){
                            this.constructor.doChange(target.classList.contains('undo'),this);
                        }
                    }
                });	
            }else{
                for(let items=[btnUndo,btnRedo],i=items.length-1;i>-1;--i){
                    items[i].tfOn(_CLICK_,e=>{
                        e.stopPropagation();
                        if (this.constructor.isInlineEditing()) {
                            return;
                        }
                        this.constructor.doChange(e.target.classList.contains('undo'),this); 
                    });
                }
            }
            
            if (isEmpty && !Themify.isTouch && !themifyBuilder.disableShortcuts) {
                topWindowDoc.tfOn('keydown auxclick',e=>{
                    this.constructor.keypres(e,this);
                });
                if (api.isFrontend || api.isVisual) {
                    doc.tfOn('keydown auxclick',e=>{
                        this.constructor.keypres(e,this);
                    });
                }
            }
            this.constructor.#items.push(this);
        }
        hasUndo() {
            return this.index>-1;
        }
        hasRedo() {
            return this.index < (this.stack.length - 1);
        }
        destroy(){
            for(let items=this.constructor.#items,i=items.length-1;i>-1;--i){
                if(items[i]===this){
                    items.splice(i,1);
                    break;
                }
            }
            this.stack=this.state=this.btnUndo=this.btnRedo=this.compactBtn=null;
            this.constructor.updateUndoBtns();
        }
        static isInlineEditing(){
            return !!doc.tfId('tb_inline_editor_root')?.classList.contains('tb_editor_active');
        }
        static get(index){
            if(index && typeof index==='object'){
                return index;
            }
            index??= this.#items.length-1;
            return this.#items[index];
        }
        static getMain(){
            return this.main || this.#items[0];
        }
        static getByType(type){
            return type?.indexOf('inline')===0 ? (this.getMain() || this.get()) : this.get();
        }
        static setActive(undoItem){
            for(let items=this.#items,len=items.length-1,i=len;i>-1;--i){
                if(items[i]===undoItem){
                    [items[i], items[len]] = [items[len], items[i]];
                    break;
                }
            }
        }
        static start(type,cid,undoItem){
            const _this = undoItem ? this.get(undoItem) : this.getByType(type);
            if(this.has(type,_this)===true){
                console.warn('UndoManager:'+type+' is already started');
                return false;
            }
            _this.#type=type;
            _this.#cid=cid;
            _this.state.set(type,this.getCurrentState(type,cid));
        }
        static end(type,undoItem){
            const _this = undoItem ? this.get(undoItem) : this.getByType(type);
            type??=_this.#type;
            if(this.has(type,_this)===false){
                console.warn('UndoManager:'+type+' isn`t started');
                return false;
            }
            Themify.trigger('tb_undo_add',type);
            const oldState=this.getState(type,_this),
                diff=this.getDiff(type,oldState,this.getCurrentState(type,_this.#cid,oldState?.builder));
            if(Object.keys(diff).length>0){
                if(type?.indexOf('inline')===0 && _this.#cid){
                    diff.cid=_this.#cid;
                }
                this.push(diff,_this);
            }
            _this.state.delete(type);
            _this.#type=_this.#cid=null;
        }
        static syncInlineStateFromRegistry(builder,cid){
            if (!cid) {
                return builder;
            }
            const sync = items => {
                if (!Array.isArray(items)) {
                    return false;
                }
                for (let i = items.length - 1; i > -1; --i) {
                    const item = items[i];
                    if (!item) {
                        continue;
                    }
                    if (item.mod_name && item.element_id === cid) {
                        const model = api.Registry.get(item.element_id),
                            settings = model?.el?.isConnected !== false && model?.get?.('mod_settings');
                        if (settings) {
                            item.mod_settings = api.Helper.cloneObject(settings);
                        }
                        return true;
                    }
                    const settings = item.mod_settings || item.styling;
                    if (settings) {
                        for (const key of api.Helper.getNestedBuilderKeys()) {
                            const repeats = settings[key];
                            if (Array.isArray(repeats)) {
                                for (let j = repeats.length - 1; j > -1; --j) {
                                    if (sync(repeats[j]?.builder_content)) {
                                        return true;
                                    }
                                }
                            }
                        }
                        for (const key of api.Helper.getNestedRowsKeys()) {
                            if (sync(settings[key])) {
                                return true;
                            }
                        }
                    }
                    if (sync(item.cols) || sync(item.modules)) {
                        return true;
                    }
                }
                return false;
            };
            sync(builder);
            return builder;
        }
        static getCurrentState(type,cid,previousBuilder){
            const styles={},
                builder=api.Helper.cloneObject(api.Builder.get().toJSON(false)),
                result={builder:api.Helper.preserveNestedBuilderContent(type?.indexOf('inline')===0?this.syncInlineStateFromRegistry(builder,cid):builder,previousBuilder,type?.indexOf('inline')!==0)},
                breakpoints=api.breakpointsReverse;
                for(let i=breakpoints.length-1;i>-1;--i){
                    let bp=breakpoints[i],
                        rules=ThemifyStyles.getSheet(bp).cssRules,
                        gsRules=ThemifyStyles.getSheet(bp,true).cssRules;
                    styles[bp]={st:{},gs:{}};
                    for(let j=rules.length-1;j>-1;--j){
                        styles[bp].st[rules[j].selectorText]=rules[j].style.cssText;
                    }
                    for(let j=gsRules.length-1;j>-1;--j){
                        styles[bp].gs[gsRules[j].selectorText]=gsRules[j].style.cssText;
                    }
                }
            result.style=styles;  
            return result;
        }
        static getState(type,undoItem){
            return (undoItem ? this.get(undoItem) : this.getByType(type)).state.get(type);
        }
        static has(type,undoItem){
            return !!(undoItem ? this.get(undoItem) : this.getByType(type)).state.has(type);
        }
        static clear(type,undoItem){
            const _this = undoItem ? this.get(undoItem) : this.getByType(type);
            if(type===_this.#type){
                _this.#type=null;
            }
            _this.state.delete(type);
            _this.#cid=null;
        }
        static hasRedo(undoItem) {
            return (undoItem ? this.get(undoItem) : this.get()).hasRedo();
        }
        static hasUndo(undoItem) {
            return (undoItem ? this.get(undoItem) : this.get()).hasUndo();
        }
        static disable(undoItem) {
            const _this = undoItem ? this.get(undoItem) : this.get();
            _this.isDisabled=true;
            _this.btnUndo.classList.add('disabled');
            _this.btnRedo.classList.add('disabled');
            _this.compactBtn?.classList.add('disabled');
        }
        static enable(undoItem) {
            const _this = undoItem ? this.get(undoItem) : this.get();
            _this.isDisabled=false;
            this.updateUndoBtns(_this);
        }
        static update(is_undo,undoItem){
            const _this = undoItem ? this.get(undoItem) : this.get();
            if (is_undo===true) {
                --_this.index;
            } else {
                ++_this.index;
            }
            this.updateUndoBtns(_this);
            api.ModulePageBreak.countModules();
        }
        static updateUndoBtns(undoItem) {
            const _this = undoItem ? this.get(undoItem) : this.get();
            if(_this.isDisabled!==true){
                const undo = _this.hasUndo(),
                        redo = _this.hasRedo();
                _this.btnUndo.classList.toggle('disabled', !undo);
                _this.btnRedo.classList.toggle('disabled', !redo);
                _this.compactBtn?.classList.toggle('disabled', !(undo || redo));
            }
        }
        static reset() {
            const _this = this.get();
            _this.stack = [];
            _this.state.clear();
            _this.index = -1;
            this.updateUndoBtns();
        }
        static collectModules(item,map=new Map()) {
            if (!item || typeof item !== 'object') {
                return map;
            }
            if (item.mod_name && item.element_id) {
                map.set(item.element_id,item);
            }
            const settings = item.mod_settings || item.styling;
            if (settings) {
                for (const key of api.Helper.getNestedBuilderKeys()) {
                    const repeats = settings[key];
                    if (Array.isArray(repeats)) {
                        for (let i = repeats.length - 1; i > -1; --i) {
                            this.collectModules(repeats[i]?.builder_content,map);
                        }
                    }
                }
                for (const key of api.Helper.getNestedRowsKeys()) {
                    this.collectModules(settings[key],map);
                }
            }
            this.collectModules(item.cols,map);
            this.collectModules(item.modules,map);
            if (Array.isArray(item)) {
                for (let i = item.length - 1; i > -1; --i) {
                    this.collectModules(item[i],map);
                }
            }
            return map;
        }
        static getChangedInlineModules(oldRow,newRow,cid) {
            const oldModules = this.collectModules(oldRow),
                newModules = this.collectModules(newRow),
                changed = new Map();
            if (cid) {
                const oldModule = oldModules.get(cid),
                    newModule = newModules.get(cid);
                if (oldModule && newModule && api.Helper.compareObject(oldModule,newModule)) {
                    changed.set(cid,{old:api.Helper.cloneObject(oldModule),new:api.Helper.cloneObject(newModule)});
                }
                return changed;
            }
            for (let [id,newModule] of newModules) {
                const oldModule = oldModules.get(id);
                if (oldModule && api.Helper.compareObject(oldModule,newModule)) {
                    changed.set(id,{old:api.Helper.cloneObject(oldModule),new:api.Helper.cloneObject(newModule)});
                }
            }
            return changed;
        }
        static mergeInlineModule(baseModule,changedModule) {
            let module = api.Helper.cloneObject(changedModule);
            return api.Helper.preserveNestedBuilderContent([module],[baseModule],false)?.[0] || module;
        }
        static applyInlineModulesToRow(item,changes,mode) {
            if (!item || typeof item !== 'object' || !changes || changes.size===0) {
                return item;
            }
            if (Array.isArray(item)) {
                for (let i = item.length - 1; i > -1; --i) {
                    const child = item[i];
                    if (child?.mod_name && child.element_id && changes.has(child.element_id)) {
                        const vals = changes.get(child.element_id),
                            module = vals?.[mode];
                        if (module) {
                            item[i] = this.mergeInlineModule(child,module);
                        }
                    }
                    else {
                        this.applyInlineModulesToRow(child,changes,mode);
                    }
                }
                return item;
            }
            const settings = item.mod_settings || item.styling;
            if (settings) {
                for (const key of api.Helper.getNestedBuilderKeys()) {
                    const repeats = settings[key];
                    if (Array.isArray(repeats)) {
                        for (let i = repeats.length - 1; i > -1; --i) {
                            this.applyInlineModulesToRow(repeats[i]?.builder_content,changes,mode);
                        }
                    }
                }
                for (const key of api.Helper.getNestedRowsKeys()) {
                    this.applyInlineModulesToRow(settings[key],changes,mode);
                }
            }
            this.applyInlineModulesToRow(item.cols,changes,mode);
            this.applyInlineModulesToRow(item.modules,changes,mode);
            return item;
        }
        static getCurrentBuilderRow(id) {
            const rows = api.Builder.get().toJSON(false);
            if (!Array.isArray(rows)) {
                return null;
            }
            for (let i = rows.length - 1; i > -1; --i) {
                if (rows[i]?.element_id === id) {
                    return api.Helper.cloneObject(rows[i]);
                }
            }
            return null;
        }
        static normalizeInlinePushData(data) {
            if (!data?.html || data.type?.indexOf('inline') !== 0) {
                return data;
            }
            for (let [,vals] of data.html) {
                if (!vals?.old || !vals?.new) {
                    continue;
                }
                const changed = this.getChangedInlineModules(vals.old,vals.new,data.cid);
                if (changed.size>0) {
                    vals.inlineModules = changed;
                }
            }
            return data;
        }
        static push(data,undoItem) {
            const _this = undoItem ? this.get(undoItem) : this.get();
            data = this.normalizeInlinePushData(data,_this);
            _this.stack.splice(_this.index + 1, _this.stack.length - _this.index);
            _this.stack.push(data);
            _this.index = _this.stack.length - 1;
            this.updateUndoBtns(_this);
            Themify.trigger('add_undo');
            api.Builder.get().isSaved=false;
        }
        static async doChange(is_undo,undoItem) {
            const _this = undoItem ? this.get(undoItem) : this.get();
            if (_this.isWorking === false && _this.isDisabled===false) {
                _this.isWorking = true;
                await this.changes(is_undo,_this);
                _this.isWorking = false;
            }
        }
        static getDiff(type,oldState,newState){
        
            //compare builder
            const oldBuilder=oldState.builder,
                newBuilder=newState.builder,
                builderChanges=new Map,
                rowsIds= new Set;
            for(let i=0;i<oldBuilder.length;++i){
                let oldB=oldBuilder[i],
                    newB=newBuilder[i],
                    id=oldB.element_id;
                if(newBuilder[i]?.element_id===id){
                    if(api.Helper.compareObject(oldB,newB)){
                        builderChanges.set(id,{old:oldB,new:newB});
                    }
                }else{
                    let found=false;
                    
                    for(let j=newBuilder.length-1;j>-1;--j){
                        if(newBuilder[j].element_id===id){
                            if(type==='delete' && api.Helper.compareObject(oldB,newBuilder[j])){
                                builderChanges.set(id,{old:oldB,new:newBuilder[j]});
                            }
                            else if(type==='move' && newBuilder.length===oldBuilder.length && !builderChanges.has('sort')){//row position changed
                                let oldSort=[],
                                    newSort=[];
                                for(let i=0;i<oldBuilder.length;++i){
                                    oldSort.push(oldBuilder[i].element_id);
                                }
                                for(let i=0;i<newBuilder.length;++i){
                                    newSort.push(newBuilder[i].element_id);
                                }
                                builderChanges.set('sort',{old:oldSort,new:newSort});
                            }
                            found=true;
                            break;
                        }
                    }
                    if(!found){//row not found it's deleted
                        builderChanges.set(id,{old:oldB,index:i});
                    }
                }
                rowsIds.add(id);
            }
            if(newBuilder.length>oldBuilder.length){//check new rows
                for(let i=0;i<newBuilder.length;++i){
                    let newB=newBuilder[i],
                        id=newB.element_id;
                    if(!rowsIds.has(id)){
                        builderChanges.set(id,{new:newB,index:i});
                    }
                }
            }
                
            rowsIds.clear();
            let oldStyles=oldState.style,
                currentStyles=newState.style,
                stylesChanges={},
                parseCssText=cssText=>{
                    cssText=cssText.split('; ');
                    const res={};
                    for(let i=cssText.length-1;i>-1;--i){
                        let index = cssText[i].indexOf(':'),
                            prop = cssText[i].substring(0, index);
                        res[prop]=cssText[i].substring(index + 1).trim();
                        let len=res[prop].length;
                        if (res[prop][len - 1] === ';') {
                            res[prop] = res[prop].slice(0, -1);
                        }
                        else if(res[prop][len - 1]==='"' && res[prop][len - 2]===';'){
                            let index=len - 2;
                            res[prop]=res[prop].substring(0, index)+res[prop].substring(index+1);
                        }
                    }
                    return res;
                },
                diffStyles=(oldStyles,newStyles)=>{
                    let diff={old:{},new:{}};
                    for(let sel in oldStyles){//check changes
                        if(newStyles[sel]!==undefined){
                            if(newStyles[sel]!==oldStyles[sel]){
                                let oldCss=parseCssText(oldStyles[sel]),
                                    newCss= parseCssText(newStyles[sel]);
                                
                                for(let prop in oldCss){//check props changes
                                    if(newCss[prop]!==oldCss[prop]){
                                        let oldV=oldCss[prop].trim(),
                                            newV=newCss[prop]?.trim()??'';
                                        if(newV!==oldV){
                                            diff.old[sel]??={};
                                            diff.new[sel]??={};
                                            diff.old[sel][prop]=oldV;
                                            diff.new[sel][prop]=newV;
                                        }
                                    }
                                }
                                for(let prop in newCss){//new props
                                    if(oldCss[prop]===undefined){
                                        diff.old[sel]??={};
                                        diff.new[sel]??={};
                                        diff.old[sel][prop]='';
                                        diff.new[sel][prop]=newCss[prop].trim();
                                    }
                                }
                                
                            }
                        }
                        else{
                            diff.old[sel]=parseCssText(oldStyles[sel]);
                            diff.new[sel]='';
                        }
                    }
                     
                    for(let sel in newStyles){//new selectors
                        if(oldStyles[sel]===undefined){
                            diff.new[sel]=parseCssText(newStyles[sel]);
                            diff.old[sel]='';
                        }
                    }   
                    if(Object.keys(diff.old).length===0){
                        delete diff.old;
                    }
                    if(Object.keys(diff.new).length===0){
                        delete diff.new;
                    }
                    return diff;
                };
                
                for(let bp in oldStyles){
                    if(currentStyles[bp]!==undefined){
                        let stChanges=diffStyles(oldStyles[bp].st,currentStyles[bp].st),
                            gsChanges=diffStyles(oldStyles[bp].gs,currentStyles[bp].gs);
                        if(Object.keys(stChanges).length>0){
                            stylesChanges[bp]={st:stChanges};
                        }
                        if(Object.keys(gsChanges).length>0){
                            stylesChanges[bp]={gs:gsChanges};
                        }
                    }
                }
                for(let bp in currentStyles){//new breakpoints
                    if(oldStyles[bp]===undefined){
                        let stChanges=diffStyles({},currentStyles[bp].st),
                            gsChanges=diffStyles({},currentStyles[bp].gs);
                        if(Object.keys(stChanges).length>0){
                            stylesChanges[bp]={st:stChanges};
                        }
                        if(Object.keys(gsChanges).length>0){
                            stylesChanges[bp]={gs:gsChanges};
                        }
                    }
                }
            newState=currentStyles=oldStyles=null;
            const data={};
            if(Object.keys(stylesChanges).length>0){
                data.styles=stylesChanges;
            }
            if(builderChanges.size>0){
                data.html=builderChanges;
            }
            if(data.html || data.styles){
               data.type=type;
            }
            return data;
        }
        static keypres(e,undoItem) {
            const _this = undoItem ? this.get(undoItem) : this.get();
            if (this.isInlineEditing()) {
                return;
            }
            if (_this.isWorking === false && _this.isDisabled===false && (e.button===3 || e.button===4 || true === e.ctrlKey || true === e.metaKey)){
                const activeTag = doc.activeElement.tagName,
                        topActiveTag = topWindowDoc.activeElement.tagName,
                        key = e.code;
                if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA' && topActiveTag !== 'INPUT' && topActiveTag !== 'TEXTAREA' && !api.LightBox.el.contains(e.target)) {
                    if ('KeyY' === key || e.button===4 || ('KeyZ' === key && true === e.shiftKey)) {// Redo
                        if (this.hasRedo(_this)) {
                            e.preventDefault();
                            this.doChange(false,_this);
                        }
                    } 
                    else if (('KeyZ' === key || e.button===3) && this.hasUndo(_this)) { // UNDO
                        e.preventDefault();
                        this.doChange(true,_this);
                    }
                }
            }
        }
        static isLightBoxOpen(){
            return !!(api.LightBox?.el && !api.LightBox.el.classList.contains('tf_hide'));
        }
        static async prepareMainUndoRedo() {
            if (api.activeModel === null || !this.isLightBoxOpen()) {
                return true;
            }
            try {
                await api.LightBox.save();
            }
            catch(e) {
                if (e !== 'invalid') {
                    console.log(e);
                }
                return false;
            }
            if (api.activeModel !== null && this.isLightBoxOpen()) {
                api.LightBox.close();
            }
            return true;
        }
        static async changes(is_undo,undoItem) {
            api.ActionBar.clearClicked();
            const _this = undoItem ? this.get(undoItem) : this.get();
            if (await this.prepareMainUndoRedo() === false) {
                return;
            }
            const index = is_undo===true ? 0 : 1,
                stack = _this.stack[_this.index + index];
            if (stack !== undefined) {
                const type=is_undo===true?'old':'new';
                if(stack.html){
                    await this.domChanges(stack.html,type,stack.type);
                }
                if(stack.styles){
                    this.styleChanges(stack.styles,type,!stack.html);
                }
                this.update(is_undo,_this);
            }
        }
        
        static styleChanges(styles,mode,runJs){
            //replace styles
            const selectors=new Set;
            for(let bp in styles){
                for(let k in styles[bp]){
                    let sheet=ThemifyStyles.getSheet(bp,k==='gs'),
                        rules=sheet.cssRules;
                    for(let sel in styles[bp][k][mode]){
                        let vals=styles[bp][k][mode][sel],
                        index=api.Utils.findCssRule(rules, sel);
                        if(vals!==''){
                             if(index === false || rules[index]===undefined){
                                let cssText='';
                                for(let prop in vals){
                                    cssText+=prop + ':' + vals[prop] + ';';
                                }
                                sheet.insertRule(sel + '{' + cssText + ';}', rules.length);
                            }
                            else{
                                for(let prop in vals){
                                    let val=vals[prop].trim(),
                                        priority = val !== '' && val.includes('!important')? 'important' : '';
                                    if (priority !== '') {
                                        val = val.replace('!important', '').trim();
                                    }
                                    rules[index].style.setProperty(prop, val,priority);
                                }
                            }
                        }
                        else if(index !== false && rules[index]!==undefined){
                            sheet.deleteRule(index);
                        }
                        if(runJs===true){
                            selectors.add(sel);
                        }
                    }
                }
            }
            
            if(selectors.size>0){
                for(let sel of selectors){
                    let item=doc.querySelector(sel);
                    if(item){
                        api.Utils.runJs(item);
                    }
                }
            }
        }
        
        static async domChanges(changes,mode,type){
            let builder=api.Builder.get().el,
                    ids=new Set,
                    rows=new Set,
                    Registry=api.Registry,
                    sort=changes.get('sort')?.[mode],
                    model=type?.indexOf('inline')===0 ? null : api.activeModel,
                    rowSizes,
                    cid=model?.id,
                    componentType=model?.type,
                    loop = items => {
                        for (let i = items.length - 1; i > -1; --i) {
                            let item=items[i],
                                mod_settings=item.mod_settings;
                            if(item.element_id===cid){
                                ThemifyConstructor.setStylingValues(api.activeBreakPoint);//save current breakpoint style tab
                                let settings = {...api.Helper.cloneObject(ThemifyConstructor.values),...api.Forms.serialize('tb_options_setting', true)};
                                if (componentType !== 'column') {
                                    settings={...settings,...api.Forms.serialize('tb_options_animation', true),...api.Forms.serialize('tb_options_visibility', true)};
                                }
                                if(componentType==='module'){
                                    item.mod_settings=settings;
                                }
                                else{
                                    if(componentType!=='column'){
                                        rowSizes={...item.sizes};
                                    }
                                    item.styling=settings;
                                }
                                return true;
                            }
                            if ((item.cols?.length>0 && loop(item.cols)) || (item.modules?.length>0 && loop(item.modules))) {
                                return;
                            }
                            if(mod_settings){
                                let nestedBuilder=mod_settings.content_accordion || mod_settings.tab_content_tab;
                                if(nestedBuilder){
                                    for(let j=nestedBuilder.length-1;j>-1;--j){
                                        if(nestedBuilder[j].builder_content){
                                            loop(nestedBuilder[j].builder_content);
                                        }
                                    }
                                }
                                /* Toggle module */
                                if ( mod_settings.toggle1 ) {
                                    loop(mod_settings.toggle1);
                                }
                                if ( mod_settings.toggle2 ) {
                                    loop(mod_settings.toggle2);
                                }
                            }
                        }
                };
            if(sort){
                for(let i=0;i<sort.length;++i){
                    let r=builder.querySelector('[data-cid="'+sort[i]+'"]');
                    if(i===0){
                        builder.prepend(r);
                    }else{
                        builder.querySelectorAll(':scope>.module_row')[i-1].after(r);
                    } 
                }
            }
            for(let [id,vals] of changes){
                if(id!=='sort'){
                    let item=vals[mode],
                        previousRow=vals[mode==='old'?'new':'old'];
                    if(type?.indexOf('inline')===0 && vals?.inlineModules){
                        item=previousRow ? api.Helper.cloneObject(previousRow) : (item ? api.Helper.cloneObject(item) : item);
                        if(item){
                            this.applyInlineModulesToRow(item,vals.inlineModules,mode);
                        }
                        previousRow=undefined;
                    }
                    if(item!==undefined){
                        previousRow=type?.indexOf('inline')===0 ? undefined : (previousRow ? [previousRow] : undefined);
                        let row=api.Helper.preserveNestedBuilderContent([api.Helper.cloneObject(item)], previousRow, type?.indexOf('inline')!==0)[0];
                    //    register.remove(id,true);
                        if(cid){
                            loop([row]);
                        }
                        let index=vals.index,
                            oldEl=Registry.get(id)?.el,
                            r,
                            restoreFlag=api.isUndoRedoRestore;
                            api.isUndoRedoRestore=true;
                            try{
                                r = new api.Row(row);
                            }finally{
                                api.isUndoRedoRestore=restoreFlag;
                            }
                            ids.add(id);
                            for(let cids=r.el.querySelectorAll('[data-cid]'),i=cids.length-1;i>-1;--i){
                                ids.add(cids[i].dataset.cid);
                            }
                            if(index!==undefined){
                                if(index===0){
                                    builder.prepend(r.el);
                                }else{
                                    builder.querySelectorAll(':scope>.module_row')[index-1].after(r.el);
                                } 
                            }
                            else{
                                oldEl?.replaceWith(r.el);
                            }

                            rows.add(r.el);
                    }
                    else {
                        Registry.remove(id);
                    }
                }
            }
            if(ids.size>0){
                if(api.isVisual){
                    await api.bootstrap(ids.keys(),undefined,false);
                    for(let el of rows){
                        api.Utils.runJs(el, 'row');
                    }
                }
                if(cid && ids.has(cid)){
                    api.activeModel=Registry.get(cid);
                    if(api.isVisual){
                        api.liveStylingInstance.el=api.activeModel.el;
                        api.liveStylingInstance.model=api.activeModel;
                    }
                    if(rowSizes){
                        ThemifyConstructor.grid.set(rowSizes);
                        rowSizes=null;
                    }
                    loop=type=cid=null;
                    //api.activeModel.visualPreview?.(settings);
                }
            }
        }
    };
	
    Themify.on('tb_toolbar_loaded',()=>{
        const toolbarEl=api.ToolBar.el;
        new api.undoManager(toolbarEl.tfClass('undo')[0],toolbarEl.tfClass('redo')[0],toolbarEl.tfClass('compact_undo')[0]);
    },true,api.ToolBar?.isLoaded===true);
	
})(tb_app,topWindowDoc,_CLICK_);