<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

final class TF_SV_Framework {

    const OPTION_KEY = 'tf_sv_vars';

    public static function init() {
        add_filter( 'themify_builder_active_vars', [ __CLASS__, 'builder_active_vars' ] );
        add_action( 'wp_ajax_tf_sv_save_vars', [ __CLASS__, 'ajax_save_vars' ] );
        add_action( 'wp_ajax_tf_sv_refresh_vars', [ __CLASS__, 'ajax_refresh_vars' ] );
        add_action( 'wp_ajax_tf_sv_theme_native_colors', [ __CLASS__, 'ajax_theme_native_colors' ] );
        add_action( 'wp_ajax_tf_sv_import_missing_vars', [ __CLASS__, 'ajax_import_missing_vars' ] );
        add_action( 'wp_ajax_tf_sv_collect_used', [ __CLASS__, 'ajax_collect_used' ] );
        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_frontend_assets' ] );
        add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_admin_assets' ], 30 );
        add_action( 'customize_controls_enqueue_scripts', [ __CLASS__, 'enqueue_customizer_controls' ], 30 );
        add_action( 'customize_preview_init', [ __CLASS__, 'enqueue_customizer_preview' ], 30 );
        add_action( 'admin_head', [ __CLASS__, 'print_root_vars' ], 1 );
        if ( ! function_exists( 'themify_is_themify_theme' ) || ! themify_is_themify_theme() ) {
            add_action( 'wp_head', [ __CLASS__, 'print_root_vars' ], 999 );
        }
    }

    public static function get_frontend_head_fragment(): string {
        return self::get_root_vars_style_markup() . self::get_google_fonts_links_markup();
    }

    private static function get_root_vars_style_markup(): string {
        $css = self::build_root_css();
        return '' !== $css ? '<style id="tf-sv-root-vars">' . $css . '</style>' . PHP_EOL : '';
    }

    private static function tf_sv_is_google_catalog_family( string $font_name ): bool {
        static $lookup = null;
        if ( null === $lookup ) {
            $lookup = [];
            if ( function_exists( 'themify_get_google_font_lists' ) ) {
                foreach ( array_keys( themify_get_google_font_lists() ) as $name ) {
                    $lookup[ strtolower( (string) $name ) ] = true;
                }
            }
        }
        return isset( $lookup[ strtolower( $font_name ) ] );
    }

    /** Google Fonts URL: catalog families only; skip cf/websafe/non-Google JSON. */
    private static function google_font_family_for_enqueue( string $raw, array $safe_fonts ): string {
        $raw = trim( wp_unslash( $raw ) );
        if ( '' === $raw ) {
            return '';
        }
        $trust_google = false;
        if ( 0 === strpos( $raw, '{' ) ) {
            $obj = json_decode( $raw, true );
            if ( ! is_array( $obj ) || empty( $obj['name'] ) ) {
                return '';
            }
            $ft = isset( $obj['fonttype'] ) ? strtolower( (string) $obj['fonttype'] ) : '';
            if ( in_array( $ft, [ 'cf', 'websafe' ], true ) ) {
                return '';
            }
            if ( '' !== $ft && ! in_array( $ft, [ 'google', 'var' ], true ) ) {
                return '';
            }
            if ( 'google' === $ft ) {
                $trust_google = true;
            }
            $font_name = self::sanitize_value( (string) $obj['name'], 'font' );
        } else {
            $font_name = self::sanitize_value( $raw, 'font' );
        }
        if ( '' === $font_name || 0 === strpos( $font_name, '--' ) || 0 === strpos( $font_name, 'var(' ) ) {
            return '';
        }
        if ( false !== strpos( $font_name, ',' ) ) {
            $font_name = trim( preg_replace( '/^["\']+|["\']+$/', '', explode( ',', $font_name, 2 )[0] ) );
        }
        if ( '' === $font_name || 0 === strpos( $font_name, 'var(' ) ) {
            return '';
        }
        if ( in_array( strtolower( $font_name ), $safe_fonts, true ) ) {
            return '';
        }
        if ( ! $trust_google && ! self::tf_sv_is_google_catalog_family( $font_name ) ) {
            return '';
        }
        return $font_name;
    }

    private static function get_google_fonts_links_markup(): string {
        $items = self::get_merged_vars();
        if ( empty( $items ) ) {
            return '';
        }
        $safe_fonts = [
            'arial', 'helvetica', 'verdana', 'georgia', 'times new roman',
            'courier new', 'tahoma', 'trebuchet ms', 'palatino', 'lucida sans unicode',
            'impact', 'comic sans ms', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy',
        ];
        $google_families = [];
        foreach ( $items as $item ) {
            if ( empty( $item['type'] ) || 'font' !== $item['type'] || empty( $item['values'] ) || ! is_array( $item['values'] ) ) {
                continue;
            }
            foreach ( $item['values'] as $raw_font ) {
                $font_name = self::google_font_family_for_enqueue( (string) $raw_font, $safe_fonts );
                if ( '' !== $font_name ) {
                    $google_families[] = $font_name;
                }
            }
        }
        $google_families = array_values( array_unique( $google_families ) );
        if ( empty( $google_families ) ) {
            return '';
        }
        $families = implode( '&family=', array_map( 'urlencode', $google_families ) );

        return '<link rel="stylesheet" id="tf-sv-google-fonts" href="https://fonts.googleapis.com/css2?family=' . $families . '&display=swap">' . PHP_EOL;
    }

    public static function builder_active_vars( array $vars ):array {
        $vars['tf_sv'] = self::get_js_data();
        return $vars;
    }

    public static function enqueue_frontend_assets() {
        if ( ! class_exists( 'Themify_Builder_Model', false )
            || ! Themify_Builder_Model::is_front_builder_activate() ) {
            return;
        }
        self::enqueue_shared_assets( 'builder_frontend' );
    }

    public static function enqueue_admin_assets( $hook='' ) {
        if ( is_customize_preview() || 'customize.php' === $hook || 'post.php' === $hook || 'post-new.php' === $hook || ! empty( $_GET['themify_builder'] ) ) {
            self::enqueue_shared_assets( 'admin' );
        }
    }

    public static function enqueue_customizer_controls() {
        self::enqueue_shared_assets( 'customizer_controls' );
    }

    public static function enqueue_customizer_preview() {
        self::enqueue_shared_assets( 'customizer_preview' );
    }

    private static function enqueue_shared_assets( string $context ) {
        static $done = [];
        if ( isset( $done[ $context ] ) ) {
            return;
        }
        $done[ $context ] = true;

        $style = 'tf-sv-ui';
        $script = 'tf-sv-ui';

        $style_path = THEMIFY_DIR . '/css/tf-sv-ui.css';
        $script_path = THEMIFY_DIR . '/js/tf-sv-ui.js';
        $style_ver = file_exists( $style_path ) ? (string) filemtime( $style_path ) : THEMIFY_VERSION;
        $script_ver = file_exists( $script_path ) ? (string) filemtime( $script_path ) : THEMIFY_VERSION;

        $is_customizer = 0 === strpos( $context, 'customizer' );
        $color_style = 'tf-sv-colorpicker';
        $color_script = 'tf-sv-colorpicker';
        $combo_style = $is_customizer ? 'tf-sv-scombobox' : 'tf-sv-builder-combobox';
        $combo_script = $combo_style;
        $main_script_dep = wp_script_is( 'themify-main-script', 'registered' ) || wp_script_is( 'themify-main-script', 'enqueued' ) ? 'themify-main-script' : 'jquery';

        if ( ! wp_style_is( $color_style, 'registered' ) ) {
            wp_register_style( $color_style, THEMIFY_METABOX_URI . 'css/themify.minicolors.css', [], THEMIFY_VERSION );
        }
        if ( ! wp_script_is( $color_script, 'registered' ) ) {
            wp_register_script( $color_script, THEMIFY_METABOX_URI . 'js/themify.minicolors.js', [ $main_script_dep ], THEMIFY_VERSION, true );
        }
        if ( $is_customizer ) {
            if ( ! defined( 'THEMIFY_CUSTOMIZER_URI' ) && defined( 'THEMIFY_URI' ) && defined( 'THEMIFY_DIR' ) && is_dir( THEMIFY_DIR . '/customizer' ) ) {
                if ( ! defined( 'THEMIFY_CUSTOMIZER_DIR' ) ) {
                    define( 'THEMIFY_CUSTOMIZER_DIR', THEMIFY_DIR . '/customizer' );
                }
                define( 'THEMIFY_CUSTOMIZER_URI', THEMIFY_URI . '/customizer' );
            }
            $scombo_style_url  = null;
            $scombo_script_url = null;
            if ( defined( 'THEMIFY_CUSTOMIZER_URI' ) && is_file( THEMIFY_DIR . '/customizer/css/jquery-scombobox.css' ) ) {
                $scombo_style_url  = THEMIFY_CUSTOMIZER_URI . '/css/jquery-scombobox.css';
                $scombo_script_url = THEMIFY_CUSTOMIZER_URI . '/js/jquery-scombobox.min.js';
            } elseif ( defined( 'THEMIFY_BUILDER_URI' ) && defined( 'THEMIFY_BUILDER_DIR' ) && is_file( THEMIFY_BUILDER_DIR . '/css/editor/themify-combobox.css' ) && is_file( THEMIFY_BUILDER_DIR . '/js/editor/themify-combobox.min.js' ) ) {
                $scombo_style_url  = THEMIFY_BUILDER_URI . '/css/editor/themify-combobox.css';
                $scombo_script_url = THEMIFY_BUILDER_URI . '/js/editor/themify-combobox.min.js';
            }
            if ( $scombo_style_url && $scombo_script_url ) {
                if ( ! wp_style_is( $combo_style, 'registered' ) ) {
                    wp_register_style( $combo_style, $scombo_style_url, [], THEMIFY_VERSION );
                }
                if ( ! wp_script_is( $combo_script, 'registered' ) ) {
                    wp_register_script( $combo_script, $scombo_script_url, [ $main_script_dep ], THEMIFY_VERSION, true );
                }
            }
        } else {
            if ( ! wp_style_is( $combo_style, 'registered' ) ) {
                wp_register_style( $combo_style, THEMIFY_BUILDER_URI . '/css/editor/themify-combobox.css', [], THEMIFY_VERSION );
            }
            if ( ! wp_script_is( $combo_script, 'registered' ) ) {
                wp_register_script( $combo_script, THEMIFY_BUILDER_URI . '/js/editor/themify-combobox.min.js', [ $main_script_dep ], THEMIFY_VERSION, true );
            }
        }
        wp_register_style( $style, THEMIFY_URI . '/css/tf-sv-ui.css', [ $color_style, $combo_style ], $style_ver );
        wp_register_script( $script, THEMIFY_URI . '/js/tf-sv-ui.js', [ 'jquery', $color_script, $combo_script ], $script_ver, true );
        wp_enqueue_style( $color_style );
        wp_enqueue_style( $combo_style );
        wp_enqueue_script( $color_script );
        wp_enqueue_script( $combo_script );
        wp_enqueue_style( $style );
        wp_enqueue_script( $script );
        wp_add_inline_script( $script, 'window.tfSVData = ' . wp_json_encode( self::get_js_data() ) . ';', 'before' );
    }

    public static function ajax_save_vars() {
        check_ajax_referer( 'tf_sv_nonce', 'nonce' );
        if ( ! current_user_can( 'edit_theme_options' ) ) {
            wp_send_json_error( [ 'message' => __( 'Permission denied.', 'themify' ) ], 403 );
        }
        $vars = [];
        if ( isset( $_POST['vars'] ) ) {
            $decoded = json_decode( wp_unslash( $_POST['vars'] ), true );
            if ( is_array( $decoded ) ) {
                $vars = self::sanitize_vars( $decoded );
            }
        }
        set_theme_mod( self::OPTION_KEY, $vars );
        wp_send_json_success( [
            'vars' => self::get_js_vars(),
            'css' => self::build_root_css(),
            'message' => __( 'Style Variables saved.', 'themify' )
        ] );
    }

    public static function ajax_refresh_vars() {
        check_ajax_referer( 'tf_sv_nonce', 'nonce' );
        if ( ! current_user_can( 'edit_theme_options' ) ) {
            wp_send_json_error( [ 'message' => __( 'Permission denied.', 'themify' ) ], 403 );
        }
        wp_send_json_success( [
            'theme' => self::get_theme_vars(),
        ] );
    }

    public static function ajax_theme_native_colors() {
        check_ajax_referer( 'tf_sv_nonce', 'nonce' );
        if ( ! current_user_can( 'edit_theme_options' ) ) {
            wp_send_json_error( [ 'message' => __( 'Permission denied.', 'themify' ) ], 403 );
        }
        $names = [];
        if ( isset( $_POST['names'] ) ) {
            $decoded = json_decode( wp_unslash( $_POST['names'] ), true );
            if ( is_array( $decoded ) ) {
                foreach ( $decoded as $n ) {
                    $n = self::sanitize_name( is_string( $n ) ? $n : '' );
                    if ( '' !== $n ) {
                        $names[] = $n;
                    }
                }
            }
        }
        $names = array_values( array_unique( $names ) );

        $css_vars = self::get_theme_root_css_vars();
        $colors   = [];
        foreach ( $names as $name ) {
            $raw = isset( $css_vars[ $name ] ) ? (string) $css_vars[ $name ] : '';
            $colors[ $name ] = '' !== $raw ? self::sanitize_value( $raw, 'color' ) : '';
        }
        wp_send_json_success( [ 'colors' => $colors ] );
    }

    private static function get_theme_root_css_vars(): array {
        static $cache = null;
        if ( $cache !== null ) {
            return $cache;
        }
        $cache = [];

        $sources = [];

        $theme_css = get_template_directory() . '/style.css';
        if ( is_file( $theme_css ) ) {
            $sources[] = [ 'path' => $theme_css ];
        }

        if ( function_exists( 'themify_get_skin' ) ) {
            $skin = themify_get_skin();
            if ( $skin ) {
                $skin_css = get_template_directory() . '/skins/' . $skin . '/style.css';
                if ( is_file( $skin_css ) ) {
                    $sources[] = [ 'path' => $skin_css ];
                }
            }
        }

        if ( get_stylesheet_directory() !== get_template_directory() ) {
            $child_css = get_stylesheet_directory() . '/style.css';
            if ( is_file( $child_css ) ) {
                $sources[] = [ 'path' => $child_css ];
            }
            $child_custom_css = get_stylesheet_directory() . '/custom_style.css';
            if ( is_file( $child_custom_css ) ) {
                $sources[] = [ 'path' => $child_custom_css ];
            }
        }

        $theme_custom_css = get_template_directory() . '/custom_style.css';
        if ( is_file( $theme_custom_css ) ) {
            $sources[] = [ 'path' => $theme_custom_css ];
        }

        $inline_custom_css = themify_get( 'setting-custom_css', false, true );
        if ( is_string( $inline_custom_css ) && '' !== trim( $inline_custom_css ) ) {
            $sources[] = [ 'inline' => $inline_custom_css ];
        }

        if ( empty( $sources ) ) {
            $cache = [];
            return $cache;
        }

        $normal    = [];
        $important = [];

        foreach ( $sources as $source ) {
            // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
            $css = isset( $source['path'] ) ? @file_get_contents( $source['path'] ) : ( $source['inline'] ?? '' );
            if ( false === $css || '' === $css ) {
                continue;
            }
            self::parse_root_css_vars( $css, $normal, $important );
        }

        $raw_vars = array_merge( $normal, $important );

        // One-level var() expand for chained custom properties.
        $resolved = [];
        foreach ( $raw_vars as $name => $value ) {
            $resolved[ $name ] = trim( (string) preg_replace_callback(
                '/var\(\s*--([a-zA-Z0-9_-]+)\s*\)/',
                static fn( $m ) => $raw_vars[ strtolower( trim( $m[1] ) ) ] ?? $m[0],
                $value
            ) );
        }

        $cache = $resolved;
        return $cache;
    }

    private static function parse_root_css_vars( string $css, array &$normal, array &$important ): void {
        $css = preg_replace( '/\/\*.*?\*\//s', '', $css );

        $css = preg_replace( '/@[a-zA-Z][^{]*\{(?:[^{}]*|\{[^}]*\})*\}/s', '', $css );

        if ( ! preg_match_all( '/:root\s*\{([^}]+)\}/', $css, $blocks ) ) {
            return;
        }

        foreach ( $blocks[1] as $block ) {
            if ( ! preg_match_all( '/--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/', $block, $decls, PREG_SET_ORDER ) ) {
                continue;
            }
            foreach ( $decls as $decl ) {
                $name  = self::sanitize_name( $decl[1] );
                $raw   = trim( $decl[2] );
                if ( '' === $name || '' === $raw ) {
                    continue;
                }
                if ( preg_match( '/!important\s*$/i', $raw ) ) {
                    $important[ $name ] = trim( preg_replace( '/\s*!important\s*$/i', '', $raw ) );
                } else {
                    $normal[ $name ] = $raw;
                }
            }
        }
    }

    public static function print_root_vars() {
        echo self::get_root_vars_style_markup();
        echo self::get_google_fonts_links_markup();
    }

    private static function build_root_css():string {
        $items = self::get_merged_vars();
        if ( empty( $items ) ) {
            return '';
        }
        $breakpoints = self::get_breakpoints_payload();
        $css = [];

        $base_rules = '';
        foreach ( $items as $item ) {
            if ( empty( $item['name'] ) || empty( $item['values'] ) || ! is_array( $item['values'] ) ) {
                continue;
            }
            $value = self::get_effective_value( $item['values'], 'desktop' );
            if ( '' !== $value ) {
                $base_rules .= '--' . $item['name'] . ':' . $value . ';';
            }
        }
        if ( '' !== $base_rules ) {
            $css[] = ':root{' . $base_rules . '}';
        }

        foreach ( [ 'tablet_landscape', 'tablet', 'mobile' ] as $bp ) {
            $rules = '';
            foreach ( $items as $item ) {
                if ( empty( $item['name'] ) || empty( $item['values'] ) || ! is_array( $item['values'] ) ) {
                    continue;
                }
                if ( empty( $item['values'][ $bp ] ) ) {
                    continue;
                }
                $value = self::get_effective_value( $item['values'], $bp );
                if ( '' !== $value ) {
                    $rules .= '--' . $item['name'] . ':' . $value . ';';
                }
            }
            if ( '' !== $rules && ! empty( $breakpoints[ $bp ]['max'] ) ) {
                $css[] = '@media (max-width:' . intval( $breakpoints[ $bp ]['max'] ) . 'px){:root{' . $rules . '}}';
            }
        }

        return implode( '', $css );
    }

    private static function build_font_catalog_payload(): array {
        $fonts  = [];
        $google = [];
        $cf     = [];
        if ( function_exists( 'themify_get_web_safe_font_list' ) ) {
            $f = themify_get_web_safe_font_list();
            unset( $f[0], $f[1] );
            foreach ( $f as $v ) {
                if ( ! empty( $v['value'] ) ) {
                    $fonts[] = [
                        'name'  => $v['name'],
                        'value' => $v['value'],
                    ];
                }
            }
        }
        if ( function_exists( 'themify_get_google_font_lists' ) ) {
            $themify_gfonts = themify_get_google_font_lists();
            if ( ! empty( $themify_gfonts ) && is_array( $themify_gfonts ) ) {
                foreach ( $themify_gfonts as $font_name => $v ) {
                    $variants = is_array( $v ) ? $v[1] : [];
                    foreach ( $variants as $key => $variant_value ) {
                        if ( 'r' === $variant_value ) {
                            $variants[ $key ] = '400';
                        } elseif ( 'i' === $variant_value ) {
                            $variants[ $key ] = '400i';
                        }
                    }
                    $google[] = [
                        'name'     => $font_name,
                        'variants' => $variants,
                    ];
                }
            }
        }
        if ( class_exists( 'Themify_Custom_Fonts', false ) ) {
            $cf_list = Themify_Custom_Fonts::get_list( 'customizer' );
            if ( ! empty( $cf_list ) && is_array( $cf_list ) ) {
                foreach ( $cf_list as $v ) {
                    $variant = ! empty( $v['variant'] ) ? str_replace( [ 'regular', 'normal', 'bold' ], [ '400', '400', '700' ], $v['variant'] ) : '';
                    $cf[]    = [
                        'value'    => $v['value'],
                        'name'     => $v['name'],
                        'variants' => $variant,
                    ];
                }
            }
        }
        return [
            'fonts'  => $fonts,
            'google' => $google,
            'cf'     => $cf,
        ];
    }

    public static function get_js_data():array {
        return [
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'nonce' => wp_create_nonce( 'tf_sv_nonce' ),
            'vars' => self::get_js_vars(),
            'context' => is_customize_preview() ? 'customizer_preview' : ( is_admin() ? 'admin' : 'front' ),
            'fontCatalog' => self::build_font_catalog_payload(),
            'breakpoints' => self::get_breakpoints_payload(),
            'i18n' => [
                'title' => __( 'Style Variables', 'themify' ),
                'colors' => __( 'Colors', 'themify' ),
                'fonts' => __( 'Fonts', 'themify' ),
                'numbers' => __( 'Numbers', 'themify' ),
                'addNew' => __( '+ Add new', 'themify' ),
                'editVariables' => __( 'Edit Variables', 'themify' ),
                'noVariablesYet' => __( 'No variables yet', 'themify' ),
                'save' => __( 'Save', 'themify' ),
                'close' => __( 'Close', 'themify' ),
                'import' => __( 'Import', 'themify' ),
                'export' => __( 'Export', 'themify' ),
                'variableName' => __( 'Variable Name', 'themify' ),
                'variableNameTaken' => __( 'This variable name is already taken. Please enter a new one.', 'themify' ),
                'saved' => __( 'Saved', 'themify' ),
                'invalidFile' => __( 'Invalid Style Variables file.', 'themify' ),
                'delete' => __( 'Delete', 'themify' ),
                'deleteVariableConfirm' => __( 'Once a variable is deleted, any layout using it will no longer render properly. This cannot be undone.', 'themify' ),
                'renameVariable' => __( 'Rename variable', 'themify' ),
                'renameVariableHint' => __( 'Click to rename variable. Renaming a variable will affect any layout that uses it.', 'themify' ),
                'themeVarLockLabel' => __( 'Theme variable', 'themify' ),
                'themeVarLockHint' => __( 'Theme variables can not be renamed.', 'themify' ),
                'desktop' => __( 'Desktop', 'themify' ),
                'tabletLandscape' => __( 'Tablet landscape', 'themify' ),
                'tablet' => __( 'Tablet portrait', 'themify' ),
                'mobile' => __( 'Mobile', 'themify' ),
                'inherited' => __( 'Inherited', 'themify' ),
            ]
        ];
    }

    private static function get_js_vars():array {
        return [
            'theme' => self::get_theme_vars(),
            'user' => self::get_user_vars(),
            'all' => self::get_merged_vars()
        ];
    }

    private static function get_theme_vars():array {
        $vars = apply_filters( 'tf_sv_theme_vars', [] );
        return self::sanitize_vars( is_array( $vars ) ? $vars : [], false );
    }

    private static function get_user_vars():array {
        $vars = get_theme_mod( self::OPTION_KEY, [] );
        return self::sanitize_vars( is_array( $vars ) ? $vars : [], false );
    }

    private static function merge_sv_values( array $base, array $overlay ): array {
        foreach ( $overlay as $bp => $val ) {
            if ( '' !== (string) $val ) {
                $base[ $bp ] = $val;
            }
        }
        return $base;
    }

    private static function get_merged_vars():array {
        $theme = self::get_theme_vars();
        $user = self::get_user_vars();
        $map = [];
        $order = [];

        foreach ( $theme as $item ) {
            $map[ $item['name'] ] = $item;
            $order[] = $item['name'];
        }
        foreach ( $user as $item ) {
            if ( isset( $map[ $item['name'] ] ) ) {
                $map[ $item['name'] ]['values'] = self::merge_sv_values( $map[ $item['name'] ]['values'], $item['values'] );
                $map[ $item['name'] ]['type'] = $item['type'];
            } else {
                $map[ $item['name'] ] = $item;
                $order[] = $item['name'];
            }
        }

        $out = [];
        foreach ( $order as $name ) {
            if ( isset( $map[ $name ] ) ) {
                $out[] = $map[ $name ];
            }
        }
        return $out;
    }

    private static function sanitize_vars( array $vars, bool $require_value = true ):array {
        $out = [];
        foreach ( $vars as $item ) {
            if ( ! is_array( $item ) ) {
                continue;
            }
            $name = self::sanitize_name( $item['name'] ?? '' );
            $type = self::sanitize_type( $item['type'] ?? '' );
            $values = self::sanitize_responsive_values( is_array( $item['values'] ?? null ) ? $item['values'] : [], $type );
            if ( ! self::has_any_values( $values ) && isset( $item['value'] ) && ( is_string( $item['value'] ) || is_numeric( $item['value'] ) ) ) {
                $values = self::sanitize_responsive_values( [ 'desktop' => (string) $item['value'] ], $type );
            }
            if ( '' === $name || '' === $type || ( $require_value && ! self::has_any_values( $values ) ) ) {
                continue;
            }
            $out[] = [
                'name' => $name,
                'type' => $type,
                'values' => $values
            ];
        }
        return $out;
    }

    private static function sanitize_name( string $name ):string {
        $name = strtolower( trim( $name ) );
        $name = ltrim( $name, '-' );
        $name = preg_replace( '/\s+/', '-', $name );
        $name = preg_replace( '/[^a-z0-9_-]/', '', $name );
        return trim( (string) $name, '-' );
    }

    private static function sanitize_type( string $type ):string {
        $type = strtolower( trim( $type ) );
        return in_array( $type, [ 'color', 'font', 'number' ], true ) ? $type : '';
    }

    private static function sanitize_value( string $value, string $type ):string {
        $value = trim( wp_strip_all_tags( $value ) );
        if ( 'font' === $type && 0 === strpos( $value, '{' ) ) {
            $obj = json_decode( $value, true );
            if ( is_array( $obj ) && ! empty( $obj['name'] ) ) {
                $value = $obj['name'];
            }
        }
        $value = preg_replace( '/[;<>]/', '', $value );
        $value = str_replace( [ "", "\r\n", "\n", "\r" ], ' ', $value );
        $value = preg_replace( '/\s{2,}/', ' ', $value );
        if ( 'font' === $type ) {
            $value = trim( $value, "\"'" );
            if ( '---' === $value ) {
                return '';
            }
        }
        if ( '' === $value ) {
            return '';
        }
        if ( 'number' === $type ) {
            $value = preg_replace( '/\s+/', '', $value );
        }
        return $value;
    }


    private static function sanitize_responsive_values( array $values, string $type ):array {
        $out = [
            'desktop' => '',
            'tablet_landscape' => '',
            'tablet' => '',
            'mobile' => '',
        ];
        foreach ( $out as $bp => $empty ) {
            if ( array_key_exists( $bp, $values ) ) {
                $out[ $bp ] = self::sanitize_value( (string) $values[ $bp ], $type );
            }
        }
        return $out;
    }

    private static function has_any_values( array $values ):bool {
        foreach ( $values as $value ) {
            if ( '' !== (string) $value ) {
                return true;
            }
        }
        return false;
    }

    private static function get_effective_value( array $values, string $breakpoint ):string {
        $order = [ 'desktop', 'tablet_landscape', 'tablet', 'mobile' ];
        $current = '';
        foreach ( $order as $bp ) {
            if ( isset( $values[ $bp ] ) && '' !== (string) $values[ $bp ] ) {
                $current = (string) $values[ $bp ];
            }
            if ( $bp === $breakpoint ) {
                break;
            }
        }
        return $current;
    }

    private static function get_breakpoints_payload():array {
        $bps = function_exists( 'themify_get_breakpoints' ) ? themify_get_breakpoints() : [
            'tablet_landscape' => [ 769, 1280 ],
            'tablet' => [ 681, 768 ],
            'mobile' => 680,
        ];
        return [
            'desktop' => [ 'min' => null, 'max' => null ],
            'tablet_landscape' => [ 'min' => isset( $bps['tablet_landscape'][0] ) ? (int) $bps['tablet_landscape'][0] : 769, 'max' => isset( $bps['tablet_landscape'][1] ) ? (int) $bps['tablet_landscape'][1] : 1280 ],
            'tablet' => [ 'min' => isset( $bps['tablet'][0] ) ? (int) $bps['tablet'][0] : 681, 'max' => isset( $bps['tablet'][1] ) ? (int) $bps['tablet'][1] : 768 ],
            'mobile' => [ 'min' => 0, 'max' => isset( $bps['mobile'] ) ? (int) $bps['mobile'] : 680 ],
        ];
    }

    private static function normalize_var_reference( string $name ):string {
        $name = trim( $name );
        if ( '' === $name ) {
            return '';
        }
        if ( 0 === strpos( $name, '#var(' ) ) {
            $name = substr( $name, 1 );
        }
        if ( 0 === strpos( $name, 'var(' ) ) {
            $name = preg_replace( '/^var\(\s*/', '', $name );
            $name = preg_replace( '/\s*\)$/', '', $name );
        }
        $name = ltrim( $name, '#' );
        $name = preg_replace( '/^--+/', '', $name );
        if ( 0 === strpos( $name, 'tf_sv_' ) ) {
            $name = substr( $name, 6 );
        }
        return self::sanitize_name( $name );
    }

    private static function collect_var_names_from_data( $data, array &$names ):void {
        if ( is_array( $data ) ) {
            foreach ( $data as $key => $value ) {
                if ( is_string( $key ) && 0 === strpos( $key, 'tf_sv_' ) && ( is_string( $value ) || is_numeric( $value ) ) ) {
                    $name = self::normalize_var_reference( (string) $value );
                    if ( '' !== $name ) {
                        $names[ $name ] = true;
                    }
                }
                self::collect_var_names_from_data( $value, $names );
            }
            return;
        }
        if ( is_object( $data ) ) {
            self::collect_var_names_from_data( get_object_vars( $data ), $names );
            return;
        }
        if ( is_string( $data ) && '' !== $data ) {
            if ( false !== strpos( $data, 'var(' ) ) {
                preg_match_all( '/var\(\s*--([a-z0-9_-]+)\s*(?:,[^)]+)?\)/i', $data, $matches );
                if ( ! empty( $matches[1] ) ) {
                    foreach ( $matches[1] as $match ) {
                        $name = self::normalize_var_reference( (string) $match );
                        if ( '' !== $name ) {
                            $names[ $name ] = true;
                        }
                    }
                }
            }
            // Themify Customizer JSON uses bare "--slug" tokens (no var() wrapper) for colors/fonts.
            if ( false !== strpos( $data, '--' ) ) {
                preg_match_all( '/"(\-\-[a-zA-Z0-9_-]+)"/', $data, $bare );
                if ( ! empty( $bare[1] ) ) {
                    foreach ( $bare[1] as $token ) {
                        $name = self::normalize_var_reference( (string) $token );
                        if ( '' !== $name ) {
                            $names[ $name ] = true;
                        }
                    }
                }
            }
        }
    }

    public static function collect_used_vars( $builder_data ):array {
        if ( empty( $builder_data ) ) {
            return [];
        }
        if ( is_string( $builder_data ) ) {
            $decoded = json_decode( $builder_data, true );
            if ( is_array( $decoded ) ) {
                $builder_data = $decoded;
            }
        }
        $names = [];
        self::collect_var_names_from_data( $builder_data, $names );
        if ( empty( $names ) ) {
            return [];
        }
        $all = self::get_merged_vars();
        $by_name = [];
        foreach ( $all as $item ) {
            if ( ! empty( $item['name'] ) ) {
                $by_name[ $item['name'] ] = $item;
            }
        }
        $used = [];
        foreach ( array_keys( $names ) as $name ) {
            if ( isset( $by_name[ $name ] ) ) {
                $used[] = $by_name[ $name ];
            }
        }
        return $used;
    }

    public static function get_all_vars():array {
        return self::get_merged_vars();
    }

    public static function import_missing_vars( array $vars ) {
        if ( empty( $vars ) ) {
            return;
        }
        foreach ( $vars as $k => $var ) {
            if ( ! is_array( $var ) || empty( $var['name'] ) ) {
                continue;
            }
            $vars[ $k ]['name'] = self::normalize_var_reference( (string) $var['name'] );
        }
        $vars = self::sanitize_vars( $vars, false );
        if ( empty( $vars ) ) {
            return;
        }
        $user = self::get_user_vars();
        $user_by_name = [];
        foreach ( $user as $i => $item ) {
            if ( ! empty( $item['name'] ) ) {
                $user_by_name[ $item['name'] ] = $i;
            }
        }
        $added = false;
        foreach ( $vars as $var ) {
            if ( empty( $var['name'] ) ) {
                continue;
            }
            $n = $var['name'];
            if ( isset( $user_by_name[ $n ] ) ) {
                $i = $user_by_name[ $n ];
                $user[ $i ] = [
                    'name' => $n,
                    'type' => $var['type'],
                    'values' => self::merge_sv_values( $user[ $i ]['values'], $var['values'] ),
                ];
                $added = true;
                continue;
            }
            $user[] = $var;
            $user_by_name[ $n ] = count( $user ) - 1;
            $added = true;
        }
        if ( $added ) {
            set_theme_mod( self::OPTION_KEY, $user );
        }
    }

    public static function ajax_collect_used() {
        check_ajax_referer( 'tf_nonce', 'nonce' );
        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_send_json_error( [], 403 );
        }
        $data = isset( $_POST['builder_json'] ) ? wp_unslash( $_POST['builder_json'] ) : '';
        wp_send_json_success( [ 'used_sv' => self::collect_used_vars( $data ) ] );
    }

    public static function ajax_import_missing_vars() {
        check_ajax_referer( 'tf_nonce', 'nonce' );
        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_send_json_error( [ 'message' => __( 'Permission denied.', 'themify' ) ], 403 );
        }
        $vars = [];
        if ( isset( $_POST['vars'] ) ) {
            $decoded = json_decode( wp_unslash( $_POST['vars'] ), true );
            if ( is_array( $decoded ) ) {
                $vars = $decoded;
            }
        }
        $before = self::get_user_vars();
        self::import_missing_vars( $vars );
        $after = self::get_user_vars();
        wp_send_json_success( [
            'vars' => self::get_js_vars(),
            'css' => self::build_root_css(),
            'imported' => max( 0, count( $after ) - count( $before ) ),
            'message' => __( 'Style Variables imported.', 'themify' )
        ] );
    }
}

TF_SV_Framework::init();