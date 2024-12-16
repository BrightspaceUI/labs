import '../../../src/components/attribute-picker/attribute-picker.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('attribute-picker', () => {
	it('should pass all axe tests', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker label="attributes"></d2l-labs-attribute-picker>`);
		await expect(component).to.be.accessible();
	});

	it('should pass all axe tests (with required attribute)', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker required label="attributes"></d2l-labs-attribute-picker>`);
		await expect(component).to.be.accessible();
	});

	it('should pass all axe tests when populated', async() => {
		const component = await fixture(
			html`<d2l-labs-attribute-picker
					label="attributes"
					.attributeList="${['one', 'two', 'three']}"
					.assignableAttributes="${['one', 'two', 'three', 'four', 'five', 'six']}">
				</d2l-labs-attribute-picker>`
		);

		const listItems = component.shadowRoot.querySelectorAll('d2l-labs-attribute-picker-item');
		for (const item of listItems) {
			await item.updateComplete;
		}

		await expect(component).to.be.accessible({ ignoredRules: ['aria-required-children'] });
	});
});
