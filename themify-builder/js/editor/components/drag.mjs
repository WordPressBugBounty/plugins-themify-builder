((api,body,topBody,bodyCl,topWindowDoc) => {
    "use strict";
    const {isFrontend,Registry,ActionBar,ToolBar}=api;
    api.Drag = context => {
        if (api.isGSPage === true) {
            return;
        }
        const contextDoc=context.ownerDocument,
            captureDrag=!isFrontend && contextDoc!==doc;
        let clicked,
            pointerDrag=null;
        const getDragTarget=(el,path)=>{
                let target=el?.closest?.('[draggable]');
                /*
                 * Row/column/subrow move controls live inside action-bar Shadow DOM.
                 * Element.closest() cannot cross that boundary, so resolve the real
                 * draggable Builder element from the composed event path when the
                 * pointer originated from the action bar move control.
                 */
                if(!target && el?.closest?.('.tb_move') && path){
                    for(let i=0;i<path.length;++i){
                        const item=path[i];
                        if(item?.nodeType===1 && item.matches?.('[draggable]')){
                            target=item;
                            break;
                        }
                    }
                }
                if(api.activeBreakPoint !== 'desktop' && target){
                    target=target.closest('.module_column');
                }
                if(!target || (api.activeBreakPoint !== 'desktop' && target.classList.contains('active_module'))){
                    return null;
                }
                return target;
            },
            clearPointerDrag=(state,suppressClick=false)=>{
                if(!state){
                    return;
                }
                const {sourceDoc,move,up,overlay,target}=state;
                sourceDoc.removeEventListener('pointermove',move,true);
                sourceDoc.removeEventListener('pointerup',up,true);
                sourceDoc.removeEventListener('pointercancel',up,true);
                overlay?.remove();
                if(suppressClick && target){
                    const stopClick=e=>{
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    };
                    target.addEventListener('click',stopClick,{capture:true,once:true});
                    setTimeout(()=>target.removeEventListener('click',stopClick,true));
                }
                if(pointerDrag===state){
                    pointerDrag=null;
                }
            },
            preparePointerDrag=(down,target)=>{
                const builder=api.Builder.get?.()?.el,
                    builderDoc=builder?.ownerDocument;
                if(isFrontend || !builder || builderDoc===doc || !target){
                    return;
                }
                clearPointerDrag(pointerDrag);
                const sourceDoc=target.ownerDocument,
                    builderFrame=builderDoc.defaultView?.frameElement,
                    startX=down.clientX,
                    startY=down.clientY,
                    dataTransfer={
                        effectAllowed:'move',
                        dropEffect:'move',
                        setData(){},
                        getData(){return '';},
                        setDragImage(){}
                    },
                    makeEvent=(type,eventDoc,x,y)=>{
                        const ev=new eventDoc.defaultView.Event(type,{bubbles:true,cancelable:true,composed:true});
                        Object.defineProperties(ev,{
                            clientX:{value:x},
                            clientY:{value:y},
                            dataTransfer:{value:dataTransfer}
                        });
                        ev.tbPointerDrag=true;
                        return ev;
                    },
                    getCanvasPoint=e=>{
                        if(sourceDoc===builderDoc){
                            const clientX=e.clientX,
                                clientY=e.clientY;
                            return {clientX,clientY,hit:builderDoc.elementFromPoint(clientX,clientY)};
                        }
                        if(!builderFrame){
                            return null;
                        }
                        const rect=builderFrame.getBoundingClientRect(),
                            scaleX=rect.width?builderFrame.offsetWidth/rect.width:1,
                            scaleY=rect.height?builderFrame.offsetHeight/rect.height:1,
                            clientX=((e.clientX-rect.left)*scaleX)-builderFrame.clientLeft,
                            clientY=((e.clientY-rect.top)*scaleY)-builderFrame.clientTop;
                        if(clientX<0 || clientY<0 || clientX>builderDoc.documentElement.clientWidth || clientY>builderDoc.documentElement.clientHeight){
                            return null;
                        }
                        return {clientX,clientY,hit:builderDoc.elementFromPoint(clientX,clientY)};
                    };
                let overlay=null;
                if(sourceDoc!==builderDoc && builderFrame){
                    const rect=builderFrame.getBoundingClientRect();
                    overlay=sourceDoc.createElement('div');
                    overlay.className='tb_iframe_pointer_bridge';
                    Object.assign(overlay.style,{
                        position:'fixed',
                        left:rect.left+'px',
                        top:rect.top+'px',
                        width:rect.width+'px',
                        height:rect.height+'px',
                        zIndex:'2147483646',
                        background:'transparent',
                        pointerEvents:'auto'
                    });
                    sourceDoc.body.appendChild(overlay);
                }
                const state={sourceDoc,target,builder,builderDoc,builderFrame,overlay,dataTransfer,started:false,lastHit:null,move:null,up:null};
                state.move=e=>{
                    if(e.pointerId!==down.pointerId){
                        return;
                    }
                    if(state.overlay && state.builderFrame){
                        const rect=state.builderFrame.getBoundingClientRect();
                        Object.assign(state.overlay.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
                    }
                    if(!state.started){
                        if(Math.abs(e.clientX-startX)<5 && Math.abs(e.clientY-startY)<5){
                            return;
                        }
                        state.started=true;
                        clicked=target;
                        target.dispatchEvent(makeEvent('dragstart',sourceDoc,e.clientX,e.clientY));
                    }
                    e.preventDefault();
                    const point=getCanvasPoint(e);
                    if(point?.hit && builder.contains(point.hit)){
                        state.lastHit=point.hit;
                        point.hit.dispatchEvent(makeEvent('dragover',builderDoc,point.clientX,point.clientY));
                    }
                };
                state.up=e=>{
                    if(e.pointerId!==down.pointerId){
                        return;
                    }
                    const started=state.started;
                    if(started){
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        const point=getCanvasPoint(e),
                            dropped=builder.querySelector('[data-pos]') || (point?.hit && builder.contains(point.hit)?point.hit:state.lastHit);
                        if(dropped){
                            const rect=dropped.getBoundingClientRect(),
                                x=point?.clientX ?? (rect.left+rect.width/2),
                                y=point?.clientY ?? (rect.top+rect.height/2);
                            dropped.dispatchEvent(makeEvent('drop',builderDoc,x,y));
                        }
                        target.dispatchEvent(makeEvent('dragend',sourceDoc,e.clientX,e.clientY));
                    }
                    clearPointerDrag(state,started);
                    clicked=null;
                };
                pointerDrag=state;
                sourceDoc.addEventListener('pointermove',state.move,{capture:true,passive:false});
                sourceDoc.addEventListener('pointerup',state.up,{capture:true,passive:false});
                sourceDoc.addEventListener('pointercancel',state.up,{capture:true,passive:false});
            };
        context.tfOn('pointerdown', e => {
            if (e.button === 0 && !api.isPreview && !e.target.closest('.tb_dragger,.tb_disable_sorting,.tb_editor_on')) {
                clicked = e.target;
                if (clicked.classList.contains('tb_grid_drag')) {
                    clicked=null;
                    e.preventDefault();
                    const obj=new api.columnResize();
                    obj.start(e);
                }
                else if(clicked.tagName.indexOf('TB-')===0){//is our shadow dom event
                    clicked=e.composedPath()[0];
                    if(clicked.closest('.tab')){
                        clicked=null;
                    }
                }
                if(clicked){
                    preparePointerDrag(e,getDragTarget(clicked,e.composedPath?.()));
                }
            } else {
                clicked = null;
            }
        }, {
            passive: false,
            capture:captureDrag
        })
        .tfOn('dragstart', function (e) {
            if(api.isPreview===true){
                return;
            }
            if(pointerDrag && !e.tbPointerDrag){
                e.preventDefault();
                return;
            }
            if(!clicked || e.target.nodeType === Node.TEXT_NODE){
                e.preventDefault();
                clicked = null;
                return;
            }
            let target = getDragTarget(e.target);
            if(!target){
                e.preventDefault();
                clicked = null;
                return;
            }
            let  targetCl = target.classList,
                isRow = targetCl.contains('module_row'),
                isRowSort = isRow,
                isColumnMove = !isRow && targetCl.contains('module_column');
            if (!isRow && !isColumnMove) {
                isRow = targetCl.contains('page_break_module') || targetCl.contains('predesigned_row') || targetCl.contains('tb_item_row');
            }
            clicked = null;
            e.stopImmediatePropagation();

            let ghostClone,
                    ghostCloneH,
                    holder = null,
                    type = isRow ? 'row' : (isColumnMove ? 'column_move' : (targetCl.contains('tb_grid') ? 'column' : 'module')),
                    cl = [type],
                    y = 0,
                    x = 0,
                    prevItem,
                    isDropped,
                    scrollInterval,
                    scrollEl,
                    isScrolling = null,
                    scrollKoef,
                    scrollStep,
                    scrollReq,
                    topScroll = [ToolBar.el.getRootNode().host, topWindowDoc.tfId('tb_fixed_bottom_scroll')],
                    builder = api.Builder.get().el,
                    builderDoc=builder.ownerDocument,
                    builderBody=builderDoc.body,
                    builderFrame=builderDoc.defaultView?.frameElement,
                    sourceDoc=target.ownerDocument,
                    isIframeBuilder=!isFrontend && builderDoc!==doc,
                    dragUiBody=sourceDoc===builderDoc?builderBody:body,
                    dragBridge=null,
                    crossFrameDrag=null,
                    builderDrop=null,
                    dragStarted=false,
                    classItems=[topBody],
                    ghost = createElement('','tb_sortable_helper tf_box tf_overflow');
            const _FRAME_ = 5,
                    onDragScroll = id => {
                        scrollReq=requestAnimationFrame(()=>{
                            let top=scrollStep * scrollKoef,
                                scrollY=scrollEl.scrollY??scrollEl.scrollTop;
                            if(id === 'tb_main_toolbar_root' || id === 'wpadminbar'){
                                top*=-1;
                            }
                            scrollEl.scroll({
                                top:scrollY+top,
                                behavior: 'instant'
                            });
                            onDragScroll(id);
                        });
                    },
                    dragScrollEnter=function () {
                        clearInterval(scrollInterval);
                        scrollKoef = 5;
                        scrollInterval = setInterval(() => {
                            if (scrollKoef < 51) {
                                scrollKoef += 5;
                            } else {
                                clearInterval(scrollInterval);
                                scrollInterval = null;
                            }
                        }, 1200);
                        prevItem = null;

                        if (holder !== null) {
                            holder.style.display = 'none';
                        }
                        for (let items = builder.querySelectorAll('[data-pos]'), i = items.length - 1; i > -1; --i) {
                            items[i].removeAttribute('data-pos');
                        }
                        if (isScrolling === null) {
                            isScrolling = true;
                            onDragScroll(this.id);
                        }
                    },
                    dragScrollLeave=()=>{
                        clearInterval(scrollInterval);
                        cancelAnimationFrame(scrollReq);
                        isScrolling = scrollInterval =scrollKoef=scrollReq= null;
                    },
                    dragScroll = off => {
                        if (off === true) {
                            for (let i = topScroll.length - 1; i > -1; --i) {
                                topScroll[i].tfOff('dragenter', dragScrollEnter, {passive: true})
                                .tfOff('dragleave', dragScrollLeave, {passive: true});
                            }
                            if (isRow && api.isVisual) {
                                ToolBar.zoom({item: ToolBar.el.querySelector('[data-zoom="100"]')});
                            }
                            dragScrollLeave();
                            topScroll = scrollStep=scrollEl= null;
                            return;
                        }
                        scrollStep=1;
                        if (!isFrontend) {
                            scrollEl = ToolBar.el.getRootNode().host.closest('.interface-interface-skeleton__content') || doc.tfClass('edit-post-layout__content')[0];
                            scrollStep /= 2;
                        }
                        if (!scrollEl) {
                            scrollEl = api.activeBreakPoint === 'desktop' ? window : topWindow;
                        }
                        if (scrollEl) {
                            if (isRow && api.isVisual) {
                                ToolBar.zoom({item: ToolBar.el.querySelector('[data-zoom="50"]')});
                            }
                            for (let i = topScroll.length - 1; i > -1; --i) {
                                topScroll[i].tfOn('dragenter', dragScrollEnter, {passive: true})
                                        .tfOn('dragleave', dragScrollLeave, {passive: true});
                            }
                        }
                    },
                    reject = e => {
                        e.dataTransfer.dropEffect = e.dataTransfer.effectAllowed = 'none';
                        prevItem?.removeAttribute('data-pos');
                        if (holder !== null) {
                            holder.style.display = 'none';
                        }
                    },
                    onDragOver =  e=> {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        let {target:dragged,clientY,clientX} = e;
                        if (ghostClone) {
                            ghostClone.style.top = (clientY - ghostCloneH) + 'px';
                        }
                        if (!dragged || isScrolling !== null || dragged === target || !builder.contains(dragged) || (type === 'module' && dragged.classList.contains('module_row'))) {
                            reject(e);
                            return;
                        }

                        if (holder !== null && (dragged === holder ||dragged.classList.contains('tb_sortable_placeholder'))) {
                            return;
                        }
                        e.dataTransfer.effectAllowed = 'move';
                        if (y === 0 || x === 0 || (clientY - y) > _FRAME_ || (y - clientY) > _FRAME_ || (clientX - x) > _FRAME_ || (x - clientX) > _FRAME_) {
                            y = clientY;
                            x = clientX;
                            const rect = dragged.getBoundingClientRect();
                            let side = (((y - rect.top) / rect.height) > .5) ? 'bottom' : 'top';
                            if (isColumnMove === true) {
                                let inner,
                                    cl=dragged.classList;
                                if(cl.contains('row_inner') || cl.contains('module_subrow')){
                                    inner=dragged;
                                    dragged=inner.tfClass('module_column')[0];
                                    side=null;
                                }
                                else if (cl.contains('tb_col_side')) {
                                    side = cl[1].replace('tb_col_side_', '');
                                    dragged = dragged.parentNode;
                                    inner = dragged.parentNode;
                                } else if (cl.contains('module_column')) {
                                    side = (((x - rect.left) / rect.width) > .5) ? 'right' : 'left';
                                    inner = dragged.parentNode;
                                } else {
                                    return;
                                }
                                let w = inner.dataset.dragW,
                                        _area = dragged.dataset.dragArea;
                                if (!w || !_area) {
                                    const computed = getComputedStyle(inner);
                                    if (!w) {
                                        const c=inner.closest('[data-cid]');
                                        if(!c){
                                            return;
                                        }
                                        const inner_w = inner.offsetWidth;
                                        let gutter=Registry.get(c.dataset.cid).getSizes('gutter');
                                            gutter=gutter?ThemifyStyles.getGutterValue(gutter):'';
                                        if (!gutter) {
                                            gutter = computed.getPropertyValue('--colg');
                                        }
                                        let gutterUnit = gutter.replace(parseFloat(gutter).toString(), '') || '%';
                                        gutter = parseFloat(gutter);
                                        if (gutter === 0) {
                                            w = 'none';
                                        } else {
                                            if (gutterUnit === '%') {
                                                w = parseFloat(parseFloat((inner_w * gutter) / 100).toFixed(2)).toString();
                                            } else if (gutterUnit === 'em') {
                                                w = gutter * parseFloat(computed.getPropertyValue('font-size'));
                                            } else {
                                                w = gutter;
                                            }
                                        }
                                        inner.dataset.dragW=w;
                                        for (let cols = inner.children, i = cols.length - 1; i > -1; --i) {
                                            if(cols[i].classList.contains('module_column')){
                                                for (let sides = cols[i].children, j = sides.length - 1; j > -1; --j) {
                                                    let side=sides[j],
                                                            st=side.style;
                                                    if (side.classList.contains('tb_col_side')) {
                                                        st.marginLeft=st.marginRight='';
                                                        let p = side.classList.contains('tb_col_side_right') ? '50' : '-50';
                                                        st.width = w === 'none' ? '' : (w + 'px');
                                                        st.transform = w === 'none' ? 'translateX(' + p + '%)' : '';

                                                        let left=side.getBoundingClientRect().left;
                                                        if(left<0){
                                                            st.marginLeft='10px';
                                                        }
                                                        else if(left>=builderDoc.documentElement.clientWidth){
                                                            st.marginRight='10px';
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (!_area) {
                                        _area = computed.getPropertyValue('--area');
                                        if (!_area) {
                                            _area = '1';
                                        } else {
                                            _area = _area.split('" "');
                                            for (let i = _area.length - 1; i > -1; --i) {
                                                let r = _area[i].replaceAll('"', '').split(' ');
                                                r = Array.from(new Set(r));
                                                _area[i] = r.join(' ');
                                            }
                                            _area = '"' + _area.join('" "') + '"';
                                        }
                                        inner.dataset.dragArea= _area;
                                    }
                                }
                                if(side===null){
                                    return;
                                }
                                cl=dragged.classList;//dragged maybe changed
                                if (_area !== '1' && !cl.contains('tb_drag_side_column') && !cl.contains('tb_drag_one_column')) {
                                    const colArea = getComputedStyle(dragged).getPropertyValue('grid-area').split('/')[0].replace('"', '').trim();
                                    if (api.activeBreakPoint!=='desktop' && !_area.includes(colArea + ' ') && !_area.includes(' ' + colArea)) {
                                        cl.add('tb_drag_one_column');
                                    } else {
                                        cl.add('tb_drag_side_column');
                                    }
                                }
                                if (cl.contains('tb_drag_one_column')) {
                                    side = (((y - rect.top) / rect.height) > .5) ? 'right' : 'left';
                                }
                            }
                            if (dragged !== topScroll[0] && dragged !== topScroll[1]) {
                                if (!ghostClone && isColumnMove === false) {
                                    const cl=dragged.classList;
                                    if(cl.contains('tb_active_builder')){
                                        dragged=side==='top'?dragged.firstElementChild:dragged.lastElementChild.previousElementSibling;
                                    }
                                    else{
                                        if (cl.contains('module_column')) {
                                            dragged = dragged.tfClass('tb_holder')[0];
                                            if (!dragged) {
                                                reject(e);
                                                return;
                                            }
                                        } 
                                        else if (cl.contains('tb_dragger')) {
                                            dragged = dragged.parentNode;
                                        }
                                        if (dragged.classList.contains('tb_holder') && dragged.childElementCount > 0) {
                                            dragged = side === 'top' && dragged.firstChild !== target ? dragged.firstChild : dragged.lastChild;
                                            if (dragged === target) {
                                                reject(e);
                                                return;
                                            }
                                        }
                                    }
                                }
                                if (prevItem && prevItem !== dragged) {
                                    if (isColumnMove === false) {
                                        const sibling = side === 'top' ? dragged.previousSibling : dragged.nextElementSibling;
                                        if (sibling === prevItem) {
                                            const prevPos = sibling.dataset.pos;
                                            if ((side === 'top' && prevPos === 'bottom') || (side === 'bottom' && prevPos === 'top')) {
                                                return;
                                            }
                                        }
                                    }
                                    prevItem.removeAttribute('data-pos');
                                }
                                if (dragged.dataset.pos !== side) {
                                    dragged.dataset.pos=side;
                                    if (holder !== null) {
                                        holder.style.display = '';
                                        if (dragged.classList.contains('tb_holder')) {
                                            dragged.appendChild(holder);
                                        } else {
                                            side === 'top' ? dragged.before(holder) : dragged.after(holder);
                                        }
                                    }
                                }
                                prevItem = dragged;
                            }
                        }
                    },
                    onDragStart = function (e) {
                        if(dragStarted){
                            return;
                        }
                        dragStarted=true;
                        Themify.trigger('disableInline');
                        e.stopImmediatePropagation();
                        classItems.push(api.MainPanel.el,ToolBar.el.getRootNode().host);
                        for(let i=classItems.length-1;i>-1;--i){
                            classItems[i].classList.add('tb_start_animate', 'tb_drag_start', 'tb_drag_' + cl[0]);
                            if(cl[1]){
                                classItems[i].classList.add(cl[1]);
                            }
                        }
                        api.SmallPanel.hide();
                        ActionBar.clear();
                        ActionBar.disable=true;
                        this.classList.add('tb_draggable_item');
                        if (isColumnMove === true) {
                            this.parentNode.classList.add('tb_column_drag_inner');
                            const innsers = builder.querySelectorAll('.row_inner,.module_subrow');
                            for (let i = innsers.length - 1; i > -1; --i) {
                                let childs = innsers[i].children,
                                        w = innsers[i].getBoundingClientRect().width - 5;

                                for (let j = childs.length - 1; j > -1; --j) {
                                    if (childs[j].classList.contains('module_column') && (childs[j].offsetWidth + childs[j].offsetLeft) < w) {
                                        childs[j].classList.add('tb_hide_drag_col_right');
                                    }
                                }
                            }
                        }
                        dragScroll();
                        if (ghostClone) {
                            ghostClone.style.top = e.clientY + 'px';
                        }
                    },
                    mouseEvent = e => {
                        e.stopImmediatePropagation();
                    },
                    onDrop =  async e=> {
                        const eventTarget=e?.target?.nodeType===1?e.target:null;
                        if (eventTarget) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        }
                        isDropped = true;
                        let dropped=eventTarget || (e?.nodeType===1?e:null);
                        if(!dropped){
                            target.classList.remove('tb_draggable_item');
                            return;
                        }
                        if (dropped.classList.contains('module_column') || dropped.classList.contains('tb_col_side')) {
                            dropped = isColumnMove ? dropped.closest('.module_column') : dropped.querySelector('[data-pos]');
                        } 
                        else if (isColumnMove) {
                            dropped = null;
                            for (let items = builderDoc.getElementsByClassName('tb_column_drag_inner'), i = items.length - 1; i > -1; --i) {
                                items[i].classList.remove('tb_column_drag_inner');
                            }
                        } 
                        else if(dropped.classList.contains('tb_active_builder')){
                            const row=dropped.firstElementChild;
                            dropped=row?.dataset.pos?row:dropped.lastElementChild?.previousElementSibling;
                        }
                        else if (dropped.classList.contains('tb_dragger')) {
                            dropped = dropped.closest('[draggable]');
                        }
                        if(!dropped){
                            target.classList.remove('tb_draggable_item');
                            return;
                        }
                        if (dropped === holder || dropped.classList.contains('tb_sortable_placeholder')) {
                            dropped = dropped.closest('.tb_active_builder')?.querySelector('[data-pos]');
                            if (dropped?.classList.contains('tb_sortable_placeholder')) {
                                dropped = dropped.closest('.tb_holder');
                            }
                        }
                        if (!dropped || (type === 'module' && dropped.classList.contains('module_row'))) {
                            target.classList.remove('tb_draggable_item');
                            return;
                        }
                        let draggedRow=target.closest('.module_row'),
                            isSort= draggedRow!==null,
                            dragged =  isSort?target:target.cloneNode(true),
                            side = dropped.dataset.pos;


                        holder?.remove();
                        if(dragged===dropped){
                            target.classList.remove('tb_draggable_item');
                            return;
                        }
                        api.undoManager.start('move');
                        target.classList.remove('tb_draggable_item');//don't change position,should be after undomanager start,need for undo   
                        const builderEditSlug=api.isVisual?undefined:window.TB_BuilderContentLightbox?.getActiveEl()?.manager.get('mod_name');
                        if(!isSort){
                            dragged.style.display='none';
                        }
                        else if(dragged.classList.contains('active_subrow')){
                            const parent=dragged.parentNode, 
                                parentCl=parent.classList;
                            if(parent.childElementCount===1 && (parentCl.contains('tab-content') || parentCl.contains('accordion-content'))){
                                const dummy=createElement();
                                parent.prepend(dummy);
                                api.Drop.row(dummy,'grid',1,false);
                            }
                        }

                        if (!dropped.classList.contains('tb_holder')) {
                            if (!isColumnMove) {
                                const parentCl=dropped.parentNode.classList;
                                if(type==='module' && (parentCl.contains('tab-content') || parentCl.contains('accordion-content')|| ( (builderEditSlug==='accordion' || builderEditSlug==='tab') && !dragged.classList.contains('active_subrow') && !dropped.closest('.module_subrow')))){
                                    const subrow=new api.Subrow({cols:[{}]});
                                    subrow.el.tfClass('tb_holder')[0].appendChild(dragged);
                                    side === 'top' ?dropped.before(subrow.el):dropped.after(subrow.el);
                                }
                                else{
                                    side === 'top' ?dropped.before(dragged):dropped.after(dragged);
                                }
                            } 
                        } 
                        else {
                            dropped.appendChild(dragged);
                        }  
                        if(isColumnMove || isSort){
                            if(isColumnMove){
                                await api.Drop.column(dragged, dropped, side);
                            }
                            Themify.trigger('tb_' + type + '_sort', [dragged]);
                            api.Utils.onResize(true);
                            api.undoManager.end('move');
                        }
                        else{//new element: dragged element will be replaced
                            //
                            //row,module
                            let dropType=targetCl.contains('tb_grid')?'grid':(targetCl.contains('page_break_module')?'pagebreak':'predesign'),
                                slug=target.dataset.slug,
                                dropHandler=dropType==='grid'?'row':type;
                            if(target.dataset.type){
                                dropType=target.dataset.type;
                                if(dropHandler==='row' && targetCl.contains('library_item')){
                                    dropType='library';
                                }
                            }
                            try{
                                await api.Drop[dropHandler](dragged,dropType,slug);
                                Themify.trigger('tb_' + type + '_sort', [dragged]);
                                if(dropHandler==='module' && dropType !== 'part' && dropType !== 'module'){
                                    api.undoManager.clear('move');
                                }
                                else{
                                    api.undoManager.end('move');
                                }
                            }catch (e) {
                                api.undoManager.clear('move');
                            }
                        }
                    };

            if (targetCl.contains('active_subrow')) {
                cl.push('tb_drag_subrow');
            }
            if (isRowSort) {
                bodyCl.add('tb_drag_row');
                if (!api.isVisual) {
                    ghostClone = ghost.cloneNode();
                    ghost.style.opacity = 0;
                    const b = target.getBoundingClientRect();
                    ghostClone.style.width = b.width + 'px';
                    ghostClone.style.left = b.left + 'px';
                    ghostClone.innerHTML = 'Row';
                    dragUiBody.appendChild(ghostClone);
                    ghostCloneH = ghostClone.offsetHeight / 2;
                }else{
                    ghost.innerHTML = 'Row';
                }
            } 
            else if (type === 'module' || isColumnMove) {
                if (isColumnMove || targetCl.contains('active_subrow')) {
                    ghost.innerHTML = isColumnMove ? 'Column' : 'Subrow';
                }
                else {
                    const slug = target.dataset.slug || Registry.get(target.dataset.cid).get('mod_name'),
                        m=themifyBuilder.modules[slug];
                    if (m) {
                        const icon = m.icon,
                            name = createElement('span','tf_vmiddle',m.name);
                        if (icon) {
                            ghost.appendChild(api.Helper.getIcon('ti-' + icon));
                        }
                        ghost.appendChild(name);
                    }
                }
            } 
            else if (type === 'column') {
                ghost.className+=' '+target.className;
                ghost.innerHTML=target.innerHTML;
            }
            else if (type === 'row' && (targetCl.contains('page_break_module') || targetCl.contains('predesigned_row'))) {
                const tmpCl = targetCl.contains('page_break_module') ? 'page_break_title' : 'predesigned_title';
                ghost.textContent = target.tfClass(tmpCl)[0].textContent;
            }
            if (isRow) {
                holder = createElement('','tb_sortable_placeholder tf_rel tf_w');
            }
            ghost.style.top='-1000px';
            ghost.tfClass('add_module_btn')[0]?.remove();
            dragUiBody.appendChild(ghost);

            e.dataTransfer.effectAllowed='move';
            e.dataTransfer.setData('Text', 'id');//required for touch dnd
            e.dataTransfer.setDragImage(ghost, (ghost.offsetWidth / 2) + 2, (ghost.offsetHeight / 2));

            if(isIframeBuilder && sourceDoc!==builderDoc && builderFrame && !e.tbPointerDrag){
                const frameRect=builderFrame.getBoundingClientRect(),
                    bridge=doc.createElement('div'),
                    bridgeStyle=bridge.style,
                    toCanvasEvent=(e,stopSource=true)=>{
                        const rect=builderFrame.getBoundingClientRect(),
                            scaleX=rect.width?builderFrame.offsetWidth/rect.width:1,
                            scaleY=rect.height?builderFrame.offsetHeight/rect.height:1,
                            clientX=((e.clientX-rect.left)*scaleX)-builderFrame.clientLeft,
                            clientY=((e.clientY-rect.top)*scaleY)-builderFrame.clientTop,
                            hit=clientX>=0 && clientY>=0 && clientX<=builderDoc.documentElement.clientWidth && clientY<=builderDoc.documentElement.clientHeight
                                ?builderDoc.elementFromPoint(clientX,clientY)
                                :null;
                        return {
                            target:hit,
                            clientX,
                            clientY,
                            dataTransfer:e.dataTransfer,
                            preventDefault:()=>stopSource&&e.preventDefault(),
                            stopImmediatePropagation:()=>stopSource&&e.stopImmediatePropagation()
                        };
                    },
                    bridgeOver=e=>onDragOver(toCanvasEvent(e)),
                    bridgeDrop=e=>onDrop(toCanvasEvent(e));
                bridge.className='tb_iframe_drag_bridge';
                bridgeStyle.position='fixed';
                bridgeStyle.left=frameRect.left+'px';
                bridgeStyle.top=frameRect.top+'px';
                bridgeStyle.width=frameRect.width+'px';
                bridgeStyle.height=frameRect.height+'px';
                bridgeStyle.zIndex='2147483646';
                bridgeStyle.background='transparent';
                bridgeStyle.pointerEvents='auto';
                bridge.tfOn('dragover',bridgeOver).tfOn('drop',bridgeDrop);
                body.appendChild(bridge);
                dragBridge={el:bridge,over:bridgeOver,drop:bridgeDrop};
                crossFrameDrag=e=>{
                    if(e.clientX===0 && e.clientY===0){
                        return;
                    }
                    const rect=builderFrame.getBoundingClientRect();
                    if(e.clientX>=rect.left && e.clientX<=rect.right && e.clientY>=rect.top && e.clientY<=rect.bottom){
                        onDragOver(toCanvasEvent(e,false));
                    }
                };
                target.tfOn('drag',crossFrameDrag,{passive:false});
            }

            target.tfOn('dragend', function (e) {
                e.stopImmediatePropagation();
                if(isIframeBuilder){
                    builderDoc.removeEventListener('dragover',onDragOver,true);
                    builderDoc.removeEventListener('drop',builderDrop,true);
                }
                else{
                    builderBody.removeEventListener('dragover',onDragOver);
                    builder.tfOff('drop',onDrop,{once:true});
                }
                builder.tfOff(['dragenter', 'dragleave','pointermove','pointerover','pointerout','pointerenter','pointerleave','mousemove','mouseover','mouseout','mouseenter','mouseleave'], mouseEvent, {
                    passive: true
                });
                if(isIframeBuilder){
                    this.tfOff('drag',onDragStart,{once:true,passive:true});
                }
                else{
                    this.tfOff('drag',onDragStart,{once:true,passive:true});
                }
                if(crossFrameDrag){
                    this.tfOff('drag',crossFrameDrag,{passive:false});
                    crossFrameDrag=null;
                }
                if (!isDropped) {
                    const dropped = builder.querySelector('[data-pos]');
                    if (dropped) {
                        onDrop(dropped);
                    }
                }
                ActionBar.disable=null;
                if(dragBridge){
                    dragBridge.el.tfOff('dragover',dragBridge.over).tfOff('drop',dragBridge.drop).remove();
                    dragBridge=null;
                }
                ghost.remove();
                ghostClone?.remove();
                holder?.remove();
                for (let items = builderDoc.querySelectorAll('[data-drag-w],[data-drag-area],[data-pos]'), i = items.length - 1; i > -1; --i) {
                    items[i].removeAttribute('data-pos');
                    items[i].removeAttribute('data-drag-w');
                    items[i].removeAttribute('data-drag-area');
                }
                for (let items = builderDoc.querySelectorAll('.tb_hide_drag_col_right,.tb_drag_one_column,.tb_drag_side_column,.tb_column_drag_inner'), i = items.length - 1; i > -1; --i) {
                    items[i].classList.remove('tb_hide_drag_col_right', 'tb_drag_one_column', 'tb_drag_side_column', 'tb_column_drag_inner');
                }
                this.classList.remove('tb_draggable_item', 'tb_drag_one_column', 'tb_drag_side_column');
                dragScroll(true);
                if (!isFrontend) {
                    for(let drops=builderDoc.getElementsByClassName('is-drop-target'),i=drops.length-1;i>-1;--i){
                        drops[i].classList.remove('is-drop-target');
                    }
                }
                for(let i=classItems.length-1;i>-1;--i){
                    classItems[i].classList.remove('tb_start_animate', 'tb_drag_start','tb_drag_start_'+cl[0], 'tb_drag_' + cl[0]);
                    if(cl[1]){
                        classItems[i].classList.remove(cl[1]);
                    }
                }
                holder = isDropped = clicked = target = targetCl = prevItem = ghost = ghostClone = ghostCloneH = builder = builderDoc = builderBody = builderFrame = sourceDoc = dragUiBody = dragBridge = crossFrameDrag = builderDrop = x = y = cl = type = isColumnMove = classItems = null;
            }, {
                once: true,
                passive: true
            });

            if (builderBody!==topBody) {
                classItems.push(builderBody);
            }
            if (isFrontend && body!==builderBody) {
                classItems.push(body);
            }

            for(let i=classItems.length-1;i>-1;--i){
                classItems[i].classList.add('tb_drag_start_'+cl[0]);
                if(cl[1]){
                    classItems[i].classList.add(cl[1]);
                }
            }
            if(isIframeBuilder){
                onDragStart.call(target,e);
                builderDrop=ev=>{
                    if(builder.contains(ev.target)){
                        onDrop(ev);
                    }
                };
                builderDoc.addEventListener('dragover',onDragOver,{capture:true,passive:false});
                builderDoc.addEventListener('drop',builderDrop,{capture:true,once:true,passive:false});
            }
            else{
                target.tfOn('drag', onDragStart, {
                    once: true,
                    passive: true
                });
                builderBody.addEventListener('dragover', onDragOver);
                builder.tfOn('drop', onDrop, {
                    once: true
                });
            }
            builder.tfOn('dragenter dragleave', mouseEvent, {
                passive: true
            });
            if(!Themify.isTouch){
                builder.tfOn(['pointermove','pointerover','pointerout','pointerenter','pointerleave','mousemove','mouseover','mouseout','mouseenter','mouseleave'], mouseEvent, {
                    passive: true
                });
            }
        },{capture:captureDrag});
    };
    api.columnResize= class{
        start(e){
            let _this=this,
                target = e.target,
                ownerDoc = target.ownerDocument,
                ownerWin = ownerDoc.defaultView || window,
                cs = node => (node.ownerDocument.defaultView || ownerWin).getComputedStyle(node),
                dragIndexes = [],
                dragNextIndexes = [],
                el = target.parentNode,
                row_inner = el.parentNode,
                computed = cs(row_inner),
                childs=api.Utils.getColumns(row_inner),
                childCount = childs.length,
                row_w = row_inner.offsetWidth,
                dir = target.classList.contains('tb_drag_right') ? 'w' : 'e',
                rtlDir=Themify.isRTL?(dir==='w'?'e':'w'):dir,
                tooltip1 = ownerDoc.createElement('div'),
                tooltip2,
                dragColName = cs(el).getPropertyValue('grid-area').split('/')[0].replace('"', '').trim(),
                area = dragColName && dragColName !== 'auto' && dragColName !== 'initial' && dragColName !== 'none'? computed.getPropertyValue('--area').replace(/[\r\n]/gm, '').replace(/  +/g, ' ').trim().split('" "') : '',
                gutterVal = computed.getPropertyValue('column-gap'),
                gutter = parseFloat(gutterVal) || 0,
                cols = computed.getPropertyValue('--col').replace(/\s\s+/g, ' ').trim(),
                cell,
                percent = 100,
                summFr = 0,
                summEM = 0,
                summPx = 0;
            tooltip1.className='tb_grid_drag_tooltip';
            tooltip2=tooltip1.cloneNode(false);
            Themify.trigger('disableInline');
            if(cols==='none'){
                cols='';
            }
            else if (cols.includes('repeat')) {
                if (!cols.includes('auto-fit') && !cols.includes('auto-fill')) {
                    let tmp = '',
                        repeat = cols.replace(/\s\,\s|\s\,|\,\s/g, ',').replace(/\s\(\s|\s\(|\(\s/g, '(').replaceAll(' )', ')').trim().split(' ');

                    for (let i = 0; i < repeat.length; ++i) {
                        if (repeat[i].includes('repeat')) {
                            let item = repeat[i].split('(')[1].replace(')', '').split(','),
                                count = ~~item[0],
                                unit = item[1].trim();
                            if (isNaN(count)) {
                                unit = '1fr';
                                count = childCount;
                            }
                            tmp += ' ' + (' ' + unit).repeat(count);
                        } else {
                            tmp += ' ' + repeat[i];
                        }
                    }
                    cols = tmp.trim();
                } else {
                    cols = '';
                }
            }

            if (area) {
                let row = 0;
                for (let i = area.length - 1; i > -1; --i) {
                    if (area[i].includes(dragColName)) {
                        let arr = area[i].replace(/\s\s+/g, ' ').replaceAll('"', '').trim().split(' ');
                        for (let j = arr.length - 1; j > -1; --j) {
                            if (arr[j] === dragColName) {
                                dragIndexes.push(j);
                                row = i;
                            }
                        }
                        if (dragIndexes.length > 0) {
                            break;
                        }
                    }
                }
                if (dragIndexes.length > 0) {
                    const dragNextAreaIndex = rtlDir === 'w'?  Math.max.apply(null, dragIndexes) + 1 : Math.min.apply(null, dragIndexes) - 1,
                        dragNextColName = area[row].replace(/\s\s+/g, ' ').replaceAll('"', '').trim().split(' ')[dragNextAreaIndex]?.trim();
                        if(!dragNextColName){
                            return;
                        }
                    for (let i = area.length - 1; i > -1; --i) {
                        if (area[i].includes(dragNextColName)) {
                            let arr = area[i].replace(/\s\s+/g, ' ').replaceAll('"', '').trim().split(' ');
                            for (let j = arr.length - 1; j > -1; --j) {
                                if (arr[j] === dragNextColName) {
                                    dragNextIndexes.push(j);
                                }
                            }
                            if (dragNextIndexes.length > 0) {
                                break;
                            }
                        }
                    }
                    for (let i = childs.length - 1; i > -1; --i) {
                        if (el !== childs[i] && dragNextColName === cs(childs[i]).getPropertyValue('grid-area').split('/')[0].replace('"', '').trim()) {
                            cell = childs[i];
                            break;
                        }
                    }
                }
                const areaLength = area[0].trim().split(' ').length;
                if (!cols) {
                    cols = ('1fr '.repeat(areaLength)).trim();
                } 
                else {
                    const diffLength = areaLength - cols.split(' ').length;
                    if (diffLength > 0) {
                        cols += ' 1fr'.repeat(diffLength);
                    }
                }
            }
            else {
                if (rtlDir === 'w') {
                    cell = el.previousElementSibling || el.nextElementSibling;
                } else {
                    cell = el.nextElementSibling ||  el.previousElementSibling;
                }
                if (!cols) {
                    const gridWidth = [];
                    for (let i = 0; i < childs.length; ++i) {
                        gridWidth.push(childs[i].getBoundingClientRect().width);
                    }
                    const min = Math.min.apply(null, gridWidth).toFixed(2);
                    for (let i = gridWidth.length - 1; i > -1; --i) {
                        gridWidth[i] = min === gridWidth[i].toFixed(2)? '1fr' : ((gridWidth[i] / min).toFixed(2) + 'fr');
                    }
                    cols = gridWidth.join(' ');
                }
                const _childs = Themify.convert(childs);
                dragIndexes.push(_childs.indexOf(el));
                dragNextIndexes.push(_childs.indexOf(cell));

            }
            cols = cols.split(' ');
            if (!cols[dragIndexes[0]]) {
                dragIndexes[0]%= cols.length;
            }
            if (!cols[dragNextIndexes[0]]) {
                dragNextIndexes[0]%=cols.length;
            }
            let colsLen = cols.length,
                gutterPX;
            if (gutterVal && !gutterVal.includes('%')) {
                if (gutterVal.includes('px')) {
                    gutterPX=parseInt(gutter);
                    summPx =(colsLen - 1) * gutterPX;
                } 
                else if (gutterVal.includes('em')) {
                    summEM = (colsLen - 1) * gutter;
                    gutterPX=computed.getPropertyValue('font-size')*gutter;
                }
            } else {
                percent -= (colsLen - 1) * gutter;
                gutterPX=row_w*(gutter/100);
            }
            //find 1fr in px
            for (let i = colsLen - 1; i > -1; --i) {
                let v = cols[i];
                if (v.includes('fr')) {
                    summFr += parseFloat(v);
                } else if (v.includes('%')) {
                    percent -= parseFloat(v);
                } else if (v.includes('em')) {
                    summEM += parseFloat(v);
                } else if (v.includes('px')) {
                    summPx += parseFloat(v);
                }
            }
            if (summEM !== 0) {
                summEM = parseFloat(computed.getPropertyValue('font-size')) * summEM;
            }

            target.classList.add('tb_drag_grid_current');
            el.classList.add('tb_current_module');
            if (rtlDir === 'w') {
                tooltip1.className += ' tb_grid_drag_right_tooltip';
                tooltip2.className += ' tb_grid_drag_left_tooltip';
            } else {
                tooltip1.className += ' tb_grid_drag_left_tooltip';
                tooltip2.className += ' tb_grid_drag_right_tooltip';
            }
            el.style.willChange='width';
            if(cell){
                cell.style.willChange='width';
            }
            tooltip1.style.willChange=tooltip2.style.willChange='contents';
            _this.tooltip1=tooltip1;
            _this.tooltip2=tooltip2;
            _this.cell=cell;
            _this.el=el;
            _this.target=target;
            _this.cols=cols;
            _this.dragIndexes=dragIndexes;
            _this.dragNextIndexes=dragNextIndexes;
            _this.fr1 = parseFloat((parseFloat((row_w * percent) / 100) - summPx - summEM) / summFr);
            _this.row_inner=row_inner;
            _this.dir=dir;
            _this.isSame=Registry.get(row_inner.closest('[data-cid]').dataset.cid).isLightboxOpen();
            _this.elComputed=cs(el);
            _this.cellComputed=cell?cs(cell):null;
            _this.gutterPX=gutterPX;
            if(typeof e.clientX === 'number'){
                e.stopPropagation();
                target.removeAttribute('draggable');
                const isIframe=ownerDoc!==doc,
                    frame=isIframe?ownerWin.frameElement:null,
                    pointerId=e.pointerId;
                let ended=false;
                const toCanvasX=ev=>{
                        if(!isIframe || ev.target?.ownerDocument===ownerDoc || ev.view===ownerWin){
                            return ev.clientX;
                        }
                        if(!frame){
                            return ev.clientX;
                        }
                        const rect=frame.getBoundingClientRect(),
                            scaleX=rect.width?frame.offsetWidth/rect.width:1;
                        return ((ev.clientX-rect.left)*scaleX)-frame.clientLeft;
                    },
                    onDrag=ev=>{
                        if(pointerId!=null && ev.pointerId!==pointerId){
                            return;
                        }
                        ev.stopImmediatePropagation();
                        _this.drag(toCanvasX(ev));
                    },
                    onEnd=ev=>{
                        if(ended || (pointerId!=null && ev.pointerId!==pointerId)){
                            return;
                        }
                        ended=true;
                        ownerDoc.removeEventListener('pointermove',onDrag,true);
                        ownerDoc.removeEventListener('pointerup',onEnd,true);
                        ownerDoc.removeEventListener('pointercancel',onEnd,true);
                        if(isIframe){
                            doc.removeEventListener('pointermove',onDrag,true);
                            doc.removeEventListener('pointerup',onEnd,true);
                            doc.removeEventListener('pointercancel',onEnd,true);
                        }
                        try{
                            target.releasePointerCapture(pointerId);
                        }catch(err){}
                        _this.end();
                    };
                _this.startX=toCanvasX(e);
                ownerDoc.addEventListener('pointermove',onDrag,{capture:true,passive:true});
                ownerDoc.addEventListener('pointerup',onEnd,{capture:true,passive:true});
                ownerDoc.addEventListener('pointercancel',onEnd,{capture:true,passive:true});
                if(isIframe){
                    doc.addEventListener('pointermove',onDrag,{capture:true,passive:true});
                    doc.addEventListener('pointerup',onEnd,{capture:true,passive:true});
                    doc.addEventListener('pointercancel',onEnd,{capture:true,passive:true});
                }
                try{
                    target.setPointerCapture(pointerId);
                }catch(err){}
            }
        }
        drag(clientX){
            this.timer = requestAnimationFrame(() => {
                let diff = ~~clientX - this.startX;
                this.startX = clientX;
                this.setValue(diff);
            });
        }
        setValue(value){
            const _this=this;
            if (_this.isDragged !== true) {
                _this.isDragged = true;
                ActionBar.clear();
                //if(!_this.isSame || 1){
                    api.undoManager.start('style');
               // }
                _this.target.append(_this.tooltip1,_this.tooltip2);
                bodyCl.add('tb_start_animate', 'tb_drag_grid_start');
            }
            if (value !== 0) {
                if (_this.dir === 'e') {
                    value *= -1;
                }
                let fr = parseFloat(value / _this.fr1);
                if (fr  ) {
                    const {cols,dragIndexes,dragNextIndexes}=_this,
                        dragLen=dragIndexes.length,
                        dragNextLen = dragNextIndexes.length;
                    fr = parseFloat(fr / (dragLen + dragNextLen));
                    let v1 = parseFloat(cols[dragIndexes[0]]) + fr,
                        v2 = parseFloat(cols[dragNextIndexes[0]]) - fr;
                    if (v1 > .001 && v2 > .001) {
                            let floatV1=v1.toFixed(3),
                                floatV2=v2.toFixed(3);
                            v1 = floatV1 + 'fr';
                            v2 = floatV2 + 'fr';
                            for (let i = dragLen - 1; i > -1; --i) {
                                cols[dragIndexes[i]] = v1;
                            }
                            for (let i = dragNextLen - 1; i > -1; --i) {
                                cols[dragNextIndexes[i]] = v2;
                            }
                            floatV1*=dragLen;
                            floatV2*=dragNextLen;
                            _this.row_inner.style.setProperty('--col', cols.join(' '));
                            _this.tooltip1.textContent = floatV1 + 'fr / ' + parseInt(_this.elComputed.getPropertyValue('width')) + 'px';//parseInt(this.fr1*floatV1+this.gutterPX*(dragLen-1));
                            if(_this.cell){
                                _this.tooltip2.textContent = floatV2 + 'fr / ' + parseInt(_this.cellComputed.getPropertyValue('width')) + 'px';//parseInt(this.fr1*floatV2+this.gutterPX*(dragNextLen-1));
                            }
                    }
                }
            }
        }
        end(){
            const _this=this,
                {el,cell}=_this;
            cancelAnimationFrame(_this.timer);
            requestAnimationFrame(()=> {
                _this.tooltip1.remove();
                _this.tooltip2.remove();
                ActionBar.clear();
                el.classList.remove('tb_current_module');
                _this.target.classList.remove('tb_drag_grid_current');
                el.style.willChange='';
                if(cell){
                    cell.style.willChange='';
                }
                if (_this.isDragged) {
                    bodyCl.remove('tb_start_animate', 'tb_drag_grid_start');
                    const {row_inner,cols}=_this, 
                        row = row_inner.closest('[data-cid]');
                    for (let i = cols.length - 1; i > -1; --i) {
                        cols[i] = parseFloat(parseFloat(cols[i]).toFixed(3).replace('0.', '.')).toString() + 'fr';
                    }
                    Registry.get(row.dataset.cid).setCols({size:cols.join(' ')});
                    row_inner.style.setProperty('--col', '');
                    api.Utils.setColumnsCount([el, cell]);
                    Themify.trigger('tb_grid_changed',row);
                    api.Utils.onResize(true);
                   // if(!_this.isSame|| 1){
                        api.undoManager.end('style');
                   // }
                }
                for(let k in _this){
                    _this[k]=null;
                }
            });
        }
    };
})(tb_app,body,topBody,bodyCl,topWindowDoc);