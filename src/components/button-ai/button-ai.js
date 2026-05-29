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
					linear-gradient(var(--d2l-theme-background-color-base), var(--d2l-theme-background-color-base)) padding-box,
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
					linear-gradient(var(--d2l-theme-background-color-interactive-tertiary-hover), var(--d2l-theme-background-color-interactive-tertiary-hover)) padding-box,
					linear-gradient(to top left, var(--d2l-color-fluorite-plus-1), var(--d2l-color-celestine-plus-1)) border-box;
			}

			:host([disabled]) button {
				background:
					linear-gradient(var(--d2l-theme-background-color-base), var(--d2l-theme-background-color-base)) padding-box,
					linear-gradient(to top left, var(--d2l-color-fluorite-plus-1), var(--d2l-color-celestine-plus-1)) border-box;
				cursor: default;
				opacity: 0.5;
			}

			button:hover:not([disabled]) .content,
			button:focus:not([disabled]) .content {
				color: var(--d2l-theme-text-color-interactive-hover);
			}

			.property-icon,
			.content,
			slot[name="icon"]::slotted(d2l-icon-custom) {
				color: var(--d2l-theme-text-color-interactive-default);
			}

			button:hover:not([disabled]) .property-icon,
			button:focus:not([disabled]) .property-icon,
			button:hover:not([disabled]) slot[name="icon"]::slotted(d2l-icon-custom),
			button:focus:not([disabled]) slot[name="icon"]::slotted(d2l-icon-custom) {
				color: var(--d2l-theme-text-color-interactive-hover);
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
