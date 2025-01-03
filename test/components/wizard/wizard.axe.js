import '../../../src/components/wizard/wizard.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-labs-wizard', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-labs-wizard></d2l-labs-wizard>`);
			await expect(el).to.be.accessible();
		});
	});

});
