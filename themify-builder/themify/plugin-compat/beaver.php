<?php
/**
 * Themify Compatibility Code
 *
 * @package Themify
 */

/**
 * Beaver Builder
 */
class Themify_Compat_Beaver {

    static function init() {
        add_action( 'wp', [ __CLASS__, 'wp' ] );
    }

    /**
     * Fix double content in Beaver Builder live edit screen
     */
    public static function wp() {
        if ( FLBuilderModel::is_builder_active() ) {
            remove_filter( 'style_loader_tag', [ 'Themify_Enqueue_Assets', 'style_header_tag' ], 10 );
        }
    }
}