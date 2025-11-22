<?php
if (!defined('ABSPATH')) exit;

/**
 * Enqueue React libraries + Babel
 */
add_action('wp_enqueue_scripts', 'rdn_enqueue_react');
function rdn_enqueue_react() {
    wp_enqueue_script('react-18', 'https://unpkg.com/react@18/umd/react.production.min.js', [], '18', false);
    wp_enqueue_script('react-dom-18', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', ['react-18'], '18', false);
    wp_enqueue_script('babel-standalone', 'https://unpkg.com/@babel/standalone/babel.min.js', [], '7', false);
}

/**
 * Shortcode [rdn-app ecosystem="xyz"]
 */
add_shortcode('rdn-app', 'rdn_render_shortcode');
function rdn_render_shortcode($atts) {
    $atts = shortcode_atts(['ecosystem' => ''], $atts);
    $eco = sanitize_text_field($atts['ecosystem']);
    
    if (empty($eco)) {
        return '<div style="color:red;">Errore: specificare ecosystem nello shortcode</div>';
    }
    
    // Verify ecosystem exists and is active
    global $wpdb;
    $eco_exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}rdn_ecosystems WHERE ecosystem_slug = %s AND is_active = 1",
        $eco
    ));
    
    if (!$eco_exists) {
        return '<div style="color:red;">Errore: ecosistema "' . esc_html($eco) . '" non trovato</div>';
    }
    
    // Add footer scripts with bundle
    add_action('wp_footer', function() use ($eco) {
        rdn_inject_bundle($eco);
    }, 20);
    
    // Return container div
    return '<div id="rdn-app-' . esc_attr($eco) . '"></div>';
}

/**
 * Generate and inject JavaScript bundle
 */
function rdn_inject_bundle($ecosystem_slug) {
    global $wpdb;
    
    // Check transient cache first
    $bundle_cache_key = 'rdn_codes_bundle_' . $ecosystem_slug;
    $bundle = get_transient($bundle_cache_key);
    
    if ($bundle === false) {
        // Generate bundle from database
        $codes = $wpdb->get_results($wpdb->prepare(
            "SELECT code_name, code_content, code_category 
            FROM {$wpdb->prefix}rdn_codes 
            WHERE ecosystem_slug = %s AND is_active = 1 
            ORDER BY 
                CASE code_category
                    WHEN 'generali' THEN 1
                    WHEN 'liste' THEN 2
                    WHEN 'output' THEN 3
                    WHEN 'schermate' THEN 4
                    WHEN 'tools-s1-s2' THEN 5
                    WHEN 'tools-s3' THEN 6
                    WHEN 'viralita' THEN 7
                    ELSE 8
                END,
                code_name ASC",
            $ecosystem_slug
        ));
        
        if (empty($codes)) {
            error_log("RDN: Nessun codice trovato per ecosistema {$ecosystem_slug}");
            return;
        }
        
        // Start bundle with React destructuring ONCE
        $bundle = "// ===== RDN Bundle: {$ecosystem_slug} =====\n";
        $bundle .= "// Generated: " . current_time('mysql') . "\n\n";
        $bundle .= "// React globals - declared ONCE for entire bundle\n";
        $bundle .= "const { useState, useEffect, useContext, createContext, useMemo, useCallback, lazy, Suspense, memo, Component } = React;\n";
        $bundle .= "const { createRoot } = ReactDOM;\n\n";
        
        // Add each code WITHOUT React destructuring
        foreach ($codes as $code) {
            $bundle .= "// ===== {$code->code_name} [{$code->code_category}] =====\n";
            
            // Clean content
            $clean_content = $code->code_content;
            $clean_content = wp_unslash($clean_content);
            $clean_content = stripslashes($clean_content);
            $clean_content = str_replace("\\'", "'", $clean_content);
            $clean_content = str_replace('\\"', '"', $clean_content);

            
            // Remove React destructuring lines if present
            $clean_content = preg_replace('/^const\s*\{[^}]+\}\s*=\s*React;?\s*$/m', '// React already declared globally', $clean_content);
            $clean_content = preg_replace('/^const\s*\{[^}]+\}\s*=\s*ReactDOM;?\s*$/m', '// ReactDOM already declared globally', $clean_content);
            
            $bundle .= $clean_content . "\n\n";
        }
        
        // Cache for 1 hour
        set_transient($bundle_cache_key, $bundle, HOUR_IN_SECONDS);
    }
    
    // Get ecosystem config
    $config = get_option('rdn_config_' . $ecosystem_slug, []);
    $base_url = home_url();
    
    ?>
    <!-- RDN <?php echo esc_attr($ecosystem_slug); ?> Bundle -->
    <script>
    // Global config
    window.RDN_WP_CONFIG = {
        ecosystem: <?php echo json_encode($ecosystem_slug); ?>,
        base_url: <?php echo json_encode($base_url); ?>,
        api_url: <?php echo json_encode(rest_url('rdn/v1')); ?>,
        nonce: <?php echo json_encode(wp_create_nonce('wp_rest')); ?>,
        user_id: <?php echo get_current_user_id(); ?>,
        config: <?php echo json_encode($config); ?>
    };

    // Initialize RDN namespace - MERGE invece di sovrascrivere
    window.RDN = window.RDN || {};
    Object.assign(window.RDN, {
        version: '1.0.0',
        ecosystem: <?php echo json_encode($ecosystem_slug); ?>,
        loaded: true
    });

    console.log('✅ RDN INITIALIZED:', window.RDN);
    </script>
    
    <script type="text/babel">
    <?php echo $bundle; ?>
    </script>
    <?php
}
