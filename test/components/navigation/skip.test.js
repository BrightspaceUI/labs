import '../d2l-navigation-skip.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';
import { createMessage } from '@brightspace-ui/core/mixins/property-required/property-required-mixin.js';
import { getComposedActiveElement } from '@brightspace-ui/core/helpers/focus.js';

const customFixture = html`<d2l-navigation-skip text="Skip to custom place"></d2l-navigation-skip>`;

describe('d2l-navigation-skip', () => {

	it('should throw if text is not provided', async() => {
		const elem = await fixture(html`<d2l-navigation-skip><d2l-navigation-skip>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createMessage(elem, 'text'));
	});

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const elem = await fixture(customFixture);
			await focusElem(elem);
			await expect(elem).to.be.accessible();
		});

	});

	describe('events', () => {

		let elem, anchor;
		beforeEach(async() => {
			elem = await fixture(customFixture);
			anchor = elem.shadowRoot.querySelector('a');
		});

		it('should fire click event when clicked with mouse', async() => {
			const p = oneEvent(elem, 'click');
			await focusElem(anchor);
			clickElem(anchor);
			await p;
		});

		it('should fire click event when ENTER is pressed', async() => {
			const p = oneEvent(elem, 'click');
			sendKeysElem(anchor, 'press', 'Enter');
			await p;
		});

		it('should delegate focus to anchor', async() => {
			await focusElem(elem);
			expect(getComposedActiveElement()).to.equal(anchor);
		});

	});

});
