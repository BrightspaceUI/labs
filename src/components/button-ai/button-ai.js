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
				color: var(--d2l-color-celestine-minus-1);
			}

			:host([disabled]) button {
				background:
						linear-gradient(#ffffff, #ffffff) padding-box,
						linear-gradient(to top left, #ce68fa80, #29a6ff80) border-box;
				cursor: default;
			}

			:host([disabled]) button::before {
				background:
					linear-gradient(#ffffff, #ffffff) padding-box,
					linear-gradient(to top left, #ce68fa80, #29a6ff80) border-box; /* these colors have a 0.5 opacity needed for the disabled state */
				border-radius: inherit;
				content: '';
				inset: 0;
				opacity: 0.5;
				position: absolute;
			},

			:host([disabled]) button:hover,
			:host([disabled]) button:focus {
				cursor: default;
			}

			:host([disabled]) button:hover .content,
			:host([disabled]) button:hover .property-icon,
			:host([disabled]) button:focus .content,
			:host([disabled]) button:focus .property-icon {
				color: var(--d2l-color-celestine);
			}

			button:hover:not([disabled]) .content,
			button:focus:not([disabled]) .content {
				color: var(--d2l-color-celestine-minus-1);
			}

			.property-icon,
			.content,
			slot[name="icon"]::slotted(d2l-icon-custom) {
				color: var(--d2l-color-celestine);
			}

			button:hover:not([disabled]) .property-icon,
			button:focus:not([disabled]) .property-icon,
			button:hover:not([disabled]) .content,
			button:focus:not([disabled]) .content,
			button:hover:not([disabled]) slot[name="icon"]::slotted(d2l-icon-custom),
			button:focus:not([disabled]) slot[name="icon"]::slotted(d2l-icon-custom) {
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
				<span class="content">${this.text}</span>
			</button>
			${this.disabled && this.disabledTooltip ? html`<d2l-tooltip class="vdiff-target" for="${this.#buttonId}">${this.disabledTooltip}</d2l-tooltip>` : ''}
		`;
	};

	#buttonId = getUniqueId();
};

customElements.define('d2l-labs-button-ai', ButtonAI);
