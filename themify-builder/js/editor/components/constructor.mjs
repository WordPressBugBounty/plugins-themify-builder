((api,_CLICK_,body,topBody,topBodyCl,topThemify,topWindowDoc) => {
    "use strict";
const createTextNode=text=>{
  return doc.createTextNode(text);  
};
window.ThemifyConstructor = {
    clicked: null,
    styles:{},
    settings:{},
    _editors:[],
    afterRun:[],
    _radioChange:[],
    _bindings:[],
    _stylesData:{},
    init() {
        const _this=this,
            font_select=_this.font_select;
        _this.breakpointsReverse = Object.keys(themify_vars.breakpoints).reverse();
        _this.breakpointsReverse.push('desktop');
        _this.static = themifyBuilder.i18n.options;
        let fonts = themifyBuilder.safe;
        for (let i = 0; i < fonts.length; ++i) {
            if ('' !== fonts[i].value && 'default' !== fonts[i].value) {
                font_select.safe[fonts[i].value] = fonts[i].name;
            }
        }
        fonts = themifyBuilder.google;
        if (Array.isArray(fonts)) {
            for (let i = 0; i < fonts.length; ++i) {
                if ('' !== fonts[i].value && 'default' !== fonts[i].value) {
                    let variants = [...fonts[i].variant];
                    for (let j = variants.length - 1; j > -1; --j) {
                        variants[j] = typeof variants[j] === 'string' ? variants[j].replace('i', 'italic').replace('r', 'regular') : variants[j].toString();
                    }
                    font_select.google[fonts[i].value] = {n: fonts[i].name, v: variants};
                }
            }
        } else {
            for (let k in fonts) {
                font_select.google[k] = {n: fonts[k].n, v: [...fonts[k].v]};
                for (let variants = font_select.google[k].v, j = variants.length - 1; j > -1; --j) {
                    variants[j] = typeof variants[j] === 'string' ? variants[j].replace('i', 'italic').replace('r', 'regular') : variants[j].toString();
                }
            }
        }
        fonts = themifyBuilder.cf;
        if (Array.isArray(fonts)) {
            for (let i = 0; i < fonts.length; ++i) {
                if ('' !== fonts[i].value && 'default' !== fonts[i].value) {
                    let variants = [...fonts[i].variant];
                    for (let j = variants.length - 1; j > -1; --j) {
                        variants[j] = typeof variants[j] === 'string' ? variants[j].replace('i', 'italic').replace('r', 'regular') : variants[j].toString();
                    }
                    font_select.cf[fonts[i].value] = {n: fonts[i].name, v: variants};
                }
            }
        } else {
            for (let k in fonts) {
                font_select.cf[k] = {n: fonts[k].n, v: [...fonts[k].v]};
                for (let variants = font_select.cf[k].v, j = variants.length - 1; j > -1; --j) {
                    variants[j] = typeof variants[j] === 'string' ? variants[j].replace('i', 'italic').replace('r', 'regular') : variants[j].toString();
                }
            }
        }
        themifyBuilder.i18n.options = null;
    },
    getEl(id) {
        return api.LightBox.el.querySelector('#' + id);
    },
    getOptions(data) {
        const isObject = typeof data !== 'string',
                visible_slides_options = {};
        if (isObject && data.options !== undefined) {
            return data.options;
        }
        for (let i = 1; i < 21; ++i) {
            visible_slides_options[i] = i;
        }
        const showHide = {
                    on: {
                        name: '',
                        value: 's'
                    },
                    off: {
                        name: 'hide',
                        value: 'hi'
                    }
                },
                options = {
                    appearance: [
                        {
                            name: 'rounded',
                            value: 'rounded'
                        },
                        {
                            name: 'gradient',
                            value: 'gradient'
                        },
                        {
                            name: 'glossy',
                            value: 'glossy'
                        },
                        {
                            name: 'embossed',
                            value: 'embos'
                        },
                        {
                            name: 'shadow',
                            value: 'sh'
                        }
                    ],
                    blend: {
                        '': '',
                        normal: 'n',
                        multiply: 'multi',
                        screen: 'screen',
                        overlay: 'overlay',
                        darken: 'darken',
                        lighten: 'light',
                        'color-dodge': 'colord',
                        'color-burn': 'colorb',
                        difference: 'diff',
                        exclusion: 'excl',
                        hue: 'hue',
                        saturation: 'sat',
                        color: 'c',
                        luminosity: 'lum'
                    },
                    text_decoration: [
                        {
                            value: 'underline',
                            name: 'undl',
                            label_class: 'tb_text_underline',
                            icon: 'U'
                        },
                        {
                            value: 'overline',
                            name: 'ovl',
                            label_class: 'tb_text_overline',
                            icon: 'O'
                        },
                        {
                            value: 'line-through',
                            name: 'thl',
                            label_class: 'tb_text_through',
                            icon: 'S'
                        },
                        {
                            value: 'none',
                            name: 'none',
                            label_class: 'tb_text_none',
                            icon: '-'
                        }
                    ],
                    text_transform: [
                        {
                            value: 'uppercase',
                            name: 'ucase',
                            icon: 'AB'
                        },
                        {
                            value: 'lowercase',
                            name: 'lcase',
                            icon: 'ab'
                        },
                        {
                            value: 'capitalize',
                            name: 'cpt',
                            icon: 'Ab'
                        },
                        {
                            value: 'none',
                            name: 'none',
                            icon: '–'
                        }
                    ],
                    font_style: [
                        {
                            value: 'italic',
                            name: 'it',
                            icon: '<span class="tb_font_italic">I</span>'
                        },
                        {
                            value: 'normal',
                            name: 'n',
                            icon: 'N'
                        }
                    ],
                    font_weight: [
                        {
                            value: 'bold',
                            name: 'bold',
                            icon: '<span class="tb_font_bold">B</span>'
                        }
                    ],
                    repeat: {
                        repeat: 'r_all',
                        'repeat-x': 'r_h',
                        'repeat-y': 'r_v',
                        'no-repeat': 'r_no',
                        fullcover: 'fcover'
                    },
                    border: {
                        solid: 'solid',
                        dashed: 'dashed',
                        dotted: 'dotted',
                        double: 'double',
                        none: 'none'
                    },
                    border_radius: [
                        {
                            id: 'top',
                            label: i18n.top + ' ' + i18n.left
                        },
                        {
                            id: 'right',
                            label: i18n.top + ' ' + i18n.right
                        },
                        {
                            id: 'left',
                            label: i18n.bottom + ' ' + i18n.left
                        },
                        {
                            id: 'bottom',
                            label: i18n.bottom + ' ' + i18n.right
                        }
                    ],
                    orderBy: {
                        date: 'date',
                        ID: 'id',
                        author: 'author',
                        title: 'title',
                        name: 'name',
                        modified: 'md',
                        rand: 'rand',
                        menu_order : 'menuord',
                        comment_count: 'com_count',
                        meta_value: 'cfield'
                    },
                    meta_order : {
                        CHAR: 'charact',
                        NUMERIC: 'num',
                        DATETIME: 'dtime',
                        DATE: 'date',
                        TIME: 'time'
                    },
                    order: {
                        desc: 'descend',
                        asc: 'asc'
                    },
                    dateFormat: {
                        'F j, Y': 'F_j_Y',
                        'Y-m-d': 'Y_m_d',
                        'm/d/Y': 'm_d_Y',
                        'd/m/Y': 'd_m_Y',
                        def: 'def',
                        custom: 'cus'
                    },
                    choose: {
                        yes: 'y',
                        no: 'no'
                    },
                    rchoose: {
                        no: 'no',
                        yes: 'y'
                    },
                    echoose: {
                        '': '',
                        yes: 'y',
                        no: 'no'
                    },
                    link_type: [
                        {
                            value: 'regular',
                            name: 'swin'
                        },
                        {
                            value: 'lightbox',
                            name: 'lg'
                        },
                        {
                            value: 'newtab',
                            name: 'ntab'
                        }
                    ],
                    link_to: [
                        {
                            value: 'permalink',
                            name: 'perml'
                        },
                        {
                            value: 'media',
                            name: 'medf'
                        },
                        {
                            value: 'custom',
                            name: 'cus'
                        },
                        {
                            value: 'none',
                            name: 'none'
                        }
                    ],
                    display:{
                        '': '',
                        block:'block',
                        'inline-block':'inbl',
                        none:'none'
                    },
                    va_display:{
                        '': '',
                        top : 'top',
                        middle : 'mid',
                        bottom : 'bottom'
                    },
                    img_appearance: [
                        {
                            name: 'rounded',
                            value: 'rounded'
                        },
                        {
                            name: 'drop-shadow',
                            value: 'dshadow'
                        },
                        {
                            name: 'bordered',
                            value: 'bordered'
                        },
                        {
                            name: 'circle',
                            value: 'circle',
                            help: 'cimg_app'
                        }
                    ],
                    color: [
                        {
                            img: 'default',
                            value: 'default',
                            label: 'def'
                        },
                        {
                            img: 'black',
                            value: 'black',
                            label: 'black'
                        },
                        {
                            img: 'grey',
                            value: 'gray',
                            label: 'gray'
                        },
                        {
                            img: 'blue',
                            value: 'blue',
                            label: 'blue'
                        },
                        {
                            img: 'light-blue',
                            value: 'light-blue',
                            label: 'lblue'
                        },
                        {
                            img: 'green',
                            value: 'green',
                            label: 'green'
                        },
                        {
                            img: 'light-green',
                            value: 'light-green',
                            label: 'lgreen'
                        },
                        {
                            img: 'purple',
                            value: 'purple',
                            label: 'purple'
                        },
                        {
                            img: 'light-purple',
                            value: 'light-purple',
                            label: 'lpurple'
                        },
                        {
                            img: 'brown',
                            value: 'brown',
                            label: 'brown'
                        },
                        {
                            img: 'orange',
                            value: 'orange',
                            label: 'orange'
                        },
                        {
                            img: 'yellow',
                            value: 'yellow',
                            label: 'yellow'
                        },
                        {
                            img: 'red',
                            value: 'red',
                            label: 'red'
                        },
                        {
                            img: 'pink',
                            value: 'pink',
                            label: 'pink'
                        }
                    ],
                    visibility: [
                        {
                            type: 'separator',
                            label: 'visibility'
                        },
                        {
                            id: 'visibility_desktop',
                            label: 'de',
                            type: 'toggle_switch',
                            default: 'on',
                            options: showHide,
                            wrap_class: 'tb_module_visibility_control'
                        },
                        {
                            id: 'visibility_tablet_landscape',
                            label: 'table_landscape',
                            type: 'toggle_switch',
                            default: 'on',
                            options: showHide,
                            wrap_class: 'tb_module_visibility_control'
                        },
                        {
                            id: 'visibility_tablet',
                            label: 'tap',
                            type: 'toggle_switch',
                            default: 'on',
                            options: showHide,
                            wrap_class: 'tb_module_visibility_control'
                        },
                        {
                            id: 'visibility_mobile',
                            label: 'mo',
                            type: 'toggle_switch',
                            default: 'on',
                            options: showHide,
                            wrap_class: 'tb_module_visibility_control'
                        },
                        {
                            id: 'sticky_visibility',
                            label: 's_v',
                            type: 'toggle_switch',
                            options: {
                                on: {
                                    name: 'hide'
                                }
                            },
                            wrap_class: 'tb_module_visibility_control',
                            help: 's_vh'
                        },
                        {
                            id: 'visibility_all',
                            label: 'h_a',
                            type: 'toggle_switch',
                            options: {
                                on: {
                                    name: 'hide_all'
                                }
                            },
                            binding: {
                                not_checked: {
                                    show: 'tb_module_visibility_control'
                                },
                                checked: {
                                    hide: 'tb_module_visibility_control'
                                }
                            },
                            help: 'h_ah'
                        }
                    ],
                    htags: {
                        h1: 'H1',
                        h2: 'H2',
                        h3: 'H3',
                        h4: 'H4',
                        h5: 'H5',
                        h6: 'H6',
                        div: 'divt',
                        p: 'pa'
                    },
                    post_grid: [
                        {
                            img: 'list_post',
                            value: 'list-post',
                            label: 'lpost'
                        },
                        {
                            img: 'grid2',
                            value: 'grid2',
                            label: 'grid2'
                        },
                        {
                            img: 'grid3',
                            value: 'grid3',
                            label: 'grid3'
                        },
                        {
                            img: 'grid4',
                            value: 'grid4',
                            label: 'grid4'
                        },
                        {
                            img: 'grid5',
                            value: 'grid5',
                            label: 'grid5'
                        },
                        {
                            img: 'grid6',
                            value: 'grid6',
                            label: 'grid6'
                        }
                    ],
                    slider_options: [{
                            id: 'effect_slider',
                            type: 'select',
                            label: 'effect',
                            options: {
                                scroll: 'slide',
                                fade: 'fade',
                                cube: 'cube',
                                flip: 'flip',
                                coverflow: 'coverflow',
                                continuously: 'continuously'
                            },
                            binding: {
                                flip: {
                                    hide: [
                                        'visible_opt_slider',
                                        'tab_visible_opt_slider',
                                        'mob_visible_opt_slider',
                                        'scroll_opt_slider',
                                        'continuous_dir'
                                    ],
                                    show: 'auto_scroll_opt_slider'
                                },
                                fade: {
                                    hide: [
                                        'visible_opt_slider',
                                        'tab_visible_opt_slider',
                                        'mob_visible_opt_slider',
                                        'scroll_opt_slider',
                                        'continuous_dir'
                                    ],
                                    show: 'auto_scroll_opt_slider'
                                },
                                cube: {
                                    hide: [
                                        'visible_opt_slider',
                                        'tab_visible_opt_slider',
                                        'mob_visible_opt_slider',
                                        'scroll_opt_slider',
                                        'continuous_dir'
                                    ],
                                    show: 'auto_scroll_opt_slider'
                                },
                                coverflow: {
                                    show: [
                                        'visible_opt_slider',
                                        'tab_visible_opt_slider',
                                        'mob_visible_opt_slider',
                                        'auto_scroll_opt_slider',
                                        'scroll_opt_slider'
                                    ],
                                    hide : 'continuous_dir'
                                },
                                scroll: {
                                    show: [
                                        'visible_opt_slider',
                                        'tab_visible_opt_slider',
                                        'mob_visible_opt_slider',
                                        'auto_scroll_opt_slider',
                                        'scroll_opt_slider'
                                    ],
                                    hide : 'continuous_dir'
                                },
                                continuously: {
                                    show: [
                                        'visible_opt_slider',
                                        'tab_visible_opt_slider',
                                        'mob_visible_opt_slider',
                                        'scroll_opt_slider',
                                        'continuous_dir'
                                    ],
                                    hide: 'auto_scroll_opt_slider'
                                }
                            }
                        },
                        {
                            id : 'continuous_dir',
                            type : 'select',
                            options : {
                                '' : 'rtl',
                                'r' : 'ltr'
                            },
                            label : 'dir'
                        },
                        {
                            id: 'items_per_slide',
                            type: 'number',
                            label: 'itemxslide',
                            default : 1
                        },
                        {
                            id: 'visible_opt_slider',
                            type: 'select',
                            options: visible_slides_options,
                            label: 'visibsl'
                        },
                        {
                            id: 'tab_visible_opt_slider',
                            type: 'select',
                            options: visible_slides_options,
                            label: 'tvisibsl'
                        },
                        {
                            id: 'mob_visible_opt_slider',
                            type: 'select',
                            options: visible_slides_options,
                            label: 'mvisibsl'
                        },
                        {
                            id: 'auto_scroll_opt_slider',
                            type: 'select',
                            label: 'ascroll',
                            default:'off',
                            options: {
                                1: '1s',
                                2: '2s',
                                3: '3s',
                                4: '4s',
                                5: '5s',
                                6: '6s',
                                7: '7s',
                                8: '8s',
                                9: '9s',
                                10: '10s',
                                15: '15s',
                                20: '20s',
                                off: 'off'
                            },
                            binding: {
                                off: {
                                    hide: [
                                        'pause_on_hover_slider',
                                        'play_pause_control'
                                    ]
                                },
                                select: {
                                    show: [
                                        'pause_on_hover_slider',
                                        'play_pause_control'
                                    ]
                                }
                            }
                        },
                        {
                            id: 'scroll_opt_slider',
                            type: 'select',
                            options: {
                                1: 1,
                                2: 2,
                                3: 3,
                                4: 4,
                                5: 5,
                                6: 6,
                                7: 7
                            },
                            label: 'scroll'
                        },
                        {
                            id: 'speed_opt_slider',
                            type: 'range',
                            increment : .1,
                            min : .1,
                            max : 99.9, /* >= 100 the value is considered to be in miliseconds */
                            label: 'speed',
                            help : 'speedh'
                        },
                        {
                            id: 'pause_on_hover_slider',
                            type: 'toggle_switch',
                            options: {
                                on: {
                                    name: 'resume',
                                    value: 'y'
                                },
                                off: {
                                    name: '0',
                                    value: 'no'
                                }
                            },
                            label: 'pauseonh',
                            default: 'on'
                        },
                        {
                            id: 'play_pause_control',
                            type: 'toggle_switch',
                            options: 'simple',
                            label: 'plpausebtn',
                            default: 'off'
                        },
                        {
                            id: 'wrap_slider',
                            type: 'toggle_switch',
                            options: 'simple',
                            label: 'wrap',
                            default: 'on'
                        },
                        {
                            id: 'show_nav_slider',
                            type: 'toggle_switch',
                            options: 'simple',
                            label: 'pagin',
                            default: 'on'
                        },
                        {
                            id: 'show_arrow_slider',
                            type: 'toggle_switch',
                            label: 'slarrs',
                            options: 'simple',
                            binding: {
                                no: {
                                    hide: 'show_arrow_buttons_vertical'
                                },
                                select: {
                                    value: 'no',
                                    show: 'show_arrow_buttons_vertical'
                                }
                            },
                            default: 'on'
                        },
                        {
                            id: 'touch_swipe',
                            type: 'select',
                            label: 'touchsw',
                            options: {
                                '': 'alldevice',
                                touch: 'tdevice',
                                no: 'dis'
                            }
                        },
                        {
                            id: 'show_arrow_buttons_vertical',
                            type: 'toggle_switch',
                            label: 'disarrmid',
                            options: {
                                on: {
                                    name: 'vertical',
                                    value: 'y'
                                },
                                off: {
                                    name: '',
                                    value: 'no'
                                }
                            }
                        },
                        {
                            id: 'left_margin_slider',
                            type: 'number',
                            label: 'lmarg',
                            after: 'px'
                        },
                        {
                            id: 'right_margin_slider',
                            type: 'number',
                            label: 'rmarg',
                            after: 'px'
                        },
                        {
                            id: 'height_slider',
                            type: 'select',
                            options: {
                                variable: 'var',
                                auto: 'auto'
                            },
                            label: 'ht',
                            help: 'slhthelp'
                        }
                    ],
                    ac:[
                        {
                            value: 'inherit',
                            name: 'n'
                        },
                        {
                            value: 'start',
                            name: 'start'
                        },
                        {
                            value: 'center',
                            name: 'center'
                        },
                        {
                            value: 'end',
                            name: 'end'
                        },
                        {
                            value: 'space-between',
                            name: 'spcbtw'
                        },
                        {
                            value: 'space-around',
                            name: 'spcarn'
                        },
                        {
                            value: 'space-evenly',
                            name: 'spcevn'
                        },
                        {
                            value: 'stretch',
                            name: 'sttch'
                        }
                    ],
                    ji:[
                        {
                            value: 'inherit',
                            name: 'n'
                        },
                        {
                            value: 'baseline',
                            name: 'bslne'
                        },
                        {
                            value: 'start',
                            name: 'start'
                        },
                        {
                            value: 'center',
                            name: 'center'
                        },
                        {
                            value: 'end',
                            name: 'end'
                        },
                        {
                            value: 'stretch',
                            name: 'sttch'
                        }
                    ]
                };
            options.jc=[...options.ac];
            options.ai=[...options.ji];
            options.as=[...options.ji];
            options.js=[...options.jc];
            options.js.length=4;
            options.js.push(options.jc.at(-1));
            options.jc.pop();
            options.ji.pop();
            for(let aligns=['ji','jc','as','ai','ac','js'],i=aligns.length-1;i>-1;--i){
                let prefix=aligns[i],
                    alignItems=options[prefix];
                for(let j=alignItems.length-1;j>-1;--j){
                    let icon=alignItems[j].value;
                    if(icon!=='baseline'){
                        if(prefix==='as'){
                            prefix='ai';
                        }
                        else if(prefix==='js'){
                            prefix='jc';
                        }
                        icon=icon==='inherit'?'normal':(prefix+'-'+icon);
                    }
                    alignItems[j]={...{icon:'<svg class="tb_align"><use href="'+Themify.builder_url + 'css/editor/img/alignment.svg#'+icon+'"/></svg>'},...alignItems[j]};
                }
            }
            const normal={...options.as[0]};
            normal.name=normal.value='auto';
            options.as[0]=options.js[0]=normal;

        if (!this.static.aligment2) {
            this.static.aligment = [
                {
                    value: 'left',
                    name: 'left',
                    icon: api.Helper.getIcon('ti-align-left').outerHTML
                },
                {
                    value: 'center',
                    name: 'center',
                    icon: api.Helper.getIcon('ti-align-center').outerHTML
                },
                {
                    value: 'right',
                    name: 'right',
                    icon: api.Helper.getIcon('ti-align-right').outerHTML
                },
                {
                    value: 'justify',
                    name: 'just',
                    icon: api.Helper.getIcon('ti-align-justify').outerHTML
                }
            ];
            this.static.aligment2 = this.static.aligment.slice(0, 3);
            this.static.h_tags = {};
            for (let i = 6; i > 0; --i) {
                this.static.h_tags['h' + i] = 'H' + i;
            }
            const sticky = {};
            for (let bps = this.breakpointsReverse, i = bps.length - 1; i > -1; --i) {
                let bp = bps[i],
                        postfix = '',
                        checkbox;
                if (bp === 'desktop') {
                    checkbox = {
                        id: 'stick_at_check',
                        type: 'checkbox',
                        options: [
                            {
                                name: 'stick_at_check',
                                value: 'stickat'
                            }
                        ],
                        binding: {
                            not_checked: {
                                hide: [
                                    'unstick_wr',
                                    'stick_wr'
                                ]
                            },
                            checked: {
                                show: [
                                    'unstick_wr',
                                    'stick_wr'
                                ]
                            }
                        }
                    };

                } else {
                    postfix = bp === 'tablet_landscape' ? '_tl' : '_'+bp[0];
                    checkbox = {
                        id: 'stick_at_check' + postfix,
                        type: 'radio',
                        option_js: true,
                        options: [
                            {
                                value: '',
                                name: 'inher'
                            },
                            {
                                value: '1',
                                name: 'en'
                            },
                            {
                                value: '0',
                                name: 'dis'
                            }
                        ]
                    };
                }
                sticky[bp] = {
                    icon: 'ti-' + (bp === 'tablet_landscape' ? 'tablet' : bp),
                    title: api.Helper.getBreakpointName(bp),
                    class: bp === 'tablet_landscape' ? 'tab_tablet_landscape' : '',
                    label: '',
                    options: [
                        {
                            type: 'group',
                            wrap_class: 'stick_middle_wrapper',
                            options: [
                                checkbox,
                                {
                                    type: 'group',
                                    wrap_class: 'stick_wr tb_group_element_1',
                                    options: [
                                        {
                                            id: 'stick_at_position' + postfix,
                                            type: 'select',
                                            options: {
                                                top: 'toppos',
                                                bottom: 'botpos'
                                            }
                                        },
                                        {
                                            id: 'stick_at_pos_val' + postfix,
                                            type: 'range',
                                            units: {
                                                px: {
                                                    max: 1000000
                                                },
                                                '%': ''
                                            },
                                            after: 'ofs'
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            type: 'group',
                            wrap_class: 'stick_middle_wrapper unstick_wr tb_group_element_1',
                            options: [
                                {
                                    id: 'unstick_when_check'+postfix,
                                    type: 'checkbox',
                                    options: [
                                        {
                                            name: 'unstick_when_check',
                                            value: 'unstwhn'
                                        }
                                    ],
                                    binding: {
                                        not_checked: {
                                            hide: 'unstick_when_wr'
                                        },
                                        checked: {
                                            show: 'unstick_when_wr'
                                        }
                                    }
                                },
                                {
                                    type: 'group',
                                    wrap_class: 'unstick_when_wr',
                                    options: [
                                        {
                                            id: 'unstick_when_element'+postfix,
                                            type: 'select',
                                            options: {
                                                builder_end: 'bcontend',
                                                row: 'row',
                                                module: 'module'
                                            },
                                            binding: {
                                                builder_end: {
                                                    hide: 'unstick_opt_wr'
                                                },
                                                row: {
                                                    show: [
                                                        'unstick_opt_wr',
                                                        'unstick_row'
                                                    ],
                                                    hide: 'unstick_module'
                                                },
                                                module: {
                                                    show: [
                                                        'unstick_opt_wr',
                                                        'unstick_module'
                                                    ],
                                                    hide: 'unstick_row'
                                                }
                                            }
                                        },
                                        {
                                            type: 'group',
                                            wrap_class: 'unstick_opt_wr tf_inline_b',
                                            options: [
                                                {
                                                    id: 'unstick_when_el_row_id'+postfix,
                                                    type: 'sticky',
                                                    wrap_class: 'unstick_row',
                                                    key: 'row'
                                                },
                                                {
                                                    id: 'unstick_when_el_mod_id'+postfix,
                                                    type: 'sticky',
                                                    wrap_class: 'unstick_module',
                                                    key: 'module'
                                                },
                                                {
                                                    id: 'unstick_when_condition'+postfix,
                                                    type: 'select',
                                                    options: {
                                                        hits: 'hits',
                                                        passes: 'passes'
                                                    }
                                                },
                                                {
                                                    id: 'unstick_when_pos'+postfix,
                                                    type: 'select',
                                                    options: {
                                                        this: 'thisel',
                                                        top: 'viewpt',
                                                        bottom: 'viewpb'
                                                    },
                                                    binding: {
                                                        this: {
                                                            hide: 'unstick_when_pos_val'+postfix
                                                        },
                                                        top: {
                                                            show: 'unstick_when_pos_val'+postfix
                                                        },
                                                        bottom: {
                                                            show: 'unstick_when_pos_val'+postfix
                                                        }
                                                    }
                                                },
                                                {
                                                    id: 'unstick_when_pos_val'+postfix,
                                                    type: 'range',
                                                    units: {
                                                        px: {
                                                            max: 100000
                                                        },
                                                        '%': ''
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };
            }
            this.static.animation = [
                {
                    type: 'separator',
                    label: 'animation'
                },
                {
                    type: 'multi',
                    label: 'entran',
                    options: [
                        {
                            id: 'animation_effect',
                            type: 'animation_select'
                        },
                        {
                            id: 'animation_effect_delay',
                            type: 'number',
                            after: 'delay',
                            step: .1
                        },
                        {
                            id: 'animation_effect_repeat',
                            type: 'number',
                            after: 'r'
                        }
                    ]
                },
                {
                    type: 'animation_select',
                    label: 'hanim',
                    id: 'hover_animation_effect'
                },
                {
                    type: 'separator',
                    label: 's_e_f'
                },
                {
                    type: 'tabs',
                    isRadio: true,
                    id: 'animation_effect_tab',
                    options: {
                        s_e_m: [
                            {
                                id: 'motion_effects',
                                type: 'accordion',
                                options: {
                                    v: {
                                        label: 'vscrl',
                                        options: [
                                            {
                                                id: 'v_dir',
                                                type: 'select',
                                                label: 'dir',
                                                options: {
                                                    '': '',
                                                    up: '_up',
                                                    down: 'dwn'
                                                },
                                                binding: {
                                                    empty: {
                                                        hide: [
                                                            'v_speed',
                                                            'v_vp'
                                                        ]
                                                    },
                                                    not_empty: {
                                                        show: [
                                                            'v_speed',
                                                            'v_vp'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                id: 'v_speed',
                                                type: 'slider_range',
                                                label: 'speed',
                                                options: {
                                                    min: 1,
                                                    max: 10,
                                                    unit: '',
                                                    range: false,
                                                    default: 1
                                                }
                                            },
                                            {
                                                id: 'v_vp',
                                                type: 'slider_range',
                                                label: 'viewp'
                                            }
                                        ]
                                    },
                                    h: {
                                        label: 'hrztalscl',
                                        options: [
                                            {
                                                id: 'h_dir',
                                                type: 'select',
                                                label: 'dir',
                                                options: {
                                                    '': '',
                                                    toleft: 'tolft',
                                                    toright: 'torgt'
                                                },
                                                binding: {
                                                    empty: {
                                                        hide: [
                                                            'h_speed',
                                                            'h_vp'
                                                        ]
                                                    },
                                                    not_empty: {
                                                        show: [
                                                            'h_speed',
                                                            'h_vp'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                id: 'h_speed',
                                                type: 'slider_range',
                                                label: 'speed',
                                                options: {
                                                    min: 1,
                                                    max: 10,
                                                    unit: '',
                                                    range: false,
                                                    default: 1
                                                }
                                            },
                                            {
                                                id: 'h_vp',
                                                type: 'slider_range',
                                                label: 'viewp'
                                            }
                                        ]
                                    },
                                    t: {
                                        label: 'trnspncy',
                                        options: [
                                            {
                                                id: 't_dir',
                                                type: 'select',
                                                label: 'dir',
                                                options: {
                                                    '': '',
                                                    fadein: 'fadein',
                                                    fadeout: 'fadout',
                                                    fadeoutin: 'fadoutin',
                                                    fadeinout: 'fadinout'
                                                },
                                                binding: {
                                                    empty: {
                                                        hide: 't_vp'
                                                    },
                                                    not_empty: {
                                                        show: 't_vp'
                                                    }
                                                }
                                            },
                                            {
                                                id: 't_vp',
                                                type: 'slider_range',
                                                label: 'viewp'
                                            }
                                        ]
                                    },
                                    b: {
                                        label: 'bl',
                                        options: [
                                            {
                                                id: 'b_dir',
                                                type: 'select',
                                                label: 'dir',
                                                options: {
                                                    '': '',
                                                    fadein: 'fadein',
                                                    fadeout: 'fadout'
                                                },
                                                binding: {
                                                    empty: {
                                                        hide: [
                                                            'b_level',
                                                            'b_vp'
                                                        ]
                                                    },
                                                    not_empty: {
                                                        show: [
                                                            'b_level',
                                                            'b_vp'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                id: 'b_level',
                                                type: 'slider_range',
                                                label: 'lvl',
                                                options: {
                                                    min: 1,
                                                    max: 10,
                                                    unit: '',
                                                    range: false,
                                                    default: 1
                                                }
                                            },
                                            {
                                                id: 'b_vp',
                                                type: 'slider_range',
                                                label: 'viewp'
                                            }
                                        ]
                                    },
                                    r: {
                                        label: 'ro',
                                        options: [
                                            {
                                                id: 'r_dir',
                                                type: 'select',
                                                label: 'dir',
                                                options: {
                                                    '': '',
                                                    toleft: 'tolft',
                                                    toright: 'torgt'
                                                },
                                                binding: {
                                                    empty: {
                                                        hide: [
                                                            'r_num',
                                                            'r_origin',
                                                            'r_vp'
                                                        ]
                                                    },
                                                    not_empty: {
                                                        show: [
                                                            'r_num',
                                                            'r_origin',
                                                            'r_vp'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                id: 'r_num',
                                                type: 'range',
                                                label: 'nspins',
                                                units: {
                                                    '': {
                                                        min: .05,
                                                        increment: .1
                                                    }
                                                }
                                            },
                                            {
                                                id: 'r_origin',
                                                type: 'position_box',
                                                label: 'trorig'
                                            },
                                            {
                                                id: 'r_vp',
                                                type: 'slider_range',
                                                label: 'viewp'
                                            }
                                        ]
                                    },
                                    s: {
                                        label: 'sc',
                                        options: [
                                            {
                                                id: 's_dir',
                                                type: 'select',
                                                label: 'dir',
                                                options: {
                                                    '': '',
                                                    up: 'scup',
                                                    down: 'scdwn'
                                                },
                                                binding: {
                                                    empty: {
                                                        hide: [
                                                            's_ratio',
                                                            's_origin',
                                                            's_vp'
                                                        ]
                                                    },
                                                    not_empty: {
                                                        show: [
                                                            's_ratio',
                                                            's_origin',
                                                            's_vp'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                id: 's_ratio',
                                                type: 'range',
                                                label: 'scrat',
                                                units: {
                                                    '': {
                                                        min: 1,
                                                        max: 30,
                                                        increment: .1
                                                    }
                                                }
                                            },
                                            {
                                                id: 's_origin',
                                                type: 'position_box',
                                                label: 'trorig'
                                            },
                                            {
                                                id: 's_vp',
                                                type: 'slider_range',
                                                label: 'viewp'
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        s_e_s: [
                            {
                                type: 'tabs',
                                options: sticky
                            }
                        ]
                    }
                }
            ];
        }
        if (!isObject) {
            if (options[data] !== undefined) {
                return options[data];
            }
            if (this.static[data] !== undefined) {
                return this.static[data];
            }
        } else {
            for (let i in options) {
                if (data[i] === true) {
                    return options[i];
                }
            }
            for (let i in this.static) {
                if (data[i] === true) {
                    return this.static[i];
                }
            }
        }
        return false;
    },
    _getTitle(data) {
        if (data.type === 'custom_css') {
            return i18n.custom_css;
        }
        if (data.type === 'title') {
            return i18n.m_t;
        }
        return data.label !== undefined ? (i18n[data.label] !== undefined ? i18n[data.label] : data.label) : false;
    },
    _getSwitcher() {
        const sw = createElement('','tb_lightbox_switcher'),
                breakpoints = this.breakpointsReverse;
        for (let i = breakpoints.length - 1; i > -1; --i) {
            let b = breakpoints[i],
                btn = createElement('button',{class:'tab_' + b,'data-href':'#' + b,title:b === 'tablet_landscape' ? i18n.table_landscape : (b.charAt(0).toUpperCase() + b.substr(1))});
            btn.appendChild(api.Helper.getIcon('ti-' + (b === 'tablet_landscape' ? 'tablet' : b)));
            sw.appendChild(btn);
        }
        return sw.tfOn(_CLICK_, function (e) {
            e.stopImmediatePropagation();
            if (e.target !== this) {
                const id = e.target.closest('button')?.dataset.href.replace('#', '');
                if (id && id !== api.activeBreakPoint) {
                    api.ToolBar.breakpointSwitcher(id);
                }
            }
        },{passive:true});
    },
    _binding(_this, data, val, context) {
        let logic = false;
        const {binding,type} = data;
        if (type === 'select' && val == 0) {
            val = '';
        }
        if ('video' === type) {
            if (val === '') {
                logic = binding.empty;
            } else {
                const provider = Themify.parseVideo(val);
                if (provider.type === 'youtube' || provider.type === 'vimeo') {
                    logic = binding.external;
                } else {
                    let url;
                    try {
                        url = new URL(val);
                    } catch (_) {
                        url = false;
                    }
                    logic = false !== url && topWindow.location.hostname === url.hostname ? binding.local : binding.empty;
                }
            }
        } else if (!val && binding.empty !== undefined) {
            logic = binding.empty;
        } else if (binding[val] !== undefined && (val || type === 'select')) {
            if (type === 'radio' || type === 'icon_radio') {
                logic = _this.checked === true ? binding[val] : false;
            } else {
                logic = binding[val];
            }
        } else if (val && binding.not_empty !== undefined) {
            logic = binding.not_empty;
        } else if (binding.select !== undefined && val !== binding.select.value) {
            logic = binding.select;
        } else if (binding.checked !== undefined && _this.checked === true) {
            logic = binding.checked;
        } else if (binding.not_checked !== undefined && _this.checked === false) {
            logic = binding.not_checked;
        }
        if (logic) {

            if (context === undefined || context === null || context.length === 0) {
                context = _this.closest('.tb_tab,.tb_expanded_opttions') || this.getEl('tb_lightbox_container');
            }
            const hasHide = logic.hide !== undefined,
                    hasShow = logic.show !== undefined,
                    relatedBindings = [],
                    options = this._options[this.clicked].options,
                    getData = (opt, key) => {
                let value;
                if (undefined !== key && opt !== undefined) {
                    for (let i = opt.length - 1; i > -1; --i) {
                        if (opt[i].id === key) {
                            value = opt[i];
                            break;
                        }
                        if (opt[i].options !== undefined && Array.isArray(opt[i].options)) {
                            value = getData(opt[i].options, key);
                            if (value !== undefined) {
                                break;
                            }
                        }
                    }
                }
                return value;
            },
            relatedBinding = (el, data, context) => {
                const type = el.dataset.type;
                let  _this;
                if ('radio' === type) {
                    _this = el.querySelector('input:checked') || el.tfTag('input')[0];
                } else if ('checkbox' === type || 'toggle_switch' === type) {
                    _this = el.tfTag('input')[0];
                } else if ('select' === type) {
                    _this = el.tfTag('select')[0];
                }
                if (_this) {
                    this._binding(_this, data, _this.value, context);
                }
            };
            if (hasShow === true && !Array.isArray(logic.show)) {
                logic.show = [logic.show];
            }
            if (hasHide === true && !Array.isArray(logic.hide)) {
                logic.hide = [logic.hide];
            }
            let items = hasShow === true ? logic.show : [];
            if (hasHide === true) {
                items = items.concat(logic.hide);
            }
            for (let i = 0, len = items.length; i < len; ++i) {
                if (hasHide === true && logic.hide[i] !== undefined) {
                    let sel = logic.hide[i].indexOf('#') === 0 ? logic.hide[i] : '.' + logic.hide[i],
                            hides = context.querySelectorAll(sel);
                    for (let j = hides.length - 1; j > -1; --j) {
                        hides[j].classList.add('_tb_hide_binding');
                        if (null !== this.component) {
                            let relatedBindData = getData(options, logic.hide[i]);
                            if (relatedBindData?.binding) {
                                relatedBindings.push({_el: hides[j], _args: relatedBindData});
                            }
                        }
                    }
                }
                if (hasShow === true && logic.show[i] !== undefined) {

                    let sel = logic.show[i].indexOf('#') === 0 ? logic.show[i] : '.' + logic.show[i],
                            shows = context.querySelectorAll(sel);
                    for (let j = shows.length - 1; j > -1; --j) {
                        shows[j].classList.remove('_tb_hide_binding');
                        if (null !== this.component) {
                            let relatedBindData = getData(options, logic.show[i]);
                            if (relatedBindData?.binding) {
                                relatedBindings.push({_el: shows[j], _args: relatedBindData});
                            }
                        }
                    }
                }
            }
            for (let i = relatedBindings.length - 1; i > -1; --i) {
                relatedBinding(relatedBindings[i]._el, relatedBindings[i]._args, context);
            }
            if (logic.responsive?.disabled !== undefined) {
                if (!Array.isArray(logic.responsive.disabled)) {
                    logic.responsive.disabled = [logic.responsive.disabled];
                }
                const items_disabled = logic.responsive.disabled,
                        is_responsive = 'desktop' !== api.activeBreakPoint;
                for (let i = items_disabled.length - 1; i > -1; --i) {
                    if (logic.responsive.disabled[i] !== undefined) {
                        let sel = logic.responsive.disabled[i].indexOf('#') === 0 ? logic.responsive.disabled[i] : '.' + logic.responsive.disabled[i],
                                resp = context.querySelectorAll(sel);
                        for (let j = resp.length - 1; j > -1; --j) {
                            resp[i].classList.toggle('tb_responsive_disable', is_responsive);
                        }
                    }
                }
            }
        }
    },
    control: {
        init(el, type, args) {
            args.name = type;
            this[type].call(this, el, args);
        },
        preview(el, val, args) {
            if (!el?.isConnected) {
                return;
            }
            const self = ThemifyConstructor,
                    repeater = el.closest('.tb_toggleable_fields') || el.closest('.tb_sort_fields_parent') || el.closest('.tb_row_js_wrapper'),
                    model=api.activeModel;
            if (repeater !== null) {
                const opt=api.Forms.parseSettings(repeater);
                self.settings[ opt.id ] = opt.v;
            } else {
                self.settings[ args.id ] = val;
            }
            if (api.isVisual) {
                let	selector = null;
                if (args.selector !== undefined && val) {
                    selector = model.el.querySelectorAll(args.selector);
                    if (selector.length === 0) {
                        selector = null;
                    } else if (repeater !== null) {
                        const item = el.closest('.tb_repeatable_field');
                        let items = repeater.children,
                                index = null;
                        for (let i =  items.length - 1; i >-1;--i) {
                            if (items[i] === item) {
                                index = i;
                                break;
                            }
                        }
                        if (args.rep !== undefined) {
                            selector = model.el.querySelectorAll(args.rep);
                            if (selector[index] !== undefined) {
                                items = selector[index].querySelectorAll(args.selector);
                                if (items.length === 0) {
                                    items = null;
                                }
                            }
                        } else {
                            items = index !== null && selector[index] !== undefined ? [selector[index]] : null;
                        }
                        if (items !== null && items !== undefined) {
                            selector = [];
                            for (let i = items.length - 1; i > -1; --i) {
                                let sw = items[i].closest('.tf_swiper-slide');
                                if (sw !== null) {
                                    let wrapper = sw.closest('.tf_swiper-wrapper');
                                    if (wrapper !== null) {
                                        let swItems = wrapper.querySelectorAll('.tf_swiper-slide[data-swiper-slide-index="' + index + '"]'),
                                                len = swItems.length;
                                        if (len !== 0) {
                                            for (let j = len - 1; j > -1; --j) {
                                                for (let found = swItems[j].querySelectorAll(args.selector), k = found.length - 1; k > -1; --k) {
                                                    selector.push(found[k]);
                                                }
                                            }
                                        } else {
                                            selector.push(items[i]);
                                        }
                                    }
                                } else {
                                    selector.push(items[i]);
                                }
                            }

                        } else {
                            selector = null;
                        }
                    }
                }
                if ('refresh' === args.type || self._is_ajax === true) {
                    model.previewReload(self.settings, selector, val);
                } 
                else {
                    model.previewLive(self.settings, args.name === 'wp_editor' || el.tagName === 'TEXTAREA', selector, val);
                }
            } 
            else if (self.clicked === 'setting') {
                model.backendLivePreview(self.settings);
            }
        },
        change(el, args) {
            const event = args.event || 'change';
            let timout;
            el.tfOn(event, e => {
                let timer = 50,
                    target = e.target;
                if (e.type === 'change') {
                    timer = 1;
                } else if ('refresh' === args.type && args.selector === undefined) {
                    timer = 1000;
                }
                clearTimeout(timout);
                timout = setTimeout(() => {
                    if(target.isConnected){
                        let value = target.value;
                        if ('keyup' === e.type) {
                            if (value === target.dataset.oldValue) {
                                return;
                            } else {
                                target.dataset.oldValue = value;
                            }
                        }
                        if (target.nodeName === 'SELECT' && target.multiple) {
                            value = [];
                            for (let selected = target.selectedOptions, i = 0; i < selected.length; ++i) {
                                value.push(selected[ i ].value);
                            }
                        }
                        this.preview(target, value, args);
                    }
                    timout = null;
                }, timer);
            }, {passive: true});
        },
        wp_editor(el, args) {
            let that = this,
                    id = el.id,
                    previous = false,
                    interval,
                    is_widget = false,
                    callback = function () {
                        const content = typeof this.getContent === 'function' ? this.getContent() : this.value;
                        clearTimeout(interval);
                        if (api.activeModel === null || previous === content) {
                            return;
                        }
                        previous = content;
                        if (is_widget !== false) {
                            if (!args.id) {
                                const _id = this.id.split('_');
                                if (_id[1] && api.LightBox.el.querySelector('textarea.sync-input[name="' + _id[1] + '"]')) {
                                    args.id = _id[1];
                                }
                            }
                            if (args.id) {
                                const widgetText = api.LightBox.el.querySelector('textarea.sync-input[name="' + args.id + '"]');
                                if (widgetText && widgetText !== this) {
                                    widgetText.value = content;
                                    Themify.triggerEvent(widgetText, 'change');
                                    return;
                                }
                            }
                        }
                        if (!this.targetElm) {
                            if (typeof tinyMCE !== 'undefined') {
                                tinymce.get(this.id)?.setContent(content);
                            }
                            that.preview(this, content, args);
                        } else {
                            that.preview(this.targetElm, content, args);
                        }
                        interval = null;
                    },
                    messages = api.LightBox.el.querySelectorAll('.wrap > #message');

            /* change the ID on WP's #message element.
             * Patches an issue with Optin due to similar IDs
             */
            for (let i = messages.length - 1; i > -1; --i) {
                messages[i].id = 'wp-message';
            }
            // add quicktags
            if (typeof topWindow.QTags === 'function') {
                topWindow.quicktags({
                    id: id
                });
                topWindow.QTags._buttonsInit();
            }
            if (typeof tinyMCE !== 'undefined') {
                if (tinymce.editors[ id ] !== undefined) { // clear the prev editor
                    tinyMCE.execCommand('mceRemoveEditor', true, id);
                }
                const settings = tinyMCEPreInit.mceInit.tb_lb_hidden_editor;
                settings.target = ThemifyConstructor.getEl(id.replace('#', ''));
                // Creates a new editor instance
                const ed = new tinyMCE.Editor(id, settings, tinyMCE.EditorManager);
                is_widget = el.classList.contains('wp-editor-area') ? (el.closest('#instance_widget') !== null) : false;
                ed.render();
                ed.on('change', callback);
                if (!is_widget) {
                    ed.on('keyup', callback);
                }
            }
            el.tfOn('change keyup', callback, {passive: true});
        },
        layout(el, args) {
            if (api.isVisual) {
                el.tfOn('change', e=>{
                    let currentTarget=e.currentTarget,
                        selectedLayout = e.detail.val.toString();
                    if (selectedLayout.indexOf('grid-') === 0) {
                        selectedLayout = selectedLayout.replace('grid-', 'grid');
                    } else if (!isNaN(selectedLayout)) {
                        selectedLayout = 'grid' + selectedLayout;
                    }
                    if (args.classSelector !== undefined && selectedLayout !== 'auto_tiles') {
                        let id = args.id,
                            el=api.liveStylingInstance.el,
                                apllyTo = args.classSelector !== '' ? el.querySelector(args.classSelector) : el.tfClass('module')[0],
                                prevLayout = ThemifyConstructor.settings[id];
                        ThemifyConstructor.settings[id] = selectedLayout;
                        if (apllyTo) {
                            apllyTo = apllyTo.classList;
                            if (prevLayout) {
                                prevLayout = prevLayout.toString();
                                if (args.prefix) {
                                    prevLayout = args.prefix + prevLayout;
                                }
                                if (prevLayout.indexOf('grid-') === 0) {
                                    prevLayout = prevLayout.replace('grid-', 'grid');
                                } else if (!isNaN(prevLayout)) {
                                    prevLayout = 'grid' + prevLayout;
                                }
                                if (prevLayout === 'grid1') {
                                    prevLayout = 'list-post';
                                } else if (prevLayout === 'default') {
                                    prevLayout = 'tb_default_color';
                                }
                                apllyTo.remove(prevLayout);
                            }
                            if (selectedLayout) {
                                if (args.prefix) {
                                    selectedLayout = args.prefix + selectedLayout;
                                }
                                if (selectedLayout === 'grid1') {
                                    selectedLayout = 'list-post';
                                } else if (selectedLayout === 'default') {
                                    selectedLayout = 'tb_default_color';
                                }
                                apllyTo.add(selectedLayout);
                            }
                            api.Utils.runJs(el, 'module');
                        } else {
                            this.preview(currentTarget, selectedLayout, args);
                        }

                    } else {
                        this.preview(currentTarget, selectedLayout, args);
                    }
                }, {passive: true});
            }
        },
        icon(el, args) {
            el.tfOn('change', e=> {
                const target=e.target,
                    v = target.value,
                    prev = target.closest('.tb_field').tfClass('themify_fa_toggle')[0];
                if (prev !== undefined) {
                    prev.firstChild?.remove();
                    if (v) {
                        prev.appendChild(api.Helper.getIcon(v));
                    }
                }
                this.preview(target, v, args);
            }, {passive: true});
        },
        checkbox(el, args) {
            if (api.isVisual) {
                el.tfOn('change', e=> {
                    const current=e.currentTarget,
                        checked = [],
                        checkbox = current.closest('.tb_checkbox_wrap').tfClass('tb_checkbox');
                    for (let i = 0; i < checkbox.length; ++i) {
                        if (checkbox[i].checked) {
                            checked.push(checkbox[i].value);
                        }
                    }
                    this.preview(current, checked.join('|'), args);
                }, {passive: true});
            }
        },
        color(el, args) {
            if (api.isVisual) {
                el.tfOn('themify_builder_color_picker_change', e=>{
                    this.preview(e.currentTarget, e.detail.val, args);
                }, {passive: true});
            }
        },
        widget_select(el, args) {
            this.preview(el, api.Forms.serializeObject(el), args);
        },
        queryPosts(el, args) {
            if (api.isVisual) {
                el.tfOn('queryPosts', e=> {
                    const current=e.currentTarget;
                    args.id = current.id;
                    ThemifyConstructor.settings = api.Forms.serialize('tb_options_setting');
                    this.preview(current, ThemifyConstructor.settings[args.id], args);
                }, {passive: true});
            }
        },
        builderEdit(el,args){
            el.tfOn(_CLICK_, e=> {
                e.stopPropagation();
                api.activeModel?.builderContentEdit(e.currentTarget);
            },{passive:true});
        }
    },
    _initControl(el, data) {
        if (api.activeModel !== null) {
            if (this.clicked === 'setting' && data.type !== 'custom_css') {
                if (data.control !== false && this.component === 'module') {
                    const args = data.control || {};
                    let type = data.type;
                    if (args.repeat === true) {
                        args.id = el.dataset.inputId;
                    } else {
                        if (this.is_repeat === true) {
                            args.repeat = true;
                            args.id = el.dataset.inputId;
                        } else {
                            args.id = data.id;
                        }
                    }

                    if (args.control_type === undefined) {
                        if (type === undefined || type === 'text' || type === 'number' || type === 'taxonomy' || type === 'url' || type === 'autocomplete' || type === 'range' || type === 'radio' || type === 'icon_radio' || type === 'select' || type === 'gallery' || type === 'textarea' || type === 'address' || type === 'image' || type === 'file' || type === 'lottie' || type === 'date' || type === 'audio' || type === 'video' || type === 'widgetized_select' || type === 'layoutPart' || type === 'selectSearch' || type === 'hidden' || type === 'toggle_switch' || type === 'slider_range' || type === 'orderby_post') {
                            if (args.event === undefined && (type === 'text' || type === 'textarea')) {
                                args.event = 'keyup';
                            }
                            type = 'change';
                        }
                    } else {
                        type = args.control_type;
                    }
                    this.control.init(el, type, args);
                }
            } else if (api.isVisual && this.clicked === 'styling') {
                api.liveStylingInstance.bindEvents(el, data);
            }
            if (data.binding !== undefined) {
                const is_repeat = this.is_repeat === true,
                        callback = (_this, v) => {
                    const context = is_repeat ? el.closest('.tb_sort_field_dropdown,.tb_toggleable_fields_options,.tb_repeatable_field_content') : undefined;
                    this._binding(_this, data, v, context);
                };
                if (data.type === 'layout' || data.type === 'frame') {
                    el.tfOn(_CLICK_, function (e) {
                        const t = e.target.closest('.tfl-icon');
                        if (t !== null) {
                            callback(this, t.id);
                        }
                    }, {passive: true});
                } else {
                    el.tfOn('change', function () {
                        callback(this, this.value);
                    }, {passive: true});
                }
                this._bindings.push({el: el, data: data, repeat: is_repeat});
            }
        }
        return el;
    },
    callbacks() {
        const _this=this,
            {_bindings,_radioChange,afterRun}=_this;
        if (afterRun !== null) {
            for (let i = 0; i < afterRun.length; ++i) {
                afterRun[i].call();
            }
            _this.afterRun = [];
        }
        if (_radioChange !== null) {
            for (let i = 0; i < _radioChange.length; ++i) {
                _radioChange[i].call();
            }
            _this._radioChange = [];
        }
        if (_bindings !== null) {
            for (let i = _bindings.length - 1; i > -1; --i) {
                if (_bindings[i].data !== undefined) {
                    let el = _bindings[i].el,
                            context = _bindings[i].repeat === true ? el.closest('.tb_sort_field_dropdown,.tb_toggleable_fields_options,.tb_repeatable_field_content') : undefined,
                            v = _bindings[i].data.type === 'layout' || _bindings[i].data.type === 'frame' ? el.tfClass('selected')[0].id : el.value;
                    _this._binding(el, _bindings[i].data, v, context);
                }
            }
            _this._bindings = [];
        }
    },
    _setUpEditors() {
        if (this.clicked === 'setting') {
            const editors=this._editors;
            for (let i = editors.length - 1; i > -1; --i) {
                this._initControl(editors[i].el, editors[i].data);
            }
            this._editors = [];
        }
    },
    switchTabs() {
        const id = '#' + this.dataset.id,
                li = this.parentNode,
                p = li.parentNode,
                tabs = p.parentNode,
                tabId = id.replace('#tb_options_', '');

        let container = tabs.querySelector(id);
        if (!container || container.parentNode !== tabs) {
            container = this.getRootNode().querySelector(id);
        }
        if (!container || li.classList.contains('current')) {
            return;
        }
        const children = p.children,
                containerChildren = container.parentNode.children;
        for (let i = children.length - 1; i > -1; --i) {
            children[i].classList.remove('current');
        }
        li.classList.add('current');
        for (let i = containerChildren.length - 1; i > -1; --i) {
            if (containerChildren[i].classList.contains('tb_tab')) {
                containerChildren[i].style.display = 'none';
            }
        }
        container.style.display = 'block';
        Themify.trigger('tb_builder_tabsactive', [tabId, container]);
        Themify.triggerEvent(container, 'tb_builder_tabsactive', {id: tabId});

    },
    run(options) {
        let defaultTab,
            model = api.activeModel,
            _this=this;
        _this.styles = {};
        _this.settings = {};
        _this._editors = [];
        _this.afterRun = [];
        _this._radioChange = [];
        _this._bindings = [];
        _this._stylesData = {};
        _this.is_repeat = _this.is_sort =_this.component = _this.is_new = _this._is_ajax = _this.type = null;
        _this._options = options;
        if (model !== null) {
            _this.type = model.get('mod_name');
            _this.component = model.type;
            if (_this.component === 'module') {
                _this._is_ajax = model.getPreviewType() === 'ajax';
                _this.is_new = !!model.is_new;
            }
            _this.values = api.Helper.cloneObject(model.get('mod_settings'));
            defaultTab = model.tab || 'setting';
            delete model.tab;
            _this._options.visibility??= true;
            _this._options.animation??= true;
        } else {
            _this.values = {};
            _this.component = null;
        }
        const top_bar = createDocumentFragment(),
                container = createDocumentFragment(),
                tabIcons = {styling: 'ti-brush', animation: 'ti-layers-alt', visibility: 'ti-eye'},
                createTab = (index, options) => {

            const fr = createDocumentFragment();
            if (index === 'visibility' || index === 'animation') {
                options = _this.getOptions(index);
            } else if (index === 'styling' && api.LightBox.el.tfClass('tb_styling_tab_header')[0] === undefined) {
                const div = createElement('','tb_styling_tab_header'),
                    globalStylesHTML = api.GS.globalStylesHTML();
                div.appendChild(_this._getSwitcher());
                if (globalStylesHTML) {
                    div.appendChild(globalStylesHTML);
                }
                fr.appendChild(div);
            }
            // generate html output from the options
            fr.appendChild(_this.create(options));
            if (index === 'styling') {
                const reset = createElement('a',{href:'#',class:'reset-styling'}),
                        icon = createElement('i','tf_close');
                reset.tfOn(_CLICK_, e => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.resetStyling(api.activeModel);
                }).append(icon, createTextNode(i18n.reset_style));
                fr.appendChild(reset);
                if (api.isVisual && model) {
                    setTimeout(() => {
                        api.liveStylingInstance.module_rules = _this.styles;//by reference,will be fill when the option has been viewed
                    }, 600);
                }
            }
            options = null;
            return fr;
        },
        tabSwitch = function (e) {
            const index = e.detail.id.replace('#tb_options_', '');
            _this.clicked = index;
            if (this.dataset.done === undefined) {
                this.dataset.done = true;
                this.appendChild(createTab(index, _this._options[index].options));
                _this.callbacks();
                _this._setUpEditors();

                Themify.trigger('tb_editing_' + _this.type + '_' + index, api.LightBox.el);
            }
        };

        _this.clicked = null;
        for (let k in _this._options) {
            let item=_this._options[k];
            if (item === false) {
                continue;
            }
            //meneu
            let tab_id = 'tb_options_' + k,
                label = item.name !== undefined ? (i18n[item.name] || item.name) : i18n[k],
                li = createElement('li'),
                a = createElement('a',{href:'javascript:;','data-id':tab_id},label),
                tooltip = createElement('span'),
                wrapper = createElement('',{id:tab_id,class:'tb_tab tb_options_tab_wrapper tf_rel tf_box tf_w tf_hide'});

            if (k !== 'setting') {
                a.className = 'tb_tooltip';
                tooltip.textContent = label;
                if (tabIcons[k]) {
                    a.appendChild(api.Helper.getIcon(tabIcons[k]));
                }
                a.appendChild(tooltip);
            }
            if (defaultTab === k || defaultTab === undefined) {
                li.className = 'current';
                _this.clicked = k;
                if (item.html !== undefined) {
                    wrapper.innerHTML = item.html;
                } else {
                    wrapper.appendChild(createTab(k, item.options));
                }

                wrapper.style.display = 'block';
                wrapper.dataset.done = true;
            }
            wrapper.tfOn('tb_builder_tabsactive', tabSwitch, {passive: true});
            a.tfOn(_CLICK_, _this.switchTabs, {passive: true});
            container.appendChild(wrapper);
            li.appendChild(a);
            top_bar.appendChild(li);
        }
        const top = api.LightBox.el.tfClass('tb_options_tab')[0],
        changeMode = (prevbreakpoint, breakpoint) => {
            _this._updateStyles(prevbreakpoint, breakpoint);
        };
        top?.replaceChildren(top_bar);
        Themify.on('themify_builder_lightbox_close', () => {
            _this._radioChange = _this.afterRun = _this._bindings = _this._editors = [];
            _this._stylesData = _this.settings = _this.styles = {};
            _this._is_ajax = _this.is_repeat = _this.is_sort = _this.clicked = null;
            if (typeof tinyMCE !== 'undefined') {
                for (let i = tinymce.editors.length - 1; i > -1; --i) {
                    if (tinymce.editors[i].id !== 'content') {
                        tinyMCE.execCommand('mceRemoveEditor', true, tinymce.editors[i].id);
                    }
                }
            }
            Themify.off('themify_builder_change_mode', changeMode);
            _this.values = {};
            _this.tabs.click = 0;
            _this.tabs.styleClicked = false;
            model = _this.type = _this.component = _this.is_new = _this._options = _this=null;
        }, true)
        .on('themify_builder_change_mode', changeMode);

        setTimeout(() => {
            _this._setUpEditors();
            _this.callbacks();
            Themify.trigger('tb_editing_' + _this.type + '_' + _this.clicked, api.LightBox.el);
            /**
             * self.type is the module slug, trigger a separate event for all modules regardless of their slug
             */
            Themify.trigger('tb_editing_' + _this.component, api.LightBox.el);
        }, 5);

        return container;
    },
    getStyleVal(id, bp, vals) {
        let v = undefined;
        if (id !== undefined && id !== '' && api.activeModel !== null) {
            if (vals === undefined) {
                vals = this.values;
            }
            if (bp === undefined) {
                bp = api.activeBreakPoint;
            }
            if (bp === 'desktop' || this.clicked !== 'styling') {
                if (vals !== null && vals[id] !== '') {
                    v = vals[id];
                }
            } else {
                if (vals['breakpoint_' + bp] !== undefined && vals['breakpoint_' + bp][id] !== undefined && vals['breakpoint_' + bp][id] !== '') {
                    v = vals['breakpoint_' + bp][id];
                } else {
                    const points = this.breakpointsReverse;
                    for (let i = points.indexOf(bp) + 1; i < points.length; ++i) {
                        let _bp=points[i];
                        if (points[i] !== 'desktop') {
                            if (vals['breakpoint_' + _bp] !== undefined && vals['breakpoint_' + _bp][id] !== undefined && vals['breakpoint_' + _bp][id] !== '') {
                                v = vals['breakpoint_' + _bp][id];
                                break;
                            }
                        } else if (vals[id] !== undefined && vals[id] !== '') {
                            // Check for responsive disable
                            let binding_data = this._stylesData?.[id]?.binding;
                            if (binding_data?.[vals[id]]?.responsive?.disabled?.includes(id)) {
                                v = undefined;
                            } else {
                                v = vals[id];
                            }
                            break;
                        }
                    }
                }
            }
            if ((v === undefined || v === '') && id.endsWith('_unit') && id.indexOf('lightbox_')!==0 && !id.includes('frame_')) {//because in the very old version, px wasn't saved and we can't detect after removing it was px value or not
                v = 'px';
            }
            //for columns it can be "value1,value2" where "value1" is value for v5, "value2" is for v7
            else if (v !== undefined && v !== '' && api.activeModel.type === 'column' && v.toString().includes(',') && (id.indexOf('padding') === 0 || id.includes('margin'))) {
                v = v.trim().split(',');
                if (v[1] !== undefined && v[1] !== '') {
                    v = v[1];
                } else {
                    v = v[0];
                }
                v = v.trim();
            }
        }
        return v;
    },
    _updateStyles(prevbreakpoint, breakpoint) {
        this.setStylingValues(prevbreakpoint);
        const old_tab = this.clicked;
        this.clicked = 'styling';
        for (let k in this._stylesData) {
            let el = this._stylesData[k],
                    type = el.type;
            if (type && type !== 'video' && type !== 'gallery' && type !== 'autocomplete' && type !== 'custom_css' && type !== 'builder' && el.is_responsive !== false) {
                if (type === 'icon_radio') {
                    type = 'radio';
                } else if (type === 'icon_checkbox') {
                    type = 'checkbox';
                } else if (type === 'textarea' || type === 'icon' || type === 'hidden' || type === 'number') {
                    type = 'text';
                } else if (type === 'image') {
                    type = 'mediaFile';
                } else if (type === 'padding' || type === 'border_radius') {
                    type = 'margin';
                } else if (type === 'frame') {
                    type = 'layout';
                }
                let v = this.getStyleVal(k);
                this[type].update(k, v, this,prevbreakpoint,breakpoint);
                if (el.binding !== undefined) {
                    let items = this.getEl(k),
                            res = [];
                    if (type === 'layout') {
                        res = items.tfClass('tfl-icon');
                    } else if (type === 'radio' || type === 'checkbox') {
                        res = items.tfTag('input');
                    } else {
                        res = [items];
                    }
                    for (let i = 0, len = res.length; i < len; ++i) {
                        this._binding(res[i], el, v);
                    }
                }
            }
        }
        //Disable responsive disable options
        const disabled_options = api.LightBox.el.querySelectorAll('#tb_options_styling option.tb_responsive_disable');
        for (let j = disabled_options.length - 1; j >= 0; j--) {
            disabled_options[j].disabled = 'desktop' !== breakpoint;
        }
        this.clicked = old_tab;
    },
    setStylingValues(breakpoint) {
        const data = api.Forms.serialize('tb_options_styling', true),
                isDesktop = breakpoint === 'desktop';
        if (isDesktop === false && this.values['breakpoint_' + breakpoint] === undefined) {
            this.values['breakpoint_' + breakpoint] = {};
        }
        for (let i in data) {
            if (isDesktop === true) {
                this.values[i] = data[i];
            } 
            else {
                this.values['breakpoint_' + breakpoint][i] = data[i];
            }
        }
    },
    async resetStyling(model) {
        const type = model.get('mod_name');
        // Reset GS
        if (api.isGSPage === false && api.GS.activeGS === null) {

            if (model.id === api.activeModel?.id) {
                const field = this.getEl(api.GS.key);
                if (field && field.value) {
                    const vals = field.value.split(' '),
                            bar = field.parentNode.querySelector('tb-gs');
                    for (let i = vals.length - 1; i > -1; --i) {
                        bar.delete(vals[i]);
                    }
                }
            } else {
                await api.GS.setGsStyle([], true, model);
            }

        }
        if (api.isVisual) {
            let live = api.liveStylingInstance;
            if (!live || live.el !== model.el) {
                live = api.createStyleInstance();
                live.init(true, false, model);
            }
            const prefix = live.prefix,
                    points = this.breakpointsReverse;
            for (let i = points.length - 1; i > -1; --i) {
                let stylesheet = ThemifyStyles.getSheet(points[i], api.GS.activeGS !== null),
                        rules = stylesheet.cssRules || stylesheet.rules;
                if (rules.length > 0) {
                    for (let j = rules.length - 1; j > -1; --j) {
                        if (rules[j].selectorText.includes(prefix)) {
                            let css = rules[j].cssText.split('{')[1].split(';');

                            for (let k = css.length - 2; k > -1; --k) {
                                let prop = css[k].trim().split(': ')[0].trim();
                                if (rules[j].style[prop] !== undefined) {
                                    rules[j].style[prop] = '';
                                }
                            }
                        }
                    }
                }
            }
            if (model.type !== 'module') {
                live.removeBgSlider();
                live.removeBgVideo();
                live.removeFrames();
                live.bindBackgroundMode('repeat', 'background_repeat');
                live.bindBackgroundMode('repeat', 'b_r_h');
                live.el.removeAttribute('data-tb_slider_videos');
                live.el.querySelector(':scope>.tb_slider_videos')?.remove();
                live.getComponentBgOverlay(type)?.remove();
            }
            live = null;
        }

        const styleFields = ThemifyStyles.getStyleOptions(type),
                values = model.id === api.activeModel?.id ? this.values : model.get('styling');

        for (let i in values) {
            let key = i.includes('_color') ? 'color' : (i.includes('_style') ? 'style' : false),
                    remove = null;
            if (i.indexOf('breakpoint_') === 0 || i === api.GS.key || styleFields[i] !== undefined || i.includes('_apply_all')) {
                remove = true;
            } else if (i.includes('_unit')) {//unit
                key = i.replace(/_unit$/ig, '', '');
                if (styleFields[key] !== undefined) {
                    remove = true;
                }
            } else if (i.includes('_w')) {//weight
                key = i.replace(/_w$/ig, '', '');
                if (styleFields[key] !== undefined && styleFields[key].type === 'font_select') {
                    remove = true;
                }
            } else if (key !== false) {
                key = i.replace('_' + key, '_width');
                if (styleFields[key] !== undefined && styleFields[key].type === 'border') {
                    remove = true;
                }
            }
            if (remove === true) {
                delete values[i];
            }
        }
        if (model.id === api.activeModel?.id) {
            const tabId = 'styling',
                    container = this.getEl('tb_options_' + tabId);
            if (container) {
                for (let childs = container.children, i = childs.length - 1; i > -1; --i) {
                    if (!childs[i].classList.contains('tb_styling_tab_header')) {
                        childs[i].remove();
                    }
                }
                container.removeAttribute('data-done');
                Themify.triggerEvent(container, 'tb_builder_tabsactive', {id: tabId});
            }
        }
    },
    create(data) {
        const content = createDocumentFragment();
        if (data === undefined || data.length === 0) {
            const info = createElement(),
                    infoText = createElement('p','',i18n.no_op_module);
            info.appendChild(infoText);
            content.appendChild(info);
            return content;
        }
        if (data.type === 'tabs') {
            content.appendChild(this.tabs.render(data, this));
        } else {
            for (let i in data) {
                let item=data[i];
                if (item.hide === true || item.type === undefined || ('visibility' === this.clicked && 'row' === this.component && 'sticky_visibility' === item.id)) {
                    continue;
                }
                let type = item.type,
                        res = this[type].render(item, this);
                if (res !== false && type !== 'separator' && type !== 'expand' && type !== 'group') {
                    let id = item.id || item.topId;
                    if (type !== 'tabs' && type !== 'multi' && type !== 'margin_opposity') {
                        if (id) {
                            if (this.clicked === 'styling') {
                                if (api.isVisual && item.prop !== undefined) {
                                    this.styles[id] = api.Helper.cloneObject(item);
                                }
                                this._stylesData[id] = api.Helper.cloneObject(item);
                            } 
                            else if (this.clicked === 'setting' && this.values !== null && this.values[id] !== undefined && this.is_repeat !== true) {
                                this.settings[id] = this.values[item.id];
                                if (item.units !== undefined && this.values[id + '_unit'] !== undefined) {
                                    this.settings[id + '_unit'] = this.values[id + '_unit'];
                                }
                            }
                        }
                    }
                    if (type !== 'hook_content' && type !== 'slider' && type !== 'builder' && type !== 'tooltip' && type !== 'custom_css_id') {
                        let fieldCl='tb_field',
                            fieldData={'data-type':type};
                        if (item.dc !== undefined && !item.dc) {
                            fieldCl += ' tb_disable_dc';
                        }
                        if (id !== undefined) {
                            fieldCl += ' ' + id;
                        }
                        if (item.wrap_class !== undefined) {
                            fieldCl += ' ' + item.wrap_class;
                        }
                        if (type === 'toggle_switch') {
                            fieldCl += ' switch-wrapper';
                        } else if (type === 'slider') {
                            fieldCl += ' tb_slider_options';
                        } else if (type === 'message' && item.hideIf !== undefined && new Function('return ' + item.hideIf)) {
                            fieldCl += ' tb_hide_option';
                        } else if (item.required !== undefined && this.clicked === 'setting') {// validation rules
                            fieldData['data-validation'] = item.required.rule || 'not_empty';
                            let msg = item.required.message;
                            fieldData['data-error-msg'] = msg !== undefined ? (i18n[msg] || msg) : 'not_empty';
                            fieldCl += ' tb_must_validate';
                        }
                        if (this.clicked === 'styling' && item.is_responsive === false) {
                            fieldCl += ' tb_responsive_disable';
                        }
                        fieldData.class=fieldCl;
                        let txt = this._getTitle(item),
                            field = createElement('',fieldData);
                        if (txt !== false) {
                            txt = txt.trim();
                            let label = createElement('','tb_label',txt);
                            if (txt === '') {
                                label.className += ' tb_empty_label';
                            }
                            if (item.help !== undefined && item.label !== '') {
                                label.className += ' contains-help';
                                label.appendChild(this.help(item.help));
                            }
                            field.appendChild(label);
                            if (type !== 'multi') {
                                let input = createElement('','tb_input');
                                input.appendChild(res);
                                field.appendChild(input);
                            } else {
                                field.appendChild(res);
                            }
                        } else {
                            field.appendChild(res);
                        }
                        content.appendChild(field);
                    } else {
                        content.appendChild(res);
                    }
                } else if (res !== false) {
                    content.appendChild(res);
                }
            }
        }
        data = null;
        return content;
    },
    tabs: {
        click: 0,
        styleClicked: false,
        render(data, self) {
            const items = data.options,
                tabs_container = createDocumentFragment(),
                nav = createElement('ul', 'tb_tab_nav tf_scrollbar'),
                isStylingTab=self.clicked === 'styling',
                stickyWraper = (isStylingTab && this.styleClicked === false && self.component === 'module') ? createElement('','tb_styling_tab_nav') : null,
                tabs = createElement('','tb_tabs tf_rel tf_w'),
                isRadio = data.isRadio !== undefined;
            let v = null,
                    first = null;
            if (data.class) {
                tabs.className += ' ' + data.class;
            }
            if (isStylingTab) {
                this.styleClicked = true;
            }
            ++this.click;


            if (isRadio === true) {
                v = self.getStyleVal(data.id)??data.default;
                if (v !== undefined) {
                    first = true;
                }
                nav.className += ' tb_radio_wrap';
                if (self.is_repeat === true) {
                    nav.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                    nav.dataset.inputId = data.id;
                } else {
                    nav.className += ' tb_lb_option';
                    nav.id = data.id;
                }
                if(isStylingTab && api.isVisual){
                    self.styles[data.id] = {prop: data.prop, selector: data.selector};
                }
            }
            for (let k in items) {
                let item=items[k],
                    id = item.href || ('tb_' + this.click + '_' + k),
                    li = createElement('li'),
                    a = createElement(isRadio === true?'label':'a',{'data-id':id,class:(item.class || '')}),
                    div = createElement('',{id:id,class: 'tb_tab tf_hide'}),
                    opt = item.options || item;

                if (item.label !== '') {
                    a.textContent = i18n[item.label]??item.label??i18n[k];
                }
                if (item.icon !== undefined) {
                    a.appendChild(api.Helper.getIcon(item.icon));
                }
                if (item.title !== undefined) {
                    a.title = item.title;
                }
                if (isRadio === true) {
                    let input = createElement('input',{type:'radio',class:'tb_radio_tab_input',name:data.id,value:k});
                    if (v === k || v === 'tb_' + k) {
                        input.checked = true;
                    }
                    a.className = 'tb_radio_tab_label';
                    a.tfOn('change', self.switchTabs, {passive: true})
                    .appendChild(input);
                    if(isStylingTab && api.isVisual){
                        self._initControl(input, {...data,type:'radio'});
                    }
                } 
                else {
                    a.tfOn(_CLICK_, self.switchTabs, {passive: true})
                    .href = 'javascript:;';
                }
                if (first === null || v === k || v === 'tb_' + k) {
                    first = true;
                    li.className = 'current';
                    div.appendChild(self.create(opt));
                    opt = null;
                    div.style.display = 'block';

                } else {
                    div.tfOn('tb_builder_tabsactive', function () {
                        this.appendChild(self.create(opt));
                        self._setUpEditors();
                        self.callbacks();
                        opt = null;
                    }, {once: true, passive: true});
                }

                li.appendChild(a);
                nav.appendChild(li);
                tabs_container.appendChild(div);
            }
            if (stickyWraper !== null && self._options?.styling?.options?.type==='tabs') {
                stickyWraper.appendChild(nav);
                tabs.appendChild(stickyWraper);
            } else {
                tabs.appendChild(nav);
            }
            tabs.appendChild(tabs_container);
            setTimeout(self.callbacks.bind(self), 5);
            return tabs;
        }
    },
    group: {
        render(data, self) {
            const wr = createElement(),
                    label = createElement(),
                    f = createDocumentFragment(),
                    options = self.create(data.options);
            if (data.label !== undefined) {
                label.textContent = i18n[data.label] || data.label;
            }
            if (data.wrap_class !== undefined) {
                wr.className = data.wrap_class;
            }
            wr.classList.add('tb_field_group');
            if (data.id) {
                wr.classList.add(data.id);
            }
            if (data.display === 'accordion') {
                wr.classList.add('tb_field_group_acc');
                const content = createElement('','tf_hide tb_field_group_content'),
                        icon = api.Helper.getIcon('ti-angle-up');
                label.className = 'tb_style_toggle tb_closed';
                label.appendChild(icon);
                content.appendChild(options);
                label.tfOn(_CLICK_, () => {
                    $(content).slideToggle();
                    label.classList.toggle('tb_closed');
                });
                wr.append(label, content);
            } else {
                if (data.label !== undefined) {
                    label.className = 'tb_label';
                    if (data.help !== undefined && data.label !== '') {
                        label.className += +' contains-help';
                        label.appendChild(this.help(data.help));
                    }
                    f.appendChild(label);
                }
                wr.appendChild(options);
            }
            f.appendChild(wr);
            return f;
        }
    },
    builder: {
        render(data, self) {
            const fr = createDocumentFragment(),
                    wrapper = createElement('',{class:'tb_row_js_wrapper tf_rel tb_lb_option',id:data.id}),
                    add_new = createElement('button',{class:'add_new tf_plus_icon tf_icon_btn tf_rel',type:'button'},i18n[ data.new_row ] || i18n.new_row),
                    _this = this,
                    origRepeat = self.is_repeat === true;
            if (data.wrap_class !== undefined) {
                wrapper.className += ' ' + data.wrap_class;
            }
            self.is_repeat = true;
            if (self.values[data.id] !== undefined) {
                const values = self.values[data.id].slice(),
                        orig = api.Helper.cloneObject(self.values);
                for (let i = 0; i < values.length; ++i) {
                    self.values = values[i] || {};
                    wrapper.appendChild(this._builderFields(data, self));
                }
                self.values = orig;
            } else {
                wrapper.appendChild(this._builderFields(data, self));
            }
            wrapper.appendChild(add_new);
            fr.appendChild(wrapper);
            setTimeout(() => {
                _this._sortable(wrapper, self);
                add_new.tfOn(_CLICK_, function (e) {
                    e.stopPropagation();
                    const isRepeat = self.is_repeat === true,
                            orig = api.Helper.cloneObject(self.values),
                            container = this.parentNode;
                    self.is_repeat = true;
                    self.values = api.activeModel.getPreviewSettings?(api.activeModel.getPreviewSettings()?.[container.id]?.[0] || {}):{};
                    const item = _this._builderFields(data, self);
                    this.before(item);
                    api.activeModel.addRow?.(item);
                    setTimeout(() => {
                        self._setUpEditors();
                        self.callbacks();
                        Themify.trigger('tb_repeatable_add_new', item);
                        Themify.triggerEvent(container, 'added');
                    }, 5);
                    self.control.preview(container, null, {repeat: true});
                    self.is_repeat = isRepeat;
                    self.values = orig;
                }, {passive: true});
            }, 1500);
            self.is_repeat = origRepeat;
            return fr;
        },
        _builderFields(data, self) {
            const _this = this,
                repeat = createElement('','tb_repeatable_field'),
                top = createElement('','tb_repeatable_field_top tf_rel tf_box tf_textl'),
                menu = createElement('', 'row_menu'),
                icon = createElement('',{class:'menu_icon',tabindex:-1}),
                ul = createElement('ul','tb_down'),
                _duplicate = createElement('li','tb_duplicate_row',i18n.duplicate),
                _delete = createElement('li','tb_delete_row tf_close',i18n.delete),
                toggle = createElement('','tb_arrow tb_toggle_row'),
                content = createElement('','tb_repeatable_field_content'),
                up = createElement('',{class:'tb_arrow tb_up_row',title:i18n.up}),
                down = createElement('',{class:'tb_arrow tb_down_row',title:i18n.down});

            content.appendChild(self.create(data.options));
            ul.append(_duplicate, _delete);
            menu.append(icon, ul);
            top.append(menu, up, down, toggle);
            repeat.append(top, content);
            top.tfOn(_CLICK_, function (e) {
                const target = e.target,
                    cl = target.classList,
                        repeatContainer = this.parentNode;
                if (cl.contains('tb_delete_row')) {
                    const p = target.closest('.tb_row_js_wrapper');
                    _this._delete(target, p);
                    self.control.preview(p, null, {repeat: true});
                } 
                else if (cl.contains('tb_duplicate_row')) {
                    const orig = api.Helper.cloneObject(self.values),
                            isRepeat = self.is_repeat === true;
                    self.is_repeat = true;
                    self.values = api.Forms.serialize(repeatContainer, true, true);
                    api.activeModel.duplicateRow?.(self.values, orig, repeatContainer);
                    const item = _this._builderFields(data, self);
                    repeatContainer.after(item);
                    self.values = orig;
                    setTimeout(() => {
                        self._setUpEditors();
                        self.callbacks();
                        setTimeout(() => {
                            Themify.triggerEvent(repeatContainer.parentNode, 'duplicate');
                            Themify.trigger('tb_repeatable_duplicate', item);
                            self.control.preview(repeatContainer, null, {repeat: true});
                            self.is_repeat = isRepeat;
                        }, 5);
                    }, 5);
                } else if (cl.contains('tb_toggle_row')) {
                    _this._toggle(target);
                } else if (cl.contains('tb_arrow')) {
                    _this._move(target, self);
                }
            }, {passive: true});

            return repeat;
        },
        _sortable(el, self) {
            el.tfOn('pointerdown', function (e) {
                if (e.button === 0 && e.target.classList.contains('tb_repeatable_field_top')) {
                    e.stopImmediatePropagation();
                    let timer,
                            timeout,
                            theLast,
                            dir,
                            toggleCollapse,
                            prevY = 0,
                            holder,
                            holderHeight,
                            scrollbar,
                            editors = {},
                            doc = this.ownerDocument,
                            item = e.target.closest('.tb_repeatable_field'),
                            index,
                            viewMin,
                            viewMax,
                            parentHeight,
                            isWorking = false,
                            parentNode;
                    const scrollDrag = y => {
                        if (!scrollbar) {
                            return;
                        }
                        if (y >= viewMax || y <= viewMin) {
                            if (isWorking === false) {
                                isWorking = true;
                                const k = ~~(viewMax / 10);
                                scrollbar.scrollTop += y <= viewMin ? (-1) * k : k;
                                clearTimeout(timeout);
                                timeout = setTimeout(() => {
                                    requestAnimationFrame(() => {
                                        if (isWorking) {
                                            isWorking = false;
                                            scrollDrag(y);
                                        }
                                    });
                                }, k * 2);
                            }
                        } else {
                            clearTimeout(timeout);
                            isWorking = false;
                        }
                    },
                            move = e => {
                                e.stopImmediatePropagation();
                                timer = requestAnimationFrame(() => {
                                    if (!doc) {
                                        return;
                                    }
                                    const {clientX:x,clientY:y} = e,
                                            moveTo = e.type === 'mousemove' ? e.target : doc.elementFromPoint(x, y),
                                            clientY = y - holderHeight - parentNode.getBoundingClientRect().top;
                                    if (clientY > 0 && clientY < parentHeight) {
                                        holder.style.transform = 'translateY(' + clientY + 'px)';
                                        scrollDrag(y);
                                        if (y >= viewMax || y <= viewMin) {
                                            return;
                                        }
                                        if (moveTo !== item && moveTo?.classList.contains('tb_repeatable_field')) {
                                            const side = y > prevY ? 'bottom' : 'top';
                                            if (dir !== side || theLast !== moveTo) {
                                                side === 'bottom' ? moveTo.after(item) : moveTo.before(item);
                                            }
                                            theLast = moveTo;
                                            dir = side;
                                        }
                                        prevY = y;
                                    } else {
                                        scrollDrag(y);
                                    }
                                });
                            },
                            start = () => {
                        topBodyCl.add('tb_start_animate', 'tb_move_drag');
                        parentNode = item.parentNode;
                        parentNode.classList.add('tb_sort_start');
                        if (typeof tinyMCE !== 'undefined') {
                            const items = parentNode.tfClass('tb_lb_wp_editor');
                            for (let i = items.length - 1; i > -1; --i) {
                                let id = items[i].id;
                                editors[id] = tinymce.get(id).getContent();
                                tinyMCE.execCommand('mceRemoveEditor', false, id);
                            }
                        }
                        index = Themify.convert(parentNode.children).indexOf(item);
                        if (!item.classList.contains('collapsed')) {
                            item.tfClass('tb_repeatable_field_content')[0].style.display = 'none';
                            item.classList.add('collapsed');
                            toggleCollapse = true;
                        }
                        holder = item.cloneNode(true);
                        holder.tfClass('tb_repeatable_field_content')[0].remove();
                        scrollbar = item.closest('.tf_scrollbar');
                        holder.className += ' tb_sort_handler';
                        item.classList.add('tb_current_sort');
                        item.after(holder);
                        holderHeight = holder.getBoundingClientRect().height / 2;
                        parentHeight = parentNode.offsetHeight;
                        const box = scrollbar.getBoundingClientRect();
                        viewMin = box.top;
                        viewMax = box.bottom - 40;
                    },
                            up = function (e) {
                                this.tfOff('pointermove', start, {passive: true, once: true})
                                        .tfOff('pointermove', move, {passive: true})
                                        .tfOff('lostpointercapture pointerup', up, {passive: true, once: true});
                                if (parentNode) {
                                    e.stopImmediatePropagation();
                                    cancelAnimationFrame(timer);
                                    clearTimeout(timeout);
                                    holder?.remove();
                                    if (typeof tinyMCE !== 'undefined') {
                                        for (let id in editors) {
                                            tinyMCE.execCommand('mceAddEditor', false, id);
                                            tinymce.get(id).setContent(editors[id]);
                                        }
                                    }
                                    item.classList.remove('tb_current_sort');
                                    if (toggleCollapse) {
                                        item.classList.remove('collapsed');
                                        item.tfClass('tb_repeatable_field_content')[0].style.display = '';
                                    }
                                    const newIndex = Themify.convert(parentNode.children).indexOf(item);
                                    if (index !== newIndex) {
                                        api.activeModel.sortRow?.(item, index, newIndex);
                                    }
                                    requestAnimationFrame(() => {
                                        if (index !== newIndex) {
                                            self.control.preview(parentNode, null, {repeat: true});
                                            Themify.triggerEvent(parentNode, 'sortable');
                                        }
                                        parentNode.classList.remove('tb_sort_start');
                                        parentNode = null;
                                    });
                                }
                                topBodyCl.remove('tb_start_animate', 'tb_move_drag');
                                theLast = holder = toggleCollapse = dir = index = prevY = editors = scrollbar = doc = parentHeight = holderHeight = isWorking = viewMin = viewMax = item = timer = timeout = null;
                            };
                    this.tfOn('lostpointercapture pointerup', up, {passive: true, once: true})
                            .tfOn('pointermove', start, {passive: true, once: true})
                            .tfOn('pointermove', move, {passive: true})
                            .setPointerCapture(e.pointerId);
                }
            }, {passive: true});
        },
        _move(el, self) {
            const r = el.closest('.tb_repeatable_field'),
                    dir = el.classList.contains('tb_up_row') ? 'top' : 'bottom',
                    next = dir === 'bottom' ? r.nextElementSibling : r.previousElementSibling,
                    p = r.parentNode,
                    index = Themify.convert(p.children).indexOf(r);
            dir === 'bottom' ? next.after(r) : next.before(r);
            api.activeModel.sortRow?.(r, index, Themify.convert(p.children).indexOf(r));
            requestAnimationFrame(() => {
                p.closest('.tf_scrollbar').scroll({
                    top: r.offsetTop + p.offsetTop + 10
                });
                self.control.preview(p, null, {repeat: true});
                Themify.triggerEvent(p, 'sortable');
            });
        },
        _toggle(el) {
            $(el).closest('.tb_repeatable_field').toggleClass('collapsed').find('.tb_repeatable_field_content').slideToggle();
        },
        _delete(el, p) {
            const item = el.closest('.tb_repeatable_field');
            api.activeModel.deleteRow?.(item, p);
            Themify.trigger('tb_repeatable_delete', item);
            item.remove();
            Themify.triggerEvent(p, 'delete');
        }
    },
    accordion: {
        _expand(item, data, self) {
            item.tfOn(_CLICK_, function (e) {
                let wrap = this.tfClass('tb_accordion_fields_options')[0];
                if (wrap === undefined) {
                    wrap =createElement('','tb_toggleable_fields_options tb_accordion_fields_options tf_w');
                    wrap.style.display = 'none';
                    self.is_repeat = true;
                    let orig = null;
                    const pid = this.parentNode.closest('.tb_accordion_fields').id,
                            id = this.dataset.id;
                    if (self.values[pid]?.[id]?.val !== undefined) {
                        orig = api.Helper.cloneObject(self.values);
                        self.values = self.values[pid][id].val;
                    }
                    wrap.appendChild(self.create(data.options));
                    this.appendChild(wrap);
                    self._setUpEditors();
                    self.callbacks();
                    if (orig !== null) {
                        self.values = orig;
                    }
                    self.is_repeat = orig = null;
                } else if (wrap.contains(e.target)) {
                    return;
                }
                e.stopPropagation();
                e.preventDefault();
                if (this.classList.contains('tb_closed')) {
                    $(wrap).slideDown(function () {
                        this.parentNode.classList.remove('tb_closed');
                    });
                } else {
                    $(wrap).slideUp(function () {
                        this.parentNode.classList.add('tb_closed');
                    });
                }
            });
        },
        _resetMotion(item, self) {
            if (self.values.motion_effects !== undefined) {
                for (let prop in self.values.motion_effects) {
                    self.values.motion_effects[prop].val = {[prop + '_dir']: ''};
                }
            }
            const tab = item.parentNode.querySelector('#motion_effects'),
                    select = tab.tfTag('select'),
                    boxes = tab.tfClass('tb_position_box_wrapper'),
                    sliders = tab.tfClass('tb_slider_wrapper'),
                    ranges = tab.tfClass('tb_range');
            for (let i = select.length - 1; i > -1; --i) {
                select[i].selectedIndex = 0;
                Themify.triggerEvent(select[i], 'change');
            }
            for (let i = ranges.length - 1; i > -1; --i) {
                ranges[i].value = ranges[i].min ??'';
            }
            for (let i = boxes.length - 1; i > -1; --i) {
                boxes[i].tfTag('input')[0].value = '50,50';
                boxes[i].tfClass('tb_position_box_handle')[0].removeAttribute('style');
            }
            for (let i = sliders.length - 1; i > -1; --i) {
                let input = sliders[i].querySelector('input[type="hidden"]'),
                        range = sliders[i].querySelectorAll('input[type="range"]');
                if (range[1]) {
                    range[0].value = range[0].max;
                    range[1].value = range[0].min;
                    Themify.triggerEvent(range[1], 'input');
                } else {
                    range[0].value = range[0].min;
                }
                Themify.triggerEvent(range[0], 'input');
                requestAnimationFrame(() => {
                    input.value = '';
                });
            }
        },
        render(data, self) {
            const ul = createElement('ul',{class: 'tb_toggleable_fields tb_accordion_fields tb_lb_option',id:data.id}),
                    fr = createDocumentFragment(),
                    vals=self.values;
            if (data.id === 'motion_effects' && vals) {
                if (vals.hasOwnProperty('custom_parallax_scroll_speed')) {
                    if (!vals.hasOwnProperty('motion_effects')) {
                        vals.motion_effects = {
                            v: {
                                val: {
                                    v_speed: vals.custom_parallax_scroll_speed,
                                    v_dir: ''
                                }
                            },
                            h: {val: {}},
                            t: {val: {
                                    t_speed: ''
                                }},
                            r: {val: {}},
                            s: {val: {}}
                        };
                        delete vals.custom_parallax_scroll_speed;
                    }
                    if (vals.hasOwnProperty('custom_parallax_scroll_reverse')) {
                        vals.motion_effects.v.val.v_dir = 'down';
                        delete vals.custom_parallax_scroll_reverse;
                    } else {
                        vals.motion_effects.v.val.v_dir = 'up';
                    }
                    if (vals.hasOwnProperty('custom_parallax_scroll_fade')) {
                        vals.motion_effects.t.val.t_speed = vals.custom_parallax_scroll_speed;
                        delete vals.custom_parallax_scroll_fade;
                    }
                }
            }
            const opt = vals[data.id],
                create = (id, item) => {
                    const label = data.options[id].label,
                        li = createElement('li',{class:'tb_closed','data-id':id}),
                        input = createElement('input',{type:'hidden'}),
                        title = createElement('','tb_toggleable_fields_title tb_accordion_fields_title tf_plus_icon tf_rel',!label ? i18n[id] : (i18n[label] || label));
                    input.value = item.val !== undefined?JSON.stringify(item.val):'';
                    li.append(input, title);
                    this._expand(li, data.options[id], self);
                    ul.appendChild(li);
            };
            if (opt !== undefined) {
                for (let id in opt) {
                    if (data.options[id] !== undefined) {
                        create(id, opt[id]);
                    }
                }
            }
            for (let id in data.options) {
                if (opt === undefined || opt[id] === undefined) {
                    create(id, data.options[id]);
                }
            }

            fr.appendChild(ul);
            if (data.id === 'motion_effects') {
                const resetEf = createElement('a',{class:'tb_motion_reset_link',href:'#'},i18n.reset_effect);
                resetEf.tfOn(_CLICK_, e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this._resetMotion(e.currentTarget, self);
                });
                fr.appendChild(resetEf);
            }
            return fr;
        }
    },
    toggleable_fields: {
        _sort(el, self) {
            if (el.childElementCount < 2) {
                return;
            }
            el.tfOn('pointerdown', function (e) {
                if (e.button === 0 && (e.target.parentNode === this || e.target.parentNode.parentNode === this)) {
                    e.stopImmediatePropagation();
                    let timeout,
                            theLast,
                            dir,
                            toggleCollapse,
                            prevY = 0,
                            holder,
                            holderHeight,
                            scrollbar,
                            editors = {},
                            doc = this.ownerDocument,
                            item = e.target.closest('.tb_toggleable_item'),
                            viewMin,
                            viewMax,
                            parentHeight,
                            isWorking = false,
                            clone,
                            parentNode = item.parentNode;
                    const scrollDrag = y => {
                        if (!scrollbar) {
                            return;
                        }
                        if (y >= viewMax || y <= viewMin) {
                            if (isWorking === false) {
                                isWorking = true;
                                const k = ~~(viewMax / 10);
                                scrollbar.scrollTop += y <= viewMin ? -1 * k : k;
                                clearTimeout(timeout);
                                timeout = setTimeout(() => {
                                    requestAnimationFrame(() => {
                                        if (isWorking) {
                                            isWorking = false;
                                            scrollDrag(y);
                                        }
                                    });
                                }, k * 2);
                            }
                        } else {
                            clearTimeout(timeout);
                            isWorking = false;
                        }
                    },
                            move = e => {
                                e.stopImmediatePropagation();
                                if (!doc) {
                                    return;
                                }
                                const x = e.clientX,
                                        y = e.clientY,
                                        moveTo = doc.elementFromPoint(x, y),
                                        clientY = y - holderHeight - parentNode.getBoundingClientRect().top;
                                if (clientY > 0 && clientY < parentHeight) {
                                    holder.style.transform = 'translateY(' + clientY + 'px)';
                                    scrollDrag(y);
                                    if (y >= viewMax || y <= viewMin) {
                                        return;
                                    }
                                    if (moveTo !== item && moveTo?.classList.contains('tb_toggleable_item')) {
                                        const side = y > prevY ? 'bottom' : 'top';
                                        if (dir !== side || theLast !== moveTo) {
                                            side === 'bottom' ? moveTo.after(clone) : moveTo.before(clone);
                                        }
                                        theLast = moveTo;
                                        dir = side;
                                    }
                                    prevY = y;
                                } else {
                                    scrollDrag(y);
                                }
                            },
                            start = function () {
                                topBodyCl.add('tb_start_animate', 'tb_move_drag');
                                parentNode.classList.add('tb_sort_start');
                                if (typeof tinyMCE !== 'undefined') {
                                    const items = parentNode.tfClass('tb_lb_wp_editor');
                                    for (let i = items.length - 1; i > -1; --i) {
                                        let id = items[i].id;
                                        editors[id] = tinymce.get(id).getContent();
                                        tinyMCE.execCommand('mceRemoveEditor', false, id);
                                    }
                                }
                                if (!this.classList.contains('tb_closed')) {
                                    const opt = this.tfClass('tb_toggleable_fields_options')[0];
                                    if (opt) {
                                        opt.style.display = 'none';
                                    }
                                    this.classList.add('tb_closed');
                                    toggleCollapse = true;
                                }
                                holder = this.cloneNode(true);
                                holder.tfClass('tb_toggleable_fields_options')[0]?.remove();
                                clone = holder.cloneNode(true);
                                scrollbar = this.closest('.tf_scrollbar');
                                holder.className += ' tb_sort_handler';
                                clone.classList.add('tb_current_sort');
                                this.style.display = 'none';
                                this.after(clone, holder);
                                holderHeight = holder.getBoundingClientRect().height / 2;
                                parentHeight = parentNode.offsetHeight;
                                const box = scrollbar.getBoundingClientRect();
                                viewMin = box.top;
                                viewMax = box.bottom - 40;
                            },
                            up = function (e) {
                                this.tfOff('pointermove', start, {passive: true, once: true})
                                        .tfOff('pointermove', move, {passive: true})
                                        .tfOff('lostpointercapture pointerup', up, {passive: true, once: true});

                                if (clone) {
                                    e.stopImmediatePropagation();
                                    clearTimeout(timeout);
                                    holder?.remove();
                                    clone.replaceWith(this);
                                    this.style.display = '';
                                    if (typeof tinyMCE !== 'undefined') {
                                        for (let id in editors) {
                                            tinyMCE.execCommand('mceAddEditor', false, id);
                                            tinymce.get(id).setContent(editors[id]);
                                        }
                                    }
                                    this.classList.remove('tb_current_sort');
                                    if (toggleCollapse) {
                                        const opt = this.tfClass('tb_toggleable_fields_options')[0];
                                        if (opt) {
                                            opt.style.display = '';
                                        }
                                        this.classList.remove('tb_closed');
                                    }
                                    self.control.preview(parentNode, null, {repeat: true});
                                    Themify.triggerEvent(parentNode, 'sortable');
                                    parentNode.classList.remove('tb_sort_start');
                                    parentNode = null;
                                }
                                topBodyCl.remove('tb_start_animate', 'tb_move_drag');
                                theLast = holder = toggleCollapse = dir = prevY = editors = scrollbar = doc = parentHeight = clone = isWorking = holderHeight = viewMin = viewMax = item = timeout = null;
                            };
                    item.tfOn('lostpointercapture pointerup', up, {passive: true, once: true})
                            .tfOn('pointermove', start, {passive: true, once: true})
                            .tfOn('pointermove', move, {passive: true})
                            .setPointerCapture(e.pointerId);
                }
            }, {passive: true});
        },
        _expand(item, data, self) {
            item.tfOn(_CLICK_, function (e) {
                if (!this.classList.contains('tb_toggleable_field_disabled') && !e.target.closest('.switch-wrapper')) {
                    let wrap = this.tfClass('tb_toggleable_fields_options')[0];
                    if (!wrap) {
                        wrap = createElement('','tb_toggleable_fields_options tf_box tf_w');
                        wrap.style.display = 'none';
                        this.appendChild(wrap);
                        self.is_repeat = true;
                        let pid = this.closest('.tb_toggleable_fields').id,
                            id = this.dataset.id,
                            orig = null,
                            vals=self.values?.[pid];
                        if(vals){
                            if(Array.isArray(vals)){
                                for(let i=vals.length-1;i>-1;--i){
                                    if(vals[i].id===id){
                                        vals=vals[i];
                                        break;
                                    }
                                }
                            }
                            else{
                                vals=vals[id];
                            }
                        }
                        if (vals?.val) {
                            orig = api.Helper.cloneObject(self.values);
                            self.values = vals.val;
                        }
                        if(data.options.length>0){
                            wrap.appendChild(self.create(data.options));
                            self._setUpEditors();
                            self.callbacks();
                        }
                        if (orig !== null) {
                            self.values = orig;
                        }
                        self.is_repeat = null;
                    } else if (wrap.contains(e.target)) {
                        return;
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    if (this.classList.contains('tb_closed')) {
                        $(wrap).slideDown(function () {
                            this.parentNode.classList.remove('tb_closed');
                        });
                    } else {
                        $(wrap).slideUp(function () {
                            this.parentNode.classList.add('tb_closed');
                        });
                    }
                } else if (!e.target.closest('.tb_toggleable_fields_options')) {
                    const wrap = this.tfClass('tb_toggleable_fields_options')[0];
                    $(wrap).slideUp(function () {
                        this.parentNode.classList.add('tb_closed');
                    });
                }
            });
        },
        _disable(el, self) {
            const item = el.closest('li'),
                    cl = item.classList;
            if (!el.checked) {
                cl.add('tb_toggleable_field_disabled', 'tb_closed');
            } else {
                cl.remove('tb_toggleable_field_disabled');
            }
            self.control.preview(item.parentNode, null, {repeat: true});
        },
        render(data, self) {
            const _this = this,
                    ul = createElement('ul','tb_toggleable_fields tf_w tf_rel'),
                    oldRepeat = self.is_repeat,
                    opt = self.values[data.id],
                    mapVals=new Set,
                    optionVals=new Map,
                    create=(value,itemOpt)=>{
                        const id=itemOpt.id,
                        toogleSwitch = {
                            type: 'toggle_switch',
                            id: '',
                            options: {
                                on: {
                                    name: '1',
                                    value: itemOpt.toggle?.on || 's'
                                },
                                off: {
                                    name: '0',
                                    value: itemOpt.toggle?.off || 'hi'
                                }
                            },
                            default: value.on === '1' ? 'on' : 'off',
                            control: false
                        },
                        li = createElement('li',{class: 'tb_toggleable_item tb_closed','data-id':id}),
                        input = createElement('input',{type:'hidden',value:value.val !== undefined?(typeof value.val==='string'?value.val:JSON.stringify(value.val)):''}),
                        title = createElement('', 'tb_toggleable_fields_title tf_plus_icon tf_rel'),
                        switcher = self.create([toogleSwitch]);
                        title.innerHTML = i18n[itemOpt.label] || itemOpt.label;
                        if (toogleSwitch.default === 'off') {
                            li.className += ' tb_toggleable_field_disabled';
                        }
                        if (itemOpt.class) {
                            li.className += ' ' + itemOpt.class;
                        }
                        switcher.querySelector('.toggle_switch').tfOn('change', function (e) {
                            e.stopPropagation();
                            _this._disable(this, self);
                        }, {passive: true});
                        li.append(input, title, switcher);
                        _this._expand(li, itemOpt, self);
                        ul.appendChild(li);
                    },
                    options=data.options;
            if (self.is_repeat === true) {
                ul.dataset.inputId = data.id;
                ul.className += ' tb_lb_option_child';
            } else {
                ul.id = data.id;
                ul.className += ' tb_lb_option';
            }
            self.is_repeat = true;
            for (let i=options.length-1;i>-1;--i) {
                optionVals.set(options[i].id,options[i]);
            }
            if (opt !== undefined) {
                for (let i=0;i<opt.length;++i) {
                    let id=opt[i].id,
                        valsOpt=optionVals.get(id);
                    if(valsOpt){
                        mapVals.add(id);
                        create(opt[i],valsOpt);
                    }
                }
            }

            for (let i=0;i<options.length;++i) {
                if(!mapVals.has(options[i].id)){
                    create({},options[i]);
                }
            }
            if (data.sort !== false) {
                _this._sort(ul, self);
            }
            self.is_repeat = oldRepeat;
            return ul;
        }
    },
    sortable_fields: {
        /* options shared across all types in the sortable */
        _getGlobalOptions(self) {
            return [
                {   id: 'icon',
                    type: 'icon',
                    label: 'icon'
                },
                {
                    id: 'before',
                    type: 'text',
                    label: 'b_t'
                },
                {
                    id: 'after',
                    type: 'text',
                    label: 'a_t'
                }
            ];
        },
        _getDefaults(type, self) {
            const _defaults = {
                date: [
                    {
                        id: 'display',
                        type: 'select',
                        label: 'disp',
                        options: {
                            '': 'pd',
                            m: 'md'
                        }
                    },
                    {
                        id: 'format',
                        type: 'select',
                        label: 'd_f',
                        default: 'def',
                        options: self.getOptions('dateFormat'),
                        binding: {
                            not_empty: {hide: 'custom'},
                            custom: {show: 'custom'}
                        }
                    },
                    {
                        id: 'custom',
                        type: 'text',
                        control: {event: 'change'},
                        label: 'cus_f',
                        help: 'cus_fd_h'
                    }
                ],
                time: [
                    {
                        id: 'format',
                        type: 'select',
                        label: 't_f',
                        default: 'def',
                        options: {
                            'g:i a': 'g_i_a',
                            'g:i A': 'g_i_A',
                            'H:i': 'H_i',
                            def: 'def',
                            custom: 'cus'
                        },
                        binding: {
                            not_empty: {hide: 'custom'},
                            custom: {show: 'custom'}
                        }
                    },
                    {
                        id: 'custom',
                        type: 'text',
                        control: {event: 'change'},
                        label:'cus_f',
                        help: 'cus_ft_h'
                    }
                ],
                author: [
                    {
                        id: 'l',
                        type: 'toggle_switch',
                        label: 'l',
                        options: 'simple',
                        default:'on'
                    },
                    {
                        id: 'a_p',
                        type: 'toggle_switch',
                        label: 'a_p',
                        options: 'simple',
                        default:'off',
                        binding: {
                            checked: {show: 'p_s'},
                            not_checked: {hide: 'p_s'}
                        }
                    },
                    {
                        id: 'p_s',
                        type: 'range',
                        label: 'p_s',
                        class: 'xsmall',
                        default:32,
                        units: {
                            px: {
                                max: 96
                            }
                        },
                        control: {
                            event: 'change'
                        }
                    }
                ],
                comments: [
                    {
                        id: 'l',
                        type: 'toggle_switch',
                        label: 'l',
                        options: 'simple',
                        default:'on'
                    },
                    {
                        id: 'no',
                        type: 'text',
                        control: {event: 'change'},
                        label: 'no_c'
                    },
                    {
                        id: 'one',
                        type: 'text',
                        control: {event: 'change'},
                        label: 'one_c'
                    },
                    {
                        id: 'comments',
                        type: 'text',
                        control: {event: 'change'},
                        label: 'comments'
                    }
                ],
                terms: [
                    {
                        id: 'post_type',
                        type: 'query_posts',
                        tax_id: 'taxonomy'
                    },
                    {
                        id: 'l',
                        type: 'toggle_switch',
                        label:'l',
                        options: 'simple',
                        default:'on'
                    },
                    {
                        id: 'sep',
                        type: 'text',
                        default:',',
                        control: {event: 'change'},
                        label: 'sep'
                    },
                    {
                        id: 'c',
                        type: 'toggle_switch',
                        default: 'off',
                        label: 'tbp_coverim',
                        options : 'simple',
                        binding : {
                            yes : { show : [ 'w', 'h', 'd' ] },
                            no : { hide : [ 'w', 'h', 'd' ] }
                        }
                    },
                    {
                        id: 'w',
                        type: 'number',
                        label: 'w',
                        after: 'px',
                        wrap_class : 'tb_disable_dc'
                    },
                    {
                        id: 'h',
                        type: 'number',
                        label: 'ht',
                        after: 'px',
                        wrap_class : 'tb_disable_dc'
                    },
                    {
                        id: 'd',
                        type: 'select',
                        label: 'disp',
                        options: {
                            '' : 'inbl',
                            b : 'block'
                        }
                    }
                ],
                text: [
                    {
                        id: 't',
                        type: 'textarea',
                        class: 'fullwidth'
                    }
                ]
            };
            return _defaults[type];
        },
        _create(data, type, id, vals, isRemovable) {
            const opt = data.options[type],
                li = createElement('li',{class:'tb_sort_fields_item','data-type':type},i18n[opt.label] || opt.label),
                arrow = createElement('span','tb_sort_field_dropdown_pointer');

            if (isRemovable === true) {

                let key = false;
                if (!id) {
                    if (vals !== undefined) {
                        key = this._find(vals, type, true);
                    }
                    li.dataset.new = true;
                    const wrap = api.LightBox.el.tfClass(data.id)[0];
                    let i = 1;
                    id = type + '_' + i;
                    if (wrap !== undefined) {
                        while (true) {
                            if (wrap.querySelector('[data-id="' + id + '"]') === null) {
                                break;
                            }
                            ++i;
                            id = type + '_' + i;
                        }
                    }
                } 
                else if (vals !== undefined) {
                    key = this._find(vals, id);
                }
                li.dataset.id = id;
                const remove = createElement('span',{class:'tb_sort_fields_remove tf_close',title:i18n.delete}),
                    input = createElement('input',{type:'hidden'});
                if (key !== false && vals[key].val !== undefined) {
                    input.value = JSON.stringify(vals[key].val);
                }
                li.append(api.Helper.getIcon('ti-pencil'), arrow, input, remove);
            }
            return li;
        },
        _sort(el, self) {
            el.tfOn('pointerdown', function (e) {
                if (e.button === 0 && e.target.parentNode === this) {
                    let theLast,
                            dir,
                            prevY = 0,
                            prevX = 0,
                            holder,
                            holderWidth,
                            holderHeight,
                            editors = {},
                            doc = this.ownerDocument,
                            item = e.target,
                            clone,
                            box,
                            parentNode = item.parentNode;
                    const move = e => {
                        e.stopImmediatePropagation();
                        if (!doc) {
                            return;
                        }
                        let {clientX:x,clientY:y} = e;
                        if (x < box.left) {
                            x = box.left;
                        } else if (x > box.right) {
                            x = box.right;
                        }
                        if (y < box.top) {
                            y = box.top;
                        } else if (y > box.bottom) {
                            y = box.bottom;
                        }
                        const moveTo = doc.elementFromPoint(x, y),
                                clientX = x - holderWidth - box.left,
                                clientY = y - holderHeight - box.top;

                        holder.style.transform = 'translate(' + clientX + 'px,' + clientY + 'px)';
                        if (moveTo && moveTo !== item && moveTo.classList.contains('tb_sort_fields_item')) {
                            const side = y > prevY || x > prevX ? 'bottom' : 'top';
                            if (dir !== side || theLast !== moveTo) {
                                side === 'bottom' ? moveTo.after(clone) : moveTo.before(clone);
                            }
                            theLast = moveTo;
                            dir = side;
                        }
                        prevY = y;
                        prevX = x;
                    },
                            start = function (e) {
                                e.stopImmediatePropagation();
                                topBodyCl.add('tb_start_animate', 'tb_move_drag');
                                parentNode.classList.add('tb_sort_start');
                                if (typeof tinyMCE !== 'undefined') {
                                    const items = parentNode.tfClass('tb_lb_wp_editor');
                                    for (let i = items.length - 1; i > -1; --i) {
                                        let id = items[i].id;
                                        editors[id] = tinymce.get(id).getContent();
                                        tinyMCE.execCommand('mceRemoveEditor', false, id);
                                    }
                                }
                                holder = this.cloneNode(true);
                                holder = this.cloneNode(true);
                                holder.tfClass('tb_sort_field_dropdown')[0]?.remove();
                                clone = holder.cloneNode(true);
                                holder.className += ' tb_sort_handler';
                                clone.classList.add('tb_current_sort');
                                this.style.display = 'none';
                                this.after(clone, holder);
                                const b = holder.getBoundingClientRect();
                                box = parentNode.getBoundingClientRect();
                                holderHeight = (b.height / 2) - parentNode.offsetTop;
                                holderWidth = (b.width / 2) - parentNode.offsetLeft;
                                move(e);
                            },
                            up = function () {
                                this.tfOff('pointermove', start, {passive: true, once: true})
                                        .tfOff('pointermove', move, {passive: true})
                                        .tfOff('lostpointercapture pointerup', up, {passive: true, once: true});
                                if (clone) {
                                    holder?.remove();
                                    clone.replaceWith(this);
                                    this.style.display = '';
                                    if (typeof tinyMCE !== 'undefined') {
                                        for (let id in editors) {
                                            tinyMCE.execCommand('mceAddEditor', false, id);
                                            tinymce.get(id).setContent(editors[id]);
                                        }
                                    }
                                    self.control.preview(parentNode, null, {repeat: true});
                                    Themify.triggerEvent(parentNode, 'sortable');
                                    parentNode.classList.remove('tb_sort_start');
                                    parentNode = null;
                                }
                                topBodyCl.remove('tb_start_animate', 'tb_move_drag');
                                theLast = holder = dir = prevY = prevX = editors = doc = holderHeight = holderWidth = box = item = clone = null;
                            };
                    item.tfOn('lostpointercapture pointerup', up, {passive: true, once: true})
                            .tfOn('pointermove', start, {passive: true, once: true})
                            .tfOn('pointermove', move, {passive: true})
                            .setPointerCapture(e.pointerId);
                }
            }, {passive: true});
        },
        _find(values, id, byType) {
            for (let i = values.length - 1; i > -1; --i) {
                if (values[i].id === id || (byType === true && id === values[i].type)) {
                    return i;
                }
            }
            return false;
        },
        _edit(self, data, vals, el) {
            let type = el.dataset.type,
                wrap = el.tfClass('tb_sort_field_dropdown')[0];
            if (!wrap) {
                wrap = createElement('','tb_sort_field_dropdown tb_sort_field_dropdown_' + type + ' tf_scrollbar');
                let id = el.dataset.id,
                    orig = null,
                    options = data.options[type].options || this._getDefaults(type, self);
                if (type !== 'text' && !data.options[ type ].no_global_options) {
                    options = options.concat(this._getGlobalOptions(self));
                }

                self.is_repeat = self.is_sort = true;
                if (vals !== undefined) {
                    const isNew = !!el.dataset.new,
                            by = isNew === true ? type : id,
                            key = this._find(vals, by, isNew);
                    if (key !== false && vals[key].val !== undefined) {
                        orig = api.Helper.cloneObject(self.values);
                        self.values = vals[key].val;
                    }
                }
                wrap.appendChild(self.create(options));
                el.appendChild(wrap);
                self.callbacks();
                if (orig !== null) {
                    self.values = orig;
                }
                self.is_sort = self.is_repeat = orig = null;
            }

            if (!el.classList.contains('current')) {
                el.classList.add('current');
                const _close = function (e) {
                    if (e.button === 0) {
                        if (el.contains(e.target) || (Themify_Icons.target && el.contains(Themify_Icons.target[0]) && this.tfId('themify_lightbox_fa').style.display === 'block')) {
                            el.classList.add('current');
                        } else {
                            el.classList.remove('current');
                            this.tfOff(e.type, _close, {passive: true});
                        }
                    }
                };
                topWindowDoc.tfOn('pointerdown', _close, {passive: true});
            }
        },
        _remove(self, el) {
            el = el.closest('li');
            const p = el.parentNode;
            el.parentNode.removeChild(el);
            self.control.preview(p, null, {repeat: true});
            Themify.triggerEvent(p, 'delete');
        },
        render(data, self) {
            const wrapper = createElement('','tb_sort_fields_wrap tf_box tf_rel tf_w'),
                    plus = createElement('',{class:'tb_ui_dropdown_label tb_sort_fields_plus tf_plus_icon',tabindex:-1}),
                    plusWrap = createElement('','tb_sort_fields_plus_wrap'),
                    ul = createElement('ul','tf_scrollbar'),
                    item = createElement('ul','tb_sort_fields_parent'),
                    values = self.values[data.id]?.slice(0) || [];
            if (self.is_repeat === true) {
                item.dataset.inputId = data.id;
                item.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
            } else {
                item.id = data.id;
                item.className += ' tb_lb_option';
            }

            for (let i in data.options) {
                ul.appendChild(this._create(data, i));
            }
            for (let i = 0; i < values.length; ++i) {
                if (self.is_new !== true || values[i].show === true) {
                    item.appendChild(this._create(data, values[i].type, values[i].id, values, true));
                }
            }

            wrapper.tfOn(_CLICK_, e => {
                const li = e.target.tagName === 'LI' ? e.target : e.target.parentNode;
                if (li.tagName === 'LI') {
                    e.stopPropagation();
                    if (e.target.classList.contains('tb_sort_fields_remove')) {
                        this._remove(self, e.target);
                    } else {
                        if (li.closest('.tb_sort_fields_plus_wrap')) {
                            item.appendChild(this._create(data, e.target.dataset.type, null, values, true));
                            self.control.preview(item, null, {repeat: true});
                        } else {
                            this._edit(self, data, values, li);
                        }
                    }
                }
            }, {passive: true});
            plusWrap.append(plus, ul);
            wrapper.append(item, plusWrap);
            setTimeout(() => {
                this._sort(item, self);
            }, 800);
            if (self.is_new === true) {
                self.afterRun.push(() => {
                    self.control.preview(item, null, {repeat: true});
                });
            }
            return wrapper;
        }
    },
    multi: {
        render(data, self) {
            const wrapper = createElement('','tb_multi_fields tb_fields_count_' + data.options.length);
            wrapper.appendChild(self.create(data.options));
            return wrapper;
        }
    },
    color: {
        _is_typing: null,
        _controlChange(el, btn_opacity, data) {
            const that = this,
                    $el = $(el),
                    id = data.id;
            $el.tfminicolors({
                opacity: data.opacity === undefined ? true : !!data.opacity,
                swatches: themifyColorManager.toColorsArray(),
                changeDelay: 10,
                beforeShow() {
                    const box = api.LightBox.el.getBoundingClientRect(),
                            p = $el.closest('.tfminicolors'),
                            panel = p.find('.tfminicolors-panel');
                    panel.css('visibility', 'hidden').show();//get offset
                    p[0].classList.toggle('tfminicolors_right', ((box.left + box.width) <= panel.offset().left + panel.width()));
                    panel.css('visibility', '').hide();
                },
                show() {
                    themifyColorManager.initColorPicker(this);
                    if (api.isVisual) {
                        Themify.triggerEvent(this, 'themify_builder_color_picker_show', {id: id});
                    }
                },
                hide() {
                    if (api.isVisual) {
                        Themify.triggerEvent(this, 'themify_builder_color_picker_hide', {id: id});
                    }
                },
                change(hex, opacity) {
                    if (!hex) {
                        opacity = hex = '';
                    } else if (opacity) {
                        if ('0.99' == opacity) {
                            opacity = 1;
                        } else if (0 >= parseFloat(opacity)) {
                            opacity = 0;
                        }
                    }
                    if (!that._is_typing && opacity !== doc.activeElement) {
                        btn_opacity.value = opacity;
                    }
                    if (hex && 0 >= parseFloat($(this).tfminicolors('opacity'))) {
                        $(this).tfminicolors('opacity', 0);
                    }

                    if (api.isVisual) {
                        if ( hex && ! hex.startsWith( 'var' ) ) {
                            hex = hex.indexOf('--') === 0 ? 'var(' + hex + ')' : $(this).tfminicolors('rgbaString');
                        }
                        Themify.triggerEvent(this, 'themify_builder_color_picker_change', {id: id, val: hex});
                    }
                }
            }).tfminicolors('show');
            //opacity
            const callback = function (e) {
                let opacity = parseFloat(this.value.trim().replace(',', '.'));
                if (opacity > 1 || isNaN(opacity) || opacity < 0) {
                    opacity = !el.value ? '' : 1;
                }
                if (e.type === 'blur') {
                    this.value = opacity;
                }
                that._is_typing = 'keyup' === e.type;
                $el.tfminicolors('opacity', opacity);
            };
            btn_opacity.tfOn('blur keyup', callback, {passive: true});
            el.setAttribute('data-tfminicolors-initialized', true);
        },
        setColor(input, swatch, opacityItem, val) {
            let color = val,
                    opacity = '',
                    isVar = false;
            if (val === 'transparent') {
                color = val = '#000';
                opacity = 0;
            } else if (val !== '') {
                isVar = val.indexOf('--') === 0;
                if (isVar === false) {
                    if (val.includes('_')) {
                        color = ThemifyStyles.toRGBA(val);
                        val = val.split('_');
                        opacity = val[1];
                        if (!opacity) {
                            opacity = 1;
                        } else if (0 >= parseFloat(opacity)) {
                            opacity = 0;
                        }
                        color = val[0];
                    } else {
                        color = val;
                        opacity = 1;
                    }
                    if (!color.includes('#')) {
                        color = '#' + color;
                    }
                }
            }
            input.parentNode.classList.toggle('tfminicolors-var-input', isVar);
            input.value = color;
            if (isVar === true) {
                color = opacity = '';
            }
            swatch.style.background = color;
            input.dataset.opacity = swatch.style.opacity = opacityItem.value = opacity;
        },
        update(id, v, self) {
            const input = self.getEl(id);
            if (input !== null) {
                const p = input.parentNode;
                if (v === undefined) {
                    v = '';
                }
                this.setColor(input, p.tfClass('tfminicolors-swatch-color')[0], p.nextElementSibling, v);
            }
        },
        render(data, self) {
            const f = createDocumentFragment(),
                    wrapper = createElement('','tfminicolors_wrapper'),
                    tfminicolors = createElement('','tfminicolors tfminicolors-theme-default'),
                    input = createElement('input',{type:'text',class:'tfminicolors-input',autocomplete:'off'}),
                    opacity = createElement('input',{class:'color_opacity',step:.1,min:0,max:1,type:'number'}),
                    swatch = createElement('span', 'tfminicolors-swatch tfminicolors-sprite tfminicolors-input-swatch'),
                    span = createElement('span','tfminicolors-swatch-color tf_abs'),
                    that = this;

            let v = self.getStyleVal(data.id);

            if (data.class !== undefined) {
                input.className += ' ' + data.class;
            }
            if (self.is_repeat === true) {
                input.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                input.dataset.inputId = data.id;
            } else {
                input.id = data.id;
                input.className += ' tb_lb_option';
            }

            swatch.appendChild(span);
            tfminicolors.append(input, swatch);
            wrapper.append(tfminicolors, opacity);

            self._initControl(input, data);
            swatch.tfOn(_CLICK_, () => {
                wrapper.insertAdjacentElement('afterbegin', input);
                tfminicolors.parentNode.removeChild(tfminicolors);
                that._controlChange(input, opacity, data);
            }, {once: true, passive: true});
            input.tfOn('focusin', () => {
                swatch.click();
            }, {once: true, passive: true});
            opacity.tfOn('focusin', function () {
                if (!input.dataset.tfminicolorsInitialized) {
                    input.dataset.opacity = this.value;
                    swatch.click();
                } else {
                    $(input).tfminicolors('show');
                }
            }, {passive: true});

            if (!v && data.default) {
                v = data.default;
            }

            if (v !== undefined) {
                this.setColor(input, span, opacity, v);
            }
            f.appendChild(wrapper);
            if (data.after !== undefined) {
                f.appendChild(self.after(data));
            }
            if (data.description !== undefined) {
                f.appendChild(self.description(data.description));
            }
            if (data.tooltip !== undefined) {
                f.appendChild(self.hint(data.tooltip));
            }
            if (data.label === undefined) {
                data.label = 'c';
            }
            else if (data.label === false) {
                delete data.label;
            }
            return f;
        }
    },
    tooltip: {
        render(data, self) {
            const prefix = data.prefix || '_tooltip',
                group = data.group ?? true;
            let options = [
                {
                    type: 'textarea',
                    label: 'tt',
                    id: prefix,
                    class: 'fullwidth',
                    control: false, /* disable live preview refresh */
                    binding : {
                        empty : { hide : [ prefix + '_bg', prefix + '_c', prefix + '_w' ] },
                        not_empty : { show : [ prefix + '_bg', prefix + '_c', prefix + '_w' ] }
                    }
                },
                {
                    type : 'multi',
                    label : '',
                    options: [
                        {
                            type: 'color',
                            label: 'bg_c',
                            id: prefix + '_bg',
                            control: false
                        },
                        {
                            type: 'color',
                            label: 'f_c',
                            id: prefix + '_c',
                            control: false
                        },
                        {
                            type: 'range',
                            label: 'ma_wd',
                            id: prefix + '_w',
                            control: false,
                            units: {
                                px: {
                                    min: -2000,
                                    max: 2000
                                },
                                em: {
                                    min: -20,
                                    max: 20
                                }
                            },
                            wrap_class : 'tb_disable_dc'
                        }
                    ]
                }
            ];
            if ( group ) {
                options = [ {
                    type: 'group',
                    label: 't',
                    display: 'accordion',
                    options: options
                } ];
            }
            let f = self.create( options );
            if (api.isVisual) {
                f = this._bindEvents(f, data);
            }
            return f;
        },
        /* setup live preview events */
        _bindEvents(el, data) {
            const self = this,
                prefix = data.prefix ? data.prefix : '_tooltip',
                _tooltip = el.querySelector('#' + prefix),
                color_fields = [el.querySelector('#' + prefix + '_bg'), el.querySelector('#' + prefix + '_c')],
                    events = ['focus', 'keyup', 'blur', 'change'],
                tooltip_w = el.querySelector('#' + prefix + '_w');
        
            tooltip_w.tfOn(events, e => {
                self._addOrRemoveTooltip(e.type !== 'blur', data);
            }, {passive: true});
            
            events.pop();
            
            _tooltip.tfOn(events, e => {
                self._addOrRemoveTooltip(e.type !== 'blur', data);
            }, {passive: true});

            for (let i = color_fields.length - 1; i > -1; --i) {
                color_fields[i].tfOn('themify_builder_color_picker_show', function () {
                    self._addOrRemoveTooltip(true, data);
                    this.tfOn('themify_builder_color_picker_hide', () => {
                        self._addOrRemoveTooltip(false, data);
                    }, {once: true, passive: true});
                }, {passive: true})
                .tfOn('themify_builder_color_picker_change', () => {
                    self._addOrRemoveTooltip(true, data);
                }, {passive: true});
            }
            return el;
        },
        /* creates tooltip preview element */
        _addOrRemoveTooltip(show, data) {
            let el = api.liveStylingInstance.el,
                tooltip;
            if ( data.scope ) {
                /* change element to display the tooltip inside */
                el = el.querySelector( data.scope );
            }
            tooltip = el.querySelector( ':scope > .tf_tooltip' );
            if (!show && tooltip) {
                tooltip.remove();
                return;
            }

            Themify.loadCss('tooltip');

            const self = ThemifyConstructor,
                prefix = data.prefix || '_tooltip',
                val = self.getEl(prefix).value; /* Tooltip Text field */

            if (val !== '') {
                if (!tooltip) {
                    tooltip = createElement('','tf_tooltip');
                    el.appendChild(tooltip);
                }
                let width = self.getEl( prefix + '_w' ).value;
                tooltip.classList.add('tf_abs_c');
                tooltip.innerHTML = val;
                tooltip.style.background = api.Helper.getColor( self.getEl( prefix + '_bg' ) );
                tooltip.style.color = api.Helper.getColor( self.getEl( prefix + '_c' ) );
                if (width !== '') {
                    width += self.getEl( prefix + '_w_unit' ).value;
                }
                tooltip.style.width = width;
                tooltip.classList.remove('tf_hide');
            }
            else  {
                tooltip?.remove();
            }
        }
    },
    text: {
        update(id, v, self) {
            const item = self.getEl(id);
            if (item !== null) {
                item.value = v?? '';
            }
        },
        render(data, self) {
            const f = createDocumentFragment(),
                    input = createElement('input'),
                    v = self.getStyleVal(data.id) ?? data.default;
            input.type = data.input_type || 'text'; // custom input types
            if (self.is_repeat === true) {
                input.className = self.is_sort === true ? 'tb_lb_sort_child' : 'tb_lb_option_child';
                input.dataset.inputId = data.id;
            } else {
                input.className = 'tb_lb_option';
                input.id = data.id;
            }
            if (data.placeholder !== undefined) {
                input.placeholder = data.placeholder;
            }
            if (data.custom_args !== undefined) {
                for (let i in data.custom_args) {
                    input.setAttribute(i, data.custom_args[i]);
                }
            }
            if (v !== undefined) {
                input.value = v;
            }
            if (data.class !== undefined) {
                input.className += ' ' + data.class;
            }
            f.appendChild(self._initControl(input, data));
            if (data.unit !== undefined) {
                f.appendChild(self.select.render(data.unit, self));
            }
            if (data.after !== undefined) {
                f.appendChild(self.after(data));
            }
            if (data.description !== undefined) {
                f.appendChild(self.description(data.description));
            }
            if (data.tooltip !== undefined) {
                f.appendChild(self.hint(data.tooltip));
            }
            return f;
        }
    },
    number: {
        render(data, self) {
            data.input_type = 'number';
            if (data.custom_args === undefined) {
                data.custom_args = {min: data.min || 0};
                if (data.max !== undefined) {
                    data.custom_args.max = data.max;
                }
                if (data.step !== undefined) {
                    data.custom_args.step = data.step;
                }
            }
            return self.text.render(data, self);
        }
    },
    angle: {
        update(id, v, self) {
            self.range.update(id, v, self);
        },
        render(data, self) {
            data.input_type = 'number';
            data.custom_args = {min: 0, max: 360};
            const wrap = createElement('',{class:'tb_angle_container tf_rel',tabindex:-1}),
                    css_class = 'tb_lb_option tb_angle_input';
            data.class = data.class !== undefined ? data.class + ' ' + css_class : css_class;
            wrap.appendChild(self.range.render(data, self));
            const angle = wrap.querySelector('#' + data.id),
                    event = data.event|| (self.clicked === 'styling' ? 'keyup' : 'change');
            angle.tfOn('pointerdown', function (e) {
                e.stopImmediatePropagation();
                let _circle = this.parentNode.tfClass('tb_angle_circle')[0];
                if (!_circle) {
                    let v = this.value;
                    const tmp1 = createElement('','tb_angle_dot'),
                        tmp2 = createElement('','tb_angle_circle_wrapper');
                    _circle = createElement('','tb_angle_circle');
                    if (v !== '') {
                        tmp1.style.transform = 'rotate(' + v + 'deg)';
                    }
                    _circle.appendChild(tmp1);
                    tmp2.appendChild(_circle);
                    this.parentNode.appendChild(tmp2);
                }
                _circle.tfOn(e.type, function (e) {
                    if (e.button === 0) {
                        let box = this.getBoundingClientRect(),
                                center_x = (this.offsetWidth / 2) + box.left,
                                center_y = (this.offsetHeight / 2) + box.top,
                                timer,
                                _dot = this.parentNode.tfClass('tb_angle_dot')[0];
                        const PI = 180 / Math.PI,
                                _start = e => {
                                    e.stopImmediatePropagation();
                                    topBodyCl.add('tb_start_animate');
                                },
                                _move = e => {
                                    e.stopImmediatePropagation();
                                    timer = requestAnimationFrame(() => {
                                        let delta_y = center_y - e.clientY,
                                                delta_x = center_x - e.clientX,
                                                ang = Math.atan2(delta_y, delta_x) * PI; // Calculate Angle between circle center and mouse pos
                                        ang -= 90;
                                        if (ang < 0) {
                                            ang += 360; // Always show angle positive
                                        }
                                        ang = Math.round(ang);
                                        _dot.style.transform = 'rotate(' + ang + 'deg)';
                                        angle.value = ang;
                                        Themify.triggerEvent(angle, event);
                                    });
                                },
                                _up = function () {
                                    cancelAnimationFrame(timer);
                                    this.tfOff('pointermove', _start, {passive: true, once: true})
                                            .tfOff('pointermove', _move, {passive: true})
                                            .tfOff('lostpointercapture pointerup', _up, {passive: true, once: true});
                                    topBodyCl.remove('tb_start_animate');
                                    requestAnimationFrame(() => {
                                        _dot = center_x = timer = center_y = null;
                                    });
                                };

                        this.tfOn('lostpointercapture pointerup', _up, {passive: true, once: true})
                                .tfOn('pointermove', _start, {passive: true, once: true})
                                .tfOn('pointermove', _move, {passive: true})
                                .setPointerCapture(e.pointerId);
                        _move(e);
                    }

                }, {passive: true});

            }, {passive: true, once: true});
            return wrap;
        }
    },
    autocomplete: {
        _cache: new Map,
        render(data, self) {
            const d = self.text.render(data, self);
            if (data.dataset === undefined) {
                return d;
            }
            let controller = null;
            const _this = this,
                input = d.querySelector('input',{autocomplete:'off'}),
                container = createElement('','tb_autocomplete_container');
            d.appendChild(container);
            input.tfOn('input', async function () {
                // remove all elements in container
                const wrapper = this.nextElementSibling,
                    value = this.value,
                    type = data.dataset,
                    k = type + value;
                wrapper.replaceChildren();
                if (value !== '') {
                    controller?.abort();
                    let resp = _this._cache.get(k);
                    if (!resp) {
                        const parent = this.parentNode;
                        try {
                            controller = new AbortController();
                            parent.classList.add('tb_autocomplete_loading', 'tf_loader');
                            resp = await api.LocalFetch({action: 'tb_get_ajax_data', mode: 'autocomplete', dataset: type, value: value}, false, {signal: controller.signal});
                            resp = resp.success ? resp.data : '';
                            _this._cache.set(k, resp);
                        } catch (e) {

                        }
                        parent.classList.remove('tb_autocomplete_loading', 'tf_loader');
                    }
                    if (resp) {
                        const d = createDocumentFragment();
                        for (let i in resp) {
                            d.appendChild(createElement('',{class:'tb_autocomplete_item','data-value':i},resp[i]));
                        }
                        wrapper.classList.add('tf_scrollbar');
                        wrapper.appendChild(d);
                    }
                    controller = null;
                }
            }, {passive: true});
            container.tfOn('pointerdown', function (e) {
                if (e.button === 0 && e.target.classList.contains('tb_autocomplete_item')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const field = this.previousElementSibling;
                    field.value = e.target.dataset.value;
                    field.blur();
                    Themify.triggerEvent(field, 'change');
                }
            });
            return d;
        }
    },
    mediaFile: {
        _frames: {},
        browse(uploader, input, self, type) {
            uploader.tfOn(_CLICK_, e => {
                e.preventDefault();
                e.stopPropagation();
                let file_frame;
                if (this._frames[type] !== undefined) {
                    file_frame = this._frames[type];
                } else {
                    file_frame = wp.media.frames.file_frame = wp.media({
                        title: input.dataset.title || i18n['upload_' + type] || i18n.upload_image,
                        library: {
                            type: type === 'json' ? 'text/plain,application/json' : type
                        },
                        button: {
                            text: i18n.insert_image
                        },
                        multiple: false
                    });
                    this._frames[type] = file_frame;
                }
                file_frame.off('select').on('select', () => {
                    api.ActionBar.disable = true;
                    const attachment = file_frame.state().get('selection').first().toJSON();
                    input.value = attachment.url;
                    Themify.triggerEvent(input, 'change');
                    $(input).trigger('change');
                    const attach_id = input.getRootNode().querySelector('#' + input.id + '_id');
                    if (attach_id) {
                        attach_id.value = attachment.id;
                    }
                });
                file_frame.on('close', () => {
                    api.ActionBar.disable = true;
                    setTimeout(() => {
                        api.ActionBar.disable = null;
                    }, 5);
                });
                // Finally, open the modal
                file_frame.open();
                file_frame.content.mode('browse');
            });
            if (type === 'image') {
                input.tfOn('change', e => {
                    this.setImage(uploader, e.currentTarget.value.trim());
                }, {passive: true});
            }
        },
        setImage(prev, url) {
            prev.replaceChildren();
            if (url) {
                const w = 40,
                        h = 40,
                        img = new Image(w, h),
                        placeholder = new Image(w, h);
                placeholder.decoding = 'async';
                placeholder.src = 'https://placehold.co/' + w + 'x' + h + '.png';
                img.src = url;
                img.decoding = 'async';
                img.decode()
                        .catch(() => {
                        })
                        .finally(() => {
                            placeholder.replaceWith(img);
                        });
                prev.appendChild(placeholder);
            }
        },
        update(id, v='', self) {
            const item = self.getEl(id);
            if (item !== null) {
                item.value = v;
                this.setImage(item.parentNode.tfClass('thumb_preview')[0], v);
            }
        },
        render(type, data, self) {
            const wr = createElement('','tb_uploader_wrapper tf_rel'),
                    input = createElement('input',{class:'tb_uploader_input',type:'text',required:'required',pattern: /.*\S.*/.source,autocomplete:'off'}),
                    upload_btn = createElement('a',{class:'tb_media_uploader tb_upload_btn thumb_preview tf_plus_icon tf_rel',href:'#',title:i18n.browse_image,'data-library-type':type === 'json' ? 'text/plain,application/json' : type}),
                    btn_delete =createElement('span','tb_clear_input tf_close'),
                    v = self.getStyleVal(data.id);
            let id;
            if (data.title) {
                input.dataset.title = data.title;
            }
            if (self.is_repeat === true) {
                input.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                id = 'tb_' + Math.random().toString(36).substr(2, 7);
                input.dataset.inputId = data.id;
            } else {
                input.className += ' tb_lb_option';
                id = data.id;
            }
            input.id = id;

            if (v !== undefined) {
                input.value = v;
            }

            btn_delete.tfOn(_CLICK_, e => {
                e.stopPropagation();
                input.value = '';
                Themify.triggerEvent(input, 'change');
            }, {passive: true});
            wr.append(self._initControl(input, data), btn_delete, upload_btn);
            if (type === 'image') {
                this.setImage(upload_btn, v);
            }
            this.browse(upload_btn, input, self, type);
            if (data.after !== undefined) {
                wr.appendChild(self.after(data));
            }
            if (data.description !== undefined) {
                wr.appendChild(self.description(data.description));
            }
            if (data.tooltip !== undefined) {
                wr.appendChild(self.hint(data.tooltip));
            }
            return wr;
        }
    },
    file: {
        render(data, self) {
            return self.mediaFile.render(data.ext, data, self);
        }
    },
    image: {
        render(data, self) {
            return self.mediaFile.render('image', data, self);
        }
    },
    video: {
        render(data, self) {
            return self.mediaFile.render('video', data, self);
        }
    },
    audio: {
        render(data, self) {
            return self.mediaFile.render('audio', data, self);
        }
    },
    lottie: {
        _getOptions(markers, min, max, ev, isMulti) {
            const lottieLb = i18n.lottie,
                frames = {"": 'none'};
            for (let k of markers.keys()) {
                frames[k] = k;
            }
            const events = isMulti ? {
                '': 'onload',
                click: 'click',
                hover: 'h',
                hold: 'hold',
                pausehold: 'phold',
                seek: 'seek',
                scroll:'scroll',
                basket: lottieLb.basket,
                none: lottieLb.n
            } : {
                '': 'onload',
                click: 'click',
                hover: 'h',
                hold: 'hold',
                pausehold: 'phold',
                seek: 'seek',
                basket: lottieLb.basket
            },
                    options = [
                        {
                            id: 'st',
                            type: 'select',
                            label: lottieLb.pl,
                            options: events,
                            binding: {
                                '': {
                                    show: [
                                        'tb_loop_msg',
                                        'count'
                                    ],
                                    hide: [
                                        'tb_click_msg',
                                        'tb_hover_msg',
                                        'tb_click_hover_input',
                                        'tb_hold_msg',
                                        'tb_scroll_wr',
                                        'tb_seek_msg',
                                        'tb_pausehold_msg'
                                    ]
                                },
                                click: {
                                    show: [
                                        'tb_click_msg',
                                        'tb_click_hover_input',
                                        'count'
                                    ],
                                    hide: [
                                        'tb_loop_msg',
                                        'tb_hover_msg',
                                        'tb_hold_msg',
                                        'tb_scroll_wr',
                                        'tb_seek_msg',
                                        'tb_pausehold_msg'
                                    ]
                                },
                                hover: {
                                    show: [
                                        'tb_hover_msg',
                                        'tb_click_hover_input',
                                        'count'
                                    ],
                                    hide: [
                                        'tb_loop_msg',
                                        'tb_click_msg',
                                        'tb_hold_msg',
                                        'tb_scroll_wr',
                                        'tb_seek_msg',
                                        'tb_pausehold_msg'
                                    ]
                                },
                                seek: {
                                    show: [
                                        'tb_seek_msg'
                                    ],
                                    hide: [
                                        'tb_click_msg',
                                        'tb_hover_msg',
                                        'tb_click_hover_input',
                                        'tb_hold_msg',
                                        'tb_loop_msg',
                                        'tb_scroll_wr',
                                        'tb_pausehold_msg',
                                        'count'
                                    ]
                                },
                                pausehold: {
                                    show: [
                                        'tb_pausehold_msg'
                                    ],
                                    hide: [
                                        'tb_click_msg',
                                        'tb_hover_msg',
                                        'tb_click_hover_input',
                                        'tb_hold_msg',
                                        'tb_loop_msg',
                                        'tb_seek_msg',
                                        'tb_scroll_wr',
                                        'count'
                                    ]
                                },
                                hold: {
                                    show: [
                                        'tb_hold_msg'
                                    ],
                                    hide: [
                                        'tb_click_msg',
                                        'tb_hover_msg',
                                        'tb_click_hover_input',
                                        'tb_pausehold_msg',
                                        'tb_loop_msg',
                                        'tb_seek_msg',
                                        'tb_scroll_wr',
                                        'count'
                                    ]
                                },
                                scroll: {
                                    show: [
                                        'tb_scroll_wr'
                                    ],
                                    hide: [
                                        'tb_click_msg',
                                        'tb_hover_msg',
                                        'tb_click_hover_input',
                                        'tb_pausehold_msg',
                                        'tb_loop_msg',
                                        'tb_seek_msg',
                                        'tb_hold_msg',
                                        'count'
                                    ]
                                },
                                none: {
                                    hide: [
                                        'tb_click_msg',
                                        'tb_hover_msg',
                                        'tb_click_hover_input',
                                        'tb_hold_msg',
                                        'count',
                                        'tb_pausehold_msg',
                                        'tb_scroll_wr',
                                        'tb_next_msg',
                                        'tb_seek_msg',
                                        'speed',
                                        'delay',
                                        'dir'
                                    ]
                                },
                                basket: {
                                    hide: [
                                        'tb_click_msg',
                                        'tb_hover_msg',
                                        'tb_click_hover_input',
                                        'tb_hold_msg',
                                        'tb_pausehold_msg',
                                        'tb_seek_msg',
                                        'tb_scroll_wr',
                                        'tb_next_msg'
                                    ]
                                }
                            }
                        },
                        {
                            label: 'csssel',
                            id: 'sel',
                            wrap_class: 'tb_click_hover_input' + (ev !== 'hover' && ev !== 'click' ? ' _tb_hide_binding' : ''),
                            type: 'text',
                            help: lottieLb.clsel,
                            control: {event: 'change'}
                        },
                        ( isMulti ? {} : {
                            id: 'lp',
                            label: 'loop',
                            type: 'toggle_switch',
                            default: 'on',
                            options: {
                                on: {
                                    name: '',
                                    value: 'y'
                                },
                                off: {
                                    name: '1',
                                    value: 'no'
                                }
                            },
                            binding : {
                                empty : { hide : 'count' },
                                not_empty : { show : 'count' }
                            }
                        } ),
                        {
                            id: 'count',
                            label: 'pbcount',
                            type: 'range',
                            min: 1,
                            placeholder: 1
                        },
                        {
                            type: 'message',
                            label: '',
                            wrap_class: 'tb_click_msg' + (ev !== 'click' ? ' _tb_hide_binding' : ''),
                            comment: lottieLb.clm
                        },
                        {
                            type: 'message',
                            label: '',
                            wrap_class: 'tb_hover_msg' + (ev !== 'hover' ? ' _tb_hide_binding' : ''),
                            comment: lottieLb.hm
                        },
                        {
                            type: 'message',
                            label: '',
                            wrap_class: 'tb_hold_msg' + (ev !== 'hold' ? ' _tb_hide_binding' : ''),
                            comment: lottieLb.hlm
                        },
                        {
                            type: 'message',
                            label: '',
                            wrap_class: 'tb_seek_msg' + (ev !== 'seek' ? ' _tb_hide_binding' : ''),
                            comment: lottieLb.sm
                        },
                        {
                            type: 'message',
                            label: '',
                            wrap_class: 'tb_pausehold_msg' + (ev !== 'pausehold' ? ' _tb_hide_binding' : ''),
                            comment: lottieLb.phm
                        },
                        {
                            type: 'group',
                            wrap_class: 'tb_scroll_wr' + (ev !== 'scroll' ? ' _tb_hide_binding' : ''),
                            options: [
                                {
                                    id: 'vis',
                                    type: 'slider_range',
                                    label: 'visibility',
                                    help: lottieLb.in_r,
                                    options: {
                                        unit: '%'
                                    }
                                },
                                {
                                    id: 's_ev',
                                    type: 'select',
                                    label: 'e',
                                    options: {
                                        '': 'play',
                                        seek: 'seek'
                                    }
                                }
                            ]
                        },
                        {
                            id: 'sp',
                            type: 'range',
                            label: 'speed',
                            increment: .1,
                            min: .1,
                            placeholder: 1
                        },
                        {
                            id: 'dir',
                            label: 'rev',
                            type: 'toggle_switch',
                            options: {
                                on: {
                                    name: '-1',
                                    value: 'y'
                                },
                                off: {
                                    value: 'no'
                                }
                            }
                        },
                        {
                            id: 'fid',
                            type: 'select',
                            label: lottieLb.fid,
                            wrap_class: 'tb_lottie_frame_id',
                            help: lottieLb.fidm,
                            options: frames,
                            control: false
                        },
                        {
                            id: 'seg',
                            type: 'slider_range',
                            wrap_class: 'tb_lottie_range_id',
                            label: lottieLb.seg,
                            help: lottieLb.segm,
                            options: {
                                min: min,
                                max: max,
                                unit: ''
                            }
                        },
                        {
                            id: 'del',
                            type: 'range',
                            label: 'delay',
                            after: 'sec',
                            help: lottieLb.delm,
                            increment: .1,
                            min: 0,
                            placeholder: 0
                        },
                        {
                            id: 'r',
                            label: 'ren',
                            type: 'select',
                            help: lottieLb.renm,
                            options: {
                                '': 'SVG',
                                c: 'Canvas',
                                h: 'HTML'
                            }
                        }
                    ];
            if (!isMulti) {
                const hasScroll = !!events.scroll;
                for (let i = options.length - 1; i > -1; --i) {
                    let opt=options[i],
                        id = opt.id;
                    if (id === 'del' || id === 'sel' || id === 'st' || opt.comment === lottieLb.clsel || (hasScroll === false && opt.wrap_class?.includes('tb_scroll_wr'))) {
                        if (id === 'st') {
                            if (hasScroll === false) {
                                delete opt.binding.scroll;
                                delete opt.binding.none;
                            }
                        } else {
                            options.splice(i, 1);
                        }
                    }
                }
            }
            return options;
        },
        render(data, self) {
            let vals = self.values,
                    binds = data.binding,
                    defaultBind = {
                        empty: {hide: 'tb_lottie_wrap'},
                        not_empty: {show: 'tb_lottie_wrap'}
                    },
                    loader = createElement('','tf_loader tf_abs_c');
            if (binds) {
                binds = api.Helper.cloneObject(binds);
                if (binds.empty?.hide) {
                    if (!Array.isArray(binds.empty.hide)) {
                        binds.empty.hide = [binds.empty.hide];
                    }
                    binds.empty.hide.push(defaultBind.empty.hide);
                } else {
                        binds.empty??= {};
                    binds.empty.hide = defaultBind.empty.hide;
                }
                if (binds.not_empty?.show) {
                    if (!Array.isArray(binds.not_empty.show)) {
                        binds.not_empty.show = [binds.not_empty.show];
                    }
                    binds.not_empty.show.push(defaultBind.not_empty.show);
                } else {
                    binds.not_empty??= {};
                    binds.not_empty.show = defaultBind.not_empty.show;
                }
            } else {
                binds = defaultBind;
            }
            data.control = false;
            const f = createDocumentFragment(),
                browse = createElement('button',{class: 'builder_button tb_text_button tb_btn_arrow',type:'button'}),
                wr = createElement('','tb_lottie_wrap tf_rel tf_w'),
                fileWrap = self.create([
                    {   type: 'file',
                        ext: 'json',
                        id: 'path',
                        label: 'jsf',
                        binding: binds
                    }]),
                input = fileWrap.querySelector('input'),
                isRepeat = !!self.is_repeat,
                isMulti = !!data.multi,
            _callback = async (el, isChange, fid) => {
                let json = {},
                        wr = el.closest('.tb_field').parentNode.closest('.tb_field').tfClass('tb_lottie_wrap')[0];
                if (!loader) {
                    loader = createElement('','tf_loader tf_abs_c');
                    wr.appendChild(loader);
                }
                if (el.value) {
                    await Themify.loadJs('lottie', !!window.TF_Lottie);
                    json = await TF_Lottie.getJson(el.value);
                }
                const tmpMarkers = json.markers || [],
                        markers = new Map;
                if (tmpMarkers.length > 1) {
                    for (let i = 0; i < tmpMarkers.length; ++i) {
                        let mark = tmpMarkers[i],
                                cm = mark.cm;
                        if (cm) {
                            try {
                                let tmp = JSON.parse(cm);
                                cm = tmp.name;
                            } catch (e) {

                            }
                            markers.set(cm, {min: mark.tm, max: mark.tm + mark.dr});
                        }
                    }
                }
                let frame = fid && markers.has(fid) ? markers.get(fid) : {},
                        min = frame.min || 0,
                        max = frame.max?? (json.op ? Math.floor(json.op - json.ip) : '');
                max = ~~max || '';
                if (wr.childElementCount <= 1) {
                    const origVals = self.values,
                            origRepeat = !!self.is_repeat;
                    self.is_repeat = isRepeat;
                    self.values = vals;
                    wr.appendChild(self.create(this._getOptions(markers, min, max, vals.st, isMulti)));
                    self.is_repeat = origRepeat;
                    self.values = origVals;
                }
                const framesWrap = wr.tfClass('tb_lottie_frame_id')[0],
                        frameSelect = framesWrap.tfTag('select')[0],
                        sliderWrap = wr.tfClass('tb_lottie_range_id')[0].tfClass('tb_slider_wrapper')[0];
                if (markers.size === 0) {
                    framesWrap.style.display = 'none';
                }
                if (isChange) {
                    const range = sliderWrap.tfClass('tb_lb_option_child')[0] || sliderWrap.tfClass('tb_lb_option')[0],
                            fr = createDocumentFragment(),
                            items = sliderWrap.querySelectorAll('[type="range"]');
                    if (!fid) {
                        for (let children = frameSelect.children, i = children.length - 1; i > 0; --i) {
                            children[i].remove();
                        }
                    }
                    if (markers.size > 0) {
                        if (!fid) {
                            for (let k of markers.keys()) {
                                fr.appendChild(createElement('option',{value:k},k));
                            }
                        }
                        framesWrap.style.display = '';
                        frameSelect.appendChild(fr);
                    }
                    sliderWrap.tfClass('tb_slider_output_high')[0].dataset.slider_before = min;
                    sliderWrap.tfClass('tb_slider_output_low')[0].dataset.slider_after = max;
                    sliderWrap.style.setProperty('--tb_slider_min', min);
                    sliderWrap.style.setProperty('--tb_slider_before', min);
                    sliderWrap.style.setProperty('--tb_slider_after', max);
                    sliderWrap.style.setProperty('--tb_slider_max', max);
                    for (let i = items.length - 1; i > -1; --i) {
                        let item=items[i];
                        item.max = max;
                        item.min = min;
                        item.value = i === 0 ? min : max;
                    }
                    range.value = '';
                   Themify.triggerEvent(items[0], 'input');
                } else {
                    frameSelect.tfOn('change', e => {
                        e.stopPropagation();
                        _callback(el, true, e.currentTarget.value);
                    }, {passive: true});
                    setTimeout(() => {
                        self.callbacks();
                    }, 10000);
                }
                loader?.remove();
                loader = null;
            },
            updateWpMedia = () => {
                let frame = self.mediaFile._frames.json;
                if (frame !== undefined) {
                    frame = frame.content.get();
                    frame.collection.props.set({ignore: (+new Date())});
                    frame.options.selection.reset();
                }
            },
            openLibrary = async () => {
                api.Spinner.showLoader();
                try {
                    const opt = themifyBuilder.i18n.lottie_lib;
                    opt.all = i18n.all;
                    await Themify.loadJs(Themify.url + 'js/admin/modules/lottie-library', !!window.TF_LottieLibrary);
                    await TF_LottieLibrary.run(input, opt, themifyBuilder.nonce);
                    input.tfOff('change', updateWpMedia, {passive: true, once: true})
                            .tfOn('change', updateWpMedia, {passive: true, once: true});
                    api.Spinner.showLoader('done');

                } catch (e) {
                    api.Spinner.showLoader('error');
                }
            };
            browse.tfOn(_CLICK_, async e => {
                e.stopPropagation();
                openLibrary();
            }, {passive: true})
            .innerHTML = themifyBuilder.i18n.lottie_lib.browse;

            input.tfOn('change', e => {
                e.stopPropagation();
                _callback(e.currentTarget, true);
            }, {passive: true});

            wr.appendChild(loader);
            fileWrap.querySelector('.tb_input').appendChild(browse);
            f.append(fileWrap, wr);
            self.afterRun.push(() => {
                _callback(input, false, vals.fid);
                if (isMulti) {
                    if (self.is_new) {
                        openLibrary();
                    }
                    const wrapper = input.closest('.tb_row_js_wrapper');
                    if (wrapper.parentNode.tfClass('tb_lottie_export')[0] === undefined) {
                        const exportBtn = createElement('button',{class: 'builder_button tb_text_button tb_lottie_export',type:'button'},i18n.lottie.exp);
                        exportBtn.tfOn(_CLICK_, e => {
                            e.stopPropagation();
                            const opt = api.Forms.serialize('tb_options_setting', false);
                            for (let k in opt) {
                                if (k !== 'actions' && k !== 'loop') {
                                    delete opt[k];
                                }
                            }
                            const html = '<tf-lottie data-lazy="1" class="tf_w tf_lazy"><template>' + JSON.stringify(opt) + '</template></tf-lottie>',
                                    msg = i18n.lottie.copy.replaceAll('%html%', '<textarea style="border:0;outline:0;resize:none;display:inline-table;font-weight:bold;margin-top:20px" readonly class="tf_w">' + html + '</textarea>');
                            api.LiteLightBox.alert(msg);
                            const textarea = api.LiteLightBox.el.tfTag('textarea')[0],
                                    select = () => {
                                textarea.focus();
                                textarea.select();
                            };
                            textarea.tfOn(e.type, select, {passive: true});
                            select();
                        }, {passive: true});
                        wrapper.after(exportBtn);
                    }
                }
            });
            return f;
        }
    },
    icon_radio: {
        controlChange(wrap) {
            wrap.tfOn(_CLICK_, function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (e.target !== wrap) {
                    const input = e.target.closest('label').tfTag('input')[0];
                    if (input.checked === true) {
                        input.checked = false;
                        input.value = undefined;
                    } else {
                        input.checked = true;
                        input.value = input.dataset.value;
                    }
                    Themify.triggerEvent(input, 'change');
                }
            });
        },
        render(data, self) {
            return self.radioGenerate('icon_radio', data);
        }
    },
    radio: {
        controlChange(item) {
            const context = item.classList.contains('tb_radio_dnd') ? item.closest('.tb_repeatable_field_content') : (item.closest('.tb_tab,.tb_expanded_opttions') || api.LightBox.el),
                    elements = item.parentNode.parentNode.tfTag('input'),
                    selected = item.value,
                    groups = context.tfClass('tb_group_element_' + selected);
            for (let i = elements.length - 1; i > -1; --i) {
                let v = elements[i].value;
                if (selected !== v) {
                    let g = context.tfClass('tb_group_element_' + v);
                    for (let j = g.length - 1; j > -1; --j) {
                        g[j].style.display = 'none';
                    }
                }
            }
            for (let j = groups.length - 1; j > -1; --j) {
                groups[j].style.display = '';
            }
        },
        update(id, v, self) {
            const wrap = self.getEl(id);
            if (wrap !== null) {
                const items = wrap.tfTag('input'),
                        is_icon = wrap.classList.contains('tb_icon_radio');
                let found = null;
                for (let i = items.length - 1; i > -1; --i) {
                    if (items[i].value === v) {
                        found = items[i];
                        break;
                    }
                }
                if (found === null) {
                    const def = wrap.dataset.default;
                    if (def !== undefined) {
                        found = wrap.querySelector('[value="' + def + '"]');
                    }
                    if (is_icon === false && found === null) {
                        found = items[0];
                    }
                }

                if (found !== null) {
                    found.checked = true;
                    if (is_icon === false && wrap.classList.contains('tb_option_radio_enable')) {
                        this.controlChange(found);
                    }
                } else if (is_icon === true) {
                    for (let i = items.length - 1; i > -1; --i) {
                        items[i].checked = false;
                    }
                }
            }
        },
        render(data, self) {
            return self.radioGenerate('radio', data);
        }
    },
    icon_checkbox: {
        render(data, self) {
            return self.checkboxGenerate('icon_checkbox', data);
        }
    },
    checkbox: {
        update(id, v, self) {
            const wrap = self.getEl(id);
            if (wrap !== null) {
                const items = wrap.tfTag('input'),
                        js_wrap = wrap.classList.contains('tb_option_checkbox_enable');
                v = v?.toString().split('|') || [];
                for (let i = items.length - 1; i > -1; --i) {
                    items[i].checked = v.includes(items[i].value);
                    if (js_wrap === true) {
                        this.controlChange(items[i]);
                    }
                }
            }
        },
        controlChange(item) {
            const el = item.classList.contains('tb_radio_dnd') ? item.closest('.tb_repeatable_field_content') : api.LightBox.el,
                    parent = item.parentNode.parentNode,
                    items = parent.tfTag('input'),
                    is_revert = parent.classList.contains('tb_option_checkbox_revert');
            for (let i = items.length - 1; i > -1; --i) {
                let ch = el.tfClass('tb_checkbox_element_' + items[i].value),
                        is_checked = items[i].checked;
                for (let j = ch.length - 1; j > -1; --j) {
                    ch[j].classList.toggle('_tb_hide_binding', !((is_revert === true && is_checked === false) || (is_revert === false && is_checked === true)));
                }
            }
        },
        render(data, self) {
            return self.checkboxGenerate('checkbox', data);
        }
    },
    radioGenerate(type, data) {
        const d = createDocumentFragment(),
                wrapper = createElement('',{class:'tb_radio_wrap',tabindex:-1}),
                is_icon = 'icon_radio' === type,
                options = this.getOptions(data),
                v = this.getStyleVal(data.id),
                js_wrap = data.option_js === true,
                checked = [],
                self = this,
                len = options.length;
        let toggle = null,
                _default = data.default ?? false,
                id;
        if (len > 1) {
            if (data.new_line !== undefined) {
                wrapper.className += ' tb_new_line';
            }
            wrapper.className += ' tb_count_' + len;
        }
        if (js_wrap === true) {
            wrapper.className += ' tb_option_radio_enable';
        }
        if (is_icon === true) {
            wrapper.className += ' tb_icon_radio';
            toggle = data.no_toggle===undefined;
        }
        if (this.is_repeat === true) {
            wrapper.className += this.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
            id = 'tb_' + Math.random().toString(36).substr(2, 7);
            wrapper.dataset.inputId = data.id;
        } else {
            wrapper.className += ' tb_lb_option';
            wrapper.id = id = data.id;
        }
        if (_default !== false) {
            wrapper.dataset.default = _default;
        } 
        else if ( is_icon === false && v === undefined && options[0] ) {
            _default = options[0].value;
        }
        if (data.before !== undefined) {
            d.appendChild(createTextNode(data.before));
        }
        for (let i = 0; i < len; ++i) {
            let  cl = [],
                opt = options[i],
                n = i18n[opt.name] || opt.name,
                label = createElement('label',opt.class),
                ch = createElement('input',{type:'radio',name:id,value:opt.value});

            if (is_icon === true) {
                ch.dataset.value = opt.value;
            }
            if (this.is_repeat === true) {
                cl.push('tb_radio_dnd');
            }
            if (data.class !== undefined) {
                cl.push(data.class);
            }
            if (cl.length > 0) {
                ch.className = cl.join(' ');
            }
            if (opt.disable === true) {
                ch.disabled = true;
            }
            if (v === opt.value || (v === undefined && _default === opt.value)) {
                ch.checked = true;
                if (js_wrap === true) {
                    checked.push(ch);
                }
            }
            label.appendChild(ch);
            if (js_wrap === true) {
                ch.tfOn('change', function () {
                    this.parentNode.parentNode.blur();
                    self.radio.controlChange(this);
                }, {passive: true});
            }
            if (is_icon === true) {
                if (opt.icon !== undefined) {
                    let icon_wrap = createElement('span','tb_icon_wrapper');
                    icon_wrap.innerHTML = opt.icon;
                    label.appendChild(icon_wrap);
                }
                if (opt.label_class !== undefined) {
                    label.className += opt.label_class;
                }
                if (n !== undefined) {
                    label.appendChild(createElement('span','themify_tooltip',n));
                }

            } else if (n !== undefined) {
                label.appendChild(createElement('span','',n));
            }
            wrapper.appendChild(label);
            this._initControl(ch, data);
        }
        wrapper.tfOn(_CLICK_, function (e) {
            if ('LABEL' === e.target.parentNode.tagName) {
                this.blur();
            }
        }, {passive: true});
        d.appendChild(wrapper);
        if (data.after !== undefined) {
            d.appendChild(self.after(data));
        }
        if (data.description !== undefined) {
            d.appendChild(self.description(data.description));
        }
        if (is_icon === true && toggle === true) {
            self.icon_radio.controlChange(wrapper);
        }
        if (js_wrap === true) {
            this._radioChange.push(() => {
                for (let i = 0, len = checked.length; i < len; ++i) {
                    self.radio.controlChange(checked[i]);
                }
            });
        }
        return d;
    },
    checkboxGenerate(type, data) {
        const d = createDocumentFragment(),
                wrapper = createElement('','tb_checkbox_wrap'),
                options = this.getOptions(data),
                is_icon = 'icon_checkbox' === type,
                js_wrap = data.option_js === true,
                self = this,
                chekboxes = [],
                len = options.length;
        let v = this.getStyleVal(data.id),
                _default = null,
                is_array = null;

        if (len > 1) {
            if (data.new_line === false) {
                wrapper.className += ' tb_one_row';
            }
            wrapper.className += ' tb_count_' + len;
        }
        if (js_wrap === true) {
            wrapper.className += ' tb_option_checkbox_enable';
            if (data.reverse !== undefined) {
                wrapper.className += ' tb_option_checkbox_revert';
            }
        }
        if (this.is_repeat === true) {
            wrapper.className += this.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
            wrapper.dataset.inputId = data.id;
        } else {
            wrapper.className += ' tb_lb_option';
            wrapper.id = data.id;
        }
        if (data.wrap_checkbox !== undefined) {
            wrapper.className += ' ' + data.wrap_checkbox;
        }
        if (v === undefined) {
            if (data.default !== undefined) {
                _default = data.default;
                is_array = Array.isArray(_default);
            }
        }
        else if (v !== false) {
            v = v.toString().split('|');
        }
        if (is_icon === true) {
            wrapper.className += ' tb_icon_checkbox';
        }
        if (data.before !== undefined) {
            d.appendChild(createTextNode(data.before));
        }
        for (let i = 0; i < len; ++i) {
            let opt = options[i],
                n = i18n[opt.value] || opt.value,
                label = createElement('label'),
                ch = createElement('input',{type:'checkbox',class:'tb_checkbox',value:opt.name});
            ch.checked = (v !== false && v?.includes(opt.name)) || (_default === opt.name || (is_array === true && _default.includes(opt.name)));
            if (data.class !== undefined) {
                ch.className += ' ' + data.class;
            }
            if (js_wrap === true) {
                ch.tfOn('change', function () {
                    self.checkbox.controlChange(this);
                }, {passive: true});
                chekboxes.push(ch);
            }
            if (data.id === 'hide_anchor') {
                api.activeModel.options(ch, 'hide_anchor');
            }
            label.appendChild(ch);
            if (is_icon === true) {
                label.insertAdjacentHTML('beforeend', opt.icon);
                if (n !== undefined) {
                    label.appendChild(createElement('span','themify_tooltip',n));
                }
            } else if (n !== undefined) {
                label.appendChild(createTextNode(n));
            }
            if (opt.help !== undefined) {
                let hasHelp = createElement('','tb_checkbox_help');
                hasHelp.append(label, this.help(opt.help));
                label = hasHelp;
            }
            wrapper.appendChild(label);
            this._initControl(ch, data);
        }
        if (data.id === 'hide_anchor') {
            wrapper.tfOn(_CLICK_, e => {
                e.stopPropagation();
            });
        }
        d.appendChild(wrapper);
        if (data.after !== undefined) {
            if ((data.label === undefined || data.label === '') && (data.help !== undefined && data.help !== '')) {
                wrapper.className += ' contains-help';
                wrapper.appendChild(this.after(data));
            } else {
                d.appendChild(this.after(data));
            }
        }
        if (data.description !== undefined) {
            d.appendChild(this.description(data.description));
        }
        if (js_wrap === true) {
            this.afterRun.push(() => {
                for (let i = 0, len = chekboxes.length; i < len; ++i) {
                    self.checkbox.controlChange(chekboxes[i]);
                }
            });
        }
        return d;
    },
    date: {
        _loaded: null,
        render(data, self) {
            const f = createDocumentFragment(),
                    input = createElement('input',{type:'text',class:'themify-datepicker fullwidth',autocomplete:'off',readonly:''}),
                    clear = createElement('button',{type:'button',class:'themify-datepicker-clear tf_close'}),
                    get_datePicker = () => {
                return topWindow.jQuery.fn.themifyDatetimepicker
                        ? topWindow.jQuery.fn.themifyDatetimepicker
                        : topWindow.jQuery.fn.datetimepicker;
            },
                    hide_picker = () => {
                get_datePicker().call($(input), 'hide');
            },
                    callback = () => {
                const datePicker = get_datePicker();

                if (!datePicker)
                    return;

                const pickerData = data.picker?? {};
                clear.tfOn(_CLICK_, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    input.value = '';
                    input.dispatchEvent(new Event('change'));
                    this.style.display = 'none';
                });
                datePicker.call($(input), {
                    showTimepicker: !!(data.timepicker === undefined || data.timepicker),
                    showButtonPanel: true,
                    changeYear: true,
                    dateFormat: pickerData.dateformat || 'yy-mm-dd',
                    timeFormat: pickerData.timeformat || 'HH:mm:ss',
                    stepMinute: pickerData.stepMinute || 5,
                    stepSecond: pickerData.stepSecond || 5,
                    controlType: pickerData.timecontrol || 'select',
                    oneLine: true,
                    separator: pickerData.timeseparator || ' ',
                    onSelect(v) {
                        clear.style.display = v === '' ? 'none' : 'block';
                        input.dispatchEvent(new Event('change'));
                    },
                    beforeShow(input, instance) {
                        instance.dpDiv.addClass('themify-datepicket-panel');
                        const r = input.getBoundingClientRect();
                        setTimeout(() => {
                            instance.dpDiv.css({
                                top: r.top + input.offsetHeight,
                                left: r.left
                            });
                        }, 10);
                        if (api.isVisual) {
                            body.tfOn(_CLICK_, hide_picker, {once: true});
                        }
                    },
                    onClose() {
                        if (api.isVisual) {
                            body.tfOff(_CLICK_, hide_picker, {once: true});
                        }
                    }
                });
            };
            if (self.is_repeat === true) {
                input.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                input.dataset.inputId = data.id;
            } else {
                input.className += ' tb_lb_option';
                input.id = data.id;
            }
            if (self.values[data.id] !== undefined) {
                input.value = self.values[data.id];
            }
            if (data.class !== undefined) {
                input.className += ' ' + data.class;
            }
            if (!input.value) {
                clear.style.display = 'none';
            }
            f.append(self._initControl(input, data), clear);
            if (data.after !== undefined) {
                f.appendChild(self.after(data));
            }
            if (data.description !== undefined) {
                f.appendChild(self.description(data.description));
            }
            if (this._loaded === null) {
                const init = () => {
                    topThemify.loadCss(Themify.url + 'themify-metabox/css/jquery-ui-timepicker.min');
                    topThemify.loadJs(Themify.includesURL + 'js/jquery/ui/datepicker.min', topWindow.jQuery.fn.datepicker !== undefined, themify_vars.wp).then(() => {
                        topThemify.loadJs(Themify.url + 'themify-metabox/js/jquery-ui-timepicker.min', topWindow.jQuery.fn.themifyDatetimepicker !== undefined || topWindow.jQuery.fn.datetimepicker !== undefined, '1.6.3').then(() => {
                            this._loaded = true;
                            setTimeout(callback, 10);
                        });
                    });
                };
                self.afterRun.push(init);
            } else {
                self.afterRun.push(callback);
            }
            return f;
        }
    },
    gradient: {
        _controlChange(self, gradient, input, clear, type, angle, circle, text, update) {
            let angleV = self.getStyleVal(angle.id);
            if (angleV === undefined || angleV === '') {
                angleV = 180;
            }
            let is_removed = false,
                    $gradient = $(gradient),
                    id = input.id,
                    value = self.getStyleVal(id),
                    args = {
                        angle: angleV,
                        onChange(stringGradient, cssGradient) {
                            if (is_removed) {
                                stringGradient = cssGradient = '';
                            }
                            input.value = stringGradient;
                            if (api.isVisual) {
                                Themify.triggerEvent(input, 'themify_builder_gradient_change', {val: cssGradient});
                            }
                        }
                    };
            if (value) {
                args.gradient = value;
                input.value = value;
            }
            angle.value = angleV;

            let typeV = self.getStyleVal(type.id);
            if (typeV === undefined || typeV === '') {
                typeV = 'linear';
            }
            type.value = typeV;
            args.type = typeV;
            if (circle.checked) {
                args.circle = true;
            }
            if (!update) {
                $gradient.ThemifyGradient(args);
            }
            const instance = $gradient.data('themifyGradient'),
                    callback = val => {
                        let p = angle.parentNode;
                        if (!p.classList.contains('tb_angle_container')) {
                            p = angle;
                        }

                        text.style.display = p.style.display = val === 'radial' ? 'none' : '';
                        circle.parentNode.style.display = val === 'radial' ? '' : 'none';
                    };
            if (update) {
                instance.settings = {...instance.settings, ...args};
                instance.settings.type = typeV;
                instance.settings.circle = circle.checked;
                instance.isInit = false;
                instance.update();
                instance.isInit = true;
            } else {
                clear.tfOn(_CLICK_, e => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    is_removed = true;
                    instance.settings.gradient = $.ThemifyGradient.default;
                    instance.update();
                    is_removed = false;
                });

                type.tfOn('change', function () {
                    const v = this.value;
                    instance.setType(v);
                    callback(v);
                }, {passive: true});

                circle.tfOn('change', function () {
                    instance.setRadialCircle(this.checked);
                }, {passive: true});

                angle.tfOn('keyup', function () {
                    let val = parseInt(this.value);
                    if (isNaN(val)) {
                        val = 0;
                    }
                    instance.setAngle(val);
                }, {passive: true});

                gradient.appendChild(clear);
            }
            callback(self.getStyleVal(type.id));
        },
        update(id, v, self) {
            const nid = id + '-gradient',
                    input = self.getEl(nid);
            if (input !== null) {
                const angle = self.getEl(nid + '-angle'),
                        type = self.getEl(nid + '-type'),
                        circle = self.getEl(id + '-circle-radial');
                this._controlChange(self, input.previousElementSibling, input, null, type, angle, circle.tfClass('tb_checkbox')[0], circle.previousElementSibling, true);
            }
        },
        render(data, self) {
            const id=data.id,
                wrap = createElement('','themify-gradient-field tf_w tf_rel'),
                    text = createElement('span','',i18n.rotation),
                    gradient = createElement('','tb_gradient_container tf_w'),
                    input = createElement('input',{type:'hidden',class:'themify-gradient tb_lb_option',id:id+ '-gradient','data-id':id}),
                    clear = createElement('button',{type:'button',class:'tb_clear_gradient tf_close'}),
                    select = self.select.render({
                        options: {
                            linear: 'linear',
                            radial: 'radial'
                        },
                        class: 'themify-gradient-type',
                        id: id + '-gradient-type',
                        control: false
                    }, self);
            if (data.option_js !== undefined) {
                wrap.className += ' tb_group_element_gradient';
            }
            clear.appendChild(createElement('span','themify_tooltip',i18n.clear_gradient));

            const angleData = api.Helper.cloneObject(data);
            angleData.id = id + '-gradient-angle';
            const angleWarp = self.angle.render(angleData, self);
            wrap.append(select, angleWarp, text, self.checkboxGenerate('checkbox',
                    {
                        id: id + '-circle-radial',
                        options: [{name: '1', value: 'circle_radial'}]
                    }
            ), gradient, input);

            self._initControl(input, data);
            self.afterRun.push(() => {
                this._controlChange(self, gradient, input, clear, wrap.querySelector('.themify-gradient-type'), angleWarp.tfClass('tb_angle_input')[0], wrap.tfClass('tb_checkbox')[0], text);
            });
            return wrap;
        }
    },
    fontColor: {
        update(id, v, self) {
            self.radio.update(id, self.getStyleVal(id), self);
        },
        render(data, self) {
            data.isFontColor = true;
            const roptions = {
                id: data.id,
                type: 'radio',
                option_js: true,
                isFontColor: true,
                options: [
                    {value: data.s + '_solid', name: 'solid'},
                    {value: data.g + '_gradient', name: 'gradient'}
                ]
            },
                    radioWrap = self.radioGenerate('radio', roptions),
                    radio = radioWrap.querySelector('.tb_lb_option'),
                    colorData = api.Helper.cloneObject(data);
            colorData.label = '';
            colorData.type = 'color';
            colorData.id = data.s;
            colorData.prop = 'color';
            colorData.wrap_class = 'tb_group_element_' + data.s + '_solid';

            const color = self.create([colorData]);

            colorData.id = data.g;
            colorData.wrap_class = 'tb_group_element_' + data.g + '_gradient';
            colorData.type = 'gradient';
            colorData.prop = 'background-image';

            const gradient = self.create([colorData]);
            self.afterRun.push(() => {
                const field = radio.parentNode.closest('.tb_field');
                field.parentNode.insertBefore(color, field.nextElementSibling);
                field.parentNode.insertBefore(gradient, field.nextElementSibling);
            });
            data.label??= 'f_c';
            return radioWrap;
        }
    },
    imageGradient: {
        update(id, v, self) {
            self.radio.update(id + '-type', self.getStyleVal(id + '-type'), self);
            self.mediaFile.update(id, v, self);
            self.gradient.update(id, v, self);
            const el = self.getEl(id);
            if (el !== null) {
                let p = el.closest('.tb_tab'),
                        imageOpt = p.tfClass('tb_image_options'),
                        eid = p.tfClass('tb_gradient_image_color')[0].tfClass('tfminicolors-input')[0].id;
                self.color.update(eid, self.getStyleVal(eid), self);
                for (let i = 0; i < imageOpt.length; ++i) {
                    eid = imageOpt[i].tfClass('tb_lb_option')[0].id;
                    self.select.update(eid, self.getStyleVal(eid), self);
                }
            }
        },
        render(data, self) {
            const wrap = createElement('','tb_image_gradient_field'),
                imageWrap = createElement('', 'tb_group_element_image tf_w tf_rel');
            wrap.appendChild(self.radioGenerate('radio',
                    {   type: data.type,
                        id: data.id + '-type',
                        options: [
                            {name: 'image', value: 'image'},
                            {name: 'gradient', value: 'gradient'}
                        ],
                        option_js: true
                    }
            ));
            if (data.option_js === undefined) {
                data.option_js = true;
            }
            if (data.binding === undefined) {
                data.binding = {
                    empty: {
                        hide: 'tb_image_options'
                    },
                    not_empty: {
                        show: 'tb_image_options'
                    }
                };
            }
            const extend = api.Helper.cloneObject(data);
            extend.type = 'image';
            //image
            imageWrap.appendChild(self.mediaFile.render('image', api.Helper.cloneObject(extend), self));
            wrap.appendChild(imageWrap);
            //gradient
            extend.type = 'gradient';
            delete extend.class;
            delete extend.binding;
            wrap.appendChild(self.gradient.render(extend, self));
            self.afterRun.push(() => {
                const group = {
                    wrap_class: 'tb_group_element_image tf_w tf_rel',
                    type: 'group',
                    options: []
                };
                //color
                extend.prop = 'background-color';
                extend.wrap_class = 'tb_gradient_image_color';
                extend.label = 'bg_c';
                extend.type = 'color';
                extend.id = extend.colorId;
                group.options.push(api.Helper.cloneObject(extend));

                //repeat
                extend.prop = 'background-mode';
                extend.wrap_class = 'tb_image_options';
                extend.label = 'b_r';
                extend.repeat = true;
                extend.type = 'select';
                extend.id = extend.repeatId;
                group.options.push(api.Helper.cloneObject(extend));

                //position
                extend.prop = 'background-position';
                extend.wrap_class = 'tb_image_options';
                extend.label = 'b_p';
                extend.position = true;
                extend.type = 'position_box';
                extend.id = extend.posId;
                delete extend.repeat;
                group.options.push(api.Helper.cloneObject(extend));

                imageWrap.parentNode.closest('.tb_field').after(self.create([group]));
            });
            data.label??= 'bg';
            return wrap;
        }
    },
    layout: {
        _controlChange(el) {
            el.tfOn(_CLICK_, function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.target !== el) {
                    const selected = e.target.closest('a');
                    if (selected !== null) {
                        const items = this.tfClass('tfl-icon');
                        for (let i = items.length - 1; i > -1; --i) {
                            items[i].classList.remove('selected');
                        }
                        selected.classList.add('selected');
                        Themify.triggerEvent(this, 'change', {val: selected.id});
                    }
                }
            });
        },
        update(id, v, self) {
            const input = self.getEl(id);
            if (input !== null) {
                const items = input.tfClass('tfl-icon');
                for (let i = items.length - 1; i > -1; --i) {
                    items[i].classList.toggle('selected', v === items[i].id);
                }
                if (v === undefined) {
                    let def = input.dataset.default;
                    def = def === undefined ? items[0] : def.querySelector('#' + def);
                    def.classList.add('selected');
                }
            }
        },
        render(data, self) {
            let p = createElement('','themify-layout-icon'),
                options = self.getOptions(data),
                v = self.getStyleVal(data.id);

            if (data.color === true && data.transparent === true) {
                options = [...options];
                options.push({img: 'transparent', value: 'transparent', label: i18n.transparent});
            }
            if (self.is_repeat === true) {
                p.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                p.dataset.inputId = data.id;
            } else {
                p.className += ' tb_lb_option';
                p.id = data.id;
            }
            if (data.class !== undefined) {
                p.className += ' ' + data.class;
            }

            if (v === undefined) {
                if(data.default!==undefined){
                    v=data.default;
                }
                else{
                    const def = api.activeModel.type === 'module' ? api.activeModel.getPreviewSettings() : null;
                    v = def?.[data.id] ?? (options[0].value || '');
                }
                self.settings[data.id] = v;
            }
            v = v.toString();
            for (let i = 0; i < options.length; ++i) {
                let {value:optV='',img,label} = options[i],
                    a = createElement('a',{href:'#',class:'tfl-icon',id:optV}),
                    tooltip = createElement('span','themify_tooltip',(i18n[label] || label)),
                    sprite;
                if (v === optV.toString()) {
                    a.className += ' selected';
                }
                if (data.mode === 'sprite' && !img.includes('.png')) {
                    sprite = createElement('span','tb_sprite');
                    if (img.includes('http')) {
                        sprite.style.backgroundImage = 'url(' + img + ')';
                    } else {
                        sprite.className += ' tb_' + img;
                    }
                } 
                else {
                    sprite = new Image();
                    sprite.alt = i18n[label] || label;
                    sprite.src = img.includes('http') ? img : Themify.builder_url + 'editor/img/' + img;
                }

                a.append(sprite, tooltip);
                p.appendChild(a);
            }
            this._controlChange(p);
            if (self.component === 'row' && (data.id === 'row_width' || data.id === 'row_height')) {
                api.activeModel.options(p, data.type);
            } else {
                self._initControl(p, data);
            }
            return p;
        }
    },
    layoutPart: {
        data: [],
        async get() {
            if (this.data.length === 0) {
                try {
                    api.Spinner.showLoader();
                    this.data = await api.LocalFetch({action: 'tb_get_library_items'});
                    api.Spinner.showLoader('done');
                } catch (e) {
                    api.Spinner.showLoader('error');
                    throw e;
                }
            }
        },
        render(data, self) {
            data.setOptions = false;
            const s = self.values[data.id],
                    d = createDocumentFragment(),
                    selectWrap = self.select.render(data, self),
                    edit = createElement('a'),
                    add = createElement('a'),
                    select = selectWrap.querySelector('select');

            this.get().then(() => {
                const currentLayoutId = api.LayoutPart?.id ? api.LayoutPart.id.toString() : null,
                    arr=this.data;
                select.appendChild(createElement('option'));
                for (let i = 0; i < arr.length; ++i) {
                    if (currentLayoutId !== arr[i].id.toString()) {
                        let opt = createElement('option',{value:arr[i].post_name},arr[i].post_title);
                        if (s === arr[i].post_name) {
                            opt.selected = true;
                        }
                        select.appendChild(opt);
                    }
                }
            });
            d.append(selectWrap, createElement('br'));
            if (data.add_url) {
                add.href = data.add_url;
                add.className = 'add_new tf_plus_icon tb_icon_btn tf_rel';
                add.textContent = i18n.nlayout;
                d.appendChild(add);
            }
            if (data.edit_url) {
                edit.target = add.target = '_blank';
                edit.className = 'tb_icon_btn';
                edit.href = data.edit_url;
                edit.append(api.Helper.getIcon('ti-folder'), createTextNode(i18n.mlayout));
                d.appendChild(edit);
            }
            return d;
        }
    },
    separator: {
        render(data, self) {
            let seperator;
            const label = data.label??'f',
                    txt = i18n[label]?? label;
            if (txt) {
                seperator = data.wrap_class !== undefined ? createElement() : createDocumentFragment();
                seperator.append(createElement('hr'), createElement('h4','',txt));
                if (data.wrap_class !== undefined) {
                    seperator.className = data.wrap_class;
                }
            } else if (data.html !== undefined) {
                const tmp = createElement();
                tmp.innerHTML = data.html;
                seperator = tmp.firstChild;
                if (data.wrap_class !== undefined) {
                    seperator.className = data.wrap_class;
                }
            } else {
                seperator = createElement('hr');
                if (data.wrap_class !== undefined) {
                    seperator.className = data.wrap_class;
                }
            }
            return seperator;
        }
    },
    template_fields: {
        render(data, self) {
            const div = createElement('','tb_template_fields'),
                target=data.target;
            div.appendChild(createElement('h4','',i18n[data.title] || data.title));
            for (let i = 0; i < data.fields.length; i++) {
                div.appendChild(createElement('span','',data.fields[ i ]));
            }
            if (data.extra) {
                const temp = createElement();
                temp.innerHTML = i18n[data.extra] || data.extra;
                div.appendChild(temp.firstChild);
            }
            if (target) { /* element to recieve the text */
                div.tfOn(_CLICK_, e => {
                    if (e.target.tagName === 'SPAN') {
                        const targetEl = self.getEl(target);
                        if (targetEl) {
                            const position = targetEl.selectionStart;
                            targetEl.value = targetEl.value.substring( 0, position ) + ' ' + e.target.textContent + targetEl.value.substring( position, targetEl.value.length );
                            Themify.triggerEvent(targetEl, 'keyup');
                        }
                    }
                }, {passive: true});
            }
            return div;
        }
    },
    multiColumns: {
        update(id, v, self) {
            const item = self.getEl(id);
            if (item !== null) {
                if (v !== undefined) {
                    item.value = v;
                } else if (item[0] !== undefined) {
                    item[0].selected = true;
                }
            }
        },
        render(data, self) {
            const opt = [],
                    {id,selector}= data,
                    columnOptions = [
                        {
                            id: id + '_gap',
                            label: 'c_g',
                            type: 'range',
                            prop: 'column-gap',
                            selector: selector,
                            wrap_class: 'tb_multi_columns_wrap',
                            units: {
                                px: {
                                    max: 500
                                }
                            }
                        },
                        {   type: 'multi',
                            wrap_class: 'tb_multi_columns_wrap',
                            label: 'c_d',
                            options: [
                                {
                                    type: 'color',
                                    id: id + '_divider_color',
                                    prop: 'column-rule-color',
                                    selector: selector
                                },
                                {
                                    type: 'range',
                                    id: id + '_divider_width',
                                    class: 'tb_multi_columns_width',
                                    prop: 'column-rule-width',
                                    selector: selector,
                                    units: {
                                        px: {
                                            max: 500
                                        }
                                    }
                                },
                                {
                                    type: 'select',
                                    id: id + '_divider_style',
                                    options: self.getOptions('border'),
                                    prop: 'column-rule-style',
                                    selector: selector
                                }
                            ]
                        }


                    ];
            for (let i = 0; i < 7; ++i) {
                opt[i] = i === 0 ? '' : i;
            }
            data.options = opt;
            data.binding = {
                empty: {
                    hide: 'tb_multi_columns_wrap'
                },
                not_empty: {
                    show: 'tb_multi_columns_wrap'
                }
            };
            const ndata = api.Helper.cloneObject(data);
            ndata.type = 'select';
            const wrap = self.select.render(ndata, self),
                    select = wrap.querySelector('select');
            self.afterRun.push(() => {
                const field = select.closest('.tb_field');
                field.parentNode.insertBefore(self.create(columnOptions), field.nextElementSibling);

            });

            data.label??= 'c_c';
            return wrap;
        }
    },
    expand: {
        render(data, self) {
            const wrap = createElement('fieldset', 'tb_expand_wrap'),
                    expand = createElement('','tb_expanded_opttions'),
                    toggle = createElement('','tb_style_toggle tb_closed');
            toggle.append(createTextNode(i18n[data.label] ?? data.label), api.Helper.getIcon('ti-angle-up'));

            toggle.tfOn(_CLICK_, function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (this.dataset.done === undefined) {
                    this.dataset.done = true;
                    expand.appendChild(self.create(data.options));
                    self._setUpEditors();
                    self.callbacks();
                    Themify.trigger('tb_options_expand', expand);
                }
                this.classList.toggle('tb_closed');
            });
            wrap.append(toggle, expand);
            self.afterRun.push(() => {
                Themify.trigger('tb_options_expand', expand);
            });
            return wrap;
        }
    },
    gallery: {
        file_frame: null,
        cache: new Map,
        parseIds(shortcode){
            const tmp = shortcode.replace(/[\r\n]/gm, '').replace(/  +/g, ' ').match(/ids.*?=.(.+?)["']/gi);
            return tmp?.[0]?.replace('ids', '').replace('=', '').replaceAll(' ', '').replace(/["']/g, '').trim().split(',') || null;
        },
        replaceShortcode(oldV, newV) {
            return oldV.replace(/[\r\n]/gm, '').replace(/  +/g, ' ').replace(/ids.*?=.(.+?)["']/ig, 'ids="' + newV + '"');
        },
        getCache(ids){
            const res=[];
            for(let i=0;i<ids.length;++i){
                let item=this.cache.get(ids[i].toString());
                if(!item){
                    return;
                }
                res.push(item);
            }
            return res;
        },
        setCache(res){
            for(let i=res.length-1;i>-1;--i){
                this.cache.set(res[i].id.toString(), res[i]);
            }
        },
        getSelectedImages(collections){
            const res=[];
            for(let i=0;i<collections.length;++i){
                let attr=collections[i].attributes,
                    sizes=attr.sizes,
                    item={
                        id:attr.id,
                        link:attr.link,
                        title:attr.title,
                        caption:attr.caption
                    };
                if(sizes){
                    for(let k in sizes){
                        let s=sizes[k];
                        item[k]=k==='thumbnail'?s.url:[s.url,s.width,s.height];
                    }
                }
                res.push(item);
            }
            this.setCache(res);
            return res;
        },
        async getImages(shortcode){
            let ids=this.parseIds(shortcode),
                res;
            if(!ids){
                const tmp = shortcode.replace(/[\r\n]/gm, '').replace(/  +/g, ' ').match(/path.*?=.(.+?)["']/gi),
                images= tmp?.[0]?.replace('path', '').replace('=', '').replaceAll(' ', '').replace(/["']/g, '').trim().split(',');
                if(images){
                    res=[];
                    for(let i=0;i<images.length;++i){
                        res.push({
                            thumbnail:images[i]
                        });
                    }
                    return res;
                }
            }
            if(ids){
                res=this.getCache(ids);
                if(!res){
                    try {
                        let prmsK='pr_'+ids.join(','), 
                            prms=this.cache.get(prmsK);
                        if(!prms){
                            prms = api.LocalFetch({
                                action: 'tb_get_ajax_data',
                                dataset: 'gallery_shortcode',
                                val: shortcode
                            });
                            this.cache.set(prmsK,prms);
                        }
                        res=await prms;
                        if (!res.success) {
                            throw '';
                        }
                        res = res.data;
                        this.setCache(res);
                    } 
                    catch (e) {
                        api.Spinner.showLoader('error');
                        throw e;
                    }
                }
            }
            return res;
        },
        async init(btn, input) {
            let timer;
            const clone = wp.media.gallery.shortcode,
                    isInLine=!api.LightBox.el.contains(btn),
                    openMediaLibrary = e => {
                        e?.stopPropagation();
                        if (this.file_frame === null) {
                            // Create the media frame.
                            this.file_frame = wp.media.frames.file_frame = wp.media({
                                frame: 'post',
                                state: 'gallery-library',
                                library: {
                                    type: 'image'
                                },
                                title: wp.media.view.l10n.editGalleryTitle,
                                editing: true,
                                multiple: true,
                                selection: false
                            });
                            this.file_frame.el.classList.add('themify_gallery_settings');
                        } else {
                            this.file_frame.options.selection.reset();
                        }
                        wp.media.gallery.shortcode = attachments => {
                            const props = attachments.props.toJSON(),
                                    attrs = {};
                            if (props.order) {
                                attrs.order = props.order;
                            }
                            if (props.orderby) {
                                attrs.orderby = props.orderby;
                            }
                            if (attachments.gallery) {
                                Object.assign(attrs,attachments.gallery.toJSON());
                            }
                            attrs.ids = attachments.pluck('id');
                            // Copy the `uploadedTo` post ID.
                            if (props.uploadedTo) {
                                attrs.id = props.uploadedTo;
                            }
                            // Check if the gallery is randomly ordered.
                            if ( attrs._orderbyrandom || attrs._orderbyRandom ) {
                                attrs.orderby = 'rand';
                                delete attrs._orderbyrandom;
                                delete attrs._orderbyRandom;
                            }
                            // If the `ids` attribute is set and `orderby` attribute
                            // is the default value, clear it for cleaner output.
                            else if (attrs.ids && 'post__in' === attrs.orderby) {
                                delete attrs.orderby;
                            }
                            // Remove default attributes from the shortcode.
                            for (let key in wp.media.gallery.defaults) {
                                if (wp.media.gallery.defaults[key] === attrs[key]) {
                                    delete attrs[key];
                                }
                            }
                            delete attrs._orderByField;
                            delete attrs._orderbyfield;
                            const shortcode = new topWindow.wp.shortcode({
                                tag: 'gallery',
                                attrs: attrs,
                                type: 'single'
                            });
                            wp.media.gallery.shortcode = clone;
                            return shortcode;
                        };

                        const v = input.value.trim(),
                                setShortcode = selection => {
                                    const v = wp.media.gallery.shortcode(selection).string().slice(1, -1);
                                    input.value = '[' + v + ']';
                                    Themify.triggerEvent(input, 'change',{images:this.getSelectedImages(selection.models),models:selection.models});
                                };
                        if (v.length > 0) {
                            this.file_frame = wp.media.gallery.edit(v);
                            this.file_frame.state('gallery-edit');
                        } else {
                            this.file_frame.state('gallery-library');
                            this.file_frame.open();
                            this.file_frame.$el.find('.media-menu .media-menu-item').last().trigger('click');
                        }
                        this.file_frame.off('update', setShortcode).on('update', setShortcode);
                    },
                    val = input.value.trim(),
                    removeItem = e => {
                        const el =e.target?.closest('.tf_close[data-id]');
                        if (el) {
                            e.stopPropagation();
                            const textarea = e.currentTarget.parentNode.tfTag('textarea')[0],
                                    value = textarea.value,
                                    ids = this.parseIds(value),
                                    index = ids?.indexOf(el.dataset.id) ?? -1;
                            if (index !== -1) {
                                ids.splice(index, 1);
                                el.parentNode.remove();
                                textarea.value = ids.length > 0 ? this.replaceShortcode(value, ids.join(',')) : '';
                                clearTimeout(timer);
                                timer = setTimeout(() => {
                                    Themify.triggerEvent(textarea, 'change',{remove:1});
                                    timer = null;
                                }, 400);
                            }
                        }
                    },
                    sort = e => {
                        if (e.button === 0) {
                            const el = e.target && !e.target.classList.contains('tf_close') ? e.target.closest('.tb_gal_item') : null;
                            if (el) {
                                e.stopImmediatePropagation();
                                let timer,
                                        clone,
                                        box,
                                        holderHeight,
                                        holderWidth,
                                        dir,
                                        prevY,
                                        prevX,
                                        theLast,
                                        self=this,
                                        ownerDocument = el.ownerDocument,
                                        _startDrag = e => {
                                            e.stopImmediatePropagation();
                                            ownerDocument.body.classList.add('tb_start_animate', 'tb_sort_start');
                                            const _this = e.currentTarget,
                                                    b = _this.getBoundingClientRect(),
                                                    parentNode = _this.parentNode;
                                            clone = el.cloneNode(true);
                                            clone.classList.add('tb_gal_clone');
                                            _this.after(clone);
                                            _this.classList.add('tb_sort_handler');
                                            box = parentNode.getBoundingClientRect();
                                            holderHeight = (b.height / 2) - parentNode.offsetTop;
                                            holderWidth = (b.width / 2) - parentNode.offsetLeft;
                                            _move(e);
                                        },
                                        _move = e => {
                                            e.stopImmediatePropagation();
                                            let x = e.clientX,
                                                    y = e.clientY;
                                            if (x < box.left) {
                                                x = box.left;
                                            } else if (x > box.right) {
                                                x = box.right;
                                            }
                                            if (y < box.top) {
                                                y = box.top;
                                            } else if (y > box.bottom) {
                                                y = box.bottom;
                                            }
                                            const moveTo = ownerDocument.elementFromPoint(x, y),
                                                    clientX = x - holderWidth - box.left,
                                                    clientY = y - holderHeight - box.top;

                                            e.currentTarget.style.transform = 'translate(' + clientX + 'px,' + clientY + 'px)';

                                            if (moveTo && moveTo !== e.currentTarget && moveTo.classList.contains('tb_gal_item')) {
                                                const side = y > prevY || x > prevX ? 'bottom' : 'top';
                                                if (dir !== side || theLast !== moveTo) {
                                                    side === 'bottom' ? moveTo.after(clone) : moveTo.before(clone);
                                                }
                                                theLast = moveTo;
                                                dir = side;
                                            }
                                            prevY = y;
                                            prevX = x;
                                        },
                                        _up = function (e) {
                                            e.stopImmediatePropagation();
                                            cancelAnimationFrame(timer);
                                            this.tfOff('pointermove', _startDrag, {passive: true, once: true})
                                                    .tfOff('pointermove', _move, {passive: true})
                                                    .tfOff('lostpointercapture pointerup', _up, {passive: true, once: true});
                                            ownerDocument.body.classList.remove('tb_start_animate', 'tb_sort_start');
                                            if (clone) {
                                                const wr = this.closest('.tb_shortcode_preview'),
                                                        items = wr.tfClass('tf_close'),
                                                        textarea = wr.parentNode.tfTag('textarea')[0],
                                                        shortcode = [];
                                                this.remove();
                                                clone.classList.remove('tb_gal_clone');
                                                for (let i = 0; i < items.length; ++i) {
                                                    shortcode.push(items[i].dataset.id);
                                                }
                                                textarea.value = self.replaceShortcode(textarea.value, shortcode.join(','));
                                                Themify.triggerEvent(textarea, 'change',{sort:1});
                                            }
                                            timer = clone = prevY = prevX = dir = theLast = holderWidth = holderHeight = self=ownerDocument=box = null;
                                        };
                                el.tfOn('lostpointercapture pointerup', _up, {passive: true, once: true})
                                        .tfOn('pointermove', _startDrag, {passive: true, once: true})
                                        .tfOn('pointermove', _move, {passive: true})
                                        .setPointerCapture(e.pointerId);
                            }
                        }
                    },
                    preview =  shortcode => {
                        let ids = this.parseIds(shortcode) || [],
                            render=images=>{
                                if(!images){
                                    return;
                                }
                                let w = 40,
                                    h = 40,
                                    fr = createDocumentFragment(),
                                    prewiew_wrap = input.parentNode.tfClass('tb_shortcode_preview')[0];
                                for (let i = 0; i < images.length; ++i) {
                                    let image=images[i];
                                    if (image) {
                                        let img = isNaN(image) ? new Image(w, h) : null,
                                            wr = createElement('','tb_gal_item tf_loader tf_w tf_h tf_box tf_rel'),
                                            remove = createElement('button',{type:'button',class:'tf_close','data-id':image.id || ''});
                                        try {
                                            if (img !== null) {
                                                img.decoding = 'async';
                                                img.src = image.thumbnail || image.large?.[0] || image.full?.[0];
                                                img.decode()
                                                .catch(() => {
                                                })
                                                .finally(() => {
                                                    wr.append(remove, img);
                                                    wr.classList.remove('tf_loader', 'tf_w', 'tf_h');
                                                });
                                            }
                                            fr.appendChild(wr);
                                        } 
                                        catch (e) {

                                        }
                                    }
                                }
                                if (prewiew_wrap === undefined) {
                                    prewiew_wrap = createElement();
                                    prewiew_wrap.tfOn(_CLICK_, removeItem, {passive: true})
                                            .tfOn('pointerdown', sort, {passive: true})
                                    .className = 'tb_shortcode_preview tf_scrollbar';
                                    input.after(prewiew_wrap);
                                }
                                else {
                                    prewiew_wrap.replaceChildren();
                                }
                                prewiew_wrap.appendChild(fr);
                            };
                        this.getImages(shortcode).then(res=>{
                            render(res);
                        });
                        if (!this.getCache(ids)) {
                            render(ids);
                        }
                    };
            if(!isInLine){
                if (val.length > 0) {
                    preview(val);
                }
                btn.tfOn(_CLICK_, openMediaLibrary, {passive: true});
                input.tfOn('change',e=>{
                    if(!e?.detail?.sort && !e?.detail?.remove){
                        preview(e.currentTarget.value);
                    }
                },{passive:true});

            }else{
                openMediaLibrary();
            }
        },
        render(data, self) {
            const d = createDocumentFragment(),
                btn = createElement('button',{type:'button',class:'builder_button tb_text_button tb_btn_arrow'});
            btn.innerHTML = i18n.add_gallery;
            data.class = 'tb_shortcode_input '+(data.class || '');
            d.append(self.textarea.render(data, self), btn);
            self.afterRun.push(() => {
                this.init(btn, btn.previousElementSibling);
            });
            return d;
        }
    },
    textarea: {
        render(data, self) {
            const f = createDocumentFragment(),
                    area = createElement('textarea'),
                    v = self.getStyleVal(data.id),
                     ev = data.control && data.control.event ? data.control.event : 'keyup';
            if (self.is_repeat === true) {
                area.className = self.is_sort === true ? 'tb_lb_sort_child' : 'tb_lb_option_child';
                area.dataset.inputId = data.id;
            } else {
                area.className = 'tb_lb_option';
                area.id = data.id;
            }
            if (data.class !== undefined) {
                area.className += ' ' + data.class;
            }
            if (v !== undefined) {
                area.value = v;
            }
            if (data.rows !== undefined) {
                area.rows = data.rows;
            }
            if (data.readonly) {
                area.readonly = 1;
            }
            f.appendChild(self._initControl(area, data));
            if (data.codeeditor !== undefined) {
                api.Helper.codeMirror(area, data.codeeditor).then(obj => {
                    obj?.editor.on('change', () => {
                        Themify.triggerEvent(area, ev);
                    });
                });
            }
            if (data.after !== undefined) {
                f.appendChild(self.after(data));
            }
            if (data.description !== undefined) {
                f.appendChild(self.description(data.description));
            }
            return f;
        }
    },
    address: {
        render(data, self) {
            return self.textarea.render(data, self);
        }
    },
    wp_editor: {
        render(data, self) {
            let textarea = createElement('textarea',{class:'tb_lb_wp_editor fullwidth',rows:12,cols:40}),
                id;
            if (self.is_repeat === true) {
                id = 'tb_' + Math.random().toString(36).substr(2, 7);
                textarea.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                textarea.dataset.inputId = data.id;
                if (data.control !== false) {
                    data.control??= {};
                    data.control.repeat = true;
                }
            } else {
                textarea.className += ' tb_lb_option';
                id = data.id;
            }
            const wrapper = createElement('', {class:'wp-core-ui wp-editor-wrap tmce-active',id:'wp-' + id + '-wrap'}),
                tools = createElement('', {class:'wp-editor-tools',id: 'wp-' + id + '-editor-tools'}),
                media_buttons = createElement('',{class:'wp-media-buttons',id:'wp-' + id + '-media-buttons'}),
                add_media = createElement('button',{type: 'button',class:'button insert-media add_media'}),
                tabs = createElement('','wp-editor-tabs'),
                container = createElement('',{class:'wp-editor-container',id:'wp-' + id + '-editor-container'});

            textarea.id = id;

            if (data.class !== undefined) {
                textarea.className += ' ' + data.class;
            }
            if (self.values[data.id] !== undefined) {
                textarea.value = self.values[data.id];
            }
            container.append(textarea, createElement('',{class:'quicktags-toolbar',id:'qt_' + id + '_toolbar'}));

            tabs.append(createElement('button',{type:'button',class:'wp-switch-editor switch-tmce',id:id + '-tmce','data-wp-editor-id':id},i18n.visual),createElement('button',{type:'button',class:'wp-switch-editor switch-html',id:id + '-html','data-wp-editor-id':id},i18n.text));

            add_media.append(createElement('span','wp-media-buttons-icon'), createTextNode(i18n.add_media));

            media_buttons.appendChild(add_media);
            tools.append(media_buttons, tabs);
            wrapper.append(tools, container);
            self._editors.push({el: textarea, data: data});
            return wrapper;
        }
    },
    /* Order By field in Post module, provides backward compatibility */
    orderby_post: {
        render(data, self) {
            let v = self.getStyleVal(data.id);
            if (v === 'meta_value_num') {
                self.values[ data.id ] = 'meta_value';
                self.values.meta_key_type = 'NUMERIC';
            }
            data.label??= 'orderby';
            data.options = self.getOptions('orderBy');
            return self.select.render(data, self);
        }
    },
    captcha : {
        _cache:{},
        render(data, self) {
            const {recaptcha:recaptchaKey='recaptcha',hcaptcha:hcaptchaKey= 'hcaptcha'} = data,
                option = {
                    type : 'select',
                    label : data.label === false ? false : 'cptch',
                    help : 'cptchh',
                    id : data.id || 'captcha',
                    options : {
                        '' : '',
                        [recaptchaKey] : 'recptch',
                        [hcaptchaKey] : 'hcptch',
                        turnstile : 'turnstile'
                    }
                };
            if ( data.hide_empty ) {
                delete option.options[''];
            }
            const result = self.create([ option ]),
                select = result.querySelector( '.tb_lb_option' ),
                callback=async e => {
                    const current=e.currentTarget,
                        selected=current.value,
                        value = selected=== recaptchaKey ? 'recaptcha' : ( selected === hcaptchaKey ? 'hcaptcha' : selected ),
                        error=current.nextElementSibling,
                        cache=this._cache;
                    if ( value === '' ) {
                        error.innerHTML = '';
                    } else {
                        cache[ value ]??= await api.LocalFetch( { action : 'tb_validate_captcha', provider : value } );
                        error.innerHTML = cache[ value ].success?'':cache[ value ].data;
                    }
                };
            select.tfOn( 'change',callback,{passive:true} )
            .after( createElement( '','tb_field_error_msg' ) );
            self.afterRun.push(() => {
                callback({currentTarget:select});
            });

            return result;
        }
    },
    select: {
        cache: new Map,
        update(id, v, self) {
            const item = self.getEl(id);
            if (item !== null) {
                if (v !== undefined) {
                    item.value = v;
                } else if (item[0] !== undefined) {
                    item[0].selected = true;
                }
            }
        },
        populate(data, select, self, v) {
            if (data.optgroup) {
                const optgroups = self.getOptions(data);
                for (let k in optgroups) {
                    let opt = optgroups[k];
                    if (opt.label !== undefined) {
                        let o = createElement('optgroup',{label:i18n[opt.label] || opt.label});
                        o.appendChild(this.make_options(opt, v, self));
                        select.appendChild(o);
                    } else {
                        select.appendChild(this.make_options(opt, v, self));
                    }
                }
            } else {
                select.appendChild(this.make_options(data, v, self));
            }
        },
        make_options(data, v, self) {
            const d = createDocumentFragment(),
                    options = self.getOptions(data) || data;
            for (let k in options) {
                let opt = createElement('option',{value:k},i18n[options[k]] || options[k]);
                // Check for responsive disable
                if (data.binding?.[k]?.responsive?.disabled.includes(data.id)) {
                    opt.className = 'tb_responsive_disable';
                }
                if (v === k || (v === undefined && k === data.default) || (Array.isArray(v) && v.includes(k))) {
                    opt.selected = true;
                }
                d.appendChild(opt);
            }
            return d;
        },
        render(data, self) {
            const select_wrap = createElement('','tf_inline_b tf_vmiddle tf_rel'),
                    select = createElement('select','tf_scrollbar'),
                    d = createDocumentFragment(),
                    v = self.getStyleVal(data.id),
                    key = data.dataset;
            if (data.multiple) {
                select.setAttribute('multiple', true);
                select_wrap.className += ' multi';
            }
            if (self.is_repeat === true) {
                select.className+= self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                select.dataset.inputId = data.id;
            } else {
                select.className+= ' tb_lb_option';
                select.id = data.id;
            }
            if (data.class !== undefined) {
                select.className += ' ' + data.class;
            }
            if (data.setOptions !== false) {
                if (key !== undefined) {
                    let cache_key = key;
                    if (data.dataset_args) {
                        cache_key += JSON.stringify(data.dataset_args);
                    }
                    if (this.cache.has(cache_key)) {
                        this.populate(this.cache.get(cache_key), select, self, v);
                    } else {
                        const ajaxData = {
                            action: 'tb_get_ajax_data',
                            dataset: key
                        };
                        /* additional parameters to send to tb_get_ajax_data */
                        if (data.dataset_args) {
                            ajaxData.args = data.dataset_args;
                        }
                        select_wrap.className += ' tf_lazy';
                        api.LocalFetch(ajaxData).then(res => {
                            if (res.success) {
                                this.cache.set(cache_key, res.data);
                                this.populate(res.data, select, self, v);
                            } else {
                                throw '';
                            }
                        })
                        .catch(() => {
                            api.Spinner.showLoader('error');
                        }).finally(() => {
                            select_wrap.classList.remove('tf_lazy');
                        });
                    }
                } else {
                    this.populate(data, select, self, v);
                }
            }
            select_wrap.appendChild(self._initControl(select, data));
            d.appendChild(select_wrap);
            if (data.after !== undefined) {
                d.appendChild(self.after(data));
            }
            if (data.description !== undefined) {
                d.appendChild(self.description(data.description));
            }
            if (data.tooltip !== undefined) {
                d.appendChild(self.hint(data.tooltip));
            }
            return d;
        }
    },
    font_select: {
        loaded_fonts: new Set,
        fonts: {},
        safe: {},
        google: {},
        cf: {},
        updateFontVariant(value, weight, self, type) {
            if (!weight) {
                return;
            }
            type = '' === type || type === undefined ? undefined !== this.google[value] ? 'google' : 'cf' : type;
            type = 'webfont' === type ? 'fonts' : type;
            const variants = this[type][value]?.v || null;
            if (!variants || variants.length === 0) {
                weight.closest('.tb_field').classList.add('_tb_hide_binding');
                return;
            }

            let selected = self.getStyleVal(weight.id),
                fr=createDocumentFragment();
            if (undefined === selected) {
                selected = 'google' === type ? 'regular' : 'normal';
            }
            weight.dataset.selected = value;
            weight.closest('.tb_field').classList.remove('_tb_hide_binding');
            for (let i = 0; i < variants.length; ++i) {
                let opt = createElement('option',{value:variants[i]},variants[i]);
                if (variants[i] === selected) {
                    opt.selected = true;
                }
                fr.appendChild(opt);
            }
            weight.replaceChildren(fr);
        },
        loadGoogleFonts(fontFamilies) {
            fontFamilies = [...new Set((fontFamilies.split('|')))];
            const result = {google: [], cf: []},
                loaded_fonts=this.loaded_fonts,
                isFrontend=api.isFrontend;
            for (let i = fontFamilies.length - 1; i > -1; --i) {
                let font=fontFamilies[i];
                if (font && font !== 'default' && this.safe[font]===undefined) {
                    let req = font.split(':'),
                        type = this.cf[req[0]] !== undefined ? 'cf' : 'google',
                        weight = ('regular' === req[1] || 'normal' === req[1] || 'italic' === req[1] || ~~req[1]) ? req[1] : '400,700',
                        f = req[0].split(' ').join('+') + ':' + weight;
                    if(this.safe[req[0]]===undefined){
                        if( 'google' === type){
                            f+=':latin,latin-ext';
                        }
                        if (!loaded_fonts.has(f) && !result[type].includes(f)) {
                            loaded_fonts.add(f);
                            result[type].push(f);
                        }
                    }
                }
            }
            if (result.google.length > 0) {
                const url = window.location.protocol + '//fonts.googleapis.com/css?family=' + encodeURI(result.google.join('|')) + '&display=swap';
                Themify.loadCss(url, null, false);
                if (isFrontend) {
                    topThemify.loadCss(url, null, false);
                }
            }
            if (result.cf.length > 0) {
                const url = themifyBuilder.cf_api_url + encodeURI(result.cf.join('|'));
                Themify.loadCss(url, null, false);
                if (isFrontend) {
                    topThemify.loadCss(url, null, false);
                }
            }
        },
        _controlChange(select, preview, pw, self) {
            const _this = this,
                    $combo = $(select).comboSelect({
                comboClass: 'themify-combo-select',
                comboArrowClass: 'themify-combo-arrow',
                comboDropDownClass: 'themify-combo-dropdown tf_scrollbar',
                inputClass: 'themify-combo-input',
                disabledClass: 'themify-combo-disabled',
                hoverClass: 'themify-combo-hover',
                selectedClass: 'themify-combo-selected',
                markerClass: 'themify-combo-marker'
            }).parent('div');
            $combo[0].tfOn(_CLICK_, function (e) {
                const target = e.target;
                if (target.classList.contains('themify-combo-item')) {
                    const value = target.dataset.value,
                            tab = select.closest('.tb_tab'),
                            type = this.querySelector('option[value="' + value + '"]')?.dataset.type;

                    if ('webfont' !== type && value) {
                        _this.loadGoogleFonts(value);
                    }
                    if (tab) {
                        _this.updateFontVariant(value, tab.tfClass('font-weight-select')[0], self, type);
                    }
                    setTimeout(() => {
                        Themify.triggerEvent(select, 'change');
                    }, 10);
                }
            }, {passive: true})
                    .tfOn('pointerover', function (e) {
                        const target = e.target;
                        if (target.classList.contains('themify-combo-item')) {
                            let value = target.dataset.value;
                            if (value) {
                                if (!$(target).is(':visible')) {
                                    return;
                                }
                                if (value === 'default') {
                                    value = 'inherit';
                                }
                                preview.style.top = target.offsetTop - target.parentNode.scrollTop + 30 + 'px';
                                preview.style.fontFamily = value;
                                preview.style.display = 'block';

                                if (value !== 'inherit' && !target.classList.contains('tb_font_loaded')) {
                                    target.classList.add('tb_font_loaded');
                                    const mode = target.ownerDocument === topWindowDoc ? 'top' : 'bottom';
                                    _this.fonts[mode]??= [];
                                    if (!_this.fonts[mode].includes(value)) {
                                        const callback = value => {
                                            _this.fonts[mode].push(value);
                                            pw.classList.remove('themify_show_wait');
                                        },
                                        type = this.querySelector('option[value="' + value + '"]')?.dataset.type;
                                        if (type && type !== 'webfont') {
                                            let url = '';
                                            if ('google' === type) {
                                                url = window.location.protocol + '//fonts.googleapis.com/css?family=' + encodeURI(value) + '&display=swap';
                                            } else if ('cf' === type) {
                                                url = themifyBuilder.cf_api_url + encodeURI(value);
                                            }
                                            if (url !== '') {
                                                pw.classList.add('themify_show_wait');
                                                const tf = mode === 'top' ? topThemify : Themify;
                                                tf.loadCss(url, null, false).then(callback);
                                            }
                                        } else {
                                            callback(value);
                                        }
                                    }
                                    target.style.fontFamily = value;
                                }
                            }
                        }
                    }, {passive: true});
            $combo.trigger('comboselect:open')
                    .on('comboselect:close', () => {
                        preview.style.display = 'none';
                    });
            $combo[0].tfClass('themify-combo-arrow')[0].tfOn(_CLICK_, () => {
                preview.style.display = 'none';
            }, {passive: true});
        },
        update(id, v='', self) {
            const select = self.getEl(id);
            if (select !== null) {
                select.value = v;
                this.updateFontVariant(v, select.closest('.tb_tab').tfClass('font-weight-select')[0], self);
                if (select.dataset.init === undefined) {
                    const groups = select.tfTag('optgroup'),
                            opt = createElement('option',{value:v,selected:''});
                    for(let i=2;i>-1;--i){
                        groups[i]?.replaceChildren();
                    }
                    if (this.safe[v] !== undefined) {
                        opt.textContent = this.safe[v];
                        groups[0].appendChild(opt);
                    } else if (this.google[v] !== undefined) {
                        opt.textContent = this.google[v].n;
                        groups[1].appendChild(opt);
                    } else if (this.cf[v] !== undefined) {
                        opt.textContent = this.cf[v].n;
                        groups[2].appendChild(opt);
                    } else {
                        opt.textContent = v;
                        groups[0].appendChild(opt);
                    }
                }
                else {
                    select.parentNode.tfClass('themify-combo-input')[0].value = v;
                }
            }
        },
        render(data, self) {
            const wrapper = createElement('','tb_font_preview_wrapper'),
                    select =createElement('select',{class:'tb_lb_option font-family-select tf_scrollbar',id:data.id}),
                    preview = createElement('span','tb_font_preview'),
                    pw = createElement('span','',i18n.font_preview),
                    d = createDocumentFragment(),
                    v = self.getStyleVal(data.id),
                    _this = this,
                    group = {safe: i18n.safe_fonts, google: i18n.google_fonts},
                    cfEmpty = Object.keys(this.cf).length < 1;
            if (false === cfEmpty) {
                group.cf = i18n.cf_fonts;
            }
            d.appendChild(createElement('option',{value:''},'---'));
            if (data.class !== undefined) {
                select.className += ' ' + data.class;
            }
            const groupKeys = ['google', 'safe'];
            if (false === cfEmpty) {
                groupKeys.push('cf');
            }
            for (let i = groupKeys.length - 1; i > -1; --i) {
                let optgroup = createElement('optgroup',{label:group[groupKeys[i]]});
                if (v !== undefined) {
                    let txt;
                    if ('safe' === groupKeys[i] && this.safe[v] !== undefined) {
                        txt = this.safe[v];
                    } else if ('google' === groupKeys[i] && this.google[v] !== undefined) {
                        txt = this.google[v].n;
                    } else {
                        txt = this.cf[v]?.n ?? v;
                    }
                    optgroup.appendChild(createElement('option',{value:v,selected:''},txt));
                }
                d.appendChild(optgroup);
            }
            const focusIn = function () {
                this.tfOff('focusin tf_init', focusIn, {once: true, passive: true});
                const fonts = _this.safe,
                        f = createDocumentFragment(),
                        sel = this.querySelector('select'),
                        groups = sel.tfTag('optgroup');
                sel.dataset.init = true;
                if (v !== undefined) {
                    for (let h = groups.length - 1; h > -1; --h) {
                        groups[h].replaceChildren();
                    }
                }
                for (let i in fonts) {
                    let opt = createElement('option',{value:i,'data-type':'webfont'},fonts[i]);
                    if (v === i) {
                        opt.selected = true;
                    }
                    f.appendChild(opt);
                }
                groups[cfEmpty ? 0 : 1].appendChild(f);
                const extGroups = ['google'];
                if (false === cfEmpty) {
                    extGroups.unshift('cf');
                }
                for (let g = extGroups.length - 1; g > -1; --g) {
                    let ff = _this[extGroups[g]],
                            fr = createDocumentFragment();
                    for (let i in ff) {
                        let opt =createElement('option',{value:i,'data-type':extGroups[g]},ff[i].n);
                        if (v === i) {
                            opt.selected = true;
                        }
                        fr.appendChild(opt);
                    }
                    groups['cf' === extGroups[g] ? 0 : cfEmpty ? 1 : 2].appendChild(fr);
                }
                _this._controlChange(sel, preview, pw, self);
            };
            select.appendChild(d);
            preview.appendChild(pw);
            wrapper.tfOn('focusin tf_init', focusIn, {once: true, passive: true})
                .append(self._initControl(select, data), preview);
            self.afterRun.push(() => {
                const weight = self.create([{type: 'select', options: {}, label: 'f_w', selector: data.selector, class: 'font-weight-select', id: data.id + '_w', prop: 'font-weight'}]),
                        weightParent = weight.querySelector('.tb_field');
                wrapper.closest('.tb_field').after(weight);
                _this.updateFontVariant(v, weightParent.tfClass('font-weight-select')[0], self);
            });
            data.label??= 'f_f';
            return wrapper;
        }
    },
    animation_select: {
        render(data, self) {
            const select_wrap = createElement('','tf_inline_b tf_vmiddle tf_rel'),
                    select = createElement('select',{class:'tb_lb_option tf_scrollbar',id:data.id}),
                    v = self.values[data.id],
                    options={
                        attseek: [
                            'bounce',
                            'flash',
                            'pulse',
                            'rubberBand',
                            'shake',
                            'swing',
                            'tada',
                            'wobble',
                            'jello'
                        ],
                        bounceentr: [
                            'bounceIn',
                            'bounceInDown',
                            'bounceInLeft',
                            'bounceInRight',
                            'bounceInUp'
                        ],
                        bouncex: [
                            'bounceOut',
                            'bounceOutDown',
                            'bounceOutLeft',
                            'bounceOutRight',
                            'bounceOutUp'
                        ],
                        fadeentr: [
                            'fadeIn',
                            'fadeInDown',
                            'fadeInDownBig',
                            'fadeInLeft',
                            'fadeInLeftBig',
                            'fadeInRight',
                            'fadeInRightBig',
                            'fadeInUp',
                            'fadeInUpBig'
                        ],
                        fadeex: [
                            'fadeOut',
                            'fadeOutDown',
                            'fadeOutDownBig',
                            'fadeOutLeft',
                            'fadeOutLeftBig',
                            'fadeOutRight',
                            'fadeOutRightBig',
                            'fadeOutUp',
                            'fadeOutUpBig'
                        ],
                        flippers: [
                            'flip',
                            'flipInX',
                            'flipInY',
                            'flipOutX',
                            'flipOutY'
                        ],
                        lghtsp: [
                            'lightSpeedIn',
                            'lightSpeedOut'
                        ],
                        rotentr: [
                            'rotateIn',
                            'rotateInDownLeft',
                            'rotateInDownRight',
                            'rotateInUpLeft',
                            'rotateInUpRight'
                        ],
                        rotex: [
                            'rotateOut',
                            'rotateOutDownLeft',
                            'rotateOutDownRight',
                            'rotateOutUpLeft',
                            'rotateOutUpRight'
                        ],
                        specials: [
                            'hinge',
                            'rollIn',
                            'rollOut'
                        ],
                        zoomentr: [
                            'zoomIn',
                            'zoomInDown',
                            'zoomInLeft',
                            'zoomInRight',
                            'zoomInUp'
                        ],
                        zoomex: [
                            'zoomOut',
                            'zoomOutDown',
                            'zoomOutLeft',
                            'zoomOutRight',
                            'zoomOutUp'
                        ],
                        slideentr: [
                            'slideInDown',
                            'slideInLeft',
                            'slideInRight',
                            'slideInUp'
                        ],
                        slideex: [
                            'slideOutDown',
                            'slideOutLeft',
                            'slideOutRight',
                            'slideOutUp'
                        ]
                    };
            select.appendChild(createElement('option'));
            for (let k in options) {
                let group = createElement('optgroup',{label:i18n[k] || k});
                for (let i = 0, anim = options[k]; i < anim.length; ++i) {
                    let opt = createElement('option',{value:anim[i]},i18n[anim[i]] || anim[i]);
                    if (v === anim[i]) {
                        opt.selected = true;
                    }
                    group.appendChild(opt);
                }
                select.appendChild(group);
            }
            select_wrap.appendChild(select);
            return select_wrap;
        }
    },
    sticky: {
        render(data, self) {
            const unstickOption = {},
                    selectedUID = api.activeModel.id,
                    Registry=api.Registry,
                    _data = api.Helper.cloneObject(data),
                    type = data.key;
            for (let cid of Registry.items.keys()) {
                let el = Registry.get(cid);
                if (type === el?.type && el.id !== selectedUID) {
                    let uidText,
                            st = el.get('styling');
                    if ('row' === type && st && (st.custom_css_id || st.row_anchor)) {
                        uidText = st.custom_css_id ? '#' + st.custom_css_id : '#' + st.row_anchor;
                    } else if ('module' === type && st && st.custom_css_id) {
                        uidText = '#' + st.custom_css_id;
                    } else {
                        uidText = 'row' === type ? 'Row #' + el.id : el.get('mod_name') + ' #' + el.id;
                    }
                    unstickOption[el.id] = uidText;
                }
            }
            _data.options = unstickOption;
            return self.select.render(_data, self);
        }
    },
    selectSearch: {
        update(val, search, options) {
            const f = createDocumentFragment();
            let first = null;
            search.removeAttribute('data-value');
            search.value = '';
            if (options !== undefined) {
                for (let k in options) {
                    let item = createElement('',{class:'tb_search_item','data-value':k},options[k]);
                    if (first === null) {
                        first = k;
                    }
                    if (val === k) {
                        item.className += ' selected';
                        search.dataset.value = k;
                        search.value = options[k];
                    }
                    f.appendChild(item);
                }

                if (search.value === '' && first !== null) {
                    search.value = options[first];
                    search.dataset.value = first;
                }
            }
            return f;
        },
        _events(search, container) {
            search.tfOn('keyup', function () {
                const items = container.tfClass('tb_search_item'),
                        val = this.value.trim(),
                        r = new RegExp(val, 'i');
                for (let i = 0, len = items.length; i < len; ++i) {
                    items[i].style.display = (val === '' || r.test(items[i].textContent)) ? 'block' : 'none';
                }
            }, {passive: true});
            container.tfOn('pointerdown', function (e) {
                if (e.button === 0 && e.target.classList.contains('tb_search_item')) {
                    e.stopPropagation();
                    const all_items = this.tfClass('tb_search_item'),
                            _this = e.target;
                    for (let i = all_items.length - 1; i > -1; --i) {
                        all_items[i].classList.remove('selected');
                    }
                    _this.classList.add('selected');
                    const v = _this.dataset.value;
                    search.value = _this.textContent;
                    search.dataset.value = v;
                    search.blur();
                    search.previousElementSibling.blur();
                    Themify.triggerEvent(search, 'selectElement', {val: v});
                }
            },{passive:true});
        },
        render(data, self) {
            const container = createElement('','tb_search_wrapper'),
                    arrow = createElement('',{class:'tb_search_arrow',tabindex:-1}),
                    label=data.placeholder?? data.label,
                    search = createElement('input',{type:'text',class:'tb_search_input',autocomplete:'off',placeholder:(i18n[label] || label) + '...'}),
                    search_container = createElement('',{class:'tb_search_container tf_scrollbar',tabindex:-1});
            if (self.is_repeat === true) {
                search.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                search.dataset.inputId = data.id;
            } else {
                search.className += ' tb_lb_option';
                search.id = data.id;
            }
            if (data.class !== undefined) {
                search.className += ' ' + data.class;
            }
            search_container.appendChild(this.update(self.values[data.id], search, data.options, self));
            arrow.appendChild(createElement('span','tf_loader'));
            container.append(arrow, self._initControl(search, data), search_container);
            if (data.after !== undefined) {
                container.appendChild(self.after(data));
            }
            if (data.description !== undefined) {
                container.appendChild(self.description(data.description));
            }
            if (data.tooltip !== undefined) {
                container.appendChild(self.hint(data.tooltip));
            }
            this._events(search, search_container);

            return container;
        }
    },
    optin_provider: {
        cache: null,
        render(data, self) {
            const el = createElement(),
                callback = () => {
                    const setAfter = () => {
                        el.replaceWith(self.create([this.cache[0], this.cache[1]]));
                    };
                    if (el.isConnected) {
                        setAfter();
                    } else {
                        self.afterRun.push(setAfter);
                    }
                };
            if (this.cache === null) {
                el.className = 'tf_loader';
                api.Spinner.showLoader();
                api.LocalFetch({action: 'tb_optin_get_settings'}).then(res => {
                    api.Spinner.showLoader('spinhide');
                    this.cache = res;
                    callback();
                    self.callbacks();
                })
                        .catch(() => {
                            api.Spinner.showLoader('error');
                        });
            } else {
                callback();
            }
            return el;
        }
    },
    check_map_api: {
        render(data, self) {
            if (!themifyBuilder[data.map + '_api']) {
                const errData = {
                    label:'',
                    html: '<span>' + themifyBuilder[data.map + '_api_err'] + '</span>',
                    wrap_class: 'tb_group_element_' + data.map
                };
                return self.separator.render(errData, self);
            } else {
                return createDocumentFragment();
            }
        }
    },
    query_posts: {
        _cacheTypes: null,
        _cacheTerms: new Map,
        render(data, self) {
            let tmp_el=createElement('',{id:data.id || data.term_id}),
                controller,
                _this = this,
                desc = data.description,
                after = data.after,
                values = self.values,
                formatData = options => {
                    const result = {};
                    for (let k in options) {
                        result[k] = options[k].name;
                    }
                    return result;
                },
                update = (item, val, options) => {
                    item.nextElementSibling?.replaceChildren(self.selectSearch.update(val, item, options, self));
                },
                get = (wr, val, type, s) => {
                    controller?.abort();
                    wr.classList.add('tb_search_wait');
                    controller = new AbortController();
                    return api.LocalFetch({
                        action: 'tb_get_post_types',
                        type: type,
                        v: val,
                        s: s || '',
                        all: data.all || ''

                    }, false, {signal: controller.signal})
                            .finally(() => {
                                controller = null;
                                wr.classList.remove('tb_search_wait');
                            });

                },
                _data = api.Helper.cloneObject(data),
                timeout = null;
            delete _data.wrap_class;
            self.afterRun.push(() => {
                let opt = ['id', 'tax_id', 'term_id', 'tag_id'],
                    fr = createDocumentFragment(),
                    isInit = null,
                    getTerms = async (search, val, s, isType) => {
                            try {
                                const cache_key = s ? val + '_' + s : val;
                                let res = _this._cacheTerms.get(cache_key);
                                if (!res) {
                                    res = await get(search.parentNode, val, 'terms', s);
                                    _this._cacheTerms.set(cache_key, res);
                                }

                                if (data.term_id === undefined && data.tag_id === undefined) {
                                    return;
                                }
                                if (data.all) {
                                    const wrap = search.closest('.' + data.id),
                                            is_all = wrap.querySelector('#' + data.id).value === 'All',
                                            els = wrap.querySelectorAll('.' + data.tax_id + ',.' + data.term_id + ',.' + data.tag_id);
                                    for (let k = els.length - 1; k > -1; --k) {
                                        els[k].classList.toggle('tf_hide', is_all);
                                    }
                                }
                                const term_id = data.tag_id || data.term_id.replace('#tmp_id#', val),
                                        parent = search.closest('.tb_input');
                                let term_val;
                                search.id = term_id;
                                if (isInit === null && values[term_id] !== undefined) {
                                    term_val = values[term_id].split('|')[0];
                                }
                                if (!term_val) {
                                    term_val = 0;
                                }
                                update(search, term_val, res);
                                if (s || s === '') {
                                    search.value = s;
                                }
                                if (isInit === null) {
                                    const multiply = createElement('input',{type:'text',class:'query_category_multiple'}),
                                            wr = createElement('', 'tb_query_multiple_wrap');
                                    wr.append(createElement('span','',i18n.or), multiply);
                                    parent.insertBefore(wr, parent.nextSibling);
                                    if (after !== undefined) {
                                        parent.appendChild(self.after(after));
                                    }
                                    if (desc !== undefined) {
                                        parent.appendChild(self.description(desc));
                                    }
                                    if (data.slug_id !== undefined) {
                                        const referenceNode = parent.parentNode,
                                                query_by = self.create([{
                                                        type: 'radio',
                                                        id: 'term_type',
                                                        label: 'query_by',
                                                        default: values.term_type === undefined && values[data.tax_id] === 'post_slug' ? 'post_slug' : 'category', //backward compatibility
                                                        option_js: true,
                                                        options: [
                                                            {value: 'all', name: 'all_posts'},
                                                            {value: 'category', name: 'query_term_id'},
                                                            {value: 'post_slug', name: 'slug_label'}
                                                        ]
                                                    }]),
                                                slug = self.create([{
                                                        id: data.slug_id,
                                                        type: 'text',
                                                        class: 'large',
                                                        wrap_class: 'tb_group_element_post_slug',
                                                        help: 'slug_desc',
                                                        label: 'slug_label'
                                                    }]);
                                        referenceNode.before(query_by);
                                        referenceNode.parentNode.appendChild(slug);

                                    }
                                    if (data.sticky_id !== undefined) {
                                        const sticky = self.create([{
                                                type: 'toggle_switch',
                                                label: 'sticky_first',
                                                id: data.sticky_id,
                                                options: 'simple',
                                                wrap_class: 'tb_group_element_all'
                                            }]);
                                        parent.parentNode.parentNode.appendChild(sticky);
                                    }
                                    multiply.tfOn('change', () => {
                                        Themify.triggerEvent(search, 'queryPosts', {val: term_val});
                                    }, {passive: true});
                                    clearTimeout(timeout);
                                    timeout = setTimeout(() => {
                                        self.callbacks();
                                    }, 2);
                                }
                                if (!isType) {
                                    parent.tfClass('query_category_multiple')[0].value = term_val;

                                    if (isInit === true || self.is_new) {
                                        Themify.triggerEvent(search, 'queryPosts', {val: term_val});
                                    } else {
                                        ThemifyConstructor.settings = api.Forms.serialize('tb_options_setting');
                                    }
                                }
                                isInit = true;
                            } catch (e) {

                            }
                };
                for (let i = 0, len = opt.length; i < len; ++i) {
                    if (!_data[opt[i]]) {
                        continue;
                    }
                    _data.id = _data[opt[i]];
                    _data.label = 'query_' + opt[i];
                    _data.type = 'selectSearch';
                    if (opt[i] === 'term_id') {
                        _data.wrap_class = 'tb_search_term_wrap tb_group_element_category';
                        _data.class = 'query_category_single';
                        _data.help = 'query_desc';
                        _data.control = {control_type: 'queryPosts'};
                    } 
                    else if ((opt[i] === 'tax_id' || opt[i] === 'tag_id') && _data.term_id === undefined) {
                        _data.control = {control_type: 'queryPosts'};
                    }
                    delete _data.description;
                    delete _data.after;
                    let res = self.create([_data]);
                    if (true === data.just_current) {
                        delete _data.wrap_class;
                    }
                    let is_post = opt[i] === 'id',
                            is_term = opt[i] === 'term_id' || opt[i] === 'tag_id',
                            v = is_term ? '' : values[_data.id],
                            search = res.querySelector('.tb_search_input');
                    search.tfOn('selectElement', function (e) {
                        let val = e.detail.val,
                                nextsearch = this.closest('.tb_field');
                        if (!is_term) {
                            nextsearch = nextsearch.nextElementSibling;
                            if (nextsearch !== null) {
                                if (!is_post && isInit === true && data.slug_id !== undefined) {
                                    nextsearch = nextsearch.nextElementSibling;
                                }
                                if (nextsearch !== null) {
                                    nextsearch = nextsearch.tfClass('tb_search_input')[0];
                                    if (is_post) {
                                        if (_this._cacheTypes[val] !== undefined) {
                                            if (true === data.just_current && 'tag' === values[data.tax_id]) {
                                                values[data.tax_id] = 'post_tag';
                                            }
                                            update(nextsearch, values[data.tax_id], formatData(_this._cacheTypes[val].options));
                                            Themify.triggerEvent(nextsearch, 'selectElement', {val: nextsearch.dataset.value});
                                        }
                                    } 
                                    else {
                                        getTerms(nextsearch, val);
                                        nextsearch.tfOn('input', function () {
                                            setTimeout(() => {
                                                getTerms(nextsearch, val, this.value.trim(), true);
                                            }, 500);
                                        }, {passive: true});
                                    }
                                }
                            } 
                            else if (!is_post) {
                                Themify.triggerEvent(this, 'queryPosts', {val: this.dataset.value});
                            }
                        } else {
                            nextsearch.tfClass('query_category_multiple')[0].value = val;
                            Themify.triggerEvent(this, 'queryPosts', {val: val});
                        }
                    }, {passive: true});
                    if (is_post) {
                        const callback = () => {
                            if (!v) {
                                v =data.default_post_type || 'post';
                            }
                            update(search, v, formatData(_this._cacheTypes));
                            Themify.triggerEvent(search, 'selectElement', {val: v});
                            search = null;
                        };
                        if (_this._cacheTypes === null) {
                            get(search.parentNode, null, 'post_types').then(res => {
                                _this._cacheTypes = res;
                                if (data.just_current === true && undefined == v) {
                                    v = Object.keys(res);
                                }
                                callback();
                            });
                        } else {
                            setTimeout(callback, 10);
                        }
                    } else if (is_term && !data.id && data.taxonomy !== undefined) {
                        getTerms(search, data.taxonomy);
                        search.tfOn('input', function () {
                            setTimeout(() => {
                                getTerms(search, data.taxonomy, this.value.trim(), true);
                            }, 500);
                        }, {passive: true});
                    }
                    fr.appendChild(res);
                }
                if (_data.query_filter) {
                    let selfVals=self.values,
                        query_filter = self.create([
                        {
                            type: 'multi',
                            label: 'dateq',
                            id: 'query_date',
                            options: [
                                {
                                    id: 'query_date_from',
                                    label: 'from',
                                    type: 'date',
                                    timepicker: false
                                },
                                {
                                    id: 'query_date_to',
                                    label: 'to',
                                    type: 'date',
                                    timepicker: false
                                }
                            ],
                            wrap_class: 'tb_query_filter' + (selfVals.query_date_from || selfVals.query_date_to ? '' : ' tf_hide')
                        },
                        {
                            type: 'autocomplete',
                            dataset: 'authors',
                            id: 'query_authors',
                            label: 'auhrq',
                            wrap_class: 'tb_query_filter' + (selfVals.query_authors ? '' : ' tf_hide'),
                            help: 'auhrqh'
                        },
                        {
                            type: 'multi',
                            label: 'custq',
                            id: 'query_cf',
                            options: [
                                {
                                    type: 'autocomplete',
                                    dataset: 'custom_fields',
                                    id: 'query_cf_key',
                                    label: 'key'
                                },
                                {
                                    id: 'query_cf_value',
                                    label: 'val',
                                    type: 'text'
                                },
                                {
                                    id: 'query_cf_c',
                                    label: 'compre',
                                    type: 'select',
                                    options: {
                                        '': 'LIKE',
                                        'NOT LIKE': 'NOT LIKE',
                                        'EXISTS': 'EXISTS',
                                        'NOT EXISTS': 'NOT EXISTS',
                                        '=': '=',
                                        '!=': '!=',
                                        '>': '>',
                                        '>=': '>=',
                                        '<': '<',
                                        '<=': '<='
                                    }
                                }
                            ],
                            wrap_class: 'tb_query_filter' + (selfVals.query_cf_key ? '' : ' tf_hide')
                        }
                    ]);
                    fr.appendChild(query_filter);

                    let hide_add_new = selfVals.query_cf_key && selfVals.query_authors && (selfVals.query_date_from || selfVals.query_date_to); /* if all advanced query fields have value, don't need to show the Add New button */
                    if (!hide_add_new) {
                        let tb_field = createElement('','tb_field'),
                                plusWrap = createElement('','tb_input tf_rel'),
                                plus = createElement('',{class:'tb_ui_dropdown_label tb_sort_fields_plus tf_plus_icon',tabindex:-1}),
                                ul = createElement('ul','tf_scrollbar');
                        if (!selfVals.query_date_from && !selfVals.query_date_to) {
                            ul.appendChild(createElement('li',{'data-id':'query_date'},i18n.dateq));
                        }
                        if (!selfVals.query_authors) {
                            ul.appendChild(createElement('li',{'data-id':'query_authors'},i18n.auhrq));
                        }
                        if (!selfVals.query_cf_key) {
                            ul.appendChild(createElement('li',{'data-id':'query_cf'},i18n.custq));
                        }
                        plus.appendChild(createElement('span','',i18n.addqf));
                        tb_field.append(createElement('','tb_label tb_empty_label'), plusWrap);
                        plusWrap.append(plus, ul);
                        fr.appendChild(tb_field);

                        ul.tfOn(_CLICK_, function (e) {
                            if (e.target.tagName === 'LI') {
                                e.preventDefault();
                                e.stopPropagation();
                                let id = e.target.dataset.id;
                                this.closest('.tb_field[data-type="query_posts"], .tb_field[data-type="advanced_posts_query"]').querySelector('.' + id).classList.remove('tf_hide');
                                e.target.style.display = 'none';
                                e.target.removeAttribute('data-id');
                                if (!this.querySelector('[data-id]')) {
                                    tb_field.classList.add('tf_hide');
                                }
                            }
                        });
                    }
                }
                tmp_el.parentNode.replaceChild(fr, tmp_el);
                _data = tmp_el = null;
            });
            return tmp_el;
        }
    },
    hook_content: {
        render(data, self) {
            return self.create([{
                    type: 'group',
                    label: 'hcont',
                    display: 'accordion',
                    options: [
                        {
                            id: 'hook_content',
                            type: 'builder',
                            options: [
                                {
                                    type: 'select',
                                    id: 'h',
                                    options: data.options,
                                    after: 'hloc'
                                },
                                {
                                    type: 'textarea',
                                    id: 'c',
                                    wrap_class: 'tb_disable_dc',
                                    class: 'fullwidth'
                                }
                            ]
                        }
                    ]
                }]);
        }
    },
    position_box: {
        w: null,
        h: null,
        update(id, v, self) {
            const input = self.getEl(id) || api.LightBox.el.querySelector('[data-input-id="' + id + '"]');
            if (input !== null) {
                const wrap = input.closest('.tb_position_box_wrapper'),
                        handler = wrap.tfClass('tb_position_box_handle')[0],
                        label = wrap.tfClass('tb_position_box_label')[0],
                        positions = this._getPreDefinedPositions();
                if (!v) {
                    v = '50,50';
                } else if (positions[v] !== undefined) {
                    v = positions[v];
                }
                input.value = v;
                label.textContent = this._getLabel(v);
                v = v.split(',');
                handler.style.left = Math.ceil((v[0] * this.w) / 100) + 'px';
                handler.style.top = Math.ceil((v[1] * this.h) / 100) + 'px';
            }
        },
        _getLabel(val) {
            let pos,
                {top,left,center,right,bottom} = i18n;
            switch (val) {
                case '0,0':
                    pos = top + ' ' + left;
                    break;
                case '50,0':
                    pos = top + ' ' + center;
                    break;
                case '100,0':
                    pos = top + ' ' + right;
                    break;
                case '0,50':
                    pos = center + ' ' + left;
                    break;
                case '50,50':
                    pos = center + ' ' + center;
                    break;
                case '100,50':
                    pos = center + ' ' + right;
                    break;
                case '0,100':
                    pos = bottom + ' ' + left;
                    break;
                case '50,100':
                    pos = bottom + ' ' + center;
                    break;
                case '100,100':
                    pos = bottom + ' ' + right;
                    break;
                default:
                    const values = val.split(',');
                    pos = values[0] === '' ? 'Center Center' : 'X:' + values[0] + '% Y:' + values[1] + '%';
                    break;
            }
            return pos;
        },
        _getPreDefinedPositions() {
            return {
                'right-top': '100,0',
                'right-center': '100,50',
                'right-bottom': '100,100',
                'left-top': '0,0',
                'left-center': '0,50',
                'left-bottom': '0,100',
                'center-top': '50,0',
                'center-center': '50,50',
                'center-bottom': '50,100'
            };
        },
        _click(e) {
            e.stopPropagation();
            let left,
                    top,
                    el = e.currentTarget.previousElementSibling,
                    item = e.target.closest('.tb_position_item');
            if (item) {
                const pos = item.dataset.pos.split(',');
                left = pos[0];
                top = pos[1];
                if (left === '50') {
                    left = this.w / 2;
                } else if (left === '100') {
                    left = this.w;
                }
                if (top === '50') {
                    top = this.h / 2;
                } else if (top === '100') {
                    top = this.h;
                }
            } else {
                left = e.offsetX;
                top = e.offsetY;
            }
            el.style.left = left + 'px';
            el.style.top = top + 'px';
            this._changeUpdate(el, left, top);
        },
        _changeUpdate(helper, left, top) {
            const l = +((left / this.w) * 100).toFixed(2),
                    t = +((top / this.h) * 100).toFixed(2),
                    label = helper.closest('.tb_position_box_wrapper').tfClass('tb_position_box_label')[0],
                    input = label.nextElementSibling;
            input.value = l + ',' + t;
            label.textContent = this._getLabel(l + ',' + t);
            Themify.triggerEvent(input, 'change');
        },
        render(data, self) {
            const _this = this,
                    positions = this._getPreDefinedPositions(),
                    v = self.getStyleVal(data.id),
                    wrapper = createElement('','tb_position_box_wrapper'),
                    boxWrap = createElement('','tb_position_box_container tf_rel tf_inline_b'),
                    box = createElement('', 'tb_position_box tf_rel'),
                    handler = createElement('','tb_position_box_handle'),
                    input = self.hidden.render(data, self);
            for (let i in positions) {
                let pos = createElement('',{class: 'tb_position_item','data-pos':positions[i]}),
                    tooltip = createElement('span','themify_tooltip'),
                    vals = positions[i].split(',');
                pos.style.left = vals[0] + '%';
                pos.style.top = vals[1] + '%';
                tooltip.appendChild(createElement('span','',this._getLabel(positions[i])));
                pos.appendChild(tooltip);
                box.appendChild(pos);
            }
            handler.tfOn('pointerdown', function (e) {
                if (e.button === 0) {
                    e.stopImmediatePropagation();
                    let timer;
                    const el = this,
                        dragX = this.offsetLeft - e.clientX,
                        dragY = this.offsetTop - e.clientY,
                        {w:maxW,h:maxH} = _this,
                        _startDrag = () => {
                            topBodyCl.add('tb_start_animate');
                        },
                        _move = e => {
                                e.stopImmediatePropagation();
                                cancelAnimationFrame(timer);
                                timer = requestAnimationFrame(() => {
                                    let clientX = dragX + e.clientX,
                                            clientY = dragY + e.clientY;
                                    if (clientX > maxW) {
                                        clientX = maxW;
                                    } else if (clientX < 0) {
                                        clientX = 0;
                                    }
                                    if (clientY > maxH) {
                                        clientY = maxH;
                                    } else if (clientY < 0) {
                                        clientY = 0;
                                    }
                                    el.style.left = clientX + 'px';
                                    el.style.top = clientY + 'px';
                                    _this._changeUpdate(el, clientX, clientY);
                                });
                            },
                            _up = function (e) {
                                e.stopImmediatePropagation();
                                cancelAnimationFrame(timer);
                                this.tfOff('pointermove', _startDrag, {passive: true, once: true})
                                        .tfOff('pointermove', _move, {passive: true})
                                        .tfOff('lostpointercapture pointerup', _up, {passive: true, once: true});
                                topBodyCl.remove('tb_start_animate');
                                timer = null;
                            };
                    this.tfOn('lostpointercapture pointerup', _up, {passive: true, once: true})
                            .tfOn('pointermove', _startDrag, {passive: true, once: true})
                            .tfOn('pointermove', _move, {passive: true})
                            .setPointerCapture(e.pointerId);
                }

            }, {passive: true});

            box.tfOn(_CLICK_, e => {
                this._click(e);
            }, {passive: true});
            boxWrap.append(handler, box);
            wrapper.appendChild(boxWrap);
            if (data.after !== undefined) {
                wrapper.appendChild(self.after(data));
            }
            wrapper.append(createElement('', 'tb_position_box_label'), input);
            self.afterRun.push(() => {
                setTimeout(() => {
                    const css = getComputedStyle(box);
                    _this.w = parseInt(css.getPropertyValue('width'));
                    _this.h = parseInt(css.getPropertyValue('height'));
                    _this.update(data.id, v, self);
                }, 700);
            });
            data.label??= 'b_p';
            if (data.prop === 'background-position') {
                data.wrap_class??= 'tb_group_element_image tb_image_options';
            }
            return wrapper;
        }
    },
    slider_range: {
        update(id, v, self) {
            self.range.update(id,v,self);
            this.updateSlider(id,self);
        },
        updateSlider(id,self){
            const range=self.getEl(id),
                container=range.closest('.tb_slider_container'),
                wr=container.tfClass('tb_slider_wrapper')[0],
                output=wr.tfTag('output')[0].dataset,
                select=container.tfTag('select')[0],
                dataset=select[select.selectedIndex].dataset,
                slider=wr.querySelector('input[type="range"]'),
                min=parseFloat(dataset.min),
                max=parseFloat(dataset.max),
                wrSt=wr.style,
                v=range.value;
            output.unit = select.value;
            output.slider_before=v;
            slider.min =  min;
            slider.step = dataset.increment;
            slider.max = max;
            slider.value=v;
            wrSt.setProperty('--tb_slider_min', min);
            wrSt.setProperty('--tb_slider_before', v);
            wrSt.setProperty('--tb_slider_max', max);
        },
        render(data, self) {
            const container = createElement('','tb_slider_container tf_w'),
                    wrapper = createElement('',{class:'tb_slider_wrapper tf_rel tf_w',tabindex:'-1'}),
                    up = createElement('input'),
                    low = createElement('input'),
                    outputUp = createElement('output','tb_slider_output tb_slider_output_high'),
                    outputLow = createElement('output','tb_slider_output'),
                    fr = createDocumentFragment();
            let min = 0,
                    max = 100,
                    u = '%',
                    isMulti = true,
                    def = 1,
                    st = '--tb_slider_before:',
                    step = 1,
                    val,
                    input,
                    ref,
                    inputRange,
                    event=self.clicked==='styling'?'keyup':'change';
            if (data.options !== undefined) {
                if (data.options.min !== undefined) {
                    min = data.options.min;
                }
                if (data.options.max !== undefined) {
                    max = data.options.max;
                }
                if (data.options.unit !== undefined) {
                    u = data.options.unit;
                }
                if (data.options.range !== undefined) {
                    isMulti = false;
                }
                if (data.options.default !== undefined) {
                    def = data.options.default;
                }
                if (data.options.step !== undefined) {
                    step = data.options.step;
                }
                inputRange = !!data.options.inputRange;
            }
            wrapper.append(up, outputUp);
            fr.appendChild(wrapper);

            if(!inputRange){
                input = self.hidden.render(data, self);
                val = input.value;
                wrapper.appendChild(input);  
            }
            else{
                isMulti=false;
                const clone = api.Helper.cloneObject(data),
                        options = clone.options;
                Object.assign(clone, options);
                clone.class = clone.options = '';
                clone.increment = clone.step;
                const rangeWrap = self.range.render(clone, self).querySelector('.tb_range_input'),
                    selectUnit=rangeWrap.querySelector('select');
                inputRange=rangeWrap.querySelector('.tb_range');
                val=inputRange.tfOn(event, e => {
                    up.value = e.currentTarget.value;
                    Themify.triggerEvent(up, 'input');
                }, {passive: true}).value;
                if(selectUnit){
                    const id=clone.id,
                        dataset=selectUnit[selectUnit.selectedIndex].dataset;
                    u=selectUnit.tfOn('change',()=>{
                      this.updateSlider(id,self);
                    },{passive:true}).value;
                    min=dataset.min;
                    max=dataset.max;
                    step=dataset.increment;
                }
                fr.appendChild(rangeWrap);
            }

            min = parseFloat(min);
            max = parseFloat(max);
            up.type = low.type = 'range';
            up.min = low.min = min;
            up.step = low.step = step;
            up.max = low.max = max;
            if (u) {
                outputUp.dataset.unit = outputLow.dataset.unit = u;
            }
            wrapper.tfOn('input', e => {
                const t = e.target,
                        st = t === up ? 'before' : 'after',
                        lowVal = low.isConnected ? parseFloat(low.value) : '',
                        wr = e.currentTarget,
                        ouput = st === 'before' ? outputUp : outputLow,
                        upVal = parseFloat(up.value),
                        inputV = st === 'before' ? upVal : lowVal;
                        cancelAnimationFrame(ref);
                ref=requestAnimationFrame(() => {
                    let v = upVal;
                    if (lowVal !== '') {
                        v = upVal > lowVal ? (lowVal + ',' + upVal) : (upVal + ',' + lowVal);
                    }
                    ouput.dataset['slider_' + st] = inputV;
                    wr.style.setProperty('--tb_slider_' + st, inputV);
                    if (inputRange) {
                        inputRange.value = v;
                        if(e.isTrusted){
                            Themify.triggerEvent(inputRange,event);
                        }
                    }
                    else if(input){
                        input.value = v;
                        Themify.triggerEvent(input, event);
                    }
                });
            },
            {passive: true});

            if (isMulti) {
                const v = !val ? [min, max] : val.split(',');
                v[0] = parseFloat(v[0]);
                v[0] = v[0] > max ? max : (v[0] < min ? min : v[0]);
                if (v[1] === undefined) {
                    v[1] = v[0];
                } else {
                    v[1] = parseFloat(v[1]);
                    v[1] = v[1] > max ? max : (v[1] < min ? min : v[1]);
                }
                outputLow.dataset.slider_after = low.value = v[0];
                outputUp.dataset.slider_before = up.value = v[1];
                outputLow.className += ' tb_slider_output_low';

                st += v[1] + ';--tb_slider_after:' + v[0];
                wrapper.append(low, outputLow);
            } else {
                let v = val || def;
                if (v.toString().includes(',')) {
                    v = v.split(',')[0];
                }
                v = parseFloat(v);
                v = v > max ? max : (v < min ? min : v);
                outputUp.dataset.slider_before = up.value = v;
                st += v;
                wrapper.className += ' tb_slider_wrapper_single';
            }
            if (data.wrap_class !== undefined) {
                wrapper.className += ' ' + data.wrap_class;
            }

            if (min > 0) {
                st += ';--tb_slider_min:' + min;
            }
            if (max !== 100) {
                st += ';--tb_slider_max:' + max;
            }
            wrapper.style = st;
            container.appendChild(fr);
            return container;

        }
    },
    range: {
        update(id, v='', self) {
            const range = self.getEl(id);
            if (range !== null) {
                range.value = v;
                const unit_id = id + '_unit',
                        unit = self.getEl(unit_id);
                if (unit !== null && unit.tagName === 'SELECT') {
                    unit.value = self.getStyleVal(unit_id)??unit[0].value;
                    this._setData(range, (unit.selectedIndex !== -1 ? unit[unit.selectedIndex] : unit[0]));
                } else {
                    const angle = range.parentNode.tfClass('tb_angle_dot')[0];
                    if (angle) {
                        angle.style.transform = v === '' ? '' : 'rotate(' + v + 'deg)';
                    }
                }
            }
        },
        _setMinMax(range, min, max, step) {
            let v = parseFloat(range.value.trim());
            max=parseFloat(max);
            if(!isNaN(v) && (v > max || v < parseFloat(min))) {
                range.value  = v > max ? max : min;
            }
        },
        _setData(range, item) {
            const {min,max,increment:step} = item.dataset;
            range.min = min;
            range.max = max;
            range.step = step;
            this._setMinMax(range, min, max, step);
        },
        _controlChange(range, unit, event) {
            const is_select = unit?.tagName === 'SELECT',
                    _this = this;

            range.tfOn('pointerdown', function (e) {
                if (e.button === 0) {
                    if (!(this.classList.contains('tb_angle_input') && !this.parentNode.tfClass('tb_angle_circle')[0])) {
                        e.stopImmediatePropagation();
                    }
                    let lastY = e.clientY,
                            timer,
                            angle = null;
                    const old_v = this.value,
                            max = parseFloat(this.max),
                            min = parseFloat(this.min),
                            step = this.step || 1,
                            is_increment = step % 1 !== 0,
                            increment = !is_increment ? ~~step : parseFloat(step),
                            changeValue = condition => {
                                let cval = this.value || 0,
                                        val = !is_increment ? ~~cval : parseFloat(cval),
                                        v;
                                if ('increase' === condition) {
                                    v = val >= max ? max : (val + increment);
                                } else {
                                    v = val <= min ? min : (val - increment);
                                }
                                this.value = +v.toFixed(2);
                                if (angle === null) {
                                    angle = this.parentNode.tfClass('tb_angle_dot')[0];
                                }
                                if (angle) {
                                    angle.style.transform = 'rotate(' + v + 'deg)';
                                }
                            },
                            _start = e => {
                                e.stopPropagation();
                                topBodyCl.add('tb_start_animate', 'tb_move_drag');
                            },
                            _move = e => {
                                e.stopImmediatePropagation();
                                cancelAnimationFrame(timer);
                                const y = e.clientY,
                                    _this=this;
                                timer = requestAnimationFrame(() => {
                                    if (y < lastY) {
                                        changeValue('increase');
                                    } else if (y > lastY) {
                                        changeValue('decrease');
                                    }
                                    lastY = y;
                                    Themify.triggerEvent(_this, event);
                                });
                            },
                            _up = function (e) {
                                e.stopImmediatePropagation();
                                this.tfOff('pointermove', _move, {passive: true})
                                        .tfOff('pointermove', _start, {once: true, passive: true})
                                        .tfOff('lostpointercapture pointerup', _up, {once: true, passive: true});
                                cancelAnimationFrame(timer);
                                timer = lastY = angle = null;
                                if (this.value !== old_v) {
                                    Themify.triggerEvent(this, event);
                                    if (event !== 'change') {//to detect finish
                                        Themify.triggerEvent(this, 'change');
                                    }
                                }
                                topBodyCl.remove('tb_start_animate', 'tb_move_drag');
                            };
                    this.tfOn('lostpointercapture pointerup', _up, {once: true, passive: true})
                            .tfOn('pointermove', _start, {once: true, passive: true})
                            .tfOn('pointermove', _move, {passive: true})
                            .setPointerCapture(e.pointerId);
                }
            }, {passive: true});

            if (is_select === true) {
                unit.tfOn('change', function () {
                    _this._setData(range, this.options[ this.selectedIndex ]);
                    Themify.triggerEvent(range, event);
                }, {passive: true});
            }
            if (unit !== undefined) {
                this._setData(range, is_select ? (unit.selectedIndex !== -1 ? unit[unit.selectedIndex] : unit[0]) : unit);
            }
            range.tfOn('change', () => {
                this._setMinMax(range, range.min, range.max, range.step);
            }, {passive: true});
        },
        render(data, self) {
            const wrapper = createElement('','tb_tooltip_container tf_rel'),
                    range_wrap = createElement('','tb_range_input tf_inline_b tf_rel'),
                    input = createElement('input',{type:'number',autocomplete:'off',class:'tb_range'}),
                    units=data.units;
            let v = data.value ?? self.getStyleVal(data.id) ?? data.default??'',
                    select;
            
            if (v !== '') {
                v = parseFloat(v);
                input.value = v;
            }
            if (data.wrap_class !== undefined) {
                wrapper.className = ' ' + data.wrap_class;
            }
            if (data.placeholder !== undefined) {
                input.placeholder = data.placeholder;
            }
            if (self.is_repeat === true) {
                input.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                input.dataset.inputId = data.id;
            } else {
                input.className += ' tb_lb_option';
                input.id = data.id;
            }
            if (data.class !== undefined) {
                input.className += ' ' + data.class;
            }
            range_wrap.appendChild(input);
            if (data.tooltip !== undefined) {
                range_wrap.appendChild(self.hint(data.tooltip));
            }
            wrapper.appendChild(range_wrap);
            if (data.deg === true || units === undefined) {
                input.min = data.min || 0;
                input.max = data.deg === true ? 360 : (data.max || 1500);
                input.step = data.increment || 1;
            } else {
                const select_wrap = createElement('','noborder'),
                        keys = Object.keys(units);
                if (keys.length > 1) {
                    const select_id = data.id + '_unit',
                        uv = data.unit || self.getStyleVal(select_id) || data.default_unit;
                    select = createElement('select','tb_unit');

                    if (self.is_repeat === true) {
                        select.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                        select.dataset.inputId = select_id;
                    } else {
                        select.className += ' tb_lb_option';
                        select.id = select_id;
                    }
                    if (data.select_class !== undefined) {
                        select.className += ' ' + data.select_class;
                    }
                    for (let i in units) {
                        let opt = createElement('option',{value:i},i),
                            dataset=opt.dataset;
                        if(!units[i]){
                            units[i]={};
                        }
                        units[i].min??= 0;
                        units[i].max??= 100;
                        input.min = ~~units[i].min;
                        input.max = ~~units[i].max;
                        dataset.min = units[i].min;
                        dataset.max = units[i].max;
                        dataset.increment = units[i].increment || (i === 'em' || i === 'rem'? .1 : 1);
                        if (uv === i) {
                            opt.selected = true;
                        }
                        select.appendChild(opt);
                    }
                    self._initControl(select, {type: 'select', id: select_id, control: data.control});
                } else {
                    const unit = keys[0];
                    if(!units[unit]){
                        units[unit]={};
                    }
                    units[unit].min??= 0;
                    units[unit].max??= 100;
                    select = createElement('span',{class:'tb_unit',id:data.id + '_unit'},unit);
                    const min=parseFloat(units[unit].min),
                        max= parseFloat(units[unit].max),
                        dataset=select.dataset;
                    input.min = min;
                    input.max = max;
                    input.step = units[unit].increment !== undefined ? parseFloat(units[unit].increment) : 1;
                    if (v < min || v > max) {
                        input.value =v > max?max:min;
                    }
                    dataset.min = min;
                    dataset.max = max;
                    dataset.increment = units[unit].increment || (unit === 'em' || unit === 'rem'? .1 : 1);
                }
                select_wrap.appendChild(select);
                range_wrap.appendChild(select_wrap);
            }
            if (data.after !== undefined) {
                wrapper.appendChild(self.after(data));
            }
            if (data.description !== undefined) {
                wrapper.appendChild(self.description(data.description));
            }
            if (data.opposite === true) {
                select.tfOn('change', function (e) {
                    e.stopPropagation();
                    self.margin._changeUnit(this, self);
                }, {passive: true});
            }
            const event = data.event || (self.clicked === 'styling' ? 'keyup' : 'change'),
            ndata = api.Helper.cloneObject(data);
            this._controlChange(input, select, event);
            if (data.opposite === true) {
                input.tfOn(event, function (e) {
                    e.stopPropagation();
                    self.margin._changeOppositive(this);
                }, {passive: true});
            }
            ndata.type = 'range';
            self._initControl(input, ndata);
            return wrapper;
        }
    },
    icon: {
        render(data, self) {
            const f=createDocumentFragment(),
                    wr = createElement('','tb_icon_wrap'),
                    input = createElement('input',{class:'themify_field_icon',type:'text'}),
                    preview = createElement('span','tf_plus_icon themify_fa_toggle'),
                    clear = createElement('span', 'tb_clear_input tf_close'),
                    v = self.getStyleVal(data.id) || data.default;
            if (self.is_repeat === true) {
                input.className += self.is_sort === true ? ' tb_lb_sort_child' : ' tb_lb_option_child';
                input.dataset.inputId = data.id;
            } else {
                input.className += ' tb_lb_option';
                input.id = data.id;
            }
            if (data.class !== undefined) {
                input.className += ' ' + data.class;
            }
            if (v !== undefined && v!=='') {
                input.value = v;
                preview.appendChild(api.Helper.getIcon(v));
                self.afterRun.push(() => {
                    setTimeout(() => {
                        topThemify.fonts(v);
                    }, 100);
                });
            } else {
                preview.className += ' default_icon';
            }
            clear.tfOn(_CLICK_, e => {
                e.stopPropagation();
                input.value = '';
                Themify.triggerEvent(input, 'change');
            }, {passive: true});
            wr.append(self._initControl(input, data), preview, clear);
            f.appendChild(wr);
            if (data.after !== undefined) {
                f.appendChild(self.after(data));
            }
            if (data.description !== undefined) {
                f.appendChild(self.description(data.description));
            }
            return f;
        }
    },
    getMarginPaddingUnits(type, unit) {
        const units = {
            px: {
                min: (type === 'margin' ? -1500 : 0),
                max: 1500
            },
            em: {
                min: (type === 'margin' ? -10 : 0),
                max: 40
            },
            '%': {
                min: (type === 'margin' ? -100 : 0)
            }
        };
        return unit ? units[unit] : units;
    },
    createMarginPadding(type, data) {
        const options = data.options || [
                    {id: 'top'},
                    {id: 'bottom'},
                    {id: 'left'},
                    {id: 'right'}
                ],
                ul = createElement('ul','tb_seperate_items tb_has_opposite'),
                self = this,
                id = data.id,
                isBorderRadius = type === 'border_radius',
                range = api.Helper.cloneObject(data);
        range.units = data.units ?? this.getMarginPaddingUnits(type);
        range.prop = null;
        range.opposite = true;
        if (isBorderRadius === true) {
            ul.dataset.toptext = options[0].label;
        }
        let len = options.length,
                d = createDocumentFragment(),
                uncheck_all = false;
        for (let i = 0; i < len; ++i) {
            let li = createElement('li'),
                optId=options[i].id,
                prop_id = id + '_' + optId;

            range.id = prop_id;
            range.tooltip = options[i].label || optId;
            range.class = data.class || '';
            range.class += ' tb_multi_field tb_range_' + optId;
            if (isBorderRadius === true) {
                range.class += ' tb_is_border_radius';
            }
            let rangeEl = this.range.render(range, this);
            if (i !== 0 && i !== 3) {
                let oppId = optId === 'right' ? 'top' : optId,
                    opposite = createElement('li', 'tb_seperate_opposite tb_opposite_' + (oppId === 'bottom' ? 'top' : oppId));
                opposite.appendChild(this.checkboxGenerate('checkbox', {
                    id: id + '_opp_' + oppId,
                    class: 'style_apply_oppositive',
                    options: [
                        {name: '1', value: ''}
                    ]
                }
                ));
                let ch_op = opposite.querySelector('.style_apply_oppositive');
                ch_op.tfOn('change', function (e) {
                    e.stopPropagation();
                    self.margin._bindingOppositive(this, true);
                }, {passive: true})
                .parentNode.insertBefore(createElement('','tb_oppositive_state'), ch_op.nextSibling);
                
                if (ch_op.checked === true) {
                    self.afterRun.push(() => {
                        self.margin._bindingOppositive(ch_op);
                    });
                }

                d.appendChild(opposite);
            }
            li.appendChild(rangeEl);
            d.appendChild(li);
            let prop;
            if (isBorderRadius === true) {
                prop = 'border-';
                if (options[i].id === 'top') {
                    prop += 'top-left-radius';
                } else if (options[i].id === 'right') {
                    prop += 'top-right-radius';
                } else if (options[i].id === 'left') {
                    prop += 'bottom-left-radius';
                } else if (options[i].id === 'bottom') {
                    prop += 'bottom-right-radius';
                }
            } else if ('transform' === data.type) {
                prop = data.prop;
            } else {
                prop = data.prop + '-' + options[i].id;
                if (this.is_new === true && !uncheck_all && this.values[prop_id]) {
                    uncheck_all = true;
                }
            }
            this.styles[prop_id] = {prop: prop, selector: data.selector};
        }
        ul.appendChild(d);
        d = createDocumentFragment();
        d.appendChild(ul);
        if (len === 4) {
            d.appendChild(self.checkboxGenerate('icon_checkbox',
                    {
                        id: 'checkbox_' + id + '_apply_all',
                        class: 'style_apply_all',
                        options: [
                            {name: '1', value: 'all', icon: '<span class="apply_all_checkbox_icon">' + api.Helper.getIcon('ti-link').outerHTML + '</span>'}
                        ],
                        default: (this.component === 'module' && this.is_new === true && !uncheck_all) || Object.keys(this.values).length === 0 ? '1' : false
                    }
            ));
            const apply_all = d.querySelector('.style_apply_all');
            apply_all.tfOn('change', function () {
                self.margin._apply_all(this, true);
            }, {passive: true});
            if (apply_all.checked === true) {
                self.afterRun.push(() => {
                    self.margin._apply_all(apply_all);
                });
            }
        }
        return d;
    },
    margin_opposity: {
        update(id, v, self) {
            self.range.update(id, v, self);
            self.checkbox.update(id + '_opp_top', self.getStyleVal(id + '_opp_top'), self);
            self.range.update(self._stylesData[id].bottomId, self.getStyleVal(self._stylesData[id].bottomId), self);
        },
        render(data, self) {

            const items = ['topId', 'bottomId'],
                    ul = createElement('ul', 'tb_seperate_items tf_inline_b tb_has_opposite'),
                    range = api.Helper.cloneObject(data),
                    units = {
                        px: {
                            min: -1000,
                            max: 1000
                        },
                        em: {
                            min: -50,
                            max: 50
                        },
                        '%': {
                            min: -100
                        }
                    };
            for (let i = 0; i < 2; ++i) {
                let  li = createElement('li');
                range.id = data[items[i]];
                range.prop = items[i] === 'topId' ? 'margin-top' : 'margin-bottom';
                range.class = 'tb_multi_field tb_range_' + (items[i] === 'topId' ? 'top' : 'bottom');
                range.opposite = true;
                range.units = units;
                range.tooltip = items[i] === 'topId' ? i18n.top : i18n.bottom;
                li.appendChild(self.range.render(range, self));
                ul.appendChild(li);
                if (i === 0) {
                    let opposite = createElement('li','tb_seperate_opposite tb_opposite_top');
                    opposite.appendChild(self.checkboxGenerate('checkbox',
                            {
                                id: range.id + '_opp_top',
                                class: 'style_apply_oppositive',
                                options: [
                                    {name: '1', value: ''}
                                ]
                            }
                    ));
                    let ch_op = opposite.querySelector('.style_apply_oppositive');
                    ch_op.tfOn('change', function (e) {
                        e.stopPropagation();
                        self.margin._bindingOppositive(this, true);
                    }, {passive: true})
                    .parentNode.insertBefore(createElement('','tb_oppositive_state'), ch_op.nextSibling);

                    ul.appendChild(opposite);
                }
                self._stylesData[data[items[i]]] = self.styles[data[items[i]]] = {id: data[items[i]], type: data.type, prop: (items[i] === 'topId' ? 'margin-top' : 'margin-bottom'), selector: data.selector};
            }
            data.label??= 'm';
            return ul;
        }
    },
    margin: {
        _bindingOppositive(el, init) {
            const li = el.closest('.tb_seperate_opposite'),
                    p = li.parentNode,
                    isLeft = li.classList.contains('tb_opposite_left'),
                    firstItem = isLeft === true ? li.nextElementSibling : li.previousElementSibling,
                    isChecked = el.checked === true,
                    dir = this._getOppositiveDir(firstItem.tfClass('tb_range')[0]),
                    field = p.tfClass('tb_range_' + dir)[0],
                    u = field.closest('li').tfClass('tb_unit')[0];
            if (isChecked === true) {
                field.dataset.v = field.value;
                u.dataset.u = u.value;
                if (init === true) {
                    const firstInput = firstItem.tfClass('tb_range')[0],
                            v = firstInput.value,
                            v2 = field.value;
                    if (v !== '' || v2 === '') {
                        field.value = v;
                        u.value = firstItem.tfClass('tb_unit')[0].value;
                    } else {
                        firstInput.value = v2;
                        firstItem.tfClass('tb_unit')[0].value = u.value;
                    }

                }
            } else {
                const v = field.dataset.v;
                field.value = v??'';
                u.value = u.dataset.u;
            }
            if (init === true) {
                Themify.triggerEvent(field, 'keyup');
            }
        },
        _changeUnit(el, self) {
            const p = el.closest('.tb_has_opposite');
            if (!p.hasAttribute('data-checked')) {
                const input = self.getEl(el.id.replace(/_unit$/ig, '')),
                        dir = this._getOppositiveDir(input),
                        isBorder = input.classList.contains('tb_is_border_radius'),
                        chClass = dir === 'top' || (isBorder === true && dir === 'right') || (isBorder === false && dir === 'bottom') ? 'top' : 'left';
                if (p.tfClass('tb_opposite_' + chClass)[0].tfClass('style_apply_oppositive')[0].checked === true) {
                    p.tfClass('tb_range_' + dir)[0].closest('li').tfClass('tb_unit')[0].value = el.value;
                }
            }
        },
        _getOppositiveDir(el) {
            const cl = el.classList;
            let opp = cl.contains('tb_range_top') ? 'bottom' : (cl.contains('tb_range_bottom') ? 'top' : (cl.contains('tb_range_left') ? 'right' : 'left'));
            if (cl.contains('tb_is_border_radius')) {
                if (opp === 'bottom') {
                    opp = 'right';
                } else if (opp === 'top') {
                    opp = 'left';
                } else if (opp === 'left') {
                    opp = 'top';
                } else {
                    opp = 'bottom';
                }
            }
            return opp;
        },
        _changeOppositive(el) {
            const li = el.closest('li'),
                    p = li.parentNode;
            if (!p.hasAttribute('data-checked')) {
                const dir = this._getOppositiveDir(el),
                        isBorder = el.classList.contains('tb_is_border_radius'),
                        ch = dir === 'top' || (isBorder === true && dir === 'right') || (isBorder === false && dir === 'bottom') ? p.tfClass('tb_opposite_top')[0] : p.tfClass('tb_opposite_left')[0];
                if (ch.tfClass('style_apply_oppositive')[0].checked === true) {
                    p.tfClass('tb_range_' + dir)[0].value = el.value;
                }
            }
        },
        _apply_all(item, trigger) {
            const ul = item.closest('.tb_input').tfClass('tb_seperate_items')[0],
                    first = ul.tfTag('li')[0],
                    isChecked = item.checked === true;
            let text;
            if (isChecked === true) {
                ul.dataset.checked = 1;
                text = i18n.all;

            } else {
                ul.removeAttribute('data-checked');
                text = ul.dataset.toptext || i18n.top;
            }
            if (trigger === true) {
                Themify.triggerEvent(first.tfClass('tb_multi_field')[0], 'keyup');
            }
            first.tfClass('tb_tooltip_up')[0].textContent = text;
        },
        update(id, v, self) {
            const options = ['top', 'right', 'bottom', 'left'],
                    checkbox_id = 'checkbox_' + id + '_apply_all',
                    ch = self.getEl(checkbox_id),
                    apply_all = ch ? ch.tfClass('style_apply_all')[0] : null;
            for (let i = 3; i > -1; --i) {
                let nid = id + '_' + options[i],
                        el = self.getEl(nid);
                if (el !== null) {
                    self.range.update(nid, self.getStyleVal(nid), self);
                    if (!apply_all || apply_all.checked !== true) {
                        let oppositiveId = id + '_opp_' + options[i],
                            ch_oppositive = self.getEl(oppositiveId);
                        if (ch_oppositive !== null) {
                            ch_oppositive.tfClass('style_apply_oppositive')[0].checked = !!self.getStyleVal(oppositiveId);
                        }
                    }
                }

            }
            self.checkbox.update(checkbox_id, self.getStyleVal(checkbox_id), self);
            if (apply_all) {
                this._apply_all(apply_all);
            }
        },
        render(data, self) {
            data.label??= 'm';
            return self.createMarginPadding(data.type, data);
        }
    },
    padding: {
        render(data, self) {
            data.label??= 'p';
            return self.createMarginPadding(data.type, data);
        }
    },
    box_shadow: {
        update(id, v, self) {
            const options = ['hOffset', 'vOffset', 'blur', 'spread'],
                    color_id = id + '_color',
                    checkbox_id = id + '_inset';
            for (let i = 3; i > -1; --i) {
                let nid = id + '_' + options[i],
                        el = self.getEl(nid);
                if (el !== null) {
                    self.range.update(nid, self.getStyleVal(nid), self);
                }
            }
            self.color.update(color_id, self.getStyleVal(color_id), self);
            self.checkbox.update(checkbox_id, self.getStyleVal(checkbox_id), self);
        },
        render(data, self) {
            const {selector,prop,id} = data,
                    ranges = {
                        hOffset: {
                            label: 'h_o',
                            units: {px: {min: -200, max: 200}, em: {max: 40}}
                        },
                        vOffset: {
                            label: 'v_o',
                            units: {px: {min: -200, max: 200}, em: {max: 40}}
                        },
                        blur: {
                            label: 'bl',
                            units: {px: {max: 300}, em: {max: 40}}
                        },
                        spread: {
                            label: 'spr',
                            units: {px: {min: -200, max: 200}, em: {min: -10, max: 40}}
                        }
                    },
                    ul = createElement('ul','tb_seperate_items tb_shadow_inputs'),
                    range = api.Helper.cloneObject(data),
                    f = createDocumentFragment();

            range.class = 'tb_shadow_field';
            range.prop = null;
            for (let rangeField in ranges) {
                if (ranges[rangeField] !== undefined) {
                    let rField = ranges[rangeField],
                            li = createElement('li'),
                            prop_id = id + '_' + rangeField;
                    range.id = prop_id;
                    range.tooltip = rField.label;
                    range.units = rField.units;
                    range.selector = selector;
                    li.appendChild(self.range.render(range, self));
                    ul.appendChild(li);
                    self.styles[prop_id] = {prop: prop, selector: selector};
                }
            }
            // Add color field
            let prop_id = id + '_color';
            const li = createElement('li','tb_shadow_color'),
                    color = {id: prop_id, type: 'color', class: range.class, selector: selector};
            self.styles[prop_id] = {prop: prop, selector: selector, type: 'color'};
            li.appendChild(self.color.render(color, self));
            ul.appendChild(li);
            // Add inset checkbox
            prop_id = id + '_inset';
            const coptions = {
                id: prop_id,
                origID: id,
                type: 'checkbox',
                class: range.class,
                isBoxShadow: true,
                prop: prop,
                options: [
                    {value: 'in_sh', name: 'inset'}
                ]
            };
            self.styles[prop_id] = {prop: prop, selector: selector};

            f.append(ul, self.checkboxGenerate('checkbox', coptions));
            data.label??= 'b_s';
            return f;
        }
    },
    text_shadow: {
        update(id, v, self) {
            const options = ['hShadow', 'vShadow', 'blur'],
                    color_id = id + '_color';
            for (let i = 2; i > -1; --i) {
                let nid = id + '_' + options[i],
                        el = self.getEl(nid);
                if (el !== null) {
                    self.range.update(nid, self.getStyleVal(nid), self);
                }
            }
            self.color.update(color_id, self.getStyleVal(color_id), self);
        },
        render(data, self) {
            const {selector,prop,id} = data,
                    ranges = {
                        hShadow: {
                            label: 'h_sh',
                            units: {px: {min: -200, max: 200}, em: {max: 40}}
                        },
                        vShadow: {
                            label: 'v_sh',
                            units: {px: {min: -200, max: 200}, em: {max: 40}}
                        },
                        blur: {
                            label: 'bl',
                            units: {px: {max: 300}, em: {max: 40}}
                        }
                    },
                    ul = createElement('ul','tb_seperate_items tb_shadow_inputs'),
                    li = createElement('li','tb_shadow_color'),
                    prop_id = id + '_color',
                    color = {id: prop_id, type: 'color', class: 'tb_shadow_field', selector: selector},
                    range = api.Helper.cloneObject(data);

            range.class = 'tb_shadow_field';
            range.prop = null;
            for (let rangeField in ranges) {
                if (ranges.hasOwnProperty(rangeField)) {
                    let rField = ranges[rangeField],
                            li = createElement('li'),
                            prop_id = id + '_' + rangeField;
                    range.id = prop_id;
                    range.tooltip = rField.label;
                    range.units = rField.units;
                    li.appendChild(self.range.render(range, self));
                    ul.appendChild(li);
                    self.styles[prop_id] = {prop: prop, selector: selector};
                }
            }
            // Add color field
            self.styles[prop_id] = {prop: prop, selector: selector, type: 'color'};
            li.appendChild(self.color.render(color, self));
            ul.appendChild(li);
            data.label??= 't_sh';
            return ul;
        }
    },
    border_radius: {
        render(data, self) {
            data.options??= self.getOptions('border_radius');
            data.wrap_class??= 'border-radius-options';
            data.label??= 'r_c';
            return self.createMarginPadding(data.type, data);
        }
    },
    outline: {
        render(data, self) {
            self.styles[ data.id + '-c' ] = self.styles[ data.id + '-w' ] =self.styles[ data.id + '-s' ] = data.selector;
            data.label??= 'o';
            return self.create([
                {
                    type: 'multi',
                    options: [
                        {
                            type: 'color',
                            id: data.id + '-c',
                            class: 'outline_color'
                        },
                        {
                            type: 'range',
                            id: data.id + '-w',
                            units: {px: {max: 300}},
                            class: 'outline_width'
                        },
                        {
                            type: 'select',
                            id: data.id + '-s',
                            options: self.getOptions('border'),
                            class: 'outline_style'
                        }
                    ]
                }
            ]);
        }
    },
    border: {
        _changeControl(item) {
            const {parentNode:p,value:v} = item,
                    items = p.parentNode.children;
            for (let i = items.length - 1; i > -1; --i) {
                if (items[i] !== p) {
                    items[i].classList.toggle('_tb_hide_binding', v === 'none');
                }
            }
        },
        _apply_all(border, item) {
            const items = item.tfTag('input'),
                    disable =  (is_all, event)=> {
                        for (let i = items.length - 1; i > -1; --i) {
                            items[i].parentNode.classList.toggle('_tb_disable', is_all && items[i].value !== 'all');
                        }
                        if (is_all === true) {
                            border.dataset.checked = 1;
                        } else {
                            border.removeAttribute('data-checked');
                        }
                        if (event === true) {
                            Themify.triggerEvent(border.children[0].tfTag('select')[0], 'change');
                        }
                    };
            for (let i = items.length - 1; i > -1; --i) {
                items[i].tfOn('change', function () {
                    disable(this.value === 'all', true);
                }, {passive: true});
                if (items[i].checked === true && items[i].value === 'all') {
                    disable(true, null);
                }
            }
        },
        update(id, v, self) {
            const options = ['top', 'right', 'bottom', 'left'],
                    radio_id = id + '-type';
            for (let i = 0; i < 4; ++i) {
                let nid = id + '_' + options[i],
                        color_id = nid + '_color',
                        style_id = nid + '_style',
                        range_id = nid + '_width';
                self.color.update(color_id, self.getStyleVal(color_id), self);
                self.select.update(style_id, self.getStyleVal(style_id), self);
                this._changeControl(self.getEl(style_id));
                self.range.update(range_id, self.getStyleVal(range_id), self);
            }
            self.radio.update(radio_id, self.getStyleVal(radio_id), self);
        },
        render(data, self) {
            const options = ['top', 'right', 'bottom', 'left'],
                    ul = createElement('ul', 'tb_seperate_items tb_borders tb_group_element_border'),
                    orig_id = data.id,
                    _this = this,
                    selector = data.selector,
                    select = api.Helper.cloneObject(data),
                    radio = api.Helper.cloneObject(data),
                    d = createDocumentFragment();
            radio.options = [
                {value: 'all', name: 'all', class: 'style_apply_all ', icon: '<i class="tic-border-all"></i>', label_class: 'tb_radio_label_borders'}
            ];
            radio.option_js = true;
            radio.id = orig_id + '-type';
            radio.no_toggle = true;
            radio.default = 'top';
            radio.prop = null;

            select.options = self.getOptions('border');
            select.prop = null;

            for (let  i = 0; i < 4; ++i) {
                let li = createElement('li','tb_group_element_' + options[i]),
                        id = orig_id + '_' + options[i];
                radio.options.push({value: options[i], name: options[i], icon: '<i class="tic-border-' + options[i] + '"></i>', label_class: 'tb_radio_label_borders'});

                if (options[i] === 'top') {
                    li.className += ' tb_group_element_all';
                }
                self.styles[id + '_color'] = {prop: 'border-' + options[i], selector: selector};
                select.id = id + '_color';
                select.type = 'color';
                select.class = 'border_color';
                li.appendChild(self.color.render(select, self));

                self.styles[id + '_width'] = {prop: 'border-' + options[i], selector: selector};
                select.id = id + '_width';
                select.type = 'range';
                select.class = 'border_width';
                select.units = {px: {max: 300}};
                li.appendChild(self.range.render(select, self));

                self.styles[id + '_style'] = {prop: 'border-' + options[i], selector: selector};
                select.id = id + '_style';
                select.type = 'select';
                select.class = 'border_style tb_multi_field';
                let border_select = self.select.render(select, self),
                        select_item = border_select.querySelector('select');
                li.appendChild(border_select);
                ul.appendChild(li);
                select_item.tfOn('change', function () {
                    _this._changeControl(this);
                }, {passive: true});
                if (select_item.value === 'none') {
                    _this._changeControl(select_item);
                }
            }
            
            d.appendChild(self.radioGenerate('icon_radio', radio, self));
            _this._apply_all(ul, d.querySelector('#' + radio.id));
            d.appendChild(ul);
            data.label??= 'b';
            return d;
        }
    },
    slider: {
        render(data, self) {
            const label = data.label || 'sl_opt',
            /* backward compatibility for old predefined speed values */
            speeds = {
                fast : .5,
                normal : 1,
                slow : 4
            };
            // Backward compatibility #9463
            if (['crossfade', 'cover-fade', 'uncover-fade'].includes(self.values.effect_slider)) {
                self.values.effect_slider = 'fade';
            }
            if ( speeds[ self.values.speed_opt_slider ] ) {
                self.values.speed_opt_slider = speeds[ self.values.speed_opt_slider ];
            }
            return self.create([{
                    type: 'group',
                    label: i18n[label] || label,
                    display: 'accordion',
                    options: data.options || self.getOptions('slider_options'),
                    wrap_class: data.wrap_class
                }]);
        }
    },
    custom_css: {
        render(data, self) {
            data.class = 'large';
            data.control = false;
            data.help = 'custom_css_help';
            const el = self.text.render(data, self);
            api.activeModel.options(el.querySelector('#' + data.id), data.type);
            return el;
        }
    },
    custom_css_id: {
        render(data, self) {
            let el,
                inputArgs = {
                    id: 'custom_css_id',
                    required: {rule: 'custom_css_id', message: 'errorId'},
                    type: 'text',
                    label: 'id_name',
                    help: 'id_help',
                    control: false,
                    class: 'large',
                    wrap_class : 'tb_disable_dc'
                };
            if (data.accordion !== false) {
                const options = [];
                if (data.custom_css) {
                    options.push({
                        id: data.custom_css,
                        type: 'custom_css'
                    });
                }
                options.push(inputArgs);
                el = self.create([{
                        type: 'group',
                        label: 'cc',
                        display: 'accordion',
                        options: options,
                        wrap_class: 'tb_field_group_css'
                    }], self);
            } else {
                el = self.create([inputArgs], self);
            }
            const input=el.querySelector('#custom_css_id');
            if (self.component === 'row') {
                api.activeModel.options(input, data.type);
            }
            else{
                input.tfOn('input',e=>{
                    const _this= e.currentTarget, 
                        validate=api.Forms.getValidator('custom_css_id')(_this,api.activeModel.el),
                        errorText=validate===false? i18n.errorId:validate,
                        error1=_this.parentNode.tfClass('tb_field_error_msg')[0];
                    if(validate===true){
                        error1?.remove();
                        api.activeModel.el.id=_this.value;
                    }
                    else{
                        if(!error1){
                            _this.after(createElement('span','tb_field_error_msg',errorText));
                        }
                        else{
                            error1.textContent=errorText;
                        }
                    }
                },{passive:true});

            }
            return el;
        }
    },
    hidden: {
        update(id, v, self) {
            const hidden = self.getEl(id);
            if (hidden) {
                hidden.value = v || v;
            }
        },
        render(data, self) {
            let input = createElement('input'),
                value = self.getStyleVal(data.id) ?? data.value??data.default??'';
            if (value && typeof value === 'object') {
                try {
                    value = JSON.stringify(value);
                } 
                catch (e) {
                }
            }
            input.type = 'hidden';
            if (self.is_repeat === true) {
                input.className = self.is_sort === true ? 'tb_lb_sort_child' : 'tb_lb_option_child';
                input.dataset.inputId = data.id;
            } else {
                input.className = 'tb_lb_option';
                input.id = data.id;
            }
            if (data.class !== undefined) {
                input.className += ' ' + data.class;
            }
            input.value = value;
            return self._initControl(input, data);
        }
    },
    frame: {
        render(data, self) {
            data.options = self.getOptions('frame');
            data.class = 'tb_frame tf_scrollbar';
            data.binding = {
                not_empty: {show: ['tb_frame_multi_wrap', 'tb_frame_color']},
                empty: {hide: ['tb_frame_multi_wrap', 'tb_frame_color']}
            };
            return self.layout.render(data, self);
        }
    },
    title: {
        render(data, self) {
            data.control = {event: 'keyup', control_type: 'change', selector: '.module-title'};
            return self.text.render(data, self);
        }
    },
    url: {
        render(data, self) {
            data.input_type = 'url';
            const fr = createDocumentFragment(),
				input = self.text.render(data, self),
				link = createElement( 'button', { class : 'tb_add_link' },i18n.addl );

			link.tfOn(_CLICK_, async function() {
				if ( typeof TB_Link_Lightbox === 'undefined' ) {
					await Themify.loadJs( Themify.builder_url+'js/editor/lazy-components/link-lightbox.js',  );
					this.click();
        }
			}, { once: true } );

			fr.append(input, link);
			return fr;
        }
    },
    advacned_link: {
        render(data, self) {
            const opt = [
                {
                    id: 'link',
                    type: 'radio',
                    label: 'l',
                    wrap_class: ' tb_compact_radios',
                    link_to: true,
                    binding: {
                        permalink: {show: ['open_link','no_follow'], hide: 'custom_link'},
                        custom: {show: ['no_follow','custom_link'], hide: 'open_link'},
                        none: {hide: ['custom_link', 'open_link', 'no_follow']}
                    }
                },
                {
                    id: 'custom_link',
                    type: 'url',
                    label: 'cl'
                },
                {
                    id: 'open_link',
                    type: 'radio',
                    label: 'o_l',
                    link_type: true,
                    control: false,
                    wrap_class: ' tb_compact_radios',
                    binding: {
                        lightbox: {show: 'tb_t_m_lightbox'},
                        regular: {hide: 'tb_t_m_lightbox'},
                        newtab: {hide: 'tb_t_m_lightbox'}
                    }
                },
                {
                    type: 'multi',
                    wrap_class: 'tb_t_m_lightbox',
                    label: 'lg',
                    options: [
                        {
                            id: 'lightbox_w',
                            type: 'range',
                            label: 'w',
                            control: false,
                            default_unit:'%',
                            units: {
                                '%': '',
                                px: {
                                    max: 1000
                                }
                            }

                        },
                        {
                            id: 'lightbox_h',
                            type: 'range',
                            label: 'ht',
                            control: false,
                            default_unit:'%',
                            units: {
                                '%': '',
                                px: {
                                    max: 1000
                                }
                            }
                        }
                    ]
                }
            ];
            return self.create(opt);
        }
    },
    button: {
        render(data, self) {
            const btn = createElement('button',{type:'button',class:'builder_button',id:data.id},data.name);
            if (data.class !== undefined) {
                btn.className += ' ' + data.class;
            }
            return self._initControl(btn, data);
        }
    },
    row_anchor: {
        render(data, self) {
            data.control = false;
            const el = self.text.render(data, self);
            api.activeModel.options(el.querySelector('#' + data.id), data.type);
            return el;
        }
    },
    widget_form: {
        render(data) {
            return createElement('',{id:data.id,class:'module-widget-form-container wp-core-ui tb_lb_option'});
        }
    },
    widget_select: {
        _data: null,
        _cache: new Map,
        render(data, self) {
            const d = createDocumentFragment(),
                filter = createElement('',{id:'available-widgets-filter',class:'tf_inline_b tf_vmiddle tf_rel'}),
                loader = createElement('i','tb_loading_widgets tf_loader'),
                search = createElement('input',{type:'text',id:'widgets-search',autocomplete:'off',placeholder:i18n.search_widget,'data-validation':'not_empty','data-error-msg':'widget_validate'}),
                available = createElement('',{id:'available-widgets',class:'tf_scrollbar',tabindex:-1}),
                select = createElement('',{id:data.id,class:'tb_lb_option tb_widget_select'}),
                val = self.values[data.id],
                callback = () => {
                    const all_items = [],
                    select_widget = (item, instance_widget) => {
                        for (let i = all_items.length - 1; i > -1; --i) {
                            all_items[i].classList.remove('selected');
                        }
                        item.classList.add('selected');
                        const v = item.dataset.value;
                        search.value = item.tfClass('widget-title')[0].textContent;
                        available.style.display = 'none';

                        this._select(v, this._data[v].b, instance_widget, data);
                    };
                    for (let i in this._data) {
                        let w = createElement('',{class:'widget-tpl ' + this._data[i].b,'data-value':i}),
                            title = createElement('','widget-title');
                        title.appendChild(createElement('h3','',this._data[i].n));
                        w.tfOn(_CLICK_, function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            self.settings[data.id] = this.dataset.value;
                            select_widget(this, null);
                        })
                        .appendChild(title);
                        all_items.push(w);
                        if (this._data[i].d !== undefined) {
                            let desc = createElement('','widget-description');
                            desc.innerHTML = this._data[i].d;
                            w.appendChild(desc);
                        }
                        select.appendChild(w);
                        if (val === i) {
                            select_widget(w, self.values.instance_widget);
                        }
                    }
                    this._search(search, available);
                    loader.remove();
                };
            this._el = select;
            filter.append(loader, search);
            available.appendChild(select);
            d.append(filter, available);

            if (this._data === null) {
                api.LocalFetch({action: 'tb_get_widget_items'}).then(data => {
                    this._data = data;
                    callback();
                })
                .catch(() => {
                    api.Spinner.showLoader('error');
                });

                for (let i in themifyBuilder.widget_css) {
                    topThemify.loadCss(themifyBuilder.widget_css[i], null, themify_vars.wp);
                }
                themifyBuilder.widget_css = null;

            } else {
                setTimeout(callback, 5);
            }
            return d;
        },
        _search(search, available) {
            const _this = this;
            search.tfOn('focus', _this._show.bind(_this), {passive: true})
                    .tfOn('blur', e => {
                        if (e.relatedTarget?.id !== 'available-widgets') {
                            available.style.display = 'none';
                        }
                    }, {passive: true})
                    .tfOn('keyup', function () {
                        _this._show();
                        const val = this.value.trim(),
                                r = new RegExp(val, 'i'),
                                items = _this._el.tfClass('widget-tpl');
                        for (let i = 0; i < items.length; ++i) {
                            if (val === '') {
                                items[i].style.display = 'block';
                            } else {
                                let title = items[i].tfTag('h3')[0];
                                title = title.textContent || title.innerText;
                                items[i].style.display = r.test(title) ? '' : 'none';
                            }
                        }

                    }, {passive: true});
        },
        _show() {
            //this.$el.next('.tb_field_error_msg').remove();
            this._el.closest('#available-widgets').style.display = 'block';
        },
        _select(val, base, settings_instance, args) {
            const instance = $('#instance_widget', api.LightBox.el),
                    callback = data => {
                        const initjJS = () => {
                            const form = $(data.form);
                            instance.addClass('open').html(form.html());
                            if (settings_instance) {
                                for (let i in settings_instance) {
                                    instance.find('[name="' + i + '"]').val(settings_instance[i]);
                                }
                            }
                            if (base === 'text') {
                                if (topWindow.wp.textWidgets) {
                                    if (!this._textInit) {
                                        if (api.isVisual) {
                                            topWindow.wp.textWidgets.init();
                                        }
                                        this._textInit = true;
                                    }
                                    if (settings_instance) {
                                        delete topWindow.wp.textWidgets.widgetControls[settings_instance['widget-id']];
                                    }
                                }

                            } else if (topWindow.wp.mediaWidgets) {
                                if (!this._mediaInit) {
                                    topWindow.wp.mediaWidgets.init();
                                    this._mediaInit = true;
                                }
                                if (settings_instance) {
                                    delete topWindow.wp.mediaWidgets.widgetControls[settings_instance['widget-id']];
                                }
                            }

                            $(doc).trigger('widget-added', [instance]);
                            base === 'text' && ThemifyConstructor._initControl(instance.find('.wp-editor-area')[0], {control: {control_type: 'wp_editor', type: 'refresh'}});
                            const settings = api.Helper.cloneObject(args);
                            settings.id = instance[0].id;
                            instance.on('change', function () {
                                if (api.is_ajax_call === null) {
                                    ThemifyConstructor.control.widget_select(this, settings);
                                }
                            });
                            if (val) {
                                ThemifyConstructor.control.widget_select(instance[0], settings);
                            }
                            instance.removeClass('tb_loading_widgets_form').find('select').wrap('<span class="tf_inline_b tf_vmiddle tf_rel"/>');
                        },
                                extra = data => {
                                    let str = '';
                                    if (typeof data === 'object') {
                                        for (let i in data) {
                                            if (data[i]) {
                                                str += data[i];
                                            }
                                        }
                                    }
                                    if (str !== '') {
                                        const s = createElement('script');
                                        s.text = str;
                                        doc.tfTag('script')[0].before(s);
                                    }
                                },
                                recurisveLoader = (js, i) => {
                            const len = js.length;
                            Themify.loadJs(js[i].src, null, data.v).then(() => {
                                if (js[i].extra?.after) {
                                    extra(js[i].extra.after);
                                }
                                ++i;
                                i < len ? recurisveLoader(js, i) : initjJS();
                            });
                        };

                        if (!this._cache.has(base)) {
                            if (data.template) {
                                topBody.insertAdjacentHTML('beforeend', data.template);
                                if (api.isVisual) {
                                    body.insertAdjacentHTML('beforeend', data.template);
                                }
                            }
                            data.src.length > 0 ? recurisveLoader(data.src, 0) : initjJS();
                        } else {
                            initjJS();
                        }
                    };
            instance.addClass('tb_loading_widgets_form').html('<div class="tf_loader"></div>');

            // backward compatibility with how Widget module used to save data
            if (settings_instance) {
                for (let i in settings_instance) {
                    if ( ! i ) continue;
                    let old_pattern = i.match(/.*\[\d\]\[(.*)\]/);
                    if (old_pattern && old_pattern[1] !== undefined && Array.isArray(old_pattern)) {
                        delete settings_instance[ i ];
                        settings_instance[ old_pattern[1] ] = v;
                    }
                }
            }
            const ajaxData = {
                action: 'module_widget_get_form',
                load_class: val,
                tpl_loaded: this._cache.has(base) ? 1 : 0,
                id_base: base,
                widget_instance: settings_instance
            };
            api.LocalFetch(ajaxData).then(data => {
                if (data && data.form) {
                    callback(data);
                    this._cache.set(base, 1);
                }
            })
                    .catch(() => {
                        api.Spinner.showLoader('error');
                    });
        }
    },
    message: {
        render(data) {
            const d = createElement('',data.class || '');
            d.innerHTML = i18n[data.comment] || data.comment;
            return d;
        }
    },
    filters: {
        _getFields() {
            return {
                hue: {
                    label:'hue',
                    units: {deg: {max: 360}},
                    prop: 'hue-rotate'
                },
                saturation: {
                    label: 'sat',
                    units: {'%': {max: 200}},
                    prop: 'saturate'
                },
                brightness: {
                    label: 'bri',
                    units: {'%': {max: 200}},
                    prop: 'brightness'
                },
                contrast: {
                    label: 'con',
                    units: {'%': {max: 200}},
                    prop: 'contrast'
                },
                invert: {
                    label: 'inv',
                    units: {'%': ''},
                    prop: 'invert'
                },
                sepia: {
                    label: 'se',
                    units: {'%': ''},
                    prop: 'sepia'
                },
                opacity: {
                    label: 'op',
                    units: {'%': ''},
                    prop: 'opacity'
                },
                blur: {
                    label: 'bl',
                    units: {px: {max: 50}},
                    prop: 'blur'
                }
            };
        },
        update(id, v, self) {
            const ranges = this._getFields(),
                    mid = self._stylesData[id].mid;
            self.select.update(mid, self.getStyleVal(mid), self);
            for (let rangeField in ranges) {
                let type = rangeField === 'hue' ? 'angle' : 'range',
                        fid = id + '_' + rangeField;
                self[type].update(fid, self.getStyleVal(fid), self);
            }
        },
        render(data, self) {
            const sel = data.selector,
                    ranges = this._getFields(),
                    f = createDocumentFragment(),
                    ul = createElement('ul', 'tb_seperate_items tb_filters_fields'),
                    mode = self.create([{
                            id: data.mid,
                            type: 'select',
                            label: 'b_m',
                            prop: 'mix-blend-mode',
                            selector: sel,
                            blend: true
                        }]);
            for (let rangeField in ranges) {
                let rField = ranges[rangeField],
                        li = createElement('li');
                rField.id = data.id + '_' + rangeField;
                rField.class = 'tb_filters_field';
                rField.type = rangeField === 'hue' ? 'angle' : 'range';
                rField.selector = sel;
                li.appendChild(self.create([rField]));
                ul.appendChild(li);
            }
            f.append(mode, ul);
            return f;
        }
    },
    help(text) {
        const help = createElement('','tb_help tf_rel'),
                helpContent = createElement('', 'tb_help_content tf_hide tf_box'),
                icon = createElement('i',{class:'icon',tabindex:-1});
        helpContent.innerHTML = i18n[text] || text;
        icon.appendChild(api.Helper.getIcon('ti-help'));
        help.append(icon, helpContent);
        return help;
    },
    hint(text) {
        return createElement('span', 'tb_tooltip_up',i18n[text] || text);
    },
    description(text) {
        const d = createElement('small');
        d.innerHTML = i18n[text] || text;
        return d;
    },
    after(data) {
        const afterElem = createElement('span','tb_input_after',i18n[data.after] || data.after);
        if ((data.label === undefined || data.label === '')
                && (data.help !== undefined && data.help !== '')) {
            afterElem.appendChild(this.help(data.help));
        }
        return afterElem;
    },
    toggle_switch: {
        update(id, v, self) {
            self.checkbox.update(id, self.getStyleVal(id), self);
        },
        _controlChange(el, args) {
            el.tfOn('change', function () {
                this.value = this.checked === true ? args.on.name : (args.off?.name || '');
                if ('visibility' === ThemifyConstructor.clicked && null !== api.activeModel) {
                    api.activeModel.visibilityLabel();
                }
            }, {passive: true});
        },
        render(data, self) {
            let clone = api.Helper.cloneObject(data),
                orig = {},
                label = createElement('','switch_label'),
                state = 'off',
                v = self.getStyleVal(data.id);
            clone.control = false;
            if (clone.class === undefined) {
                clone.class = 'toggle_switch';
            } else {
                clone.class += ' toggle_switch';
            }
            let options = clone.options;
            if (options === undefined || options === 'simple') {
                if (options === 'simple') {
                    options = {
                        on: {
                            name: 'yes',
                            value: 'y'
                        },
                        off: {
                            name: 'no',
                            value: 'no'
                        }
                    };
                } else {
                    options = {
                        on: {
                            name: 'no',
                            value: 's'
                        },
                        off: {
                            name: 'yes',
                            value: 'hi'
                        }
                    };
                    clone.default??= 'on';
                }
            }
            if (v === undefined) {
                if (clone.default === 'on') {
                    state = 'on';
                }
                v = state === 'on' ? (options.on.name ?? '') : (options.off?.name ?? '');
            } else {
                if (v === false) {
                    v = '';
                }
                state = options.on.name === v ? 'on' : 'off';
            }
            for (let i in options) {
                let val=options[i].value;
                if (clone.after === undefined && val !== undefined) {
                    label.dataset[i] = i18n[val]?? val;
                }
                orig[i] = options[i];
            }
            const k = Object.keys(options)[0];
            delete clone.binding;
            delete options[k].value;
            delete clone.default;
            clone.options = [options[k]];
            clone.wrap_checkbox??= '';
            clone.wrap_checkbox += ' tb_switcher';
            const checkBox = self.checkboxGenerate('checkbox', clone),
                    sw = checkBox.querySelector('.toggle_switch');
            sw.value = v;
            sw.checked = state === 'on';
            this._controlChange(sw, orig);
            sw.parentNode.appendChild(label);
            self._initControl(sw, data);
            return checkBox;
        }
    },
    height: {
        update(id, v, self) {
            self.width.update(id, v, self);
        },
        render(data, self) {
            let units = {
                px: {
                    max: 3500
                },
                vh: '',
                '%': '',
                em: {
                    max: 200
                }
            },
            {minid,maxid} = data;
            /* explicit FALSE means to hide the option */
            if ( ! minid && false !== minid ) {
                minid = 'mi_h';
            }
            if ( ! maxid && false !== maxid ) {
                maxid = 'mx_h';
            }

            return self.width.render(data, self, minid, maxid, units);
        }
    },
    width: {
        update(id, v, self) {
            self.range.update(id, v, self);
        },
        render(data, self, minId, maxId, units) {
            if (!units) {
                units = {
                    px: {
                        max: 2000
                    },
                    '%': '',
                    em: {
                        max: 20
                    }
                };
            }
            const id = data.id,
                    prop = data.prop,
                    sel = data.selector,
                    wrapClass = 'tb_wrap_' + prop + '_field';

            if (prop === 'width') {
                if (!minId) {
                    minId = 'min_' + id;
                }
                if (!maxId) {
                    maxId = 'max_' + id;
                }
            }

            const opt =
                    [{
                            label: prop === 'width' ? 'w' : 'ht',
                            id: id,
                            type: 'range',
                            prop: prop,
                            selector: sel,
                            wrap_class: wrapClass,
                            units: units
                        },
                        {
                            id: id + '_auto_' + prop,
                            origId: id,
                            type: 'checkbox',
                            label: '',
                            prop: prop,
                            selector: sel,
                            options: [
                                {value: prop === 'width' ? 'a_wd' : 'a_ht', name: 'auto'}
                            ],
                            binding: {
                                checked: {hide: wrapClass},
                                not_checked: {show: wrapClass}
                            }
                        }
                    ];
            if ( minId !== false ) {
                opt.push( {
                    label: prop === 'width' ? 'mi_wd' : 'm_ht',
                    id: minId,
                    type: 'range',
                    prop: 'min-' + prop,
                    selector: sel,
                    units: units
                } );
            }
            if ( maxId !== false ) {
                opt.push( {
                    label: prop === 'width' ? 'ma_wd' : 'mx_ht',
                    id: maxId,
                    type: 'range',
                    prop: 'max-' + prop,
                    selector: sel,
                    units: units
                } );
            }
            return self.create(opt);
        }
    },
    aspectRatio: {
        update(id, v, self) {
            const range = v.split('/'),
                    from = range[0] || '',
                    to = range[1] || '',
                    inputs = self.getEl(id).closest('.tb_aspect_ratio').tfClass('tb_range');
            self.hidden.update(id, v, self);
            inputs[0].value = inputs[0].classList.contains('tb_aspect_to') ? to : from;
            inputs[1].value = inputs[1].classList.contains('tb_aspect_to') ? to : from;
        },
        render(data, self) {
            const v = self.getStyleVal(data.id) || '',
                    range = v.split('/'),
                    opt = {
                        type: 'multi',
                        label: 'asp',
                        wrap_class: 'tb_aspect_ratio',
                        options: [
                            {
                                type: 'hidden',
                                id: data.id,
                                prop: data.prop,
                                value: v || '',
                                selector: data.selector
                            },
                            {
                                type: 'range',
                                value: range[0] || '',
                                id: '',
                                min: 1
                            },
                            {
                                type: 'message',
                                comment: '/'
                            },
                            {
                                id: '',
                                class: 'tb_aspect_to',
                                type: 'range',
                                value: range[1] || '',
                                min: 1
                            }
                        ]
                    },
                    fields = self.create([opt]),
                    hidden = fields.querySelector('#' + data.id);
            for (let inputs = fields.querySelectorAll('.tb_lb_option'), i = inputs.length - 1; i > -1; --i) {
                if (inputs[i] !== hidden) {
                    inputs[i].tfOn('keyup', e => {
                        const el = e.currentTarget;
                        requestAnimationFrame(() => {
                            let oldV = hidden.value,
                                    index = el.classList.contains('tb_aspect_to') ? 1 : 0,
                                    nextIndex = index === 1 ? 0 : 1;
                            oldV = oldV.split('/');
                            oldV[index] = el.value;
                            if (!oldV[nextIndex]) {
                                oldV[nextIndex] = 1;
                            }
                            hidden.value = oldV.join('/');
                            Themify.triggerEvent(hidden, 'change');
                        });
                    }, {passive: true});
                }
            }
            return fields;
        }
    },
    zIndex: {
        update(id, v, self) {
            self.range.update(id, v, self);
        },
        render(data, self) {
            return self.create([
                {
                    id: data.id,
                    label: 'zi',
                    type: 'range',
                    prop: data.prop,
                    selector: data.selector,
                    min: -99999,
                    max: 99999,
                    help: 'zhelp'
                }
            ]);
        }
    },
    fontSize: {
        update(id, v, self) {
            self.range.update(id, v, self);
        },
        render(data, self, units) {
            if (!units) {
                units = data.units || {
                    px: {
                        min: 1,
                        max: 900
                    },
                    em: {
                        min: .1,
                        max: 50
                    },
                    '%': {
                        min: 1,
                        max: 4000
                    },
                    vw: {
                        min: 1,
                        max: 100
                    },
                    rem: {
                        min: .1,
                        max: 50
                    }
                };
            }
            const res = self.create([{
                    type: 'range',
                    id: data.id,
                    selector: data.selector,
                    prop: data.prop,
                    wrap_class: data.wrap_class,
                    class: data.class,
                    help: data.help,
                    description: data.description,
                    after: data.after,
                    units: units
                }]);
            if (data.prop === 'font-size') {
                data.label??= 'f_s';
            }
            return res;
        }
    },
    lineHeight: {
        update(id, v, self) {
            self.range.update(id, v, self);
        },
        render(data, self) {
            const units = data.units || {
                px: {
                    min: -400,
                    max: 400
                },
                em: {
                    min: .1,
                    max: 50
                },
                '%': {
                    min: 1,
                    max: 4000
                },
                vw: {
                    min: 1,
                    max: 100
                },
                rem: {
                    min: .1,
                    max: 50
                }
            },
            res = self.fontSize.render(data, self, units);
            data.label??= 'l_h';
            return res;
        }
    },
    letterSpace: {
        update(id, v, self) {
            self.range.update(id, v, self);
        },
        render(data, self) {
            const units = data.units || {
                px: {
                    min: -50,
                    max: 500
                },
                em: {
                    min: -3,
                    max: 50
                },
                vw: {
                    min: 1,
                    max: 100
                },
                rem: {
                    min: .1,
                    max: 50
                }
            },
            res = self.fontSize.render(data, self, units);
            data.label??= 'l_s';
            return res;
        }
    },
    fontStyle: {
        update(id, v, self) {
            const id2 = self._stylesData[id].id2;
            self.radio.update(id, v, self);
            self.radio.update(id2, self.getStyleVal(id2), self);
        },
        render(data, self) {
            const selector = data.selector,
                    res = self.create([{
                            type: 'multi',
                            wrap_class: 'tb_multi_fonts',
                            options: [
                                {
                                    id: data.id + '_regular',
                                    type: 'icon_radio',
                                    options: self.getOptions('font_style'),
                                    prop: data.prop,
                                    selector: selector
                                },
                                {
                                    id: data.id2,
                                    type: 'icon_radio',
                                    options: self.getOptions('font_weight'),
                                    prop: 'font-weight',
                                    selector: selector
                                }
                            ]
                        }]);
            data.label??= 'f_st';
            return res;
        }
    },
    position: {
        update(id, v, self) {
            self.select.update(id, v, self);
            for (let sides = ['top', 'right', 'bottom', 'left'], i = sides.length - 1; i > -1; --i) {
                let sid = id + '_' + sides[i],
                        autoId = sid + '_auto';
                self.range.update(sid, self.getStyleVal(sid), self);
                self.checkbox.update(autoId, self.getStyleVal(autoId), self);
            }
        },
        render(data, self) {
            const {id,selector,prop} = data,
                    cl = 'tb_css_pos',
                    groupOptions = [
                        {
                            type: 'select',
                            prop: prop,
                            id: id,
                            selector: selector,
                            class: data.class || '',
                            options: {
                                '': '',
                                static: 'st',
                                relative: 're',
                                absolute: 'abs',
                                fixed: 'fi'
                            },
                            binding: {
                                empty: {hide: cl},
                                static: {hide: cl},
                                relative: {show: cl},
                                absolute: {show: cl},
                                fixed: {show: cl}
                            }
                        }
                    ],
                    settings = [
                        {
                            type: 'group',
                            label: 'po',
                            wrap_class: 'tb_css_pos_wrap',
                            options: groupOptions
                        }
                    ];

            data.binding = groupOptions[0].binding;
            for (let sides = ['top', 'right', 'bottom', 'left'], i = 0; i < sides.length; ++i) {
                let sid = id + '_' + sides[i],
                        side = {
                            type: 'multi',
                            label: sides[i],
                            wrap_class: cl,
                            options: [
                                {
                                    type: 'range',
                                    id: sid,
                                    selector: selector,
                                    prop: sides[i],
                                    units: {px: {min: -2000, max: 2000}, '%': {min: -1000, max: 1000}}
                                },
                                {
                                    id: sid + '_auto',
                                    is_position: true,
                                    posId: sid,
                                    prop: sides[i],
                                    type: 'checkbox',
                                    selector: selector,
                                    options: [
                                        {name: 'auto', value: 'auto'}
                                    ],
                                    binding: {
                                        checked: {hide: sid},
                                        not_checked: {show: sid}
                                    }
                                }
                            ]
                        };
                groupOptions.push(side);
            }
            return self.create(settings);
        }
    },
    transform: {
        update(id, v, self) {
            for (let inputs = ['scale', 'translate', 'skew'], i = inputs.length - 1; i > -1; --i) {
                let k = id + '_' + inputs[i];
                self.margin.update(k, self.getStyleVal(k), self);
            }
            for (let inputs = ['x', 'y', 'z'], i = inputs.length - 1; i > -1; --i) {
                let k = id + '_rotate_' + inputs[i];
                self.angle.update(k, self.getStyleVal(k), self);
            }
            const k = id + '_position';
            self.position_box.update(k, self.getStyleVal(k), self);
        },
        render(data, self) {
            const {id,selector,prop} = data,
                    className = 'tb_transform_field ' + (data.class || ''),
                    options = [
                        {id: 'top', label: 'X'},
                        {id: 'bottom', label: 'Y'}
                    ],
                    transforms = [
                        {
                            type: 'group',
                            wrap_class: 'tb_transform_fields tf_w ' + (data.wrap_class || ''),
                            label: '',
                            options: [
                                {
                                    id: id + '_scale',
                                    type: 'margin',
                                    label: 'sc',
                                    prop: prop,
                                    selector: selector,
                                    class: className,
                                    units: {'': {min: -100, max: 1000, increment: .1}},
                                    options: options
                                },
                                {
                                    id: id + '_translate',
                                    type: 'margin',
                                    label: 'tl',
                                    prop: prop,
                                    selector: selector,
                                    class: className,
                                    units: {px: {min: -2000, max: 2000}, '%': {min: -100, max: 100}, em: {min: 0, max: 100}},
                                    options: options
                                },
                                {
                                    id: id + '_skew',
                                    type: 'margin',
                                    label: 'sk',
                                    prop: prop,
                                    selector: selector,
                                    class: className,
                                    units: {deg: {min: -180, max: 180}},
                                    options: options
                                },
                                {
                                    type: 'multi',
                                    label: 'ro',
                                    wrap_class: 'tb_tr_rotate',
                                    options: [
                                        {
                                            id: id + '_rotate_x',
                                            type: 'angle',
                                            tooltip: 'X',
                                            prop: 'rotate',
                                            selector: selector,
                                            class: className
                                        },
                                        {
                                            id: id + '_rotate_y',
                                            type: 'angle',
                                            tooltip: 'Y',
                                            prop: 'rotate',
                                            selector: selector,
                                            class: className
                                        },
                                        {
                                            id: id + '_rotate_z',
                                            type: 'angle',
                                            tooltip: 'Z',
                                            prop: 'rotate',
                                            selector: selector,
                                            class: className
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            id: id + '_position',
                            label: 'orig',
                            type: 'position_box',
                            prop: 'transform-origin',
                            selector: selector
                        }
                    ];
            return self.create(transforms);
        }
    },
    clickable: {
        render(data, self) {
            let options = self.create([
                {
                    type: 'group',
                    label:'l',
                    display: 'accordion',
                    wrap_class: 'tf_w',
                    options: [
                        {
                            type: 'url',
                            id: '_link',
                            label:'clickl',
                            binding: {
                                empty: {hide: [ '_link_o', '_link_n' ] },
                                not_empty: {show: [ '_link_o', '_link_n' ] }
                            }
                        },
                        {
                            type: 'toggle_switch',
                            id: '_link_o',
                            label: 'houtl'
                        },
                        {
                            id: '_link_n',
                            type: 'radio',
                            label: 'o_l',
                            options : [
                                { value : 'no', name : 'swin' },
                                { value : 'yes', name : 'ntab' },
                                { value : 'lb', name : 'lg' }
                            ],
                            binding: {
                                no: { hide: 'clickl_lbdim' },
                                yes: { hide: 'clickl_lbdim' },
                                lb: { show: 'clickl_lbdim' }
                            }
                        },
                        {
                            type: 'multi',
                            label: 'lbdim',
                            id: 'clickl_lbdim',
                            options: [
                                {
                                    id: '_link_lw',
                                    type: 'range',
                                    label: 'w',
                                    control: false,
                                    units: {
                                        px: {
                                            max: 3500
                                        },
                                        '%': ''
                                    }
                                },
                                {
                                    id: '_link_lh',
                                    type: 'range',
                                    label: 'ht',
                                    control: false,
                                    units: {
                                        px: {
                                            max: 3500
                                        },
                                        '%': ''
                                    }
                                }
                            ]
                        },
                    ]
                }
            ]);
            if ( api.isVisual ) {
                options = this._bindEvents(options);
            }

            return options;
        },
        _bindEvents( options ) {
            const link = options.querySelector( '#_link' ),
                outline = options.querySelector( '#_link_o input' );
            link.tfOn( 'input', () => {
                this._updatePreview(link.value, outline.checked);
            } );
            outline.tfOn( 'change', () => {
                this._updatePreview(link.value, outline.checked);
            } );
            Themify.loadCss( ThemifyBuilderModuleJs.cssUrl + 'clickable-component', 'tf_clickablecomponent' );

            return options;
        },
        _updatePreview( link, outline ) {
            if ( outline && link !== '' ) {
                api.liveStylingInstance.el.dataset.tb_link = link;
                api.liveStylingInstance.el.classList.add( 'tb_link_outline' );
            } else {
                delete api.liveStylingInstance.el.dataset.tb_link;
                api.liveStylingInstance.el.classList.remove( 'tb_link_outline' );
            }
        }
    },
    code: {
        render(data, self) {
            const lngOpt = {
                markup: "Markup(markup, html, xml, svg, mathml, ssml, atom, rss)",
                css: "CSS",
                javascript: "JavaScript",
                abap: "ABAP",
                abnf: "ABNF",
                actionscript: "ActionScript",
                ada: "Ada",
                agda: "Agda",
                al: "AL",
                antlr4: "ANTLR4",
                apacheconf: "Apache Configuration",
                apex: "Apex",
                apl: "APL",
                applescript: "AppleScript",
                aql: "AQL",
                arduino: "Arduino",
                arff: "ARFF",
                armasm: "ARM Assembly",
                arturo: "Arturo",
                asciidoc: "AsciiDoc",
                aspnet: "ASP.NET (C#)",
                asm6502: "6502 Assembly",
                asmatmel: "Atmel AVR Assembly",
                autohotkey: "AutoHotkey",
                autoit: "AutoIt",
                avisynth: "AviSynth",
                'avro-idl': "Avro IDL",
                awk: "AWK",
                bash: "Bash",
                basic: "BASIC",
                batch: "Batch",
                bbcode: "BBcode",
                bbj: "BBj",
                bicep: "Bicep",
                birb: "Birb",
                bison: "Bison",
                bnf: "BNF",
                bqn: "BQN",
                brainfuck: "Brainfuck",
                brightscript: "BrightScript",
                bro: "Bro",
                bsl: "BSL (1C:Enterprise)",
                c: "C",
                csharp: "C#",
                cpp: "C++",
                cfscript: "CFScript",
                chaiscript: "ChaiScript",
                cil: "CIL",
                cilkc: "Cilk/C",
                cilkcpp: "Cilk/C++",
                clojure: "Clojure",
                cmake: "CMake",
                cobol: "COBOL",
                coffeescript: "CoffeeScript",
                concurnas: "Concurnas",
                csp: "Content-Security-Policy",
                cooklang: "Cooklang",
                coq: "Coq",
                crystal: "Crystal",
                csv: "CSV",
                cue: "CUE",
                cypher: "Cypher",
                d: "D",
                dart: "Dart",
                dataweave: "DataWeave",
                dax: "DAX",
                dhall: "Dhall",
                diff: "Diff",
                django: "Django/Jinja2",
                'dns-zone-file': "DNS zone file",
                docker: "Docker",
                dot: "DOT (Graphviz)",
                ebnf: "EBNF",
                editorconfig: "EditorConfig",
                eiffel: "Eiffel",
                ejs: "EJS",
                elixir: "Elixir",
                elm: "Elm",
                etlua: "Embedded Lua templating",
                erb: "ERB",
                erlang: "Erlang",
                'excel-formula': "Excel Formula",
                fsharp: "F#",
                factor: "Factor",
                flow: "Flow",
                fortran: "Fortran",
                ftl: "FreeMarker Template Language",
                gml: "GameMaker Language",
                gap: "GAP (CAS)",
                gcode: "G-code",
                gdscript: "GDScript",
                gedcom: "GEDCOM",
                gettext: "gettext",
                gherkin: "Gherkin",
                git: "Git",
                glsl: "GLSL",
                gn: "GN",
                'linker-script': "GNU Linker Script",
                go: "Go",
                'go-module': "Go module",
                gradle: "Gradle",
                graphql: "GraphQL",
                groovy: "Groovy",
                haml: "Haml",
                handlebars: "Handlebars",
                haskell: "Haskell",
                haxe: "Haxe",
                hcl: "HCL",
                hlsl: "HLSL",
                hoon: "Hoon",
                http: "HTTP",
                hpkp: "HTTP Public-Key-Pins",
                hsts: "HTTP Strict-Transport-Security",
                ichigojam: "IchigoJam",
                icon: "Icon",
                'icu-message-format': "ICU Message Format",
                idris: "Idris",
                ignore: ".ignore",
                inform7: "Inform 7",
                ini: "Ini",
                io: "Io",
                j: "J",
                java: "Java",
                javadoclike: "JavaDoc-like",
                javastacktrace: "Java stack trace",
                jexl: "Jexl",
                jolie: "Jolie",
                jq: "JQ",
                jsdoc: "JSDoc",
                json: "JSON",
                json5: "JSON5",
                jsonp: "JSONP",
                jsstacktrace: "JS stack trace",
                julia: "Julia",
                keepalived: "Keepalived Configure",
                keyman: "Keyman",
                kotlin: "Kotlin",
                kumir: "KuMir (КуМир)",
                kusto: "Kusto",
                latex: "LaTeX",
                latte: "Latte",
                less: "Less",
                lilypond: "LilyPond",
                liquid: "Liquid",
                lisp: "Lisp",
                livescript: "LiveScript",
                llvm: "LLVM IR",
                log: "Log file",
                lolcode: "LOLCODE",
                lua: "Lua",
                magma: "Magma (CAS)",
                makefile: "Makefile",
                markdown: "Markdown",
                mata: "Mata",
                matlab: "MATLAB",
                maxscript: "MAXScript",
                mel: "MEL",
                mermaid: "Mermaid",
                metafont: "METAFONT",
                mizar: "Mizar",
                mongodb: "MongoDB",
                monkey: "Monkey",
                moonscript: "MoonScript",
                n1ql: "N1QL",
                n4js: "N4JS",
                'nand2tetris-hdl': "Nand To Tetris HDL",
                naniscript: "Naninovel Script",
                nasm: "NASM",
                neon: "NEON",
                nevod: "Nevod",
                nginx: "Nginx",
                nim: "Nim",
                nix: "Nix",
                nsis: "NSIS",
                objectivec: "Objective-C",
                ocaml: "OCaml",
                odin: "Odin",
                opencl: "OpenCL",
                openqasm: "OpenQasm",
                oz: "Oz",
                parigp: "PARI/GP",
                parser: "Parser",
                pascal: "Pascal",
                pascaligo: "Pascaligo",
                psl: "PATROL Scripting Language",
                pcaxis: "PC-Axis",
                peoplecode: "PeopleCode",
                perl: "Perl",
                php: "PHP",
                phpdoc: "PHPDoc",
                'plant-uml': "PlantUML",
                plsql: "PL/SQL",
                powerquery: "PowerQuery",
                powershell: "PowerShell",
                processing: "Processing",
                prolog: "Prolog",
                promql: "PromQL",
                properties: ".properties",
                protobuf: "Protocol Buffers",
                pug: "Pug",
                puppet: "Puppet",
                pure: "Pure",
                purebasic: "PureBasic",
                purescript: "PureScript",
                python: "Python",
                qsharp: "Q#",
                q: "Q (kdb+ database)",
                qml: "QML",
                qore: "Qore",
                r: "R",
                racket: "Racket",
                cshtml: "Razor C#",
                jsx: "React JSX",
                tsx: "React TSX",
                reason: "Reason",
                regex: "Regex",
                rego: "Rego",
                renpy: "Ren'py",
                rescript: "ReScript",
                rest: "reST (reStructuredText)",
                rip: "Rip",
                roboconf: "Roboconf",
                robotframework: "Robot Framework",
                ruby: "Ruby",
                rust: "Rust",
                sas: "SAS",
                sass: "Sass (Sass)",
                scss: "Sass (SCSS)",
                scala: "Scala",
                scheme: "Scheme",
                'shell-session': "Shell session",
                smali: "Smali",
                smalltalk: "Smalltalk",
                smarty: "Smarty",
                sml: "SML",
                solidity: "Solidity (Ethereum)",
                'solution-file': "Solution file",
                soy: "Soy (Closure Template)",
                sparql: "SPARQL",
                'splunk-spl': "Splunk SPL",
                sqf: "SQF:Status Quo Function (Arma 3)",
                sql: "SQL",
                squirrel: "Squirrel",
                stan: "Stan",
                stata: "Stata Ado",
                iecst: "Structured Text (IEC 61131-3)",
                stylus: "Stylus",
                supercollider: "SuperCollider",
                swift: "Swift",
                systemd: "Systemd configuration file",
                't4-templating': "T4 templating",
                't4-cs': "T4 Text Templates (C#)",
                't4-vb': "T4 Text Templates (VB)",
                tap: "TAP",
                tcl: "Tcl",
                tt2: "Template Toolkit 2",
                textile: "Textile",
                toml: "TOML",
                tremor: "Tremor",
                turtle: "Turtle",
                twig: "Twig",
                typescript: "TypeScript",
                typoscript: "TypoScript",
                unrealscript: "UnrealScript",
                uorazor: "UO Razor Script",
                uri: "URI",
                v: "V",
                vala: "Vala",
                vbnet: "VB.Net",
                velocity: "Velocity",
                verilog: "Verilog",
                vhdl: "VHDL",
                vim: "vim",
                'visual-basic': "Visual Basic",
                warpscript: "WarpScript",
                wasm: "WebAssembly",
                'web-idl': "Web IDL",
                wgsl: "WGSL",
                wiki: "Wiki markup",
                wolfram: "Wolfram language",
                wren: "Wren",
                xeora: "Xeora",
                'xml-doc': "XML doc (.net)",
                xojo: "Xojo (REALbasic)",
                xquery: "XQuery",
                yaml: "YAML",
                yang: "YANG",
                zig: "Zig"
            },
                    themeOpt = {
                        '': 'Default',
                        a11y_d: 'A11y Dark',
                        atom_d: 'Atom Dark',
                        cb: 'CB',
                        cld_c: 'Coldark Cold',
                        cld_d: 'Coldark Dark',
                        coy: 'Coy',
                        dark: 'Dark',
                        dracula: 'Dracula',
                        du_d: 'Duotone Dark',
                        du_f: 'Duotone Forest',
                        gr_d: 'Gruvbox Dark',
                        gr_l: 'Gruvbox Light',
                        lucario: 'Lucario',
                        mt_l: 'Material Light',
                        night_owl: 'Night Owl',
                        okaidia: 'Okaidia',
                        tmr: 'Tomorrow Night',
                        twilight: 'Twilight',
                        vs: 'VS',
                        vs_d_p: 'VS Dark Plus'
                    },
                    options = [
                        {
                            id: 'lng',
                            label: data.options.lng,
                            type: 'select',
                            options: lngOpt
                        },
                        {
                            id: 'theme',
                            label: data.options.theme,
                            type: 'select',
                            options: themeOpt
                        },
                        {
                            id: 'code',
                            label: data.options.code,
                            type: 'textarea',
                            codeeditor: self.getStyleVal('lng') || 'javascript',
                            control: {event: 'change'}
                        }
                    ],
                    fr = self.create(options),
                    lng = fr.querySelector('#lng'),
                    code = fr.querySelector('#code');
            lng.tfOn('change', e => {
                const mirror = code.tf_mirror;
                if (mirror) {
                    mirror.save();
                    mirror.destroy();
                }
                api.Helper.codeMirror(code, e.currentTarget.value).then(obj => {
                    obj?.editor.on('change', () => {
                        Themify.triggerEvent(obj.el, 'change');
                    });
                });
            }, {passive: true});
            return fr;
        }
    },
    image_size: {
        render(data, self) {
            if (themifyBuilder.imgphp) {
                const sizes = self.getOptions('image_size');
                if (sizes) {
                    return self.create([
                        {
                            type: 'select',
                            id: data.id,
                            label: data.label || 'imgs',
                            binding: data.binding,
                            help: data.help,
                            wrap_class: data.wrap_class,
                            after: data.after,
                            options: sizes
                        }
                    ]);
                }
            }
            return false;
        }
    },
    post_filter: {
        render(data, self) {
            return self.create([
                {
                    id: 'post_filter',
                    type: 'toggle_switch',
                    label: self.type.includes('product') ? 'productf' : 'postf',
                    options: 'simple',
                    wrap_class: 'tb_group_element_all tb_group_element_category',
                    default:'off',
                    binding: {
                        not_checked: {
                            show: [
                                'disable_masonry',
                                'masonry',
                                'sort' /* WooCommerce Catalog Ordering */
                            ],
                            hide: [
                                'filter_hashtag',
                                'ajax_filter_wrap'
                            ]
                        },
                        checked: {
                            hide: [
                                'disable_masonry',
                                'masonry',
                                'sort'
                            ],
                            show: [
                                'filter_hashtag',
                                'ajax_filter_wrap'
                            ]
                        }
                    }
                },
                {
                    id: 'filter_hashtag',
                    type: 'toggle_switch',
                    label: 'uhtag',
                    options: 'simple',
                    default:'off'
                },
                {
                    type: 'group',
                    wrap_class: 'ajax_filter_wrap tf_w',
                    options: [
                        {
                            id: 'ajax_filter',
                            type: 'toggle_switch',
                            label: 'ajaxf',
                            options: 'simple',
                            default:'off',
                            binding: {
                                not_checked: {
                                    hide: 'ajax_filter_cat_wrap'
                                },
                                checked: {
                                    show: 'ajax_filter_cat_wrap'
                                }
                            }
                        },
                        {
                            type: 'group',
                            wrap_class: 'ajax_filter_cat_wrap tf_w',
                            options: [
                                {
                                    id: 'ajax_filter_categories',
                                    type: 'radio',
                                    label: '',
                                    default: 'exclude',
                                    options: [
                                        {
                                            value: 'include',
                                            name: 'include'
                                        },
                                        {
                                            value: 'exclude',
                                            name: 'exclude'
                                        }
                                    ],
                                    binding: {
                                        include: {
                                            hide: 'ajax_filter_exclude',
                                            show: 'ajax_filter_include'
                                        },
                                        exclude: {
                                            hide: 'ajax_filter_include',
                                            show: 'ajax_filter_exclude'
                                        }
                                    }
                                },
                                {
                                    id: 'ajax_filter_exclude',
                                    type: 'text',
                                    class: 'large',
                                    label: 'exclcatf',
                                    help: 'exclcatfh'
                                },
                                {
                                    id: 'ajax_filter_include',
                                    type: 'text',
                                    class: 'large',
                                    label: 'inclcatf',
                                    help: 'inclcatfh'
                                },
                                {
                                    id: 'ajax_sort',
                                    type: 'toggle_switch',
                                    label: 'sortf',
                                    options: 'simple',
                                    default:'off'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'masonry_align',
                    type: 'toggle_switch',
                    label: 'alignp',
                    options: 'simple',
                    help: 'alignph',
                    default:'off'
                }
            ], self);
        }
    },
    grid_flow:{
        update(id, v, self) {
            return self.radio.update(id, v, self);
        },
        render(data,self){
            data.label='gflow';
            data.option_js=true;
            data.default='row';
            data.no_toggle=1;
            const url=Themify.builder_url + 'css/editor/img/alignment.svg#';
            data.options=[
                {
                    value: 'row',
                    name: 'vertical',
                    icon:'<svg class="tb_align"><use href="'+url + 'vertical"/></svg>'
                },
                {
                    value: 'column',
                    name: 'hrztal',
                    icon:'<svg class="tb_align"><use href="'+url + 'horizontal"/></svg>'
                }
            ];
            return self.icon_radio.render(data,self);
        }
    },
    gap:{
        update(id, v, self) {
           return self.slider_range.update(id, v, self);
        },
        render(data,self){
          const units = data.units || {
                px: {
                    max: 1000
                },
                em: {
                    max: 50
                }
            },
            prop=data.prop;
            if(!data.units && prop !== 'row-gap'){
                units['%']='';
            }
            const clone={...data,...{
                grid_gap: 1,
                units:units,
                options: {
                    unit:self.getStyleVal(data.id+'_unit') || (units['%']!==undefined?'%':'px'),
                    default:0,
                    inputRange: true,
                    range: false
                }     
          }};
          data.label??=(prop === 'column-gap' ? 'ng' : (prop === 'row-gap' ? 'rg' : 'gap'));
          return self.slider_range.render(clone,self);
      }  
    },
    grid:{
        id:'tb_grid_lb_root',
        update(id, v, self,prevbreakpoint){
            const el=self.getEl(id),
                newVals=api.Forms.parseSettings(el).v,
                tmp={};
            el.replaceWith(this.render(self._stylesData[id],self));
            for(let k in newVals){
                tmp[prevbreakpoint+'_'+k]=newVals[k];
            }
            self.values[id] = {...self.values[id],...tmp};
        },
        get(){
            const vals=ThemifyConstructor.values[this.id];
            return vals?{...vals}:null;
        },
        set(vals){
            const self=ThemifyConstructor,
                id=this.id,
                el=self.getEl(id),
                selectedGrid=el?.shadowRoot.querySelector('.grid_list .selected').dataset.grid,
                size=vals[api.activeBreakPoint+'_size']?.toString();
            self.values[id]={...vals};
            if(size!==selectedGrid && el){
                el.replaceWith(this.render(self._stylesData[id],self));
            }
        },
        render(data,self){
            let id=this.id,
                root=createElement('',{id:id,class:'tf_w tb_lb_option tb_grid_root'}),
                tmp=createElement('',{id:'grid',class:'tb_field'}),
                row=doc.tfId('tmpl-builder_row_action').content,
                formStyle=row.querySelector('#module_form_fields_style').cloneNode(true),
                gridStyle=row.querySelector('#module_row_grids_style').cloneNode(true),
                gridCss=doc.tfId('module_lightbox_grid_style').cloneNode(true),
                fields={
                    grid_list:'pgrids',
                    alignment:'align',
                    auto_dir:'cht',
                    right:'gutter'
                },
                fr=createDocumentFragment();
        /*
                sel=self.type==='subrow'?'module_subrow':self.type + '_inner',
                inner=api.activeModel.el.tfClass(sel)[0];

                computed=getComputedStyle(inner),
                cols = computed.getPropertyValue('--col').replace(/\s\s+/g, ' ').trim();
                if (!cols || cols==='none' || cols.includes('repeat')) {
                    const areaLength=computed.getPropertyValue('--area').replace(/[\r\n]/gm, '').replace(/  +/g, ' ').trim().split('" "')[0].trim().split(' ').length;
                    cols = ('1fr '.repeat(areaLength)).trim();
                }
            }*/
            if(self._stylesData[id]===undefined){
                self.values[id]={...api.activeModel.get('sizes')};
                self._stylesData[id] = api.Helper.cloneObject(data);
            }
            gridCss.removeAttribute('type');
            api.activeModel.gridMenu(tmp);
            for(let sel in fields){
                let item=tmp.querySelector('.'+sel),
                    wrap=createElement();
                if(sel!=='grid_list'){
                    let cl=sel==='right'?'gutter':sel;
                    wrap.className=cl+'_wrap';
                    if(cl!=='alignment'){
                        wrap.className+=' alignment_wrap';
                    }
                }
                wrap.append(createElement('','tb_label',i18n[fields[sel]]),item);
                fr.appendChild(wrap);
            }
            /*
            cols = cols.split(' ');
            for(let i=0;i<cols.length;++i){
                let sl= self.slider_range.render({
                    id:'',
                    options: {
                        min: 1,
                        max: 10,
                        unit: 'fr',
                        step:.1,
                        range:false,
                        inputRange:true,
                        default: cols[i]
                    }
                },self),
                wrap=createElement(),
                label=createElement(),
                col,
                prevVal=0,
                obj=null;
                label.className='tb_label';
                label.textContent='Column '+(i+1);
                wrap.tfOn('change',e=>{
                    if(!col){
                        col= api.Utils.getColumns(inner)[i].querySelector(':scope>.tb_drag_right');
                    }
                    if(obj===null){
                        if(!e.isTrusted){
                            obj=new api.columnResize();
                            obj.start({target:col});
                        }
                        else{
                           // obj.end();
                           // obj=null;
                        }
                    }
                    let v=e.target.value;
                    if(prevVal>v){
                       // v=-v;
                    }
                    prevVal=v;
                    obj.setValue(v);
                },{passive:true})
                .append(label,sl);
                fr.appendChild(wrap);
            }
             * 
             */
            tmp.replaceChildren(fr);
            root.attachShadow({
                mode: 'open'
            }).append(api.ToolBar.getBaseCss(),formStyle,gridStyle,gridCss,tmp);
            return root;
        }
    },
    random:{
        render(data,self){
            data.control=false;
            data.default=api.activeModel.id+new Date().getUTCMilliseconds()+ Math.random().toString(36).substr(2);
            return self.hidden.render(data,self);
        }
    }
};


})(tb_app,_CLICK_,body,topBody,topBodyCl,topThemify,topWindowDoc);