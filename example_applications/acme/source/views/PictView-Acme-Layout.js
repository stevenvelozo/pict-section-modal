/**
 * Acme-Layout — builds the application shell.
 *
 * One render, three panels:
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │ #Theme-TopBar   (top, fixed 56)                     │
 *   ├──────────┬──────────────────────────────────────────┤
 *   │ #Acme-   │ Workspace (router-driven content)        │
 *   │ Sidebar  │   - /About                               │
 *   │ (left,   │   - /Legal                               │
 *   │  only on │   - /Store                               │
 *   │  /Store) │                                          │
 *   ├──────────┴──────────────────────────────────────────┤
 *   │ #Theme-BottomBar  (bottom, fixed 32)                │
 *   └─────────────────────────────────────────────────────┘
 *
 * The sidebar panel is added at boot but its display is toggled by
 * the router callback in the application (showView). When the user
 * navigates to /Store the layout calls setSidebarVisible(true) and
 * the panel appears; on /About or /Legal it's hidden.
 *
 * The sidebar also has ResponsiveDrawer: 900 — at narrow viewports it
 * automatically flips from a docked column into a top drawer with a
 * collapse handle, so the workspace gets full width either way.
 */

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'Acme-Layout',
	DefaultRenderable:         'Acme-Layout-Shell',
	DefaultDestinationAddress: '#Acme-Application-Container',
	AutoRender:                false,

	CSS: /*css*/`
		/* height: 100% (not 100vh) — css/acme.css sets html + body +
		   #Acme-Application-Container all to 100%, so this fills the
		   viewport through the parent chain. Why not 100vh? Theme-Scale
		   applies CSS zoom to <html> to implement the scale picker;
		   under zoom != 1.0 the vh unit renders against the un-zoomed
		   viewport, so 100vh * 1.15 puts the bottom bar 15% off-screen.
		   100% cascades through the parent chain and stays in sync
		   with the visible viewport at any zoom level. */
		#Acme-Application-Container
		{
			height: 100%;
			min-height: 0;
			overflow: hidden;
		}
		/* The shell-managed panels pick their bg from theme tokens. */
		.pict-modal-shell-panel  { background: var(--theme-color-background-panel); }
		.pict-modal-shell-center { background: var(--theme-color-background-primary); }

		/* Workspace inner — keeps the routed content padded uniformly. */
		#Acme-Workspace
		{
			padding: 24px 28px;
			box-sizing: border-box;
			min-height: 100%;
			color: var(--theme-color-text-primary);
		}

		/* Sidebar inner — flex column so the filter sticks at top and
		   the product type list scrolls below. */
		#Acme-Sidebar-Content
		{
			display: flex;
			flex-direction: column;
			height: 100%;
			min-height: 0;
		}
	`,

	Templates:
	[
		{
			Hash: 'Acme-Layout-Shell-Template',
			Template: /*html*/`
<div id="Acme-Layout-Mount"></div>
<div id="Acme-ModalRoot"></div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash:     'Acme-Layout-Shell',
			TemplateHash:       'Acme-Layout-Shell-Template',
			DestinationAddress: '#Acme-Application-Container',
			RenderMethod:       'replace'
		}
	]
};

class AcmeLayoutView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this._shell = null;
		this._sidebarPanel = null;
		this._shellBuilt = false;
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		this.pict.CSSMap.injectCSS();

		if (!this._shellBuilt)
		{
			this._buildShell();
			this._shellBuilt = true;
		}

		// Resolve the router so the current hash URL maps to a view.
		// The application's showView() callback will fire and render
		// the matching page + toggle the sidebar visibility.
		if (this.pict.providers.PictRouter)
		{
			this.pict.providers.PictRouter.resolve();
		}

		// If no hash route is set (fresh load), default to /About.
		if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/')
		{
			this.pict.PictApplication.navigateTo('/About');
		}

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}

	_buildShell()
	{
		let tmpModalSection = this.pict.views['Pict-Section-Modal'];
		if (!tmpModalSection || typeof tmpModalSection.shell !== 'function')
		{
			this.pict.log.warn('Acme-Layout: pict-section-modal.shell not available.');
			return;
		}

		let tmpMount = document.getElementById('Acme-Layout-Mount');
		if (!tmpMount)
		{
			this.pict.log.warn('Acme-Layout: #Acme-Layout-Mount not in DOM yet.');
			return;
		}

		this._shell = tmpModalSection.shell(tmpMount,
		{
			PersistenceKey: 'acme-widgets'    // localStorage scope
		});

		// ─── TOP — branded chrome (Theme-TopBar) ─────────────────────
		// ContentDestinationId 'Theme-TopBar' matches the renderable
		// address of pict-section-theme's Theme-TopBar view; the shell
		// creates the destination div, the chrome view renders into it.
		this._shell.addPanel(
		{
			Hash:                 'topbar',
			Side:                 'top',
			Mode:                 'fixed',
			Size:                 56,
			ContentDestinationId: 'Theme-TopBar',
			ContentView:          'Theme-TopBar'
		});

		// ─── BOTTOM — branded chrome (Theme-BottomBar) ───────────────
		this._shell.addPanel(
		{
			Hash:                 'statusbar',
			Side:                 'bottom',
			Mode:                 'fixed',
			Size:                 32,
			MinSize:              20,
			ContentDestinationId: 'Theme-BottomBar',
			ContentView:          'Theme-BottomBar'
		});

		// ─── LEFT — product filter sidebar (Acme-specific) ───────────
		// Added at boot but invisible by default — setSidebarVisible()
		// toggles display based on the active route. Wide widths get a
		// docked 260px column; below 900px it flips to a top drawer
		// via ResponsiveDrawer.
		this._sidebarPanel = this._shell.addPanel(
		{
			Hash:                 'sidebar',
			Side:                 'left',
			Mode:                 'resizable',
			Size:                 260,
			MinSize:              200,
			MaxSize:              420,
			Title:                'Filter',
			ContentDestinationId: 'Acme-Sidebar-Content',
			ContentView:          'Acme-Sidebar',
			ResponsiveDrawer:     900           // ← the responsive flip
		});

		// Initially hidden — the router callback (Application.showView)
		// flips this to true on /Store.
		this._setPanelDisplay(this._sidebarPanel, false);

		// ─── CENTER — the workspace ──────────────────────────────────
		// We mount a nested structure so #Acme-Workspace-Content stays
		// the routed-view destination and #Acme-Workspace carries the
		// page-level padding.
		this._shell.getCenterEl().innerHTML = ''
			+ '<div id="Acme-Workspace">'
			+   '<div id="Acme-Workspace-Content"></div>'
			+ '</div>';
	}

	/**
	 * Toggle the sidebar panel's visibility. Called from the
	 * application's router callback (`showView`) when the active route
	 * changes. We use `display: none / ''` rather than collapse() so
	 * the sidebar is completely gone on non-Store routes — collapse
	 * would leave a 24px tab visible.
	 *
	 * @param {boolean} pVisible
	 */
	setSidebarVisible(pVisible)
	{
		if (!this._sidebarPanel) { return; }
		this._setPanelDisplay(this._sidebarPanel, !!pVisible);
	}

	_setPanelDisplay(pPanel, pVisible)
	{
		if (!pPanel || !pPanel.El) { return; }
		pPanel.El.style.display = pVisible ? '' : 'none';
	}
}

module.exports = AcmeLayoutView;
module.exports.default_configuration = _ViewConfiguration;
