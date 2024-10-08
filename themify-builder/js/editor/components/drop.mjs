(api => {
    "use strict";
    api.Drop =  {
        async row(drag, type,slug,scrollTo) {
            const rowDrop=async data=>{
                const fragment = createDocumentFragment(),
                    rows = [],
                    styles = [],
                    isRow=drag.closest('.tb_holder')===null;

                for (let i = 0; i < data.length; ++i) {
                    let row = isRow===true?(new api.Row(data[i])):(new api.Subrow(data[i]));
                        fragment.appendChild(row.el);
                        rows.push(row);
                    if (api.isVisual && type!=='grid') {
                        styles.push(row.id);
                        for (let items = row.el.querySelectorAll('[data-cid]'),j = items.length - 1; j > -1; --j) {
                            styles.push(items[j].dataset.cid);
                        }
                        if(type!=='pagebreak'){
                            row.el.style.visibility='hidden';
                        }
                    }
                }

                drag.replaceWith(fragment);
                api.Builder.get().removeLayoutButton();
                if (api.isVisual) {
                    await api.bootstrap(styles);
                } 
                if(type!=='pagebreak'){
                    if (api.isVisual) {
                        await api.correctColumnPaddings();
                    }
                    for (let i = 0; i < rows.length; ++i) {
                        api.Utils.setColumnsCount(rows[i].el.tfClass('module_column'));
                        api.Utils.runJs(rows[i].el);
                        rows[i].el.style.visibility='';
                    }
                }
                else{
                    api.ModulePageBreak.countModules();
                }
                if(type!=='grid' && type!=='pagebreak'){
                    api.Spinner.showLoader('done');
                }
            };
            if(scrollTo!==false){
                api.Utils.scrollTo(drag);
            }
            if (type === 'library' || type==='predesign') {
                const data=type === 'library'?(await this.Library.row(slug)):(await api.preDesignedRows.get(slug));
                await rowDrop(data);
            } 
            else if (type==='pagebreak') {
                await rowDrop(api.ModulePageBreak.cols());
            } 
            else if (type==='grid') {
                await rowDrop(api.Utils.grid(slug));
            }
            else{
                throw '';
            }
        },
        /* "from" always exist,
         * "to" not always
         * if "to" doesn't from should be deleted
         * if from===to => "to" should be added
         */
        async column(from, to, side) {
            const from_inner = from.parentNode,
                isDelete = !to,
                isAdd=!from_inner,
                {activeBreakPoint:currentBp,breakpointsReverse:points,Registry}=api,
                fromModel=isAdd===true?null:Registry.get(from_inner.closest('[data-cid]').dataset.cid),
                to_inner = to ? to.parentNode : from_inner,
                toModel=Registry.get(to_inner.closest('[data-cid]').dataset.cid),
                isSame=fromModel?.isLightboxOpen() || false,
                fromData=isSame===true?ThemifyConstructor.grid.get():(fromModel?.get('sizes') || {}),
                next = side === 'left' || !to ? to : to.nextElementSibling,
                fromGridArea = getComputedStyle(from).getPropertyValue('grid-area').split('/')[0].replace('"', '').trim();

            if (from_inner !== to_inner) {
                to_inner.insertBefore(from, next);
                const is_sub_row = to_inner.classList.contains('module_subrow');
                from.classList.toggle('sub_column', is_sub_row);
                from.classList.toggle('tb-column', !is_sub_row);
                if(fromModel){
                    fromModel.isSubCol=is_sub_row;
                }
                if (from_inner && !from_inner.tfClass('module_column')[0]) {
                    const col=new api.Column({grid_class: 'col-full'},from_inner.classList.contains('module_subrow'));
                    from_inner.appendChild(col.el);
                }
            } 
            else if (isDelete === true) {
                from.remove();
            }
            const toCount = api.Utils.getColumns(to_inner).length,
                fromCount = from_inner?api.Utils.getColumns(from_inner).length:0,
                computed = getComputedStyle(to_inner),
                toGridArea = isDelete === false && to ? getComputedStyle(to).getPropertyValue('grid-area').split('/')[0].replaceAll('"', '').trim() : null,
                parseRepeat = col => {
                    if (!col.includes(' ')) {
                        return computed.getPropertyValue('--c' + col);
                    }
                    col = col.replace(/\s\s+/g, ' ').trim();
                    if (col.includes('repeat')) {
                        if (!col.includes('auto-fit') && !col.includes('auto-fill')) {
                            let tmp = '',
                                repeat = col.replace(/\s\,\s|\s\,|\,\s/g, ',').replace(/\s\(\s|\s\(|\(\s/g, '(').replaceAll(' )', ')').trim().split(' ');
                            for (let i = 0; i < repeat.length; ++i) {
                                if (repeat[i].includes('repeat')) {
                                    let item = repeat[i].split('(')[1].replace(')', '').split(','),
                                        count = ~~item[0],
                                        unit = item[1].trim();
                                    tmp += ' ' + (' ' + unit).repeat(count);
                                } else {
                                    tmp += ' ' + repeat[i];
                                }
                            }
                            col = tmp.trim();
                        } else {
                            return '';
                        }
                    }
                    return col;
                },
                addColClasses = (grid, cols) => {//backward compatibility
                    const count = cols.length,
                        _COL_CLASSES=api.getColClass(),
                        _COL_CLASSES_VALUES=api.getColClassValues(),
                        colsClass = grid && !grid.includes(' ')&& _COL_CLASSES[grid] !== undefined ? _COL_CLASSES[grid] : _COL_CLASSES[count],
                        len = _COL_CLASSES_VALUES.length - 1;
                    for (let i = count - 1; i > -1; --i) {
                        let c=cols[i].classList;
                        for (let j = len; j > -1; --j) {
                            c.remove(_COL_CLASSES_VALUES[j]);
                        }
                        if (colsClass !== undefined && count < 7) {
                            c.add(colsClass[i]);
                        }
                         c.remove('first','last');
                    }
                    if(count>1){
                        cols[0].classList.add('first');
                        cols[count-1].classList.add('last');
                    }
                };

            /*we have 3 ways to drop column
             * 1. in the same row in the desktop mode
             * 2. in the same row in the responsive mode
             * 3. to different rows/subrows in desktop mode
             * dropping to different rows in responsive mode isn't allowed
            */

            //in the same row
            if (from_inner === to_inner && isDelete === false && isAdd===false) {//if it's change in the same row/subrow(only for responsive mode), just change the area order,because order is responsive

                if (currentBp === 'desktop') {//in desktop mode we need to move html and save the order in responsive mode
                    const oldcolsAreas = {},
                        newColsAreas = {},
                        desktopArea = computed.getPropertyValue('--area').replaceAll('"', '').trim().split(' '),
                        childs =api.Utils.getColumns(from_inner),
                        len = childs.length;

                    from_inner.classList.remove('direction_rtl');
                    fromModel.setSizes({dir:''});

                    for (let i = len - 1; i > -1; --i) {//save old position
                        let cid = childs[i].dataset.cid;
                        if (cid) {
                            oldcolsAreas[cid] = (i + 1);
                        }
                    }
                    let desktopSize = computed.getPropertyValue('--col');
                    from_inner.insertBefore(from, next);//move call

                    if (desktopSize && desktopSize !== 'unset' && desktopSize !== 'initial' && desktopSize !== 'none' && !desktopSize.includes('repeat')) {//moving sizes

                        const oldDesktopSizeIndex = desktopArea.indexOf(fromGridArea),
                            newFromGridArea = getComputedStyle(from).getPropertyValue('grid-area').split('/')[0].replaceAll('"', '').trim(), //get new position(col1,col2 ...) after dropping
                            newIndex = desktopArea.indexOf(newFromGridArea);
                        desktopSize = desktopSize.split(' ');
                        const value = desktopSize[newIndex];
                        desktopSize[newIndex] = desktopSize[oldDesktopSizeIndex];
                        desktopSize[oldDesktopSizeIndex] = value;
                        fromModel.setCols( {size: desktopSize.join(' ')},  currentBp);
                    }
                    for (let i = len - 1; i > -1; --i) {//save new position
                        let cid = childs[i].dataset.cid;
                        if (cid) {
                            newColsAreas[cid] = (i + 1);
                        }
                    }
                    for (let i = points.length - 2; i > -1; --i) {
                        let bp = points[i],
                            respArea = fromData[bp+'_area'];
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
                            fromModel.setCols( {area: respArea.replaceAll('#', '')},  bp);
                        }
                    }
                    addColClasses(desktopSize, childs);
                }
                else {

                    let area = computed.getPropertyValue('--area').replace(/[\r\n]/gm, '').replace(/  +/g, ' ').trim(), //e.g "col1 col1 col1 col2 col2 col2" "col3 col3 col4 col4 col5 col5"
                        col = computed.getPropertyValue('--col'),
                        colIndex = side === 'right' ? 1 : 0,
                        shift = 'left',
                        toColArea,
                        colsSize = area.split('" "')[0].split(' ').length;//save original col size for above example it's 6

                    area = area.replaceAll('"', '').trim().split(' ');//convert the matrix to single array, e,g "col1 col1 col1" "col2 col2 col2" "col3 col3"=> "col1 col1 col1 col2 col2 col2 col3 col3"
                    let droppIndex = area.indexOf(toGridArea),
                        firstIndex=area.indexOf(fromGridArea),
                        draggedIndex = firstIndex,
                        oldArea=Themify.convert(area),
                        len = area.length,
                        newArea = [];
                    if (draggedIndex < droppIndex) {
                        shift = 'right';
                        colIndex = side === 'right' ? 0 : -1;
                        draggedIndex = area.lastIndexOf(fromGridArea);
                    }
                    droppIndex += colIndex;
                    toColArea = area[droppIndex];

                    if (shift === 'left') {
                        for (let i = draggedIndex - 1; i >= droppIndex; --i) {
                            let currentCol = area[i],
                                replaceCol = area[i + 1];
                            if (currentCol !== replaceCol) {
                                for (let j = i; j < len; ++j) {
                                    if (area[j] === replaceCol) {
                                        area[j] = '_' + currentCol;
                                    }
                                }
                            }
                        }
                    } else {
                        for (let i = draggedIndex + 1; i <= droppIndex; ++i) {
                            let currentCol = area[i],
                                replaceCol = area[i - 1];
                            if (currentCol !== replaceCol) {
                                for (let j = 0; j < i; ++j) {
                                    if (area[j] === replaceCol) {
                                        area[j] = '_' + currentCol;
                                    }
                                }
                            }
                        }
                    }
                    for (let i = len - 1; i > -1; --i) {
                        if (area[i][0] === '_') {
                            area[i] = area[i].substring(1);
                        } else if (toColArea === area[i]) {
                            area[i] = fromGridArea;
                        }
                    }
                    for (let i = 0,len2=(len/colsSize); i < len2; ++i) {
                        newArea.push('"' + area.slice(i*colsSize,(i+1)*colsSize).join(' ') + '"');
                    }
                    newArea=newArea.join(' ');
                    const update={area: newArea};
                    if (col && col !== 'unset' && col !== 'initial' && col !== 'none') {//move resized col value only if movement the same grid rows(e.g "col1 col2" "col3 col4" save size when col2 moved to col1,don't save when col2 moved to col3/col4) 
                        const wasInRow=~~(firstIndex/colsSize),
                            indexAfter=newArea.replaceAll('"', '').trim().split(' ').indexOf(fromGridArea),
                            currentRow=~~(indexAfter/colsSize);
                        if(currentRow===wasInRow){//is the same 
                            col = parseRepeat(col)?.split(' ');
                            if (col) {
                                const newSizes=[],
                                    newOrder=newArea.split('" "')[wasInRow].replaceAll('"', '').split(' ');
                                    oldArea=oldArea.slice(wasInRow*colsSize,(wasInRow*colsSize)+colsSize);//cut the grid row where the column is

                                for(let i=0,len=newOrder.length;i<len;++i){
                                    let index=oldArea.indexOf(newOrder[i]);
                                    newSizes[i]=col[index];
                                    oldArea.slice(index,1);
                                }
                                update.size=newSizes.join(' ');
                            }
                        }
                    }
                    toModel.setCols(update,  currentBp);
                }
            } 
            else {//to different row

                //desktop mode
                let fr='1fr';
                if(isAdd===false){  
                    let fromCss={},
                        fromUpdate={},
                        fromArea = [],
                        fromSize =  fromData.desktop_size,
                        fromColNumber = ~~fromGridArea.replace('col', '');
                    ////in desktop mode the order is ALWAYS the same as document order,e.g col1 col2 col3 can't be col3 col1 col2
                    for (let j = 1; j <=(fromCount + 1); ++j) {
                        fromArea[j-1]=j;
                    }

                    if(fromSize && fromSize!=='1' && fromSize!==1){
                        fromSize = parseRepeat(fromSize)?.split(' ');
                    }
                    else{
                        fromSize=null;
                    }

                    //the maximum(css is using nth-child) column is removed=>make col4 to col3,col3 to col2 and etc.
                    for(let j=fromArea.length-1;j>-1;--j){
                        let index=~~fromArea[j];
                        if(index===fromColNumber){
                            if(fromSize?.[j]!==undefined){
                                fr=fromSize[j];
                                fromSize.splice(j, 1);
                            }
                            fromArea.splice(j, 1);
                        }
                        else {
                            if(index>fromColNumber){
                                --index;
                            }
                            fromArea[j]='col'+index;
                        }
                    }

                    if(fr && fr!=='1fr'){//increase other columns sizes proportional
                        let frVal = parseFloat(fr),
                            count = 0;
                        if(fromSize && (frVal-1)>.1){//if the diff is very small we don't need to do anything
                            for (let j = fromSize.length - 1; j > -1; --j) {
                                let v = parseFloat(fromSize[j]);
                                if ((frVal > 1 && v < 1) || (frVal < 1 && v > 1)) {
                                    ++count;
                                }
                            }
                            if (count > 0) {
                                let diff = parseFloat(frVal / count);
                                if (frVal < 1) {
                                    diff *= -1;
                                }
                                for (let j = fromSize.length - 1; j > -1; --j) {
                                    let v = parseFloat(fromSize[j]);
                                    if ((frVal > 1 && v < 1) || (frVal < 1 && v > 1)) {
                                        fromSize[j] = (v + diff) + 'fr';
                                    }
                                }
                            }
                        }
                    }

                    if(fromCount!==1 && fromSize){
                        //if there is grid with the same size use it instead of custom size(e.g "2.1fr 1fr" will be become to grid 2_1)
                        fromSize=ThemifyStyles.getColSize(fromSize.join(' '),false);
                    }
                    else{
                        fromSize=null;
                    }
                    addColClasses(fromSize, api.Utils.getColumns(from_inner));
                    if(fromCount===1){
                        fromArea=null;
                        fromUpdate.gutter=fromCss['--area']=fromCss['--colg']='';
                    }
                    else{
                        fromArea = '"' + fromArea.join(' ') + '"';
                    }   
                    fromUpdate.area=fromArea;
                    fromUpdate.size=fromSize;
                    fromModel.setCols(fromUpdate);

                    if(!fromSize){
                        fromCss['--col']='';
                    }
                    //remove the last col css variable
                    fromModel.setGridCss(fromCss);

                    from_inner.classList.remove('tb_col_count_'+(fromCount+1));
                    from_inner.classList.add('tb_col_count_'+fromCount);
                }

                if(isDelete===false){
                    let toArea=[],
                        toCss={},
                        toSize =toModel.getSizes('size','desktop');
                    ////in desktop mode the order is ALWAYS the same as document order,e.g col1 col2 col3 can't be col3 col1 col2
                    for (let j = 1; j <(toCount+1); ++j) {
                        toArea[j-1]='col'+j;
                    }
                    if(!toSize && fr!=='1fr'){
                        toSize='1fr '.repeat(toCount).trim();
                    }
                    if (toSize) {//move resized size
                        toSize = parseRepeat(toSize);
                        if (toSize) {
                            toSize=toSize.split(' ');
                            let toColNumber=Themify.convert(api.Utils.getColumns(to_inner)).indexOf(from);//get new index in html,will be the same in area
                            if(toSize.length<toCount){
                                toSize.splice(toColNumber, 0, fr);
                            }else{
                                toSize[toColNumber]=fr;
                            }
                            toSize = ThemifyStyles.getColSize(toSize.join(' '),false);//if there is a grid with the same the size use it instead of custom size(e.g "2.2fr 1fr" will be become to grid 2_1)
                        }
                        else{
                            toSize=null;
                        }
                    }
                    if(!toSize){
                        toCss['--col']='';
                    }
                    addColClasses(toSize, api.Utils.getColumns(to_inner));
                    //add the last col css variable
                    toArea = '"' + toArea.join(' ') + '"';
                    toModel.setCols({area: toArea, size: toSize});
                    toModel.setGridCss(toCss);
                    to_inner.classList.remove('tb_col_count_'+(toCount-1));
                    to_inner.classList.add('tb_col_count_'+toCount);
                    //set max gutter
                    toModel.setMaxGutter();
                }

                for (let i = points.length - 2; i > -1; --i) {
                    //reseting to auto, if breakpoint has auto value select it otherwise the parent value should be applied
                    let bp = points[i];
                    if(isAdd===false){
                        let fromArea= fromModel.getGridCss({size:'auto'},bp);
                        if(fromArea['--area'] && !fromArea['--area'].includes(' ')){//apply css and update data,if there is no auto grid should be inherted from parent breakpoint
                            fromModel.setCols({size: 'auto'},bp);
                        }
                        else{
                            fromModel.setGridCss({'--area':'','--col':''},bp);//reset css
                            fromModel.setSizes({size: 'auto'},bp);// update data
                        }
                    }
                    if(isDelete===false){
                        let toArea=toModel.getGridCss({size:'auto'},bp);
                        if(toArea['--area'] && !toArea['--area'].includes(' ')){//apply css and update data,if there is no auto grid should be inherted from parent breakpoint
                            toModel.setCols({size: 'auto'},bp);
                        }
                        else{
                            toModel.setGridCss({'--area':'','--col':''},bp);//reset css
                            toModel.setSizes({size: 'auto'},bp);// update data
                        }
                        toModel.setMaxGutter();
                    }
                }
            }
            api.Utils.onResize(true);
        },
        async module(drag, type,slug,scrollTo,settings) {
            if(scrollTo!==false){
                api.Utils.scrollTo(drag);
            }
            //drop a new modules
            if(type === 'part' || type === 'module'){
                await this.Library.module(drag, type,slug);
            }
            else{
                try{
                    const _default=settings || api.Module.getDefault(slug),
                        module = api.Module.initModule({mod_settings:_default,mod_name:slug});
                    module.is_new=true;
                    await module.edit();
                    drag.replaceWith(module.el);
                    if (api.isVisual && 'layout-part' !== slug && 'overlay-content' !== slug) {
                        await module.visualPreview(_default);
                    }
                    return module;
                }
                catch(e){
                    drag.remove();
                    throw e;
                }
            }
        },
        Library:{
            async row(id){
                let row = await api.Library.get(id, 'row');
                if (!Array.isArray(row)) {
                    row = new Array(row);
                    // Attach used GS to data
                    const usedGS = api.GS.findUsedItems(row);
                    if (usedGS?.length) {
                        row[0].used_gs = usedGS;
                    }
                }
                return row;
            },
            async module(drag,type,slug,scrollTo){
                const options=await api.Library.get(slug, type),
                    module = api.Module.initModule(options);
                    module.is_new=true;
                    try{
                        await module.edit();
                        drag.replaceWith(module.el);
                        if (api.isVisual) {
                            await api.bootstrap([module.id]);
                            api.Utils.runJs(module.el,'module');
                        }
                        if(scrollTo!==false){
                            api.Utils.scrollTo(module.el);
                        }
                        api.Builder.get().removeLayoutButton();
                        return module;
                    }
                    catch(e){
                        module.destroy();
                        drag.remove();
                        throw e;
                    }
            }
        }
    };

})(tb_app);