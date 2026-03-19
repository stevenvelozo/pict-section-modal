# doubleConfirm

Show a two-step confirmation dialog for dangerous or irreversible operations. Supports two modes: typed phrase confirmation (user must type a specific phrase to enable the confirm button) or two-click confirmation (first click changes the button label, second click confirms).

## Signature

```javascript
modal.doubleConfirm(pMessage, pOptions)
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pMessage | string | Yes | The confirmation message displayed in the dialog body |
| pOptions | object | No | Configuration options (see below) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| title | string | `"Are you sure?"` | Text shown in the dialog header |
| confirmLabel | string | `"Confirm"` | Label for the confirm button |
| cancelLabel | string | `"Cancel"` | Label for the cancel button |
| confirmPhrase | string | `""` | Phrase the user must type to enable confirmation. When empty, two-click mode is used instead. |
| phrasePrompt | string | `'Type "{phrase}" to confirm:'` | Prompt text shown above the input. The `{phrase}` placeholder is replaced with the value of `confirmPhrase`. |

## Returns

`Promise<boolean>` -- Resolves to `true` if confirmed, `false` if cancelled.

## Example

### Typed phrase confirmation

```javascript
let tmpConfirmed = await modal.doubleConfirm(
	'This will permanently delete all records in the database.',
	{
		title: 'Delete All Records',
		confirmPhrase: 'DELETE ALL'
	}
);

if (tmpConfirmed)
{
	await deleteAllRecords();
}
```

### Two-click confirmation (no phrase)

When `confirmPhrase` is omitted or empty, the first click changes the button text to "Click again to confirm" and the second click resolves the promise.

```javascript
let tmpConfirmed = await modal.doubleConfirm(
	'This will reset all user permissions to their defaults.',
	{
		title: 'Reset Permissions',
		confirmLabel: 'Reset'
	}
);
```

### Custom phrase prompt text

```javascript
let tmpConfirmed = await modal.doubleConfirm(
	'Removing this workspace will delete all associated projects and data.',
	{
		title: 'Remove Workspace',
		confirmPhrase: 'my-workspace',
		phrasePrompt: 'Enter the workspace name "{phrase}" to proceed:'
	}
);
```

### Using for destructive batch operations

```javascript
async function handleBulkDelete(pSelectedIds)
{
	let tmpCount = pSelectedIds.length;

	let tmpConfirmed = await modal.doubleConfirm(
		tmpCount + ' items will be permanently deleted. This cannot be undone.',
		{
			title: 'Bulk Delete',
			confirmPhrase: 'DELETE ' + tmpCount,
			phrasePrompt: 'Type "{phrase}" to delete all selected items:',
			confirmLabel: 'Delete All',
			cancelLabel: 'Keep Items'
		}
	);

	if (!tmpConfirmed)
	{
		return;
	}

	for (let i = 0; i < pSelectedIds.length; i++)
	{
		await deleteItem(pSelectedIds[i]);
	}

	modal.toast(tmpCount + ' items deleted.', { type: 'success' });
}
```

## Notes

- The confirm button always uses the danger style (red) regardless of mode.
- In phrase mode, the confirm button starts disabled and only enables when the input value exactly matches `confirmPhrase` (case-sensitive).
- In phrase mode, the text input receives focus when the dialog opens. In two-click mode, the cancel button receives focus.
- In two-click mode, the button label changes to "Click again to confirm" after the first click. This text is hardcoded and not configurable.
- The message text is HTML-escaped. The phrase prompt text is also HTML-escaped.
- Pressing Escape or clicking the overlay (when `OverlayClickDismisses` is `true`) dismisses the dialog and resolves with `false`.
- The dialog is fixed-width at 420px.
