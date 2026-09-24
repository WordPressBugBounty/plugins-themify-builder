<?php

if( ! function_exists( 'themify_get_google_font_lists' ) ) :

/**
 * Get google font lists
 * @return array
 */
function themify_get_google_font_lists() {
    return (defined( 'THEMIFY_GOOGLE_FONTS' ) && THEMIFY_GOOGLE_FONTS != true)?array():include( themify_get_google_fonts_file() );
}

/**
 * Return file to use depending if user selected Recommended or Full list in theme settings.
 *
 * @since 2.1.7
 *
 * @return string
 */
function themify_get_google_fonts_file() {
    static $url=null;
    if($url===null){
        $url = 'google-fonts';
        if(!apply_filters( 'themify_google_fonts_full_list', ('full' === themify_get( 'setting-webfonts_list',false,true )) ) ){
            $url.='-recommended';
        }

        /**
         * Filters the file loaded.
         * Useful for recovery in case user loaded Full List and their server can't manage it.
         * @param string $fonts
         */
        $url= apply_filters( 'themify_google_fonts_file',dirname( __FILE__ ).'/'. $url.'.php' );
    }
    return $url;
}

function themify_get_variable_fonts_list() {
    return apply_filters( 'themify_variable_fonts_list', array(
        'Advent Pro'          => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Anek Latin'          => [ 100, 200, 300, 'r', 500, 600, 700, 800 ],
        'Anybody'             => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Archivo'             => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Asap'                => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'BioRhyme'            => [ 200, 300, 'r', 500, 600, 700, 800 ],
        'Bricolage Grotesque' => [ 200, 300, 'r', 500, 600, 700, 800 ],
        'Cabin'               => [ 'r', 500, 600, 700, 'i', '500i', '600i', '700i' ],
        'DynaPuff'            => [ 'r', 500, 600, 700 ],
        'Encode Sans'         => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900 ],
        'Fredoka'             => [ 300, 'r', 500, 600, 700 ],
        'Georama'             => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Google Sans Flex'    => [ 1, 100, 200, 300, 'r', 500, 600, 700, 800, 900, 1000 ],
        'Hubot Sans'          => [ 200, 300, 'r', 500, 600, 700, 800, 900, '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'IBM Plex Sans'       => [ 100, 200, 300, 'r', 500, 600, 700, '100i', '200i', '300i', 'i', '500i', '600i', '700i' ],
        'Inconsolata'         => [ 200, 300, 'r', 500, 600, 700, 800, 900 ],
        'Instrument Sans'     => [ 'r', 500, 600, 700, 'i', '500i', '600i', '700i' ],
        'Kalnia'              => [ 100, 200, 300, 'r', 500, 600, 700 ],
        'League Gothic'       => [ 'r' ],
        'M PLUS Code Latin'   => [ 100, 200, 300, 'r', 500, 600, 700 ],
        'Martian Mono'        => [ 100, 200, 300, 'r', 500, 600, 700, 800 ],
        'Merriweather'        => [ 300, 'r', 500, 600, 700, 800, 900, '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Mona Sans'           => [ 200, 300, 'r', 500, 600, 700, 800, 900, '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Mozilla Headline'    => [ 200, 300, 'r', 500, 600, 700 ],
        'Noto Sans'           => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Noto Serif'          => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Noto Serif Display'  => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Noto Sans Mono'      => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900 ],
        'Nunito Sans'         => [ 200, 300, 'r', 500, 600, 700, 800, 900, 1000, '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i', '1000i' ],
        'Open Sans'           => [ 300, 'r', 500, 600, 700, 800, '300i', 'i', '500i', '600i', '700i', '800i' ],
        'Pathway Extreme'     => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Playfair'            => [ 300, 'r', 500, 600, 700, 800, 900, '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Pliant'              => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Roboto'              => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Roboto Serif'        => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Saira'               => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Saira Stencil'       => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Science Gothic'      => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900 ],
        'Sour Gummy'          => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Special Gothic'      => [ 'r', 500, 600, 700 ],
        'Strichpunkt Sans'    => [ 'r', 500, 600, 700, 800, 900 ],
        'Tektur'              => [ 'r', 500, 600, 700, 800, 900 ],
        'TikTok Sans'         => [ 300, 'r', 500, 600, 700, 800, 900 ],
        'Tourney'             => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
        'Trispace'            => [ 100, 200, 300, 'r', 500, 600, 700, 800 ],
        'Truculenta'          => [ 100, 200, 300, 'r', 500, 600, 700, 800, 900 ],
        'Ubuntu Sans'         => [ 100, 200, 300, 'r', 500, 600, 700, 800, '100i', '200i', '300i', 'i', '500i', '600i', '700i', '800i' ],
        'Zalando Sans'        => [ 200, 300, 'r', 500, 600, 700, 800, 900, '200i', '300i', 'i', '500i', '600i', '700i', '800i', '900i' ],
    ) );
}

function themify_get_variable_fonts_wdth_ranges() {
    $fonts = array_keys( themify_get_variable_fonts_list() );
    $cached = get_transient( 'themify_var_fonts_wdth' );
    if ( is_array( $cached ) ) {
        return array_intersect_key( $cached, array_flip( $fonts ) );
    }

    $ranges = array();
    $response = wp_remote_get(
        'https://fonts.google.com/metadata/fonts',
        array(
            'timeout' => 15,
            'user-agent' => 'Mozilla/5.0 (compatible; Themify/1.0)',
        )
    );

    if ( ! is_wp_error( $response ) ) {
        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );
        if ( is_array( $data ) && ! empty( $data['familyMetadataList'] ) ) {
            foreach ( $data['familyMetadataList'] as $family ) {
                if ( empty( $family['family'] ) || empty( $family['axes'] ) ) {
                    continue;
                }
                foreach ( $family['axes'] as $axis ) {
                    if ( isset( $axis['tag'] ) && 'wdth' === $axis['tag'] ) {
                        $ranges[ $family['family'] ] = array(
                            (int) round( $axis['min'] ),
                            (int) round( $axis['max'] ),
                        );
                        break;
                    }
                }
            }
        }
    }

    if ( ! empty( $ranges ) ) {
        set_transient( 'themify_var_fonts_wdth', $ranges, WEEK_IN_SECONDS );
    }

    return array_intersect_key( $ranges, array_flip( $fonts ) );
}

function themify_get_variable_font_css2_param( string $name ): string {
    $wdth = themify_get_variable_fonts_wdth_ranges();
    $wdth_min = $wdth[ $name ][0] ?? 75;
    $wdth_max = $wdth[ $name ][1] ?? 125;
    $enc = str_replace( ' ', '+', $name );

    return 'family=' . $enc . ':ital,wdth,wght@0,' . $wdth_min . '..' . $wdth_max . ',100..900;1,' . $wdth_min . '..' . $wdth_max . ',100..900';
}

/**
 * Returns a list of Google Web Fonts
 * @return array
 * @since 1.5.6
 */
function themify_get_google_web_fonts_list() {
    $google_fonts_list = array(
        array( 'value' => '', 'name' => '' )
    );
    foreach ( themify_get_variable_fonts_list() as $k => $variants ) {
        $google_fonts_list[] = array(
            'value' => $k,
            'name' => $k,
            'variant' => $variants,
            'variable' => true
        );
    }
    $google_fonts_list[] = array(
        'value' => '',
        'name' => '--- ' . __( 'Google Fonts', 'themify' ) . ' ---'
    );
    $fonts = themify_get_google_font_lists();
    foreach ( $fonts as $k=>$f ) {
        $google_fonts_list[] = array(
            'value' => $k,
            'name' => $k,
            'variant' => is_array( $f ) ? $f[1] : array()
        );
    }

    return apply_filters( 'themify_get_google_web_fonts_list', $google_fonts_list );
}

/**
 * Returns a list of web safe fonts
 * @param bool $only_names Whether to return only the array keys or the values as well
 * @return mixed|void
 * @since 1.0.0
 */
function themify_get_web_safe_font_list( $only_names = false ) {
    $web_safe_font_names = array(
        "Arial, Helvetica, sans-serif",
        "Verdana, Geneva, sans-serif",
        "Georgia, 'Times New Roman', Times, serif",
        "'Times New Roman', Times, serif",
        "Tahoma, Geneva, sans-serif",
        "'Trebuchet MS', Arial, Helvetica, sans-serif",
        "Palatino, 'Palatino Linotype', 'Book Antiqua', serif",
        "'Lucida Sans Unicode', 'Lucida Grande', sans-serif"
    );

    if( ! $only_names ) {
        $web_safe_fonts = array(
            array( 'value' => 'default', 'name' => '', 'selected' => true ),
            array( 'value' => '', 'name' => '--- '.__( 'Web Safe Fonts', 'themify' ) . ' ---' )
        );

        foreach( $web_safe_font_names as $font ) {
            $web_safe_fonts[] = array(
                'value' => $font,
                'name' => $font
            );
        }
    } else {
        $web_safe_fonts = $web_safe_font_names;
    }

    return apply_filters( 'themify_get_web_safe_font_list', $web_safe_fonts );
}

endif;