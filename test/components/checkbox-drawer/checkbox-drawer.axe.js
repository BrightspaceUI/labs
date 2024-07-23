import '../../../src/components/checkbox-drawer/checkbox-drawer.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('checkbox-drawer', () => {

	describe('accessibility', () => {
		[false, true].forEach(checked => {
			it(`should pass all aXe tests (${!checked ? 'un' : ''}checked)`, async() => {
				const el = await fixture(html`<d2l-labs-checkbox-drawer label="Label" ?checked=${checked}></d2l-labs-checkbox-drawer>`);
				await expect(el).to.be.accessible();
			});
		});
	});

});
