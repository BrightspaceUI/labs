
import '@brightspace-ui/core/components/button/button-icon.js';

import { drawerFooterStyles, drawerHeaderStyles, drawerStyles } from './drawer-styles.js';
import { html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { DrawerMixin } from './drawer-mixin.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeLabsElement } from '../../../helpers/localizeLabsElement.js';

const mediaQueryList = window.matchMedia('(max-width: 615px), (max-height: 420px) and (max-width: 900px)');

/**
 * Modal element that is anchored to one side of the viewport or parent element.
 * @fires d2l-drawer-before-close - Dispatched with bound action value before the dialog is closed for any reason, providing an opportunity to prevent the closing.
 * @slot - Default slot for content inside drawer
 * @slot footer - Slot for footer content such as workflow buttons. Apply attribute `drawer-close` to workflow buttons to have them automatically close the drawer with the action's bound `value`.
 */
class Drawer extends LocalizeLabsElement(DrawerMixin(LitElement)) {

	static get properties() {
		return {
			/**
             * Aria label for default provided close button
             */
			closeButtonLabel: { type: String, attribute: 'close-button-label' },
			/**
             * Enables scroll locking of parent content if true
             */
			lockScroll: { type: Boolean, attribute: 'lock-scroll', reflect: true },
			/**
             * Can use predefined values (xsmall, small, medium, large, xlarge,
			 * full) or set drawer body size with any px or % values
             * Controls width for left and right positions and height for top and bottom.
             */
			size: { type: String },
			/**
             * Trap user focus if true
             */
			trapFocus: { type: Boolean, reflect: true, attribute: 'trap-focus' },
			/**
             * Hides close button if true, can still be closed via escape key or clicking out
             */
			hideCloseButton: { type: Boolean, attribute: 'hide-close-button' },
			/**
             * Hides header if true
             */
			hideHeader: { type: Boolean, attribute: 'hide-header' },
			_hasFooterContent: { type: Boolean, attribute: false },
		};
	}

	static get styles() {
		return [ drawerStyles, drawerHeaderStyles, drawerFooterStyles, heading3Styles ];
	}

	constructor() {
		super();
		this.hideCloseButton = false;
		this.hideHeader = false;
		this.lockScroll = true;
		this.size = 'medium';
		this.trapFocus = true;
		this._hasFooterContent = false;
		this._handleResize = this._handleResize.bind(this);
		this._labelId = undefined;
		this._textId = undefined;
	}

	get closeButton() {
		return !this.hideCloseButton
			? html`
                <d2l-button-icon
                    id="drawer-default-close"
                    icon="tier1:close-small"
                    text="${this.localize('components.drawer.close')}"
                    @click=${this._abort}
                    tabindex=100>
                </d2l-button-icon>`
			: nothing;
	}
	get content() {
		if (!this._textId && this.describeContent) this._textId = getUniqueId();

		return html`
            <div id=${ifDefined(this._textId)}>
                <slot></slot>
            </div>`;
	}
	get header() {
		if (!this._labelId) this._labelId = getUniqueId();

		return !this.hideHeader
			? html`
                <div class="d2l-drawer-header">
                    <div>
                        <h2 id=${this._labelId} class="d2l-heading-3">${this.label}</h2>
                        ${this.closeButton}
                    </div>
                </div>`
			: nothing;
	}

	connectedCallback() {
		super.connectedCallback();
		if (mediaQueryList.addEventListener) mediaQueryList.addEventListener('change', this._handleResize);
	}

	disconnectedCallback() {
		if (mediaQueryList.removeEventListener) mediaQueryList.removeEventListener('change', this._handleResize);
		super.disconnectedCallback();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._handleResize();
	}

	render() {
		const footerClasses = {
			'd2l-drawer-footer': true,
			'd2l-footer-no-content': !this._hasFooterContent
		};

		const inner = html`
            <div class="d2l-drawer-inner">
                ${this.header}
                <div class="d2l-drawer-content">${this.content}</div>
                <div class=${classMap(footerClasses)}>
                    <slot name="footer" @slotchange=${this._handleFooterSlotChange}></slot>
                </div>
            </div>
        `;

		const descId = (this.describeContent) ? this._textId : undefined;
		return this._render(
			inner,
			{
				descId: descId,
				labelId: this._labelId,
				role: 'dialog'
			}
		);
	}

	_abort() {
		this._close('abort');
	}

	_handleFooterSlotChange(e) {
		const footerContent = e.target.assignedNodes({ flatten: true });
		this._hasFooterContent = (footerContent && footerContent.length > 0);
	}

	_handleResize() {
		this._autoSize = !mediaQueryList.matches;
		// this.resize();
	}

}
customElements.define('d2l-labs-drawer', Drawer);
