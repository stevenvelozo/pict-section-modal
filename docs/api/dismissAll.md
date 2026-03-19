# Cleanup Methods

Methods for programmatically dismissing active modals, tooltips, and toasts, and for tearing down the modal system entirely.

## dismissAll

Dismiss every open modal, visible tooltip, and active toast in a single call.

### Signature

```javascript
modal.dismissAll()
```

### Parameters

None.

### Returns

`undefined`

### Example

```javascript
// Clean up everything before navigating away
modal.dismissAll();
window.location.href = '/dashboard';
```

```javascript
// Dismiss all UI overlays when a global error occurs
window.addEventListener('unhandledrejection', () =>
{
	modal.dismissAll();
	modal.toast('An unexpected error occurred.', { type: 'error' });
});
```

---

## dismissModals

Dismiss all open modal dialogs (both `confirm`/`doubleConfirm` dialogs and `show` windows). Each modal's promise resolves with `null` (for `show`) or `false` (for `confirm`/`doubleConfirm`). Modals are dismissed from top to bottom (most recently opened first).

### Signature

```javascript
modal.dismissModals()
```

### Parameters

None.

### Returns

`undefined`

### Example

```javascript
// Close all modal dialogs but leave toasts and tooltips active
modal.dismissModals();
```

```javascript
// Dismiss modals when the user presses a global hotkey
document.addEventListener('keydown', (pEvent) =>
{
	if (pEvent.key === 'F1')
	{
		modal.dismissModals();
	}
});
```

---

## dismissTooltips

Force-hide all currently visible tooltips. The tooltip handles remain active -- hovering over the target elements will still show tooltips again. To permanently remove tooltips, call `destroy()` on each tooltip handle instead.

### Signature

```javascript
modal.dismissTooltips()
```

### Parameters

None.

### Returns

`undefined`

### Example

```javascript
// Hide all tooltips before taking a screenshot or printing
modal.dismissTooltips();
window.print();
```

---

## dismissToasts

Dismiss all active toast notifications immediately. Each toast's exit animation plays, and the toast is removed from the DOM.

### Signature

```javascript
modal.dismissToasts()
```

### Parameters

None.

### Returns

`undefined`

### Example

```javascript
// Clear old toasts before showing a new batch of notifications
modal.dismissToasts();

for (let i = 0; i < tmpNotifications.length; i++)
{
	modal.toast(tmpNotifications[i].message, {
		type: tmpNotifications[i].type
	});
}
```

---

## destroy

Full teardown of the modal system. Dismisses all modals, tooltips, and toasts, force-removes the overlay element regardless of reference count, and removes all toast containers from the DOM. Call this when the view is being permanently removed.

### Signature

```javascript
modal.destroy()
```

### Parameters

None.

### Returns

The return value of the parent class `destroy()` method (from `pict-view`).

### Example

```javascript
// In a view lifecycle hook when the page is being torn down
modal.destroy();
```

---

## When to use each method

| Scenario | Method |
|----------|--------|
| Navigating to a new page or route | `dismissAll()` |
| Closing all dialogs but keeping toasts visible | `dismissModals()` |
| Hiding tooltips temporarily (e.g., before print) | `dismissTooltips()` |
| Clearing old notifications before showing new ones | `dismissToasts()` |
| Permanently removing the modal system from the page | `destroy()` |
| Removing a single toast programmatically | `handle.dismiss()` (from the toast return value) |
| Removing a single tooltip permanently | `handle.destroy()` (from the tooltip return value) |

## Notes

- `dismissModals()` dismisses modals in reverse order (most recently opened first), which mirrors the Escape key behavior.
- `dismissTooltips()` calls the internal `destroy()` on each active tooltip tracking entry, which hides the tooltip element. However, the hover event listeners on the target element remain attached. To fully detach, use the handle returned by `tooltip()` or `richTooltip()`.
- `dismissToasts()` clears auto-dismiss timers, so toasts with remaining duration are dismissed immediately.
- `destroy()` calls `dismissAll()` internally, then force-removes the overlay and toast containers. It also calls the parent `pict-view` `destroy()` method.
- All dismiss operations are idempotent -- calling them when nothing is active is safe and has no effect.
