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
}
add_action( 'init', 'lightweight_share_buttons_register_block' );

/**
 * Bust cached block assets after a build without changing the plugin release version.
 *
 * @param string $src    Asset URL.
 * @param string $handle WordPress asset handle.
 * @return string
 */
function lightweight_share_buttons_asset_version( $src, $handle ) {
	if ( false === strpos( $handle, 'imado-share-buttons' ) ) {
		return $src;
	}

	$file = '';
	if ( false !== strpos( $handle, 'view' ) ) {
		$file = __DIR__ . '/build/view.js';
	} elseif ( false !== strpos( $handle, 'editor-script' ) ) {
		$file = __DIR__ . '/build/index.js';
	} elseif ( false !== strpos( $handle, 'editor-style' ) ) {
		$file = __DIR__ . '/build/index.css';
	} elseif ( false !== strpos( $handle, 'style' ) ) {
		$file = __DIR__ . '/build/style-index.css';
	}

	return $file && file_exists( $file ) ? add_query_arg( 'ver', (string) filemtime( $file ), remove_query_arg( 'ver', $src ) ) : $src;
}
add_filter( 'script_loader_src', 'lightweight_share_buttons_asset_version', 10, 2 );
add_filter( 'style_loader_src', 'lightweight_share_buttons_asset_version', 10, 2 );
