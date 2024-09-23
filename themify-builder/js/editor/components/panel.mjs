((api,ToolBar,_CLICK_,body,topBody,topBodyCl,topWindow,topWindowDoc) => {
    "use strict";
    const isFrontend=api.isFrontend;
   
    api.MainPanel = class {
        static size = null;
        static #storageKey ='tb_module_panel';
        static async initialize() {
            const containers = {},
                root = doc.tfId('tb_main_panel_root'),
                fr = root.firstElementChild,
                fragment=createDocumentFragment();
                
            fragment.append(ToolBar.getBaseCss(), ToolBar.el.getRootNode().querySelector('#module_combine_style').cloneNode(true));
            if (fr) { // shadowrootmode="open" isn't support
                root.attachShadow({
                    mode: fr.getAttribute('shadowrootmode')
                }).appendChild(fr.content);
                fr.remove();
            }
            root.shadowRoot.prepend(fragment);
            this.el = root.shadowRoot.tfId('main_panel');
            let j = 1,
                builder=themifyBuilder,
                favs=builder.favorite,
                modules=builder.modules,
                i18n=builder.i18n.label,
                arr=Object.keys(modules).sort(),
                oldAddons=new Map;
            if ( typeof favs === 'object' && favs !== null  && ! Array.isArray( favs )) {
				favs = Object.values( favs );
			}
            await api.jsModuleLoaded();
            Themify.on('tb_toolbar_loaded',()=>{
                for (let i=0;i<arr.length;++i) {
                    let slug=arr[i];
                    if(slug!=='page-break'){
                        let module = createElement('','module module_' + slug),
                            favorite = createElement('span','favorite tb_disable_sorting'),
                            name = createElement('span','module_name',modules[slug].name),
                            add = createElement('button',{class:'tf_plus_icon add_module_btn tb_disable_sorting tf_rel',type:'button',title:i18n.add_module}),
                            dataset=module.dataset,
                            icon = modules[slug].icon,
                            isFavorited=favs?.includes(slug),
                            obj=api.Module.getModuleClassName(slug);
                        if(obj){
                            let cat=obj.getGroup();
                            dataset.categories = cat;
                            if (isFavorited===true) {
                                module.className += ' favorited';
                            }
                            add.dataset.type = 'module';
                            dataset.slug = slug;
                            dataset.index = j++;
                            module.draggable = true;
                            favorite.title=i18n.add_fv;
                            favorite.appendChild(api.Helper.getIcon('ti-star'));
                            if (icon) {
                                module.appendChild(api.Helper.getIcon('ti-' + icon));
                            }
                            module.append(favorite, name, add);
                            let categories = isFavorited===true ? ['favorite'] : cat;
                            for (let k = 0; k < categories.length; ++k) {
                                containers[categories[k]]??= createDocumentFragment();
                                containers[categories[k]].appendChild(module.cloneNode(true));
                            }
                        }else{
                            oldAddons.set(slug,modules[slug].name || slug); 
                        }
                    }
                }
                let categories = this.el.tfClass('panel_category');
                for (let i = categories.length - 1; i > -1; --i) {
                    let c = categories[i].dataset.category;
                    if (c) {
                        if (undefined !== containers[c]) {
                            categories[i].appendChild(containers[c]);
                        } else {
                            categories[i].parentNode.style.display = 'none';
                        }
                    }
                }
                if(oldAddons.size>0){
                    api.isOld=true;
                    this._updateAddonsMessage(oldAddons);
                }
                if (isFrontend) {
                    topBody.appendChild(root);
                }
                try{
                    if(!CSS.supports('container-type:inline-size') || !CSS.supports('selector(:has(*))')){
                        throw '';
                    }
                }
                catch(e){
                    this._updateBrowserMessage();
                }
            },true,ToolBar?.isLoaded===true);
        }
        static init(){
            this.updateStorage();
            if(api.isDocked){
                api.Dock.setDocked(false);
            } else {
				this.closeFloat();
            }

            this._draggable();
            this.initClick();
            this.initSearch();
            api.jsModuleLoaded().then(()=>{
                setTimeout(()=>{
                    api.Drag(this.el);
                },1000);
            });
            this.el.getRootNode().host.classList.remove('tf_hide');
        }
        static tabs(elm) {
            const target = elm.dataset.target;
            if (target) {
                const parent = elm.closest('.panel'),
                    hideTabs = parent.tfClass(elm.dataset.hide),
                    showTabs = parent.tfClass(target),
                    notFound = parent.tfClass('tb_no_content')[0],
                    search = parent.tfClass('panel_search')[0],
                    current = elm.closest('li'),
                    nav = current.parentNode,
                    menu = nav.children,
                    dropdownLabel = nav.parentNode.querySelector(':scope>.dropdown_label');
                for (let i = hideTabs.length - 1; i > -1; --i) {
                    hideTabs[i].style.display = 'none';
                }
                for (let i = showTabs.length - 1; i > -1; --i) {
                    showTabs[i].style.display = '';
                    showTabs[i].classList.remove('tf_hide');
                }
                notFound?.classList.toggle('tf_hide', showTabs.length > 0);
                for (let i = menu.length - 1; i > -1; --i) {
                    menu[i].classList.toggle('current', menu[i] === current);
                }
                if (search) {
                    search.value = '';
                }

                if (dropdownLabel) {
                    dropdownLabel.textContent = elm.textContent;
                }
                Themify.triggerEvent(this.el, 'tb_panel_tab_' + target);
                Themify.trigger('tb_panel_tab_' + target, parent);
            }
        }
        static initClick(e) {
            this.el.tfOn(_CLICK_, e => {
                const events = {
                    '.add_module_btn': 'addComponent',
                    '.panel_close': 'closeFloat',
                    '.minimize': 'minimize',
                    '.nav_tab': 'tabs',
                    '.favorite': 'toggleFavoriteModule',
                    '.panel_title': 'toggleAccordion'
                };
                for (let sel in events) {
                    if (e.target.closest(sel)) {
                        e.preventDefault();
                        e.stopPropagation();
                        this[events[sel]](e.target);
                        break;
                    }
                }
            })
            .tfOn('tb_panel_tab_panel_rows', () => {
                this.rowPanel();
            }, {
                once: true,
                passive: true
            })
            .tfOn('tb_panel_tab_panel_library', () => {
                this.libraryPanel();
            }, {
                once: true,
                passive: true
            })
            .getRootNode().querySelector('.docked_min')?.tfOn(_CLICK_,e=>{
                e.stopPropagation();
                this.dockMinimize();
            },{passive:true});
            
        }
        static async rowPanel() {
            const link = this.el.getRootNode().querySelectorAll('style'); 
            await Promise.all([Themify.loadJs(api.componentsURL + 'predesigned-rows',!!api.preDesignedRows), Themify.loadCss(Themify.builder_url + 'css/editor/components/predesigned-rows', null,null, link[link.length - 3].nextElementSibling)]);
            new api.preDesignedRows(this.el.tfClass('predesigned_container')[0]);
        }
        static async libraryPanel() {
            const link = this.el.getRootNode().querySelectorAll('style');
            await Promise.all([Themify.loadJs(api.componentsURL +  'library',!!api.Library), Themify.loadCss(Themify.builder_url + 'css/editor/components/library', null,null, link[link.length - 3].nextElementSibling)]);
            new api.Library(this.el.tfClass('library_container')[0]);
        }
        static toggleAccordion(item) {
            item.closest('.panel_acc').classList.toggle('tb_collapsed');
        }
        static toggleFavoriteModule(el) {
            const module = el.closest('.module'),
                slug = module.dataset.slug,

                trEnd = function(e) {
                        this.classList.toggle('favorited');
                        const categories = this.dataset.categories.split(','),
                            parent = this.closest('.panel_modules_wrap'),
                            fav = parent.querySelector('[data-category="favorite"]');
                        if (this.classList.contains('favorited')) {
                            for (let i = categories.length - 1; i > -1; --i) {
                                let cat = parent.querySelector('[data-category="' + categories[i] + '"]');
                                if(cat){
                                    let items=cat.tfClass('module_' + slug);
                                    for(let j=items.length-1;j>-1;--j){
                                        if(this!==items[j]){
                                            items[j].remove();
                                            if (cat.childElementCount===0) {
                                                cat.parentNode.style.display='none';
                                            }
                                        }
                                        else{
                                            fav.appendChild(this); 
                                            if (cat.childElementCount===0) {
                                                cat.parentNode.style.display='none';
                                            }
                                            requestAnimationFrame(()=>{
                                                requestAnimationFrame(()=>{
                                                    fav.parentNode.style.display=this.style.transform=this.style.opacity='';
                                                });
                                            });
                                        }
                                    }
                                }
                            }
                        } 
                        else {
                                for (let i = categories.length - 1; i > -1; --i) {
                                    let cat = parent.querySelector('[data-category="' + categories[i] + '"]'),
                                        clone=this.cloneNode(true),
                                        p = ~~clone.dataset.index,
                                        place = null;
                                    if(cat){
                                        while (--p !== 0) {
                                            place = cat.querySelector('[data-index="' + p + '"]');
                                            if (place!==null) {
                                                break;
                                            }
                                        }
                                        place?.after(clone) || cat.prepend(clone);
                                        cat.parentNode.style.display='';
                                        requestAnimationFrame(()=>{
                                            requestAnimationFrame(()=>{
                                                clone.style.transform=clone.style.opacity='';
                                            });
                                        });
                                     }
                                }
                                this.remove();
                                if (fav.tfClass('module').length===0) {
                                    fav.parentNode.style.display='none';
                                }
                        }
                    };
                
                module.tfOn('transitionend',trEnd, {
                    passive: true,
                    once: true
                })
                .style.opacity = 0;
                module.style.transform = 'scale(.5)';

            api.LocalFetch({
                action:'tb_module_favorite',
                module_name: slug,
                module_state:module.classList.contains('favorited')?0:1
            }, 'text');
        }
        static dockMinimize() {
            const workspace = topWindowDoc.tfClass('tb_workspace_container')[0],
                items=[topBody,this.el];
            if(api.activeModel){
                items.push(api.LightBox.el);
            }
            workspace.tfOn('transitionend', function() {
                this.style.transition ='';
                Themify.trigger('tb_resize_lightbox');
                api.Utils.onResize(true);
            },{passive:true,once:true})
            .style.transition = 'width .3s';
            
            for(let i=items.length-1;i>-1;--i){
                items[i].classList.toggle('tb_dock_minimized');
            }
        }
        static minimize(e) {
            const el= this.el,
                cl = el.classList;
            if (cl.contains('is_minimized')) {
                const storage = this._getStorage();
                el.style.height = storage.height ? (storage.height + 'px') : '';
            } 
            cl.toggle('is_minimized');
        }
        static openFloat(e) {
            const el=this.el,
            classes=[ToolBar.el.classList,el.classList,bodyCl];
            for(let i=classes.length-1;i>-1;--i){
                classes[i].remove('tb_panel_closed');
            }
            el.style.display = '';
            api.SmallPanel.hide();
            requestAnimationFrame(()=>{
                el.tfClass('panel_search')[0].focus();
            });
        }
        static closeFloat(e) {
            if (e) {
                api.Dock.set(false);
            }
            const el=this.el,
                classes=[ToolBar.el.classList,el.classList,bodyCl];
            el.style.display = 'none';
            for(let i=classes.length-1;i>-1;--i){
                classes[i].add('tb_panel_closed');
            }
        }
        static addComponent(target) {
            const type = target.dataset.type,
                slug=target.closest('[data-slug]')?.dataset.slug || '',
                _this=this,
                scrollTo=_this.el!==api.SmallPanel.el;
                if ('module' === type) {
                    _this.newModule(slug,scrollTo);
                } 
                else if ('page_break' === type) {
                    _this.newPageBreak(scrollTo);
                } 
                else if ('row' === type) {
                    _this.newGrid(slug,scrollTo);
                } 
                else if ('predesigned' === type) {
                    _this.newPredesign(slug,scrollTo);
                }
        }
        static newModule(slug,scrollTo,settings) {
            const builder=api.Builder.get(),
                dummy=createElement(),
                holder=builder.el.querySelector('.tb_column_btn_plus.clicked');
            if(holder){
                const subHolder=holder.parentNode;
                if(subHolder.classList.contains('module_column')){
                    subHolder.tfClass('tb_holder')[0].appendChild(dummy);
                }
                else{
                    subHolder.parentNode.after(dummy);
                }
            }
            else{
               builder.newRowAvailable(true).el.tfClass('tb_holder')[0].appendChild(dummy);
            } 
            api.SmallPanel.hide();
            return api.Drop.module(dummy, false,slug,scrollTo,settings);
        }
        static newPageBreak(scrollTo) {
            api.undoManager.start('move');
            let builder=api.Builder.get(),
                dummy=createElement(),
                holder=builder.el.querySelector('.tb_column_btn_plus.clicked');
            if(holder){
                holder=holder.closest('.module_row');
            }
            else{
                const rows=builder.el.tfClass('module_row');
                holder=rows[rows.length-1];
            }
            holder.after(dummy);
            api.SmallPanel.hide();
            api.Drop.row(dummy,'pagebreak',null,scrollTo).then(()=>{
                api.undoManager.end('move');
            });
        }
        static newGrid(slug,scrollTo) {
            api.undoManager.start('move');
            let builder=api.Builder.get(),
                dummy=createElement(),
                holder=builder.el.querySelector('.tb_column_btn_plus.clicked');
            if(holder){
                const subHolder=holder.parentNode;
                if(subHolder.classList.contains('module_column')){
                    subHolder.tfClass('tb_holder')[0].appendChild(dummy);
                }
                else{
                    subHolder.parentNode.after(dummy);
                }
            }
            else{
                if(builder.hasRows!==false){
                    for(let rows=builder.el.children,i=rows.length-1;i>-1;--i){
                        if(rows[i].classList.contains('module_row')){
                            holder=rows[i];
                            break;
                        }
                    }
                    if ( holder ) {
                        holder.after(dummy);
                    } else {
                        builder.el.prepend( dummy );
                    }
                }else{
                    builder.el.tfClass('tb_holder')[0].appendChild(dummy);
                }
            }
            api.SmallPanel.hide();
            api.Drop.row(dummy,'grid',slug,scrollTo).then(()=>{
                api.undoManager.end('move');
            });
        }
        static newPredesign(slug,scrollTo){
            api.undoManager.start('move');
            
            let builder=api.Builder.get(),
                dummy=createElement(),
                holder=builder.el.querySelector('.tb_column_btn_plus.clicked')?.closest('.module_row');
            if(!holder){
                const rows=builder.el.tfClass('module_row');
                holder=rows[rows.length-1];
            }
            holder.after(dummy);
            api.SmallPanel.hide();
            api.Drop.row(dummy,'predesign',slug,scrollTo).then(()=>{
                api.undoManager.end('move');
            });
        }
        static setResponsiveTabs(cl) {
            if (!api.isDocked) {
                cl??= this.getPanelClass(this._getStorage().width);
                this.el.classList.add(cl);
            }
        }
        static getPanelClass(w) {
            let cl = 'tb_float_large';
            if (w <= 195) {
                cl = 'tb_float_xsmall';
            } else if (w <= 270) {
                cl = 'tb_float_small';
            }
            return cl;
        }
        static _draggable() {
            const self = this,
                handle = this.el.tfClass('drag_handle')[0];
            if (!api.isDocked) {
                this.setResponsiveTabs();
            }
            handle.tfOn('pointerdown', function(e) {
                if (e.button === 0) {
                    e.stopImmediatePropagation();
                    let timer,
                        el = self.el,
                        owner = this.ownerDocument;
                    el.style.willChange='transform';
                    const _x = e.clientX,
                        _y = e.clientY,
                        box = el.getBoundingClientRect(),
                        dragX = box.left - _x,
                        dragY = box.top - _y,
                        width = box.width,
                        draggableCallback = e => {
                            e.stopImmediatePropagation();
                            timer = requestAnimationFrame(() => {
                                if(el!==null){
                                    const {clientX:x,clientY:y} = e,
                                    clientX = dragX + x,
                                    clientY = dragY + y;
                                    el.style.transform = 'translate(' + clientX + 'px,' + clientY + 'px)';
                                    Themify.trigger('tb_panel_drag', [clientX, width]);
                                }
                            });
                        },
                        startDrag = e=>{
                            e.stopImmediatePropagation();
                            owner.body.classList.add('tb_start_animate');
                            ToolBar.el.classList.add('tb_start_animate');
                            el.classList.add('tb_start_animate');
                            api.SmallPanel.hide();
                            Themify.trigger('tb_panel_drag_start');
                        },
                        up=function(e) {
                            e.stopImmediatePropagation();
                            cancelAnimationFrame(timer);
                            this.tfOff('pointermove', startDrag, {passive: true,once: true})
                                .tfOff('pointermove', draggableCallback, {passive: true})
                                .tfOff('lostpointercapture pointerup', up, {passive: true,once: true});
                            el.style.willChange='';
                            Themify.trigger('tb_panel_drag_end');
                            self.updateStorage();
                            owner.body.classList.remove('tb_start_animate');
                            ToolBar.el.classList.remove('tb_start_animate');
                            el.classList.remove('tb_start_animate');
                            timer = el = owner = null;
                        };
                    this.tfOn('lostpointercapture pointerup', up, {passive: true,once: true})
                    .tfOn('pointermove', startDrag, {passive: true,once: true})
                    .tfOn('pointermove', draggableCallback, {passive: true})
                    .setPointerCapture(e.pointerId);
                }

            }, {
                passive: true
            });

            this._resize();
        }
        static _resize() {
            const self = this,
                items = this.el.tfClass('tb_resizable');
            for (let i = items.length - 1; i > -1; --i) {
                items[i].tfOn('pointerdown', function(e) {
                    if (e.button === 0) {
                        e.stopImmediatePropagation();
                        let activeCl, timer,
                            owner = this.ownerDocument,
                            el = self.el;
                        el.style.willChange='transform,width,height';
                        const maxHeight = owner.documentElement.clientHeight * .9,
                            minHeight = 50,
                            computed = getComputedStyle(el),
                            minWidth = parseInt(computed.getPropertyValue('min-width')),
                            maxWidth = parseInt(computed.getPropertyValue('max-width')),
                            axis = this.dataset.axis,
                            startH = ~~el.offsetHeight,
                            startW = ~~el.offsetWidth,
                            {clientX:resizeX,clientY:resizeY} = e,
                            _start=()=>{
                                ToolBar.el.classList.add('tb_start_animate');
                                el.classList.add('tb_start_animate');
                                owner.body.classList.add('tb_start_animate');
                            },
                            _resize = e => {
                                e.stopImmediatePropagation();
                                timer = requestAnimationFrame(() => {
                                    let w;
                                    const {clientX,clientY} = e,
                                        matrix = new DOMMatrix(getComputedStyle(el).transform);
                                    if (axis === 'w') {
                                        w = resizeX + startW - clientX;
                                        if (w > maxWidth) {
                                            w = maxWidth;
                                        }
                                        if (w >= minWidth && w <= maxWidth) {
                                            matrix.m41 += parseInt(el.style.width) - w;
                                            el.style.width = w + 'px';
                                        }
                                    } else {
                                        const h = axis === '-y' || axis === 'ne' || axis === 'nw' ? (resizeY + startH - clientY) : (startH + clientY - resizeY);
                                        w = axis === 'sw' || axis === 'nw' ? (resizeX + startW - clientX) : (startW + clientX - resizeX);
                                        if (w > maxWidth) {
                                            w = maxWidth;
                                        }
                                        if ((axis === 'se' || axis === 'x' || axis === 'sw' || axis === 'nw' || axis === 'ne') && w >= minWidth && w <= maxWidth) {
                                            if (axis === 'sw' || axis === 'nw') {
                                                matrix.m41 += parseInt(el.style.width) - w;
                                            }
                                            el.style.width = w + 'px';
                                        }
                                        if ((axis === 'se' || axis === 'y' || axis === '-y' || axis === 'sw' || axis === 'nw' || axis === 'ne') && h >= minHeight && h <= maxHeight) {
                                            if (axis === '-y' || axis === 'nw' || axis === 'ne') {
                                                matrix.m42 += parseInt(el.style.height) - h;

                                            }
                                            el.style.height = h + 'px';
                                        }
                                    }
                                    el.style.transform = 'translate(' + matrix.m41 + 'px,' + matrix.m42 + 'px)';
                                    if (axis !== 'y' && axis !== '-y') {
                                        const current = self.getPanelClass(w);
                                        if (activeCl !== current) {
                                            if (activeCl) {
                                                el.classList.remove(activeCl);
                                            }
                                            activeCl = current;
                                            self.setResponsiveTabs(current);
                                        }
                                    }
                                });
                            },
                            _stop = function(e) {
                                e.stopImmediatePropagation();
                                cancelAnimationFrame(timer);
                                this.tfOff('pointermove', _start, {passive: true,once: true})
                                    .tfOff('pointermove', _resize, {passive: true})
                                    .tfOff('lostpointercapture pointerup', _stop, {passive: true,once: true });
                                el.style.willChange='';
                                self.updateStorage();
                                owner.body.classList.remove('tb_start_animate');
                                ToolBar.el.classList.remove('tb_start_animate');
                                el.classList.remove('tb_start_animate');
                                timer = activeCl = owner = el = null;
                            };
                        this.tfOn('pointermove', _start, {passive: true,once: true})
                            .tfOn('pointermove', _resize, {passive: true})
                            .tfOn('lostpointercapture pointerup', _stop, {passive: true,once: true })
                            .setPointerCapture(e.pointerId);
                    }
                }, {
                    passive: true
                });
            }
        }
        static initSearch() {
            const input = this.el.tfClass('panel_search')[0];
            if (input) {
                input.value = '';
                const search = function(e) {

                    const el = this.tfClass('panel_search')[0],
                        parent = this.closest('.panel'),
                        target = parent.querySelector('.nav_tab .current').dataset.target,
                        s = e.type === 'reset' ? '' : el.value.trim();
                    let items,
                        filter,
                        isModule,
                        isLibrary;
                    if (target === 'panel_modules_wrap') {
                        items = parent.tfClass('module');
                        isModule = true;
                    } 
                    else if (target === 'panel_rows' && api.preDesignedRows) {
                        items = parent.tfClass('predesigned_row');
                        const dropdown=items[0].closest('.panel_tab').tfClass('dropdown_label')[0];
                        if(dropdown.dataset.active){
                            Themify.triggerEvent(dropdown.nextElementSibling.firstElementChild,_CLICK_);
                        }
                    } 
                    else if (target === 'panel_library' && api.Library) {
                        items = parent.tfClass('library_item');
                        filter = items[0].closest('.panel_tab').querySelector('.library_tab .current').dataset.target;
                        isLibrary = true;
                    }
                    if (items) {
                        const is_empty = s === '',
                            reg = !is_empty ? new RegExp(s, 'i') : false,
                            selector = isModule ? '.module_name' : (isLibrary ? '' : '.predesigned_title'),
                            cats = new Set;

                        for (let i = items.length - 1; i > -1; --i) {
                            let elm = selector === '' ? items[i] : items[i].querySelector(selector),
                                display = is_empty || reg.test(elm.textContent) ? '' : 'none';
                            if(filter && !items[i].classList.contains(filter)){
                                display='none';
                            }
                            if (display === '') {
                                let parent = items[i].closest('.panel_category');
                                if (parent) {
                                    parent.parentNode.style.display = '';
                                }
                            }
                            items[i].style.display = display;
                            if (isModule===true && display==='') {
                                cats.add(items[i].parentNode);
                            }
                        }
                        // hide other accordions
                        parent.classList.toggle('panel_searching', !is_empty);
                        // Hide empty module accordions
                        if (isModule) {
                            items = parent.tfClass('panel_category');
                            for (let i = items.length - 1; i > -1; --i) {
                                items[i].parentNode.style.display=cats.has(items[i])?'':'none';
                            }
                        } 
                    }
                };
                input.parentNode.tfOn('input reset', search, {
                    passive: true
                });
                if (!Themify.isTouch) {
                    api.jsModuleLoaded().then(()=>{
                        setTimeout(() => {
                            input.focus();
                        }, 800);
                    });
                }
            }
        }
        static _getStorage() {
            const _this=this;
            if (_this.size === null) {
                let storage = localStorage.getItem(_this.#storageKey);
                storage = storage ? JSON.parse(storage) : {};
                _this.size = {...{
                    top: 50,
                    left: 10,
                    width: 140,
                    height: 600
                }, ...storage};
            }
            return _this.size;
        }
        static updateStorage() {
            const _this=this,
                el=_this.el,
                st=el.style,
                tr = st.transform,
                matrix = tr ? (new DOMMatrix(tr)) : null,
                box = el.tfClass('panel_top')[0].getBoundingClientRect(),
                wH = topWindow.innerHeight - box.height,
                wW = topWindow.innerWidth,
                storage = _this._getStorage();
            let obj = {
                width: parseInt(st.width),
                height: parseInt(st.height)
            };
            if (matrix) {
                obj.top = matrix.m42;
                obj.left = matrix.m41;
            }
            if (obj.height <= 0 || isNaN(obj.height)) {
                delete obj.height;
            }
            if (obj.width <= 0 || isNaN(obj.width)) {
                delete obj.width;
            }
            obj = {...storage, ...obj};
            if (obj.left < 0 || (obj.left+box.width) > wW) {
                obj.left = (obj.left < 0 ? 0 : (wW - box.width));
            }
            if (obj.top < 0 || obj.top > wH) {
                obj.top = (obj.top < 0 ? 0 : wH);
            }
            if(obj.width){
                st.width = obj.width + 'px';
            }
            if(obj.height){
                st.height = obj.height + 'px';
            }
            st.transform = 'translate(' + obj.left + 'px,' + obj.top + 'px)';
            
            if (!api.isDocked && storage !== obj && Object.entries(obj).toString() !== Object.entries(storage).toString()) {
                _this.size = null;
                localStorage.setItem(_this.#storageKey, JSON.stringify(obj));
            }
            return obj;
        }
        static _updateAddonsMessage(oldAddons){
            const addons={
              'themify-builder-pro':{
                  title:'Themify Builder Pro',
                  modules:[
                    'acf-repeater',
                    'ptb-repeater',
                    'add-to-cart',
                    'advanced-posts',
                    'advanced-products',
                    'archive-description',
                    'archive-image',
                    'archive-posts',
                    'archive-products',
                    'archive-title',
                    'author-info',
                    'breadcrumbs',
                    'cart-icon',
                    'comments',
                    'featured-image',
                    'post-content',
                    'post-meta',
                    'post-navigation',
                    'post-title',
                    'product-description',
                    'product-image',
                    'product-meta',
                    'product-price',
                    'product-rating',
                    'product-reviews',
                    'product-stock-status',
                    'product-taxonomy',
                    'product-title',
                    'related-posts',
                    'related-products',
                    'search-form',
                    'site-logo',
                    'site-tagline',
                    'stats',
                    'taxonomy',
                    'upsell-products',
                    'wc-notices',
                    'woocommerce-breadcrumb',
                    'woocommerce-hook',
                    'readtime'
                  ]
              },
              'builder-woocommerce':{
                  title:'Builder WooCommerce',
                  modules:[
                    'products',
                    'product-categories'
                  ]
              }
            },
            addonsNames=new Set;
            for(let [slug,name] of oldAddons){
                let found=false;
                for(let k in addons){
                    if(addons[k].modules.includes(slug)){
                        addonsNames.add(addons[k].title);
                        found=true;
                        break;
                    }
                }
                if(found===false){
                    addonsNames.add(name);
                }
            }
            if(isFrontend){
                body.appendChild(createElement('','tb_old_addons tf_abs_t tf_w tf_h'));
            }
            else{
                Themify.on('themify_builder_ready',()=>{
                    api.Builder.get().el?.classList.add('tb_old_addons');
                },true,api.is_builder_ready);
            }
            this.el.classList.add('tb_old_addons');
            ToolBar.el.classList.add('tb_old_addons');
            TF_Notification.showHide('warning', i18n.update_addons.replaceAll('%addons%',[...addonsNames].join(', ')),10000);
        }
        static _updateBrowserMessage(){
            let userAgent = navigator.userAgent.toLowerCase(),
                browser='',
                version,
                keyword;

            if (userAgent.includes('firefox/')) {
                browser='Firefox';
            }
            else if (userAgent.includes('opr/')) {
                browser='Opera';
                keyword='opr';
            }
            else if (userAgent.includes('edg/')) {
                browser='Edge';
                keyword='edg';
            }
            else if (userAgent.includes('samsungbrowser/')) {
                browser='Samsung Browser';
                keyword='samsungbrowser';
            }
            else if (userAgent.includes('chrome/')) {
                browser='Chrome';
            } 
            else if (userAgent.includes('safari/')) {
                browser='Safari';
                version=(userAgent.split('version/')[1] || userAgent.split('safari/')[1]).split(' ')[0];
            }
            if(!version){
                keyword??=browser.toLowerCase();
                version=userAgent.split(keyword+'/')[1]?.split(' ')[0] || '';
            }
            TF_Notification.showHide('warning', i18n.update_browser.replaceAll('%browser%',browser).replaceAll('%version%',version),10000);
        }
    };

    api.SmallPanel = class extends api.MainPanel{
        static init() {
            const root = doc.tfId('tb_small_panel_root'),
                fr = root.firstElementChild,
                styles = api.MainPanel.el.getRootNode().querySelectorAll('style,#tf_svg'),
                fragment=createDocumentFragment();
                
            if (fr) { // shadowrootmode="open" isn't support
                root.attachShadow({
                    mode: fr.getAttribute('shadowrootmode')
                }).appendChild(fr.content);
                fr.remove();
            }
            
            for(let i=0,len=styles.length;i<len;++i){
                if(styles[i].id!=='module_main_panel_style' && styles[i].id!=='tf_fonts_style'){
                    fragment.appendChild(styles[i].cloneNode(true));
                }
            }
            root.shadowRoot.prepend(fragment);
            if (!isFrontend && doc.querySelector('.edit-post-layout__content') !== null) {
                doc.tfClass('.edit-post-layout__content').appendChild(root);
            } else {
                body.appendChild(root);
            }
            
            this.el = root.shadowRoot.tfId('small_panel');
            doc.tfOn(_CLICK_,e=>{
                if(!this.el.contains(e.target) && !this.el.getRootNode().host.contains(e.target)){
                    if(e.target.closest('.tb_column_btn_plus')){
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        this.show(e.target);
                    }
                    else{
                        this.hide();
                    }
                }
            });
            this.initClick();
        }
        static show(item) {
            if (topBodyCl.contains('tb_standalone_lightbox')) {
                api.LightBox.close();
            }
            if(item.classList.contains('clicked')){
                return;
            }
            body.style.willChange='scroll-position';
            if(this.el.childElementCount===0){
                const menu = api.MainPanel.el.tfClass('nav_tab')[0].cloneNode(true),
                    container = api.MainPanel.el.tfClass('panel_container')[0].cloneNode(true),
                    fr = createDocumentFragment();
                fr.append(menu, container);
                
                this.el.appendChild(fr);
                const modules = container.tfClass('modules'),
                    predesign=container.tfClass('predesigned_row'),
                    tabs = this.el.tfClass('tb_compact_tabs'),
                    nav=this.el.tfClass('nav_tab');
                for (let i = predesign.length - 1; i > -1; --i) {
                    predesign[i].remove();
                }
                for (let i = modules.length - 1; i > -1; --i) {
                    modules[i].style.display = '';
                }
                for (let i = tabs.length - 1; i > -1; --i) {
                    tabs[i].classList.remove('tb_compact_tabs');
                }
                
                for (let i = nav.length - 1; i > -1; --i) {
                    Themify.triggerEvent(nav[i].firstElementChild ,_CLICK_);
                }
                this.initSearch();
                Themify.triggerEvent(this.el.tfClass('panel_search')[0],'input');
                api.Drag(this.el);
                if(isFrontend){
                    topWindowDoc.tfOn(_CLICK_,(e)=>{
                        if(!this.el.contains(e.target) && !this.el.getRootNode().host.contains(e.target)){
                            this.hide();
                        }
                    });
                }
                Themify.on('tfsmartresize',()=>{
                    this.position();
                });
            }else if (!Themify.isTouch) {
                setTimeout(() => {
                    this.el.tfClass('panel_search')[0].focus();
                }, 50);
            }
            const hostCl=this.el.getRootNode().host.classList;
            this.el.classList.toggle('tb_subrow_open', item.parentNode.closest('.sub_column') !== null);
            
            this.clear();
            item.classList.add('clicked');
            ToolBar.el.classList.add('tb_panel_dropdown_openend');
            api.MainPanel.el.classList.add('tb_panel_dropdown_openend');
            
            hostCl.add('tf_hidden');
            hostCl.remove('tf_hide');
            this.position(item);
            hostCl.remove('tf_hidden');

            Themify.trigger('disableInline');
            body.style.willChange='';
           
        }
        static hide(force) {
			if(this.el){
				const host=this.el.getRootNode().host;
				if(!host.classList.contains('tf_hide')){
					host.classList.add('tf_hide');
					ToolBar.el.classList.remove('tb_panel_dropdown_openend');
					api.MainPanel.el.classList.remove('tb_panel_dropdown_openend');
					this.clear();
				}
			}
        }
        static position(item){
            const clicked=item || api.Builder.get().el.querySelector('.clicked.tb_column_btn_plus');
            if(clicked!==null){
                clicked.style.display='block';
                const el=this.el,
                    {offsetWidth:w,offsetHeight:h} = el,
                    box = clicked.getBoundingClientRect(),
                    gutenContainer = !isFrontend ? doc.tfClass('edit-post-layout__content')[0] : null,
                    winW=doc.documentElement.clientWidth;
                let left = box.left,
                    top = box.top + window.scrollY;
                
                if (gutenContainer) {
                    top += gutenContainer.scrollTop - 70;
                    left = gutenContainer.clientWidth / 2;
                }
                else if(!Themify.isRTL){
                    left+=box.width / 2;
                }else{
                    left-=3;
                }
                left -= (w / 2);
                if (left < 0) {
                    left = 5;
                }
                else if((w+left)>winW){
                    left=winW-w;
                }else{
                    left=~~left;
                }
                el.style.transform = 'translate(' + left + 'px,' + top + 'px)';
                api.Utils.addViewPortClass(this.el);
                if(el.classList.contains('tb_touch_bottom')){
                    el.style.transform = 'translate(' + left + 'px,' + (top-h) + 'px)';
                }
                clicked.style.display='';
            }
        }
        static clear(){
            for(let clicked=api.Builder.get().el.querySelectorAll('.clicked.tb_column_btn_plus'),i=clicked.length-1;i>-1;--i){
                clicked[i].classList.remove('clicked');
            }  
        }

    };

    api.Dock =  {
        _key : 'themify_builder_docked',
        init() {
            if (isFrontend) {
                api.isDocked = localStorage.getItem(this._key);
                if (api.isDocked === 'true') {
                    api.isDocked = localStorage.getItem('themify_builder_docked_left') === 'true' ? 'left' : 'right';
                    localStorage.removeItem('themify_builder_docked_left');
                    this.set(api.isDocked);
                }
                else if(api.isDocked==='0'){
                    api.isDocked=false;
                }
                else if(!api.isDocked){
                    api.isDocked=Themify.isRTL?'right':'left';
                }
            }
            Themify.on('tb_panel_drag_start', () => {
                if(!topBodyCl.contains('tb_standalone_lightbox')){
                    this.close();
                    let drag = (x, w) => {
                        if (isFrontend) {
                            this.drag(x, w);
                        }
                    };
                    Themify.on('tb_panel_drag', drag)
                        .on('tb_panel_drag_end', () => {
                            Themify.off('tb_panel_drag', drag);
                            drag = null;
                            if (isFrontend) {
                                if (topBodyCl.contains('tb_dock_highlight')) {
                                    const dir = topBodyCl.contains('tb_dock_left_highlight') ? 'left' : 'right';
                                    topBodyCl.remove('tb_dock_highlight', 'tb_dock_left_highlight');
                                    this.set(dir);
                                    this.setDocked();
                                } else {
                                    this.set(null);
                                }
                            }
                        }, true);
                }
            });
        },
        set(isDocked) {
            if (isFrontend) {
                api.isDocked = isDocked;
                if (isDocked) {
                    localStorage.setItem(this._key, isDocked);
                    api.MainPanel.openFloat(true);
                } else {
                    localStorage.setItem(this._key, 0);
                    localStorage.removeItem('themify_builder_docked_left');
                }
            }
        },
        setDocked(animate) {
            if (api.isDocked) {
                if (!topBodyCl.contains('tb_panel_docked')) {
                    const panel = api.MainPanel.el,
                        lb = api.LightBox.el,
                        panelCl=panel.classList,
                        workspace = topWindowDoc.tfClass('tb_workspace_container')[0],
                        classes=[panelCl,ToolBar.el.classList,topBodyCl,bodyCl];
                    panelCl.remove('is_minimized');
                    if (animate !== false) {
                        const trEnd = function() {
                            this.style.transition = '';
                        };
                        workspace.tfOn('transitionend', function() {
                            trEnd.call(this);
                            api.Utils.onResize(true);
                        }, {
                            passive: true,
                            once: true
                        })
                        .style.setProperty('transition', 'width .3s', 'important');
                        if (panel.offsetHeight !== 0) {
                            panel.tfOn('transitionend', trEnd, {
                                passive: true,
                                once: true
                            })
                            .style.setProperty('transition', 'height .3s', 'important');
                        }
                        if (lb.offsetHeight !== 0) {
                            lb.tfOn('transitionend', function(){
                                trEnd.call(this);
                                api.LightBox.setupLightboxSizeClass();
                            }, {
                                passive: true,
                                once: true
                            })
                            .style.setProperty('transition', 'height .3s', 'important');
                        }
                    }
                    for(let i=classes.length-1;i>-1;--i){
                        classes[i].remove('tb_panel_right_dock','tb_panel_left_dock');
                        classes[i].add('tb_panel_docked','tb_panel_'+api.isDocked+'_dock');
                    }
                    panelCl.remove('tb_float_xsmall', 'tb_float_small', 'tb_float_large');
                    lb.classList.remove('tb_float_xsmall', 'tb_float_small', 'tb_float_large');
                    api.MainPanel.setResponsiveTabs();
                    Themify.trigger('tb_resize_lightbox');
                    return true;
                }
            }
            return false;
        },
        drag(clientX, width) {
            if (!api.isDocked) {
                if (!topBodyCl.contains('tb_standalone_lightbox')) {
                    if (clientX < 0 || (clientX + 20 + width) > topWindow.innerWidth) {
                        const dir = clientX < 0 ? 'left' : 'right';
                        topBodyCl.add('tb_dock_highlight');
                        topBodyCl.toggle('tb_dock_left_highlight', dir === 'left');
                        return dir;
                    }
                    topBodyCl.remove('tb_dock_highlight', 'tb_dock_left_highlight');
                }
            }
            return false;
        },
        close(animate=false) {
            if (api.isDocked) {
                if (animate!==false && api.isDocked === 'right') {
                    topWindowDoc.tfClass('tb_workspace_container')[0].tfOn('transitionend', function() {
                        this.style.transition = '';
                        api.Utils.onResize(true);
                    },{passive:true,once:true})
                    .style.transition = 'width .3s';
                }
                for(let classes=[ToolBar.el.classList,api.MainPanel.el.classList,topBodyCl,bodyCl],i=classes.length-1;i>-1;--i){
                    classes[i].remove('tb_panel_docked', 'tb_panel_left_dock', 'tb_panel_right_dock');
                }
                if (animate===false || api.isDocked !== 'right') {
                    api.Utils.onResize(true);
                }
                this.set(null);
                Themify.trigger('tb_resize_lightbox');
                api.MainPanel.setResponsiveTabs();
            }
        }
    };
    
    Themify.on('tb_toolbar_style_ready',()=>{
        api.MainPanel.initialize();
        api.Dock.init();
    },true,!!ToolBar?.el)
    .on('tb_toolbar_loaded', ()=>{
        api.MainPanel.init();
        api.SmallPanel.init();  
    },true,ToolBar?.isLoaded===true);


})(tb_app,tb_app.ToolBar,_CLICK_,body,topBody,topBodyCl,topWindow,topWindowDoc);