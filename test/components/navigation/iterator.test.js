import '../components/d2l-navigation-iterator/d2l-navigation-iterator.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-navigation-iterator', () => {

	const iteratorFixture = html`<d2l-navigation-iterator></d2l-navigation-iterator>`;

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const el = await fixture(iteratorFixture);
			await expect(el).to.be.accessible();
		});

	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-iterator');
		});
	});

	describe('events', () => {

		it('should dispatch "previous-click" event when previous clicked', async() => {
			const el = await fixture(iteratorFixture);
			setTimeout(() => el.shadowRoot.querySelector('d2l-navigation-button-icon[icon-position="start"]').click());
			await oneEvent(el, 'previous-click');
		});

		it('should dispatch "next-click" event when next clicked', async() => {
			const el = await fixture(iteratorFixture);
			setTimeout(() => el.shadowRoot.querySelector('d2l-navigation-button-icon[icon-position="end"]').click());
			await oneEvent(el, 'next-click');
		});

		it('should NOT dispatch "previous-click" event when disabled previous clicked', async() => {
			const el = await fixture(html`<d2l-navigation-iterator previous-disabled></d2l-navigation-iterator>`);
			el.addEventListener('previous-click', () => {
				throw new Error('previous-click dispatched on disabled item');
			});
			el.shadowRoot.querySelector('d2l-navigation-button-icon[icon-position="start"]').click();
		});

		it('should NOT dispatch "next-click" event when disabled next clicked', async() => {
			const el = await fixture(html`<d2l-navigation-iterator next-disabled></d2l-navigation-iterator>`);
			el.addEventListener('next-click', () => {
				throw new Error('next-click dispatched on disabled item');
			});
			el.shadowRoot.querySelector('d2l-navigation-button-icon[icon-position="end"]').click();
		});

	});

});
