<?php
/**
 * Themify Compatibility Code
 *
 * @package Themify
 */

/**
 * Formidable Forms
 * @link https://formidableforms.com/
 */
class Themify_Compat_formidable {

    static function init() {
        if ( ! is_admin() ) {
            add_action( 'wp_print_footer_scripts', [ __CLASS__, 'wp_print_footer_scripts' ], 1 );
            add_action( 'frm_pro_before_footer_js', [ __CLASS__, 'frm_pro_before_footer_js' ], 1 );
        }
    }

    public static function wp_print_footer_scripts() {
        if ( wp_script_is( 'slimselect', 'enqueued' ) || wp_script_is( 'slimselect', 'done' ) ) {
            wp_add_inline_script( 'slimselect', self::get_script(), 'after' );
        }
    }

    public static function frm_pro_before_footer_js() {
        echo '<script>' . self::get_script() . '</script>';
    }

    private static function get_script() {
        return <<<'JS'
(function(){
    if(!window.SlimSelect || window.SlimSelect.__themifyFrmCompat){
        return;
    }
    var OriginalSlimSelect = window.SlimSelect,
        skipClickUntil = 0,
        allowProgrammaticClick = false;

    function ThemifySlimSelectCompat(args){
        var select = args && args.select;
        if('string' === typeof select){
            select = document.querySelector(select);
        }
        if(select && 'SELECT' === select.tagName && select.classList.contains('frm_slimselect') && select.slim){
            select.style.display = 'none';
            select.setAttribute('aria-hidden','true');
            return select.slim;
        }
        return new OriginalSlimSelect(args);
    }

    function getFormidableSlimSelect(option){
        var content = option.closest('.ss-content.frm_slimselect'),
            id = content ? content.getAttribute('data-id') : null,
            select;
        if(!id){
            return null;
        }
        try{
            select = document.querySelector('select.frm_slimselect[data-id="' + CSS.escape(id) + '"]');
        }
        catch(e){
            select = document.querySelector('select.frm_slimselect[data-id="' + id.replace(/"/g,'\\"') + '"]');
        }
        return select && select.slim ? select.slim : null;
    }

    function selectOptionOnPointerDown(e){
        var option = e.target && e.target.closest ? e.target.closest('.ss-content.frm_slimselect .ss-option') : null,
            slim;
        if(!option || option.classList.contains('ss-disabled') || option.classList.contains('ss-hide')){
            return;
        }
        if(e.type === 'pointerdown' && e.pointerType && e.pointerType !== 'mouse'){
            return;
        }
        if(e.button !== undefined && e.button !== 0){
            return;
        }
        slim = getFormidableSlimSelect(option);
        if(!slim || !slim.settings || !slim.settings.isOpen){
            return;
        }
        allowProgrammaticClick = true;
        option.click();
        allowProgrammaticClick = false;
        skipClickUntil = Date.now() + 500;
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    function suppressDuplicateClick(e){
        if(!allowProgrammaticClick && skipClickUntil && Date.now() < skipClickUntil){
            skipClickUntil = 0;
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }

    ThemifySlimSelectCompat.prototype = OriginalSlimSelect.prototype;
    for(var key in OriginalSlimSelect){
        if(Object.prototype.hasOwnProperty.call(OriginalSlimSelect,key)){
            ThemifySlimSelectCompat[key] = OriginalSlimSelect[key];
        }
    }
    ThemifySlimSelectCompat.__themifyFrmCompat = true;
    window.SlimSelect = ThemifySlimSelectCompat;

    document.addEventListener('pointerdown', selectOptionOnPointerDown, true);
    document.addEventListener('click', suppressDuplicateClick, true);
})();
JS;
    }
}
