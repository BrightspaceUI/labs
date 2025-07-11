import '@brightspace-ui/core/components/button/button-icon.js';
import { html, LitElement } from 'lit';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';

export class D2LGradeResultIconButton extends LitElement {
	static get properties() {
		return {
			text: { type: String },
			icon: { type: String },
		};
	}

	render() {
		return html`
			<d2l-button-icon
				id="d2l-grade-result-icon-button-${this.#id}"
				icon="${this.icon}"
				@click="${this._onClick}"
				text="${this.text}"
			></d2l-button-icon>
		`;
	}

	#id = getUniqueId();

	_onClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-icon-button-click', {
			bubbles: true,
			composed: true,
		}));
	}

}
customElements.define('d2l-labs-grade-result-icon-button', D2LGradeResultIconButton);
