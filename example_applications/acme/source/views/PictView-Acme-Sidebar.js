/**
 * Acme-Sidebar — product filter sidebar (Store page only).
 *
 * Renders into `#Acme-Sidebar-Content` (the destination the layout
 * creates inside the shell's left side stack). The sidebar PANEL is
 * registered at boot but its visibility is route-dependent: the
 * application's router callback calls `Acme-Layout.setSidebarVisible()`
 * to show it on /Store and hide it elsewhere.
 *
 * Below 900px viewport the same panel re-parents itself into a top
 * drawer (set up by the layout via `ResponsiveDrawer: 900` on the
 * panel config) — the user gets the workspace full-width with the
 * filter accessible via a collapse tab.
 *
 * The filter is a search box + a category radio set. Changing either
 * updates `AppData.Acme.Filter` and re-renders the Store page.
 */

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:               'Acme-Sidebar',
	DefaultRenderable:            'Acme-Sidebar-Content',
	DefaultDestinationAddress:    '#Acme-Sidebar-Content',
	DefaultTemplateRecordAddress: 'AppData.Acme',
	AutoRender:                   false,

	CSS: /*css*/`
		.acme-sidebar
		{
			display: flex;
			flex-direction: column;
			gap: 16px;
			padding: 16px;
			height: 100%;
			box-sizing: border-box;
			color: var(--theme-color-text-primary);
		}
		.acme-sidebar h3
		{
			margin: 0;
			font-size: 11px;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.6px;
			color: var(--theme-color-text-muted);
		}
		.acme-sidebar input[type="search"]
		{
			width: 100%;
			padding: 6px 10px;
			font-size: 13px;
			border-radius: 6px;
			border: 1px solid var(--theme-color-border-default);
			background: var(--theme-color-background-panel);
			color: var(--theme-color-text-primary);
			box-sizing: border-box;
		}
		.acme-sidebar input[type="search"]:focus
		{
			outline: none;
			border-color: var(--brand-color-primary-mode);
			box-shadow: 0 0 0 2px rgba(229, 75, 30, 0.20);
		}
		.acme-sidebar-category
		{
			display: flex;
			flex-direction: column;
			gap: 4px;
		}
		.acme-sidebar-category label
		{
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 4px 6px;
			border-radius: 4px;
			cursor: pointer;
			font-size: 13px;
		}
		.acme-sidebar-category label:hover
		{
			background: var(--theme-color-background-hover);
		}
		.acme-sidebar-category input[type="radio"]
		{
			accent-color: var(--brand-color-primary-mode);
		}
	`,
	CSSPriority: 500,

	Templates:
	[
		{
			Hash: 'Acme-Sidebar-Content-Template',
			Template: /*html*/`
<div class="acme-sidebar">
	<div>
		<h3>Search</h3>
		<input type="search" placeholder="Find a widget…"
			value="{~D:Record.Filter.Query~}"
			oninput="{~P~}.PictApplication.setFilterQuery(this.value)">
	</div>
	<div>
		<h3>Category</h3>
		<div class="acme-sidebar-category">
			<label><input type="radio" name="acme-cat"
				value="all"
				onchange="{~P~}.PictApplication.setFilterCategory('all')"
				{~D:Record.CategoryCheckedAll~}> All products</label>
			<label><input type="radio" name="acme-cat"
				value="gadgets"
				onchange="{~P~}.PictApplication.setFilterCategory('gadgets')"
				{~D:Record.CategoryCheckedGadgets~}> Gadgets</label>
			<label><input type="radio" name="acme-cat"
				value="chemicals"
				onchange="{~P~}.PictApplication.setFilterCategory('chemicals')"
				{~D:Record.CategoryCheckedChemicals~}> Chemicals</label>
			<label><input type="radio" name="acme-cat"
				value="metalwork"
				onchange="{~P~}.PictApplication.setFilterCategory('metalwork')"
				{~D:Record.CategoryCheckedMetalwork~}> Metalwork</label>
			<label><input type="radio" name="acme-cat"
				value="transport"
				onchange="{~P~}.PictApplication.setFilterCategory('transport')"
				{~D:Record.CategoryCheckedTransport~}> Transport</label>
			<label><input type="radio" name="acme-cat"
				value="mystery"
				onchange="{~P~}.PictApplication.setFilterCategory('mystery')"
				{~D:Record.CategoryCheckedMystery~}> Mystery</label>
		</div>
	</div>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash:     'Acme-Sidebar-Content',
			TemplateHash:       'Acme-Sidebar-Content-Template',
			DestinationAddress: '#Acme-Sidebar-Content',
			RenderMethod:       'replace'
		}
	]
};

class AcmeSidebarView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onBeforeRender()
	{
		// Compute per-radio-button "checked" attributes from the
		// current filter category. Pict's render flow resolves the
		// template Record from DefaultTemplateRecordAddress BEFORE
		// invoking onBeforeRender, so the return value here is
		// ignored — we mutate the addressed slot (AppData.Acme)
		// directly so the template sees the fresh flags.
		let tmpAcme = this.pict.AppData.Acme || {};
		let tmpCat = (tmpAcme.Filter && tmpAcme.Filter.Category) || 'all';
		let fChecked = (pKey) => (tmpCat === pKey) ? 'checked' : '';
		tmpAcme.CategoryCheckedAll       = fChecked('all');
		tmpAcme.CategoryCheckedGadgets   = fChecked('gadgets');
		tmpAcme.CategoryCheckedChemicals = fChecked('chemicals');
		tmpAcme.CategoryCheckedMetalwork = fChecked('metalwork');
		tmpAcme.CategoryCheckedTransport = fChecked('transport');
		tmpAcme.CategoryCheckedMystery   = fChecked('mystery');
	}

	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}
}

module.exports = AcmeSidebarView;
module.exports.default_configuration = _ViewConfiguration;
