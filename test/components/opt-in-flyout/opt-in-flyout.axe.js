import '../../../src/components/opt-in-flyout/flyout-impl.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const closedFixture = html`
	<d2l-labs-opt-in-flyout-impl flyout-title="Opt-In Flyout">
	</d2l-labs-opt-in-flyout-impl>
`;

const openedFixture = html`
	<d2l-labs-opt-in-flyout-impl flyout-title="Opt-In Flyout" opened>
	</d2l-labs-opt-in-flyout-impl>
`;

describe('opt-in-flyout', () => {

	describe('accessibility', () => {

		it('closed', async() => {
			const elem = await fixture(closedFixture);
			await expect(elem).to.be.accessible();
		});

		it('opened', async() => {
			const elem = await fixture(openedFixture);
			await expect(elem).to.be.accessible();
		});

	});

});
