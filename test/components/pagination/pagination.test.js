import '../../../src/components/pagination/pagination.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const customItemCountOptions = [2, 5, 37, 159];

async function createComponent({ pageNumber, maxPageNumber, showItemCountSelect = false, itemCountOptions, selectedCountOption } = {}) {
	return await fixture(html`<d2l-labs-pagination
		page-number="${ifDefined(pageNumber)}"
		max-page-number="${ifDefined(maxPageNumber)}"
		?show-item-count-select="${showItemCountSelect}"
		.itemCountOptions="${ifDefined(itemCountOptions)}"
		selected-count-option="${ifDefined(selectedCountOption)}">
	</d2l-labs-pagination>`);
}

describe('pagination', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-pagination');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests (basic)', async() => {
			const component = await createComponent();
			await expect(component).to.be.accessible();
		});

		it('should pass all axe tests (full)', async() => {
			const component = await createComponent({ pageNumber: 1, maxPageNumber: 6, showItemCountSelect: true, itemCountOptions: customItemCountOptions, selectedCountOption: 20 });
			await expect(component).to.be.accessible();
		});
	});

	describe('render', () => {
		// This couldn't get turned into a vdiff test due to complications with the 'select' component
		it('should render page size selector with correct options and initial selection', async() => {
			const selectedCountOption = customItemCountOptions[2];
			const component = await createComponent({ showItemCountSelect: true, itemCountOptions: customItemCountOptions, selectedCountOption });

			const pageSizeOptions = Array.from(component.shadowRoot.querySelectorAll('option'));
			expect(pageSizeOptions.length).to.equal(customItemCountOptions.length);

			customItemCountOptions.forEach((value, i) => {
				expect(pageSizeOptions[i].value).to.equal(value.toString());
				expect(pageSizeOptions[i].selected).to.equal(value === selectedCountOption);
			});
		});
	});

	describe('eventing', () => {
		['previous', 'next'].forEach(button => {
			it(`should fire "d2l-labs-pagination-page-change" event when ${button} button is clicked`, async() => {
				const component = await createComponent({ pageNumber: 2, maxPageNumber: 3 });
				const buttonComponent = component.shadowRoot.querySelector(`#d2l-labs-pagination-${button}-button`);

				const listener = oneEvent(component, 'd2l-labs-pagination-page-change');
				buttonComponent.click();
				const { detail } = await listener;
				expect(detail.page).to.equal(button === 'previous' ? 1 : 3);
			});
		});

		it('should fire "d2l-labs-pagination-item-counter-change" event when the page size selector value changes', async() => {
			const component = await createComponent({ showItemCountSelect: true, itemCountOptions: customItemCountOptions, selectedCountOption: 37 });

			const listener = oneEvent(component, 'd2l-labs-pagination-item-counter-change');
			const pageSizeSelector = component.shadowRoot.querySelector('select.d2l-input-select');
			pageSizeSelector.value = '5';
			pageSizeSelector.dispatchEvent(new Event('change'));

			const event = await listener;
			expect(event.detail.itemCount).to.equal(5);
		});
	});
});
