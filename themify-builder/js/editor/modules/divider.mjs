(api => {
    "use strict";
    api.ModuleDivider = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            return [
                {
                    id: 'mod_title_divider',
                    type: 'title'
                },
                {
                    id: 'style_divider',
                    type: 'layout',
                    mode: 'sprite',
                    label: 'divstyle',
                    options: [
                        {
                            img: 'solid',
                            value: 'solid',
                            label: 'solid'
                        },
                        {
                            img: 'dotted',
                            value: 'dotted',
                            label: 'dotted'
                        },
                        {
                            img: 'dashed',
                            value: 'dashed',
                            label: 'dashed'
                        },
                        {
                            img: 'double',
                            value: 'double',
                            label: 'double'
                        }
                    ],
                    control: {
                        classSelector: ''
                    }
                },
                {
                    id: 'stroke_w_divider',
                    type: 'range',
                    label: 'thickness',
                    class: 'xsmall',
                    default:1,
                    units: {
                        px: {
                            max: 5000
                        }
                    }
                },
                {
                    id: 'color_divider',
                    type: 'color',
                    label: 'c'
                },
                {
                    id: 'top_margin_divider',
                    type: 'range',
                    label: 'topmargin',
                    class: 'xsmall',
                    units: {
                        px: {
                            min: -2500,
                            max: 3500
                        }
                    }
                },
                {
                    id: 'bottom_margin_divider',
                    type: 'range',
                    label: 'btmmargin',
                    class: 'xsmall',
                    units: {
                        px: {
                            min: -2500,
                            max: 3500
                        }
                    }
                },
                {
                    id: 'divider_type',
                    type: 'radio',
                    label: 'divw',
                    options: [
                        {
                            value: 'fullwidth',
                            name: 'fw'
                        },
                        {
                            value: 'custom',
                            name: 'cus'
                        }
                    ],
                    option_js: true
                },
                {
                    id: 'divider_width',
                    type: 'range',
                    label: 'w',
                    class: 'xsmall',
                    wrap_class: 'tb_group_element_custom',
                    default:200,
                    units: {
                        px: {
                            max: 5000
                        }
                    }
                },
                {
                    id: 'divider_align',
                    type: 'icon_radio',
                    label: 'align',
                    aligment2: true,
                    wrap_class: 'tb_group_element_custom'
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_divider'
                }
            ];
        }
        static default() {
            return {
                color_divider: '000',
                divider_width: 150
            };
        }
        static builderSave(settings){
            const def={
                style_divider:'solid',
                divider_type: 'fullwidth',
                divider_align:'left',
                stroke_w_divider:1,
                divider_width:200
            };
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            
            if(settings.divider_type!=='custom'){
                delete settings.divider_width;
                delete settings.divider_align;
            }
            else if(settings.divider_align==='undefined'){
                delete settings.divider_align;
            }
            if(settings.stroke_w_divider && ~~settings.stroke_w_divider===def.stroke_w_divider){
                delete settings.stroke_w_divider;
            }
            if(settings.divider_width && ~~settings.divider_width===def.divider_width){
                delete settings.divider_width;
            }
            super.builderSave(settings);
        }
        preview(data) {
            const module = createElement(),
                    classes = ['module', 'module-divider', 'divider-' + (data.divider_type || 'fullwidth'), (data.style_divider || 'solid'), 'tf_mw'],
                    divider_width=data.divider_width??200,
                    strokeW=data.stroke_w_divider??1,
                    styles = ['border-width:' + strokeW + 'px'];
            if (data.divider_type === 'custom') {
                classes.push('divider-' + (data.divider_align || 'left'));
                styles.push('width:' + divider_width + 'px');
            }
            if(data.color_divider){
                styles.push('border-color:' + api.Helper.toRGBA(data.color_divider));
            }
            if (data.top_margin_divider) {
                styles.push('margin-top:' + data.top_margin_divider + 'px');
            }
            if (data.bottom_margin_divider) {
                styles.push('margin-bottom:' + data.bottom_margin_divider + 'px');
            }
            if (data.css_divider) {
                classes.push(data.css_divider);
            }
            module.className = classes.join(' ');
            if (styles.length > 0) {
                module.style = styles.join(';');
            }
            if (data.mod_title_divider) {
                module.appendChild(this.constructor.getModuleTitle(data.mod_title_divider,'mod_title_divider'));
            }
            return module;
        }
    };
})(tb_app);