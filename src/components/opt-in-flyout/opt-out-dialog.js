import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-textarea.js';
import './opt-out-reason-selector.js';
import { css, html, LitElement } from 'lit';
import { LocalizeLabsElement } from '../localize-labs-element.js';

const defaultEventProperties = {
	bubbles: true,
	composed: true
};

class OptOutDialog extends LocalizeLabsElement(LitElement) {

	static get properties() {
		return {
			hideReason: { type: Boolean, attribute: 'hide-reason' },
			hideFeedback: { type: Boolean, attribute: 'hide-feedback' }
		};
	}

	static get styles() {
		return css`
			:host {
				height: 100%;
				overflow: hidden;
				pointer-events: auto;
				position: absolute;
				width: 100%;
				z-index: 950;
			}

			.opt-out-modal-fade {
				background-color: #ffffff;
				height: 100%;
				opacity: 0.7;
				position: absolute;
				width: 100%;
				z-index: 1;
			}

			.dialog {
				background-color: #ffffff;
				border: 1px solid var(--d2l-color-mica);
				border-radius: 0.3rem;
				box-shadow: 0 2px 12px rgba(86, 90, 92, 0.25);
				box-sizing: border-box;
				left: 50%;
				max-width: 680px;
				padding: 1rem;
				position: absolute;
				top: 7.5%;
				transform: translateX(-50%);
				width: 90%;
				z-index: 2;
			}

			label {
				display: block;
				margin-bottom: 0.5rem;
			}

			#title-label {
				display: inline;
				font-weight: bold;
			}

			d2l-input-textarea {
				margin-bottom: 1rem;
			}

			d2l-button {
				margin-right: 1rem;
			}

			.close-button {
				inset-block-start: 0.6rem;
				inset-inline-end: 0.6rem;
				position: absolute;
			}
		`;
	}

	constructor() {
		super();
		this.hideReason = false;
		this.hideFeedback = false;
		this._reason = '';
	}

	firstUpdated() {
		super.firstUpdated();
		this._setFocus();
	}

	render() {
		return html`
			<div class="opt-out-modal-fade"></div>
			<div class="dialog" role="dialog" aria-labelledby="title-label">
				<span tabindex="0" @focus="${this._shiftToLast}"></span>
				<label id="title-label">${this.localize('components:optInFlyout:feedbackTitle')}</label>
				<br><br>
				<div ?hidden="${this.hideReason}">
					<d2l-labs-opt-out-reason-selector id="reason-selector" @selected="${this._handleSelected}">
						<slot></slot>
					</d2l-labs-opt-out-reason-selector>
				</div>
				<div ?hidden="${this.hideFeedback}">
					<label id="feedback-label">${this.localize('components:optInFlyout:feedbackLabel')}</label>
					<d2l-input-textarea id="feedback" labelled-by="feedback-label" rows="4" max-rows="4"></d2l-input-textarea>
				</div>
				<div>
					<d2l-button id="done-button" primary="" @click="${this._confirm}">${this.localize('components:optInFlyout:done')}</d2l-button>
					<d2l-button @click="${this._cancel}">${this.localize('components:optInFlyout:cancel')}</d2l-button>
				</div>
				<d2l-button-icon icon="tier1:close-small" id="close-button" class="close-button" @click="${this._cancel}" text="${this.localize('components:optInFlyout:close')}"></d2l-button-icon>
				<span tabindex="0" @focus="${this._shiftToFirst}"></span>
			</div>
		`;
	}

	_cancel() {
		this.dispatchEvent(new CustomEvent('cancel', defaultEventProperties));
	}

	_confirm() {
		if (!this.shadowRoot) {
			return;
		}

		const feedback = this.shadowRoot.querySelector('#feedback');

		this.dispatchEvent(
			new CustomEvent('confirm', {
				detail: {
					reason: this._reason || '',
					feedback: (feedback && feedback.value || '').trim()
				},
				...defaultEventProperties
			})
		);
	}

	_handleSelected(e) {
		this._reason = e.detail.value;
	}

	_setFocus() {
		if (!this.shadowRoot) {
			return;
		}

		let element;

		if (!this.hideReason) {
			element = this.shadowRoot.querySelector('#reason-selector');
		} else if (!this.hideFeedback) {
			element = this.shadowRoot.querySelector('#feedback');
		} else {
			element = this.shadowRoot.querySelector('#done-button');
		}

		if (!element) {
			return;
		}

		element.focus();
	}

	_shiftToFirst() {
		this._setFocus();
	}

	_shiftToLast() {
		if (!this.shadowRoot) {
			return;
		}

		const element = this.shadowRoot.querySelector('#close-button');

		if (!element) {
			return;
		}

		element.focus();
	}

}

customElements.define('d2l-labs-opt-out-dialog', OptOutDialog);
