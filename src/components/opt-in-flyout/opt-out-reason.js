import { css, LitElement } from 'lit';

class OptOutReason extends LitElement {

	static properties = {
		key: { type: String },
		text: { type: String }
	};

	static styles = css`
		:host {
			display: none;
		}
	`;

}

customElements.define('d2l-labs-opt-out-reason', OptOutReason);
