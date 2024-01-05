import '../../../src/components/pagination/pagination.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

async function createComponent({ pageNumber, maxPageNumber, showItemCountSelect = false, itemCountOptions, selectedCountOption, rtl = false } = {}) {
	return await fixture(html`<d2l-labs-pagination
		page-number="${ifDefined(pageNumber)}"
		max-page-number="${ifDefined(maxPageNumber)}"
		?show-item-count-select="${showItemCountSelect}"
		.itemCountOptions="${ifDefined(itemCountOptions)}"
		selected-count-option="${ifDefined(selectedCountOption)}">
	</d2l-labs-pagination>`, {
		rtl
	});
}

describe('pagination', () => {
	it('default state', async() => {
		const component = await createComponent();
		await expect(component).to.be.golden();
	});

	it('custom attribute values', async() => {
		const component = await createComponent({ pageNumber: 1, maxPageNumber: 6 });
		await expect(component).to.be.golden();
	});

	it('with default page size selector', async() => {
		const component = await createComponent({ showItemCountSelect: true });
		await expect(component).to.be.golden();
	});

	it('with custom page size selector', async() => {
		const component = await createComponent({ showItemCountSelect: true, itemCountOptions: [1, 2, 3, 5, 8], selectedCountOption: 3 });
		await expect(component).to.be.golden();
	});

	describe('arrow button states', () => {
		describe('ltr', () => {
			it('previous button disabled if first page', async() => {
				const component = await createComponent({ pageNumber: 1, maxPageNumber: 3 });
				await expect(component).to.be.golden();
			});

			it('next button disabled if last page', async() => {
				const component = await createComponent({ pageNumber: 3, maxPageNumber: 3 });
				await expect(component).to.be.golden();
			});
		});

		describe('rtl', () => {
			it('previous button disabled if first page', async() => {
				const component = await createComponent({ pageNumber: 1, maxPageNumber: 3, rtl: true });
				await expect(component).to.be.golden();
			});

			it('next button disabled if last page', async() => {
				const component = await createComponent({ pageNumber: 3, maxPageNumber: 3, rtl: true });
				await expect(component).to.be.golden();
			});
		});

		it('neither button disabled if not first or last page', async() => {
			const component = await createComponent({ pageNumber: 2, maxPageNumber: 3 });
			await expect(component).to.be.golden();
		});
	});
});
