import '../../../src/components/status-icon/status-icon.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-labs-status-icon', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-labs-status-icon></d2l-labs-status-icon>`);
			await expect(el).to.be.accessible();
		});
	});

});
