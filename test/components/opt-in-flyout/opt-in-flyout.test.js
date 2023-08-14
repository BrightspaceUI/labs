import '../../../src/components/opt-in-flyout/flyout-impl.js';
import { clickElem, fixture, html, oneEvent } from '@brightspace-ui/testing';

const closedFixture = html`
	<d2l-labs-opt-in-flyout-impl flyout-title="Opt-In Flyout">
	</d2l-labs-opt-in-flyout-impl>
`;

const openedFixture = html`
	<d2l-labs-opt-in-flyout-impl flyout-title="Opt-In Flyout" opened>
	</d2l-labs-opt-in-flyout-impl>
`;

async function clickTabButton(elem) {
	const button = elem.shadowRoot.querySelector('#flyout-tab');
	return clickElem(button);
}

async function clickOptInButton(elem) {
	const button = elem.shadowRoot.querySelector('#primary-button');
	return clickElem(button);
}

async function clickOptOutButton(elem) {
	const button = elem.shadowRoot.querySelector('#opt-out-button');
	return clickElem(button);
}

describe('opt-in-flyout', () => {

	describe('events', () => {

		it('should dispatch "opt-in" event when "opt-in" button is clicked', async() => {
			const elem = await fixture(openedFixture);
			clickOptInButton(elem);
			await oneEvent(elem, 'opt-in');
		});

		it('should dispatch "flyout-closed" event when "opt-in" button is clicked', async() => {
			const elem = await fixture(openedFixture);
			clickOptInButton(elem);
			await oneEvent(elem, 'flyout-closed');
		});

		it('should dispatch "opt-out" event when "opt-out" button is clicked', async() => {
			const elem = await fixture(openedFixture);
			clickOptOutButton(elem);
			await oneEvent(elem, 'opt-out');
		});

		it('should dispatch "flyout-closed" event when "opt-out" button is clicked', async() => {
			const elem = await fixture(openedFixture);
			clickOptOutButton(elem);
			await oneEvent(elem, 'flyout-closed');
		});

		it('should dispatch "flyout-closed" event when "tab button" is clicked and flyout is open', async() => {
			const elem = await fixture(openedFixture);
			clickTabButton(elem);
			await oneEvent(elem, 'flyout-closed');
		});

		it('should dispatch "flyout-opened" event when "tab button" clicked and flyout is closed', async() => {
			const elem = await fixture(closedFixture);
			clickTabButton(elem);
			await oneEvent(elem, 'flyout-opened');
		});

	});

});
