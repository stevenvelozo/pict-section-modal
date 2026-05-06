const libPictView = require('pict-view');

class PictViewModalGardenLayout extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender()
	{
		// Inject all view CSS into the document
		this.pict.CSSMap.injectCSS();

		let tmpModal = this.pict.views.PictSectionModal;

		// ── Render all code snippet views ──
		let tmpViews = this.pict.views;
		let tmpCodeViewNames = Object.keys(tmpViews);
		for (let i = 0; i < tmpCodeViewNames.length; i++)
		{
			if (tmpCodeViewNames[i].indexOf('CodeSnippet-') === 0)
			{
				tmpViews[tmpCodeViewNames[i]].render();
			}
		}

		// ── Confirm Dialog ──
		let tmpBtnConfirm = document.getElementById('btn-confirm');
		if (tmpBtnConfirm)
		{
			tmpBtnConfirm.addEventListener('click', () =>
			{
				tmpModal.confirm('Are you sure you want to proceed with this action?')
					.then((pResult) =>
					{
						let tmpOutput = document.getElementById('confirm-result');
						if (tmpOutput)
						{
							tmpOutput.textContent = 'Result: ' + (pResult ? 'Confirmed' : 'Cancelled');
							tmpOutput.className = 'result-display ' + (pResult ? 'result-confirmed' : 'result-cancelled');
						}
					});
			});
		}

		// ── Dangerous Confirm ──
		let tmpBtnDanger = document.getElementById('btn-dangerous-confirm');
		if (tmpBtnDanger)
		{
			tmpBtnDanger.addEventListener('click', () =>
			{
				tmpModal.confirm('Delete this record? This action cannot be undone.', { dangerous: true, title: 'Delete Record' })
					.then((pResult) =>
					{
						let tmpOutput = document.getElementById('dangerous-confirm-result');
						if (tmpOutput)
						{
							tmpOutput.textContent = 'Result: ' + (pResult ? 'Deleted' : 'Cancelled');
							tmpOutput.className = 'result-display ' + (pResult ? 'result-confirmed' : 'result-cancelled');
						}
					});
			});
		}

		// ── Double Confirm (Typed Phrase) ──
		let tmpBtnDoublePhrase = document.getElementById('btn-double-confirm-phrase');
		if (tmpBtnDoublePhrase)
		{
			tmpBtnDoublePhrase.addEventListener('click', () =>
			{
				tmpModal.doubleConfirm('This will permanently delete all data in the system.', { confirmPhrase: 'DELETE ALL', title: 'Permanent Deletion' })
					.then((pResult) =>
					{
						let tmpOutput = document.getElementById('double-confirm-phrase-result');
						if (tmpOutput)
						{
							tmpOutput.textContent = 'Result: ' + (pResult ? 'Confirmed (phrase matched)' : 'Cancelled');
							tmpOutput.className = 'result-display ' + (pResult ? 'result-confirmed' : 'result-cancelled');
						}
					});
			});
		}

		// ── Double Confirm (Two-Click) ──
		let tmpBtnDoubleTwoClick = document.getElementById('btn-double-confirm-twoclick');
		if (tmpBtnDoubleTwoClick)
		{
			tmpBtnDoubleTwoClick.addEventListener('click', () =>
			{
				tmpModal.doubleConfirm('Reset all settings to their factory defaults?', { title: 'Reset Settings' })
					.then((pResult) =>
					{
						let tmpOutput = document.getElementById('double-confirm-twoclick-result');
						if (tmpOutput)
						{
							tmpOutput.textContent = 'Result: ' + (pResult ? 'Confirmed (two clicks)' : 'Cancelled');
							tmpOutput.className = 'result-display ' + (pResult ? 'result-confirmed' : 'result-cancelled');
						}
					});
			});
		}

		// ── Custom Modal ──
		let tmpBtnCustomModal = document.getElementById('btn-custom-modal');
		if (tmpBtnCustomModal)
		{
			tmpBtnCustomModal.addEventListener('click', () =>
			{
				tmpModal.show(
				{
					title: 'Edit Record',
					content: '<p>You have unsaved changes to this record.</p><p>What would you like to do?</p>',
					width: '500px',
					buttons:
					[
						{ Hash: 'cancel', Label: 'Cancel', Style: '' },
						{ Hash: 'delete', Label: 'Delete', Style: 'danger' },
						{ Hash: 'save', Label: 'Save Changes', Style: 'primary' }
					]
				})
				.then((pResult) =>
				{
					let tmpOutput = document.getElementById('custom-modal-result');
					if (tmpOutput)
					{
						let tmpLabel = 'Closed';
						if (pResult === 'save') tmpLabel = 'Saved';
						else if (pResult === 'delete') tmpLabel = 'Deleted';
						else if (pResult === 'cancel') tmpLabel = 'Cancelled';
						tmpOutput.textContent = 'Button clicked: ' + tmpLabel + ' (Hash: ' + pResult + ')';
						tmpOutput.className = 'result-display result-confirmed';
					}
				});
			});
		}

		// ── Toast Notifications (Types) ──
		let tmpToastTypes = ['info', 'success', 'warning', 'error'];
		for (let i = 0; i < tmpToastTypes.length; i++)
		{
			let tmpType = tmpToastTypes[i];
			let tmpBtn = document.getElementById('btn-toast-' + tmpType);
			if (tmpBtn)
			{
				tmpBtn.addEventListener('click', () =>
				{
					tmpModal.toast('This is a ' + tmpType + ' notification.', { type: tmpType });
				});
			}
		}

		// ── Toast Positions ──
		let tmpToastPositions =
		[
			{ id: 'btn-toast-top-right', position: 'top-right' },
			{ id: 'btn-toast-top-left', position: 'top-left' },
			{ id: 'btn-toast-top-center', position: 'top-center' },
			{ id: 'btn-toast-bottom-right', position: 'bottom-right' },
			{ id: 'btn-toast-bottom-left', position: 'bottom-left' },
			{ id: 'btn-toast-bottom-center', position: 'bottom-center' }
		];
		for (let i = 0; i < tmpToastPositions.length; i++)
		{
			let tmpEntry = tmpToastPositions[i];
			let tmpBtn = document.getElementById(tmpEntry.id);
			if (tmpBtn)
			{
				tmpBtn.addEventListener('click', () =>
				{
					tmpModal.toast('Toast at ' + tmpEntry.position, { type: 'info', position: tmpEntry.position });
				});
			}
		}

		// ── Toast Options ──
		let tmpBtnPersistent = document.getElementById('btn-toast-persistent');
		if (tmpBtnPersistent)
		{
			tmpBtnPersistent.addEventListener('click', () =>
			{
				tmpModal.toast('This toast will not auto-dismiss. Click the X to close it.', { type: 'warning', duration: 0 });
			});
		}

		let tmpBtnNonDismissible = document.getElementById('btn-toast-no-dismiss');
		if (tmpBtnNonDismissible)
		{
			tmpBtnNonDismissible.addEventListener('click', () =>
			{
				tmpModal.toast('This toast has no dismiss button (auto-closes in 3s).', { type: 'info', dismissible: false });
			});
		}

		let tmpBtnDismissAll = document.getElementById('btn-toast-dismiss-all');
		if (tmpBtnDismissAll)
		{
			tmpBtnDismissAll.addEventListener('click', () =>
			{
				tmpModal.dismissToasts();
			});
		}

		// ── Tooltips ──
		let tmpTooltipTargets =
		[
			{ id: 'tooltip-top', text: 'Tooltip on top', options: { position: 'top' } },
			{ id: 'tooltip-bottom', text: 'Tooltip on bottom', options: { position: 'bottom' } },
			{ id: 'tooltip-left', text: 'Tooltip on the left side', options: { position: 'left' } },
			{ id: 'tooltip-right', text: 'Tooltip on the right side', options: { position: 'right' } }
		];
		for (let i = 0; i < tmpTooltipTargets.length; i++)
		{
			let tmpTarget = tmpTooltipTargets[i];
			let tmpElement = document.getElementById(tmpTarget.id);
			if (tmpElement)
			{
				tmpModal.tooltip(tmpElement, tmpTarget.text, tmpTarget.options);
			}
		}

		// ── Rich Tooltips ──
		let tmpRichTooltip1 = document.getElementById('rich-tooltip-info');
		if (tmpRichTooltip1)
		{
			tmpModal.richTooltip(
				tmpRichTooltip1,
				'<div style="padding:4px">' +
					'<strong>User Profile</strong>' +
					'<p style="margin:6px 0 0">Jane Doe &mdash; Administrator</p>' +
					'<p style="margin:4px 0 0;opacity:0.7;font-size:12px">Last login: 2 hours ago</p>' +
				'</div>',
				{ position: 'bottom', maxWidth: '280px', interactive: true }
			);
		}

		let tmpRichTooltip2 = document.getElementById('rich-tooltip-action');
		if (tmpRichTooltip2)
		{
			tmpModal.richTooltip(
				tmpRichTooltip2,
				'<div style="padding:4px">' +
					'<strong>Status: Active</strong>' +
					'<p style="margin:6px 0 0">This record is currently published and visible to all users.</p>' +
					'<p style="margin:6px 0 0"><a href="#" style="color:#60a5fa" onclick="event.preventDefault()">View details</a></p>' +
				'</div>',
				{ position: 'right', maxWidth: '300px', interactive: true }
			);
		}

		// ── Nav menu dropdowns ──
		let tmpNavProducts = document.getElementById('nav-products');
		if (tmpNavProducts)
		{
			tmpNavProducts.addEventListener('click', (pEvent) =>
			{
				pEvent.preventDefault();
				tmpModal.dropdown(tmpNavProducts,
					{
						items:
						[
							{ Hash: 'app',     Label: 'Application Suite' },
							{ Hash: 'tools',   Label: 'Developer Tools' },
							{ Hash: 'add-ons', Label: 'Add-ons & Integrations' },
							{ Separator: true },
							{ Hash: 'whats-new', Label: 'What\'s new', Hint: '5 new' }
						]
					});
			});
		}

		let tmpNavResources = document.getElementById('nav-resources');
		if (tmpNavResources)
		{
			tmpNavResources.addEventListener('click', (pEvent) =>
			{
				pEvent.preventDefault();
				tmpModal.dropdown(tmpNavResources,
					{
						items:
						[
							{ Header: 'Learn' },
							{ Hash: 'docs',     Label: 'Documentation' },
							{ Hash: 'tutorials',Label: 'Tutorials' },
							{ Hash: 'examples', Label: 'Examples' },
							{ Header: 'Community' },
							{ Hash: 'forum',    Label: 'Forum' },
							{ Hash: 'discord',  Label: 'Discord' },
							{ Hash: 'github',   Label: 'GitHub' }
						]
					});
			});
		}

		let tmpNavAccount = document.getElementById('nav-account');
		if (tmpNavAccount)
		{
			tmpNavAccount.addEventListener('click', (pEvent) =>
			{
				pEvent.preventDefault();
				tmpModal.dropdown(tmpNavAccount,
					{
						align: 'right', // hang off the right edge so it doesn't run off screen
						items:
						[
							{ Hash: 'profile',  Label: 'Profile',     Hint: 'jane@x.com' },
							{ Hash: 'billing',  Label: 'Billing' },
							{ Hash: 'settings', Label: 'Settings' },
							{ Separator: true },
							{ Hash: 'signout',  Label: 'Sign out', Style: 'danger' }
						]
					});
			});
		}

		// ── Split-button dropdowns ──
		let tmpSplitResult = document.getElementById('dropdown-split-result');
		let fSetSplitResult = (pLabel) =>
		{
			if (!tmpSplitResult) { return; }
			tmpSplitResult.textContent = 'Selected: ' + pLabel;
			tmpSplitResult.className = 'result-display result-confirmed';
		};

		let tmpDownloadMore = document.getElementById('btn-download-more');
		if (tmpDownloadMore)
		{
			tmpDownloadMore.addEventListener('click', () =>
			{
				tmpModal.dropdown(tmpDownloadMore,
					{
						align: 'right',
						items:
						[
							{ Header: 'Export format' },
							{ Hash: 'csv',  Label: 'CSV',  Hint: 'default' },
							{ Hash: 'json', Label: 'JSON' },
							{ Hash: 'xlsx', Label: 'Excel (XLSX)' },
							{ Hash: 'pdf',  Label: 'PDF report' },
							{ Separator: true },
							{ Hash: 'parquet', Label: 'Apache Parquet', Disabled: true,
							  Tooltip: 'Parquet export requires the Pro plan.' }
						]
					}).then((pChoice) => { if (pChoice) { fSetSplitResult('Download as ' + pChoice.Item.Label); } });
			});
		}
		let tmpDownloadMain = document.getElementById('btn-download');
		if (tmpDownloadMain)
		{
			tmpDownloadMain.addEventListener('click', () => { fSetSplitResult('Download CSV (default)'); });
		}

		let tmpDeployMore = document.getElementById('btn-deploy-more');
		if (tmpDeployMore)
		{
			tmpDeployMore.addEventListener('click', () =>
			{
				tmpModal.dropdown(tmpDeployMore,
					{
						align: 'right',
						items:
						[
							{ Hash: 'staging',    Label: 'Deploy to staging' },
							{ Hash: 'production', Label: 'Deploy to production', Style: 'primary' },
							{ Separator: true },
							{ Hash: 'rollback',   Label: 'Roll back last deploy', Style: 'danger' }
						]
					}).then((pChoice) => { if (pChoice) { fSetSplitResult(pChoice.Item.Label); } });
			});
		}
		let tmpDeployMain = document.getElementById('btn-deploy');
		if (tmpDeployMain)
		{
			tmpDeployMain.addEventListener('click', () => { fSetSplitResult('Deploy (default target)'); });
		}

		let tmpDeleteMore = document.getElementById('btn-delete-more');
		if (tmpDeleteMore)
		{
			tmpDeleteMore.addEventListener('click', () =>
			{
				tmpModal.dropdown(tmpDeleteMore,
					{
						align: 'right',
						items:
						[
							{ Hash: 'archive',  Label: 'Archive instead' },
							{ Hash: 'trash',    Label: 'Move to trash' },
							{ Separator: true },
							{ Hash: 'destroy',  Label: 'Delete permanently', Style: 'danger' }
						]
					}).then((pChoice) => { if (pChoice) { fSetSplitResult(pChoice.Item.Label); } });
			});
		}
		let tmpDeleteMain = document.getElementById('btn-delete');
		if (tmpDeleteMain)
		{
			tmpDeleteMain.addEventListener('click', () => { fSetSplitResult('Delete (default action)'); });
		}

		return super.onAfterRender();
	}
}

PictViewModalGardenLayout.default_configuration =
{
	ViewIdentifier: 'ModalGardenLayout',

	DefaultRenderable: 'ModalGarden-Content',
	DefaultDestinationAddress: '#ModalGarden-Application-Container',

	AutoRender: false,

	CSS: /*css*/`
		.modal-garden-header
		{
			text-align: center;
			padding: 48px 24px 32px;
			border-bottom: 1px solid #e5e7eb;
			margin-bottom: 40px;
		}
		.modal-garden-header h1
		{
			font-size: 36px;
			font-weight: 700;
			color: #111827;
			margin: 0 0 8px;
			letter-spacing: -0.5px;
		}
		.modal-garden-header p
		{
			font-size: 16px;
			color: #6b7280;
			margin: 0;
		}
		.modal-garden-sections
		{
			max-width: 900px;
			margin: 0 auto;
			padding: 0 24px 60px;
		}
		.garden-card
		{
			background: #ffffff;
			border: 1px solid #e5e7eb;
			border-radius: 12px;
			padding: 28px 32px;
			margin-bottom: 28px;
			box-shadow: 0 1px 3px rgba(0,0,0,0.06);
		}
		.garden-card h2
		{
			font-size: 20px;
			font-weight: 600;
			color: #111827;
			margin: 0 0 6px;
		}
		.garden-card .card-description
		{
			color: #6b7280;
			font-size: 14px;
			margin: 0 0 20px;
			line-height: 1.5;
		}
		.garden-card .button-row
		{
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-bottom: 16px;
		}
		.garden-btn
		{
			padding: 9px 18px;
			border: none;
			border-radius: 6px;
			font-size: 14px;
			font-weight: 500;
			cursor: pointer;
			transition: background 150ms ease, transform 80ms ease;
			font-family: system-ui, -apple-system, sans-serif;
		}
		.garden-btn:active
		{
			transform: scale(0.97);
		}
		.garden-btn-primary
		{
			background: #2563eb;
			color: #fff;
		}
		.garden-btn-primary:hover
		{
			background: #1d4ed8;
		}
		.garden-btn-danger
		{
			background: #dc2626;
			color: #fff;
		}
		.garden-btn-danger:hover
		{
			background: #b91c1c;
		}
		.garden-btn-info
		{
			background: #2563eb;
			color: #fff;
		}
		.garden-btn-info:hover
		{
			background: #1d4ed8;
		}
		.garden-btn-success
		{
			background: #16a34a;
			color: #fff;
		}
		.garden-btn-success:hover
		{
			background: #15803d;
		}
		.garden-btn-warning
		{
			background: #d97706;
			color: #fff;
		}
		.garden-btn-warning:hover
		{
			background: #b45309;
		}
		.garden-btn-error
		{
			background: #dc2626;
			color: #fff;
		}
		.garden-btn-error:hover
		{
			background: #b91c1c;
		}
		.garden-btn-secondary
		{
			background: #e5e7eb;
			color: #374151;
		}
		.garden-btn-secondary:hover
		{
			background: #d1d5db;
		}
		.garden-btn-outline
		{
			background: transparent;
			color: #2563eb;
			border: 1px solid #2563eb;
		}
		.garden-btn-outline:hover
		{
			background: #eff6ff;
		}
		.result-display
		{
			padding: 10px 14px;
			border-radius: 6px;
			font-size: 13px;
			font-family: "SF Mono", "Fira Code", "Fira Mono", monospace;
			margin-bottom: 16px;
			background: #f3f4f6;
			color: #6b7280;
		}
		.result-confirmed
		{
			background: #ecfdf5;
			color: #065f46;
		}
		.result-cancelled
		{
			background: #fef2f2;
			color: #991b1b;
		}
		.tooltip-target
		{
			display: inline-block;
			padding: 10px 18px;
			background: #f3f4f6;
			border: 1px solid #d1d5db;
			border-radius: 6px;
			font-size: 14px;
			color: #374151;
			cursor: default;
			user-select: none;
		}
		.tooltip-target:hover
		{
			background: #e5e7eb;
		}
		.rich-tooltip-target
		{
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 10px 18px;
			background: #eff6ff;
			border: 1px solid #bfdbfe;
			border-radius: 6px;
			font-size: 14px;
			color: #1e40af;
			cursor: default;
			user-select: none;
		}
		.rich-tooltip-target:hover
		{
			background: #dbeafe;
		}
		.section-divider
		{
			border: none;
			border-top: 1px solid #e5e7eb;
			margin: 0 0 28px;
		}
		/* ── Nav menu (dropdown anchors) ─────────────────── */
		.garden-nav
		{
			display: flex;
			align-items: center;
			gap: 4px;
			padding: 8px 12px;
			background: #ffffff;
			border: 1px solid #e5e7eb;
			border-radius: 8px;
		}
		.garden-nav-link
		{
			display: inline-flex;
			align-items: center;
			gap: 4px;
			padding: 6px 12px;
			color: #1f2937;
			text-decoration: none;
			border-radius: 6px;
			font-weight: 500;
			cursor: pointer;
		}
		.garden-nav-link:hover
		{
			background: #f3f4f6;
			color: #111827;
		}
		.garden-nav-caret
		{
			font-size: 11px;
			color: #6b7280;
		}
		/* ── Split-button dropdowns ──────────────────────── */
		.garden-split-button
		{
			display: inline-flex;
			align-items: stretch;
		}
		.garden-split-main
		{
			border-top-right-radius: 0 !important;
			border-bottom-right-radius: 0 !important;
		}
		.garden-split-arrow
		{
			border-top-left-radius: 0 !important;
			border-bottom-left-radius: 0 !important;
			border-left: 1px solid rgba(255, 255, 255, 0.25) !important;
			padding-left: 10px !important;
			padding-right: 10px !important;
			min-width: 32px;
		}
	`,

	Templates:
	[
		{
			Hash: 'ModalGarden-Content',
			Template: /*html*/`
<div class="modal-garden-header">
	<h1>Modal Garden</h1>
	<p>Interactive showcase of pict-section-modal features</p>
</div>
<div class="modal-garden-sections">

	<!-- Confirm Dialog -->
	<div class="garden-card">
		<h2>Confirm Dialog</h2>
		<p class="card-description">A standard confirmation dialog that resolves a Promise with <code>true</code> (confirmed) or <code>false</code> (cancelled).</p>
		<div class="button-row">
			<button id="btn-confirm" class="garden-btn garden-btn-primary">Show Confirm</button>
		</div>
		<div id="confirm-result" class="result-display">Result will appear here</div>
		<div id="code-snippet-confirm"></div>
	</div>

	<!-- Dangerous Confirm -->
	<div class="garden-card">
		<h2>Dangerous Confirm</h2>
		<p class="card-description">A confirmation styled for destructive actions. The confirm button is rendered in red to signal danger.</p>
		<div class="button-row">
			<button id="btn-dangerous-confirm" class="garden-btn garden-btn-danger">Delete Record</button>
		</div>
		<div id="dangerous-confirm-result" class="result-display">Result will appear here</div>
		<div id="code-snippet-dangerous-confirm"></div>
	</div>

	<!-- Double Confirm (Typed Phrase) -->
	<div class="garden-card">
		<h2>Double Confirm (Typed Phrase)</h2>
		<p class="card-description">Requires the user to type a specific phrase before the confirm button is enabled. Ideal for irreversible bulk operations.</p>
		<div class="button-row">
			<button id="btn-double-confirm-phrase" class="garden-btn garden-btn-danger">Delete All Data</button>
		</div>
		<div id="double-confirm-phrase-result" class="result-display">Result will appear here</div>
		<div id="code-snippet-double-confirm-phrase"></div>
	</div>

	<!-- Double Confirm (Two-Click) -->
	<div class="garden-card">
		<h2>Double Confirm (Two-Click)</h2>
		<p class="card-description">No phrase required. The first click changes the button label; the second click confirms. Prevents accidental single-click confirmation.</p>
		<div class="button-row">
			<button id="btn-double-confirm-twoclick" class="garden-btn garden-btn-warning">Reset Settings</button>
		</div>
		<div id="double-confirm-twoclick-result" class="result-display">Result will appear here</div>
		<div id="code-snippet-double-confirm-twoclick"></div>
	</div>

	<!-- Custom Modal -->
	<div class="garden-card">
		<h2>Custom Modal Window</h2>
		<p class="card-description">A fully customizable modal with arbitrary HTML content and multiple action buttons. Each button has a Hash, Label, and optional Style. The promise resolves with the clicked button's Hash.</p>
		<div class="button-row">
			<button id="btn-custom-modal" class="garden-btn garden-btn-primary">Open Custom Modal</button>
		</div>
		<div id="custom-modal-result" class="result-display">Result will appear here</div>
		<div id="code-snippet-custom-modal"></div>
	</div>

	<hr class="section-divider" />

	<!-- Toast Notifications (Types) -->
	<div class="garden-card">
		<h2>Toast Notifications</h2>
		<p class="card-description">Lightweight notification messages that appear briefly and auto-dismiss. Four built-in types: info, success, warning, and error.</p>
		<div class="button-row">
			<button id="btn-toast-info" class="garden-btn garden-btn-info">Info</button>
			<button id="btn-toast-success" class="garden-btn garden-btn-success">Success</button>
			<button id="btn-toast-warning" class="garden-btn garden-btn-warning">Warning</button>
			<button id="btn-toast-error" class="garden-btn garden-btn-error">Error</button>
		</div>
		<div id="code-snippet-toast-types"></div>
	</div>

	<!-- Toast Positions -->
	<div class="garden-card">
		<h2>Toast Positions</h2>
		<p class="card-description">Toasts can appear in six positions around the viewport. Each position maintains its own stack.</p>
		<div class="button-row">
			<button id="btn-toast-top-left" class="garden-btn garden-btn-secondary">Top Left</button>
			<button id="btn-toast-top-center" class="garden-btn garden-btn-secondary">Top Center</button>
			<button id="btn-toast-top-right" class="garden-btn garden-btn-secondary">Top Right</button>
			<button id="btn-toast-bottom-left" class="garden-btn garden-btn-secondary">Bottom Left</button>
			<button id="btn-toast-bottom-center" class="garden-btn garden-btn-secondary">Bottom Center</button>
			<button id="btn-toast-bottom-right" class="garden-btn garden-btn-secondary">Bottom Right</button>
		</div>
		<div id="code-snippet-toast-positions"></div>
	</div>

	<!-- Toast Options -->
	<div class="garden-card">
		<h2>Toast Options</h2>
		<p class="card-description">Control auto-dismiss duration and whether the dismiss button is shown. Set <code>duration: 0</code> for persistent toasts.</p>
		<div class="button-row">
			<button id="btn-toast-persistent" class="garden-btn garden-btn-warning">Persistent Toast</button>
			<button id="btn-toast-no-dismiss" class="garden-btn garden-btn-secondary">No Dismiss Button</button>
			<button id="btn-toast-dismiss-all" class="garden-btn garden-btn-outline">Dismiss All Toasts</button>
		</div>
		<div id="code-snippet-toast-options"></div>
	</div>

	<hr class="section-divider" />

	<!-- Tooltips -->
	<div class="garden-card">
		<h2>Simple Tooltips</h2>
		<p class="card-description">Plain text tooltips that appear on hover. Supports four positions with automatic viewport-aware flipping.</p>
		<div class="button-row">
			<span id="tooltip-top" class="tooltip-target">Top</span>
			<span id="tooltip-bottom" class="tooltip-target">Bottom</span>
			<span id="tooltip-left" class="tooltip-target">Left</span>
			<span id="tooltip-right" class="tooltip-target">Right</span>
		</div>
		<div id="code-snippet-tooltips"></div>
	</div>

	<!-- Rich Tooltips -->
	<div class="garden-card">
		<h2>Rich Tooltips</h2>
		<p class="card-description">HTML-powered tooltips with interactive content. The user can hover over the tooltip itself to interact with links or other elements inside.</p>
		<div class="button-row">
			<span id="rich-tooltip-info" class="rich-tooltip-target">Hover for User Info</span>
			<span id="rich-tooltip-action" class="rich-tooltip-target">Hover for Status</span>
		</div>
		<div id="code-snippet-rich-tooltips"></div>
	</div>

	<hr class="section-divider" />

	<!-- Dropdowns: Nav menu -->
	<div class="garden-card">
		<h2>Nav Menu Dropdown</h2>
		<p class="card-description">A dropdown anchored under a nav link. Useful for header navigation with grouped destinations. Auto-positions and clamps inside the viewport, dismisses on click-outside or Escape.</p>
		<div class="garden-nav">
			<a href="#" id="nav-home" class="garden-nav-link">Home</a>
			<a href="#" id="nav-products" class="garden-nav-link garden-nav-trigger">Products <span class="garden-nav-caret">▾</span></a>
			<a href="#" id="nav-resources" class="garden-nav-link garden-nav-trigger">Resources <span class="garden-nav-caret">▾</span></a>
			<a href="#" id="nav-account" class="garden-nav-link garden-nav-trigger">Account <span class="garden-nav-caret">▾</span></a>
		</div>
		<div id="code-snippet-dropdown-nav"></div>
	</div>

	<!-- Dropdowns: Split-button addendum -->
	<div class="garden-card">
		<h2>Split-Button Dropdowns</h2>
		<p class="card-description">A primary action button paired with a chevron that opens alternates. The chevron is the dropdown's anchor; the menu aligns to its right edge so it stays under the addendum.</p>
		<div class="button-row">
			<div class="garden-split-button">
				<button id="btn-download" class="garden-btn garden-btn-primary garden-split-main">Download CSV</button>
				<button id="btn-download-more" class="garden-btn garden-btn-primary garden-split-arrow" aria-label="More download options">▾</button>
			</div>
			<div class="garden-split-button">
				<button id="btn-deploy" class="garden-btn garden-btn-success garden-split-main">Deploy</button>
				<button id="btn-deploy-more" class="garden-btn garden-btn-success garden-split-arrow" aria-label="More deploy options">▾</button>
			</div>
			<div class="garden-split-button">
				<button id="btn-delete" class="garden-btn garden-btn-danger garden-split-main">Delete</button>
				<button id="btn-delete-more" class="garden-btn garden-btn-danger garden-split-arrow" aria-label="More delete options">▾</button>
			</div>
		</div>
		<div class="result-display result-default" id="dropdown-split-result">Selected: (none)</div>
		<div id="code-snippet-dropdown-split"></div>
	</div>

</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'ModalGarden-Content',
			TemplateHash: 'ModalGarden-Content',
			DestinationAddress: '#ModalGarden-Application-Container',
			RenderMethod: 'replace'
		}
	]
};

module.exports = PictViewModalGardenLayout;
