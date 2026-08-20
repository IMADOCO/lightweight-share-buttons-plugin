( function () {
	'use strict';
	function copyFallback( text ) { var area = document.createElement( 'textarea' ); area.value = text; area.setAttribute( 'readonly', '' ); area.style.position = 'fixed'; area.style.opacity = '0'; document.body.appendChild( area ); area.select(); var ok = document.execCommand( 'copy' ); area.remove(); return ok ? Promise.resolve() : Promise.reject(); }
	document.querySelectorAll( '.wp-block-imado-share-buttons' ).forEach( function ( block ) {
		var nativeButton = block.querySelector( '[data-lsb-native]' );
		if ( nativeButton ) {
			if ( ! navigator.share ) nativeButton.hidden = true;
			else nativeButton.addEventListener( 'click', function () { navigator.share( { title: block.dataset.title || '', text: block.dataset.text || '', url: block.dataset.url || location.href } ).catch( function ( error ) { if ( error.name !== 'AbortError' ) console.warn( 'Share failed.', error ); } ); } );
		}
		var copyButton = block.querySelector( '[data-lsb-copy]' );
		if ( copyButton ) copyButton.addEventListener( 'click', function () {
			var label = copyButton.querySelector( '.lsb-label' ), original = label.textContent, url = block.dataset.url || location.href;
			var operation = navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText( url ) : copyFallback( url );
			operation.then( function () { label.textContent = block.dataset.copiedLabel; block.querySelector( '.lsb-status' ).textContent = block.dataset.copiedLabel; window.setTimeout( function () { label.textContent = original; }, 2000 ); } ).catch( function () { window.prompt( block.dataset.copyPrompt, url ); } );
		} );
	} );
} )();

