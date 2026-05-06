
import '@brightspace-ui/core/components/button/button-subtle.js';
import { html, LitElement } from 'lit';

class ButtonSubtleAI extends LitElement {
	render() {
		return html `
			<d2l-button-subtle></d2l-button-subtle>
		`;
	}
}

customElements.define('d2l-labs-button-subtle-ai', ButtonSubtleAI);
