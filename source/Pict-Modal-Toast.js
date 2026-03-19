/**
 * Pict-Modal-Toast
 *
 * Manages toast notification elements with auto-dismiss and stacking.
 */
class PictModalToast
{
	constructor(pModal)
	{
		this._modal = pModal;
		this._containers = {};
	}

	/**
	 * Show a toast notification.
	 *
	 * @param {string} pMessage - Toast message text
	 * @param {object} [pOptions] - Options (type, duration, position, dismissible)
	 * @returns {{ dismiss: function }} Handle with dismiss method
	 */
	toast(pMessage, pOptions)
	{
		let tmpOptions = Object.assign({}, this._modal.options.DefaultToastOptions, pOptions);
		let tmpContainer = this._getContainer(tmpOptions.position);
		let tmpId = this._modal._nextId();

		let tmpToast = document.createElement('div');
		tmpToast.className = 'pict-modal-toast pict-modal-toast--' + tmpOptions.type;
		tmpToast.id = 'pict-modal-toast-' + tmpId;

		let tmpContent = '<span class="pict-modal-toast-message">' + this._escapeHTML(pMessage) + '</span>';

		if (tmpOptions.dismissible)
		{
			tmpContent += '<button class="pict-modal-toast-dismiss" aria-label="Dismiss">&times;</button>';
		}

		tmpToast.innerHTML = tmpContent;

		// Create handle
		let tmpDismissed = false;
		let tmpTimeoutHandle = null;

		let tmpDismiss = () =>
		{
			if (tmpDismissed)
			{
				return;
			}
			tmpDismissed = true;

			if (tmpTimeoutHandle)
			{
				clearTimeout(tmpTimeoutHandle);
			}

			// Exit animation
			tmpToast.classList.remove('pict-modal-visible');
			tmpToast.classList.add('pict-modal-toast-exit');

			// Remove from active list
			this._modal._activeToasts = this._modal._activeToasts.filter(
				(pEntry) => { return pEntry.element !== tmpToast; }
			);

			// Remove from DOM after transition
			setTimeout(() =>
			{
				if (tmpToast.parentNode)
				{
					tmpToast.parentNode.removeChild(tmpToast);
				}
				this._cleanupContainer(tmpOptions.position);
			}, 220);
		};

		let tmpHandle = { dismiss: tmpDismiss };

		// Wire dismiss button
		if (tmpOptions.dismissible)
		{
			let tmpDismissBtn = tmpToast.querySelector('.pict-modal-toast-dismiss');
			if (tmpDismissBtn)
			{
				tmpDismissBtn.addEventListener('click', tmpDismiss);
			}
		}

		// Append to container
		tmpContainer.appendChild(tmpToast);

		// Track
		let tmpEntry =
		{
			element: tmpToast,
			dismiss: tmpDismiss,
			handle: tmpHandle
		};
		this._modal._activeToasts.push(tmpEntry);

		// Animate in
		void tmpToast.offsetHeight;
		tmpToast.classList.add('pict-modal-visible');

		// Auto-dismiss
		if (tmpOptions.duration > 0)
		{
			tmpTimeoutHandle = setTimeout(tmpDismiss, tmpOptions.duration);
		}

		return tmpHandle;
	}

	/**
	 * Get or create a toast container for the given position.
	 *
	 * @param {string} pPosition - Position key (e.g. 'top-right')
	 * @returns {HTMLElement}
	 */
	_getContainer(pPosition)
	{
		if (this._containers[pPosition])
		{
			return this._containers[pPosition];
		}

		let tmpContainer = document.createElement('div');
		tmpContainer.className = 'pict-modal-toast-container pict-modal-toast-container--' + pPosition;
		document.body.appendChild(tmpContainer);
		this._containers[pPosition] = tmpContainer;

		return tmpContainer;
	}

	/**
	 * Remove a container if it has no more toasts.
	 *
	 * @param {string} pPosition
	 */
	_cleanupContainer(pPosition)
	{
		let tmpContainer = this._containers[pPosition];
		if (tmpContainer && tmpContainer.children.length === 0)
		{
			if (tmpContainer.parentNode)
			{
				tmpContainer.parentNode.removeChild(tmpContainer);
			}
			delete this._containers[pPosition];
		}
	}

	/**
	 * Dismiss all active toasts.
	 */
	dismissAll()
	{
		let tmpToasts = this._modal._activeToasts.slice();
		for (let i = 0; i < tmpToasts.length; i++)
		{
			tmpToasts[i].dismiss();
		}
	}

	/**
	 * Destroy all containers.
	 */
	destroy()
	{
		this.dismissAll();
		let tmpPositions = Object.keys(this._containers);
		for (let i = 0; i < tmpPositions.length; i++)
		{
			let tmpContainer = this._containers[tmpPositions[i]];
			if (tmpContainer && tmpContainer.parentNode)
			{
				tmpContainer.parentNode.removeChild(tmpContainer);
			}
		}
		this._containers = {};
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

module.exports = PictModalToast;
