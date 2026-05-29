import '../../../src/components/button-ai/button-ai.js';
import { clickElem, expect, fixture, focusElem, hoverElem, oneEvent } from '@brightspace-ui/testing';
import { html } from 'lit';

describe('button-ai', () => {

	describe('enabled', () => {

		let element;
		beforeEach(async() => {
			element = await fixture(html`<d2l-labs-button-ai text="Test"></d2l-labs-button-ai>`);
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

	describe('disabled', () => {

		let element;
		beforeEach(async() => {
			element = await fixture(html`<d2l-labs-button-ai disabled text="Test"></d2l-labs-button-ai>`);
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

	});

	describe('disabled-tooltip', () => {

		let element;
		beforeEach(async() => {
			element = await fixture(html`<d2l-labs-button-ai disabled disabled-tooltip="Custom tooltip" text="Test"></d2l-labs-button-ai>`);
		});

		it('focus', async() => {
			focusElem(element);
			await oneEvent(element, 'd2l-tooltip-show');
			await expect(element).to.be.golden();
		});

		it('hover', async() => {
			hoverElem(element);
			await oneEvent(element, 'd2l-tooltip-show');
			await expect(element).to.be.golden();
		});

	});
});
