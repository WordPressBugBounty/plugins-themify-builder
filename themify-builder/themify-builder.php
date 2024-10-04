<?php
/*
Plugin Name: Themify Builder
Plugin URI: https://themify.me/builder
Description: Build responsive layouts that work for any device using intuitive "what you see is what you get" drag & drop framework, with live edits and previews.
Version: 7.6.3 
Author: Themify
Author URI: https://themify.me
Text Domain:  themify
Requires PHP: 7.2
Domain Path:  /languages
*/


if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


/**
 * Disable the plugin if using a Themify theme: Builder is included in the theme.
 *
 * @return void
 */
function themify_builder_theme_check() {
	if ( is_file( trailingslashit( get_template_directory() ) . 'themify/themify-utils.php' ) ) {
		?>
		<div class="error">
			<p><?php _e( 'You are using a Themify theme. The Builder is included in the theme framework. No need to install Builder plugin.', 'themify' ); ?></p>
		</div>
		<?php
		deactivate_plugins( plugin_basename( __FILE__ ), true );
	}
}
if(is_admin()){
	add_action( 'admin_notices', 'themify_builder_theme_check' );
}

// Hook loaded
add_action( 'after_setup_theme', 'themify_builder_themify_dependencies',1 );
add_action( 'after_setup_theme', 'themify_builder_plugin_init', 2 );
add_filter( 'plugin_row_meta', 'themify_builder_plugin_meta', 10, 2 );
add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'themify_builder_action_links' );


if ( ! function_exists( 'themify_builder_activate' ) ) {
	/**
	 * Plugin activation
	 *
	 * This runs only when Builder plugin is activated.
	 */
	function themify_builder_activate() {
		flush_rewrite_rules();
	}
}
register_activation_hook( __FILE__, 'themify_builder_activate' );

if(!function_exists('themify_builder_plugin_meta')){
	function themify_builder_plugin_meta( $links, $file ) {
		if ( plugin_basename( __FILE__ ) === $file ) {
			$row_meta = array(
			  'changelogs'    => '<a href="' . esc_url( 'https://themify.me/changelogs/' ) . basename( dirname( $file ) ) .'.txt" target="_blank" aria-label="' . esc_attr__( 'Plugin Changelogs', 'themify' ) . '">' . esc_html__( 'View Changelogs', 'themify' ) . '</a>'
			);

			return array_merge( $links, $row_meta );
		}
		return (array) $links;
	}
}
if(!function_exists('themify_builder_action_links')){
	function themify_builder_action_links( $links ) {
		if ( is_plugin_active( 'themify-updater/themify-updater.php' ) ) {
			$tlinks = array(
			 '<a href="' . admin_url( 'index.php?page=themify-license' ) . '">'.__('Themify License', 'themify') .'</a>',
			 );
		} else {
			$tlinks = array(
			 '<a href="' . esc_url('https://themify.me/docs/themify-updater-documentation') . '">'. __('Themify Updater', 'themify') .'</a>',
			 );
		}
		return array_merge( $links, $tlinks );
	}
}

///////////////////////////////////////////
// Version Getter
///////////////////////////////////////////
if (!function_exists('themify_builder_get')) {

    function themify_builder_get(string $theme_var, $builder_var = false,bool $data_only=true) {
        static $is=null;
        if($is===null){
            $is=\themify_is_themify_theme();
        }
        if ($is===true) {
            return \themify_get($theme_var,null,$data_only);
        }
        if ($builder_var === false) {
            return false;
        }
        global $post;
        $data = \Themify_Builder_Model::get_builder_settings();
        if (isset($data[$builder_var]) && $data[$builder_var] !== '') {
            return $data[$builder_var];
        } 
		elseif (isset($post) && ($val = \get_post_meta($post->ID, $builder_var, true)) !== '') {
            return $val;
        }
        return null;
    }

}
if ( ! function_exists( 'themify_builder_check' ) ) {

    function themify_builder_check(string $theme_var, $builder_var = false, bool $data_only = true ):bool {
		$val = \themify_builder_get( $theme_var, $builder_var, $data_only );

		return $val !== null && $val !== '' && $val !== 'off';
    }

}
if(!function_exists('themify_builder_themify_dependencies')){
	/**
	 * Load themify functions
	 */
	function themify_builder_themify_dependencies(){
		if ( class_exists( 'Themify_Builder',false ) ) return;

		if ( ! defined( 'THEMIFY_DIR' ) ) {
			/**
			 * Force regenerate the Builder CSS file after an update
			 */
			// 
			define( 'THEMIFY_BUILDER_REGENERATE_CSS', true );
			$path = plugin_dir_path( __FILE__ ) ;
			define( 'THEMIFY_VERSION', '7.6.3' );
			define( 'THEMIFY_DIR', $path. 'themify' );
			define( 'THEMIFY_URI', plugin_dir_url( __FILE__ ) . 'themify' );
			require_once THEMIFY_DIR . '/themify-database.php';
			require_once THEMIFY_DIR . '/class-themify-get-image-size.php';
			require_once THEMIFY_DIR . '/img.php' ;
			require_once THEMIFY_DIR . '/themify-utils.php';
            require_once THEMIFY_DIR . '/themify-fw-filters.php';
			require_once THEMIFY_DIR . '/themify-hooks.php';
			require_once $path. 'theme-options.php';
			if( is_admin() ) {
				require_once  THEMIFY_DIR . '/themify-wpajax.php';
			}
            if( ! class_exists( 'Themify_Metabox',false ) ) {
                require_once $path. 'themify/themify-metabox/themify-metabox.php';
            }
		}

		require_once THEMIFY_DIR . '/google-fonts/functions.php';

		if( ! function_exists( 'themify_get_featured_image_link' ) ) {
			require_once THEMIFY_DIR . '/themify-template-tags.php';
		}

		require_once THEMIFY_DIR . '/themify-icon-picker/themify-icon-font.php';
	}
}

// register additional field types used by Builder
add_action( 'themify_metabox/field/page_builder', 'themify_meta_field_page_builder', 10, 1 );
add_action( 'themify_metabox/field/fontawesome', 'themify_meta_field_fontawesome', 10, 1 );
add_action( 'themify_metabox/field/query_category', 'themify_meta_field_query_category', 10, 1 );
add_action( 'themify_metabox/field/featimgdropdown', 'themify_meta_field_featimgdropdown', 10, 1 );

if ( ! function_exists( 'themify_builder_plugin_init' ) ){
    
    if(!function_exists('theme_compatibility')){
        function themify_builder_theme_compatibility(){
            $dir=THEMIFY_BUILDER_DIR . '/theme-compat/' . get_template() ;
            if ( is_file( $dir . '.css' ) ) {
                add_theme_support( 'themify-page-options' );
            }
            $theme_compatibility_file = $dir. '.php';
            if ( is_file( $theme_compatibility_file ) ) {
                include $theme_compatibility_file;
            }
        }
    }
    /**
    * Init Plugin
    * called after theme to avoid redeclare function error
    */
   function themify_builder_plugin_init() {
	   if ( class_exists('Themify_Builder',false) ) return;


	   /**
	    * Define builder constant
	    */
		$path=plugin_basename( __FILE__);
		define( 'THEMIFY_BUILDER_NAME', trim( dirname( $path ), '/' ) );
		define( 'THEMIFY_BUILDER_SLUG', trim( $path, '/' ) );


	   // File Path
	   define( 'THEMIFY_BUILDER_DIR', __DIR__ );
	   define( 'THEMIFY_BUILDER_MODULES_DIR', THEMIFY_BUILDER_DIR . '/modules' );
	   define( 'THEMIFY_BUILDER_TEMPLATES_DIR', THEMIFY_BUILDER_DIR . '/templates' );
	   define( 'THEMIFY_BUILDER_CLASSES_DIR', THEMIFY_BUILDER_DIR . '/classes' );
	   define( 'THEMIFY_BUILDER_INCLUDES_DIR', THEMIFY_BUILDER_DIR . '/includes' );

	   // URI Constant
	   define( 'THEMIFY_BUILDER_URI', plugins_url( '' , __FILE__ ) );
	   define('THEMIFY_BUILDER_CSS_MODULES', THEMIFY_BUILDER_URI . '/css/modules/');
	   define('THEMIFY_BUILDER_JS_MODULES', THEMIFY_BUILDER_URI . '/js/modules/');

	   // Load Localization
	   load_plugin_textdomain( 'themify', false, THEMIFY_BUILDER_NAME . '/languages' );
	   // Include files
	   require THEMIFY_BUILDER_CLASSES_DIR . '/class-themify-builder-model.php';
	   require THEMIFY_BUILDER_CLASSES_DIR . '/class-themify-builder-layouts.php';
	   require THEMIFY_BUILDER_CLASSES_DIR . '/class-themify-global-styles.php';
	   require THEMIFY_BUILDER_CLASSES_DIR . '/class-themify-builder.php';
	   require THEMIFY_BUILDER_DIR . '/plugin/classes/class-themify-builder-settings.php';
	   require_once THEMIFY_DIR .'/class-themify-storage.php';
	   require_once THEMIFY_DIR . '/cache/class-themify-cache.php';
	   require_once THEMIFY_DIR . '/class-themify-enqueue.php'; 
	   require_once THEMIFY_DIR . '/class-themify-access-role.php';
	   require_once THEMIFY_DIR . '/class-themify-filesystem.php';
	   require_once THEMIFY_DIR . '/class-themify-custom-fonts.php';
	   require_once THEMIFY_DIR . '/class-themify-maintenance-mode.php';
	   require_once THEMIFY_BUILDER_DIR . '/plugin/classes/class-themify-builder-page-options.php';

	   if ( Themify_Builder_Model::builder_check() ) {

		   global $ThemifyBuilder;//deprecated
		   do_action( 'themify_builder_before_init' );
		   $ThemifyBuilder = new Themify_Builder();//deprecated
		   add_action( 'init', array( 'Themify_Builder','init' ), 0 );
		   themify_builder_theme_compatibility();
	   }

	   if( is_admin() ){
	       require_once THEMIFY_DIR . '/themify-admin.php';
	       require_once THEMIFY_DIR . '/themify-status.php';
	   }

	   /* enables the Page Options to be edited from frontend, only for Page post-type */
	   add_theme_support( 'frontend-page-options', [ 'page' ] );
   }
}
if ( ! function_exists('themify_builder_edit_module_panel') ) {
	/**
	 * Hook edit module frontend panel
	 * @param $mod_name
	 * @param $mod_settings
	 */
	function themify_builder_edit_module_panel( $mod_name, $mod_settings ) {
		do_action( 'themify_builder_edit_module_panel', $mod_name, $mod_settings );
	}
}
