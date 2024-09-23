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
                toolbarEl.tfClass('menu_undo')[0].tfOn(_CLICK_,e=>{
                    if(e.target!==this.compactBtn){
                        e.preventDefault();
                        e.stopPropagation();
                        const target=e.target.closest('.undo_redo');
                        if(target!==null && !target.classList.contains('disabled')){
                            this.constructor.doChange(target.classList.contains('undo'));
                        }
                    }
                });	
            }else{
                for(let items=[btnUndo,btnRedo],i=items.length-1;i>-1;--i){
                    items[i].tfOn(_CLICK_,e=>{
                        e.stopPropagation();
                        this.constructor.doChange(e.target.classList.contains('undo')); 
                    });
                }
            }
            
            if (isEmpty && !Themify.isTouch && !themifyBuilder.disableShortcuts) {
                topWindowDoc.tfOn('keydown auxclick',e=>{
                    this.constructor.keypres(e);
                });
                if (api.isFrontend) {
                    doc.tfOn('keydown auxclick',e=>{
                        this.constructor.keypres(e);
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
        static get(index){
            index??= this.#items.length-1;
            return this.#items[index];
        }
        static setActive(undoItem){
            for(let items=this.#items,len=items.length-1,i=len;i>-1;--i){
                if(items[i]===undoItem){
                    [items[i], items[len]] = [items[len], items[i]];
                    break;
                }
            }
        }
        static start(type,cid){
            const _this = this.get();
            if(this.has(type)===true){
                console.warn('UndoManager:'+type+' is already started');
                return false;
            }
            _this.#type=type;
            _this.#cid=cid;
            _this.state.set(type,this.getCurrentState(type,cid));
        }
        static end(type){
            const _this = this.get();
            type??=_this.#type;
            if(this.has(type)===false){
                console.warn('UndoManager:'+type+' isn`t started');
                return false;
            }
            Themify.trigger('tb_undo_add',type);
            const diff=this.getDiff(type,this.getState(type),this.getCurrentState(type,_this.#cid));
            if(Object.keys(diff).length>0){
                this.push(diff);
            }
            _this.state.delete(type);
            _this.#type=_this.#cid=null;
        }
        static getCurrentState(type){
            const styles={},
                result={builder:api.Helper.cloneObject(api.Builder.get().toJSON(false))},
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
        static getState(type){
            return this.get().state.get(type);
        }
        static has(type){
            return !!this.get().state.has(type);
        }
        static clear(type){
            const _this = this.get();
            if(type===_this.#type){
                _this.#type=null;
            }
            _this.state.delete(type);
            _this.#cid=null;
        }
        static hasRedo() {
            return this.get().hasRedo();
        }
        static hasUndo() {
            return this.get().hasUndo();
        }
        static disable() {
            const _this = this.get();
            _this.isDisabled=true;
            _this.btnUndo.classList.add('disabled');
            _this.btnRedo.classList.add('disabled');
            _this.compactBtn?.classList.add('disabled');
        }
        static enable() {
            const _this = this.get();
            _this.isDisabled=false;
            this.updateUndoBtns();
        }
        static update(is_undo){
            const _this = this.get();
            if (is_undo===true) {
                --_this.index;
            } else {
                ++_this.index;
            }
            this.updateUndoBtns();
            api.ModulePageBreak.countModules();
        }
        static updateUndoBtns() {
            const _this = this.get();
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
        static push(data) {
            const _this = this.get();
            _this.stack.splice(_this.index + 1, _this.stack.length - _this.index);
            _this.stack.push(data);
            _this.index = _this.stack.length - 1;
            this.updateUndoBtns();
            Themify.trigger('add_undo');
            api.Builder.get().isSaved=false;
        }
        static async doChange(is_undo) {
            const _this = this.get();
            if (_this.isWorking === false && _this.isDisabled===false) {
                _this.isWorking = true;
                await this.changes(is_undo);
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
        static keypres(e) {
            const _this = this.get();
            if (_this.isWorking === false && _this.isDisabled===false && (e.button===3 || e.button===4 || true === e.ctrlKey || true === e.metaKey)){
                const activeTag = doc.activeElement.tagName,
                        topActiveTag = topWindowDoc.activeElement.tagName,
                        key = e.code;
                if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA' && topActiveTag !== 'INPUT' && topActiveTag !== 'TEXTAREA' && !api.LightBox.el.contains(e.target)) {
                    if ('KeyY' === key || e.button===4 || ('KeyZ' === key && true === e.shiftKey)) {// Redo
                        if (this.hasRedo()) {
                            e.preventDefault();
                            this.changes(false);
                        }
                    } 
                    else if (('KeyZ' === key || e.button===3) && this.hasUndo()) { // UNDO
                        e.preventDefault();
                        this.changes(true);
                    }
                }
            }
        }
        static async changes(is_undo) {
            api.ActionBar.clearClicked();
            if (api.activeModel !== null && (!api.isVisual || (!doc.activeElement.isContentEditable && api.activeModel.el.contains(doc.activeElement)))) {
                await api.LightBox.save();
                return this.changes(is_undo);
            }
            const _this = this.get(),
                index = is_undo===true ? 0 : 1,
                stack = _this.stack[_this.index + index];
            if (stack !== undefined) {
                const type=is_undo===true?'old':'new';
                if(stack.html){
                    await this.domChanges(stack.html,type,stack.type);
                }
                if(stack.styles){
                    this.styleChanges(stack.styles,type,!stack.html);
                }
                this.update(is_undo);
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
                    model=api.activeModel,
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
                    let item=vals[mode];
                    if(item!==undefined){
                        let row=item;
                    //    register.remove(id,true);
                        if(cid){
                            row=api.Helper.cloneObject(row);
                            loop([row]);
                        }
                        let index=vals.index,
                            oldEl=Registry.get(id)?.el,
                            r = new api.Row(row);
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