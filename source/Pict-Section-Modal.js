const libPictViewClass = require('pict-view');

const libPictModalOverlay = require('./Pict-Modal-Overlay.js');
const libPictModalConfirm = require('./Pict-Modal-Confirm.js');
const libPictModalWindow = require('./Pict-Modal-Window.js');
const libPictModalToast = require('./Pict-Modal-Toast.js');
const libPictModalTooltip = require('./Pict-Modal-Tooltip.js');

const _DefaultConfiguration = require('./Pict-Section-Modal-DefaultConfiguration.js');

class PictSectionModal extends libPictViewClass
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DefaultConfiguration, pOptions);

		super(pFable, tmpOptions, pServiceHash);

		this._activeModals = [];
		this._activeTooltips = [];
		this._activeToasts = [];
		this._idCounter = 0;

		this._overlay = new libPictModalOverlay(this);
		this._confirm = new libPictModalConfirm(this);
		this._window = new libPictModalWindow(this);
		this._toast = new libPictModalToast(this);
		this._tooltip = new libPictModalTooltip(this);
	}

	onBeforeInitialize()
	{
		super.onBeforeInitialize();

		// Ensure the root class is on the body for CSS variable scoping
		if (typeof document !== 'undefined' && document.body)
		{
			if (!document.body.classList.contains('pict-modal-root'))
			{
				document.body.classList.add('pict-modal-root');
			}
		}

		return super.onBeforeInitialize();
	}

	/**
	 * Generate a unique ID for DOM elements.
	 *
	 * @returns {number}
	 */
	_nextId()
	{
		this._idCounter++;
		return this._idCounter;
	}

	// -- Confirm API --

	/**
	 * Show a confirmation dialog.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options { title, confirmLabel, cancelLabel, dangerous }
	 * @returns {Promise<boolean>}
	 */
	confirm(pMessage, pOptions)
	{
		return this._confirm.confirm(pMessage, pOptions);
	}

	/**
	 * Show a two-step confirmation dialog.
	 *
	 * If confirmPhrase is set, the user must type it to enable the confirm button.
	 * If no confirmPhrase, the first click changes the button text and the second click confirms.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options { title, confirmPhrase, phrasePrompt, confirmLabel, cancelLabel }
	 * @returns {Promise<boolean>}
	 */
	doubleConfirm(pMessage, pOptions)
	{
		return this._confirm.doubleConfirm(pMessage, pOptions);
	}

	// -- Modal Window API --

	/**
	 * Show a custom modal window.
	 *
	 * @param {object} [pOptions] - Options { title, content, buttons, closeable, width, onOpen, onClose }
	 * @returns {Promise<string|null>} Resolves with the clicked button Hash, or null on close
	 */
	show(pOptions)
	{
		return this._window.show(pOptions);
	}

	// -- Tooltip API --

	/**
	 * Attach a simple text tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pText - Tooltip text
	 * @param {object} [pOptions] - Options { position, delay, maxWidth }
	 * @returns {{ destroy: function }}
	 */
	tooltip(pElement, pText, pOptions)
	{
		return this._tooltip.tooltip(pElement, pText, pOptions);
	}

	/**
	 * Attach a rich HTML tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pHTMLContent - HTML content
	 * @param {object} [pOptions] - Options { position, delay, maxWidth, interactive }
	 * @returns {{ destroy: function }}
	 */
	richTooltip(pElement, pHTMLContent, pOptions)
	{
		return this._tooltip.richTooltip(pElement, pHTMLContent, pOptions);
	}

	// -- Toast API --

	/**
	 * Show a toast notification.
	 *
	 * @param {string} pMessage - Toast message
	 * @param {object} [pOptions] - Options { type, duration, position, dismissible }
	 * @returns {{ dismiss: function }}
	 */
	toast(pMessage, pOptions)
	{
		return this._toast.toast(pMessage, pOptions);
	}

	// -- Cleanup API --

	/**
	 * Dismiss all open modals.
	 */
	dismissModals()
	{
		let tmpModals = this._activeModals.slice();
		for (let i = tmpModals.length - 1; i >= 0; i--)
		{
			tmpModals[i].dismiss(null);
		}
	}

	/**
	 * Dismiss all active tooltips.
	 */
	dismissTooltips()
	{
		this._tooltip.dismissAll();
	}

	/**
	 * Dismiss all active toasts.
	 */
	dismissToasts()
	{
		this._toast.dismissAll();
	}

	/**
	 * Dismiss everything: modals, tooltips, and toasts.
	 */
	dismissAll()
	{
		this.dismissModals();
		this.dismissTooltips();
		this.dismissToasts();
	}

	/**
	 * Clean up all DOM elements when the view is destroyed.
	 */
	destroy()
	{
		this.dismissAll();
		this._overlay.destroy();
		this._toast.destroy();
		if (typeof super.destroy === 'function') { return super.destroy(); }
	}
}

module.exports = PictSectionModal;

module.exports.default_configuration = _DefaultConfiguration;
