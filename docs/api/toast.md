# toast

Show a toast notification that appears at the edge of the viewport. Toasts auto-dismiss after a configurable duration, can be manually dismissed, and stack vertically when multiple are active.

## Signature

```javascript
modal.toast(pMessage, pOptions)
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pMessage | string | Yes | The notification message text |
| pOptions | object | No | Configuration options (see below) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| type | string | `"info"` | Visual style: `"info"`, `"success"`, `"warning"`, or `"error"` |
| duration | number | `3000` | Auto-dismiss delay in milliseconds. Set to `0` for a persistent toast that must be dismissed manually. |
| position | string | `"top-right"` | Viewport position: `"top-right"`, `"top-left"`, `"bottom-right"`, `"bottom-left"`, `"top-center"`, or `"bottom-center"` |
| dismissible | boolean | `true` | When `true`, shows a close button on the toast |

## Returns

`{ dismiss: function }` -- A handle object with a `dismiss()` method for programmatic dismissal.

## Example

### All four types

```javascript
modal.toast('File uploaded successfully.', { type: 'success' });
modal.toast('Your session will expire in 5 minutes.', { type: 'warning' });
modal.toast('Unable to connect to the server.', { type: 'error' });
modal.toast('A new version is available.', { type: 'info' });
```

### Custom duration

```javascript
// Show for 10 seconds
modal.toast('Processing complete.', {
	type: 'success',
	duration: 10000
});

// Show for 1 second
modal.toast('Copied!', {
	type: 'info',
	duration: 1000
});
```

### Persistent toast (duration: 0)

A toast with `duration: 0` never auto-dismisses. The user must click the close button or the toast must be dismissed programmatically.

```javascript
let tmpHandle = modal.toast('Upload in progress... please wait.', {
	type: 'info',
	duration: 0
});

await uploadFile(tmpFileData);

// Dismiss the progress toast and show a success toast
tmpHandle.dismiss();
modal.toast('Upload complete!', { type: 'success' });
```

### Different positions

```javascript
modal.toast('Top right (default)', { position: 'top-right' });
modal.toast('Top left', { position: 'top-left' });
modal.toast('Bottom right', { position: 'bottom-right' });
modal.toast('Bottom left', { position: 'bottom-left' });
modal.toast('Top center', { position: 'top-center' });
modal.toast('Bottom center', { position: 'bottom-center' });
```

### Non-dismissible toast

When `dismissible` is `false`, the close button is hidden. The toast will only disappear when the duration expires or when dismissed programmatically.

```javascript
modal.toast('Saving...', {
	type: 'info',
	dismissible: false,
	duration: 2000
});
```

### Manual dismiss via handle

The returned handle gives you programmatic control over the toast lifecycle.

```javascript
let tmpHandle = modal.toast('Connecting to server...', {
	type: 'info',
	duration: 0,
	dismissible: false
});

try
{
	await connectToServer();
	tmpHandle.dismiss();
	modal.toast('Connected!', { type: 'success' });
}
catch (pError)
{
	tmpHandle.dismiss();
	modal.toast('Connection failed: ' + pError.message, { type: 'error' });
}
```

### Stacking multiple toasts

Toasts in the same position stack vertically with an 8px gap. Each toast is independent and dismisses on its own schedule.

```javascript
modal.toast('Step 1: Validating data...', { type: 'info', duration: 2000 });

setTimeout(() =>
{
	modal.toast('Step 2: Processing records...', { type: 'info', duration: 3000 });
}, 500);

setTimeout(() =>
{
	modal.toast('Step 3: Complete!', { type: 'success', duration: 4000 });
}, 1500);
```

## Notes

- The message text is HTML-escaped before rendering. To display rich HTML in a notification, use `modal.show()` instead.
- Toast containers are created lazily per position and removed automatically when their last toast is dismissed.
- The toast enter/exit animation slides in from the right with a 200ms transition.
- Calling `dismiss()` multiple times on the same handle is safe -- subsequent calls are ignored.
- Toasts do not use the overlay and do not block interaction with the page.
- The toast container has a max-width of 400px.
- Use `modal.dismissToasts()` to dismiss all active toasts at once.
