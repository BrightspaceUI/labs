import '../accessible-grid.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-accessible-grid', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-accessible-grid></d2l-accessible-grid>`);
		await expect(elem).to.be.golden();
	});

});
