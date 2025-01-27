import '../../../src/components/navigation/navigation-skip.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';const customFixture = html`<d2l-labs-navigation-skip text="Skip to custom place"></d2l-labs-navigation-skip>`;

describe('d2l-labs-navigation-skip', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const elem = await fixture(customFixture);
			await focusElem(elem);
			await expect(elem).to.be.accessible();
		});

	});

});
