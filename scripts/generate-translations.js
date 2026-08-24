const fs = require( 'fs' );
const path = require( 'path' );

const root = path.resolve( __dirname, '..' );
const directory = path.join( root, 'languages' );
const template = fs.readFileSync( path.join( directory, 'lightweight-share-buttons.pot' ), 'utf8' );
const catalogs = JSON.parse( fs.readFileSync( path.join( __dirname, 'translations.json' ), 'utf8' ) );
const escapePo = ( value ) => value.replace( /\\/g, '\\\\' ).replace( /"/g, '\\"' );
const unescapePo = ( value ) => value.replace( /\\"/g, '"' ).replace( /\\\\/g, '\\' );

for ( const [ locale, translations ] of Object.entries( catalogs ) ) {
	const output = template.split( /\r?\n\r?\n/ ).map( ( entry, index ) => {
		if ( index === 0 ) {
			return entry
				.replace( /("Language-Team: .*\\n")/, `$1\n"Language: ${ locale }\\n"` )
				.replace( /"PO-Revision-Date: .*\\n"/, `"PO-Revision-Date: ${ new Date().toISOString() }\\n"` );
		}
		const match = entry.match( /^msgid "(.*)"$/m );
		if ( ! match ) return entry;
		const message = unescapePo( match[ 1 ] );
		if ( ! translations[ message ] ) throw new Error( `Missing ${ locale } translation: ${ message }` );
		return entry.replace( /^msgstr ""$/m, `msgstr "${ escapePo( translations[ message ] ) }"` );
	} ).join( '\n\n' );
	fs.writeFileSync( path.join( directory, `lightweight-share-buttons-${ locale }.po` ), output, 'utf8' );
}
