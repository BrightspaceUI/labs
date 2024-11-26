import '../../../src/components/attribute-picker/attribute-picker-item.js';
import { expect, fixture, hoverElem, html, waitUntil } from '@brightspace-ui/testing';

describe('attribute-picker-item', () => {
	it('default', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item text="attribute"></d2l-labs-attribute-picker-item>`);
		await expect(component).to.be.golden();
	});

	it('deletable', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item text="attribute" deletable></d2l-labs-attribute-picker-item>`);
		await expect(component).to.be.golden();
	});

	it('focused', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item text="attribute"></d2l-labs-attribute-picker-item>`);
		component.focus();
		await expect(component).to.be.golden();
	});

	it('focused and deletable', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item text="attribute" deletable></d2l-labs-attribute-picker-item>`);
		component.focus();
		await expect(component).to.be.golden();
	});

	it('hover', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item text="attribute"></d2l-labs-attribute-picker-item>`);
		await hoverElem(component);
		await expect(component).to.be.golden();
	});

	it('unfocused item with hovered icon', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item text="attribute" deletable></d2l-labs-attribute-picker-item>`);
		const icon = component.shadowRoot.querySelector('d2l-icon');
		await hoverElem(icon);
		await expect(component).to.be.golden();
	});

	it('focused item with hovered icon', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item text="attribute" deletable></d2l-labs-attribute-picker-item>`);
		component.focus();
		const icon = component.shadowRoot.querySelector('d2l-icon');
		await hoverElem(icon);
		await expect(component).to.be.golden();
	});

	it('truncated', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item text="This is a very long attribute that's being used to show off truncation"></d2l-labs-attribute-picker-item>`);
		await expect(component).to.be.golden();
	});

	it('truncated with tooltip', async() => {
		const component = await fixture(html`<d2l-labs-attribute-picker-item style="margin-top: 50px;" text="This is a very long attribute that's being used to show off truncation"></d2l-labs-attribute-picker-item>`);
		const tooltip = component.shadowRoot.querySelector('d2l-tooltip');

		await hoverElem(component);
		await waitUntil(() => tooltip._truncating);
		await expect(component).to.be.golden({ margin: 75 });
	});
});
