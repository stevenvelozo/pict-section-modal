# Pict-Section-Modal

[![npm version](https://badge.fury.io/js/pict-section-modal.svg)](https://www.npmjs.com/package/pict-section-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modal dialog, confirmation, tooltip, and toast notification section view for the [Pict](https://github.com/stevenvelozo/pict) application framework. Drop in a single view to get promise-based confirmations, custom floating windows, auto-dismissing toasts, and hover tooltips -- all styled through CSS custom properties.

Pict-Section-Modal provides a complete notification and dialog toolkit -- confirm dialogs, double-confirm safety gates, custom modal windows with arbitrary content, toast notifications with stacking, and simple or rich interactive tooltips -- all composable through the Fable service provider pattern.

## Features

- **Confirm Dialogs** -- Promise-based single-step confirmations with OK/Cancel buttons and optional danger styling
- **Double Confirmations** -- Two-step safety gates: type-to-confirm with a required phrase, or click-twice to proceed
- **Custom Modal Windows** -- Arbitrary HTML content with configurable buttons, closeable header, and lifecycle callbacks
- **Toast Notifications** -- Auto-dismissing stacked notifications in six screen positions with four severity types
- **Tooltips** -- Simple text tooltips and rich HTML tooltips with directional positioning and auto-flip
- **CSS Theming** -- 30+ CSS custom properties for full visual customization without touching source code
- **Shared Overlay** -- Reference-counted backdrop shared across stacked modals with click-to-dismiss support
- **Keyboard & Focus** -- Escape key dismissal, focus trapping, and ARIA attributes for accessibility

## Installation

```bash
npm install pict-section-modal
```

## Quick Start

```javascript
const libPictSectionModal = require('pict-section-modal');
const libPict = require('pict');

let _Pict = new libPict({ Product: 'MyApp' });

// Register the modal view
_Pict.addView('Modal', {}, libPictSectionModal);
_Pict.initialize();

let tmpModal = _Pict.views.Modal;

// Show a confirmation
let tmpConfirmed = await tmpModal.confirm('Save changes before closing?');

// Show a toast
tmpModal.toast('File saved successfully.', { type: 'success' });
```

## API

### Confirmations

```javascript
// Simple confirm -- resolves true or false
let tmpResult = await tmpModal.confirm('Delete this record?',
	{
		title: 'Delete Record',
		confirmLabel: 'Delete',
		cancelLabel: 'Keep',
		dangerous: true
	});

// Double confirm with phrase -- user must type the phrase to proceed
let tmpResult = await tmpModal.doubleConfirm('This will permanently delete all data.',
	{
		title: 'Destroy Everything',
		confirmPhrase: 'DELETE ALL',
		phrasePrompt: 'Type "{phrase}" to confirm:',
		confirmLabel: 'Destroy',
		cancelLabel: 'Cancel'
	});

// Double confirm without phrase -- first click changes label, second click confirms
let tmpResult = await tmpModal.doubleConfirm('Reset the entire workspace?',
	{
		title: 'Reset Workspace',
		confirmLabel: 'Reset',
		cancelLabel: 'Cancel'
	});
```

### Modal Windows

```javascript
// Custom modal with buttons -- resolves with the clicked button's Hash
let tmpAction = await tmpModal.show(
	{
		title: 'Export Options',
		content: '<p>Choose an export format:</p>',
		width: '500px',
		closeable: true,
		buttons:
		[
			{ Hash: 'csv', Label: 'CSV', Style: 'primary' },
			{ Hash: 'json', Label: 'JSON' },
			{ Hash: 'xml', Label: 'XML' }
		],
		onOpen: (pDialog) => { console.log('Dialog opened'); },
		onClose: (pResult) => { console.log('Closed with:', pResult); }
	});

if (tmpAction === 'csv')
{
	// Export as CSV
}
```

### Toast Notifications

```javascript
// Basic toast
tmpModal.toast('Operation complete.');

// Typed toasts with options
tmpModal.toast('Record saved.', { type: 'success', duration: 2000 });
tmpModal.toast('Connection lost.', { type: 'error', duration: 0 }); // duration 0 = no auto-dismiss
tmpModal.toast('Low disk space.', { type: 'warning', position: 'bottom-center' });

// Programmatic dismiss
let tmpHandle = tmpModal.toast('Uploading...', { type: 'info', duration: 0 });
// Later...
tmpHandle.dismiss();
```

### Tooltips

```javascript
// Simple text tooltip
let tmpTip = tmpModal.tooltip(document.getElementById('help-icon'), 'Click for help',
	{
		position: 'top',
		delay: 300
	});

// Rich HTML tooltip with interaction
let tmpRichTip = tmpModal.richTooltip(document.getElementById('status'),
	'<strong>Status:</strong> Connected<br><a href="/details">View details</a>',
	{
		position: 'bottom',
		maxWidth: '350px',
		interactive: true
	});

// Remove a tooltip binding
tmpTip.destroy();
```

### Cleanup

```javascript
// Dismiss all modals (confirms and windows)
tmpModal.dismissModals();

// Dismiss all tooltips
tmpModal.dismissTooltips();

// Dismiss all toasts
tmpModal.dismissToasts();

// Dismiss everything
tmpModal.dismissAll();

// Full cleanup -- removes all DOM elements and event listeners
tmpModal.destroy();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ViewIdentifier` | string | `'Pict-Section-Modal'` | Unique view identifier |
| `AutoInitialize` | boolean | `true` | Automatically initialize on registration |
| `AutoRender` | boolean | `false` | Automatically render on initialization |
| `OverlayClickDismisses` | boolean | `true` | Whether clicking the backdrop dismisses the topmost modal |
| `DefaultConfirmOptions.title` | string | `'Confirm'` | Default confirm dialog title |
| `DefaultConfirmOptions.confirmLabel` | string | `'OK'` | Default confirm button text |
| `DefaultConfirmOptions.cancelLabel` | string | `'Cancel'` | Default cancel button text |
| `DefaultConfirmOptions.dangerous` | boolean | `false` | Use danger styling for the confirm button |
| `DefaultDoubleConfirmOptions.title` | string | `'Are you sure?'` | Default double-confirm title |
| `DefaultDoubleConfirmOptions.confirmPhrase` | string | `''` | Phrase the user must type (empty = two-click mode) |
| `DefaultDoubleConfirmOptions.phrasePrompt` | string | `'Type "{phrase}" to confirm:'` | Prompt shown above the input |
| `DefaultModalOptions.title` | string | `''` | Default modal window title |
| `DefaultModalOptions.content` | string | `''` | Default modal body HTML |
| `DefaultModalOptions.closeable` | boolean | `true` | Whether the modal has a close button |
| `DefaultModalOptions.width` | string | `'480px'` | Default modal width |
| `DefaultTooltipOptions.position` | string | `'top'` | Tooltip position (`top`, `bottom`, `left`, `right`) |
| `DefaultTooltipOptions.delay` | number | `200` | Milliseconds before showing tooltip |
| `DefaultTooltipOptions.maxWidth` | string | `'300px'` | Maximum tooltip width |
| `DefaultTooltipOptions.interactive` | boolean | `false` | Allow hovering over the tooltip itself |
| `DefaultToastOptions.type` | string | `'info'` | Toast type (`info`, `success`, `warning`, `error`) |
| `DefaultToastOptions.duration` | number | `3000` | Auto-dismiss delay in milliseconds (0 = manual only) |
| `DefaultToastOptions.position` | string | `'top-right'` | Screen position for the toast container |
| `DefaultToastOptions.dismissible` | boolean | `true` | Show a dismiss button on the toast |

## CSS Theming

Override any `--pict-modal-*` custom property on `.pict-modal-root` to customize the look:

```css
.pict-modal-root
{
	/* Dark theme example */
	--pict-modal-bg: #2d2d2d;
	--pict-modal-fg: #e0e0e0;
	--pict-modal-border: #444444;
	--pict-modal-header-bg: #383838;
	--pict-modal-header-fg: #ffffff;
	--pict-modal-overlay-bg: rgba(0, 0, 0, 0.7);

	--pict-modal-btn-primary-bg: #4a9eff;
	--pict-modal-btn-primary-hover-bg: #3a8eef;

	--pict-modal-toast-bg: #444444;
	--pict-modal-tooltip-bg: #555555;
}
```

## Documentation

Full documentation is available at [https://stevenvelozo.github.io/pict-section-modal/](https://stevenvelozo.github.io/pict-section-modal/)

- [Getting Started](https://stevenvelozo.github.io/pict-section-modal/#/Quick_Start) -- First modal dialog in five minutes
- [Architecture](https://stevenvelozo.github.io/pict-section-modal/#/Architecture) -- Helper class design and overlay management
- [Implementation Reference](https://stevenvelozo.github.io/pict-section-modal/#/Implementation_Reference) -- Complete API surface

## API Reference (Function Docs)

Detailed per-function documentation with code snippets:

| Function | Description |
|----------|-------------|
| [confirm](docs/api/confirm.md) | Show a single-step confirmation dialog |
| [doubleConfirm](docs/api/doubleConfirm.md) | Show a two-step confirmation dialog |
| [show](docs/api/show.md) | Show a custom modal window |
| [toast](docs/api/toast.md) | Show a toast notification |
| [tooltip](docs/api/tooltip.md) | Attach a simple text tooltip |
| [richTooltip](docs/api/richTooltip.md) | Attach a rich HTML tooltip |
| [dismissAll](docs/api/dismissAll.md) | Dismiss all modals, tooltips, and toasts |
| [dismissModals](docs/api/dismissModals.md) | Dismiss all open modals |
| [dismissTooltips](docs/api/dismissTooltips.md) | Dismiss all active tooltips |
| [dismissToasts](docs/api/dismissToasts.md) | Dismiss all active toasts |
| [destroy](docs/api/destroy.md) | Full cleanup of all DOM elements |

## Related Packages

- [pict](https://github.com/stevenvelozo/pict) -- MVC application framework
- [pict-view](https://github.com/stevenvelozo/pict-view) -- View base class
- [pict-section-form](https://github.com/stevenvelozo/pict-section-form) -- Form sections
- [fable](https://github.com/stevenvelozo/fable) -- Service infrastructure and dependency injection

## License

MIT

## Contributing

Pull requests are welcome. For details on our code of conduct, contribution process, and testing requirements, see the [Retold Contributing Guide](https://github.com/stevenvelozo/retold/blob/main/docs/contributing.md).
