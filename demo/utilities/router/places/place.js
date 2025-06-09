import { html, LitElement } from 'lit';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { places } from '../data.js';

export class Place extends LitElement {
	static properties = {
		placeId: { attribute: 'place-id', type: Number },
	};

	static styles = [heading1Styles];

	render() {
		const place = places.find(p => p.id === this.placeId);
		if (place === undefined) return html`<p>Place not found</p>`;
		return html`
			<h1 class="d2l-heading-1">Place: ${place.name}</h1>
			<p>Name: <a href="${place.url}">Wikipedia</a></p>
			<img src="${place.image}" alt="${place.name}" />
		`;
	}
}

customElements.define('test-place', Place);
