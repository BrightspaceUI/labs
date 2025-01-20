import '../../../src/components/navigation/navigation-dropdown-button-icon.js';
import '../../../src/components/navigation/navigation-dropdown-button-custom.js';
import '../../../src/components/navigation/navigation-button-icon.js';
import '../../../src/components/navigation/navigation-notification-icon.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '@brightspace-ui/core/helpers/focus.js';

describe('d2l-labs-navigation-dropdown-button-icon', () => {

	describe('accessibility', () => {

		it('default', async() => {
			const el = await fixture(html`<d2l-labs-navigation-dropdown-button-icon icon="tier3:notification-bell" text="test"><d2l-dropdown-content>content</d2l-dropdown-content></d2l-labs-navigation-dropdown-button-icon>`);
			await expect(el).to.be.accessible();
		});

		it('disabled', async() => {
			const el = await fixture(html`<d2l-labs-navigation-dropdown-button-icon icon="tier3:notification-bell" text="test" disabled><d2l-dropdown-content>content</d2l-dropdown-content></d2l-labs-navigation-dropdown-button-icon>`);
			await expect(el).to.be.accessible();
		});

		it('with notification', async() => {
			const el = await fixture(html`<d2l-labs-navigation-dropdown-button-icon icon="tier3:notification-bell" text="test" has-notification notification-text="hello"><d2l-dropdown-content>content</d2l-dropdown-content></d2l-labs-navigation-dropdown-button-icon>`);
			await expect(el).to.be.accessible();
		});

	});

});

describe('d2l-labs-navigation-dropdown-button-custom', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-navigation-dropdown-button-custom><span slot="opener">text</span><d2l-dropdown-content>content</d2l-dropdown-content></d2l-labs-navigation-dropdown-button-custom>`);
			await expect(el).to.be.accessible();
		});
	});

});

describe('d2l-labs-navigation-button-icon', () => {

	describe('accessibility', () => {

		it('default', async() => {
			const el = await fixture(html`<d2l-labs-navigation-button-icon icon="tier3:gear" text="test"></d2l-labs-navigation-button-icon>`);
			await expect(el).to.be.accessible();
		});

		it('text hidden', async() => {
			const el = await fixture(html`<d2l-labs-navigation-button-icon icon="tier3:gear" text="test" text-hidden></d2l-labs-navigation-button-icon>`);
			await expect(el).to.be.accessible();
		});

		it('disabled', async() => {
			const el = await fixture(html`<d2l-labs-navigation-button-icon icon="tier3:gear" text="test" disabled></d2l-labs-navigation-button-icon>`);
			await expect(el).to.be.accessible();
		});

		it('focused', async() => {
			const el = await fixture(html`<d2l-labs-navigation-button-icon icon="tier3:gear" text="test"></d2l-labs-navigation-button-icon>`);
			el.focus();
			const activeElem = getComposedActiveElement();
			expect(activeElem).to.equal(el.shadowRoot.querySelector('button'));
			await expect(el).to.be.accessible();
		});

	});

});

describe('d2l-labs-navigation-notification-icon', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-navigation-notification-icon></d2l-labs-navigation-notification-icon>`);
			await expect(el).to.be.accessible();
		});
	});;
});
