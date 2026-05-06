/**
 * Pict-Modal-Dropdown
 *
 * Anchor-positioned menu that behaves like a dropdown / popover. Handy for:
 *   - nav menus that hang off a header link or button
 *   - "split button" style addenda (a primary action paired with a chevron
 *     that opens a list of related/alternate actions)
 *   - any "more options" affordance where a full modal would be heavy
 *
 * Differences from the modal Window helper:
 *   - No backdrop overlay — the rest of the page stays interactive.
 *   - Positioned next to the anchor element, not centered.
 *   - Auto-flips above when there isn't room below; clamps inside the viewport.
 *   - Click outside or Escape dismisses (matches native menu conventions).
 *
 * Usage:
 *     modal.dropdown(anchorEl, {
 *         items:
 *         [
 *             { Hash: 'edit',   Label: 'Edit'                    },
 *             { Hash: 'rename', Label: 'Rename...'                },
 *             { Separator: true                                   },
 *             { Hash: 'delete', Label: 'Delete', Style: 'danger'  },
 *             { Hash: 'archive',Label: 'Archive', Disabled: true,
 *               Tooltip: 'Already archived'                       }
 *         ],
 *         align: 'left'        // 'left' | 'right' (relative to anchor)
 *     }).then((pChoice) => { ... });
 *
 * Returns a Promise that resolves with `{ Hash, Item }` on selection or
 * `null` on dismiss.
 */
class PictModalDropdown
{
	constructor(pModal)
	{
		this._modal = pModal;
		this._activeMenu = null;
	}

	/**
	 * Open a dropdown menu anchored to an element.
	 *
	 * @param {HTMLElement|string|object} pAnchor - Element, CSS selector, or
	 *   a rect-like { left, top, width, height } anchor (handy for context menus).
	 * @param {object} pOptions
	 * @param {Array}    pOptions.items     - [{ Hash, Label, Style?, Disabled?, Tooltip?, Icon?, Separator? }]
	 * @param {string}   [pOptions.align]   - 'left'|'right' (default 'left')
	 * @param {string}   [pOptions.position]- 'auto'|'below'|'above' (default 'auto')
	 * @param {string}   [pOptions.minWidth]- CSS minWidth (default: anchor width if known, else '160px')
	 * @param {string}   [pOptions.maxHeight]- CSS maxHeight (default '60vh')
	 * @param {string}   [pOptions.className]- extra class(es) for the menu element
	 * @param {boolean}  [pOptions.closeOnSelect] - default true
	 * @param {function} [pOptions.onSelect]- called with (Hash, Item) on selection
	 * @param {function} [pOptions.onClose] - called after dismiss
	 * @returns {Promise<{Hash: string, Item: object}|null>}
	 */
	dropdown(pAnchor, pOptions)
	{
		let tmpOptions = Object.assign(
			{
				align:         'left',
				position:      'auto',
				maxHeight:     '60vh',
				closeOnSelect: true,
			},
			pOptions || {});

		let tmpAnchorEl = this._resolveAnchor(pAnchor);
		let tmpAnchorRect = this._anchorRect(pAnchor, tmpAnchorEl);
		if (!tmpAnchorRect) { return Promise.resolve(null); }

		// Re-opening the same menu is a no-op; closing-then-reopening is a
		// caller decision (just call dismissDropdown() first).
		if (this._activeMenu && this._activeMenu.anchor === tmpAnchorEl)
		{
			return this._activeMenu.promise;
		}

		// Only one dropdown at a time keeps focus / keyboard handling sane.
		this.dismissAll();

		let tmpItems = Array.isArray(tmpOptions.items) ? tmpOptions.items : [];

		let tmpResolveOuter;
		let tmpPromise = new Promise((fResolve) => { tmpResolveOuter = fResolve; });

		let tmpMenu = this._buildMenu(tmpItems, tmpOptions);
		document.body.appendChild(tmpMenu);
		this._positionMenu(tmpMenu, tmpAnchorRect, tmpOptions);

		// Animate in on the next frame.
		void tmpMenu.offsetHeight;
		tmpMenu.classList.add('pict-modal-visible');

		let tmpDismiss = (pResult) =>
		{
			if (tmpMenu._dismissed) { return; }
			tmpMenu._dismissed = true;
			document.removeEventListener('mousedown', tmpOutsideHandler, true);
			document.removeEventListener('keydown', tmpKeyHandler, true);
			window.removeEventListener('resize', tmpRepositionHandler);
			window.removeEventListener('scroll', tmpRepositionHandler, true);
			tmpMenu.classList.remove('pict-modal-visible');
			setTimeout(() =>
				{
					if (tmpMenu.parentNode) { tmpMenu.parentNode.removeChild(tmpMenu); }
				}, 180);
			if (this._activeMenu && this._activeMenu.element === tmpMenu) { this._activeMenu = null; }
			if (typeof tmpOptions.onClose === 'function') { tmpOptions.onClose(pResult); }
			tmpResolveOuter(pResult);
		};

		// Wire item clicks (each item element carries a data-hash; separators
		// and disabled items are skipped).
		let tmpItemEls = tmpMenu.querySelectorAll('[data-pict-modal-dropdown-item]');
		for (let i = 0; i < tmpItemEls.length; i++)
		{
			let tmpEl = tmpItemEls[i];
			tmpEl.addEventListener('click', (pEvent) =>
				{
					if (tmpEl.hasAttribute('data-disabled')) { return; }
					pEvent.stopPropagation();
					let tmpIdx = parseInt(tmpEl.getAttribute('data-index'), 10);
					let tmpItem = tmpItems[tmpIdx];
					let tmpHash = tmpEl.getAttribute('data-hash');
					if (typeof tmpOptions.onSelect === 'function')
					{
						tmpOptions.onSelect(tmpHash, tmpItem);
					}
					if (tmpOptions.closeOnSelect !== false) { tmpDismiss({ Hash: tmpHash, Item: tmpItem }); }
				});
		}

		// Click anywhere outside the menu (and outside the anchor) → dismiss.
		// Use mousedown/capture so we beat any per-element click handlers.
		let tmpOutsideHandler = (pEvent) =>
		{
			if (tmpMenu.contains(pEvent.target)) { return; }
			if (tmpAnchorEl && tmpAnchorEl.contains && tmpAnchorEl.contains(pEvent.target)) { return; }
			tmpDismiss(null);
		};
		document.addEventListener('mousedown', tmpOutsideHandler, true);

		// Esc dismisses; arrow keys navigate items (skipping disabled/separator).
		let tmpKeyHandler = (pEvent) =>
		{
			if (pEvent.key === 'Escape') { pEvent.stopPropagation(); tmpDismiss(null); return; }
			if (pEvent.key === 'ArrowDown' || pEvent.key === 'ArrowUp')
			{
				pEvent.preventDefault();
				this._focusNeighbor(tmpMenu, pEvent.key === 'ArrowDown' ? 1 : -1);
			}
			else if (pEvent.key === 'Enter' || pEvent.key === ' ')
			{
				let tmpFocused = document.activeElement;
				if (tmpFocused && tmpMenu.contains(tmpFocused) && tmpFocused.hasAttribute('data-pict-modal-dropdown-item'))
				{
					pEvent.preventDefault();
					tmpFocused.click();
				}
			}
		};
		document.addEventListener('keydown', tmpKeyHandler, true);

		// Reposition on viewport resize / scroll so the menu doesn't drift
		// off the anchor.
		let tmpRepositionHandler = () =>
		{
			let tmpRect = this._anchorRect(pAnchor, tmpAnchorEl);
			if (tmpRect) { this._positionMenu(tmpMenu, tmpRect, tmpOptions); }
		};
		window.addEventListener('resize', tmpRepositionHandler);
		window.addEventListener('scroll', tmpRepositionHandler, true);

		// Move keyboard focus to the first enabled item so arrows / Enter work
		// without an extra click.
		setTimeout(() => { this._focusFirstEnabled(tmpMenu); }, 0);

		this._activeMenu = { element: tmpMenu, anchor: tmpAnchorEl, promise: tmpPromise, dismiss: tmpDismiss };

		return tmpPromise;
	}

	/**
	 * Dismiss the currently-open dropdown (if any).
	 */
	dismissAll()
	{
		if (this._activeMenu)
		{
			let tmpDismiss = this._activeMenu.dismiss;
			this._activeMenu = null;
			tmpDismiss(null);
		}
	}

	// ─────────────────────────────────────────────
	//  Internals
	// ─────────────────────────────────────────────

	_resolveAnchor(pAnchor)
	{
		if (!pAnchor) { return null; }
		if (typeof pAnchor === 'string') { return document.querySelector(pAnchor); }
		if (pAnchor.nodeType === 1) { return pAnchor; }
		// rect-like — no element to attach focus / outside-click ignore to,
		// but that's fine, the caller knows what they're doing.
		return null;
	}

	_anchorRect(pAnchor, pAnchorEl)
	{
		if (pAnchorEl && typeof pAnchorEl.getBoundingClientRect === 'function')
		{
			return pAnchorEl.getBoundingClientRect();
		}
		if (pAnchor && typeof pAnchor === 'object'
			&& typeof pAnchor.left === 'number' && typeof pAnchor.top === 'number')
		{
			return {
				left:   pAnchor.left,
				top:    pAnchor.top,
				width:  pAnchor.width  || 0,
				height: pAnchor.height || 0,
				right:  pAnchor.left + (pAnchor.width  || 0),
				bottom: pAnchor.top  + (pAnchor.height || 0),
			};
		}
		return null;
	}

	_buildMenu(pItems, pOptions)
	{
		let tmpId = this._modal._nextId();
		let tmpMenu = document.createElement('div');
		tmpMenu.className = 'pict-modal-dropdown';
		if (pOptions.className) { tmpMenu.className += ' ' + pOptions.className; }
		tmpMenu.id = 'pict-modal-dropdown-' + tmpId;
		tmpMenu.setAttribute('role', 'menu');
		tmpMenu.style.maxHeight = pOptions.maxHeight;

		let tmpHtml = '';
		for (let i = 0; i < pItems.length; i++)
		{
			let tmpItem = pItems[i];
			if (tmpItem.Separator)
			{
				tmpHtml += '<div class="pict-modal-dropdown-separator" role="separator"></div>';
				continue;
			}
			if (tmpItem.Header)
			{
				tmpHtml += '<div class="pict-modal-dropdown-header">'
					+ this._escapeHTML(tmpItem.Header) + '</div>';
				continue;
			}
			let tmpCls = 'pict-modal-dropdown-item';
			if (tmpItem.Style)    { tmpCls += ' pict-modal-dropdown-item--' + tmpItem.Style; }
			if (tmpItem.Disabled) { tmpCls += ' pict-modal-dropdown-item--disabled'; }
			let tmpAttrs = ''
				+ ' data-pict-modal-dropdown-item'
				+ ' data-index="' + i + '"'
				+ ' data-hash="'  + this._escapeHTML(tmpItem.Hash || '') + '"'
				+ ' role="menuitem"'
				+ ' tabindex="-1"';
			if (tmpItem.Disabled) { tmpAttrs += ' aria-disabled="true" data-disabled'; }
			if (tmpItem.Tooltip)  { tmpAttrs += ' title="' + this._escapeHTML(tmpItem.Tooltip) + '"'; }
			let tmpIcon = tmpItem.Icon ? '<span class="pict-modal-dropdown-item-icon">' + tmpItem.Icon + '</span>' : '';
			let tmpHint = tmpItem.Hint ? '<span class="pict-modal-dropdown-item-hint">' + this._escapeHTML(tmpItem.Hint) + '</span>' : '';
			tmpHtml += '<div class="' + tmpCls + '"' + tmpAttrs + '>'
				+ tmpIcon
				+ '<span class="pict-modal-dropdown-item-label">' + this._escapeHTML(tmpItem.Label || '') + '</span>'
				+ tmpHint
				+ '</div>';
		}

		tmpMenu.innerHTML = tmpHtml;
		return tmpMenu;
	}

	_positionMenu(pMenu, pAnchorRect, pOptions)
	{
		// Apply min-width before measuring so the menu's natural size accounts
		// for the constraint.
		let tmpMinWidth = pOptions.minWidth
			|| (pAnchorRect.width >= 80 ? Math.ceil(pAnchorRect.width) + 'px' : '160px');
		pMenu.style.minWidth = tmpMinWidth;

		// Measure after attaching.
		let tmpMenuRect = pMenu.getBoundingClientRect();
		let tmpVw = window.innerWidth || document.documentElement.clientWidth;
		let tmpVh = window.innerHeight || document.documentElement.clientHeight;
		let tmpGap = 4; // breathing room between anchor and menu

		// Vertical: prefer below; flip above when not enough room and there's
		// more above. 'below'/'above' overrides force the side.
		let tmpRoomBelow = tmpVh - pAnchorRect.bottom - tmpGap;
		let tmpRoomAbove = pAnchorRect.top - tmpGap;
		let tmpPlaceAbove;
		if      (pOptions.position === 'above') { tmpPlaceAbove = true; }
		else if (pOptions.position === 'below') { tmpPlaceAbove = false; }
		else { tmpPlaceAbove = (tmpMenuRect.height > tmpRoomBelow) && (tmpRoomAbove > tmpRoomBelow); }

		// Cap height to whichever side we landed on so the menu can scroll
		// internally instead of running off the screen.
		let tmpCap = Math.max(80, (tmpPlaceAbove ? tmpRoomAbove : tmpRoomBelow) - 8);
		pMenu.style.maxHeight = tmpCap + 'px';

		// Horizontal alignment to the anchor, then clamp inside the viewport.
		let tmpLeft;
		if (pOptions.align === 'right')
		{
			tmpLeft = pAnchorRect.right - tmpMenuRect.width;
		}
		else if (pOptions.align === 'center')
		{
			tmpLeft = pAnchorRect.left + (pAnchorRect.width - tmpMenuRect.width) / 2;
		}
		else
		{
			tmpLeft = pAnchorRect.left;
		}
		tmpLeft = Math.min(tmpLeft, tmpVw - tmpMenuRect.width - 4);
		tmpLeft = Math.max(4, tmpLeft);

		let tmpTop;
		if (tmpPlaceAbove)
		{
			tmpTop = Math.max(4, pAnchorRect.top - tmpMenuRect.height - tmpGap);
			pMenu.classList.add('pict-modal-dropdown--above');
		}
		else
		{
			tmpTop = pAnchorRect.bottom + tmpGap;
			pMenu.classList.remove('pict-modal-dropdown--above');
		}

		pMenu.style.left = Math.round(tmpLeft) + 'px';
		pMenu.style.top  = Math.round(tmpTop)  + 'px';
	}

	_focusFirstEnabled(pMenu)
	{
		let tmpItems = pMenu.querySelectorAll('[data-pict-modal-dropdown-item]:not([data-disabled])');
		if (tmpItems.length) { tmpItems[0].focus(); }
	}

	_focusNeighbor(pMenu, pDirection)
	{
		let tmpItems = Array.prototype.slice.call(
			pMenu.querySelectorAll('[data-pict-modal-dropdown-item]:not([data-disabled])'));
		if (!tmpItems.length) { return; }
		let tmpActive = document.activeElement;
		let tmpIdx = tmpItems.indexOf(tmpActive);
		let tmpNext = (tmpIdx === -1)
			? (pDirection > 0 ? 0 : tmpItems.length - 1)
			: (tmpIdx + pDirection + tmpItems.length) % tmpItems.length;
		tmpItems[tmpNext].focus();
	}

	_escapeHTML(pText)
	{
		if (typeof pText !== 'string') { return ''; }
		return pText
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}
}

module.exports = PictModalDropdown;
