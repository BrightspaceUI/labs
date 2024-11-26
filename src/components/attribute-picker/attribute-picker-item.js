import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';

class AttributePickerItem extends LocalizeLabsElement(LitElement) {
	static get properties() {
		return {
			deletable: {
				type: Boolean,
				reflect: true
			},
			tabIndex: {
				type: Number,
				reflect: true
			},
			text: {
				type: String
			}
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				cursor: pointer;
				display: inline-block;
				width: max-content;
			}
			.d2l-labs-attribute-picker-item-wrapper {
				align-items: center;
				background-color: var(--d2l-color-sylvite);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 0.25rem;
				display: flex;
				gap: 0.4rem;
				padding: 0.25rem 0.75rem 0.2rem;
				user-select: none;
			}
			:host([deletable]) .d2l-labs-attribute-picker-item-wrapper {
				padding: 0.25rem 0.6rem 0.25rem 0.55rem;
			}
			:host(:hover) .d2l-labs-attribute-picker-item-wrapper,
			:host(:hover) d2l-icon:hover {
				background-color: var(--d2l-color-gypsum);
				border-color: var(--d2l-color-mica);
				color: var(--d2l-color-ferrite);
			}
			:host(:focus) .d2l-labs-attribute-picker-item-wrapper,
			:host(:focus) d2l-icon:hover {
				background-color: var(--d2l-color-celestine);
				border-color: var(--d2l-color-celestine-minus-1);
				color: var(--d2l-color-regolith);
			}
			:host(:focus) d2l-icon {
				color: #c6dbef;
			}
			d2l-icon {
				--d2l-icon-height: 0.5rem;
				--d2l-icon-width: 0.5rem;
				color: var(--d2l-color-galena);
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
			d2l-tooltip {
				word-break: break-all;
			}
		`];
	}

	constructor() {
		super();
		this.deletable = false;
		this.tabIndex = 0; // without it we can't focus the item
	}

	render() {
		return html`
			<div class="d2l-labs-attribute-picker-item-wrapper">
				<div id="d2l-labs-attribute-picker-item-text" class="d2l-body-compact d2l-labs-attribute-picker-item-text">${this.text}</div>
				<d2l-icon aria-label="${this.localize('components:attributePicker:removeValue', 'value', this.text)}" role="button" icon="d2l-tier1:close-large-thick" ?hidden="${!this.deletable}" @click="${this._onDeleteItem}"></d2l-icon>
			</div>
			<d2l-tooltip for="d2l-labs-attribute-picker-item-text" position="top" show-truncated-only offset="16">${this.text}</d2l-tooltip>
		`;
	}

	_onDeleteItem() {
		this.dispatchEvent(new CustomEvent('d2l-labs-attribute-picker-item-deleted', { bubbles: true, composed: true }));
	}
}
customElements.define('d2l-labs-attribute-picker-item', AttributePickerItem);
