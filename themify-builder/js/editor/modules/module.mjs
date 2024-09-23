(api => {
    "use strict";
    api.Module=class extends api.Base {
        constructor(fields) {
            if(fields.mod_settings!==undefined){
                fields.mod_settings=ThemifyStyles.convertPreset(fields.mod_name,fields.mod_settings);
            }
            super(fields);
            this.type='module';
            this.initialize();
            this.render();
        }
        defaults(){
            return {
                mod_name: '',
                mod_settings: {}
            };
        }
        static default(){
            return {};
        }
        initialize(){
            super.initialize();
        }
        static getSettingsName(slug){
            return this.getModuleName(slug);
        }
        static getOptions() {
            return [];
        }
        static getGroup(){
            return ['general'];
        }
        static getModuleName(slug){
            return themifyBuilder.modules[slug]?.name || slug;
        }
        static getModuleClassName(slug){
            let className=slug.split('-');
            for(let i=0;i<className.length;++i){
                className[i]=className[i].charAt(0).toUpperCase() + className[i].slice(1);
            }
            className=className.join('');
            if(slug!=='row' && slug!=='column' && slug!=='subrow'){
                className='Module'+className;
            }
            return api[className];
        }
        static initModule(fields){
            const className=this.getModuleClassName(fields.mod_name);
            return className?(new className(fields)):new api.Module(fields);
        }
        static getDefault(slug){
            return this.getModuleClassName(slug)?.default() || {};
        }
        static getHolder(){
            return createElement('','tb_holder tf_box tf_rel tf_w');
        }
        static getModuleTitle(value,key){
            return this._setEditableContent(createElement('h3','module-title'),key,value);
        }
        static setEditableContent(el,key,value,editor,repeat,index){
            const dataset=el.dataset;
            el.contentEditable=false;
            dataset.name = key;
            if(editor!==undefined && editor!==''){
                dataset.hasEditor = 1;
                if(value!==undefined && value!==''){
                    el.innerHTML=value;
                }
            }
            else if(value!==undefined && value!==''){
                el.innerHTML=value;
            }
            if(repeat!==undefined){
                dataset.repeat=repeat;
                if(index!==undefined){
                    dataset.index=index;
                }
            }
            return el;
        }
        static _setEditableContent(el,key,value,editor,repeat,index){
            return this.setEditableContent(el,key,value,editor,repeat,index);
        }
        static setEditableImage(el,name,wKey,hKey,data,repeat,index){
            const dataset=el.dataset;
            data??={};
            if(wKey!=='' && wKey!==undefined){
                dataset.w=wKey;
                if(data[wKey]){
                    el.width=data[wKey];
                }
            }
            if(hKey!=='' && hKey!==undefined){
                dataset.h=hKey;
                if(data[hKey]){
                    el.height=data[hKey];
                }
            }
            if(name!=='' && name!==undefined){
                dataset.name=name;
                if(data[name]){
                    el.src=data[name];
                }
            }
            if(repeat!==undefined){
                dataset.repeat=repeat;
                if(index!==undefined){
                    dataset.index=index;
                }
            }
            return el;
        }
        static async loadBackendLightbox(type){
            const isLoaded=!!window.TB_BuilderContentLightbox;
            try{
                if(!isLoaded){
                    if(type!=='preload'){
                        api.Spinner.showLoader();
                    }
                    await Promise.all([
                        Themify.loadCss(Themify.builder_url + 'css/editor/components/builder-content-lightbox'),
                        Themify.loadJs(api.componentsURL +'builder-content-lightbox',window.TB_BuilderContentLightbox)
                    ]);
                }
            }
            catch(e){
                throw e;
            }
            finally{
                if(!isLoaded && type!=='preload'){
                    api.Spinner.showLoader('hide');
                }
            }
        }
        editLayoutPart(){
            api.ActionBar.disable = true;
            api.Spinner.showLoader();
            Promise.all([
                Themify.loadCss(Themify.builder_url + 'css/editor/components/layout-part','tb_layout_part_ui',null,doc.tfId('themify-builder-admin-ui-css').nextElementSibling),
                Themify.loadJs(api.componentsURL + 'layout-part')
            ])
            .then(()=>{
                Themify.trigger('tb_layout_edit');
                
                let className=this.get('mod_name').split('-');
                for(let i=0;i<className.length;++i){
                    className[i]=className[i].charAt(0).toUpperCase() + className[i].slice(1);
                }
                className=className.join('');
                const item=new api[className](this.id);
                item.edit().finally(()=>{
                   api.ActionBar.disable = null; 
                });
                api.LayoutPart.item=item;
            }).catch(()=>{
                api.Spinner.showLoader('error');
                api.ActionBar.disable = null; 
            });
        }
        getExcerpt(data) {
            return '';
        }
        getImage() {
            return api.Helper.getIcon('ti-' + this.getIcon());
        }
        backendLivePreview(settings) {
            const img=this.getImage(settings),
                iconEl=this.el.tfClass('tb_img_wrap')[0].firstElementChild,
                excerptText=this.getExcerpt(settings),
                excerpt=this.el.tfClass('module_excerpt')[0];
            if(typeof excerptText==='string'){
                excerpt.innerHTML=excerptText;
            }
            else{
                excerpt.replaceChildren(excerptText);
            }
            if(img.tagName==='IMG'){
                img.decode()
                .then(()=>{
                    iconEl.replaceWith(img);
                })
                .catch(()=>{
                    iconEl.replaceWith(api.Helper.getIcon('ti-' + this.getIcon()));
                });
            }
            else{
                iconEl.replaceWith(img);
            }
        }
        getIcon(){
            const slug=this.get('mod_name');
            return themifyBuilder.modules[slug]?.icon || '';
        }
        getName(){
            return api.Module.getModuleName(this.get('mod_name'));
        }
        getPreviewType(){
            return this.preview?'live':'ajax';
        }
        // for instant live preview
        getPreviewSettings() {
            return api.Module.getDefault(this.get('mod_name'));
        }
        attributes() {
            const args = {
                    class: 'active_module'
                },
                data = this.get('mod_settings');
            if (api.isVisual) {
                if ((data.visibility_all === 'hide_all' || data.visibility_desktop === 'hide' || data.visibility_tablet === 'hide' || data.visibility_tablet_landscape === 'hide' || data.visibility_mobile === 'hide')) {
                    args.class += ' tb_visibility_hidden';
                }
                args.class += ' tb_module_front';
            }
            if (data.custom_css_id !== undefined && data.custom_css_id !== '') {
                args.id = data.custom_css_id;
            }
            return args;
        }
        getDisabledTpl(){
            this.isEmpty=true;
            const slug=this.get('mod_name'),
                fr=createDocumentFragment(),
                module=createElement('','tb_disabled_module module module-'+slug+' tb_'+this.id),
                modName=createElement('span',api.isVisual?'tb_data_mod_name tf_overflow tf_textc tf_abs_t tf_hide':'module_name',slug),
                msg=createElement('span','tb_empty_msg tf_textc',i18n.emptym);
            if(api.isVisual){
                module.append(modName,msg);
            }
            else{
                const moduleLabel=createElement('','module_label tf_overflow tf_h'),
                    imgWrap=createElement('','tb_img_wrap');
                    
                imgWrap.appendChild(api.Helper.getIcon('ti-na'));
                moduleLabel.append(imgWrap,modName,createElement('em','module_excerpt',this.getExcerpt()),msg);
                module.appendChild(moduleLabel);
            }
            fr.append(createElement('','tb_action_wrap tb_module_action tf_abs_t tf_box tf_hide'),module);
            this.el.appendChild(fr);
            api.Builder.get().emptyModules.add(slug);
        }
        backendRender(){
            const fr=createDocumentFragment(),
                module=createElement('','module'),
                moduleLabel=createElement('','module_label tf_overflow tf_h'),
                imgWrap=createElement('','tb_img_wrap'),
                excerpt=createElement('em','module_excerpt'),
                excerptText=this.getExcerpt();
                
            imgWrap.appendChild(this.getImage());
            if(typeof excerptText==='string'){
                excerpt.innerHTML=excerptText;
            }
            else{
                excerpt.replaceChildren(excerptText);
            }
            moduleLabel.append(imgWrap,createElement('','module_name',this.getName()),excerpt);
            module.append(moduleLabel,createElement('','tf_plus_icon tb_column_btn_plus tb_disable_sorting'));
            fr.append(createElement('','tb_action_wrap tb_module_action tf_abs_t tf_box tf_hide'),module,createElement('','tb_visibility_hint tf_overflow tf_abs_t tf_hide'));
            this.el.appendChild(fr);
            this.visibilityLabel();
        }
        render() {
            if (!api.isVisual) {
                if(themifyBuilder.modules[this.get('mod_name')]!==undefined){
                    this.backendRender();
                }
                else{
                    this.getDisabledTpl();
                }
            }
            return this;
        }
        parseHtml(){
            
        }
        static builderSave(settings){
            super.builderSave(settings);
        }
        static cleanBuilderType(builder,rowType='subrow'){
            const moduleClassName=this.getModuleClassName,
                loop = (items,type) => {
                    for (let i = items.length - 1; i > -1; --i) {
                        let item=items[i],
                            fields = item.styling || item.mod_settings;
                        if (fields) {
                            item.element_id??=api.Helper.generateUniqueID();
                            let slug = item.mod_name || (item.cols ? type : 'column');
                            moduleClassName(slug)?.builderSave(fields);
                            if(Object.keys(fields).length===0){
                                if(item.styling){
                                    delete item.styling;
                                }else{
                                    delete item.mod_settings;
                                } 
                            }
                        }
                        if(item.cols || item.modules || item.mod_name){
                            item.element_id??=api.Helper.generateUniqueID();
                            if(item.cols?.length>0){
                                if(item.cols.length===1 && !item.cols[0].modules?.length && (!item.cols[0].styling || Object.keys(item.cols[0].styling).length===0)){
                                    delete item.cols;
                                }
                                else{
                                    loop(item.cols,'subrow');
                                }
                            }
                            if (item.modules?.length>0) {
                                loop(item.modules,'subrow');
                            }else{
                                delete item.modules;
                            }
                        }
                    }
            };
            if(builder){
                loop(builder,rowType);
            }
        }
        static clearSliderOptions(settings,all){
            let slider;
            if(all){
                for(let sl=['slider_thumbs','effect_slider','speed_opt_slider','wrap_slider','show_nav_slider','show_arrow_slider','show_arrow_buttons_vertical','touch_swipe','left_margin_slider','right_margin_slider','height_slider','auto_scroll_opt_slider'],i=sl.length-1;i>-1;--i){
                    delete settings[sl[i]];
                }
            }
            else {
                slider=settings.effect_slider || 'scroll';
                if(settings.effect_slider==='scroll'){
                    delete settings.effect_slider;
                }
                if(settings.wrap_slider==='yes'){
                    delete settings.wrap_slider;
                }
                if(settings.show_nav_slider==='yes'){
                    delete settings.show_nav_slider;
                }
                if(settings.height_slider==='variable'){
                    delete settings.height_slider;
                }
                if(settings.speed_opt_slider==='normal' || settings.speed_opt_slider?.toString()==='1'){
                    delete settings.speed_opt_slider;
                }
                if(settings.scroll_opt_slider?.toString()==='1'){
                    delete settings.scroll_opt_slider;
                }
                if(settings.show_arrow_slider==='no'){
                    delete settings.show_arrow_buttons_vertical;
                }else{
                   delete settings.show_arrow_slider; 
                }
            }
            
            
            if(slider!=='scroll' && slider!=='coverflow' && slider!=='continuously'){
                delete settings.visible_opt_slider;
                delete settings.tab_visible_opt_slider;
                delete settings.mob_visible_opt_slider;
                delete settings.scroll_opt_slider;
            }
            else{
                if(slider==='continuously'){
                    delete settings.auto_scroll_opt_slider;
                }
                if(settings.mob_visible_opt_slider && settings.tab_visible_opt_slider && ~~settings.mob_visible_opt_slider===~~settings.tab_visible_opt_slider){
                    delete settings.mob_visible_opt_slider;
                }
                if(settings.visible_opt_slider && settings.tab_visible_opt_slider && ~~settings.visible_opt_slider===~~settings.tab_visible_opt_slider){
                    delete settings.tab_visible_opt_slider;
                }
            }
            
            
            if(!settings.auto_scroll_opt_slider || settings.auto_scroll_opt_slider==='off'){
                delete settings.pause_on_hover_slider;
                delete settings.play_pause_control;
                delete settings.auto_scroll_opt_slider;
            }
            else {
                if(settings.pause_on_hover_slider==='resume'){
                    delete settings.pause_on_hover_slider;
                }
                if(settings.play_pause_control==='no'){
                    delete settings.play_pause_control;
                }
            }
        }
    };
})(tb_app);