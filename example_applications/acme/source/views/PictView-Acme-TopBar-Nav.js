/**
 * Acme-TopBar-Nav — primary navigation buttons for the topbar.
 *
 * Renders into `#Theme-TopBar-Nav` (the slot pict-section-theme's
 * Theme-TopBar exposes). Three buttons: About, Legal, Store. The
 * active route gets `aria-current="page"`, which the chrome's CSS
 * picks up and highlights with the brand-primary color.
 *
 * Mounted automatically because the application bootstrap passes
 *
 *     ViewOptions: { TopBar: { NavView: 'Acme-TopBar-Nav' } }
 *
 * to the Theme-Section provider.
 */

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:               'Acme-TopBar-Nav',
	DefaultRenderable:            'Acme-TopBar-Nav-Content',
	DefaultDestinationAddress:    '#Theme-TopBar-Nav',
	DefaultTemplateRecordAddress: 'AppData.Acme',
	AutoRender:                   false,

	CSS: /*css*/`
		.acme-topbar-nav
		{
			display: flex;
			align-items: center;
			gap: 4px;
		}
		.acme-topbar-nav button
		{
			font-family: inherit;
			font-size: 13px;
			font-weight: 500;
			padding: 6px 14px;
			border: 1px solid transparent;
			border-radius: 6px;
			background: transparent;
			color: var(--theme-color-text-secondary);
			cursor: pointer;
			transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
		}
		.acme-topbar-nav button:hover
		{
			background: var(--theme-color-background-hover);
			color: var(--theme-color-text-primary);
		}
		/* Active-route highlight. Theme-TopBar already ships a generic
		   [aria-current="page"] rule inside .pict-theme-topbar-nav, but
		   we re-declare it here at higher specificity (class + type +
		   attribute beats the chrome's class + attribute) so the
		   highlight is guaranteed regardless of CSS load order or
		   any future host CSS that might add ":hover-like" rules
		   that would otherwise win. */
		.acme-topbar-nav button[aria-current="page"]
		{
			color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
			border-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
			background: var(--theme-color-background-hover, rgba(229, 75, 30, 0.10));
		}
	`,
	CSSPriority: 500,

	Templates:
	[
		{
			Hash: 'Acme-TopBar-Nav-Template',
			// aria-current="page" on the active route's button. The
			// Theme-TopBar CSS automatically applies a brand-tinted
			// highlight to any [aria-current="page"] in the nav slot.
			// `Record.Is<Route>` is "page" when active, "" otherwise —
			// onBeforeRender computes these from AppData.
			Template: /*html*/`
<div class="acme-topbar-nav">
	<button type="button"
		aria-current="{~D:Record.IsAbout~}"
		onclick="{~P~}.PictApplication.navigateTo('/About')">About</button>
	<button type="button"
		aria-current="{~D:Record.IsLegal~}"
		onclick="{~P~}.PictApplication.navigateTo('/Legal')">Legal</button>
	<button type="button"
		aria-current="{~D:Record.IsStore~}"
		onclick="{~P~}.PictApplication.navigateTo('/Store')">Store</button>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash:     'Acme-TopBar-Nav-Content',
			TemplateHash:       'Acme-TopBar-Nav-Template',
			DestinationAddress: '#Theme-TopBar-Nav',
			RenderMethod:       'replace'
		}
	]
};

class AcmeTopBarNavView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onBeforeRender()
	{
		// Compute the per-button "page" / "" flag from CurrentRoute.
		// IMPORTANT: Pict resolves the template Record from
		// DefaultTemplateRecordAddress BEFORE invoking onBeforeRender,
		// so the return value here is IGNORED. We have to mutate the
		// addressed slot (AppData.Acme) so the template picks up the
		// freshly-computed IsXxx flags.
		let tmpAcme = this.pict.AppData.Acme || {};
		let tmpRoute = tmpAcme.CurrentRoute || '';
		tmpAcme.IsAbout = (tmpRoute === 'About') ? 'page' : '';
		tmpAcme.IsLegal = (tmpRoute === 'Legal') ? 'page' : '';
		tmpAcme.IsStore = (tmpRoute === 'Store') ? 'page' : '';
	}

	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}
}

module.exports = AcmeTopBarNavView;
module.exports.default_configuration = _ViewConfiguration;
