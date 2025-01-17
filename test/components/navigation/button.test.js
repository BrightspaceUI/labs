import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '../../../src/components/navigation/navigation-button-icon.js';
import '../../../src/components/navigation/navigation-dropdown-button-custom.js';
import '../../../src/components/navigation/navigation-dropdown-button-icon.js';
import '../../../src/components/navigation/navigation-notification-icon.js';
import { fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-navigation-dropdown-button-icon', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-dropdown-button-icon');
		});
	});

});

describe('d2l-navigation-dropdown-button-custom', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-dropdown-button-custom');
		});
	});

});

describe('d2l-navigation-button-icon', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-button-icon');
		});
	});

	describe('events', () => {
		it('should trigger click event', async() => {
			const el = await fixture(html`<d2l-navigation-button-icon icon="tier3:gear" text="test"></d2l-navigation-button-icon>`);
			setTimeout(() => el.shadowRoot.querySelector('button').click());
			await oneEvent(el, 'click');
		});
	});

});

describe('d2l-navigation-notification-icon', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-notification-icon');
		});
	});

});
