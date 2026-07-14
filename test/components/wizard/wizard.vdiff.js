import '../../../src/components/wizard/wizard.js';
import '../../../src/components/wizard/wizard-step.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const wizardFixture = html`
<d2l-labs-wizard selected-step="1">
	<d2l-labs-wizard-step step-title="Get Started" hide-restart-button>
		<p>First Step</p>
	</d2l-labs-wizard-step>
	<d2l-labs-wizard-step step-title="Add Details" display-back-button back-button-title="Back" back-button-tooltip="Return to the previous step">
		<p>Second Step</p>
	</d2l-labs-wizard-step>
	<d2l-labs-wizard-step step-title="Review" display-back-button next-button-title="Done">
		<p>Last Step</p>
	</d2l-labs-wizard-step>
</d2l-labs-wizard>
`;

describe('d2l-labs-wizard', () => {
	it('should render progress and back button layout', async() => {
		const elem = await fixture(wizardFixture);

		await expect(elem).to.be.golden();
	});
});
