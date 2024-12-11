import '../../../src/components/view-toggle/view-toggle.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const basicFixture = html`<d2l-labs-view-toggle
	toggleOptions='[{"text":"Bananas","val":"overall"},{"text":"Minions","val":"minios"},{"text":"Pyjamas","val":"subject"}]'
	text="Toggle: ">
</d2l-labs-view-toggle>`;

describe('d2l-labs-view-toggle', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(basicFixture);
			await expect(el).to.be.accessible();
		});
	});

});
