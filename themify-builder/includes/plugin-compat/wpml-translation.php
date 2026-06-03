<?php
/**
 * WPML Translation compatibility
 *
 * @package    Themify_Builder
 * @subpackage Themify_Builder/classes
 */

// WPML string types: 'LINE', 'TEXTAREA', 'VISUAL', 'LINK'

class Themify_Builder_WPML_Integration {

	/* cached wpml $package_data during register_strings */
	private static $package_data;

	/* cached string translations */
	private static $translations;

    static function init() {
		add_filter( 'wpml_page_builder_support_required', [ __CLASS__, 'wpml_page_builder_support_required' ] );
		add_action( 'wpml_page_builder_register_strings', [ __CLASS__, 'wpml_page_builder_register_strings' ], 10, 2 );
		add_action( 'wpml_page_builder_string_translated', [ __CLASS__, 'wpml_page_builder_string_translated' ], 10, 5 );
		add_action( 'themify_builder_save_data', [ __CLASS__, 'sync_builder_data_to_translations' ], 20, 1 );
	}

	/* register Builder package */
	static function wpml_page_builder_support_required( $plugins ) {
		$plugins[] = 'Themify Builder';

		return $plugins;
	}

	static function wpml_page_builder_register_strings( $post, $package_data ) {
		if ( 'Themify Builder' === $package_data['kind'] ) {
			$builder_data = ThemifyBuilder_Data_Manager::get_data( $post->ID );
			self::$package_data = $package_data;
			do_action( 'wpml_start_string_package_registration', $package_data );
			if ( is_array( $builder_data ) ) {
				foreach ( $builder_data as $row ) {
					self::recursive_register_row_translatable_fields( $row );
				}
			}
			do_action( 'wpml_delete_unused_package_strings', $package_data );
		}
	}

	static function wpml_page_builder_string_translated(
		$package_kind,
		$translated_post_id,
		$original_post,
		$string_translations,
		$lang
	) {
		if ( 'Themify Builder' !== $package_kind || ! ( $original_post instanceof WP_Post ) ) {
			return;
		}
		$builder_data = ThemifyBuilder_Data_Manager::get_data( $original_post->ID );
		if ( empty( $builder_data ) || ! is_array( $builder_data ) ) {
			return;
		}
		self::$translations = self::group_string_translation_by_elementid( $string_translations, $lang );
		foreach ( $builder_data as $index => $row ) {
			$builder_data[ $index ] = self::recursive_translate_fields( $row );
		}
		$custom_css = get_post_meta( $original_post->ID, 'tbp_custom_css', true );
		$custom_css = is_string( $custom_css ) ? $custom_css : '';
		ThemifyBuilder_Data_Manager::save_data( $builder_data, (int) $translated_post_id, 'frontend', $custom_css );
		if ( class_exists( 'Themify_Builder_Stylesheet', false ) ) {
			Themify_Builder_Stylesheet::remove_css_files( (int) $translated_post_id );
		}
	}

	/**
	 * Push layout + styling from the source post to each translation, keeping translated text.
	 * Filters: themify_builder_wpml_sync_to_translated_posts, themify_builder_wpml_merge_styling_preserving_text.
	 */
	public static function sync_builder_data_to_translations( $post_id ) {
		$post_id = (int) $post_id;
		if ( $post_id < 1 || wp_is_post_revision( $post_id ) ) {
			return;
		}
		if ( ! apply_filters( 'themify_builder_wpml_sync_to_translated_posts', true, $post_id ) ) {
			return;
		}
		$post = get_post( $post_id );
		if ( ! $post ) {
			return;
		}
		$lang_details = apply_filters( 'wpml_post_language_details', null, $post_id );
		if ( ! is_array( $lang_details ) || empty( $lang_details['language_code'] ) ) {
			return;
		}
		$default = apply_filters( 'wpml_default_language', null );
		if ( ! is_string( $default ) || $default === '' || $lang_details['language_code'] !== $default ) {
			return;
		}
		$type = 'post_' . $post->post_type;
		$trid = apply_filters( 'wpml_element_trid', null, $post_id, $type );
		if ( ! $trid ) {
			return;
		}
		$translations = apply_filters( 'wpml_get_element_translations', null, $trid, $type );
		if ( empty( $translations ) || ! is_array( $translations ) ) {
			return;
		}
		$builder_data = ThemifyBuilder_Data_Manager::get_data( $post_id );
		if ( empty( $builder_data ) || ! is_array( $builder_data ) ) {
			return;
		}
		$custom_css = get_post_meta( $post_id, 'tbp_custom_css', true );
		$custom_css = is_string( $custom_css ) ? $custom_css : '';
		$merge_text = apply_filters( 'themify_builder_wpml_merge_styling_preserving_text', true, $post_id );
		foreach ( $translations as $lang => $t ) {
			if ( $lang === $default || ! is_object( $t ) || empty( $t->element_id ) ) {
				continue;
			}
			$target_id = (int) $t->element_id;
			if ( $target_id < 1 || $target_id === $post_id ) {
				continue;
			}
			if ( ! current_user_can( 'edit_post', $target_id ) ) {
				continue;
			}
			if ( $merge_text ) {
				$target_data = ThemifyBuilder_Data_Manager::get_data( $target_id );
				if ( empty( $target_data ) || ! is_array( $target_data ) ) {
					$data_to_save = $builder_data;
				} else {
					$data_to_save = self::merge_source_into_translation_builder_data( $builder_data, $target_data );
				}
			} else {
				$data_to_save = $builder_data;
			}
			ThemifyBuilder_Data_Manager::save_data( $data_to_save, $target_id, 'frontend', $custom_css );
			if ( class_exists( 'Themify_Builder_Stylesheet', false ) ) {
				Themify_Builder_Stylesheet::remove_css_files( $target_id );
			}
		}
	}

	/* Walk source rows; for each row also in the translation, merge styling/text by element_id. */
	private static function merge_source_into_translation_builder_data( array $source, array $target ): array {
		$tgt_map = [];
		foreach ( $target as $row ) {
			if ( ! empty( $row['element_id'] ) ) {
				$tgt_map[ $row['element_id'] ] = $row;
			}
		}
		$out = [];
		foreach ( $source as $src_row ) {
			$eid = isset( $src_row['element_id'] ) ? (string) $src_row['element_id'] : '';
			if ( $eid !== '' && isset( $tgt_map[ $eid ] ) ) {
				$out[] = self::merge_wpml_row( $src_row, $tgt_map[ $eid ] );
			} else {
				$out[] = $src_row;
			}
		}
		return $out;
	}

	private static function merge_wpml_row( array $src_row, array $tgt_row ): array {
		$merged = $src_row;
		if ( isset( $src_row['styling'] ) || isset( $tgt_row['styling'] ) ) {
			$merged['styling'] = self::merge_component_styling_for_wpml( isset( $src_row['styling'] ) && is_array( $src_row['styling'] ) ? $src_row['styling'] : [], isset( $tgt_row['styling'] ) && is_array( $tgt_row['styling'] ) ? $tgt_row['styling'] : [] );
		}
		if ( ! empty( $src_row['cols'] ) && is_array( $src_row['cols'] ) ) {
			$merged['cols'] = self::merge_wpml_cols( $src_row['cols'], isset( $tgt_row['cols'] ) && is_array( $tgt_row['cols'] ) ? $tgt_row['cols'] : [] );
		}
		return $merged;
	}

	private static function merge_wpml_cols( array $src_cols, array $tgt_cols ): array {
		$tgt_map = [];
		foreach ( $tgt_cols as $col ) {
			if ( ! empty( $col['element_id'] ) ) {
				$tgt_map[ $col['element_id'] ] = $col;
			}
		}
		$out = [];
		foreach ( $src_cols as $src_col ) {
			$eid = isset( $src_col['element_id'] ) ? (string) $src_col['element_id'] : '';
			if ( $eid !== '' && isset( $tgt_map[ $eid ] ) ) {
				$out[] = self::merge_wpml_col( $src_col, $tgt_map[ $eid ] );
			} else {
				$out[] = $src_col;
			}
		}
		return $out;
	}

	private static function merge_wpml_col( array $src_col, array $tgt_col ): array {
		$merged = $src_col;
		if ( isset( $src_col['styling'] ) || isset( $tgt_col['styling'] ) ) {
			$merged['styling'] = self::merge_component_styling_for_wpml( isset( $src_col['styling'] ) && is_array( $src_col['styling'] ) ? $src_col['styling'] : [], isset( $tgt_col['styling'] ) && is_array( $tgt_col['styling'] ) ? $tgt_col['styling'] : [] );
		}
		if ( ! empty( $src_col['modules'] ) && is_array( $src_col['modules'] ) ) {
			$merged['modules'] = self::merge_wpml_modules( $src_col['modules'], isset( $tgt_col['modules'] ) && is_array( $tgt_col['modules'] ) ? $tgt_col['modules'] : [] );
		}
		return $merged;
	}

	private static function merge_wpml_modules( array $src_mods, array $tgt_mods ): array {
		$tgt_map = [];
		foreach ( $tgt_mods as $mod ) {
			if ( ! empty( $mod['element_id'] ) ) {
				$tgt_map[ $mod['element_id'] ] = $mod;
			}
		}
		$out = [];
		foreach ( $src_mods as $src_mod ) {
			$eid = isset( $src_mod['element_id'] ) ? (string) $src_mod['element_id'] : '';
			if ( $eid !== '' && isset( $tgt_map[ $eid ] ) ) {
				$out[] = self::merge_wpml_module( $src_mod, $tgt_map[ $eid ] );
			} else {
				$out[] = $src_mod;
			}
		}
		return $out;
	}

	private static function merge_wpml_module( array $src_mod, array $tgt_mod ): array {
		$merged = $src_mod;
		if ( isset( $src_mod['styling'] ) || isset( $tgt_mod['styling'] ) ) {
			$merged['styling'] = self::merge_component_styling_for_wpml( isset( $src_mod['styling'] ) && is_array( $src_mod['styling'] ) ? $src_mod['styling'] : [], isset( $tgt_mod['styling'] ) && is_array( $tgt_mod['styling'] ) ? $tgt_mod['styling'] : [] );
		}
		if ( ! empty( $src_mod['cols'] ) && is_array( $src_mod['cols'] ) ) {
			$merged['cols'] = self::merge_wpml_cols( $src_mod['cols'], isset( $tgt_mod['cols'] ) && is_array( $tgt_mod['cols'] ) ? $tgt_mod['cols'] : [] );
		}
		if ( isset( $src_mod['mod_name'] ) ) {
			$merged['mod_settings'] = self::merge_wpml_module_settings( $src_mod, $tgt_mod );
		}
		return $merged;
	}

	private static function merge_component_styling_for_wpml( array $src_styling, array $tgt_styling ): array {
		$out = $src_styling;
		foreach ( [ '_tooltip', '_link' ] as $k ) {
			if ( array_key_exists( $k, $tgt_styling ) ) {
				$out[ $k ] = $tgt_styling[ $k ];
			}
		}
		return $out;
	}

	/* Take mod_settings from source, then overlay translated fields (per module's get_translatable_fields) from target. */
	private static function merge_wpml_module_settings( array $src_module, array $tgt_module ): array {
		$src_ms = isset( $src_module['mod_settings'] ) && is_array( $src_module['mod_settings'] ) ? $src_module['mod_settings'] : [];
		$tgt_ms = isset( $tgt_module['mod_settings'] ) && is_array( $tgt_module['mod_settings'] ) ? $tgt_module['mod_settings'] : [];

		if ( empty( $src_ms ) ) {
			return $tgt_ms;
		}
		if ( empty( $tgt_ms ) ) {
			return $src_ms;
		}

		$merged = $src_ms;
		$mod_name = isset( $src_module['mod_name'] ) ? $src_module['mod_name'] : '';
		if ( $mod_name !== '' ) {
			$module_class = self::get_module( $mod_name );
			if ( $module_class ) {
				$translatable = $module_class::get_translatable_fields( $tgt_module, $module_class );
				foreach ( $translatable as $field ) {
					if ( empty( $field['id'] ) ) {
						continue;
					}
					$fid = $field['id'];
					if ( strpos( $fid, '::' ) !== false ) {
						$parts = explode( '::', $fid, 3 );
						if ( count( $parts ) === 3 ) {
							list( $rep_id, $row_idx, $item_id ) = $parts;
							if ( isset( $tgt_ms[ $rep_id ][ $row_idx ][ $item_id ] ) ) {
								if ( ! isset( $merged[ $rep_id ] ) || ! is_array( $merged[ $rep_id ] ) ) {
									$merged[ $rep_id ] = [];
								}
								if ( ! isset( $merged[ $rep_id ][ $row_idx ] ) || ! is_array( $merged[ $rep_id ][ $row_idx ] ) ) {
									$merged[ $rep_id ][ $row_idx ] = [];
								}
								$merged[ $rep_id ][ $row_idx ][ $item_id ] = $tgt_ms[ $rep_id ][ $row_idx ][ $item_id ];
							}
						}
					} elseif ( preg_match( '/^([a-z_]+)-(\d+)$/', $fid, $title_parts ) ) {
						$rep_key = self::get_repeater_key_for_title_field( $mod_name, $title_parts[1] );
						if ( $rep_key !== '' && isset( $tgt_ms[ $rep_key ][ (int) $title_parts[2] ][ $title_parts[1] ] ) ) {
							if ( ! isset( $merged[ $rep_key ] ) || ! is_array( $merged[ $rep_key ] ) ) {
								$merged[ $rep_key ] = [];
							}
							if ( ! isset( $merged[ $rep_key ][ (int) $title_parts[2] ] ) || ! is_array( $merged[ $rep_key ][ (int) $title_parts[2] ] ) ) {
								$merged[ $rep_key ][ (int) $title_parts[2] ] = [];
							}
							$merged[ $rep_key ][ (int) $title_parts[2] ][ $title_parts[1] ] = $tgt_ms[ $rep_key ][ (int) $title_parts[2] ][ $title_parts[1] ];
						}
					} elseif ( array_key_exists( $fid, $tgt_ms ) ) {
						$merged[ $fid ] = $tgt_ms[ $fid ];
					}
				}
			}
		}

		$merged = self::merge_nested_module_builder_rows( $merged, $src_ms, $tgt_ms, $mod_name );

		foreach ( [ '_tooltip', '_link' ] as $shared_k ) {
			if ( array_key_exists( $shared_k, $tgt_ms ) ) {
				$merged[ $shared_k ] = $tgt_ms[ $shared_k ];
			}
		}

		return $merged;
	}

	private static function group_string_translation_by_elementid( $string_translations, $lang ) {
		$result = [];
		if ( ! empty( $string_translations ) ) {
			foreach ( $string_translations as $key => $value ) {
				if ( isset( $value[ $lang ]['value'] ) ) { /* just being cautios */
					list( $post_id, $element_id, $option_id ) = explode( '/', $key );
					$result[ $element_id ][ $option_id ] = $value[ $lang ]['value'];
				}
			}
		}

		return $result;
	}

	public static function recursive_translate_fields( $row ) {
		if ( ! empty( $row['styling'] ) ) {
			$row['styling'] = self::translate_shared_fields( $row['styling'], $row['element_id'] );
		}

		if ( ! empty( $row['cols'] ) ) {
			foreach ( $row['cols'] as &$col ) {
				if ( ! empty( $col['styling'] ) ) {
					$col['styling'] = self::translate_shared_fields( $col['styling'], $col['element_id'] );
				}

				if ( ! empty( $col['modules'] ) ) {
					foreach ( $col['modules'] as &$mod ) {
						if ( isset( $mod['mod_name'], $mod['element_id'], $mod['mod_settings'] )
							/* modules with nested Builder content are always sent for translation */
							&& ( isset( self::$translations[ $mod['element_id'] ] ) || in_array( $mod['mod_name'], [ 'tab', 'accordion', 'toggle' ], true ) )
						) {
							$module = self::get_module( $mod['mod_name'] );
							if ( $module ) {
								$mod = $module::translate_module( $mod, self::$translations[ $mod['element_id'] ] ?? [] );
								$mod['mod_settings'] = self::translate_shared_fields( $mod['mod_settings'], $mod['element_id'] );
							}
						}
						self::translate_nested_module_builder_rows( $mod );
						$mod = self::recursive_translate_fields( $mod ); // for subrows
					}
				}
			}
		}

		return $row;
	}

	public static function recursive_register_row_translatable_fields( $row ) {
		if ( ! empty( $row['styling'] ) ) {
			self::register_translatable_shared_fields( $row['styling'], $row['element_id'] );
		}
		if ( ! empty( $row['cols'] ) ) {
			foreach ( $row['cols'] as $col ) {
				if ( ! empty( $col['styling'] ) ) {
					self::register_translatable_shared_fields( $col['styling'], $col['element_id'] );
				}

				if ( ! empty( $col['modules'] ) ) {
					foreach ( $col['modules'] as $mod ) {
						if ( isset( $mod['mod_name'] ) ) {
							$module = self::get_module( $mod['mod_name'] );
							if ( $module ) {
								$translatable_fields = $module::get_translatable_fields( $mod, $module );
								self::register( $translatable_fields, $mod['element_id'] );
								if ( ! empty( $mod['mod_settings'] ) ) {
									self::register_translatable_shared_fields( $mod['mod_settings'], $mod['element_id'] );
								}
							}
						}
						self::register_nested_module_builder_rows( $mod );
						self::recursive_register_row_translatable_fields( $mod ); // for subrows
					}
				}
			}
		}
	}

	/**
	 * Register fields that exist in all components and can be translated
	 */
	private static function register_translatable_shared_fields( $component, $component_id ) {
		$fields = [];
		if ( isset( $component['_tooltip'] ) ) {
			$fields[] = [
				'value' => $component['_tooltip'],
				'id' => '_tooltip'
			];
		}
		if ( isset( $component['_link'] ) ) {
			$fields[] = [
				'value' => $component['_link'],
				'id' => '_link'
			];
		}

		if ( ! empty( $fields ) ) {
			self::register( $fields, $component_id );
		}
	}

	/**
	 * Translate shared fields that exist in all components
	 */
	private static function translate_shared_fields( $component, $component_id ) {
		if ( isset( self::$translations[ $component_id ]['_tooltip'] ) ) {
			$component['_tooltip'] = self::$translations[ $component_id ]['_tooltip'];
		}
		if ( isset( self::$translations[ $component_id ]['_link'] ) ) {
			$component['_link'] = self::$translations[ $component_id ]['_link'];
		}

		return $component;
	}

	private static function get_repeater_key_for_title_field( string $mod_name, string $field_name ) : string {
		if ( $mod_name === 'accordion' && in_array( $field_name, [ 'title_accordion', 'text_accordion' ], true ) ) {
			return 'content_accordion';
		}
		if ( $mod_name === 'tab' && in_array( $field_name, [ 'title_tab', 'text_tab' ], true ) ) {
			return 'tab_content_tab';
		}
		return '';
	}

	/**
	 * Register strings for nested rows inside accordion/tab panels, toggle states, layout parts, etc.
	 */
	private static function register_nested_module_builder_rows( array $mod ) : void {
		if ( empty( $mod['mod_settings'] ) || ! is_array( $mod['mod_settings'] ) ) {
			return;
		}
		foreach ( self::collect_nested_builder_rows( $mod['mod_name'] ?? '', $mod['mod_settings'] ) as $subrow ) {
			self::recursive_register_row_translatable_fields( $subrow );
		}
	}

	/**
	 * Apply WPML string translations to nested builder rows.
	 */
	private static function translate_nested_module_builder_rows( array &$mod ) : void {
		if ( empty( $mod['mod_settings'] ) || ! is_array( $mod['mod_settings'] ) ) {
			return;
		}
		$mod_name = $mod['mod_name'] ?? '';
		$ms       = &$mod['mod_settings'];

		if ( ! empty( $ms['builder_content'] ) && is_array( $ms['builder_content'] ) ) {
			foreach ( $ms['builder_content'] as &$subrow ) {
				if ( is_array( $subrow ) ) {
					$subrow = self::recursive_translate_fields( $subrow );
				}
			}
			unset( $subrow );
		}

		if ( $mod_name === 'accordion' && ! empty( $ms['content_accordion'] ) && is_array( $ms['content_accordion'] ) ) {
			foreach ( $ms['content_accordion'] as &$item ) {
				if ( ! empty( $item['builder_content'] ) && is_array( $item['builder_content'] ) ) {
					foreach ( $item['builder_content'] as &$subrow ) {
						if ( is_array( $subrow ) ) {
							$subrow = self::recursive_translate_fields( $subrow );
						}
					}
					unset( $subrow );
				}
			}
			unset( $item );
		}

		if ( $mod_name === 'tab' && ! empty( $ms['tab_content_tab'] ) && is_array( $ms['tab_content_tab'] ) ) {
			foreach ( $ms['tab_content_tab'] as &$item ) {
				if ( ! empty( $item['builder_content'] ) && is_array( $item['builder_content'] ) ) {
					foreach ( $item['builder_content'] as &$subrow ) {
						if ( is_array( $subrow ) ) {
							$subrow = self::recursive_translate_fields( $subrow );
						}
					}
					unset( $subrow );
				}
			}
			unset( $item );
		}

		if ( $mod_name === 'toggle' ) {
			foreach ( [ 'toggle1', 'toggle2' ] as $toggle_key ) {
				if ( ! empty( $ms[ $toggle_key ] ) && is_array( $ms[ $toggle_key ] ) ) {
					foreach ( $ms[ $toggle_key ] as &$subrow ) {
						if ( is_array( $subrow ) ) {
							$subrow = self::recursive_translate_fields( $subrow );
						}
					}
					unset( $subrow );
				}
			}
		}
	}

	/**
	 * Merge nested builder rows when syncing layout from the default language post.
	 */
	private static function merge_nested_module_builder_rows( array $merged, array $src_ms, array $tgt_ms, string $mod_name ) : array {
		if ( ! empty( $src_ms['builder_content'] ) && is_array( $src_ms['builder_content'] ) ) {
			$merged['builder_content'] = self::merge_source_into_translation_builder_data(
				$src_ms['builder_content'],
				isset( $tgt_ms['builder_content'] ) && is_array( $tgt_ms['builder_content'] ) ? $tgt_ms['builder_content'] : []
			);
		}

		if ( $mod_name === 'accordion' && ! empty( $src_ms['content_accordion'] ) && is_array( $src_ms['content_accordion'] ) ) {
			$merged['content_accordion'] = self::merge_repeater_panel_builder_content(
				$src_ms['content_accordion'],
				isset( $tgt_ms['content_accordion'] ) && is_array( $tgt_ms['content_accordion'] ) ? $tgt_ms['content_accordion'] : [],
				'builder_content',
				[ 'title_accordion', 'text_accordion' ]
			);
		}

		if ( $mod_name === 'tab' && ! empty( $src_ms['tab_content_tab'] ) && is_array( $src_ms['tab_content_tab'] ) ) {
			$merged['tab_content_tab'] = self::merge_repeater_panel_builder_content(
				$src_ms['tab_content_tab'],
				isset( $tgt_ms['tab_content_tab'] ) && is_array( $tgt_ms['tab_content_tab'] ) ? $tgt_ms['tab_content_tab'] : [],
				'builder_content',
				[ 'title_tab', 'text_tab' ]
			);
		}

		if ( $mod_name === 'toggle' ) {
			foreach ( [ 'toggle1', 'toggle2' ] as $toggle_key ) {
				if ( ! empty( $src_ms[ $toggle_key ] ) && is_array( $src_ms[ $toggle_key ] ) ) {
					$merged[ $toggle_key ] = self::merge_source_into_translation_builder_data(
						$src_ms[ $toggle_key ],
						isset( $tgt_ms[ $toggle_key ] ) && is_array( $tgt_ms[ $toggle_key ] ) ? $tgt_ms[ $toggle_key ] : []
					);
				}
			}
			foreach ( [ 'on', 'off' ] as $label_key ) {
				if ( array_key_exists( $label_key, $tgt_ms ) ) {
					$merged[ $label_key ] = $tgt_ms[ $label_key ];
				}
			}
		}

		return $merged;
	}

	private static function merge_repeater_panel_builder_content( array $src_items, array $tgt_items, string $content_key, array $text_keys ) : array {
		$out = [];
		foreach ( $src_items as $index => $src_item ) {
			$merged_item = $src_item;
			$tgt_item    = isset( $tgt_items[ $index ] ) && is_array( $tgt_items[ $index ] ) ? $tgt_items[ $index ] : [];
			if ( ! empty( $src_item[ $content_key ] ) && is_array( $src_item[ $content_key ] ) ) {
				$tgt_content = isset( $tgt_item[ $content_key ] ) && is_array( $tgt_item[ $content_key ] ) ? $tgt_item[ $content_key ] : [];
				$merged_item[ $content_key ] = self::merge_source_into_translation_builder_data( $src_item[ $content_key ], $tgt_content );
			}
			foreach ( $text_keys as $text_key ) {
				if ( isset( $tgt_item[ $text_key ] ) ) {
					$merged_item[ $text_key ] = $tgt_item[ $text_key ];
				}
			}
			$out[] = $merged_item;
		}
		return $out;
	}

	/**
	 * @return array<int, array>
	 */
	private static function collect_nested_builder_rows( string $mod_name, array $mod_settings ) : array {
		$rows = [];
		if ( ! empty( $mod_settings['builder_content'] ) && is_array( $mod_settings['builder_content'] ) ) {
			foreach ( $mod_settings['builder_content'] as $subrow ) {
				if ( is_array( $subrow ) ) {
					$rows[] = $subrow;
				}
			}
		}
		if ( $mod_name === 'accordion' && ! empty( $mod_settings['content_accordion'] ) && is_array( $mod_settings['content_accordion'] ) ) {
			foreach ( $mod_settings['content_accordion'] as $item ) {
				if ( ! empty( $item['builder_content'] ) && is_array( $item['builder_content'] ) ) {
					foreach ( $item['builder_content'] as $subrow ) {
						if ( is_array( $subrow ) ) {
							$rows[] = $subrow;
						}
					}
				}
			}
		}
		if ( $mod_name === 'tab' && ! empty( $mod_settings['tab_content_tab'] ) && is_array( $mod_settings['tab_content_tab'] ) ) {
			foreach ( $mod_settings['tab_content_tab'] as $item ) {
				if ( ! empty( $item['builder_content'] ) && is_array( $item['builder_content'] ) ) {
					foreach ( $item['builder_content'] as $subrow ) {
						if ( is_array( $subrow ) ) {
							$rows[] = $subrow;
						}
					}
				}
			}
		}
		if ( $mod_name === 'toggle' ) {
			foreach ( [ 'toggle1', 'toggle2' ] as $toggle_key ) {
				if ( ! empty( $mod_settings[ $toggle_key ] ) && is_array( $mod_settings[ $toggle_key ] ) ) {
					foreach ( $mod_settings[ $toggle_key ] as $subrow ) {
						if ( is_array( $subrow ) ) {
							$rows[] = $subrow;
						}
					}
				}
			}
		}
		return apply_filters( 'themify_builder_wpml_nested_builder_rows', $rows, $mod_name, $mod_settings );
	}

	public static function get_module( $name ) {
		$m = Themify_Builder_Component_Module::load_modules( $name );
		if ( is_object( $m ) ) {
			return get_class( $m );
		} else if ( is_string( $m ) ) {
			return $m;
		}
	}

	private static function register( $translatable_fields, $element_id ) {
		if ( ! empty( $translatable_fields ) ) {
			foreach ( $translatable_fields as $field ) {
				do_action(
					'wpml_register_string',
					$field['value'],
					self::$package_data['post_id'] . '/' . $element_id . '/' . $field['id'],
					self::$package_data,
					isset( $field['title'] ) ? $field['title'] : '',
					isset( $field['type'] ) ? $field['type'] : 'LINE'
				);
			}
		}
	}
}