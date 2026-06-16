<?php
/**
 * Builder Plugin Compatibility Code
 *
 * @package    Themify_Builder
 * @subpackage Themify_Builder/classes
 */

class Themify_Builder_Plugin_Compat_WPML {

	const BUILDER_SETTINGS_META_KEY = '_themify_builder_settings_json';

    static function init() {
        add_action( 'wp_ajax_themify_builder_icl_copy_from_original', array( __CLASS__, 'icl_copy_from_original' ) );
        add_filter( 'get_translatable_documents', array( __CLASS__, 'get_translatable_documents' ) );
		add_filter( 'wpml_config_array', [ __CLASS__, 'wpml_config_array' ], 99, 1 );
    }

	/**
	 * WPML only reads wpml-config.xml from the theme/plugin root, not themify/themify-builder/.
	 * Merge custom-fields-texts from Builder's config so WPML knows which JSON keys are translatable.
	 */
	public static function wpml_config_array( array $config ): array {
		if ( empty( $config['wpml-config'] ) || ! function_exists( 'icl_xml2array' ) ) {
			return $config;
		}

		$file = THEMIFY_BUILDER_DIR . '/wpml-config.xml';
		if ( ! is_readable( $file ) ) {
			return $config;
		}

		$contents = file_get_contents( $file );
		if ( $contents === false ) {
			return $config;
		}

		$builder = icl_xml2array( $contents );
		if ( empty( $builder['wpml-config']['custom-fields-texts']['key'] ) ) {
			return $config;
		}

		return self::replace_custom_fields_texts_key(
			$config,
			$builder['wpml-config']['custom-fields-texts']['key'],
			self::BUILDER_SETTINGS_META_KEY
		);
	}

	private static function replace_custom_fields_texts_key( array $config, $builder_keys, string $meta_key ): array {
		if ( isset( $builder_keys['attr'] ) ) {
			$builder_keys = [ $builder_keys ];
		}

		$replacement = null;
		foreach ( (array) $builder_keys as $key ) {
			if ( isset( $key['attr']['name'] ) && $key['attr']['name'] === $meta_key ) {
				$replacement = $key;
				break;
			}
		}

		if ( $replacement === null ) {
			return $config;
		}

		if ( empty( $config['wpml-config']['custom-fields-texts']['key'] ) ) {
			$config['wpml-config']['custom-fields-texts']['key'] = [ $replacement ];
			return $config;
		}

		$keys = $config['wpml-config']['custom-fields-texts']['key'];
		if ( isset( $keys['attr'] ) ) {
			$keys = [ $keys ];
		}

		$found = false;
		foreach ( $keys as $i => $key ) {
			if ( isset( $key['attr']['name'] ) && $key['attr']['name'] === $meta_key ) {
				$keys[ $i ] = $replacement;
				$found      = true;
				break;
			}
		}

		if ( ! $found ) {
			$keys[] = $replacement;
		}

		$config['wpml-config']['custom-fields-texts']['key'] = $keys;

		return $config;
	}

    /**
     * Load Builder content from original page when "Copy content" feature in WPML is used
     *
     * @access public
     * @since 1.4.3
     */
    public static function icl_copy_from_original() {
        check_ajax_referer( 'tf_nonce', 'nonce' );

        if ( isset( $_POST['source_page_id'],$_POST['source_page_lang'] ) && current_user_can( 'edit_post', $_POST['source_page_id'] ) ) {
            global $wpdb;
            $post_id = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT element_id FROM {$wpdb->prefix}icl_translations WHERE trid='%d' AND language_code='%s' LIMIT 1",
                    $_POST[ 'source_page_id' ],
                    $_POST[ 'source_page_lang' ]
                )
            );
            $post = ! empty( $post_id ) ? get_post( $post_id ) : null;
            if ( ! empty( $post ) ) {
                $builder_data = ThemifyBuilder_Data_Manager::get_data( $post->ID );
                wp_send_json_success($builder_data);
            }
            wp_send_json_error('');
        }
        die;
    }

    /**
     * Disable translation on some post types
     *
     * @return array
     */
    public static function get_translatable_documents(array $translatable_post_types=array() ):array {
        unset( $translatable_post_types[Themify_Global_Styles::SLUG],$translatable_post_types['tb_cf'], $translatable_post_types['tbp_theme']  );

        return $translatable_post_types;
    }
}