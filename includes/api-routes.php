<?php
/**
 * REST API Routes - 8 Endpoints
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register all API routes
 */
function rdn_register_api_routes() {
    $namespace = 'rdn/v1';
    
    // 1. GET /situations-cache/:ecosystem/:tool/:id
    register_rest_route($namespace, '/situations-cache/(?P<ecosystem>[a-z0-9]+)/(?P<tool>[a-z0-9-]+)/(?P<id>[a-zA-Z0-9]+)', [
        'methods' => 'GET',
        'callback' => 'rdn_get_situation_cache',
        'permission_callback' => function() { return current_user_can('read'); },
        'args' => [
            'ecosystem' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'tool' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'id' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field']
        ]
    ]);
    
    // 2. POST /situations-cache
    register_rest_route($namespace, '/situations-cache', [
        'methods' => 'POST',
        'callback' => 'rdn_save_situation_cache',
        'permission_callback' => function() { return current_user_can('read'); },
        'args' => [
            'ecosystem_slug' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'tool_name' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'situation_id' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'situation_text' => ['required' => true, 'sanitize_callback' => 'sanitize_textarea_field'],
            'output' => ['required' => true, 'sanitize_callback' => 'sanitize_textarea_field'],
            'generator_user_id' => ['required' => false, 'sanitize_callback' => 'absint']
        ]
    ]);
    
    // 3. GET /modules-cache/:ecosystem/:id
    register_rest_route($namespace, '/modules-cache/(?P<ecosystem>[a-z0-9]+)/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'rdn_get_module_cache',
        'permission_callback' => function() { return current_user_can('read'); },
        'args' => [
            'ecosystem' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'id' => ['required' => true, 'sanitize_callback' => 'absint']
        ]
    ]);
    
    // 4. POST /modules-cache
    register_rest_route($namespace, '/modules-cache', [
        'methods' => 'POST',
        'callback' => 'rdn_save_module_cache',
        'permission_callback' => function() { return current_user_can('read'); },
        'args' => [
            'ecosystem_slug' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'module_id' => ['required' => true, 'sanitize_callback' => 'absint'],
            'module_type' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'sections' => ['required' => true],
            'generator_user_id' => ['required' => false, 'sanitize_callback' => 'absint']
        ]
    ]);
    
    // 5. POST /log-error
    register_rest_route($namespace, '/log-error', [
        'methods' => 'POST',
        'callback' => 'rdn_log_error',
        'permission_callback' => function() { return current_user_can('read'); },
        'args' => [
            'ecosystem_slug' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'error_message' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'error_stack' => ['required' => false, 'sanitize_callback' => 'sanitize_textarea_field'],
            'error_info' => ['required' => false],
            'user_id' => ['required' => false, 'sanitize_callback' => 'sanitize_text_field'],
            'tool_type' => ['required' => false, 'sanitize_callback' => 'sanitize_text_field']
        ]
    ]);
    
    // 6. GET /status/:ecosystem
    register_rest_route($namespace, '/status/(?P<ecosystem>[a-z0-9]+)', [
        'methods' => 'GET',
        'callback' => 'rdn_get_status',
        'permission_callback' => '__return_true',
        'args' => [
            'ecosystem' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field']
        ]
    ]);
    
    // 7. POST /chatbot
    register_rest_route($namespace, '/chatbot', [
        'methods' => 'POST',
        'callback' => 'rdn_chatbot_conversation',
        'permission_callback' => function() { return current_user_can('read'); },
        'args' => [
            'ecosystem_slug' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'user_id' => ['required' => true, 'sanitize_callback' => 'absint'],
            'message_user' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'conversation_id' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field']
        ]
    ]);
    
    // 8. GET /lists/:ecosystem/:type
    register_rest_route($namespace, '/lists/(?P<ecosystem>[a-z0-9]+)/(?P<type>[a-z_]+)', [
        'methods' => 'GET',
        'callback' => 'rdn_get_lists',
        'permission_callback' => '__return_true',
        'args' => [
            'ecosystem' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
            'type' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field']
        ]
    ]);
}

/**
 * 1. GET situation cache
 */
function rdn_get_situation_cache($request) {
    global $wpdb;
    
    $ecosystem = $request['ecosystem'];
    $tool = $request['tool'];
    $situation_id = $request['id'];
    
    // Verify ecosystem exists
    $eco_exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_ecosystems WHERE ecosystem_slug = %s AND is_active = 1",
        $ecosystem
    ));
    
    if (!$eco_exists) {
        return new WP_Error('invalid_ecosystem', 'Ecosistema non trovato', ['status' => 404]);
    }
    
    $cache = $wpdb->get_row($wpdb->prepare(
        "SELECT situation_text, output, timestamp FROM {$wpdb->prefix}rdn_situations_cache 
        WHERE ecosystem_slug = %s AND tool_name = %s AND situation_id = %s",
        $ecosystem,
        $tool,
        $situation_id
    ));
    
    if (!$cache) {
        return ['success' => false, 'error' => 'CACHE_MISS'];
    }
    
    return [
        'success' => true,
        'data' => [
            'situation_text' => $cache->situation_text,
            'output' => $cache->output,
            'timestamp' => $cache->timestamp
        ]
    ];
}

/**
 * 2. POST save situation cache
 */
function rdn_save_situation_cache($request) {
    global $wpdb;
    
    $ecosystem_slug = $request['ecosystem_slug'];
    $tool_name = $request['tool_name'];
    $situation_id = $request['situation_id'];
    $situation_text = $request['situation_text'];
    $output = $request['output'];
    $generator_user_id = $request['generator_user_id'] ?? null;
    
    // Verify ecosystem exists
    $eco_exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_ecosystems WHERE ecosystem_slug = %s AND is_active = 1",
        $ecosystem_slug
    ));
    
    if (!$eco_exists) {
        return new WP_Error('invalid_ecosystem', 'Ecosistema non trovato', ['status' => 404]);
    }
    
    // Check if already exists
    $exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_situations_cache 
        WHERE ecosystem_slug = %s AND tool_name = %s AND situation_id = %s",
        $ecosystem_slug,
        $tool_name,
        $situation_id
    ));
    
    if ($exists) {
        // Update existing
        $wpdb->update(
            $wpdb->prefix . 'rdn_situations_cache',
            [
                'output' => $output,
                'timestamp' => current_time('mysql')
            ],
            [
                'ecosystem_slug' => $ecosystem_slug,
                'tool_name' => $tool_name,
                'situation_id' => $situation_id
            ],
            ['%s', '%s'],
            ['%s', '%s', '%s']
        );
    } else {
        // Insert new
        $wpdb->insert(
            $wpdb->prefix . 'rdn_situations_cache',
            [
                'ecosystem_slug' => $ecosystem_slug,
                'tool_name' => $tool_name,
                'situation_id' => $situation_id,
                'situation_text' => $situation_text,
                'output' => $output,
                'generator_user_id' => $generator_user_id,
                'timestamp' => current_time('mysql')
            ],
            ['%s', '%s', '%s', '%s', '%s', '%d', '%s']
        );
    }
    
    return ['success' => true, 'message' => 'Cache salvata'];
}

/**
 * 3. GET module cache
 */
function rdn_get_module_cache($request) {
    global $wpdb;
    
    $ecosystem = $request['ecosystem'];
    $module_id = $request['id'];
    
    // Verify ecosystem exists
    $eco_exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_ecosystems WHERE ecosystem_slug = %s AND is_active = 1",
        $ecosystem
    ));
    
    if (!$eco_exists) {
        return new WP_Error('invalid_ecosystem', 'Ecosistema non trovato', ['status' => 404]);
    }
    
    $cache = $wpdb->get_row($wpdb->prepare(
        "SELECT sections, timestamp FROM {$wpdb->prefix}rdn_modules_cache 
        WHERE ecosystem_slug = %s AND module_id = %s",
        $ecosystem,
        $module_id
    ));
    
    if (!$cache) {
        return ['success' => false, 'error' => 'CACHE_MISS'];
    }
    
    return [
        'success' => true,
        'data' => [
            'sections' => json_decode($cache->sections, true),
            'generated' => true,
            'timestamp' => $cache->timestamp
        ]
    ];
}

/**
 * 4. POST save module cache
 */
function rdn_save_module_cache($request) {
    global $wpdb;
    
    $ecosystem_slug = $request['ecosystem_slug'];
    $module_id = $request['module_id'];
    $module_type = $request['module_type'];
    $sections = $request['sections'];
    $generator_user_id = $request['generator_user_id'] ?? null;
    
    // Verify ecosystem exists
    $eco_exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_ecosystems WHERE ecosystem_slug = %s AND is_active = 1",
        $ecosystem_slug
    ));
    
    if (!$eco_exists) {
        return new WP_Error('invalid_ecosystem', 'Ecosistema non trovato', ['status' => 404]);
    }
    
    // Validate sections is valid JSON
    if (is_array($sections)) {
        $sections_json = json_encode($sections);
    } else {
        $sections_json = $sections;
    }
    
    // Check if already exists
    $exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_modules_cache 
        WHERE ecosystem_slug = %s AND module_id = %s",
        $ecosystem_slug,
        $module_id
    ));
    
    if ($exists) {
        // Update existing
        $wpdb->update(
            $wpdb->prefix . 'rdn_modules_cache',
            [
                'sections' => $sections_json,
                'timestamp' => current_time('mysql')
            ],
            [
                'ecosystem_slug' => $ecosystem_slug,
                'module_id' => $module_id
            ],
            ['%s', '%s'],
            ['%s', '%d']
        );
    } else {
        // Insert new
        $wpdb->insert(
            $wpdb->prefix . 'rdn_modules_cache',
            [
                'ecosystem_slug' => $ecosystem_slug,
                'module_id' => $module_id,
                'module_type' => $module_type,
                'sections' => $sections_json,
                'generator_user_id' => $generator_user_id,
                'timestamp' => current_time('mysql')
            ],
            ['%s', '%d', '%s', '%s', '%d', '%s']
        );
    }
    
    return ['success' => true, 'message' => 'Modulo salvato'];
}

/**
 * 5. POST log error
 */
function rdn_log_error($request) {
    global $wpdb;
    
    $ecosystem_slug = $request['ecosystem_slug'];
    $error_message = $request['error_message'];
    $error_stack = $request['error_stack'] ?? '';
    $error_info = $request['error_info'] ?? null;
    $user_id = $request['user_id'] ?? '';
    $tool_type = $request['tool_type'] ?? '';
    
    // Convert error_info to JSON if array
    if (is_array($error_info)) {
        $error_info = json_encode($error_info);
    }
    
    $wpdb->insert(
        $wpdb->prefix . 'rdn_error_logs',
        [
            'ecosystem_slug' => $ecosystem_slug,
            'error_message' => $error_message,
            'error_stack' => $error_stack,
            'error_info' => $error_info,
            'user_id' => $user_id,
            'tool_type' => $tool_type,
            'timestamp' => current_time('mysql')
        ],
        ['%s', '%s', '%s', '%s', '%s', '%s', '%s']
    );
    
    return [
        'success' => true,
        'id' => $wpdb->insert_id
    ];
}

/**
 * 6. GET status (maintenance check)
 */
function rdn_get_status($request) {
    $ecosystem = $request['ecosystem'];
    
    // Check for maintenance mode transient
    $maintenance = get_transient('rdn_maintenance_' . $ecosystem);
    
    if ($maintenance) {
        return [
            'status' => 'maintenance',
            'estimated_end' => $maintenance['estimated_end'] ?? null,
            'message' => $maintenance['message'] ?? 'Sistema in manutenzione'
        ];
    }
    
    return [
        'status' => 'ok',
        'message' => 'Sistema operativo'
    ];
}

/**
 * 7. POST chatbot conversation
 */
function rdn_chatbot_conversation($request) {
    global $wpdb;
    
    $ecosystem_slug = $request['ecosystem_slug'];
    $user_id = $request['user_id'];
    $message_user = $request['message_user'];
    $conversation_id = $request['conversation_id'];
    
    // Validate message length
    if (strlen($message_user) > 500) {
        return new WP_Error('message_too_long', 'Messaggio troppo lungo (max 500 caratteri)', ['status' => 400]);
    }
    
    // Verify ecosystem exists
    $eco_exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_ecosystems WHERE ecosystem_slug = %s AND is_active = 1",
        $ecosystem_slug
    ));
    
    if (!$eco_exists) {
        return new WP_Error('invalid_ecosystem', 'Ecosistema non trovato', ['status' => 404]);
    }
    
    // Get universal FAQs
    $universal_faq = get_option('rdn_faq_universal', '[]');
    $universal_faq_array = json_decode($universal_faq, true);
    
    // Get ecosystem-specific chatbot config
    $chatbot_config = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}rdn_chatbot_config WHERE ecosystem_slug = %s",
        $ecosystem_slug
    ));
    
    $specific_faq_array = [];
    if ($chatbot_config && !empty($chatbot_config->faq_specific)) {
        $specific_faq_array = json_decode($chatbot_config->faq_specific, true);
    }
    
    // Check FAQ match first (exact or partial)
    $message_lower = strtolower($message_user);
    $faq_match = null;
    
    // Check universal FAQs
    foreach ($universal_faq_array as $faq) {
        if (stripos($message_lower, strtolower($faq['question'])) !== false || 
            stripos(strtolower($faq['question']), $message_lower) !== false) {
            $faq_match = $faq['answer'];
            break;
        }
    }
    
    // Check specific FAQs if no universal match
    if (!$faq_match && $specific_faq_array) {
        foreach ($specific_faq_array as $faq) {
            if (stripos($message_lower, strtolower($faq['question'])) !== false || 
                stripos(strtolower($faq['question']), $message_lower) !== false) {
                $faq_match = $faq['answer'];
                break;
            }
        }
    }
    
    // Prepare response
    $response_data = ['success' => true];
    
    if ($faq_match) {
        // FAQ match found - instant response
        $response_data['message_bot'] = $faq_match;
    } else {
        // No FAQ match - would call AI here (simplified for now)
        // In production: call RunPod API with prompt containing FAQs and user message
        $response_data['message_bot'] = "Grazie per la tua domanda. Per assistenza personalizzata, contatta il supporto.";
        
        // Check if consultation needed (keywords)
        if (preg_match('/\b(consulenza|appuntamento|parlare|aiuto personale)\b/i', $message_lower)) {
            if ($chatbot_config && $chatbot_config->consultations_enabled && !empty($chatbot_config->consultation_url)) {
                $response_data['consultation_url'] = $chatbot_config->consultation_url;
            }
        }
        
        // Check if support needed (keywords)
        if (preg_match('/\b(problema|errore|bug|non funziona|supporto tecnico)\b/i', $message_lower)) {
            if ($chatbot_config && !empty($chatbot_config->support_url)) {
                $response_data['support_url'] = $chatbot_config->support_url;
            }
        }
    }
    
    // Save conversation to database
    $wpdb->insert(
        $wpdb->prefix . 'rdn_chatbot_conversations',
        [
            'ecosystem_slug' => $ecosystem_slug,
            'user_id' => $user_id,
            'conversation_id' => $conversation_id,
            'message_user' => $message_user,
            'message_bot' => $response_data['message_bot'],
            'timestamp' => current_time('mysql')
        ],
        ['%s', '%d', '%s', '%s', '%s', '%s']
    );
    
    return $response_data;
}

/**
 * 8. GET lists
 */
function rdn_get_lists($request) {
    global $wpdb;
    
    $ecosystem = $request['ecosystem'];
    $type = $request['type'];
    
    $eco_exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_ecosystems WHERE ecosystem_slug = %s AND is_active = 1",
        $ecosystem
    ));
    
    if (!$eco_exists) {
        return new WP_Error('invalid_ecosystem', 'Ecosistema non trovato', ['status' => 404]);
    }
    
    $list = $wpdb->get_row($wpdb->prepare(
        "SELECT list_data FROM {$wpdb->prefix}rdn_lists 
        WHERE ecosystem_slug = %s AND list_type = %s",
        $ecosystem,
        $type
    ));
    
    if (!$list) {
        return new WP_Error('not_found', 'Liste non trovate', ['status' => 404]);
    }
    
    return [
        'success' => true,
        'list_data' => $list->list_data
    ];
}