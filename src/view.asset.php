<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
return array( 'dependencies' => array(), 'version' => (string) filemtime( __DIR__ . '/view.js' ) );
