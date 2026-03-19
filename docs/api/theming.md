# Theming

pict-section-modal uses CSS custom properties (variables) for all visual styling. Every color, radius, shadow, font, and animation duration is configurable without touching the source CSS.

## How it works

On initialization, pict-section-modal adds the `pict-modal-root` class to `document.body`. All CSS custom properties are defined on the `.pict-modal-root` selector, and all modal components inherit from it.

## Complete variable reference

### Overlay

| Variable | Default | Description |
|----------|---------|-------------|
| `--pict-modal-overlay-bg` | `rgba(0, 0, 0, 0.5)` | Overlay backdrop color |

### Dialog

| Variable | Default | Description |
|----------|---------|-------------|
| `--pict-modal-bg` | `#ffffff` | Dialog background color |
| `--pict-modal-fg` | `#1a1a1a` | Dialog text color |
| `--pict-modal-border` | `#e0e0e0` | Dialog border and divider color |
| `--pict-modal-border-radius` | `8px` | Dialog corner radius |
| `--pict-modal-shadow` | `0 4px 24px rgba(0, 0, 0, 0.15)` | Dialog box shadow |
| `--pict-modal-header-bg` | `#f5f5f5` | Header background color |
| `--pict-modal-header-fg` | `#1a1a1a` | Header text color |
| `--pict-modal-header-border` | `#e0e0e0` | Header bottom border color |

### Buttons

| Variable | Default | Description |
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

| Variable | Default | Description |
|----------|---------|-------------|
| `--pict-modal-toast-bg` | `#333333` | Default toast background |
| `--pict-modal-toast-fg` | `#ffffff` | Toast text color (all types) |
| `--pict-modal-toast-success-bg` | `#16a34a` | Success toast background |
| `--pict-modal-toast-warning-bg` | `#d97706` | Warning toast background |
| `--pict-modal-toast-error-bg` | `#dc2626` | Error toast background |
| `--pict-modal-toast-info-bg` | `#2563eb` | Info toast background |
| `--pict-modal-toast-border-radius` | `6px` | Toast corner radius |
| `--pict-modal-toast-shadow` | `0 2px 12px rgba(0, 0, 0, 0.15)` | Toast box shadow |

### Tooltip

| Variable | Default | Description |
|----------|---------|-------------|
| `--pict-modal-tooltip-bg` | `#1a1a1a` | Tooltip background color |
| `--pict-modal-tooltip-fg` | `#ffffff` | Tooltip text color |
| `--pict-modal-tooltip-border-radius` | `4px` | Tooltip corner radius |
| `--pict-modal-tooltip-shadow` | `0 2px 8px rgba(0, 0, 0, 0.15)` | Tooltip box shadow |

### Typography

| Variable | Default | Description |
|----------|---------|-------------|
| `--pict-modal-font-family` | `system-ui, -apple-system, sans-serif` | Font stack for all modal components |
| `--pict-modal-font-size` | `14px` | Base font size |
| `--pict-modal-title-font-size` | `16px` | Dialog title font size |

### Animation

| Variable | Default | Description |
|----------|---------|-------------|
| `--pict-modal-transition-duration` | `200ms` | Duration for all enter/exit animations |

## Overriding globally on :root

Set variables on `:root` to apply changes across the entire page. This is the simplest approach and affects all modal instances.

```css
:root
{
	--pict-modal-btn-primary-bg: #7c3aed;
	--pict-modal-btn-primary-hover-bg: #6d28d9;
	--pict-modal-border-radius: 12px;
	--pict-modal-font-family: 'Inter', sans-serif;
}
```

## Overriding on .pict-modal-root

Since the variables are scoped to `.pict-modal-root` (which is added to `document.body`), you can also override them there. This is equivalent to `:root` in most cases but is more targeted.

```css
.pict-modal-root
{
	--pict-modal-bg: #fafafa;
	--pict-modal-header-bg: #ffffff;
	--pict-modal-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## Creating a dark theme

Override the color variables to create a dark-mode version. This can be gated behind a `prefers-color-scheme` media query or a custom class.

### Using prefers-color-scheme

```css
@media (prefers-color-scheme: dark)
{
	.pict-modal-root
	{
		/* Overlay */
		--pict-modal-overlay-bg: rgba(0, 0, 0, 0.7);

		/* Dialog */
		--pict-modal-bg: #1e1e1e;
		--pict-modal-fg: #e0e0e0;
		--pict-modal-border: #3a3a3a;
		--pict-modal-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
		--pict-modal-header-bg: #2a2a2a;
		--pict-modal-header-fg: #e0e0e0;
		--pict-modal-header-border: #3a3a3a;

		/* Buttons */
		--pict-modal-btn-bg: #3a3a3a;
		--pict-modal-btn-fg: #e0e0e0;
		--pict-modal-btn-hover-bg: #4a4a4a;

		/* Toast */
		--pict-modal-toast-bg: #2a2a2a;

		/* Tooltip */
		--pict-modal-tooltip-bg: #e0e0e0;
		--pict-modal-tooltip-fg: #1a1a1a;
	}
}
```

### Using a toggle class

```css
.dark-theme .pict-modal-root,
.pict-modal-root.dark-theme
{
	--pict-modal-bg: #1e1e1e;
	--pict-modal-fg: #e0e0e0;
	--pict-modal-border: #3a3a3a;
	--pict-modal-header-bg: #2a2a2a;
	--pict-modal-header-fg: #e0e0e0;
	--pict-modal-header-border: #3a3a3a;
	--pict-modal-btn-bg: #3a3a3a;
	--pict-modal-btn-fg: #e0e0e0;
	--pict-modal-btn-hover-bg: #4a4a4a;
	--pict-modal-toast-bg: #2a2a2a;
	--pict-modal-tooltip-bg: #e0e0e0;
	--pict-modal-tooltip-fg: #1a1a1a;
}
```

```javascript
// Toggle dark mode
document.body.classList.toggle('dark-theme');
```

## Styling specific modal instances

Modal dialogs, toasts, and tooltips have unique IDs (`pict-modal-{n}`, `pict-modal-toast-{n}`, `pict-modal-tooltip-{n}`). You can target a specific instance if you know its ID, but more commonly you will use the `onOpen` callback to add a custom class.

### Adding a class via onOpen

```javascript
modal.show({
	title: 'Premium Feature',
	content: '<p>Upgrade to access this feature.</p>',
	buttons: [{ Hash: 'upgrade', Label: 'Upgrade', Style: 'primary' }],
	onOpen: (pDialogElement) =>
	{
		pDialogElement.classList.add('premium-modal');
	}
});
```

```css
.premium-modal
{
	--pict-modal-btn-primary-bg: #d97706;
	--pict-modal-btn-primary-hover-bg: #b45309;
	--pict-modal-header-bg: #fffbeb;
}
```

### Styling by CSS class on the dialog

Since CSS custom properties cascade, you can also define variables on a custom class applied to the dialog element. The dialog and its children will pick up the overridden values.

```css
.branded-modal
{
	--pict-modal-bg: #f0f9ff;
	--pict-modal-border: #bae6fd;
	--pict-modal-header-bg: #e0f2fe;
	--pict-modal-btn-primary-bg: #0284c7;
	--pict-modal-btn-primary-hover-bg: #0369a1;
	--pict-modal-border-radius: 16px;
	--pict-modal-btn-border-radius: 8px;
}
```

## Notes

- All variables are defined on `.pict-modal-root`, not `:root`. The `pict-modal-root` class is automatically added to `document.body` during initialization.
- The tooltip arrow inherits `--pict-modal-tooltip-bg` so it matches the tooltip body automatically.
- The confirm input field's focus ring color uses `--pict-modal-btn-primary-bg`.
- The disabled button state applies `opacity: 0.5` and is not configurable via CSS custom properties.
- The dialog close button (`x`) inherits `--pict-modal-fg` for its color.
- Transition durations for enter/exit animations on all components (overlay fade, dialog slide, toast slide, tooltip fade) are controlled by the single `--pict-modal-transition-duration` variable.
