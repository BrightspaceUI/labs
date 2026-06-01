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

		[false, true].forEach(hasTooltip => {
			it(`should pass all aXe tests (disabled with${!hasTooltip ? 'out' : ''} tooltip)`, async() => {
				const el = await fixture(html`<d2l-labs-checkbox-drawer label="Label" disabled disabled-tooltip=${hasTooltip ? 'This option is disabled.' : ''}></d2l-labs-checkbox-drawer>`);
				await expect(el).to.be.accessible();
			});
		});
	});

});
