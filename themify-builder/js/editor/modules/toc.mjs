(api=> {
    "use strict";
    api.ModuleToc = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'm_t',
                    type: 'title'
                },
                {
                    type: 'tabs',
                    class: 'tb_tabs_fullwidth',
                    options: {
                        include: [
                            {
                                id: 'in_tags',
                                label: 'anhbtgs',
                                type: 'checkbox',
                                default:['h1','h2','h3','h4','h5','h6'],
                                options: [
                                    {
                                        name: 'h1',
                                        value: 'H1'
                                    },
                                    {
                                        name: 'h2',
                                        value: 'H2'
                                    },
                                    {
                                        name: 'h3',
                                        value: 'H3'
                                    },
                                    {
                                        name: 'h4',
                                        value: 'H4'
                                    },
                                    {
                                        name: 'h5',
                                        value: 'H5'
                                    },
                                    {
                                        name: 'h6',
                                        value: 'H6'
                                    }
                                ]
                            },
                            {
                                id: 'in_cont',
                                label: 'conter',
                                type: 'select',
                                options: {
                                    b: 'curb',
                                    b_c: 'bpcont',
                                    r: 'inestrow',
                                    c: 'inestcol',
                                    doc: 'alldoc',
                                    cust: 'cus'
                                },
                                binding: {
                                    select: {
                                        hide: 'tb_custom_toc'
                                    },
                                    cust: {
                                        show: 'tb_custom_toc'
                                    }
                                }
                            },
                            {
                                id: 'in_custom',
                                label: 'cuscont',
                                wrap_class: 'tb_custom_toc',
                                type: 'text',
                                control: {
                                    event: 'change'
                                },
                                help: 'cusconth'
                            },
                            {
                                id: 'min',
                                type: 'range',
                                min: 1,
                                default:2,
                                label: 'mintag',
                                help: 'mintagh'
                            },
                            {
                                id: 'maxt',
                                type: 'number',
                                label: 'maxanchlen'
                            },
                            {
                                id: 'maxh',
                                type: 'number',
                                min: 5,
                                default:32,
                                label: 'ghashlen',
                                help: 'ghashlenh'
                            }
                        ]
                        ,
                        exclude: [
                            {
                                id: 'ex_m_t',
                                label: 'exmt',
                                type: 'toggle_switch',
                                options: 'simple',
                                default:'off'
                            },
                            {
                                id: 'ex_tags',
                                label: 'exhead',
                                type: 'text',
                                control: {
                                    event: 'change'
                                },
                                help: 'exheadh'
                            }
                        ]
                    }
                },
                {
                    type: 'separator',
                    label: 'adv'
                },
                {
                    id: 'mark',
                    type: 'select',
                    label: 'lbull',
                    options: {
                        none: 'none',
                        b: 'bull',
                        c: 'circle',
                        s: 'square',
                        ur: 'uproman',
                        lr: 'lowroman',
                        ic: 'icon'
                    },
                    binding: {
                        select: {
                            hide: 'tb_toc_ic'
                        },
                        ic: {
                            show: 'tb_toc_ic'
                        }
                    }
                },
                {
                    id: 'ic',
                    label: 'icon',
                    type: 'icon',
                    wrap_class: 'tb_toc_ic'
                },
                {
                    id: 'num',
                    type: 'toggle_switch',
                    label: 'shnum',
                    options: 'simple',
                    default:'off'
                },
                {
                    id: 'tree',
                    type: 'toggle_switch',
                    label: 'hierarcy',
                    options: 'simple',
                    default:'on',
                    binding: {
                        checked: {
                            show: 'tb_toc_colapse'
                        },
                        not_checked: {
                            hide: 'tb_toc_colapse'
                        }
                    }
                },
                {
                    id: 'minimize',
                    type: 'toggle_switch',
                    label: 'minize',
                    options: 'simple',
                    default:'off',
                    binding: {
                        checked: {
                            show: 'tb_toc_min_ic'
                        },
                        not_checked: {
                            hide: 'tb_toc_min_ic'
                        }
                    }
                },
                {
                    type: 'group',
                    wrap_class: 'tb_toc_min_ic',
                    options: [
                        {
                            id: 'mic',
                            label: 'icon',
                            type: 'icon',
                            default:'ti-angle-up'
                        },
                        {
                            id: 'mmic',
                            label: 'minizeic',
                            type: 'icon',
                            default:'ti-angle-down'
                        },
                        {
                            id: 'bp',
                            label: 'minizeon',
                            type: 'select',
                            options: {
                                tl: 'table_landscape',
                                t: 'ta',
                                m: 'mo',
                                n: 'none'
                            }
                        }
                    ]
                },
                {
                    type: 'group',
                    wrap_class: 'tb_toc_colapse',
                    options: [
                        {
                            id: 'colapse',
                            type: 'toggle_switch',
                            label: 'colsubitem',
                            options: 'simple',
                            default:'on',
                            binding: {
                                checked: {
                                    show: 'tb_toc_colapse_ic'
                                },
                                not_checked: {
                                    hide: 'tb_toc_colapse_ic'
                                }
                            }
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_toc_colapse_ic',
                            options: [
                                {
                                    id: 'cic',
                                    label: 'chic',
                                    type: 'icon'
                                },
                                {
                                    id: 'cmic',
                                    label: 'chminizeic',
                                    type: 'icon'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css'
                }
            ];
        }
        static default() {
            return {
                bp: 'n'
            };
        }
        static builderSave(settings) {
            const def = {
                in_cont: 'b',
                in_tags: 'h1|h2|h3|h4|h5|h6',
                ex_m_t: 'no',
                mark: 'none',
                num: 'no',
                tree: 'yes',
                colapse: 'yes',
                cic: '-',
                cmic: '+',
                minimize: 'no',
                mic: 'ti-angle-up',
                mmic: 'ti-angle-down',
                bp: 'tl',
                min: '2',
                maxh: '32'
            };
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            if (settings.min?.toString()=== def.min) {
                delete settings.min;
            }
            if (settings.maxh?.toString() === def.maxh) {
                delete settings.maxh;
            }
            if (settings.in_cont !== 'cust') {
                delete settings.in_custom;
            }
            if (settings.mark !== 'ic') {
                delete settings.ic;
            }
            if (settings.tree === 'no' || settings.colapse === 'no') {
                if (settings.tree === 'no') {
                    delete settings.colapse;
                }
                delete settings.cic;
                delete settings.cmic;
            }
            if (settings.minimize !== 'yes') {
                delete settings.mic;
                delete settings.mmic;
                delete settings.bp;
            }
            super.builderSave(settings);
        }
        preview(data) {
            const module = createElement(),
                    head = createElement('','tb_toc_head tf_clearfix'),
                    mark = data.mark || 'none',
                    classes = ['module', 'module-toc', 'tb_toc_' + mark],
                    dataset=module.dataset;

            if (data.m_t) {
                head.appendChild(this.constructor.getModuleTitle(data.m_t, 'm_t'));
            }
            if (data.num === 'yes') {
                classes.push('tb_toc_show_num');
            }
            if (data.tree !== 'no') {
                classes.push('tb_toc_tree');
            }
            module.className = classes.join(' ');
            dataset.min = data.min >= 1 ? data.min : 2;
            dataset.maxh = data.maxh > 2 ? data.maxh : 32;
            dataset.tags = data.in_tags;
            dataset.cont = data.in_cont || 'b';

            if (data.ex_m_t === 'yes') {
                dataset.ex_m = 1;
            }
            if (data.minimize === 'yes') {
                dataset.bp = data.bp || '';
                head.append(api.Helper.getIcon((data.mic || 'ti-angle-down'), 'tb_toc_mic_close'), api.Helper.getIcon((data.mmic || 'ti-angle-up'), 'tb_toc_mic tf_hide'));
            }
            if (data.maxt) {
                dataset.maxt = data.max;
            }
            if (data.ex_tags) {
                dataset.excl = data.ex_tags;
            }
            if (data.in_custom) {
                dataset.sel = data.in_custom;
            }
            module.appendChild(head);

            if (mark === 'ic' && data.ic) {
                const tpl = createElement('template','tpl_toc_ic');
                tpl.content.appendChild(api.Helper.getIcon(data.ic, 'tb_toc_ic'));
                module.appendChild(tpl);
            }
            if (data.tree !== 'no' && data.colapse !== 'no') {
                const cic = createElement('template', 'tpl_toc_cic'),
                        cic_close = createElement('template','tpl_toc_cic_close'),
                        colapsedown = data.cic || '-',
                        colapseup = data.cmic || '+';

                if (colapsedown === '-') {
                    cic.content.appendChild(createElement('span','tf_fa tb_toc_cic'));
                } else {
                    cic.content.appendChild(api.Helper.getIcon(colapsedown, 'tb_toc_cic'));
                }

                if (colapseup === '+') {
                    cic_close.content.appendChild(createElement('span','tf_fa tb_toc_cic_close tf_hide'));
                } else {
                    cic_close.content.appendChild(api.Helper.getIcon(colapseup, 'tb_toc_cic_close tf_hide'));
                }
                module.append(cic, cic_close);
            }
            return module;
        }
    };
})(tb_app);