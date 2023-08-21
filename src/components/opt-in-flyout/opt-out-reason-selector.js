import './opt-out-reason.js';
import { css, html, LitElement } from 'lit';
import { composeMixins } from '@brightspace-ui/core/helpers/composeMixins.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

class OptOutReasonSelector extends composeMixins(
	LitElement,
	LocalizeLabsElement,
	RtlMixin
) {
	static get properties() {
		return {
			_reasons: { state: true }
		};
	}

	static get styles() {
		return [
			inputStyles,
			css`
				label {
					display: block;
					margin-bottom: 0.5rem;
				}

				select {
					-moz-appearance: none;
					-webkit-appearance: none;
					appearance: none;
					background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2242%22%20height%3D%2242%22%20viewBox%3D%220%200%2042%2042%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill%3D%22%23f2f3f5%22%20d%3D%22M0%200h42v42H0z%22%2F%3E%3Cpath%20stroke%3D%22%23d3d9e3%22%20d%3D%22M0%200v42%22%2F%3E%3Cpath%20d%3D%22M14.99%2019.582l4.95%204.95a1.5%201.5%200%200%200%202.122%200l4.95-4.95a1.5%201.5%200%200%200-2.122-2.122L21%2021.35l-3.888-3.89a1.5%201.5%200%200%200-2.12%202.122z%22%20fill%3D%22%23565A5C%22%2F%3E%3C%2Fsvg%3E");
					background-position: right center;
					background-repeat: no-repeat;
					background-size: contain;
					display: block;
					margin-bottom: 1.5rem !important;
					position: relative;
					width: 80%;
				}

				/* for ie11 - avoid displaying default select arrow */
				select::-ms-expand {
					display: none;
				}

				/* for ie11 - prevent background box from covering select arrow */
				select::-ms-value {
					background-color: transparent;
					color: var(--d2l-input-color);
				}

				:host([dir="rtl"]) select {
					background-position: left center !important;
				}

				#options {
					display: none;
				}
			`
		];
	}

	constructor() {
		super();
		this._reasons = [];
	}

	connectedCallback() {
		super.connectedCallback();
		this._onSlotChanged();
	}

	render() {
		return html`
			<label for="selector">${this.localize('components:optInFlyout:feedbackReasonLabel')}</label>
			<select class="d2l-input" id="selector" @change="${this._reasonSelected}" onload="${this.focus()}">
				<option disabled="" value="">${this.localize('components:optInFlyout:feedbackChooseReason')}</option>
				${this._reasons.map((item) => html`<option value="${item.key}">${item.text}</option>`)}
				<option value="Other">${this.localize('components:optInFlyout:feedbackReasonOther')}</option>
			</select>
			<div id="options">
				<slot id="options-slot" @slotchange="${this._onSlotChanged}"></slot>
			</div>
		`;
	}

	focus() {
		this.shadowRoot.querySelector('#selector')?.focus();
	}

	_onSlotChanged() {
		/* Passing <option> elements directly into a <select> tag with a slot doesn't work.
		 * Instead, pass in <d2l-labs-opt-out-reason> elements, and this component will construct
		 * the options from the passed in options.
		 */
		const selector = this.shadowRoot.querySelector('#selector');
		if (!selector) {
			return;
		}
		selector.selectedIndex = 0;
		let children = this.shadowRoot.querySelector('#options-slot')?.assignedNodes({ flatten: true });

		children = children.filter(child =>
			child &&
			child.tagName === 'D2L-LABS-OPT-OUT-REASON' &&
			child.key &&
			child.text
		).map(child => ({
			key: child.key,
			text: child.text
		}));

		if (children.length <= 0) {
			// Use default options if no valid options were provided
			children = [
				{ key: 'PreferOldExperience', text: this.localize('components:optInFlyout:feedbackReasonPreferOldExperience') },
				{ key: 'MissingFeature', text: this.localize('components:optInFlyout:feedbackReasonMissingFeature') },
				{ key: 'NotReadyForSomethingNew', text: this.localize('components:optInFlyout:feedbackReasonNotReadyForSomethingNew') },
				{ key: 'JustCheckingSomething', text: this.localize('components:optInFlyout:feedbackReasonJustCheckingSomething') }
			];
		}

		this._reasons = children;
	}

	_reasonSelected() {
		const selectionIndex = this.shadowRoot.querySelector('#selector').selectedIndex;
		if (selectionIndex < 1) {
			this._setSelectedReason(null);
			return;
		}

		const selection = this.shadowRoot.querySelector('#selector').options[selectionIndex];
		if (!selection || !selection.value) {
			this._setSelectedReason(null);
			return;
		}

		this._setSelectedReason(selection.value);
	}

	_setSelectedReason(value) {
		this.dispatchEvent(
			new CustomEvent('selected', {
				bubbles: true,
				composed: true,
				detail: { value }
			})
		);
	}

}

customElements.define('d2l-labs-opt-out-reason-selector', OptOutReasonSelector);
