import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '../d2l-navigation-button-icon.js';
import '../d2l-navigation-dropdown-button-custom.js';
import '../d2l-navigation-dropdown-button-icon.js';
import '../d2l-navigation-notification-icon.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '@brightspace-ui/core/helpers/focus.js';

describe('Buttons', () => {

	describe('d2l-navigation-dropdown-button-icon', () => {

		describe('accessibility', () => {

			it('default', async() => {
				const el = await fixture(html`<d2l-navigation-dropdown-button-icon icon="tier3:notification-bell" text="test"><d2l-dropdown-content>content</d2l-dropdown-content></d2l-navigation-dropdown-button-icon>`);
				await expect(el).to.be.accessible();
			});

			it('disabled', async() => {
				const el = await fixture(html`<d2l-navigation-dropdown-button-icon icon="tier3:notification-bell" text="test" disabled><d2l-dropdown-content>content</d2l-dropdown-content></d2l-navigation-dropdown-button-icon>`);
				await expect(el).to.be.accessible();
			});

			it('with notification', async() => {
				const el = await fixture(html`<d2l-navigation-dropdown-button-icon icon="tier3:notification-bell" text="test" has-notification notification-text="hello"><d2l-dropdown-content>content</d2l-dropdown-content></d2l-navigation-dropdown-button-icon>`);
				await expect(el).to.be.accessible();
			});

		});

		describe('constructor', () => {
			it('should construct', () => {
				runConstructor('d2l-navigation-dropdown-button-icon');
			});
		});

	});

	describe('d2l-navigation-dropdown-button-custom', () => {

		describe('accessibility', () => {
			it('should pass all aXe tests', async() => {
				const el = await fixture(html`<d2l-navigation-dropdown-button-custom><span slot="opener">text</span><d2l-dropdown-content>content</d2l-dropdown-content></d2l-navigation-dropdown-button-custom>`);
				await expect(el).to.be.accessible();
			});
		});

		describe('constructor', () => {
			it('should construct', () => {
				runConstructor('d2l-navigation-dropdown-button-custom');
			});
		});

	});

	describe('d2l-navigation-button-icon', () => {

		describe('accessibility', () => {

			it('default', async() => {
				const el = await fixture(html`<d2l-navigation-button-icon icon="tier3:gear" text="test"></d2l-navigation-button-icon>`);
				await expect(el).to.be.accessible();
			});

			it('text hidden', async() => {
				const el = await fixture(html`<d2l-navigation-button-icon icon="tier3:gear" text="test" text-hidden></d2l-navigation-button-icon>`);
				await expect(el).to.be.accessible();
			});

			it('disabled', async() => {
				const el = await fixture(html`<d2l-navigation-button-icon icon="tier3:gear" text="test" disabled></d2l-navigation-button-icon>`);
				await expect(el).to.be.accessible();
			});

			it('focused', async() => {
				const el = await fixture(html`<d2l-navigation-button-icon icon="tier3:gear" text="test"></d2l-navigation-button-icon>`);
				el.focus();
				const activeElem = getComposedActiveElement();
				expect(activeElem).to.equal(el.shadowRoot.querySelector('button'));
				await expect(el).to.be.accessible();
			});

		});

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

});
