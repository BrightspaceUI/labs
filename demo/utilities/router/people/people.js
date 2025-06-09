import { html, LitElement } from 'lit';
import { basePath } from '../util.js';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles';
import { people } from '../data.js';

const filters = [
	{ id: 'all', name: 'All' },
	{ id: 'actor', name: 'Actors' },
	{ id: 'scientist', name: 'Scientists' },
];

export class People extends LitElement {
	static properties = {
		filter: { type: String },
	};

	static styles = [heading1Styles];

	constructor() {
		super();
		this.filter = 'all';
	}

	render() {
		const filteredPeople = people.filter(p => {
			if (this.filter === 'all') return true;
			return p.type === this.filter;
		});
		return html`
			<h1 class="d2l-heading-1">People</h1>
			<label>
				Filter:
				<select @change="${this.#applyFilter}">
					${filters.map(f => html`<option value="${f.id}" .selected="${f.id === this.filter}">${f.name}</option>`)}
				</select>
			</label>
			<ul>
				${filteredPeople.map(p => html`<li><a href="${basePath}/people/${p.id}">${p.name}</a></li>`)}
			</ul>
		`;
	}

	#applyFilter(e) {
		this.dispatchEvent(
			new CustomEvent('filter-change', {
				detail: {
					value: e.target.options[e.target.selectedIndex].value,
				},
			})
		);
	}
}

customElements.define('test-people', People);
