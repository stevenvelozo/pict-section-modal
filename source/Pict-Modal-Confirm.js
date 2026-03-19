/**
 * Pict-Modal-Confirm
 *
 * Builds confirm and double-confirm dialog DOM, returns Promises.
 */
class PictModalConfirm
{
	constructor(pModal)
	{
		this._modal = pModal;
	}

	/**
	 * Show a single-step confirmation dialog.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options (title, confirmLabel, cancelLabel, dangerous)
	 * @returns {Promise<boolean>}
	 */
	confirm(pMessage, pOptions)
	{
		let tmpOptions = Object.assign({}, this._modal.options.DefaultConfirmOptions, pOptions);

		return new Promise((fResolve) =>
		{
			let tmpDialog = this._buildDialog(tmpOptions.title, pMessage, fResolve, tmpOptions);
			this._showDialog(tmpDialog, fResolve);
		});
	}

	/**
	 * Show a two-step confirmation dialog.
	 *
	 * If confirmPhrase is provided, user must type it to enable the confirm button.
	 * Otherwise, first click changes button text, second click confirms.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options (title, confirmPhrase, phrasePrompt, confirmLabel, cancelLabel)
	 * @returns {Promise<boolean>}
	 */
	doubleConfirm(pMessage, pOptions)
	{
		let tmpOptions = Object.assign({}, this._modal.options.DefaultDoubleConfirmOptions, pOptions);

		return new Promise((fResolve) =>
		{
			let tmpDialog = this._buildDoubleConfirmDialog(tmpOptions.title, pMessage, fResolve, tmpOptions);
			this._showDialog(tmpDialog, fResolve);
		});
	}

	/**
	 * Build a standard confirm dialog element.
	 *
	 * @param {string} pTitle
	 * @param {string} pMessage
	 * @param {function} fResolve - Promise resolver
	 * @param {object} pOptions
	 * @returns {HTMLElement}
	 */
	_buildDialog(pTitle, pMessage, fResolve, pOptions)
	{
		let tmpId = this._modal._nextId();
		let tmpBtnStyle = pOptions.dangerous ? 'danger' : 'primary';

		let tmpDialog = document.createElement('div');
		tmpDialog.className = 'pict-modal-dialog';
		tmpDialog.id = 'pict-modal-' + tmpId;
		tmpDialog.setAttribute('role', 'dialog');
		tmpDialog.setAttribute('aria-modal', 'true');
		tmpDialog.style.width = '420px';

		tmpDialog.innerHTML =
			'<div class="pict-modal-dialog-header">' +
				'<span class="pict-modal-dialog-title">' + this._escapeHTML(pTitle) + '</span>' +
				'<button class="pict-modal-dialog-close" aria-label="Close">&times;</button>' +
			'</div>' +
			'<div class="pict-modal-dialog-body">' +
				'<p>' + this._escapeHTML(pMessage) + '</p>' +
			'</div>' +
			'<div class="pict-modal-dialog-footer">' +
				'<button class="pict-modal-btn" data-action="cancel">' + this._escapeHTML(pOptions.cancelLabel) + '</button>' +
				'<button class="pict-modal-btn pict-modal-btn--' + tmpBtnStyle + '" data-action="confirm">' + this._escapeHTML(pOptions.confirmLabel) + '</button>' +
			'</div>';

		let tmpCloseBtn = tmpDialog.querySelector('.pict-modal-dialog-close');
		let tmpCancelBtn = tmpDialog.querySelector('[data-action="cancel"]');
		let tmpConfirmBtn = tmpDialog.querySelector('[data-action="confirm"]');

		let tmpDismiss = (pResult) =>
		{
			this._dismissDialog(tmpDialog, pResult, fResolve);
		};

		tmpCloseBtn.addEventListener('click', () => { tmpDismiss(false); });
		tmpCancelBtn.addEventListener('click', () => { tmpDismiss(false); });
		tmpConfirmBtn.addEventListener('click', () => { tmpDismiss(true); });

		tmpDialog._dismiss = tmpDismiss;
		tmpDialog._focusTarget = tmpCancelBtn;

		return tmpDialog;
	}

	/**
	 * Build a double-confirm dialog element.
	 *
	 * @param {string} pTitle
	 * @param {string} pMessage
	 * @param {function} fResolve - Promise resolver
	 * @param {object} pOptions
	 * @returns {HTMLElement}
	 */
	_buildDoubleConfirmDialog(pTitle, pMessage, fResolve, pOptions)
	{
		let tmpId = this._modal._nextId();
		let tmpHasPhrase = (typeof pOptions.confirmPhrase === 'string') && (pOptions.confirmPhrase.length > 0);

		let tmpDialog = document.createElement('div');
		tmpDialog.className = 'pict-modal-dialog';
		tmpDialog.id = 'pict-modal-' + tmpId;
		tmpDialog.setAttribute('role', 'dialog');
		tmpDialog.setAttribute('aria-modal', 'true');
		tmpDialog.style.width = '420px';

		let tmpBodyContent = '<p>' + this._escapeHTML(pMessage) + '</p>';

		if (tmpHasPhrase)
		{
			let tmpPromptText = pOptions.phrasePrompt.replace('{phrase}', pOptions.confirmPhrase);
			tmpBodyContent +=
				'<div class="pict-modal-confirm-prompt">' + this._escapeHTML(tmpPromptText) + '</div>' +
				'<input type="text" class="pict-modal-confirm-input" autocomplete="off" spellcheck="false" />';
		}

		tmpDialog.innerHTML =
			'<div class="pict-modal-dialog-header">' +
				'<span class="pict-modal-dialog-title">' + this._escapeHTML(pTitle) + '</span>' +
				'<button class="pict-modal-dialog-close" aria-label="Close">&times;</button>' +
			'</div>' +
			'<div class="pict-modal-dialog-body">' +
				tmpBodyContent +
			'</div>' +
			'<div class="pict-modal-dialog-footer">' +
				'<button class="pict-modal-btn" data-action="cancel">' + this._escapeHTML(pOptions.cancelLabel) + '</button>' +
				'<button class="pict-modal-btn pict-modal-btn--danger" data-action="confirm" disabled>' + this._escapeHTML(pOptions.confirmLabel) + '</button>' +
			'</div>';

		let tmpCloseBtn = tmpDialog.querySelector('.pict-modal-dialog-close');
		let tmpCancelBtn = tmpDialog.querySelector('[data-action="cancel"]');
		let tmpConfirmBtn = tmpDialog.querySelector('[data-action="confirm"]');

		let tmpDismiss = (pResult) =>
		{
			this._dismissDialog(tmpDialog, pResult, fResolve);
		};

		tmpCloseBtn.addEventListener('click', () => { tmpDismiss(false); });
		tmpCancelBtn.addEventListener('click', () => { tmpDismiss(false); });

		if (tmpHasPhrase)
		{
			// Phrase-based: enable confirm button when input matches
			let tmpInput = tmpDialog.querySelector('.pict-modal-confirm-input');
			tmpInput.addEventListener('input', () =>
			{
				tmpConfirmBtn.disabled = (tmpInput.value !== pOptions.confirmPhrase);
			});
			tmpConfirmBtn.addEventListener('click', () =>
			{
				if (!tmpConfirmBtn.disabled)
				{
					tmpDismiss(true);
				}
			});
			tmpDialog._focusTarget = tmpInput;
		}
		else
		{
			// Two-click: first click changes label, second click confirms
			let tmpClickCount = 0;
			let tmpOriginalLabel = pOptions.confirmLabel;
			tmpConfirmBtn.disabled = false;

			tmpConfirmBtn.addEventListener('click', () =>
			{
				tmpClickCount++;
				if (tmpClickCount === 1)
				{
					tmpConfirmBtn.textContent = 'Click again to confirm';
				}
				else
				{
					tmpDismiss(true);
				}
			});
			tmpDialog._focusTarget = tmpCancelBtn;
		}

		tmpDialog._dismiss = tmpDismiss;

		return tmpDialog;
	}

	/**
	 * Show a dialog element: append to body, show overlay, animate in.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {function} fResolve - Promise resolver (for overlay click dismiss)
	 */
	_showDialog(pDialog, fResolve)
	{
		let tmpModalEntry =
		{
			element: pDialog,
			dismiss: pDialog._dismiss,
			type: 'confirm'
		};

		// Show overlay
		let tmpOverlayClickHandler = null;
		if (this._modal.options.OverlayClickDismisses)
		{
			tmpOverlayClickHandler = () => { pDialog._dismiss(false); };
		}
		this._modal._overlay.show(tmpOverlayClickHandler);

		// Append to body
		document.body.appendChild(pDialog);

		// Track active modal
		this._modal._activeModals.push(tmpModalEntry);

		// Animate in
		void pDialog.offsetHeight;
		pDialog.classList.add('pict-modal-visible');

		// Focus
		if (pDialog._focusTarget)
		{
			pDialog._focusTarget.focus();
		}

		// Keyboard handler
		pDialog._keyHandler = (pEvent) =>
		{
			if (pEvent.key === 'Escape')
			{
				pDialog._dismiss(false);
			}
		};
		document.addEventListener('keydown', pDialog._keyHandler);
	}

	/**
	 * Dismiss a dialog: animate out, remove from DOM, hide overlay.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {*} pResult - Value to resolve the promise with
	 * @param {function} fResolve - Promise resolver
	 */
	_dismissDialog(pDialog, pResult, fResolve)
	{
		// Prevent double-dismiss
		if (pDialog._dismissed)
		{
			return;
		}
		pDialog._dismissed = true;

		// Remove keyboard handler
		if (pDialog._keyHandler)
		{
			document.removeEventListener('keydown', pDialog._keyHandler);
		}

		// Animate out
		pDialog.classList.remove('pict-modal-visible');

		// Remove from active modals
		this._modal._activeModals = this._modal._activeModals.filter(
			(pEntry) => { return pEntry.element !== pDialog; }
		);

		// Update overlay click handler to point to new topmost modal
		if (this._modal._activeModals.length > 0)
		{
			let tmpTopModal = this._modal._activeModals[this._modal._activeModals.length - 1];
			this._modal._overlay.updateClickHandler(
				this._modal.options.OverlayClickDismisses ? tmpTopModal.dismiss : null
			);
		}

		// Hide overlay
		this._modal._overlay.hide();

		// Remove from DOM after transition
		setTimeout(() =>
		{
			if (pDialog.parentNode)
			{
				pDialog.parentNode.removeChild(pDialog);
			}
		}, 220);

		// Resolve promise
		fResolve(pResult);
	}

	/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText
	 * @returns {string}
	 */
	_escapeHTML(pText)
	{
		if (typeof pText !== 'string')
		{
			return '';
		}
		return pText
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}
}

module.exports = PictModalConfirm;
