import '../../../src/components/wizard/wizard.js';
import '../../../src/components/wizard/wizard-step.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const defaultFixture = html`
<d2l-labs-wizard></d2l-labs-wizard>
`;

const populatedFixture = html`
<d2l-labs-wizard selected-step="1">
	<d2l-labs-wizard-step step-title="First"></d2l-labs-wizard-step>
	<d2l-labs-wizard-step step-title="Second"></d2l-labs-wizard-step>
	<d2l-labs-wizard-step step-title="Third"></d2l-labs-wizard-step>
</d2l-labs-wizard>
`;

describe('d2l-labs-wizard', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(defaultFixture);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-wizard');
		});
	});

	describe('basic', () => {
		it('should instantiate the element', async() => {
			const elem = await fixture(defaultFixture);
			expect(elem.localName).to.equal('d2l-labs-wizard');
		});
	});

	describe('back', () => {
		it('should move to the previous step', async() => {
			const elem = await fixture(populatedFixture);

			elem.back();

			expect(elem.currentStep()).to.equal(0);
		});

		it('should not move before the first step', async() => {
			const elem = await fixture(populatedFixture);

			elem.back();
			elem.back();

			expect(elem.currentStep()).to.equal(0);
		});
	});

});
