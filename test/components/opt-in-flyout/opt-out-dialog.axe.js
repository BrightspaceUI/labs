import '../../../src/components/opt-in-flyout/opt-out-dialog.js';
import '../../../src/components/opt-in-flyout/opt-out-reason.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('opt-out-dialog', () => {

	let elem;
	beforeEach(async() => {
		elem = await fixture(html`<d2l-labs-opt-out-dialog></d2l-labs-opt-out-dialog>`);
	});

	describe('accessibility', () => {

		it('should be accessible', async() => {
			await expect(elem).to.be.accessible();
		});

	});

});
