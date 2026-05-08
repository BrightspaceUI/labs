import '../../../src/components/button-ai/button-subtle-ai.js';
import { clickElem, expect, fixture, focusElem, hoverElem } from '@brightspace-ui/testing';
import { html } from 'lit';

describe('button-subtle-ai', () => {
	describe('states', () => {

		let element;
		beforeEach(async() => {
			element = await fixture(html`<d2l-labs-button-subtle-ai text="Test"></d2l-labs-button-subtle-ai>`);
		});

		it('normal', async() => {
			await expect(element).to.be.golden();
		});

		it('focus', async() => {
			await focusElem(element);
			await expect(element).to.be.golden();
		});

		it('hover', async() => {
			await hoverElem(element);
			await expect(element).to.be.golden();
		});

		it('clicked', async() => {
			await clickElem(element);
			await expect(element).to.be.golden();
		});
	});
});
