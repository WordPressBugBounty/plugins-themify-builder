<?php
/**
 * Template Table
 *
 * This template can be overridden by copying it to your child_theme_folder/themify-builder/template-table.php.
 *
 * Access original fields: $args['mod_settings']
 * @author Themify
 */

defined('ABSPATH') || exit;

$mod_name = $args['mod_name'];
$element_id = $args['module_ID'];
$fields_args = $args['mod_settings'] + array(
    'mod_title_table' => '',
    'table_content' => array(),
    'first_row_header' => 'yes',
    'freeze_table' => '',
    'css_table' => '',
);

$data = TB_Table_Module::parse_data($fields_args);
$col_count = (int) $data['col_count'];
$has_head = $col_count > 0 && $fields_args['first_row_header'] !== 'no';
$freeze_table = $fields_args['freeze_table'] === 'yes';
$has_widths = false;
if (!empty($data['cols'])) {
    foreach ($data['cols'] as $col) {
        if (!empty($col['width'])) {
            $has_widths = true;
            break;
        }
    }
}

$render_cell = static function ($cell) {
    return do_shortcode((string) $cell);
};

$container_class = apply_filters('themify_builder_module_classes', array(
    'module',
    'module-' . $mod_name,
    $element_id,
    $fields_args['css_table']
), $mod_name, $element_id, $fields_args);

if ($freeze_table) {
    $container_class[] = 'tb_freeze_table';
}

if (!empty($fields_args['global_styles']) && Themify_Builder::$frontedit_active === false) {
    $container_class[] = $fields_args['global_styles'];
}

$container_props = apply_filters('themify_builder_module_container_props', self::parse_animation_effect($fields_args, array(
    'class' => implode(' ', $container_class),
)), $fields_args, $mod_name, $element_id);

if (Themify_Builder::$frontedit_active === false) {
    $container_props['data-lazy'] = 1;
}

self::sticky_element_props($container_props, $fields_args);
?>
<!-- module table -->
<div <?php echo themify_get_element_attributes($container_props); ?>>
    <?php
    $container_props = $container_class = $args = null;
    echo Themify_Builder_Component_Module::get_module_title($fields_args, 'mod_title_table');
    ?>

    <div class="tb_table_wrap">
        <div class="tb_table_hscroll">
            <table class="tb_table">
                <?php if ($has_widths) : ?>
                    <colgroup>
                        <?php for ($i = 0; $i < $col_count; ++$i) :
                            $w = !empty($data['cols'][$i]['width']) ? $data['cols'][$i]['width'] : '';
                            ?>
                            <col<?php echo $w ? ' style="width:' . esc_attr($w) . '"' : ''; ?>>
                        <?php endfor; ?>
                    </colgroup>
                <?php endif; ?>
                <?php if ($has_head) : ?>
                <thead>
                    <tr>
                        <?php for ($i = 0; $i < $col_count; ++$i) :
                            $cell = isset($data['head'][$i]) ? $data['head'][$i] : '';
                            ?>
                            <th><?php echo $render_cell($cell); ?></th>
                        <?php endfor; ?>
                    </tr>
                </thead>
                <?php endif; ?>
                <tbody>
                    <?php if (!$has_head && $col_count > 0) : ?>
                        <tr>
                            <?php for ($i = 0; $i < $col_count; ++$i) :
                                $cell = isset($data['head'][$i]) ? $data['head'][$i] : '';
                                ?>
                                <td><?php echo $render_cell($cell); ?></td>
                            <?php endfor; ?>
                        </tr>
                    <?php endif; ?>
                    <?php foreach ($data['body'] as $row) : ?>
                        <tr>
                            <?php for ($i = 0; $i < $col_count; ++$i) :
                                $cell = isset($row[$i]) ? $row[$i] : '';
                                ?>
                                <td><?php echo $render_cell($cell); ?></td>
                            <?php endfor; ?>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div><!-- .tb_table_wrap -->

</div><!-- /module table -->
