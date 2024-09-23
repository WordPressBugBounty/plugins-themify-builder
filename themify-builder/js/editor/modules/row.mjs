(api => {
    "use strict";
    api.Row = class extends api.Base {
        constructor(fields) {
            super(fields);
            if(fields.sizes?.length!==undefined){
                fields.sizes = {};
            }
            this.convertToGrid(fields);//convert old data to grid
            if (!(this instanceof  api.Subrow )) {//hack js isn't real OOP,doesn't recognize child class props/method in constructor
                this.type = 'row';
                this.initialize();
                this.render();
            }
        }
        static getSettingsName(slug) {
            return i18n.ropt;
        }
        static getOptions() {
            return [
                {
                    id: 'row_width',
                    label: 'rw',
                    type: 'layout',
                    mode: 'sprite',
                    options: [
                        {
                            img: 'row_default',
                            label: 'def'
                        },
                        {
                            img: 'row_fullwidth',
                            value: 'fullwidth',
                            label: 'box'
                        },
                        {
                            img: 'row_fullwidth_content',
                            value: 'fullwidth-content',
                            label: 'fw'
                        }
                    ]
                },
                {
                    id: 'row_height',
                    label: 'rh',
                    type: 'layout',
                    mode: 'sprite',
                    options: [
                        {
                            img: 'row_default',
                            label: 'def'
                        },
                        {
                            img: 'row_fullheight',
                            value: 'fullheight',
                            label: 'fh'
                        }
                    ]
                },
                {
                  type:'grid'  
                },
                {
                    id: 'custom_css_row',
                    type: 'custom_css'
                },
                {
                    id: 'row_anchor',
                    type: 'row_anchor',
                    label: 'ranc',
                    class: 'large',
                    help: 'ranch'
                },
                {
                    id: 'hide_anchor',
                    type: 'checkbox',
                    label: '',
                    options: [
                        {
                            name: '1',
                            value: 'hranc'
                        }
                    ]
                },
                {
                    type: 'custom_css_id'
                },
                {
                    type: 'clickable'
                }
            ];
        }
        initialize() {
            super.initialize();
        }
        defaults() {
            return {
                cols: [],
                styling: {}
            };
        }
        attributes() {
            const data = this.get('styling'),
                    attr = {
                        class: 'module_row tb_active_row tb_' + this.id
                    };
            if (data !== null) {
                if (data.custom_css_row !== undefined && data.custom_css_row !== '') {
                    attr.class += ' ' + data.custom_css_row;
                }
                if (data.row_width === 'fullwidth-content') {
                    attr.class += ' fullwidth';
                }
                if (data.custom_css_id !== undefined && data.custom_css_id !== '') {
                    attr.id = data.custom_css_id;
                }
            }
            return attr;
        }
        render() {
            let not_empty = false,
                cols = this.get('cols');
            if(!Array.isArray(cols)){//very very old saved data can be object, not array.
                cols=Object.values(cols);
            }
            const isSubRow=this.type === 'subrow',
                container = isSubRow?this.el.tfClass('module_subrow')[0]:this.el.tfClass(this.type + '_inner')[0],
                fr = createDocumentFragment(),
                len = cols.length,
                cl=[];
            
            if (len > 0) {
                if (len > 1 && this.get('desktop_dir') === 'rtl') { //it's old version data. Should follow dom order in desktop mode
                    cols = cols.reverse();
                }
                for (let i = 0; i < len; ++i) {  
                    if (cols[i] !== undefined && cols[i] !== null) {
                        let c = new api.Column(cols[i], isSubRow);
                      
                        fr.appendChild(c.el);
                        if (not_empty === false) {
                            let m = c.get('modules');
                            not_empty = m?.length > 0;
                        }
                        if (len > 1 && (i === 0 || i === (len - 1))) {
                            c.el.classList.add((i === 0 ? 'first' : 'last'));
                        }
                    }
                }
                cl.push('tb_col_count_' + len);
                if (len > 1) {
                    //backward compatibility
                    const sizes = this.get('sizes');
                    if (!api.isFrontend) {
                        const points = api.breakpointsReverse,
                                st = this.get('styling'),
                                data = {grid: Object.assign({count: len, model: this}, sizes)};
                        data.grid.desktop_size??= len;
                        for (let i = points.length - 1; i > -1; --i) {
                            let vals = ThemifyStyles.fields.grid.call(ThemifyStyles, 'grid', this.type, {}, data, this.id, st, points[i], true);
                            this.setGridCss(vals, points[i]);
                        }
                    }
                    let align = sizes.desktop_align;
                    if (align === undefined) {
                        align = api.isFullSection === true ? 'center' : 'start';
                    }
                    if (align === 'start') {
                        align = 'top';
                    } else {
                        align = align === 'center' ? 'middle' : 'bottom';
                    }
                    cl.push('col_align_' + align);
                    if (sizes.desktop_dir === 'rtl') {
                        cl.push('direction_rtl');
                    }
                    if (sizes.desktop_gutter === 'narrow' || sizes.desktop_gutter === 'none') {//backward
                        cl.push('gutter-' + sizes.desktop_gutter);
                    }
                    if (sizes.desktop_auto_h === 1) {
                        cl.push('col_auto_height');
                    }
                }
            } else {
                let col = new api.Column({}, isSubRow);
                fr.appendChild(col.el);
                cl.push('tb_col_count_1');
            }
            if (!isSubRow) {
                const anchor = this.get('row_anchor'),
                        custom_css_id = this.get('custom_css_id');
                if (anchor !== undefined && anchor !== '') {
                    this.el.tfClass('tb_row_anchor')[0].textContent = anchor || '';
                }
                if (custom_css_id !== undefined && custom_css_id !== '') {
                    this.el.tfClass('tb_row_id')[0].textContent = custom_css_id;
                }
                container.appendChild(fr);
            }
            else{
                cl.push('tb_' + this.id);
                container.prepend(fr);
            }
            container.className += ' ' + cl.join(' ');
            this.visibilityLabel();
            return this;
        }
        convertToGrid(fields) {
            const points = api.breakpointsReverse,
                    bpLength = points.length,
                    cols = fields.cols,
                    count = cols?.length || 0;
            let sizes = fields.sizes;

            if (sizes === undefined) {//this key should always exist in the grid version,even if it's empty
                sizes = {};
                let align = fields.column_alignment,
                        colh = fields.column_h;

                if (count > 1) {

                    const gutter = fields.gutter;
                    if (gutter && gutter !== 'gutter' && gutter !== 'gutter-default') {
                        sizes.desktop_gutter = gutter.replace('gutter-', '');
                    }
                    const g = sizes.desktop_gutter || 'def',
                            gridClass = [],
                            gridWidth = [];
                    let hasCustomWidth = false;
                    for (let i = 0; i < count; ++i) {
                        let custom_w = cols[i].grid_width;
                        if (custom_w) {
                            hasCustomWidth = true;
                            gridWidth.push(custom_w);
                            delete cols[i].grid_width;
                        }
                        if (cols[i].grid_class) {
                            gridClass.push(cols[i].grid_class);
                            if (!custom_w) {
                                gridWidth.push(cols[i].grid_class);
                            }
                        }
                    }
                    let desktop_size,
                            useResizing = hasCustomWidth;

                    if (useResizing === false && g !== 'def' && gridClass.length > 0) {
                        desktop_size = ThemifyStyles.gridBackwardCompatibility(gridClass);
                        //in old version gutter narrow,none have been done wrong for sizes 1_2,2_1,1_1_2,1_2_1 and etc we need to convert them to custom sizes to save the same layout
                        useResizing = desktop_size.includes('_');
                    }
                    if (useResizing === true) {
                        const colSizes = ThemifyStyles.getOldColsSizes(g);
                        for (let i = gridWidth.length - 1; i > -1; --i) {
                            if (typeof gridWidth[i] === 'string' && gridWidth[i].includes('col')) {
                                let cl = gridWidth[i].split(' ')[0].replace(/tb_3col|tablet_landscape|tablet|mobile|column|first|last/ig, '').trim();
                                if (colSizes[cl] !== undefined) {
                                    gridWidth[i] = colSizes[cl];
                                } else {
                                    gridWidth.splice(i, 1);
                                }
                            }
                        }
                        const min = Math.min.apply(null, gridWidth);
                        for (let i = gridWidth.length - 1; i > -1; --i) {
                            gridWidth[i] = min === gridWidth[i] ? '1fr' : (parseFloat((gridWidth[i] / min).toFixed(5)).toString() + 'fr');
                        }
                        desktop_size = gridWidth.join(' ');
                    } else if (!desktop_size && gridClass.length > 0) {
                        desktop_size = ThemifyStyles.gridBackwardCompatibility(gridClass);
                    }
                    if (desktop_size) {
                        desktop_size = ThemifyStyles.getColSize(desktop_size, false);
                        if (desktop_size !== '1' && desktop_size !== '2' && desktop_size !== '3' && desktop_size !== '4' && desktop_size !== '5' && desktop_size !== '6') {
                            if (fields.desktop_dir === 'rtl' && (useResizing === true || desktop_size.toString().includes('_'))) {
                                desktop_size = useResizing === true ? desktop_size.split(' ') : desktop_size.split('_');
                                desktop_size = desktop_size.reverse();
                                desktop_size = useResizing === true ? desktop_size.join(' ') : desktop_size.join('_');
                            }
                            sizes.desktop_size = desktop_size;
                        }
                    }
                    for (let i = bpLength - 1; i > -1; --i) {
                        let bp = points[i],
                                dir = fields[bp + '_dir'] || 'ltr',
                                col = fields['col_' + bp];

                        sizes[bp + '_dir'] = dir === '1' || dir === 1 ? 'rtl' : dir;

                        if (bp !== 'desktop') {
                            //backward compatibility for themify-builder-style.css media-query(by default all cols in mobile should be fullwidth)
                            let c = (col && col !== 'auto' && col !== '-auto') ? ThemifyStyles.gridBackwardCompatibility(col) : 'auto';

                            if (c === 'auto') {
                                if (hasCustomWidth === true) {
                                    c = desktop_size;
                                } else {
                                    let bpkey = bp[0],
                                            grid;
                                    if (bp.includes('_')) {
                                        bpkey += bp.split('_')[1][0];
                                    }
                                    grid = ThemifyStyles.getAreaValue('--area' + bpkey + count + '_' + c) || ThemifyStyles.getAreaValue('--area' + count + '_' + c); //check first for area for breakpoint e.g --aream5_3
                                    if (!grid) {
                                        for (let j = i + 1; j < bpLength; ++j) {
                                            grid = sizes[points[j] + '_size'];
                                            if (grid && grid !== 'auto') {
                                                grid = grid.includes('fr') ? grid : ThemifyStyles.gridBackwardCompatibility(grid);
                                                break;
                                            }
                                        }
                                        c = !grid ? count.toString() : grid;
                                    }
                                }
                            } else if (!c.toString().includes('_') && c > 0 && c < 6 && count < c) {
                                c = '';
                                for (let j = i + 1; j < bpLength; ++j) {
                                    if (sizes[points[j] + '_size'] !== undefined) {
                                        c = sizes[points[j] + '_size'];
                                        break;
                                    }
                                }
                            }
                            sizes[bp + '_size'] = c === '' ? '' : ThemifyStyles.getColSize(c, false);
                        }

                        delete fields[bp + '_dir'];
                        delete fields['col_' + bp];
                    }
                }
                if (align) {
                    if (align === 'col_align_top') {
                        align = '';
                    } else {
                        align = align === 'col_align_middle' ? 'center' : 'end';
                    }
                    if (align !== '') {
                        sizes.desktop_align = align;
                    }
                }
                sizes.desktop_auto_h = colh ? 1 : -1;
                delete fields.column_alignment;
                delete fields.gutter;
                delete fields.column_h;

            } else if (count > 1) {
                for (let i = 0; i < bpLength - 1; ++i) {
                    if (sizes[points[i] + '_size'] === undefined) {
                        for (let j = i + 1; j < bpLength - 1; ++j) {
                            if (sizes[points[j] + '_size'] !== undefined) {
                                sizes[points[i] + '_size'] = sizes[points[j] + '_size'];
                                break;
                            }
                        }
                    }
                }
            }
            this.fields.sizes = sizes;
        }
        isLightboxOpen(){
            return api.activeModel?.id===this.id && api.LightBox.el.querySelector('#tb_grid_lb_root')!==null;
        }
        syncLightbox(k,value){
            let lb=api.LightBox.el.querySelector('#tb_grid_lb_root')?.shadowRoot.querySelector('#grid'),
                item;
            if(lb){
                if(k === 'size'){
                    if(value.includes(' ')){
                        value='user';
                    }
                    item=lb.querySelector('[data-col="grid"] [data-grid="'+value+'"]');
                } 
                else if(k==='gutterVal'){
                    item=lb.querySelector('#range');
                    const gutterVal = parseFloat(value);
                    item.value=gutterVal;
                    lb.querySelector('#range_unit').value=value.toString().replace(gutterVal.toString(), '') || '%';
                    Themify.triggerEvent(item,'change');
                    return;
                }
                else{
                    item=lb.querySelector('[data-col="'+k+'"] [data-value="'+value+'"]');
                }
                if(item && !item.classList.contains('selected')){
                    Themify.triggerEvent(item,_CLICK_);
                }
                return true;
            }
        }
        saveLightbox(settings){
            delete settings[ThemifyConstructor.grid.id];
            const gridSetting=ThemifyConstructor.grid.get();
            if(gridSetting){
                this.set('sizes', {...gridSetting});
            }
        }
        getSizes(type, bp) {
            bp??= api.activeBreakPoint;
            let sizes =this.isLightboxOpen()?ThemifyConstructor.grid.get():this.get('sizes'),
                gutter, aligment, auto_h, area, size;
            if (sizes !== undefined) {
                for (let points = api.breakpointsReverse,i = points.indexOf(bp); i < points.length; ++i) {
                    let _bp=points[i];
                        gutter??= sizes[_bp + '_gutter'];
                        aligment??= sizes[_bp + '_align'];
                        size??= sizes[_bp + '_size'];
                        auto_h??= sizes[_bp + '_auto_h'];
                        area??= sizes[_bp + '_area'];
                    if (gutter && aligment && size && auto_h && area) {
                        break;
                    }
                }
            }
            
                        
            if (size) {
                size = ThemifyStyles.getColSize(size, false);
            }
            if (area) {
                const sel=this.type==='subrow'?'module_subrow':this.type + '_inner';
                area = ThemifyStyles.getArea(area, false, bp,  api.Utils.getColumns(this.el.tfClass(sel)[0]).length);
            }
            aligment??= api.isFullSection === true ? 'center' : 'start';
            let res = {gutter: gutter, align: aligment, size: size, auto_h: auto_h, area: area};
            if (type) {
                res = res[type];
            }
            return res;
        }
        setSizes(vals, bp) {
            bp??= api.activeBreakPoint;
            const isSame=this.isLightboxOpen(),
                sel=this.type==='subrow'?'module_subrow':this.type + '_inner',
                inner = this.el.tfClass(sel)[0],
                count = api.Utils.getColumns(inner).length,
                sizes =isSame?ThemifyConstructor.grid.get():this.get('sizes');
                
            for (let k in vals) {
                if (vals[k] === '') {
                    delete sizes[bp + '_' + k];
                }
                else if (vals[k] !== undefined && vals[k] !== null) {
                    if (k === 'gutter') {
                        vals[k] = ThemifyStyles.getGutter(vals[k]);
                    }
                    else if (k === 'size' && vals[k].includes(' ')) {
                        //if there is a grid with the same the size use it instead of custom size(e.g "2.1fr 1fr" will be become to grid 2_1)
                        vals[k] =ThemifyStyles.getColSize(vals[k], false);
                    }
                    sizes[bp + '_' + k] =vals[k].toString().replace(/  +/g, ' ').trim();
                }
            }
            if(count===1){
                for (let k in sizes) {
                    if(k===(bp+'_size')){
                        sizes[k]='1';
                    }
                }
            }
            if(isSame===true){
                ThemifyConstructor.grid.set(sizes);
            }
            else{
                this.set('sizes', sizes);
            }
        }
        getGridCss(vals, bp) {
            const data = {grid: {}};
            for (let k in vals) {
                if (k === 'size') {
                    if (vals[k]?.includes(' ')) {
                        vals[k] = ThemifyStyles.getColSize(vals[k], false);
                    }
                } else if (k === 'gutter') {
                    vals[k] = ThemifyStyles.getGutter(vals[k]);
                }
                if (bp !== k.split('_')[0]) {
                    data.grid[bp + '_' + k] = vals[k];
                } else {
                    data.grid[k] = vals[k];
                }
            }
            return ThemifyStyles.fields.grid.call(ThemifyStyles, 'grid', this.type, {}, data, this.id, null, bp, true);
        }
        setCols(vals, bp, update) {
            bp??=api.activeBreakPoint;
            if (vals.gutter !== undefined) {
                vals.gutter = ThemifyStyles.getGutter(vals.gutter);
            }

            const res = this.getGridCss(vals, bp);
            if(bp==='desktop' && vals.size?.toString()==='1'){
                res['--area'] = res['--colg'] = res['--col']=res['--align_items']=res['--align_content']='';
            }
            else{
                if (res['--align_items'] === undefined && vals.auto_h === '-1') {
                    res['--align_items'] = '';
                }
                if (res['--colg'] === undefined && vals.gutter === 'gutter') {
                    res['--colg'] = '';
                }
            }
            if (bp === 'desktop') { //backward
                const oldGutter = this.getSizes('gutter',bp),
                    sel=this.type==='subrow'?'module_subrow':this.type + '_inner',
                    cl = this.el.tfClass(sel)[0].classList;
                if (vals.gutter === 'none' || vals.gutter === 'narrow') {
                    cl.add('gutter-' + vals.gutter);
                }
                if (oldGutter) {
                    cl.remove('gutter-' + oldGutter);
                }
            }
            
            this.setGridCss(res, bp);
            if (update !== false) {
                const savedVals = ['align', 'area', 'size', 'gutter', 'auto_h'],
                    newVals = {};
                for (let i = savedVals.length - 1; i > -1; --i) {
                    if (vals[savedVals[i]] !== undefined) {
                        newVals[savedVals[i]] = vals[savedVals[i]];
                    }
                }
                if (bp === 'desktop') {
                    newVals.area = '';
                }
               /*
                if (newVals.auto_h !== undefined && newVals.auto_h !== '-1') {
                    newVals.align = '';
                }
                */
                this.setSizes(newVals, bp);
            }
        }
        optionsTab(el) {
            let prevData = null,
                prevType = null,
                prevModel = api.activeModel || null,
                constructor=ThemifyConstructor,
                prevComponent = constructor.component,
                args =this.constructor.getOptions().slice(0, 7);
            args.splice(2,1);
            if (prevModel !== null) {
                prevType = prevModel.type;
                prevData = api.Helper.cloneObject(prevModel.get('styling'));
            }
            constructor.values = prevModel?.id === this.id && constructor.clicked === 'setting' ? api.Forms.serialize('tb_options_setting', true) : (api.Helper.cloneObject(this.get('styling')) || {});

            constructor.type = constructor.component = this.type;
            api.activeModel = this;
            args[5].accordion = false;
            el.replaceChildren(constructor.create(args));
            constructor.values = prevData;
            constructor.component = prevComponent;
            constructor.type = prevType;
            api.activeModel = prevModel;
        }
        grid(target) {
            let grid = target.dataset.grid || '',
                count = grid ? (grid.includes('_') ? grid.split('_').length : parseInt(grid)) : '',
                bp = api.activeBreakPoint,
                sel=this.type==='subrow'?'module_subrow':this.type + '_inner',
                inner = this.el.tfClass(sel)[0],
                cl = inner.classList,
                cols = api.Utils.getColumns(inner),
                oldCount = cols.length,
                wrap = target.closest('#grid'),
                range = wrap.querySelector('#range'),
                slider = wrap.querySelector('#slider'),
                gridCl = wrap.classList,
                changeType = bp === 'desktop' ? 'grid' : 'style',
                points = bp === 'desktop' ? api.breakpointsReverse : [bp],
                isSame=this.isLightboxOpen(),
                isLightboxClick=isSame? api.LightBox.el.contains(wrap.getRootNode().host):true;
            if (grid === 'user') {
                return;
            }
            if(!isSame){
                api.undoManager.start(changeType, this);
            }
            else if(!isLightboxClick){
                isLightboxClick=!this.syncLightbox('size',grid);
            }
            if (bp === 'desktop') {
                // remove unused column
                gridCl.remove('tb_col_count_' + oldCount);
                gridCl.add('tb_col_count_' + count);
                if(isLightboxClick){
                    cl.remove('tb_col_count_' + oldCount);
                    cl.add('tb_col_count_' + count);
                    const fr = createDocumentFragment();
                    if (count < oldCount) {
                        for (let i = oldCount - 1; i >= count; --i) {
                            let childs = cols[i].tfClass('tb_holder')[0].children;
                            for (let j = 0; j < childs.length; ++j) {
                                fr.appendChild(childs[j]);
                            }
                            cols[i].remove(); // finally remove it
                            cols.splice(i,1);
                        }
                        cols[cols.length - 1].tfClass('tb_holder')[0].appendChild(fr); // relocate active_module
                    } else {
                        for (let i = 0; i < count; ++i) {
                            if (!cols[i]) {
                                // Add column
                                let c = new api.Column(cols[i], this.type === 'subrow');
                                fr.appendChild(c.el);
                            }
                        }
                        cols[cols.length - 1].after(fr);
                    }
                    //backward compatibility
                    cols=api.Utils.getColumns(inner);
                    const _COL_CLASSES = api.getColClass(),
                            _COL_CLASSES_VALUES = api.getColClassValues(),
                            colsCount = cols.length,
                            colsClass = _COL_CLASSES[grid] || _COL_CLASSES[colsCount],
                            len = _COL_CLASSES_VALUES.length - 1;
                    for (let i = colsCount - 1; i > -1; --i) {
                        let c = cols[i].classList;
                        for (let j = len; j > -1; --j) {
                            c.remove(_COL_CLASSES_VALUES[j]);
                        }
                        if (colsClass !== undefined && colsCount < 7) {
                            c.add(colsClass[i]);
                        }
                        c.remove('first', 'last');
                    }
                    if (colsCount > 1) {
                        cols[0].classList.add('first');
                        cols[colsCount - 1].classList.add('last');
                    }
                }
            }
            if(isLightboxClick){
                this.setCols({size: grid, area: ''});
            }
            if (bp === 'desktop') {
                if(isLightboxClick){
                    //reset in responsive mode
                    for (let i = points.length - 2; i > -1; --i) {
                        //reseting to auto, if breakpoint has auto value select it otherwise the parent value should be applied
                        let _bp = points[i],
                            area = this.getGridCss({size: 'auto'}, _bp);


                        if (area['--area'] && !area['--area'].includes(' ')) {//apply css and update data
                            this.setCols({size: 'auto'}, _bp);
                        } else {
                            this.setGridCss({'--area': '', '--col': ''}, _bp);
                            this.setSizes({size: 'auto'}, _bp);// update data
                        }
                        this.setMaxGutter('',_bp);
                    }
                }
            } 
            else {
                const areaLength = getComputedStyle(inner).getPropertyValue('--area').split('" "')[0].split(' ').length;
                gridCl.toggle('tb_1col_grid', areaLength === 1);
            }
            range.max = slider.max = this.getMaxGutter();
            range.value = slider.value = parseFloat(this.setMaxGutter('',bp));
            if(isLightboxClick){
                api.Utils.setColumnsCount(cols);
                Themify.trigger('tb_grid_changed', [this.el.closest('.module_row'), inner]);
                api.Utils.onResize(true);
                if(!isSame){
                    api.undoManager.end(changeType);
                }
            }
        }

        gutter(target) {
            const gutter = target.dataset.value,
                    gutterValue = ThemifyStyles.getGutterValue(gutter),
                    rangeWrap = target.closest('#grid'),
                    range = rangeWrap.querySelector('#range'),
                    slider = rangeWrap.querySelector('#slider'),
                    gutterVal = parseFloat(parseFloat(gutterValue).toFixed(2).toString()).toString(), //trailing zeros
                    unit = gutterValue.replace(gutterVal, '') || '%',
                    isSame=this.isLightboxOpen();
           
            range.max = slider.max = this.getMaxGutter(unit);
            range.value = slider.value = gutterVal;
            rangeWrap.querySelector('#range_unit').value = unit;
            if(!isSame){
                api.undoManager.start('style', this);
            }
            else if(!api.LightBox.el.contains(rangeWrap.getRootNode().host)){
                this.syncLightbox(target.closest('[data-col]').dataset.col,gutter);
                return;
            }
            this.setCols({gutter: gutter});
            api.Utils.onResize(true);
            if(!isSame){
                api.undoManager.end('style');
            }
        }
        autoHeight(target) {
            const value = target.dataset.value,
                isSame=this.isLightboxOpen();
            if(!isSame){
                api.undoManager.start('style', this);
            }
            else if(!api.LightBox.el.contains(target.getRootNode().host)){
                this.syncLightbox(target.closest('[data-col]').dataset.col,value);
                return;
            }
            if (api.activeBreakPoint === 'desktop') { //backward
                const sel=this.type==='subrow'?'module_subrow':this.type + '_inner',
                    inner = this.el.tfClass(sel)[0];
                inner.classList.toggle('col_auto_height', value === '1');
            }
            this.setCols({auto_h: value});
            if(!isSame){
                api.undoManager.end('style');
            }
        }
        alignment(target) {
            const value = target.dataset.value,
                isSame=this.isLightboxOpen();
                if(!isSame){
                    api.undoManager.start('style', this);
                }
                else if(!api.LightBox.el.contains(target.getRootNode().host)){
                    this.syncLightbox(target.closest('[data-col]').dataset.col,value);
                    return;
                }
            if (api.activeBreakPoint === 'desktop') { //backward
                let sel=this.type==='subrow'?'module_subrow':this.type + '_inner',
                    innerCl = this.el.tfClass(sel)[0].classList,
                        prev = this.get('sizes').desktop_align,
                        _align = value;
                if (prev) {
                    prev = prev.replace('col_align_', '');
                    if (prev === 'start') {
                        prev = 'top';
                    } else {
                        prev = prev === 'center' ? 'middle' : 'bottom';
                    }
                    innerCl.remove('col_align_' + prev);
                }
                if (_align === 'start') {
                    _align = 'top';
                } else {
                    _align = _align === 'center' ? 'middle' : 'bottom';
                }
                innerCl.add('col_align_' + _align);
            }
            this.setCols({align: value});
            if(!isSame){
                api.undoManager.end('style');
            }
        }
        direction() {
            const mode = api.activeBreakPoint === 'desktop' ? 'direction' : 'style',
                sel=this.type==='subrow'?'module_subrow':this.type + '_inner',
                inner = this.el.tfClass(sel)[0],
                isSame=this.isLightboxOpen();
            if(!isSame){
                api.undoManager.start(mode, this);
            }
            if (api.activeBreakPoint === 'desktop') {
                if (!inner.hasAttribute('data-transition')) {
                    inner.dataset.transition = 1;

                    let cols = api.Utils.getColumns(inner),
                            self = this,
                            len = cols.length,
                            desktopSizes = this.getSizes('size'),
                            oldcolsAreas = {};
                    for (let i = len - 1; i > -1; --i) {
                        oldcolsAreas[cols[i].dataset.cid] = (i + 1);
                    }
                    cols[len - 1].tfOn('transitionend', function () {
                        const fr = createDocumentFragment();
                        for (let i = len - 1; i > -1; --i) {
                            fr.appendChild(cols[i]);
                        }
                        inner.prepend(fr);
                        this.tfOn('transitionend', () => {
                            for (let i = len - 1; i > -1; --i) {
                                cols[i].style.setProperty('transition', '');
                                cols[i].style.setProperty('transition-delay', '');
                                cols[i].style.setProperty('transform', '');
                            }
                            inner.classList.remove('direction_rtl');
                            inner.removeAttribute('data-transition');

                            const newColsAreas = {};
                            for (let i = len - 1; i > -1; --i) {
                                newColsAreas[cols[i].dataset.cid] = (i + 1);
                            }
                            //keep the breakpoints cols order
                            for (let points = api.breakpointsReverse, i = points.length - 2; i > -1; --i) {
                                let respArea = self.getSizes('area', points[i]);
                                if (respArea) {
                                    if (!respArea.includes('"')) {//is css variable
                                        respArea = computed.getPropertyValue('--area' + respArea).replace(/\s\s+/g, ' ').trim();
                                    }
                                    for (let cid in newColsAreas) {
                                        if (oldcolsAreas[cid] !== newColsAreas[cid]) {
                                            respArea = respArea
                                                    .replaceAll(oldcolsAreas[cid] + ' ', '#' + newColsAreas[cid] + '# ')
                                                    .replaceAll(oldcolsAreas[cid] + '"', '#' + newColsAreas[cid] + '#"');
                                        }
                                    }
                                    self.setCols({area: respArea.replaceAll('#', '')}, points[i]);
                                }
                            }
                            if(!isSame){
                                api.undoManager.end(mode);
                            }
                            self = len = desktopSizes = cols = null;
                        }, {
                            once: true,
                            passive: true
                        });

                        if (desktopSizes) {
                            self.setCols({size: desktopSizes.split(' ').reverse().join(' ')});
                        }
                        setTimeout(() => {
                            for (let i = len - 1; i > -1; --i) {
                                cols[i].style.setProperty('transition-delay', ((len - i) / 10) + 's');
                                cols[i].style.setProperty('transform', 'scale(1)');
                            }
                        }, 60);

                    }, {
                        once: true,
                        passive: true
                    });
                    for (let i = len - 1; i > -1; --i) {
                        cols[i].style.setProperty('transition', 'transform .3s ' + ((i + 1) / 10) + 's');
                        cols[i].style.setProperty('transform', 'scale(0)');
                    }
                }
            } else {
                let area = getComputedStyle(inner).getPropertyValue('--area').replace(/  +/g, ' ').trim(),
                        newArea = [],
                        colsSize = area.split('" "')[0].split(' ').length;

                area = area.replaceAll('"', '').trim().split(' ').reverse();
                const len = area.length;
                for (let i = len - 1; i > -1; --i) {
                    if (area[i] === '.') {
                        area.push(area.splice(i, 1)[0]);
                    }
                }
                for (let i = 0, len2 = (len / colsSize); i < len2; ++i) {
                    newArea.push('"' + area.slice(i * colsSize, (i + 1) * colsSize).join(' ') + '"');
                }
                this.setCols({area: newArea.join(' ')});
                if(!isSame){
                    api.undoManager.end(mode);
                }
            }
        }
        breakpoint(el) {
            api.ToolBar.breakpointSwitcher(el.dataset.id).then(() => {
                if (api.isFrontend) {
                    api.ActionBar.clear();
                    setTimeout(() => {
                        const scrollTop = this.el.getBoundingClientRect().top + window.scrollY - 100;
                        window.top.scroll(0, scrollTop);
                        window.scroll(0, scrollTop);
                        api.ActionBar.hover({target: this.el.tfClass('tb_' + this.type + '_action')[0]});
                    }, 50);
                }
            }).catch(() => {

            });
        }
        gridMenu(el) {
            const tpl = doc.tfId('tmpl-builder_grid_list').content.cloneNode(true),
                    bp = api.activeBreakPoint,
                    sel=this.type==='subrow'?'module_subrow':this.type + '_inner',
                    inner = this.el.tfClass(sel)[0],
                    cl = inner.classList,
                    elCl = el.classList,
                    count = api.Utils.getColumns(inner).length,
                    countClass = 'tb_col_count_' + count,
                    areaLength = bp !== 'desktop' ? getComputedStyle(inner).getPropertyValue('--area').split('" "')[0].split(' ').length : null,
                    range = tpl.querySelector('#range'),
                    rangeUnit = tpl.querySelector('#range_unit'),
                    slider = tpl.querySelector('#slider'),
                    cid=this.id;

            this.setMaxGutter('',bp);
            let items = tpl.querySelector('.grid_list').children,
                {gutter, align, size, auto_h} = this.getSizes('',bp);
            if (!size || count===1) {
                size = count > 6 ? 'user' : count;
            }
            else if (typeof size === 'string' && size.includes(' ')) {
                size = 'user';
            }
            for (let i = cl.length - 1; i > -1; --i) {
                if (cl[i].indexOf('tb_col_count_') === 0) {
                    if (countClass !== cl[i]) {
                        cl.remove(cl[i]);
                    }
                    break;
                }
            }
            cl.add(countClass);
            elCl.add(countClass, api.activeBreakPoint);
            elCl.toggle('tb_1col_grid', areaLength === 1);
            if (api.activeBreakPoint !== 'desktop') {
                elCl.add('tb_responsive_mode');
            }

            if (this.el.classList.contains('fullheight')) {
                elCl.add('fullheight');
            }
            for (let i = items.length - 1; i > -1; --i) {
                items[i].classList.toggle('selected', items[i].dataset.grid === size.toString());
            }
            if (align) {
                items = tpl.querySelector('.alignment').children;
                for (let i = items.length - 1; i > -1; --i) {
                    items[i].classList.toggle('selected', items[i].dataset.value === align);
                }
            }

            if (auto_h) {
                auto_h=auto_h.toString();
                items = tpl.querySelector('.auto_height').children;
                for (let i = items.length - 1; i > -1; --i) {
                    items[i].classList.toggle('selected', items[i].dataset.value === auto_h);
                }
            }

            if (gutter) {
                gutter = ThemifyStyles.getGutter(gutter);
                items = tpl.querySelector('.gutter').children;
                for (let i = items.length - 1; i > -1; --i) {
                    items[i].classList.toggle('selected', items[i].dataset.value === gutter);
                }
            } 
            else {
                gutter = 'gutter';
            }

            gutter = ThemifyStyles.getGutterValue(gutter);

            const gutterVal = parseFloat(gutter),
                    gutter_unit = gutter.toString().replace(gutterVal.toString(), '') || '%';
            range.max = slider.max = this.getMaxGutter(gutter_unit,bp);
            range.value = slider.value = parseFloat(gutterVal.toFixed(4)).toString(); //trailing zeros
            rangeUnit.value = gutter_unit,
            parent=el.parentNode || el;

            parent.tfOn(_CLICK_, e => {
                const target=e.target, 
                    selected = target.closest('li'),
                    model=api.Registry.get(cid);
                if (selected) {
                    const colAction = selected.closest('[data-col]');
                    if (colAction) {
                        e.stopPropagation();
                        const childs = colAction.children,
                            action = colAction.dataset.col;
                        if (childs.length > 1) {
                            for (let i = childs.length - 1; i > -1; --i) {
                                childs[i].classList.toggle('selected', selected === childs[i]);
                            }
                        }
                        model[action](selected);
                    }
                } 
                else if (target.closest('.expand')) {
                    e.stopPropagation();
                    model.edit();
                }
            }, {passive: true});
            el.appendChild(tpl);

            setTimeout(() => {
                if (el) {
                    const holder = el.querySelector('#range_holder'),
                            input = ThemifyConstructor.range.render({
                                id: 'range',
                                control: false,
                                event: 'input',
                                value: range.value,
                                unit: rangeUnit.value,
                                units: {
                                    '%': {
                                        min: 0,
                                        increment: .1,
                                        max: this.getMaxGutter('%')
                                    },
                                    'em': {
                                        min: 0,
                                        max: this.getMaxGutter('em')
                                    },
                                    px: {
                                        min: 0,
                                        max: this.getMaxGutter('px')
                                    }
                                }
                            }, ThemifyConstructor);
                    holder.replaceChildren(input);
                    let req,
                            started = false,
                            inner,
                            interval,
                            _slider = holder.parentNode.querySelector('#slider'),
                            rangeInput = holder.querySelector('#range'),
                            unit = holder.querySelector('#' + rangeInput.id + '_unit'),
                            isSame=this.isLightboxOpen(),
                            sel=this.type==='subrow'?'module_subrow':this.type + '_inner',
                            gutterRange = e => {
                                e.stopImmediatePropagation();
                                const isChange = e.type === 'change',
                                        target = e.currentTarget,
                                        model=api.Registry.get(cid);
                                if (isChange === false && target === unit) {
                                    return;
                                }
                                if(!inner?.isConnected){
                                    inner = model.el.tfClass(sel)[0];
                                }
                                if (started === false) {
                                    started = true;
                                    if(!isSame){
                                        api.undoManager.start('style', model);
                                    }
                                    interval = setInterval(() => {//workaround for firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=559561
                                        if (!rangeInput.isConnected) {
                                            clearInterval(interval);
                                            interval = null;
                                            Themify.triggerEvent(rangeInput, 'change');
                                            setTimeout(() => {
                                                rangeInput = gutterRange=null;
                                            }, 100);
                                        }
                                    }, 1000);
                                }
                                if (isChange && interval) {
                                    clearInterval(interval);
                                    interval = null;
                                }
                                req = requestAnimationFrame(() => {
                                    const unitVal = unit.value;
                                    if (target === _slider) {
                                        rangeInput.value = _slider.value;
                                    } 
                                    else if (target === unit) {
                                        let maxValue = model.getMaxGutter(unitVal);
                                        rangeInput.max = _slider.max = maxValue;
                                        if (unitVal === 'px') {
                                            _slider.step = 1;
                                            rangeInput.value = _slider.value = parseInt(_slider.value);
                                        } else {
                                            _slider.step = .1;
                                        }
                                        if (parseFloat(rangeInput.value) > maxValue) {
                                            rangeInput.value = _slider.value = maxValue;
                                        }

                                    } else {
                                        _slider.value = rangeInput.value;
                                    }
                                    let gutter = rangeInput.value;
                                    if (gutter > 0) {
                                        gutter += unitVal;
                                    }

                                    if (isChange === true) {
                                        cancelAnimationFrame(req);
                                        gutter = model.setMaxGutter(gutter);
                                        const sizes = rangeInput.closest('#grid').tfClass('gutter')[0].children;
                                        for (let presentGutter=ThemifyStyles.getGutter(gutter),i = sizes.length - 1; i > -1; --i) {
                                            sizes[i].classList.toggle('selected', presentGutter === sizes[i].dataset.value);
                                        }
                                        model.setCols({gutter: gutter});
                                        inner.style.setProperty('--colg', '');
                                        if(!api.LightBox.el.contains(rangeInput.getRootNode().host)){
                                            model.syncLightbox('gutterVal',gutter);
                                        }
                                        if (started === true) {
                                            inner = null;
                                            api.Utils.onResize(true);
                                            if(api.undoManager.has('style')){
                                                api.undoManager.end('style');
                                            }
                                            started = false;
                                        }
                                        req = null;
                                    }
                                    else {
                                        inner.style.setProperty('--colg', gutter);
                                    }
                                });
                            };
                    _slider.tfOn('input change', gutterRange, {passive: true});
                    rangeInput.tfOn('input change', gutterRange, {passive: true});
                    unit.tfOn('change', gutterRange, {passive: true});
                }
            }, 150);
        }
        setMaxGutter(gutter,bp) {
            bp??= api.activeBreakPoint;
            if(!gutter){
                gutter= this.getSizes('gutter', bp) || 'gutter';
            }
            gutter = ThemifyStyles.getGutterValue(gutter);
            let gutterVal = parseFloat(gutter), //trailing zeros
                    unit = gutter.toString().replace(gutterVal.toString(), '') || '%',
                    maxGutter = this.getMaxGutter(unit, bp);
            if (maxGutter < gutterVal) {
                /*
                 const msg=i18n.gutterChanged
                 .replace('%from',gutterVal+unit)
                 .replace('%to',maxGutter+unit)
                 .replace('%bp',api.Helper.getBreakpointName(bp));
                 TF_Notification.showHide('info',msg,3000);*/
                this.setCols({gutter: (maxGutter + unit)}, bp);
                gutterVal = maxGutter;
            }
            return gutterVal + unit;
        }
        getMaxGutter(unit, bp) {
            bp??= api.activeBreakPoint;
            const sel=this.type==='subrow'?'module_subrow':this.type + '_inner',
                inner = this.el.tfClass(sel)[0],
                count = api.Utils.getColumns(inner).length;
            if (count <= 1) {
                return 100;
            }
            const _MIN_COL_W = 5,
                    allSizes = this.getSizes('', bp),
                    w = inner.offsetWidth,
                    computed = getComputedStyle(inner),
                    fontSize = parseFloat(computed.getPropertyValue('font-size')),
                    frSize = computed.getPropertyValue('--col'),
                    sizes = frSize && frSize !== 'none' && !frSize.includes('repeat') ? frSize.replace(/\s\s+/g, ' ').trim().split(' ') : null;

            if (!unit) {
                let gutter = allSizes.gutter || 'gutter';
                gutter = ThemifyStyles.getGutterValue(gutter);
                let gutterVal = parseFloat(gutter);
                unit = gutter.toString().replace(gutterVal.toString(), '') || '%';
            }
            let areaLength,
                    area = allSizes.area;
            if (!area) {
                let cols = allSizes.size;
                if (cols) {
                    cols = cols.toString();
                    if (cols.includes(' ')) {
                        areaLength = cols.replace(/\s\s+/g, ' ').split(' ').length;
                    } else {
                        area = this.getGridCss({size: 'auto'}, bp)['--area'];
                    }
                }
            }
            if (!areaLength) {
                if (area?.includes('var')) {
                    area = computed.getPropertyValue(area.replace('var(', '').replace(')', ''));
                }
                areaLength = area ? area.replace(/  +/g, ' ').trim().split('" "')[0].split(' ').length : count;
            }

            let max = w,
                    summPX = 0,
                    summPercent = 0,
                    summEm = 0;
            if (sizes !== null) {
                for (let i = sizes.length - 1; i > -1; --i) {
                    let v = parseFloat(sizes[i]);
                    if (!sizes[i].includes('fr')) {
                        if (sizes[i].includes('%')) {
                            summPercent += v;
                        } else if (sizes[i].includes('em')) {
                            summEm += v;
                        } else {
                            summPX += v;
                        }
                    }
                }
                max -= summPX - parseFloat((summPercent * w) / 100) - summEm * fontSize;
            }
            max = parseFloat((max * 100) / w) - _MIN_COL_W * areaLength;
            if(areaLength>1){
                max = parseFloat(max / (areaLength - 1));
            }
            if (fontSize>0 && (unit === 'px' || unit === 'em')) {
                max = (w * max) / 100;
                max = unit === 'em' ? parseFloat(max / fontSize) : ~~max;
            }
            return parseFloat(parseFloat(max.toFixed(2)).toString());
        }
        setGridCss(css, bp) {
            bp??= api.activeBreakPoint;
            const selector = ThemifyStyles.getStyleOptions(this.type).grid.selector;
            if (api.isFrontend) {
                const live = api.createStyleInstance();
                live.init(true, false, this);
                live.setMode(bp);
                if (Object.keys(css).length > 0) {
                    for (let k in css) {
                        live.setLiveStyle(k, css[k], selector);
                    }
                }
            } else {
                let fullSelector;
                const sheet = ThemifyStyles.getSheet(bp),
                        rules = sheet.cssRules,
                        elId = this.id,
                        points = api.breakpointsReverse,
                        index = points.indexOf(bp),
                        _selectors = [],
                        _setStyles = (p, v) => {
                            const index = api.Utils.findCssRule(rules, fullSelector);
                            if (index === false || !rules[index]) {
                                if (v !== '' && v !== undefined) {
                                    sheet.insertRule(fullSelector + '{' + p + ':' + v + ';}', rules.length);
                                }
                            } else {
                                rules[index].style.setProperty(p, v);
                            }
                        },
                        bid=api.Builder.get().id;
                for (let i = index; i > -1; --i) {
                    _selectors.push(ThemifyStyles.getBaseSelector(this.type, bid,elId, points[i]) + ' ' + selector);
                    if (bp === 'desktop') {
                        break;
                    }
                }
                fullSelector = _selectors.join(',');
                if (Object.keys(css).length > 0) {
                    for (let k in css) {
                        _setStyles(k, css[k]);
                    }
                }
            }
        }
        static builderSave(settings,type='row') {
            const bps=api.breakpointsReverse,
                units=[
                        'l_h_h',
                        'l_s_h',
                        'ht',
                        'mi_h',
                        'mx_h',
                        'margin-top',
                        'margin-bottom',
                        'm_t_h',
                        'm_b_h'
                ],
                sides=['top','left','right','bottom'],
                stVal=this.getStylingValue;
                
            if(type==='row'){
                for (let i = 6; i>0;--i) {
                    units.push('font_size_h'+i,'f_s_h'+i+'_h','line_height_h'+i,'l_h_h'+i+'_h','letter_spacing_h'+i,'l_s_h'+i+'_h','h'+i+'_margin_top','h'+i+'_margin_bottom','h'+i+'_margin_top_h','h'+i+'_margin_bottom_h');
                }
                if(!settings.row_anchor || !settings.hide_anchor || settings.hide_anchor==='|' || settings.hide_anchor==='false'){
                    delete settings.hide_anchor;
                }
                if(settings.row_user_role===false || settings.row_user_role==='|' || settings.row_user_role==='false'){
                    delete settings.row_user_role;
                }
            }
            if ( ! settings._link || settings._link_n === 'no' ) {
                delete settings._link_n;
            }
            if ( settings._link_n !== 'lb' ) {
                delete settings._link_lw;
                delete settings._link_lh;
            }
            if ( ! settings._link_lw ) {
                delete settings._link_lw_unit;
            }
            if ( ! settings._link_lh ) {
                delete settings._link_lh_unit;
            }
            if ( ! settings._link || settings._link_o === 'no' ) {
                delete settings._link_o;
            }
            delete settings.tb_grid_lb_root;
            
            if(settings.background_slider_videos?.length===0){
                delete settings.background_slider_videos;
            }
            if(!settings.background_slider_videos){
                delete settings.background_slider_videos_autoplay;
                delete settings.background_slider_videos_controls;
                delete settings.background_slider_videos_mute;
                delete settings.background_slider_videos_progressbar;
            }
            for(let i=bps.length-1;i>-1;--i){
                let bp=bps[i],
                    isDesktop=bp==='desktop',
                    vals=isDesktop?settings:settings['breakpoint_'+bp];
                if(vals){
                    let bgType=stVal('background_type',bp,settings) || 'image';
                    if(isDesktop){
                        delete vals.resp_no_bg;
                    }
                    if(!isDesktop || bgType!=='slider'){
                        delete vals.background_slider;
                    }
                    if(!isDesktop || bgType!=='video'){
                        delete vals.background_video;
                    }
                    if(!vals.background_video || !vals.background_video_options || vals.background_video_options==='|' || vals.background_video_options==='false'){
                        delete vals.background_video_options;
                        if(bgType==='video'){
                            delete vals.background_type;
                        }
                    }
                    if(!vals.background_slider){
                        delete vals.background_slider_size;
                        delete vals.background_slider_mode;
                        delete vals.background_slider_speed;
                        if(bgType==='slider'){
                            delete vals.background_type;
                        }
                    }

                    if((bgType!=='image' && bgType!=='video') || stVal('resp_no_bg',bp,settings)==='none'){
                        delete vals.background_image;
                    }
                    
                    let bgImage=stVal('background_image',bp,settings);
                    if(!bgImage){
                        delete vals.background_repeat;
                        delete vals.background_position;
                    }
                    if(bgType==='slider' || bgType==='video'){
                        delete vals.b_t_h;
                    }
                    
                    let bgRepeat=stVal('background_repeat',bp,settings),
                        bgHover=bgType==='image' || bgType==='gradient'? stVal('b_t_h',bp,settings):null;
                    if(bgRepeat!=='repeat-none'){
                        delete vals.background_zoom;
                        if(bgRepeat!=='repeat' && bgRepeat!=='repeat-x' && bgRepeat!=='repeat-y' && bgRepeat!=='fullcover'&&bgRepeat!=='best-fit-image'){
                            delete vals.background_attachment;
                        }
                    }
                    else if(vals.background_zoom==='false' || vals.background_zoom==='|'){
                        vals.background_zoom=false;
                    }
                    if(isDesktop && vals.background_zoom===false){
                        delete vals.background_zoom;
                    }
                    if(bgType!=='gradient'){
                        delete vals['background_gradient-gradient'];
                    }
                    else{
                        delete vals.background_color;
                    }

                    if(bgType==='image' && !bgImage && stVal('background_color',bp,settings)===undefined){
                        delete vals.background_type;
                    }
                    this.clearGradient('background_gradient',bp,settings);
                    if(bgHover!=='image'){
                        delete vals.bg_i_h;
                        delete vals.b_c_h;
                    }
                    if(bgHover!=='gradient'){
                        delete vals['b_g_h-gradient'];
                    }
                    bgImage=stVal('bg_i_h',bp,settings);
                    if(!bgImage){
                        delete vals.b_r_h;
                        delete vals.b_a_h;
                        delete vals.b_p_h;
                    }
                    this.clearGradient('b_g_h',bp,settings);
                    
                    if(!bgImage && !stVal('b_g_h-gradient',bp,settings) &&  stVal('b_c_h',bp,settings)===undefined){
                        delete vals.b_t_h;
                    }

                    //overlay
                    if(stVal('cover_color-type',bp,settings)!=='color'){
                        delete vals.cover_color;
                    }else{
                        delete vals['cover_gradient-gradient'];
                    }
                    this.clearGradient('cover_gradient',bp,settings);
                    if(stVal('cover_color',bp,settings)===undefined && !stVal('cover_gradient-gradient',bp,settings)){
                        delete vals['cover_color-type'];
                    }
                    
                    //hover overlay
                    if(stVal('cover_color_hover-type',bp,settings)!=='hover_color'){
                        delete vals.cover_color_hover;
                    }else{
                        delete vals['cover_gradient_hover-gradient'];
                    }
                    this.clearGradient('cover_gradient_hover',bp,settings);
                    if(stVal('cover_color_hover',bp,settings)===undefined && !stVal('cover_gradient_hover-gradient',bp,settings)){
                        delete vals['cover_color_hover-type'];
                    }
                    
                    //inner container
                    if(type!=='row'){
                        delete vals.background_image_inner;
                        delete vals.background_color_inner;
                        delete vals.b_i_i_h;
                        delete vals.b_c_i_h;
                        for(let j=sides.length-1;j>-1;--j){
                            let side=sides[j];
                            delete vals['padding_inner_'+side];
                            delete vals['p_i_h_'+side];
                            delete vals['border_inner_'+side+'_width'];
                            delete vals['b_i_h_'+side+'_width'];
                            delete vals['border_inner_'+side+'_style'];
                            delete vals['b_i_h_'+side+'_style'];
                        }
                    }

                    if(!stVal('background_image_inner',bp,settings)){
                        delete vals.background_repeat_inner;
                        delete vals.background_attachment_inner;
                        delete vals.background_position_inner;
                    }

                    if(!stVal('b_i_i_h',bp,settings)){
                        delete vals.b_r_i_h;
                        delete vals.b_a_i_h;
                        delete vals.b_p_i_h;
                    }

                    this.clearPadding('padding_inner',bp,settings);
                    this.clearPadding('p_i_h',bp,settings);
                    this.clearBorder('border_inner',bp,settings);
                    this.clearBorder('b_i_h',bp,settings);

                    //frames
                    for(let j=sides.length-1;j>-1;--j){
                        let k=sides[j]+'-frame_';
                        if(stVal(k+'type',bp,settings)===(sides[j]+'-custom')){
                            delete vals[k+'layout'];
                            delete vals[k+'color'];
                        }else{
                            delete vals[k+'type'];
                            delete vals[k+'custom'];
                        }
                        let layout=stVal(k+'layout',bp,settings);
                        if((!layout || layout==='none') && !stVal(k+'custom',bp,settings)){
                            delete vals[k+'color'];
                            delete vals[k+'width'];
                            delete vals[k+'height'];
                            delete vals[k+'repeat'];
                            delete vals[k+'sh_b'];
                            delete vals[k+'ani_dur'];
                            delete vals[k+'location'];
                            if(isDesktop && layout==='none'){
                                delete vals[k+'layout'];
                                layout=null;
                            }
                            if(!layout){
                                delete vals[k+'type'];
                            }
                        }
                        else if(!isDesktop){
                            delete vals[k+'location'];
                        }
                        if(!stVal(k+'width',bp,settings) || (isDesktop && stVal(k+'width_unit',bp,settings)==='%')){
                            delete vals[k+'width_unit'];
                        }
                        if(!stVal(k+'height',bp,settings) || (isDesktop && stVal(k+'height_unit',bp,settings)==='%')){
                            delete vals[k+'height_unit'];
                        }
                        if(stVal(k+'sh_b',bp,settings)===undefined || stVal(k+'sh_c',bp,settings)===undefined){
                            delete vals[k+'sh_b'];
                            delete vals[k+'sh_c'];
                            delete vals[k+'sh_x'];
                            delete vals[k+'sh_y'];
                        }
                        let animDur=stVal(k+'ani_dur',bp,settings),
                            animRev=stVal(k+'ani_rev',bp,settings);
                        if(!animDur || animDur==='0'){
                            delete vals[k+'ani_dur'];
                            delete vals[k+'ani_rev'];
                        }else if(animRev==='0' || animRev===0){
                            delete vals[k+'ani_rev'];
                        }
                    }
                    //fonts
                    if(!stVal('font_family',bp,settings)){
                        delete vals.font_family_w;
                    }
                    if(!stVal('f_f_h',bp,settings)){
                        delete vals.f_f_h_w;
                    }
                    
                    //Text Shadow
                    this.clearShadow('text-shadow',0,bp,settings);
                    this.clearShadow('t_sh_h',0,bp,settings);
                    
                    //paddings
                    this.clearPadding('padding',bp,settings);
                    this.clearPadding('p_h',bp,settings);
                    
                    //margin
                    this.clearMarginOpposity('margin-top',bp,settings);
                    this.clearMarginOpposity('m_t_h',bp,settings);
                    //border
                    this.clearBorder('border',bp,settings);
                    this.clearBorder('b_h',bp,settings);
                    //filters
                    this.clearFilter('bl_m','css_f',bp,settings);
                    this.clearFilter('_h','css_f_h',bp,settings);
                    //height
                    this.clearWidth('ht',bp,settings,1);
                    //corners
                    this.clearPadding('b_ra',bp,settings);
                    this.clearPadding('r_c',bp,settings);
                    //Box Shadow
                    this.clearShadow('b_sh',1,bp,settings);
                    this.clearShadow('sh_h',1,bp,settings);
                    if(type!=='column'){
                        //position
                        this.clearPosition('po',bp,settings);
                    }
                    //transform
                    this.clearTransform('tr',bp,settings);
                    this.clearTransform('tr-h',bp,settings);
                    //Units
                    this.clearUnits(units,bp,settings);

                    //headings
                    if(type==='row'){
                        for (let j = 6; j>0; --j) {
                            this.clearFontColor('font_color_type_h'+j,'font_color_h'+j,'font_gradient_color_h'+j,bp,settings);
                            this.clearFontColor('f_c_t_h'+j+'_h','f_c_h'+j+'_h','f_g_c_h'+j+'_h',bp,settings);
                            
                            //font Weights
                            this.clearFontWeights(['font_family_h'+j,'f_f_h'+j+'_h'],bp,settings);
                            
                            //text-shadow
                            this.clearShadow('t_shh'+j,0,bp,settings);
                            this.clearShadow('t_shh'+j+'_h',0,bp,settings);
                            
                            //margin
                            this.clearMarginOpposity('h'+j+'_margin_top',bp,settings);
                            this.clearMarginOpposity('h'+j+'_margin_top_h',bp,settings);
                        }
                    }
                }
            }
            
            super.builderSave(settings,type);
        }
    };
})(tb_app);