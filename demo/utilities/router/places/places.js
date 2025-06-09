import { html, LitElement } from 'lit';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { places } from '../data.js';

export class Places extends LitElement {
	static styles = [heading1Styles];

	render() {
		return html`
			<h1 class="d2l-heading-1">Places</h1>
			<ul>
				${places.map(p => html`<li><a href="/demo/utilities/router/places/${p.id}">${p.name}</a></li>`)}
			</ul>
		`;
	}
}

customElements.define('test-places', Places);
