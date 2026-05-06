const libPictApplication = require('pict-application');

const libPictSectionModal = require('pict-section-modal');
const libPictSectionCode = require('pict-section-code');

const libPictViewModalGardenLayout = require('./views/PictView-ModalGarden-Layout.js');

// -- Code Snippet Configurations (read-only display blocks) --

const _CodeSnippets =
[
	{
		ViewIdentifier: 'CodeSnippet-Confirm',
		TargetElementAddress: '#code-snippet-confirm',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "let tmpModal = this.pict.views.PictSectionModal;\n\nlet tmpResult = await tmpModal.confirm('Are you sure you want to proceed?');\n// tmpResult === true  (confirmed)\n// tmpResult === false (cancelled)"
	},
	{
		ViewIdentifier: 'CodeSnippet-DangerousConfirm',
		TargetElementAddress: '#code-snippet-dangerous-confirm',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "let tmpResult = await tmpModal.confirm(\n\t'Delete this record? This action cannot be undone.',\n\t{ dangerous: true, title: 'Delete Record' }\n);"
	},
	{
		ViewIdentifier: 'CodeSnippet-DoubleConfirmPhrase',
		TargetElementAddress: '#code-snippet-double-confirm-phrase',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "let tmpResult = await tmpModal.doubleConfirm(\n\t'This will permanently delete all data in the system.',\n\t{ confirmPhrase: 'DELETE ALL', title: 'Permanent Deletion' }\n);"
	},
	{
		ViewIdentifier: 'CodeSnippet-DoubleConfirmTwoClick',
		TargetElementAddress: '#code-snippet-double-confirm-twoclick',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "let tmpResult = await tmpModal.doubleConfirm(\n\t'Reset all settings to their factory defaults?',\n\t{ title: 'Reset Settings' }\n);"
	},
	{
		ViewIdentifier: 'CodeSnippet-CustomModal',
		TargetElementAddress: '#code-snippet-custom-modal',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "let tmpButtonHash = await tmpModal.show({\n\ttitle: 'Edit Record',\n\tcontent: '<p>You have unsaved changes.</p>',\n\twidth: '500px',\n\tbuttons: [\n\t\t{ Hash: 'cancel', Label: 'Cancel', Style: '' },\n\t\t{ Hash: 'delete', Label: 'Delete', Style: 'danger' },\n\t\t{ Hash: 'save',   Label: 'Save Changes', Style: 'primary' }\n\t]\n});\n// tmpButtonHash === 'save' | 'delete' | 'cancel' | null"
	},
	{
		ViewIdentifier: 'CodeSnippet-ToastTypes',
		TargetElementAddress: '#code-snippet-toast-types',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "tmpModal.toast('Operation completed.', { type: 'success' });\ntmpModal.toast('Something went wrong.', { type: 'error' });\ntmpModal.toast('Please check your input.', { type: 'warning' });\ntmpModal.toast('New version available.', { type: 'info' });"
	},
	{
		ViewIdentifier: 'CodeSnippet-ToastPositions',
		TargetElementAddress: '#code-snippet-toast-positions',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "tmpModal.toast('Message here', { position: 'top-right' });\ntmpModal.toast('Message here', { position: 'bottom-center' });\n// positions: top-right, top-left, top-center,\n//            bottom-right, bottom-left, bottom-center"
	},
	{
		ViewIdentifier: 'CodeSnippet-ToastOptions',
		TargetElementAddress: '#code-snippet-toast-options',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "// Persistent toast (no auto-dismiss)\ntmpModal.toast('Stays until dismissed.', { duration: 0 });\n\n// No dismiss button (auto-closes in 3s)\ntmpModal.toast('Auto-close only.', { dismissible: false });\n\n// Dismiss all active toasts\ntmpModal.dismissToasts();"
	},
	{
		ViewIdentifier: 'CodeSnippet-Tooltips',
		TargetElementAddress: '#code-snippet-tooltips',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "let tmpElement = document.getElementById('my-element');\nlet tmpHandle = tmpModal.tooltip(tmpElement, 'Tooltip text', {\n\tposition: 'top'  // 'top' | 'bottom' | 'left' | 'right'\n});\n// tmpHandle.destroy() removes the tooltip"
	},
	{
		ViewIdentifier: 'CodeSnippet-RichTooltips',
		TargetElementAddress: '#code-snippet-rich-tooltips',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "let tmpHandle = tmpModal.richTooltip(\n\ttmpElement,\n\t'<strong>User Profile</strong><p>Jane Doe</p>',\n\t{ position: 'bottom', maxWidth: '280px', interactive: true }\n);\n// tmpHandle.destroy() removes the tooltip"
	},
	{
		ViewIdentifier: 'CodeSnippet-DropdownNav',
		TargetElementAddress: '#code-snippet-dropdown-nav',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "// Anchor a menu under a nav link\ntmpModal.dropdown(navLinkEl,\n{\n\titems:\n\t[\n\t\t{ Hash: 'app',     Label: 'Application Suite' },\n\t\t{ Hash: 'tools',   Label: 'Developer Tools' },\n\t\t{ Separator: true },\n\t\t{ Hash: 'whats-new', Label: 'What\\'s new', Hint: '5 new' }\n\t]\n}).then((pChoice) => { if (pChoice) console.log(pChoice.Hash); });"
	},
	{
		ViewIdentifier: 'CodeSnippet-DropdownSplit',
		TargetElementAddress: '#code-snippet-dropdown-split',
		Language: 'javascript',
		ReadOnly: true,
		LineNumbers: false,
		DefaultCode: "// Split-button: chevron is the dropdown anchor; align right\n// keeps the menu under the addendum even on long labels.\ntmpModal.dropdown(arrowBtnEl,\n{\n\talign: 'right',\n\titems:\n\t[\n\t\t{ Header: 'Export format' },\n\t\t{ Hash: 'csv',  Label: 'CSV',  Hint: 'default' },\n\t\t{ Hash: 'json', Label: 'JSON' },\n\t\t{ Hash: 'xlsx', Label: 'Excel (XLSX)' },\n\t\t{ Separator: true },\n\t\t{ Hash: 'parquet', Label: 'Apache Parquet',\n\t\t  Disabled: true, Tooltip: 'Pro plan only' }\n\t]\n});"
	}
];

class PictApplicationModalGarden extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('PictSectionModal', libPictSectionModal.default_configuration, libPictSectionModal);
		this.pict.addView('ModalGardenLayout', libPictViewModalGardenLayout.default_configuration, libPictViewModalGardenLayout);

		// Register all code snippet views
		for (let i = 0; i < _CodeSnippets.length; i++)
		{
			this.pict.addView(_CodeSnippets[i].ViewIdentifier, _CodeSnippets[i], libPictSectionCode);
		}
	}

	onAfterInitializeAsync(fCallback)
	{
		this.pict.views.ModalGardenLayout.render();

		return super.onAfterInitializeAsync(fCallback);
	}
}

module.exports = PictApplicationModalGarden;

module.exports.default_configuration =
{
	Name: 'ModalGardenExample',
	Hash: 'ModalGardenExample'
};
