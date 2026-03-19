/**
 * Pict-Modal-Overlay
 *
 * Manages a shared backdrop overlay element appended to document.body.
 * Reference-counted — created on first modal open, removed when last closes.
 */
class PictModalOverlay
{
	constructor(pModal)
	{
		this._modal = pModal;
		this._element = null;
		this._refCount = 0;
	}

	/**
	 * Show the overlay (incrementing reference count).
	 * Creates the DOM element on first call.
	 *
	 * @param {function} [fOnClick] - Optional click handler (e.g. dismiss topmost modal)
	 */
	show(fOnClick)
	{
		this._refCount++;

		if (!this._element)
		{
			this._element = document.createElement('div');
			this._element.className = 'pict-modal-overlay';
			document.body.appendChild(this._element);

			// Force reflow so the transition animates
			void this._element.offsetHeight;
			this._element.classList.add('pict-modal-visible');
		}

		if (fOnClick)
		{
			// Store the latest click handler (for the topmost modal)
			this._currentClickHandler = fOnClick;
			this._element.onclick = (pEvent) =>
			{
				if (pEvent.target === this._element && this._currentClickHandler)
				{
					this._currentClickHandler();
				}
			};
		}
	}

	/**
	 * Update the overlay click handler (e.g. when topmost modal changes).
	 *
	 * @param {function} [fOnClick] - New click handler
	 */
	updateClickHandler(fOnClick)
	{
		this._currentClickHandler = fOnClick || null;
	}

	/**
	 * Hide the overlay (decrementing reference count).
	 * Removes the DOM element when reference count reaches zero.
	 */
	hide()
	{
		this._refCount--;

		if (this._refCount <= 0)
		{
			this._refCount = 0;
			if (this._element)
			{
				this._element.classList.remove('pict-modal-visible');
				let tmpElement = this._element;
				// Remove after transition
				setTimeout(() =>
				{
					if (tmpElement.parentNode)
					{
						tmpElement.parentNode.removeChild(tmpElement);
					}
				}, 220);
				this._element = null;
				this._currentClickHandler = null;
			}
		}
	}

	/**
	 * Force-remove the overlay regardless of reference count.
	 */
	destroy()
	{
		this._refCount = 0;
		if (this._element && this._element.parentNode)
		{
			this._element.parentNode.removeChild(this._element);
		}
		this._element = null;
		this._currentClickHandler = null;
	}
}

module.exports = PictModalOverlay;
