import '../../../src/components/card-overlay/card-overlay.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('CardOverlay', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-card-overlay></d2l-labs-card-overlay>`);
			await expect(el).to.be.accessible();
		});
	});

});
