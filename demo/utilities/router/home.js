import { html, LitElement } from 'lit';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';

export class Home extends LitElement {
	static styles = [heading1Styles];

	render() {
		return html`
			<h1 class="d2l-heading-1">Home</h1>
			<p>This is a sample application that demonstrates the router.</p>
		`;
	}
}

customElements.define('test-home', Home);
