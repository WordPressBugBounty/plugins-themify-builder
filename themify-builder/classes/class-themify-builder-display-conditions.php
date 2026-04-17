<?php
defined( 'ABSPATH' ) || exit;

if ( class_exists( 'Themify_Builder_Display_Conditions', false ) ) {
    return;
}

final class Themify_Builder_Display_Conditions {

    /** @var bool */ private static $tags_set          = false;
    /** @var bool */ private static $is_404            = false;
    /** @var bool */ private static $is_page           = false;
    /** @var bool */ private static $is_single         = false;
    /** @var bool */ private static $is_singular       = false;
    /** @var bool */ private static $is_archive        = false;
    /** @var bool */ private static $is_home           = false;
    /** @var bool */ private static $is_front_page     = false;
    /** @var bool */ private static $is_category       = false;
    /** @var bool */ private static $is_tag            = false;
    /** @var bool */ private static $is_tax            = false;
    /** @var bool */ private static $is_search         = false;
    /** @var bool */ private static $is_author         = false;
    /** @var bool */ private static $is_post_type_archive = false;
    /** @var bool */ private static $is_date           = false;
    /** @var bool */ private static $is_attachment     = false;

    /** @var mixed */ private static $currentQuery = null;

    /** @var array */ private static $taxonomies = [];

    public static function init(): void {

        add_filter( 'themify_builder_module_display', [ __CLASS__, 'check_element_display' ], 5, 3 );
        add_filter( 'themify_builder_row_display',    [ __CLASS__, 'check_element_display' ], 5, 3 );
        add_filter( 'themify_builder_subrow_display', [ __CLASS__, 'check_element_display' ], 5, 3 );

        add_action( 'template_redirect', [ __CLASS__, 'prime_condition_tags' ], 1 );

        add_filter( 'themify_builder_active_vars', [ __CLASS__, 'add_builder_vars' ] );

        add_action( 'wp_ajax_tb_dc_search', [ __CLASS__, 'ajax_dc_search' ] );
    }

    public static function check_element_display( bool $display, array $element, $builder_id ): bool {

        if ( $display === false ) {
            return false;
        }

        $settings = $element['mod_settings'] ?? $element['styling'] ?? [];

        if ( empty( $settings['display_condition'] ) ) {
            return true;
        }

        $conditions = $settings['display_condition'];
        if ( ! is_array( $conditions ) ) {
            $conditions = json_decode( $conditions, true );
        }
        if ( empty( $conditions ) || ! is_array( $conditions ) ) {
            return true;
        }

        self::prime_condition_tags();

        $includes = [];
        $excludes = [];

        foreach ( $conditions as $c ) {
            if ( ! is_array( $c ) || empty( $c['general'] ) ) {
                continue;
            }
            $type = ( isset( $c['include'] ) && $c['include'] === 'ex' ) ? 'exclude' : 'include';
            if ( $type === 'exclude' ) {
                $excludes[] = $c;
            } else {
                $includes[] = $c;
            }
        }

        if ( empty( $includes ) && ! empty( $excludes ) ) {
            $includes[] = [ 'general' => 'general', 'detail' => 'all' ];
        }

        foreach ( $excludes as $condition ) {
            if ( self::match_condition( $condition ) ) {
                return false;
            }
        }

        foreach ( $includes as $condition ) {
            if ( self::match_condition( $condition ) ) {
                return true;
            }
        }

        return false;
    }

    private static function match_condition( array $condition ): bool {

        $general = $condition['general'] ?? '';
        $detail  = $condition['detail'] ?? 'all';

        if ( $general === 'date_time' ) {
            $datetime = is_array( $detail ) ? ( $detail['datetime'] ?? '' ) : '';
            if ( $datetime === '' ) {
                return false;
            }
            $ts = strtotime( $datetime );
            return $ts !== false && current_time( 'timestamp' ) >= $ts;
        }

        if ( $general === 'login_users' ) {
            return is_user_logged_in();
        }

        if ( $general === 'logout_users' ) {
            return ! is_user_logged_in();
        }

        if ( $general === 'user_roles' ) {
            if ( ! is_user_logged_in() ) {
                return false;
            }
            $roles = [];
            if ( is_array( $detail ) ) {
                if ( isset( $detail['roles'] ) && is_array( $detail['roles'] ) ) {
                    $roles = array_values( array_filter( array_map( 'sanitize_key', $detail['roles'] ) ) );
                } else {
                    $roles = array_values( array_filter( array_map( 'sanitize_key', $detail ) ) );
                }
            }
            if ( empty( $roles ) ) {
                return false;
            }
            $user = wp_get_current_user();
            return $user instanceof WP_User && ! empty( array_intersect( $roles, (array) $user->roles ) );
        }

        if ( $general === 'custom_field' ) {
            $key = is_array( $detail ) ? sanitize_text_field( $detail['key'] ?? '' ) : '';
            if ( $key === '' ) {
                return false;
            }
            $compare = is_array( $detail ) ? sanitize_key( $detail['compare'] ?? 'is_equal' ) : 'is_equal';
            $expected = is_array( $detail ) ? (string) ( $detail['value'] ?? '' ) : '';
            $value = '';
            if ( is_singular() ) {
                $object_id = get_queried_object_id();
                if ( $object_id > 0 ) {
                    $value = get_post_meta( $object_id, $key, true );
                }
            }
            $value = is_scalar( $value ) ? trim( (string) $value ) : '';
            if ( $compare === 'is_empty' ) {
                return $value === '';
            }
            if ( $compare === 'not_empty' ) {
                return $value !== '';
            }
            if ( $compare === 'not_equal' ) {
                return $value !== $expected;
            }
            if ( $compare === 'contain' ) {
                return $expected !== '' && strpos( $value, $expected ) !== false;
            }
            if ( $compare === 'not_contain' ) {
                return $expected === '' || strpos( $value, $expected ) === false;
            }
            if ( $compare === 'greater_than' ) {
                return is_numeric( $value ) && is_numeric( $expected ) && (float) $value > (float) $expected;
            }
            if ( $compare === 'less_than' ) {
                return is_numeric( $value ) && is_numeric( $expected ) && (float) $value < (float) $expected;
            }
            return $value === $expected;
        }

        $view = self::build_view( $condition );
        return ! empty( $view ) && self::is_current_view( $view ) > 0;
    }

    private static function build_view( array $condition ): array {

        $general = $condition['general'] ?? '';
        $detail  = $condition['detail']  ?? 'all';

        if ( empty( $general ) ) {
            return [];
        }

        if ( $detail !== 'all' && is_string( $detail ) ) {
            $detail = array_values( array_filter( array_map( 'strval', explode( ',', $detail ) ) ) );
        }

        if ( $general === 'general' ) {
            return [ 'general' => [ 'all' => 'all' ] ];
        }

        if ( in_array( $general, [ 'page', 'is_front', 'is_404', 'child_of' ], true ) ) {
            return [ 'page' => [ $general => $detail ] ];
        }

        if ( in_array( $general, [ 'product_single', 'product_archive', 'cart', 'checkout', 'cart_full', 'cart_empty', 'shop' ], true ) ) {
            if ( ! function_exists( 'WC' ) ) {
                return [];
            }
            // JS saves cart Full/Empty as general='cart_full' or 'cart_empty'.
            // Map to the same ['cart' => ['full'|'empty' => ...]] structure.
            if ( $general === 'cart_full' ) {
                return [ 'cart' => [ 'full' => $detail ] ];
            }
            if ( $general === 'cart_empty' ) {
                return [ 'cart' => [ 'empty' => $detail ] ];
            }
            // JS saves the WooCommerce shop page as general='shop'.
            // Map to product_archive with the 'shop' key so is_current_view() can
            // call is_shop() on it.
            if ( $general === 'shop' ) {
                return [ 'product_archive' => [ 'shop' => 'all' ] ];
            }
            if ( $general === 'cart' ) {
                $data_key = $condition['query'] ?? 'full';
                return [ 'cart' => [ $data_key => $detail ] ];
            }
            if ( $general === 'checkout' ) {
                return [ 'checkout' => [ 'all' => 'all' ] ];
            }
            if ( $general === 'product_archive' && $detail === 'all' ) {
                return [ 'product_archive' => [ 'all' => 'all' ] ];
            }
            return [ $general => [ $detail === 'all' ? 'all' : $general => $detail ] ];
        }

        if ( in_array( $general, [ 'archive', 'all', 'is_date', 'is_search', 'is_author', 'is_front_archive' ], true ) ) {
            if ( $general === 'all' ) {
                return [ 'single' => [ 'all' => 'all' ] ];
            }
            if ( $general === 'archive' ) {
                return [ 'archive' => [ 'all' => 'all' ] ];
            }
            if ( $general === 'is_front_archive' ) {
                return [ 'archive' => [ 'is_front' => $detail ] ];
            }
            return [ 'archive' => [ $general => $detail ] ];
        }

        if ( strpos( $general, 'all_' ) === 0 ) {
            $pt = substr( $general, 4 );
            if ( post_type_exists( $pt ) ) {
                return [ 'archive' => [ $pt => 'all' ] ];
            }
            return [ 'archive' => [ $general => $detail ] ];
        }

        if ( strpos( $general, 'archive_tax__' ) === 0 ) {
            $taxonomy = substr( $general, 13 );
            if ( isset( self::$taxonomies[ $taxonomy ] ) ) {
                return [ 'archive' => [ $taxonomy => $detail ] ];
            }
        }

        if ( isset( self::$taxonomies[ $general ] ) ) {
            return [ 'single' => [ $general => $detail ] ];
        }

        if ( post_type_exists( $general ) ) {
            $query_ctx = $condition['query'] ?? 'single';
            if ( $query_ctx === 'archive' ) {
                return [ 'archive' => [ $general => $detail ] ];
            }
            return [ 'single' => [ $general => $detail ] ];
        }

        return [ 'single' => [ $general => $detail ] ];
    }

    private static function is_current_view( array $view ): int {

        $q = self::$currentQuery;

        foreach ( $view as $type => $val ) {
            switch ( $type ) {

                case 'general':
                    return 1;

                case 'page':
                    if ( self::$is_page === true || self::$is_404 === true ) {
                        foreach ( $val as $k => $v ) {
                            if ( $k === 'is_404' ) {
                                if ( self::$is_404 === true ) return 2;
                            } elseif ( $k === 'is_front' ) {
                                return self::$is_front_page === true ? 3 : 0;
                            } elseif ( self::$is_page === true ) {
                                if ( $k === 'child_of' ) {
                                    if ( is_object( $q ) && $q->post_parent !== 0 ) {
                                        if ( $v === 'all' ) return 3;
                                        $parents = get_post_ancestors( $q );
                                        foreach ( $parents as $p ) {
                                            $parent = get_post( $p );
                                            if ( $parent && in_array( $parent->post_name, (array) $v, true ) ) {
                                                return 4;
                                            }
                                        }
                                    }
                                } else {
                                    if ( $v === 'all' ) return 3;
                                    if ( is_object( $q ) && in_array( $q->post_name, (array) $v, true ) ) {
                                        return 4;
                                    }
                                }
                            }
                        }
                    }
                    break;

                case 'single':
                    if ( self::$is_singular === true || self::$is_404 === true ) {
                        foreach ( $val as $k => $v ) {
                            if ( $k === 'all' ) return 2;
                            if ( $v === 'all' && post_type_exists( $k ) ) {
                                if ( is_singular( $k ) ) return 3;
                                continue;
                            }
                            if ( self::$is_404 === false ) {
                                if ( isset( self::$taxonomies[ $k ] ) ) {
                                    if ( $v === 'all' && has_term( '', $k ) ) return 3;
                                    if ( $v !== 'all' && is_array( $v ) && has_term( $v, $k ) ) return 4;
                                } elseif ( $k === 'is_attachment' ) {
                                    if ( self::$is_attachment === true ) {
                                        if ( $v === 'all' ) return 3;
                                        if ( is_object( $q ) && in_array( $q->post_name, (array) $v, true ) ) return 4;
                                    }
                                } elseif ( in_array( $k, [ 'page', 'child_of', 'is_front' ], true ) ) {
                                    if ( self::$is_page === true ) {
                                        return self::is_current_view( [ 'page' => $val ] );
                                    }
                                } elseif ( is_singular( $k ) && post_type_exists( $k ) ) {
                                    if ( $v === 'all' ) return 3;
                                    if ( is_object( $q ) && in_array( $q->post_name, (array) $v, true ) ) {
                                        return 4;
                                    }
                                }
                            } elseif ( $k === 'is_404' ) {
                                return 2;
                            }
                        }
                    }
                    break;

                case 'archive':
                    if ( self::$is_archive === true ) {
                        foreach ( $val as $k => $v ) {
                            if ( $k === 'all' ) return 2;
                            if ( $v === 'all' && post_type_exists( $k ) ) {
                                if ( is_post_type_archive( $k ) ) return 3;
                                if ( self::$is_category === true || self::$is_tax === true || self::$is_tag === true ) {
                                    $taxonomies = get_object_taxonomies( $k );
                                    if ( is_object( $q ) && ! empty( $taxonomies ) && in_array( $q->taxonomy, $taxonomies, true ) ) {
                                        return 3;
                                    }
                                }
                            }
                            if ( isset( self::$taxonomies[ $k ] ) ) {
                                if ( self::$is_category === true || self::$is_tax === true || self::$is_tag === true ) {
                                    if ( is_object( $q ) && $k === $q->taxonomy ) {
                                        if ( $v === 'all' ) return 3;
                                        if ( in_array( $q->slug, (array) $v, true ) ) {
                                            return 4;
                                        }
                                    }
                                }
                            } elseif ( $k === 'is_date' || $k === 'is_search' ) {
                                if (
                                    ( $k === 'is_date' && self::$is_date === true ) ||
                                    ( $k === 'is_search' && self::$is_search === true )
                                ) {
                                    return 4;
                                }
                            } elseif ( $k === 'is_author' ) {
                                if ( self::$is_author === true ) {
                                    if ( $v === 'all' ) return 3;
                                    $author = get_user_by( 'slug', get_query_var( 'author_name' ) );
                                    if ( ! empty( $author ) && in_array( $author->ID, (array) $v, true ) ) {
                                        return 4;
                                    }
                                }
                            } elseif ( $k === 'is_front' && is_home() ) {
                                return 3;
                            }
                        }
                    }
                    break;

                case 'product_single':
                    if (
                        self::$is_singular === true &&
                        function_exists( 'WC' ) && is_product()
                    ) {
                        foreach ( $val as $k => $v ) {
                            if ( $v === 'all' ) return 3;
                            if ( isset( self::$taxonomies[ $k ] ) ) {
                                if ( is_array( $v ) && has_term( $v, $k ) ) return 4;
                            } elseif (
                                is_object( $q ) && in_array( $q->post_name, (array) $v, true )
                            ) {
                                return 4;
                            }
                        }
                    }
                    break;

                case 'product_archive':
                    if (
                        self::$is_archive === true &&
                        function_exists( 'WC' ) &&
                        function_exists( 'is_shop' ) &&
                        ( is_shop() || is_product_category() || is_product_tag() || is_tax( get_object_taxonomies( 'product' ) ) )
                    ) {
                        foreach ( $val as $k => $v ) {
                            if ( ( $k === 'all' || $k === 'product' ) && $v === 'all' ) return 1;
                            if ( $k === 'shop' && function_exists( 'is_shop' ) && is_shop() ) return 2;
                            if ( isset( self::$taxonomies[ $k ] ) ) {
                                if ( $v === 'all' && is_tax( $k ) ) return 3;
                                if ( is_tax( $k, (array) $v ) ) return 4;
                            }
                        }
                    }
                    break;

                case 'cart':
                    if ( function_exists( 'WC' ) && function_exists( 'is_cart' ) && is_cart() ) {
                        $cart_count = WC()->cart ? count( WC()->cart->get_cart() ) : 0;
                        if (
                            ( $cart_count > 0 && ! isset( $val['empty'] ) ) ||
                            ( $cart_count === 0 && isset( $val['empty'] ) )
                        ) {
                            return 5;
                        }
                    }
                    break;

                case 'checkout':
                    if ( function_exists( 'WC' ) && function_exists( 'is_checkout' ) && is_checkout() ) {
                        return 5;
                    }
                    break;
            }
        }

        return 0;
    }

    public static function prime_condition_tags(): void {
        if ( self::$tags_set ) return;
        self::$tags_set = true;

        self::$is_404 = is_404();

        if ( self::$is_404 === false ) {
            self::$is_page       = is_page();
            self::$is_attachment = self::$is_page === false && is_attachment();
            self::$is_single     = self::$is_page === false && self::$is_attachment === false && is_single();
            self::$is_singular   = self::$is_page === true  || self::$is_attachment === true || self::$is_single === true;

            if ( self::$is_singular === false ) {
                self::$is_home              = is_home();
                self::$is_category          = self::$is_home === false && is_category();
                self::$is_tag               = self::$is_home === false && self::$is_category === false && is_tag();
                self::$is_tax               = self::$is_home === false && self::$is_category === false && self::$is_tag === false && is_tax();
                self::$is_search            = self::$is_home === false && self::$is_category === false && self::$is_tag === false && self::$is_tax === false && is_search();
                self::$is_author            = self::$is_search === false && is_author();
                self::$is_post_type_archive = self::$is_author === false && is_post_type_archive();
                self::$is_date              = self::$is_post_type_archive === false && is_date();
                self::$is_archive           = self::$is_category || self::$is_tag || self::$is_tax ||
                                              self::$is_home || self::$is_author || self::$is_date ||
                                              self::$is_search || self::$is_post_type_archive || is_archive();
            } else {
                self::$is_front_page = self::$is_page === true && is_front_page();
            }
        }

        self::$currentQuery = get_queried_object();

        foreach ( get_taxonomies( [ 'public' => true ], 'objects' ) as $slug => $tax ) {
            self::$taxonomies[ $slug ] = true;
        }
    }

    public static function add_builder_vars( array $vars ): array {

        if ( isset( $vars['tbp_dc_options'] ) ) {
            return $vars;
        }

        $post_types = Themify_Builder_Model::get_public_post_types( false );
        unset( $post_types['page'] );

        $single_tax  = [];
        $archive_tax = [];

        foreach ( $post_types as $slug => $label ) {
            $pto = get_post_type_object( $slug );
            if ( ! $pto ) continue;

            $single_tax[ $slug ] = [
                'label'   => $pto->labels->singular_name,
                'id'      => $slug,
                'options' => [ $slug => $pto->labels->singular_name ],
            ];

            if ( $slug === 'post' || $pto->has_archive ) {
                $archive_tax[ $slug ] = [
                    'label'   => $pto->labels->name,
                    'id'      => $slug,
                    'options' => [ 'all_' . $slug => sprintf( __( 'All %s Archives', 'themify' ), $label ) ],
                ];
            }

            $taxes = wp_filter_object_list(
                get_object_taxonomies( $slug, 'objects' ),
                [ 'public' => true, 'show_in_nav_menus' => true ]
            );
            foreach ( $taxes as $tax_slug => $tax_obj ) {
                $tax_label = $tax_obj->labels->singular_name;
                if ( $slug === 'product' ) {
                    if ( $tax_slug === 'product_cat' ) {
                        $tax_label = __( 'Product Category', 'themify' );
                    } elseif ( $tax_slug === 'product_tag' ) {
                        $tax_label = __( 'Product Tag', 'themify' );
                    } elseif ( $tax_slug === 'product_brand' || $tax_slug === 'brand' ) {
                        $tax_label = __( 'Brand', 'themify' );
                    }
                }
                $single_tax[ $slug ]['options'][ $tax_slug ]  = sprintf( __( 'In %s', 'themify' ), $tax_label );
                if ( $slug === 'post' || $pto->has_archive ) {
                    $archive_tax[ $slug ]['options'][ $tax_slug ] = $tax_obj->label;
                }
            }
        }

        $roles = [];
        global $wp_roles;
        if ( isset( $wp_roles->roles ) && is_array( $wp_roles->roles ) ) {
            foreach ( $wp_roles->roles as $role_id => $role ) {
                $roles[] = [
                    'id' => $role_id,
                    'label' => translate_user_role( $role['name'] ),
                ];
            }
        }

        $vars['tb_dc'] = [
            'single_tax'     => array_values( $single_tax ),
            'archive_tax'    => array_values( $archive_tax ),
            'has_wc'         => function_exists( 'WC' ),
            'show_on_front'  => get_option( 'show_on_front', 'page' ),
            'roles'          => $roles,
        ];

        return $vars;
    }

    public static function ajax_dc_search(): void {
        check_ajax_referer( 'tf_nonce', 'nonce' );

        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_send_json_error( 'forbidden' );
        }

        $type    = isset( $_POST['dc_type'] )  ? sanitize_key( $_POST['dc_type'] )         : '';
        $search  = isset( $_POST['s'] )         ? sanitize_text_field( $_POST['s'] )         : '';
        $paged   = isset( $_POST['paged'] )     ? max( 1, (int) $_POST['paged'] )            : 1;
        $limit    = 20;
        $selected = isset( $_POST['selected'] ) ? (array) $_POST['selected'] : [];
        $selected = array_values( array_filter( array_map( 'sanitize_text_field', $selected ) ) );
        $results  = [];
        $more     = false;

        if ( $type === 'term' ) {
            $taxonomy = isset( $_POST['taxonomy'] ) ? sanitize_key( $_POST['taxonomy'] ) : '';
            if ( ! taxonomy_exists( $taxonomy ) ) {
                wp_send_json_error( 'invalid taxonomy' );
            }

            if ( ! empty( $selected ) ) {
                foreach ( $selected as $sel ) {
                    $term = get_term_by( 'slug', $sel, $taxonomy );
                    if ( $term && ! is_wp_error( $term ) ) {
                        $results[] = [ 'id' => (string) $term->term_id, 'value' => (string) $term->slug, 'text' => $term->name ];
                    }
                }
                wp_send_json_success( [ 'items' => $results, 'more' => false ] );
            }

            $args  = [
                'taxonomy'   => $taxonomy,
                'hide_empty' => false,
                'number'     => $limit + 1,
                'offset'     => ( $paged - 1 ) * $limit,
                'orderby'    => 'name',
                'order'      => 'ASC',
            ];
            if ( $search !== '' ) {
                $args['search'] = $search;
            }
            $terms = get_terms( $args );
            if ( ! is_wp_error( $terms ) ) {
                $more = count( $terms ) > $limit;
                foreach ( array_slice( $terms, 0, $limit ) as $term ) {
                    $results[] = [ 'id' => (string) $term->term_id, 'value' => (string) $term->slug, 'text' => $term->name ];
                }
            }
        } else {
            $post_type = isset( $_POST['post_type'] ) ? sanitize_key( $_POST['post_type'] ) : 'post';
            if ( ! post_type_exists( $post_type ) ) {
                wp_send_json_error( 'invalid post type' );
            }

            if ( ! empty( $selected ) ) {
                foreach ( $selected as $sel ) {
                    $post = get_page_by_path( $sel, OBJECT, $post_type );
                    if ( $post && $post->post_type === $post_type ) {
                        $results[] = [ 'id' => (string) $post->ID, 'value' => (string) $post->post_name, 'text' => get_the_title( $post->ID ) ?: $post->post_name ];
                    }
                }
                wp_send_json_success( [ 'items' => $results, 'more' => false ] );
            }

            $args = [
                'post_type'              => $post_type,
                'post_status'            => 'publish',
                'posts_per_page'         => $limit + 1,
                'paged'                  => $paged,
                'orderby'                => 'title',
                'order'                  => 'ASC',
                'ignore_sticky_posts'    => true,
                'update_post_meta_cache' => false,
                'update_post_term_cache' => false,
                'fields'                 => 'ids',
            ];
            if ( $search !== '' ) {
                $args['s'] = $search;
            }

            $query = new WP_Query( $args );
            $ids   = $query->posts;
            $more  = count( $ids ) > $limit;

            foreach ( array_slice( $ids, 0, $limit ) as $id ) {
                $results[] = [ 'id' => (string) $id, 'value' => (string) get_post_field( 'post_name', $id ), 'text' => get_the_title( $id ) ?: get_post_field( 'post_name', $id ) ];
            }
        }

        wp_send_json_success( [ 'items' => $results, 'more' => $more ] );
    }

}