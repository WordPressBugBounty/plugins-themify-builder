<?php
/**
 * Themify Compatibility Code
 *
 * @package Themify
 */

/**
 * Customer Reviews for WooCommerce
 * @link https://wordpress.org/plugins/customer-reviews-woocommerce/
 */
class Themify_Compat_wcCustomerReviews {

    static function init() {
        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'wp_enqueue_scripts' ], 1000 );
    }

    static function wp_enqueue_scripts() {
        wp_enqueue_script('photoswipe');
        wp_enqueue_script('photoswipe-ui-default');
        wp_enqueue_style('photoswipe');
        wp_enqueue_style('photoswipe-default-skin');
    }
}