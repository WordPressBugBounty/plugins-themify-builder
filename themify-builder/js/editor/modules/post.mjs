(api => {
    "use strict";
    api.ModulePost = class extends api.Module {
        constructor(fields) {
            super(fields);
        }
        static getOptions() {
            const layout=[...ThemifyConstructor.getOptions('post_grid')];
            layout.push({
                            img: 'list_thumb_image',
                            value: 'list-thumb-image',
                            label: 'lthumbimg'
                        },
                        {
                            img: 'grid2_thumb',
                            value: 'grid2-thumb',
                            label: 'grid2th'
                        });
            return [
                {
                    id: 'mod_title_post',
                    type: 'title'
                },
                ...(themifyBuilder.tbp_dynamic_query || []),
                {
                    type: 'query_posts',
                    id: 'post_type_post',
                    tax_id: 'type_query_post',
                    term_id: '#tmp_id#_post',
                    slug_id: 'query_slug_post',
                    sticky_id: 'sticky_post',
                    query_filter: true
                },
                {
                    id: 'layout_post',
                    type: 'layout',
                    label: 'playout',
                    mode: 'sprite',
                    default:'grid4',
                    control:{
                        classSelector: '.builder-posts-wrap'
                    },
                    options: layout
                },
                {
                    type:'post_filter'
                },
                {
                    id: 'post_per_page_post',
                    type: 'number',
                    label: 'npost',
                    help: 'nposth'
                },
                {
                    id: 'offset_post',
                    type: 'number',
                    label: 'ofs',
                    help: 'ofsh'
                },
                {
                    id: 'order_post',
                    type: 'select',
                    label: 'order',
                    help: 'ohelp',
                    order: true
                },
                {
                    id: 'orderby_post',
                    type: 'orderby_post',
                    binding:{
                        select:{hide: 'meta_order'},
                        meta_value:{show: 'meta_order'}
                    }
                },
                {
                    id: 'meta_order',
                    type: 'multi',
                    label: '',
                    options: [
                        {
                            id: 'meta_key_post',
                            type: 'text',
                            label: 'cfieldk',
                            wrap_class: 'tb_disable_dc'
                        },
                        {
                            id: 'meta_key_type',
                            type: 'select',
                            label: 'type',
                            meta_order : true
                        }]
                },
                {
                    id: 'display_post',
                    type: 'select',
                    label: 'disp',
                    options:{
                        content: 'content',
                        excerpt: 'excerpt',
                        none: 'none'
                    },
                    binding:{
                        excerpt:{show: 'excerpt_length_post'},
                        none:{hide: 'excerpt_length_post'},
                        content:{hide: 'excerpt_length_post'}
                    }
                },
                {
                    id: 'excerpt_length_post',
                    type: 'number',
                    label: 'exclen',
                    help: 'exch'
                },
                {
                    id: 'hide_feat_img_post',
                    type: 'toggle_switch',
                    label: 'fimg',
                    binding:{
                        checked:{show: ['image_size_post', 'img_width_post', 'auto_fullwidth_post', 'img_height_post', 'unlink_feat_img_post']},
                        not_checked:{hide: ['image_size_post', 'img_width_post', 'auto_fullwidth_post', 'img_height_post', 'unlink_feat_img_post']}
                    }
                },
                {
                    id: 'image_size_post',
                    type: 'image_size'
                },
                {
                    id: 'img_width_post',
                    type: 'number',
                    label: 'imgw'
                },
                {
                    id: 'auto_fullwidth_post',
                    type: 'checkbox',
                    label: '',
                    options: [{
                        name: '1',
                        value: 'afullwimg'
                    }],
                    wrap_class: 'auto_fullwidth'
                },
                {
                    id: 'lbpost',
                    type: 'toggle_switch',
                    label: 'opplb',
                    options: 'simple',
                    default: 'off',
                    help : 'opplbh'
                },
                {
                    id: 'img_height_post',
                    type: 'number',
                    label: 'imgh'
                },
                {
                    id: 'unlink_feat_img_post',
                    type: 'toggle_switch',
                    label: 'unlfimg',
                    options: 'simple',
                    default: 'off'
                },
                {
                    id: 'hide_post_title_post',
                    type: 'toggle_switch',
                    label: 'ptitle',
                    binding:{
                        checked:{show: ['unlink_post_title_post', 'title_tag_post']},
                        not_checked:{hide: ['unlink_post_title_post', 'title_tag_post']}
                    }
                },
                {
                    id: 'title_tag_post',
                    type: 'select',
                    label: 'tht',
                    h_tags: true,
                    default: 'h2'
                },
                {
                    id: 'unlink_post_title_post',
                    type: 'toggle_switch',
                    label: 'uptitle',
                    options: 'simple',
                    default: 'off'
                },
                {
                    id: 'hide_post_date_post',
                    type: 'toggle_switch',
                    label: 'pdate'
                },
                {
                    id: 'hide_post_meta_post',
                    type: 'toggle_switch',
                    label: 'pmeta',
                    binding:{
                        checked:{show: ['hide_author_post', 'hide_category_post', 'hide_comment_post']},
                        not_checked:{hide: ['hide_author_post', 'hide_category_post', 'hide_comment_post']}
                    }
                },
                {
                    id: 'hide_author_post',
                    type: 'checkbox',
                    label: '',
                    options: [{
                        name: 'yes',
                        value: 'hauth'
                    }]
                },
                {
                    id: 'hide_category_post',
                    type: 'checkbox',
                    label: '',
                    options: [{
                        name: 'yes',
                        value: 'hcat'
                    }]
                },
                {
                    id: 'hide_comment_post',
                    type: 'checkbox',
                    label: '',
                    options: [{
                            name: 'yes',
                            value: 'hcom'
                        }
                    ]
                },
                {
                    id: 'hide_page_nav_post',
                    type: 'toggle_switch',
                    label: 'pagin',
                    default: 'off',
                    binding:{
                        checked:{show: 'nav_type'},
                        not_checked:{hide: 'nav_type'}
                    }
                },
                {
                    id: 'nav_type',
                    type: 'select',
                    label: 'pagint',
                    options:{
                        standard: 'standard',
                        ajax: 'lmore'
                    }
                },
                {
                    id: 'hide_empty',
                    type: 'toggle_switch',
                    label: 'hempmod',
                    help: 'hempmodh',
                    options: 'simple',
                    default: 'off',
                    binding:{
                        checked:{ hide: 'no_posts_group'},
                        not_checked:{show: 'no_posts_group' }
                    }
                },
                {
                    id: 'no_posts_group',
                    options: [
                        {
                            id: 'no_posts',
                            type: 'toggle_switch',
                            label: 'nopost',
                            options:{
                                off:{
                                    name: '',
                                    value: 'dis'
                                },
                                on:{
                                    name: '1',
                                    value: 'en'
                                }
                            },
                            binding:{
                                checked:{show: 'no_posts_msg'},
                                not_checked:{hide: 'no_posts_msg'}
                            }
                        },
                        {
                            id: 'no_posts_msg',
                            type: 'textarea',
                            label: ''
                        }],
                    type: 'group'
                },
                {
                    type: 'hook_content',
                    options:{
                        themify_post_start_module: 'post_start',
                        themify_before_post_image_module: 'before_post_image',
                        themify_after_post_image_module: 'after_post_image',
                        themify_before_post_title_module: 'before_post_title',
                        themify_after_post_title_module: 'after_post_title',
                        themify_before_post_content_module: 'before_post_content',
                        themify_after_post_content_module: 'after_post_content',
                        themify_post_end_module: 'post_end'
                    }
                },
                {
                    type: 'custom_css_id',
                    custom_css: 'css_post'
                }
            ];
        }
        static default(){
            return {
                post_per_page_post : 4,
                display_post : 'excerpt'
            };
        }
        static builderSave(settings,slug='post') {
            let def = {
                tbpdq:'off',
                term_type: 'category',
                nav_type: 'standard',
                hide_empty: 'no',
                post_filter:'no',
                ajax_sort:'no',
                filter_hashtag:'no',
                ajax_filter:'no',
                masonry_align:'no',
                lbpost:'no',
                ajax_filter_categories:'exclude',
                ['layout_'+slug]:'grid4',
                ['post_type_'+slug]:slug,
                ['type_query_'+slug]:'category',
                ['sticky_'+slug]:'no',
                ['order_'+slug]:'desc',
                ['orderby_'+slug]:'date',
                ['display_'+slug]:'content',
                ['hide_feat_img_'+slug]:'no',
                ['image_size_'+slug]:'large',
                ['unlink_feat_img_'+slug]:'no',
                ['hide_post_title_'+slug]:'no',
                ['title_tag_'+slug]:'h2',
                ['unlink_post_title_'+slug]:'no',
                ['hide_post_date_'+slug]:'no',
                ['hide_post_meta_'+slug]:'no',
                ['hide_page_nav_'+slug]:'yes',
                ['auto_fullwidth_'+slug]:false,
                ['hide_author_'+slug]:false,
                ['hide_category_'+slug]:false,
                ['hide_comment_'+slug]:false,
                'disable_masonry' : 'default' /* Ultra option */
            },
            termType=settings.term_type || def.term_type,
            tbpdq=settings.tbpdq || def.tbpdq,
            queryType=settings['type_query_'+slug] || def['type_query_'+slug],
            hooks=settings.hook_content;
            
            for (let key in def) {
                if (settings[key] === def[key]) {
                    delete settings[key];
                }
            }
            if(settings.tbpdq){
                delete settings['post_type_'+slug];
                delete settings['type_query_'+slug];
                delete settings.term_type;
                termType=null;
            }
            if(termType!=='all'){
                delete settings['sticky_'+slug];
            }
            if(termType!=='category'){
                delete settings['category_'+slug];
                delete settings['post_tag_'+slug];
                delete settings[queryType+'_'+slug]; 
            }
            
            if(termType!=='post_slug'){
                delete settings['query_slug_'+slug];
            }
            
            if(settings['display_'+slug]!=='excerpt'){
                delete settings['excerpt_length_'+slug];
            }
            if(settings['layout_'+slug]==='list-post' || settings['layout_'+slug]==='auto_tiles'){
                delete settings.disable_masonry;
                if(settings['layout_'+slug]==='auto_tiles'){
                    delete settings.ajax_filter;
                }
            }
            if ( settings.disable_masonry === 'no' && ! settings.ajax_filter ) {
                delete settings.masonry_align;
            }
            if(!settings.post_filter){
                delete settings.filter_hashtag;
                delete settings.ajax_filter;
            }
            if(!settings.ajax_filter){
                delete settings.ajax_filter_categories;
                delete settings.ajax_filter_exclude;
                delete settings.ajax_sort;
            }
            else if(settings.ajax_filter_categories){
                delete settings.ajax_filter_exclude;
            }
            if(settings.ajax_filter_categories!=='include'){
                delete settings.ajax_filter_include;
            }
            
            if(settings['hide_feat_img_'+slug]==='yes'){
                delete settings['img_width_'+slug];
                delete settings['img_height_'+slug];
                delete settings['auto_fullwidth_'+slug];
                delete settings['unlink_feat_img_'+slug];
            }
            else if(settings['auto_fullwidth_'+slug]==='|' || settings['auto_fullwidth_'+slug]==='false'){
                delete settings['auto_fullwidth_'+slug];
            }
            
            if(settings['hide_post_title_'+slug]==='yes'){
                delete settings['title_tag_'+slug];
                delete settings['unlink_post_title_'+slug];
            }
            
            if(settings['hide_post_meta_'+slug]==='yes'){
                delete settings['hide_author_'+slug];
                delete settings['hide_category_'+slug];
                delete settings['hide_comment_'+slug];
            }
            else {
                if(settings['hide_author_'+slug]==='|' || settings['hide_author_'+slug]==='false'){
                    delete settings['hide_author_'+slug];
                }
                if(settings['hide_category_'+slug]==='|' || settings['hide_category_'+slug]==='false'){
                    delete settings['hide_category_'+slug];
                }
                if(settings['hide_comment_'+slug]==='|' || settings['hide_comment_'+slug]==='false'){
                    delete settings['hide_comment_'+slug];
                }
            }
            if(!settings['hide_page_nav_'+slug]){
                delete settings.nav_type;
            }
            if(settings.hide_empty==='yes'){
                delete settings.no_posts;
            }
            if(!settings.no_posts){
                delete settings.no_posts_msg;
            }
            if(!settings.query_cf_key || !settings.query_cf_value){
                delete settings.query_cf_c;
            }
            if(tbpdq!=='sameauthor'){
                delete settings.tbpdq_sameauthor_match_post_type;
            }
            if(settings.tbpdq_sameauthor_match_post_type!=='no'){
                delete settings.tbpdq_sameauthor_post_types;
            }
            if(tbpdq!=='acf'){
                delete settings.tbpdq_acf_field;
            }
            if(tbpdq!=='ptbSearch'){
                delete settings.tbpdq_ptbsearch_form;
            }
            if(hooks){
                for(let i=hooks.length-1;i>-1;--i){
                    if(!hooks[i].c?.trim()){
                        hooks.splice(i,1);
                    }
                }
                if(hooks.length===0){
                    delete settings.hook_content;
                }
            }
            for (let key in settings) {
                if (settings[key] === '0|single') {
                    delete settings[key];
                }
            }
            super.builderSave(settings);
        }
    };
})(tb_app);