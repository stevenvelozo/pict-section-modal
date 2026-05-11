/**
 * Acme-Store — the /Store page content.
 *
 * Renders into `#Acme-Workspace-Content`. Shows the filtered list of
 * Acme's product catalog. The filter values live in
 * `AppData.Acme.Filter` and are mutated by the sidebar's input + radio
 * handlers (`setFilterQuery` / `setFilterCategory` on the application);
 * the sidebar then asks the Store view to re-render so the visible
 * product list reflects the new filter.
 *
 * This is also where the sidebar earns its keep — only relevant on
 * /Store, hidden on /About and /Legal.
 */

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:               'Acme-Store',
	DefaultRenderable:            'Acme-Store-Content',
	DefaultDestinationAddress:    '#Acme-Workspace-Content',
	// Pict reads the template Record from this address BEFORE onBefore-
	// Render runs; onBeforeRender's return value is ignored. So our
	// pre-render compute writes back into AppData.Acme directly, and
	// `Record` in the template is AppData.Acme — picking up both the
	// static fields (Products, Filter) AND the just-computed ones
	// (SummaryText, GridSlot, EmptySlot).
	DefaultTemplateRecordAddress: 'AppData.Acme',
	AutoRender:                   false,

	CSS: /*css*/`
		.acme-store h1
		{
			margin: 0 0 6px;
			font-size: 28px;
			color: var(--brand-color-primary-mode);
		}
		.acme-store-summary
		{
			margin: 0 0 24px;
			color: var(--theme-color-text-secondary);
			font-size: 13px;
		}
		.acme-store-grid
		{
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
			gap: 16px;
		}
		.acme-product
		{
			padding: 14px 16px;
			border: 1px solid var(--theme-color-border-default);
			border-radius: 8px;
			background: var(--theme-color-background-panel);
			display: flex;
			flex-direction: column;
			gap: 8px;
		}
		.acme-product-name
		{
			font-weight: 600;
			color: var(--theme-color-text-primary);
			line-height: 1.3;
		}
		.acme-product-meta
		{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 12px;
			color: var(--theme-color-text-muted);
		}
		.acme-product-category
		{
			text-transform: uppercase;
			letter-spacing: 0.5px;
			font-weight: 600;
			color: var(--brand-color-secondary-mode);
		}
		.acme-product-price
		{
			font-weight: 700;
			font-size: 16px;
			color: var(--theme-color-text-primary);
		}
		.acme-product-stock
		{
			font-size: 11px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.4px;
		}
		.acme-product-stock.in
		{
			color: var(--theme-color-status-success);
		}
		.acme-product-stock.out
		{
			color: var(--theme-color-status-error);
		}
		.acme-store-empty
		{
			padding: 32px;
			text-align: center;
			color: var(--theme-color-text-muted);
			border: 1px dashed var(--theme-color-border-default);
			border-radius: 8px;
		}
	`,
	CSSPriority: 500,

	Templates:
	[
		{
			Hash: 'Acme-Store-Content-Template',
			Template: /*html*/`
<div class="acme-store">
	<h1>Store</h1>
	<p class="acme-store-summary">{~D:Record.SummaryText~}</p>

	{~TS:Acme-Store-Grid-Template:Record.GridSlot~}
	{~TS:Acme-Store-Empty-Template:Record.EmptySlot~}
</div>
`
		},
		{
			Hash: 'Acme-Store-Grid-Template',
			// {~TS:templateHash:arrayAddress~} renders the named
			// template once per element in the array — exactly the
			// per-product iteration we want here. Record.Rows is the
			// filtered+display-ready array built in onBeforeRender.
			Template: /*html*/`
<div class="acme-store-grid">
	{~TS:Acme-Store-Product-Template:Record.Rows~}
</div>
`
		},
		{
			Hash: 'Acme-Store-Product-Template',
			Template: /*html*/`
<div class="acme-product">
	<div class="acme-product-name">{~D:Record.Name~}</div>
	<div class="acme-product-meta">
		<span class="acme-product-category">{~D:Record.Category~}</span>
		<span class="acme-product-stock {~D:Record.StockClass~}">{~D:Record.StockLabel~}</span>
	</div>
	<div class="acme-product-price">\${~D:Record.Price~}</div>
</div>
`
		},
		{
			Hash: 'Acme-Store-Empty-Template',
			Template: /*html*/`
<div class="acme-store-empty">No products match the current filter.</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash:     'Acme-Store-Content',
			TemplateHash:       'Acme-Store-Content-Template',
			DestinationAddress: '#Acme-Workspace-Content',
			RenderMethod:       'replace'
		}
	]
};

class AcmeStoreView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onBeforeRender()
	{
		// Build the filtered + display-ready product rows from the
		// catalog + filter state. Each row gets pre-computed labels
		// for the template so the JS happens here, not in the markup.
		// IMPORTANT: we MUTATE AppData.Acme rather than returning a
		// new object. Pict resolves the Record from
		// DefaultTemplateRecordAddress BEFORE invoking onBeforeRender,
		// so the return value is ignored — the only way to feed the
		// template fresh computed fields is to write them into the
		// already-addressed slot in AppData.
		let tmpAcme = this.pict.AppData.Acme || {};
		let tmpAll = Array.isArray(tmpAcme.Products) ? tmpAcme.Products : [];
		let tmpFilter = tmpAcme.Filter || { Query: '', Category: 'all' };
		let tmpQuery = (tmpFilter.Query || '').trim().toLowerCase();
		let tmpCat = tmpFilter.Category || 'all';

		let tmpMatching = tmpAll.filter((pProduct) =>
		{
			if (tmpCat !== 'all' && pProduct.Category !== tmpCat) return false;
			if (tmpQuery && pProduct.Name.toLowerCase().indexOf(tmpQuery) === -1) return false;
			return true;
		});

		let tmpRows = tmpMatching.map((pProduct) =>
		({
			Name:       pProduct.Name,
			Category:   pProduct.Category,
			Price:      pProduct.Price.toFixed(2),
			StockClass: pProduct.InStock ? 'in' : 'out',
			StockLabel: pProduct.InStock ? 'In stock' : 'Out of stock'
		}));

		// Single-element-array slot trick: GridSlot is empty when there
		// are no rows (so the grid wrapper template doesn't render);
		// EmptySlot is the opposite — empty when there ARE rows. Lets
		// the template fork without an {~IF~} tag.
		let tmpHasRows = tmpRows.length > 0;

		tmpAcme.SummaryText = tmpHasRows
			? ('Showing ' + tmpRows.length + ' of ' + tmpAll.length + ' products')
			: (tmpAll.length + ' products in catalog, none match your filter');
		tmpAcme.GridSlot  = tmpHasRows ? [{ Rows: tmpRows }] : [];
		tmpAcme.EmptySlot = tmpHasRows ? [] : [{}];
	}

	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}
}

module.exports = AcmeStoreView;
module.exports.default_configuration = _ViewConfiguration;
