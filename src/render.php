<?php
/**
 * Dynamic renderer for the share buttons block.
 *
 * @package LightweightShareButtons
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$lightweight_share_buttons_post_id = ! empty( $block->context['postId'] ) ? absint( $block->context['postId'] ) : ( is_singular() ? get_queried_object_id() : 0 );
$lightweight_share_buttons_url     = $lightweight_share_buttons_post_id ? get_permalink( $lightweight_share_buttons_post_id ) : '';
$lightweight_share_buttons_title   = $lightweight_share_buttons_post_id ? get_the_title( $lightweight_share_buttons_post_id ) : '';

if ( ! $lightweight_share_buttons_url ) {
	$lightweight_share_buttons_request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/';
	$lightweight_share_buttons_url         = home_url( $lightweight_share_buttons_request_uri );
}
if ( ! $lightweight_share_buttons_title ) {
	$lightweight_share_buttons_title = wp_get_document_title();
}
if ( 'custom' === $attributes['urlMode'] && ! empty( $attributes['customUrl'] ) ) {
	$lightweight_share_buttons_custom_url = trim( sanitize_text_field( $attributes['customUrl'] ) );
	if ( $lightweight_share_buttons_custom_url && ! preg_match( '#^https?://#i', $lightweight_share_buttons_custom_url ) ) {
		$lightweight_share_buttons_custom_url = 'https://' . ltrim( $lightweight_share_buttons_custom_url, '/' );
	}
	$lightweight_share_buttons_custom_url = esc_url_raw( $lightweight_share_buttons_custom_url, array( 'http', 'https' ) );
	if ( $lightweight_share_buttons_custom_url ) {
		$lightweight_share_buttons_url = $lightweight_share_buttons_custom_url;
	}
}
if ( ! empty( $attributes['customTitle'] ) ) {
	$lightweight_share_buttons_title = sanitize_text_field( $attributes['customTitle'] );
}
$lightweight_share_buttons_text = ! empty( $attributes['customText'] ) ? sanitize_textarea_field( $attributes['customText'] ) : '';

if ( ! empty( $attributes['utmEnabled'] ) ) {
	$lightweight_share_buttons_fragment = '';
	if ( false !== strpos( $lightweight_share_buttons_url, '#' ) ) {
		list( $lightweight_share_buttons_url, $lightweight_share_buttons_fragment ) = explode( '#', $lightweight_share_buttons_url, 2 );
	}
	$lightweight_share_buttons_params = array();
	foreach ( array( 'Source', 'Medium', 'Campaign' ) as $lightweight_share_buttons_utm_key ) {
		$lightweight_share_buttons_value = sanitize_text_field( $attributes[ 'utm' . $lightweight_share_buttons_utm_key ] );
		if ( '' !== $lightweight_share_buttons_value ) {
			$lightweight_share_buttons_params[ 'utm_' . strtolower( $lightweight_share_buttons_utm_key ) ] = $lightweight_share_buttons_value;
		}
	}
	$lightweight_share_buttons_url = add_query_arg( $lightweight_share_buttons_params, $lightweight_share_buttons_url );
	if ( '' !== $lightweight_share_buttons_fragment ) {
		$lightweight_share_buttons_url .= '#' . rawurlencode( rawurldecode( $lightweight_share_buttons_fragment ) );
	}
}

$lightweight_share_buttons_encoded_url   = rawurlencode( $lightweight_share_buttons_url );
$lightweight_share_buttons_encoded_title = rawurlencode( $lightweight_share_buttons_title );
$lightweight_share_buttons_email_body    = rawurlencode( trim( $lightweight_share_buttons_text . "\n\n" . $lightweight_share_buttons_url ) );
$lightweight_share_buttons_services      = array(
	'native'   => array(
		'label' => __( 'Share', 'lightweight-share-buttons' ),
		'url'   => '',
	),
	'copy'     => array(
		'label' => __( 'Copy Link', 'lightweight-share-buttons' ),
		'url'   => '',
	),
	'facebook' => array(
		'label' => 'Facebook',
		'url'   => 'https://www.facebook.com/sharer/sharer.php?u=' . $lightweight_share_buttons_encoded_url,
	),
	'whatsapp' => array(
		'label' => 'WhatsApp',
		'url'   => 'https://wa.me/?text=' . rawurlencode( trim( $lightweight_share_buttons_title . ' ' . $lightweight_share_buttons_text . ' ' . $lightweight_share_buttons_url ) ),
	),
	'linkedin' => array(
		'label' => 'LinkedIn',
		'url'   => 'https://www.linkedin.com/sharing/share-offsite/?url=' . $lightweight_share_buttons_encoded_url,
	),
	'email'    => array(
		'label' => __( 'Email', 'lightweight-share-buttons' ),
		'url'   => 'mailto:?subject=' . $lightweight_share_buttons_encoded_title . '&body=' . $lightweight_share_buttons_email_body,
	),
	'telegram' => array(
		'label' => 'Telegram',
		'url'   => 'https://t.me/share/url?url=' . $lightweight_share_buttons_encoded_url . '&text=' . rawurlencode( trim( $lightweight_share_buttons_title . ' ' . $lightweight_share_buttons_text ) ),
	),
	'x'        => array(
		'label' => 'X',
		'url'   => 'https://twitter.com/intent/tweet?url=' . $lightweight_share_buttons_encoded_url . '&text=' . rawurlencode( trim( $lightweight_share_buttons_title . ' ' . $lightweight_share_buttons_text ) ),
	),
	'bluesky'  => array(
		'label' => 'Bluesky',
		'url'   => 'https://bsky.app/intent/compose?text=' . rawurlencode( trim( $lightweight_share_buttons_title . ' ' . $lightweight_share_buttons_text . ' ' . $lightweight_share_buttons_url ) ),
	),
	'threads'  => array(
		'label' => 'Threads',
		'url'   => 'https://www.threads.net/intent/post?text=' . rawurlencode( trim( $lightweight_share_buttons_title . ' ' . $lightweight_share_buttons_text . ' ' . $lightweight_share_buttons_url ) ),
	),
	'reddit'   => array(
		'label' => 'Reddit',
		'url'   => 'https://www.reddit.com/submit?url=' . $lightweight_share_buttons_encoded_url . '&title=' . $lightweight_share_buttons_encoded_title,
	),
);
$lightweight_share_buttons_icons         = array(
	'native'   => '<path d="M18 16a3 3 0 0 0-2.4 1.2L8.9 13.4a3 3 0 0 0 0-2.8l6.7-3.8A3 3 0 1 0 15 4c0 .2 0 .4.1.6L8.4 8.4a3 3 0 1 0 0 7.2l6.7 3.8A3 3 0 1 0 18 16Z"/>',
	'copy'     => '<path d="M8 7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-1v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h1V7Zm3 1h3a3 3 0 0 1 3 3v3h1V7h-7v1Zm3 3H7v7h7v-7Z"/>',
	'facebook' => '<path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v7h4v-7h3l1-4h-4V9c0-.7.3-1 1-1Z"/>',
	'whatsapp' => '<path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.2-1.3A10 10 0 1 0 12 2Zm5.7 14.2c-.2.7-1.3 1.3-2 1.5-.5.1-1.2.2-3.6-.8-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3.1 0-1.5.8-2.3 1.1-2.6.3-.3.7-.4 1-.4h.7c.2 0 .5-.1.8.6l1 2.4c.1.2.1.5 0 .7l-.5.7-.5.6c-.2.2-.3.4-.1.7.2.4.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.6 1.6.3.2.5.1.7-.1l1-1.2c.2-.3.4-.3.7-.2l2.3 1.1c.4.2.6.3.7.5.1.1.1.7-.1 1.5Z"/>',
	'linkedin' => '<path d="M5 3a2.3 2.3 0 1 1 0 4.6A2.3 2.3 0 0 1 5 3ZM3 9h4v12H3V9Zm6 0h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9V9Z"/>',
	'email'    => '<path d="M3 5h18v14H3V5Zm9 8 6.5-5H5.5l6.5 5Zm-7 4h14V9.5l-7 5.4-7-5.4V17Z"/>',
	'telegram' => '<path d="m21.5 3.5-3.3 16c-.3 1.1-1 1.4-2 .9l-5-3.7-2.4 2.4c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L5.4 13.2.5 11.7c-1.1-.3-1.1-1.1.2-1.6L20 2.7c.9-.3 1.7.2 1.5.8Z"/>',
	'x'        => '<path d="M4 3h5.2l4.1 5.5L18.2 3H21l-6.4 7.5L21.5 21h-5.2l-4.7-6.4L6.2 21H3.4l6.9-8.4L4 3Zm3 2 10.3 14h1.2L8.2 5H7Z"/>',
	'bluesky'  => '<path d="M12 10.8C11.1 9 8.7 5.5 6.5 4 4.4 2.6 3.6 2.8 3 3.1 2.4 3.5 2.2 4.4 2.2 5c0 .6.3 5  .5 5.7.7 2.2 3 3 5.1 2.7-3.7.6-7 2-2.7 6.8 4.7 4.8 6.4-1 6.9-2.8.5 1.8 1.8 7.5 6.8 2.8 4-4-.8-6.2-2.7-6.8 2.1.3 4.4-.5 5.1-2.7.2-.7.5-5.1.5-5.7 0-.6-.2-1.5-.8-1.9-.6-.3-1.4-.5-3.5.9-2.2 1.5-4.6 5-5.5 6.8Z"/>',
	'threads'  => '<path d="M12.2 2C6.6 2 3 5.8 3 11.8 3 18 6.7 22 12.5 22c5.1 0 8.5-2.8 8.5-7.1 0-3-1.6-5-4.4-5.8-.4-4-3-5.1-5.2-5.1-3.1 0-5.3 2-5.6 4.9l3 .3c.2-1.5 1.1-2.4 2.6-2.4 1.2 0 2 .7 2.2 1.9h-1.2c-3.9 0-6.3 1.8-6.3 4.7 0 2.5 2 4.3 4.8 4.3 2.9 0 5.1-2 5.7-5.3.9.5 1.4 1.4 1.4 2.5 0 2.7-2.1 4.3-5.5 4.3-4.1 0-6.5-2.7-6.5-7.4 0-4.3 2.3-7 6.2-7 2.4 0 4.2 1 5.3 2.8l2.6-1.5C18.5 3.5 15.8 2 12.2 2Zm-.9 12.9c-1.3 0-2.2-.6-2.2-1.6 0-1.2 1.1-1.9 3.2-1.9.5 0 1 0 1.4.1-.2 2.1-1.1 3.4-2.4 3.4Z"/>',
	'reddit'   => '<path d="M22 12.2c0-1.2-1-2.2-2.2-2.2-.6 0-1.1.2-1.5.6-1.5-1-3.5-1.6-5.6-1.7l1.1-3.3 2.8.7a1.8 1.8 0 1 0 .4-1.5l-3.7-.9c-.4-.1-.8.1-.9.5L11 8.9c-2.1.1-4 .7-5.4 1.7-.4-.4-.9-.6-1.5-.6a2.2 2.2 0 0 0-1.4 3.9 4 4 0 0 0-.1 1c0 3.3 4.2 6 9.4 6s9.4-2.7 9.4-6c0-.3 0-.7-.1-1 .5-.4.7-1 .7-1.7ZM7.5 14.3a1.6 1.6 0 1 1 3.2 0 1.6 1.6 0 0 1-3.2 0Zm8.2 3.5c-1.5 1.1-5.9 1.1-7.4 0-.3-.2-.3-.6-.1-.9.2-.3.6-.3.9-.1 1 .7 4.8.7 5.8 0 .3-.2.7-.2.9.1.2.3.2.7-.1.9Zm.2-1.9a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z"/>',
);

$lightweight_share_buttons_class_names = array( 'is-mode-' . sanitize_html_class( $attributes['displayMode'] ), 'is-layout-' . sanitize_html_class( $attributes['layout'] ), 'is-align-' . sanitize_html_class( $attributes['alignment'] ), 'is-size-' . sanitize_html_class( $attributes['size'] ), 'is-shape-' . sanitize_html_class( $attributes['shape'] ) );
if ( ! empty( $attributes['useBrandColors'] ) ) {
	$lightweight_share_buttons_class_names[] = 'has-brand-colors'; }
if ( ! empty( $attributes['wrap'] ) ) {
	$lightweight_share_buttons_class_names[] = 'is-wrap'; }
$lightweight_share_buttons_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'             => implode( ' ', $lightweight_share_buttons_class_names ),
		'style'             => '--lsb-gap:' . absint( $attributes['gap'] ) . 'px',
		'data-url'          => esc_url( $lightweight_share_buttons_url ),
		'data-title'        => esc_attr( $lightweight_share_buttons_title ),
		'data-text'         => esc_attr( $lightweight_share_buttons_text ),
		'data-copied-label' => esc_attr__( 'Copied!', 'lightweight-share-buttons' ),
		'data-copy-prompt'  => esc_attr__( 'Copy this link:', 'lightweight-share-buttons' ),
	)
);
?>
<div <?php echo $lightweight_share_buttons_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	if ( ! empty( $attributes['showHeading'] ) && '' !== trim( $attributes['heading'] ) ) :
		?>
		<p class="lsb-heading"><?php echo esc_html( $attributes['heading'] ); ?></p><?php endif; ?>
	<div class="lsb-buttons" role="group" aria-label="<?php esc_attr_e( 'Share this page', 'lightweight-share-buttons' ); ?>">
		<?php
		foreach ( $attributes['services'] as $lightweight_share_buttons_service ) :
			if ( ! is_string( $lightweight_share_buttons_service ) || ! isset( $lightweight_share_buttons_services[ $lightweight_share_buttons_service ] ) ) {
				continue;
			}
			$lightweight_share_buttons_item = $lightweight_share_buttons_services[ $lightweight_share_buttons_service ];
			?>
			<?php
			$lightweight_share_buttons_button_style = '';
			$lightweight_share_buttons_text_style   = '';
			if ( empty( $attributes['useBrandColors'] ) ) {
				$lightweight_share_buttons_background = sanitize_hex_color( $attributes['serviceColors'][ $lightweight_share_buttons_service ]['background'] ?? '' );
				$lightweight_share_buttons_text_color = sanitize_hex_color( $attributes['serviceColors'][ $lightweight_share_buttons_service ]['text'] ?? '' );
				$lightweight_share_buttons_background = $lightweight_share_buttons_background ? $lightweight_share_buttons_background : '#000000';
				$lightweight_share_buttons_text_color = $lightweight_share_buttons_text_color ? $lightweight_share_buttons_text_color : '#ffffff';
				if ( $lightweight_share_buttons_background ) {
					$lightweight_share_buttons_button_style = 'background-color:' . $lightweight_share_buttons_background . ';'; }
				if ( $lightweight_share_buttons_text_color ) {
					$lightweight_share_buttons_button_style .= 'color:' . $lightweight_share_buttons_text_color . ';';
					$lightweight_share_buttons_text_style    = ' style="color:' . esc_attr( $lightweight_share_buttons_text_color ) . ';"'; }
			}
			$lightweight_share_buttons_style_attribute = $lightweight_share_buttons_button_style ? ' style="' . esc_attr( $lightweight_share_buttons_button_style ) . '"' : '';
			?>
			<?php if ( 'native' === $lightweight_share_buttons_service || 'copy' === $lightweight_share_buttons_service ) : ?>
				<button type="button" class="lsb-button is-<?php echo esc_attr( $lightweight_share_buttons_service ); ?>"<?php echo $lightweight_share_buttons_style_attribute; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped above. ?> data-lsb-<?php echo esc_attr( $lightweight_share_buttons_service ); ?>>
			<?php else : ?>
				<a class="lsb-button is-<?php echo esc_attr( $lightweight_share_buttons_service ); ?>"<?php echo $lightweight_share_buttons_style_attribute; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped above. ?> href="<?php echo esc_url( $lightweight_share_buttons_item['url'] ); ?>"<?php echo 'email' === $lightweight_share_buttons_service ? '' : ' target="_blank"'; ?> rel="nofollow noopener noreferrer">
			<?php endif; ?>
				<span class="lsb-icon"<?php echo $lightweight_share_buttons_text_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped above. ?> aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><?php echo $lightweight_share_buttons_icons[ $lightweight_share_buttons_service ]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static SVG paths. ?></svg></span>
				<span class="lsb-label"<?php echo $lightweight_share_buttons_text_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped above. ?>><?php echo esc_html( $lightweight_share_buttons_item['label'] ); ?></span>
			<?php echo ( 'native' === $lightweight_share_buttons_service || 'copy' === $lightweight_share_buttons_service ) ? '</button>' : '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php endforeach; ?>
	</div>
	<span class="lsb-status" aria-live="polite" aria-atomic="true"></span>
</div>
