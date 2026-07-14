<?php
defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'Themify_Builder_Style_Variables', false ) ) :

    /**
     * Registers Builder preset colors as style variables.
     */
    final class Themify_Builder_Style_Variables {

        public static function init(): void {
            if ( ! class_exists( 'TF_SV_Framework', false ) ) {
                return;
            }
            add_filter( 'tf_sv_theme_vars', [ __CLASS__, 'register_preset_colors' ] );
            add_action( 'wp_head', [ __CLASS__, 'print_preset_root_css' ], 2 );
            add_action( 'admin_head', [ __CLASS__, 'print_preset_root_css' ], 2 );
        }

        public static function get_preset_root_css(): string {
            $rules = '';
            foreach ( self::get_preset_colors() as $color ) {
                if ( empty( $color['name'] ) || empty( $color['value'] ) ) {
                    continue;
                }
                $rules .= '--' . $color['name'] . ':' . $color['value'] . ';';
            }
            return '' !== $rules ? ':root{' . $rules . '}' : '';
        }

        public static function print_preset_root_css(): void {
            $css = self::get_preset_root_css();
            if ( '' === $css ) {
                return;
            }
            echo '<style id="tb-preset-colors">' . $css . '</style>' . PHP_EOL;
        }

        public static function get_preset_colors(): array {
            return [
                [ 'name' => 'blue', 'type' => 'color', 'value' => '#4d7de1' ],
                [ 'name' => 'brown', 'type' => 'color', 'value' => '#a35004' ],
                [ 'name' => 'gray', 'type' => 'color', 'value' => '#989797' ],
                [ 'name' => 'green', 'type' => 'color', 'value' => '#4aab10' ],
                [ 'name' => 'light-blue', 'type' => 'color', 'value' => '#bdd9fd' ],
                [ 'name' => 'light-green', 'type' => 'color', 'value' => '#9bd611' ],
                [ 'name' => 'light-purple', 'type' => 'color', 'value' => '#c1bafd' ],
                [ 'name' => 'orange', 'type' => 'color', 'value' => '#ff9600' ],
                [ 'name' => 'pink', 'type' => 'color', 'value' => '#feb4e4' ],
                [ 'name' => 'purple', 'type' => 'color', 'value' => '#7a6bf8' ],
                [ 'name' => 'red', 'type' => 'color', 'value' => '#e8311f' ],
                [ 'name' => 'yellow', 'type' => 'color', 'value' => '#fff06c' ],
            ];
        }

        public static function register_preset_colors( array $vars ): array {
            $existing = [];
            foreach ( $vars as $item ) {
                if ( ! empty( $item['name'] ) ) {
                    $existing[ $item['name'] ] = true;
                }
            }
            foreach ( self::get_preset_colors() as $color ) {
                if ( empty( $existing[ $color['name'] ] ) ) {
                    $vars[] = $color;
                }
            }
            return $vars;
        }
    }

endif;
