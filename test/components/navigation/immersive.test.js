import '../../../src/components/navigation/navigation-immersive.js';
import { clickElem, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-labs-navigation-immersive', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-navigation-immersive');
		});
	});

	describe('events', () => {

		it('should fire back-link-click event', async() => {
			const el = await fixture(html`<d2l-labs-navigation-immersive></d2l-labs-navigation-immersive>`);
			const backLink = el
				.shadowRoot.querySelector('d2l-labs-navigation-link-back')
				.shadowRoot.querySelector('d2l-labs-navigation-link-icon')
				.shadowRoot.querySelector('a');
			clickElem(backLink);
			await oneEvent(el, 'd2l-labs-navigation-immersive-back-click');
		});

	});

});
