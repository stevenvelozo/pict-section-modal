const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookstore-About",

	DefaultRenderable: "Bookstore-About-Content",
	DefaultDestinationAddress: "#Bookstore-Content-Container",

	AutoRender: false,

	CSS: /*css*/`
		.bookstore-about {
			padding: 2em;
			max-width: 720px;
			margin: 0 auto;
		}
		.bookstore-about-header {
			text-align: center;
			padding-bottom: 1.5em;
			border-bottom: 1px solid #eee;
			margin-bottom: 2em;
		}
		.bookstore-about-header h1 {
			margin: 0 0 0.25em 0;
			font-size: 1.8em;
			font-weight: 300;
			color: #1e3a5f;
		}
		.bookstore-about-header p {
			margin: 0;
			color: #7f8c8d;
			font-size: 1.05em;
		}
		.bookstore-about h2 {
			margin: 1.5em 0 0.5em 0;
			font-weight: 500;
			color: #1e3a5f;
			font-size: 1.2em;
		}
		.bookstore-about p {
			color: #555;
			line-height: 1.7;
		}
		.bookstore-about-features {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 1em;
			margin-top: 1em;
		}
		.bookstore-about-feature {
			background: #f8f9fa;
			border: 1px solid #e9ecef;
			border-radius: 6px;
			padding: 1.25em;
		}
		.bookstore-about-feature h3 {
			margin: 0 0 0.35em 0;
			font-size: 1em;
			color: #1e3a5f;
		}
		.bookstore-about-feature p {
			margin: 0;
			font-size: 0.9em;
		}
		.bookstore-about-tech {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
			gap: 1em;
			margin-top: 1em;
		}
		.bookstore-about-tech-item {
			background: #fff;
			border: 1px solid #e0e0e0;
			border-radius: 4px;
			padding: 1em;
			text-align: center;
		}
		.bookstore-about-tech-item strong {
			display: block;
			margin-bottom: 0.25em;
			color: #1e3a5f;
		}
		.bookstore-about-tech-item span {
			font-size: 0.85em;
			color: #666;
		}
	`,

	Templates:
	[
		{
			Hash: "Bookstore-About-Template",
			Template: /*html*/`
<div class="bookstore-about">
	<div class="bookstore-about-header">
		<h1>About the Bookstore Demo</h1>
		<p>A practical example of pict-section-modal in a data-driven application</p>
	</div>

	<h2>Purpose</h2>
	<p>This example application demonstrates how to use pict-section-modal in a realistic scenario. Instead of isolated feature demos, the Bookstore shows how modals, confirmation dialogs, toasts, and tooltips work together in a multi-page application backed by data.</p>

	<h2>Features Demonstrated</h2>
	<div class="bookstore-about-features">
		<div class="bookstore-about-feature">
			<h3>Modal Windows</h3>
			<p>Book detail views are shown in closeable modal windows with custom content and action buttons.</p>
		</div>
		<div class="bookstore-about-feature">
			<h3>Confirm Dialogs</h3>
			<p>Single-book deletion uses a standard confirm dialog with a dangerous action style.</p>
		</div>
		<div class="bookstore-about-feature">
			<h3>Double Confirm</h3>
			<p>Clearing all books requires typing a confirmation phrase to prevent accidental data loss.</p>
		</div>
		<div class="bookstore-about-feature">
			<h3>Toast Notifications</h3>
			<p>Success and informational toasts provide feedback after actions like deleting books or loading the list.</p>
		</div>
		<div class="bookstore-about-feature">
			<h3>Tooltips</h3>
			<p>Action buttons in the book table have hover tooltips explaining what each button does.</p>
		</div>
		<div class="bookstore-about-feature">
			<h3>Hash Routing</h3>
			<p>Navigation between Books and About pages uses pict-router with hash-based URLs.</p>
		</div>
	</div>

	<h2>Built With</h2>
	<div class="bookstore-about-tech">
		<div class="bookstore-about-tech-item">
			<strong>Pict</strong>
			<span>Application Framework</span>
		</div>
		<div class="bookstore-about-tech-item">
			<strong>Pict-Application</strong>
			<span>App Lifecycle</span>
		</div>
		<div class="bookstore-about-tech-item">
			<strong>Pict-View</strong>
			<span>View Management</span>
		</div>
		<div class="bookstore-about-tech-item">
			<strong>Pict-Router</strong>
			<span>Hash Routing</span>
		</div>
		<div class="bookstore-about-tech-item">
			<strong>Pict-Section-Modal</strong>
			<span>Modals &amp; Toasts</span>
		</div>
	</div>

	<h2>Source Code</h2>
	<p>This example lives in the pict-section-modal repository under <code>example_applications/bookstore/</code>. Each view, the application class, and the router configuration are in separate files following standard Pict conventions.</p>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookstore-About-Content",
			TemplateHash: "Bookstore-About-Template",
			DestinationAddress: "#Bookstore-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class BookstoreAboutView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = BookstoreAboutView;

module.exports.default_configuration = _ViewConfiguration;
