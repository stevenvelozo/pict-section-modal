# show

Show a custom modal window with arbitrary HTML content and configurable buttons. Returns a Promise that resolves with the Hash of the clicked button, or `null` if the dialog is closed without clicking a button.

## Signature

```javascript
modal.show(pOptions)
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pOptions | object | No | Configuration options (see below) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| title | string | `""` | Text shown in the dialog header. If empty and `closeable` is `false`, the header is hidden entirely. |
| content | string | `""` | HTML string rendered inside the dialog body. Not escaped -- you can include any markup. |
| buttons | Array | `[]` | Array of button objects (see Button format below) |
| closeable | boolean | `true` | When `true`, shows the close button, allows Escape key dismissal, and allows overlay click dismissal |
| width | string | `"480px"` | CSS width value for the dialog |
| onOpen | function | - | Callback invoked after the dialog is rendered and visible. Receives the dialog DOM element as its argument. |
| onClose | function | - | Callback invoked after the dialog is dismissed. Receives the result value (button Hash or `null`). |

### Button format

Each entry in the `buttons` array is an object with:

| Property | Type | Description |
|----------|------|-------------|
| Hash | string | Identifier returned when this button is clicked |
| Label | string | Button text (HTML-escaped before rendering) |
| Style | string | Optional CSS modifier: `"primary"` (blue), `"danger"` (red), or omit for default (gray) |

## Returns

`Promise<string|null>` -- Resolves with the `Hash` of the clicked button, or `null` if the dialog was closed via the close button, Escape key, or overlay click.

## Example

### Simple modal with title and content

```javascript
await modal.show({
	title: 'Welcome',
	content: '<p>Thanks for signing up! Your account is ready.</p>',
	buttons: [
		{ Hash: 'ok', Label: 'Get Started', Style: 'primary' }
	]
});
```

### Multiple buttons with different styles

```javascript
let tmpResult = await modal.show({
	title: 'Unsaved Changes',
	content: '<p>You have unsaved changes. What would you like to do?</p>',
	buttons: [
		{ Hash: 'discard', Label: 'Discard', Style: 'danger' },
		{ Hash: 'cancel', Label: 'Go Back' },
		{ Hash: 'save', Label: 'Save Changes', Style: 'primary' }
	]
});

if (tmpResult === 'save')
{
	await saveChanges();
}
else if (tmpResult === 'discard')
{
	discardChanges();
}
// 'cancel' or null -- stay on the current page
```

### onOpen callback for custom initialization

The `onOpen` callback receives the raw dialog DOM element, which is useful for attaching event listeners or initializing third-party components inside the modal body.

```javascript
modal.show({
	title: 'Add Note',
	content: '<textarea id="note-input" rows="5" style="width:100%;"></textarea>',
	buttons: [
		{ Hash: 'cancel', Label: 'Cancel' },
		{ Hash: 'save', Label: 'Save', Style: 'primary' }
	],
	onOpen: (pDialogElement) =>
	{
		let tmpTextarea = pDialogElement.querySelector('#note-input');
		tmpTextarea.focus();
		tmpTextarea.value = existingNoteText;
	}
}).then((pResult) =>
{
	if (pResult === 'save')
	{
		let tmpText = document.querySelector('#note-input').value;
		saveNote(tmpText);
	}
});
```

### onClose callback

```javascript
modal.show({
	title: 'Settings',
	content: '<p>Configure your preferences.</p>',
	buttons: [
		{ Hash: 'done', Label: 'Done', Style: 'primary' }
	],
	onClose: (pResult) =>
	{
		console.log('Dialog closed with result:', pResult);
		refreshSettings();
	}
});
```

### Non-closeable modal

When `closeable` is `false`, the close button is hidden, the Escape key does nothing, and clicking the overlay does not dismiss the dialog. The user must click one of the provided buttons.

```javascript
let tmpChoice = await modal.show({
	title: 'Terms of Service',
	content: '<div style="max-height:300px;overflow-y:auto;">' + tmpTermsHTML + '</div>',
	closeable: false,
	width: '600px',
	buttons: [
		{ Hash: 'decline', Label: 'Decline' },
		{ Hash: 'accept', Label: 'I Accept', Style: 'primary' }
	]
});

if (tmpChoice !== 'accept')
{
	window.location.href = '/goodbye';
}
```

### Custom width

```javascript
await modal.show({
	title: 'Preview',
	content: '<img src="/preview.png" style="width:100%;" />',
	width: '800px',
	buttons: [
		{ Hash: 'close', Label: 'Close' }
	]
});
```

### HTML content with a table

```javascript
let tmpTableHTML =
	'<table style="width:100%; border-collapse:collapse;">' +
	'<thead><tr><th>Name</th><th>Status</th></tr></thead>' +
	'<tbody>' +
	'<tr><td>Server A</td><td>Online</td></tr>' +
	'<tr><td>Server B</td><td>Offline</td></tr>' +
	'</tbody></table>';

let tmpResult = await modal.show({
	title: 'Server Status',
	content: tmpTableHTML,
	width: '560px',
	buttons: [
		{ Hash: 'refresh', Label: 'Refresh' },
		{ Hash: 'close', Label: 'Close', Style: 'primary' }
	]
});

if (tmpResult === 'refresh')
{
	refreshServerStatus();
}
```

## Notes

- The `content` string is rendered as raw HTML (not escaped). Sanitize user-supplied content before passing it in.
- Button `Label` values are HTML-escaped before rendering.
- The dialog body has `overflow-y: auto` and `flex: 1`, so content that exceeds the viewport height will scroll.
- The dialog is constrained to `max-width: 90vw` and `max-height: 90vh` regardless of the `width` option.
- When no `buttons` are provided, the footer is omitted entirely.
- When both `title` is empty and `closeable` is `false`, the header is omitted entirely.
- Focus is set to the first button in the footer, or the close button if no footer buttons exist.
- The `onClose` callback fires after the dialog begins its exit animation, not after it is removed from the DOM.
