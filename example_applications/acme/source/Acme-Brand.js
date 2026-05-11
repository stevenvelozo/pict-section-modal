/**
 * Acme-Brand — the application's wordmark, favicon, and brand colors.
 *
 * Passed as the `Brand` option on `addProvider('Theme-Section', { ... },
 * libPictSectionTheme)`. Drives:
 *
 *   - Theme-Brand-Mark view in the topbar (the inline icon + name)
 *   - --brand-color-* CSS custom properties that any per-theme CSS
 *     can reference for accents (the topbar's bottom stripes, links,
 *     headings, etc.)
 *   - Favicon link injection — the Favicon + FaviconDark fields are
 *     auto-injected as <link rel="icon"> on the document head by
 *     libThemeBrand, so the browser tab shows the brand even before
 *     any chrome renders
 *
 * The shape this module exports is the conventional Pict-section-theme
 * brand block. Real apps usually precompute it at build time via the
 * `pict-section-theme-brand` CLI which writes into package.json under
 * `retold.brand`; for an example app we just author it inline here so
 * the brand setup is readable in one file.
 *
 * The Acme palette: vivid orange (the classic "ACME corp" red-orange)
 * and a complementary teal. Both have light + dark variants tuned so
 * the brand stays vivid in either light or dark mode.
 */

// Stylised gear / cog mark — drawn with stroke="currentColor" so it
// inherits whatever --brand-color-primary-mode resolves to in the
// active mode (light or dark).
const _ACME_ICON_SVG = ''
	+ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"'
	+ ' stroke="currentColor" stroke-width="2" stroke-linecap="round"'
	+ ' stroke-linejoin="round" aria-hidden="true">'
	+ '<circle cx="12" cy="12" r="3"/>'
	+ '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
	+ '</svg>';

// Light-mode favicon: deep red-orange rounded square with bold "A"
// monogram in white. Matches the brand's PrimaryLight (`#c63a14`).
// Uses an explicit fill (not currentColor) because favicons render
// outside the page's CSS cascade.
const _ACME_FAVICON_SVG = ''
	+ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
	+ '<rect width="32" height="32" rx="6" fill="#c63a14"/>'
	+ '<text x="16" y="22" text-anchor="middle"'
	+ ' font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"'
	+ ' font-size="18" font-weight="800" fill="#ffffff" letter-spacing="-0.6">A</text>'
	+ '</svg>';

// Dark-mode favicon: lifted orange tile so it stays visible against the
// dark browser tab chrome that Safari especially uses for dark mode.
const _ACME_FAVICON_DARK_SVG = ''
	+ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
	+ '<rect width="32" height="32" rx="6" fill="#ff7a4a"/>'
	+ '<text x="16" y="22" text-anchor="middle"'
	+ ' font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"'
	+ ' font-size="18" font-weight="800" fill="#1a0a05" letter-spacing="-0.6">A</text>'
	+ '</svg>';

module.exports =
{
	Hash:    'acme-widgets',
	Name:    'Acme Widgets',
	Tagline: 'Quality goods since 1932',

	Icon:     _ACME_ICON_SVG,
	IconType: 'svg',

	Favicon:     _ACME_FAVICON_SVG,
	FaviconDark: _ACME_FAVICON_DARK_SVG,

	Colors:
	{
		// Vivid orange primary, complementary teal secondary, with
		// EXPLICIT light + dark variants. The nested
		//   Primary:   { Light: ..., Dark: ... }
		//   Secondary: { Light: ..., Dark: ... }
		// shape mirrors how theme JSONs already structure their
		// Tokens.Color.* trees and makes the "both modes are
		// brand-aware" contract obvious. Theme-Brand picks the right
		// pair at boot and on every mode toggle — your CSS references
		// `--brand-color-primary-mode` / `--brand-color-secondary-mode`
		// and gets the correct value automatically.
		//
		// The light variants are deeper / more saturated so they pop
		// against the warm paper-and-ink background of acme-default's
		// light mode. The dark variants are lifted / brighter so they
		// stay vivid against the dark slate background of dark mode.
		Primary:   { Light: '#c63a14', Dark: '#ff7a4a' },
		Secondary: { Light: '#0d7a82', Dark: '#5fc5cb' }
	}
};
