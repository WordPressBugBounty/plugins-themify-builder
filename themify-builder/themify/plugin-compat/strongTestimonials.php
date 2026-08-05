<?php
/**
 * Themify Compatibility Code
 *
 * @package Themify
 */

/**
 * Strong Testimonials
 *
 * @link https://strongtestimonials.com/
 *
 * Ultra (and other Themify themes) can interfere with Strong Testimonials'
 * secondary WP_Query so only get_option( 'posts_per_page' ) items show
 * (often 6). Force nopaging / posts_per_page when the View quantity is "all".
 */
class Themify_Compat_strongTestimonials {

	public static function init(): void {
		add_filter( 'wpmtst_query_args', array( __CLASS__, 'query_args' ), 9999, 2 );
		add_filter( 'themify_defer_js_exclude', array( __CLASS__, 'defer_js_exclude' ) );
	}

	/**
	 * Keep Strong Testimonials queries from inheriting the theme/Reading posts_per_page limit.
	 *
	 * @param array $args Query args.
	 * @param array $atts View attributes.
	 * @return array
	 */
	public static function query_args( $args, $atts = array() ): array {
		$count = isset( $atts['count'] ) ? (int) $atts['count'] : -1;

		if ( $count < 1 ) {
			$args['posts_per_page'] = -1;
			$args['nopaging']       = true;
		} else {
			$args['posts_per_page'] = $count;
		}

		return $args;
	}

	/**
	 * Do not defer Strong Testimonials scripts (pager / controller need reliable load order with deferred jQuery).
	 *
	 * @param array $exclude Script handles.
	 * @return array
	 */
	public static function defer_js_exclude( $exclude ): array {
		$exclude[] = 'wpmtst-controller';
		$exclude[] = 'wpmtst-pager';
		$exclude[] = 'wpmtst-slider';
		$exclude[] = 'wpmtst-form';

		return $exclude;
	}
}
