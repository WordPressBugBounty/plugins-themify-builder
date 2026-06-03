(api => {
    "use strict";

    const defaultData = () => ({
        head: [i18n.tbl_col + ' 1', i18n.tbl_col + ' 2'],
        body: [['', ''], ['', '']],
        cols: [
            { stack: true, width: '' },
            { stack: true, width: '' }
        ]
    });

    const toDenseRow = (row, width, fill) => Array.from({ length: width }, (_, i) => (row[i] != null ? row[i] : fill));

    const sanitizeData = raw => {
        let data = raw;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { data = null; }
        }
        if (!data || typeof data !== 'object') data = defaultData();
        let head = Array.isArray(data.head) ? data.head.slice() : [];
        const body = Array.isArray(data.body) ? data.body.map(r => Array.isArray(r) ? r.slice() : []) : [];
        let width = data.col_count ? +data.col_count : head.length;
        for (let i = 0; i < body.length; ++i) {
            if (body[i].length > width) width = body[i].length;
        }
        if (width === 0) return defaultData();
        head = toDenseRow(head, width, '');
        for (let i = 0; i < body.length; ++i) {
            body[i] = toDenseRow(body[i], width, '');
        }
        if (body.length === 0) body.push(Array(width).fill(''));
        const cols = [];
        for (let i = 0; i < width; ++i) {
            const src = (data.cols && data.cols[i]) || {};
            cols.push({
                stack: src.stack !== false,
                width: src.width || ''
            });
        }
        return { col_count: width, head, body, cols };
    };

    const parseCSV = text => {
        const rows = [];
        let row = [], cell = '', inQuotes = false;
        for (let i = 0; i < text.length; ++i) {
            const ch = text[i], next = text[i + 1];
            if (inQuotes) {
                if (ch === '"' && next === '"') { cell += '"'; ++i; }
                else if (ch === '"') { inQuotes = false; }
                else { cell += ch; }
            } else if (ch === '"') { inQuotes = true; }
            else if (ch === ',') { row.push(cell); cell = ''; }
            else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
            else if (ch !== '\r') { cell += ch; }
        }
        if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
        return rows.filter(r => r.some(c => c !== ''));
    };

    const rowsToData = rows => {
        if (!rows.length) return defaultData();
        const width = rows.reduce((m, r) => Math.max(m, r.length), 0);
        const pad = r => { const c = r.slice(); while (c.length < width) c.push(''); return c; };
        const head = pad(rows[0]);
        const body = rows.slice(1).map(pad);
        if (!body.length) body.push(Array(width).fill(''));
        const cols = Array.from({ length: width }, () => ({ stack: true, width: '' }));
        return { col_count: width, head, body, cols };
    };

    api.ModuleTable = class extends api.Module {

        static withDefaults(data) {
            return { ...api.ModuleTable.default(), ...(data || {}) };
        }

        static moduleSettings(modelOrData) {
            if (modelOrData?.get) {
                const modSettings = modelOrData.get('mod_settings') || {};
                const freeze = modelOrData.get('freeze_table') === 'yes' || modSettings.freeze_table === 'yes'
                    ? 'yes'
                    : (modSettings.freeze_table || modelOrData.get('freeze_table') || 'no');
                return api.ModuleTable.withDefaults({ ...modSettings, freeze_table: freeze });
            }
            return api.ModuleTable.withDefaults(modelOrData);
        }

        static isFreezeEnabled(data) {
            const v = api.ModuleTable.moduleSettings(data).freeze_table;
            return v === 'yes' || v === 'y' || v === 'on';
        }

        static hasHeader(data) {
            return api.ModuleTable.withDefaults(data).first_row_header !== 'no';
        }

        static loadFrontJs(mod) {
            if (!mod?.classList?.contains('module-table')) {
                return Promise.resolve();
            }
            const run = () => {
                Themify.trigger('builder_load_module_partial', [mod, false]);
            };
            const tbm = typeof ThemifyBuilderModuleJs !== 'undefined' ? ThemifyBuilderModuleJs : null;
            const jsBase = tbm?.jsUrl || (Themify.builder_url + 'js/modules/');
            const cssBase = tbm?.cssUrl || (Themify.builder_url + 'css/modules/');
            const ver = tbm?.ver || Themify.v || null;
            const jsUrl = jsBase + 'table.js';
            Themify.loadCss(cssBase + 'table.css', 'tb_table', ver);
            const pending = Themify.jsLazy?.get(jsUrl);
            if (pending) {
                return pending.then(run).catch(() => {});
            }
            return Themify.loadJs(jsUrl, null, ver).then(run).catch(() => {});
        }

        static importCsvFile(model) {
            if (!model || model.get('mod_name') !== 'table') {
                return;
            }
            const input = doc.createElement('input');
            input.type = 'file';
            input.accept = '.csv,text/csv,text/plain';
            input.style.cssText = 'position:fixed;left:-9999px;opacity:0';
            doc.body.appendChild(input);
            input.addEventListener('change', async () => {
                const file = input.files && input.files[0];
                input.remove();
                if (!file) return;
                if (!confirm(i18n.tbl_overwrite_confirm)) return;
                try {
                    const text = await file.text();
                    const data = api.ModuleTable.normalizeTableContent(rowsToData(parseCSV(text)));
                    model.set('table_content', data);
                    const lb = api.LightBox?.el;
                    const hidden = lb?.querySelector('#table_content');
                    if (hidden) {
                        hidden.value = JSON.stringify(data);
                    }
                    if (typeof model._rerender === 'function') {
                        model._rerender();
                    } else {
                        model.previewLive(model.get('mod_settings'));
                    }
                } catch (err) {
                    if (api.Notification) api.Notification.show(i18n.tbl_import_err, 'error');
                }
            }, { once: true });
            input.click();
        }

        static syncFreezeStylePreview(tabId) {
            const model = api.activeModel;
            if (!model || model.get('mod_name') !== 'table') {
                return;
            }
            const mod = typeof model._moduleEl === 'function'
                ? model._moduleEl()
                : (model.el?.classList?.contains('module-table') ? model.el : model.el?.querySelector?.('.module-table'));
            if (!mod?.classList?.contains('module-table')) {
                return;
            }
            delete mod.dataset.tbFreezePreview;
            if (typeof ThemifyConstructor !== 'undefined' && ThemifyConstructor.clicked === 'styling') {
                if (tabId === 'tbl_fh') {
                    mod.dataset.tbFreezePreview = 'head';
                } else if (tabId === 'tbl_fc') {
                    mod.dataset.tbFreezePreview = 'col';
                }
            }
            if (mod._tblFreezeUpdate) {
                mod._tblFreezeUpdate();
            } else if (mod.dataset.tbFreezePreview === 'head') {
                mod.classList.add('tb_freeze_head_active');
                mod.classList.remove('tb_freeze_col_active');
            } else if (mod.dataset.tbFreezePreview === 'col') {
                mod.classList.add('tb_freeze_col_active');
                mod.classList.remove('tb_freeze_head_active');
            } else {
                mod.classList.remove('tb_freeze_head_active', 'tb_freeze_col_active');
            }
        }

        static clearFreezeStylePreview() {
            for (let modules = doc.tfClass('module-table'), i = modules.length - 1; i > -1; --i) {
                const mod = modules[i];
                if (!mod.dataset.tbFreezePreview) {
                    continue;
                }
                delete mod.dataset.tbFreezePreview;
                if (mod._tblFreezeUpdate) {
                    mod._tblFreezeUpdate();
                } else {
                    mod.classList.remove('tb_freeze_head_active', 'tb_freeze_col_active');
                }
            }
        }

        static bindCsvUpload(lb) {
            if (!lb) return;
            const btn = lb.querySelector('#tbl_upload_csv, .tb_table_upload_csv');
            if (!btn || btn._tblCsvBound) return;
            btn._tblCsvBound = true;
            btn.tfOn(_CLICK_, e => {
                e.preventDefault();
                e.stopImmediatePropagation();
                api.ModuleTable.importCsvFile(api.activeModel);
            });
        }

        static getOptions() {
            return [
                {
                    id: 'mod_title_table',
                    type: 'title'
                },
                {
                    id: 'table_content',
                    type: 'hidden'
                },
                {
                    id: 'tbl_upload_csv',
                    type: 'button',
                    label: 'tbl_import_csv',
                    name: i18n.tbl_upload_csv,
                    class: 'tb_table_upload_csv tb_text_button',
                    help: 'tbl_upload_csv_h',
                    control: false
                },
                {
                    id: 'first_row_header',
                    type: 'toggle_switch',
                    label: 'tbl_header',
                    options: 'simple',
                    default: 'on',
                    help: 'tbl_header_h'
                },
                {
                    id: 'freeze_table',
                    type: 'toggle_switch',
                    label: 'tbl_freeze',
                    options: 'simple',
                    default: 'on',
                    help: 'tbl_freeze_h',
                    control: false
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_table'
                }
            ];
        }

        static default() {
            return {
                table_content: defaultData(),
                first_row_header: 'yes',
                freeze_table: 'yes'
            };
        }

        static normalizeTableContent(raw) {
            const data = sanitizeData(raw);
            const w = data.col_count;
            return {
                col_count: w,
                head: toDenseRow(data.head, w, ''),
                body: data.body.map(r => toDenseRow(r, w, '')),
                cols: data.cols
            };
        }

        static builderSave(settings) {
            if (settings.freeze_table !== 'yes') {
                delete settings.freeze_table;
            }
            settings.first_row_header = settings.first_row_header === 'no' ? 'no' : 'yes';
            delete settings.tbl_upload_csv;
            delete settings.import_file;
            let tableContentObj = null;
            if (settings.table_content) {
                if (typeof settings.table_content === 'string') {
                    try { settings.table_content = JSON.parse(settings.table_content); } catch (e) { settings.table_content = null; }
                }
                if (settings.table_content && typeof settings.table_content === 'object') {
                    tableContentObj = api.ModuleTable.normalizeTableContent(settings.table_content);
                    settings.table_content = JSON.stringify(tableContentObj);
                }
            }
            super.builderSave(settings);
            if (tableContentObj !== null) {
                settings.table_content = tableContentObj;
            }
        }

        _readFromDOM() {
            const root = this._moduleEl() || this.el;
            if (!root) return null;
            const grid = root.querySelector('.tb_grid_table');
            if (!grid) return null;
            const data = sanitizeData(this.get('table_content'));
            const heads = grid.querySelectorAll('thead .tb_grid_head_cell, tbody tr.tb_grid_ref_row .tb_grid_head_cell');
            const headData = [];
            for (let i = 0; i < heads.length; ++i) {
                headData.push(this._cellRawFromGrid(heads[i]));
            }
            const rows = grid.querySelectorAll('tbody tr.tb_grid_row:not(.tb_grid_ref_row)');
            const bodyData = [];
            for (let r = 0; r < rows.length; ++r) {
                const cells = rows[r].querySelectorAll('.tb_grid_body_cell .tb_grid_cell');
                const row = [];
                for (let c = 0; c < cells.length; ++c) {
                    row.push(this._cellRawFromGrid(cells[c]));
                }
                bodyData.push(row);
            }
            if (headData.length) data.head = headData;
            if (bodyData.length) data.body = bodyData;
            return sanitizeData(data);
        }

        // Persists latest cell text on save even if a cell is still focused.
        parseHtml(settings) {
            if (!api.isVisual) return;
            const data = this._readFromDOM();
            if (data) settings.table_content = api.ModuleTable.normalizeTableContent(data);
        }

        _commit(data) {
            data = sanitizeData(data);
            this.set('table_content', data);
            const lb = api.LightBox?.el;
            if (lb && api.activeModel?.id === this.id) {
                const hidden = lb.querySelector('#table_content');
                if (hidden) {
                    hidden.value = JSON.stringify(api.ModuleTable.normalizeTableContent(data));
                }
            }
        }

        _commitFromDOM() {
            const data = this._readFromDOM();
            if (data) this._commit(data);
        }

        _syncPreviewClasses() {
            const mod = this._moduleEl();
            if (!mod) return;
            const enabled = api.ModuleTable.isFreezeEnabled(this);
            mod.classList.toggle('tb_freeze_table', enabled);
            if (enabled) {
                api.ModuleTable.loadFrontJs(mod);
            } else {
                mod.classList.remove('tb_freeze_head', 'tb_freeze_col', 'tb_freeze_head_active', 'tb_freeze_col_active');
                delete mod.dataset.tbFreezePreview;
            }
        }

        _moduleEl() {
            if (!this.el) return null;
            return this.el.classList.contains('module-table') ? this.el : this.el.querySelector('.module-table');
        }

        _rerender() {
            const root = this._moduleEl();
            if (!root) return;
            const data = sanitizeData(this.get('table_content'));
            const hasHead = api.ModuleTable.hasHeader({ first_row_header: this.get('first_row_header') });
            const old = root.querySelector('.tb_table_wrap');
            const fresh = this._buildEditor(data, hasHead);
            if (old) old.replaceWith(fresh);
            else root.appendChild(fresh);
            this._syncPreviewClasses();
        }

        _cellRawFromEl(cell) {
            if (!cell) return '';
            let html = cell.innerHTML.trim();
            if (html === '<br>' || html === '<br/>' || html === '<br />' || html === '<div><br></div>' || html === '<div><br/></div>') {
                return '';
            }
            return html;
        }

        _cellRawFromEdit(cell) {
            if (!cell) return '';
            return cell.dataset.tbRawEdit === '1' ? cell.textContent : this._cellRawFromEl(cell);
        }

        _normalizeCellRaw(raw) {
            if (raw == null || raw === '') return '';
            let str = String(raw);
            if (/&(?:lt|gt|amp|quot|#39|#x27);/i.test(str) && !/<[a-z][\s\S]*>/i.test(str)) {
                const ta = doc.createElement('textarea');
                ta.innerHTML = str;
                str = ta.value;
            }
            return str;
        }

        _cellCoords(cell) {
            if (!cell) return null;
            if (cell.dataset.tbScope === 'head') {
                return { scope: 'head', col: +cell.dataset.tbCol };
            }
            if (cell.dataset.tbScope === 'body') {
                return { scope: 'body', row: +cell.dataset.tbRow, col: +cell.dataset.tbCol };
            }
            if (cell.classList.contains('tb_grid_head_cell')) {
                const col = cell.closest('[data-col]');
                return col ? { scope: 'head', col: +col.dataset.col } : null;
            }
            const tr = cell.closest('tr.tb_grid_row');
            const td = cell.closest('.tb_grid_body_cell');
            if (!tr || !td) return null;
            return { scope: 'body', row: +tr.dataset.row, col: +td.dataset.col };
        }

        _cellRawFromGrid(cell) {
            if (cell === doc.activeElement) {
                return this._cellRawFromEdit(cell);
            }
            if (cell.dataset.tbRaw != null) {
                return this._normalizeCellRaw(cell.dataset.tbRaw);
            }
            return this._cellRawFromEl(cell);
        }

        _formatCellHtml(raw) {
            if (raw == null || raw === '') return '';
            let str = this._normalizeCellRaw(raw);
            if (typeof this.shortcodeToHTML === 'function' && /\[[\w_-]+[^\]]*\]/.test(str)) {
                const sc = this.shortcodeToHTML(str);
                if (sc?.content != null) {
                    str = sc.content;
                }
            }
            return api.Helper.sanitizeHTML(str);
        }

        _getCellRawFromData(cell) {
            const coords = this._cellCoords(cell);
            if (!coords) return '';
            const data = sanitizeData(this.get('table_content'));
            if (coords.scope === 'head') {
                return data.head[coords.col] ?? '';
            }
            return data.body[coords.row]?.[coords.col] ?? '';
        }

        _setCellDisplay(cell, raw) {
            raw = raw ?? '';
            cell.dataset.tbRaw = raw;
            cell.innerHTML = this._formatCellHtml(raw);
        }

        _showCellRaw(cell) {
            const raw = this._normalizeCellRaw(this._getCellRawFromData(cell));
            cell.dataset.tbRaw = raw;
            cell.dataset.tbRawEdit = '1';
            cell.textContent = raw;
        }

        _updateCellInModel(cell, raw) {
            const coords = this._cellCoords(cell);
            if (!coords) return;
            const data = sanitizeData(this.get('table_content'));
            if (coords.scope === 'head') {
                data.head[coords.col] = raw;
            } else {
                if (!data.body[coords.row]) data.body[coords.row] = [];
                data.body[coords.row][coords.col] = raw;
            }
            this._commit(data);
        }

        _finishCellEdit(cell, session) {
            if (!cell) return;
            if (session != null && cell.dataset.tbEditSession !== String(session)) {
                return;
            }
            const raw = this._normalizeCellRaw(this._cellRawFromEdit(cell));
            delete cell.dataset.tbRawEdit;
            delete cell.dataset.tbEditSession;
            cell.dataset.tbRaw = raw;
            this._updateCellInModel(cell, raw);
            if (cell.isConnected) {
                this._setCellDisplay(cell, raw);
            }
        }

        addColumn(at) {
            const data = this._readFromDOM() || sanitizeData(this.get('table_content'));
            const idx = at == null ? data.head.length : Math.min(data.head.length, at + 1);
            data.head.splice(idx, 0, i18n.tbl_col + ' ' + (data.head.length + 1));
            data.cols.splice(idx, 0, { stack: true, width: '' });
            for (let i = 0; i < data.body.length; ++i) data.body[i].splice(idx, 0, '');
            this._commit(data);
            this._rerender();
        }

        deleteColumn(at) {
            const data = this._readFromDOM() || sanitizeData(this.get('table_content'));
            if (data.head.length <= 1) return;
            data.head.splice(at, 1);
            data.cols.splice(at, 1);
            for (let i = 0; i < data.body.length; ++i) data.body[i].splice(at, 1);
            this._commit(data);
            this._rerender();
        }

        addRow(at) {
            const data = this._readFromDOM() || sanitizeData(this.get('table_content'));
            const idx = at == null ? data.body.length : Math.min(data.body.length, at + 1);
            data.body.splice(idx, 0, data.head.map(() => ''));
            this._commit(data);
            this._rerender();
        }

        deleteRow(at) {
            const data = this._readFromDOM() || sanitizeData(this.get('table_content'));
            if (data.body.length <= 1) return;
            data.body.splice(at, 1);
            this._commit(data);
            this._rerender();
        }

        moveColumn(from, to) {
            if (from === to || from < 0 || to < 0) return;
            const data = this._readFromDOM() || sanitizeData(this.get('table_content'));
            const move = arr => {
                if (from >= arr.length || to >= arr.length) return;
                arr.splice(to, 0, arr.splice(from, 1)[0]);
            };
            move(data.head);
            move(data.cols);
            for (let i = 0; i < data.body.length; ++i) move(data.body[i]);
            this._commit(data);
            this._rerender();
        }

        moveRow(from, to) {
            if (from === to || from < 0 || to < 0) return;
            const data = this._readFromDOM() || sanitizeData(this.get('table_content'));
            if (from >= data.body.length || to >= data.body.length) return;
            data.body.splice(to, 0, data.body.splice(from, 1)[0]);
            this._commit(data);
            this._rerender();
        }

        _buildEditor(data, hasHead = true) {
            data = sanitizeData(data);
            const colCount = data.head.length;
            const wrap = createElement('', 'tb_table_wrap');
            const table = createElement('table', 'tb_table tb_grid_table');

            const colgroup = createElement('colgroup');
            for (let c = 0; c < colCount; ++c) {
                const col = createElement('col');
                const w = data.cols[c] && data.cols[c].width;
                if (w) col.style.width = w;
                colgroup.appendChild(col);
            }
            table.appendChild(colgroup);

            if (hasHead) {
                const thead = createElement('thead');
                const headTr = createElement('tr', 'tb_grid_head_row');
                for (let c = 0; c < colCount; ++c) {
                    const th = createElement('th', {
                        class: 'tb_grid_col',
                        'data-col': c
                    });
                    th.append(
                        createElement('span', {
                            role: 'button',
                            class: 'tb_del_btn tf_close tb_del_table tb_disable_sorting',
                            'data-col': c,
                            title: i18n.tbl_delcol
                        }),
                        createElement('span', {
                            role: 'button',
                            class: 'tb_add_btn tf_plus_icon tb_add_table tb_disable_sorting',
                            'data-col': c,
                            title: i18n.tbl_addcol
                        })
                    );
                    const cell = createElement('div', {
                        class: 'tb_grid_cell tb_grid_head_cell tb_disable_sorting',
                        contenteditable: 'true',
                        spellcheck: 'false',
                        'data-tb-scope': 'head',
                        'data-tb-col': c
                    });
                    this._setCellDisplay(cell, data.head[c] != null ? data.head[c] : '');
                    th.appendChild(cell);
                    th.appendChild(createElement('span', {
                        class: 'tb_table_col_sort tb_disable_sorting',
                        'data-col': c,
                        draggable: 'true',
                        title: i18n.tbl_dragcol
                    }));
                    if (c < colCount - 1) {
                        th.appendChild(createElement('span', {
                            class: 'tb_table_col_resize tb_disable_sorting',
                            'data-col': c,
                            title: i18n.tbl_resizecol
                        }));
                    }
                    headTr.appendChild(th);
                }
                thead.appendChild(headTr);
                table.appendChild(thead);
            }

            const tbody = createElement('tbody');
            if (!hasHead) {
                const refTr = createElement('tr', { class: 'tb_grid_row tb_grid_ref_row', 'data-row': -1 });
                for (let c = 0; c < colCount; ++c) {
                    const td = createElement('td', {
                        class: 'tb_grid_col tb_grid_body_cell' + (c === 0 ? ' tb_grid_first_cell' : ''),
                        'data-col': c
                    });
                    td.append(
                        createElement('span', {
                            role: 'button',
                            class: 'tb_del_btn tf_close tb_del_table tb_disable_sorting',
                            'data-col': c,
                            title: i18n.tbl_delcol
                        }),
                        createElement('span', {
                            role: 'button',
                            class: 'tb_add_btn tf_plus_icon tb_add_table tb_disable_sorting',
                            'data-col': c,
                            title: i18n.tbl_addcol
                        })
                    );
                    const cell = createElement('div', {
                        class: 'tb_grid_cell tb_grid_head_cell tb_disable_sorting',
                        contenteditable: 'true',
                        spellcheck: 'false',
                        'data-tb-scope': 'head',
                        'data-tb-col': c
                    });
                    this._setCellDisplay(cell, data.head[c] != null ? data.head[c] : '');
                    td.appendChild(cell);
                    td.appendChild(createElement('span', {
                        class: 'tb_table_col_sort tb_disable_sorting',
                        'data-col': c,
                        draggable: 'true',
                        title: i18n.tbl_dragcol
                    }));
                    if (c < colCount - 1) {
                        td.appendChild(createElement('span', {
                            class: 'tb_table_col_resize tb_disable_sorting',
                            'data-col': c,
                            title: i18n.tbl_resizecol
                        }));
                    }
                    refTr.appendChild(td);
                }
                tbody.appendChild(refTr);
            }
            for (let r = 0; r < data.body.length; ++r) {
                const tr = createElement('tr', { class: 'tb_grid_row', 'data-row': r });
                for (let c = 0; c < colCount; ++c) {
                    const td = createElement('td', {
                        class: c === 0 ? 'tb_grid_body_cell tb_grid_first_cell' : 'tb_grid_body_cell',
                        'data-col': c
                    });
                    if (c === 0) {
                        td.append(
                            createElement('span', {
                                role: 'button',
                                class: 'tb_del_btn tf_close tb_del_table tb_disable_sorting',
                                'data-row': r,
                                title: i18n.tbl_delrow
                            }),
                            createElement('span', {
                                role: 'button',
                                class: 'tb_add_btn tf_plus_icon tb_add_table tb_disable_sorting',
                                'data-row': r,
                                title: i18n.tbl_addrow
                            })
                        );
                    }
                    const cell = createElement('div', {
                        class: 'tb_grid_cell tb_disable_sorting',
                        contenteditable: 'true',
                        spellcheck: 'false',
                        'data-tb-scope': 'body',
                        'data-tb-row': r,
                        'data-tb-col': c
                    });
                    this._setCellDisplay(cell, data.body[r] && data.body[r][c] != null ? data.body[r][c] : '');
                    td.appendChild(cell);
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);

                const sortTr = createElement('tr', { class: 'tb_table_row_sort_row', 'data-row': r, 'aria-hidden': 'true' });
                const sortTd = createElement('td', { class: 'tb_table_row_sort_cell', colspan: String(colCount) });
                sortTd.appendChild(createElement('div', {
                    class: 'tb_table_row_sort tb_disable_sorting',
                    'data-row': r,
                    draggable: 'true',
                    title: i18n.tbl_dragrow
                }));
                sortTr.appendChild(sortTd);
                tbody.appendChild(sortTr);
            }
            table.appendChild(tbody);
            const hscroll = createElement('', 'tb_table_hscroll tb_grid_editor');
            hscroll.appendChild(table);
            wrap.appendChild(hscroll);
            return wrap;
        }

        // Delegated handlers on active_module survive previewLive swaps.
        _bindOnce() {
            const root = this.el;
            if (!root || this._tblHandlersBound) return;
            this._tblHandlersBound = true;
            const self = this;

            const insideEditor = t => t && t.closest && t.closest('.tb_grid_editor, .tb_table_hscroll');

            const onGridAction = e => {
                if (e.button !== 0) return;
                const t = e.target.closest('.tb_add_table,.tb_del_table');
                if (!t || !root.contains(t) || !insideEditor(t)) return;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                const ds = t.dataset,
                    isAdd = t.classList.contains('tb_add_table');
                if (ds.col != null) {
                    isAdd ? self.addColumn(+ds.col) : self.deleteColumn(+ds.col);
                } else if (ds.row != null) {
                    isAdd ? self.addRow(+ds.row) : self.deleteRow(+ds.row);
                }
            };

            root.tfOn('pointerdown', onGridAction, { capture: true });

            const setSortHandlesDraggable = (val) => {
                const handles = root.querySelectorAll('.tb_table_col_sort, .tb_table_row_sort');
                for (let i = handles.length - 1; i > -1; --i) handles[i].draggable = val;
            };

            const disableBuilderDrags = fromEl => {
                const saved = [];
                for (let el = fromEl.closest('[draggable]'); el; el = el.parentNode?.closest?.('[draggable]')) {
                    saved.push(el);
                    el.draggable = false;
                }
                return saved;
            };

            const restoreBuilderDrags = saved => {
                if (!saved?.length || root.classList.contains('tb_grid_inline_editing')) {
                    return;
                }
                for (let i = saved.length - 1; i > -1; --i) {
                    saved[i].draggable = true;
                }
            };

            const endCellDragBlock = () => {
                if (!self._cellDragBlocked) return;
                self._cellDragBlocked = false;
                restoreBuilderDrags(self._dragDisabled);
                self._dragDisabled = null;
                if (!root.classList.contains('tb_grid_inline_editing')) {
                    setSortHandlesDraggable(true);
                }
            };

            // Block module/column/row drag when interacting inside a cell (not only while editing).
            root.tfOn('pointerdown', e => {
                if (e.button !== 0) return;
                const cell = e.target.closest('.tb_grid_cell');
                if (!cell || !root.contains(cell) || !insideEditor(cell)) return;
                self._cellDragBlocked = true;
                self._dragDisabled = disableBuilderDrags(cell);
                setSortHandlesDraggable(false);
                e.stopPropagation();
            }, { capture: true });

            root.tfOn('pointerup', endCellDragBlock, { capture: true });
            root.tfOn('pointercancel', endCellDragBlock, { capture: true });

            root.tfOn('pointerdown', e => {
                if (e.button !== 0) return;
                const handle = e.target.closest('.tb_table_col_resize');
                if (!handle || !insideEditor(handle)) return;
                e.preventDefault();
                e.stopImmediatePropagation();
                self._startColResize(e, handle);
            }, { capture: true });

            const beginCellInline = cell => {
                if (!cell?.classList?.contains('tb_grid_cell') || !root.contains(cell) || !insideEditor(cell)) {
                    return;
                }
                if (self._activeInlineCell === cell && root.classList.contains('tb_grid_inline_editing')) {
                    return;
                }
                const mod = api.Registry.get(root.closest('.active_module')?.dataset.cid);
                if (!mod) {
                    return;
                }
                const token = self._inlineCellToken = (self._inlineCellToken || 0) + 1;
                self._pendingInlineCell = cell;
                Promise.resolve().then(async () => {
                    if (self._inlineCellToken !== token || self._pendingInlineCell !== cell || !cell.isConnected || doc.activeElement !== cell) {
                        return;
                    }
                    self._activeInlineCell = cell;
                    cell.dataset.tbEditSession = String(token);
                    cell.draggable = false;
                    root.classList.add('tb_grid_inline_editing');
                    root.draggable = false;
                    setSortHandlesDraggable(false);
                    await api.plaintextInline.start(cell, mod, {
                        getContent: target => {
                            if (target !== cell || target.dataset.tbEditSession !== String(token)) {
                                return target?.dataset?.tbRaw || '';
                            }
                            return self._getCellRawFromData(target);
                        },
                        setContent: (target, val) => {
                            if (target !== cell || target.dataset.tbEditSession !== String(token)) {
                                return;
                            }
                            val = self._normalizeCellRaw(val);
                            target.dataset.tbRaw = val;
                            target.dataset.tbRawEdit = '1';
                            target.textContent = val;
                        },
                        onEnd: target => self._finishCellEdit(target, token)
                    });
                });
            };

            root.tfOn('focusin', e => {
                beginCellInline(e.target);
            });
            root.tfOn('focusout', e => {
                if (!e.target.classList?.contains('tb_grid_cell')) return;
                requestAnimationFrame(async () => {
                    if (!root.classList.contains('tb_grid_inline_editing')) {
                        return;
                    }
                    const active = doc.activeElement;
                    if (active?.classList?.contains('tb_grid_cell') && root.contains(active)) {
                        return;
                    }
                    if (self._activeInlineCell === e.target) {
                        await api.plaintextInline.end();
                    }
                });
            });
            const endGridInline = () => {
                root.classList.remove('tb_grid_inline_editing');
                root.draggable = true;
                setSortHandlesDraggable(true);
            };
            Themify.on('inlineEditorDisable', (mod, el) => {
                if (mod?.id === self.id && el?.classList?.contains('tb_grid_cell')) {
                    const active = doc.activeElement;
                    if (active?.classList?.contains('tb_grid_cell') && root.contains(active) && active !== el) {
                        self._activeInlineCell = active;
                        return;
                    }
                    if (el?.dataset) {
                        delete el.dataset.tbEditSession;
                    }
                    self._activeInlineCell = null;
                    self._pendingInlineCell = null;
                    endGridInline();
                }
            });

            root.tfOn('keydown', async e => {
                if (e.target.classList?.contains('tb_grid_cell') && e.key === 'Escape') {
                    e.preventDefault();
                    await api.plaintextInline.end();
                }
            });

            root.tfOn('dragstart', e => {
                if (self._cellDragBlocked || root.classList.contains('tb_grid_inline_editing') || e.target.closest('.tb_grid_cell')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                const colHandle = e.target.closest('.tb_table_col_sort');
                const rowHandle = e.target.closest('.tb_table_row_sort');
                if (colHandle && insideEditor(colHandle)) {
                    self._dragColFrom = +colHandle.dataset.col;
                    self._dragRowFrom = null;
                    try { e.dataTransfer.effectAllowed = 'move'; } catch (err) {}
                    try { e.dataTransfer.setData('text/x-tb-tbl-col', String(self._dragColFrom)); } catch (err) {}
                    colHandle.closest('.tb_grid_col')?.classList.add('tb_grid_dragging');
                    e.stopPropagation();
                } else if (rowHandle && insideEditor(rowHandle)) {
                    self._dragRowFrom = +rowHandle.dataset.row;
                    self._dragColFrom = null;
                    try { e.dataTransfer.effectAllowed = 'move'; } catch (err) {}
                    try { e.dataTransfer.setData('text/x-tb-tbl-row', String(self._dragRowFrom)); } catch (err) {}
                    root.querySelector('tr.tb_grid_row[data-row="' + self._dragRowFrom + '"]')?.classList.add('tb_grid_dragging');
                    e.stopPropagation();
                }
            });

            root.tfOn('dragover', e => {
                if (root.classList.contains('tb_grid_inline_editing')) return;
                if (self._dragColFrom != null) {
                    const th = e.target.closest('.tb_grid_col');
                    if (th && insideEditor(th)) {
                        e.preventDefault();
                        try { e.dataTransfer.dropEffect = 'move'; } catch (err) {}
                        const r = th.getBoundingClientRect();
                        const isAfter = (e.clientX - r.left) > r.width / 2;
                        self._clearDragHover(root);
                        th.classList.add(isAfter ? 'tb_grid_drop_after' : 'tb_grid_drop_before');
                    }
                } else if (self._dragRowFrom != null) {
                    const tr = e.target.closest('tr.tb_grid_row');
                    if (tr && insideEditor(tr)) {
                        e.preventDefault();
                        try { e.dataTransfer.dropEffect = 'move'; } catch (err) {}
                        const r = tr.getBoundingClientRect();
                        const isAfter = (e.clientY - r.top) > r.height / 2;
                        self._clearDragHover(root);
                        tr.classList.add(isAfter ? 'tb_grid_drop_after' : 'tb_grid_drop_before');
                    }
                }
            });

            root.tfOn('drop', e => {
                if (root.classList.contains('tb_grid_inline_editing')) return;
                if (self._dragColFrom != null) {
                    const th = e.target.closest('.tb_grid_col');
                    if (th && insideEditor(th)) {
                        e.preventDefault();
                        e.stopPropagation();
                        const target = +th.dataset.col;
                        const r = th.getBoundingClientRect();
                        let to = (e.clientX - r.left) > r.width / 2 ? target + 1 : target;
                        if (to > self._dragColFrom) --to;
                        self.moveColumn(self._dragColFrom, to);
                    }
                } else if (self._dragRowFrom != null) {
                    const tr = e.target.closest('tr.tb_grid_row');
                    if (tr && insideEditor(tr)) {
                        e.preventDefault();
                        e.stopPropagation();
                        const target = +tr.dataset.row;
                        const r = tr.getBoundingClientRect();
                        let to = (e.clientY - r.top) > r.height / 2 ? target + 1 : target;
                        if (to > self._dragRowFrom) --to;
                        self.moveRow(self._dragRowFrom, to);
                    }
                }
                self._dragColFrom = self._dragRowFrom = null;
                self._clearDragHover(root);
            });

            root.tfOn('dragend', () => {
                self._dragColFrom = self._dragRowFrom = null;
                self._clearDragHover(root);
                if (!root.classList.contains('tb_grid_inline_editing')) {
                    root.draggable = true;
                }
            });
        }

        _clearDragHover(scope) {
            const items = scope.querySelectorAll('.tb_grid_drop_before, .tb_grid_drop_after, .tb_grid_dragging');
            for (let i = items.length - 1; i > -1; --i) {
                items[i].classList.remove('tb_grid_drop_before', 'tb_grid_drop_after', 'tb_grid_dragging');
            }
        }

        _getColHeaderCells(table) {
            const headRow = table.querySelector('thead tr') || table.querySelector('tbody tr.tb_grid_ref_row');
            return headRow ? headRow.querySelectorAll(':scope > .tb_grid_col') : [];
        }

        // Resizes adjacent columns (px), persisted on <colgroup>.
        _startColResize(e, handle) {
            const self = this,
                table = handle.closest('.tb_grid_table'),
                wrap = table?.closest('.tb_table_hscroll') || table?.closest('.tb_table_wrap');
            if (!table || !wrap) return;
            const idx = +handle.dataset.col,
                cols = table.querySelectorAll('colgroup > col');
            if (!cols[idx] || !cols[idx + 1]) return;
            const headCells = this._getColHeaderCells(table);
            const cellA = headCells[idx],
                cellB = headCells[idx + 1];
            if (!cellA || !cellB) return;
            const handleRect = handle.getBoundingClientRect(),
                wrapRect = wrap.getBoundingClientRect();
            if (handleRect.right > wrapRect.right - 2) {
                wrap.scrollLeft += handleRect.right - wrapRect.right + 12;
            } else if (handleRect.left < wrapRect.left + 2) {
                wrap.scrollLeft -= wrapRect.left - handleRect.left + 12;
            }
            let aW = cellA.offsetWidth,
                bW = cellB.offsetWidth;
            if (aW < 1 || bW < 1) return;
            const startX = e.clientX,
                minW = 48,
                pairW = aW + bW;
            handle.classList.add('tb_drag_grid_current');
            try { handle.setPointerCapture(e.pointerId); } catch (err) {}
            const move = ev => {
                const dx = ev.clientX - startX;
                let newA = aW + dx;
                if (newA < minW) newA = minW;
                if (newA > pairW - minW) newA = pairW - minW;
                const newB = pairW - newA;
                cols[idx].style.width = Math.round(newA) + 'px';
                cols[idx + 1].style.width = Math.round(newB) + 'px';
            };
            const up = ev => {
                try { handle.releasePointerCapture(ev.pointerId); } catch (err) {}
                doc.tfOff('pointermove', move, { passive: true });
                doc.tfOff('pointerup', up, { passive: true });
                handle.classList.remove('tb_drag_grid_current');
                const data = self._readFromDOM() || sanitizeData(self.get('table_content'));
                for (let i = 0; i < cols.length; ++i) {
                    if (cols[i].style.width) {
                        if (!data.cols[i]) data.cols[i] = { stack: true, width: '' };
                        data.cols[i].width = cols[i].style.width;
                    }
                }
                self._commit(data);
            };
            doc.tfOn('pointermove', move, { passive: true });
            doc.tfOn('pointerup', up, { passive: true });
        }

        preview(incoming) {
            const data = { ...api.ModuleTable.moduleSettings(this), ...(incoming || {}) };
            data.freeze_table = api.ModuleTable.moduleSettings(this).freeze_table;
            if (!api._tbTableAdminCss) {
                const tbm = typeof ThemifyBuilderModuleJs !== 'undefined' ? ThemifyBuilderModuleJs : null;
                const cssBase = tbm?.cssUrl || (Themify.builder_url + 'css/modules/');
                const ver = tbm?.ver || Themify.v || null;
                api._tbTableAdminCss = true;
                Themify.loadCss(cssBase + 'table.css', 'tb_table', ver);
                Themify.loadCss(cssBase + 'table-admin.css', 'tb_table_admin', ver);
            }
            const module = createElement('', 'module module-table tb_grid_editor_module' + (data.css_table ? ' ' + data.css_table : ''));
            if (api.ModuleTable.isFreezeEnabled(data)) {
                module.classList.add('tb_freeze_table');
            }
            if (data.mod_title_table) {
                module.appendChild(this.constructor.getModuleTitle(data.mod_title_table, 'mod_title_table'));
            }
            const hasHead = api.ModuleTable.hasHeader(data);
            module.appendChild(this._buildEditor(data.table_content || defaultData(), hasHead));
            Promise.resolve().then(() => {
                this._bindOnce();
                if (api.ModuleTable.isFreezeEnabled(data)) {
                    api.ModuleTable.loadFrontJs(module);
                }
            });
            return module;
        }

        static bindOptionChanges(lb) {
            if (!lb || lb._tblOptsBound) return;
            lb._tblOptsBound = true;
            lb.tfOn('change', e => {
                const wrap = e.target?.closest?.('.tb_lb_option');
                if (!wrap || wrap.id !== 'freeze_table') return;
                const input = wrap.querySelector('input');
                if (!input) return;
                const model = api.activeModel;
                if (!model || model.get('mod_name') !== 'table') return;
                const val = input.value === 'yes' || input.value === 'on' ? 'yes' : 'no';
                model.set('freeze_table', val);
                model.set('mod_settings', { ...model.get('mod_settings'), freeze_table: val });
                if (typeof ThemifyConstructor !== 'undefined') {
                    ThemifyConstructor.settings.freeze_table = val;
                }
                model._syncPreviewClasses();
            }, { passive: true });
        }
    };

    const bindTableLightbox = lb => {
        if (api.activeModel?.get('mod_name') !== 'table') return;
        api.ModuleTable.bindCsvUpload(lb);
        api.ModuleTable.bindOptionChanges(lb);
    };

    Themify.on('tb_editing_module_setting', bindTableLightbox);
    Themify.on('tb_editing_module', bindTableLightbox);
    Themify.on('tb_builder_tabsactive', id => {
        const tab = typeof id === 'string' ? id.replace(/^#/, '') : '';
        api.ModuleTable.syncFreezeStylePreview(tab);
    });
    Themify.on('themify_builder_lightbox_close', () => {
        api.ModuleTable.clearFreezeStylePreview();
    });
})(tb_app);
