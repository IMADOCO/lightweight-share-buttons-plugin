import './style.scss';
import './editor.scss';
import './color-controls.scss';
import * as blocks from '@wordpress/blocks';
import * as element from '@wordpress/element';
import * as blockEditor from '@wordpress/block-editor';
import * as components from '@wordpress/components';
import * as i18n from '@wordpress/i18n';

( function ( blocks, element, blockEditor, components, i18n ) {
	'use strict';
	var el = element.createElement;
	var InspectorControls = blockEditor.InspectorControls;
	var BlockControls = blockEditor.BlockControls;
	var AlignmentToolbar = blockEditor.AlignmentToolbar;
	var ColorPalette = blockEditor.ColorPalette;
	var useBlockProps = blockEditor.useBlockProps;
	var __ = i18n.__;
	var services = [
		[ 'native', __( 'Native Share', 'lightweight-share-buttons' ) ], [ 'copy', __( 'Copy Link', 'lightweight-share-buttons' ) ],
		[ 'facebook', 'Facebook' ], [ 'whatsapp', 'WhatsApp' ], [ 'linkedin', 'LinkedIn' ], [ 'email', __( 'Email', 'lightweight-share-buttons' ) ],
		[ 'telegram', 'Telegram' ], [ 'x', 'X' ], [ 'bluesky', 'Bluesky' ], [ 'threads', 'Threads' ], [ 'reddit', 'Reddit' ]
	];
	var defaults = [ 'native', 'copy', 'facebook', 'whatsapp', 'linkedin' ];
	var iconPaths = {
		native: 'M18 16a3 3 0 0 0-2.4 1.2L8.9 13.4a3 3 0 0 0 0-2.8l6.7-3.8A3 3 0 1 0 15 4c0 .2 0 .4.1.6L8.4 8.4a3 3 0 1 0 0 7.2l6.7 3.8A3 3 0 1 0 18 16Z',
		copy: 'M8 7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-1v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h1V7Zm3 1h3a3 3 0 0 1 3 3v3h1V7h-7v1Zm3 3H7v7h7v-7Z',
		facebook: 'M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v7h4v-7h3l1-4h-4V9c0-.7.3-1 1-1Z',
		whatsapp: 'M12 2a10 10 0 0 0-8.7 14.9L2 22l5.2-1.3A10 10 0 1 0 12 2Zm5.7 14.2c-.2.7-1.3 1.3-2 1.5-.5.1-1.2.2-3.6-.8-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3.1 0-1.5.8-2.3 1.1-2.6.3-.3.7-.4 1-.4h.7c.2 0 .5-.1.8.6l1 2.4c.1.2.1.5 0 .7l-.5.7-.5.6c-.2.2-.3.4-.1.7.2.4.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.6 1.6.3.2.5.1.7-.1l1-1.2c.2-.3.4-.3.7-.2l2.3 1.1c.4.2.6.3.7.5.1.1.1.7-.1 1.5Z',
		linkedin: 'M5 3a2.3 2.3 0 1 1 0 4.6A2.3 2.3 0 0 1 5 3ZM3 9h4v12H3V9Zm6 0h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9V9Z',
		email: 'M3 5h18v14H3V5Zm9 8 6.5-5H5.5l6.5 5Zm-7 4h14V9.5l-7 5.4-7-5.4V17Z',
		telegram: 'm21.5 3.5-3.3 16c-.3 1.1-1 1.4-2 .9l-5-3.7-2.4 2.4c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L5.4 13.2.5 11.7c-1.1-.3-1.1-1.1.2-1.6L20 2.7c.9-.3 1.7.2 1.5.8Z',
		x: 'M4 3h5.2l4.1 5.5L18.2 3H21l-6.4 7.5L21.5 21h-5.2l-4.7-6.4L6.2 21H3.4l6.9-8.4L4 3Zm3 2 10.3 14h1.2L8.2 5H7Z',
		bluesky: 'M12 10.8C11.1 9 8.7 5.5 6.5 4 4.4 2.6 3.6 2.8 3 3.1 2.4 3.5 2.2 4.4 2.2 5c0 .6.3 5 .5 5.7.7 2.2 3 3 5.1 2.7-3.7.6-7 2-2.7 6.8 4.7 4.8 6.4-1 6.9-2.8.5 1.8 1.8 7.5 6.8 2.8 4-4-.8-6.2-2.7-6.8 2.1.3 4.4-.5 5.1-2.7.2-.7.5-5.1.5-5.7 0-.6-.2-1.5-.8-1.9-.6-.3-1.4-.5-3.5.9-2.2 1.5-4.6 5-5.5 6.8Z',
		threads: 'M12.2 2C6.6 2 3 5.8 3 11.8 3 18 6.7 22 12.5 22c5.1 0 8.5-2.8 8.5-7.1 0-3-1.6-5-4.4-5.8-.4-4-3-5.1-5.2-5.1-3.1 0-5.3 2-5.6 4.9l3 .3c.2-1.5 1.1-2.4 2.6-2.4 1.2 0 2 .7 2.2 1.9h-1.2c-3.9 0-6.3 1.8-6.3 4.7 0 2.5 2 4.3 4.8 4.3 2.9 0 5.1-2 5.7-5.3.9.5 1.4 1.4 1.4 2.5 0 2.7-2.1 4.3-5.5 4.3-4.1 0-6.5-2.7-6.5-7.4 0-4.3 2.3-7 6.2-7 2.4 0 4.2 1 5.3 2.8l2.6-1.5C18.5 3.5 15.8 2 12.2 2Zm-.9 12.9c-1.3 0-2.2-.6-2.2-1.6 0-1.2 1.1-1.9 3.2-1.9.5 0 1 0 1.4.1-.2 2.1-1.1 3.4-2.4 3.4Z',
		reddit: 'M22 12.2c0-1.2-1-2.2-2.2-2.2-.6 0-1.1.2-1.5.6-1.5-1-3.5-1.6-5.6-1.7l1.1-3.3 2.8.7a1.8 1.8 0 1 0 .4-1.5l-3.7-.9c-.4-.1-.8.1-.9.5L11 8.9c-2.1.1-4 .7-5.4 1.7-.4-.4-.9-.6-1.5-.6a2.2 2.2 0 0 0-1.4 3.9 4 4 0 0 0-.1 1c0 3.3 4.2 6 9.4 6s9.4-2.7 9.4-6c0-.3 0-.7-.1-1 .5-.4.7-1 .7-1.7ZM7.5 14.3a1.6 1.6 0 1 1 3.2 0 1.6 1.6 0 0 1-3.2 0Zm8.2 3.5c-1.5 1.1-5.9 1.1-7.4 0-.3-.2-.3-.6-.1-.9.2-.3.6-.3.9-.1 1 .7 4.8.7 5.8 0 .3-.2.7-.2.9.1.2.3.2.7-.1.9Zm.2-1.9a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z'
	};
	function getService( slug ) { return services.find( function ( service ) { return service[0] === slug; } ); }
	function previewLabel( service ) { return 'native' === service[0] ? __( 'Share', 'lightweight-share-buttons' ) : service[1]; }
	function PreviewIcon( props ) {
		return el( 'span', { className: 'lsb-icon', style: props.style, 'aria-hidden': 'true' }, el( 'svg', { viewBox: '0 0 24 24', focusable: 'false' }, el( 'path', { d: iconPaths[ props.service ] || iconPaths.native } ) ) );
	}
	function Select( props ) { return el( components.SelectControl, props ); }
	function LabelWithTooltip( label, tooltip ) {
		return el( 'span', { className: 'lsb-label-with-tooltip' },
			el( 'span', null, label ),
			el( components.Tooltip, { text: tooltip },
				el( components.Button, { className: 'lsb-tooltip-button', icon: 'info-outline', size: 'small', label: tooltip } )
			)
		);
	}
	function Edit( props ) {
		var a = props.attributes, set = props.setAttributes;
		var selectedState = element.useState( a.services[0] || 'native' ), selectedService = selectedState[0], setSelectedService = selectedState[1];
		var dragged = element.useRef( '' );
		var overElement = element.useRef( null );
		var dragSource = element.useRef( null );
		var dragGhost = element.useRef( null );
		var insertAfter = element.useRef( false );
		function toggle( slug ) { set( { services: a.services.indexOf( slug ) < 0 ? a.services.concat( slug ) : a.services.filter( function ( item ) { return item !== slug; } ) } ); }
		function setServiceColor( property, value ) { var allColors = Object.assign( {}, a.serviceColors || {} ), colors = Object.assign( {}, allColors[ selectedService ] || {} ); if ( value ) colors[ property ] = value; else delete colors[ property ]; allColors[ selectedService ] = colors; set( { serviceColors: allColors } ); }
		function clearOver() { if ( overElement.current ) overElement.current.classList.remove( 'is-drag-over', 'is-drop-before', 'is-drop-after' ); overElement.current = null; }
		function clearDragVisuals() { clearOver(); if ( dragSource.current ) dragSource.current.classList.remove( 'is-dragging' ); if ( dragGhost.current ) dragGhost.current.remove(); dragSource.current = null; dragGhost.current = null; }
		function reorder( target, after ) { var list = a.services.slice(), from = list.indexOf( dragged.current ); if ( from < 0 || dragged.current === target ) return; list.splice( from, 1 ); var to = list.indexOf( target ); if ( to < 0 ) return; list.splice( to + ( after ? 1 : 0 ), 0, dragged.current ); set( { services: list } ); }
		function startDrag( event, slug ) { event.stopPropagation(); dragged.current = slug; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData( 'text/plain', slug ); }
		function dragOver( event, target ) { if ( ! dragged.current || dragged.current === target ) return; event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = 'move'; if ( overElement.current !== event.currentTarget ) { clearOver(); overElement.current = event.currentTarget; overElement.current.classList.add( 'is-drag-over' ); } }
		function leaveDrag( event ) { if ( ! event.currentTarget.contains( event.relatedTarget ) ) clearOver(); }
		function drop( event, target ) { event.preventDefault(); event.stopPropagation(); clearDragVisuals(); reorder( target, insertAfter.current ); dragged.current = ''; }
		function endDrag( event ) { if ( event ) event.stopPropagation(); dragged.current = ''; clearDragVisuals(); }
		function startPointerDrag( event, slug ) {
			if ( 'mouse' === event.pointerType && 0 !== event.button ) return;
			event.preventDefault(); event.stopPropagation(); dragged.current = slug;
			var source = event.currentTarget, doc = source.ownerDocument, win = doc.defaultView, ghost = doc.createElement( 'div' ), startX = event.clientX, startY = event.clientY, hasMoved = false;
			dragSource.current = source; source.classList.add( 'is-dragging' ); ghost.className = 'lsb-drag-ghost'; ghost.textContent = source.innerText.trim(); doc.body.appendChild( ghost ); dragGhost.current = ghost;
			function movePointer( moveEvent ) { if ( Math.abs( moveEvent.clientX - startX ) > 4 || Math.abs( moveEvent.clientY - startY ) > 4 ) hasMoved = true; ghost.style.transform = 'translate3d(' + ( moveEvent.clientX + 12 ) + 'px,' + ( moveEvent.clientY + 12 ) + 'px,0)'; var node = doc.elementFromPoint( moveEvent.clientX, moveEvent.clientY ), target = node && node.closest( '[data-lsb-preview-service]' ); clearOver(); if ( target && target.dataset.lsbPreviewService !== dragged.current ) { var rect = target.getBoundingClientRect(), vertical = target.closest( '.is-layout-vertical' ), after = vertical ? moveEvent.clientY > rect.top + rect.height / 2 : moveEvent.clientX > rect.left + rect.width / 2; insertAfter.current = after; overElement.current = target; target.classList.add( after ? 'is-drop-after' : 'is-drop-before' ); } }
			function stopPointer( upEvent ) { var node = doc.elementFromPoint( upEvent.clientX, upEvent.clientY ), target = node && node.closest( '[data-lsb-preview-service]' ), targetSlug = target ? target.dataset.lsbPreviewService : ''; win.removeEventListener( 'pointermove', movePointer ); win.removeEventListener( 'pointerup', stopPointer ); win.removeEventListener( 'pointercancel', cancelPointer ); clearDragVisuals(); if ( hasMoved && targetSlug ) reorder( targetSlug, insertAfter.current ); else setSelectedService( slug ); dragged.current = ''; }
			function cancelPointer() { win.removeEventListener( 'pointermove', movePointer ); win.removeEventListener( 'pointerup', stopPointer ); win.removeEventListener( 'pointercancel', cancelPointer ); endDrag(); }
			win.addEventListener( 'pointermove', movePointer ); win.addEventListener( 'pointerup', stopPointer ); win.addEventListener( 'pointercancel', cancelPointer );
			movePointer( event );
		}
		var orderedServices = a.services.map( function ( slug ) { return services.find( function ( item ) { return item[0] === slug; } ); } ).concat( services.filter( function ( item ) { return a.services.indexOf( item[0] ) < 0; } ) );
		var blockClasses = [ 'is-mode-' + a.displayMode, 'is-layout-' + a.layout, 'is-align-' + a.alignment, 'is-size-' + a.size, 'is-shape-' + a.shape ];
		if ( a.useBrandColors ) blockClasses.push( 'has-brand-colors' );
		if ( a.wrap ) blockClasses.push( 'is-wrap' );
		var platformControls = orderedServices.map( function ( service ) {
			var enabled = a.services.indexOf( service[0] ) >= 0;
			return el( 'div', { className: 'lsb-platform-control', key: service[0], onDragOver: function ( event ) { if ( enabled ) dragOver( event, service[0] ); }, onDragLeave: leaveDrag, onDrop: function ( event ) { if ( enabled ) drop( event, service[0] ); } },
				enabled && el( 'span', { className: 'lsb-drag-handle', draggable: true, title: __( 'Drag to reorder', 'lightweight-share-buttons' ), onDragStart: function ( event ) { startDrag( event, service[0] ); }, onDragEnd: endDrag }, el( components.Icon, { icon: 'menu' } ) ),
				el( components.ToggleControl, { label: service[1], checked: enabled, onChange: function () { toggle( service[0] ); }, __nextHasNoMarginBottom: true } )
			);
		} );
		var previewButtons = a.services.map( function ( slug ) {
			var service = getService( slug );
			var colors = ( a.serviceColors && a.serviceColors[ slug ] ) || {};
			var customStyle = a.useBrandColors ? {} : { backgroundColor: colors.background || '#000000', color: colors.text || '#ffffff' };
			if ( ! service ) return null;
			return el( 'button', { type: 'button', className: 'lsb-button is-' + slug + ( selectedService === slug ? ' is-selected-service' : '' ), style: customStyle, key: slug, draggable: true, 'data-lsb-preview-service': slug, title: __( 'Drag to reorder', 'lightweight-share-buttons' ), 'aria-label': previewLabel( service ), onClick: function ( event ) { event.preventDefault(); setSelectedService( slug ); }, onPointerDown: function ( event ) { startPointerDrag( event, slug ); }, onDragStart: function ( event ) { startDrag( event, slug ); }, onDragEnd: endDrag, onDragOver: function ( event ) { dragOver( event, slug ); }, onDragLeave: leaveDrag, onDrop: function ( event ) { drop( event, slug ); } },
				el( PreviewIcon, { service: slug, style: { color: customStyle.color } } ), el( 'span', { className: 'lsb-label', style: { color: customStyle.color } }, previewLabel( service ) )
			);
		} );
		return el( 'div', useBlockProps( { className: blockClasses.join( ' ' ), style: { '--lsb-gap': a.gap + 'px' } } ),
			el( BlockControls, { group: 'block' },
				el( AlignmentToolbar, { value: a.alignment, onChange: function ( value ) { set( { alignment: value || 'left' } ); } } )
			),
			el( InspectorControls, null,
				el( components.PanelBody, { title: __( 'Platforms', 'lightweight-share-buttons' ), initialOpen: true },
					el( 'p', { className: 'lsb-platform-help' }, __( 'Enable more platforms or change the order of active buttons.', 'lightweight-share-buttons' ) ),
					platformControls,
					el( components.Button, { variant: 'secondary', onClick: function () { set( { services: defaults } ); } }, __( 'Restore defaults', 'lightweight-share-buttons' ) ) ),
				el( components.PanelBody, { title: __( 'Content', 'lightweight-share-buttons' ) },
					el( components.ToggleControl, { label: __( 'Show heading', 'lightweight-share-buttons' ), checked: a.showHeading, onChange: function ( value ) { set( { showHeading: value } ); } } ),
					a.showHeading && el( components.TextControl, { label: __( 'Heading', 'lightweight-share-buttons' ), value: a.heading, onChange: function ( value ) { set( { heading: value } ); } } ),
					el( components.TextControl, { label: LabelWithTooltip( __( 'Custom title (optional)', 'lightweight-share-buttons' ), __( 'Used by Native Share, WhatsApp, email, Telegram, X, Bluesky, Threads, and Reddit. Facebook and LinkedIn read the title from the page Open Graph metadata.', 'lightweight-share-buttons' ) ), value: a.customTitle, onChange: function ( value ) { set( { customTitle: value } ); } } ),
					el( components.TextareaControl, { label: LabelWithTooltip( __( 'Message text (optional)', 'lightweight-share-buttons' ), __( 'Used by Native Share, WhatsApp, email, Telegram, X, Bluesky, and Threads. Facebook and LinkedIn do not accept a custom message; Reddit uses only the title and URL.', 'lightweight-share-buttons' ) ), value: a.customText, onChange: function ( value ) { set( { customText: value } ); } } ),
					el( components.ToggleControl, { label: __( 'Custom URL', 'lightweight-share-buttons' ), help: a.urlMode === 'custom' ? __( 'The custom URL will be shared.', 'lightweight-share-buttons' ) : __( 'The current page URL will be shared automatically.', 'lightweight-share-buttons' ), checked: a.urlMode === 'custom', onChange: function ( value ) { set( { urlMode: value ? 'custom' : 'automatic' } ); } } ),
					a.urlMode === 'custom' && el( components.TextControl, { label: __( 'Custom URL', 'lightweight-share-buttons' ), help: __( 'Enter a full URL or a domain, for example example.com/page.', 'lightweight-share-buttons' ), type: 'text', value: a.customUrl, onChange: function ( value ) { set( { customUrl: value } ); } } ) ),
				el( components.PanelBody, { title: __( 'Appearance', 'lightweight-share-buttons' ) },
					el( Select, { label: __( 'Button content', 'lightweight-share-buttons' ), value: a.displayMode, options: [ { label: __( 'Icons and labels', 'lightweight-share-buttons' ), value: 'icon-label' }, { label: __( 'Icons only', 'lightweight-share-buttons' ), value: 'icon' }, { label: __( 'Labels only', 'lightweight-share-buttons' ), value: 'label' } ], onChange: function ( value ) { set( { displayMode: value } ); } } ),
					el( Select, { label: __( 'Size', 'lightweight-share-buttons' ), value: a.size, options: [ 'small', 'medium', 'large' ].map( function(v){ return { label: v.charAt(0).toUpperCase()+v.slice(1), value:v }; } ), onChange: function ( value ) { set( { size: value } ); } } ),
					el( Select, { label: __( 'Layout', 'lightweight-share-buttons' ), value: a.layout, options: [ { label: __( 'Horizontal', 'lightweight-share-buttons' ), value: 'horizontal' }, { label: __( 'Vertical', 'lightweight-share-buttons' ), value: 'vertical' } ], onChange: function ( value ) { set( { layout: value } ); } } ),
					el( Select, { label: __( 'Shape', 'lightweight-share-buttons' ), value: a.shape, options: [ { label: __( 'Square', 'lightweight-share-buttons' ), value: 'square' }, { label: __( 'Rounded', 'lightweight-share-buttons' ), value: 'rounded' }, { label: __( 'Circle', 'lightweight-share-buttons' ), value: 'circle' } ], onChange: function ( value ) { set( { shape: value } ); } } ),
					el( components.RangeControl, { label: __( 'Gap', 'lightweight-share-buttons' ), value: a.gap, min: 0, max: 32, onChange: function ( value ) { set( { gap: value } ); } } ),
					el( components.ToggleControl, { label: __( 'Brand colors', 'lightweight-share-buttons' ), checked: a.useBrandColors, onChange: function ( value ) { set( { useBrandColors: value } ); } } ),
					! a.useBrandColors && el( 'div', { className: 'lsb-color-controls' },
						el( 'p', null, __( 'Colors for:', 'lightweight-share-buttons' ) + ' ', el( 'strong', null, previewLabel( getService( selectedService ) || services[0] ) ) ),
						el( 'p', { className: 'lsb-control-label' }, __( 'Background color', 'lightweight-share-buttons' ) ),
						el( ColorPalette, { value: ( ( a.serviceColors || {} )[ selectedService ] || {} ).background, onChange: function ( value ) { setServiceColor( 'background', value ); }, clearable: true } ),
						el( 'p', { className: 'lsb-control-label' }, __( 'Text color', 'lightweight-share-buttons' ) ),
						el( ColorPalette, { value: ( ( a.serviceColors || {} )[ selectedService ] || {} ).text, onChange: function ( value ) { setServiceColor( 'text', value ); }, clearable: true } )
					),
					el( components.ToggleControl, { label: __( 'Wrap buttons', 'lightweight-share-buttons' ), checked: a.wrap, onChange: function ( value ) { set( { wrap: value } ); } } ) ),
				el( components.PanelBody, { title: __( 'Tracking', 'lightweight-share-buttons' ) },
					el( components.ToggleControl, { label: __( 'Add UTM parameters', 'lightweight-share-buttons' ), checked: a.utmEnabled, onChange: function ( value ) { set( { utmEnabled: value } ); } } ),
					a.utmEnabled && el( 'div', null,
						el( components.TextControl, { label: 'utm_source', value: a.utmSource, onChange: function ( value ) { set( { utmSource: value } ); } } ),
						el( components.TextControl, { label: 'utm_medium', value: a.utmMedium, onChange: function ( value ) { set( { utmMedium: value } ); } } ),
						el( components.TextControl, { label: 'utm_campaign', value: a.utmCampaign, onChange: function ( value ) { set( { utmCampaign: value } ); } } ) ) )
			),
			a.showHeading && a.heading && el( 'p', { className: 'lsb-heading' }, a.heading ),
			el( 'div', { className: 'lsb-buttons', role: 'group', 'aria-label': __( 'Share this page', 'lightweight-share-buttons' ) }, previewButtons )
		);
	}
	blocks.registerBlockType( 'imado/share-buttons', { edit: Edit, save: function () { return null; } } );
} )( blocks, element, blockEditor, components, i18n );
