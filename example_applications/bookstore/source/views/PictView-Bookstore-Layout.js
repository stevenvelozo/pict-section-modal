const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookstore-Layout",

	DefaultRenderable: "Bookstore-Layout-Shell",
	DefaultDestinationAddress: "#Bookstore-Application-Container",

	AutoRender: false,

	CSS: /*css*/`
		#Bookstore-Application-Container {
			display: flex;
			flex-direction: column;
			min-height: 100vh;
		}
		#Bookstore-TopBar-Container {
			flex-shrink: 0;
		}
		#Bookstore-Content-Container {
			flex: 1;
			padding: 1.5em;
		}
	`,

	Templates:
	[
		{
			Hash: "Bookstore-Layout-Shell-Template",
			Template: /*html*/`
<div id="Bookstore-TopBar-Container"></div>
<div id="Bookstore-Content-Container"></div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookstore-Layout-Shell",
			TemplateHash: "Bookstore-Layout-Shell-Template",
			DestinationAddress: "#Bookstore-Application-Container",
			RenderMethod: "replace"
		}
	]
};

class BookstoreLayoutView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		// After the layout shell is rendered, render the child views into their containers
		this.pict.views['Bookstore-TopBar'].render();

		// Inject all view CSS
		this.pict.CSSMap.injectCSS();

		// Resolve the router so it picks up the current hash URL
		if (this.pict.providers.PictRouter)
		{
			this.pict.providers.PictRouter.resolve();
		}

		// If no hash route is set, default to the book list
		if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/')
		{
			this.pict.PictApplication.navigateTo('/Books');
		}

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}
}

module.exports = BookstoreLayoutView;

module.exports.default_configuration = _ViewConfiguration;
