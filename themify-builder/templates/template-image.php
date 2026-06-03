<?php
/**
 * Template Image
 * 
 * This template can be overridden by copying it to your child_theme_folder/themify-builder/template-image.php.
 *
 * Access original fields: $args['mod_settings']
 * @author Themify
 */

defined( 'ABSPATH' ) || exit;

$mod_name=$args['mod_name'];
$element_id = $args['module_ID'];
$fields_args = $args['mod_settings']+ array(
    'mod_title_image' => '',
    'style_image' => 'image-top',
    'url_image' => '',
    'appearance_image' => '',
    'caption_on_overlay' => '',
    'image_size_image' => '',
    'width_image' => '',
    'auto_fullwidth' => false,
    'height_image' => '',
    'title_tag' => 'h3',
    'title_image' => '',
    'link_image' => '',
    'download_link' => '',
    'param_image' => '',
    'image_zoom_icon' => '',
    'lightbox_width' => '',
    'lightbox_height' => '',
    'lightbox_width_unit' => 'px',
    'lightbox_height_unit' => 'px',
    'alt_image' => '',
    'caption_image' => '',
    'css_image' => '',
    'animation_effect' => '',
    'media_title_attr' => '',
    'auto_title_media' => '',
    'auto_caption_media' => ''
);
if (!empty($fields_args['appearance_image'])) {
    $fields_args['appearance_image'] = self::get_checkbox_data($fields_args['appearance_image']);
    Themify_Builder_Model::load_appearance_css($fields_args['appearance_image']);
}
$container_class=array(
    'module', 
    'module-' . $mod_name,
    $element_id,
    $fields_args['style_image'],
    $fields_args['appearance_image'], 
    $fields_args['css_image']
); 
Themify_Builder_Model::load_module_self_style($mod_name,str_replace('image-','',$fields_args['style_image']));
if (  'yes' === $fields_args['caption_on_overlay']){
    $container_class[]= 'active-caption-hover';
}
if ($fields_args['auto_fullwidth']=='1') {
    $container_class[]='auto_fullwidth';
}
$container_class[]='tf_mw';
$container_class = apply_filters('themify_builder_module_classes', $container_class, $mod_name, $element_id, $fields_args);

if(!empty($fields_args['global_styles']) && Themify_Builder::$frontedit_active===false){
    $container_class[] = $fields_args['global_styles'];
}
$newtab =false;
if($fields_args['link_image'] !== ''){
    if($fields_args['param_image'] === 'lightbox'){
        $lightbox_data = $fields_args['lightbox_width']!=='' ||  $fields_args['lightbox_height']!=='' ? sprintf(' data-zoom-config="%s|%s"'
            , $fields_args['lightbox_width'] . $fields_args['lightbox_width_unit'], $fields_args['lightbox_height'] . $fields_args['lightbox_height_unit']) : false;
    }
    else{
        $newtab=$fields_args['param_image'] === 'newtab';
    }
}
$attachment_id = ! empty( $fields_args['url_image'] ) ? attachment_url_to_postid( $fields_args['url_image'] ) : 0;
$media_alt_text = $attachment_id ? (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) : '';
$media_title_text = $attachment_id ? get_the_title( $attachment_id ) : '';
$media_caption_text = $attachment_id ? (string) wp_get_attachment_caption( $attachment_id ) : '';
$use_auto_title_media = 'yes' === $fields_args['auto_title_media'];
$use_auto_caption_media = 'yes' === $fields_args['auto_caption_media'];
$use_media_title_attr = 'yes' === $fields_args['media_title_attr'];
$display_title = $use_auto_title_media ? $media_title_text : $fields_args['title_image'];
$display_caption = $use_auto_caption_media ? $media_caption_text : $fields_args['caption_image'];
$img_html_title_attr = $use_media_title_attr ? $media_title_text : $fields_args['title_image'];

if ( '' !== $fields_args['alt_image'] ) {
	$image_alt = $fields_args['alt_image'];
} elseif ( '' !== $media_alt_text ) {
	$image_alt = $media_alt_text;
} else {
	$image_alt = wp_strip_all_tags( is_string( $display_caption ) ? $display_caption : '' );
}
if ( '' === $image_alt ) {
	$image_alt = $display_title;
}

$image = '';
if ( ! empty( $fields_args['url_image'] ) ) {
    $preset = $fields_args['image_size_image'] !== '' ? $fields_args['image_size_image'] : themify_builder_get('setting-global_feature_size', 'image_global_size_field');
    $param_image=array('src'=>esc_url($fields_args['url_image']),'w'=>$fields_args['width_image'],'h'=>$fields_args['height_image'],'alt'=>$image_alt,'title'=>$img_html_title_attr,'image_size'=>$preset);
    if ( Themify_Builder::$frontedit_active === true && ! self::$disable_inline_edit ) {
        $param_image['attr']=array('data-w'=>'width_image', 'data-h'=>'height_image','data-name'=>'url_image');
    }
    $image = themify_get_image($param_image);

    unset($param_image,$preset,$image_alt);
}

$container_props = apply_filters('themify_builder_module_container_props', self::parse_animation_effect($fields_args,array(
    'class' => implode(' ', $container_class),
    )), $fields_args, $mod_name, $element_id);
if(Themify_Builder::$frontedit_active===false){
    $container_props['data-lazy']=1;
}

self::sticky_element_props($container_props, $fields_args);
?>
<!-- module image -->
<div <?php echo themify_get_element_attributes($container_props); ?>>
    <?php $container_props=$container_class=$args=null;
    echo Themify_Builder_Component_Module::get_module_title($fields_args,'mod_title_image');
    ?>
    <div class="image-wrap tf_rel tf_mw">
    <?php if ($fields_args['link_image'] !== ''): ?>
        <a href="<?php echo esc_url($fields_args['link_image']); ?>"<?php if ($newtab===true): ?> rel="noopener" target="_blank"<?php elseif (isset($lightbox_data)) : ?> class="lightbox-builder themify_lightbox"<?php echo $lightbox_data; ?><?php endif; ?><?php if ($fields_args['download_link'] === 'yes' &&  $fields_args['param_image'] !== 'lightbox') { echo ' download'; } ?>>
           <?php if ($fields_args['style_image']!=='image-full-overlay' && $fields_args['image_zoom_icon'] === 'zoom'): ?>
            <?php 
                Themify_Builder_Model::load_module_self_style($mod_name,'zoom');
                $icon=isset($lightbox_data) ? 'search' : 'new-window';
            ?>
            <span class="zoom">
                <?php echo themify_get_icon($icon,'ti',false,false,array('aria-label'=>__('Open','themify'))); ?>
            </span>
            <?php endif; ?>
        <?php echo $image; ?>
        </a>
    <?php else: ?>
        <?php echo $image; ?>
    <?php endif; ?>

    <?php if ('image-overlay' !== $fields_args['style_image']): ?>
    </div>
    <!-- /image-wrap -->
    <?php endif; ?>

    <?php if ($display_title !== '' || $display_caption !== ''): ?>
    <div class="image-content<?php echo $fields_args['style_image']==='image-full-overlay'?' tf_overflow':'';?>">
        <?php if ($display_title !== '') :
            $fields_args['title_tag'] = themify_whitelist_tag( $fields_args['title_tag'], 'h3' );
            ?>
            <<?php echo $fields_args['title_tag'];?> class="image-title">
                <?php if ($fields_args['link_image'] !== ''): ?>
                    <a href="<?php echo esc_url($fields_args['link_image']); ?>"<?php if (isset($lightbox_data)) : ?> class="lightbox-builder themify_lightbox"<?php echo $lightbox_data; ?><?php endif;if ($newtab===true): ?> rel="noopener" target="_blank"<?php endif; ?>>
                        <?php echo $display_title; ?>
                    </a>
                <?php else: ?>
                    <?php echo $display_title; ?>
                <?php endif; ?>
            </<?php echo $fields_args['title_tag'];?>>
        <?php endif; ?>
        <?php if ($display_caption !== ''): ?>
        <div class="image-caption tb_text_wrap">
            <?php echo wp_kses_post( apply_filters( 'themify_builder_module_content', $display_caption ) ); ?>
        </div>
        <!-- /image-caption -->
        <?php endif; ?>
    </div>
    <!-- /image-content -->
    <?php endif; ?>
    <?php if ('image-overlay' === $fields_args['style_image']): ?>
        </div>
        <!-- /image-wrap -->
    <?php endif; ?>
</div>
<!-- /module image -->