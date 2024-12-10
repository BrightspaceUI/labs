import '../../../src/components/attribute-picker/attribute-picker-item.js';
import { expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

async function createComponent(deletable = false) {
	return await fixture(html`<d2l-labs-attribute-picker-item text="attribute" ?deletable=${deletable}></d2l-labs-attribute-picker-item>`);
}

describe('attribute-picker-item', () => {
	it('default', async() => {
		const component = await createComponent();
		await expect(component).to.be.golden();
	});

	it('deletable', async() => {
		const component = await createComponent(true);
		await expect(component).to.be.golden();
	});

	it('focused', async() => {
		const component = await createComponent();
		await focusElem(component);
		await expect(component).to.be.golden();
	});

	it('focused and deletable', async() => {
		const component = await createComponent(true);
		await focusElem(component);
		await expect(component).to.be.golden();
	});

	it('hover', async() => {
		const component = await createComponent();
		await hoverElem(component);
		await expect(component).to.be.golden();
	});

	it('unfocused item with hovered icon', async() => {
		const component = await createComponent(true);
		const icon = component.shadowRoot.querySelector('d2l-button-icon');
		await hoverElem(icon);
		await expect(component).to.be.golden();
	});

	it('focused item with hovered icon', async() => {
		const component = await createComponent(true);
		await focusElem(component);
		const icon = component.shadowRoot.querySelector('d2l-button-icon');
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

		hoverElem(component);
		await oneEvent(tooltip, 'd2l-tooltip-show');
		await expect(component).to.be.golden({ margin: 75 });
	});
});
