<?php
/**
 * Admin Panel - 6 Sections Interface
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render admin panel
 */
function rdn_render_admin_panel() {
    global $wpdb;
    
    // Enqueue admin styles
    wp_enqueue_style('rdn-admin-styles', RDN_PLUGIN_URL . 'assets/css/admin-styles.css', [], RDN_PLUGIN_VERSION);
    
    // Get current tab
    $current_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'ecosystems';
    
    // Get selected ecosystem from session or first active
    $selected_ecosystem = isset($_GET['ecosystem']) ? sanitize_text_field($_GET['ecosystem']) : '';
    if (empty($selected_ecosystem)) {
        $selected_ecosystem = $wpdb->get_var("SELECT ecosystem_slug FROM {$wpdb->prefix}rdn_ecosystems WHERE is_active = 1 ORDER BY id ASC LIMIT 1");
    }
    
    ?>
    <div class="wrap rdn-admin-wrap">
        <h1>RDN Multi-Ecosystem Manager</h1>
        
        <?php if ($current_tab !== 'ecosystems'): ?>
        <!-- Ecosystem Switcher -->
        <div class="rdn-ecosystem-switcher">
            <label>Ecosistema in editing:</label>
            <select id="rdn-ecosystem-select" onchange="rdnSwitchEcosystem(this.value)">
                <?php
                $ecosystems = $wpdb->get_results("SELECT ecosystem_slug, ecosystem_name FROM {$wpdb->prefix}rdn_ecosystems WHERE is_active = 1");
                foreach ($ecosystems as $eco) {
                    $selected = ($eco->ecosystem_slug === $selected_ecosystem) ? 'selected' : '';
                    echo "<option value='{$eco->ecosystem_slug}' {$selected}>{$eco->ecosystem_name} [{$eco->ecosystem_slug}]</option>";
                }
                ?>
            </select>
        </div>
        <?php endif; ?>
        
        <!-- Navigation Tabs -->
        <nav class="nav-tab-wrapper">
            <a href="?page=rdn-manager&tab=ecosystems" class="nav-tab <?php echo $current_tab === 'ecosystems' ? 'nav-tab-active' : ''; ?>">Gestione Ecosistemi</a>
            <a href="?page=rdn-manager&tab=codes&ecosystem=<?php echo $selected_ecosystem; ?>" class="nav-tab <?php echo $current_tab === 'codes' ? 'nav-tab-active' : ''; ?>">Gestione Codici</a>
            <a href="?page=rdn-manager&tab=config&ecosystem=<?php echo $selected_ecosystem; ?>" class="nav-tab <?php echo $current_tab === 'config' ? 'nav-tab-active' : ''; ?>">Configurazioni</a>
            <a href="?page=rdn-manager&tab=database&ecosystem=<?php echo $selected_ecosystem; ?>" class="nav-tab <?php echo $current_tab === 'database' ? 'nav-tab-active' : ''; ?>">Database Status</a>
            <a href="?page=rdn-manager&tab=logs&ecosystem=<?php echo $selected_ecosystem; ?>" class="nav-tab <?php echo $current_tab === 'logs' ? 'nav-tab-active' : ''; ?>">Logs Debug</a>
            <a href="?page=rdn-manager&tab=chatbot" class="nav-tab <?php echo $current_tab === 'chatbot' ? 'nav-tab-active' : ''; ?>">Chatbot IA Universale</a>
        </nav>
        
        <!-- Tab Content -->
        <div class="rdn-tab-content">
            <?php
            switch ($current_tab) {
                case 'ecosystems':
                    rdn_render_ecosystems_tab();
                    break;
                case 'codes':
                    rdn_render_codes_tab($selected_ecosystem);
                    break;
                case 'config':
                    rdn_render_config_tab($selected_ecosystem);
                    break;
                case 'database':
                    rdn_render_database_tab($selected_ecosystem);
                    break;
                case 'logs':
                    rdn_render_logs_tab($selected_ecosystem);
                    break;
                case 'chatbot':
                    rdn_render_chatbot_tab();
                    break;
            }
            ?>
        </div>
    </div>
    
    <script>
    function rdnSwitchEcosystem(slug) {
        const currentTab = '<?php echo $current_tab; ?>';
        window.location.href = '?page=rdn-manager&tab=' + currentTab + '&ecosystem=' + slug;
    }
    </script>
    <?php
}

/**
 * SEZIONE 0: Gestione Ecosistemi
 */
function rdn_render_ecosystems_tab() {
    global $wpdb;
    
    // Handle form submissions
    if (isset($_POST['rdn_create_ecosystem']) && check_admin_referer('rdn_create_ecosystem')) {
        $slug = sanitize_text_field($_POST['ecosystem_slug']);
        $name = sanitize_text_field($_POST['ecosystem_name']);
        
        // Validate slug
        if (!preg_match('/^[a-z0-9]{1,10}$/', $slug)) {
            echo '<div class="notice notice-error"><p>Slug non valido. Usa solo lettere minuscole e numeri, max 10 caratteri.</p></div>';
        } else {
            // Create ecosystem
            $wpdb->insert(
                $wpdb->prefix . 'rdn_ecosystems',
                ['ecosystem_slug' => $slug, 'ecosystem_name' => $name, 'is_active' => 1, 'codes_count' => 0],
                ['%s', '%s', '%d', '%d']
            );
            
            // Create 23 empty codes
            $codes = [
                ['utils.js', 'generali'], ['hooks.js', 'generali'], ['components.js', 'generali'], 
                ['AppWrapper.jsx', 'generali'], ['LegalModals.jsx', 'generali'],
                ['liste.js', 'liste'], ['output-ia.js', 'output'], ['viralita.js', 'viralita'],
                ['schermata1.jsx', 'schermate'], ['schermata2.jsx', 'schermate'], ['schermata3.jsx', 'schermate'],
                ['motivatore.jsx', 'tools-s1-s2'], ['test-globale.jsx', 'tools-s1-s2'], ['test-settimanale.jsx', 'tools-s1-s2'],
                ['rinforzo.jsx', 'tools-s3'], ['trasformatore-base.jsx', 'tools-s3'], ['scudo.jsx', 'tools-s3'],
                ['sos.jsx', 'tools-s3'], ['spada.jsx', 'tools-s3'], ['trasformatore-avanzato.jsx', 'tools-s3'],
                ['cdfp.jsx', 'tools-s3'], ['obiettivi.jsx', 'tools-s3'], ['percorso.jsx', 'tools-s3']
            ];
            
            foreach ($codes as $code) {
                $wpdb->insert(
                    $wpdb->prefix . 'rdn_codes',
                    [
                        'ecosystem_slug' => $slug,
                        'code_name' => $code[0],
                        'code_category' => $code[1],
                        'code_content' => "// Inserisci codice React per {$code[0]}",
                        'version' => 1,
                        'is_active' => 1
                    ],
                    ['%s', '%s', '%s', '%s', '%d', '%d']
                );
            }
            
            // Create chatbot config
            $wpdb->insert(
                $wpdb->prefix . 'rdn_chatbot_config',
                ['ecosystem_slug' => $slug, 'consultations_enabled' => 0, 'faq_specific' => '[]'],
                ['%s', '%d', '%s']
            );
            
            // Create default config
            add_option('rdn_config_' . $slug, [
                'ai_providers' => [
                    'primary' => sanitize_text_field($_POST['primary_provider']),
    'runpod' => [
        'endpoint' => sanitize_url($_POST['runpod_endpoint']),
        'api_key' => sanitize_text_field($_POST['runpod_api_key']),
        'timeout' => intval($_POST['runpod_timeout'])
    ],
    'fallback1' => [
        'endpoint' => sanitize_url($_POST['fallback1_endpoint']),
        'api_key' => sanitize_text_field($_POST['fallback1_api_key']),
        'timeout' => 15000
    ],
    'fallback2' => [
        'endpoint' => sanitize_url($_POST['fallback2_endpoint']),
        'api_key' => sanitize_text_field($_POST['fallback2_api_key']),
        'timeout' => 15000
    ]
],
                'amember' => ['product_id_l1' => '', 'product_id_l2' => '', 'login_url' => '/amember/login'],
                'company' => ['emergency_numbers' => ['primary' => '112', 'secondary' => '800 86 00 22']],
                'rate_limits' => ['level1' => ['daily' => 5, 'sos' => 3], 'level2' => ['daily' => 15, 'sos' => 3]]
            ]);
            
            echo '<div class="notice notice-success"><p>Ecosistema creato con successo!</p></div>';
        }
    }
    
    // Handle delete
    if (isset($_POST['rdn_delete_ecosystem']) && check_admin_referer('rdn_delete_ecosystem')) {
        $slug = sanitize_text_field($_POST['ecosystem_slug']);
        $wpdb->delete($wpdb->prefix . 'rdn_ecosystems', ['ecosystem_slug' => $slug], ['%s']);
        $wpdb->delete($wpdb->prefix . 'rdn_codes', ['ecosystem_slug' => $slug], ['%s']);
        delete_option('rdn_config_' . $slug);
        echo '<div class="notice notice-success"><p>Ecosistema eliminato.</p></div>';
    }
    
    // Handle toggle active
    if (isset($_POST['rdn_toggle_ecosystem']) && check_admin_referer('rdn_toggle_ecosystem')) {
        $slug = sanitize_text_field($_POST['ecosystem_slug']);
        $current = $wpdb->get_var($wpdb->prepare("SELECT is_active FROM {$wpdb->prefix}rdn_ecosystems WHERE ecosystem_slug = %s", $slug));
        $wpdb->update($wpdb->prefix . 'rdn_ecosystems', ['is_active' => !$current], ['ecosystem_slug' => $slug], ['%d'], ['%s']);
        echo '<div class="notice notice-success"><p>Status aggiornato.</p></div>';
    }
    
    // Get ecosystems
    $ecosystems = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rdn_ecosystems ORDER BY created_date DESC");
    
    ?>
    <div class="rdn-section">
        <h2>Gestione Ecosistemi</h2>
        
        <!-- Create New Form -->
        <div class="rdn-card">
            <h3>Nuovo Ecosistema</h3>
            <form method="post" style="display: flex; gap: 10px; align-items: end;">
                <?php wp_nonce_field('rdn_create_ecosystem'); ?>
                <div>
                    <label>Slug (a-z0-9, max 10):</label>
                    <input type="text" name="ecosystem_slug" pattern="[a-z0-9]{1,10}" required style="width: 150px;">
                </div>
                <div>
                    <label>Nome:</label>
                    <input type="text" name="ecosystem_name" required style="width: 200px;">
                </div>
                <button type="submit" name="rdn_create_ecosystem" class="button button-primary">Crea Ecosistema</button>
            </form>
        </div>
        
        <!-- Ecosystems Table -->
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Slug</th>
                    <th>Nome</th>
                    <th>Codici</th>
                    <th>Status</th>
                    <th>Data Creazione</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($ecosystems as $eco): 
                    $codes_count = $wpdb->get_var($wpdb->prepare(
                        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_codes WHERE ecosystem_slug = %s AND code_content != %s",
                        $eco->ecosystem_slug,
                        "// Inserisci codice React per"
                    ));
                ?>
                <tr>
                    <td><strong><?php echo esc_html($eco->ecosystem_slug); ?></strong></td>
                    <td><?php echo esc_html($eco->ecosystem_name); ?></td>
                    <td>
                        <span class="rdn-badge <?php echo $codes_count > 0 ? 'rdn-badge-success' : 'rdn-badge-warning'; ?>">
                            <?php echo $codes_count; ?>/23
                        </span>
                    </td>
                    <td>
                        <form method="post" style="display: inline;">
                            <?php wp_nonce_field('rdn_toggle_ecosystem'); ?>
                            <input type="hidden" name="ecosystem_slug" value="<?php echo esc_attr($eco->ecosystem_slug); ?>">
                            <button type="submit" name="rdn_toggle_ecosystem" class="button button-small">
                                <?php echo $eco->is_active ? '✓ Attivo' : '✗ Inattivo'; ?>
                            </button>
                        </form>
                    </td>
                    <td><?php echo esc_html($eco->created_date); ?></td>
                    <td>
                        <a href="?page=rdn-manager&tab=codes&ecosystem=<?php echo $eco->ecosystem_slug; ?>" class="button button-small">Modifica</a>
                        <form method="post" style="display: inline;" onsubmit="return confirm('Eliminare ecosistema?');">
                            <?php wp_nonce_field('rdn_delete_ecosystem'); ?>
                            <input type="hidden" name="ecosystem_slug" value="<?php echo esc_attr($eco->ecosystem_slug); ?>">
                            <button type="submit" name="rdn_delete_ecosystem" class="button button-small">Elimina</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

/**
 * SEZIONE 1: Gestione Codici
 */
function rdn_render_codes_tab($ecosystem_slug) {
    global $wpdb;
    
    if (empty($ecosystem_slug)) {
        echo '<p>Seleziona un ecosistema.</p>';
        return;
    }
    
    // Handle save code
    if (isset($_POST['rdn_save_code']) && check_admin_referer('rdn_save_code_' . $ecosystem_slug)) {
        $code_name = sanitize_text_field($_POST['code_name']);
        $code_content = wp_unslash($_POST['code_content']); // Non sanitize - è codice
        
        $wpdb->update(
            $wpdb->prefix . 'rdn_codes',
            [
                'code_content' => $code_content,
                'version' => $wpdb->get_var($wpdb->prepare("SELECT version FROM {$wpdb->prefix}rdn_codes WHERE ecosystem_slug = %s AND code_name = %s", $ecosystem_slug, $code_name)) + 1
            ],
            ['ecosystem_slug' => $ecosystem_slug, 'code_name' => $code_name],
            ['%s', '%d'],
            ['%s', '%s']
        );
        
        // Clear cache
        delete_transient('rdn_codes_bundle_' . $ecosystem_slug);
        
        echo '<div class="notice notice-success"><p>Codice salvato!</p></div>';
    }
    
    // Handle clear tool cache
if (isset($_POST['rdn_clear_tool_cache']) && check_admin_referer('rdn_save_code_' . $ecosystem_slug)) {
    $code_name = sanitize_text_field($_POST['code_name']);
    
    // Map code_name to tool_name (remove .jsx/.js)
    $tool_name = str_replace(['.jsx', '.js'], '', $code_name);
    
    // Delete situations cache for this tool
    $wpdb->delete(
        $wpdb->prefix . 'rdn_situations_cache',
        ['ecosystem_slug' => $ecosystem_slug, 'tool_name' => $tool_name],
        ['%s', '%s']
    );
    
    // Delete modules cache if tool is obiettivi or percorso
    if (in_array($tool_name, ['obiettivi', 'percorso'])) {
        $wpdb->delete(
            $wpdb->prefix . 'rdn_modules_cache',
            ['ecosystem_slug' => $ecosystem_slug, 'module_type' => $tool_name],
            ['%s', '%s']
        );
    }
    
    echo '<div class="notice notice-success"><p>Cache strumento svuotata!</p></div>';
}
    
    // Get current code
    $current_code_name = isset($_GET['code']) ? sanitize_text_field($_GET['code']) : '';
    if (empty($current_code_name)) {
        $current_code_name = 'utils.js';
    }
    
    $current_code = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}rdn_codes WHERE ecosystem_slug = %s AND code_name = %s",
        $ecosystem_slug,
        $current_code_name
    ));
    
    // Get all codes grouped by category
    $all_codes = $wpdb->get_results($wpdb->prepare(
        "SELECT code_name, code_category, code_content FROM {$wpdb->prefix}rdn_codes WHERE ecosystem_slug = %s ORDER BY code_category, code_name",
        $ecosystem_slug
    ));
    
    $categories = [
        'generali' => 'GENERALI (5)',
        'liste' => 'LISTE/OUTPUT (2)',
        'output' => 'LISTE/OUTPUT (2)',
        'viralita' => 'VIRALITÀ (1)',
        'schermate' => 'SCHERMATE (3)',
        'tools-s1-s2' => 'TOOLS S1-S2 (3)',
        'tools-s3' => 'TOOLS S3 (9)'
    ];
    
    $grouped_codes = [];
    foreach ($all_codes as $code) {
        if (!isset($grouped_codes[$code->code_category])) {
            $grouped_codes[$code->code_category] = [];
        }
        $grouped_codes[$code->code_category][] = $code;
    }
    
    ?>
    <div class="rdn-section rdn-codes-section">
        <h2>Gestione Codici - <?php echo esc_html($ecosystem_slug); ?></h2>
        
        <div class="rdn-codes-layout">
            <!-- Sidebar -->
            <div class="rdn-codes-sidebar">
                <h3>Codici (23)</h3>
                <?php foreach ($categories as $cat_key => $cat_label): ?>
                    <?php if (isset($grouped_codes[$cat_key])): ?>
                        <div class="rdn-category">
                            <h4><?php echo esc_html($cat_label); ?></h4>
                            <ul>
                                <?php foreach ($grouped_codes[$cat_key] as $code): 
                                    $is_empty = strpos($code->code_content, '// Inserisci codice React per') !== false;
                                    $badge_class = $is_empty ? 'rdn-badge-danger' : 'rdn-badge-success';
                                    $active_class = ($code->code_name === $current_code_name) ? 'active' : '';
                                ?>
                                <li class="<?php echo $active_class; ?>">
                                    <a href="?page=rdn-manager&tab=codes&ecosystem=<?php echo $ecosystem_slug; ?>&code=<?php echo urlencode($code->code_name); ?>">
                                        <?php echo esc_html($code->code_name); ?>
                                        <span class="rdn-badge <?php echo $badge_class; ?>">
                                            <?php echo $is_empty ? 'Vuoto' : 'OK'; ?>
                                        </span>
                                    </a>
                                </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
            
            <!-- Editor -->
            <div class="rdn-codes-editor">
                <?php if ($current_code): ?>
                    <div class="rdn-editor-header">
                        <h3><?php echo esc_html($current_code->code_name); ?></h3>
                        <div class="rdn-editor-meta">
                            Versione: <?php echo $current_code->version; ?> | 
                            Ultima modifica: <?php echo esc_html($current_code->last_modified); ?>
                        </div>
                    </div>
                    
                    <form method="post">
                        <?php wp_nonce_field('rdn_save_code_' . $ecosystem_slug); ?>
                        <input type="hidden" name="code_name" value="<?php echo esc_attr($current_code->code_name); ?>">
                        
                        <textarea name="code_content" class="rdn-code-textarea" rows="25"><?php echo esc_textarea($current_code->code_content); ?></textarea>
                        
                        <div class="rdn-editor-actions">
    <button type="submit" name="rdn_save_code" class="button button-primary button-large">Salva Codice</button>
    <button type="submit" name="rdn_clear_tool_cache" class="button button-secondary">Svuota Cache Strumento</button>
    <button type="button" onclick="location.reload();" class="button">Ripristina</button>
</div>
                    </form>
                <?php else: ?>
                    <p>Codice non trovato.</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php
}

/**
 * SEZIONE 2: Configurazioni
 */
function rdn_render_config_tab($ecosystem_slug) {
    global $wpdb;
    
    if (empty($ecosystem_slug)) {
        echo '<p>Seleziona un ecosistema.</p>';
        return;
    }
    
    // Handle save
    if (isset($_POST['rdn_save_config']) && check_admin_referer('rdn_save_config_' . $ecosystem_slug)) {
        $config = [
            'ai_providers' => [
                'runpod' => [
                    'endpoint' => sanitize_url($_POST['runpod_endpoint']),
                    'api_key' => sanitize_text_field($_POST['runpod_api_key']),
                    'timeout' => intval($_POST['runpod_timeout'])
                ]
            ],
            'amember' => [
                'product_id_l1' => sanitize_text_field($_POST['product_id_l1']),
                'product_id_l2' => sanitize_text_field($_POST['product_id_l2']),
                'login_url' => sanitize_text_field($_POST['login_url'])
            ],
            'company' => [
                'name' => sanitize_text_field($_POST['company_name']),
                'owner' => sanitize_text_field($_POST['company_owner']),
                'email' => sanitize_email($_POST['company_email']),
                'address' => sanitize_textarea_field($_POST['company_address']),
                'tax_id' => sanitize_text_field($_POST['company_tax_id']),
                'emergency_numbers' => [
                    'primary' => sanitize_text_field($_POST['emergency_primary']),
                    'secondary' => sanitize_text_field($_POST['emergency_secondary'])
                ]
            ],
            'analytics' => [
                'tracking_id' => sanitize_text_field($_POST['analytics_tracking_id']),
                'enabled' => isset($_POST['analytics_enabled'])
            ],
            'rate_limits' => [
                'level1' => [
                    'daily' => intval($_POST['rate_l1_daily']),
                    'sos' => intval($_POST['rate_l1_sos'])
                ],
                'level2' => [
                    'daily' => intval($_POST['rate_l2_daily']),
                    'sos' => intval($_POST['rate_l2_sos'])
                ]
            ]
        ];
        
        update_option('rdn_config_' . $ecosystem_slug, $config);
        
        // Update chatbot config
        $chatbot_data = [
            'consultations_enabled' => isset($_POST['chatbot_consultations_enabled']) ? 1 : 0,
            'consultation_url' => sanitize_url($_POST['chatbot_consultation_url']),
            'support_url' => sanitize_url($_POST['chatbot_support_url']),
            'faq_specific' => $_POST['chatbot_faq_specific']
        ];
        
        $wpdb->update(
            $wpdb->prefix . 'rdn_chatbot_config',
            $chatbot_data,
            ['ecosystem_slug' => $ecosystem_slug],
            ['%d', '%s', '%s', '%s'],
            ['%s']
        );
        
        echo '<div class="notice notice-success"><p>Configurazione salvata!</p></div>';
    }
    
    // Get current config
    $config = get_option('rdn_config_' . $ecosystem_slug, []);
    $chatbot_config = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}rdn_chatbot_config WHERE ecosystem_slug = %s",
        $ecosystem_slug
    ));
    
    ?>
    <div class="rdn-section">
        <h2>Configurazioni - <?php echo esc_html($ecosystem_slug); ?></h2>
        
        <form method="post" class="rdn-config-form">
            <?php wp_nonce_field('rdn_save_config_' . $ecosystem_slug); ?>
            
            <!-- TAB AI Providers -->
<div class="rdn-card">
    <h3>AI Providers</h3>
    <table class="form-table">
        <tr>
    <th>Provider Primario</th>
    <td>
        <label><input type="radio" name="primary_provider" value="runpod" <?php checked($config['ai_providers']['primary'] ?? 'runpod', 'runpod'); ?>> RunPod (default)</label><br>
        <label><input type="radio" name="primary_provider" value="fallback1" <?php checked($config['ai_providers']['primary'] ?? 'runpod', 'fallback1'); ?>> Fallback 1</label><br>
        <label><input type="radio" name="primary_provider" value="fallback2" <?php checked($config['ai_providers']['primary'] ?? 'runpod', 'fallback2'); ?>> Fallback 2</label>
    </td>
</tr>
        <tr>
            <th>RunPod Endpoint URL</th>
            <td><input type="url" name="runpod_endpoint" value="<?php echo esc_attr($config['ai_providers']['runpod']['endpoint'] ?? ''); ?>" class="regular-text" required></td>
        </tr>
        <tr>
            <th>RunPod API Key</th>
            <td><input type="password" name="runpod_api_key" value="<?php echo esc_attr($config['ai_providers']['runpod']['api_key'] ?? ''); ?>" class="regular-text" required></td>
        </tr>
        <tr>
            <th>Timeout (ms)</th>
            <td><input type="number" name="runpod_timeout" value="<?php echo esc_attr($config['ai_providers']['runpod']['timeout'] ?? 15000); ?>" min="5000" max="60000"></td>
        </tr>
        <tr><td colspan="2"><hr><strong>Fallback 1 (opzionale)</strong></td></tr>
        <tr>
            <th>Fallback 1 Endpoint URL</th>
            <td><input type="url" name="fallback1_endpoint" value="<?php echo esc_attr($config['ai_providers']['fallback1']['endpoint'] ?? ''); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th>Fallback 1 API Key</th>
            <td><input type="password" name="fallback1_api_key" value="<?php echo esc_attr($config['ai_providers']['fallback1']['api_key'] ?? ''); ?>" class="regular-text"></td>
        </tr>
        <tr><td colspan="2"><hr><strong>Fallback 2 (opzionale)</strong></td></tr>
        <tr>
            <th>Fallback 2 Endpoint URL</th>
            <td><input type="url" name="fallback2_endpoint" value="<?php echo esc_attr($config['ai_providers']['fallback2']['endpoint'] ?? ''); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th>Fallback 2 API Key</th>
            <td><input type="password" name="fallback2_api_key" value="<?php echo esc_attr($config['ai_providers']['fallback2']['api_key'] ?? ''); ?>" class="regular-text"></td>
        </tr>
    </table>
</div>
            
            <!-- TAB aMember -->
            <div class="rdn-card">
                <h3>aMember</h3>
                <table class="form-table">
                    <tr>
                        <th>Product ID Level 1</th>
                        <td><input type="text" name="product_id_l1" value="<?php echo esc_attr($config['amember']['product_id_l1'] ?? ''); ?>" required></td>
                    </tr>
                    <tr>
                        <th>Product ID Level 2</th>
                        <td><input type="text" name="product_id_l2" value="<?php echo esc_attr($config['amember']['product_id_l2'] ?? ''); ?>" required></td>
                    </tr>
                    <tr>
                        <th>Login URL</th>
                        <td><input type="text" name="login_url" value="<?php echo esc_attr($config['amember']['login_url'] ?? '/amember/login'); ?>" class="regular-text"></td>
                    </tr>
                </table>
            </div>
            
            <!-- TAB Company -->
            <div class="rdn-card">
                <h3>Company Info</h3>
                <table class="form-table">
                    <tr>
                        <th>Nome Azienda</th>
                        <td><input type="text" name="company_name" value="<?php echo esc_attr($config['company']['name'] ?? ''); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th>Owner</th>
                        <td><input type="text" name="company_owner" value="<?php echo esc_attr($config['company']['owner'] ?? ''); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td><input type="email" name="company_email" value="<?php echo esc_attr($config['company']['email'] ?? ''); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th>Indirizzo</th>
                        <td><textarea name="company_address" rows="3" class="large-text"><?php echo esc_textarea($config['company']['address'] ?? ''); ?></textarea></td>
                    </tr>
                    <tr>
                        <th>Tax ID</th>
                        <td><input type="text" name="company_tax_id" value="<?php echo esc_attr($config['company']['tax_id'] ?? ''); ?>"></td>
                    </tr>
                    <tr>
                        <th>Numero Emergenza Primario</th>
                        <td><input type="text" name="emergency_primary" value="<?php echo esc_attr($config['company']['emergency_numbers']['primary'] ?? '112'); ?>"></td>
                    </tr>
                    <tr>
                        <th>Numero Emergenza Secondario</th>
                        <td><input type="text" name="emergency_secondary" value="<?php echo esc_attr($config['company']['emergency_numbers']['secondary'] ?? '800 86 00 22'); ?>"></td>
                    </tr>
                </table>
            </div>
            
            <!-- TAB Analytics -->
            <div class="rdn-card">
                <h3>Analytics</h3>
                <table class="form-table">
                    <tr>
                        <th>Google Analytics Tracking ID</th>
                        <td><input type="text" name="analytics_tracking_id" value="<?php echo esc_attr($config['analytics']['tracking_id'] ?? ''); ?>" placeholder="G-XXXXXXXXXX"></td>
                    </tr>
                    <tr>
                        <th>Abilita Analytics</th>
                        <td><input type="checkbox" name="analytics_enabled" <?php checked($config['analytics']['enabled'] ?? false); ?>></td>
                    </tr>
                </table>
            </div>
            
            <!-- TAB Rate Limits -->
            <div class="rdn-card">
                <h3>Rate Limits</h3>
                <table class="form-table">
                    <tr>
                        <th>Level 1 - Daily</th>
                        <td><input type="number" name="rate_l1_daily" value="<?php echo esc_attr($config['rate_limits']['level1']['daily'] ?? 5); ?>" min="1" max="100"></td>
                    </tr>
                    <tr>
                        <th>Level 1 - SOS</th>
                        <td><input type="number" name="rate_l1_sos" value="<?php echo esc_attr($config['rate_limits']['level1']['sos'] ?? 3); ?>" min="1" max="50"></td>
                    </tr>
                    <tr>
                        <th>Level 2 - Daily</th>
                        <td><input type="number" name="rate_l2_daily" value="<?php echo esc_attr($config['rate_limits']['level2']['daily'] ?? 15); ?>" min="1" max="100"></td>
                    </tr>
                    <tr>
                        <th>Level 2 - SOS</th>
                        <td><input type="number" name="rate_l2_sos" value="<?php echo esc_attr($config['rate_limits']['level2']['sos'] ?? 3); ?>" min="1" max="50"></td>
                    </tr>
                </table>
            </div>
            
            <!-- TAB Chatbot -->
            <div class="rdn-card">
                <h3>Chatbot</h3>
                <table class="form-table">
                    <tr>
                        <th>Abilita Consulenze</th>
                        <td><input type="checkbox" name="chatbot_consultations_enabled" <?php checked($chatbot_config->consultations_enabled ?? 0); ?>></td>
                    </tr>
                    <tr>
                        <th>URL Consulenza</th>
                        <td><input type="url" name="chatbot_consultation_url" value="<?php echo esc_attr($chatbot_config->consultation_url ?? ''); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th>URL Supporto Tecnico</th>
                        <td><input type="url" name="chatbot_support_url" value="<?php echo esc_attr($chatbot_config->support_url ?? ''); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th>FAQ Specifiche Ecosistema (JSON)</th>
                        <td>
                            <textarea name="chatbot_faq_specific" rows="8" class="large-text code"><?php echo esc_textarea($chatbot_config->faq_specific ?? '[]'); ?></textarea>
                            <p class="description">Formato: [{"question": "...", "answer": "..."}]</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <p class="submit">
                <button type="submit" name="rdn_save_config" class="button button-primary button-large">Salva Configurazione</button>
            </p>
        </form>
    </div>
    <?php
}

/**
 * SEZIONE 3: Database Status
 */
function rdn_render_database_tab($ecosystem_slug) {
    global $wpdb;
    
    if (empty($ecosystem_slug)) {
        echo '<p>Seleziona un ecosistema.</p>';
        return;
    }
    
    $tables = [
        'rdn_users', 'rdn_mood_daily', 'rdn_reinforcement_history', 'rdn_objectives_progress',
        'rdn_percorso_progress', 'rdn_transformer_usage', 'rdn_scudo_history', 'rdn_sos_history',
        'rdn_spada_history', 'rdn_weekly_goal', 'rdn_ai_calls', 'rdn_emergency_events',
        'rdn_modules_cache', 'rdn_situations_cache', 'rdn_codes', 'rdn_ecosystems',
        'rdn_error_logs', 'rdn_user_analytics', 'rdn_chatbot_code', 'rdn_chatbot_config',
        'rdn_chatbot_conversations', 'rdn_lists'
    ];
    
    ?>
    <div class="rdn-section">
        <h2>Database Status - <?php echo esc_html($ecosystem_slug); ?></h2>
        
        <div class="rdn-database-grid">
            <?php foreach ($tables as $table): 
                $table_name = $wpdb->prefix . $table;
                $exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name;
                
                if ($exists) {
                    // Count records for this ecosystem
                    if (in_array($table, ['rdn_ecosystems', 'rdn_chatbot_code'])) {
                        $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
                    } else {
                        $count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name WHERE ecosystem_slug = %s", $ecosystem_slug));
                    }
                } else {
                    $count = 0;
                }
            ?>
            <div class="rdn-database-card">
                <h4><?php echo esc_html($table); ?></h4>
                <div class="rdn-db-status">
                    <?php if ($exists): ?>
                        <span class="rdn-badge rdn-badge-success">✓ Operativo</span>
                    <?php else: ?>
                        <span class="rdn-badge rdn-badge-danger">✗ Mancante</span>
                    <?php endif; ?>
                </div>
                <div class="rdn-db-count"><?php echo number_format($count); ?> record</div>
            </div>
            <?php endforeach; ?>
        </div>
        
        <div class="rdn-database-actions">
            <button onclick="if(confirm('Creare tabelle mancanti?')) location.href='?page=rdn-manager&tab=database&ecosystem=<?php echo $ecosystem_slug; ?>&action=create_tables';" class="button">Crea Tabelle Mancanti</button>
            <button onclick="if(confirm('Svuotare cache di questo ecosistema?')) location.href='?page=rdn-manager&tab=database&ecosystem=<?php echo $ecosystem_slug; ?>&action=clear_cache';" class="button">Svuota Cache Ecosistema</button>
        </div>
    </div>
    <?php
    
    // Handle actions
    if (isset($_GET['action'])) {
        if ($_GET['action'] === 'create_tables') {
            rdn_create_tables();
            echo '<div class="notice notice-success"><p>Tabelle create!</p></div>';
        } elseif ($_GET['action'] === 'clear_cache') {
            $wpdb->delete($wpdb->prefix . 'rdn_modules_cache', ['ecosystem_slug' => $ecosystem_slug], ['%s']);
            $wpdb->delete($wpdb->prefix . 'rdn_situations_cache', ['ecosystem_slug' => $ecosystem_slug], ['%s']);
            delete_transient('rdn_codes_bundle_' . $ecosystem_slug);
            echo '<div class="notice notice-success"><p>Cache svuotata!</p></div>';
        }
    }

    // ===== GESTIONE LISTE RDN =====
echo '<div class="wrap rdn-section"><h2>📋 Gestione Liste RDN</h2>';

if (isset($_POST['rdn_save_lists']) && check_admin_referer('rdn_save_lists_nonce')) {
    $eco = sanitize_text_field($_POST['ecosystem_slug']);
    $json = wp_unslash($_POST['lists_json']);
    
    $decoded = json_decode($json, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $wpdb->replace(
            $wpdb->prefix . 'rdn_lists',
            ['ecosystem_slug' => $eco, 'list_type' => 'all_data', 'list_data' => $json],
            ['%s', '%s', '%s']
        );
        echo '<div class="notice notice-success"><p>✅ Liste salvate!</p></div>';
    } else {
        echo '<div class="notice notice-error"><p>❌ JSON non valido</p></div>';
    }
}

$existing = $wpdb->get_row($wpdb->prepare(
    "SELECT list_data FROM {$wpdb->prefix}rdn_lists WHERE ecosystem_slug = %s AND list_type = 'all_data'",
    'rdn'
));

echo '<form method="post" style="margin-top:20px;">';
wp_nonce_field('rdn_save_lists_nonce');
echo '<input type="hidden" name="ecosystem_slug" value="rdn">';
echo '<p>Incolla JSON liste (no const/window)</p>';
echo '<textarea name="lists_json" rows="20" style="width:100%;font-family:monospace;">' . esc_textarea($existing->list_data ?? '') . '</textarea>';
echo '<p><button type="submit" name="rdn_save_lists" class="button button-primary">Salva</button></p>';
echo '</form></div>';
}



/**
 * SEZIONE 4: Logs Debug
 */
function rdn_render_logs_tab($ecosystem_slug) {
    global $wpdb;
    
    if (empty($ecosystem_slug)) {
        echo '<p>Seleziona un ecosistema.</p>';
        return;
    }
    
    // Handle clear logs
    if (isset($_GET['action']) && $_GET['action'] === 'clear_logs') {
        $wpdb->delete($wpdb->prefix . 'rdn_error_logs', ['ecosystem_slug' => $ecosystem_slug], ['%s']);
        echo '<div class="notice notice-success"><p>Logs eliminati!</p></div>';
    }
    
    $logs = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}rdn_error_logs WHERE ecosystem_slug = %s ORDER BY timestamp DESC LIMIT 100",
        $ecosystem_slug
    ));
    
    ?>
    <div class="rdn-section">
        <h2>Logs Debug - <?php echo esc_html($ecosystem_slug); ?></h2>
        
        <div class="rdn-logs-actions">
            <button onclick="if(confirm('Eliminare tutti i log?')) location.href='?page=rdn-manager&tab=logs&ecosystem=<?php echo $ecosystem_slug; ?>&action=clear_logs';" class="button">Svuota Logs</button>
        </div>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>User ID</th>
                    <th>Tool Type</th>
                    <th>Error Message</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($logs)): ?>
                    <tr><td colspan="4">Nessun log trovato.</td></tr>
                <?php else: ?>
                    <?php foreach ($logs as $log): ?>
                    <tr>
                        <td><?php echo esc_html($log->timestamp); ?></td>
                        <td><?php echo esc_html($log->user_id); ?></td>
                        <td><span class="rdn-badge"><?php echo esc_html($log->tool_type); ?></span></td>
                        <td><?php echo esc_html(substr($log->error_message, 0, 100)); ?></td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

/**
 * SEZIONE 5: Chatbot IA Universale
 */
function rdn_render_chatbot_tab() {
    global $wpdb;
    
    // Handle save chatbot code
    if (isset($_POST['rdn_save_chatbot_code']) && check_admin_referer('rdn_save_chatbot_code')) {
        $code_content = $_POST['chatbot_code_content'];
        
        $existing = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}rdn_chatbot_code");
        if ($existing > 0) {
            $wpdb->update(
                $wpdb->prefix . 'rdn_chatbot_code',
                ['code_content' => $code_content, 'version' => $wpdb->get_var("SELECT version FROM {$wpdb->prefix}rdn_chatbot_code LIMIT 1") + 1],
                ['id' => 1],
                ['%s', '%d'],
                ['%d']
            );
        } else {
            $wpdb->insert($wpdb->prefix . 'rdn_chatbot_code', ['code_content' => $code_content, 'version' => 1], ['%s', '%d']);
        }
        
        echo '<div class="notice notice-success"><p>Codice chatbot salvato!</p></div>';
    }
    
    // Handle save universal FAQs
    if (isset($_POST['rdn_save_universal_faq']) && check_admin_referer('rdn_save_universal_faq')) {
        $faq = $_POST['universal_faq'];
        update_option('rdn_faq_universal', $faq);
        echo '<div class="notice notice-success"><p>FAQ universali salvate!</p></div>';
    }
    
    $chatbot_code = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rdn_chatbot_code LIMIT 1");
    $universal_faq = get_option('rdn_faq_universal', '[]');
    
    ?>
    <div class="rdn-section">
        <h2>Chatbot IA Universale</h2>
        
        <!-- Chatbot Code Editor -->
        <div class="rdn-card">
            <h3>Codice Chatbot.jsx Universale</h3>
            <form method="post">
                <?php wp_nonce_field('rdn_save_chatbot_code'); ?>
                
                <?php
                $is_empty = empty($chatbot_code) || strpos($chatbot_code->code_content ?? '', '// Inserisci codice React') !== false;
                ?>
                <div class="rdn-editor-meta">
                    <?php if (!$is_empty): ?>
                        <span class="rdn-badge rdn-badge-success">OK</span>
                        Versione: <?php echo $chatbot_code->version ?? 1; ?> | 
                        Ultima modifica: <?php echo esc_html($chatbot_code->last_modified ?? 'N/A'); ?>
                    <?php else: ?>
                        <span class="rdn-badge rdn-badge-danger">Vuoto</span>
                    <?php endif; ?>
                </div>
                
                <textarea name="chatbot_code_content" class="rdn-code-textarea" rows="25"><?php echo esc_textarea($chatbot_code->code_content ?? '// Inserisci codice React chatbot.jsx universale'); ?></textarea>
                
                <p class="submit">
                    <button type="submit" name="rdn_save_chatbot_code" class="button button-primary button-large">Salva Codice Chatbot</button>
                    <button type="button" onclick="location.reload();" class="button">Ripristina</button>
                </p>
            </form>
        </div>
        
        <!-- Universal FAQs -->
        <div class="rdn-card">
            <h3>FAQ Universali (JSON)</h3>
            <p class="description">FAQ valide per TUTTI gli ecosistemi: tempi risultati, funzionamento generale, pagamenti, supporto tecnico.</p>
            
            <form method="post">
                <?php wp_nonce_field('rdn_save_universal_faq'); ?>
                
                <textarea name="universal_faq" rows="12" class="large-text code"><?php echo esc_textarea($universal_faq); ?></textarea>
                <p class="description">Formato: [{"question": "...", "answer": "..."}]</p>
                
                <p class="submit">
                    <button type="submit" name="rdn_save_universal_faq" class="button button-primary">Salva FAQ Universali</button>
                </p>
            </form>
        </div>
    </div>
    <?php
}
