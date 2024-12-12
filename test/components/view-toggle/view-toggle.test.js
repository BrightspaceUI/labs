import '../../../src/components/view-toggle/view-toggle.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const basicFixture = html`<d2l-labs-view-toggle
toggle-options='[{"text":"Bananas","val":"overall"},{"text":"Minions","val":"minios"},{"text":"Pyjamas","val":"subject"}]'
text="Toggle: "></d2l-labs-view-toggle>`;

describe('d2l-labs-view-toggle', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-view-toggle');
		});
	});

	describe('events', () => {
		it('should fire toggle changed event when the button is clicked', async() => {
			const el = await fixture(basicFixture);
			clickElem(el.shadowRoot.querySelector('button[data-option-val=subject]'));
			const e = await oneEvent(el, 'd2l-labs-view-toggle-changed');
			expect(e.detail.view).to.equal('subject');
		});
	});

});
