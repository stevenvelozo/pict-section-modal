const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookstore-TopBar",

	DefaultRenderable: "Bookstore-TopBar-Content",
	DefaultDestinationAddress: "#Bookstore-TopBar-Container",

	AutoRender: false,

	CSS: /*css*/`
		.bookstore-topbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #1e3a5f;
			color: #ecf0f1;
			padding: 0 1.5em;
			height: 56px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
			position: sticky;
			top: 0;
			z-index: 100;
		}
		.bookstore-topbar-brand {
			font-size: 1.3em;
			font-weight: 600;
			letter-spacing: 0.02em;
			color: #ecf0f1;
			text-decoration: none;
			cursor: pointer;
		}
		.bookstore-topbar-brand:hover {
			color: #fff;
		}
		.bookstore-topbar-center {
			display: flex;
			align-items: center;
			gap: 0.25em;
		}
		.bookstore-topbar-center a {
			color: #bdc3c7;
			text-decoration: none;
			padding: 0.5em 0.85em;
			border-radius: 4px;
			font-size: 0.95em;
			transition: background-color 0.15s, color 0.15s;
			cursor: pointer;
		}
		.bookstore-topbar-center a:hover {
			background-color: #2a5082;
			color: #fff;
		}
		.bookstore-topbar-actions {
			display: flex;
			align-items: center;
		}
		.bookstore-btn-clear-all {
			background: transparent;
			border: 1px solid #e74c3c;
			color: #e74c3c;
			padding: 0.4em 0.9em;
			border-radius: 4px;
			font-size: 0.85em;
			cursor: pointer;
			transition: background-color 0.15s, color 0.15s;
		}
		.bookstore-btn-clear-all:hover {
			background: #e74c3c;
			color: #fff;
		}
	`,

	Templates:
	[
		{
			Hash: "Bookstore-TopBar-Template",
			Template: /*html*/`
<div class="bookstore-topbar">
	<a class="bookstore-topbar-brand" onclick="{~P~}.PictApplication.navigateTo('/Books')">Bookstore</a>
	<div class="bookstore-topbar-center">
		<a onclick="{~P~}.PictApplication.navigateTo('/Books')">Books</a>
		<a onclick="{~P~}.PictApplication.navigateTo('/About')">About</a>
	</div>
	<div class="bookstore-topbar-actions">
		<button id="Bookstore-ClearAll-Button" class="bookstore-btn-clear-all">Clear All Books</button>
	</div>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookstore-TopBar-Content",
			TemplateHash: "Bookstore-TopBar-Template",
			DestinationAddress: "#Bookstore-TopBar-Container",
			RenderMethod: "replace"
		}
	]
};

class BookstoreTopBarView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		let tmpClearButton = document.getElementById('Bookstore-ClearAll-Button');
		if (tmpClearButton)
		{
			tmpClearButton.addEventListener('click', () =>
			{
				this.pict.PictApplication.deleteAllBooks();
			});
		}

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}
}

module.exports = BookstoreTopBarView;

module.exports.default_configuration = _ViewConfiguration;
