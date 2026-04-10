# Implementation Reference

Complete API reference for Pict-Section-Modal. This document covers every public method on the main `PictSectionModal` class, all configuration options, and the full CSS class and custom properties reference.

## PictSectionModal -- Main View API

The primary class exported by `pict-section-modal`. Extends `pict-view`.

### Constructor and Initialization

```javascript
const libPictSectionModal = require('pict-section-modal');

_Pict.addView('Modal',
	{
		ViewIdentifier: 'Pict-Section-Modal',
		AutoInitialize: true,
		AutoRender: false,
		OverlayClickDismisses: true
	},
	libPictSectionModal);
```

The view automatically adds the `pict-modal-root` class to `document.body` during initialization to scope CSS custom properties.

---

## Confirmation Methods

### confirm(pMessage, pOptions)

Show a single-step confirmation dialog.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pMessage` | string | Yes | The confirmation message displayed in the dialog body |
| `pOptions` | object | No | Override default confirm options |
| `pOptions.title` | string | No | Dialog title (default: `'Confirm'`) |
| `pOptions.confirmLabel` | string | No | Confirm button text (default: `'OK'`) |
| `pOptions.cancelLabel` | string | No | Cancel button text (default: `'Cancel'`) |
| `pOptions.dangerous` | boolean | No | Use danger styling for the confirm button (default: `false`) |

**Returns:** `Promise<boolean>` -- Resolves `true` if the user clicks confirm, `false` if they cancel, close, press Escape, or click the overlay.

```javascript
let tmpConfirmed = await tmpModal.confirm('Discard unsaved changes?',
	{
		title: 'Unsaved Changes',
		confirmLabel: 'Discard',
		cancelLabel: 'Go Back',
		dangerous: true
	});
```

### doubleConfirm(pMessage, pOptions)

Show a two-step confirmation dialog. Supports two modes:

**Phrase mode** -- When `confirmPhrase` is a non-empty string, the confirm button starts disabled. The user must type the exact phrase into a text input to enable it.

**Two-click mode** -- When `confirmPhrase` is empty or omitted, the confirm button is enabled immediately. The first click changes its label to "Click again to confirm". The second click resolves the promise.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pMessage` | string | Yes | The confirmation message displayed in the dialog body |
| `pOptions` | object | No | Override default double-confirm options |
| `pOptions.title` | string | No | Dialog title (default: `'Are you sure?'`) |
| `pOptions.confirmPhrase` | string | No | Phrase the user must type (default: `''` = two-click mode) |
| `pOptions.phrasePrompt` | string | No | Prompt text shown above the input; `{phrase}` is replaced with the confirm phrase (default: `'Type "{phrase}" to confirm:'`) |
| `pOptions.confirmLabel` | string | No | Confirm button text (default: `'Confirm'`) |
| `pOptions.cancelLabel` | string | No | Cancel button text (default: `'Cancel'`) |

**Returns:** `Promise<boolean>` -- Resolves `true` if the user completes the full confirmation, `false` otherwise.

```javascript
// Phrase mode
let tmpConfirmed = await tmpModal.doubleConfirm('This will delete all data permanently.',
	{
		title: 'Delete Everything',
		confirmPhrase: 'DELETE ALL',
		confirmLabel: 'Delete Forever',
		cancelLabel: 'Cancel'
	});

// Two-click mode
let tmpConfirmed = await tmpModal.doubleConfirm('Reset workspace to defaults?',
	{
		title: 'Reset',
		confirmLabel: 'Reset',
		cancelLabel: 'Cancel'
	});
```

---

## Modal Window Methods

### show(pOptions)

Show a custom modal window with arbitrary HTML content and configurable buttons.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pOptions` | object | No | Modal window options |
| `pOptions.title` | string | No | Dialog title (default: `''`) |
| `pOptions.content` | string | No | HTML content for the dialog body (default: `''`) |
| `pOptions.buttons` | Array | No | Array of button objects (default: `[]`) |
| `pOptions.buttons[].Hash` | string | Yes | Unique identifier returned when the button is clicked |
| `pOptions.buttons[].Label` | string | Yes | Button display text |
| `pOptions.buttons[].Style` | string | No | Button style: `'primary'`, `'danger'`, or omit for default |
| `pOptions.closeable` | boolean | No | Show close button and allow overlay/Escape dismissal (default: `true`) |
| `pOptions.width` | string | No | CSS width value (default: `'480px'`) |
| `pOptions.onOpen` | function | No | Called after the dialog is shown; receives the dialog DOM element |
| `pOptions.onClose` | function | No | Called after the dialog is dismissed; receives the result value |

**Returns:** `Promise<string|null>` -- Resolves with the `Hash` of the clicked button, or `null` if closed without selecting an action.

```javascript
let tmpAction = await tmpModal.show(
	{
		title: 'User Preferences',
		content: '<div id="prefs-form">...</div>',
		width: '600px',
		closeable: true,
		buttons:
		[
			{ Hash: 'save', Label: 'Save', Style: 'primary' },
			{ Hash: 'reset', Label: 'Reset to Defaults', Style: 'danger' },
			{ Hash: 'cancel', Label: 'Cancel' }
		],
		onOpen: (pDialog) =>
		{
			// Initialize form controls after dialog is visible
			let tmpForm = pDialog.querySelector('#prefs-form');
			populateForm(tmpForm);
		},
		onClose: (pResult) =>
		{
			console.log('Dialog closed with:', pResult);
		}
	});
```

---

## Toast Methods

### toast(pMessage, pOptions)

Show a toast notification.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pMessage` | string | Yes | Toast message text |
| `pOptions` | object | No | Override default toast options |
| `pOptions.type` | string | No | Toast type: `'info'`, `'success'`, `'warning'`, `'error'` (default: `'info'`) |
| `pOptions.duration` | number | No | Auto-dismiss delay in milliseconds; `0` = no auto-dismiss (default: `3000`) |
| `pOptions.position` | string | No | Screen position (default: `'top-right'`) |
| `pOptions.dismissible` | boolean | No | Show a dismiss button (default: `true`) |

**Position values:** `'top-right'`, `'top-left'`, `'top-center'`, `'bottom-right'`, `'bottom-left'`, `'bottom-center'`

**Returns:** `{ dismiss: function }` -- Handle object. Call `dismiss()` to programmatically remove the toast.

```javascript
// Auto-dismissing info toast
tmpModal.toast('Settings saved.');

// Persistent error toast with manual dismiss
let tmpHandle = tmpModal.toast('Server unreachable.',
	{
		type: 'error',
		duration: 0,
		position: 'top-center'
	});

// Later...
tmpHandle.dismiss();
```

---

## Tooltip Methods

### tooltip(pElement, pText, pOptions)

Attach a simple text tooltip to a DOM element. The tooltip appears on mouseenter/focusin and disappears on mouseleave/focusout.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pElement` | HTMLElement | Yes | Target element to attach the tooltip to |
| `pText` | string | Yes | Tooltip text (plain text, not HTML) |
| `pOptions` | object | No | Override default tooltip options |
| `pOptions.position` | string | No | Preferred position: `'top'`, `'bottom'`, `'left'`, `'right'` (default: `'top'`) |
| `pOptions.delay` | number | No | Delay in milliseconds before showing (default: `200`) |
| `pOptions.maxWidth` | string | No | Maximum tooltip width (default: `'300px'`) |

**Returns:** `{ destroy: function }` -- Handle object. Call `destroy()` to remove the tooltip binding and all event listeners.

The tooltip automatically flips to the opposite direction if it would overflow the viewport.

```javascript
let tmpTip = tmpModal.tooltip(
	document.getElementById('info-icon'),
	'Additional details about this field',
	{ position: 'right', delay: 500 }
);

// Later, when the element is removed from the page
tmpTip.destroy();
```

### richTooltip(pElement, pHTMLContent, pOptions)

Attach a rich HTML tooltip to a DOM element. Supports interactive content (links, buttons) when the `interactive` option is enabled.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pElement` | HTMLElement | Yes | Target element to attach the tooltip to |
| `pHTMLContent` | string | Yes | HTML content for the tooltip body |
| `pOptions` | object | No | Override default tooltip options |
| `pOptions.position` | string | No | Preferred position: `'top'`, `'bottom'`, `'left'`, `'right'` (default: `'top'`) |
| `pOptions.delay` | number | No | Delay in milliseconds before showing (default: `200`) |
| `pOptions.maxWidth` | string | No | Maximum tooltip width (default: `'300px'`) |
| `pOptions.interactive` | boolean | No | Allow hovering over the tooltip itself without dismissing (default: `false`) |

**Returns:** `{ destroy: function }` -- Handle object. Call `destroy()` to remove the tooltip binding and all event listeners.

When `interactive` is `true`, the tooltip gains `pointer-events: auto` and a 100ms delay before hiding, allowing the user to move their cursor from the target element into the tooltip to interact with its content.

```javascript
let tmpTip = tmpModal.richTooltip(
	document.getElementById('user-badge'),
	'<strong>Jane Smith</strong><br>Role: Admin<br><a href="/users/jane">View Profile</a>',
	{
		position: 'bottom',
		maxWidth: '280px',
		interactive: true
	}
);
```

---

## Cleanup Methods

### dismissModals()

Dismiss all open modal dialogs (both confirm dialogs and custom windows). Each modal's promise resolves with `false` (for confirms) or `null` (for windows).

### dismissTooltips()

Dismiss all currently visible tooltips. Does not remove the tooltip bindings -- tooltips will reappear on the next hover. To permanently remove a tooltip, use the `destroy()` method on its handle.

### dismissToasts()

Dismiss all active toast notifications immediately.

### dismissAll()

Dismiss everything -- modals, tooltips, and toasts. Equivalent to calling `dismissModals()`, `dismissTooltips()`, and `dismissToasts()` in sequence.

### destroy()

Full cleanup: dismisses all active elements, force-removes the overlay, and destroys all toast containers. Call this when the view is being permanently removed from the application.

---

## Configuration Options

The full configuration object with default values:

```javascript
{
	AutoInitialize: true,
	AutoRender: false,
	AutoSolveWithApp: false,

	ViewIdentifier: 'Pict-Section-Modal',

	OverlayClickDismisses: true,

	DefaultConfirmOptions:
	{
		title: 'Confirm',
		confirmLabel: 'OK',
		cancelLabel: 'Cancel',
		dangerous: false
	},

	DefaultDoubleConfirmOptions:
	{
		title: 'Are you sure?',
		confirmLabel: 'Confirm',
		cancelLabel: 'Cancel',
		phrasePrompt: 'Type "{phrase}" to confirm:',
		confirmPhrase: ''
	},

	DefaultModalOptions:
	{
		title: '',
		content: '',
		buttons: [],
		closeable: true,
		width: '480px'
	},

	DefaultTooltipOptions:
	{
		position: 'top',
		delay: 200,
		maxWidth: '300px',
		interactive: false
	},

	DefaultToastOptions:
	{
		type: 'info',
		duration: 3000,
		position: 'top-right',
		dismissible: true
	},

	Templates: [],
	Renderables: [],

	CSS: '/* ... built-in styles ... */'
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `AutoInitialize` | boolean | `true` | Automatically initialize the view on registration |
| `AutoRender` | boolean | `false` | Automatically render on initialization |
| `AutoSolveWithApp` | boolean | `false` | Include in Pict's solve cycle |
| `ViewIdentifier` | string | `'Pict-Section-Modal'` | Unique identifier for the view instance |
| `OverlayClickDismisses` | boolean | `true` | Whether clicking the backdrop dismisses the topmost modal |

---

## CSS Class Reference

### Overlay

| Class | Element | Description |
|-------|---------|-------------|
| `.pict-modal-overlay` | `div` | Full-screen backdrop behind modals |
| `.pict-modal-visible` | modifier | Applied to trigger the fade-in transition |

### Dialog

| Class | Element | Description |
|-------|---------|-------------|
| `.pict-modal-dialog` | `div` | Container for confirm and modal window dialogs |
| `.pict-modal-dialog-header` | `div` | Title bar with title text and close button |
| `.pict-modal-dialog-title` | `span` | Title text inside the header |
| `.pict-modal-dialog-close` | `button` | Close button (x) in the header |
| `.pict-modal-dialog-body` | `div` | Scrollable content area |
| `.pict-modal-dialog-footer` | `div` | Button row at the bottom of the dialog |

### Buttons

| Class | Element | Description |
|-------|---------|-------------|
| `.pict-modal-btn` | `button` | Base button style |
| `.pict-modal-btn--primary` | modifier | Primary action button (blue) |
| `.pict-modal-btn--danger` | modifier | Destructive action button (red) |

### Double Confirm

| Class | Element | Description |
|-------|---------|-------------|
| `.pict-modal-confirm-prompt` | `div` | Instructional text above the phrase input |
| `.pict-modal-confirm-input` | `input` | Text input for typing the confirmation phrase |

### Toast

| Class | Element | Description |
|-------|---------|-------------|
| `.pict-modal-toast-container` | `div` | Positioned container that holds toast elements |
| `.pict-modal-toast-container--{position}` | modifier | Position variant (e.g. `--top-right`, `--bottom-center`) |
| `.pict-modal-toast` | `div` | Individual toast notification |
| `.pict-modal-toast--info` | modifier | Info type styling |
| `.pict-modal-toast--success` | modifier | Success type styling |
| `.pict-modal-toast--warning` | modifier | Warning type styling |
| `.pict-modal-toast--error` | modifier | Error type styling |
| `.pict-modal-toast-message` | `span` | Toast message text |
| `.pict-modal-toast-dismiss` | `button` | Dismiss button on the toast |
| `.pict-modal-toast-exit` | modifier | Applied during the exit animation |

### Tooltip

| Class | Element | Description |
|-------|---------|-------------|
| `.pict-modal-tooltip` | `div` | Tooltip container |
| `.pict-modal-tooltip--top` | modifier | Positioned above the target |
| `.pict-modal-tooltip--bottom` | modifier | Positioned below the target |
| `.pict-modal-tooltip--left` | modifier | Positioned to the left of the target |
| `.pict-modal-tooltip--right` | modifier | Positioned to the right of the target |
| `.pict-modal-tooltip-interactive` | modifier | Enables pointer events for interactive tooltips |
| `.pict-modal-tooltip-arrow` | `div` | Directional arrow element |

### ARIA Attributes

| Attribute | Element | Value |
|-----------|---------|-------|
| `role="dialog"` | `.pict-modal-dialog` | Identifies the element as a dialog |
| `aria-modal="true"` | `.pict-modal-dialog` | Indicates the dialog is modal |
| `aria-label="Close"` | `.pict-modal-dialog-close` | Accessible label for the close button |
| `aria-label="Dismiss"` | `.pict-modal-toast-dismiss` | Accessible label for the toast dismiss button |
| `role="tooltip"` | `.pict-modal-tooltip` | Identifies the element as a tooltip |
| `aria-describedby` | target element | Links the target to its tooltip (set/removed dynamically) |

---

## CSS Custom Properties Reference

All custom properties are defined on `.pict-modal-root` and can be overridden in your own stylesheet.

### Overlay

| Property | Default | Description |
|----------|---------|-------------|
| `--pict-modal-overlay-bg` | `rgba(0, 0, 0, 0.5)` | Overlay background color |

### Dialog

| Property | Default | Description |
|----------|---------|-------------|
| `--pict-modal-bg` | `#ffffff` | Dialog background color |
| `--pict-modal-fg` | `#1a1a1a` | Dialog text color |
| `--pict-modal-border` | `#e0e0e0` | Dialog border color |
| `--pict-modal-border-radius` | `8px` | Dialog corner radius |
| `--pict-modal-shadow` | `0 4px 24px rgba(0, 0, 0, 0.15)` | Dialog box shadow |

### Dialog Header

| Property | Default | Description |
|----------|---------|-------------|
| `--pict-modal-header-bg` | `#f5f5f5` | Header background color |
| `--pict-modal-header-fg` | `#1a1a1a` | Header text color |
| `--pict-modal-header-border` | `#e0e0e0` | Header bottom border color |

### Buttons

| Property | Default | Description |
|----------|---------|-------------|
| `--pict-modal-btn-bg` | `#e0e0e0` | Default button background |
| `--pict-modal-btn-fg` | `#1a1a1a` | Default button text color |
| `--pict-modal-btn-hover-bg` | `#d0d0d0` | Default button hover background |
| `--pict-modal-btn-primary-bg` | `#2563eb` | Primary button background |
| `--pict-modal-btn-primary-fg` | `#ffffff` | Primary button text color |
| `--pict-modal-btn-primary-hover-bg` | `#1d4ed8` | Primary button hover background |
| `--pict-modal-btn-danger-bg` | `#dc2626` | Danger button background |
| `--pict-modal-btn-danger-fg` | `#ffffff` | Danger button text color |
| `--pict-modal-btn-danger-hover-bg` | `#b91c1c` | Danger button hover background |
| `--pict-modal-btn-border-radius` | `4px` | Button corner radius |

### Toast

| Property | Default | Description |
|----------|---------|-------------|
| `--pict-modal-toast-bg` | `#333333` | Default toast background |
| `--pict-modal-toast-fg` | `#ffffff` | Toast text color |
| `--pict-modal-toast-success-bg` | `#16a34a` | Success toast background |
| `--pict-modal-toast-warning-bg` | `#d97706` | Warning toast background |
| `--pict-modal-toast-error-bg` | `#dc2626` | Error toast background |
| `--pict-modal-toast-info-bg` | `#2563eb` | Info toast background |
| `--pict-modal-toast-border-radius` | `6px` | Toast corner radius |
| `--pict-modal-toast-shadow` | `0 2px 12px rgba(0, 0, 0, 0.15)` | Toast box shadow |

### Tooltip

| Property | Default | Description |
|----------|---------|-------------|
| `--pict-modal-tooltip-bg` | `#1a1a1a` | Tooltip background color |
| `--pict-modal-tooltip-fg` | `#ffffff` | Tooltip text color |
| `--pict-modal-tooltip-border-radius` | `4px` | Tooltip corner radius |
| `--pict-modal-tooltip-shadow` | `0 2px 8px rgba(0, 0, 0, 0.15)` | Tooltip box shadow |

### Typography

| Property | Default | Description |
|----------|---------|-------------|
| `--pict-modal-font-family` | `system-ui, -apple-system, sans-serif` | Font family for all elements |
| `--pict-modal-font-size` | `14px` | Base font size |
| `--pict-modal-title-font-size` | `16px` | Dialog title font size |

### Animation

| Property | Default | Description |
|----------|---------|-------------|
| `--pict-modal-transition-duration` | `200ms` | Duration for all CSS transitions |
