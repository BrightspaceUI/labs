import '../../../src/components/navigation/navigation-iterator.js';
import { expect, fixture, hoverElem, html } from '@brightspace-ui/testing';

describe('d2l-labs-navigation-iterator', () => {

	describe('iterator', () => {

		[
			{ name: 'default', template: html`<d2l-labs-navigation-iterator></d2l-labs-navigation-iterator>` },
			{ name: 'hide-text', template: html`<d2l-labs-navigation-iterator hide-text></d2l-labs-navigation-iterator>` },
			{ name: 'disabled', template: html`<d2l-labs-navigation-iterator previous-disabled next-disabled></d2l-labs-navigation-iterator>` },
			{ name: 'custom-text', template: html`<d2l-labs-navigation-iterator previous-text="Back" next-text="Forward"></d2l-labs-navigation-iterator>` },
			{ name: 'slot', template: html`<d2l-labs-navigation-iterator>Hello</d2l-labs-navigation-iterator>` }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template, { viewport: { width: 366 } });
				await expect(elem).to.be.golden();
			});
		});

	});

	describe('no-highlight-border', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`<d2l-labs-navigation-iterator no-highlight-border></d2l-labs-navigation-iterator>`, { viewport: { width: 366 } });
		});

		it('default', async() => {
			await expect(elem).to.be.golden();
		});

		it('previous-hover', async() => {
			await hoverElem(elem.shadowRoot.querySelector('d2l-labs-navigation-button-icon[icon-position="start"]'));
			await expect(elem).to.be.golden();
		});

		it('next-hover', async() => {
			await hoverElem(elem.shadowRoot.querySelector('d2l-labs-navigation-button-icon[icon-position="end"]'));
			await expect(elem).to.be.golden();
		});

	});

});
