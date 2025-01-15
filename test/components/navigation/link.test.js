import '../d2l-navigation-link.js';
import '../d2l-navigation-link-back.js';
import '../d2l-navigation-link-icon.js';
import '../d2l-navigation-link-image.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '@brightspace-ui/core/helpers/focus.js';

describe('Links', () => {

	describe('d2l-navigation-link', () => {

		describe('accessibility', () => {

			it('default', async() => {
				const el = await fixture(html`<d2l-navigation-link href="https://www.d2l.com" text="D2L">D2L</d2l-navigation-link>`);
				await expect(el).to.be.accessible();
			});

			it('focused', async() => {
				const el = await fixture(html`<d2l-navigation-link href="https://www.d2l.com" text="D2L">D2L</d2l-navigation-link>`);
				setTimeout(() => el.shadowRoot.querySelector('a').focus());
				await oneEvent(el, 'focus');
				await expect(el).to.be.accessible();
			});

		});

		describe('constructor', () => {
			it('should construct', () => {
				runConstructor('d2l-navigation-link');
			});
		});

	});

	describe('d2l-navigation-link-back', () => {

		describe('accessibility', () => {
			it('should pass all aXe tests', async() => {
				const el = await fixture(html`<d2l-navigation-link-back href="https://www.d2l.com" text="D2L">D2L</d2l-navigation-link-back>`);
				await expect(el).to.be.accessible();
			});
		});

		describe('constructor', () => {
			it('should construct', () => {
				runConstructor('d2l-navigation-link-back');
			});
		});

	});

	describe('d2l-navigation-link-icon', () => {

		describe('accessibility', () => {

			it('default', async() => {
				const el = await fixture(html`<d2l-navigation-link-icon href="https:/www.d2l.com" icon="tier3:gear" text="D2L"></d2l-navigation-link-icon>`);
				await expect(el).to.be.accessible();
			});

			it('text hidden', async() => {
				const el = await fixture(html`<d2l-navigation-link-icon href="https:/www.d2l.com" icon="tier3:gear" text="D2L" text-hidden></d2l-navigation-link-icon>`);
				await expect(el).to.be.accessible();
			});

			it('focused', async() => {
				const el = await fixture(html`<d2l-navigation-link-icon href="https:/www.d2l.com" icon="tier3:gear" text="D2L"></d2l-navigation-link-icon>`);
				el.focus();
				const activeElem = getComposedActiveElement();
				expect(activeElem).to.equal(el.shadowRoot.querySelector('a'));
				await expect(el).to.be.accessible();
			});

		});

		describe('constructor', () => {
			it('should construct', () => {
				runConstructor('d2l-navigation-link-icon');
			});
		});

	});

	describe('d2l-navigation-link-image', () => {

		describe('accessibility', () => {

			it('default', async() => {
				const el = await fixture(html`<d2l-navigation-link-image src="../demo/logo-image.png" href="https:/www.d2l.com" text="D2L"></d2l-navigation-link-image>`);
				await expect(el).to.be.accessible();
			});

			it('no href', async() => {
				const el = await fixture(html`<d2l-navigation-link-image src="../demo/logo-image.png" text="D2L"></d2l-navigation-link-image>`);
				await expect(el).to.be.accessible();
			});

		});

		describe('constructor', () => {
			it('should construct', () => {
				runConstructor('d2l-navigation-link-image');
			});
		});

	});

});
