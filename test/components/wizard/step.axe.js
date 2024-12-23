import '../../../src/components/wizard/step.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-labs-step', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const elem = await fixture(html`<d2l-labs-step></d2l-labs-step>`);
			await expect(elem).to.be.accessible();
		});
	});

});
