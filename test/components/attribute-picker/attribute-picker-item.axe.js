import '../../../src/components/attribute-picker/attribute-picker-item.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('attribute-picker-item', () => {
	it('should pass all axe tests', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item text="This is an attribute"></d2l-labs-attribute-picker-item>`);
		await expect(component).to.be.accessible();
	});
});
