import '../../../src/components/navigation/navigation-iterator.js';
import { expect, fixture, hoverElem, html } from '@brightspace-ui/testing';const iteratorFixture = html`<d2l-labs-navigation-iterator></d2l-labs-navigation-iterator>`;

describe('d2l-labs-navigation-iterator', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const el = await fixture(iteratorFixture);
			await expect(el).to.be.accessible();
		});

		it('should pass all aXe tests with no-highlight-border', async() => {
			const el = await fixture(html`<d2l-labs-navigation-iterator no-highlight-border></d2l-labs-navigation-iterator>`);
			await expect(el).to.be.accessible();
		});

		it('should pass all aXe tests with no-highlight-border on previous-hover', async() => {
			const el = await fixture(html`<d2l-labs-navigation-iterator no-highlight-border></d2l-labs-navigation-iterator>`);
			await hoverElem(el.shadowRoot.querySelector('d2l-labs-navigation-button-icon[icon-position="start"]'));
			await expect(el).to.be.accessible();
		});

		it('should pass all aXe tests with no-highlight-border on next-hover', async() => {
			const el = await fixture(html`<d2l-labs-navigation-iterator no-highlight-border></d2l-labs-navigation-iterator>`);
			await hoverElem(el.shadowRoot.querySelector('d2l-labs-navigation-button-icon[icon-position="end"]'));
			await expect(el).to.be.accessible();
		});

	});

});
