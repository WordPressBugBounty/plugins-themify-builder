<?php
/**
 * Search & Filter form markup for post/product modules.
 *
 * @package Themify
 */
if ( empty( $args['fields'] ) || ! is_array( $args['fields'] ) ) {
	return;
}

$layout = ! empty( $args['layout'] ) ? $args['layout'] : 'horizontal';
$mobile_layout = ! empty( $args['mobile_layout'] ) ? $args['mobile_layout'] : '';
$is_m_sticky = $mobile_layout === 'sticky';
$is_m_collapse = $mobile_layout === 'collapsible';
$tax_relation = ! empty( $args['tax_relation'] ) && strtoupper( $args['tax_relation'] ) === 'AND' ? 'AND' : 'OR';
$has_submit = ! empty( $args['submit'] ) && $args['submit'] === 'yes';
$has_reset = $has_submit && ! empty( $args['reset'] ) && $args['reset'] === 'yes';
$has_active = ! empty( $args['active_filters'] ) && $args['active_filters'] === 'yes';
$submit_text = ! empty( $args['submit_text'] ) ? $args['submit_text'] : __( 'Filter', 'themify' );
$collapse_text = ! empty( $args['collapse_text'] ) ? $args['collapse_text'] : __( 'Filter', 'themify' );
$el_id = ! empty( $args['el_id'] ) ? $args['el_id'] : '';
$builder_id = ! empty( $args['builder_id'] ) ? $args['builder_id'] : '';
$post_type = ! empty( $args['post_type'] ) ? $args['post_type'] : 'post';
$limit = ! empty( $args['limit'] ) ? (int) $args['limit'] : get_option( 'posts_per_page' );

Themify_Enqueue_Assets::add_css( 'tf_search_filter', Themify_Enqueue_Assets::THEMIFY_CSS_MODULES_URI . 'search-filter.css', null, THEMIFY_VERSION );

$form_class = 'tf_search_filter tf_search_filter_' . esc_attr( $layout ) . ( $has_submit ? '' : ' tf_search_filter_ajax' );
if ( $is_m_sticky ) {
	$form_class .= ' tf_sf_m_sticky';
} elseif ( $is_m_collapse ) {
	$form_class .= ' tf_sf_m_collapse';
}

$form_attrs = array(
	'class' => $form_class,
	'method' => 'get',
	'action' => '',
	'data-el' => esc_attr( $el_id ),
	'data-id' => esc_attr( $builder_id ),
	'data-post_type' => esc_attr( is_array( $post_type ) ? reset( $post_type ) : $post_type ),
	'data-limit' => esc_attr( $limit ),
	'data-layout' => esc_attr( $layout ),
	'data-tax-rel' => esc_attr( $tax_relation ),
	'onsubmit' => 'return false;',
);
if ( $has_submit ) {
	$form_attrs['data-submit'] = '1';
}
if ( $mobile_layout !== '' ) {
	$form_attrs['data-mobile'] = esc_attr( $mobile_layout );
}
$panel_class = $is_m_sticky ? 'tf_sf_sticky_panel' : ( $is_m_collapse ? 'tf_sf_collapse_body' : 'tf_sf_panel' );
?>
<form <?php echo themify_get_element_attributes( $form_attrs ); ?>>
	<?php if ( $is_m_sticky ) : ?>
		<button type="button" class="tf_sf_sticky_btn" aria-expanded="false"><span class="screen-reader-text"><?php esc_html_e( 'Search & Filter', 'themify' ); ?></span></button>
	<?php elseif ( $is_m_collapse ) : ?>
		<button type="button" class="tf_sf_collapse_toggle" aria-expanded="false">
			<span class="tf_sf_collapse_label"><?php echo esc_html( $collapse_text ); ?></span>
			<?php echo themify_get_icon( 'ti-angle-down', false, false, false, array( 'class' => 'tf_sf_collapse_mic' ) ); ?>
			<?php echo themify_get_icon( 'ti-angle-up', false, false, false, array( 'class' => 'tf_sf_collapse_mic_close tf_hide' ) ); ?>
		</button>
	<?php endif; ?>
	<div class="<?php echo esc_attr( $panel_class ); ?>">
	<div class="tf_search_filter_items">
		<?php
		foreach ( $args['fields'] as $i => $field ) {
			if ( empty( $field['type'] ) ) {
				continue;
			}
			$type = $field['type'];
			$val = isset( $field['val'] ) && is_array( $field['val'] ) ? $field['val'] : array();
			$fid = ! empty( $field['id'] ) ? $field['id'] : $type . '_' . $i;

			if ( $type === 'search' ) {
				$label = ! empty( $val['label'] ) ? $val['label'] : '';
				$search_by = ! empty( $val['search_by'] ) ? $val['search_by'] : 'title|content';
				$by_list = array_values( array_filter( explode( '|', $search_by ) ) );
				$all_custom_fields = in_array( 'all_custom_fields', $by_list, true );
				$custom_field = ( ! $all_custom_fields && ! empty( $val['custom_field'] ) ) ? $val['custom_field'] : '';
				$placeholder = $label !== '' ? $label : __( 'Search', 'themify' );
				$current_s = isset( $_REQUEST['tf_sf_s'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['tf_sf_s'] ) ) : '';
				?>
				<div class="tf_sf_item tf_sf_search" data-type="search">
					<?php if ( $label !== '' ) : ?>
						<span class="tf_sf_label screen-reader-text"><?php echo esc_html( $label ); ?></span>
					<?php endif; ?>
					<input type="search" name="tf_sf_s" class="tf_sf_input" value="<?php echo esc_attr( $current_s ); ?>" placeholder="<?php echo esc_attr( $placeholder ); ?>" autocomplete="off">
					<input type="hidden" name="tf_sf_by" value="<?php echo esc_attr( $search_by ); ?>">
					<?php if ( $custom_field !== '' ) : ?>
						<input type="hidden" name="tf_sf_cf" value="<?php echo esc_attr( $custom_field ); ?>">
					<?php endif; ?>
				</div>
				<?php
				continue;
			}

			if ( $type === 'custom_field' ) {
				$meta_key = ! empty( $val['custom_field'] ) ? $val['custom_field'] : '';
				if ( $meta_key === '' || ! function_exists( 'themify_search_filter_meta_values' ) ) {
					continue;
				}
				$label = ! empty( $val['label'] ) ? $val['label'] : $meta_key;
				$display_as = ! empty( $val['display_as'] ) ? $val['display_as'] : 'checkbox';
				$orderby = ! empty( $val['orderby'] ) ? $val['orderby'] : 'name';
				$order = ! empty( $val['order'] ) ? $val['order'] : 'ASC';
				$columns = ! empty( $val['columns'] ) ? (int) $val['columns'] : 1;
				if ( $columns < 1 || $columns > 3 ) {
					$columns = 1;
				}
				$meta_values = themify_search_filter_meta_values( $meta_key, array(
					'orderby' => $orderby,
					'order' => $order,
					'post_type' => $post_type,
				) );
				if ( empty( $meta_values ) ) {
					continue;
				}
				$input_name = 'tf_sf_meta[' . $meta_key . ']';
				$item_class = 'tf_sf_item tf_sf_terms tf_sf_display_' . $display_as . ' tf_sf_cols_' . $columns;
				?>
				<div class="<?php echo esc_attr( $item_class ); ?>" data-type="custom_field" data-meta="<?php echo esc_attr( $meta_key ); ?>" data-cols="<?php echo esc_attr( (string) $columns ); ?>">
					<span class="tf_sf_label" tabindex="0"><?php echo esc_html( $label ); ?></span>
					<div class="tf_sf_dropdown">
						<?php if ( $display_as === 'select' ) : ?>
							<select name="<?php echo esc_attr( $input_name ); ?>" class="tf_sf_select">
								<option value=""><?php echo esc_html( $label ); ?></option>
								<?php foreach ( $meta_values as $meta_row ) : ?>
									<option value="<?php echo esc_attr( $meta_row->value ); ?>"><?php echo esc_html( $meta_row->value ); ?></option>
								<?php endforeach; ?>
							</select>
						<?php else : ?>
							<ul class="tf_sf_terms_list">
								<?php foreach ( $meta_values as $j => $meta_row ) :
									$input_id = 'tf_sf_' . ( $el_id !== '' ? $el_id . '_' : '' ) . $fid . '_' . $j;
									$input_type = $display_as === 'radio' ? 'radio' : 'checkbox';
									$name = $display_as === 'radio' ? $input_name : $input_name . '[]';
									?>
									<li>
										<input type="<?php echo esc_attr( $input_type ); ?>" name="<?php echo esc_attr( $name ); ?>" id="<?php echo esc_attr( $input_id ); ?>" value="<?php echo esc_attr( $meta_row->value ); ?>">
										<label for="<?php echo esc_attr( $input_id ); ?>"><?php echo esc_html( $meta_row->value ); ?></label>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>
					</div>
				</div>
				<?php
				continue;
			}

			$taxonomy = '';
			if ( $type === 'product_cat' ) {
				$taxonomy = 'product_cat';
			} elseif ( $type === 'product_tag' ) {
				$taxonomy = 'product_tag';
			} elseif ( $type === 'terms' ) {
				$taxonomy = ! empty( $val['taxonomy'] ) ? $val['taxonomy'] : 'category';
			} else {
				continue;
			}

			if ( ! taxonomy_exists( $taxonomy ) ) {
				continue;
			}

			$label = ! empty( $val['label'] ) ? $val['label'] : get_taxonomy( $taxonomy )->labels->singular_name;
			$display_as = ! empty( $val['display_as'] ) ? $val['display_as'] : 'checkbox';
			$orderby = ! empty( $val['orderby'] ) ? $val['orderby'] : 'name';
			$order = ! empty( $val['order'] ) ? $val['order'] : 'ASC';
			$hierarchy = ! empty( $val['hierarchy'] ) && $val['hierarchy'] === 'yes';
			$columns = ! empty( $val['columns'] ) ? (int) $val['columns'] : 1;
			if ( $columns < 1 || $columns > 3 ) {
				$columns = 1;
			}
			$terms = get_terms( array(
				'taxonomy' => $taxonomy,
				'hide_empty' => true,
				'orderby' => $orderby,
				'order' => $order,
			) );
			if ( is_wp_error( $terms ) || empty( $terms ) ) {
				continue;
			}
			if ( $hierarchy ) {
				$terms = themify_search_filter_terms_tree( $terms );
			}
			$input_name = 'tf_sf_tax[' . $taxonomy . ']';
			$item_class = 'tf_sf_item tf_sf_terms tf_sf_display_' . $display_as . ' tf_sf_cols_' . $columns;
			if ( $hierarchy ) {
				$item_class .= ' tf_sf_hierarchy';
			}
			?>
			<div class="<?php echo esc_attr( $item_class ); ?>" data-type="terms" data-tax="<?php echo esc_attr( $taxonomy ); ?>" data-cols="<?php echo esc_attr( (string) $columns ); ?>">
				<span class="tf_sf_label" tabindex="0"><?php echo esc_html( $label ); ?></span>
				<div class="tf_sf_dropdown">
					<?php if ( $display_as === 'select' ) : ?>
						<select name="<?php echo esc_attr( $input_name ); ?>" class="tf_sf_select">
							<option value=""><?php echo esc_html( $label ); ?></option>
							<?php foreach ( $terms as $term ) :
								$depth = $hierarchy && isset( $term->tf_sf_depth ) ? (int) $term->tf_sf_depth : 0;
								$opt_label = $depth > 0 ? str_repeat( "\xC2\xA0\xC2\xA0", $depth ) . $term->name : $term->name;
								?>
								<option value="<?php echo esc_attr( $term->term_id ); ?>"><?php echo esc_html( $opt_label ); ?></option>
							<?php endforeach; ?>
						</select>
					<?php else : ?>
						<ul class="tf_sf_terms_list">
							<?php
							$group_open = false;
							foreach ( $terms as $term ) :
								$input_id = 'tf_sf_' . ( $el_id !== '' ? $el_id . '_' : '' ) . $fid . '_' . $term->term_id;
								$input_type = $display_as === 'radio' ? 'radio' : 'checkbox';
								$name = $display_as === 'radio' ? $input_name : $input_name . '[]';
								$depth = $hierarchy && isset( $term->tf_sf_depth ) ? (int) $term->tf_sf_depth : 0;
								if ( $hierarchy && $depth === 0 ) {
									if ( $group_open ) {
										echo '</ul></li>';
									}
									echo '<li class="tf_sf_term_group"><ul>';
									$group_open = true;
								}
								?>
								<li<?php echo $hierarchy ? ' style="--tf_sf_depth:' . esc_attr( (string) $depth ) . '"' : ''; ?>>
									<input type="<?php echo esc_attr( $input_type ); ?>" name="<?php echo esc_attr( $name ); ?>" id="<?php echo esc_attr( $input_id ); ?>" value="<?php echo esc_attr( $term->term_id ); ?>">
									<label for="<?php echo esc_attr( $input_id ); ?>"><?php echo esc_html( $term->name ); ?></label>
								</li>
							<?php endforeach;
							if ( $group_open ) {
								echo '</ul></li>';
							}
							?>
						</ul>
					<?php endif; ?>
				</div>
			</div>
			<?php
		}
		?>
	</div>
	<?php if ( $has_active ) : ?>
		<div class="tf_sf_active"></div>
	<?php endif; ?>
	<?php if ( $has_submit ) : ?>
		<div class="tf_sf_actions">
			<?php if ( $has_reset ) : ?>
				<button type="reset" class="tf_sf_reset tf_close" aria-label="<?php esc_attr_e( 'Reset', 'themify' ); ?>"></button>
			<?php endif; ?>
			<button type="submit" class="tf_sf_submit"><?php echo esc_html( $submit_text ); ?></button>
		</div>
	<?php endif; ?>
	</div>
</form>
<?php
