import '../../../src/components/attribute-picker/attribute-picker.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, sendKeysElem, waitUntil } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

function createAttributeList(nameList) {
	return nameList.map(name => ({
		name,
		value: `value_of_${name}`
	}));
}

const assignableAttributeList = createAttributeList(['one', 'two', 'three', 'four', 'five', 'six']);
const selectedAttributeList = createAttributeList(['one', 'two', 'three']);

async function createComponent(attributeList = [], { allowFreeform = false, required = false, limit, hasTooltip = false } = {}) {
	const styles = {
		marginTop: hasTooltip ? '25px' : ''
	};

	return await fixture(html`
		<d2l-labs-attribute-picker
			style="${styleMap(styles)}"
			.attributeList="${attributeList}"
			.assignableAttributes="${assignableAttributeList}"
			?allow-freeform=${allowFreeform}
			?required=${required}
			limit=${ifDefined(limit)}>
		</d2l-labs-attribute-picker>
	`);
}

describe('attribute-picker', () => {
	describe('empty', () => {
		it('dropdown closed', async() => {
			await createComponent();
			await expect(document).to.be.golden();
		});

		it('dropdown opened freeform off', async() => {
			const component = await createComponent();
			await focusElem(component.shadowRoot.querySelector('input'));
			await expect(document).to.be.golden();
		});

		it('dropdown opened freeform on', async() => {
			const component = await createComponent([], { allowFreeform: true });
			await focusElem(component.shadowRoot.querySelector('input'));
			await expect(document).to.be.golden();
		});

		it('dropdown filtered', async() => {
			const component = await createComponent();
			const input = component.shadowRoot.querySelector('input');
			await focusElem(input);
			await sendKeysElem(input, 'type', 'f');
			await expect(document).to.be.golden();
		});
	});

	describe('with attributes', () => {
		it('dropdown closed', async() => {
			await createComponent(selectedAttributeList);
			await expect(document).to.be.golden();
		});

		it('dropdown opened', async() => {
			const component = await createComponent(selectedAttributeList);
			await focusElem(component.shadowRoot.querySelector('input'));
			await expect(document).to.be.golden();
		});
	});

	describe('interactions', () => {
		describe('adding attributes', () => {
			it('via dropdown (click)', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				await focusElem(component.shadowRoot.querySelector('input'));
				await waitUntil(() => component._dropdownIndex === 0);
				const selectedItem = component.shadowRoot.querySelector('.d2l-attribute-picker-li[aria-selected="true"]');

				await clickElem(selectedItem);
				await listener;
				await expect(document).to.be.golden();
			});

			it('via dropdown (enter)', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				await focusElem(component.shadowRoot.querySelector('input'));
				await waitUntil(() => component._dropdownIndex === 0);
				const selectedItem = component.shadowRoot.querySelector('.d2l-attribute-picker-li[aria-selected="true"]');

				await sendKeysElem(selectedItem, 'press', 'Enter');
				await listener;
				await expect(document).to.be.golden();
			});

			it('via typing (partial match)', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				const input = component.shadowRoot.querySelector('input');
				await focusElem(input);
				await sendKeysElem(input, 'type', 'fo'); // partially matches 'four'
				await sendKeysElem(input, 'press', 'Enter');
				await listener;
				await expect(document).to.be.golden();
			});

			it('via typing (freeform)', async() => {
				const component = await createComponent(selectedAttributeList, { allowFreeform: true });
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				const input = component.shadowRoot.querySelector('input');
				await focusElem(input);
				await sendKeysElem(input, 'type', 'new attribute');
				await sendKeysElem(input, 'press', 'Enter');
				await listener;
				await expect(document).to.be.golden();
			});
		});

		describe('removing attributes', () => {
			it('via delete button', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				const secondItem = component.shadowRoot.querySelector('d2l-labs-attribute-picker-item:nth-of-type(2)');
				await focusElem(secondItem);
				await secondItem.updateComplete;
				await clickElem(secondItem.shadowRoot.querySelector('d2l-button-icon'));
				await listener;
				await expect(document).to.be.golden();
			});

			it('via delete key', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				const secondItem = component.shadowRoot.querySelector('d2l-labs-attribute-picker-item:nth-of-type(2)');
				await focusElem(secondItem);
				await sendKeysElem(secondItem, 'press', 'Delete');
				await listener;
				await expect(document).to.be.golden();
			});

			it('via backspace key', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				const secondItem = component.shadowRoot.querySelector('d2l-labs-attribute-picker-item:nth-of-type(2)');
				await focusElem(secondItem);
				await sendKeysElem(secondItem, 'press', 'Backspace');
				await listener;
				await expect(document).to.be.golden();
			});
		});
	});

	describe('error handling', () => {
		it('marked invalid if empty and required', async() => {
			const component = await createComponent([], { required: true });
			await focusElem(component.shadowRoot.querySelector('input'));
			component.shadowRoot.querySelector('input').blur();
			await expect(document).to.be.golden();
		});

		it('tooltip when limit reached', async() => {
			const component = await createComponent(selectedAttributeList, { limit: 3, hasTooltip: true });
			await focusElem(component.shadowRoot.querySelector('input'));
			await waitUntil(() => component._dropdownIndex === 0);
			const selectedItem = component.shadowRoot.querySelector('.d2l-attribute-picker-li[aria-selected="true"]');

			clickElem(selectedItem);
			await oneEvent(component, 'd2l-labs-attribute-picker-limit-reached');
			await expect(document).to.be.golden();
		});
	});
});
