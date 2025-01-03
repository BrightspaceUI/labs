import '../../../src/components/wizard/single-step-header.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-labs-single-step-header', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-labs-single-step-header></d2l-labs-single-step-header>`);
			await expect(el).to.be.accessible();
		});
	});

});
