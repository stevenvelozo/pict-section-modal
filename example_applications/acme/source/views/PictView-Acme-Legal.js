/**
 * Acme-Legal — the /Legal page content.
 *
 * Renders into `#Acme-Workspace-Content`. Plain content page; included
 * to make the navigation feel like a real multi-page site rather than
 * a single-view demo.
 */

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'Acme-Legal',
	DefaultRenderable:         'Acme-Legal-Content',
	DefaultDestinationAddress: '#Acme-Workspace-Content',
	AutoRender:                false,

	CSS: /*css*/`
		.acme-legal
		{
			max-width: 760px;
		}
		.acme-legal h1
		{
			margin: 0 0 24px;
			font-size: 28px;
			color: var(--brand-color-primary-mode);
		}
		.acme-legal h2
		{
			margin: 28px 0 10px;
			font-size: 16px;
		}
		.acme-legal p
		{
			line-height: 1.55;
			color: var(--theme-color-text-primary);
		}
		.acme-legal .acme-legal-small
		{
			margin-top: 28px;
			font-size: 12px;
			color: var(--theme-color-text-muted);
		}
	`,
	CSSPriority: 500,

	Templates:
	[
		{
			Hash: 'Acme-Legal-Content-Template',
			Template: /*html*/`
<div class="acme-legal">
	<h1>Legal</h1>

	<h2>Terms</h2>
	<p>This is a make-believe terms-of-service page for an example
	Pict application. No widgets are sold, no anvils are dropped, and
	no roadrunners are pursued.</p>

	<h2>Privacy</h2>
	<p>The Acme example app stores your theme + scale picks in
	<code>localStorage</code> under the scope <code>acme-widgets</code>.
	No other data leaves the page. You can clear localStorage at any
	time from your browser's developer tools.</p>

	<h2>Source</h2>
	<p>This example lives in <code>pict-section-modal/
	example_applications/acme/</code>. Read the source to see how the
	shell, theme integration, brand block, custom theme, router, and
	per-route sidebar are wired up. Each view file is heavily commented.</p>

	<p class="acme-legal-small">© 1932–2026 Acme Widgets — All anvils
	reserved.</p>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash:     'Acme-Legal-Content',
			TemplateHash:       'Acme-Legal-Content-Template',
			DestinationAddress: '#Acme-Workspace-Content',
			RenderMethod:       'replace'
		}
	]
};

class AcmeLegalView extends libPictView
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

module.exports = AcmeLegalView;
module.exports.default_configuration = _ViewConfiguration;
