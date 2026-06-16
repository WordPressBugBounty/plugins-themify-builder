<?php

defined( 'ABSPATH' ) || exit;

if( ! class_exists( 'Themify_Icon_Font',false ) ) :
/**
 * Definition for icon font classes
 *
 * @since 1.0
 */
class Themify_Icon_Font {
    
    public static $url;
    private static $types;
    protected static $usedIcons = array();
    
    protected function __construct(){
       self::$types[$this->get_id()]=$this;
    }
    
    public static function init(){
        $dir = trailingslashit( dirname( __FILE__ ) );
        
        include $dir.'includes/class-icon-themify.php';
        include $dir .'includes/class-icon-fontawesome.php';
        include $dir .'includes/class-icon-fontello.php';
        include $dir .'includes/class-icon-lineawesome.php';

        add_action( 'wp_ajax_tf_get_icon', array( __CLASS__, 'tf_ajax_get_icon' ) );
        
        add_action('wp_ajax_tf_icon_get_by_type',array(__CLASS__,'get_ajax_by_type'));
        
        add_action('wp_ajax_nopriv_tf_load_icons',array(__CLASS__,'load_icons'));
        add_action('wp_ajax_tf_load_icons',array(__CLASS__,'load_icons'));
    }
    /**
     * Return the ID of the icon font
     *
     * @return string
     */
    function get_id() {
        return '';
    }

    /**
     * Return the name of the icon font
     *
     * @return string
     */
    function get_label() {
        return '';
    }
    
    
    /**
     * Returns a list of icon fonts registered
     *
     * @return array
     */
    public static function get_types() {
        return self::$types;
    }

    /**
     * Gets an icon name and checks if it's a valid icon in the font
     *
     * @param $name name of the icon
     * @return bool
     */
    function is_valid_icon( $name ) {
        return true;
    }

    /**
     * Returns the formatted CSS classname for the icon
     *
     * @return string
     */
    function get_classname( $icon ,$lazy=null,$data_only=false) {
        return $icon;
    }

    
    function get_categories(){
        return array();
    }
    
    
    /**
     * Load script and style required for the icon picker interface
     *
     * Must be called manually wherever you need the icon picker.
     */
    public static function enqueue() {
        $titles=array();
        $types=self::get_types();
        foreach($types as $type){
        $titles[$type->get_id()]=$type->get_label();
        }
        wp_enqueue_script( 'tf-icon-picker', THEMIFY_URI . '/themify-icon-picker/assets/script.js', array( 'themify-main-script' ), THEMIFY_VERSION, true );
        wp_localize_script( 'tf-icon-picker', 'tfIconPicker', array(
        'group'=>$titles,
        'title'=> __( 'Choose icon', 'themify' ),
        'search'=>__( 'Search', 'themify' )
        ) );

        do_action( 'themify_icon_picker_enqueue' );
    }
    
    public function get_icons_by_category($cat=''){
        return array();
    }
    

    public static function get_used_icons() {
        return self::$usedIcons;
    }
    

    /**
     * Hooked to "tf_get_icon" Ajax call, returns the icon CSS classname for $_POST['tf_icon']
     *
     * @since 1.0
     */
    public static function tf_ajax_get_icon() {
        check_ajax_referer( 'tf_nonce', 'nonce' );
        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_die( -1, 403 );
        }
        if ( isset( $_GET['tf_icon'] ) ) {
            $icon = themify_get_icon( sanitize_text_field( wp_unslash( $_GET['tf_icon'] ) ) );
            if ( $icon ) {
                echo $icon;
            }
        }
        wp_die();
    }
    
    
    
    public static function sanitize_icon_name( $name ) {
        $name = sanitize_text_field( wp_unslash( (string) $name ) );
        if ( $name === '' || ! preg_match( '/^[a-zA-Z0-9][a-zA-Z0-9 _.-]*$/', $name ) ) {
            return false;
        }
        return $name;
    }

    public static function load_icons(){
        if ( ! empty( $_POST['icons'] ) ) {
            $icons = json_decode( str_replace( '\\', '', wp_unslash( $_POST['icons'] ) ) );
            $res = array();
            if ( is_array( $icons ) ) {
                foreach ( $icons as $ic ) {
                    $ic = self::sanitize_icon_name( $ic );
                    if ( $ic === false ) {
                        continue;
                    }
                    $r = themify_get_icon( $ic, false, false, true );
                    if ( $r ) {
                        $res[ $ic ] = $r;
                    }
                }
            }
            wp_send_json( $res );
        }
        wp_die();
    }
    
    public static function get_ajax_by_type(){
        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_die( -1, 403 );
        }
        if ( ! empty( $_POST['type'] ) ) {
            $type = sanitize_key( $_POST['type'] );
            $cat = ! empty( $_POST['cat'] ) ? sanitize_key( $_POST['cat'] ) : '';
            $types = self::get_types();
            if ( isset( $types[ $type ] ) ) {
                header( 'Content-Type: application/json; charset=' . get_option( 'blog_charset' ) );
                echo wp_json_encode( array( 'icons' => $types[ $type ]->get_icons_by_category( $cat ), 'cats' => $types[ $type ]->get_categories() ) );
            }
        }
        wp_die();
    }

    protected static function svg_attributes($attrs){
        if(isset($attrs['aria-label'])){
            $attrs['role']='img';
        }
    else{
            $attrs['aria-hidden']='true';
        }
        return themify_get_element_attributes($attrs);
    }
    
    protected static function sanitize_svg_id( $id ) {
        $id = preg_replace( '/[^a-zA-Z0-9_-]/', '', (string) $id );
        return $id !== '' ? $id : false;
    }

    protected static function get_svg($id,array $attrs=array()){
    $id = self::sanitize_svg_id( $id );
    if ( $id === false ) {
        return '';
    }
    $cl='tf_fa tf-'.$id;
    if(isset($attrs['class'])){
        $cl.=' '.$attrs['class'];
    }
    $attrs['class']=$cl;
	// Safari (and some WebKit builds) can fail to render <use href="#..."> in certain contexts
	// (notably inside Shadow DOM). Provide both `href` and legacy `xlink:href` for compatibility.
	if(!isset($attrs['xmlns:xlink'])){
		$attrs['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
	}
	$ref = esc_attr( '#tf-' . $id );
	return '<svg '.self::svg_attributes($attrs).'><use href="' . $ref . '" xlink:href="' . $ref . '"></use></svg>';
    }
}
endif;


if( ! function_exists( 'themify_get_icon' ) ){
    /**
     * Retrieve an icon name and returns the proper CSS classname to display that icon
     *
     * @return string
     */
    function themify_get_icon( $name,$type=false,$lazy=false,$data_only=false,$attrs=array()) {
        $types = Themify_Icon_Font::get_types();

        if($type!==false && isset($types[$type])){
            return $types[$type]->get_classname( $name,$lazy,$data_only,$attrs );
        }
        foreach( $types as $font ) {
            if( $font->is_valid_icon( $name ) ) {
                return $font->get_classname( $name,$lazy,$data_only,$attrs );
            }
        }

        return false;
    }
}

add_action( 'init', array( 'Themify_Icon_Font', 'init' ) );
