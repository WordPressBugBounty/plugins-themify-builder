<?php

/**
 * Gutenberg compatibility for Themify Builder
 *
 * @package Themify
 * @since 3.5.4
 */
if (!class_exists('Themify_Builder_Gutenberg',false)) :

    final class Themify_Builder_Gutenberg {

        private const BLOCK_PATTERNS = '<!-- wp:themify-builder/canvas /-->';

        public static function init():void {
            add_action('wp_loaded', array(__CLASS__, 'load'));
            add_theme_support('align-wide');
        }

        public static function load():void {
            /* add template for all post types that support the editor */
            $post_types = Themify_Builder::builder_post_types_support();
            foreach ($post_types as $type) {
                add_filter('rest_prepare_' . $type, array(__CLASS__, 'enable_block_existing_content'), 10, 3);
                if (Themify_Builder_Model::is_builder_disabled_for_post_type($type)) {
                    continue;
                }
                $post_type_object = get_post_type_object($type);
                if ($post_type_object) {
                    $post_type_object->template = array(
                        array('themify-builder/canvas')
                    );
                }
            }

            add_action('rest_api_init', array(__CLASS__, 'register_builder_content_field'));
            add_filter('content_edit_pre', array(__CLASS__, 'filter_editor_content'), 10, 2);
            if (is_admin()) {
                add_action('current_screen', array(__CLASS__, 'admin_init'));
            } else {
                self::register_block();
            }
        }

        public static function admin_init():void {
            if (Themify_Builder_Model::is_gutenberg_editor() && function_exists('register_block_type')) {
                add_filter('admin_body_class', array(__CLASS__, 'admin_body_class'));
                $screen = get_current_screen();
                if (!empty($screen->post_type) && Themify_Builder_Model::is_builder_disabled_for_post_type($screen->post_type)) {
                    return;
                }
                self::register_block();
                add_action('enqueue_block_editor_assets', array(__CLASS__, 'enqueue_editor_scripts'));
            }
        }

        /**
         * WordPress 7.0 only iframes the post editor when all inserted blocks use
         * Block API v3+. Keep the Builder block on v2 before WP 7.1 so existing
         * sites retain the legacy non-iframed editor. WordPress 7.1+ always
         * iframes the post editor, so use v3 there.
         */
        private static function get_block_api_version():int {
            global $wp_version;
            $version = preg_replace('/-.*/', '', (string) $wp_version);
            return version_compare($version, '7.1', '>=') ? 3 : 2;
        }

        private static function register_block():void {
            wp_register_style(
                'themify-builder-style',
                THEMIFY_BUILDER_URI . '/css/themify-builder-style.css',
                null,
                THEMIFY_VERSION
            );
            $editor_style_handles = array();
            if (is_admin()) {
                wp_register_style(
                    'tf_base',
                    THEMIFY_URI . '/css/base.min.css',
                    null,
                    THEMIFY_VERSION
                );
                wp_register_style(
                    'themify-builder-admin-ui',
                    THEMIFY_BUILDER_URI . '/css/editor/themify-builder-admin-ui.css',
                    array('tf_base'),
                    THEMIFY_VERSION
                );
                wp_register_style(
                    'themify-backend-mode',
                    THEMIFY_BUILDER_URI . '/css/editor/backend-mode.css',
                    array('themify-builder-style', 'themify-builder-admin-ui'),
                    THEMIFY_VERSION
                );
                wp_register_style(
                    'themify-backend-ui',
                    THEMIFY_BUILDER_URI . '/css/editor/backend/backend-ui.css',
                    array('themify-backend-mode'),
                    THEMIFY_VERSION
                );
                wp_register_style(
                    'themify-builder-lightbox',
                    THEMIFY_BUILDER_URI . '/css/editor/components/lightbox.css',
                    array('themify-builder-admin-ui'),
                    THEMIFY_VERSION
                );
                wp_register_style(
                    'themify-builder-content-lightbox',
                    THEMIFY_BUILDER_URI . '/css/editor/components/builder-content-lightbox.css',
                    array('themify-backend-ui', 'themify-builder-lightbox'),
                    THEMIFY_VERSION
                );
                $editor_style_handles = apply_filters('themify_builder_gutenberg_editor_style_handles', array(
                    'tf_base',
                    'themify-builder-admin-ui',
                    'themify-backend-mode',
                    'themify-backend-ui',
                    'themify-builder-lightbox',
                    'themify-builder-content-lightbox',
                    'editor',
                    'buttons',
                    'dashicons'
                ));
            }

            register_block_type('themify-builder/canvas', array(
                'api_version' => self::get_block_api_version(),
                'title' => 'Themify Builder',
                'category' => 'layout',
                'supports' => array(
                    'multiple' => false,
                    'reusable' => false,
                    'inserter' => false,
                    'html' => false,
                    'lock' => false
                ),
                'attributes' => array(
                    'content' => array(
                        'type' => 'string'
                    ),
                    'lock' => array(
                        'type' => 'object',
                        'default' => array(
                            'move' => true
                        )
                    )
                ),
                'render_callback' => array(__CLASS__, 'render_builder_block'),
                'style_handles' => array('themify-builder-style'),
                'editor_style_handles' => $editor_style_handles
            ));
        }

        public static function enqueue_editor_scripts():void {
            add_filter('themify_defer_js_exclude', array(__CLASS__, 'exclude_defer_script'));
            Themify_Enqueue_Assets::loadMainScript();
            themify_enque_script('themify-builder-gutenberg-block', THEMIFY_BUILDER_URI . '/js/editor/backend/themify-builder-gutenberg.js', THEMIFY_VERSION, array('wp-blocks', 'wp-block-editor', 'wp-hooks', 'wp-i18n', 'wp-element', 'backbone', 'themify-main-script'));
            wp_add_inline_script('themify-builder-gutenberg-block', 'window.themifyBuilderBlockApiVersion=' . self::get_block_api_version() . ';', 'before');
        }

        public static function render_builder_block($attributes):string {
            return self::BLOCK_PATTERNS; // just return custom block tag, let builder the_content filter to render builder output
        }

        public static function exclude_defer_script(array $handles):array {
            return array_merge($handles, array('themify-builder-gutenberg-block'));
        }

        /**
         * Strip the Builder canvas from Classic editor content when Builder is disabled.
         */
        public static function filter_editor_content($content, $post_id) {
            if (!is_string($content) || empty($post_id)) {
                return $content;
            }
            $post_type = get_post_type($post_id);
            if ($post_type && Themify_Builder_Model::is_builder_disabled_for_post_type($post_type)) {
                return self::strip_builder_block($content);
            }
            return $content;
        }

        /**
         * Enable builder block on existing content data.
         * 
         * @param object $data 
         * @param object $post 
         * @param object $context 
         * @return object
         */
        public static function enable_block_existing_content($data, $post, $context) {
            if ('edit' === $context['context'] && isset($data->data['content']['raw'])) {
                $content = &$data->data['content']['raw'];

                if (Themify_Builder_Model::is_builder_disabled_for_post_type($post->post_type)) {
                    $content = self::strip_builder_block($content);
                    return $data;
                }

                $builder_placeholder = '<!-- wp:themify-builder/canvas --><!-- /wp:themify-builder/canvas -->';
                if ( Themify_Builder_Model::is_gutenberg_active() && self::has_builder_block( $content ) ) {
                    $content = ThemifyBuilder_Data_Manager::update_static_content_string( '', $content ); // remove static content tag
                    /* convert old Gutenberg placeholder */
                    if ( str_contains( $content, self::BLOCK_PATTERNS ) ) {
                        $content = str_replace( self::BLOCK_PATTERNS, $builder_placeholder, $content );
                    }
                } elseif ( ThemifyBuilder_Data_Manager::has_static_content( $content ) ) {
                    $content = ThemifyBuilder_Data_Manager::update_static_content_string( $builder_placeholder, $content );
                } else {
                    $content .= "\n\n" . $builder_placeholder;
                }

                $builder_data = ThemifyBuilder_Data_Manager::get_data( $post->ID );
                if ( ! empty( $builder_data ) ) {
                    $plain_text = ThemifyBuilder_Data_Manager::_get_all_builder_text_content( $builder_data );
                    $plain_text = ThemifyBuilder_Data_Manager::add_static_content_wrapper( $plain_text );
                    $content = preg_replace_callback( '/(<!-- wp:themify-builder\/canvas -->)[\s\S]*?(<!-- \/wp:themify-builder\/canvas -->)/', function( $matches ) use( $plain_text ) {
                        return $matches[1] . $plain_text . $matches[2];
                    }, $content );
                }
            }

            return $data;
        }

        /**
         * Added body class
         */
        public static function admin_body_class(?string $classes):string {
            $classes .= ' themify-gutenberg-editor';
            $screen=get_current_screen();
            if (!empty($screen) && Themify_Builder_Model::is_builder_disabled_for_post_type( $screen->post_type ) ) {
                $classes .= ' tb_editor_disabled';
            }
            return $classes;
        }

        /**
         * Register builder content meta
         * 
         * @access public
         * @return type
         */
        public static function register_builder_content_field():void {
            $post_types = Themify_Builder::builder_post_types_support();
            foreach ($post_types as $type) {
                register_rest_field($type, 'builder_content', array(
                    'get_callback' => array(__CLASS__, 'get_post_meta_builder'),
                    'schema' => null
                    )
                );
            }
        }

        /**
         * Update builder block tag in the string.
         */
        public static function replace_builder_block_tag(string $replace_string, string $content): string {
            if (self::has_builder_block($content)) {
                $content = str_replace(self::BLOCK_PATTERNS, $replace_string, $content);
                $content = ThemifyBuilder_Data_Manager::remove_empty_p($content);
            }
            return $content;
        }

        /**
         * Check if content has builder block
         */
        public static function has_builder_block(string $content):string {
            return has_block( 'themify-builder/canvas', $content );
        }

        /**
         * Remove the Builder canvas block so it is not shown when Builder is disabled.
         */
        private static function strip_builder_block(string $content): string {
            $content = str_replace(self::BLOCK_PATTERNS, '', $content);
            if ($content === '' || !self::has_builder_block($content)) {
                return $content;
            }
            $filtered = array();
            foreach (parse_blocks($content) as $block) {
                if (($block['blockName'] ?? '') !== 'themify-builder/canvas') {
                    $filtered[] = $block;
                }
            }
            return serialize_blocks($filtered);
        }

        /**
         * Get builder content value.
         * 
         * @access public
         * @param type $object 
         */
        public static function get_post_meta_builder($object):string {
            return ThemifyBuilder_Data_Manager::_get_all_builder_text_content(ThemifyBuilder_Data_Manager::get_data($object['id']));
        }
    }

    Themify_Builder_Gutenberg::init();
endif;
