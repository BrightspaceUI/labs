import '../../../src/components/attribute-picker/attribute-picker.js';
import { clickElem, expect, fixture, html, oneEvent, sendKeysElem, waitUntil } from '@brightspace-ui/testing';

function createAttributeList(nameList) {
	return nameList.map(name => ({
		name,
		value: `value_of_${name}`
	}));
}

const assignableAttributeList = createAttributeList(['one', 'two', 'three', 'four', 'five', 'six']);
const selectedAttributeList = createAttributeList(['one', 'two', 'three']);

async function createComponent(attributeList = [], { allowFreeform = false, required = false } = {}) {
	return await fixture(html`
		<d2l-labs-attribute-picker
			.attributeList="${attributeList}"
			.assignableAttributes="${assignableAttributeList}"
			?allow-freeform=${allowFreeform}
			?required=${required}>
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
			component.shadowRoot.querySelector('input').focus();
			await expect(document).to.be.golden();
		});

		it('dropdown opened freeform on', async() => {
			const component = await createComponent([], { allowFreeform: true });
			component.shadowRoot.querySelector('input').focus();
			await expect(document).to.be.golden();
		});

		it('dropdown filtered', async() => {
			const component = await createComponent();
			component._text = 'f';
			component.shadowRoot.querySelector('input').focus();
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
			component.shadowRoot.querySelector('input').focus();
			await expect(document).to.be.golden();
		});
	});

	describe('interactions', () => {
		describe('adding attributes', () => {
			it('via dropdown (click)', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				component.shadowRoot.querySelector('input').focus();
				await waitUntil(() => component._dropdownIndex === 0);
				const selectedItem = component.shadowRoot.querySelector('.d2l-attribute-picker-li[aria-selected="true"]');

				await clickElem(selectedItem);
				await listener;
				await expect(document).to.be.golden();
			});

			it('via dropdown (enter)', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				component.shadowRoot.querySelector('input').focus();
				await waitUntil(() => component._dropdownIndex === 0);
				const selectedItem = component.shadowRoot.querySelector('.d2l-attribute-picker-li[aria-selected="true"]');

				await sendKeysElem(selectedItem, 'press', 'Enter');
				await listener;
				await expect(document).to.be.golden();
			});

			it('via typing (partial match)', async() => {
				const component = await createComponent(selectedAttributeList);
				component._text = 'fo'; // partially matches 'four'
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				const input = component.shadowRoot.querySelector('input');
				input.focus();
				await sendKeysElem(input, 'press', 'Enter');
				await listener;
				await expect(document).to.be.golden();
			});

			it('via typing (freeform)', async() => {
				const component = await createComponent(selectedAttributeList, { allowFreeform: true });
				component._text = 'new attribute';
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				const input = component.shadowRoot.querySelector('input');
				input.focus();
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
				const deleteButton = secondItem.shadowRoot.querySelector('d2l-icon');
				deleteButton.click();
				await listener;
				await expect(document).to.be.golden();
			});

			it('via delete key', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				const secondItem = component.shadowRoot.querySelector('d2l-labs-attribute-picker-item:nth-of-type(2)');
				secondItem.focus();
				await sendKeysElem(secondItem, 'press', 'Delete');
				await listener;
				await expect(document).to.be.golden();
			});

			it('via backspace key', async() => {
				const component = await createComponent(selectedAttributeList);
				const listener = oneEvent(component, 'd2l-labs-attribute-picker-attributes-changed');
				const secondItem = component.shadowRoot.querySelector('d2l-labs-attribute-picker-item:nth-of-type(2)');
				secondItem.focus();
				await sendKeysElem(secondItem, 'press', 'Backspace');
				await listener;
				await expect(document).to.be.golden();
			});
		});
	});

	describe('error handling', () => {
		it('marked invalid if empty and required', async() => {
			const component = await createComponent([], { required: true });
			component.shadowRoot.querySelector('input').focus();
			component.shadowRoot.querySelector('input').blur();
			await expect(document).to.be.golden();
		});
	});
});
