import '../../../src/components/grid/grid.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-accessible-grid', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-accessible-grid></d2l-accessible-grid>`);
			await expect(el).to.be.accessible();
		});
	});

});
