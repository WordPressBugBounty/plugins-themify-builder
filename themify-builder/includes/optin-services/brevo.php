<?php

defined('ABSPATH') || exit;

class Builder_Optin_Service_Brevo extends Builder_Optin_Service {

    public static function get_id():string {
        return 'brevo';
    }

    public static function get_label():string {
        return __('Brevo', 'themify');
    }

    public static function get_settings():array {
        $lists = self::get_lists();
        if (is_array($lists)) {
            return array(
                array(
                    'id' => 'brevo_list',
                    'type' => 'select',
                    'label' => __('List', 'themify'),
                    'options' => $lists,
                ),
            );
        } else {
            return array(
                array(
                    'type' => 'message',
                    'class' => 'tb_field_error_msg',
                    'comment' => $lists
                )
            );
        }
    }

    public function get_options():array {//backward for fw 7.5
        return self::get_settings();
    }

    public static function get_global_options():array {
        return array(
            array(
                'id' => 'brevo_key',
                'type' => 'text',
                'label' => __('Brevo API Key', 'themify'),
                'description' => sprintf(__('<a href="%s" target="_blank">Get an API key</a>', 'themify'), 'https://app.brevo.com/settings/keys/api'),
            ),
        );
    }

    private static function request($request, $method = 'GET', $args = array()) {
        $url = 'https://api.brevo.com/v3/' . $request;
        $args+= array(
            'method' => $method,
            'headers' => array(
                'api-key' => self::get_api_key(),
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ),
        );

        $response = wp_remote_request($url, $args);
        if (is_wp_error($response)) {
            return $response;
        } else {
            return json_decode(wp_remote_retrieve_body($response), true);
        }
    }

    protected static function request_list() {
        if (is_wp_error(( $data = self::request('contacts/lists?limit=50')))) {
            return $data;
        }
        if (isset($data['message'])) {
            return new WP_Error('error', $data['message']);
        }
        if (is_array($data) && isset($data['lists'])) {
            $lists = array();
            foreach ($data['lists'] as $v) {
                $lists[$v['id']] = $v['name'];
            }
            return $lists;
        }

        return new WP_Error('list_error', __('Error retrieving lists.', 'themify'));
    }

    public static function validate_data(array $fields_args):string {
        return isset($fields_args['brevo_list']) ? '' : __('No list is selected.', 'themify');
    }

    public static function subscribe(array $args) {
        $sub = self::request('contacts', 'POST', array(
            'body' => json_encode(array(
                'email' => $args['email'],
                'attributes' => array(
                    'FIRSTNAME' => $args['fname'],
                    'LASTNAME' => $args['lname'],
                ),
                'listIds' => array((int) $args['brevo_list']),
                'updateEnabled' => true,
            )),
        ));

        if (is_wp_error($sub)) {
            return $sub;
        }
        elseif (isset($sub['message'])) {
            return new WP_Error('error', $sub['message']);
        }
        else {
            return true;
        }
    }
}
