import '../../../src/components/pagination/pager-numeric.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

const custompageSizes = [2, 5, 37, 159];

async function createComponent({ pageNumber, maxPageNumber, showPageSizeSelector = false, pageSizes, pageSize } = {}) {
	return await fixture(html`<d2l-labs-pager-numeric
		page-number="${ifDefined(pageNumber)}"
		max-page-number="${ifDefined(maxPageNumber)}"
		?show-page-size-selector="${showPageSizeSelector}"
		.pageSizes="${pageSizes}"
		page-size="${ifDefined(pageSize)}">
	</d2l-labs-pager-numeric>`);
}

describe('pager-numeric', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-pager-numeric');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests (basic)', async() => {
			const component = await createComponent();
			await expect(component).to.be.accessible();
		});

		it('should pass all axe tests (full)', async() => {
			const component = await createComponent({ pageNumber: 1, maxPageNumber: 6, showPageSizeSelector: true, pageSizes: custompageSizes, pageSize: 20 });
			await expect(component).to.be.accessible();
		});
	});

	describe('render', () => {
		// This couldn't get turned into a vdiff test due to complications with the 'select' component
		it('should render page size selector with correct options and initial selection', async() => {
			const pageSize = custompageSizes[2];
			const component = await createComponent({ showPageSizeSelector: true, pageSizes: custompageSizes, pageSize });

			const pageSizeOptions = Array.from(component.shadowRoot.querySelectorAll('option'));
			expect(pageSizeOptions.length).to.equal(custompageSizes.length);

			custompageSizes.forEach((value, i) => {
				expect(pageSizeOptions[i].value).to.equal(value.toString());
				expect(pageSizeOptions[i].selected).to.equal(value === pageSize);
			});
		});
	});

	describe('eventing', () => {
		['previous', 'next'].forEach(button => {
			it(`should fire "d2l-labs-pager-numeric-page-change" event when ${button} button is clicked`, async() => {
				const component = await createComponent({ pageNumber: 2, maxPageNumber: 3 });
				const buttonComponent = component.shadowRoot.querySelector(`#d2l-labs-pager-numeric-${button}-button`);

				const listener = oneEvent(component, 'd2l-labs-pager-numeric-page-change');
				buttonComponent.click();
				const { detail } = await listener;
				expect(detail.page).to.equal(button === 'previous' ? 1 : 3);
			});
		});

		it('should fire "d2l-labs-pager-numeric-page-size-change" event when the page size selector value changes', async() => {
			const component = await createComponent({ showPageSizeSelector: true, pageSizes: custompageSizes, pageSize: 37 });

			const listener = oneEvent(component, 'd2l-labs-pager-numeric-page-size-change');
			const pageSizeSelector = component.shadowRoot.querySelector('select.d2l-input-select');
			pageSizeSelector.value = '5';
			pageSizeSelector.dispatchEvent(new Event('change'));

			const event = await listener;
			expect(event.detail.itemCount).to.equal(5);
		});
	});
});
