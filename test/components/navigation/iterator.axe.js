import '../../../src/components/navigation/navigation-iterator.js';
import { expect, fixture, html } from '@brightspace-ui/testing';const iteratorFixture = html`<d2l-labs-navigation-iterator></d2l-labs-navigation-iterator>`;

describe('d2l-labs-navigation-iterator', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const el = await fixture(iteratorFixture);
			await expect(el).to.be.accessible();
		});

	});

});
