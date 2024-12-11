import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import { css, html, LitElement } from 'lit';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

class ViewToggle extends RtlMixin(LitElement) {
	static get properties() {
		return {
			text: {
				type: String
			},
			toggleOptions: {
				type: Array
			},
			selectedOption: {
				type: String
			}
		};
	}
	static get styles() {
		return [
			css`
			button.d2l-labs-view-toggle-left,
			:host([dir="rtl"]) button.d2l-labs-view-toggle-right {
				border-bottom-left-radius: 0.3rem;
				border-bottom-right-radius: 0;
				border-left-color: var(--d2l-color-mica);
				border-right-color: transparent;
				border-top-left-radius: 0.3rem;
				border-top-right-radius: 0;
			}
			button.d2l-labs-view-toggle-right,
			:host([dir="rtl"]) button.d2l-labs-view-toggle-left {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0.3rem;
				border-left-color: transparent;
				border-right-color: var(--d2l-color-mica);
				border-top-left-radius: 0;
				border-top-right-radius: 0.3rem;
			}
			button {
				background-color: var(--d2l-color-sylvite);
				border-color: var(--d2l-color-mica);
				border-style: solid;
				border-width: 1px;
				box-sizing: border-box;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				display: inline;
				flex: 1;
				font-family: inherit;
				font-size: 0.7rem;
				font-weight: 700;
				margin: 0;
				min-height: calc(2rem + 2px);
				outline: none;
				padding: 0.5rem 1.5rem;
				text-align: center;
				transition: box-shadow 0.2s;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
				vertical-align: middle;
				white-space: nowrap;
			}
			button:hover, button:focus {
				border: 1px solid var(--d2l-color-celestine) !important;
			}
			button[aria-pressed="true"] {
				background-color: var(--d2l-color-tungsten);
				border-color: var(--d2l-color-tungsten);
				color: var(--d2l-color-regolith);
			}
			button[aria-pressed="true"]:hover, button[aria-pressed="true"]:focus {
				box-shadow: inset 0 0 0 2px #ffffff;
			}
			:host {
				display: flex;
				width: 100%;
			}
			.view-toggle-container {
				display: none;
			}
			@media (min-width: 525px) {
				:host {
					display: block;
					margin: 0 -0.9rem;
					width: auto;
				}
				.view-toggle-container {
					display: inline;
					margin: 0 0.9rem;
				}
			}`
		];
	}
	constructor() {
		super();

		if (!this.selectedOption && this.toggleOptions && this.toggleOptions.any()) {
			this.selectedOption = this.toggleOptions[0].val;
		}
	}
	render() {
		return html`
		<div class="view-toggle-container">
			<span>${this.text}</span>
			${this.toggleOptions && this.toggleOptions.map(this._renderButton.bind(this))}
		</div>
		`;
	}
	_isSelected(option) {
		return option.val === this.selectedOption;
	}
	_renderButton(option, index) {
		let placement = 'centre';
		if (index === 0) {
			placement = 'left';
		}
		if (this.toggleOptions && index === this.toggleOptions.length - 1) {
			placement = 'right';
		}
		return html`<button
			data-option-val="${option.val}"
			aria-pressed="${this._isSelected(option)}"
			class="d2l-labs-view-toggle-${placement}"
			@click="${this._selectIndex}"
		>${option.text}</button>`;
	}
	_selectIndex(e) {
		this.selectedOption = e.target.dataset.optionVal;
		this.dispatchEvent(
			new CustomEvent(
				'd2l-labs-view-toggle-changed',
				{
					detail: {
						view: this.selectedOption
					},
					composed: true,
					bubbles: true
				}
			)
		);
	}
}
customElements.define('d2l-labs-view-toggle', ViewToggle);
