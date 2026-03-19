const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookstore-BookList",

	DefaultRenderable: "Bookstore-BookList-Content",
	DefaultDestinationAddress: "#Bookstore-Content-Container",

	AutoRender: false,

	CSS: /*css*/`
		.bookstore-list-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 1em;
		}
		.bookstore-list-header h2 {
			margin: 0;
			font-weight: 400;
			color: #1e3a5f;
			font-size: 1.4em;
		}
		.bookstore-list-header .bookstore-count {
			color: #888;
			font-size: 0.9em;
		}
		.bookstore-table-wrap {
			overflow-x: auto;
		}
		.bookstore-table {
			width: 100%;
			border-collapse: collapse;
			font-size: 0.95em;
		}
		.bookstore-table thead th {
			text-align: left;
			padding: 0.7em 0.9em;
			background: #f0f4f8;
			color: #1e3a5f;
			font-weight: 600;
			border-bottom: 2px solid #d0d8e0;
			white-space: nowrap;
		}
		.bookstore-table tbody tr {
			transition: background-color 0.1s;
		}
		.bookstore-table tbody tr:hover {
			background-color: #f7fafc;
		}
		.bookstore-table tbody td {
			padding: 0.65em 0.9em;
			border-bottom: 1px solid #e8ecf0;
			vertical-align: middle;
		}
		.bookstore-stock-yes {
			color: #16a34a;
			font-weight: 600;
		}
		.bookstore-stock-no {
			color: #dc2626;
			font-weight: 600;
		}
		.bookstore-actions {
			display: flex;
			gap: 0.4em;
		}
		.bookstore-btn {
			padding: 0.35em 0.7em;
			border: none;
			border-radius: 4px;
			font-size: 0.85em;
			cursor: pointer;
			transition: background-color 0.15s;
		}
		.bookstore-btn-details {
			background: #2563eb;
			color: #fff;
		}
		.bookstore-btn-details:hover {
			background: #1d4ed8;
		}
		.bookstore-btn-delete {
			background: #fee2e2;
			color: #dc2626;
		}
		.bookstore-btn-delete:hover {
			background: #fca5a5;
			color: #991b1b;
		}
		.bookstore-empty {
			text-align: center;
			padding: 3em 1em;
			color: #888;
		}
		.bookstore-empty h3 {
			margin: 0 0 0.5em 0;
			font-weight: 400;
			font-size: 1.2em;
			color: #666;
		}
		.bookstore-detail-table {
			width: 100%;
			border-collapse: collapse;
		}
		.bookstore-detail-table td {
			padding: 0.6em 0.8em;
			border-bottom: 1px solid #eee;
		}
		.bookstore-detail-label {
			font-weight: 600;
			color: #555;
			width: 110px;
		}
	`,

	Templates:
	[
		{
			Hash: "Bookstore-BookList-Template",
			Template: /*html*/`
<div class="bookstore-list-header">
	<h2>Book Inventory</h2>
	<span id="Bookstore-BookCount" class="bookstore-count"></span>
</div>
<div id="Bookstore-TableWrap" class="bookstore-table-wrap"></div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookstore-BookList-Content",
			TemplateHash: "Bookstore-BookList-Template",
			DestinationAddress: "#Bookstore-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class BookstoreBookListView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this._tooltipHandles = [];
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		this._buildTable();

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}

	/**
	 * Build the books table and inject it into the DOM.
	 * Wires up event listeners for action buttons, tooltips, and shows a toast.
	 */
	_buildTable()
	{
		// Clean up any previous tooltips
		this._destroyTooltips();

		let tmpBooks = this.pict.AppData.Bookstore.Books;
		let tmpTableWrap = document.getElementById('Bookstore-TableWrap');
		let tmpCountEl = document.getElementById('Bookstore-BookCount');

		if (!tmpTableWrap)
		{
			return;
		}

		if (tmpCountEl)
		{
			tmpCountEl.textContent = tmpBooks.length + (tmpBooks.length === 1 ? ' book' : ' books');
		}

		if (tmpBooks.length === 0)
		{
			tmpTableWrap.innerHTML = '<div class="bookstore-empty">'
				+ '<h3>No books in inventory</h3>'
				+ '<p>All books have been removed. Reload the page to restore the sample data.</p>'
				+ '</div>';
			return;
		}

		let tmpHTML = '<table class="bookstore-table">'
			+ '<thead><tr>'
			+ '<th>Title</th>'
			+ '<th>Author</th>'
			+ '<th>Year</th>'
			+ '<th>Genre</th>'
			+ '<th>In Stock</th>'
			+ '<th>Actions</th>'
			+ '</tr></thead>'
			+ '<tbody>';

		for (let i = 0; i < tmpBooks.length; i++)
		{
			let tmpBook = tmpBooks[i];
			let tmpStockClass = tmpBook.InStock ? 'bookstore-stock-yes' : 'bookstore-stock-no';
			let tmpStockText = tmpBook.InStock ? 'Yes' : 'No';

			tmpHTML += '<tr>'
				+ '<td>' + this._escapeHTML(tmpBook.Title) + '</td>'
				+ '<td>' + this._escapeHTML(tmpBook.Author) + '</td>'
				+ '<td>' + tmpBook.Year + '</td>'
				+ '<td>' + this._escapeHTML(tmpBook.Genre) + '</td>'
				+ '<td><span class="' + tmpStockClass + '">' + tmpStockText + '</span></td>'
				+ '<td class="bookstore-actions">'
				+ '<button class="bookstore-btn bookstore-btn-details" data-book-id="' + tmpBook.ID + '" data-action="details">Details</button>'
				+ '<button class="bookstore-btn bookstore-btn-delete" data-book-id="' + tmpBook.ID + '" data-action="delete">Delete</button>'
				+ '</td>'
				+ '</tr>';
		}

		tmpHTML += '</tbody></table>';

		tmpTableWrap.innerHTML = tmpHTML;

		// Wire up event listeners on the action buttons
		let tmpDetailButtons = tmpTableWrap.querySelectorAll('[data-action="details"]');
		let tmpDeleteButtons = tmpTableWrap.querySelectorAll('[data-action="delete"]');

		for (let i = 0; i < tmpDetailButtons.length; i++)
		{
			let tmpBtn = tmpDetailButtons[i];
			let tmpBookID = parseInt(tmpBtn.getAttribute('data-book-id'), 10);

			tmpBtn.addEventListener('click', () =>
			{
				this.pict.PictApplication.viewBookDetails(tmpBookID);
			});

			// Attach tooltip
			let tmpHandle = this.pict.views.PictSectionModal.tooltip(tmpBtn, 'View book details', { position: 'top' });
			this._tooltipHandles.push(tmpHandle);
		}

		for (let i = 0; i < tmpDeleteButtons.length; i++)
		{
			let tmpBtn = tmpDeleteButtons[i];
			let tmpBookID = parseInt(tmpBtn.getAttribute('data-book-id'), 10);

			tmpBtn.addEventListener('click', () =>
			{
				this.pict.PictApplication.deleteBook(tmpBookID);
			});

			// Attach tooltip
			let tmpHandle = this.pict.views.PictSectionModal.tooltip(tmpBtn, 'Remove from inventory', { position: 'top' });
			this._tooltipHandles.push(tmpHandle);
		}

		// Show a toast with the book count
		this.pict.views.PictSectionModal.toast('Showing ' + tmpBooks.length + (tmpBooks.length === 1 ? ' book' : ' books'), { type: 'info', duration: 2000 });
	}

	/**
	 * Refresh the table content without a full view re-render.
	 * Called after books are added or deleted.
	 */
	refreshList()
	{
		this._buildTable();
	}

	/**
	 * Destroy all active tooltip handles to prevent memory leaks.
	 */
	_destroyTooltips()
	{
		for (let i = 0; i < this._tooltipHandles.length; i++)
		{
			if (this._tooltipHandles[i] && typeof this._tooltipHandles[i].destroy === 'function')
			{
				this._tooltipHandles[i].destroy();
			}
		}
		this._tooltipHandles = [];
	}

	/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText
	 * @returns {string}
	 */
	_escapeHTML(pText)
	{
		if (typeof pText !== 'string')
		{
			return '';
		}
		return pText
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}
}

module.exports = BookstoreBookListView;

module.exports.default_configuration = _ViewConfiguration;
