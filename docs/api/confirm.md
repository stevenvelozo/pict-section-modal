# confirm

Show a single-step confirmation dialog. Returns a Promise that resolves to `true` when the user clicks the confirm button, or `false` when the user clicks cancel, the close button, presses Escape, or clicks the overlay.

## Signature

```javascript
modal.confirm(pMessage, pOptions)
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pMessage | string | Yes | The confirmation message displayed in the dialog body |
| pOptions | object | No | Configuration options (see below) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| title | string | `"Confirm"` | Text shown in the dialog header |
| confirmLabel | string | `"OK"` | Label for the confirm button |
| cancelLabel | string | `"Cancel"` | Label for the cancel button |
| dangerous | boolean | `false` | When `true`, the confirm button uses the danger style (red) instead of primary (blue) |

## Returns

`Promise<boolean>` -- Resolves to `true` if confirmed, `false` if cancelled.

## Example

### Basic confirm

```javascript
let tmpConfirmed = await modal.confirm('Save changes before closing?');
if (tmpConfirmed)
{
	saveDocument();
}
```

### Custom title and labels

```javascript
let tmpConfirmed = await modal.confirm('This will overwrite the existing file.', {
	title: 'Overwrite File',
	confirmLabel: 'Overwrite',
	cancelLabel: 'Keep Original'
});
```

### Dangerous confirm (red button)

```javascript
let tmpConfirmed = await modal.confirm('This record will be permanently removed.', {
	title: 'Delete Record',
	confirmLabel: 'Delete',
	dangerous: true
});

if (tmpConfirmed)
{
	deleteRecord(tmpRecordId);
}
```

### Handling the Promise result with .then()

```javascript
modal.confirm('Discard unsaved changes?', { title: 'Unsaved Changes' })
	.then((pConfirmed) =>
	{
		if (pConfirmed)
		{
			navigateAway();
		}
	});
```

### Using with async/await

```javascript
async function handleLogout()
{
	let tmpConfirmed = await modal.confirm('Are you sure you want to log out?', {
		title: 'Log Out',
		confirmLabel: 'Log Out',
		dangerous: true
	});

	if (!tmpConfirmed)
	{
		return;
	}

	await fetch('/api/logout', { method: 'POST' });
	window.location.href = '/login';
}
```

## Notes

- The message text is HTML-escaped before rendering. To display rich HTML content in a dialog, use `modal.show()` instead.
- Pressing Escape dismisses the dialog and resolves the promise with `false`.
- Clicking the overlay dismisses the dialog when `OverlayClickDismisses` is `true` (the default).
- The cancel button receives focus when the dialog opens, preventing accidental confirmation.
- The dialog is fixed-width at 420px and centered on screen.
- Multiple confirm dialogs can be stacked; the overlay is reference-counted and only removed when the last dialog closes.
