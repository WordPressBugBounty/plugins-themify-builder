((api,_CLICK_,topWindowDoc) => {
    "use strict";
    let actionBarPrevEl,
        clickTimer;
    const row=doc.tfId('tmpl-builder_row_action').content,
        column=doc.tfId('tmpl-builder_column_action').content,
        subrow=doc.tfId('tmpl-builder_subrow_action').content,
        module=doc.tfId('tmpl-builder_module_action').content,
        {isFrontend,Registry}=api,
        showTab=(target,type)=>{
            let root=target.getRootNode(),
                tabId = target.dataset.href; 
            if(tabId==='options'){
                root.querySelector('#'+tabId).classList.add('selected');
                tabId=root.querySelector('.row_menu .selected');
                tabId=tabId?.dataset.href || 'grid';
            }
            const el=root.querySelector('#'+tabId),
                grid=root.querySelector('#grid'),
                cid=root.host.closest('[data-cid]').dataset.cid,
                hide=tabId === 'grid'?root.querySelector('#row_options'):grid,
                optionTab=root.querySelector('#options');

                if(el.childElementCount<2){
                    const model=Registry.get(cid);
                    if(model){
                        if (tabId === 'grid') {
                            model.gridMenu(grid);
                        }
                        else{
                            model.optionsTab(el);
                        }
                    }
                }
                for(let nav=target.parentNode.children,i=nav.length-1;i>-1;--i){
                    nav[i].classList.toggle('selected',nav[i]===target);
                }
                el.classList.add('selected');
                hide?.classList.remove('selected');
                if(type!=='click' && optionTab!==null){
                    api.Utils.addViewPortClass(optionTab);
                }

        },
        smallBarHover=cid=>{
            actionBarPrevEl?.classList.remove('tb_current_module') || bodyCl.add('tb_nested_hover');
            if(cid){
                actionBarPrevEl= Registry.get(cid).el;
                actionBarPrevEl.classList.add('tb_current_module');
            }
        },
        smallBarClick=async e=>{
            e.stopPropagation();
            const cid=e.target.dataset.cid;
            if(cid){
                const currentTarget= e.currentTarget,
                    model=Registry.get(cid),
                el=model.type==='subrow'?model.el.tfClass('module_subrow')[0]:model.el,
                actionBar=el.querySelector(':scope>.tb_'+model.type+'_action');
                await model.edit();
                if(model.type==='module'){
                    currentTarget.closest('.tb_small_bar')?.classList.remove('tb_small_bar');
                    model.el.classList.remove('tb_small_bar');
                }
                el.classList.add('tb_show_action');
                Themify.triggerEvent(actionBar,'pointerover',{target:actionBar},true);
                api.ActionBar.disable=api.ActionBar.disableClear=true;
                smallBarHover(cid);
                currentTarget.tfOff(_CLICK_,smallBarClick,{passive:true}).remove();
                setTimeout(()=>{
                    const disable=e=>{
                        if(!e || e.button===0){
                            api.Builder.get().el.tfOff('pointerdown', disable,{passive:true});
                            doc.tfOff('pointerdown', disable,{passive:true});
                            topWindowDoc.tfOff('pointerdown', disable,{passive:true});
                            Themify.off('themify_builder_lightbox_close', disable);
                            setTimeout(()=>{
                                for (let selected = api.Builder.get().el.tfClass('tb_show_action'),i = selected.length - 1; i > -1; --i) {
                                    selected[i].classList.remove('tb_show_action');
                                }
                                api.ActionBar.disableClear=api.ActionBar.disable=null;
                                Themify.triggerEvent(e.target,'pointerover',{target:e.target},true);
                            },100);
                        }
                    };
                    api.Builder.get().el.tfOn('pointerdown', disable,{passive:true});
                    doc.tfOn('pointerdown', disable,{passive:true});
                    Themify.on('themify_builder_lightbox_close', disable,true);
                    if(isFrontend){
                        topWindowDoc.tfOn('pointerdown', disable,{passive:true});
                    }
                },150);
            }
        },
        menuHover=e=>{
            e.stopPropagation();
            const m=e.currentTarget,
                root=m.getRootNode(),
                target=e.target,
                inner_menu=target.classList.contains('more') || target.classList.contains('inner_more')?target.tfClass('menu')[0]:null;
            if (inner_menu || target.classList.contains('inner_more') || target.classList.contains('menu')) {
                api.Utils.addViewPortClass((inner_menu || target));
            }
            if(target.hasAttribute('data-href')){
                showTab(target);
            }
            else {
                const tab=root.querySelector('.tab');
                if(tab!==null){
                    for(let nav=m.children,i=nav.length-1;i>-1;--i){
                        nav[i].classList.remove('selected');
                    }
                    tab.classList.remove('selected');
                }
                else if(!inner_menu && target.part.contains('nested') &&  !root.querySelector('.nested_menu')){
                    let el=root.host.closest('[data-cid]'),
                        builder=api.Builder.get().el,
                        ids=[el.dataset.cid],
                        index=0,
                        submenu=createElement('ul','menu nested_menu tf_hide tf_box tf_scrollbar');
                    if(el.classList.contains('tb_show_action')){
                        return;
                    }
                    while(true){
                        el = el.parentNode.closest('[data-cid]');
                        if(!el || !builder.contains(el)){
                            break;
                        }
                        ids.push(el.dataset.cid);
                    }
                    for(let i=0;i<ids.length;++i){
                        let model = Registry.get(ids[i]);
                        if(model.locked!==true){
                            let type=model.type,
                                li = createElement('li','',type==='module'?model.getName():(model.isSubCol?'Sub Column':type)),
                                lvl;
                            if(i===0 && model.isEmpty){
                                return;
                            }
                            if(type==='subrow' || type==='row'){
                                lvl=index-1;
                            }
                            else{
                                if(type==='module'){
                                    lvl=index=0;
                                }
                                else {
                                    lvl=index;
                                }
                                ++index;
                            }
                            li.className='lvl'+lvl;
                            li.dataset.cid=ids[i];
                            if(lvl!==0){
                                li.style.marginInlineStart=(5*lvl)+'px';
                            }
                            submenu.appendChild(li);
                        }
                    }
                    submenu.tfOn(_CLICK_,smallBarClick,{passive:true})
                    .part='menu nested_menu';
                    target.appendChild(submenu);
                    api.Utils.addViewPortClass(submenu);
                }else if(target.dataset.cid && target.parentNode.classList.contains('nested_menu')){
                    smallBarHover(target.dataset.cid);
                }
            }              
        },
        shadowRootClick=function(e){
            e.stopPropagation();
            const action=e.target.closest('[data-action],[part]');
            if(action){
                let module=Registry.get(this.host.closest('[data-cid]').dataset.cid),
                    el=module.el,
                    actionName=action.dataset.action || action.part.item(0);
                if(actionName==='edit' || actionName==='styling' || actionName==='visibility' || actionName==='swap'){
                    if(actionName==='edit' && module.type==='module' && this.querySelector('.swap')?.offsetParent){
                        actionName='editBuilder';
                    }
                    module.edit(actionName);
                }
                else if(actionName==='add_col'){
                    const col=new api.Column({},module.type==='subrow');
                    api.undoManager.start('move');
                    api.Drop.column(col.el,el,'right').then(()=>{
                        api.undoManager.end('move');
                    });
                }
                else if(actionName==='up' || actionName==='down'){
                    const nextEl= actionName==='up'?el.previousElementSibling:el.nextElementSibling,
                        offset=parseInt(getComputedStyle(doc.querySelector(':root')).getPropertyValue('--tb_toolbar_h'));
                    api.ActionBar.clear();
                    el.classList.add('tb_draggable_item');
                    api.undoManager.start('move');
                    actionName==='up'?nextEl.before(el):nextEl.after(el);
                    Themify.trigger('tb_' + module.type + '_sort', [el]);
                    api.undoManager.end('move');
                    el.classList.remove('tb_draggable_item');
                    api.Utils.scrollTo(el,offset*2-window.scrollY,{behavior:'smooth'});
                }
                else if(module[actionName]){
                    module[actionName](actionName==='paste'?e.target.classList.contains('style'):e.target);
                }
            }
            else if(e.target.hasAttribute('data-href')){
                showTab(e.target,'click');
            }
        };
        
    class Bar extends HTMLElement {
        connectedCallback () {
            const tpl=this.constructor._template.cloneNode(true),
                menu=tpl.querySelector('.dropdown'),
                parent=this.constructor===ModuleBar?this.parentNode.parentNode:null,
                isSmall=parent?.offsetWidth <220;
                if(isSmall===true){
                    menu.classList.add('tb_small_bar');
                    menu.children[~~(menu.childElementCount/2)].after(menu.firstElementChild);
                }
                parent?.classList.toggle('tb_small_bar',isSmall);
                this.attachShadow({ mode:'open'}).appendChild(tpl);
                menu.tfOn('pointerover',menuHover,{passive:true});
                this.shadowRoot.tfOn(_CLICK_,shadowRootClick,{passive:true});
               
        }
        disconnectedCallback(){
            const menu=this.shadowRoot.tfOff(_CLICK_,shadowRootClick,{passive:true}).querySelector('.dropdown');
            menu?.tfOff('pointerover',menuHover,{passive:true})
            .tfClass('nested_menu')[0]?.tfOff(_CLICK_,smallBarClick,{passive:true});
            bodyCl.remove('tb_nested_hover');
            actionBarPrevEl?.classList.remove('tb_current_module');
            actionBarPrevEl=null;
        }
    }
    class RowBar extends Bar {
        static _template=row;
    }
    class ColumnBar extends Bar {
        static _template=column;
    }
    class SubrowBar extends Bar {
        static _template=subrow;
    }
    class ModuleBar extends Bar {
        static _template=module;
    }
    customElements.define('tb-row-bar', RowBar);
    customElements.define('tb-column-bar', ColumnBar);
    customElements.define('tb-subrow-bar', SubrowBar);
    customElements.define('tb-module-bar', ModuleBar);
    
    api.ActionBar =  {
        cid:null,
        disable:null,
        breadCrumbs:null,
        disablePosition:null,
        _init() {
            const actionBarCss=module.querySelector('style'),//we are rendreing the inline css ONLY in module bar on the page loading
            fr=createDocumentFragment(),
            gridCss=row.querySelector('#module_row_grids_style'),
            formFields=row.querySelector('#module_form_fields_style'),
            allowedSvg=new Set(['move','pencil','settings','brush','layers','more','save','export','import','files','clipboard','eye','new-window','desktop','tablet','tablet','mobile','help','widgetized']),
            topHead=topWindowDoc.head;

            fr.appendChild(api.ToolBar.getBaseCss());
            const svgs=fr.querySelectorAll('#tf_svg symbol');
            for(let i=svgs.length-1;i>-1;--i){
                let id=svgs[i].id.replace('tf-ti-','');
                if(!allowedSvg.has(id)){
                    svgs[i].remove();
                }
            }
            module.prepend(fr.cloneNode(true));
            fr.appendChild(actionBarCss.cloneNode(true));

            row.prepend(fr.cloneNode(true));

            column.prepend(fr.cloneNode(true));
            fr.appendChild(formFields.cloneNode(true));

            subrow.prepend(fr,gridCss.cloneNode(true));
            if(isFrontend){
                topHead.prepend(formFields.cloneNode(true));
            }
            else{
                topHead.appendChild(formFields.cloneNode(true));
            }
            if (api.isGSPage === true) {
                return;
            }
            this.breadCrumbs = createElement('ul','tb_action_breadcrumb');
            
            Themify.on('themify_builder_ready',()=>{
                const builder=api.Builder.get().el;


                builder.tfOn(_CLICK_, e=>{
                    const target=e.target;
                    if(api.isDocked && target.classList.contains('tb_dragger')){
                        e.preventDefault();
                        e.stopPropagation();
                        api.EdgeDrag.openLightBox(target);
                        return;
                    }
                    if(target.closest('.tb_visibility_hint,.tb_row_info')){
                        const model=Registry.get(target.closest('[data-cid]').dataset.cid);
                        if(target.closest('.tb_visibility_hint')){
                            model.edit('visibility');
                        }
                        else{
                            model.edit().then(lb=>{
                                const cssField=lb.querySelector('.tb_field_group_css .tb_style_toggle.tb_closed');
                                if(cssField){
                                    Themify.triggerEvent(cssField, e.type);
                                }
                            })
                            .catch(()=>{

                            });
                        }
                        return;
                    }
                    this._click(e);

                })
                .tfOn('pointerover', e=>{
                    e.stopPropagation();
                    cancelAnimationFrame(this.req);
                    clearTimeout(this.timer);
                    if(e.isTrusted===true){
                        this.req=requestAnimationFrame(()=>{
                            this.timer=setTimeout(()=>{
                                this.hover(e);
                            },0);
                        });
                    }
                    else{
                        this.hover(e);
                    }
                },{passive: true});
                if(!Themify.isTouch){
                    builder.tfOn('pointerleave', e=>{
                        if(e.relatedTarget!==e.currentTarget.ownerDocument.body){
                            this.clear();
                        }
                        if (api.isVisual) {
                            api.EdgeDrag.clearTimer(e.clientX,e.clientY);
                        }
                    },{passive: true})
                    .tfOn('dblclick', e=>{
                        const target = e.target,
                            tagName = target.tagName;
                        if(!doc.activeElement.isContentEditable && tagName !== 'INPUT' && tagName !== 'TEXTAREA'){
                            if(tagName==='DIV' &&target.classList.contains('tb_dragger')){
                                api.EdgeDrag.openLightBox(target);
                            }
                            else if(!api.isDocked){
                                const el = target.closest('[data-cid]');
                                if(el){
                                    e.preventDefault();
                                    const model = Registry.get(el.dataset.cid),
                                    actionBar=model.el.tfTag('tb-'+model.type+'-bar')[0];
                                    if(model.isEmpty!==true){
                                        if(actionBar){
                                            if(!actionBar.contains(target)){
                                                const editBtn=actionBar.shadowRoot.querySelector('.edit');
                                                if(editBtn){
                                                    Themify.triggerEvent(editBtn,_CLICK_);
                                                }
                                            }
                                        }
                                        else{
                                            this._click(e);
                                        }
                                    }
                                }
                            }
                        }
                    });
                    if(!themifyBuilder.disableShortcuts){
                        const canvas = isFrontend ? null : doc.tfId('tb_canvas_block');

                        if (canvas === null) {
                            doc.tfOn('keydown', e=>{
                                this.actions(e);
                            });
                            topWindowDoc.tfOn('keydown', e=>{
                                this.actions(e);
                            });
                        } else {
                            canvas.tfOn('keydown', e=>{
                                this.actions(e);
                            });
                        }
                    }
                }
            }, true,api.is_builder_ready);
        },
        async actions(e) {
            const target = e.target,
                tagName = target.tagName;
                if (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && !doc.activeElement.isContentEditable && !api.LightBox.el.contains(target)  && (!isFrontend ||!api.activeModel?.el?.contains(doc.activeElement))) {
                    const code = e.code,
                        items = api.Builder.get().el.tfClass('tb_element_clicked');
                    let len = items.length;
                    if (len > 0) {
                        let act=e.action,
                            pasteStyle=true;
                        if(!act){
                            if (code === 'Delete') {
                                act = 'delete';
                            } 
                            else if (e.ctrlKey === true || e.metaKey === true) {
                                if (code === 'KeyC') {
                                    act = 'copy';
                                } 
                                else if (code === 'KeyD') {
                                    act = 'duplicate';
                                } 
                                else if (code === 'KeyV') {
                                    act = 'paste';
                                }
                            }
                        }
                        if(act){
                            if(act==='copy'){
                                len=1;
                            }
                            else if(act==='paste'){
                                pasteStyle = e.shiftKey === true;
                            }
                            if(typeof e.preventDefault==='function'){
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if(act === 'delete' || act === 'paste'){
                                await api.LightBox.save();
                            }
                            api.undoManager.start(act);
                            const proms=[];
                            for (let i = len - 1; i > -1; --i) {
                                let selected = items[i].closest('[data-cid]');
                                if(selected!==null){
                                    let el=Registry.get(selected.dataset.cid);
                                    if(el){
                                        proms.push(el[act](pasteStyle,true));
                                    }
                                }
                            }
                            if (act === 'delete') {
                                this.clear();
                            }
                            try{
                                await Promise.all(proms);
                            }
                            catch (e){

                            }
                            api.undoManager.end(act);
                        }
                    }
                }
        },
        columnDragers(el){
            let col = el.parentNode,
               items = api.Builder.get().el.querySelectorAll('.tb_hide_drag_left,.tb_hide_drag_right'),
               left = col.offsetLeft,
               offset=api.isVisual?3:13;
            for (let i = items.length - 1; i > -1; --i) {
                items[i].classList.remove('tb_hide_drag_left', 'tb_hide_drag_right');
            }
            if (left<=offset) {
                col.classList.add('tb_hide_drag_left');
            }
            if ((left + col.offsetWidth+offset) >= col.parentNode.offsetWidth) {
                col.classList.add('tb_hide_drag_right');
            }
        },
        hover(e) {
            const target=e.target;
            if (api.isPreview!==true && !bodyCl.contains('tb_start_animate') && this.disable === null && target.id!=='tb_small_toolbar_root') {
                if (api.isVisual) {
                    api.EdgeDrag.setTimer(target);
                    api.EdgeDrag.clearTimer(e.clientX,e.clientY);
                }
                if (this.disablePosition === null) {
                    const el=target.closest('[data-cid]');
                    if(el!==null && !el.classList.contains('tb_active_layout_part')){
                        const cid=el.dataset.cid,
                            model = Registry.get(cid);
                        if(this.cid!==cid){
                            this.clear();
                            if(target.classList.contains('tb_grid_drag')){
                                this.columnDragers(target);
                            }
                            const actionBar=model.type==='module'?el.querySelector(':scope > .tb_'+model.type+'_action'):(target.classList.contains('tb_action_wrap')?target:null);
                            if (actionBar) {
								this.cid=cid;
								let slug=  model.get('mod_name'),
                                    cl='tb_bar',
                                    t = doc.createElement('tb-'+model.type+'-bar'),
                                    actionWrap=actionBar.tfClass('tb_action_wrap')[0];
								if(model.isEmpty===true){
									cl+=' tb_disabled_module';
								}
								else if(model.isSubCol===true){
									cl+=' tb_bar_sub_column';
								}
                                else if(slug==='row'){
                                    if(model.el.classList.contains('tb-page-break')){
                                        slug='page_break';
                                    }
                                    else{
                                        let p=el.parentNode,
                                            last=p.lastElementChild.previousElementSibling;
                                        while(!last.classList.contains('module_row')){
                                            last=last.previousElementSibling;
                                        }
                                        if(el===p.firstElementChild){
                                            cl+=' tb_row_first';
                                        }
                                        if(el===last){
                                            cl+=' tb_row_last';
                                        }
                                    }
								}
                                cl+=' tb_bar_'+slug;
								if(api.activeBreakPoint!=='desktop'){
									cl+=' tb_bar_responsive_mode';
								}
                                t.className=cl;
								//actionBar.style.marginTop='';
								actionBar.id='tb_component_bar';
                                actionWrap?.replaceWith(t) || actionBar.appendChild(t);
                                api.Utils.addViewPortClass(t.shadowRoot.querySelector('.dropdown'));
                                /*
								if (model.type === 'module') {
									const rect = el.getBoundingClientRect();
									if (rect.height < 70) {
										const cl = t.shadowRoot.querySelector('.wrap,.dropdown').classList,
                                            a_top = actionBar.getBoundingClientRect().top;
										//cl.toggle('small_bottom',!(a_top < 40 || (a_top - api.Builder.get().el.getBoundingClientRect().top) < 40));
									}
								}*/
							}
                            if (api.isVisual) {
                                api.EdgeDrag.addEdges(model);
                            }
                        }
                    }
                    else{
                        this.clear();
                    }
                }
            }
        },
        async _click(e) {
            if (api.isPreview || this.disable === true || e.target.closest('.tb_disable_sorting,.tb_grid_drag')!==null) {
                return;
            }
            const target = e.target,
                el = target.closest('[data-cid]');
            if(!el || (target.tagName.indexOf('-')!==-1 && !target.closest('.module'))){
                return;
            }
            e.preventDefault();
            const model = Registry.get(el.dataset.cid);
            if(model && model.isEmpty!==true){
                if(e.ctrlKey===true || e.metaKey===true){
                    el.classList.toggle('tb_element_clicked');
                }
                else if ((e.type==='dblclick' || api.isDocked) && !el.classList.contains('tb_active_layout_part')) {
                    try{
                        clearTimeout(clickTimer);
                        const isSame=api.activeModel?.id===model.id;
                        await model.edit();
                        clickTimer=setTimeout(()=>{
                            const repeatEl=target.closest('.tb_is_repeat');
                            if(repeatEl){
                                let index=repeatEl.dataset.swiperSlideIndex;
                                index=index!=='' && index!==undefined?~~index:Themify.convert(repeatEl.parentNode.children).indexOf(repeatEl);
                                if((!isSame && index>0) || (isSame && index!==-1)){
                                    const lb=api.LightBox.el.querySelector('#tb_lightbox_container'),
                                        row=lb.tfClass('tb_repeatable_field')[index];
                                    if(row){
                                        if(!isSame){
                                            lb.style.scrollBehavior = 'auto';
                                        }
                                        row.scrollIntoView();
                                        lb.style.scrollBehavior = '';
                                    }
                                }
                            }
                            clickTimer=null;
                        },(isSame?5:20));
                    }
                    catch(e){
                        
                    }
                }
            }
        },
        clear() {
            if(this.disableClear!==true){
                for(let bars = api.Builder.get().el.querySelectorAll('#tb_component_bar'),i=bars.length-1;i>-1;--i){
                    let last=bars[i].lastChild;
                    bars[i].removeAttribute('id');
                    if(last.tagName!=='SVG'){
                        last.remove();
                    }
                }
                this.cid=null;
            }
        },
        clearClicked() {
            if(this.disableClear!==true){
                for (let selected = api.Builder.get().el.querySelectorAll('.tb_element_clicked,.tb_current_module'),i = selected.length - 1; i > -1; --i) {
                    selected[i].classList.remove('tb_element_clicked','tb_current_module');
                }
            }
        }
    };
    Themify.on('tb_toolbar_loaded', () => {
            api.ActionBar._init();
    }, true,api.ToolBar?.isLoaded===true);
    
})(tb_app,_CLICK_,topWindowDoc);