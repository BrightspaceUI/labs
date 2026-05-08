
import '@brightspace-ui/core/components/button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

class ButtonSubtleAI extends LitElement {
	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: REQUIRED: Text for the button
			 * @type {string}
			 */
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [css`
			:host d2l-button-subtle {
				border: 2px solid transparent;
				border-radius: 6px;
				background:
					linear-gradient(var(--d2l-theme-background-color-base), var(--d2l-theme-background-color-base)) padding-box,
					linear-gradient(to top left, var(--d2l-color-celestine), var(--d2l-color-fluorite-plus-1)) border-box;

				&:focus-within {
					background: none;
				}
			}
		`];
	}

	render() {
		return html `
			<d2l-button-subtle text="${ifDefined(this.text)}" icon="tier1:ai"></d2l-button-subtle>
		`;
	}
}

customElements.define('d2l-labs-button-subtle-ai', ButtonSubtleAI);
