((api, topThemify,topWindowDoc,topWindow,topBody,topBodyCl,_CLICK_,Registry,ThemifyConstructor) => {
    "use strict";
    api.LightBox = class {
        static #storageKey= api.isFrontend? 'themify_builder_lightbox_frontend_pos_size' : 'themify_builder_lightbox_backend_pos_size';
        static #isStandalone= false;
        static #size=null;
        static el= null;
        static _init() {
            topBody.appendChild(doc.tfId('tmpl-builder_lightbox').content);
            this.el = topWindowDoc.tfId('tb_lightbox_parent');
            this._firstRun();
            api.Forms._initValidators();
        }
        static _firstRun() {
            Themify.on('tb_opened_lightbox', () => {
                const _this=this,
                    el=_this.el;
                el.tfOn('keydown paste copy', e=>{//to prevent copy/paste or undomanager
                    e.stopPropagation();
                },{passive: true})
                .tfClass('tb_close_lightbox')[0].tfOn(_CLICK_, () => {
                    _this.close();
                }, {
                    passive: true
                });
                el.tfClass('builder_cancel_docked_mode')[0].tfOn(_CLICK_, e => {
                    e.preventDefault();
                    e.stopPropagation();
                    api.Dock.close(false);
                    _this._updateStorage();
                    api.MainPanel.updateStorage();
                });
                if (_this.#isStandalone === false) {
                    _this._updateStorage();
                    _this.setupLightboxSizeClass();
                }
                setTimeout(() => {
                    _this._draggable();
                    _this._resize();
                }, 250);
            }, true);


            if (!themifyBuilder.disableShortcuts) {
                const shortcutListener = e => {
                    const active = topWindowDoc.activeElement;
                    if (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA' && !topWindowDoc.fullscreenElement && !active.isContentEditable) {
                        if ((e.key === 'Escape' || e.code==='Escape')&& (api.activeModel || api.LiteLightBox.isOpen())) {
                            e.preventDefault();
                            e.stopPropagation();
                            if(api.LiteLightBox.isOpen()){
                                api.LiteLightBox.close();
                            }
                            else{
                                this.save().then(() => {
                                    this.close();
                                });
                            }
                        } 
                        else if ('KeyS' === e.code && (true === e.ctrlKey || true === e.metaKey)) {
                            // Ctrl + s | Cmd + s - Save Builder
                            e.preventDefault();
                            e.stopPropagation();
                            api.LiteLightBox.close();
                            if (api.activeModel) {
                                this.save();
                            } else  {
                                api.Builder.get().save();
                            }
                        }
                    }
                };
                doc.tfOn('keydown', shortcutListener);
                if (api.isFrontend) {
                    topWindowDoc.tfOn('keydown', shortcutListener);
                }
            }
        }
        static open(options, model) {
            return new Promise(resolve => {
                const callback = async response => {
                    const el=this.el,
                        lightboxContainer = el.querySelector('#tb_lightbox_container'),
                        action = el.tfClass('tb_lightbox_actions_wrap')[0],
                        save = createElement('button',{class:'builder_button builder_save_button',title:i18n.ctr_save,type:'button'},i18n.done),
                        activeModel=api.activeModel;
                            
                    el.classList.add('tf_hide');
                    if(activeModel){
                        el.classList.add('tb_lb_'+activeModel.get('mod_name'));
                        await activeModel.beforeOpenLightbox?.(response);
                    }
                    if (typeof response === 'string') {
                        lightboxContainer.innerHTML = response;
                    } else {
                        lightboxContainer.replaceChildren(response);
                    }
                    action.replaceChildren();
                    if (options.save !== false) {
                        if (activeModel) {
                            if (api.isDocked) {
                                el.classList.add('tb_lightbox_small');
                            }
                            if (api.isVisual) {
                                if (api.GS.activeGS !== null) {
                                    api.liveStylingInstance = api.createStyleInstance();
                                    api.liveStylingInstance.init(null, true);
                                } else {
                                    if (!api.liveStylingInstance) {
                                        api.liveStylingInstance = api.createStyleInstance();
                                    }
                                    api.liveStylingInstance.init();
                                }
                            }
                            const _saveClicked = e => {
                                e.stopImmediatePropagation();
                                this.save().then(() => {
                                    if (api.isGSPage !== true) {
                                        save.tfOff(e.type, _saveClicked, {passive: true});
                                        topSave.tfOff(e.type, _saveClicked, {passive: true});
                                    }
                                }).catch(e => {
                                    console.log(e);
                                });
                            },
                            topSave = createElement('a',{class:'tb_tooltip',href:'javascript:;'}),
                            li = createElement('li', 'tb_top_save_btn');
                            topSave.append(api.Helper.getIcon('ti-check'), createElement('span','',i18n.done));
                            li.appendChild(topSave);
                            el.tfClass('tb_options_tab')[0].appendChild(li);
                            save.tfOn(_CLICK_, _saveClicked, {passive: true});
                            topSave.tfOn(_CLICK_, _saveClicked, {passive: true});

                            api.undoManager.start('saveLightbox', activeModel);
                            api.restoreVals=api.Helper.cloneObject(activeModel.get('mod_settings'));
                        }
                        action.appendChild(save);
                    }
                    if ('html' === options.loadMethod && options.contructor !== true) {
                        const tabs = lightboxContainer.querySelectorAll('.tb_tab_nav a');
                        for (let i = tabs.length - 1; i > -1; --i) {
                            tabs[i].tfOn(_CLICK_, ThemifyConstructor.switchTabs);
                        }
                    }
                    await activeModel?.openLightbox?.(lightboxContainer);
                    el.classList.remove('tf_hide');
                    lightboxContainer.style.scrollBehavior = 'auto';
                    lightboxContainer.scrollTop = 0;
                    lightboxContainer.style.scrollBehavior = '';
                    this._responsiveTabs();
                    Themify.trigger('tb_opened_lightbox');
                    api.Spinner.showLoader('spinhide');
                    api.SmallPanel.hide();
                    el.focus();
                    resolve(el);
                };

                this.close();
                if (model) {
                    api.activeModel = model;
                }
                try {
                    api.ActionBar.clearClicked();
                    if (options.loadMethod === 'html') {
                        if (options.contructor === true) {
                            callback(ThemifyConstructor.run(options.data));
                        } else {
                            callback(options.data);
                        }
                    } else {
                        callback(ThemifyConstructor.run(options));
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        }
        static close() {
            const el=this.el,
                model=api.activeModel;
            if (!el.classList.contains('tf_hide') && api.isGSPage !== true) {
                Themify.trigger('themify_builder_lightbox_before_close', el);
                el.classList.add('tf_hide');

                this._cleanLightBoxContent();
                api.undoManager.enable();
                api.Utils.removeViewPortClass(el);
                Themify.trigger('themify_builder_lightbox_close', el);
                if (api.isVisual) {
                    // Trigger parent iframe
                    topThemify.trigger('themify_builder_lightbox_close', el);
                }
                if (model !== null) {
                    el.classList.remove('tb_lb_'+model.get('mod_name'));
                    if (api.isVisual) {
                        api.liveStylingInstance.clear();
                    }
                    if (model.is_new === true) {
                        model.destroy();
                    } 
                    else if (!model.is_saved && api.undoManager.has('saveLightbox')) {
                        model.restore();
                    }
                    if (!model.is_saved) {
                        api.undoManager.clear('saveLightbox');
                    }
                    model.close?.();
                    model.el?.classList.remove('tb_current_module','tb_outline_anim');
                    api.activeModel = api.restoreVals=null;
                }
            }
            return this;
        }
        static setStandAlone(left, top) {
            Themify.on('tb_opened_lightbox', () => {
                const _this=this,
                    st=_this.el.style;
                _this.#isStandalone = true;
                topBodyCl.add('tb_standalone_lightbox');
                st.width = st.height = '';
                const box = api.ToolBar.el.getBoundingClientRect(),
                        computed = getComputedStyle(_this.el),
                        w = parseInt(computed.width),
                        h = parseInt(computed.height),
                        topW = topWindow.innerWidth - 10,
                        topH = topWindow.innerHeight + 10;
                if (top < box.bottom) {
                    top = box.bottom;
                } else if ((top + h) > topH) {
                    top=topH- h;
                }
                if (left < 0) {
                    left = 0;
                } else if ((left + w) > topW) {
                    left=topW-w;
                }
                st.transform = 'translate(' + left + 'px,' + top + 'px)';
                st.width = w + 'px';
                st.height = h + 'px';
                _this.setupLightboxSizeClass(w);
                Themify.on('themify_builder_lightbox_close', lb => {
                    topBodyCl.remove('tb_standalone_lightbox');
                    lb.style.transform = lb.style.width = lb.style.height = '';
                    _this.#isStandalone = false;
                    _this._updateStorage();
                    _this.setupLightboxSizeClass(_this._getStorage().w);
                }, true);
            }, true);
            return this;
        }
        static _cleanLightBoxContent() {
            const items = this.el.querySelectorAll('#tb_lightbox_container,.tb_options_tab,.tb_lightbox_actions_wrap,.tb_action_breadcrumb');
            for (let i = items.length - 1; i > -1; --i) {
                items[i].replaceChildren();
            }
            return this;
        }
        static async save() {
            const model = api.activeModel;
            if (!this.el.classList.contains('tf_hide')) {
                if (model !== null) {
                    if (api.isGSPage !== true && !api.Forms.isValidate(this.el.querySelector('#tb_options_setting'))) {
                        throw 'invalid';
                    }
                    ThemifyConstructor.setStylingValues(api.activeBreakPoint);//save current breakpoint style tab
                    let oldSettings = model.get('mod_settings'),
                        settings = {...api.Helper.cloneObject(ThemifyConstructor.values),...api.Forms.serialize('tb_options_setting', true)};
                    if (model.type !== 'column') {
                        settings={...settings,...api.Forms.serialize('tb_options_animation', true),...api.Forms.serialize('tb_options_visibility', true)};
                        if (api.isVisual) {
                            model.el.classList.toggle('tb_visibility_hidden', settings.visibility_all === 'hide_all' || settings.visibility_desktop === 'hide' || settings.visibility_tablet === 'hide' || settings.visibility_tablet_landscape === 'hide' || settings.visibility_mobile === 'hide');
                        }
                        if (model.type === 'module') {
                            api.Builder.get().removeLayoutButton();
                        }
                    }
                    if (api.ActionBar?.id === model.id) {
                        api.ActionBar.clear();
                    }

                    //check diff
                    api.Base.builderSave(settings, 'empty');
                    api.Base.builderSave(oldSettings, 'empty');
                    if(model.saveLightbox){
                        await model.saveLightbox(settings, oldSettings );
                    }

                    const hasChange = api.Helper.compareObject(oldSettings, settings);
                    if (hasChange === true) {
                        await Themify.trigger('themify_builder_save_component', [settings, oldSettings]);

                        if (api.isVisual) {
                            // Trigger parent iframe
                            await topThemify.trigger('themify_builder_save_component', [settings, oldSettings]);
                        }
                        model.set('mod_settings', settings);
                    }
                    model.is_new = false;
                    model.is_saved = true;
                    this.close();
                    if (api.isGSPage !== true && hasChange === true) {
                        api.undoManager.end('saveLightbox');
                    } 
                    else {
                        api.undoManager.clear('saveLightbox');
                    }
                    model.is_new=model.is_saved=null;
                }
                else if (topBodyCl.contains('tb_standalone_lightbox')) {
                    await Themify.trigger('tb_save_lb');
                }
                if (api.isGSPage === true) {
                    await TF_Notification.showHide('done', themifyBuilder.globalStyleData.save_text, 2000);
                }
            }
        }
        static _resize() {
            const self = this,
                    resizeHandler = self.el.tfClass('tb_resizable');

            for (let i = resizeHandler.length - 1; i > -1; --i) {
                resizeHandler[i].tfOn('pointerdown', function (e) {
                    if (e.button === 0) {
                        e.stopImmediatePropagation();
                        let owner = this.ownerDocument,
                                el = self.el,
                                timer;
                        el.style.willChange = 'transform,width,height';
                        const minWidth = 350,
                                maxWidth = 880,
                                maxHeight = owner.documentElement.clientHeight * .9,
                                minHeight = parseInt(getComputedStyle(el).getPropertyValue('min-height')),
                                axis = this.dataset.axis,
                                startH = ~~el.offsetHeight,
                                startW = ~~el.offsetWidth,
                                {clientX:resizeX,clientY:resizeY} = e,
                                _start = () => {
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
                                            self.setupLightboxSizeClass(w);
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
                                            self.setupLightboxSizeClass(w);
                                        }
                                        if ((axis === 'se' || axis === 'y' || axis === '-y' || axis === 'sw' || axis === 'nw' || axis === 'ne') && h >= minHeight && h <= maxHeight) {
                                            if (axis === '-y' || axis === 'nw' || axis === 'ne') {
                                                matrix.m42 += parseInt(el.style.height) - h;
                                            }
                                            el.style.height = h + 'px';
                                        }
                                    }
                                    el.style.transform = 'translate(' + matrix.m41 + 'px,' + matrix.m42 + 'px)';

                                    Themify.trigger('tb_resize_lightbox');
                                });
                            },
                            _stop = function (e) {
                                e.stopImmediatePropagation();
                                cancelAnimationFrame(timer);
                                this.tfOff('pointermove', _start, {passive: true, once: true})
                                        .tfOff('pointermove', _resize, {passive: true})
                                        .tfOff('lostpointercapture pointerup', _stop, {passive: true, once: true});
                                el.style.willChange = '';
                                self._updateStorage();
                                owner.body.classList.remove('tb_start_animate');
                                owner = el = timer = null;
                            };
                        this.tfOn('lostpointercapture pointerup', _stop, {
                            passive: true,
                            once: true
                        })
                        .tfOn('pointermove', _start, {
                            passive: true,
                            once: true
                        })
                        .tfOn('pointermove', _resize, {
                            passive: true
                        })
                        .setPointerCapture(e.pointerId);
                    }

                }, {
                    passive: true
                });
            }
        }
        static _draggable() {
            const self = this,
                    dragHandler = self.el.querySelectorAll('.tb_lightbox_top_bar,.tb_action_breadcrumb');
            for (let i = dragHandler.length - 1; i > -1; --i) {
                dragHandler[i].tfOn('pointerdown', function (e) {
                    if (e.button === 0) {
                        const targetCl = e.target.classList;
                        if (!targetCl.contains('tb_lightbox_top_bar') && !targetCl.contains('tb_action_breadcrumb')) {
                            return;
                        }
                        e.stopImmediatePropagation();
                        let timer,
                            el = self.el,
                            owner = this.ownerDocument,
                            box = el.getBoundingClientRect(),
                                dragX = box.left - e.clientX,
                                dragY = box.top - e.clientY,
                                width = box.width,
                                //topW=topWindow.innerWidth - 10,
                                draggableCallback = e => {
                                    e.stopImmediatePropagation();
                                    timer = requestAnimationFrame(() => {
                                        if(el!==null){
                                            let clientX = dragX + e.clientX,
                                                clientY = dragY + e.clientY;
                                            if(clientY<0){
                                                clientY=0;
                                            }
                                            /*
                                            if(clientX<0){
                                                clientX=0;
                                            }
                                            else if((clientX+width)>topW){
                                                clientX=topW-width;
                                            }*/
                                            el.style.transform = 'translate(' + clientX + 'px,' + clientY + 'px)';
                                            Themify.trigger('tb_panel_drag', [clientX, width]);
                                        }
                                    });
                                },
                                startDrag = e => {
                                    e.stopImmediatePropagation();
                                    owner.body.classList.add('tb_start_animate', 'tb_drag_lightbox');
                                    api.ToolBar.el.classList.add('tb_start_animate', 'tb_drag_lightbox');
                                    api.MainPanel.el.classList.add('tb_start_animate', 'tb_drag_lightbox');
                                    Themify.trigger('tb_panel_drag_start');
                                    if (self.#isStandalone === false) {
                                        self.setupLightboxSizeClass();
                                    }
                                },
                                up = function (e) {
                                    e.stopImmediatePropagation();
                                    cancelAnimationFrame(timer);
                                    this.tfOff('pointermove', startDrag, {passive: true, once: true})
                                            .tfOff('pointermove', draggableCallback, {passive: true})
                                            .tfOff('lostpointercapture pointerup', up, {passive: true, once: true});
                                    el.style.willChange = '';
                                    Themify.trigger('tb_panel_drag_end');
                                    if (self.#isStandalone === false) {
                                        self._updateStorage();
                                        self.setupLightboxSizeClass();
                                    }
                                    owner.body.classList.remove('tb_start_animate', 'tb_drag_lightbox');
                                    api.ToolBar.el.classList.remove('tb_start_animate', 'tb_drag_lightbox');
                                    api.MainPanel.el.classList.remove('tb_start_animate', 'tb_drag_lightbox');
                                    timer = el = owner = dragX=width=dragY=null;
                                };
                        el.style.willChange = 'transform';
                        this.tfOn('lostpointercapture pointerup', up, {passive: true, once: true})
                                .tfOn('pointermove', startDrag, {passive: true, once: true})
                                .tfOn('pointermove', draggableCallback, {passive: true})
                                .setPointerCapture(e.pointerId);
                    }
                }, {
                    passive: true
                });
            }
        }
        static _responsiveTabs() {
            let ul = null,
                    tabsWidth = 0,
                    label = null,
                    callback = () => {
                const finsih = () => {
                    if (ul === null) {
                        ul = this.el.querySelector('.tb_styling_tab_nav ul');
                        if (ul !== null) {
                            const li = ul.lastElementChild;
                            tabsWidth = li.offsetLeft + li.offsetWidth;
                        }
                    }
                    if (ul !== null && tabsWidth !== 0) {
                        if (api.isDocked) {
                            ul.style.display = 'none';
                        } else {
                            ul.style.flexDirection = 'row';
                        }
                        const parentW = ul.parentNode.offsetWidth;
                        if (parentW <= tabsWidth || api.isDocked) {
                            ul.style.display = 'none';
                            const current = ul.tfClass('current')[0];
                            if (label === null) {
                                label = createElement('span',{class:'tb_ui_dropdown_label',tabindex:-1});
                                ul.before(label);
                            }
                            if (current) {
                                label.textContent = current.textContent;
                            }
                            setTimeout(() => {//avoid flick
                                ul.style.display = '';
                            }, 100);
                        } else if (label !== null) {
                            label.remove();
                            label = null;
                        }
                        ul.style.flexDirection = '';
                        return true;
                    }
                    return false;
                };
                if (api.isDocked) {//avoud flick
                    if (!finsih()) {
                        setTimeout(finsih, 0);
                    }
                } else {
                    setTimeout(finsih, 0);
                }
            };
            callback();
            Themify.on('tb_builder_tabsactive', callback)
                    .on('tb_resize_lightbox', callback)
                    .on('themify_builder_lightbox_close', () => {
                        Themify.off('tb_builder_tabsactive', callback).off('tb_resize_lightbox', callback);
                        ul = tabsWidth = label = callback = null;
                    }, true);
        }
        static setupLightboxSizeClass(w) {
            const _this=this,
                el=_this.el;
            if (!w) {
                if (api.isDocked) {
                    w = parseInt(getComputedStyle(el).width);
                } else {
                    w = _this._getStorage().width || ~~el.offsetWidth;
                }
            }
            const cl = el.classList;
            cl.toggle('larger-lightbox', w > 750);
            cl.toggle('tb_lightbox_small', w < 540);
        }
        static _getStorage() {
            const _this=this;
            if (_this.#size === null) {
                let storage = localStorage.getItem(_this.#storageKey);
                storage = storage ? JSON.parse(storage) : {};
                _this.#size = {...{
                    top: 100,
                    left: Math.max(0, (topWindow.innerWidth / 2) - 300),
                    width: 600,
                    height: 500
                }, ...storage};
            }
            return _this.#size;
        }
        static _updateStorage() {
            if (this.#isStandalone === false) {
                const _this=this,
                    el=_this.el,
                    st=el.style,
                    tr = st.transform,
                    matrix = tr ? new DOMMatrix(tr) : null,
                    box = el.tfClass('tb_lightbox_top_bar')[0].getBoundingClientRect(),
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
                if (obj.left < 0 || (obj.left + box.width) > wW) {
                    obj.left = (obj.left < 0 ? 0 : (wW - box.width));
                }
                if (obj.top < 0 || obj.top > wH) {
                    obj.top = obj.top < 0 ? 0 : wH;
                }

                st.transform = 'translate(' + obj.left + 'px,' + obj.top + 'px)';
                if(obj.width){
                    st.width = obj.width + 'px';
                }
                if(obj.height){
                    st.height = obj.height + 'px';
                }
                if (!api.isDocked && Object.entries(obj).toString() !== Object.entries(storage).toString()) {
                    _this.#size = null;
                    localStorage.setItem(_this.#storageKey, JSON.stringify(obj));
                }
                return obj;
            }
        }
    };
    
    
    api.LiteLightBox =class {
        static isOpen(){
            return this.el?.childElementCount>0;
        }
        static open(fragment) {
            const _this=this, 
                modal = createElement('form','content tf_abs_c tf_textc tf_box');
            if (!_this.el) {
                const  root = doc.tfId('tb_lite_lightbox_root'),
                        fr = root.firstElementChild,
                        toolBarRoot = api.ToolBar.el.getRootNode(),
                        baseCss = toolBarRoot.querySelector('#tf_base');
                if (fr) { // shadowrootmode="open" isn't support
                    root.attachShadow({
                        mode: fr.getAttribute('shadowrootmode')
                    }).appendChild(fr.content);
                    fr.remove();
                }
                root.shadowRoot.prepend(baseCss.cloneNode(true));
                _this.el = root.shadowRoot.tfId('wrapper');
                _this.el.tfOn(_CLICK_, e => {
                    const t=e.target;
                    if (_this.el === t || t.classList.contains('tf_close')) {
                        _this.close(e);
                    }
                });
                topBody.appendChild(root);
            }
            modal.append(fragment, createElement('button',{class:'tf_close',type:'button'}));
            _this.el.appendChild(modal);
            _this.el.getRootNode().host.classList.remove('tf_hide');
        }
        static close(e) {
            if (this.el && this.isOpen()) {
                e?.stopPropagation();
                Registry.trigger(this.el, 'close');
            }
        }
        static create(options) {
            const fr = createDocumentFragment();
            for (let k in options) {
                let opt=options[k];
                if (k === 'buttons') {
                    let btnWrap = createElement('','btns');
                    for (let btnKey in opt) {
                        let btn = createElement('button',{class:'tf_inline_b tf_textc','data-type':btnKey},i18n[opt[btnKey]] || opt[btnKey]);
                        btn.tfOn(_CLICK_, e => {
                            this._buttonClick(e);
                        });
                        if(options.input===undefined && (btnKey==='yes' || btnKey==='ok')){
                            btn.autofocus=1;
                            setTimeout(() => {
                                btn.focus();
                            }, 15);
                        }
                        btnWrap.appendChild(btn);
                    }
                    fr.appendChild(btnWrap);
                } 
                else if (k === 'msg') {
                    let msg = createElement('','msg');
                    msg.innerHTML = i18n[opt] || opt;
                    fr.appendChild(msg);
                } 
                else if (k === 'input') {
                    let input = createElement('input',{class:opt.class + ' tf_w',value:opt.value || '',type:opt.type});
                    input.tfOn('keydown', e => {
                        this._keyPress(e);
                    }, {
                        passive: true
                    });
                    setTimeout(() => {
                        input.focus();
                    }, 100);
                    fr.appendChild(input);
                }
            }
            return fr;
        }
        static confirm(options={}) {
            options.buttons??= {
                no: 'no',
                yes: 'y'
            };
            this.open(this.create(options));
            return (new Promise(resolve => {
                Registry.on(this.el, 'confirm', type => {
                    let inputValue = this.el.querySelector('.content').tfTag('input')[0];
                    if (inputValue) {
                        inputValue = inputValue.value || '';
                        resolve([type, inputValue]);
                    } 
                    else {
                        resolve(type);
                    }
                })
                .on(this.el, 'close', () => {
                    resolve(null);
                });
            })
            .finally(() => {
                Registry.off(this.el, 'confirm').off(this.el, 'close').remove(this.el);
                this.el.getRootNode().host.classList.add('tf_hide');
                this.el.innerHTML = '';
            }));
        }
        static alert(message) {
            return this.confirm({
                msg: message,
                buttons: {
                    yes: 'ok'
                }
            });
        }
        static prompt(message, value) {
            return this.confirm({
                msg: message,
                input: {
                    type: 'text',
                    class: 'prompt_input',
                    value: value
                },
                buttons: {
                    no: 'cancel',
                    yes:'ok'
                }
            });
        }
        static _buttonClick(e) {
            e.preventDefault();
            e.stopPropagation();
            const type = e.currentTarget.dataset.type;
            if (type === 'cancel') {
                this.close();
            } else {
                Registry.trigger(this.el, 'confirm', type);
            }
        }
        static _keyPress(e) {
            if (e.key === 'Enter') { // on enter
                Registry.trigger(this.el, 'confirm', 'yes', e.currentTarget.value.trim());
            }
        }
    };


    api.Forms = {
        _validators: new Map,
        parseSettings(item, repeat) {
            const cl = item.classList,
                    option_id = repeat ? item.dataset.inputId : item.id;
            if (!option_id) {
                return false;
            }
            if (!cl.contains('tb_row_js_wrapper')) {
                let p = item.closest('.tb_field');
                if (p !== null && !p.classList.contains('_tb_hide_binding') && !(p.style.display === 'none' && p.className.includes('tb_group_element_'))) {
                    p = p.parentNode;
                    if (p.classList.contains('tb_multi_fields') && p.parentNode.classList.contains('_tb_hide_binding')) {
                        return false;
                    }
                }
            }
            let value = '';
            if (cl.contains('tb_lb_wp_editor')) {
                    const tid = item.id,
                        tiny = tinyMCE?.get(tid) || null;
                    value = tiny !== null ? (tiny.hidden === false ? tiny.getContent() : switchEditors.wpautop(tinymce.DOM.get(tid).value)) : item.value;
                
            } else if (cl.contains('tb_checkbox_wrap')) {
                const cselected = [],
                        chekboxes = item.tfClass('tb_checkbox'),
                        isSwitch = cl.contains('tb_switcher');
                for (let i = 0; i < chekboxes.length; ++i) {
                    if ((isSwitch === true || chekboxes[i].checked === true) && chekboxes[i].value !== '') {
                        cselected.push(chekboxes[i].value);
                    }
                }
                value = cselected.length > 0 ? cselected.join('|') : (isSwitch ? '' : false);
            }
            else if (cl.contains('themify-layout-icon')) {
                value = item.tfClass('selected')[0]?.id || '';
            }
            else if (cl.contains('tb_search_input')) {
                value = item.dataset.value;

                let parent = item.closest('.tb_input'),
                        multiple_cat = parent.tfClass('query_category_multiple')[0];
                if (multiple_cat) {
                    multiple_cat = multiple_cat?.value.trim() || '';
                    if (multiple_cat !== '') {
                        value = multiple_cat + '|' + (multiple_cat.includes(',') ? 'multiple' : 'single');
                    }
                    else {
                        value += '|single';
                    }
                }

            } 
            else if (cl.contains('tb_radio_wrap')) {
                let input = null;
                for (let radios = item.tfTag('input'),i = radios.length - 1; i > -1; --i) {
                    if (radios[i].checked === true) {
                        input = radios[i];
                        break;
                    }
                }
                if (input !== null && (api.activeBreakPoint === 'desktop' || !input.classList.contains('tb_responsive_disable'))) {
                    value = input.value;
                }
            }
            else if (cl.contains('tb_search_container')) {
                value = item.previousElementSibling.dataset.value;
            } 
            else if (cl.contains('tb_row_js_wrapper')) {
                value = [];
                for (let repeats = item.tfClass('tb_repeatable_field_content'),i = 0; i < repeats.length; ++i) {
                    let childs = repeats[i].tfClass('tb_lb_option_child');
                    value[i] = {};
                    for (let j = 0; j < childs.length; ++j) {
                        let v = this.parseSettings(childs[j], true);
                        if (v?.id) {
                            value[i][v.id] = v.v;
                        }
                    }
                }
            } 
            else if (cl.contains('module-widget-form-container')) {
                value = this.serializeObject(item);
            } 
            else if (cl.contains('tb_widget_select')) {
                value = item.tfClass('selected')[0]?.dataset.value ?? '';
            } 
            else if (cl.contains('tb_sort_fields_parent')) {
                value = [];
                for (let childs = item.children,i = 0; i < childs.length; ++i) {
                    let type = childs[i].dataset.type;
                    if (type) {
                        let wrap = childs[i].tfClass('tb_sort_field_dropdown')[0],
                            v = {
                                type: type,
                                id: childs[i].dataset.id
                            };
                        if (wrap !== undefined) {
                            v.val = {};
                            let items = wrap.tfClass('tb_lb_sort_child');
                            for (let j = items.length - 1; j > -1; --j) {
                                let v2 = this.parseSettings(items[j], true);
                                if (v2?.id) {
                                    v.val[v2.id] = v2.v;
                                }
                            }
                        } else {
                            let hidden = childs[i].tfTag('input')[0],
                                    temp = hidden.value;
                            if (temp !== '') {
                                v.val = JSON.parse(temp);
                            }
                        }
                        value.push(v);
                    }
                }

                if (value.length === 0) {
                    value = '';
                }
            } 
            else if (cl.contains('tb_accordion_fields')) {
                value = {};
                for (let childs = item.children,i = 0; i < childs.length; ++i) {
                    let id = childs[i].dataset.id;
                    if (id) {
                        let wrap = childs[i].tfClass('tb_accordion_fields_options')[0],
                            v = {};
                        if (wrap !== undefined) {
                            v.val = this.serialize(wrap, null, true);
                        } 
                        else {
                            let temp = childs[i].tfTag('input')[0]?.value || '';
                            if (temp !== '') {
                                v.val = JSON.parse(temp);
                            }
                        }
                        value[id] = v;
                    }
                }
            } 
            else if (cl.contains('tb_toggleable_fields')) {
                value = [];
                for (let childs = item.children,i = 0; i < childs.length; ++i) {
                    let id = childs[i].dataset.id;
                    if (id) {
                        let wrap = childs[i].tfClass('tb_toggleable_fields_options')[0],
                            v = {
                                id:id,
                                on: childs[i].tfClass('tb_switcher')[0].tfClass('toggle_switch')[0].value
                            };
                        if (wrap !== undefined) {
                            v.val = this.serialize(wrap, null, true);
                        } else {
                            let temp = childs[i].tfTag('input')[0]?.value ||'';
                            if (temp !== '') {
                                v.val = JSON.parse(temp);
                            }
                        } 
                        value.push(v);
                    }
                }
            }
            else if (item.multiple && item.nodeName === 'SELECT') {
                value = [];
                for (let selected = item.selectedOptions, i = 0; i < selected.length; ++i) {
                    value.push(item.selectedOptions[ i ].value);
                }
            } 
            else if(cl.contains('tb_grid_root')){
                value={};
                for(let vals=item.shadowRoot.querySelectorAll('[data-col]'),i=vals.length-1;i>-1;--i){
                    let action=vals[i].dataset.col;
                    if(action==='grid'){
                        value.size=vals[i].tfClass('selected')[0].dataset.grid;
                    }
                    else if(action==='gutter'){
                        let p=vals[i].parentNode,
                            gutter = p.querySelector('#range').value;
                        if (gutter > 0) {
                            gutter += p.querySelector('#range_unit').value;
                        }
                        value[action] = ThemifyStyles.getGutter(gutter);
                    }
                    else if(action!=='direction'){
                        if(action==='autoHeight'){
                            action='auto_h';
                        }
                        else if(action==='alignment'){
                            action='align';
                        }
                        value[action]=vals[i].tfClass('selected')[0].dataset.value;
                    }
                }
            }
            else {
                value = item.value;
                if (option_id === window.tbpDynamic?.field_name) {
                    if (value === '') {
                        return false;
                    }
                    if (typeof value === 'string') {
                        value = JSON.parse(value);
                    }
                } 
                else if (option_id === api.GS.key && api.activeBreakPoint !== 'desktop') {
                    return false;
                } 
                else if (value !== '') {

                    if (option_id === 'builder_content') {
                        if (typeof value === 'string') {
                            value = JSON.parse(value);
                        }
                    } 
                    else {
                        if (typeof value === 'string' && value.includes(':') && value.includes('{')) {
                            try {
                                let v = JSON.parse(value);
                                value = v;
                            } catch (e) {

                            }
                        }
                        let opacity = item.dataset.opacity;
                        if (opacity !== null && opacity !== '') {
                            opacity = parseFloat(parseFloat(Number(opacity).toFixed(2)).toString());
                            if (opacity < .99) {
                                value += '_' + opacity;
                            }
                        }
                    }
                }
            }
            if (value === undefined || value === 'undefined' || value === null) {
                value = '';
            }

            return {
                id: option_id,
                v: value
            };
        },
        serialize(id, empty, repeat) {
            const result = {},
                el = typeof id === 'string' ?api.LightBox.el.querySelector('#' + id):id;
            repeat??=false;
            if (el !== null) {
                const options = el.tfClass((repeat ? 'tb_lb_option_child' : 'tb_lb_option'));
                for (let i = options.length - 1; i > -1; --i) {
                    let v = this.parseSettings(options[i], repeat);
                    if (v !== false && v.id && (empty === true || v.v !== '')) {
                        result[v.id] = v.v;
                    }
                }
            }
            return result;
        },
        _initValidators() {
            this.registerValidator('email', item => {
                const v = typeof item === 'string' ? item : item.value.split(','),
                        pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                for (let i = v.length - 1; i > -1; --i) {
                    if (!pattern.test(v[i])) {
                        return false;
                    }
                }
                return true;
            });
            this.registerValidator('row_anchor', item => {
                let v = item.value;
                if (v) {
                    v = v.replaceAll('#', '').replaceAll(' ', '').trim();
                }
                item.value = v;
                return true;
            });
             this.registerValidator('custom_css_id', (item,el) => {
                let count = 0,
                        v = item.value.trim();
                if (v) {
                    v = v.replace(/[^a-zA-Z0-9\-\_]/g, '');
                    while (1) {
                        if (isNaN(v[0])) {
                            break;
                        }
                        v = v.substring(1);
                    }
                    if (v) {
                        el??=api.activeModel.el;
                        const items = doc.querySelectorAll('#' + v);
                        if (items.length > 0) {
                            for (let i = items.length - 1; i > -1; --i) {
                                if (el!==items[i] && items[i].closest('.module_row') !== null) {
                                    ++count;
									break;
                                }
                            }
                        }
                    }
                }
                item.value = v;
                return count===0;
            });

            this.registerValidator('custom_css', item => {
                let v = item.value;
                if (v) {
                    v = v.replace(/\s\s+/g, ' ').split(' ');
                    for (let i = v.length - 1; i > -1; --i) {
                        v[i] = v[i].replace(/[^a-zA-Z0-9\s\-\_]/g, '');
                        if (v[i][0] !== '') {
                            while (1) {
                                if (isNaN(v[i][0])) {
                                    break;
                                }
                                v[i] = v[i].substring(1);
                            }
                        }
                    }
                    v = v.join(' ');
                }
                item.value = v;
                return true;
            });
            this.registerValidator('not_empty', item => {
                return item.value.toString().trim() !== '';
            });
        },
        registerValidator(type, fn) {
            this._validators.set(type, fn);
        },
        getValidator(type) {
            return this._validators.get(type) || this._validators.get('not_empty');
        },
        isValidate(form) {
            const validate = form.tfClass('tb_must_validate'),
                len = validate.length;
            let is_valid = true;
            if (len>0) {
                for (let i = len - 1; i > -1; --i) {
                    let item = validate[i].tfClass('tb_lb_option')[0],
                        validator=this.getValidator(validate[i].dataset.validation),
                        check = validator(item);
                    if (check !== true) {
                        if (!item.classList.contains('tb_field_error')) {
                            let exist=item.parentNode.tfClass('tb_field_error_msg')[0],
                                el = exist || createElement('span'),
                                afterEl = item.tagName === 'SELECT' || item.classList.contains('tb_uploader_input')? item.parentNode : item,
                                msg=validate[i].dataset.errorMsg;
                            el.textContent = check === false ? (i18n[msg] || msg) : check;
                            item.classList.add('tb_field_error');
                            if(!exist){
                                el.className = 'tb_field_error_msg';
                                afterEl.after(el);
                            }
                        }
                        is_valid = false;
                    } else {
                        item.classList.remove('tb_field_error');
                        for (let er = validate[i].tfClass('tb_field_error_msg'),j = er.length - 1; j > -1; --j) {
                            er[j].remove();
                        }
                    }
                }
                if (is_valid === false) {
                    const tab = api.LightBox.el.querySelector('a[data-id="' + form.id + '"]');
                    if (!tab.parentNode.classList.contains('current')) {
                        Themify.triggerEvent(tab, _CLICK_);
                    }
                    api.LightBox.el.focus();
                    TF_Notification.showHide('error', i18n.lightBoxRequiredFields);
                }
            }
            return is_valid;
        },
        serializeObject(el) {
            const o = {},
                    items = el.querySelectorAll('input,select,textarea');
            for (let i = items.length - 1; i > -1; --i) {
                let {type,value,id,tagName:tag} = items[i],
                    name = items[i].name || id;
                if (name && type !== 'button' && type !== 'submit' && value !== '') {
                    if (items[i].classList.contains('wp-editor-area') && typeof tinyMCE !== 'undefined') {
                        let tiny = tinyMCE.get(id);
                        if (tiny) {
                            value = tiny.getContent().trim();
                        }
                    } else if (type === 'radio' || type === 'checkbox' || tag === 'select') {
                        if (tag === 'select') {
                            if (items[i].hasAttribute('multiple')) {
                                let selected = [];
                                for (let j = 0, options = items[i].children; j < options.length; ++j) {
                                    if (options[j].selected) {
                                        selected.push(options[j].value);
                                    }
                                }
                                value = selected;
                            }
                        } else if (!items[i].checked) {
                            continue;
                        }
                    }
                    if (value !== '') {
                        if (type === 'checkbox') {
                            o[name]??= [];
                            o[name].push(value);
                        } else {
                            o[name] = value;
                        }
                    }
                }
            }
            return o;
        }
    };

    api.LightBox._init();

})(tb_app, topThemify,topWindowDoc,topWindow,topBody,topBodyCl,_CLICK_,tb_app.Registry,ThemifyConstructor);