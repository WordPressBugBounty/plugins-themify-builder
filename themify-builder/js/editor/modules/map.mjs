(api => {
    "use strict";
    api.ModuleMap = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            const arr ={};
            for(let i=1;i<21;++i){
                arr[i]=i;
            }
            return [
                {
                    id: 'mod_title_map',
                    type: 'title'
                },
                {
                    id: 'map_provider',
                    type: 'radio',
                    label: 'mapprv',
                    options: [
                        {
                            value: 'google',
                            name: 'Google'
                        },
                        {
                            value: 'bing',
                            name: 'Bing'
                        },
                        {
                            value: 'azure',
                            name: 'Azure'
                        }
                    ],
                    option_js: true
                },
                {
                    type : 'message',
                    label : '',
                    comment: 'bingmapdep',
                    wrap_class: 'tb_group_element_bing'
                },
                {
                    id: 'map_display_type',
                    type: 'radio',
                    label: 'type',
                    options: [
                        {
                            value: 'dynamic',
                            name: 'dynamic'
                        },
                        {
                            value: 'static',
                            name: 'stimg'
                        }
                    ],
                    option_js: true,
                    wrap_class: 'tb_group_element_google'
                },
                {
                    id: 'address_map',
                    type: 'address',
                    label: 'address'
                },
                {
                    id: 'google_map_api_key',
                    type: 'check_map_api',
                    map: 'google',
                    label: '',
                    wrap_class: 'tb_field_error_msg tb_group_element_google'
                },
                {
                    id: 'azure_map_key',
                    type: 'check_map_api',
                    map: 'azure',
                    label: '',
                    wrap_class: 'tb_field_error_msg tb_group_element_azure'
                },
                {
                    type : 'text',
                    id : 'gmap_id',
                    label : 'gmapid',
                    help : 'gmapidh',
                    wrap_class : 'tb_group_element_google tb_disable_dc'
                },
                {
                    id: 'bing_map_api_key',
                    type: 'check_map_api',
                    map: 'bing',
                    label: '',
                    wrap_class: 'tb_field_error_msg tb_group_element_bing'
                },
                {
                    id: 'latlong_map',
                    type: 'text',
                    class: 'large',
                    label: 'ltlng',
                    help: 'ltlngh'
                },
                {
                    type: 'group',
                    label: 'mapopt',
                    display: 'accordion',
                    options: [
                        {
                            id: 'bing_type_map',
                            type: 'select',
                            label: 'type',
                            options: {
                                aerial: 'aerial',
                                road: 'road',
                                canvasDark: 'cnvsd',
                                canvasLight: 'cnvsl',
                                grayscale: 'grayscale'
                            },
                            wrap_class: 'tb_group_element_bing'
                        },
                        {
                            id : 'azure_type_map',
                            type : 'select',
                            label : 'type',
                            options : {
                                road : 'road',
                                satellite : 'stlle',
                                satellite_road_labels : 'satellite_road_labels',
                                grayscale_dark : 'grayscaled',
                                grayscale_light : 'grayscalel',
                                night : 'night',
                                road_shaded_relief : 'azroad',
                                high_contrast_dark : 'azcntrd'
                            },
                            wrap_class: 'tb_group_element_azure'
                        },
                        {
                            id: 'zoom_map',
                            type: 'select',
                            label: 'zoom',
                            default:'8',
                            options:arr
                        },
                        {
                            id: 'w_map',
                            type: 'range',
                            class: 'xsmall',
                            default:100,
                            label: 'w',
                            wrap_class: 'tb_group_element_dynamic',
                            units: {
                                px: {
                                    max: 3500
                                },
                                '%': '',
                                vw: {
                                    max: 3500
                                }
                            }
                        },
                        {
                            id: 'w_map_static',
                            type: 'number',
                            label: 'w',
                            after: 'px',
                            default:500,
                            wrap_class: 'tb_group_element_static'
                        },
                        {
                            id: 'h_map',
                            type: 'range',
                            label: 'ht',
                            class: 'xsmall',
                            default:300,
                            units: {
                                px: {
                                    max: 3500
                                },
                                '%': {
                                    max: 100
                                },
                                vh: ''
                            }
                        },
                        {
                            type: 'multi',
                            label: 'b',
                            options: [
                                {
                                    id: 'b_style_map',
                                    type: 'select',
                                    border: true
                                },
                                {
                                    id: 'b_color_map',
                                    type: 'color',
                                    class: 'large'
                                },
                                {
                                    id: 'b_width_map',
                                    type: 'range',
                                    class: 'small',
                                    after: 'px'
                                }
                            ]
                        },
                        {
                            id: 'type_map',
                            type: 'select',
                            label: 'type',
                            options: {
                                ROADMAP: 'roadm',
                                SATELLITE: 'stlle',
                                HYBRID: 'hybrid',
                                TERRAIN: 'terrain'
                            },
                            wrap_class: 'tb_group_element_google'
                        },
                        {
                            id: 'map_control',
                            type: 'toggle_switch',
                            label: 'mcotrols',
                            options: 'simple',
                            default:'off',
                            wrap_class: 'tb_group_element_dynamic'
                        },
                        {
                            id: 'draggable_map',
                            type: 'toggle_switch',
                            label: 'dragle',
                            default:'on',
                            options: {
                                on: {
                                    name: 'enable',
                                    value: 'en'
                                },
                                off: {
                                    name: 'disable',
                                    value: 'dis'
                                }
                            },
                            wrap_class: 'tb_group_element_dynamic',
                            binding: {
                                checked: {
                                    show: 'scrollwheel_map'
                                },
                                not_checked: {
                                    hide: 'scrollwheel_map'
                                }
                            }
                        },
                        {
                            id: 'scrollwheel_map',
                            type: 'toggle_switch',
                            label: 'scrlwhl',
                            default:'off',
                            options: {
                                on: {
                                    name: 'enable',
                                    value: 'en'
                                },
                                off: {
                                    name: 'disable',
                                    value: 'dis'
                                }
                            },
                            wrap_class: 'tb_group_element_dynamic'
                        },
                        {
                            id: 'draggable_disable_mobile_map',
                            type: 'toggle_switch',
                            label: 'mdragle',
                            default:'off',
                            options: {
                                on: {
                                    name: 'no',
                                    value: 'en'
                                },
                                off: {
                                    name: 'yes',
                                    value: 'dis'
                                }
                            },
                            wrap_class: 'tb_group_element_dynamic'
                        },
                        {
                            id: 'info_window_map',
                            type: 'textarea',
                            label: 'infowin',
                            help: 'infowinh',
                            wrap_class: 'tb_group_element_dynamic'
                        }
                    ]
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_map'
                }
            ];
        }
        static default(){
            return {
                address_map: 'Toronto',
                map_control: 'yes',
                w_map_unit: '%'
            };
        }
        static builderSave(settings){
            const def={
                //w_map_unit:'%',
                h_map_unit:'px',
                b_style_map:'solid',
                type_map:'ROADMAP',
                bing_type_map:'aerial',
                scrollwheel_map: 'disable',
                draggable_map: 'enable',
                map_control: 'no',
                draggable_disable_mobile_map: 'yes',
                map_provider: 'google',
                map_display_type: 'dynamic',
                azure_type_map: 'road'
            },
            numericDef={
                w_map:100,
                w_map_static:500,
                zoom_map:8,
                h_map:300
            };
            for( let key in def){
                if(settings[key]===def[key]){
                    delete settings[key];
                }
            }
            if(settings.draggable_map==='disable' && settings.draggable_disable_mobile_map!=='no'){
                delete settings.scrollwheel_map;
            }
            for( let key in numericDef){
                if(~~settings[key]===numericDef[key]){
                    delete settings[key];
                }
            }
            
            if(settings.b_style_map==='none' || settings.b_width_map<=0){
                delete settings.b_width_map;
                delete settings.b_color_map;
            }
            
            if ( settings.map_provider !== 'bing' ) {
                delete settings.bing_type_map;
            }
            if ( settings.map_provider !== 'azure' ) {
                delete settings.azure_type_map;
            }
            if ( settings.map_provider ) { // ! google
                delete settings.map_display_type;
                delete settings.type_map;
            }
            
            if(settings.address_map?.trim().replace(/\s\s+/g, ' ')){
                delete settings.latlong_map;
            }
            if(settings.map_display_type!=='w_map_static'){
                delete settings.w_map_static;
            }
            else{
                const del=[
                    'map_control',
                    'draggable_map',
                    'scrollwheel_map',
                    'draggable_disable_mobile_map',
                    'info_window_map'
                ];
                for(let i=del.length-1;i>-1;--i){
                    if(settings[del[i]]!==undefined){
                        delete settings[del[i]];
                    }
                }
            }
            super.builderSave(settings);
        }
        preview(data) {
            let module = createElement(),
                classes = ['module', 'module-map'],
                address = data.address_map?.trim().replace(/\s\s+/g, ' ')||'',
                {h_map='300',w_map='100',latlong_map:latlong,map_provider:provider='google',type_map:roadMap='ROADMAP',zoom_map=8}=data,
                map;
            if (data.css_map) {
                classes.push(data.css_map);
            }
         
            module.className = classes.join(' ');
            if (data.mod_title_map) {
                module.appendChild(this.constructor.getModuleTitle(data.mod_title_map,'mod_title_map'));
            }
            if( provider === 'google' && data.map_display_type==='static' ) {
                let q = 'key='+themify_vars.map_key,
                    wMapStatic=data.w_map_static || 500;
                    map=createElement('img');
                if(address || latlong){
                    q+='&center='+(address || latlong);
                }
                q+='&zoom='+zoom_map+'&maptype='+roadMap.toLowerCase()+'&size=';
                q+=wMapStatic.toString().replace(/[^0-9]/,'');
                q+='x'+h_map.toString().replace(/[^0-9]/,'');
                map.src='https://maps.googleapis.com/maps/api/staticmap?'+q;
            }
            else if( address || latlong ) {
                map = createElement('','themify_map');
                const dataset=map.dataset;
                if ( provider === 'google' ) {
                    map.dataset.mapid = data.gmap_id || '';
                } else {
                    map.className += ' themify_' + provider + '_map';
                }
                map.style.width=w_map+(data.w_map_unit || '%');
                map.style.height=h_map+(data.h_map_unit || 'px');
                dataset.mapProvider=provider;
                dataset.address=address || latlong;
                dataset.reverseGeocoding=!address && latlong;
                dataset.control=data.map_control !== 'no' ? 0 : 1;
                dataset.zoom=zoom_map;
                dataset.type = provider === 'google' ? roadMap : ( provider === 'bing' ? data.bing_type_map || 'aerial' : data.azure_type_map || 'road' );
                dataset.scroll=data.scrollwheel_map === 'enable'?1:0;
                dataset.drag=0;//disable draggable for UI
                dataset.mdrag=0;
                dataset.infoWindow=data.info_window_map || ('<b>'+i18n.address+'</b><br/><p>'+address+'</p>');
            }
            if(map){
                if(data.b_width_map){
                    const b_type=data.b_style_map || 'solid';
                    if(b_type!=='none'){
                        map.style.border=b_type+' '+data.b_width_map+'px';
                        if (data.b_color_map) {
                            map.style.borderColor=api.Helper.toRGBA(data.b_color_map);
                        }
                    }else{
                        map.style.border=b_type;
                    }
                }
                module.appendChild(map);
            }
            return module;
        }
    };
})(tb_app);