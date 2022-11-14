import '@brightspace-ui/core/components/focus-trap/focus-trap.js';
import '@brightspace-ui/core/helpers/viewport-size.js';
import { allowBodyScroll, preventBodyScroll } from '@brightspace-ui/core/components/backdrop/backdrop.js';
import { clearDismissible, setDismissible } from '@brightspace-ui/core/helpers/dismissible.js';
import { findComposedAncestor, isComposedAncestor } from '@brightspace-ui/core/helpers/dom.js';
import { forceFocusVisible, getComposedActiveElement, getNextFocusable, tryApplyFocus } from '@brightspace-ui/core/helpers/focus.js';
import { classMap } from 'lit/directives/class-map.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

window.D2L = window.D2L || {};
window.D2L.DrawerMixin = window.D2L.DrawerMixin || {};

const abortAction = 'abort';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const presetSizes = { 'xs': 150, 'sm': 200, 'md': 300, 'lg': 400, 'xl': 500 };

/**
 * @fires d2l-drawer-close
 * @fires d2l-drawer-open
 */
export const DrawerMixin = superclass => class extends RtlMixin(superclass) {

	static get properties() {
		return {
			/**
             * Aria label for drawer component
             */
			label: { type: String },
			/**
             * Whether or not the drawer is open (true if drawer is open)
             */
			open: { type: Boolean, reflect: true },
			/**
             * Drawer body positiong (top, right, bottom, left)
             */
			position: { type: String, reflect: true },
			_closeAborted: { type: Boolean }, // Still working on how to animate - may not need
			_nestedShowing: { type: Boolean },
			_overflowBottom: { type: Boolean },
			_overflowTop: { type: Boolean },
			_parentDrawer: { type: Object },
			_scroll: { type: Boolean },
			_state: { type: String, reflect: true },
		};
	}

	constructor() {
		super();
		this.label = 'Drawer';
		this.open = false;
		this.position = 'right';
		this._closeAborted = false;
		this._drawerId = getUniqueId();
		this._nestedShowing = false;
		this._overflowBottom = false;
		this._overflowTop = false;
		this._parentDrawer = null;
		this._scroll = false;
		this._state = null;
		this._updateSize = this._updateSize.bind(this);
		this._updateOverflow = this._updateOverflow.bind(this);
	}

	async updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('open')) return;

		if (this.open) {
			this._open();
		} else {
			this._close();
		}
	}

	close() {
		if (!this.open) return;
		this.open = false;
		return new Promise(resolve => {
			setTimeout(async() => {
				await this._close();
				resolve();
			}, 0);
		});
	}

	resize() {
		return new Promise(resolve => {
			setTimeout(async() => {
				await this._updateSize();
				resolve();
			}, 0);
		});
	}

	show() {
		if (this.open) return;
		this.open = true;
		return new Promise((resolve) => {
			const onClose = function(e) {
				if (e.target !== this) return; // ignore if bubbling from child drawer
				this.removeEventListener('d2l-drawer-close', onClose);
				resolve(e.detail.action);
			}.bind(this);
			this.addEventListener('d2l-drawer-close', onClose);
		});
	}

	get _height() {
		if (!this.shadowRoot) return null;

		let availableHeight = window.innerHeight;

		if (this.position === 'left' || this.position === 'right') {
			return `${availableHeight}px`;
		}

		const parentRect = this._parentDrawer?.getBoundingClientRect();

		if (parentRect) {
			availableHeight -= Math.ceil(parentRect.height);
		}

		let preferredHeight = 0;

		if (this.size in presetSizes) {
			preferredHeight = presetSizes[this.size];
		} else if (this.size === 'full') {
			preferredHeight = window.innerHeight;
		} else if (this.size.includes('%')) {
			const preferredPercent = parseInt(this.size.split('%')[0]) / 100;
			preferredHeight = Math.ceil(availableHeight * preferredPercent);
		} else if (this.size.includes('px')) {
			preferredHeight = parseInt(this.size.split('px')[0]);
		}

		return `${Math.min(preferredHeight, availableHeight)}px`;
	}
	// TODO: Make this truly unitless? Currently forces px or % on custom selections
	get _width() {
		if (!this.shadowRoot) return null;

		let availableWidth = window.innerWidth;

		if (this.position === 'top' || this.position === 'bottom') {
			return `${availableWidth}px`;
		}

		const parentRect = this._parentDrawer?.getBoundingClientRect();

		if (parentRect) {
			availableWidth -= Math.ceil(parentRect.width);
		}

		let preferredWidth = 0;

		if (this.size in presetSizes) {
			preferredWidth = presetSizes[this.size];
		} else if (this.size === 'full') {
			preferredWidth = window.innerWidth; // Debatable if should just override parent or not
		} else if (this.size.includes('%')) {
			const preferredPercent = parseInt(this.size.split('%')[0]);
			preferredWidth = Math.ceil(availableWidth * preferredPercent / 100);
		} else if (this.size.includes('px')) {
			preferredWidth = parseInt(this.size.split('px')[0]);
		}

		return `${Math.min(preferredWidth, availableWidth)}px`;
	}
	_addHandlers() {
		window.addEventListener('resize', this._updateSize);
		if (this.shadowRoot) this.shadowRoot.querySelector('.d2l-drawer-content').addEventListener('scroll', this._updateOverflow);
	}

	_close(action) {
		if (!this._state) return;
		this._action = action;

		clearDismissible(this._dismissibleId);
		this._dismissibleId = null;

		if (!this.shadowRoot) return;
		const drawer = this.shadowRoot.querySelector('.d2l-drawer-outer');

		const doClose = () => {
			this._handleClose();
		};

		if (this._isCloseAborted()) {
			this._closeAborted = true;
			// TODO: need to resolve how to run abort animation correctly
			// as currently written, will run both the pulse AND open animations
			// TODO: once properly implimented need to also run for 'prefer-reduced-motion'
			// Don't actually need 'useAbortPulse', it's just here to prevent from showing right now
			if (this._useAbortPulse) {
				new Promise((resolve) => {
					const animationEnd = () => {
						drawer.removeEventListener('animationend', animationEnd);
						drawer.style.animation = '';
						resolve();
					};
					drawer.addEventListener('animationend', animationEnd);
					drawer.style.animation = 'var(--d2l-drawer-pulse-animation) 400ms ease-in';
				});
			}

			this._dismissibleId = setDismissible(() => this._close(abortAction));
			return;
		}

		this._scroll = false;
		if (!reduceMotion) {
			const animationEnd = () => {
				drawer.removeEventListener('animationend', animationEnd);
				doClose();
			};
			drawer.addEventListener('animationend', animationEnd);
			this._state = 'hiding';
		} else {
			this._state = 'hiding';
			doClose();
		}
	}

	_focusFirstChild() {
		if (!this.shadowRoot) return;
		const content = this.shadowRoot.querySelector('.d2l-drawer-content');
		if (content) {
			const firstFocusable = getNextFocusable(content);
			if (isComposedAncestor(this.shadowRoot.querySelector('.d2l-drawer-inner'), firstFocusable)) {
				forceFocusVisible(firstFocusable);
				return;
			}
		}

		const focusTrap = this.shadowRoot.querySelector('d2l-focus-trap');
		if (focusTrap) {
			focusTrap.focus();
			return;
		}

		const footer = this.shadowRoot.querySelector('.d2l-drawer-footer');
		if (footer) {
			const firstFocusable = getNextFocusable(footer);
			if (firstFocusable) forceFocusVisible(firstFocusable);
		}
	}

	async _focusOpener() {
		if (this._opener && this._opener.focus) {
			// wait for inactive focus trap
			requestAnimationFrame(() => {
				tryApplyFocus(this._opener);
				this._opener = null;
			});
		}
	}

	// Will likely need to swap logic for top/bottom to be more like how dialog works
	// Where there is protected space for footer slot, and height is based on contents.
	// But for the time being lets go with this...it may be better to be opinionated here.
	//
	// const availableHeight = this._ifrauContextInfo
	//   ? this._ifrauContextInfo.availableHeight

	// TODO: Account for parent + child being larger than the available area
	// Could also collapse parent drawer to "minimum" state??
	// if (value > availableWidth) {
	//   This isn't really where this logic should live - it's more, of a `getEndPrimary` calculation
	//     Logic is more like (value + primarySize) > availableWidth --> Trigger reduction
	//   It does need to be done somewhere around here though if we're going to use getStart for css locating...
	//   This likely means that we need a resize method on drawers so that children can request collapsing
	//   TACKLE THIS AT SOME OTHER POINT!!!
	//   Maybe just need to auto collapse parents always to some generic amount???
	//   await - PARENT COLLAPSE SEQUENCE

	//   const collapseParentWidth = this._parentDrawer?.getBoundingClientRect().width;
	_getPositionBounds() {
		if (!this.shadowRoot) return;

		const position = `_${  this.position}`;
		let value = 0;

		const parentRect = this._parentDrawer?.getBoundingClientRect();

		if (this.position === 'left' || this.position === 'right') {
			value = !parentRect
				? 0
				: Math.ceil(parentRect.width);
			this._top = 0;
		} else if (this.position === 'top' || this.position === 'bottom') {
			value = !parentRect
				? 0
				: Math.ceil(parentRect.height);
			this._right = 0; // this is hack, likely just need css updated to properly expand to width/height
		}

		this[position] = value === 0 ? 0 : `${value}px`;
	}

	_handleBackdropClick() {
		// if(!this._allowBackdropExit) return;
		// ^ Unsure if this is a desirable trait - likely only need abort logic
		this._close(abortAction);
	}
	_handleClick(e) {
		// handle "dialog-action" for backwards-compatibility
		if (!e.target.hasAttribute('data-dialog-action') && !e.target.hasAttribute('dialog-action')) return;
		const action = e.target.getAttribute('data-dialog-action') || e.target.getAttribute('dialog-action');
		e.stopPropagation();
		this._close(action);
	}

	_handleClose() {
		/* reset state if native dialog closes unexpectedly. ex. user highlights
        text and then hits escape key - this is not caught by our key handler */
		this._removeHandlers();
		this._focusOpener();
		this._state = null;
		this.open = false;
		allowBodyScroll(this._bodyScrollKey);
		this._bodyScrollKey = null;
		if (this._action === undefined || this._action === null) this._action = abortAction;
		/** Dispatched with the bound action value when the drawer is closed for any reason */
		this.dispatchEvent(new CustomEvent(
			'd2l-drawer-close', {
				bubbles: true,
				composed: true,
				detail: { action: this._action }
			}
		));
	}

	_handleDrawerClose(e) {
		this._nestedShowing = false;
		e.stopPropagation();
	}

	_handleDrawerOpen(e) {
		this._nestedShowing = true;
		e.stopPropagation();
	}

	_handleFocusTrapEnter(e) {
		// ignore focus trap events when the target is another element
		// to prevent infinite focus loops
		if (e.target !== this) return;
		this._focusFirstChild();
	}

	_handleKeyDown(e) {
		if (!this.open) return;
		if (e.keyCode === 27) {
			// escape (note: prevent native close so we can animate it; use setDismissible)
			e.preventDefault();
		}
	}

	_isCloseAborted() {
		const abortEvent = new CustomEvent('d2l-drawer-before-close', {
			cancelable: true,
			detail: {
				action: this._action,
				closeDrawer: this._close.bind(this, this._action)
			}
		});
		this.dispatchEvent(abortEvent);

		return abortEvent.defaultPrevented;
	}

	_open() {
		this._opener = getComposedActiveElement();
		this._dismissibleId = setDismissible(() => {
			this._close(abortAction);
		});

		this._action = undefined;
		this._addHandlers();

		if (!this.shadowRoot) return;
		const drawer = this.shadowRoot.querySelector('.d2l-drawer-outer');

		const animationPromise = new Promise((resolve) => {
			const animationEnd = () => {
				drawer.removeEventListener('animationend', animationEnd);
				resolve();
			};
			drawer.addEventListener('animationend', animationEnd);
		});

		this._parentDrawer = findComposedAncestor(this, (node) => {
			return node.classList && node.classList.contains('d2l-drawer-outer');
		});

		// TODO: Base this functionality off of scolllock property
		this._bodyScrollKey = preventBodyScroll();

		this._focusFirstChild();

		setTimeout(async() => {

			this.shadowRoot.querySelector('.d2l-drawer-content').scrollTop = 0;
			// scrollbar is kept hidden while we update the scroll position to avoid scrollbar flash
			setTimeout(() => {
				this._scroll = true;
			}, 0);

			// TODO: Skipping update size for now, must revisit!
			await this._updateSize();
			this._state = 'showing';
			await this._updateComplete;

			// edge case: no children were focused, try again after one redraw
			const activeElement = getComposedActiveElement();
			if (!activeElement
            || !isComposedAncestor(drawer, activeElement)
            || !activeElement.classList.contains('focus-visible')) {
				this._focusFirstChild();
			}

			if (!reduceMotion) await animationPromise;
			/** Dispatched when the drawer is opened */
			this.dispatchEvent(new CustomEvent(
				'd2l-drawer-open', { bubbles: true, composed: true }
			));
		}, 0);

	}

	_removeHandlers() {
		window.removeEventListener('resize', this._updateSize);
		if (this.shadowRoot) this.shadowRoot.querySelector('.d2l-drawer-content').removeEventListener('scroll', this._updateOverflow);
	}

	_render(inner, info) {
		// ignored all style stuff from prev --> styles.top, etc.
		// ignoring iframe stuff for now
		const closeAnimation = `d2l-drawer-close-${this.position}`;
		const openAnimation = `d2l-drawer-open-${this.position}`;

		const styles = {
			'--d2l-drawer-close-animation': closeAnimation,
			'--d2l-drawer-open-animation': openAnimation,
		};

		if (this._height) styles.height = `${this._height}`;
		if (this._width) styles.width = `${this._width}`;
		if (this._top !== undefined) styles.top = `${this._top}`;
		if (this._bottom !== undefined) styles.bottom = `${this._bottom}`;
		if (this._right !== undefined) styles.right = `${this._right}`;
		if (this._left !== undefined) styles.left = `${this._left}`;

		const drawerOuterClasses = {
			'd2l-drawer-outer': true,
			'd2l-drawer-outer-nested': this._parentDrawer,
			'd2l-drawer-outer-nested-showing': this._nestedShowing,
			'd2l-drawer-outer-scroll': this._scroll,
			'd2l-drawer-fullscreen': this._size === 'full',
		};

		// TODO: Play with no focus-trap + no backdrop
		return html`
            <div
                aria-describedby=${ifDefined(info.descId)}
                aria-labelledby=${info.labelId}
                class=${classMap(drawerOuterClasses)}
                @click=${this._handleClick}
                @d2l-drawer-close=${this._handleDrawerClose}
                @d2l-drawer-open=${this._handleDrawerOpen}
                id=${this._drawerId}
                role=${info.role}
                style=${styleMap(styles)}>
                <d2l-focus-trap
                    @d2l-focus-trap-enter=${this._handleFocusTrapEnter}
                    ?trap=${this.open && this.trapFocus}>
                    ${inner}
                </d2l-focus-trap>
            </div>
            <d2l-backdrop
                for-target=${this._drawerId}
                ?shown=${this._state === 'showing'}
                @click=${this._handleBackdropClick}
                tabindex="-1">
            </d2l-backdrop>`;
	}

	_updateOverflow() {
		if (!this.shadowRoot) return;
		const content = this.shadowRoot.querySelector('.d2l-drawer-content');
		this._overflowTop = (content.scrollTop > 0);
		this._overflowBottom = (content.scrollHeight > content.scrollTop + content.clientHeight);
	}

	async _updateSize() {
		this._getPositionBounds();
		await this.updateComplete;
		await new Promise(resolve => {
			requestAnimationFrame(async() => {
				this._updateOverflow();
				await this.updateComplete;
				resolve();
			});
		});
	}
};
