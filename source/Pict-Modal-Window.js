/**
 * Pict-Modal-Window
 *
 * Builds custom floating modal windows with arbitrary content and buttons.
 */
class PictModalWindow
{
	constructor(pModal)
	{
		this._modal = pModal;
	}

	/**
	 * Show a custom modal window.
	 *
	 * @param {object} [pOptions] - Options
	 * @param {string} [pOptions.title] - Dialog title
	 * @param {string} [pOptions.content] - HTML content for the body
	 * @param {Array} [pOptions.buttons] - Array of { Hash, Label, Style }
	 * @param {boolean} [pOptions.closeable] - Whether the close button and overlay dismiss are enabled
	 * @param {string} [pOptions.width] - CSS width value
	 * @param {boolean} [pOptions.unbounded] - If true, removes the default 90vh/90vw viewport cap. The dialog will grow with its content and may extend beyond the viewport.
	 * @param {function} [pOptions.onOpen] - Called after dialog is shown, receives dialog element
	 * @param {function} [pOptions.onClose] - Called after dialog is dismissed
	 * @returns {Promise<string|null>} Resolves with clicked button Hash, or null on close
	 */
	show(pOptions)
	{
		let tmpOptions = Object.assign({}, this._modal.options.DefaultModalOptions, pOptions);

		return new Promise((fResolve) =>
		{
			let tmpDialog = this._buildDialog(tmpOptions, fResolve);
			this._showDialog(tmpDialog, tmpOptions, fResolve);
		});
	}

	/**
	 * Build the modal dialog element.
	 *
	 * @param {object} pOptions
	 * @param {function} fResolve
	 * @returns {HTMLElement}
	 */
	_buildDialog(pOptions, fResolve)
	{
		let tmpId = this._modal._nextId();

		let tmpDialog = document.createElement('div');
		tmpDialog.className = 'pict-modal-dialog';
		if (pOptions.unbounded)
		{
			tmpDialog.className += ' pict-modal-dialog--unbounded';
		}
		tmpDialog.id = 'pict-modal-' + tmpId;
		tmpDialog.setAttribute('role', 'dialog');
		tmpDialog.setAttribute('aria-modal', 'true');
		tmpDialog.style.width = pOptions.width;

		// Header
		let tmpHeaderHTML = '';
		if (pOptions.title || pOptions.closeable)
		{
			tmpHeaderHTML = '<div class="pict-modal-dialog-header">';
			tmpHeaderHTML += '<span class="pict-modal-dialog-title">' + this._escapeHTML(pOptions.title) + '</span>';
			if (pOptions.closeable)
			{
				tmpHeaderHTML += '<button class="pict-modal-dialog-close" aria-label="Close">&times;</button>';
			}
			tmpHeaderHTML += '</div>';
		}

		// Body
		let tmpBodyHTML = '<div class="pict-modal-dialog-body">' + (pOptions.content || '') + '</div>';

		// Footer with buttons
		let tmpFooterHTML = '';
		if (pOptions.buttons && pOptions.buttons.length > 0)
		{
			tmpFooterHTML = '<div class="pict-modal-dialog-footer">';
			for (let i = 0; i < pOptions.buttons.length; i++)
			{
				let tmpButton = pOptions.buttons[i];
				let tmpBtnClass = 'pict-modal-btn';
				if (tmpButton.Style)
				{
					tmpBtnClass += ' pict-modal-btn--' + tmpButton.Style;
				}
				tmpFooterHTML += '<button class="' + tmpBtnClass + '" data-hash="' + this._escapeHTML(tmpButton.Hash) + '">' +
					this._escapeHTML(tmpButton.Label) + '</button>';
			}
			tmpFooterHTML += '</div>';
		}

		tmpDialog.innerHTML = tmpHeaderHTML + tmpBodyHTML + tmpFooterHTML;

		let tmpDismiss = (pResult) =>
		{
			this._dismissDialog(tmpDialog, pResult, fResolve, pOptions);
		};

		// Wire close button
		if (pOptions.closeable)
		{
			let tmpCloseBtn = tmpDialog.querySelector('.pict-modal-dialog-close');
			if (tmpCloseBtn)
			{
				tmpCloseBtn.addEventListener('click', () => { tmpDismiss(null); });
			}
		}

		// Wire action buttons
		let tmpActionButtons = tmpDialog.querySelectorAll('[data-hash]');
		for (let i = 0; i < tmpActionButtons.length; i++)
		{
			let tmpBtn = tmpActionButtons[i];
			tmpBtn.addEventListener('click', () =>
			{
				tmpDismiss(tmpBtn.getAttribute('data-hash'));
			});
		}

		tmpDialog._dismiss = tmpDismiss;

		return tmpDialog;
	}

	/**
	 * Show the dialog: append to body, show overlay, animate in.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {object} pOptions
	 * @param {function} fResolve
	 */
	_showDialog(pDialog, pOptions, fResolve)
	{
		let tmpModalEntry =
		{
			element: pDialog,
			dismiss: pDialog._dismiss,
			type: 'window'
		};

		// Show overlay
		let tmpOverlayClickHandler = null;
		if (this._modal.options.OverlayClickDismisses && pOptions.closeable)
		{
			tmpOverlayClickHandler = () => { pDialog._dismiss(null); };
		}
		this._modal._overlay.show(tmpOverlayClickHandler);

		// Append to body
		document.body.appendChild(pDialog);

		// Track
		this._modal._activeModals.push(tmpModalEntry);

		// Animate in
		void pDialog.offsetHeight;
		pDialog.classList.add('pict-modal-visible');

		// Focus first button or close button
		let tmpFocusTarget = pDialog.querySelector('.pict-modal-btn') || pDialog.querySelector('.pict-modal-dialog-close');
		if (tmpFocusTarget)
		{
			tmpFocusTarget.focus();
		}

		// Keyboard handler
		pDialog._keyHandler = (pEvent) =>
		{
			if (pEvent.key === 'Escape' && pOptions.closeable)
			{
				pDialog._dismiss(null);
			}
		};
		document.addEventListener('keydown', pDialog._keyHandler);

		// onOpen callback
		if (typeof pOptions.onOpen === 'function')
		{
			pOptions.onOpen(pDialog);
		}
	}

	/**
	 * Dismiss the dialog: animate out, remove from DOM, hide overlay.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {*} pResult
	 * @param {function} fResolve
	 * @param {object} pOptions
	 */
	_dismissDialog(pDialog, pResult, fResolve, pOptions)
	{
		if (pDialog._dismissed)
		{
			return;
		}
		pDialog._dismissed = true;

		if (pDialog._keyHandler)
		{
			document.removeEventListener('keydown', pDialog._keyHandler);
		}

		pDialog.classList.remove('pict-modal-visible');

		this._modal._activeModals = this._modal._activeModals.filter(
			(pEntry) => { return pEntry.element !== pDialog; }
		);

		if (this._modal._activeModals.length > 0)
		{
			let tmpTopModal = this._modal._activeModals[this._modal._activeModals.length - 1];
			this._modal._overlay.updateClickHandler(
				this._modal.options.OverlayClickDismisses ? tmpTopModal.dismiss : null
			);
		}

		this._modal._overlay.hide();

		setTimeout(() =>
		{
			if (pDialog.parentNode)
			{
				pDialog.parentNode.removeChild(pDialog);
			}
		}, 220);

		if (typeof pOptions.onClose === 'function')
		{
			pOptions.onClose(pResult);
		}

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

module.exports = PictModalWindow;
