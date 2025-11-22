<?php
/**
 * Plugin Name: RDN Multi-Ecosystem Manager
 * Plugin URI: https://example.com/rdn-multi-ecosystem-manager
 * Description: Gestione 100+ ecosistemi React indipendenti con database condiviso, API REST, integrazione aMember, chatbot IA assistenza universale
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: rdn-multi-ecosystem-manager
 * Requires at least: 6.0
 * Requires PHP: 8.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('RDN_PLUGIN_VERSION', '1.0.0');
define('RDN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('RDN_PLUGIN_URL', plugin_dir_url(__FILE__));
define('RDN_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Activation hook - Create tables and default ecosystem
 */
register_activation_hook(__FILE__, 'rdn_activate_plugin');
function rdn_activate_plugin() {
    require_once RDN_PLUGIN_DIR . 'includes/database-setup.php';
    
    // Create all 21 tables
    rdn_create_tables();
    
    // Create default "rdn" ecosystem if not exists
    rdn_create_default_ecosystem();
    
    // Flush rewrite rules
    flush_rewrite_rules();
}

/**
 * Deactivation hook - Clear transients cache
 */
register_deactivation_hook(__FILE__, 'rdn_deactivate_plugin');
function rdn_deactivate_plugin() {
    global $wpdb;
    
    // Clear all RDN transients
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_rdn_%' OR option_name LIKE '_transient_timeout_rdn_%'");
    
    // Flush rewrite rules
    flush_rewrite_rules();
}

/**
 * Autoload includes
 */
require_once RDN_PLUGIN_DIR . 'includes/database-setup.php';
require_once RDN_PLUGIN_DIR . 'includes/admin-panel.php';
require_once RDN_PLUGIN_DIR . 'includes/api-routes.php';
require_once RDN_PLUGIN_DIR . 'includes/enqueue-scripts.php';

/**
 * Add admin menu
 */
add_action('admin_menu', 'rdn_add_admin_menu');
function rdn_add_admin_menu() {
    add_menu_page(
        'RDN Manager',
        'RDN Manager',
        'manage_options',
        'rdn-manager',
        'rdn_render_admin_panel',
        'dashicons-networking',
        30
    );
}

/**
 * Initialize API routes
 */
add_action('rest_api_init', 'rdn_register_api_routes');
