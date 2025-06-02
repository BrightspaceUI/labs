import '../../../src/components/wizard/wizard-step.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-labs-wizard-step', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const elem = await fixture(html`<d2l-labs-wizard-step></d2l-labs-wizard-step>`);
			await expect(elem).to.be.accessible();
		});
	});

});
