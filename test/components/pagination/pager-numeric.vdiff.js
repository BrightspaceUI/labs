import '../../../src/components/pagination/pager-numeric.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

async function createComponent({ pageNumber, maxPageNumber, showPageSizeSelector = false, pageSizes, pageSize, rtl = false } = {}) {
	return await fixture(html`<d2l-labs-pager-numeric
		page-number="${ifDefined(pageNumber)}"
		max-page-number="${ifDefined(maxPageNumber)}"
		?show-page-size-selector="${showPageSizeSelector}"
		.pageSizes="${pageSizes}"
		page-size="${ifDefined(pageSize)}">
	</d2l-labs-pager-numeric>`, {
		rtl
	});
}

describe('pager-numeric', () => {
	it('default state', async() => {
		const component = await createComponent();
		await expect(component).to.be.golden();
	});

	it('custom attribute values', async() => {
		const component = await createComponent({ pageNumber: 1, maxPageNumber: 6 });
		await expect(component).to.be.golden();
	});

	it('with default page size selector', async() => {
		const component = await createComponent({ showPageSizeSelector: true });
		await expect(component).to.be.golden();
	});

	it('with custom page size selector', async() => {
		const component = await createComponent({ showPageSizeSelector: true, pageSizes: [1, 2, 3, 5, 8], pageSize: 3 });
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
