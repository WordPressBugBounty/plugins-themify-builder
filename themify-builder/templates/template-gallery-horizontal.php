<?php
/**
 * Template Gallery Horizontal Scroll
 *
 * This template can be overridden by copying it to your child_theme_folder/themify-builder/template-gallery-horizontal.php.
 *
 * Access original fields: $args['settings']
 * @author Themify
 */

defined( 'ABSPATH' ) || exit;

$settings = $args['settings'];
$showTitle = $settings['gallery_image_title'] === 'yes';
$showCaption = $settings['gallery_exclude_caption'] !== 'yes';
$thumb_h = $settings['thumb_h_gallery'] !== '' ? (int) $settings['thumb_h_gallery'] : (int) $settings['thumb_w_gallery'];
$image_attr = array(
    'image_size' => $settings['image_size_gallery'],
);
?>
<div class="gallery-horizontal-scroll"<?php if ( Themify_Builder::$frontedit_active === false ) : ?> data-lazy="1"<?php endif; ?>>
    <?php foreach ( $settings['gallery_images'] as $image ) : ?>
        <div class="gallery-horizontal-item">
            <div class="gallery-icon">
            <?php
                $image_attr['alt'] = get_post_meta( $image->ID, '_wp_attachment_image_alt', true );
                $image_attr['src'] = wp_get_attachment_image_url( $image->ID, 'full' );
                $image_attr['h'] = $thumb_h ?: '';
                $image_attr['w'] = '';
                if ( $thumb_h > 0 ) {
                    $meta = wp_get_attachment_metadata( $image->ID );
                    if ( ! empty( $meta['width'] ) && ! empty( $meta['height'] ) ) {
                        $image_attr['w'] = (int) round( $thumb_h * ( $meta['width'] / $meta['height'] ) );
                    }
                }
                $image_html = themify_get_image( $image_attr );

                $lightbox = '';
                $link = null;
                if ( $settings['link_opt'] === 'file' ) {
                    $link = wp_get_attachment_image_src( $image->ID, $settings['link_image_size'] );
                    if ( ! empty( $link ) ) {
                        $link = $link[0];
                    }
                    if ( $settings['lightbox'] === true ) {
                        $lightbox = ' class="themify_lightbox"';
                    }
                } elseif ( 'none' !== $settings['link_opt'] ) {
                    $link = get_attachment_link( $image->ID );
                }
                if ( ! empty( $link ) ) {
                    printf( '<a href="%s"%s>%s</a>', esc_url( $link ), $lightbox, $image_html );
                } else {
                    echo $image_html;
                }
                ?>
            </div>
            <?php if ( ( $showTitle === true && $image->post_title ) || ( $showCaption === true && $image->post_excerpt ) ) : ?>
                <div class="wp-caption-text gallery-caption">
                    <?php if ( $showTitle === true && ! empty( $image->post_title ) ) : ?>
                        <strong class="themify_image_title tf_block"><?php echo wp_kses_post( $image->post_title ); ?></strong>
                    <?php endif; ?>
                    <?php if ( $showCaption === true && ! empty( $image->post_excerpt ) ) : ?>
                        <span class="themify_image_caption"><?php echo apply_filters( 'themify_builder_module_content', $image->post_excerpt ); ?></span>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>
</div>
