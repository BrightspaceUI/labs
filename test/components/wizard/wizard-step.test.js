import '../../../src/components/wizard/wizard-step.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const defaultFixture = html`
<d2l-labs-wizard-step></d2l-labs-wizard-step>
`;

describe('d2l-labs-wizard-step', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const elem = await fixture(defaultFixture);
			await expect(elem).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-wizard-step');
		});
	});

	describe('basic', () => {
		it('should instantiate the element', async() => {
			const elem = await fixture(defaultFixture);
			expect(elem.localName).to.equal('d2l-labs-wizard-step');
		});
	});

	describe('event', () => {

		it('dispatches stepper-next event when next button clicked', async() => {
			const elem = await fixture(defaultFixture);

			clickElem(elem.shadowRoot.querySelector('.d2l-labs-wizard-step-button-next'));
			await oneEvent(elem, 'stepper-next');
		});

		it('dispatches stepper-back event when back button clicked', async() => {
			const elem = await fixture(html`<d2l-labs-wizard-step display-back-button></d2l-labs-wizard-step>`);

			clickElem(elem.shadowRoot.querySelector('d2l-button'));
			await oneEvent(elem, 'stepper-back');
		});

		it('dispatches stepper-restart event when restart button clicked', async() => {
			const elem = await fixture(defaultFixture);

			clickElem(elem.shadowRoot.querySelector('d2l-button'));
			await oneEvent(elem, 'stepper-restart');
		});
	});

});
