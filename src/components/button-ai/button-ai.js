import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { ButtonMixin } from '@brightspace-ui/core/components/button/button-mixin.js';
import { buttonStyles } from '@brightspace-ui/core/components/button/button-styles.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { SlottedIconMixin } from '@brightspace-ui/core/components/icons/slotted-icon-mixin.js';

class ButtonAI extends SlottedIconMixin(ButtonMixin(LitElement)) {
	static properties = {
		/**
		 * ACCESSIBILITY: REQUIRED: Text for the button
		 * @type {string}
		 */
		text: { type: String, reflect: true }
	};

	static styles = [super.styles, labelStyles, buttonStyles,
		css`
			:host {
				/* comes from --d2l-color-celestine-plus-1 + 0.5 opacity */
				--d2l-color-celestine-plus-1-opacity-50: #29a6ff80;

				/* comes from --d2l-color-fluorite-plus-1 + 0.5 opacity */
				--d2l-color-fluorite-plus-1-opacity-50: #ce68fa80;
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			button {
				align-items: center;
				background:
					linear-gradient(#ffffff, #ffffff) padding-box,
					linear-gradient(to top left, var(--d2l-color-fluorite-plus-1), var(--d2l-color-celestine-plus-1)) border-box;
				border: 0.1rem solid transparent;
				border-radius: 0.4rem;
				column-gap: 0.3rem;
				display: inline-flex;
				font-family: inherit;
				padding-block: 0;
				padding-inline: 0.6rem;
				position: relative;
			}

			button:hover,
			button:focus {
				background:
					linear-gradient(var(--d2l-color-gypsum), var(--d2l-color-gypsum)) padding-box,
					linear-gradient(to top left, var(--d2l-color-fluorite-plus-1), var(--d2l-color-celestine-plus-1)) border-box;
			}

			:host([disabled]) button {
				background:
					linear-gradient(#ffffff, #ffffff) padding-box,
					linear-gradient(to top left, var(--d2l-color-fluorite-plus-1-opacity-50), var(--d2l-color-celestine-plus-1-opacity-50)) border-box;
				cursor: default;
			}

			:host([disabled]) button::before {
				background:
					linear-gradient(#ffffff, #ffffff) padding-box,
					linear-gradient(to top left, var(--d2l-color-fluorite-plus-1-opacity-50), var(--d2l-color-celestine-plus-1-opacity-50)) border-box;
				border-radius: inherit;
				content: "";
				inset: 0;
				opacity: 0.5;
				position: absolute;
			}

			button,
			.property-icon,
			slot[name="icon"]::slotted(d2l-icon-custom) {
				color: var(--d2l-color-celestine);
			}

			:host(:not([disabled])) button:hover,
			:host(:not([disabled])) button:focus,
			:host(:not([disabled])) button:hover .property-icon,
			:host(:not([disabled])) button:focus .property-icon,
			:host(:not([disabled])) button:hover slot[name="icon"]::slotted(d2l-icon-custom),
			:host(:not([disabled])) button:focus slot[name="icon"]::slotted(d2l-icon-custom) {
				color: var(--d2l-color-celestine-minus-1);
			}
	`];

	constructor() {
		super();
		this.icon = 'tier1:ai';
	}

	render() {
		return html `
			<button
				aria-disabled="${ifDefined(this.disabled && this.disabledTooltip ? 'true' : undefined)}"
				?disabled=${this.disabled && !this.disabledTooltip}
				id="${this.#buttonId}"
				class="d2l-label-text">
				${this._renderIcon()}
				${this.text}
			</button>
			${this.disabled && this.disabledTooltip ? html`<d2l-tooltip class="vdiff-target" for="${this.#buttonId}">${this.disabledTooltip}</d2l-tooltip>` : ''}
		`;
	};

	#buttonId = getUniqueId();
};

customElements.define('d2l-labs-button-ai', ButtonAI);
