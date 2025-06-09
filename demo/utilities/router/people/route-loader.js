import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { redirect } from '../../../../src/utilities/router/index.js';

function handleFilterChange(e) {
	redirect(`/demo/utilities/router/people?filter=${e.detail.value}`);
}

export function loader() {
	return [
		{
			pattern: '/people',
			loader: () => import('./people.js'),
			view: ctx => html` <test-people
				@filter-change="${handleFilterChange}"
				filter="${ifDefined(ctx.search.filter)}"
			></test-people>`,
		},
		{
			pattern: '/people/:id',
			loader: () => import('./person.js'),
			view: ctx =>
				html`<test-person person-id="${ctx.params.id}"></test-person>`,
		},
	];
}
