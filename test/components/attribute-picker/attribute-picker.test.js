import '../../../src/components/attribute-picker/attribute-picker.js';
import { expect, fixture, focusElem, html, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';

function createAttributeList(nameList) {
	return nameList.map(name => ({
		name,
		value: `value_of_${name}`
	}));
}

const assignableAttributeList = createAttributeList(['one', 'two', 'three', 'four', 'five', 'six']);
const attributeList = createAttributeList(['one', 'two', 'three']);
const shortAttributeList = createAttributeList(['one', 'two']);

async function createComponent(attributeList, { allowFreeform = true, limit = 100 } = {}) {
	const component = await fixture(
		html`
			<d2l-labs-attribute-picker
				?allow-freeform=${allowFreeform}
				.attributeList="${attributeList}"
				.assignableAttributes="${assignableAttributeList}"
				limit=${limit}>
			</d2l-labs-attribute-picker>`
	);

	const listItems = component.shadowRoot.querySelectorAll('d2l-labs-attribute-picker-item');
	for (const item of listItems) {
		await item.updateComplete;
	}

	return component;
}

describe('attribute-picker', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-attribute-picker');
		});
	});

	describe('interaction', () => {
		it('should prevent unlisted if allow-freeform is disabled.', async() => {
			const component = await createComponent(attributeList, { allowFreeform: false });
			const input = component.shadowRoot.querySelector('input');
			await focusElem(input);

			await sendKeysElem(input, 'type', 'unlisted attribute');
			await sendKeysElem(input, 'press', 'Enter');
			expect(component.attributeList[component.attributeList.length - 1]).to.not.equal('unlisted attribute');
		});

		async function changeDirection(component, input, direction, expectedIndex) {
			await sendKeysElem(input, 'press', direction);
			const selectedDropdown = component.shadowRoot.querySelector('.d2l-attribute-picker-li[aria-selected="true"]');
			expect(selectedDropdown.innerText).to.equal(assignableAttributeList[expectedIndex].name);
		}

		it('should scroll through the dropdown using the up and down arrow keys (updated)', async() => {
			const component = await createComponent(attributeList);
			const input = component.shadowRoot.querySelector('input');
			await focusElem(input);

			// In freeform mode, pressing down should focus the first list item.
			await changeDirection(component, input, 'ArrowDown', 3);
			await changeDirection(component, input, 'ArrowDown', 4);
			await changeDirection(component, input, 'ArrowDown', 5);
			await changeDirection(component, input, 'ArrowDown', 3);
			await changeDirection(component, input, 'ArrowUp', 5);
			await changeDirection(component, input, 'ArrowUp', 4);
		});

		it('should scroll through tags using left and right arrow keys', async() => {
			const component = await createComponent(shortAttributeList);
			const input = component.shadowRoot.querySelector('input');
			await focusElem(input);

			// Select last attribute
			await sendKeysElem(input, 'press', 'ArrowLeft');
			const attributeElements = component.shadowRoot.querySelectorAll('.d2l-attribute-picker-attribute');
			let focusElement = component.shadowRoot.querySelector(':focus');
			expect(attributeElements[1].innerText).to.equal(focusElement.innerText);

			// Navigate to first attribute
			await sendKeysElem(focusElement, 'press', 'ArrowLeft');
			focusElement = component.shadowRoot.querySelector(':focus');

			expect(attributeElements[0].innerText).to.equal(focusElement.innerText);

			// Confirm going left further has no effect
			await sendKeysElem(focusElement, 'press', 'ArrowLeft');
			focusElement = component.shadowRoot.querySelector(':focus');
			expect(attributeElements[0].innerText).to.equal(focusElement.innerText);

			// Navigate right to last attribute
			await sendKeysElem(focusElement, 'press', 'ArrowRight');
			focusElement = component.shadowRoot.querySelector(':focus');
			expect(attributeElements[1].innerText).to.equal(focusElement.innerText);

			// Navigate right to return to the input field
			await sendKeysElem(focusElement, 'press', 'ArrowRight');
			focusElement = component.shadowRoot.querySelector(':focus');
			expect(focusElement).to.equal(input);
		});

		it('should convert different capitalization into capitalization matching an available attribute if any exist', async() => {
			const component = await createComponent(shortAttributeList, { limit: 5 });
			const input = component.shadowRoot.querySelector('input');
			expect(component.attributeList.length).to.equal(shortAttributeList.length);

			await focusElem(input);
			await sendKeysElem(input, 'type', 'ThReE');
			await sendKeysElem(input, 'press', 'Enter');

			expect(component.attributeList.length).to.equal(attributeList.length);
			expect(component.attributeList).to.deep.equal(attributeList);

			await sendKeysElem(input, 'type', 'THREE');
			await sendKeysElem(input, 'press', 'Enter');

			expect(component.attributeList).to.deep.equal(attributeList);
		});
	});

	describe('eventing', () => {
		it('should fire the d2l-labs-attribute-picker-limit-reached event when attempting to add a tag beyond the limit', async() => {
			const component = await createComponent(attributeList, { limit: 5 });

			const listener = oneEvent(component, 'd2l-labs-attribute-picker-limit-reached');
			const input = component.shadowRoot.querySelector('input');
			expect(component.attributeList.length).to.equal(3);

			await focusElem(input);
			await sendKeysElem(input, 'type', 'four');
			await sendKeysElem(input, 'press', 'Enter');

			expect(component.attributeList.length).to.equal(4);
			await sendKeysElem(input, 'type', 'five');
			await sendKeysElem(input, 'press', 'Enter');

			expect(component.attributeList.length).to.equal(5);
			await sendKeysElem(input, 'type', 'six');
			await sendKeysElem(input, 'press', 'Enter');

			const { detail } = await listener;
			expect(detail.limit).to.equal(5);
			expect(component.attributeList.length).to.equal(5);
		});

		it('should fire the d2l-labs-attribute-picker-text-changed event when inputting text into the text input', async() => {
			const component = await createComponent(attributeList, { limit: 5 });

			const input = component.shadowRoot.querySelector('input');

			sendKeysElem(input, 'type', 'a');
			const { detail: detail1 } = await oneEvent(component, 'd2l-labs-attribute-picker-text-changed');
			expect(detail1.text).to.equal('a');

			sendKeysElem(input, 'type', 'b');
			const { detail: detail2 } = await oneEvent(component, 'd2l-labs-attribute-picker-text-changed');
			expect(detail2.text).to.equal('ab');

			sendKeysElem(input, 'type', 'c');
			const { detail: detail3 } = await oneEvent(component, 'd2l-labs-attribute-picker-text-changed');
			expect(detail3.text).to.equal('abc');
		});
	});
});
