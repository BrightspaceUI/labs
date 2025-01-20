import '../../../src/components/navigation/navigation-immersive.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-labs-navigation-immersive', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-navigation-immersive width-type="normal" back-link-href="https://www.d2l.com"></d2l-labs-navigation-immersive>`);
			await expect(el).to.be.accessible();
		});

	});

});
