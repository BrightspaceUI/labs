import '../../../src/components/card-overlay/card-overlay.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-labs-card-overlay', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-labs-card-overlay skeleton></d2l-labs-card-overlay>`);
		await expect(elem).to.be.golden();
	});

});
