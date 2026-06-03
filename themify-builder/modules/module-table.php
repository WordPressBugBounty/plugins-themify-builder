<?php
defined('ABSPATH') || exit;

/**
 * Module Name: Table
 * Description: Display responsive data tables
 */
class TB_Table_Module extends Themify_Builder_Component_Module {

    public static function get_module_name():string {
        return __('Table', 'themify');
    }

    public static function get_module_icon():string {
        return 'layout-grid2';
    }

    public static function get_js_css():array {
        return array(
            'css' => 1,
            'js' => 1,
            'match' => '.module-table.tb_freeze_table',
        );
    }

    /**
     * Normalize stored table data into head/body/cols arrays.
     */
    public static function parse_data(array $mod_settings):array {
        $data = isset($mod_settings['table_content']) ? $mod_settings['table_content'] : array();
        if (is_string($data)) {
            $data = json_decode($data, true);
        }
        $data = (array) $data + array(
            'head' => array(),
            'body' => array(),
            'cols' => array(),
        );
        $col_count = isset($data['col_count']) ? (int) $data['col_count'] : 0;
        if ($col_count === 0) {
            $col_count = count($data['head']);
            foreach ($data['body'] as $row) {
                $col_count = max($col_count, count((array) $row));
            }
        }
        $head = array();
        for ($i = 0; $i < $col_count; ++$i) {
            $head[$i] = isset($data['head'][$i]) ? (string) $data['head'][$i] : '';
        }
        $data['head'] = $head;
        for ($i = 0; $i < $col_count; ++$i) {
            if (!isset($data['cols'][$i])) {
                $data['cols'][$i] = array('stack' => true, 'width' => '');
            } else {
                $data['cols'][$i] = (array) $data['cols'][$i] + array('stack' => true, 'width' => '');
            }
        }
        foreach ($data['body'] as $r => $row) {
            $row = array_values((array) $row);
            for ($i = 0; $i < $col_count; ++$i) {
                if (!isset($row[$i])) {
                    $row[$i] = '';
                }
            }
            $data['body'][$r] = array_slice($row, 0, $col_count);
        }
        $data['col_count'] = $col_count;
        return $data;
    }

    public static function get_static_content(array $module):string {
        $data = self::parse_data($module['mod_settings']);
        if (empty($data['head']) && empty($data['body'])) {
            return '';
        }
        $output = '<table>';
        $col_count = (int) $data['col_count'];
        if (!empty($data['head'])) {
            $output .= '<thead><tr>';
            for ($i = 0; $i < $col_count; ++$i) {
                $cell = isset($data['head'][$i]) ? $data['head'][$i] : '';
                $output .= '<th>' . wp_kses_post($cell) . '</th>';
            }
            $output .= '</tr></thead>';
        }
        if (!empty($data['body'])) {
            $output .= '<tbody>';
            foreach ($data['body'] as $row) {
                $output .= '<tr>';
                for ($i = 0; $i < $col_count; ++$i) {
                    $cell = isset($row[$i]) ? $row[$i] : '';
                    $output .= '<td>' . wp_kses_post($cell) . '</td>';
                }
                $output .= '</tr>';
            }
            $output .= '</tbody>';
        }
        $output .= '</table>';
        return $output;
    }

    public static function get_translatable_fields($module, $classname):array {
        $fields = array();
        $data = self::parse_data($module['mod_settings']);
        foreach ($data['head'] as $i => $cell) {
            $fields[] = array('id' => 'head-' . $i, 'value' => $cell);
        }
        foreach ($data['body'] as $r => $row) {
            foreach ((array) $row as $c => $cell) {
                $fields[] = array('id' => 'body-' . $r . '_' . $c, 'value' => $cell);
            }
        }
        return $fields;
    }

    public static function translate_module($module_data, $translations) {
        $data = self::parse_data($module_data['mod_settings']);
        foreach ($translations as $key => $value) {
            list($scope, $pos) = explode('-', $key);
            if ($scope === 'head') {
                $data['head'][(int) $pos] = $value;
            } elseif ($scope === 'body') {
                list($r, $c) = explode('_', $pos);
                $data['body'][(int) $r][(int) $c] = $value;
            }
        }
        unset($data['col_count']);
        $module_data['mod_settings']['table_content'] = $data;
        return $module_data;
    }
}
