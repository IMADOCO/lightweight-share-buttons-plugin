const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	output: {
		...defaultConfig.output,
		// Preserve the existing runtime identifier when the package name changes.
		chunkLoadingGlobal: 'webpackChunklightweight_share_buttons',
	},
};
