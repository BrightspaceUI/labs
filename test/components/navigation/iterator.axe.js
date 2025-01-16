import '../../../src/components/navigation/d2l-navigation-iterator.js';
import { expect, fixture, html } from '@brightspace-ui/testing';const iteratorFixture = html`<d2l-navigation-iterator></d2l-navigation-iterator>`;

describe('d2l-navigation-iterator', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const el = await fixture(iteratorFixture);
			await expect(el).to.be.accessible();
		});

	});

});
