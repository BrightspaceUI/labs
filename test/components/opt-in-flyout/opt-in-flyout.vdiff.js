import '../../../src/components/opt-in-flyout/flyout-impl.js';
import '../../../src/components/opt-in-flyout/opt-in-flyout.js';
import '../../../src/components/opt-in-flyout/opt-out-flyout.js';
import { expect, fixture, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';

const opts = { viewport: { height: 450 } };

describe('flyout-impl', () => {

	it('closed', async() => {
		await fixture(html`
			<d2l-labs-opt-in-flyout-impl flyout-title="Flyout Impl">
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		await expect(document).to.be.golden();
	});

	it('closed-focus', async() => {
		const elem = await fixture(html`
			<d2l-labs-opt-in-flyout-impl flyout-title="Flyout Impl" opened>
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		const tabButton = elem.shadowRoot.querySelector('#flyout-tab');
		sendKeysElem(tabButton, 'press', 'Enter');
		await oneEvent(elem, 'flyout-closed');
		await expect(document).to.be.golden();
	});

	it('opened', async() => {
		await fixture(html`
			<d2l-labs-opt-in-flyout-impl flyout-title="Flyout Impl" opened>
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		await expect(document).to.be.golden();
	});

	it('opened-focus', async() => {
		const elem = await fixture(html`
			<d2l-labs-opt-in-flyout-impl flyout-title="Flyout Impl">
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		const tabButton = elem.shadowRoot.querySelector('#flyout-tab');
		sendKeysElem(tabButton, 'press', 'Enter');
		await oneEvent(elem, 'flyout-opened');
		await expect(document).to.be.golden();
	});

	it('short description only', async() => {
		await fixture(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				opened
				short-description="short description">
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		await expect(document).to.be.golden();
	});

	it('long description only', async() => {
		await fixture(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				opened
				long-description="long description">
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		await expect(document).to.be.golden();
	});

	it('short and long description', async() => {
		await fixture(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				opened
				long-description="long description"
				short-description="short description">
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		await expect(document).to.be.golden();
	});

	it('tutorial link only', async() => {
		await fixture(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				opened
				tutorial-link="https://www.d2l.com">
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		await expect(document).to.be.golden();
	});

	it('help-docs link only', async() => {
		await fixture(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				help-docs-link="https://www.d2l.com"
				opened>
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		await expect(document).to.be.golden();
	});

	it('tutorial and help-docs links', async() => {
		await fixture(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				help-docs-link="https://www.d2l.com"
				opened
				tutorial-link="https://www.d2l.com">
			</d2l-labs-opt-in-flyout-impl>
		`, opts);
		await expect(document).to.be.golden();
	});

});

describe('opt-in-flyout', () => {

	it('opened', async() => {
		await fixture(html`
			<d2l-labs-opt-in-flyout
				flyout-title="Opt-In Flyout"
				opened>
			</d2l-labs-opt-in-flyout>
		`, opts);
		await expect(document).to.be.golden();
	});

});

describe('opt-out-flyout', () => {

	it('opened', async() => {
		await fixture(html`
			<d2l-labs-opt-out-flyout flyout-title="Opt-Out Flyout" opened>
			</d2l-labs-opt-out-flyout>
		`, opts);
		await expect(document).to.be.golden();
	});

	it('opted out', async() => {
		const elem = await fixture(html`
			<d2l-labs-opt-out-flyout flyout-title="Opt-Out Flyout" opened>
			</d2l-labs-opt-out-flyout>
		`, opts);
		const optOutButton = elem.shadowRoot.querySelector('d2l-labs-opt-in-flyout-impl')
			.shadowRoot.querySelector('#opt-out-button');
		await sendKeysElem(optOutButton, 'press', 'Enter');
		await expect(document).to.be.golden();
	});

});
