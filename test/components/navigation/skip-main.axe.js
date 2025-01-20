import '../../../src/components/navigation/navigation-skip-main.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-labs-navigation-skip-main', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-navigation-skip-main></d2l-labs-navigation-skip-main>`);
			await expect(el).to.be.accessible();
		});
	});;
});
