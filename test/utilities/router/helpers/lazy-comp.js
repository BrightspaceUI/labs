import { html, LitElement } from 'lit';

class LazyView extends LitElement {
	static properties = {};

	render() {
		return html`<p>Hello</p>`;
	}
}

customElements.define('lazy-view', LazyView);
