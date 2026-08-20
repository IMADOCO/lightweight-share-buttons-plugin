const fs = require( 'fs' );
const path = require( 'path' );

const protection = "<?php\nif ( ! defined( 'ABSPATH' ) ) {\n\texit;\n}\n";

[ 'index.asset.php', 'view.asset.php' ].forEach( ( filename ) => {
	const file = path.join( __dirname, '..', 'build', filename );
	const contents = fs.readFileSync( file, 'utf8' );

	if ( ! contents.includes( "defined( 'ABSPATH' )" ) ) {
		fs.writeFileSync( file, contents.replace( /^<\?php\s*/, protection ), 'utf8' );
	}
} );
