import { html, LitElement } from 'lit';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { people } from '../data.js';

export class Person extends LitElement {
	static properties = {
		personId: { attribute: 'person-id', type: Number },
	};

	static styles = [heading1Styles];

	render() {
		const person = people.find(p => p.id === this.personId);
		if (person === undefined) return html`<p>Person not found</p>`;
		return html`
			<h1 class="d2l-heading-1">Person: ${person.name}</h1>
			<p><a href="${person.url}">Wikipedia</a></p>
		`;
	}
}

customElements.define('test-person', Person);
