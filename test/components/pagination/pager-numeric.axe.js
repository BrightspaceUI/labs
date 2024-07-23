import '../../../src/components/pagination/pager-numeric.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
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
});
