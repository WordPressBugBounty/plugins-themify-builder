 (api => { 
    "use strict";
    let isRestore,
        contentTab;
    const getDefaultContent=item=>{
        return [{
            cols:[{ 
                modules:[ {
                    mod_name:'text',
                    mod_settings:{
                        content_text:item?.text_tab || i18n.tabc
                    }
                }]   
            }]
        }];  
    };
    api.ModuleTab=class extends api.Module{
        constructor(fields) {
            const arr = fields.mod_settings?.tab_content_tab;
            if(arr){
                for(let i=arr.length-1;i>-1;--i){
                    if(!arr[i].builder_content){
                        arr[i].builder_content=getDefaultContent(arr[i]);
                        delete arr[i].text_tab;
                    }
                }
            }
            super(fields);
        }
        static getOptions() {
            const options= [
                    {
                        id: 'mod_title_tab',
                        type: 'title'
                    },
                    {
                        id: 'tab_content_tab',
                        type: 'builder',
                        options: [
                            {
                                id: 'title_tab',
                                type: 'text',
                                label: 'tabt',
                                control: {
                                    selector: '.tab-nav a span'
                                }
                            },
                            {
                                id: 'desc',
                                type: 'textarea',
                                label: 'desc',
                                control: {
                                    selector: '.tab-nav a small'
                                }
                            },
                            {
                                id: 'icon_tab',
                                type: 'icon',
                                label: 'icon'
                            }
                        ]
                    },
                    {
                        type: 'group',
                        label: 'tabl',
                        display: 'accordion',
                        options: [
                            {
                                id: 'layout_tab',
                                type: 'layout',
                                label: 'tabl',
                                mode: 'sprite',
                                default:'minimal',
                                options: [
                                    {
                                        img: 'tab_frame',
                                        value: 'tab-frame',
                                        label: 'tabf'
                                    },
                                    {
                                        img: 'tab_window',
                                        value: 'panel',
                                        label: 'tabw'
                                    },
                                    {
                                        img: 'tab_vertical',
                                        value: 'vertical',
                                        label: 'tabv'
                                    },
                                    {
                                        img: 'tab_minimal',
                                        value: 'minimal',
                                        label: 'tabm'
                                    }
                                ],
                                control: {
                                    classSelector: ''
                                }
                            },
                            {
                                id: 'style_tab',
                                type: 'select',
                                label: 'tabi',
                                options: {
                                    default: 'icbt',
                                    'icon-top': 'icat',
                                    'icon-only': 'icjt'
                                }
                            },
                            {
                                id: 'allow_tab_breakpoint',
                                label: 'tabmob',
                                type: 'toggle_switch',
                                options: {
                                    on: {
                                        name: 'allow_tab',
                                        value: 'en'
                                    },
                                    off: {
                                        name: '',
                                        value: 'dis'
                                    }
                                },
                                binding: {
                                    checked: {
                                        show: 'tab_breakpoint'
                                    },
                                    not_checked: {
                                        hide: 'tab_breakpoint'
                                    }
                                }
                            },
                            {
                                id: 'tab_breakpoint',
                                label: '',
                                type: 'number',
                                after: 'bppx',
                                wrap_class: 'tb_checkbox_element_allow_tab'
                            },
                            {
                                id: 'color_tab',
                                type: 'layout',
                                mode: 'sprite',
                                label: 'tabcol',
                                class: 'tb_colors',
                                color: true,
                                transparent: true,
                                control: {
                                    classSelector: ''
                                }
                            },
                            {
                                id: 'tab_appearance_tab',
                                type: 'checkbox',
                                label: 'tabapp',
                                appearance: true
                            },
                            {
                                id: 'hashtag',
                                type: 'toggle_switch',
                                label: 'uhtag',
                                options: 'simple'
                            },
                            {
                                id: 'fx',
                                type: 'select',
                                label: 'effect',
                                options: {
                                    '' : '',
                                    fadeIn: 'fadein',
                                    fadeInUp: 'fadeInUp',
                                    fadeInLeft: 'fadeInLeft',
                                    fadeInRight: 'fadeInRight',
                                    fadeInDown: 'fadeInDown',
                                    bounceInUp: 'bounceInUp',
                                    bounceInDown: 'bounceInDown',
                                    bounceInLeft: 'bounceInLeft',
                                    bounceInRight: 'bounceInRight',
                                    rotateIn: 'rotateIn',
                                    rotateInDownLeft: 'rotateInDownLeft',
                                    rotateInDownRight: 'rotateInDownRight',
                                    rotateInUpLeft: 'rotateInUpLeft',
                                    rollIn: 'rollIn',
                                    slideInUp: 'slideInUp',
                                    slideInDown: 'slideInDown',
                                    slideInLeft: 'slideInLeft',
                                    slideInRight: 'slideInRight',
                                    zoomInUp: 'zoomInUp',
                                    zoomInLeft: 'zoomInLeft',
                                    zoomInRight: 'zoomInRight',
                                    zoomInDown: 'zoomInDown'
                                }
                            }
                        ]
                    },
                    {
                        type : 'group',
                        label : 'autoplay',
                        display: 'accordion',
                        options: [
                            {
                                id : 'autoplay',
                                label : 'tabauto',
                                type : 'toggle_switch',
                                options: {
                                    on: {
                                        name: 'y',
                                        value: 'en'
                                    },
                                    off: {
                                        name: '',
                                        value: 'dis'
                                    }
                                },
                                binding : {
                                    checked : { show : [ 'autoplay_timer', 'autoplay_c', 'pauseh', 'timerbar' ] },
                                    not_checked : { hide : [ 'autoplay_timer', 'autoplay_c', 'pauseh', 'timerbar' ] }
                                }
                            },
                            {
                                id : 'autoplay_timer',
                                type : 'number',
                                label : 'timer',
                                after : 'sec'
                            },
                            {
                                id : 'autoplay_c',
                                label : 'tabaps',
                                type : 'toggle_switch',
                                options : {
                                    on: {
                                        name: 'y',
                                        value: 'en'
                                    },
                                    off: {
                                        name: '',
                                        value: 'dis'
                                    }
                                },
                                help : 'tabapsh'
                            },
                            {
                                id : 'timerbar',
                                label : 'tabtbar',
                                type : 'toggle_switch',
                                options : 'simple'
                            },
                            {
                                id : 'pauseh',
                                label : 'pauseonh',
                                type : 'toggle_switch',
                                options : 'simple',
                                default : 'on'
                            }
                        ]
                    },
                    {
                        type: 'custom_css_id',
                        custom_css: 'css_tab'
                    }
                ];
            if(!api.isVisual){
                options[1].options.splice(1,0,{
                    label:'',
                    id:'',
                    control:{control_type:'builderEdit'},
                    class:'tb_open_builder_lb',
                    name:i18n.edc,
                    type:'button'
                });
            }
            return options;
        }
        static default(){
            return {
                tab_content_tab:[
                    {
                        title_tab:i18n.tabt
                    }
                ]
            };
        }
        static builderSave(settings){
            const def={
                layout_accordion:'minimal',
                color_tab:'default',
                style_tab:'default',
                tab_appearance_tab:false,
                hashtag:'no',
                timerbar : 'no',
                pauseh : 'yes'
            },
            tabs=settings.tab_content_tab;
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(settings.tab_appearance_tab==='|'){
                delete settings.tab_appearance_tab;
            }
            if(settings.allow_tab_breakpoint!=='allow_tab'){
                delete settings.tab_breakpoint;
            }
            if ( ! settings.autoplay ) {
                delete settings.autoplay_timer;
                delete settings.autoplay_c;
            }
            if(tabs){
                for(let i=tabs.length-1;i>-1;--i){
                    let tab=tabs[i],
                        builder_content=tab.builder_content;
                    if(!tab.icon_tab){
                        delete tab.icon_tab;
                    }
                    if(!tab.title_tab){
                        delete tab.title_tab;
                    }
                    if(builder_content){
                        this.cleanBuilderType(builder_content);
                    }
                }
            }
            super.builderSave(settings);
        }
        async restore(){
            isRestore=true;
            await super.restore();
            isRestore=null;
        }
        saveLightbox(settings){
            if(!api.isVisual){
                const settingsTab=settings.tab_content_tab;
                for(let i=0;i<contentTab.length;++i){
                    if(settingsTab[i]!==undefined && contentTab[i].builder_content){
                        settingsTab[i].builder_content=contentTab[i].builder_content;
                    }
                }
                contentTab=null;
            }
        }
        close(){
            contentTab=null;
        }
        async edit(type){
            const isOpen=api.activeModel?.id === this.id;
            await super.edit(type);
            if(isOpen===false){
                const settings=this.get('mod_settings');
                this.parseHtml(settings);
                if(!api.isVisual && !contentTab){
                    contentTab=api.Helper.cloneObject(settings.tab_content_tab);
                }
            }
        }
        addRow(){
            if(!api.isVisual){
                contentTab.push({});
            }
        }
        deleteRow(item,parent){
            const index=Themify.convert(parent.children).indexOf(item);
            if(api.isVisual){
                const tab=this.el.querySelector('ul.tab-nav').children[index];
                if(tab){
                    const id=tab.tfTag('a')[0].getAttribute('href');
                    tab.remove();
                    this.el.querySelector('[data-id="'+id.replace('#','')+'"]').remove();
                }
            }else{
                contentTab.splice(index,1);
            }
        }
        sortRow(item,oldIndex,newIndex){
            if(api.isVisual){
                const childs=this.el.querySelector('ul.tab-nav').children,
                    items=this.el.tfClass('module-tab')[0].children,
                    contents=[],
                    tabTitle=childs[oldIndex];
                for(let i=0;i<items.length;++i){
                    if(items[i].classList.contains('tab-content')){
                        contents.push(items[i]);
                    }
                }
                const tabContent=contents[oldIndex];
                if(newIndex>=1){
                    if((newIndex-1)!==oldIndex && oldIndex>newIndex){
                        --newIndex;
                    }
                    childs[newIndex].after(tabTitle);
                    contents[newIndex].after(tabContent);
                }
                else{
                    childs[newIndex].before(tabTitle);
                    contents[newIndex].before(tabContent);
                }
            }
            else{
                contentTab.splice(newIndex, 0, contentTab.splice(oldIndex, 1)[0]); 
            }
        }
        duplicateRow(vals,orig,row){
            const index=Themify.convert(row.parentNode.children).indexOf(row);
            if(api.isVisual){
                const title=this.el.querySelector('ul.tab-nav').children[index],
                    id=title.tfTag('a')[0].getAttribute('href'),
                    content=this.el.querySelector('[data-id="'+id.replace('#','')+'"]'),
                    settings=this._getBuilderContent(content);
                    api.Helper.clearElementId(settings,true);
                    const {tabTitleWrap,tabContent}=this._getItem({builder_content:settings},{},1,true);
                    title.after(tabTitleWrap);
                    content.after(tabContent);
            }
            else{
                const settings=api.Helper.cloneObject(contentTab[index]);
                if(settings.builder_content){
                    api.Helper.clearElementId(settings.builder_content,true);
                }
                contentTab.splice(index+1,0,settings);
            }
        }
        _getBuilderContent(tabContent,saving){
            const content=tabContent.children,
                subrows=[];
            for(let i=0;i<content.length;++i){
                subrows.push(api.Utils.getRowSettings(content[i],'subrow',saving));
            }
            return subrows;
        }
        
        async builderContentEdit(el){
            let field=el.closest('.tb_repeatable_field'),
                index=Themify.convert(field.parentNode.children).indexOf(field);
            if(api.activeModel){
                await api.LightBox.save();
            }
            await this.constructor.loadBackendLightbox();
            if(index===-1){
                index=0;
            }
            const content_tabs=this.get('mod_settings').tab_content_tab,
            rows=[];
            for(let i=0;i<content_tabs.length;i++){
                rows[i]={title:content_tabs[i].title_tab,content:content_tabs[i].builder_content || getDefaultContent()};
            }
            (new TB_BuilderContentLightbox(this,'tb_tabs_edit')).open(rows,index);
        }
        builderContentSave(data){
            const settings=this.get('mod_settings'),
            tabs=settings.tab_content_tab;
            for(let i=tabs.length-1;i>-1;--i){
                tabs[i].builder_content=data[i];
            }
            this.set('mod_settings',settings);
        }
        parseHtml(settings,saving){
            if(api.isVisual){
                const rows=settings.tab_content_tab;
                if(rows){
                    const items=this.el.tfClass('module-tab')[0]?.querySelectorAll(':scope>.tab-content');
                    if(items){
                        for(let i=0;i<items.length;++i){
                            if(rows[i]!==undefined){
                                rows[i].builder_content=this._getBuilderContent(items[i]);
                            }
                        }
                    }
                }
            }
        }
        _getItem(item,data,index,setCss){
            let tabId='tab-' +this.id+'-'+index,
                tabTitleWrap=createElement('li',{class:'tb_is_repeat'+(index===0?' current':''),'aria-expanded':index===0}),
                link=createElement('a',{href:'#'+tabId}),
                span = createElement('span'),
                tabContent=createElement('',{class:'tab-content tf_clear','data-id':tabId,'aria-hidden':index!==0}),
                builder_content=item.builder_content || getDefaultContent(item),
                fr=createDocumentFragment(),
                settings=[],
                containers=[];
                 for(let i=0;i<builder_content.length;++i){
                    let subrow=new api.Subrow(builder_content[i]);
                    fr.appendChild(subrow.el);
                    containers.push(subrow.id);
                }
            
            if(api.is_builder_ready === true){
                for(let i=0,allItems=fr.querySelectorAll('[data-cid]');i<allItems.length;++i){
                    settings.push(allItems[i].dataset.cid);
                }
                tabContent.appendChild(fr);
                setCss??=api.bootstrap_working;
                api.bootstrap(settings,undefined,!!setCss).then(()=>{
                    for(let i=containers.length-1;i>-1;--i){
                        api.Utils.runJs(api.Registry.get(containers[i]).el,'subrow');
                    }
                });
            }else{
                tabContent.appendChild(fr);
            }
            if(item?.title_tab && data.style_tab!=='icon-only'){
                link.appendChild(span);
                this.constructor._setEditableContent(span,'title_tab',item.title_tab,'','tab_content_tab');
            }
            if(item?.icon_tab){
                const icon=createElement('em');
                icon.appendChild(api.Helper.getIcon(item.icon_tab));
                link.prepend(icon);
            }
            if ( item?.desc ) {
                const desc = createElement('small');
                desc.className = 'tb_tab_desc';
                link.appendChild(desc);
                this.constructor._setEditableContent(desc,'desc',item.desc,'','tab_content_tab');
            }
            tabTitleWrap.append(link,createElement('',{role:'button',class:'tb_del_btn tb_del_tab tf_close tb_disable_sorting',title:'Delete Tab'}));
            
            return {tabTitleWrap,tabContent};
        }
        preview(data){
            const color = data.color_tab && data.color_tab!=='default'?data.color_tab:'tb_default_color',
                {layout_tab:layout= 'minimal',tab_content_tab:arr=[]}=data,
                module=createElement(),
                currentActiveWrap=createElement('','tab-nav-current-active tf_hide'),
                burgerIcon=createElement('span','tab_burger_icon tf_rel'),
                tabNav=createElement('ul','tab-nav tf_clearfix'),
                classes=['module','module-tab','ui'],
                checkClass=[layout,color,data.css_tab];
                if(data.style_tab){
                    classes.push('tab-style-'+data.style_tab);
                }
                if(data.tab_appearance_tab){
                    checkClass[data.tab_appearance_tab.split('|').join(' ')];
                }
                for(let i=0;i<checkClass.length;++i){
                    if(checkClass[i]){
                        classes.push(checkClass[i]);
                    }
                }
                module.className=classes.join(' ');
                if('allow_tab' === data.allow_tab_breakpoint && '' !== data.tab_breakpoint){
                    module.dataset.tabBreakpoint=data.tab_breakpoint;
                }
                
                currentActiveWrap.append(
                    burgerIcon,
                    this.constructor._setEditableContent(createElement('span','tb_tab_title'),'title_tab',arr[0]?.title_tab,'','tab_content_tab',0)
                );
                
                if(data.mod_title_tab){
                    module.appendChild(this.constructor.getModuleTitle(data.mod_title_tab,'mod_title_tab'));
                }
                module.append(currentActiveWrap,tabNav);
                if(api.activeModel?.id===this.id && !isRestore){
                    this.parseHtml(data);
                }
                module.tfOn(_CLICK_,e=>{
                    const target=e.target,
                        cl=target?.classList;
                    if(cl.contains('tb_add_tab') || cl.contains('tb_del_tab')){
                        e.stopPropagation();
                        if(cl.contains('tb_add_tab')){
                            if(api.activeModel?.id===this.id){
                                Themify.triggerEvent(api.LightBox.el.tfClass('add_new')[0],e.type);
                            }
                            else{
                                api.undoManager.start('inlineAdd');
                                const settings=this.get('mod_settings'),
                                    ul=this.el.tfClass('tab-nav')[0],
                                def=this.constructor.default().tab_content_tab?.[0] || {};
                                settings.tab_content_tab??=[];
                                const index=settings.tab_content_tab.push(def),
                                    {tabTitleWrap,tabContent}=this._getItem(def,settings,index);
                                tabTitleWrap.appendChild(target);
                                ul.appendChild(tabTitleWrap);
                                ul.parentNode.appendChild(tabContent);
                                this.set('mod_settings',settings);
                                api.undoManager.end('inlineAdd');
                            }
                        }
                        else{
                            const li=target.closest('li'),
                                index=Themify.convert(li.parentNode.children).indexOf(li);
                            if(index!==-1){
                                if(api.activeModel?.id===this.id){
                                    Themify.triggerEvent(api.LightBox.el.tfClass('tb_delete_row')[index],e.type);
                                }
                                else{
                                    api.undoManager.start('inlineDelete');
                                    const settings=this.get('mod_settings'),
                                        id=li.tfTag('a')[0].getAttribute('href'),
                                        addBtn=li.tfClass('tb_add_btn')[0],
                                        content=this.el.querySelector('[data-id="'+id.replace('#','')+'"]');
                                    settings.tab_content_tab.splice(index, 1); 
                                    this.set('mod_settings',settings);
                                    if(addBtn){
                                        li.previousElementSibling?.appendChild(addBtn);
                                    }
                                    content.remove();
                                    li.remove();
                                    api.undoManager.end('inlineDelete');
                                }
                            }
                        }
                    }
                },{passive:true});
                
                
                for(let i=0,len=arr.length;i<len;++i){
                    let {tabTitleWrap,tabContent}=this._getItem(arr[i],data, i);
                    if((len -1)===i){
                        tabTitleWrap.appendChild(createElement('',{role:'button',class:'tb_add_btn tb_add_tab tf_plus_icon tb_disable_sorting',title:'Add Tab'}));
                    }
                    tabNav.appendChild(tabTitleWrap);
                    module.appendChild(tabContent);
                }
                return module;
        }
    };
})(tb_app);