import '../d2l-navigation-immersive.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-navigation-immersive', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-navigation-immersive width-type="normal" back-link-href="https://www.d2l.com"></d2l-navigation-immersive>`);
			await expect(el).to.be.accessible();
		});

	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-immersive');
		});
	});

	describe('events', () => {

		it('should fire back-link-click event', async() => {
			const el = await fixture(html`<d2l-navigation-immersive></d2l-navigation-immersive>`);
			const backLink = el
				.shadowRoot.querySelector('d2l-navigation-link-back')
				.shadowRoot.querySelector('d2l-navigation-link-icon')
				.shadowRoot.querySelector('a');
			clickElem(backLink);
			await oneEvent(el, 'd2l-navigation-immersive-back-click');
		});

	});

});
