import '../../../src/components/wizard/step.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
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

		it('should create stepper-next event', async() => {
			const elem = await fixture(defaultFixture);
			elem.addEventListener('stepper-next', (event) => {
				expect(event.type).to.equal('stepper-next');
			});
			elem._nextClick();
		});

		it('should create stepper-restart event', async() => {
			const elem = await fixture(defaultFixture);
			elem.addEventListener('stepper-restart', (event) => {
				expect(event.type).to.equal('stepper-restart');
			});
			elem._restartClick();
		});
	});

});
