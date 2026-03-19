/**
 * Pict-Modal-Tooltip
 *
 * Manages simple text and rich HTML tooltips with positioning and auto-flip.
 */
class PictModalTooltip
{
	constructor(pModal)
	{
		this._modal = pModal;
	}

	/**
	 * Attach a simple text tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pText - Tooltip text
	 * @param {object} [pOptions] - Options (position, delay, maxWidth)
	 * @returns {{ destroy: function }} Handle to remove the tooltip
	 */
	tooltip(pElement, pText, pOptions)
	{
		let tmpOptions = Object.assign({}, this._modal.options.DefaultTooltipOptions, pOptions);
		return this._attachTooltip(pElement, pText, false, tmpOptions);
	}

	/**
	 * Attach a rich HTML tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pHTMLContent - HTML content for the tooltip
	 * @param {object} [pOptions] - Options (position, delay, maxWidth, interactive)
	 * @returns {{ destroy: function }} Handle to remove the tooltip
	 */
	richTooltip(pElement, pHTMLContent, pOptions)
	{
		let tmpOptions = Object.assign({}, this._modal.options.DefaultTooltipOptions, pOptions);
		return this._attachTooltip(pElement, pHTMLContent, true, tmpOptions);
	}

	/**
	 * Internal: attach tooltip event listeners to an element.
	 *
	 * @param {HTMLElement} pElement
	 * @param {string} pContent
	 * @param {boolean} pIsHTML
	 * @param {object} pOptions
	 * @returns {{ destroy: function }}
	 */
	_attachTooltip(pElement, pContent, pIsHTML, pOptions)
	{
		let tmpTooltipElement = null;
		let tmpShowTimeout = null;
		let tmpHideTimeout = null;
		let tmpDestroyed = false;
		let tmpId = this._modal._nextId();

		let tmpShow = () =>
		{
			if (tmpDestroyed || tmpTooltipElement)
			{
				return;
			}

			tmpTooltipElement = document.createElement('div');
			tmpTooltipElement.className = 'pict-modal-tooltip pict-modal-tooltip--' + pOptions.position;
			tmpTooltipElement.id = 'pict-modal-tooltip-' + tmpId;
			tmpTooltipElement.setAttribute('role', 'tooltip');
			tmpTooltipElement.style.maxWidth = pOptions.maxWidth;

			if (pOptions.interactive)
			{
				tmpTooltipElement.classList.add('pict-modal-tooltip-interactive');
			}

			// Arrow
			let tmpArrow = document.createElement('div');
			tmpArrow.className = 'pict-modal-tooltip-arrow';

			// Content
			let tmpContentDiv = document.createElement('div');
			if (pIsHTML)
			{
				tmpContentDiv.innerHTML = pContent;
			}
			else
			{
				tmpContentDiv.textContent = pContent;
			}

			tmpTooltipElement.appendChild(tmpArrow);
			tmpTooltipElement.appendChild(tmpContentDiv);
			document.body.appendChild(tmpTooltipElement);

			// Set aria-describedby on target
			pElement.setAttribute('aria-describedby', tmpTooltipElement.id);

			// Position
			this._positionTooltip(tmpTooltipElement, pElement, pOptions.position);

			// Animate in
			void tmpTooltipElement.offsetHeight;
			tmpTooltipElement.classList.add('pict-modal-visible');

			// Track
			this._modal._activeTooltips.push(
			{
				element: tmpTooltipElement,
				targetElement: pElement,
				destroy: tmpDestroy
			});

			// For interactive tooltips, allow hovering over the tooltip itself
			if (pOptions.interactive && tmpTooltipElement)
			{
				tmpTooltipElement.addEventListener('mouseenter', () =>
				{
					if (tmpHideTimeout)
					{
						clearTimeout(tmpHideTimeout);
						tmpHideTimeout = null;
					}
				});
				tmpTooltipElement.addEventListener('mouseleave', () =>
				{
					tmpHide();
				});
			}
		};

		let tmpHide = () =>
		{
			if (!tmpTooltipElement)
			{
				return;
			}

			tmpTooltipElement.classList.remove('pict-modal-visible');
			let tmpEl = tmpTooltipElement;
			tmpTooltipElement = null;

			// Remove aria
			pElement.removeAttribute('aria-describedby');

			// Remove from tracking
			this._modal._activeTooltips = this._modal._activeTooltips.filter(
				(pEntry) => { return pEntry.element !== tmpEl; }
			);

			setTimeout(() =>
			{
				if (tmpEl.parentNode)
				{
					tmpEl.parentNode.removeChild(tmpEl);
				}
			}, 220);
		};

		let tmpOnMouseEnter = () =>
		{
			if (tmpHideTimeout)
			{
				clearTimeout(tmpHideTimeout);
				tmpHideTimeout = null;
			}
			tmpShowTimeout = setTimeout(tmpShow, pOptions.delay);
		};

		let tmpOnMouseLeave = () =>
		{
			if (tmpShowTimeout)
			{
				clearTimeout(tmpShowTimeout);
				tmpShowTimeout = null;
			}
			// Small delay before hiding to allow moving to interactive tooltip
			if (pOptions.interactive)
			{
				tmpHideTimeout = setTimeout(tmpHide, 100);
			}
			else
			{
				tmpHide();
			}
		};

		let tmpOnFocusIn = () =>
		{
			tmpShowTimeout = setTimeout(tmpShow, pOptions.delay);
		};

		let tmpOnFocusOut = () =>
		{
			if (tmpShowTimeout)
			{
				clearTimeout(tmpShowTimeout);
				tmpShowTimeout = null;
			}
			tmpHide();
		};

		// Attach listeners
		pElement.addEventListener('mouseenter', tmpOnMouseEnter);
		pElement.addEventListener('mouseleave', tmpOnMouseLeave);
		pElement.addEventListener('focusin', tmpOnFocusIn);
		pElement.addEventListener('focusout', tmpOnFocusOut);

		let tmpDestroy = () =>
		{
			if (tmpDestroyed)
			{
				return;
			}
			tmpDestroyed = true;

			if (tmpShowTimeout)
			{
				clearTimeout(tmpShowTimeout);
			}
			if (tmpHideTimeout)
			{
				clearTimeout(tmpHideTimeout);
			}

			tmpHide();

			pElement.removeEventListener('mouseenter', tmpOnMouseEnter);
			pElement.removeEventListener('mouseleave', tmpOnMouseLeave);
			pElement.removeEventListener('focusin', tmpOnFocusIn);
			pElement.removeEventListener('focusout', tmpOnFocusOut);
		};

		return { destroy: tmpDestroy };
	}

	/**
	 * Position a tooltip element relative to the target element.
	 * Flips direction if the tooltip would overflow the viewport.
	 *
	 * @param {HTMLElement} pTooltip
	 * @param {HTMLElement} pTarget
	 * @param {string} pPosition - 'top', 'bottom', 'left', 'right'
	 */
	_positionTooltip(pTooltip, pTarget, pPosition)
	{
		let tmpTargetRect = pTarget.getBoundingClientRect();
		let tmpTooltipRect = pTooltip.getBoundingClientRect();
		let tmpGap = 8;

		let tmpPosition = pPosition;

		// Flip if needed
		if (tmpPosition === 'top' && tmpTargetRect.top < tmpTooltipRect.height + tmpGap)
		{
			tmpPosition = 'bottom';
		}
		else if (tmpPosition === 'bottom' && (window.innerHeight - tmpTargetRect.bottom) < tmpTooltipRect.height + tmpGap)
		{
			tmpPosition = 'top';
		}
		else if (tmpPosition === 'left' && tmpTargetRect.left < tmpTooltipRect.width + tmpGap)
		{
			tmpPosition = 'right';
		}
		else if (tmpPosition === 'right' && (window.innerWidth - tmpTargetRect.right) < tmpTooltipRect.width + tmpGap)
		{
			tmpPosition = 'left';
		}

		// Update class for arrow direction
		pTooltip.className = pTooltip.className.replace(/pict-modal-tooltip--\w+/, 'pict-modal-tooltip--' + tmpPosition);

		let tmpTop = 0;
		let tmpLeft = 0;

		switch (tmpPosition)
		{
			case 'top':
				tmpTop = tmpTargetRect.top - tmpTooltipRect.height - tmpGap;
				tmpLeft = tmpTargetRect.left + (tmpTargetRect.width / 2) - (tmpTooltipRect.width / 2);
				break;
			case 'bottom':
				tmpTop = tmpTargetRect.bottom + tmpGap;
				tmpLeft = tmpTargetRect.left + (tmpTargetRect.width / 2) - (tmpTooltipRect.width / 2);
				break;
			case 'left':
				tmpTop = tmpTargetRect.top + (tmpTargetRect.height / 2) - (tmpTooltipRect.height / 2);
				tmpLeft = tmpTargetRect.left - tmpTooltipRect.width - tmpGap;
				break;
			case 'right':
				tmpTop = tmpTargetRect.top + (tmpTargetRect.height / 2) - (tmpTooltipRect.height / 2);
				tmpLeft = tmpTargetRect.right + tmpGap;
				break;
		}

		// Clamp to viewport
		tmpLeft = Math.max(4, Math.min(tmpLeft, window.innerWidth - tmpTooltipRect.width - 4));
		tmpTop = Math.max(4, Math.min(tmpTop, window.innerHeight - tmpTooltipRect.height - 4));

		pTooltip.style.top = tmpTop + 'px';
		pTooltip.style.left = tmpLeft + 'px';
	}

	/**
	 * Dismiss all active tooltips.
	 */
	dismissAll()
	{
		let tmpTooltips = this._modal._activeTooltips.slice();
		for (let i = 0; i < tmpTooltips.length; i++)
		{
			tmpTooltips[i].destroy();
		}
	}
}

module.exports = PictModalTooltip;
