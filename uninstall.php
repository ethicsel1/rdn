<?php
/**
 * Uninstall Script - Clean up database
 * 
 * This file is executed when the plugin is uninstalled via WordPress admin.
 * By default, all code is commented out to preserve data.
 * Uncomment the code below if you want to completely remove all plugin data.
 */

// Exit if not called from WordPress
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// CAUTION: Uncommenting this code will DELETE ALL plugin data permanently!
// This includes all ecosystems, codes, configurations, user data, cache, logs, and chatbot data.

/*
global $wpdb;

// Define tables to drop (21 total)
$tables = [
    'rdn_users',
    'rdn_mood_daily',
    'rdn_reinforcement_history',
    'rdn_objectives_progress',
    'rdn_percorso_progress',
    'rdn_transformer_usage',
    'rdn_scudo_history',
    'rdn_sos_history',
    'rdn_spada_history',
    'rdn_weekly_goal',
    'rdn_ai_calls',
    'rdn_emergency_events',
    'rdn_modules_cache',
    'rdn_situations_cache',
    'rdn_codes',
    'rdn_ecosystems',
    'rdn_error_logs',
    'rdn_user_analytics',
    'rdn_chatbot_code',
    'rdn_chatbot_config',
    'rdn_chatbot_conversations'
];

// Drop all tables
foreach ($tables as $table) {
    $table_name = $wpdb->prefix . $table;
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
}

// Delete all wp_options entries for plugin configs
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE 'rdn_config_%'");
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name = 'rdn_faq_universal'");

// Delete all transients (cached bundles)
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_rdn_%'");
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_rdn_%'");
*/
