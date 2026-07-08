<?php
defined('ABSPATH') || exit;

/**
 * Module Name: Accordion
 * Description: Display Accordion content
 */
class TB_Accordion_Module extends Themify_Builder_Component_Module {

    public static function get_module_name():string {
        add_filter('themify_builder_active_vars', [__CLASS__, 'builder_active_enqueue']);
        return __('Accordion', 'themify');
    }

    public static function get_module_icon():string {
        return 'layout-accordion-merged';
    }

    public static function get_js_css():array {
        $assets = array(
            'css' => 1,
            'js' => 1,
        );
        if (Themify_Builder_Model::is_front_builder_activate()) {
            $assets['js_admin'] = 1;
        }
        return $assets;
    }

    public static function builder_active_enqueue(array $vars):array {
        $vars['addons'][THEMIFY_BUILDER_URI . '/js/modules/accordion-admin.js'] = THEMIFY_VERSION;
        return $vars;
    }
    /**
     * Render plain content for static content.
     * 
     * @param array $module 
     * @return string
     */
    public static function get_static_content(array $module):string {
        $mod_settings = $module['mod_settings']+array(
            'mod_title_accordion' => '',
            'content_accordion' => array()
        );
        $output = '' !== $mod_settings['mod_title_accordion']?sprintf('<h3>%s</h3>', $mod_settings['mod_title_accordion']):'';

        if ( ! empty( $mod_settings['content_accordion'] ) ) {
			$output .= '<ul>';
            foreach ( $mod_settings['content_accordion'] as $accordion ) {
				$output .= '<li>';				
				if ( ! empty( $accordion['title_accordion'] ) ) {
					$output .= '<h4>' . $accordion['title_accordion'] . '</h4>';
				}

				if ( isset( $accordion['text_accordion'] ) ) {
                    $output .= $accordion['text_accordion'];
                } else if ( ! empty( $accordion['builder_content'] ) && is_array( $accordion['builder_content'] ) ) {
					$output .= ThemifyBuilder_Data_Manager::_get_all_builder_text_content( $accordion['builder_content'] );
				}
				$output .= '</li>';				
            }
			$output .= '</ul>';
        }

        return $output;
    }

    public static function subrow_attributes( $attr ) {
        remove_filter( 'themify_builder_subrow_attributes', [ __CLASS__, 'subrow_attributes' ] );
        $attr['itemprop'] = 'text';
        return $attr;
    }

    public static function get_styling_image_fields() : array {
        return [
            'bg_i' => [ ' .ui.module-accordion .accordion-title', ' .ui.module-accordion>li' ]
        ];
    }

	public static function get_translatable_fields( $module, $classname ) : array {
		$fields = parent::get_translatable_fields( $module, $classname );
		if ( ! empty( $module['mod_settings']['mod_title_accordion'] ) ) {
			$fields[] = [
				'id' => 'mod_title_accordion',
				'value' => $module['mod_settings']['mod_title_accordion'],
			];
		}
		if ( ! empty( $module['mod_settings']['content_accordion'] ) && is_array( $module['mod_settings']['content_accordion'] ) ) {
			foreach ( $module['mod_settings']['content_accordion'] as $row_index => $acc ) {
				if ( ! is_array( $acc ) ) {
					continue;
				}
				$fields[] = [
					'id' => 'title_accordion-' . $row_index,
					'value' => isset( $acc['title_accordion'] ) ? $acc['title_accordion'] : '',
				];
				if ( isset( $acc['text_accordion'] ) ) {
					$fields[] = [
						'id' => 'text_accordion-' . $row_index,
						'value' => $acc['text_accordion'],
						'type' => 'VISUAL',
					];
				}
			}
		}

		return $fields;
	}

	public static function translate_module( $module_data, $translations ) {
		if ( empty( $module_data['mod_settings'] ) || ! is_array( $module_data['mod_settings'] ) ) {
			$module_data['mod_settings'] = [];
		}
		if ( empty( $module_data['mod_settings']['content_accordion'] ) || ! is_array( $module_data['mod_settings']['content_accordion'] ) ) {
			$module_data['mod_settings']['content_accordion'] = [];
		}

		foreach ( $translations as $item_key => $value ) {
			if ( $item_key === 'mod_title_accordion' ) {
				$module_data['mod_settings']['mod_title_accordion'] = $value;
				continue;
			}

			$dash_pos = strrpos( $item_key, '-' );
			if ( $dash_pos === false ) {
				continue;
			}

			$field = substr( $item_key, 0, $dash_pos );
			$index = substr( $item_key, $dash_pos + 1 );
			if ( $field === '' || $index === '' || ! is_numeric( $index ) ) {
				continue;
			}

			if ( ! isset( $module_data['mod_settings']['content_accordion'][ $index ] ) || ! is_array( $module_data['mod_settings']['content_accordion'][ $index ] ) ) {
				$module_data['mod_settings']['content_accordion'][ $index ] = [];
			}

			$module_data['mod_settings']['content_accordion'][ $index ][ $field ] = $value;
		}

		return $module_data;
	}

    /**
     * Returns a flat array of all nested modules
     */
    public static function get_nested_modules( array $data ) : array {
        $modules = [];
        if ( isset( $data['mod_settings']['content_accordion'][0]['builder_content'] ) ) {
            foreach ( $data['mod_settings']['content_accordion'] as $tab ) {
                foreach ( $tab['builder_content'] as $row ) {
                    $modules = array_merge( $modules, Themify_Builder::_get_modules_recursive( $row ) );
                }
            }
        }

        return $modules;
    }
}
