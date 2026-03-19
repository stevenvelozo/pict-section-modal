# tooltip

Attach a plain-text tooltip to a DOM element. The tooltip appears on hover (after an optional delay) and hides when the cursor leaves the element. Returns a handle for removing the tooltip and its event listeners.

## Signature

```javascript
modal.tooltip(pElement, pText, pOptions)
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pElement | HTMLElement | Yes | The target element that triggers the tooltip on hover |
| pText | string | Yes | Plain text content for the tooltip (rendered as `textContent`, not HTML) |
| pOptions | object | No | Configuration options (see below) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| position | string | `"top"` | Preferred placement: `"top"`, `"bottom"`, `"left"`, or `"right"` |
| delay | number | `200` | Delay in milliseconds before the tooltip appears after hover begins |
| maxWidth | string | `"300px"` | CSS max-width for the tooltip element |

## Returns

`{ destroy: function }` -- A handle object with a `destroy()` method that removes the tooltip and all associated event listeners from the target element.

## Example

### Basic tooltip

```javascript
let tmpButton = document.querySelector('#save-btn');
modal.tooltip(tmpButton, 'Save your current progress');
```

### All four positions

```javascript
let tmpBtnTop = document.querySelector('#btn-top');
let tmpBtnBottom = document.querySelector('#btn-bottom');
let tmpBtnLeft = document.querySelector('#btn-left');
let tmpBtnRight = document.querySelector('#btn-right');

modal.tooltip(tmpBtnTop, 'Appears above', { position: 'top' });
modal.tooltip(tmpBtnBottom, 'Appears below', { position: 'bottom' });
modal.tooltip(tmpBtnLeft, 'Appears to the left', { position: 'left' });
modal.tooltip(tmpBtnRight, 'Appears to the right', { position: 'right' });
```

### Custom max width

```javascript
let tmpInfoIcon = document.querySelector('#info-icon');
modal.tooltip(tmpInfoIcon, 'This is a longer explanation that needs more horizontal space to display properly.', {
	maxWidth: '500px'
});
```

### Delayed show

```javascript
// Tooltip appears instantly (no delay)
modal.tooltip(tmpElement, 'Instant tooltip', { delay: 0 });

// Tooltip appears after 1 second of hovering
modal.tooltip(tmpElement, 'Slow tooltip', { delay: 1000 });
```

### Destroying the tooltip handle

Call `destroy()` to permanently remove the tooltip and detach all event listeners. This is important for elements that are dynamically added and removed from the DOM.

```javascript
let tmpHandle = modal.tooltip(tmpButton, 'Click to submit');

// Later, when the button is removed or the tooltip is no longer needed:
tmpHandle.destroy();
```

### Dynamic tooltip on list items

```javascript
function attachTooltips()
{
	let tmpHandles = [];
	let tmpItems = document.querySelectorAll('.list-item');

	for (let i = 0; i < tmpItems.length; i++)
	{
		let tmpHandle = modal.tooltip(tmpItems[i], tmpItems[i].dataset.description, {
			position: 'right',
			delay: 300
		});
		tmpHandles.push(tmpHandle);
	}

	// Return handles so they can be destroyed when the list is rebuilt
	return tmpHandles;
}
```

## Notes

- The tooltip text is set via `textContent`, so HTML tags will be displayed as literal text. For HTML content, use `modal.richTooltip()` instead.
- The tooltip auto-flips to the opposite side if there is not enough viewport space in the preferred direction.
- The tooltip is clamped to stay within 4px of the viewport edges.
- The tooltip is also triggered by `focusin` and hidden on `focusout` for keyboard accessibility.
- An `aria-describedby` attribute is added to the target element while the tooltip is visible and removed when it hides.
- The tooltip has a directional arrow that points toward the target element.
- Calling `destroy()` multiple times is safe -- subsequent calls are ignored.
- The tooltip uses a z-index of 1020, which places it above modals (1010) but below toasts (1030).
- Use `modal.dismissTooltips()` to force-hide all currently visible tooltips without destroying their handles.
