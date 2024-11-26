import '../../../src/components/attribute-picker/attribute-picker-item.js';
import { fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('attribute-picker-item', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-attribute-picker-item');
		});
	});

	describe('eventing', () => {
		it('should fire d2l-labs-attribute-picker-item-delete when delete button is clicked', async() => {
			const component = await fixture(html`<d2l-labs-attribute-picker-item text="attribute" deletable></d2l-labs-attribute-picker-item>`);
			const listener = oneEvent(component, 'd2l-labs-attribute-picker-item-deleted');
			component.shadowRoot.querySelector('d2l-icon').click();
			await listener;
		});
	});
});
