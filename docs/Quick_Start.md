# Quick Start

This guide walks you through adding modal dialogs, confirmations, toasts, and tooltips to a Pict application -- installing the package, registering the view, and using each feature.

## Prerequisites

- Node.js 16+
- A Pict application (or willingness to create one)

## Installation

```bash
npm install pict-section-modal
```

If you are building for the browser, also install the build tool:

```bash
npm install --save-dev quackage
```

## Step 1: Create a Pict Application

If you do not already have a Pict application, create a minimal one:

```javascript
const libPict = require('pict');

let _Pict = new libPict(
	{
		Product: 'ModalDemo',
		ProductVersion: '1.0.0'
	});
```

## Step 2: Register the Modal View

Pict-Section-Modal exports a View class. Register it with your Pict instance:

```javascript
const libPictSectionModal = require('pict-section-modal');

_Pict.addView('Modal', {}, libPictSectionModal);
```

The view auto-initializes by default. No HTML container element is needed -- all DOM elements are appended directly to `document.body`.

## Step 3: Initialize

```javascript
// Initialize the application (triggers view initialization)
_Pict.initialize();

// The modal view is now accessible
let tmpModal = _Pict.views.Modal;
```

## Step 4: Show a Basic Confirm

Use `confirm()` to ask the user a yes/no question. The method returns a Promise that resolves to `true` (confirmed) or `false` (cancelled):

```javascript
let tmpConfirmed = await tmpModal.confirm('Save changes before closing?');

if (tmpConfirmed)
{
	saveDocument();
}
```

Customize the title and button labels:

```javascript
let tmpConfirmed = await tmpModal.confirm('Delete this record permanently?',
	{
		title: 'Delete Record',
		confirmLabel: 'Delete',
		cancelLabel: 'Keep',
		dangerous: true
	});
```

The `dangerous` flag styles the confirm button in red to signal a destructive action.

## Step 5: Show a Toast

Use `toast()` to display a brief notification. Toasts auto-dismiss after a configurable duration:

```javascript
// Info toast (default)
tmpModal.toast('Settings updated.');

// Success toast
tmpModal.toast('File uploaded successfully.', { type: 'success' });

// Warning toast
tmpModal.toast('Disk space running low.', { type: 'warning' });

// Error toast that stays until dismissed
tmpModal.toast('Connection failed.', { type: 'error', duration: 0 });
```

Toast positions: `top-right` (default), `top-left`, `top-center`, `bottom-right`, `bottom-left`, `bottom-center`.

## Step 6: Show a Custom Modal

Use `show()` to display a modal window with arbitrary HTML content and action buttons. The method returns a Promise that resolves with the clicked button's `Hash`:

```javascript
let tmpAction = await tmpModal.show(
	{
		title: 'Export Options',
		content: '<p>Select an export format for your data.</p>',
		width: '450px',
		buttons:
		[
			{ Hash: 'csv', Label: 'CSV', Style: 'primary' },
			{ Hash: 'json', Label: 'JSON' },
			{ Hash: 'cancel', Label: 'Cancel' }
		]
	});

switch (tmpAction)
{
	case 'csv':
		exportAsCSV();
		break;
	case 'json':
		exportAsJSON();
		break;
	default:
		// Closed or cancelled
		break;
}
```

## Step 7: Add Tooltips

Attach tooltips to any DOM element. The tooltip appears on hover after a configurable delay:

```javascript
// Simple text tooltip
let tmpTip = tmpModal.tooltip(
	document.getElementById('save-btn'),
	'Save the current document (Ctrl+S)',
	{ position: 'bottom' }
);

// Rich HTML tooltip with clickable content
let tmpRichTip = tmpModal.richTooltip(
	document.getElementById('user-avatar'),
	'<strong>Jane Smith</strong><br>Administrator<br><a href="/profile">View Profile</a>',
	{
		position: 'right',
		maxWidth: '250px',
		interactive: true
	}
);
```

When you no longer need a tooltip binding, call `destroy()` on the returned handle:

```javascript
tmpTip.destroy();
```

## Step 8: Double Confirm for Safety

For dangerous operations, use `doubleConfirm()` to add an extra safety step. There are two modes:

**Phrase mode** -- the user must type a specific phrase:

```javascript
let tmpConfirmed = await tmpModal.doubleConfirm(
	'This will permanently delete all project data. This action cannot be undone.',
	{
		title: 'Delete Project',
		confirmPhrase: 'DELETE PROJECT',
		confirmLabel: 'Delete Forever',
		cancelLabel: 'Cancel'
	});
```

**Two-click mode** -- no phrase required, the button label changes on first click:

```javascript
let tmpConfirmed = await tmpModal.doubleConfirm(
	'Reset the entire workspace to default settings?',
	{
		title: 'Reset Workspace',
		confirmLabel: 'Reset',
		cancelLabel: 'Cancel'
	});
```

## Complete Working Example

Here is a full example demonstrating all features together:

```javascript
const libPict = require('pict');
const libPictSectionModal = require('pict-section-modal');

let _Pict = new libPict({ Product: 'FullDemo' });
_Pict.addView('Modal', {}, libPictSectionModal);
_Pict.initialize();

let tmpModal = _Pict.views.Modal;

async function deleteItem(pItemName)
{
	// Step 1: Confirm
	let tmpConfirmed = await tmpModal.confirm(
		'Delete "' + pItemName + '"?',
		{
			title: 'Delete Item',
			confirmLabel: 'Delete',
			cancelLabel: 'Keep',
			dangerous: true
		});

	if (!tmpConfirmed)
	{
		tmpModal.toast('Deletion cancelled.', { type: 'info' });
		return;
	}

	// Step 2: Perform the operation
	try
	{
		await performDelete(pItemName);
		tmpModal.toast(pItemName + ' deleted.', { type: 'success' });
	}
	catch (pError)
	{
		tmpModal.toast('Failed to delete: ' + pError.message, { type: 'error', duration: 0 });
	}
}

async function showExportDialog()
{
	let tmpFormat = await tmpModal.show(
		{
			title: 'Export Data',
			content: '<p>Choose a format:</p>',
			buttons:
			[
				{ Hash: 'csv', Label: 'CSV', Style: 'primary' },
				{ Hash: 'json', Label: 'JSON' }
			]
		});

	if (tmpFormat)
	{
		let tmpHandle = tmpModal.toast('Exporting as ' + tmpFormat.toUpperCase() + '...', { duration: 0 });
		await performExport(tmpFormat);
		tmpHandle.dismiss();
		tmpModal.toast('Export complete.', { type: 'success' });
	}
}

// Attach tooltips to toolbar buttons
tmpModal.tooltip(document.getElementById('btn-save'), 'Save (Ctrl+S)', { position: 'bottom' });
tmpModal.tooltip(document.getElementById('btn-undo'), 'Undo (Ctrl+Z)', { position: 'bottom' });
tmpModal.tooltip(document.getElementById('btn-export'), 'Export data', { position: 'bottom' });
```

## Next Steps

- **[Architecture](Architecture.md)** -- Understand the helper class design and overlay management
- **[Implementation Reference](Implementation_Reference.md)** -- Full API for every method and configuration option
