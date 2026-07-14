import '../../../src/components/wizard/wizard-step.js';
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

		it('should create stepper-back event', async() => {
			const elem = await fixture(defaultFixture);
			elem.addEventListener('stepper-back', (event) => {
				expect(event.type).to.equal('stepper-back');
			});
			elem._backClick();
		});

		it('should create stepper-restart event', async() => {
			const elem = await fixture(defaultFixture);
			elem.addEventListener('stepper-restart', (event) => {
				expect(event.type).to.equal('stepper-restart');
			});
			elem._restartClick();
		});
	});

	describe('back button', () => {
		it('should not render by default', async() => {
			const elem = await fixture(defaultFixture);
			const buttons = elem.shadowRoot.querySelectorAll('d2l-button');

			expect(buttons.length).to.equal(2);
		});

		it('should render when display-back-button is set', async() => {
			const elem = await fixture(html`<d2l-labs-wizard-step display-back-button back-button-title="Previous" back-button-tooltip="Go to previous step"></d2l-labs-wizard-step>`);
			const buttons = elem.shadowRoot.querySelectorAll('d2l-button');
			const backButton = buttons[1];

			expect(buttons.length).to.equal(3);
			expect(backButton.title).to.equal('Go to previous step');
			expect(backButton.textContent.trim()).to.equal('Previous');
		});
	});

});
