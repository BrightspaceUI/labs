import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/html-block/html-block.js';
import './opt-out-dialog.js';
import { bodyStandardStyles, heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { composeMixins } from '@brightspace-ui/core/helpers/composeMixins.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

const VISIBLE_STATES = Object.freeze({
	opened: 'OPENED',
	opening: 'OPENING',
	closed: 'CLOSED',
	closing: 'CLOSING'
});

class FlyoutImplementation extends composeMixins(
	LitElement,
	LocalizeLabsElement,
	RtlMixin
) {

	static get properties() {
		return {
			optOut: { type: Boolean, attribute: 'opt-out' },
			open: { type: Boolean, reflect: true },
			title: { type: String },
			shortDescription: { type: String, attribute: 'short-description' },
			longDescription: { type: String, attribute: 'long-description' },
			tabPosition: { type: String, attribute: 'tab-position' },
			noTransform: { type: Boolean, attribute: 'no-transform' },
			tutorialLink: { type: String, attribute: 'tutorial-link' },
			helpDocsLink: { type: String, attribute: 'help-docs-link' },
			hideReason: { type: Boolean, attribute: 'hide-reason' },
			hideFeedback: { type: Boolean, attribute: 'hide-feedback' },
			_optOutDialogOpen: { state: true },
			_primaryButtonText: { state: true },
			_secondaryButtonText: { state: true },
			_visibleState: { state: true },
			_ariaLabel: { state: true },
			_tabIndex: { state: true }
		};
	}

	static get styles() {
		return [
			bodyStandardStyles,
			heading1Styles,
			css`
				:host {
					height: 100%;
					overflow: hidden;
					pointer-events: none;
					position: absolute;
					width: 100%;
				}

				#flyout {
					background-color: white;
					border-bottom: 1px solid var(--d2l-color-mica);
					box-sizing: border-box;
					overflow: visible;
					padding-bottom: 2rem;
					pointer-events: auto;
					position: var(--d2l-flyout-custom-element-position, absolute);
					top: var(--d2l-flyout-custom-element-top, 0);
					width: 100%;
					z-index: var(--d2l-flyout-custom-element-z-index, 900);
				}

				#flyout.flyout-opened {
					transition: transform 0.2s ease-out;
				}

				#flyout.flyout-closed {
					transition: transform 0.2s ease-in;
				}

				.flyout-opened {
					transform: translateY(0);
				}
				.flyout-closed {
					transform: translateY(-100%);
				}

				.flyout-content {
					text-align: center;
				}

				.flyout-content h1 {
					margin-bottom: 1.2rem;
				}

				.flyout-text {
					align-items: center;
					display: flex;
					flex-direction: column;
					margin-bottom: 1.5rem;
				}

				#short-description {
					margin-bottom: 0.5rem;
				}

				#long-description {
					max-width: 800px;
				}

				.flyout-tutorial {
					margin: auto;
					margin-top: 0.5em;
				}

				.flyout-tutorial a {
					color: var(--d2l-color-celestine);
					text-decoration: none;
				}

				.flyout-tutorial a:hover, .flyout-tutorial a:focus {
					text-decoration: underline;
				}

				.flyout-buttons {
					margin-left: auto;
					margin-right: auto;
				}

				.flyout-buttons d2l-button {
					margin-left: 0.5rem;
					margin-right: 0.5rem;
				}

				.flyout-tab-container {
					height: 1.2rem;
					left: 50%;
					max-width: 1230px;
					overflow: hidden;
					pointer-events: none;
					position: absolute;
					top: 100%;
					transform: translateX(-50%);
					width: 100%;
				}

				.flyout-tab {
					background-color: white;
					border: 1px solid var(--d2l-color-mica);
					border-radius: 0 0 8px 8px;
					border-top: none;
					box-sizing: border-box;
					cursor: pointer;
					height: 1rem;
					min-height: 0;
					padding: 1px;
					pointer-events: auto;
					position: absolute;
					text-align: center;
					top: 0;
					width: 5rem;
				}

				.flyout-tab:hover, .flyout-tab:focus {
					background-color: var(--d2l-color-gypsum);
				}

				.flyout-tab:focus {
					border-color: rgba(0, 111, 191, 0.4);
					border-style: solid;
					border-width: 0 1px 1px 1px;
					box-shadow: 0 0 0 4px rgba(0, 111, 191, 0.3);
				}

				.flyout-tab:active, .flyout-tab:focus {
					outline: 0;
				}

				.flyout-tab > d2l-icon {
					margin: auto;
					vertical-align: top !important;
				}
			`
		];
	}

	constructor() {
		super();
		this.tabPosition = 'right';
		this._visibleState = VISIBLE_STATES.closed;
	}

	connectedCallback() {
		super.connectedCallback();
		this._visibleState = this.open ? VISIBLE_STATES.opened : VISIBLE_STATES.closed;
	}

	render() {
		return html`
			${this._renderOptInDialog()}
			<div id="flyout" class="${classMap(this._getFlyoutClasses())}" @transitionend="${this._onTransitionComplete}">
				<span tabindex="${this._getTabIndex()}" @focus="${this._shiftToLast}"></span>
				${this._renderFlyoutContent()}
				<div class="flyout-tab-container">
					<button id="flyout-tab" class="flyout-tab" style="${this._getTabStyle()}" tabindex="0" aria-label="${this._getAriaLabelForTab()}" @click="${this._clickTab}">
						<d2l-icon icon="${this._getTabIcon()}"></d2l-icon>
					</button>
				</div>
				<span tabindex="${this._getTabIndex()}" @focus="${this._shiftToFirst}"></span>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('open')) {
			this._openChanged();
		}
	}

	focus() {
		this._shiftToFirst();
	}

	_cancelOptOut(event) {
		this._optOutDialogOpen = false;
		this.shadowRoot.querySelector('#opt-out-button').focus();
		event.stopPropagation();
	}

	_checkNumberOfLinks(expectedNumber) {
		let result;
		if (this.tutorialLink && this.helpDocsLink) {
			result = 2;
		} else if (this.tutorialLink || this.helpDocsLink) {
			result = 1;
		} else {
			result = 0;
		}
		return result === expectedNumber;
	}

	_clickOptIn() {
		this._fireEvent('opt-in');
		this.open = false;
	}

	_clickOptOut() {
		if (this.optOut && (!this.hideReason || !this.hideFeedback)) {
			this._optOutDialogOpen = true;
		} else {
			this._fireEvent('opt-out');
			this.open = false;
		}
	}

	_clickTab() {
		if (this._visibleState === VISIBLE_STATES.opened || this._visibleState === VISIBLE_STATES.closed) {
			this.open = !this.open;
		}
	}

	_confirmOptOut(event) {
		this._optOutDialogOpen = false;
		this._fireEvent('opt-out', event.detail);
		this.open = false;
		event.stopPropagation();
	}

	_fireEvent(name, details) {
		this.dispatchEvent(
			new CustomEvent(
				name, {
					bubbles: true,
					composed: true,
					detail: details
				}
			)
		);
	}

	_getAriaLabelForTab() {
		if (this.open) {
			return this.localize('components:optInFlyout:close');
		}
		return this.localize(this.optOut ? 'components:optInFlyout:openOptOut' : 'components:optInFlyout:openOptIn');
	}

	_getDescription() {
		return this.shortDescription ? 'short-description' : (this.longDescription ? 'long-description' : '');
	}

	_getFlyoutClasses() {
		const openState = this._visibleState === VISIBLE_STATES.opening || this._visibleState === VISIBLE_STATES.opened;
		return {
			'flyout-opened': openState,
			'flyout-closed': !openState,
			'd2l-body-standard': true
		};
	}

	_getPrimaryButtonText() {
		return this.localize(this.optOut ? 'components:optInFlyout:leaveOn' : 'components:optInFlyout:turnOn');
	}

	_getSecondaryButtonText() {
		return this.localize(this.optOut ? 'components:optInFlyout:turnOff' : 'components:optInFlyout:leaveOff');
	}

	_getTabIcon() {
		if (this._visibleState === VISIBLE_STATES.closed || this._visibleState === VISIBLE_STATES.closing) {
			return 'tier1:chevron-down';
		} else {
			return 'tier1:chevron-up';
		}
	}

	_getTabIndex() {
		return this.open ? 0 : -1;
	}

	_getTabStyle() {
		let rtl = this.dir === 'rtl';
		let position = '';
		if (this.tabPosition === 'left') {
			position = 'calc(2.5rem + 15px)';
		} else if (this.tabPosition === 'right' || this.tabPosition === 'default' || !this.tabPosition) {
			position = 'calc(2.5rem + 15px)';
			rtl = !rtl;
		} else if (this.tabPosition === 'center' || this.tabPosition === 'centre') {
			position = '50%';
		} else if (!/^\d+(?:\.\d+)?%$/.test(this.tabPosition)) {
			/* eslint-disable no-console */
			console.warn('Invalid position supplied to opt-in flyout');
			position = 'calc(2.5rem + 15px)';
			rtl = !rtl;
		}

		const side = rtl ? 'right' : 'left';
		const shift = rtl ? '50%' : '-50%';

		const tabStyle = `${side}: ${position};`;

		if (this.noTransform) {
			return tabStyle;
		}

		return `${tabStyle} transform: translateX(${shift});`;
	}

	_getTutorialLink(i) {
		if (this.tutorialLink && this.helpDocsLink) {
			const translation = this.localize('components:optInFlyout:tutorialAndHelpMessage');
			const videoFirst = translation.indexOf('*') < translation.indexOf('~');

			const links = videoFirst ? [this.tutorialLink, this.helpDocsLink] : [this.helpDocsLink, this.tutorialLink];
			return links[i];
		}
		return this.tutorialLink || this.helpDocsLink || null;
	}

	_getTutorialTextPart(textPart) {
		if (this.tutorialLink && this.helpDocsLink) {
			const tutorialHelpMessage = this.localize('components:optInFlyout:tutorialAndHelpMessage');
			return tutorialHelpMessage.split(/\*|~/)[textPart] || '';
		} else if (this.tutorialLink || this.helpDocsLink) {
			const individualMessage = this.localize(this.tutorialLink ? 'components:optInFlyout:tutorialMessage' : 'components:optInFlyout:helpMessage');
			return individualMessage.split('*')[textPart] || '';
		} else {
			return null;
		}
	}

	_onTransitionComplete(event) {
		if (event.target.id !== 'flyout' || event.propertyName !== 'transform') {
			return null;
		}

		if (this._visibleState === VISIBLE_STATES.opening) {
			this._visibleState = VISIBLE_STATES.opened;
			this.shadowRoot.querySelector('#primary-button').focus();
		} else if (this._visibleState === VISIBLE_STATES.closing) {
			this._visibleState = VISIBLE_STATES.closed;
			this.shadowRoot.querySelector('#flyout-tab').focus();
		}
	}

	_openChanged() {
		if (this.open && this._visibleState === VISIBLE_STATES.closed || this._visibleState === VISIBLE_STATES.closing) {
			this._visibleState = VISIBLE_STATES.opening;
		} else if (!this.open && this._visibleState === VISIBLE_STATES.opened || this._visibleState === VISIBLE_STATES.opening) {
			this._visibleState = VISIBLE_STATES.closing;
		}
		this._fireEvent(this.open ? 'flyout-opened' : 'flyout-closed');
	}

	_renderFlyoutContent() {
		if (this._visibleState === VISIBLE_STATES.closed) {
			return nothing;
		}
		return html`
			<div id="flyout-content" role="dialog" aria-labelledby="title" aria-describedby="${this._getDescription()}" class="flyout-content">
				<div class="flyout-text">
					<h1 class="d2l-heading-1" id="title">${this.title}</h1>
					${this._renderShortDescription()}
					${this._renderLongDescription()}
					${this._renderLinksText()}
				</div>
				<div class="flyout-buttons">
					<d2l-button id="primary-button" primary="" @click="${this._clickOptIn}">${this._getPrimaryButtonText()}</d2l-button>
					<d2l-button id="opt-out-button" @click="${this._clickOptOut}">${this._getSecondaryButtonText()}</d2l-button>
				</div>
			</div>
		`;
	}

	_renderLinksText() {
		if (this._checkNumberOfLinks(1)) {
			return html`
				<div class="flyout-tutorial">
					<span>${this._getTutorialTextPart(0)}</span>
					<a id="tutorial-link-1" href="${this._getTutorialLink(0)}" target="_blank" rel="noopener">
						${this._getTutorialTextPart(1)}
					</a>
					<span>${this._getTutorialTextPart(2)}</span>
				</div>
			`;
		} else if (this._checkNumberOfLinks(2)) {
			return html`
				<div class="flyout-tutorial">
					<span>${this._getTutorialTextPart(0)}</span>
					<a id="tutorial-link-2" href="${this._getTutorialLink(0)}" target="_blank" rel="noopener">
						${this._getTutorialTextPart(1)}
					</a>
					<span>${this._getTutorialTextPart(2)}</span>
					<a href="${this._getTutorialLink(1)}" target="_blank" rel="noopener">
						${this._getTutorialTextPart(3)}
					</a>
					<span>${this._getTutorialTextPart(4)}</span>
				</div>
			`;
		}
	}

	_renderLongDescription() {
		if (!this.longDescription) {
			return nothing;
		}
		return html`
			<div id="long-description">
				<d2l-html-block html="${this.longDescription}"></d2l-html-block>
			</div>
		`;
	}

	_renderOptInDialog() {
		if (!this._optOutDialogOpen) {
			return nothing;
		}
		return html`
			<d2l-labs-opt-out-dialog
				@cancel="${this._cancelOptOut}"
				@confirm="${this._confirmOptOut}"
				?hide-reason="${this.hideReason}"
				?hide-feedback="${this.hideFeedback}">
				<slot></slot>
			</d2l-labs-opt-out-dialog>
		`;
	}

	_renderShortDescription() {
		if (!this.shortDescription) {
			return nothing;
		}
		return html`
			<div id="short-description">
				<d2l-html-block html="${this.shortDescription}"></d2l-html-block>
			</div>
		`;
	}

	_shiftToFirst() {
		if (this.tutorialLink && this.helpDocsLink) {
			this.shadowRoot.querySelector('#tutorial-link-2').focus();
		} else if (this.tutorialLink || this.helpDocsLink) {
			this.shadowRoot.querySelector('#tutorial-link-1').focus();
		} else {
			this.shadowRoot.querySelector('#primary-button').focus();
		}
	}

	_shiftToLast() {
		if (this.open) {
			this.shadowRoot.querySelector('#flyout-tab').focus();
		}
	}

}

customElements.define('d2l-labs-opt-in-flyout-impl', FlyoutImplementation);
