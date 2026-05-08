import '../../../src/components/button-subtle-ai/button-subtle-ai.js';
import { expect, fixture, focusElem, hoverElem } from '@brightspace-ui/testing';
import { html } from 'lit';

describe('button-subtle-ai', () => {
	describe('states', () => {
		it('normal', async() => {
			const element = await fixture(html`<d2l-labs-button-subtle-ai text="Test"></d2l-labs-button-subtle-ai>`);
			await expect(element).to.be.golden();
		});

		it('focus', async() => {
			const element = await fixture(html`<d2l-labs-button-subtle-ai text="Test"></d2l-labs-button-subtle-ai>`);
			await focusElem(element.shadowRoot.querySelector('d2l-button-subtle'));
			await expect(element).to.be.golden();
		});

		it('hover', async() => {
			const element = await fixture(html`<d2l-labs-button-subtle-ai text="Test"></d2l-labs-button-subtle-ai>`);
			await hoverElem(element.shadowRoot.querySelector('d2l-button-subtle'));
			await expect(element).to.be.golden();
		});
	});
});
