<?php
/**
 * Generate reports of various system variables and configs, useful for debugging.
 * This only available to administrators.
 *
 * @package Themify
 */
class Themify_System_Status {

    /**
     * User meta keys (boolean) for non-critical admin notices: "do not show again".
     */
    const USER_META_DISMISS_MIV  = 'tf_status_dismiss_miv';
    const USER_META_DISMISS_PHP8 = 'tf_status_dismiss_php82';

    public static function init() {
        add_action( 'admin_init', array( __CLASS__, 'handle_optional_notice_dismiss' ) );
        add_action( 'admin_menu', array( __CLASS__, 'admin_menu' ) );
        add_action( 'admin_notices', array( __CLASS__, 'uploads_not_writable_admin_notice' ), 5 );
        add_action( 'admin_notices', array( __CLASS__, 'critical_requirements_admin_notice' ), 6 );
        add_action( 'admin_notices', array( __CLASS__, 'low_memory_admin_notice' ), 7 );
        add_action( 'admin_notices', array( __CLASS__, 'max_input_vars_admin_notice' ), 8 );
        add_action( 'admin_notices', array( __CLASS__, 'php_version_recommendation_admin_notice' ), 9 );
        add_action( 'admin_head', array( __CLASS__, 'print_status_table_styles' ) );
    }

    /**
     * Permanently hide optional notices per user.
     */
    public static function handle_optional_notice_dismiss() {
        if ( ! is_admin() || ! isset( $_GET['tf_status_dismiss'], $_GET['_wpnonce'] ) || ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $key = sanitize_key( wp_unslash( $_GET['tf_status_dismiss'] ) );
        $map = array(
            'miv'  => self::USER_META_DISMISS_MIV,
            'php82' => self::USER_META_DISMISS_PHP8,
        );
        if ( ! isset( $map[ $key ] ) ) {
            return;
        }
        $action = 'tf_status_dismiss_' . $key;
        if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), $action ) ) {
            return;
        }
        update_user_meta( get_current_user_id(), $map[ $key ], '1' );
        $redirect = wp_get_referer();
        if ( ! $redirect ) {
            $redirect = admin_url();
        }
        $redirect = remove_query_arg( array( 'tf_status_dismiss', '_wpnonce' ), $redirect );
        wp_safe_redirect( $redirect );
        exit;
    }

    /**
     * @param string $meta_key self::USER_META_* constant.
     */
    private static function is_optional_notice_dismissed( $meta_key ) {
        return (string) get_user_meta( get_current_user_id(), $meta_key, true ) === '1';
    }

    /**
     * @param string $dismiss_key 'miv' or 'php82'.
     */
    private static function optional_notice_dismiss_url( $dismiss_key ) {
        $url = add_query_arg(
            'tf_status_dismiss',
            $dismiss_key,
            self_admin_url( 'index.php' )
        );
        return wp_nonce_url( $url, 'tf_status_dismiss_' . $dismiss_key );
    }

    /**
     * Neither fsockopen nor cURL — HTTP to external services may fail (same check as System Status).
     */
    public static function is_fsockopen_and_curl_unavailable() {
        return ! ( function_exists( 'fsockopen' ) || function_exists( 'curl_init' ) );
    }

    /**
     * No WP image editor (GD / Imagick) available.
     */
    public static function is_wp_image_editor_unavailable() {
        if ( ! function_exists( '_wp_image_editor_choose' ) && defined( 'ABSPATH' ) ) {
            $media = ABSPATH . 'wp-includes/media.php';
            if ( is_readable( $media ) ) {
                require_once $media;
            }
        }
        if ( ! function_exists( '_wp_image_editor_choose' ) ) {
            return true;
        }
        return empty( _wp_image_editor_choose() );
    }

    /**
     * TF storage table could not be created (same check as "Custom Tables Allowed" on System Status).
     */
    public static function is_themify_custom_tables_unavailable() {
        if ( ! class_exists( 'Themify_Storage', false ) ) {
            return true;
        }
        return Themify_Storage::init() === false;
    }

    /**
     * @return bool True when max_input_vars is set and below 1000 (WordPress / large forms often need 1000+).
     */
    public static function is_max_input_vars_low() {
        if ( ! function_exists( 'ini_get' ) ) {
            return false;
        }
        $v = (int) ini_get( 'max_input_vars' );
        return $v > 0 && $v < 1000;
    }

    /**
     * @return bool True when PHP is below 8.2 (Themify recommends 8.2+; same as System Status notice).
     */
    public static function is_php_below_82() {
        return version_compare( PHP_VERSION, '8.2', '<' );
    }

    public static function critical_requirements_admin_notice() {
        if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $items = array();
        if ( self::is_themify_custom_tables_unavailable() ) {
            $items[] = esc_html__( 'The theme could not create its custom database table (caching and some features that depend on it may not work).', 'themify' );
        }
        if ( self::is_fsockopen_and_curl_unavailable() ) {
            $items[] = esc_html__( 'Neither fsockopen nor cURL is available, so the site may not be able to connect to external services.', 'themify' );
        }
        if ( self::is_wp_image_editor_unavailable() ) {
            $items[] = esc_html__( 'No image processing library (such as GD or Imagick) is available, so image editing and thumbnail generation can fail.', 'themify' );
        }
        if ( empty( $items ) ) {
            return;
        }
        $url   = admin_url( 'admin.php?page=tf-status' );
        $link  = '<a href="' . esc_url( $url ) . '">' . esc_html__( 'System Status', 'themify' ) . '</a>';
        $intro = esc_html__( 'Themify: your server is missing one or more critical requirements.', 'themify' );
        ?>
        <div class="notice notice-error"><p><strong><?php echo esc_html( $intro ); ?></strong></p>
        <ul style="margin:0 0 0 1.25em;list-style:disc;padding-left:1em">
            <?php
            foreach ( $items as $text ) {
                echo '<li>' . $text . '</li>';
            }
            ?>
        </ul>
        <p>
            <?php
            echo wp_kses(
                /* translators: %s: "System Status" page link. */
                sprintf( __( 'View %s for full details and next steps.', 'themify' ), $link ),
                array( 'a' => array( 'href' => array() ) )
            );
            ?>
        </p></div>
        <?php
    }

    public static function max_input_vars_admin_notice() {
        if ( ! is_admin() || ! current_user_can( 'manage_options' ) || ! self::is_max_input_vars_low() || self::is_optional_notice_dismissed( self::USER_META_DISMISS_MIV ) ) {
            return;
        }
        $url  = admin_url( 'admin.php?page=tf-status' );
        $link = '<a href="' . esc_url( $url ) . '">' . esc_html__( 'System Status', 'themify' ) . '</a>';
        ?>
        <div class="notice notice-warning"><p>
            <?php
            echo wp_kses(
                /* translators: %s: "System Status" page link. */
                sprintf( __( 'Themify: PHP <code>max_input_vars</code> is low (%1$d). Large pages or the Builder can fail to save. Increase it (often to 2000 or more) in your PHP configuration, or see %2$s for context.', 'themify' ), (int) ini_get( 'max_input_vars' ), $link ),
                array( 'a' => array( 'href' => array() ), 'code' => array() )
            );
            ?>
        </p>
        <p class="tf-status-notice-dismiss">
            <a href="<?php echo esc_url( self::optional_notice_dismiss_url( 'miv' ) ); ?>"><?php esc_html_e( 'Dismiss (do not show again)', 'themify' ); ?></a>
        </p>
        </div>
        <?php
    }

    public static function php_version_recommendation_admin_notice() {
        if ( ! is_admin() || ! current_user_can( 'manage_options' ) || ! self::is_php_below_82() || self::is_optional_notice_dismissed( self::USER_META_DISMISS_PHP8 ) ) {
            return;
        }
        $url  = admin_url( 'admin.php?page=tf-status' );
        $link = '<a href="' . esc_url( $url ) . '">' . esc_html__( 'System Status', 'themify' ) . '</a>';
        ?>
        <div class="notice notice-warning"><p>
            <?php
            echo wp_kses(
                /* translators: 1: current PHP version, 2: "System Status" page link. */
                sprintf( __( 'Themify: this site is running PHP %1$s. We recommend PHP 8.2 or higher for better performance and security. See your host or %2$s for details.', 'themify' ), esc_html( PHP_VERSION ), $link ),
                array( 'a' => array( 'href' => array() ) )
            );
            ?>
        </p>
        <p class="tf-status-notice-dismiss">
            <a href="<?php echo esc_url( self::optional_notice_dismiss_url( 'php82' ) ); ?>"><?php esc_html_e( 'Dismiss (do not show again)', 'themify' ); ?></a>
        </p>
        </div>
        <?php
    }

    /**
     * Same check as the "Concate CSS folder" row: generated CSS (concat/customizer) is stored under wp-content/uploads.
     *
     * @return bool True when the active Themify concate path is not writable (styling file generation can fail).
     */
    public static function is_themify_concat_css_dir_unwritable() {
        if ( ! class_exists( 'Themify_Enqueue_Assets', false ) || ! class_exists( 'Themify_Filesystem', false ) ) {
            return false;
        }
        $dir = Themify_Enqueue_Assets::getCurrentVersionFolder();
        return ! Themify_Filesystem::is_writable( $dir );
    }

    public static function uploads_not_writable_admin_notice() {
        if ( ! is_admin() || ! current_user_can( 'manage_options' ) || ! self::is_themify_concat_css_dir_unwritable() ) {
            return;
        }
        $url = admin_url( 'admin.php?page=tf-status' );
        ?>
        <div class="notice notice-error"><p>
            <?php
            $link = '<a href="' . esc_url( $url ) . '">' . esc_html__( 'System Status', 'themify' ) . '</a>';
            echo wp_kses(
                /* translators: %s: "System Status" link. */
                sprintf( __( 'Themify: the "uploads" folder is not write-able (the theme might not able to generate the styling). View %s for more details.', 'themify' ), $link ),
                array( 'a' => array( 'href' => array() ) )
            );
            ?>
        </p></div>
        <?php
    }

    /**
     * @return bool True when WP_MEMORY_LIMIT is below 128MB.
     */
    private static function is_wp_memory_limit_low() {
        if ( ! defined( 'WP_MEMORY_LIMIT' ) ) {
            return false;
        }
        $bytes = wp_convert_hr_to_bytes( WP_MEMORY_LIMIT );
        return $bytes < 128 * MB_IN_BYTES;
    }

    public static function low_memory_admin_notice() {
        if ( ! is_admin() || ! current_user_can( 'manage_options' ) || ! self::is_wp_memory_limit_low() ) {
            return;
        }
        $url = admin_url( 'admin.php?page=tf-status' );
        ?>
        <div class="notice notice-warning"><p>
            <?php
            $link = '<a href="' . esc_url( $url ) . '">' . esc_html__( 'System Status', 'themify' ) . '</a>';
            echo wp_kses(
                /* translators: %s: "System Status" link to the Themify status page. */
                sprintf( __( 'Themify: Your WordPress PHP memory is very low. View %s for more details.', 'themify' ), $link ),
                array( 'a' => array( 'href' => array() ) )
            );
            ?>
        </p></div>
        <?php
    }

    /**
     * Error styling for System Status (eg. mark.error, low memory line).
     */
    public static function print_status_table_styles() {
        if ( ! is_admin() || ! isset( $_GET['page'] ) || 'tf-status' !== $_GET['page'] || ! current_user_can( 'manage_options' ) ) {
            return;
        }
        ?>
        <style id="tf-status-table-ui">
        .tf_status_table th[scope="row"] { vertical-align: top; }
        .tf_status_table mark.error { background: transparent; color: #b32d2e; font-weight: 600; padding: 0; }
        .tf_status_table mark.error .dashicons { color: #b32d2e; }
        .tf_status_table .tf_status-wp-memory-bad { color: #b32d2e; font-weight: 600; }
        .tf_status_table .tf_status-wp-memory-bad strong { color: #b32d2e; }
        .tf_status_table td br + mark.error { display: block; margin-top: 6px; }
        </style>
        <?php
    }

    public static function admin_menu() {
        $parent = is_plugin_active( 'themify-builder/themify-builder.php' ) ? 'themify-builder' : 'themify';
        add_submenu_page ( $parent, __( 'System Status', 'themify' ), __( 'System Status', 'themify' ), 'manage_options', 'tf-status', array( __CLASS__, 'admin' ) );
    }

    private static function extract_ip_from_string( $value ) {
        $value = trim( (string) $value );
        if ( $value === '' ) {
            return '';
        }

        if ( strpos( $value, ',' ) !== false ) {
            $parts = explode( ',', $value );
            foreach ( $parts as $part ) {
                $ip = self::extract_ip_from_string( $part );
                if ( $ip !== '' ) {
                    return $ip;
                }
            }
            return '';
        }

        if ( preg_match( '/^\[([0-9a-fA-F:\.]+)\](?::\d+)?$/', $value, $matches ) ) {
            $value = $matches[1];
        } elseif ( preg_match( '/^((?:\d{1,3}\.){3}\d{1,3})(?::\d+)?$/', $value, $matches ) ) {
            $value = $matches[1];
        }

        return filter_var( $value, FILTER_VALIDATE_IP ) ? $value : '';
    }

    private static function resolve_hostname_ip( $hostname ) {
        if ( ! is_string( $hostname ) ) {
            return '';
        }

        $hostname = trim( $hostname );
        if ( $hostname === '' ) {
            return '';
        }

        if ( function_exists( 'dns_get_record' ) ) {
            $records = @dns_get_record( $hostname, DNS_AAAA );
            if ( is_array( $records ) ) {
                foreach ( $records as $record ) {
                    if ( ! empty( $record['ipv6'] ) ) {
                        $ip = self::extract_ip_from_string( $record['ipv6'] );
                        if ( $ip !== '' ) {
                            return $ip;
                        }
                    }
                }
            }

            $records = @dns_get_record( $hostname, DNS_A );
            if ( is_array( $records ) ) {
                foreach ( $records as $record ) {
                    if ( ! empty( $record['ip'] ) ) {
                        $ip = self::extract_ip_from_string( $record['ip'] );
                        if ( $ip !== '' ) {
                            return $ip;
                        }
                    }
                }
            }
        }

        $resolved = @gethostbyname( $hostname );
        $ip = self::extract_ip_from_string( $resolved );
        return $ip !== '' ? $ip : '';
    }

    private static function get_server_ip() {
        $candidates = array(
            'SERVER_ADDR',
            'LOCAL_ADDR',
            'SERVER_IP',
        );

        foreach ( $candidates as $key ) {
            if ( isset( $_SERVER[ $key ] ) && is_string( $_SERVER[ $key ] ) ) {
                $ip = self::extract_ip_from_string( $_SERVER[ $key ] );
                if ( $ip !== '' ) {
                    return $ip;
                }
            }
        }

        $hostnames = array();
        if ( isset( $_SERVER['SERVER_NAME'] ) && is_string( $_SERVER['SERVER_NAME'] ) ) {
            $hostnames[] = wp_unslash( $_SERVER['SERVER_NAME'] );
        }
        if ( function_exists( 'gethostname' ) ) {
            $hostname = gethostname();
            if ( is_string( $hostname ) && $hostname !== '' ) {
                $hostnames[] = $hostname;
            }
        }

        $hostnames = array_unique( array_filter( array_map( 'trim', $hostnames ) ) );
        foreach ( $hostnames as $hostname ) {
            $ip = self::resolve_hostname_ip( $hostname );
            if ( $ip !== '' ) {
                return $ip;
            }
        }

        return '';
    }

    public static function admin() {
        global $wpdb;
        $server_info = isset( $_SERVER['SERVER_SOFTWARE'] ) ? self::sanitize_deep( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) ) : '';
        $r=false;
        foreach(array('/etc/lsb-release','/etc/os-release','/etc/redhat-release') as $dist){
            if(@is_readable($dist)){
                            $r=@parse_ini_file($dist);
                            break;
            }
        }
        $tables=array(
            $wpdb->posts,
            $wpdb->postmeta,
            $wpdb->options,
            $wpdb->terms,
            $wpdb->term_taxonomy,
            $wpdb->term_relationships
        );
        
        ?>
<div class="wrap">
    <h1><?php _e( 'System Status', 'themify' ); ?></h1>
    <table class="tf_status_table widefat" cellspacing="0">
        <thead>
            <tr>
                <td colspan="3"><h2><?php esc_html_e( 'Server environment', 'themify' ); ?></h2></td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row"><?php esc_html_e( 'OS', 'themify' ); ?>:</th>
                <td>
                    <?php
                    if ( is_array( $r ) && ( isset( $r['PRETTY_NAME'] ) || isset( $r['NAME'] ) ) ) {
                        if ( isset( $r['PRETTY_NAME'] ) ) {
                            echo $r['PRETTY_NAME'];
                        } else {
                            echo $r['NAME'];
                        }
                    } elseif ( function_exists( 'php_uname' ) ) {
                        echo php_uname('s');
                    } else {
                        echo '<span class="dashicons dashicons-warning"></span>', __( 'Cannot be determined.', 'themify' );
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Server info', 'themify' ); ?>:</th>
                <td>
                    <?php
                    $server_ip = self::get_server_ip();
                    echo esc_html( $server_info );
                    ?>
                    <br>
                    <strong><?php esc_html_e( 'Server IP', 'themify' ); ?></strong>: <?php echo esc_html( $server_ip !== '' ? $server_ip : __( 'Unknown', 'themify' ) ); ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'PHP version', 'themify' ); ?>:</th>
                <td>
                    <?php
                    echo esc_html( PHP_VERSION );
                    if ( self::is_php_below_82() ) {
                        echo ' <span class="dashicons dashicons-warning"></span> ' . esc_html__( 'We recommend using PHP version 8.2 or above for greater performance and security. Please contact your web hosting provider.', 'themify' );
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'HTTPS (site address)', 'themify' ); ?>:</th>
                <td>
                    <?php
                    $tf_home = (string) get_option( 'home' );
                    if ( $tf_home !== '' && strpos( $tf_home, 'https://' ) === 0 ) {
                        echo '<span class="dashicons dashicons-yes"></span> ';
                    } else {
                        echo '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . esc_html__( 'Use a full https:// site URL in Settings → General when your site is served over SSL. Plain http or relative URLs can cause mixed-content and asset issues.', 'themify' ) . '</mark><br>';
                    }
                    echo esc_html( $tf_home !== '' ? $tf_home : __( '(not set)', 'themify' ) );
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'WordPress Version', 'themify' ); ?>:</th>
                <td>
                    <?php
                    global $wp_version;
                    echo $wp_version;
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Database', 'themify' ); ?>:</th>
                <td><?php echo $wpdb->db_server_info(); ?></td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Debug Mode', 'themify' ); ?>:</th>
                <td><?php echo ( defined( 'WP_DEBUG' ) && WP_DEBUG ) ? __( 'Enabled', 'themify' ) : __( 'Disabled', 'themify' ); ?></td>
            </tr>
            <?php if ( function_exists( 'ini_get' ) ) : ?>
                <tr>
                    <th scope="row"><?php esc_html_e( 'PHP post max size', 'themify' ); ?>:</th>
                    <td><?php echo esc_html( size_format( wp_convert_hr_to_bytes( ini_get( 'post_max_size' ) ) ) ); ?></td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e( 'PHP time limit', 'themify' ); ?>:</th>
                    <td><?php echo esc_html( (int) ini_get( 'max_execution_time' ) ); ?></td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e( 'PHP memory limit', 'themify' ); ?>:</th>
                    <td>
                        <?php
                        $tf_wp_mem_low = self::is_wp_memory_limit_low();
                        $tf_wp_mem_fmt = size_format( wp_convert_hr_to_bytes( WP_MEMORY_LIMIT ) );
                        if ( $tf_wp_mem_low ) {
                            echo '<span class="tf_status-wp-memory-bad"><strong>WP_MEMORY_LIMIT</strong>: ' . esc_html( $tf_wp_mem_fmt ) . '</span><br>';
                        } else {
                            echo '<strong>WP_MEMORY_LIMIT</strong>: ' . esc_html( $tf_wp_mem_fmt ) . '<br>';
                        }
                        ?>
                        <strong><?php _e( 'PHP Memory Limit', 'themify' ); ?></strong>: <?php echo esc_html( size_format( wp_convert_hr_to_bytes( ini_get( 'memory_limit' ) ) ) ); ?>
                        <?php if ( $tf_wp_mem_low ) : ?>
                        <br>
                        <mark class="error"><span class="dashicons dashicons-warning"></span><?php echo esc_html__( 'Your WordPress PHP memory is very low. Recommendation: 256mb or higher.', 'themify' ); ?></mark>
                        <?php endif; ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e( 'PHP max input vars', 'themify' ); ?>:</th>
                    <td>
                        <?php
                        $tf_miv = (int) ini_get( 'max_input_vars' );
                        echo esc_html( (string) $tf_miv );
                        if ( self::is_max_input_vars_low() ) {
                            echo '<br><mark class="error"><span class="dashicons dashicons-warning"></span> ' . esc_html__( 'Value is below 1000. WordPress, large menus, and the Builder can exceed this. Ask your host to raise max_input_vars (2000+ is often used).', 'themify' ) . '</mark>';
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e( 'cURL version', 'themify' ); ?>:</th>
                    <td><?php echo esc_html( self::get_curl_version() ); ?></td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e( 'SUHOSIN installed', 'themify' ); ?>:</th>
                    <td><?php echo extension_loaded( 'suhosin' ) ? '<span class="dashicons dashicons-yes"></span>' : '&ndash;'; ?></td>
                </tr>
            <?php endif; ?>
            <tr>
                <th scope="row"><?php esc_html_e( 'Max upload size', 'themify' ); ?>:</th>
                <td><?php echo esc_html( size_format( wp_max_upload_size() ) ); ?></td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'fsockopen/cURL', 'themify' ); ?>:</th>
                <td>
                    <?php
                    if ( ! self::is_fsockopen_and_curl_unavailable() ) {
                        echo '<span class="dashicons dashicons-yes"></span>';
                    } else {
                        echo '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . esc_html__( 'Your server does not have fsockopen or cURL enabled - some features that require connecting to external web services may not work. Contact your hosting provider.', 'themify' ) . '</mark>';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Custom Tables Allowed', 'themify' ); ?>:</th>
                <td>
                    <?php
                    if ( ! self::is_themify_custom_tables_unavailable() ) {
                        echo '<span class="dashicons dashicons-yes"></span>';
                    } else {
                        echo '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . esc_html__( 'Your server does not have have permissions to create custom tables in DB', 'themify' ) . '</mark>';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'GZip', 'themify' ); ?>:</th>
                <td>
                    <?php
                    $gzip = TFCache::get_available_gzip();
                    if ( false !== $gzip ) {
                        $gzip = current( $gzip );
                        echo '<span class="dashicons dashicons-yes"></span> ' . $gzip['f'];
                    } else {
                        echo '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . sprintf( __( '<a href="%s">GZIP</a> is recommended for better performance.', 'themify' ), 'https://php.net/manual/en/zlib.installation.php' ) . '</mark>';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'PHP Zip', 'themify' ); ?>:</th>
                <td><?php
                    echo extension_loaded('zip') ? '<span class="dashicons dashicons-yes"></span>' : '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . sprintf( __( '<a href="%s">PHP Zip extension</a> is recommended, this enables export/import of various data (settings, Builder content, etc.).', 'themify' ), 'https://www.php.net/manual/en/zip.setup.php' ) . '</mark>';
                ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Multibyte string', 'themify' ); ?>:</th>
                <td>
                    <?php
                    if ( extension_loaded( 'mbstring' ) ) {
                        echo '<span class="dashicons dashicons-yes"></span>';
                    } else {
                        /* Translators: %s: classname and link. */
                        echo '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . sprintf( esc_html__( 'Your server does not support the %s functions - this is required for better character encoding. Some fallbacks will be used instead for it.', 'themify' ), '<a href="https://php.net/manual/en/mbstring.installation.php">mbstring</a>' ) . '</mark>';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Uploads folder', 'themify' ); ?>:</th>
                <td>
                    <?php
                    $dir = themify_upload_dir();
                    echo '<p><strong>' . __( 'Base Dir ', 'themify' ) . '</strong>: ' . $dir['basedir'] . '<br>' . '<strong>' . __( 'Base URL ', 'themify' ) . '</strong>: ' . $dir['baseurl'] . '</p>';
                    if ( strpos( $dir['baseurl'], 'http' ) === false ) {
                        echo '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . sprintf( __( 'Relative paths detected. URLs <a href="%s">should be full paths</a>. Assets may not load properly.', 'themify' ), 'https://developer.wordpress.org/plugins/plugin-basics/determining-plugin-and-content-directories/#constants' ) . '</mark>';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Concate CSS folder', 'themify' ); ?>:</th>
                <td>
                    <?php
                    $dir = Themify_Enqueue_Assets::getCurrentVersionFolder();
                    echo esc_html( $dir ) . ' - ';
                    if ( ! self::is_themify_concat_css_dir_unwritable() ) {
                        echo '<span class="dashicons dashicons-yes"></span>';
                    } else {
                        echo '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . esc_html__( 'Uploads folder is not writeable, your CSS may not display correctly.', 'themify' ) . '</mark>';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Image Processing Library', 'themify' ); ?>:</th>
                <td>
                    <?php
                    if ( self::is_wp_image_editor_unavailable() ) {
                        echo '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . esc_html__( 'No image processing library found. Please contact your web hosting to enable this.', 'themify' ) . '</mark>';
                    } else {
                        echo '<span class="dashicons dashicons-yes"></span>' . esc_html( _wp_image_editor_choose() );
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Mysql version', 'themify' ); ?>:</th>
                <td>
                    <?php echo $wpdb->db_version();?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Database Encoding', 'themify' ); ?>:</th>
                <td>
                    <?php
                    $dbcharset = $wpdb->get_var("SELECT @@character_set_database");
                    ?>
                    <strong><?php _e( 'Charset', 'themify' ); ?></strong>: <?php echo esc_html( $dbcharset ); ?>
                    <?php if ( strtolower( $dbcharset ) !== 'utf8mb4' ) : ?>
                        <mark class="error"><span class="dashicons dashicons-warning"></span><?php _e( 'Your database does not support 4-byte characters like emojis.', 'themify' ); ?></mark>
                    <?php endif; ?>
                    <br>
                    <strong><?php _e( 'Collation', 'themify' ); ?></strong>: <?php echo esc_html( $wpdb->get_var("SELECT @@collation_database") ); ?>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php esc_html_e( 'Storage engine', 'themify' ); ?>:</th>
                <td>
                    <table>
                    <?php foreach($tables as $t):?>
                    <tr>
                       <th scope="row"><?php echo $t?></th>
                        <td>
                        <?php $engine=$wpdb->get_row( $wpdb->prepare( "SHOW TABLE STATUS WHERE Name = '%s'", $t ));
                        echo $engine->Engine;
                        if($engine->Engine==='InnoDB'){
                            echo '<span class="dashicons dashicons-yes"></span>';
                        }
                        else{
                            echo '<mark class="error"><span class="dashicons dashicons-warning"></span> ' . sprintf( __( 'Please consider using <a href="%s" target="_blank">InnoDB engine</a> which offers a lot of advantages and keeps your data safe. You can contact your web hosting to upgrade this for you.', 'themify' ), 'https://core.trac.wordpress.org/ticket/9422' ) . '</mark>';
                        }
                        ?></td>
                    </tr>
                    <?php endforeach;?>
                    </table>
                </td>
            </tr>
            <?php if ( method_exists( 'WpeCommon', 'instance' ) && ! WpeCommon::instance()->is_rand_enabled() ) { // WP Engine ?>
                <tr>
                    <th scope="row"><?php esc_html_e( 'Random Post Order', 'themify' ); ?>:</th>
                    <td><mark class="error"><span class="dashicons dashicons-warning"></span> <?php esc_html_e( 'Random post order is disabled in your WPEngine settings page.', 'themify' ) ?></mark></td>
                </tr>
            <?php } ?>
        </tbody>
    </table>
</div>
        <?php
    }

    public static function get_curl_version() {
        $curl_version = '';
        if ( function_exists( 'curl_version' ) ) {
            $curl_version = curl_version();
            $curl_version = $curl_version['version'] . ', ' . $curl_version['ssl_version'];
        } elseif ( extension_loaded( 'curl' ) ) {
            $curl_version = __( 'cURL installed but unable to retrieve version.', 'themify' );
        }
        return $curl_version;
    }

    /**
     * Applies sanitize_ function on multidimensional array
     *
     * @return mixed
     */
    public static function sanitize_deep( $value ) {
        if ( is_array( $value ) ) { 
            return array_map( 'wc_clean', $value ); 
        } else { 
            return is_scalar( $value ) ? sanitize_text_field( $value ) : $value; 
        }
    }
}
Themify_System_Status::init();