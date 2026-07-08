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

	/* Post meta key storing the WPML package WPML assigned on first scan/translation. */
	const WPML_PACKAGE_META_KEY = '_themify_builder_wpml_package';

	/* cached string translations */
	private static $translations;

	/* When true, existing modules keep translation content and only sync styling/layout. */
	private static $preserve_translation_content = false;

	/* Prevent recursive WPML hooks while saving translation Builder data. */
	private static $syncing_to_translations = false;

	/* Source post ID during layout sync (for new-module copy vs strip filter). */
	private static $layout_sync_source_post_id = 0;

    static function init() {
		add_filter( 'wpml_page_builder_support_required', [ __CLASS__, 'wpml_page_builder_support_required' ] );
		add_action( 'wpml_page_builder_register_strings', [ __CLASS__, 'wpml_page_builder_register_strings' ], 10, 2 );
		add_action( 'wpml_page_builder_string_translated', [ __CLASS__, 'wpml_page_builder_string_translated' ], 10, 5 );
		add_action( 'themify_builder_save_data', [ __CLASS__, 'refresh_wpml_builder_strings' ], 10, 1 );
		add_action( 'themify_builder_save_data', [ __CLASS__, 'sync_builder_data_to_translations' ], 20, 1 );
		add_action( 'themify_builder_save_data', [ __CLASS__, 'register_wpml_builder_strings_after_sync' ], 30, 1 );
		add_action( 'themify_builder_save_data', [ __CLASS__, 'mark_wpml_translations_needing_update_on_save' ], 35, 1 );
		add_action( 'wpml_pb_translations_auto_updated', [ __CLASS__, 'sync_styling_after_wpml_auto_update' ], 20, 1 );
	}

	/* register Builder package */
	static function wpml_page_builder_support_required( $plugins ) {
		$plugins[] = 'Themify Builder';

		return $plugins;
	}

	static function wpml_page_builder_register_strings( $post, $package_data ) {
		if ( 'Themify Builder' === $package_data['kind'] ) {
			if ( $post instanceof WP_Post && $post->ID > 0 ) {
				update_post_meta( $post->ID, self::WPML_PACKAGE_META_KEY, $package_data );
			}
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
		if ( self::$syncing_to_translations ) {
			return;
		}
		$source_data = ThemifyBuilder_Data_Manager::get_data( $original_post->ID );
		if ( empty( $source_data ) || ! is_array( $source_data ) ) {
			return;
		}
		self::$translations = self::group_string_translation_by_elementid( $string_translations, $lang );

		$target_data = ThemifyBuilder_Data_Manager::get_data( (int) $translated_post_id );
		if ( empty( $target_data ) || ! is_array( $target_data ) ) {
			foreach ( $source_data as $index => $row ) {
				$source_data[ $index ] = self::recursive_translate_fields( $row );
			}
			$data_to_save = $source_data;
		} else {
			$data_to_save = self::apply_wpml_translations_to_target_builder_data( $source_data, $target_data );
		}

		// WPML 4.9+ auto-update only applies string translations; merge styling/layout from the source post.
		self::$layout_sync_source_post_id = (int) $original_post->ID;
		self::$preserve_translation_content = true;
		$data_to_save = self::merge_source_into_translation_builder_data( $source_data, $data_to_save );
		self::$preserve_translation_content = false;
		self::$layout_sync_source_post_id = 0;

		ThemifyBuilder_Data_Manager::save_data(
			$data_to_save,
			(int) $translated_post_id,
			'backend',
			null,
			[ 'silent' => true ]
		);
		if ( class_exists( 'Themify_Builder_Stylesheet', false ) ) {
			Themify_Builder_Stylesheet::remove_css_files( (int) $translated_post_id );
		}
	}

	/**
	 * WPML 4.9+ Translation Auto-Update re-saves completed translations on shutdown.
	 * Re-sync styling from the source post after that text-only pass.
	 */
	public static function sync_styling_after_wpml_auto_update( int $translation_post_id ): void {
		$translation_post_id = (int) $translation_post_id;
		if ( $translation_post_id < 1 || self::$syncing_to_translations || ! defined( 'ICL_SITEPRESS_VERSION' ) ) {
			return;
		}
		$post = get_post( $translation_post_id );
		if ( ! $post ) {
			return;
		}
		$type = 'post_' . $post->post_type;
		$trid = apply_filters( 'wpml_element_trid', null, $translation_post_id, $type );
		if ( ! $trid ) {
			return;
		}
		$translations = apply_filters( 'wpml_get_element_translations', null, $trid, $type );
		if ( empty( $translations ) || ! is_array( $translations ) ) {
			return;
		}
		$default = apply_filters( 'wpml_default_language', null );
		foreach ( $translations as $lang => $t ) {
			if ( $lang === $default && is_object( $t ) && ! empty( $t->element_id ) ) {
				self::sync_builder_data_to_translations( (int) $t->element_id );
				break;
			}
		}
	}

	/**
	 * Re-register Builder strings when the default language post is saved so WPML picks up new modules/panels.
	 */
	public static function refresh_wpml_builder_strings( $post_id ) {
		$post_id = (int) $post_id;
		if ( $post_id < 1 || wp_is_post_revision( $post_id ) || ! defined( 'ICL_SITEPRESS_VERSION' ) ) {
			return;
		}
		$lang_details = apply_filters( 'wpml_post_language_details', null, $post_id );
		$default      = apply_filters( 'wpml_default_language', null );
		if ( ! is_array( $lang_details ) || empty( $lang_details['language_code'] ) || $lang_details['language_code'] !== $default ) {
			return;
		}
		$post = get_post( $post_id );
		if ( ! $post ) {
			return;
		}
		$package_data = self::get_wpml_package_data( $post_id, $post );
		self::wpml_page_builder_register_strings( $post, $package_data );
		ThemifyBuilder_Data_Manager::sync_static_content_to_post_content( $post_id );
		self::mark_wpml_translations_needing_update( $post_id );
	}

	/**
	 * Re-register strings after layout sync so WPML/ATE always sees the latest English fields.
	 */
	public static function register_wpml_builder_strings_after_sync( $post_id ) {
		$post_id = (int) $post_id;
		if ( $post_id < 1 || wp_is_post_revision( $post_id ) || ! defined( 'ICL_SITEPRESS_VERSION' ) ) {
			return;
		}
		$lang_details = apply_filters( 'wpml_post_language_details', null, $post_id );
		$default      = apply_filters( 'wpml_default_language', null );
		if ( ! is_array( $lang_details ) || empty( $lang_details['language_code'] ) || $lang_details['language_code'] !== $default ) {
			return;
		}
		$post = get_post( $post_id );
		if ( ! $post ) {
			return;
		}
		self::wpml_page_builder_register_strings( $post, self::get_wpml_package_data( $post_id, $post ) );
	}

	/**
	 * Flag translations as needing update after layout/styling sync so ATE picks up new strings.
	 */
	public static function mark_wpml_translations_needing_update_on_save( $post_id ) {
		$post_id = (int) $post_id;
		if ( $post_id < 1 || wp_is_post_revision( $post_id ) || ! defined( 'ICL_SITEPRESS_VERSION' ) ) {
			return;
		}
		$lang_details = apply_filters( 'wpml_post_language_details', null, $post_id );
		$default      = apply_filters( 'wpml_default_language', null );
		if ( ! is_array( $lang_details ) || empty( $lang_details['language_code'] ) || $lang_details['language_code'] !== $default ) {
			return;
		}
		self::mark_wpml_translations_needing_update( $post_id );
	}

	/**
	 * WPML only sets needs_update when the classic editor POST includes icl_trid.
	 * Builder AJAX saves skip that, so ATE keeps serving the old job (pencil icon).
	 */
	private static function mark_wpml_translations_needing_update( int $post_id ): void {
		global $wpdb;

		$post = get_post( $post_id );
		if ( ! $post ) {
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

		$md5 = self::get_wpml_post_md5( $post_id );
		if ( $md5 === '' ) {
			return;
		}

		foreach ( $translations as $translation ) {
			if ( ! is_object( $translation ) || ! empty( $translation->original ) || empty( $translation->translation_id ) ) {
				continue;
			}

			$wpdb->update(
				$wpdb->prefix . 'icl_translation_status',
				[
					'needs_update' => 1,
					'md5'          => $md5,
				],
				[ 'translation_id' => (int) $translation->translation_id ],
				[ '%d', '%s' ],
				[ '%d' ]
			);
		}

		do_action( 'themify_builder_wpml_translations_marked_needing_update', $post_id, $trid, $md5 );
	}

	/**
	 * Layout sync writes empty text on translation posts; WPML can record those as completed translations.
	 * Remove empty ST rows for non-empty source strings so ATE still lists them.
	 *
	 * @param array<string, object> $translations
	 */
	private static function clear_wpml_empty_package_string_translations( int $source_post_id, array $translations, string $default_lang ): void {
		global $wpdb;

		$strings = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT s.id, s.value
				FROM {$wpdb->prefix}icl_strings s
				INNER JOIN {$wpdb->prefix}icl_string_packages p ON s.string_package_id = p.id
				WHERE p.kind = %s AND p.post_id = %d",
				'Themify Builder',
				$source_post_id
			)
		);

		if ( empty( $strings ) ) {
			return;
		}

		foreach ( $translations as $lang => $translation ) {
			if ( $lang === $default_lang || ! is_object( $translation ) || empty( $translation->element_id ) ) {
				continue;
			}

			foreach ( $strings as $string ) {
				if ( ! is_object( $string ) || trim( (string) $string->value ) === '' ) {
					continue;
				}

				$row = $wpdb->get_row(
					$wpdb->prepare(
						"SELECT id, value, status FROM {$wpdb->prefix}icl_string_translations
						WHERE string_id = %d AND language = %s LIMIT 1",
						(int) $string->id,
						$lang
					)
				);

				if ( ! $row || trim( (string) $row->value ) !== '' ) {
					continue;
				}

				$wpdb->delete(
					$wpdb->prefix . 'icl_string_translations',
					[ 'id' => (int) $row->id ],
					[ '%d' ]
				);
			}
		}
	}

	private static function get_wpml_post_md5( int $post_id ): string {
		global $iclTranslationManagement;

		if ( isset( $iclTranslationManagement ) && is_object( $iclTranslationManagement ) && method_exists( $iclTranslationManagement, 'post_md5' ) ) {
			return (string) $iclTranslationManagement->post_md5( $post_id );
		}

		$post = get_post( $post_id );
		if ( ! $post ) {
			return '';
		}

		$parts = [ $post->post_title, $post->post_content ];
		$builder_json = get_post_meta( $post_id, ThemifyBuilder_Data_Manager::META_KEY, true );
		if ( is_array( $builder_json ) ) {
			$parts[] = wp_json_encode( $builder_json );
		} elseif ( is_string( $builder_json ) && $builder_json !== '' ) {
			$parts[] = $builder_json;
		}

		return md5( implode( ';', $parts ) );
	}

	/**
	 * Reuse the exact WPML package identity from the first scan/translation job.
	 * Title must match WPML_PB_API_Hooks_Strategy::get_package_key() (WPML 4.9+).
	 */
	private static function get_wpml_package_default_title( int $post_id ): string {
		return 'Page Builder Page ' . $post_id;
	}

	private static function get_wpml_package_data( int $post_id, WP_Post $post ): array {
		$cached = get_post_meta( $post_id, self::WPML_PACKAGE_META_KEY, true );
		if ( is_array( $cached ) && ! empty( $cached['kind'] ) && array_key_exists( 'name', $cached ) ) {
			$package = $cached;
		} else {
			$package = [
				'kind'  => 'Themify Builder',
				'name'  => (string) $post_id,
				'title' => self::get_wpml_package_default_title( $post_id ),
			];
		}

		$package['kind']      = 'Themify Builder';
		$package['name']      = (string) ( $package['name'] ?? $post_id );
		$package['post_id']   = $post_id;
		if ( empty( $package['title'] ) ) {
			$package['title'] = self::get_wpml_package_default_title( $post_id );
		}
		$package['edit_link'] = get_edit_post_link( $post_id, 'raw' ) ?: '';
		if ( empty( $package['view_link'] ) ) {
			$package['view_link'] = get_permalink( $post_id ) ?: '';
		}

		return apply_filters( 'themify_builder_wpml_package_data', $package, $post_id, $post );
	}

	/**
	 * Push layout + styling from the source post to each translation, keeping translated text.
	 * Filters: themify_builder_wpml_sync_to_translated_posts, themify_builder_wpml_merge_styling_preserving_text,
	 * themify_builder_wpml_preserve_module_translation, themify_builder_wpml_preserved_module (merged module with styling synced),
	 * themify_builder_wpml_should_preserve_translation_content,
	 * themify_builder_wpml_strip_new_module_text (default false: new modules copy source text; silent save keeps ATE working).
	 */
	public static function sync_builder_data_to_translations( $post_id ) {
		$post_id = (int) $post_id;
		if ( $post_id < 1 || wp_is_post_revision( $post_id ) || self::$syncing_to_translations ) {
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
		$merge_text = apply_filters( 'themify_builder_wpml_merge_styling_preserving_text', true, $post_id );
		self::$syncing_to_translations        = true;
		self::$layout_sync_source_post_id     = $post_id;
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
			self::$preserve_translation_content = self::should_preserve_translation_content( $post_id, $target_id, $t );
			if ( $merge_text ) {
				$target_data = ThemifyBuilder_Data_Manager::get_data( $target_id );
				if ( empty( $target_data ) || ! is_array( $target_data ) ) {
					$data_to_save = self::copy_new_builder_rows( $builder_data );
				} else {
					$data_to_save = self::merge_source_into_translation_builder_data( $builder_data, $target_data );
				}
			} else {
				$data_to_save = self::copy_new_builder_rows( $builder_data );
			}
			// Silent save: avoid save_post/meta hooks that make WPML treat empty layout sync as translated strings.
			ThemifyBuilder_Data_Manager::save_data(
				$data_to_save,
				$target_id,
				'backend',
				null,
				[ 'silent' => true ]
			);
			if ( class_exists( 'Themify_Builder_Stylesheet', false ) ) {
				Themify_Builder_Stylesheet::remove_css_files( $target_id );
			}
			self::$preserve_translation_content = false;
		}
		self::clear_wpml_empty_package_string_translations( $post_id, $translations, $default );
		self::$syncing_to_translations    = false;
		self::$layout_sync_source_post_id = 0;
	}

	/**
	 * Detect WPML duplicate translations that should keep their own Builder text.
	 */
	private static function should_preserve_translation_content( int $src_id, int $tgt_id, $translation = null ): bool {
		$preserve = apply_filters( 'themify_builder_wpml_should_preserve_translation_content', null, $src_id, $tgt_id, $translation );
		if ( is_bool( $preserve ) ) {
			return $preserve;
		}

		if ( self::builder_posts_have_different_text_content( $src_id, $tgt_id ) ) {
			return true;
		}

		if ( defined( 'ICL_TM_COMPLETE' ) && is_object( $translation ) && isset( $translation->status ) && (int) $translation->status === ICL_TM_COMPLETE ) {
			return true;
		}

		$duplicate_of = get_post_meta( $tgt_id, '_icl_lang_duplicate_of', true );
		if ( ! empty( $duplicate_of ) && (int) $duplicate_of === $src_id ) {
			return false;
		}

		return true;
	}

	private static function builder_posts_have_different_text_content( int $src_id, int $tgt_id ): bool {
		$src_data = ThemifyBuilder_Data_Manager::get_data( $src_id );
		$tgt_data = ThemifyBuilder_Data_Manager::get_data( $tgt_id );
		if ( empty( $src_data ) || ! is_array( $src_data ) || empty( $tgt_data ) || ! is_array( $tgt_data ) ) {
			return false;
		}

		$src_text = trim( ThemifyBuilder_Data_Manager::_get_all_builder_text_content( $src_data ) );
		$tgt_text = trim( ThemifyBuilder_Data_Manager::_get_all_builder_text_content( $tgt_data ) );
		if ( $src_text === '' || $tgt_text === '' ) {
			return false;
		}

		return self::normalize_wpml_translatable_value( $src_text ) !== self::normalize_wpml_translatable_value( $tgt_text );
	}

	/* Walk source rows; merge styling/text by element_id, or by index when WPML regenerated IDs. */
	private static function merge_source_into_translation_builder_data( array $source, array $target ): array {
		$tgt_map = self::index_builder_components_by_element_id( $target );
		$out     = [];
		foreach ( $source as $index => $src_row ) {
			$tgt_row = self::find_matching_builder_component( $src_row, $target, $index, $tgt_map );
			$out[]   = $tgt_row !== null ? self::merge_wpml_row( $src_row, $tgt_row ) : self::copy_new_builder_row( $src_row );
		}
		return $out;
	}

	/**
	 * @return array<string, array>
	 */
	private static function index_builder_components_by_element_id( array $items ): array {
		$map = [];
		foreach ( $items as $item ) {
			if ( is_array( $item ) && ! empty( $item['element_id'] ) ) {
				$map[ (string) $item['element_id'] ] = $item;
			}
		}
		return $map;
	}

	private static function find_matching_builder_component( array $src_item, array $tgt_items, int $index, array $tgt_map ): ?array {
		$eid = isset( $src_item['element_id'] ) ? (string) $src_item['element_id'] : '';
		if ( $eid !== '' && isset( $tgt_map[ $eid ] ) ) {
			return $tgt_map[ $eid ];
		}
		if ( ! isset( $tgt_items[ $index ] ) || ! is_array( $tgt_items[ $index ] ) ) {
			return null;
		}
		$candidate = $tgt_items[ $index ];
		if ( isset( $src_item['mod_name'], $candidate['mod_name'] ) && $src_item['mod_name'] !== $candidate['mod_name'] ) {
			return null;
		}
		return $candidate;
	}

	private static function merge_wpml_row( array $src_row, array $tgt_row ): array {
		$merged = $src_row;
		if ( ! empty( $tgt_row['element_id'] ) ) {
			$merged['element_id'] = $tgt_row['element_id'];
		}
		if ( isset( $src_row['styling'] ) || isset( $tgt_row['styling'] ) ) {
			$merged['styling'] = self::merge_component_styling_for_wpml( isset( $src_row['styling'] ) && is_array( $src_row['styling'] ) ? $src_row['styling'] : [], isset( $tgt_row['styling'] ) && is_array( $tgt_row['styling'] ) ? $tgt_row['styling'] : [] );
		}
		if ( ! empty( $src_row['cols'] ) && is_array( $src_row['cols'] ) ) {
			$merged['cols'] = self::merge_wpml_cols( $src_row['cols'], isset( $tgt_row['cols'] ) && is_array( $tgt_row['cols'] ) ? $tgt_row['cols'] : [] );
		}
		return $merged;
	}

	private static function merge_wpml_cols( array $src_cols, array $tgt_cols ): array {
		$tgt_map = self::index_builder_components_by_element_id( $tgt_cols );
		$out     = [];
		foreach ( $src_cols as $index => $src_col ) {
			$tgt_col = self::find_matching_builder_component( $src_col, $tgt_cols, $index, $tgt_map );
			$out[]   = $tgt_col !== null ? self::merge_wpml_col( $src_col, $tgt_col ) : self::copy_new_builder_col( $src_col );
		}
		return $out;
	}

	private static function merge_wpml_col( array $src_col, array $tgt_col ): array {
		$merged = $src_col;
		if ( ! empty( $tgt_col['element_id'] ) ) {
			$merged['element_id'] = $tgt_col['element_id'];
		}
		if ( isset( $src_col['styling'] ) || isset( $tgt_col['styling'] ) ) {
			$merged['styling'] = self::merge_component_styling_for_wpml( isset( $src_col['styling'] ) && is_array( $src_col['styling'] ) ? $src_col['styling'] : [], isset( $tgt_col['styling'] ) && is_array( $tgt_col['styling'] ) ? $tgt_col['styling'] : [] );
		}
		if ( ! empty( $src_col['modules'] ) && is_array( $src_col['modules'] ) ) {
			$merged['modules'] = self::merge_wpml_modules( $src_col['modules'], isset( $tgt_col['modules'] ) && is_array( $tgt_col['modules'] ) ? $tgt_col['modules'] : [] );
		}
		return $merged;
	}

	private static function merge_wpml_modules( array $src_mods, array $tgt_mods ): array {
		$tgt_map = self::index_builder_components_by_element_id( $tgt_mods );
		$out     = [];
		foreach ( $src_mods as $index => $src_mod ) {
			$tgt_mod = self::find_matching_builder_component( $src_mod, $tgt_mods, $index, $tgt_map );
			$out[]   = $tgt_mod !== null ? self::merge_wpml_module( $src_mod, $tgt_mod ) : self::copy_new_builder_module( $src_mod );
		}
		return $out;
	}

	private static function merge_wpml_module( array $src_mod, array $tgt_mod ): array {
		$preserved = self::module_has_preserved_translation( $src_mod, $tgt_mod );

		$merged = $src_mod;
		if ( ! empty( $tgt_mod['element_id'] ) ) {
			$merged['element_id'] = $tgt_mod['element_id'];
		}
		if ( isset( $src_mod['styling'] ) || isset( $tgt_mod['styling'] ) ) {
			$merged['styling'] = self::merge_component_styling_for_wpml( isset( $src_mod['styling'] ) && is_array( $src_mod['styling'] ) ? $src_mod['styling'] : [], isset( $tgt_mod['styling'] ) && is_array( $tgt_mod['styling'] ) ? $tgt_mod['styling'] : [] );
		}
		if ( ! empty( $src_mod['cols'] ) && is_array( $src_mod['cols'] ) ) {
			$merged['cols'] = self::merge_wpml_cols( $src_mod['cols'], isset( $tgt_mod['cols'] ) && is_array( $tgt_mod['cols'] ) ? $tgt_mod['cols'] : [] );
		}
		if ( isset( $src_mod['mod_name'] ) ) {
			$merged['mod_settings'] = $preserved
				? self::merge_wpml_module_settings_preserve_content( $src_mod, $tgt_mod )
				: self::merge_wpml_module_settings( $src_mod, $tgt_mod );
		}

		if ( $preserved ) {
			$merged = apply_filters( 'themify_builder_wpml_preserved_module', $merged, $src_mod, $tgt_mod );
		}

		return $merged;
	}

	/**
	 * Skip layout sync for modules whose translation already has customized text content.
	 */
	private static function module_has_preserved_translation( array $src_mod, array $tgt_mod ): bool {
		if ( self::$preserve_translation_content ) {
			return true;
		}

		$mod_name = isset( $src_mod['mod_name'] ) ? $src_mod['mod_name'] : '';
		if ( $mod_name === '' || $mod_name !== ( $tgt_mod['mod_name'] ?? '' ) ) {
			return false;
		}

		$preserve = apply_filters( 'themify_builder_wpml_preserve_module_translation', null, $src_mod, $tgt_mod );
		if ( is_bool( $preserve ) ) {
			return $preserve;
		}

		return self::module_translatable_content_differs( $src_mod, $tgt_mod );
	}

	private static function module_translatable_content_differs( array $src_mod, array $tgt_mod ): bool {
		if ( self::module_translatable_fields_differs( $src_mod, $tgt_mod ) ) {
			return true;
		}

		$src_nested = self::flatten_modules_in_mod( $src_mod );
		$tgt_nested = self::flatten_modules_in_mod( $tgt_mod );
		foreach ( $src_nested as $element_id => $src_nested_mod ) {
			if ( ! isset( $tgt_nested[ $element_id ] ) ) {
				continue;
			}
			if ( self::module_translatable_fields_differs( $src_nested_mod, $tgt_nested[ $element_id ] ) ) {
				return true;
			}
		}

		return false;
	}

	private static function module_translatable_fields_differs( array $src_mod, array $tgt_mod ): bool {
		$mod_name = isset( $src_mod['mod_name'] ) ? $src_mod['mod_name'] : '';
		$module_class = $mod_name !== '' ? self::get_module( $mod_name ) : null;
		if ( ! $module_class || ! method_exists( $module_class, 'get_translatable_fields' ) ) {
			return false;
		}

		$src_fields = self::index_wpml_translatable_fields( $module_class::get_translatable_fields( $src_mod, $module_class ) );
		$tgt_fields = self::index_wpml_translatable_fields( $module_class::get_translatable_fields( $tgt_mod, $module_class ) );

		foreach ( $tgt_fields as $field_id => $tgt_value ) {
			if ( ! array_key_exists( $field_id, $src_fields ) ) {
				if ( self::has_non_empty_translatable_value( $tgt_value ) ) {
					return true;
				}
				continue;
			}
			if ( self::normalize_wpml_translatable_value( $tgt_value ) !== self::normalize_wpml_translatable_value( $src_fields[ $field_id ] ) ) {
				return true;
			}
		}

		return false;
	}

	private static function index_wpml_translatable_fields( array $fields ): array {
		$indexed = [];
		foreach ( $fields as $field ) {
			if ( ! empty( $field['id'] ) && array_key_exists( 'value', $field ) ) {
				$indexed[ $field['id'] ] = $field['value'];
			}
		}
		return $indexed;
	}

	private static function has_non_empty_translatable_value( $value ): bool {
		return self::normalize_wpml_translatable_value( $value ) !== '';
	}

	private static function normalize_wpml_translatable_value( $value ): string {
		if ( ! is_scalar( $value ) ) {
			return '';
		}
		return trim( wp_strip_all_tags( (string) $value ) );
	}

	/**
	 * @return array<string, array>
	 */
	private static function flatten_modules_in_mod( array $mod ): array {
		$map = [];
		if ( ! empty( $mod['cols'] ) && is_array( $mod['cols'] ) ) {
			foreach ( $mod['cols'] as $col ) {
				if ( ! empty( $col['modules'] ) && is_array( $col['modules'] ) ) {
					foreach ( $col['modules'] as $nested_mod ) {
						$map = array_merge( $map, self::flatten_modules_in_mod( $nested_mod ) );
					}
				}
			}
		}

		$mod_name = $mod['mod_name'] ?? '';
		$ms       = isset( $mod['mod_settings'] ) && is_array( $mod['mod_settings'] ) ? $mod['mod_settings'] : [];
		foreach ( self::collect_nested_builder_rows( $mod_name, $ms ) as $row ) {
			$map = array_merge( $map, self::flatten_modules_in_row( $row ) );
		}

		return $map;
	}

	/**
	 * @return array<string, array>
	 */
	private static function flatten_modules_in_row( array $row ): array {
		$map = [];
		if ( empty( $row['cols'] ) || ! is_array( $row['cols'] ) ) {
			return $map;
		}
		foreach ( $row['cols'] as $col ) {
			if ( empty( $col['modules'] ) || ! is_array( $col['modules'] ) ) {
				continue;
			}
			foreach ( $col['modules'] as $mod ) {
				if ( ! empty( $mod['element_id'] ) ) {
					$map[ $mod['element_id'] ] = $mod;
				}
				$map = array_merge( $map, self::flatten_modules_in_mod( $mod ) );
			}
		}
		return $map;
	}

	/**
	 * Keep translated mod_settings; apply styling and other non-translatable settings from the source.
	 */
	private static function merge_wpml_module_settings_preserve_content( array $src_module, array $tgt_module ): array {
		$src_ms = isset( $src_module['mod_settings'] ) && is_array( $src_module['mod_settings'] ) ? $src_module['mod_settings'] : [];
		$tgt_ms = isset( $tgt_module['mod_settings'] ) && is_array( $tgt_module['mod_settings'] ) ? $tgt_module['mod_settings'] : [];

		if ( empty( $src_ms ) ) {
			return $tgt_ms;
		}
		if ( empty( $tgt_ms ) ) {
			return $src_ms;
		}

		$mod_name  = $src_module['mod_name'] ?? '';
		$protected = self::get_protected_translatable_field_ids( $tgt_module, $mod_name );
		$merged    = $tgt_ms;

		foreach ( $src_ms as $key => $src_value ) {
			if ( self::is_protected_mod_setting_key( $key, $protected ) ) {
				continue;
			}
			if ( is_array( $src_value ) ) {
				$tgt_value = isset( $tgt_ms[ $key ] ) && is_array( $tgt_ms[ $key ] ) ? $tgt_ms[ $key ] : [];
				if ( self::is_nested_mod_setting_key( $key, $mod_name ) ) {
					$merged[ $key ] = self::merge_nested_mod_settings_preserve_content( $src_value, $tgt_value, $key, $mod_name );
				} elseif ( $mod_name === 'table' && $key === 'table_content' ) {
					$merged[ $key ] = self::merge_table_content_preserve_content( $src_value, $tgt_value, $protected );
				} elseif ( self::mod_setting_key_has_nested_protected_fields( $key, $protected ) ) {
					$merged[ $key ] = self::merge_repeatable_mod_settings_preserve_content( $src_value, $tgt_value, $key, $protected );
				} else {
					$merged[ $key ] = $src_value;
				}
			} else {
				$merged[ $key ] = $src_value;
			}
		}

		foreach ( [ '_tooltip', '_link' ] as $shared_k ) {
			if ( array_key_exists( $shared_k, $tgt_ms ) ) {
				$merged[ $shared_k ] = $tgt_ms[ $shared_k ];
			}
		}

		return $merged;
	}

	/**
	 * @return array<string, true>
	 */
	private static function get_protected_translatable_field_ids( array $module, string $mod_name ): array {
		$protected    = [];
		$module_class = $mod_name !== '' ? self::get_module( $mod_name ) : null;
		if ( ! $module_class || ! method_exists( $module_class, 'get_translatable_fields' ) ) {
			return $protected;
		}
		foreach ( $module_class::get_translatable_fields( $module, $module_class ) as $field ) {
			if ( ! empty( $field['id'] ) ) {
				$protected[ $field['id'] ] = true;
			}
		}
		return $protected;
	}

	private static function is_protected_mod_setting_key( string $key, array $protected ): bool {
		return isset( $protected[ $key ] );
	}

	private static function mod_setting_key_has_nested_protected_fields( string $key, array $protected ): bool {
		$prefix = $key . '::';
		foreach ( array_keys( $protected ) as $field_id ) {
			if ( strpos( $field_id, $prefix ) === 0 ) {
				return true;
			}
		}
		return false;
	}

	private static function is_protected_repeater_sub_field( string $repeater_key, $index, string $sub_key, array $protected ): bool {
		if ( isset( $protected[ $repeater_key . '::' . $index . '::' . $sub_key ] ) ) {
			return true;
		}
		if ( isset( $protected[ $sub_key . '-' . $index ] ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Preserve translated cells in repeatable Builder settings (buttons, slider, mosaic, etc.).
	 */
	private static function merge_repeatable_mod_settings_preserve_content( array $src_items, array $tgt_items, string $repeater_key, array $protected ): array {
		$out = [];
		foreach ( $src_items as $index => $src_item ) {
			if ( ! is_array( $src_item ) ) {
				$out[] = $src_item;
				continue;
			}
			$tgt_item = isset( $tgt_items[ $index ] ) && is_array( $tgt_items[ $index ] ) ? $tgt_items[ $index ] : [];
			if ( empty( $tgt_item ) ) {
				$out[] = $src_item;
				continue;
			}
			$merged_item = $tgt_item;
			foreach ( $src_item as $sub_key => $src_sub_value ) {
				if ( self::is_protected_repeater_sub_field( $repeater_key, $index, $sub_key, $protected ) ) {
					continue;
				}
				$merged_item[ $sub_key ] = $src_sub_value;
			}
			$out[] = $merged_item;
		}
		return $out;
	}

	/**
	 * Preserve translated table cells while syncing structure/styling from the source.
	 */
	private static function merge_table_content_preserve_content( array $src_table, array $tgt_table, array $protected ): array {
		$merged = $src_table;
		foreach ( array_keys( $protected ) as $field_id ) {
			if ( preg_match( '/^head-(\d+)$/', $field_id, $matches ) ) {
				$i = (int) $matches[1];
				if ( isset( $tgt_table['head'][ $i ] ) ) {
					$merged['head'][ $i ] = $tgt_table['head'][ $i ];
				}
				continue;
			}
			if ( preg_match( '/^body-(\d+)_(\d+)$/', $field_id, $matches ) ) {
				$r = (int) $matches[1];
				$c = (int) $matches[2];
				if ( isset( $tgt_table['body'][ $r ][ $c ] ) ) {
					if ( ! isset( $merged['body'][ $r ] ) || ! is_array( $merged['body'][ $r ] ) ) {
						$merged['body'][ $r ] = [];
					}
					$merged['body'][ $r ][ $c ] = $tgt_table['body'][ $r ][ $c ];
				}
			}
		}
		return $merged;
	}

	private static function is_nested_mod_setting_key( string $key, string $mod_name ): bool {
		if ( in_array( $key, [ 'builder_content', 'toggle1', 'toggle2', 'content_accordion', 'tab_content_tab' ], true ) ) {
			return true;
		}
		return false;
	}

	private static function merge_nested_mod_settings_preserve_content( array $src_value, array $tgt_value, string $key, string $mod_name ): array {
		if ( in_array( $key, [ 'builder_content', 'toggle1', 'toggle2' ], true ) ) {
			return self::merge_source_into_translation_builder_data( $src_value, $tgt_value );
		}

		$text_keys = [];
		if ( $key === 'content_accordion' ) {
			$text_keys = [ 'title_accordion', 'text_accordion' ];
		} elseif ( $key === 'tab_content_tab' ) {
			$text_keys = [ 'title_tab', 'text_tab' ];
		}

		$out = [];
		foreach ( $src_value as $index => $src_item ) {
			if ( ! is_array( $src_item ) ) {
				continue;
			}
			$tgt_item = isset( $tgt_value[ $index ] ) && is_array( $tgt_value[ $index ] ) ? $tgt_value[ $index ] : [];
			if ( empty( $tgt_item ) ) {
				$out[] = $src_item;
				continue;
			}

			$merged_item = $tgt_item;
			foreach ( $src_item as $sub_key => $src_sub_value ) {
				if ( in_array( $sub_key, $text_keys, true ) ) {
					continue;
				}
				if ( $sub_key === 'builder_content' && is_array( $src_sub_value ) ) {
					$tgt_content = isset( $tgt_item['builder_content'] ) && is_array( $tgt_item['builder_content'] ) ? $tgt_item['builder_content'] : [];
					$merged_item['builder_content'] = self::merge_source_into_translation_builder_data( $src_sub_value, $tgt_content );
				} else {
					$merged_item[ $sub_key ] = $src_sub_value;
				}
			}
			$out[] = $merged_item;
		}

		return $out;
	}

	/**
	 * Copy a new row/col/module from the source layout. Text is included by default; silent sync keeps ATE working.
	 * Filter themify_builder_wpml_strip_new_module_text to restore empty-text sync.
	 */
	private static function should_strip_new_module_text(): bool {
		return (bool) apply_filters(
			'themify_builder_wpml_strip_new_module_text',
			false,
			self::$layout_sync_source_post_id
		);
	}

	private static function copy_new_builder_rows( array $rows ): array {
		if ( ! self::should_strip_new_module_text() ) {
			return $rows;
		}
		return self::strip_translatable_content_from_builder_rows( $rows );
	}

	private static function copy_new_builder_row( array $row ): array {
		if ( ! self::should_strip_new_module_text() ) {
			return $row;
		}
		return self::strip_translatable_content_from_builder_row( $row );
	}

	private static function copy_new_builder_col( array $col ): array {
		if ( ! self::should_strip_new_module_text() ) {
			return $col;
		}
		return self::strip_translatable_content_from_builder_col( $col );
	}

	private static function copy_new_builder_module( array $module ): array {
		if ( ! self::should_strip_new_module_text() ) {
			return $module;
		}
		return self::strip_module_translatable_content( $module );
	}

	private static function strip_translatable_content_from_builder_row( array $row ): array {
		if ( ! empty( $row['styling'] ) && is_array( $row['styling'] ) ) {
			$row['styling'] = self::strip_shared_styling_text( $row['styling'] );
		}
		if ( ! empty( $row['cols'] ) && is_array( $row['cols'] ) ) {
			foreach ( $row['cols'] as $index => $col ) {
				$row['cols'][ $index ] = self::strip_translatable_content_from_builder_col( $col );
			}
		}
		return $row;
	}

	private static function strip_translatable_content_from_builder_col( array $col ): array {
		if ( ! empty( $col['styling'] ) && is_array( $col['styling'] ) ) {
			$col['styling'] = self::strip_shared_styling_text( $col['styling'] );
		}
		if ( ! empty( $col['modules'] ) && is_array( $col['modules'] ) ) {
			foreach ( $col['modules'] as $index => $mod ) {
				$col['modules'][ $index ] = self::strip_module_translatable_content( $mod );
			}
		}
		return $col;
	}

	private static function strip_translatable_content_from_builder_rows( array $rows ): array {
		$out = [];
		foreach ( $rows as $row ) {
			if ( is_array( $row ) ) {
				$out[] = self::strip_translatable_content_from_builder_row( $row );
			}
		}
		return $out;
	}

	private static function strip_module_translatable_content( array $module ): array {
		$mod_name = $module['mod_name'] ?? '';
		if ( isset( $module['mod_settings'] ) && is_array( $module['mod_settings'] ) && $mod_name !== '' ) {
			$module['mod_settings'] = self::strip_mod_settings_translatable_content( $module, $mod_name );
		}
		if ( ! empty( $module['cols'] ) && is_array( $module['cols'] ) ) {
			foreach ( $module['cols'] as $index => $col ) {
				$module['cols'][ $index ] = self::strip_translatable_content_from_builder_col( $col );
			}
		}
		return $module;
	}

	private static function strip_mod_settings_translatable_content( array $module, string $mod_name ): array {
		$out       = $module['mod_settings'];
		$protected = self::get_protected_translatable_field_ids( $module, $mod_name );
		if ( empty( $protected ) ) {
			return $out;
		}

		foreach ( array_keys( $protected ) as $field_id ) {
			if ( str_contains( $field_id, '::' ) ) {
				list( $rep_key, $idx, $sub_key ) = explode( '::', $field_id, 3 );
				if ( isset( $out[ $rep_key ][ $idx ][ $sub_key ] ) ) {
					$out[ $rep_key ][ $idx ][ $sub_key ] = '';
				}
				continue;
			}

			if ( preg_match( '/^(title_accordion|text_accordion|title_tab|text_tab)-(\d+)$/', $field_id, $matches ) ) {
				$sub_key  = $matches[1];
				$index    = (int) $matches[2];
				$rep_key  = str_contains( $sub_key, 'accordion' ) ? 'content_accordion' : 'tab_content_tab';
				if ( isset( $out[ $rep_key ][ $index ][ $sub_key ] ) ) {
					$out[ $rep_key ][ $index ][ $sub_key ] = '';
				}
				continue;
			}

			if ( array_key_exists( $field_id, $out ) ) {
				$out[ $field_id ] = is_array( $out[ $field_id ] ) ? [] : '';
			}
		}

		if ( ! empty( $out['builder_content'] ) && is_array( $out['builder_content'] ) ) {
			$out['builder_content'] = self::strip_translatable_content_from_builder_rows( $out['builder_content'] );
		}

		if ( $mod_name === 'accordion' && ! empty( $out['content_accordion'] ) && is_array( $out['content_accordion'] ) ) {
			foreach ( $out['content_accordion'] as $index => $item ) {
				if ( ! empty( $item['builder_content'] ) && is_array( $item['builder_content'] ) ) {
					$out['content_accordion'][ $index ]['builder_content'] = self::strip_translatable_content_from_builder_rows( $item['builder_content'] );
				}
			}
		}

		if ( $mod_name === 'tab' && ! empty( $out['tab_content_tab'] ) && is_array( $out['tab_content_tab'] ) ) {
			foreach ( $out['tab_content_tab'] as $index => $item ) {
				if ( ! empty( $item['builder_content'] ) && is_array( $item['builder_content'] ) ) {
					$out['tab_content_tab'][ $index ]['builder_content'] = self::strip_translatable_content_from_builder_rows( $item['builder_content'] );
				}
			}
		}

		if ( $mod_name === 'toggle' ) {
			foreach ( [ 'toggle1', 'toggle2' ] as $toggle_key ) {
				if ( ! empty( $out[ $toggle_key ] ) && is_array( $out[ $toggle_key ] ) ) {
					$out[ $toggle_key ] = self::strip_translatable_content_from_builder_rows( $out[ $toggle_key ] );
				}
			}
		}

		foreach ( [ '_tooltip', '_link' ] as $shared_key ) {
			if ( array_key_exists( $shared_key, $out ) ) {
				$out[ $shared_key ] = '';
			}
		}

		return $out;
	}

	private static function strip_shared_styling_text( array $styling ): array {
		$out = $styling;
		foreach ( [ '_tooltip', '_link' ] as $key ) {
			if ( array_key_exists( $key, $out ) ) {
				$out[ $key ] = '';
			}
		}
		return $out;
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

	/* English layout/structure with translated text from the target post (same path as translate_module). */
	private static function merge_wpml_module_settings( array $src_module, array $tgt_module ): array {
		$src_ms = isset( $src_module['mod_settings'] ) && is_array( $src_module['mod_settings'] ) ? $src_module['mod_settings'] : [];
		$tgt_ms = isset( $tgt_module['mod_settings'] ) && is_array( $tgt_module['mod_settings'] ) ? $tgt_module['mod_settings'] : [];

		if ( empty( $src_ms ) ) {
			return $tgt_ms;
		}
		if ( empty( $tgt_ms ) ) {
			return $src_ms;
		}

		$mod_name      = isset( $src_module['mod_name'] ) ? $src_module['mod_name'] : '';
		$module_class  = $mod_name !== '' ? self::get_module( $mod_name ) : null;
		$merged_module = $src_module;
		$merged_module['mod_settings'] = $src_ms;

		if ( $module_class && method_exists( $module_class, 'get_translatable_fields' ) && method_exists( $module_class, 'translate_module' ) ) {
			$translatable  = $module_class::get_translatable_fields( $tgt_module, $module_class );
			$translations  = [];
			foreach ( $translatable as $field ) {
				if ( ! empty( $field['id'] ) && array_key_exists( 'value', $field ) ) {
					$translations[ $field['id'] ] = $field['value'];
				}
			}
			if ( ! empty( $translations ) ) {
				$merged_module = self::prepare_module_for_wpml_translate( $merged_module );
				$merged_module = $module_class::translate_module( $merged_module, $translations );
			}
		}

		$merged = isset( $merged_module['mod_settings'] ) && is_array( $merged_module['mod_settings'] ) ? $merged_module['mod_settings'] : $src_ms;
		$merged = self::merge_nested_module_builder_rows( $merged, $src_ms, $tgt_ms, $mod_name );

		foreach ( [ '_tooltip', '_link' ] as $shared_k ) {
			if ( array_key_exists( $shared_k, $tgt_ms ) ) {
				$merged[ $shared_k ] = $tgt_ms[ $shared_k ];
			}
		}

		return $merged;
	}

	/**
	 * Decode JSON-backed mod_settings before translate_module runs during layout sync.
	 */
	private static function prepare_module_for_wpml_translate( array $module ): array {
		$mod_name = $module['mod_name'] ?? '';
		$ms       = $module['mod_settings'] ?? [];
		if ( $mod_name === 'contact' && ! empty( $ms['field_extra'] ) && is_string( $ms['field_extra'] ) ) {
			$decoded = json_decode( $ms['field_extra'], true );
			if ( is_array( $decoded ) ) {
				$module['mod_settings']['field_extra'] = $decoded;
			}
		}
		return $module;
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

	/**
	 * Apply WPML string translations onto the translation post Builder data (keeps translation element_ids).
	 */
	private static function apply_wpml_translations_to_target_builder_data( array $source, array $target ): array {
		$tgt_map = self::index_builder_components_by_element_id( $target );
		$out     = [];
		foreach ( $source as $index => $src_row ) {
			$tgt_row = self::find_matching_builder_component( $src_row, $target, $index, $tgt_map );
			if ( $tgt_row !== null ) {
				$out[] = self::apply_wpml_translations_to_row( $src_row, $tgt_row );
			} else {
				$out[] = self::recursive_translate_fields( $src_row );
			}
		}
		return $out;
	}

	private static function apply_wpml_translations_to_row( array $src_row, array $tgt_row ): array {
		$out     = $tgt_row;
		$src_eid = $src_row['element_id'] ?? '';
		if ( $src_eid !== '' && ! empty( $out['styling'] ) && is_array( $out['styling'] ) ) {
			$out['styling'] = self::translate_shared_fields( $out['styling'], $src_eid );
		}
		if ( ! empty( $src_row['cols'] ) && is_array( $src_row['cols'] ) ) {
			$out['cols'] = self::apply_wpml_translations_to_cols( $src_row['cols'], isset( $out['cols'] ) && is_array( $out['cols'] ) ? $out['cols'] : [] );
		}
		return $out;
	}

	private static function apply_wpml_translations_to_cols( array $src_cols, array $tgt_cols ): array {
		$tgt_map = self::index_builder_components_by_element_id( $tgt_cols );
		$out     = [];
		foreach ( $src_cols as $index => $src_col ) {
			$tgt_col = self::find_matching_builder_component( $src_col, $tgt_cols, $index, $tgt_map );
			if ( $tgt_col !== null ) {
				$out[] = self::apply_wpml_translations_to_col( $src_col, $tgt_col );
			} else {
				$out[] = self::recursive_translate_fields( $src_col );
			}
		}
		return $out;
	}

	private static function apply_wpml_translations_to_col( array $src_col, array $tgt_col ): array {
		$out     = $tgt_col;
		$src_eid = $src_col['element_id'] ?? '';
		if ( $src_eid !== '' && ! empty( $out['styling'] ) && is_array( $out['styling'] ) ) {
			$out['styling'] = self::translate_shared_fields( $out['styling'], $src_eid );
		}
		if ( ! empty( $src_col['modules'] ) && is_array( $src_col['modules'] ) ) {
			$out['modules'] = self::apply_wpml_translations_to_modules( $src_col['modules'], isset( $out['modules'] ) && is_array( $out['modules'] ) ? $out['modules'] : [] );
		}
		return $out;
	}

	private static function apply_wpml_translations_to_modules( array $src_mods, array $tgt_mods ): array {
		$tgt_map = self::index_builder_components_by_element_id( $tgt_mods );
		$out     = [];
		foreach ( $src_mods as $index => $src_mod ) {
			$tgt_mod = self::find_matching_builder_component( $src_mod, $tgt_mods, $index, $tgt_map );
			if ( $tgt_mod !== null ) {
				$out[] = self::apply_wpml_translations_to_module( $src_mod, $tgt_mod );
			} else {
				$out[] = self::recursive_translate_fields( $src_mod );
			}
		}
		return $out;
	}

	private static function apply_wpml_translations_to_module( array $src_mod, array $tgt_mod ): array {
		$out          = $tgt_mod;
		$src_eid      = $src_mod['element_id'] ?? '';
		$mod_name     = $out['mod_name'] ?? '';
		$translations = ( $src_eid !== '' && isset( self::$translations[ $src_eid ] ) ) ? self::$translations[ $src_eid ] : [];

		if ( $mod_name !== '' && ( ! empty( $translations ) || in_array( $mod_name, [ 'tab', 'accordion', 'toggle' ], true ) ) ) {
			$module = self::get_module( $mod_name );
			if ( $module ) {
				if ( ! empty( $translations ) ) {
					$out = $module::translate_module( $out, $translations );
				}
				if ( ! empty( $out['mod_settings'] ) && is_array( $out['mod_settings'] ) && $src_eid !== '' ) {
					$out['mod_settings'] = self::translate_shared_fields( $out['mod_settings'], $src_eid );
				}
			}
		}

		$out = self::apply_wpml_translations_to_nested_module_settings( $src_mod, $out );

		if ( ! empty( $src_mod['cols'] ) && is_array( $src_mod['cols'] ) ) {
			$out['cols'] = self::apply_wpml_translations_to_cols( $src_mod['cols'], isset( $out['cols'] ) && is_array( $out['cols'] ) ? $out['cols'] : [] );
		}

		return $out;
	}

	private static function apply_wpml_translations_to_nested_module_settings( array $src_mod, array $tgt_mod ): array {
		$src_ms = isset( $src_mod['mod_settings'] ) && is_array( $src_mod['mod_settings'] ) ? $src_mod['mod_settings'] : [];
		$tgt_ms = isset( $tgt_mod['mod_settings'] ) && is_array( $tgt_mod['mod_settings'] ) ? $tgt_mod['mod_settings'] : [];
		if ( empty( $src_ms ) ) {
			return $tgt_mod;
		}

		$mod_name  = $src_mod['mod_name'] ?? '';
		$merged_ms = $tgt_ms;

		if ( ! empty( $src_ms['builder_content'] ) && is_array( $src_ms['builder_content'] ) ) {
			$merged_ms['builder_content'] = self::apply_wpml_translations_to_target_builder_data(
				$src_ms['builder_content'],
				isset( $tgt_ms['builder_content'] ) && is_array( $tgt_ms['builder_content'] ) ? $tgt_ms['builder_content'] : []
			);
		}

		if ( $mod_name === 'accordion' && ! empty( $src_ms['content_accordion'] ) && is_array( $src_ms['content_accordion'] ) ) {
			$merged_ms['content_accordion'] = self::apply_wpml_translations_to_repeater_panels(
				$src_ms['content_accordion'],
				isset( $tgt_ms['content_accordion'] ) && is_array( $tgt_ms['content_accordion'] ) ? $tgt_ms['content_accordion'] : []
			);
		}

		if ( $mod_name === 'tab' && ! empty( $src_ms['tab_content_tab'] ) && is_array( $src_ms['tab_content_tab'] ) ) {
			$merged_ms['tab_content_tab'] = self::apply_wpml_translations_to_repeater_panels(
				$src_ms['tab_content_tab'],
				isset( $tgt_ms['tab_content_tab'] ) && is_array( $tgt_ms['tab_content_tab'] ) ? $tgt_ms['tab_content_tab'] : []
			);
		}

		if ( $mod_name === 'toggle' ) {
			foreach ( [ 'toggle1', 'toggle2' ] as $toggle_key ) {
				if ( ! empty( $src_ms[ $toggle_key ] ) && is_array( $src_ms[ $toggle_key ] ) ) {
					$merged_ms[ $toggle_key ] = self::apply_wpml_translations_to_target_builder_data(
						$src_ms[ $toggle_key ],
						isset( $tgt_ms[ $toggle_key ] ) && is_array( $tgt_ms[ $toggle_key ] ) ? $tgt_ms[ $toggle_key ] : []
					);
				}
			}
		}

		$tgt_mod['mod_settings'] = $merged_ms;
		return $tgt_mod;
	}

	private static function apply_wpml_translations_to_repeater_panels( array $src_items, array $tgt_items ): array {
		$out = $tgt_items;
		foreach ( $src_items as $index => $src_item ) {
			if ( ! isset( $out[ $index ] ) || ! is_array( $out[ $index ] ) ) {
				continue;
			}
			if ( ! empty( $src_item['builder_content'] ) && is_array( $src_item['builder_content'] ) ) {
				$out[ $index ]['builder_content'] = self::apply_wpml_translations_to_target_builder_data(
					$src_item['builder_content'],
					isset( $out[ $index ]['builder_content'] ) && is_array( $out[ $index ]['builder_content'] ) ? $out[ $index ]['builder_content'] : []
				);
			}
		}
		return $out;
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