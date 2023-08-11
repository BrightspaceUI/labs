import { css, LitElement } from 'lit';

class OptOutReason extends LitElement {

	static get properties() {
		return {
			key: { type: String },
			text: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: none;
			}
		`;
	}

}

customElements.define('d2l-opt-out-reason', OptOutReason);
