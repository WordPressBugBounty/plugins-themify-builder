(api => {
    "use strict";
    let isRestore,
        contentAccordion;
    const getDefaultContent=item=>{
        return [{
            cols:[{ 
                modules:[ {
                    mod_name:'text',
                    mod_settings:{
                        content_text:item?.text_accordion || i18n.acccont
                    }
                }]   
            }]
        }];  
    };
    api.ModuleAccordion = class extends api.Module {
        constructor(fields) {
            const arr = fields.mod_settings?.content_accordion;
            if(arr){
                for(let i=arr.length-1;i>-1;--i){
                    if(!arr[i].builder_content){
                        arr[i].builder_content=getDefaultContent(arr[i]);
                        delete arr[i].text_accordion;
                    }
                }
            }
            super(fields);
        }
        static getOptions() {
            const options= [
                {
                    id: 'mod_title_accordion',
                    type: 'title'
                },
                {
                    id: 'content_accordion',
                    type: 'builder',
                    options: [
                        {
                            id: 'title_accordion',
                            type: 'text',
                            label: 'acct',
                            class: 'large',
                            control: {
                                selector: ':scope>.module>ul>li>.accordion-title span'
                            }
                        },
                        {
                            id: 'default_accordion',
                            type: 'radio',
                            label: 'def',
                            options: [
                                {
                                    value: 'closed',
                                    name: 'closed'
                                },
                                {
                                    value: 'open',
                                    name: 'open'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'schema',
                    type: 'toggle_switch',
                    label: 'faqs',
                    options: {
                        on: {
                            name: 'yes'
                        }
                    },
                    help: 'faqsh'
                },
                {
                    id: 'title_tag',
                    type: 'select',
                    label: 'acctt',
					options: {
						'': 'divt',
						h1: 'h1',
						h2: 'h2',
						h3: 'h3',
						h4: 'h4',
						h5: 'h5',
						h6: 'h6'
					}
                },
                {
                    type: 'group',
                    label: 'acclay',
                    display: 'accordion',
                    options: [
                        {
                            id: 'layout_accordion',
                            type: 'layout',
                            mode: 'sprite',
                            label: 'lay',
                            default:'default',
                            options: [
                                {
                                    img: 'accordion_default',
                                    value: 'default',
                                    label: 'contouspnls'
                                },
                                {
                                    img: 'accordion_separate',
                                    value: 'separate',
                                    label: 'seperpnls'
                                }
                            ],
                            control: {
                                classSelector: '.ui'
                            }
                        },
                        {
                            id: 'expand_collapse_accordion',
                            type: 'radio',
                            label: 'tglmode',
                            options: [
                                {
                                    value: 'toggle',
                                    name: 'tgl'
                                },
                                {
                                    value: 'accordion',
                                    name: 'acc'
                                }
                            ],
                            new_line: true,
                            help: 'acctglh'
                        },
                        {
                            id: 'color_accordion',
                            type: 'layout',
                            mode: 'sprite',
                            class: 'tb_colors',
                            label: 'c',
                            color: true,
                            transparent: true,
                            control: {
                                classSelector: '.ui'
                            }
                        },
                        {
                            id: 'accordion_appearance_accordion',
                            type: 'checkbox',
                            label: 'app',
                            appearance: true
                        },
                        {
                            type: 'multi',
                            label: 'icon',
                            options: [
                                {
                                    id: 'icon_accordion',
                                    type: 'icon',
                                    label: 'iclosed'
                                },
                                {
                                    id: 'icon_active_accordion',
                                    type: 'icon',
                                    label: 'iopened'
                                }
                            ]
                        },
                        {
                            id: 'hashtag',
                            type: 'toggle_switch',
                            label: 'uhtag',
                            options: 'simple',
                            default:'off',
                            control:false
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_accordion'
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
        static default() {
            return {
                    content_accordion: [{
                        title_accordion: i18n.acct
                    }
                ]
            };
        }
        static builderSave(settings){
            const def={
                layout_accordion:'default',
                expand_collapse_accordion:'toggle',
                color_accordion:'default',
                accordion_appearance_accordion:false,
                hashtag:'no'
            },
            accordion=settings.content_accordion;
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(settings.accordion_appearance_accordion==='|'){
                delete settings.accordion_appearance_accordion;
            }
            if(accordion){
                for(let i=accordion.length-1;i>-1;--i){
                    let acc=accordion[i],
                        builder_content=acc.builder_content;
                    if(acc.default_accordion==='closed'){
                        delete acc.default_accordion;
                    }
                    if(!acc.title_accordion){
                        delete acc.title_accordion;
                    }
                    if(builder_content){
                        this.cleanBuilderType(builder_content);
                    }
                }
            }
            super.builderSave(settings);
        }
        saveLightbox(settings){
            if(!api.isVisual){
                const settingsAccordion=settings.content_accordion;
                for(let i=0;i<contentAccordion.length;++i){
                    if(settingsAccordion[i]!==undefined && contentAccordion[i].builder_content){
                        settingsAccordion[i].builder_content=contentAccordion[i].builder_content;
                    }
                }
                contentAccordion=null;
            }
        }
        close(){
            contentAccordion=null;
        }
        async edit(type){
            const isOpen=api.activeModel?.id === this.id;
            await super.edit(type);
            if(isOpen===false){
                const settings=this.get('mod_settings');
                this.parseHtml(settings);
                if(!api.isVisual && !contentAccordion){
                    contentAccordion=api.Helper.cloneObject(settings.content_accordion);
                }
            }
        }
        addRow(){
            if(!api.isVisual){
                contentAccordion.push({});
            }
        }
        deleteRow(item,parent){
            const index=Themify.convert(parent.children).indexOf(item);
            if(api.isVisual){
                this.el.querySelector('ul.ui').children[index]?.remove();
            }else{
                contentAccordion.splice(index,1);
            }
        }
        sortRow(item,oldIndex,newIndex){
            if(api.isVisual){
                const childs=this.el.querySelector('ul.ui').children,
                    accItem=childs[oldIndex];
                
                if(newIndex>=1){
                    if((newIndex-1)!==oldIndex && oldIndex>newIndex){
                        --newIndex;
                    }
                    childs[newIndex].after(accItem);
                }else{
                    childs[newIndex].before(accItem);
                }
            }else{
                contentAccordion.splice(newIndex, 0, contentAccordion.splice(oldIndex, 1)[0]); 
            }
        }
        duplicateRow(vals,orig,row){
            const index=Themify.convert(row.parentNode.children).indexOf(row);
            if(api.isVisual){
                const accItem=this.el.querySelector('ul.ui').children[index],
                    settings=this._getBuilderContent(accItem);
                    api.Helper.clearElementId(settings,true);
                    accItem.after(this._getItem({builder_content:settings},{},1,true));
                    
            }else{
                const settings=api.Helper.cloneObject(contentAccordion[index]);
                if(settings.builder_content){
                    api.Helper.clearElementId(settings.builder_content,true);
                }
                contentAccordion.splice(index+1,0,settings);
            }
        }
        async restore(){
            isRestore=true;
            await super.restore();
            isRestore=null;
        }
        _getBuilderContent(item,saving){
            const content=item.querySelector(':scope>.accordion-content').children,
                subrows=[];
            for(let i=0;i<content.length;++i){
                subrows.push(api.Utils.getRowSettings(content[i],'subrow',saving));
            }
            return subrows;
        }
        async builderContentEdit(el){
            let field=el.closest('.tb_repeatable_field'),
                index=Themify.convert(field.parentNode.children).indexOf(field);
            if(api.activeModel ){
                await api.LightBox.save();
            }
            await this.constructor.loadBackendLightbox();
            if(index===-1){
                index=0;
            }
            const content_accordion=this.get('mod_settings').content_accordion,
            rows=[];
            for(let i=0;i<content_accordion.length;i++){
                rows[i]={title:content_accordion[i].title_accordion,content:content_accordion[i].builder_content || getDefaultContent()};
            }
            (new TB_BuilderContentLightbox(this,'tb_acc_edit')).open(rows,index);
        }
        builderContentSave(data){
            const settings=this.get('mod_settings'),
            acc=settings.content_accordion;
            for(let i=acc.length-1;i>-1;--i){
                acc[i].builder_content=data[i];
            }
            this.set('mod_settings',settings);
        }
        parseHtml(settings,saving){
            if(api.isVisual){
                const rows=settings.content_accordion;
                if(rows){
                    const items=this.el.querySelector('ul.ui')?.children;
                    if(items){
                        for(let i=0;i<items.length;++i){
                            if(rows[i]!==undefined){
                                rows[i].builder_content=this._getBuilderContent(items[i],saving);
                            }
                        }
                    }
                }
            }
        }
        _getItem(item,data,index,setCss){
            const isOpen = item.default_accordion === 'open',
                tabId = 'acc-' +this.id+'-'+index,
                li = createElement('li','tb_is_repeat'+(isOpen?' builder-accordion-active':'')),
                link = createElement('a',{class:'tb_title_accordion',href:'#' + tabId,'aria-controls': tabId + '-content','aria-expanded': isOpen}),
                title = createElement( data.title_tag || 'div','accordion-title tf_rel' ),
                content = createElement('',{id:tabId + '-content',class:'accordion-content tf_clearfix'+(!isOpen?' tf_hide':''),'data-id':tabId,'aria-hidden':isOpen}),
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
                content.appendChild(fr);
                setCss??=api.bootstrap_working;
                api.bootstrap(settings,undefined,!!setCss).then(()=>{
                    for(let i=containers.length-1;i>-1;--i){
                        api.Utils.runJs(api.Registry.get(containers[i]).el,'subrow');
                    }
                });
            }else{
                content.appendChild(fr);
            }


            this.constructor._setEditableContent(link,'title_accordion',item.title_accordion,'','content_accordion');
            if (data.icon_active_accordion) {
                let activeIcon = createElement('i','accordion-active-icon' + (!isOpen ? ' tf_hide' : ''));
                activeIcon.appendChild(api.Helper.getIcon(data.icon_active_accordion));
                link.prepend(activeIcon);
            }
            if (data.icon_accordion) {
                let icon = createElement('i','accordion-icon' + (isOpen ? ' tf_hide' : ''));
                icon.appendChild(api.Helper.getIcon(data.icon_accordion));
                link.prepend(icon);
            }
            title.append(link,createElement('',{role:'button',class:'tb_del_btn tb_del_acc tf_close tb_disable_sorting',title:'Delete Accordion'}));
            li.append(title, content);
            return li;
        }
        preview(data) {
            const color = data.color_accordion && data.color_accordion !== 'default' ? data.color_accordion : 'tb_default_color',
                    arr = data.content_accordion || [],
                    module =createElement('','module module-accordion'+(data.css_accordion?' '+data.css_accordion:'')),
                    ul = createElement('ul'),
                    ulClasses = ['module-accordion', 'ui',color];
            if (data.expand_collapse_accordion) {
                module.dataset.behavior = data.expand_collapse_accordion;
            }
            if (data.layout_accordion) {
                ulClasses.push(data.layout_accordion);
            }
            if (data.accordion_appearance_accordion) {
                ulClasses.push(data.accordion_appearance_accordion.split('|').join(' '));
            }
            if(api.activeModel?.id===this.id && !isRestore){
                this.parseHtml(data);
            }
            ul.className = ulClasses.join(' ');

            for (let i = 0; i < arr.length; ++i) {
                ul.appendChild(this._getItem(arr[i],data, i));
            }
            module.tfOn(_CLICK_,e=>{
                const target=e.target,
                    cl=target?.classList;
                if(cl.contains('tb_add_acc') || cl.contains('tb_del_acc')){
                    e.stopPropagation();
                    if(cl.contains('tb_add_acc')){
                        if(api.activeModel?.id===this.id){
                            Themify.triggerEvent(api.LightBox.el.tfClass('add_new')[0],e.type);
                        }
                        else{
                            api.undoManager.start('inlineAdd');
                            const settings=this.get('mod_settings'),
                            def=this.constructor.default().content_accordion?.[0] || {};
                            settings.content_accordion??=[];
                            const index=settings.content_accordion.push(def);
                            this.el.tfTag('ul')[0].appendChild(this._getItem(def,settings,index));
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
                                const settings=this.get('mod_settings');
                                settings.content_accordion.splice(index, 1); 
                                this.set('mod_settings',settings);
                                li.remove();
                                api.undoManager.end('inlineDelete');
                            }
                        }
                    }
                }
                
            },{passive:true});
            if (data.mod_title_accordion) {
                module.appendChild(this.constructor.getModuleTitle(data.mod_title_accordion,'mod_title_accordion'));
            }
            module.append(ul,createElement('',{class:'tb_add_btn tb_add_acc tf_plus_icon tb_disable_sorting',role:'button',title:'Add Accordion'}));
            return module;
        }
    };
})(tb_app);