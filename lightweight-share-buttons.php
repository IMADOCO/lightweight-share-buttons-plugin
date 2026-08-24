<?php
/**
 * Plugin Name:       Lightweight Share Buttons
 * Description:       A lightweight, privacy-friendly social sharing block with native share and copy-link support.
 * Version:           1.0.0
 * Requires at least: 6.6
 * Requires PHP:      7.4
 * Author:            IMADO
 * Author URI:        https://imado.co
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       lightweight-share-buttons
 * Domain Path:       /languages
 *
 * @package LightweightShareButtons
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Register the block from its metadata. */
function lightweight_share_buttons_register_block() {
	register_block_type( __DIR__ . '/build' );
	wp_set_script_translations(
		'imado-share-buttons-editor-script',
		'lightweight-share-buttons',
		plugin_dir_path( __FILE__ ) . 'languages'
	);
}
add_action( 'init', 'lightweight_share_buttons_register_block' );
