import '../../../src/components/navigation/d2l-navigation-immersive.js';
import { clickElem, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-navigation-immersive', () => {

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
