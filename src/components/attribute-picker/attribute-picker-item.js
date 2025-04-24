import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';

class AttributePickerItem extends LocalizeLabsElement(LitElement) {
	static get properties() {
		return {
			deletable: { type: Boolean, reflect: true },
			text: { type: String }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				cursor: pointer;
				display: inline-block;
				width: max-content;
			}
			:host(:focus-visible) {
				outline: none;
			}
			.d2l-labs-attribute-picker-item-wrapper {
				align-items: center;
				background-color: var(--d2l-color-sylvite);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 0.3rem;
				display: flex;
				gap: 0.2rem;
				padding: 0.25rem;
				padding-inline: 0.5rem;
				user-select: none;
			}
			:host([deletable]) .d2l-labs-attribute-picker-item-wrapper {
				padding-inline: 0.5rem 0.1rem;
				padding-bottom: 0.15rem;
				padding-top: 0.1rem;
			}
			:host(:hover) .d2l-labs-attribute-picker-item-wrapper {
				background-color: var(--d2l-color-gypsum);
				border-color: var(--d2l-color-mica);
				color: var(--d2l-color-ferrite);
			}
			:host(:focus) .d2l-labs-attribute-picker-item-wrapper {
				background-color: var(--d2l-color-celestine);
				border: 1px solid var(--d2l-color-celestine-minus-1);
				color: var(--d2l-color-regolith);
			}
			.d2l-labs-attribute-picker-item-text {
				-webkit-box-orient: vertical;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-height: normal;
				max-width: 18rem;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
			}
			d2l-button-icon {
				--d2l-button-icon-background-color-hover: var(--d2l-color-mica);
				--d2l-button-icon-fill-color: var(--d2l-color-chromite);
				--d2l-button-icon-fill-color-hover: var(--d2l-color-tungsten);
				--d2l-button-icon-min-height: 1.2rem;
				--d2l-button-icon-min-width: 1.2rem;
			}
			:host(:focus) d2l-button-icon {
				--d2l-button-icon-background-color-hover: var(--d2l-color-celestine-plus-1);
				--d2l-button-icon-fill-color: var(--d2l-color-mica);
				--d2l-button-icon-fill-color-hover: var(--d2l-color-sylvite);
			}
		`];
	}

	constructor() {
		super();
		this.deletable = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.tabIndex = 0;
	}

	render() {
		return html`
			<div class="d2l-labs-attribute-picker-item-wrapper">
				<div id="d2l-labs-attribute-picker-item-text" class="d2l-body-compact d2l-labs-attribute-picker-item-text">${this.text}</div>
				<d2l-button-icon tabindex="-1" text="${this.localize('components:attributePicker:removeValue', 'value', this.text)}" icon="tier1:close-small" ?hidden="${!this.deletable}" @click="${this._onDeleteItem}"></d2l-button-icon>
			</div>
			<d2l-tooltip for="d2l-labs-attribute-picker-item-text" position="top" show-truncated-only offset="16">${this.text}</d2l-tooltip>
		`;
	}

	_onDeleteItem() {
		this.dispatchEvent(new CustomEvent('d2l-labs-attribute-picker-item-deleted', { bubbles: true, composed: true }));
	}
}
customElements.define('d2l-labs-attribute-picker-item', AttributePickerItem);
