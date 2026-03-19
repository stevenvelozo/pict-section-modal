# richTooltip

Attach a rich HTML tooltip to a DOM element. Unlike `tooltip()`, the content is rendered as HTML, and the tooltip can optionally be made interactive so the user can hover into it and interact with links or other elements.

## Signature

```javascript
modal.richTooltip(pElement, pHTMLContent, pOptions)
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pElement | HTMLElement | Yes | The target element that triggers the tooltip on hover |
| pHTMLContent | string | Yes | HTML string rendered inside the tooltip body via `innerHTML` |
| pOptions | object | No | Configuration options (see below) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| position | string | `"top"` | Preferred placement: `"top"`, `"bottom"`, `"left"`, or `"right"` |
| delay | number | `200` | Delay in milliseconds before the tooltip appears |
| maxWidth | string | `"300px"` | CSS max-width for the tooltip element |
| interactive | boolean | `false` | When `true`, the user can move their cursor into the tooltip without it disappearing. Required for clickable links or buttons inside the tooltip. |

## Returns

`{ destroy: function }` -- A handle object with a `destroy()` method that removes the tooltip and all associated event listeners.

## Example

### HTML content tooltip

```javascript
let tmpStatusIcon = document.querySelector('#status-icon');
modal.richTooltip(tmpStatusIcon,
	'<strong>Status:</strong> Online<br>' +
	'<em>Last checked 2 minutes ago</em>'
);
```

### Interactive tooltip with links

When `interactive` is `true`, the tooltip remains visible while the user's cursor is inside it. This enables clickable links, buttons, and other interactive content.

```javascript
let tmpHelpIcon = document.querySelector('#help-icon');
modal.richTooltip(tmpHelpIcon,
	'<p>Need help getting started?</p>' +
	'<a href="/docs/quickstart" target="_blank">Quick Start Guide</a><br>' +
	'<a href="/docs/api" target="_blank">API Reference</a>',
	{
		interactive: true,
		maxWidth: '350px',
		position: 'bottom'
	}
);
```

### Styled content with formatted data

```javascript
let tmpUserAvatar = document.querySelector('#user-avatar');
modal.richTooltip(tmpUserAvatar,
	'<div style="display:flex; flex-direction:column; gap:4px;">' +
		'<strong>Jane Smith</strong>' +
		'<span style="opacity:0.7;">Engineering Team</span>' +
		'<span style="opacity:0.7;">jane@example.com</span>' +
	'</div>',
	{
		position: 'right',
		maxWidth: '250px'
	}
);
```

### Interactive tooltip with action buttons

```javascript
let tmpNotificationBell = document.querySelector('#notifications');
let tmpHandle = modal.richTooltip(tmpNotificationBell,
	'<div>' +
		'<strong>3 new notifications</strong>' +
		'<ul style="margin:8px 0; padding-left:16px;">' +
			'<li>Build #42 completed</li>' +
			'<li>PR #17 approved</li>' +
			'<li>Deploy to staging ready</li>' +
		'</ul>' +
		'<a href="/notifications" style="color: #2563eb;">View all</a>' +
	'</div>',
	{
		interactive: true,
		position: 'bottom',
		maxWidth: '320px'
	}
);
```

### Destroying the handle

```javascript
let tmpHandle = modal.richTooltip(tmpElement,
	'<em>Temporary tooltip</em>',
	{ interactive: true }
);

// Remove when no longer needed
tmpHandle.destroy();
```

## Notes

- The `pHTMLContent` string is rendered via `innerHTML`. You are responsible for sanitizing any user-supplied content to prevent XSS.
- When `interactive` is `false` (the default), the tooltip has `pointer-events: none` and cannot be clicked or hovered.
- When `interactive` is `true`, a 100ms delay is added before hiding to give the user time to move their cursor from the target element into the tooltip.
- The tooltip auto-flips to the opposite side if there is not enough viewport space in the preferred direction.
- The tooltip is clamped to stay within 4px of the viewport edges.
- `focusin`/`focusout` events on the target element also show/hide the tooltip for keyboard accessibility.
- An `aria-describedby` attribute is set on the target element while the tooltip is visible.
- Calling `destroy()` hides the tooltip immediately, removes all event listeners, and prevents it from being shown again.
- The tooltip uses a z-index of 1020.
