/**
 * Acme-About — the /About page content.
 *
 * Renders into `#Acme-Workspace-Content` (the destination the layout
 * created inside the shell's center). The application's router
 * callback re-renders this when the user navigates to /About.
 */

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'Acme-About',
	DefaultRenderable:         'Acme-About-Content',
	DefaultDestinationAddress: '#Acme-Workspace-Content',
	AutoRender:                false,

	CSS: /*css*/`
		.acme-about
		{
			max-width: 760px;
		}
		.acme-about h1
		{
			margin: 0 0 8px;
			font-size: 28px;
			color: var(--brand-color-primary-mode);
		}
		.acme-about .acme-about-tagline
		{
			margin: 0 0 24px;
			color: var(--theme-color-text-secondary);
			font-style: italic;
		}
		.acme-about h2
		{
			margin: 28px 0 10px;
			font-size: 18px;
		}
		.acme-about p
		{
			line-height: 1.55;
			color: var(--theme-color-text-primary);
		}
		.acme-about-callout
		{
			margin: 24px 0;
			padding: 16px 18px;
			border-left: 4px solid var(--brand-color-primary-mode);
			background: var(--theme-color-background-secondary);
			border-radius: 0 6px 6px 0;
			line-height: 1.55;
		}
	`,
	CSSPriority: 500,

	Templates:
	[
		{
			Hash: 'Acme-About-Content-Template',
			Template: /*html*/`
<div class="acme-about">
	<h1>About Acme Widgets</h1>
	<p class="acme-about-tagline">Quality goods since 1932.</p>

	<p>Acme Widgets is the imaginary backdrop for this example
	application. It demonstrates the recommended pattern for building
	a fully-branded multi-page Pict app on top of
	<code>pict-section-modal</code>'s <code>shell()</code> and
	<code>pict-section-theme</code>'s chrome views.</p>

	<div class="acme-about-callout">
		Open the gear button at the top-right of the page to try
		light, dark, and system modes, switch between Acme's default
		theme and any of the bundled themes (Synthwave, Twilight,
		Forest, …), and resize the page at any scale from 75% to
		200%. Every theme stays brand-aware because Acme's primary
		and secondary colors are wired through the
		<code>--brand-color-*-mode</code> CSS custom properties.
	</div>

	<h2>What the chrome includes</h2>
	<p>Every page gets the same surrounding chrome: a top bar with
	the brand mark + nav + gear menu, and a bottom status bar. The
	page-level layout view builds these once via the shell's
	<code>addPanel()</code> API and lets the per-route content (this
	page, /Legal, /Store) render inside the workspace center.</p>

	<h2>Try the Store page</h2>
	<p>The Store page adds a fourth panel — a product-filter sidebar
	docked on the left. The sidebar is registered with the shell at
	boot but its display is route-dependent: it only appears when the
	user is on /Store. At narrow viewport widths (under 900px) the
	sidebar automatically flips from a docked column into a top
	drawer.</p>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash:     'Acme-About-Content',
			TemplateHash:       'Acme-About-Content-Template',
			DestinationAddress: '#Acme-Workspace-Content',
			RenderMethod:       'replace'
		}
	]
};

class AcmeAboutView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}
}

module.exports = AcmeAboutView;
module.exports.default_configuration = _ViewConfiguration;
