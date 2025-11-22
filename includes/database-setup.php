<?php
/**
 * Database Setup - Create 21 tables and default ecosystem
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Create all 22 tables
 */
function rdn_create_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    // 18 tables with ecosystem_slug
    
    // 1. rdn_users
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        email VARCHAR(255),
        level INT DEFAULT 1,
        joined_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_eco_user (ecosystem_slug, user_id),
        INDEX idx_ecosystem (ecosystem_slug),
        INDEX idx_level (level)
    ) $charset_collate;";

    // 2. rdn_mood_daily
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_mood_daily (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        mood VARCHAR(20),
        time_available INT,
        energy_level VARCHAR(10),
        date DATE NOT NULL,
        INDEX idx_eco_user_date (ecosystem_slug, user_id, date)
    ) $charset_collate;";

    // 3. rdn_reinforcement_history
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_reinforcement_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        category VARCHAR(50),
        mood VARCHAR(20),
        reinforcement_text TEXT,
        audio_played BOOLEAN DEFAULT 0,
        streak_count INT DEFAULT 1,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_eco_user_date (ecosystem_slug, user_id, date)
    ) $charset_collate;";

    // 4. rdn_objectives_progress
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_objectives_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        objective_id INT NOT NULL,
        start_value INT,
        current_value INT,
        target_value INT,
        start_date DATE,
        completion_date DATE,
        status VARCHAR(20),
        INDEX idx_eco_user_objective (ecosystem_slug, user_id, objective_id)
    ) $charset_collate;";

    // 5. rdn_percorso_progress
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_percorso_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        module_number INT NOT NULL,
        completion_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        pre_intensity INT,
        post_intensity INT,
        INDEX idx_eco_user_module (ecosystem_slug, user_id, module_number)
    ) $charset_collate;";

    // 6. rdn_transformer_usage
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_transformer_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        level VARCHAR(10),
        type VARCHAR(20),
        category VARCHAR(100),
        refinement VARCHAR(200),
        context_text TEXT,
        pre_intensity INT,
        post_intensity INT,
        variant_applied BOOLEAN DEFAULT 0,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_eco_user_date (ecosystem_slug, user_id, date)
    ) $charset_collate;";

    // 7. rdn_scudo_history
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_scudo_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        tool_type VARCHAR(50),
        dimension VARCHAR(50),
        tab_type VARCHAR(50),
        situation_text TEXT,
        output_summary TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        mood VARCHAR(20),
        INDEX idx_eco_user_date (ecosystem_slug, user_id, timestamp)
    ) $charset_collate;";

    // 8. rdn_sos_history
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_sos_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        situation_text TEXT,
        intensity INT,
        pre_intensity INT,
        post_intensity INT,
        protocol_used TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        pattern_detected BOOLEAN DEFAULT 0,
        INDEX idx_eco_user_date (ecosystem_slug, user_id, timestamp)
    ) $charset_collate;";

    // 9. rdn_spada_history
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_spada_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        phrase TEXT,
        module_type VARCHAR(50),
        module_id INT,
        module_title VARCHAR(255),
        week_start DATE,
        week_end DATE,
        days_completed INT DEFAULT 0,
        visualizations INT DEFAULT 0,
        shares INT DEFAULT 0,
        INDEX idx_eco_user_week (ecosystem_slug, user_id, week_start)
    ) $charset_collate;";

    // 10. rdn_weekly_goal
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_weekly_goal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        goal_type VARCHAR(20),
        goal_id INT,
        start_date DATE,
        end_date DATE,
        lock_until DATE,
        status VARCHAR(20),
        INDEX idx_eco_user_active (ecosystem_slug, user_id, status)
    ) $charset_collate;";

    // 11. rdn_ai_calls
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_ai_calls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        tool_type VARCHAR(50),
        status VARCHAR(20),
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_eco_user_date (ecosystem_slug, user_id, date)
    ) $charset_collate;";

    // 12. rdn_emergency_events
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_emergency_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        detected_keywords TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_eco_user_date (ecosystem_slug, user_id, date)
    ) $charset_collate;";

    // 13. rdn_modules_cache
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_modules_cache (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        module_id INT NOT NULL,
        module_type VARCHAR(50),
        sections TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        generator_user_id INT,
        UNIQUE KEY unique_eco_module (ecosystem_slug, module_id),
        INDEX idx_eco_type (ecosystem_slug, module_type)
    ) $charset_collate;";

    // 14. rdn_situations_cache
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_situations_cache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        tool_name VARCHAR(50) NOT NULL,
        situation_id VARCHAR(100) NOT NULL,
        situation_text TEXT,
        output TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        generator_user_id INT,
        UNIQUE KEY unique_eco_situation (ecosystem_slug, tool_name, situation_id),
        INDEX idx_eco_tool (ecosystem_slug, tool_name)
    ) $charset_collate;";

    // 15. wp_rdn_codes
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_codes (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        code_name VARCHAR(100) NOT NULL,
        code_category VARCHAR(50) NOT NULL,
        code_content LONGTEXT NOT NULL,
        version INT DEFAULT 1,
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        UNIQUE KEY unique_eco_code (ecosystem_slug, code_name),
        INDEX idx_ecosystem (ecosystem_slug)
    ) $charset_collate;";

    // 16. wp_rdn_ecosystems
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_ecosystems (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) UNIQUE NOT NULL,
        ecosystem_name VARCHAR(255) NOT NULL,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        codes_count INT DEFAULT 0,
        INDEX idx_slug (ecosystem_slug),
        INDEX idx_active (is_active)
    ) $charset_collate;";

    // 17. wp_rdn_error_logs
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_error_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        error_message TEXT NOT NULL,
        error_stack TEXT,
        error_info TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(50),
        tool_type VARCHAR(50),
        INDEX idx_eco_timestamp (ecosystem_slug, timestamp)
    ) $charset_collate;";

    // 18. rdn_user_analytics
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_user_analytics (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        event_name VARCHAR(100),
        event_metadata TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_eco_user_event (ecosystem_slug, user_id, event_name)
    ) $charset_collate;";

    // 3 chatbot tables (last 3)
    
    // 19. wp_rdn_chatbot_code (NO ecosystem_slug - universal)
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_chatbot_code (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        code_content LONGTEXT NOT NULL,
        version INT DEFAULT 1,
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) $charset_collate;";

    // 20. rdn_chatbot_config (has ecosystem_slug)
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_chatbot_config (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        consultations_enabled BOOLEAN DEFAULT 0,
        consultation_url VARCHAR(500),
        support_url VARCHAR(500),
        faq_specific TEXT,
        INDEX idx_ecosystem (ecosystem_slug)
    ) $charset_collate;";

    // 21. rdn_chatbot_conversations (has ecosystem_slug)
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_chatbot_conversations (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        user_id INT NOT NULL,
        conversation_id VARCHAR(100) NOT NULL,
        message_user TEXT,
        message_bot TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_eco_user (ecosystem_slug, user_id),
        INDEX idx_conversation (conversation_id)
    ) $charset_collate;";

// 22. rdn_lists
    $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}rdn_lists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ecosystem_slug VARCHAR(50) NOT NULL,
        list_type VARCHAR(100) NOT NULL,
        list_data LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_list (ecosystem_slug, list_type),
        INDEX idx_ecosystem (ecosystem_slug)
    ) $charset_collate;";

    // Execute all queries
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    foreach ($sql as $query) {
        dbDelta($query);
    }
}

/**
 * Verify tables exist
 */
function rdn_verify_tables() {
    global $wpdb;
    
    $tables = [
        'rdn_users', 'rdn_mood_daily', 'rdn_reinforcement_history', 'rdn_objectives_progress',
        'rdn_percorso_progress', 'rdn_transformer_usage', 'rdn_scudo_history', 'rdn_sos_history',
        'rdn_spada_history', 'rdn_weekly_goal', 'rdn_ai_calls', 'rdn_emergency_events',
        'rdn_modules_cache', 'rdn_situations_cache', 'rdn_codes', 'rdn_ecosystems',
        'rdn_error_logs', 'rdn_user_analytics', 'rdn_chatbot_code', 'rdn_chatbot_config',
        'rdn_chatbot_conversations', 'rdn_lists'
    ];
    
    $existing = [];
    foreach ($tables as $table) {
        $table_name = $wpdb->prefix . $table;
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name) {
            $existing[] = $table;
        }
    }
    
    return $existing;
}

/**
 * Create default "rdn" ecosystem
 */
function rdn_create_default_ecosystem() {
    global $wpdb;
    
    // Check if "rdn" ecosystem already exists
    $exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_ecosystems WHERE ecosystem_slug = %s",
        'rdn'
    ));
    
    if ($exists > 0) {
        return; // Already exists
    }
    
    // Create "rdn" ecosystem
    $wpdb->insert(
        $wpdb->prefix . 'rdn_ecosystems',
        [
            'ecosystem_slug' => 'rdn',
            'ecosystem_name' => 'RDN Default',
            'is_active' => 1,
            'codes_count' => 0
        ],
        ['%s', '%s', '%d', '%d']
    );
    
    // Create 23 empty code slots
    $codes = [
        // GENERALI (5)
        ['utils.js', 'generali'],
        ['hooks.js', 'generali'],
        ['components.js', 'generali'],
        ['AppWrapper.jsx', 'generali'],
        ['LegalModals.jsx', 'generali'],
        // LISTE/OUTPUT (2)
        ['liste.js', 'liste'],
        ['output-ia.js', 'output'],
        // VIRALITÀ (1)
        ['viralita.js', 'viralita'],
        // SCHERMATE (3)
        ['schermata1.jsx', 'schermate'],
        ['schermata2.jsx', 'schermate'],
        ['schermata3.jsx', 'schermate'],
        // TOOLS S1-S2 (3)
        ['motivatore.jsx', 'tools-s1-s2'],
        ['test-globale.jsx', 'tools-s1-s2'],
        ['test-settimanale.jsx', 'tools-s1-s2'],
        // TOOLS S3 (9)
        ['rinforzo.jsx', 'tools-s3'],
        ['trasformatore-base.jsx', 'tools-s3'],
        ['scudo.jsx', 'tools-s3'],
        ['sos.jsx', 'tools-s3'],
        ['spada.jsx', 'tools-s3'],
        ['trasformatore-avanzato.jsx', 'tools-s3'],
        ['cdfp.jsx', 'tools-s3'],
        ['obiettivi.jsx', 'tools-s3'],
        ['percorso.jsx', 'tools-s3']
    ];
    
    foreach ($codes as $code) {
        $wpdb->insert(
            $wpdb->prefix . 'rdn_codes',
            [
                'ecosystem_slug' => 'rdn',
                'code_name' => $code[0],
                'code_category' => $code[1],
                'code_content' => "// Inserisci codice React per {$code[0]}",
                'version' => 1,
                'is_active' => 1
            ],
            ['%s', '%s', '%s', '%s', '%d', '%d']
        );
    }
    
    // Create default chatbot config for "rdn"
    $wpdb->insert(
        $wpdb->prefix . 'rdn_chatbot_config',
        [
            'ecosystem_slug' => 'rdn',
            'consultations_enabled' => 0,
            'consultation_url' => '',
            'support_url' => '',
            'faq_specific' => '[]'
        ],
        ['%s', '%d', '%s', '%s', '%s']
    );
    
    // Create empty universal chatbot code if not exists
    $chatbot_exists = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}rdn_chatbot_code");
    if ($chatbot_exists == 0) {
        $wpdb->insert(
            $wpdb->prefix . 'rdn_chatbot_code',
            [
                'code_content' => '// Inserisci codice React chatbot.jsx universale',
                'version' => 1
            ],
            ['%s', '%d']
        );
    }
    
    // Create default universal FAQs in wp_options
    $default_faq = [
        [
            'question' => 'Quando vedrò i risultati?',
            'answer' => 'I risultati variano da persona a persona, ma in genere si notano miglioramenti dopo 2-8 settimane di uso costante degli strumenti.'
        ],
        [
            'question' => 'Come funziona il pagamento?',
            'answer' => 'L\'abbonamento è gestito tramite aMember con pagamenti settimanali ricorrenti.'
        ],
        [
            'question' => 'Posso cancellare l\'abbonamento?',
            'answer' => 'Sì, puoi cancellare in qualsiasi momento direttamente dal tuo account aMember.'
        ]
    ];
    
    add_option('rdn_faq_universal', json_encode($default_faq, JSON_UNESCAPED_UNICODE));
    
    // Create default config for "rdn" ecosystem
    $default_config = [
        'ai_providers' => [
            'runpod' => [
                'endpoint' => '',
                'api_key' => '',
                'timeout' => 15000
            ],
            'fallback1' => [],
            'fallback2' => []
        ],
        'amember' => [
            'product_id_l1' => '',
            'product_id_l2' => '',
            'login_url' => '/amember/login'
        ],
        'company' => [
            'name' => '',
            'owner' => '',
            'email' => '',
            'address' => '',
            'tax_id' => '',
            'emergency_numbers' => [
                'primary' => '112',
                'secondary' => '800 86 00 22'
            ]
        ],
        'analytics' => [
            'tracking_id' => '',
            'enabled' => false
        ],
        'rate_limits' => [
            'level1' => ['daily' => 5, 'sos' => 3],
            'level2' => ['daily' => 15, 'sos' => 3]
        ]
    ];
    
    add_option('rdn_config_rdn', $default_config);
}
